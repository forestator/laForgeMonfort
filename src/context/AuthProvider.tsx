import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { signInWithGoogle, signOutUser } from '../lib/auth';
import { auth } from '../lib/firebase';
import { AuthContext } from './AuthContext';

const CANCELLED_CODES = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(
    () =>
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      }),
    [],
  );

  const signIn = useCallback(async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (failure) {
      const cancelled = failure instanceof FirebaseError && CANCELLED_CODES.includes(failure.code);
      if (!cancelled) setError('Connexion impossible. Réessayez.');
    }
  }, []);

  const signOut = useCallback(async () => {
    setError('');
    try {
      await signOutUser();
    } catch {
      setError('Déconnexion impossible. Réessayez.');
    }
  }, []);

  const state = useMemo(
    () => ({ user, loading, error, signIn, signOut }),
    [user, loading, error, signIn, signOut],
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
