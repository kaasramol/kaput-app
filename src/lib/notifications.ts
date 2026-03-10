import { getToken } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseMessaging, getFirebaseDb } from '@/lib/firebase';

export async function requestNotificationPermission(uid: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const messaging = getFirebaseMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      await saveFcmToken(uid, token);
    }

    return token;
  } catch {
    return null;
  }
}

async function saveFcmToken(uid: string, token: string): Promise<void> {
  const db = getFirebaseDb();
  await setDoc(doc(db, 'users', uid, 'fcmTokens', token), {
    token,
    createdAt: serverTimestamp(),
  });
}
