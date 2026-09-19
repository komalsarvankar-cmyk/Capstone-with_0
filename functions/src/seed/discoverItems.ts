/**
 * One-time seed script for the discoverItems Firestore collection (U2,
 * KTD7). Run with `npm run seed:discover` from functions/ after
 * `firebase login` and with GOOGLE_APPLICATION_CREDENTIALS or default
 * project credentials available. Idempotent: uses each item's stable id
 * as the document id, so re-running overwrites rather than duplicating.
 */
import { db } from '../admin';

const DISCOVER_ITEMS = [
  { id: 'disc-1', section: 'for-you', title: 'Golden Hour Audio Walk', subtitle: 'Synchronized walk with quiet prompts', dateTime: 'Any day at sunset', description: 'Put your earbuds in, head outside simultaneously, and describe the evening light.', category: 'Curated for You', duration: '20 min', badge: 'Popular for pairs' },
  { id: 'disc-2', section: 'for-you', title: 'Swap Childhood Neighborhood Stories', subtitle: 'Low-key evening coffee conversation', dateTime: 'Flexible', description: 'Show each other your childhood elementary schools on street view.', category: 'Curated for You', duration: '25 min' },
  { id: 'disc-3', section: 'experiences', title: 'Make Something Together', subtitle: 'Ceramic Hand-Building Workshop', dateTime: 'Saturday - 5:00 PM', location: 'Cobble Hill Studio', description: 'A cozy 2-hour session shaping clay pinch pots.', category: 'Creative Workshop', duration: '2 hours', badge: 'Join with your friend' },
  { id: 'disc-4', section: 'experiences', title: 'Farmers Market Sourdough Tasting', subtitle: 'Tasting bread and local preserves', dateTime: 'Sunday - 10:30 AM', location: 'Grand Army Plaza', description: 'Stroll the market stalls and grab warm focaccia.', category: 'Food Experience', duration: '45 min', badge: 'Low friction' },
  { id: 'disc-5', section: 'community', title: 'Mindful Morning Walk in the Park', subtitle: 'Facilitated by Brooklyn Wellbeing Circle', dateTime: 'Saturday - 9:30 AM', location: 'Prospect Park Meadow', description: 'A gentle, phone-free stroll focusing on sensory grounding.', category: 'Wellbeing Partner', duration: '45 min', badge: 'Partner Hosted' },
  { id: 'disc-6', section: 'community', title: 'Silent Book Club & Coffee', subtitle: 'Hosted by Books & Brevity', dateTime: 'Thursday - 6:30 PM', location: 'Corner Coffee Co.', description: 'Read in companionable silence for 30 min, then catch up.', category: 'Community Gathering', duration: '1 hour', badge: 'Free & Welcoming' },
  { id: 'disc-7', section: 'near-you', title: 'Sunset over Pier 6 Waterfront', subtitle: '0.8 miles away - Quiet vantage point', dateTime: 'Best at 6:45 PM', location: 'Brooklyn Bridge Park', description: 'Secluded wooden benches overlooking the harbor lights.', category: 'Local Gem', duration: '20-40 min' },
  { id: 'disc-8', section: 'near-you', title: 'Botanical Garden Greenhouse Walk', subtitle: '1.2 miles away - Free Tuesdays', dateTime: 'Tues-Sun - 10 AM-5 PM', location: 'Washington Ave Entrance', description: 'Lush tropical warmth and quiet pathways.', category: 'Local Gem', duration: '45 min' },
];

async function seed() {
  const batch = db.batch();
  for (const item of DISCOVER_ITEMS) {
    batch.set(db.collection('discoverItems').doc(item.id), item);
  }
  await batch.commit();
  console.log(`Seeded ${DISCOVER_ITEMS.length} discoverItems.`);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
