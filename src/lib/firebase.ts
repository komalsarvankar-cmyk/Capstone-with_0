import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey as string,
  authDomain: extra.firebaseAuthDomain as string,
  projectId: extra.firebaseProjectId as string,
  storageBucket: extra.firebaseStorageBucket as string,
  messagingSenderId: extra.firebaseMessagingSenderId as string,
  appId: extra.firebaseAppId as string,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// KTD8: explicit React Native persistence on iOS/Android -- the JS SDK's
// default getAuth() falls back to in-memory sessions on React Native,
// which would fail R2. The web build (used only for local dev preview in
// a desktop browser; this app ships to iOS/Android per the plan) has no
// getReactNativePersistence export at all, so it uses the SDK's own
// browser persistence instead.
export const auth: Auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
