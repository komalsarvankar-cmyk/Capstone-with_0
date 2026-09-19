import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { watchOurStory } from '@/lib/memories';
import { auth } from '@/lib/firebase';
import type { SharedMemory } from '@/types';
import { colors, radii, spacing } from '@/theme';

export function OurStoryScreen() {
  const [memories, setMemories] = useState<(SharedMemory & { id: string })[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;
    return watchOurStory(uid, setMemories);
  }, []);

  return (
    <Screen title="Our Story" subtitle="Everything you've shared together.">
      {memories.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>No memories yet -- your first one will show up here.</Text>
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.photoUrl ? <Image source={{ uri: item.photoUrl }} style={styles.photo} /> : null}
              <Text style={styles.title}>{item.activityTitle}</Text>
              {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, backgroundColor: colors.surface },
  photo: { width: '100%', height: 160, borderRadius: radii.sm, marginBottom: spacing.sm },
  title: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  note: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
