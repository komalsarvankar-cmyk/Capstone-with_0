export type NavTab = 'home' | 'our-story' | 'discover' | 'you';

export type FlowScreen =
  | 'welcome' // Screen 1
  | 'create-account' // Screen 2
  | 'connect-friend' // Screen 3
  | 'friend-connected' // Screen 4
  | 'choose-activity' // Screen 5
  | 'invite-friend' // Screen 6
  | 'friend-accepts' // Screen 7
  | 'make-plan' // Screen 8
  | 'plan-confirmed' // Screen 9
  | 'activity-checkin' // Screen 10
  | 'capture-moment' // Screen 11
  | 'shared-moment' // Screen 12
  | 'main'; // Main app container with bottom navigation

export type ScreenId = FlowScreen;

export type EmotionalState =
  | 'fun'
  | 'calming'
  | 'meaningful'
  | 'unexpected'
  | 'just-nice';

export interface EmotionalConfig {
  id: EmotionalState;
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  duration: string;
  description: string;
  iconName: 'walk' | 'sunset' | 'utensils' | 'gamepad' | 'music' | 'coffee' | 'book' | 'compass' | 'camera' | 'sparkles' | 'bike' | 'palette';
  locationType: 'in-person' | 'remote' | 'either';
  tags: string[];
}

export interface Plan {
  id: string;
  activityId: string;
  activityTitle: string;
  duration: string;
  date: string;
  time: string;
  displayDateTime: string;
  initiator: string;
  recipient: string;
  note?: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrenceDuration?: '1 week' | '2 weeks' | '1 month' | '3 months' | 'custom';
  status: 'pending' | 'accepted' | 'completed';
}

export interface SharedMemory {
  id: string;
  activityTitle: string;
  dateStr: string;
  month?: 'SEPTEMBER' | 'AUGUST' | 'JULY' | 'JUNE' | 'MAY' | string;
  year?: string;
  userEmotion: EmotionalState;
  friendEmotion: EmotionalState;
  userEmotionLabel?: string;
  friendEmotionLabel?: string;
  photoUrl?: string;
  note?: string;
  voiceDuration?: string;
  voiceNoteDuration?: string;
  isMilestone?: boolean;
  milestoneTitle?: string;
}

export interface JournalPrompt {
  id: string;
  prompt: string;
  response?: string;
  answeredBy?: string;
  date?: string;
  saved: boolean;
}

export interface DiscoverItem {
  id: string;
  section: 'for-you' | 'experiences' | 'community' | 'near-you';
  title: string;
  subtitle: string;
  dateTime: string;
  location?: string;
  description: string;
  badge?: string;
  category: string;
  duration: string;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  phone: string;
  location?: string;
  avatarBg?: string;
}
