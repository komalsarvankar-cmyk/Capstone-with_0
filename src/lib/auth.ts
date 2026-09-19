import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserDoc } from '@/types';

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

async function ensureUserDoc(uid: string, displayName: string) {
  const ref = doc(db, 'users', uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    const userDoc: UserDoc = { uid, displayName };
    await setDoc(ref, userDoc);
  }
}

export async function signUp(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(credential.user.uid, email.split('@')[0]);
  return credential.user;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
