import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { User } from 'firebase/auth';
import type { RootStackParamList } from '@/navigation/types';
import { subscribeToAuthState } from '@/lib/auth';
import { registerForPushNotifications } from '@/lib/notifications';
import { MainTabs } from '@/navigation/MainTabs';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { CreateAccountScreen } from '@/screens/CreateAccountScreen';
import { ConnectFriendScreen } from '@/screens/ConnectFriendScreen';
import { FriendConnectedScreen } from '@/screens/FriendConnectedScreen';
import { ChooseActivityScreen } from '@/screens/ChooseActivityScreen';
import { InviteFriendScreen } from '@/screens/InviteFriendScreen';
import { FriendAcceptsScreen } from '@/screens/FriendAcceptsScreen';
import { MakePlanScreen } from '@/screens/MakePlanScreen';
import { PlanConfirmedScreen } from '@/screens/PlanConfirmedScreen';
import { ActivityCheckinScreen } from '@/screens/ActivityCheckinScreen';
import { CaptureMomentScreen } from '@/screens/CaptureMomentScreen';
import { SharedMomentScreen } from '@/screens/SharedMomentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * R3: gates the main app and all flow screens behind authentication.
 * Every screen below is reachable only once `user` is non-null.
 */
export function RootNavigator() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => subscribeToAuthState(setUser), []);

  useEffect(() => {
    if (user) registerForPushNotifications();
  }, [user]);

  if (user === undefined) return null; // splash/loading; auth state not yet known

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Main' : 'Welcome'}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ChooseActivity" component={ChooseActivityScreen} />
          <Stack.Screen name="InviteFriend" component={InviteFriendScreen} />
          <Stack.Screen name="FriendAccepts" component={FriendAcceptsScreen} />
          <Stack.Screen name="MakePlan" component={MakePlanScreen} />
          <Stack.Screen name="PlanConfirmed" component={PlanConfirmedScreen} />
          <Stack.Screen name="ActivityCheckin" component={ActivityCheckinScreen} />
          <Stack.Screen name="CaptureMoment" component={CaptureMomentScreen} />
          <Stack.Screen name="SharedMoment" component={SharedMomentScreen} />
          <Stack.Screen name="ConnectFriend" component={ConnectFriendScreen} />
          <Stack.Screen name="FriendConnected" component={FriendConnectedScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
