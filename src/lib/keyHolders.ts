import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import type { KeyHolder, Opening } from './types';

const keyHoldersCollection = collection(db, 'keyHolders');

export const useKeyHolders = () => {
  const [holders, setHolders] = useState<KeyHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        keyHoldersCollection,
        (snapshot) => {
          setHolders(
            snapshot.docs
              .map((document): KeyHolder => {
                const { name, openDate, openTime } = document.data();
                return {
                  id: document.id,
                  name: String(name ?? ''),
                  ...(openDate && openTime && { opening: { date: openDate, time: openTime } }),
                };
              })
              .filter((holder) => holder.name !== '')
              .sort((first, second) => first.name.localeCompare(second.name, 'fr')),
          );
          setLoading(false);
        },
        () => {
          setFailed(true);
          setLoading(false);
        },
      ),
    [],
  );

  return { holders, loading, failed };
};

// One document per user (id = uid) so the rules can restrict writes to its owner.
// Merging keeps an announced opening when only the name changes.
export const takeKey = (holder: KeyHolder) =>
  setDoc(doc(db, 'keyHolders', holder.id), { name: holder.name }, { merge: true });

export const returnKey = (userId: string) => deleteDoc(doc(db, 'keyHolders', userId));

export const announceOpening = (userId: string, opening: Opening) =>
  updateDoc(doc(db, 'keyHolders', userId), { openDate: opening.date, openTime: opening.time });

export const clearOpening = (userId: string) =>
  updateDoc(doc(db, 'keyHolders', userId), { openDate: deleteField(), openTime: deleteField() });
