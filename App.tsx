import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { RootNavigator } from '@/navigation/RootNavigator';
import { navigationRef } from '@/navigation/navigationRef';

export default function App() {
  useEffect(() => {
    // U7 step 3: tapping the reminder notification opens check-in for that plan.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const planId = response.notification.request.content.data?.planId;
      if (typeof planId === 'string' && navigationRef.isReady()) {
        navigationRef.navigate('ActivityCheckin', { planId });
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}
