import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return credential.user;
}

export async function signUpWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  return credential.user;
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(getFirebaseAuth(), googleProvider);
  return credential.user;
}

export async function logOut() {
  await signOut(getFirebaseAuth());
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}
