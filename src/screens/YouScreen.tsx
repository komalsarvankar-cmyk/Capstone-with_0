import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { signOut } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { useConnectedFriend } from '@/lib/useConnectedFriend';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { initialsOf } from '@/lib/initials';
import { colors, fonts, radii, spacing } from '@/theme';

function initialsForAccount(nameOrEmail: string): string {
  const base = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  return initialsOf(base);
}

/**
 * Ported from the original prototype's YouScreen (git show
 * cfaa64e:src/components/YouScreen.tsx). The notification toggles below
 * were local-only mock state in the original too (nothing persisted them
 * server-side there either), so they keep that same fidelity here rather
 * than being wired to a preferences feature the plan never scoped.
 */
export function YouScreen() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const friendUid = useConnectedFriend();
  const friendName = useFriendProfile(friendUid);
  const email = auth.currentUser?.email ?? '';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>You</Text>
        <Text style={styles.subtitle}>Preferences and gentle rhythms.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsForAccount(email || 'You')}</Text>
            </View>
            <View>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>

          {friendName ? (
            <View style={styles.friendRow}>
              <View style={styles.friendLeft}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>{initialsOf(friendName)}</Text>
                </View>
                <Text style={styles.friendLabel}>Friend: {friendName}</Text>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Active pair</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GENTLE NOTIFICATIONS</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>30-minute activity reminder</Text>
                <Text style={styles.settingSubtitle}>Gives you time to get ready without stress</Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ true: colors.lavender600 }}
              />
            </View>
            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Calendar sync</Text>
                <Text style={styles.settingSubtitle}>Add confirmed plans directly to device calendar</Text>
              </View>
              <Switch value={calendarSync} onValueChange={setCalendarSync} trackColor={{ true: colors.lavender600 }} />
            </View>
          </View>
        </View>

        <PrimaryButton label="Sign out" variant="ghost" onPress={() => signOut()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.sm, gap: spacing.xs },
  title: { fontFamily: fonts.serifItalic, fontSize: 26, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lavender100, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.serif, fontSize: 18, color: colors.lavender800 },
  profileEmail: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary },
  friendRow: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  friendAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.amber50, alignItems: 'center', justifyContent: 'center' },
  friendAvatarText: { fontFamily: fonts.serif, fontSize: 12, color: colors.amber700 },
  friendLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary },
  activePill: { backgroundColor: colors.lavender100, borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 2 },
  activePillText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.lavender600 },
  section: { gap: spacing.sm },
  sectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: '#9CA3AF' },
  settingsCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, gap: spacing.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingRowBorder: { paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  settingText: { flex: 1, paddingRight: spacing.sm },
  settingTitle: { fontFamily: fonts.sansMedium, fontSize: 13.5, color: colors.textPrimary },
  settingSubtitle: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.textSecondary },
});
