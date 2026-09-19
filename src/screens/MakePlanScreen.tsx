import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Calendar, Check, ChevronLeft, FileText, Repeat } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { finalizePlan, watchPlan } from '@/lib/plans';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { auth } from '@/lib/firebase';
import { CURATED_ACTIVITIES } from '@/data';
import { colors, fonts, radii, spacing } from '@/theme';
import type { Plan } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MakePlan'>;

const RECURRENCE_OPTIONS: { id: NonNullable<Plan['recurrence']>; label: string }[] = [
  { id: 'none', label: 'No repeat' },
  { id: 'daily', label: 'Every day' },
  { id: 'weekly', label: 'Every week' },
  { id: 'monthly', label: 'Every month' },
];

const DURATION_OPTIONS: NonNullable<Plan['recurrenceDuration']>[] = ['1 week', '2 weeks', '1 month', '3 months'];

function formatScheduledAt(scheduledAt: number): string {
  const d = new Date(scheduledAt);
  const day = d.toLocaleDateString(undefined, { weekday: 'long' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

/** Ported from the original prototype's MakePlanScreen (git show cfaa64e:src/components/MakePlanScreen.tsx). */
export function MakePlanScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<(Plan & { id: string }) | null>(null);
  const [recurrence, setRecurrence] = useState<NonNullable<Plan['recurrence']>>('weekly');
  const [recurrenceDuration, setRecurrenceDuration] = useState<NonNullable<Plan['recurrenceDuration']>>('1 month');
  const [note, setNote] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => watchPlan(planId, setPlan), [planId]);
  useEffect(() => {
    if (plan?.note) setNote(plan.note);
  }, [plan?.note]);

  const otherUid = plan?.participants.find((uid) => uid !== auth.currentUser?.uid);
  const friendName = useFriendProfile(otherUid) ?? 'your friend';
  const friendFirstName = friendName.split(' ')[0];
  const activityMeta = CURATED_ACTIVITIES.find((activity) => activity.id === plan?.activityId);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await finalizePlan(planId, { note: note || undefined, recurrence, recurrenceDuration });
      navigation.navigate('PlanConfirmed', { planId });
    } finally {
      setConfirming(false);
    }
  };

  if (!plan) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Finalize</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headlineBlock}>
          <Text style={styles.headline}>Make it a plan.</Text>
          <Text style={styles.subtitle}>Set the rhythm so you don't have to keep replanning from scratch.</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>{plan.activityTitle}</Text>
            <View style={styles.durationPill}>
              <Text style={styles.durationPillText}>{activityMeta?.duration ?? 'Flexible'}</Text>
            </View>
          </View>
          <View style={styles.summaryMetaRow}>
            <Calendar size={14} color={colors.lavender600} />
            <Text style={styles.summaryMetaText}>{formatScheduledAt(plan.scheduledAt)}</Text>
            <Text style={styles.summaryMetaDot}>&bull;</Text>
            <Text style={styles.summaryMetaText}>You + {friendFirstName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Repeat size={14} color={colors.lavender600} />
            <Text style={styles.sectionLabelText}>Repeat this activity?</Text>
          </View>
          <View style={styles.recurrenceGrid}>
            {RECURRENCE_OPTIONS.map((option) => {
              const isSelected = recurrence === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.recurrenceOption, isSelected && styles.recurrenceOptionSelected]}
                  onPress={() => setRecurrence(option.id)}
                >
                  <Text style={[styles.recurrenceOptionText, isSelected && styles.recurrenceOptionTextSelected]}>
                    {option.label}
                  </Text>
                  {isSelected ? <Check size={14} color={colors.lavender600} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {recurrence !== 'none' ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabelText}>For how long?</Text>
            <View style={styles.durationRow}>
              {DURATION_OPTIONS.map((duration) => {
                const isSelected = recurrenceDuration === duration;
                return (
                  <Pressable
                    key={duration}
                    style={[styles.durationChip, isSelected && styles.durationChipSelected]}
                    onPress={() => setRecurrenceDuration(duration)}
                  >
                    <Text style={[styles.durationChipText, isSelected && styles.durationChipTextSelected]}>{duration}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <FileText size={14} color={colors.lavender600} />
            <Text style={styles.sectionLabelText}>Add a note</Text>
          </View>
          <TextInput
            placeholder="e.g. Bring a water bottle, let's grab coffee afterward"
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
            style={styles.noteInput}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.confirmButton, confirming && styles.disabled]} onPress={handleConfirm} disabled={confirming}>
          <Text style={styles.confirmButtonText}>{confirming ? 'Setting plan...' : 'Set our plan'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  nav: { height: 52, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },

  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  headlineBlock: { gap: 6 },
  headline: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 33, color: colors.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13.5, lineHeight: 19, color: colors.textSecondary },

  summaryCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: spacing.md, gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryTitle: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.textPrimary },
  durationPill: { backgroundColor: colors.lavender100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  durationPillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  summaryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  summaryMetaText: { fontFamily: fonts.sansMedium, fontSize: 13, color: '#4B5563' },
  summaryMetaDot: { fontSize: 13, color: '#4B5563' },

  section: { gap: 8 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionLabelText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary },

  recurrenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recurrenceOption: {
    width: '48%',
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recurrenceOptionSelected: { borderWidth: 2, borderColor: colors.lavender600 },
  recurrenceOptionText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.textSecondary },
  recurrenceOptionTextSelected: { color: colors.textPrimary },

  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  durationChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  durationChipSelected: { backgroundColor: colors.lavender600, borderColor: colors.lavender600 },
  durationChipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#4B5563' },
  durationChipTextSelected: { color: '#fff' },

  noteInput: {
    minHeight: 64,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.sans,
    fontSize: 13.5,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  confirmButton: { height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  confirmButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
  disabled: { opacity: 0.6 },
});
