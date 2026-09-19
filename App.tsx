import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Literata_600SemiBold, Literata_700Bold_Italic, Literata_400Regular_Italic } from '@expo-google-fonts/literata';
import { View } from 'react-native';
import { RootNavigator } from '@/navigation/RootNavigator';
import { navigationRef } from '@/navigation/navigationRef';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Literata_600SemiBold,
      Literata_700Bold_Italic,
      Literata_400Regular_Italic,
      'Geist-Regular': require('./assets/fonts/Geist-Regular.ttf'),
      'Geist-Medium': require('./assets/fonts/Geist-Medium.ttf'),
      'Geist-SemiBold': require('./assets/fonts/Geist-SemiBold.ttf'),
      'Geist-Bold': require('./assets/fonts/Geist-Bold.ttf'),
    })
      .catch((error) => console.warn('Font load failed, falling back to system font', error))
      .finally(() => setFontsLoaded(true));
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

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

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }} onLayout={onLayoutRootView}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}
