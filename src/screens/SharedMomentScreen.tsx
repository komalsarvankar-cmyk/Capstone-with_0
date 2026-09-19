import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image as RNImage, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BookHeart, Calendar } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { watchMemory } from '@/lib/memories';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { auth } from '@/lib/firebase';
import { EMOTIONAL_CONFIGS } from '@/data';
import { colors, fonts, radii, spacing } from '@/theme';
import type { SharedMemory } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SharedMoment'>;

function formatOccurredAt(occurredAt: number): string {
  const d = new Date(occurredAt);
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

/** Ported from the original prototype's SharedMomentScreen (git show cfaa64e:src/components/SharedMomentScreen.tsx). */
export function SharedMomentScreen({ route, navigation }: Props) {
  const { memoryId } = route.params;
  const [memory, setMemory] = useState<(SharedMemory & { id: string }) | null>(null);

  useEffect(() => watchMemory(memoryId, setMemory), [memoryId]);

  const uid = auth.currentUser?.uid;
  const otherUid = memory?.participants.find((participantUid) => participantUid !== uid);
  const friendName = useFriendProfile(otherUid) ?? 'your friend';
  const friendFirstName = friendName.split(' ')[0];

  const userEmotionKey = uid ? memory?.emotions[uid] : undefined;
  const friendEmotionKey = otherUid ? memory?.emotions[otherUid] : undefined;
  const userConf = userEmotionKey ? EMOTIONAL_CONFIGS[userEmotionKey] : undefined;
  const friendConf = friendEmotionKey ? EMOTIONAL_CONFIGS[friendEmotionKey] : undefined;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Shared Memory</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headline}>A little moment, shared.</Text>

        <View style={styles.card}>
          {memory?.photoUrl ? (
            <View style={styles.photoWrap}>
              <RNImage source={{ uri: memory.photoUrl }} style={styles.photo} />
            </View>
          ) : null}

          <View>
            <Text style={styles.cardActivityTitle}>{memory?.activityTitle ?? '...'}</Text>
            {memory ? (
              <View style={styles.cardMetaRow}>
                <Calendar size={13} color={colors.lavender600} />
                <Text style={styles.cardMetaText}>{formatOccurredAt(memory.occurredAt)}</Text>
              </View>
            ) : null}
          </View>

          {memory?.note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>&ldquo;{memory.note}&rdquo;</Text>
            </View>
          ) : null}

          {userConf || friendConf ? (
            <View style={styles.emotionRow}>
              {userConf ? (
                <View style={[styles.emotionTag, { backgroundColor: userConf.bgColor, borderColor: userConf.borderColor }]}>
                  <View style={[styles.emotionDot, { backgroundColor: userConf.dotColor }]} />
                  <Text style={[styles.emotionTagText, { color: userConf.textColor }]} numberOfLines={1}>
                    You: {userConf.label}
                  </Text>
                </View>
              ) : null}
              {friendConf ? (
                <View style={[styles.emotionTag, { backgroundColor: friendConf.bgColor, borderColor: friendConf.borderColor }]}>
                  <View style={[styles.emotionDot, { backgroundColor: friendConf.dotColor }]} />
                  <Text style={[styles.emotionTagText, { color: friendConf.textColor }]} numberOfLines={1}>
                    {friendFirstName}: {friendConf.label}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        <Text style={styles.supportingText}>Added to your accumulated friendship story.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={() => navigation.navigate('Main')}>
          <BookHeart size={18} color="#fff" />
          <Text style={styles.saveButtonText}>Save to our story</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  nav: { height: 52, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },

  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
  headline: { fontFamily: fonts.serifItalic, fontSize: 30, lineHeight: 35, color: colors.textPrimary, textAlign: 'center' },

  card: { width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: spacing.lg, gap: 14 },
  photoWrap: { height: 150, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  photo: { width: '100%', height: '100%' },
  cardActivityTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  cardMetaText: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.textSecondary },
  noteBox: { backgroundColor: colors.canvas, borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 12 },
  noteText: { fontFamily: fonts.sans, fontStyle: 'italic', fontSize: 13, lineHeight: 19, color: '#4B5563' },

  emotionRow: { flexDirection: 'row', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  emotionTag: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  emotionDot: { width: 8, height: 8, borderRadius: 4 },
  emotionTagText: { fontFamily: fonts.sansMedium, fontSize: 12, flexShrink: 1 },

  supportingText: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 18, color: '#9CA3AF', textAlign: 'center', maxWidth: 280 },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  saveButton: { height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
});
