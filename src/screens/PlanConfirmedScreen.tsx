import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanConfirmed'>;

export function PlanConfirmedScreen({ navigation }: Props) {
  return (
    <Screen title="Plan confirmed" subtitle="We'll remind you both before it starts.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Done" onPress={() => navigation.navigate('Main')} />
      </View>
    </Screen>
  );
}
