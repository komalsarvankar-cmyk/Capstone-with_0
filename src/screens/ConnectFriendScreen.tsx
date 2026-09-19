import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Share, Text, TextInput, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { acceptInvite, createInvite } from '@/lib/invites';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectFriend'>;

/** Extracts the inviteId from a withapp://invite/<id> deep link or a bare id/code. */
function parseInviteId(input: string): string {
  const trimmed = input.trim();
  const parsed = Linking.parse(trimmed);
  const pathId = parsed.path?.replace(/^invite\//, '') ?? parsed.path;
  return pathId || trimmed;
}

export function ConnectFriendScreen({ navigation }: Props) {
  const [sending, setSending] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
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

  const handleAccept = async () => {
    if (!inviteInput.trim()) return;
    setError(null);
    setAccepting(true);
    try {
      const inviteId = parseInviteId(inviteInput);
      const { friendUid, friendDisplayName } = await acceptInvite(inviteId);
      navigation.navigate('FriendConnected', {
        friend: { uid: friendUid, displayName: friendDisplayName, initials: friendDisplayName.slice(0, 2).toUpperCase() },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept that invite.');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <Screen title="Connect with a friend" subtitle="Share an invite link, or paste one you received.">
      <View style={{ gap: 12 }}>
        {error ? <Text style={{ color: '#B91C1C' }}>{error}</Text> : null}
        <PrimaryButton label="Share invite link" onPress={handleInvite} loading={sending} />
        <TextInput
          placeholder="Paste an invite link or code"
          value={inviteInput}
          onChangeText={setInviteInput}
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 }}
        />
        <PrimaryButton
          label="Accept invite"
          variant="secondary"
          onPress={handleAccept}
          loading={accepting}
          disabled={!inviteInput.trim()}
        />
      </View>
    </Screen>
  );
}
