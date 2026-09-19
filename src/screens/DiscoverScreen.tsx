import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { DiscoverItem } from '@/types';
import { colors, radii, spacing } from '@/theme';

const SECTION_TITLES: Record<DiscoverItem['section'], string> = {
  'for-you': 'For you two',
  experiences: 'Experiences',
  community: 'Community',
  'near-you': 'Near you',
};

export function DiscoverScreen() {
  const [items, setItems] = useState<DiscoverItem[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'discoverItems')).then((snapshot) => {
      setItems(snapshot.docs.map((docSnap) => docSnap.data() as DiscoverItem));
    });
  }, []);

  const sections = (['for-you', 'experiences', 'community', 'near-you'] as const)
    .map((section) => ({ title: SECTION_TITLES[section], data: items.filter((item) => item.section === section) }))
    .filter((section) => section.data.length > 0);

  return (
    <Screen title="Discover" subtitle="Curated ideas for you two.">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.xs },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, backgroundColor: colors.surface, marginBottom: spacing.sm },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
