import { buildReminderMessages, computeReminderWindow } from '../sendPlanReminders';

describe('computeReminderWindow (U7, KTD5)', () => {
  it('starts the window 25 minutes from now and spans a 40-minute lookback', () => {
    const now = 1_000_000_000_000;
    const { windowStart, windowEnd } = computeReminderWindow(now);
    expect(windowStart).toBe(now + 25 * 60 * 1000);
    expect(windowEnd).toBe(windowStart + 40 * 60 * 1000);
  });
});

describe('buildReminderMessages (U7)', () => {
  const plan = { id: 'plan-1', activityTitle: 'Take a walk' };

  it('builds one push message per participant with a registered token', () => {
    const messages = buildReminderMessages(plan, ['token-a', 'token-b']);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual({
      to: 'token-a',
      title: 'Your Take a walk starts soon.',
      body: 'Ready?',
      data: { planId: 'plan-1' },
    });
  });

  it('skips a participant with no registered push token without failing the run', () => {
    const messages = buildReminderMessages(plan, ['token-a', undefined]);
    expect(messages).toHaveLength(1);
    expect(messages[0].to).toBe('token-a');
  });

  it('produces no messages for a plan already marked reminderSent (no duplicate notify)', () => {
    const messages = buildReminderMessages({ ...plan, reminderSent: true }, ['token-a', 'token-b']);
    expect(messages).toHaveLength(0);
  });

  it('produces no messages when no participant has a token', () => {
    const messages = buildReminderMessages(plan, [undefined, undefined]);
    expect(messages).toHaveLength(0);
  });
});
