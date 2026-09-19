import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { watchOurStory } from '@/lib/memories';
import { auth } from '@/lib/firebase';
import { useConnectedFriend } from '@/lib/useConnectedFriend';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { EMOTIONAL_CONFIGS } from '@/data';
import type { SharedMemory } from '@/types';
import { colors, fonts, radii, spacing } from '@/theme';

/**
 * Ported from the original prototype's OurStoryScreen "Moments" tab (git
 * show cfaa64e:src/components/OurStoryScreen.tsx). The original also had
 * "Journal" and "Year in review" sub-tabs backed entirely by hardcoded
 * mock content with no data model behind them and no requirement in the
 * plan (R11 covers only the moments timeline) -- they're left out here
 * rather than shipped as fake, non-functional content.
 */
export function OurStoryScreen() {
  const uid = auth.currentUser?.uid;
  const friendUid = useConnectedFriend();
  const friendName = useFriendProfile(friendUid);
  const [memories, setMemories] = useState<(SharedMemory & { id: string })[]>([]);

  useEffect(() => {
    if (!uid) return undefined;
    return watchOurStory(uid, setMemories);
  }, [uid]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>You{friendName ? ` + ${friendName}` : ''}</Text>
        </View>
        <Text style={styles.subtitle}>{memories.length} moments shared</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {memories.length === 0 ? (
          <Text style={styles.emptyText}>No memories yet -- your first one will show up here.</Text>
        ) : (
          memories.map((memory) => {
            const userConfig = uid ? EMOTIONAL_CONFIGS[memory.emotions[uid] ?? 'calming'] : EMOTIONAL_CONFIGS.calming;
            const friendConfig = friendUid
              ? EMOTIONAL_CONFIGS[memory.emotions[friendUid] ?? 'fun']
              : EMOTIONAL_CONFIGS.fun;
            return (
              <View key={memory.id} style={styles.card}>
                {memory.photoUrl ? <Image source={{ uri: memory.photoUrl }} style={styles.photo} /> : null}
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{memory.activityTitle}</Text>
                  <Text style={styles.cardDate}>{new Date(memory.occurredAt).toLocaleDateString()}</Text>
                </View>
                {memory.note ? <Text style={styles.cardNote}>"{memory.note}"</Text> : null}
                <View style={styles.tagsRow}>
                  <View style={[styles.emotionTag, { backgroundColor: userConfig.bgColor }]}>
                    <View style={[styles.emotionDot, { backgroundColor: userConfig.dotColor }]} />
                    <Text style={[styles.emotionTagText, { color: userConfig.textColor }]}>You: {userConfig.label}</Text>
                  </View>
                  {friendName ? (
                    <View style={[styles.emotionTag, { backgroundColor: friendConfig.bgColor }]}>
                      <View style={[styles.emotionDot, { backgroundColor: friendConfig.dotColor }]} />
                      <Text style={[styles.emotionTagText, { color: friendConfig.textColor }]}>
                        {friendName}: {friendConfig.label}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.sm, gap: spacing.xs },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fonts.serifItalic, fontSize: 26, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  photo: { width: '100%', height: 140, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontFamily: fonts.serif, fontSize: 17, color: colors.textPrimary },
  cardDate: { fontFamily: fonts.sans, fontSize: 11.5, color: '#9CA3AF' },
  cardNote: { fontFamily: fonts.sans, fontStyle: 'italic', fontSize: 13, color: '#4B5563', lineHeight: 18 },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  emotionTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.sm },
  emotionDot: { width: 6, height: 6, borderRadius: 3 },
  emotionTagText: { fontFamily: fonts.sansMedium, fontSize: 11 },
});
