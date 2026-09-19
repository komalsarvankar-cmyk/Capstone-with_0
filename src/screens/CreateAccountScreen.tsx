import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { signUp } from '@/lib/auth';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

/**
 * Ported from the original prototype's CreateAccountScreen (git show
 * cfaa64e:src/components/CreateAccountScreen.tsx). The original's Google/Apple
 * buttons were prototype-only mocks that proceeded on any tap; this build
 * only implements real Firebase email/password auth (R1), so those two
 * buttons are omitted rather than shipped as non-functional UI.
 */
export function CreateAccountScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      navigation.navigate('ConnectFriend');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.step}>STEP 1 OF 3</Text>
        <Text style={styles.headline}>Let's get you in.</Text>
        <Text style={styles.subtitle}>Create your account and start doing more with your friends.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            onPress={handleContinue}
            disabled={!email || !password || loading}
            style={[styles.submit, (!email || !password) && styles.submitDisabled]}
          >
            <Text style={styles.submitLabel}>{loading ? 'Creating account...' : 'Continue'}</Text>
            {!loading && <ArrowRight size={16} color="#fff" />}
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>By continuing, you agree to With's quiet and private terms of service.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  nav: { height: 52, paddingHorizontal: spacing.md, justifyContent: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, maxWidth: 400 },
  step: { fontFamily: fonts.sansSemiBold, fontSize: 12, letterSpacing: 1, color: colors.lavender600, marginBottom: spacing.sm },
  headline: { fontFamily: fonts.serif, fontSize: 32, lineHeight: 37, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.textSecondary, marginBottom: spacing.lg },
  form: { gap: 10 },
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lavender200,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.textPrimary,
  },
  error: { fontFamily: fonts.sans, color: '#B91C1C', fontSize: 13 },
  submit: {
    height: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.lavender600,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xs,
  },
  submitDisabled: { opacity: 0.5 },
  submitLabel: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: '#fff' },
  footer: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  footerText: { fontFamily: fonts.sans, fontSize: 12, color: '#9CA3AF', textAlign: 'center', maxWidth: 280 },
});
