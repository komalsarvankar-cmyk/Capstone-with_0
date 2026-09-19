import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/HomeScreen';
import { OurStoryScreen } from '@/screens/OurStoryScreen';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { YouScreen } from '@/screens/YouScreen';
import { colors } from '@/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="OurStory" component={OurStoryScreen} options={{ title: 'Our Story' }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="You" component={YouScreen} />
    </Tab.Navigator>
  );
}
