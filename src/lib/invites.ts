import { addDoc, collection, doc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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

/**
 * Accepts an invite as a single transaction (KTD9): checks the invite is
 * still pending, marks it accepted, and links both users' connectedFriendUid.
 */
export async function acceptInvite(inviteId: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to accept an invite.');

  await runTransaction(db, async (transaction) => {
    const inviteRef = doc(db, 'invites', inviteId);
    const inviteSnap = await transaction.get(inviteRef);
    if (!inviteSnap.exists() || inviteSnap.data().status !== 'pending') {
      throw new Error('This invite has already been used.');
    }
    const fromUid = inviteSnap.data().fromUid as string;
    if (fromUid === uid) {
      throw new Error('You cannot accept your own invite.');
    }

    const selfRef = doc(db, 'users', uid);
    const fromRef = doc(db, 'users', fromUid);
    const selfSnap = await transaction.get(selfRef);
    if (selfSnap.exists() && selfSnap.data().connectedFriendUid) {
      throw new Error('You are already connected with a friend.');
    }

    transaction.update(inviteRef, { status: 'accepted' });
    transaction.set(selfRef, { connectedFriendUid: fromUid }, { merge: true });
    transaction.set(fromRef, { connectedFriendUid: uid }, { merge: true });
  });
}

export async function getInvite(inviteId: string) {
  const snap = await getDoc(doc(db, 'invites', inviteId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
