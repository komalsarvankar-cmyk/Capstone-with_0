import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserDoc } from '@/types';

/** Live-subscribes to the signed-in user's own Firestore doc. */
export function useOwnProfile(): UserDoc | undefined {
  const [profile, setProfile] = useState<UserDoc | undefined>(undefined);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;
    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      setProfile(snapshot.data() as UserDoc | undefined);
    });
  }, []);

  return profile;
}
