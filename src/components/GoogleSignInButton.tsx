import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { GoogleIcon } from '@/components/GoogleIcon';
import { useGoogleSignIn } from '@/lib/googleAuth';
import { colors, fonts, radii } from '@/theme';

/**
 * Split from CreateAccountScreen because expo-auth-session's Google
 * provider throws during render (not just on tap) when its client id is
 * unconfigured -- this component is only mounted once a real
 * GOOGLE_OAUTH_WEB_CLIENT_ID exists, so the hook never runs unconfigured.
 */
export function GoogleSignInButton({ onError }: { onError: (message: string) => void }) {
  const { request, promptAsync } = useGoogleSignIn(onError);

  return (
    <Pressable
      style={styles.oauthButton}
      disabled={!request}
      onPress={() => promptAsync()}
      accessibilityLabel="Continue with Google"
    >
      <GoogleIcon size={16} />
      <Text style={styles.oauthLabel}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  oauthButton: {
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  oauthLabel: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.textPrimary },
});
