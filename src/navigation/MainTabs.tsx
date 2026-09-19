import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookHeart, Compass, User } from 'lucide-react-native';
import type { MainTabParamList } from '@/navigation/types';
import { HomeScreen } from '@/screens/HomeScreen';
import { OurStoryScreen } from '@/screens/OurStoryScreen';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { YouScreen } from '@/screens/YouScreen';
import { colors, fonts } from '@/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Ported from the original prototype's BottomNavBar (git show cfaa64e:src/components/BottomNavBar.tsx). */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.lavender600,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { backgroundColor: colors.canvas, borderTopColor: colors.border, height: 58 },
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, focused }) => <Home size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} /> }}
      />
      <Tab.Screen
        name="OurStory"
        component={OurStoryScreen}
        options={{
          title: 'Our Story',
          tabBarIcon: ({ color, focused }) => <BookHeart size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ tabBarIcon: ({ color, focused }) => <Compass size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} /> }}
      />
      <Tab.Screen
        name="You"
        component={YouScreen}
        options={{ tabBarIcon: ({ color, focused }) => <User size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} /> }}
      />
    </Tab.Navigator>
  );
}
