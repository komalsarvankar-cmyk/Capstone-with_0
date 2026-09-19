import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { signOut } from '@/lib/auth';

export function YouScreen() {
  return (
    <Screen title="You" subtitle="Account settings.">
      <View style={{ gap: 12 }}>
        <PrimaryButton label="Sign out" variant="secondary" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}
