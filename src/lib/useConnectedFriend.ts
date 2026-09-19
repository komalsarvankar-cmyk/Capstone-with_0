import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/** Live-subscribes to the current user's connectedFriendUid (R5, KTD4). */
export function useConnectedFriend(): string | undefined {
  const [friendUid, setFriendUid] = useState<string | undefined>(undefined);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snapshot) => {
      setFriendUid(snapshot.data()?.connectedFriendUid);
    });
    return unsubscribe;
  }, []);

  return friendUid;
}
