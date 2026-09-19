import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'With.',
  slug: 'with-app',
  scheme: 'withapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    backgroundColor: '#FAF9F7',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.with.app',
  },
  android: {
    package: 'com.with.app',
  },
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    googleOAuthWebClientId: process.env.GOOGLE_OAUTH_WEB_CLIENT_ID,
  },
  plugins: ['expo-notifications'],
};

export default config;
