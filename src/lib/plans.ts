import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Activity, Plan } from '@/types';

/** Watches the caller's single not-yet-completed plan, if any (Home screen's "Your Next Moment"). */
export function watchCurrentPlan(uid: string, callback: (plan: (Plan & { id: string }) | null) => void): Unsubscribe {
  const currentPlanQuery = query(
    collection(db, 'plans'),
    where('participants', 'array-contains', uid),
    where('status', 'in', ['pending', 'accepted']),
    orderBy('scheduledAt', 'asc'),
  );
  return onSnapshot(currentPlanQuery, (snapshot) => {
    const first = snapshot.docs[0];
    callback(first ? ({ id: first.id, ...first.data() } as Plan & { id: string }) : null);
  });
}

/** Creates a `plans/{planId}` doc with both uids as participants (U6). */
export async function proposePlan(
  friendUid: string,
  activity: Activity,
  scheduledAt: number,
  note?: string,
): Promise<string> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('You must be signed in to propose a plan.');

  const ref = await addDoc(collection(db, 'plans'), {
    participants: [uid, friendUid],
    activityId: activity.id,
    activityTitle: activity.title,
    scheduledAt,
    note: note ?? null,
    status: 'pending',
    reminderSent: false,
  });
  return ref.id;
}

export function watchPlan(planId: string, callback: (plan: (Plan & { id: string }) | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'plans', planId), (snapshot) => {
    callback(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Plan & { id: string }) : null);
  });
}

export async function acceptPlan(planId: string) {
  await updateDoc(doc(db, 'plans', planId), { status: 'accepted' });
}

export async function counterProposePlan(planId: string, scheduledAt: number, activityId?: string) {
  await updateDoc(doc(db, 'plans', planId), {
    scheduledAt,
    ...(activityId ? { activityId } : {}),
  });
}

export async function completePlan(planId: string) {
  await updateDoc(doc(db, 'plans', planId), { status: 'completed' });
}
