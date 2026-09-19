import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from './admin';

const REMINDER_WINDOW_START_MS = 25 * 60 * 1000; // 25 min out
const REMINDER_LOOKBACK_MS = 40 * 60 * 1000; // covers one skipped 5-min run (KTD5)

export interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data: { planId: string };
}

export interface PlanRecord {
  id: string;
  activityTitle: string;
  reminderSent?: boolean;
}

/**
 * Pure windowing logic (U7, KTD5): a plan reaching scheduledAt within
 * [now+25min, now+65min] is caught by at least one 5-minute scheduler
 * tick even if the previous tick was skipped or delayed.
 */
export function computeReminderWindow(now: number): { windowStart: number; windowEnd: number } {
  const windowStart = now + REMINDER_WINDOW_START_MS;
  return { windowStart, windowEnd: windowStart + REMINDER_LOOKBACK_MS };
}

/** Pure message-construction logic, testable without Firestore. */
export function buildReminderMessages(plan: PlanRecord, participantTokens: (string | undefined)[]): ExpoPushMessage[] {
  if (plan.reminderSent) return [];
  return participantTokens
    .filter((token): token is string => Boolean(token))
    .map((token) => ({
      to: token,
      title: `Your ${plan.activityTitle} starts soon.`,
      body: 'Ready?',
      data: { planId: plan.id },
    }));
}

async function sendExpoPush(messages: ExpoPushMessage[]): Promise<void> {
  if (messages.length === 0) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(messages),
  });
}

/** Scheduled reminder sender (U7). See computeReminderWindow/buildReminderMessages for the tested logic. */
export const sendPlanReminders = onSchedule('every 5 minutes', async () => {
  const { windowStart, windowEnd } = computeReminderWindow(Date.now());

  const plansSnapshot = await db
    .collection('plans')
    .where('status', '==', 'accepted')
    .where('scheduledAt', '>=', windowStart)
    .where('scheduledAt', '<=', windowEnd)
    .get();

  const allMessages: ExpoPushMessage[] = [];

  for (const planDoc of plansSnapshot.docs) {
    const data = planDoc.data();
    const plan: PlanRecord = { id: planDoc.id, activityTitle: data.activityTitle, reminderSent: data.reminderSent };
    if (plan.reminderSent) continue;

    const participants: string[] = data.participants ?? [];
    const userDocs = await Promise.all(participants.map((uid) => db.collection('users').doc(uid).get()));
    const tokens = userDocs.map((userDoc) => userDoc.data()?.expoPushToken as string | undefined);

    allMessages.push(...buildReminderMessages(plan, tokens));
    await planDoc.ref.update({ reminderSent: true });
  }

  await sendExpoPush(allMessages);
});
