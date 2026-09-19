import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MakePlan'>;

export function MakePlanScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  return (
    <Screen title="Your plan" subtitle="Everything's set for your activity together.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Confirm plan" onPress={() => navigation.navigate('PlanConfirmed', { planId })} />
      </View>
    </Screen>
  );
}
