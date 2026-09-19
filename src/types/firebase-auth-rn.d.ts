// The installed 'firebase/auth' package.json has no "exports" map (only
// legacy main/typings fields), so its shipped .d.ts always points at the
// browser/node build and never includes the React Native persistence
// helper -- even though Metro correctly resolves the RN build at runtime
// via @firebase/auth's own "exports" map. This augmentation restores the
// type for tsc/editors without changing runtime resolution.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
