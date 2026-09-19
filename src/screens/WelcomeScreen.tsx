import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen title="With." subtitle="Stay close to the people who matter, on purpose.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Get started" onPress={() => navigation.navigate('CreateAccount')} />
        <PrimaryButton
          label="I already have an account"
          variant="secondary"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    </Screen>
  );
}
