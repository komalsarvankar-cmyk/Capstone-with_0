import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

export interface ActivitySuggestion {
  title: string;
  description: string;
}

/**
 * Calls the suggestActivities callable Cloud Function (U5, KTD6). The
 * Gemini API key never leaves the function -- this client only sends
 * recent activity titles as light context and receives suggestions back.
 */
export async function fetchAiSuggestions(recentActivityTitles: string[]): Promise<ActivitySuggestion[]> {
  const functions = getFunctions(app);
  const suggestActivities = httpsCallable<{ recentActivityTitles: string[] }, { suggestions: ActivitySuggestion[] }>(
    functions,
    'suggestActivities',
  );
  const result = await suggestActivities({ recentActivityTitles });
  return result.data.suggestions;
}
