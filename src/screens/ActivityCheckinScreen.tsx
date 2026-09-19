import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { completePlan } from '@/lib/plans';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityCheckin'>;

export function ActivityCheckinScreen({ route, navigation }: Props) {
  const { planId } = route.params;

  const handleYes = async () => {
    await completePlan(planId);
    navigation.navigate('CaptureMoment', { planId });
  };

  return (
    <Screen title="Did you do it?" subtitle="Let us know how the activity went.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Yes, we did it!" onPress={handleYes} />
        <PrimaryButton label="Not this time" variant="secondary" onPress={() => navigation.navigate('Main')} />
      </View>
    </Screen>
  );
}
