import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Clock, Plus } from 'lucide-react-native';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/Logo';
import { ActivityIcon } from '@/lib/activityIcons';
import { CURATED_ACTIVITIES, EMOTIONAL_CONFIGS } from '@/data';
import { auth } from '@/lib/firebase';
import { useConnectedFriend } from '@/lib/useConnectedFriend';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { watchCurrentPlan } from '@/lib/plans';
import { watchOurStory } from '@/lib/memories';
import type { Plan, SharedMemory } from '@/types';
import { colors, fonts, radii, spacing } from '@/theme';

const QUICK_ACTIVITIES = CURATED_ACTIVITIES.slice(0, 2);

function formatScheduledAt(ms: number): string {
  const date = new Date(ms);
  return `${date.toLocaleDateString(undefined, { weekday: 'long' })} · ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

/** Ported from the original prototype's HomeScreen (git show cfaa64e:src/components/HomeScreen.tsx). */
export function HomeScreen() {
  const navigation = useNavigation<any>();
  const uid = auth.currentUser?.uid;
  const friendUid = useConnectedFriend();
  const friendName = useFriendProfile(friendUid);
  const [currentPlan, setCurrentPlan] = useState<(Plan & { id: string }) | null>(null);
  const [memories, setMemories] = useState<(SharedMemory & { id: string })[]>([]);

  useEffect(() => {
    if (!uid) return undefined;
    return watchCurrentPlan(uid, setCurrentPlan);
  }, [uid]);

  useEffect(() => {
    if (!uid) return undefined;
    return watchOurStory(uid, setMemories);
  }, [uid]);

  const latestMemory = memories[0];
  const userEmotionConfig = uid && latestMemory ? EMOTIONAL_CONFIGS[latestMemory.emotions[uid] ?? 'calming'] : undefined;
  const friendEmotionConfig =
    friendUid && latestMemory ? EMOTIONAL_CONFIGS[latestMemory.emotions[friendUid] ?? 'fun'] : undefined;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Logo size={24} />
        {friendName ? (
          <View style={styles.friendPill}>
            <View style={styles.friendDot} />
            <Text style={styles.friendPillText}>You + {friendName}</Text>
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {memories.length > 0 ? (
          <View style={styles.trailCard}>
            <Text style={styles.trailLabel}>Recent emotional rhythm:</Text>
            <View style={styles.trailDots}>
              {memories.slice(0, 5).map((mem) => {
                const conf = uid ? EMOTIONAL_CONFIGS[mem.emotions[uid] ?? 'calming'] : EMOTIONAL_CONFIGS.calming;
                return <View key={mem.id} style={[styles.trailDot, { backgroundColor: conf.dotColor }]} />;
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR NEXT MOMENT</Text>
          {currentPlan ? (
            <View style={styles.nextMomentCard}>
              <View style={styles.nextMomentTopRow}>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>UPCOMING</Text>
                </View>
                <View style={styles.metaRow}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{currentPlan.status}</Text>
                </View>
              </View>
              <Text style={styles.planTitle}>{currentPlan.activityTitle}</Text>
              <View style={styles.metaRow}>
                <Calendar size={13} color={colors.lavender600} />
                <Text style={styles.metaText}>{formatScheduledAt(currentPlan.scheduledAt)}</Text>
                {friendName ? <Text style={styles.metaText}> • With {friendName}</Text> : null}
              </View>
              {currentPlan.note ? <Text style={styles.noteText}>"{currentPlan.note}"</Text> : null}
              <View style={styles.planActions}>
                <Pressable
                  style={[styles.planActionButton, styles.planActionSecondary]}
                  onPress={() => navigation.navigate('PlanConfirmed', { planId: currentPlan.id })}
                >
                  <Text style={styles.planActionSecondaryLabel}>View plan</Text>
                </Pressable>
                <Pressable
                  style={[styles.planActionButton, styles.planActionPrimary]}
                  onPress={() => navigation.navigate('ActivityCheckin', { planId: currentPlan.id })}
                >
                  <Text style={styles.planActionPrimaryLabel}>Check-in now</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.emptyPlanCard}>
              <Text style={styles.emptyPlanTitle}>No moment planned yet</Text>
              <Text style={styles.emptyPlanBody}>
                Ready to find a small activity to share{friendName ? ` with ${friendName}` : ''}?
              </Text>
              <Pressable style={styles.planSomethingButton} onPress={() => navigation.navigate('ChooseActivity')}>
                <Plus size={15} color="#fff" />
                <Text style={styles.planSomethingLabel}>Plan something</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>SOMETHING YOU COULD DO NEXT</Text>
            <Pressable onPress={() => navigation.navigate('ChooseActivity')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <View style={{ gap: spacing.sm }}>
            {QUICK_ACTIVITIES.map((activity) => (
              <View key={activity.id} style={styles.quickActivityCard}>
                <View style={styles.quickActivityLeft}>
                  <View style={styles.quickActivityIcon}>
                    <ActivityIcon iconName={activity.iconName} size={18} />
                  </View>
                  <View>
                    <Text style={styles.quickActivityTitle}>{activity.title}</Text>
                    <Text style={styles.quickActivityMeta}>
                      {activity.duration} • {activity.tags[0]}
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={styles.planThisButton}
                  onPress={() => navigation.navigate('InviteFriend', { activity })}
                >
                  <Text style={styles.planThisLabel}>Plan this</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {latestMemory && userEmotionConfig && friendEmotionConfig ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECENT MOMENT</Text>
            <View style={styles.memoryCard}>
              <View style={styles.memoryTopRow}>
                <Text style={styles.memoryTitle}>{latestMemory.activityTitle}</Text>
              </View>
              {latestMemory.note ? <Text style={styles.memoryNote}>"{latestMemory.note}"</Text> : null}
              <View style={styles.memoryTagsRow}>
                <View style={[styles.emotionTag, { backgroundColor: userEmotionConfig.bgColor }]}>
                  <View style={[styles.emotionDot, { backgroundColor: userEmotionConfig.dotColor }]} />
                  <Text style={[styles.emotionTagText, { color: userEmotionConfig.textColor }]}>
                    You: {userEmotionConfig.label}
                  </Text>
                </View>
                {friendName ? (
                  <View style={[styles.emotionTag, { backgroundColor: friendEmotionConfig.bgColor }]}>
                    <View style={[styles.emotionDot, { backgroundColor: friendEmotionConfig.dotColor }]} />
                    <Text style={[styles.emotionTagText, { color: friendEmotionConfig.textColor }]}>
                      {friendName}: {friendEmotionConfig.label}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: {
    height: 52,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.lavender100,
  },
  friendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lavender600 },
  friendPillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender800 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  trailCard: {
    padding: 10,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trailLabel: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.textSecondary },
  trailDots: { flexDirection: 'row', gap: 6 },
  trailDot: { width: 12, height: 12, borderRadius: 6 },
  section: { gap: spacing.sm },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: '#9CA3AF' },
  seeAll: { fontFamily: fonts.sansMedium, fontSize: 11.5, color: colors.lavender600 },
  nextMomentCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lavender200,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 10,
  },
  nextMomentTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  upcomingBadge: { backgroundColor: colors.lavender100, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 2 },
  upcomingBadgeText: { fontFamily: fonts.sansSemiBold, fontSize: 11, color: colors.lavender600 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary },
  planTitle: { fontFamily: fonts.serif, fontSize: 22, color: colors.textPrimary },
  noteText: {
    fontFamily: fonts.sans,
    fontStyle: 'italic',
    fontSize: 12.5,
    color: '#4B5563',
    backgroundColor: colors.canvas,
    padding: 10,
    borderRadius: radii.md,
  },
  planActions: { flexDirection: 'row', gap: spacing.sm },
  planActionButton: { flex: 1, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  planActionSecondary: { backgroundColor: colors.lavender100 },
  planActionSecondaryLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.lavender800 },
  planActionPrimary: { backgroundColor: colors.lavender600 },
  planActionPrimaryLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: '#fff' },
  emptyPlanCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lavender200,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyPlanTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.textPrimary },
  emptyPlanBody: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary, textAlign: 'center', maxWidth: 240 },
  planSomethingButton: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.lavender600,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  planSomethingLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: '#fff' },
  quickActivityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickActivityLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  quickActivityIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActivityTitle: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.textPrimary },
  quickActivityMeta: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.textSecondary },
  planThisButton: { backgroundColor: colors.lavender100, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill },
  planThisLabel: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.lavender800 },
  memoryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  memoryTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  memoryTitle: { fontFamily: fonts.serifRegularItalic, fontSize: 15, color: colors.textPrimary },
  memoryNote: { fontFamily: fonts.sans, fontSize: 12.5, color: '#4B5563', lineHeight: 18 },
  memoryTagsRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  emotionTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 2, borderRadius: radii.sm },
  emotionDot: { width: 6, height: 6, borderRadius: 3 },
  emotionTagText: { fontFamily: fonts.sansMedium, fontSize: 11 },
});
