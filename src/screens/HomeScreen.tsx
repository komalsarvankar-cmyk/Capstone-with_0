import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';

export function HomeScreen() {
  // Cross-navigator navigation (tab -> root stack) resolves through the
  // root navigator's shared navigation object at runtime.
  const navigation = useNavigation<any>();

  return (
    <Screen title="Home" subtitle="Your next activity with your friend.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Start a new activity" onPress={() => navigation.navigate('ChooseActivity')} />
      </View>
    </Screen>
  );
}
