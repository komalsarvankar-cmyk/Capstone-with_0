import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Share, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { createInvite } from '@/lib/invites';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectFriend'>;

export function ConnectFriendScreen({ navigation }: Props) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    setError(null);
    setSending(true);
    try {
      const link = await createInvite();
      await Share.share({ message: `Join me on With.: ${link}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create an invite.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen title="Connect with a friend" subtitle="Share an invite link to get connected.">
      <View style={{ gap: 12 }}>
        {error ? <Text style={{ color: '#B91C1C' }}>{error}</Text> : null}
        <PrimaryButton label="Share invite link" onPress={handleInvite} loading={sending} />
        <PrimaryButton
          label="I've already connected"
          variant="secondary"
          onPress={() => navigation.navigate('FriendConnected', { friend: { uid: '', displayName: '', initials: '' } })}
        />
      </View>
    </Screen>
  );
}
