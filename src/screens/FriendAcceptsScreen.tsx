import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Calendar, Check, Clock, MessageSquare, X } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { acceptPlan, counterProposePlan, watchPlan } from '@/lib/plans';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { auth } from '@/lib/firebase';
import { CURATED_ACTIVITIES } from '@/data';
import { colors, fonts, radii, spacing } from '@/theme';
import type { Plan } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendAccepts'>;

function formatScheduledAt(scheduledAt: number): string {
  const d = new Date(scheduledAt);
  const day = d.toLocaleDateString(undefined, { weekday: 'long' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

function nextWeekday(targetDay: number, hour: number, minute: number): number {
  const d = new Date();
  const daysUntil = (targetDay - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntil);
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
}

/** Ported from the original prototype's FriendAcceptsScreen (git show cfaa64e:src/components/FriendAcceptsScreen.tsx). */
export function FriendAcceptsScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const [plan, setPlan] = useState<(Plan & { id: string }) | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => watchPlan(planId, setPlan), [planId]);

  const otherUid = plan?.participants.find((uid) => uid !== auth.currentUser?.uid);
  const friendName = useFriendProfile(otherUid) ?? 'your friend';
  const friendFirstName = friendName.split(' ')[0];
  const friendInitials = friendFirstName.slice(0, 2).toUpperCase();

  const activityMeta = CURATED_ACTIVITIES.find((activity) => activity.id === plan?.activityId);

  const alternateTimes = [
    { label: 'Saturday · 6:00 PM', scheduledAt: nextWeekday(6, 18, 0) },
    { label: 'Saturday · 7:15 PM', scheduledAt: nextWeekday(6, 19, 15) },
    { label: 'Sunday · 11:00 AM', scheduledAt: nextWeekday(0, 11, 0) },
    { label: 'Sunday · 5:30 PM', scheduledAt: nextWeekday(0, 17, 30) },
  ];

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await acceptPlan(planId);
      navigation.navigate('MakePlan', { planId });
    } finally {
      setAccepting(false);
    }
  };

  const handlePickTime = async (scheduledAt: number) => {
    setShowTimeModal(false);
    await counterProposePlan(planId, scheduledAt);
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
        <View style={styles.pill}>
          <Text style={styles.pillText}>Friend Agency</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.senderRow}>
          <View style={styles.senderAvatar}>
            <Text style={styles.senderAvatarText}>{friendInitials}</Text>
          </View>
          <Text style={styles.senderText}>Plan with {friendFirstName}</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.durationPill}>
            <Text style={styles.durationPillText}>{activityMeta?.duration ?? 'Flexible'}</Text>
          </View>
          <Text style={styles.activityTitle}>{plan.activityTitle}</Text>
          <View style={styles.timePill}>
            <Calendar size={14} color={colors.lavender600} />
            <Text style={styles.timePillText}>{formatScheduledAt(plan.scheduledAt)}</Text>
          </View>
          {plan.note ? (
            <View style={styles.noteBox}>
              <MessageSquare size={14} color="#9CA3AF" />
              <Text style={styles.noteText}>&ldquo;{plan.note}&rdquo;</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.helperText}>
          You can accept right away, adjust the time to your schedule, or suggest a different activity.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.acceptButton, accepting && styles.disabled]} onPress={handleAccept} disabled={accepting}>
          <Check size={18} color="#fff" />
          <Text style={styles.acceptButtonText}>{accepting ? 'Accepting...' : 'Accept'}</Text>
        </Pressable>
        <Pressable style={styles.suggestTimeButton} onPress={() => setShowTimeModal(true)}>
          <Clock size={15} color={colors.lavender600} />
          <Text style={styles.suggestTimeButtonText}>Suggest another time</Text>
        </Pressable>
        <Pressable style={styles.suggestActivityLink} onPress={() => navigation.navigate('ChooseActivity')}>
          <Text style={styles.suggestActivityLinkText}>Suggest another activity</Text>
        </Pressable>
      </View>

      <Modal visible={showTimeModal} animationType="slide" transparent onRequestClose={() => setShowTimeModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowTimeModal(false)}>
          <Pressable style={styles.timeModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.timeModalHeader}>
              <Text style={styles.timeModalTitle}>Choose another time</Text>
              <Pressable onPress={() => setShowTimeModal(false)} accessibilityLabel="Close">
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
            <View style={{ gap: spacing.sm }}>
              {alternateTimes.map((option) => {
                const isSelected = option.scheduledAt === plan.scheduledAt;
                return (
                  <Pressable
                    key={option.label}
                    style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                    onPress={() => handlePickTime(option.scheduledAt)}
                  >
                    <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  nav: { height: 52, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  senderAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.amber50, alignItems: 'center', justifyContent: 'center' },
  senderAvatarText: { fontFamily: fonts.serif, fontSize: 11, color: colors.amber700 },
  senderText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textSecondary },

  activityCard: { width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: spacing.lg, alignItems: 'center', gap: 10 },
  durationPill: { backgroundColor: colors.lavender100, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 2 },
  durationPillText: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: colors.lavender600, textTransform: 'uppercase' },
  activityTitle: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 32, color: colors.textPrimary, textAlign: 'center' },
  timePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  timePillText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.textPrimary },
  noteBox: { width: '100%', marginTop: 4, padding: 12, borderRadius: 12, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  noteText: { flex: 1, fontFamily: fonts.sans, fontStyle: 'italic', fontSize: 13, color: '#4B5563' },

  helperText: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.sm },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: 10 },
  acceptButton: { height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  acceptButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
  disabled: { opacity: 0.6 },
  suggestTimeButton: { height: 46, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  suggestTimeButtonText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.textPrimary },
  suggestActivityLink: { alignItems: 'center', paddingVertical: 6 },
  suggestActivityLinkText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.textSecondary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  timeModal: { backgroundColor: colors.canvas, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, gap: spacing.md },
  timeModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  timeModalTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary },
  timeOption: { padding: 14, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  timeOptionSelected: { borderColor: colors.lavender600 },
  timeOptionText: { fontFamily: fonts.sans, fontSize: 14, color: '#4B5563' },
  timeOptionTextSelected: { fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
});
