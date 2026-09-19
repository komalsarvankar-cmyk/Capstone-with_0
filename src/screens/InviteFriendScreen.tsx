import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { proposePlan } from '@/lib/plans';
import { useConnectedFriend } from '@/lib/useConnectedFriend';

type Props = NativeStackScreenProps<RootStackParamList, 'InviteFriend'>;

export function InviteFriendScreen({ route, navigation }: Props) {
  const { activity } = route.params;
  const friendUid = useConnectedFriend();
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!friendUid) {
      setError('Connect with a friend before proposing a plan.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      const scheduledAt = Date.now() + 1000 * 60 * 60 * 24 * 2; // default: 2 days out
      const planId = await proposePlan(friendUid, activity, scheduledAt, note || undefined);
      navigation.navigate('FriendAccepts', { planId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the invitation.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen title={activity.title} subtitle="Add a note and send the invite.">
      <View style={{ gap: 12 }}>
        <TextInput
          placeholder="Want to try the new park?"
          value={note}
          onChangeText={setNote}
          style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 }}
        />
        {error ? <Text style={{ color: '#B91C1C' }}>{error}</Text> : null}
        <PrimaryButton label="Send invitation" onPress={handleSend} loading={sending} />
      </View>
    </Screen>
  );
}
