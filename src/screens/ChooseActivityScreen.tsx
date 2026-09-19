import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import type { RootStackParamList } from '@/navigation/types';
import { CURATED_ACTIVITIES } from '@/data';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseActivity'>;

export function ChooseActivityScreen({ navigation }: Props) {
  return (
    <Screen title="Choose an activity" subtitle="Pick something simple to do together.">
      <FlatList
        data={CURATED_ACTIVITIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('InviteFriend', { activity: item })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>{item.duration}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  cardMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardDescription: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
});
