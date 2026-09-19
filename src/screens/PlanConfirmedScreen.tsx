import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Calendar, Check, Sparkles } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { watchPlan } from '@/lib/plans';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { auth } from '@/lib/firebase';
import { colors, fonts, radii, spacing } from '@/theme';
import type { Plan } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanConfirmed'>;

function formatScheduledAt(scheduledAt: number): string {
  const d = new Date(scheduledAt);
  const day = d.toLocaleDateString(undefined, { weekday: 'long' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

/** Ported from the original prototype's PlanConfirmedScreen (git show cfaa64e:src/components/PlanConfirmedScreen.tsx). */
export function PlanConfirmedScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<(Plan & { id: string }) | null>(null);

  useEffect(() => watchPlan(planId, setPlan), [planId]);

  const otherUid = plan?.participants.find((uid) => uid !== auth.currentUser?.uid);
  const friendName = useFriendProfile(otherUid) ?? 'your friend';
  const friendFirstName = friendName.split(' ')[0];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>You + {friendFirstName}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.ring}>
          <View style={styles.ringInner}>
            <Check size={26} color="#fff" strokeWidth={2.6} />
          </View>
        </View>

        <Text style={styles.headline}>It's a plan.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{plan?.activityTitle ?? '...'}</Text>
          {plan ? (
            <View style={styles.cardMetaRow}>
              <Calendar size={15} color={colors.lavender600} />
              <Text style={styles.cardMetaText}>{formatScheduledAt(plan.scheduledAt)}</Text>
            </View>
          ) : null}
          <Text style={styles.cardFooterText}>You + {friendFirstName}</Text>
        </View>

        <Text style={styles.supportingText}>With will remind you before it's time.</Text>

        <Pressable
          style={styles.checkinLink}
          onPress={() => navigation.navigate('ActivityCheckin', { planId })}
        >
          <Sparkles size={12} color={colors.lavender800} />
          <Text style={styles.checkinLinkText}>Check-in flow</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.doneButton} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  nav: { height: 52, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.lavender600 },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: spacing.sm },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lavender100,
    borderWidth: 2,
    borderColor: colors.lavender200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  ringInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  headline: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 37, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },

  card: { width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: spacing.lg, alignItems: 'center', gap: 10, marginBottom: spacing.sm },
  cardTitle: { fontFamily: fonts.serifItalic, fontSize: 20, color: colors.textPrimary },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardMetaText: { fontFamily: fonts.sansMedium, fontSize: 14, color: '#4B5563' },
  cardFooterText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender700 },

  supportingText: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.textSecondary, textAlign: 'center', maxWidth: 280 },

  checkinLink: { marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.lavender100, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  checkinLinkText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender800 },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, alignItems: 'center', gap: 4 },
  doneButton: { width: '100%', height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  doneButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
});
