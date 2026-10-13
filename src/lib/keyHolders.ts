import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import type { KeyHolder } from './types';

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
              .map((document) => ({ id: document.id, name: String(document.data().name ?? '') }))
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
export const takeKey = (holder: KeyHolder) =>
  setDoc(doc(db, 'keyHolders', holder.id), { name: holder.name });

export const returnKey = (userId: string) => deleteDoc(doc(db, 'keyHolders', userId));
