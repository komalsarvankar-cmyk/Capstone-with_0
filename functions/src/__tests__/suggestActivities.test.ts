import { parseSuggestions } from '../suggestActivities';

describe('parseSuggestions (U5)', () => {
  it('parses a raw JSON array response', () => {
    const result = parseSuggestions('[{"title":"Walk","description":"A short walk."}]');
    expect(result).toEqual([{ title: 'Walk', description: 'A short walk.' }]);
  });

  it('strips a markdown code fence before parsing (common Gemini output shape)', () => {
    const fenced = '```json\n[{"title":"Walk","description":"A short walk."}]\n```';
    expect(parseSuggestions(fenced)).toEqual([{ title: 'Walk', description: 'A short walk.' }]);
  });

  it('returns an empty array instead of throwing on malformed JSON', () => {
    expect(parseSuggestions('not json at all')).toEqual([]);
  });

  it('returns an empty array when the response is valid JSON but not an array', () => {
    expect(parseSuggestions('{"title":"Walk"}')).toEqual([]);
  });
});
