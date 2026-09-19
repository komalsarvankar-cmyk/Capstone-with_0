import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { CURATED_ACTIVITIES } from '@/data';
import { fetchAiSuggestions, type ActivitySuggestion } from '@/lib/activities';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseActivity'>;

type AiState = 'idle' | 'loading' | 'error' | 'empty' | 'ready';

export function ChooseActivityScreen({ navigation }: Props) {
  const [aiState, setAiState] = useState<AiState>('idle');
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);

  const handleAiIdeas = async () => {
    setAiState('loading');
    try {
      const recentTitles = CURATED_ACTIVITIES.slice(0, 2).map((activity) => activity.title);
      const results = await fetchAiSuggestions(recentTitles);
      setSuggestions(results);
      setAiState(results.length === 0 ? 'empty' : 'ready');
    } catch {
      setAiState('error'); // U5 test scenario: fall back to the curated list, not a crash
    }
  };

  return (
    <Screen title="Choose an activity" subtitle="Pick something simple to do together.">
      <PrimaryButton
        label={aiState === 'loading' ? 'Thinking of ideas...' : 'Get AI ideas'}
        variant="secondary"
        onPress={handleAiIdeas}
        loading={aiState === 'loading'}
      />

      {aiState === 'error' ? (
        <Text style={styles.notice}>Couldn't get AI ideas right now -- here's the curated list instead.</Text>
      ) : null}
      {aiState === 'empty' ? <Text style={styles.notice}>No AI ideas this time -- try the curated list below.</Text> : null}
      {aiState === 'ready' && suggestions.length > 0 ? (
        <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
          {suggestions.map((suggestion) => (
            <View key={suggestion.title} style={[styles.card, styles.aiCard]}>
              <Text style={styles.cardTitle}>{suggestion.title}</Text>
              <Text style={styles.cardDescription}>{suggestion.description}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <FlatList
        data={CURATED_ACTIVITIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('InviteFriend', { activity: item })}
            accessibilityRole="button"
            accessibilityLabel={item.title}
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
  aiCard: { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  cardMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardDescription: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  notice: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
});
