import type { Activity, Contact } from '@/types';

export type RootStackParamList = {
  Welcome: undefined;
  CreateAccount: undefined;
  ConnectFriend: undefined;
  FriendConnected: { friend: Contact };
  ChooseActivity: undefined;
  InviteFriend: { activity: Activity };
  FriendAccepts: { planId: string };
  MakePlan: { planId: string };
  PlanConfirmed: { planId: string };
  ActivityCheckin: { planId: string };
  CaptureMoment: { planId: string };
  SharedMoment: { memoryId: string };
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  OurStory: undefined;
  Discover: undefined;
  You: undefined;
};
