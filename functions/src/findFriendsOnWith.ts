import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from './admin';

const MAX_PHONES_PER_QUERY = 30; // Firestore 'in' query limit

export interface FriendMatch {
  phoneKey: string;
  uid: string;
  displayName: string;
}

/**
 * Matches the caller's phone contacts against registered With users, added
 * on request to replace the original prototype's hardcoded contact list
 * with real contact-based discovery. Runs server-side (Admin SDK) so the
 * client never queries other users' phone numbers directly -- only exact
 * matches for numbers the caller already has in their own contacts come
 * back, never the full users collection.
 */
export const findFriendsOnWith = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in to find friends.');
  }

  const phoneKeysInput = Array.isArray(request.data?.phoneKeys) ? (request.data.phoneKeys as unknown[]) : [];
  const phoneKeys = [...new Set(phoneKeysInput.filter((key): key is string => typeof key === 'string' && key.length > 0))];
  if (phoneKeys.length === 0) return { matches: [] };

  const matches: FriendMatch[] = [];
  for (let i = 0; i < phoneKeys.length; i += MAX_PHONES_PER_QUERY) {
    const batch = phoneKeys.slice(i, i + MAX_PHONES_PER_QUERY);
    const snapshot = await db.collection('users').where('phoneKey', 'in', batch).get();
    for (const docSnap of snapshot.docs) {
      if (docSnap.id === request.auth.uid) continue; // never match yourself
      const data = docSnap.data();
      matches.push({ phoneKey: data.phoneKey, uid: docSnap.id, displayName: data.displayName ?? 'With user' });
    }
  }

  return { matches };
});
