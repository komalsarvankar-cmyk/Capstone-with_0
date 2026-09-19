import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Calendar, Check, ChevronLeft, Clock, Send } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { proposePlan } from '@/lib/plans';
import { useConnectedFriend } from '@/lib/useConnectedFriend';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'InviteFriend'>;

const WHEN_OPTIONS = ['Today', 'Tomorrow', 'Saturday · 6:00 PM'] as const;
type WhenOption = (typeof WHEN_OPTIONS)[number];

function resolveScheduledAt(option: WhenOption): number {
  const now = new Date();
  if (option === 'Today') {
    const d = new Date(now);
    d.setHours(18, 0, 0, 0);
    return d.getTime();
  }
  if (option === 'Tomorrow') {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    return d.getTime();
  }
  const d = new Date(now);
  const daysUntilSaturday = (6 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  d.setHours(18, 0, 0, 0);
  return d.getTime();
}

/** Ported from the original prototype's InviteFriendScreen (git show cfaa64e:src/components/InviteFriendScreen.tsx). */
export function InviteFriendScreen({ route, navigation }: Props) {
  const { activity } = route.params;
  const friendUid = useConnectedFriend();
  const friendName = useFriendProfile(friendUid) ?? 'your friend';
  const friendFirstName = friendName.split(' ')[0];

  const [whenOption, setWhenOption] = useState<WhenOption>('Saturday · 6:00 PM');
  const [note, setNote] = useState('Want to try the new park?');
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
      const scheduledAt = resolveScheduledAt(whenOption);
      const planId = await proposePlan(friendUid, activity, scheduledAt, note || undefined);
      navigation.navigate('FriendAccepts', { planId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the invitation.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Initiating Activity</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroCardHeader}>
            <Text style={styles.heroCardLabel}>SELECTED ACTIVITY</Text>
            <View style={styles.durationPill}>
              <Clock size={12} color={colors.lavender800} />
              <Text style={styles.durationPillText}>{activity.duration}</Text>
            </View>
          </View>
          <Text style={styles.heroCardTitle}>{activity.title}</Text>
          <Text style={styles.heroCardDescription}>{activity.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Calendar size={15} color={colors.lavender600} />
            <Text style={styles.sectionLabelText}>When?</Text>
          </View>
          <View style={{ gap: spacing.sm }}>
            {WHEN_OPTIONS.map((option) => {
              const isSelected = whenOption === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setWhenOption(option)}
                  style={[styles.whenOption, isSelected && styles.whenOptionSelected]}
                >
                  <Text style={[styles.whenOptionText, isSelected && styles.whenOptionTextSelected]}>{option}</Text>
                  {isSelected ? (
                    <View style={styles.whenCheck}>
                      <Check size={12} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.whenRadio} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabelText}>
            Add a note <Text style={styles.optionalText}>(optional)</Text>
          </Text>
          <TextInput
            placeholder="e.g. Want to try the new park?"
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            style={styles.noteInput}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.sendButton, sending && styles.disabled]} onPress={handleSend} disabled={sending}>
          <Send size={16} color="#fff" />
          <Text style={styles.sendButtonText}>{sending ? 'Sending...' : `Send to ${friendFirstName}`}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  nav: { height: 52, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.lg },

  heroCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: spacing.lg, gap: 8 },
  heroCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroCardLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: colors.lavender600 },
  durationPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.lavender100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  durationPillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender800 },
  heroCardTitle: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 30, color: colors.textPrimary },
  heroCardDescription: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.textSecondary },

  section: { gap: 10 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionLabelText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary },
  optionalText: { fontFamily: fonts.sans, fontSize: 12, fontWeight: '400', color: '#9CA3AF' },

  whenOption: {
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whenOptionSelected: { borderWidth: 2, borderColor: colors.lavender600 },
  whenOptionText: { fontFamily: fonts.sans, fontSize: 14, color: '#4B5563' },
  whenOptionTextSelected: { fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  whenCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  whenRadio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },

  noteInput: {
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.textPrimary,
  },
  error: { fontFamily: fonts.sans, fontSize: 13, color: '#B91C1C' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  sendButton: {
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.lavender600,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
  disabled: { opacity: 0.6 },
});
