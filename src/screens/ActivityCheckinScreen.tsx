import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronLeft } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import type { EmotionalState, Plan } from '@/types';
import { completePlan, watchPlan } from '@/lib/plans';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { auth } from '@/lib/firebase';
import { EMOTIONAL_CONFIGS } from '@/data';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityCheckin'>;

type DidDoIt = 'yes' | 'not-this-time' | 'something-else';

const DID_DO_IT_OPTIONS: { id: DidDoIt; label: string }[] = [
  { id: 'yes', label: 'Yes, we did' },
  { id: 'not-this-time', label: 'Not this time' },
  { id: 'something-else', label: 'We did something else' },
];

const EMOTIONS: EmotionalState[] = ['fun', 'calming', 'meaningful', 'unexpected', 'just-nice'];

/** Ported from the original prototype's ActivityCheckinScreen (git show cfaa64e:src/components/ActivityCheckinScreen.tsx). */
export function ActivityCheckinScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<(Plan & { id: string }) | null>(null);
  const [didDoIt, setDidDoIt] = useState<DidDoIt>('yes');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState>('calming');
  const [saving, setSaving] = useState(false);

  useEffect(() => watchPlan(planId, setPlan), [planId]);

  const otherUid = plan?.participants.find((uid) => uid !== auth.currentUser?.uid);
  const friendName = useFriendProfile(otherUid) ?? 'your friend';

  const handleContinue = async () => {
    if (didDoIt !== 'yes') {
      navigation.navigate('Main');
      return;
    }
    setSaving(true);
    try {
      await completePlan(planId);
      navigation.navigate('CaptureMoment', {
        planId,
        activityTitle: plan?.activityTitle ?? 'Activity',
        emotion: selectedEmotion,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Activity Check-in</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.contextText}>
          {plan?.activityTitle ?? '...'} &bull; with {friendName}
        </Text>

        <Text style={styles.headline}>How did it feel?</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabelText}>Did you do it?</Text>
          <View style={{ gap: spacing.sm }}>
            {DID_DO_IT_OPTIONS.map((option) => {
              const isSelected = didDoIt === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.choiceOption, isSelected && styles.choiceOptionSelected]}
                  onPress={() => setDidDoIt(option.id)}
                >
                  <Text style={[styles.choiceOptionText, isSelected && styles.choiceOptionTextSelected]}>{option.label}</Text>
                  {isSelected ? (
                    <View style={styles.choiceCheck}>
                      <Check size={12} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.choiceRadio} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {didDoIt === 'yes' ? (
          <View style={styles.section}>
            <View>
              <Text style={styles.sectionLabelText}>How did it feel?</Text>
              <Text style={styles.sectionSubtext}>Choose an emotional tone that will color your shared story.</Text>
            </View>
            <View style={{ gap: 10 }}>
              {EMOTIONS.map((key) => {
                const conf = EMOTIONAL_CONFIGS[key];
                const isSelected = selectedEmotion === key;
                return (
                  <Pressable
                    key={key}
                    style={[
                      styles.emotionCard,
                      { borderColor: isSelected ? conf.dotColor : colors.border, backgroundColor: isSelected ? conf.bgColor : '#fff' },
                    ]}
                    onPress={() => setSelectedEmotion(key)}
                  >
                    <View style={styles.emotionCardLeft}>
                      <View style={[styles.emotionDot, { backgroundColor: conf.dotColor }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.emotionLabel, isSelected && { color: conf.textColor }]}>{conf.label}</Text>
                        <Text style={styles.emotionDescription}>{conf.description}</Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <View style={[styles.emotionCheck, { backgroundColor: conf.dotColor }]}>
                        <Check size={14} color="#fff" />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.continueButton, saving && styles.disabled]} onPress={handleContinue} disabled={saving}>
          <Text style={styles.continueButtonText}>
            {saving ? 'Saving...' : didDoIt === 'yes' ? 'Next: Capture the moment' : 'Finish check-in'}
          </Text>
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
  contextText: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.textSecondary, marginBottom: -8 },
  headline: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 35, color: colors.textPrimary, letterSpacing: -0.3 },

  section: { gap: 10 },
  sectionLabelText: { fontFamily: fonts.sansSemiBold, fontSize: 13.5, color: colors.textPrimary },
  sectionSubtext: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  choiceOption: {
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
  choiceOptionSelected: { borderWidth: 2, borderColor: colors.lavender600 },
  choiceOptionText: { fontFamily: fonts.sans, fontSize: 14, color: '#4B5563' },
  choiceOptionTextSelected: { fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  choiceCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  choiceRadio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' },

  emotionCard: { padding: 14, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  emotionCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  emotionDot: { width: 16, height: 16, borderRadius: 8 },
  emotionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.textPrimary },
  emotionDescription: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  emotionCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  continueButton: { height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  continueButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
  disabled: { opacity: 0.6 },
});
