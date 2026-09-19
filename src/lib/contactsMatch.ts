import * as Contacts from 'expo-contacts';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { normalizePhoneKey } from '@/lib/phone';

/** Mirrors functions/src/findFriendsOnWith.ts's FriendMatch shape. */
export interface FriendMatch {
  phoneKey: string;
  uid: string;
  displayName: string;
}

/**
 * Reads the device's contacts (with permission) and returns which of them
 * are registered With users, via the findFriendsOnWith callable (U4,
 * added on request to replace the original prototype's hardcoded contact
 * list with real discovery).
 */
export async function findFriendsFromContacts(): Promise<FriendMatch[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Contacts permission is needed to find friends this way.');
  }

  const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
  const phoneKeys = new Set<string>();
  for (const contact of data) {
    for (const phoneNumber of contact.phoneNumbers ?? []) {
      const key = phoneNumber.number ? normalizePhoneKey(phoneNumber.number) : null;
      if (key) phoneKeys.add(key);
    }
  }
  if (phoneKeys.size === 0) return [];

  const functions = getFunctions(app);
  const findFriendsOnWith = httpsCallable<{ phoneKeys: string[] }, { matches: FriendMatch[] }>(
    functions,
    'findFriendsOnWith',
  );
  const result = await findFriendsOnWith({ phoneKeys: Array.from(phoneKeys) });
  return result.data.matches;
}
