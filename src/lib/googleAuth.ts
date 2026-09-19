import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ensureUserDoc } from '@/lib/auth';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra ?? {};

/**
 * Google Sign-In via Firebase Auth (added on request after the original
 * prototype's "Continue with Google" button -- a no-op mock there -- was
 * initially dropped from this rebuild). Requires GOOGLE_OAUTH_WEB_CLIENT_ID
 * to be set (see .env.example): a Web OAuth client from either the
 * Firebase console's Google sign-in provider or Google Cloud Console.
 */
export function useGoogleSignIn(onError: (message: string) => void) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: extra.googleOAuthWebClientId as string,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token: idToken } = response.params;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(({ user }) => ensureUserDoc(user.uid, user.displayName ?? user.email?.split('@')[0] ?? 'Friend'))
        .catch((error) => {
          onError(error instanceof Error ? error.message : 'Google sign-in failed.');
        });
    } else if (response?.type === 'error') {
      onError('Google sign-in was cancelled or failed.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return { request, promptAsync };
}
