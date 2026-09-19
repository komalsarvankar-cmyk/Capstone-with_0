import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app, db } from '@/lib/firebase';

function randomCode(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

/** Creates an `invites/{inviteId}` doc and returns a shareable deep link (U4). */
export async function createInvite(): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to invite a friend.');

  const code = randomCode();
  const ref = await addDoc(collection(db, 'invites'), {
    fromUid: uid,
    code,
    status: 'pending',
  });
  return `withapp://invite/${ref.id}`;
}

export interface AcceptInviteResult {
  friendUid: string;
  friendDisplayName: string;
}

/**
 * Accepts an invite via the acceptInvite callable Cloud Function (U4,
 * KTD9). Runs server-side (Admin SDK) rather than as a client transaction,
 * because firestore.rules flatly denies any client write to
 * connectedFriendUid -- a client-executed transaction would be
 * indistinguishable from a malicious direct write under those rules.
 */
export async function acceptInvite(inviteId: string): Promise<AcceptInviteResult> {
  const functions = getFunctions(app);
  const callable = httpsCallable<{ inviteId: string }, AcceptInviteResult>(functions, 'acceptInvite');
  const result = await callable({ inviteId });
  return result.data;
}

export async function getInvite(inviteId: string) {
  const snap = await getDoc(doc(db, 'invites', inviteId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
