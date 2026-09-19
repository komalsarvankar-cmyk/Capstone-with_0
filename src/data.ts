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
  { id: 'walk', title: 'Take a walk', duration: '15-30 min', description: 'A simple walk with no agenda.', iconName: 'walk', locationType: 'in-person', tags: ['Simple', 'Outdoors'] },
  { id: 'sunset', title: 'Watch the sunset', duration: '15-30 min', description: 'Catch the day fading into evening.', iconName: 'sunset', locationType: 'either', tags: ['Relaxing'] },
  { id: 'cook', title: 'Cook the same meal', duration: '30-60 min', description: 'Pick a simple recipe together.', iconName: 'utensils', locationType: 'either', tags: ['Hands-on'] },
  { id: 'game', title: 'Play a quick game', duration: '15-30 min', description: 'A round of cards or a phone game.', iconName: 'gamepad', locationType: 'either', tags: ['Playful'] },
  { id: 'playlist', title: 'Make a playlist together', duration: '20-30 min', description: 'Trade 5 songs each.', iconName: 'music', locationType: 'remote', tags: ['Creative'] },
  { id: 'coffee', title: 'Have coffee together', duration: '20-30 min', description: 'A quiet cup at a corner cafe.', iconName: 'coffee', locationType: 'in-person', tags: ['Routine'] },
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
