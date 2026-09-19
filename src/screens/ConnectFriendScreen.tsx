import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Linking from 'expo-linking';
import { ChevronLeft, Link2, Check } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { acceptInvite, createInvite } from '@/lib/invites';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectFriend'>;

/** Extracts the inviteId from a withapp://invite/<id> deep link or a bare id/code. */
function parseInviteId(input: string): string {
  const trimmed = input.trim();
  const parsed = Linking.parse(trimmed);
  const pathId = parsed.path?.replace(/^invite\//, '') ?? parsed.path;
  return pathId || trimmed;
}

/**
 * Ported from the original prototype's ConnectFriendScreen (git show
 * cfaa64e:src/components/ConnectFriendScreen.tsx). The original picked a
 * friend from a hardcoded contact list (CONTACT_SUGGESTIONS) with no real
 * backend behind it; this build has no directory of app users to search,
 * so it keeps the original's "send invite link" card verbatim (now backed
 * by a real Firestore invite) and replaces the fake contact list with a
 * real paste-a-received-invite input, matching the same visual language.
 */
export function ConnectFriendScreen({ navigation }: Props) {
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    setError(null);
    setSending(true);
    try {
      const link = await createInvite();
      await Share.share({ message: `Join me on With.: ${link}` });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 2 of 3</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headline}>Who would you like to do this with?</Text>
        <Text style={styles.subtitle}>Connect with a friend to start sharing experiences together.</Text>

        <Pressable style={styles.linkCard} onPress={handleInvite} disabled={sending}>
          <View style={styles.linkCardLeft}>
            <View style={styles.linkIcon}>
              <Link2 size={18} color={colors.lavender600} />
            </View>
            <View>
              <Text style={styles.linkTitle}>Send invite link</Text>
              <Text style={styles.linkSubtitle}>Invite anyone via Messages or WhatsApp</Text>
            </View>
          </View>
          <View style={styles.copyPill}>
            {copied ? (
              <>
                <Check size={13} color="#059669" />
                <Text style={styles.copyPillText}>Sent</Text>
              </>
            ) : (
              <Text style={styles.copyPillText}>{sending ? 'Sending...' : 'Share link'}</Text>
            )}
          </View>
        </Pressable>

        <Text style={styles.sectionLabel}>HAVE AN INVITE?</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste an invite link or code"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          value={inviteInput}
          onChangeText={setInviteInput}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.confirmButton, !inviteInput.trim() && styles.confirmButtonDisabled]}
          onPress={handleAccept}
          disabled={!inviteInput.trim() || accepting}
        >
          <Text style={styles.confirmButtonLabel}>{accepting ? 'Connecting...' : 'Accept invite'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  nav: { height: 52, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stepBadge: { backgroundColor: colors.lavender100, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 2 },
  stepBadgeText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.lg },
  headline: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 35, color: colors.textPrimary, marginTop: spacing.xs },
  subtitle: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: spacing.sm },
  linkCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  linkCardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  linkIcon: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.lavender100, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary },
  linkSubtitle: { fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.lavender200,
  },
  copyPillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  sectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: '#9CA3AF', marginTop: spacing.sm },
  input: {
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.textPrimary,
  },
  error: { fontFamily: fonts.sans, color: '#B91C1C', fontSize: 13 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.xs },
  confirmButton: { height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  confirmButtonDisabled: { opacity: 0.5 },
  confirmButtonLabel: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
});
