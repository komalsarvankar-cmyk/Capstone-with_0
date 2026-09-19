import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { signUp } from '@/lib/auth';
import { colors, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

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
    <Screen title="Create your account" subtitle="Email and password to get started.">
      <View style={{ gap: spacing.md }}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Continue" onPress={handleContinue} loading={loading} disabled={!email || !password} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  error: { color: '#B91C1C', fontSize: 13 },
});
