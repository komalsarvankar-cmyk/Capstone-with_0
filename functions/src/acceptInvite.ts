import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from './admin';

/**
 * Callable Cloud Function that accepts a friend invite (U4, KTD9).
 * connectedFriendUid must never be settable by a direct client write (see
 * firestore.rules), so this transaction runs with the Admin SDK, which
 * bypasses security rules, instead of as a client-side transaction.
 */
export const acceptInvite = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in to accept an invite.');
  }
  const uid = request.auth.uid;
  const inviteId = request.data?.inviteId;
  if (typeof inviteId !== 'string' || !inviteId) {
    throw new HttpsError('invalid-argument', 'An invite id is required.');
  }

  const friendUid = await db.runTransaction(async (transaction) => {
    const inviteRef = db.collection('invites').doc(inviteId);
    const inviteSnap = await transaction.get(inviteRef);
    if (!inviteSnap.exists || inviteSnap.data()?.status !== 'pending') {
      throw new HttpsError('failed-precondition', 'This invite has already been used.');
    }
    const invite = inviteSnap.data();
    const fromUid = invite?.fromUid as string;
    if (fromUid === uid) {
      throw new HttpsError('failed-precondition', 'You cannot accept your own invite.');
    }
    // Targeted requests (from contacts matching) may only be accepted by
    // the addressed user; open share-link invites (no toUid) may be
    // accepted by whoever holds the link, per the original invite design.
    if (invite?.toUid && invite.toUid !== uid) {
      throw new HttpsError('permission-denied', 'This request was not sent to you.');
    }

    const selfRef = db.collection('users').doc(uid);
    const selfSnap = await transaction.get(selfRef);
    if (selfSnap.exists && selfSnap.data()?.connectedFriendUid) {
      throw new HttpsError('failed-precondition', 'You are already connected with a friend.');
    }

    const fromRef = db.collection('users').doc(fromUid);
    transaction.update(inviteRef, { status: 'accepted' });
    transaction.set(selfRef, { connectedFriendUid: fromUid }, { merge: true });
    transaction.set(fromRef, { connectedFriendUid: uid }, { merge: true });
    return fromUid;
  });

  const friendSnap = await db.collection('users').doc(friendUid).get();
  return { friendUid, friendDisplayName: friendSnap.data()?.displayName ?? '' };
});
