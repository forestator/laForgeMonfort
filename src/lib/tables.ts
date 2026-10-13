import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { expiryOf } from './dates';
import { db } from './firebase';
import { parseTable } from './parseTable';
import type { GameTable, NewGameTable, Player } from './types';
import { useToday } from './useToday';

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
export const createTable = (table: NewGameTable) =>
  addDoc(tablesCollection, { ...table, expireAt: Timestamp.fromDate(expiryOf(table.date)) });

export const deleteTable = (tableId: string) => deleteDoc(doc(db, 'tables', tableId));

export const joinTable = (tableId: string, player: Player) =>
  updateDoc(doc(db, 'tables', tableId), { players: arrayUnion(player) });

export const leaveTable = (tableId: string, player: Player) =>
  updateDoc(doc(db, 'tables', tableId), { players: arrayRemove(player) });
