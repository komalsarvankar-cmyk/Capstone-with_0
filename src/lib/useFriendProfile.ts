import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/** Live-subscribes to the connected friend's display name, given their uid. */
export function useFriendProfile(friendUid: string | undefined): string | undefined {
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!friendUid) return undefined;
    return onSnapshot(doc(db, 'users', friendUid), (snapshot) => {
      setDisplayName(snapshot.data()?.displayName);
    });
  }, [friendUid]);

  return displayName;
}
