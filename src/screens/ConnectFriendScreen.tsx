import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChevronLeft, ChevronRight, Search, UserCheck } from 'lucide-react-native';
import { auth } from '@/lib/firebase';
import {
  acceptInvite,
  sendFriendRequest,
  savePhoneNumber,
  watchIncomingRequests,
  watchRecentContacts,
  type IncomingRequest,
  type RecentContact,
} from '@/lib/invites';
import { findFriendsFromContacts, type FriendMatch } from '@/lib/contactsMatch';
import { initialsOf } from '@/lib/initials';
import { useOwnProfile } from '@/lib/useOwnProfile';
import type { RootStackParamList } from '@/navigation/types';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectFriend'>;

/**
 * Ported from the original prototype's ConnectFriendScreen (git show
 * cfaa64e:src/components/ConnectFriendScreen.tsx). Replaces the original's
 * hardcoded contact list with real phone-contacts discovery
 * (findFriendsOnWith) -- tapping a match sends a request the other person
 * must approve, since a real account shouldn't be linked without consent.
 * A Recent section (people already requested) avoids re-scanning contacts
 * on every visit; the share-link/paste-code fallback was removed on
 * request, so contacts search is the sole discovery path.
 */
export function ConnectFriendScreen({ navigation }: Props) {
  const uid = auth.currentUser?.uid;
  const profile = useOwnProfile();
  const [phoneInput, setPhoneInput] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [matches, setMatches] = useState<FriendMatch[] | null>(null);
  const [searchingContacts, setSearchingContacts] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [recent, setRecent] = useState<RecentContact[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return undefined;
    return watchIncomingRequests(uid, setRequests);
  }, [uid]);

  useEffect(() => {
    if (!uid) return undefined;
    return watchRecentContacts(uid, setRecent);
  }, [uid]);

  const handleSavePhone = async () => {
    setError(null);
    setSavingPhone(true);
    try {
      await savePhoneNumber(phoneInput);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your phone number.');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleFindContacts = async () => {
    setError(null);
    setSearchingContacts(true);
    try {
      setMatches(await findFriendsFromContacts());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not search your contacts.');
    } finally {
      setSearchingContacts(false);
    }
  };

  const handleSendRequest = async (toUid: string) => {
    setError(null);
    setSendingTo(toUid);
    try {
      await sendFriendRequest(toUid);
      setMatches((prev) => prev?.filter((m) => m.uid !== toUid) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send a request.');
    } finally {
      setSendingTo(null);
    }
  };

  const handleAcceptRequest = async (request: IncomingRequest) => {
    setError(null);
    setAcceptingId(request.id);
    try {
      const { friendUid, friendDisplayName } = await acceptInvite(request.id);
      navigation.navigate('FriendConnected', {
        friend: { uid: friendUid, displayName: friendDisplayName, initials: initialsOf(friendDisplayName) },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept that request.');
    } finally {
      setAcceptingId(null);
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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {requests.length > 0 ? (
          <View style={{ gap: spacing.xs }}>
            <Text style={styles.sectionLabel}>FRIEND REQUESTS</Text>
            {requests.map((request) => (
              <View key={request.id} style={styles.requestRow}>
                <View style={styles.avatarSm}>
                  <Text style={styles.avatarSmText}>{initialsOf(request.fromDisplayName)}</Text>
                </View>
                <Text style={styles.requestName}>{request.fromDisplayName}</Text>
                <Pressable style={styles.acceptPill} onPress={() => handleAcceptRequest(request)} disabled={acceptingId === request.id}>
                  {acceptingId === request.id ? (
                    <ActivityIndicator size="small" color={colors.lavender600} />
                  ) : (
                    <>
                      <UserCheck size={13} color={colors.lavender600} />
                      <Text style={styles.acceptPillText}>Accept</Text>
                    </>
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        {!profile?.phoneKey ? (
          <View style={{ gap: spacing.xs }}>
            <Text style={styles.sectionLabel}>YOUR PHONE NUMBER</Text>
            <Text style={styles.helperText}>So friends can find you when they search their contacts.</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneInput}
                onChangeText={setPhoneInput}
              />
              <Pressable style={styles.saveButton} onPress={handleSavePhone} disabled={!phoneInput || savingPhone}>
                <Text style={styles.saveButtonLabel}>{savingPhone ? '...' : 'Save'}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>FIND FRIENDS</Text>
            <Pressable style={styles.linkCard} onPress={handleFindContacts} disabled={searchingContacts}>
              <View style={styles.linkCardLeft}>
                <View style={styles.linkIcon}>
                  <Search size={18} color={colors.lavender600} />
                </View>
                <View>
                  <Text style={styles.linkTitle}>Search your contacts</Text>
                  <Text style={styles.linkSubtitle}>Find friends already using With</Text>
                </View>
              </View>
              {searchingContacts ? <ActivityIndicator size="small" color={colors.lavender600} /> : null}
            </Pressable>

            {matches !== null ? (
              matches.length === 0 ? (
                <Text style={styles.helperText}>None of your contacts are on With yet.</Text>
              ) : (
                <View style={{ gap: spacing.xs }}>
                  {matches.map((match) => (
                    <View key={match.uid} style={styles.requestRow}>
                      <View style={styles.avatarSm}>
                        <Text style={styles.avatarSmText}>{initialsOf(match.displayName)}</Text>
                      </View>
                      <Text style={styles.requestName}>{match.displayName}</Text>
                      <Pressable style={styles.acceptPill} onPress={() => handleSendRequest(match.uid)} disabled={sendingTo === match.uid}>
                        <Text style={styles.acceptPillText}>{sendingTo === match.uid ? 'Sending...' : 'Send request'}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )
            ) : null}

            {recent.length > 0 ? (
              <View style={{ gap: spacing.xs }}>
                <Text style={styles.sectionLabel}>RECENT</Text>
                {recent.map((contact) => (
                  <View key={contact.toUid} style={styles.requestRow}>
                    <View style={styles.avatarSm}>
                      <Text style={styles.avatarSmText}>{initialsOf(contact.displayName)}</Text>
                    </View>
                    <Text style={styles.requestName}>{contact.displayName}</Text>
                    {contact.status === 'accepted' ? (
                      <Text style={styles.connectedLabel}>Connected</Text>
                    ) : (
                      <ChevronRight size={18} color="#9CA3AF" />
                    )}
                  </View>
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
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
  subtitle: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: spacing.xs },
  sectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: '#9CA3AF', marginTop: spacing.sm },
  helperText: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary },
  row: { flexDirection: 'row', gap: spacing.xs },
  linkCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkCardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  linkIcon: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.lavender100, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary },
  linkSubtitle: { fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary },
  requestRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarSm: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.lavender100, alignItems: 'center', justifyContent: 'center' },
  avatarSmText: { fontFamily: fonts.serif, fontSize: 13, color: colors.lavender800 },
  requestName: { flex: 1, fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary },
  connectedLabel: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#059669' },
  acceptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.lavender100,
  },
  acceptPillText: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.lavender700 },
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
  saveButton: { paddingHorizontal: spacing.md, borderRadius: radii.md, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  saveButtonLabel: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: '#fff' },
  error: { fontFamily: fonts.sans, color: '#B91C1C', fontSize: 13 },
});
