import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const signInWithGoogle = async () => {
  if (!Capacitor.isNativePlatform()) {
    await signInWithPopup(auth, new GoogleAuthProvider());
    return;
  }
  // Popups do not work in the Android WebView, so use the native Google flow.
  const result = await FirebaseAuthentication.signInWithGoogle();
  const credential = GoogleAuthProvider.credential(result.credential?.idToken);
  await signInWithCredential(auth, credential);
};

export const signOutUser = async () => {
  if (Capacitor.isNativePlatform()) {
    await FirebaseAuthentication.signOut();
  }
  await signOut(auth);
};
