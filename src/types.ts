export type FlowScreen =
  | 'Welcome'
  | 'CreateAccount'
  | 'ConnectFriend'
  | 'FriendConnected'
  | 'ChooseActivity'
  | 'InviteFriend'
  | 'FriendAccepts'
  | 'MakePlan'
  | 'PlanConfirmed'
  | 'ActivityCheckin'
  | 'CaptureMoment'
  | 'SharedMoment';

export type NavTab = 'Home' | 'OurStory' | 'Discover' | 'You';

export type EmotionalState = 'fun' | 'calming' | 'meaningful' | 'unexpected' | 'just-nice';

export interface EmotionalConfig {
  id: EmotionalState;
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  duration: string;
  description: string;
  iconName: string;
  locationType: 'in-person' | 'remote' | 'either';
  tags: string[];
}

/** Mirrors the `plans/{planId}` Firestore document (docs/data-model.md). */
export interface Plan {
  id: string;
  participants: [string, string];
  activityId: string;
  activityTitle: string;
  scheduledAt: number;
  note?: string;
  status: 'pending' | 'accepted' | 'completed';
  reminderSent?: boolean;
}

/** Mirrors the `memories/{memoryId}` Firestore document. */
export interface SharedMemory {
  id: string;
  participants: [string, string];
  activityTitle: string;
  occurredAt: number;
  emotions: Partial<Record<string, EmotionalState>>;
  photoUrl?: string;
  note?: string;
}

export interface Contact {
  uid: string;
  displayName: string;
  initials: string;
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

/** Mirrors the `users/{uid}` Firestore document. */
export interface UserDoc {
  uid: string;
  displayName: string;
  connectedFriendUid?: string;
  expoPushToken?: string;
}
