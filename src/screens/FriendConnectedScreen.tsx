import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendConnected'>;

export function FriendConnectedScreen({ route, navigation }: Props) {
  const { friend } = route.params;
  return (
    <Screen title="You're connected!" subtitle={friend.displayName ? `You and ${friend.displayName} are now connected.` : 'You are now connected.'}>
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Choose your first activity" onPress={() => navigation.navigate('ChooseActivity')} />
        <PrimaryButton label="Explore first" variant="secondary" onPress={() => navigation.navigate('Main')} />
      </View>
    </Screen>
  );
}
