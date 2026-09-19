import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc, where, type Unsubscribe } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app, db } from '@/lib/firebase';
import { normalizePhoneKey } from '@/lib/phone';

function randomCode(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

/** Creates an open `invites/{inviteId}` doc and returns a shareable deep link (U4). */
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

export interface IncomingRequest {
  id: string;
  fromUid: string;
  fromDisplayName: string;
}

/**
 * Sends a targeted friend request to a specific uid (found via contacts
 * matching). Unlike createInvite's open link, only that uid may accept it
 * (enforced by acceptInvite and firestore.rules' toUid check).
 */
export async function sendFriendRequest(toUid: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to send a friend request.');
  await addDoc(collection(db, 'invites'), {
    fromUid: uid,
    toUid,
    status: 'pending',
  });
}

/** Live-watches friend requests addressed to the signed-in user, joined with the sender's name. */
export function watchIncomingRequests(uid: string, callback: (requests: IncomingRequest[]) => void): Unsubscribe {
  const requestsQuery = query(collection(db, 'invites'), where('toUid', '==', uid), where('status', '==', 'pending'));
  return onSnapshot(requestsQuery, async (snapshot) => {
    const requests = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const fromUid = docSnap.data().fromUid as string;
        const fromSnap = await getDoc(doc(db, 'users', fromUid));
        return { id: docSnap.id, fromUid, fromDisplayName: fromSnap.data()?.displayName ?? 'Someone' };
      }),
    );
    callback(requests);
  });
}

/** Saves the signed-in user's own phone number, so contacts matching can find them (U4). */
export async function savePhoneNumber(rawPhone: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to save a phone number.');
  const phoneKey = normalizePhoneKey(rawPhone);
  if (!phoneKey) throw new Error('That phone number does not look valid.');
  await updateDoc(doc(db, 'users', uid), { phone: rawPhone, phoneKey });
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
