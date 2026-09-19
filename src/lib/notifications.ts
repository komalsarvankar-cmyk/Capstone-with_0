import * as Notifications from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Registers this device for push and stores the Expo push token on the
 * signed-in user's doc (U7, KTD3). No-ops silently if permission is denied
 * -- sendPlanReminders already skips participants with no token.
 */
export async function registerForPushNotifications(): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return;

  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
  await updateDoc(doc(db, 'users', uid), { expoPushToken });
}
