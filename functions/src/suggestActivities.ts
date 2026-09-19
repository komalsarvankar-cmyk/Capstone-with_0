import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from './admin';
import { parseSuggestions } from './geminiParsing';

const geminiApiKey = defineSecret('GEMINI_API_KEY');

const MAX_REQUESTS_PER_DAY = 20;
const MAX_CONTEXT_TITLES = 5;
const MAX_TITLE_LENGTH = 80;

/**
 * Callable Cloud Function proxying Gemini activity suggestions (U5, KTD6).
 * The API key lives only in this function's secret binding, never in the
 * client bundle (R12, R13). Rate-limited per user (U11) to bound cost from
 * a single compromised or looping account.
 */
export const suggestActivities = onCall(
  { secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in to request activity ideas.');
    }
    const uid = request.auth.uid;

    await enforceRateLimit(uid);

    const recentTitlesInput = Array.isArray(request.data?.recentActivityTitles)
      ? (request.data.recentActivityTitles as unknown[])
      : [];
    const recentTitles = recentTitlesInput
      .filter((title): title is string => typeof title === 'string')
      .slice(0, MAX_CONTEXT_TITLES)
      .map((title) => title.slice(0, MAX_TITLE_LENGTH));

    const genAI = new GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = [
      'Suggest 3 short, low-effort activity ideas for two close friends to do together.',
      'Each idea: a title (5 words or fewer) and a one-sentence description.',
      recentTitles.length ? `They recently did: ${recentTitles.join(', ')}. Suggest something different.` : '',
      'Return as a JSON array of {"title": string, "description": string}. No other text.',
    ]
      .filter(Boolean)
      .join(' ');

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (error) {
      console.error('Gemini request failed', error);
      throw new HttpsError('unavailable', 'Could not generate suggestions right now.');
    }

    const suggestions = parseSuggestions(result.response.text());
    return { suggestions };
  },
);

async function enforceRateLimit(uid: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const counterRef = db.collection('rateLimits').doc(`${uid}_${today}`);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(counterRef);
    const count = snapshot.exists ? (snapshot.data()?.count as number) : 0;
    if (count >= MAX_REQUESTS_PER_DAY) {
      throw new HttpsError('resource-exhausted', 'Daily AI suggestion limit reached. Try again tomorrow.');
    }
    transaction.set(counterRef, { count: FieldValue.increment(1), uid, day: today }, { merge: true });
  });
}
