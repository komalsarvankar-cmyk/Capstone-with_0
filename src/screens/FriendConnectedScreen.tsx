import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useOwnProfile } from '@/lib/useOwnProfile';
import { initialsOf } from '@/lib/initials';
import type { RootStackParamList } from '@/navigation/types';
import { colors, fonts, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendConnected'>;

/** Ported from the original prototype's FriendConnectedScreen (git show cfaa64e:src/components/FriendConnectedScreen.tsx). */
export function FriendConnectedScreen({ route, navigation }: Props) {
  const { friend } = route.params;
  const profile = useOwnProfile();
  const friendFirstName = friend.displayName.split(' ')[0];
  const ownFirstName = (profile?.displayName ?? 'You').split(' ')[0];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>You + {friendFirstName}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <View style={styles.avatarStack}>
          <View style={[styles.blur]} />
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, styles.avatarYou]}>
              <Text style={[styles.avatarLabel, { color: colors.lavender800 }]}>You</Text>
              <Text style={[styles.avatarSub, { color: colors.lavender600 }]}>{ownFirstName}</Text>
            </View>
            <View style={[styles.avatar, styles.avatarFriend]}>
              <Text style={[styles.avatarLabel, { color: colors.amber700 }]}>{initialsOf(friend.displayName)}</Text>
              <Text style={[styles.avatarSub, { color: colors.amber600 }]}>{friendFirstName}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.headline}>You're all set.</Text>
        <Text style={styles.subtitle}>You and {friendFirstName} are now connected.</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Choose your first experience" onPress={() => navigation.navigate('ChooseActivity')} />
        <PrimaryButton label="Explore first" variant="ghost" onPress={() => navigation.navigate('Main')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  header: { height: 52, alignItems: 'center', justifyContent: 'center' },
  pill: { backgroundColor: colors.lavender100, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 4 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.lavender600 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  avatarStack: { marginBottom: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  blur: { position: 'absolute', width: 208, height: 208, borderRadius: 104, backgroundColor: colors.lavender100, opacity: 0.5 },
  avatarRow: { flexDirection: 'row' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarYou: { backgroundColor: colors.lavender100, marginRight: -16, zIndex: 1 },
  avatarFriend: { backgroundColor: colors.amber50, zIndex: 2 },
  avatarLabel: { fontFamily: fonts.serif, fontSize: 22 },
  avatarSub: { fontFamily: fonts.sansMedium, fontSize: 10, marginTop: 2 },
  headline: { fontFamily: fonts.serif, fontSize: 32, color: colors.textPrimary, marginBottom: spacing.xs, textAlign: 'center' },
  subtitle: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.textSecondary, textAlign: 'center', maxWidth: 280 },
  actions: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
});
