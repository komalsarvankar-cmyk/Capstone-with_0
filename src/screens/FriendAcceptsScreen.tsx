import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { acceptPlan, watchPlan } from '@/lib/plans';
import type { Plan } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendAccepts'>;

export function FriendAcceptsScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<(Plan & { id: string }) | null>(null);

  useEffect(() => watchPlan(planId, setPlan), [planId]);

  const handleAccept = async () => {
    await acceptPlan(planId);
    navigation.navigate('MakePlan', { planId });
  };

  return (
    <Screen title={plan?.activityTitle ?? 'Loading...'} subtitle="Waiting for your friend to accept, or accept it yourself.">
      <View style={{ gap: 12 }}>
        <Text>Status: {plan?.status ?? '...'}</Text>
        <PrimaryButton label="Accept" onPress={handleAccept} disabled={!plan} />
        <PrimaryButton
          label="Suggest another activity"
          variant="secondary"
          onPress={() => navigation.navigate('ChooseActivity')}
        />
      </View>
    </Screen>
  );
}
