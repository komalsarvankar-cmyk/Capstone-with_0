import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SharedMoment'>;

export function SharedMomentScreen({ navigation }: Props) {
  return (
    <Screen title="Moment saved" subtitle="It's now part of your shared story.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Go to Our Story" onPress={() => navigation.navigate('Main')} />
      </View>
    </Screen>
  );
}
