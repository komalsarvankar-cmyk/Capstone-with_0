import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/Logo';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { colors, fonts, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

/** Ported from the original prototype's WelcomeScreen (git show cfaa64e:src/components/WelcomeScreen.tsx). */
export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Logo />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>for friends</Text>
        </View>
      </View>

      <View style={styles.center}>
        <View style={styles.illustration}>
          <View style={[styles.blur, styles.blurLavender]} />
          <View style={[styles.blur, styles.blurAmber]} />
          <View style={styles.friendsRow}>
            <View style={[styles.friendCircle, { backgroundColor: colors.lavender100, borderColor: colors.lavender200 }]}>
              <Text style={[styles.friendName, { color: colors.lavender800 }]}>You</Text>
              <Text style={[styles.friendTag, { color: colors.lavender600 }]}>here</Text>
            </View>
            <View style={styles.thread} />
            <View style={[styles.friendCircle, { backgroundColor: colors.amber50, borderColor: colors.amber200 }]}>
              <Text style={[styles.friendName, { color: colors.amber700 }]}>Riya</Text>
              <Text style={[styles.friendTag, { color: colors.amber600 }]}>with you</Text>
            </View>
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.headline}>Do more of life with the people who matter.</Text>
          <Text style={styles.body}>
            Whether you're away from each other, can't meet often, or simply want some company for what you're
            doing, With helps you do more together.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Get started" onPress={() => navigation.navigate('CreateAccount')} />
        <PrimaryButton label="I already have an account" variant="ghost" onPress={() => navigation.navigate('Main')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between', alignItems: 'center' },
  header: {
    width: '100%',
    paddingHorizontal: 28,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.lavender100 },
  badgeText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender700 },
  center: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  illustration: { width: 240, height: 200, alignItems: 'center', justifyContent: 'center' },
  blur: { position: 'absolute', width: 176, height: 176, borderRadius: 88, opacity: 0.5 },
  blurLavender: { backgroundColor: colors.lavender100, top: -16, left: -16 },
  blurAmber: { backgroundColor: colors.amber50, bottom: -16, right: -16, width: 160, height: 160, borderRadius: 80 },
  friendsRow: { flexDirection: 'row', alignItems: 'center' },
  friendCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendName: { fontFamily: fonts.serifRegularItalic, fontSize: 16 },
  friendTag: { fontFamily: fonts.sansMedium, fontSize: 10, marginTop: 2 },
  thread: { width: 32, height: 0, borderTopWidth: 2, borderColor: colors.lavender600, borderStyle: 'dashed', marginHorizontal: -6 },
  textBlock: { alignItems: 'center', marginTop: spacing.sm, maxWidth: 320 },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 35,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: colors.textSecondary, textAlign: 'center' },
  actions: { width: '100%', alignItems: 'center', paddingHorizontal: 28, paddingBottom: spacing.md, gap: spacing.sm },
});
