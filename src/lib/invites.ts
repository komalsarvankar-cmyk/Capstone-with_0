import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app, db } from '@/lib/firebase';
import { normalizePhoneKey } from '@/lib/phone';

export interface IncomingRequest {
  id: string;
  fromUid: string;
  fromDisplayName: string;
}

/**
 * Sends a targeted friend request to a specific uid (found via contacts
 * matching). Only that uid may accept it (enforced by acceptInvite and
 * firestore.rules' toUid check).
 */
export async function sendFriendRequest(toUid: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to send a friend request.');
  await addDoc(collection(db, 'invites'), {
    fromUid: uid,
    toUid,
    status: 'pending',
    createdAt: serverTimestamp(),
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

export interface RecentContact {
  toUid: string;
  displayName: string;
  status: 'pending' | 'accepted';
}

/**
 * Live-watches people the signed-in user has previously sent a friend
 * request to (most recent first), so returning to Connect Friend doesn't
 * require re-scanning contacts every time. Deduplicated by recipient,
 * keeping only the most recent request per person.
 */
export function watchRecentContacts(uid: string, callback: (contacts: RecentContact[]) => void): Unsubscribe {
  const sentQuery = query(collection(db, 'invites'), where('fromUid', '==', uid), orderBy('createdAt', 'desc'));
  return onSnapshot(sentQuery, async (snapshot) => {
    const seen = new Set<string>();
    const deduped: { toUid: string; status: 'pending' | 'accepted' }[] = [];
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const toUid = data.toUid as string | undefined;
      if (!toUid || seen.has(toUid)) continue;
      seen.add(toUid);
      deduped.push({ toUid, status: data.status === 'accepted' ? 'accepted' : 'pending' });
    }
    const contacts = await Promise.all(
      deduped.slice(0, 10).map(async (entry) => {
        const toSnap = await getDoc(doc(db, 'users', entry.toUid));
        return { ...entry, displayName: toSnap.data()?.displayName ?? 'With user' };
      }),
    );
    callback(contacts);
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
