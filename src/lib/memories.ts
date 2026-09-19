import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc, where, type Unsubscribe } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import type { EmotionalState, SharedMemory } from '@/types';

export async function uploadMomentPhoto(memoryId: string, localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const objectRef = ref(storage, `moments/${memoryId}.jpg`);
  await uploadBytes(objectRef, blob);
  return getDownloadURL(objectRef);
}

/**
 * Creates the memories/{memoryId} doc first (without a photo), then the
 * caller uploads the photo keyed on the real memoryId and calls
 * attachMomentPhoto -- storage.rules authorizes the upload by checking this
 * doc already lists the uploader as a participant, so doc-then-photo is the
 * only order that satisfies both the Firestore and Storage rules.
 */
export async function saveMoment(
  friendUid: string,
  activityTitle: string,
  emotion: EmotionalState,
  options: { note?: string } = {},
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to save a moment.');

  const memory: Omit<SharedMemory, 'id'> = {
    participants: [uid, friendUid],
    activityTitle,
    occurredAt: Date.now(),
    emotions: { [uid]: emotion },
    note: options.note,
  };
  const docRef = await addDoc(collection(db, 'memories'), memory);
  return docRef.id;
}

export async function attachMomentPhoto(memoryId: string, localUri: string): Promise<string> {
  const photoUrl = await uploadMomentPhoto(memoryId, localUri);
  await updateDoc(doc(db, 'memories', memoryId), { photoUrl });
  return photoUrl;
}

export function watchOurStory(uid: string, callback: (memories: (SharedMemory & { id: string })[]) => void): Unsubscribe {
  const memoriesQuery = query(
    collection(db, 'memories'),
    where('participants', 'array-contains', uid),
    orderBy('occurredAt', 'desc'),
  );
  return onSnapshot(memoriesQuery, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as SharedMemory & { id: string })));
  });
}
