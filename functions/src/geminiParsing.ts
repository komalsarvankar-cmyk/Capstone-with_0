/**
 * Gemini frequently wraps JSON replies in a ```json ... ``` fence despite
 * being asked for raw JSON; strip that before parsing. A malformed reply
 * logs the raw text (for diagnosis) and fails closed to an empty list
 * rather than masking the cause behind a generic error.
 *
 * Split into its own module (no firebase-admin/firebase-functions
 * imports) so it can be unit-tested without pulling in firebase-admin's
 * ESM-only auth dependency chain, which ts-jest cannot transform.
 */
export function parseSuggestions(rawText: string): Array<{ title: string; description: string }> {
  const stripped = rawText.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  try {
    const parsed = JSON.parse(stripped);
    if (!Array.isArray(parsed)) throw new Error('Response was not a JSON array');
    return parsed;
  } catch (error) {
    console.error('Could not parse Gemini response as JSON', { rawText, error });
    return [];
  }
}
