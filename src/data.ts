import type { Activity, DiscoverItem, EmotionalConfig, EmotionalState } from '@/types';

/** Ported verbatim from the original prototype's src/data.ts EMOTIONAL_CONFIGS. */
export const EMOTIONAL_CONFIGS: Record<EmotionalState, EmotionalConfig> = {
  fun: { id: 'fun', label: 'Fun', dotColor: '#F59E0B', bgColor: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A', description: 'Playful energy, laughter, and high spirits' },
  calming: { id: 'calming', label: 'Calming', dotColor: '#818CF8', bgColor: '#EEF2FF', textColor: '#3730A3', borderColor: '#C7D2FE', description: 'Slow pace, deep breath, restorative stillness' },
  meaningful: { id: 'meaningful', label: 'Meaningful', dotColor: '#EC4899', bgColor: '#FDF2F8', textColor: '#9D174D', borderColor: '#FBCFE8', description: 'Heartfelt vulnerability and thoughtful connection' },
  unexpected: { id: 'unexpected', label: 'Unexpected', dotColor: '#F97316', bgColor: '#FFF7ED', textColor: '#9A3412', borderColor: '#FED7AA', description: 'A surprising twist, spontaneous discovery' },
  'just-nice': { id: 'just-nice', label: 'Just nice', dotColor: '#10B981', bgColor: '#ECFDF5', textColor: '#065F46', borderColor: '#A7F3D0', description: 'Simple comfort, natural flow, easy company' },
};

/**
 * Curated activity library (U5). Ported from the original prototype's
 * src/data.ts; used as the client-side fallback/default list, never as a
 * runtime substitute for Firestore-backed data.
 */
export const CURATED_ACTIVITIES: Activity[] = [
  { id: 'walk', title: 'Take a walk', duration: '15-30 min', description: 'A simple walk with no agenda. Talk, wander, or just enjoy the fresh air together.', iconName: 'walk', locationType: 'in-person', tags: ['Simple', 'Outdoors', 'Low effort'] },
  { id: 'sunset', title: 'Watch the sunset', duration: '15-30 min', description: 'Catch the day fading into evening from a bench, window, or local vantage point.', iconName: 'sunset', locationType: 'either', tags: ['Relaxing', 'Peaceful'] },
  { id: 'cook', title: 'Cook the same meal', duration: '30-60 min', description: 'Pick a simple recipe together and cook side-by-side or over video.', iconName: 'utensils', locationType: 'either', tags: ['Hands-on', 'Comforting'] },
  { id: 'game', title: 'Play a quick game', duration: '15-30 min', description: 'A round of cards, word puzzle, or phone game just for the fun of it.', iconName: 'gamepad', locationType: 'either', tags: ['Playful', 'Quick'] },
  { id: 'playlist', title: 'Make a playlist together', duration: '20-30 min', description: 'Trade 5 songs each that remind you of this season or memories you share.', iconName: 'music', locationType: 'remote', tags: ['Creative', 'Anytime'] },
  { id: 'coffee', title: 'Have coffee together', duration: '20-30 min', description: 'A quiet cup at a corner cafe or sitting on a porch before the day gets noisy.', iconName: 'coffee', locationType: 'in-person', tags: ['Routine', 'Easy'] },
  { id: 'read', title: 'Read something together', duration: '20-40 min', description: 'Read the same short article, poem, or book chapter and discuss two lines.', iconName: 'book', locationType: 'either', tags: ['Reflective', 'Quiet'] },
  { id: 'new-thing', title: 'Try something neither of you has done', duration: '30-60 min', description: 'Step into a new bakery, try origami, or take an unfamiliar route home.', iconName: 'compass', locationType: 'in-person', tags: ['Adventure', 'Novelty'] },
  { id: 'photo-challenge', title: 'Send each other a photo challenge', duration: '10-15 min', description: 'Give each other three specific things to spot and photograph right now.', iconName: 'camera', locationType: 'remote', tags: ['Spontaneous', 'Visual'] },
  { id: 'sketch', title: '5-minute blind portrait sketch', duration: '10-15 min', description: 'Sketch each other without looking at the paper and laugh at the outcome.', iconName: 'palette', locationType: 'in-person', tags: ['Creative', 'Laughter'] },
  { id: 'bike-ride', title: 'Slow afternoon bike spin', duration: '30-45 min', description: 'Pedal gently through quiet side streets with zero rush.', iconName: 'bike', locationType: 'in-person', tags: ['Outdoors', 'Movement'] },
  { id: 'nostalgia', title: 'Revisit an old memory', duration: '15-20 min', description: 'Pull up a photo from 3 years ago and tell the story of what really happened.', iconName: 'sparkles', locationType: 'either', tags: ['Sentimental', 'Story'] },
];

/** Seed data for the `discoverItems` Firestore collection (U2/KTD7). */
export const DISCOVER_ITEMS: DiscoverItem[] = [
  { id: 'disc-1', section: 'for-you', title: 'Golden Hour Audio Walk', subtitle: 'Synchronized walk with quiet prompts', dateTime: 'Any day at sunset', description: 'Put your earbuds in, head outside simultaneously, and describe the evening light.', category: 'Curated for You', duration: '20 min', badge: 'Popular for pairs' },
  { id: 'disc-2', section: 'for-you', title: 'Swap Childhood Neighborhood Stories', subtitle: 'Low-key evening coffee conversation', dateTime: 'Flexible', description: 'Show each other your childhood elementary schools on street view.', category: 'Curated for You', duration: '25 min' },
  { id: 'disc-3', section: 'experiences', title: 'Make Something Together', subtitle: 'Ceramic Hand-Building Workshop', dateTime: 'Saturday - 5:00 PM', location: 'Cobble Hill Studio', description: 'A cozy 2-hour session shaping clay pinch pots.', category: 'Creative Workshop', duration: '2 hours', badge: 'Join with your friend' },
  { id: 'disc-4', section: 'experiences', title: 'Farmers Market Sourdough Tasting', subtitle: 'Tasting bread and local preserves', dateTime: 'Sunday - 10:30 AM', location: 'Grand Army Plaza', description: 'Stroll the market stalls and grab warm focaccia.', category: 'Food Experience', duration: '45 min', badge: 'Low friction' },
  { id: 'disc-5', section: 'community', title: 'Mindful Morning Walk in the Park', subtitle: 'Facilitated by Brooklyn Wellbeing Circle', dateTime: 'Saturday - 9:30 AM', location: 'Prospect Park Meadow', description: 'A gentle, phone-free stroll focusing on sensory grounding.', category: 'Wellbeing Partner', duration: '45 min', badge: 'Partner Hosted' },
  { id: 'disc-6', section: 'community', title: 'Silent Book Club & Coffee', subtitle: 'Hosted by Books & Brevity', dateTime: 'Thursday - 6:30 PM', location: 'Corner Coffee Co.', description: 'Read in companionable silence for 30 min, then catch up.', category: 'Community Gathering', duration: '1 hour', badge: 'Free & Welcoming' },
  { id: 'disc-7', section: 'near-you', title: 'Sunset over Pier 6 Waterfront', subtitle: '0.8 miles away - Quiet vantage point', dateTime: 'Best at 6:45 PM', location: 'Brooklyn Bridge Park', description: 'Secluded wooden benches overlooking the harbor lights.', category: 'Local Gem', duration: '20-40 min' },
  { id: 'disc-8', section: 'near-you', title: 'Botanical Garden Greenhouse Walk', subtitle: '1.2 miles away - Free Tuesdays', dateTime: 'Tues-Sun - 10 AM-5 PM', location: 'Washington Ave Entrance', description: 'Lush tropical warmth and quiet pathways.', category: 'Local Gem', duration: '45 min' },
];
