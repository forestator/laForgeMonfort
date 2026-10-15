import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { expiryOf } from './dates';
import { db } from './firebase';
import { parseTable } from './parseTable';
import type { GameTable, NewGameTable, Player } from './types';
import { useToday } from './useToday';

// Keep in sync with the players size limit in firestore.rules.
export const MAX_WAITLIST = 10;

const tablesCollection = collection(db, 'tables');

export const useUpcomingTables = () => {
  const [tables, setTables] = useState<GameTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const currentDay = useToday();

  useEffect(() => {
    const upcoming = query(tablesCollection, where('date', '>=', currentDay), orderBy('date'));
    return onSnapshot(
      upcoming,
      (snapshot) => {
        setTables(
          snapshot.docs
            .map((document) => parseTable(document.id, document.data()))
            .filter((table): table is GameTable => table !== null),
        );
        setLoading(false);
      },
      () => {
        setFailed(true);
        setLoading(false);
      },
    );
  }, [currentDay]);

  return { tables, loading, failed };
};

// expireAt feeds the Firestore TTL policy that deletes old tables.
// One batch keeps a recurrence all-or-nothing instead of leaving a half-created series.
export const createTables = (tables: NewGameTable[]) => {
  const batch = writeBatch(db);
  for (const table of tables) {
    batch.set(doc(tablesCollection), {
      ...table,
      expireAt: Timestamp.fromDate(expiryOf(table.date)),
    });
  }
  return batch.commit();
};

export const deleteTable = (tableId: string) => deleteDoc(doc(db, 'tables', tableId));

export const joinTable = (tableId: string, player: Player) =>
  updateDoc(doc(db, 'tables', tableId), { players: arrayUnion(player) });

export const leaveTable = (tableId: string, player: Player) =>
  updateDoc(doc(db, 'tables', tableId), { players: arrayRemove(player) });

export const deleteSeriesFrom = async (seriesId: string, fromDate: string) => {
  const snapshot = await getDocs(query(tablesCollection, where('seriesId', '==', seriesId)));
  const batch = writeBatch(db);
  for (const document of snapshot.docs) {
    if (document.data().date >= fromDate) batch.delete(document.ref);
  }
  return batch.commit();
};
