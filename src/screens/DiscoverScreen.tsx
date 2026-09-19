import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '@/lib/firebase';
import type { DiscoverItem } from '@/types';
import { colors, fonts, radii, spacing } from '@/theme';

const SECTIONS: { id: DiscoverItem['section']; label: string }[] = [
  { id: 'for-you', label: 'For you two' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'community', label: 'Community' },
  { id: 'near-you', label: 'Near you' },
];

/** Ported from the original prototype's DiscoverScreen (git show cfaa64e:src/components/DiscoverScreen.tsx). */
export function DiscoverScreen() {
  const [section, setSection] = useState<DiscoverItem['section']>('for-you');
  const [items, setItems] = useState<DiscoverItem[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'discoverItems')).then((snapshot) => {
      setItems(snapshot.docs.map((docSnap) => docSnap.data() as DiscoverItem));
    });
  }, []);

  const visibleItems = items.filter((item) => item.section === section);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Inspiration and gentle spaces for friends.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 6 }}>
        {SECTIONS.map((tab) => {
          const active = tab.id === section;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setSection(tab.id)}
              style={[styles.filterPill, active && styles.filterPillActive]}
            >
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {visibleItems.length === 0 ? (
          <Text style={styles.emptyText}>Nothing here yet -- check back soon.</Text>
        ) : (
          visibleItems.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge.toUpperCase()}</Text>
                </View>
              ) : null}
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              <Text style={styles.cardMeta}>
                {item.dateTime}
                {item.location ? ` • ${item.location}` : ''} • {item.duration}
              </Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.sm, gap: spacing.xs },
  title: { fontFamily: fonts.serifItalic, fontSize: 26, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary },
  filterRow: { flexGrow: 0, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: { backgroundColor: colors.lavender600, borderColor: colors.lavender600 },
  filterLabel: { fontFamily: fonts.sansMedium, fontSize: 12.5, color: colors.textSecondary },
  filterLabelActive: { color: '#fff', fontFamily: fonts.sansSemiBold },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 4,
  },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.lavender100, borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 2 },
  badgeText: { fontFamily: fonts.sansSemiBold, fontSize: 10, color: colors.lavender700 },
  cardTitle: { fontFamily: fonts.serif, fontSize: 17, color: colors.textPrimary },
  cardSubtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary },
  cardMeta: { fontFamily: fonts.sans, fontSize: 11.5, color: '#9CA3AF' },
  cardDescription: { fontFamily: fonts.sans, fontSize: 13, color: '#4B5563', lineHeight: 19, marginTop: 4 },
});
