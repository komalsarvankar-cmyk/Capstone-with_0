/**
 * Normalizes a phone number to a last-10-digit matching key. This is a
 * simple heuristic (not full E.164 parsing) that ignores country-code
 * prefixes and formatting, matching on the national significant number.
 * Good enough for contacts matching within one country; cross-country
 * numbers with genuinely different national numbers still match correctly
 * since only their own digits matter.
 */
export function normalizePhoneKey(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 7) return null;
  return digits.slice(-10);
}
