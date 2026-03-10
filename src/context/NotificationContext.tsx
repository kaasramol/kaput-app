'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { onMessage } from 'firebase/messaging';
import { useAuth } from '@/context/AuthContext';
import { requestNotificationPermission } from '@/lib/notifications';
import { getFirebaseMessaging, firebaseConfig } from '@/lib/firebase';
import { Toast } from '@/components/ui/Toast';

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: 'success' | 'error' | 'info';
}

interface NotificationContextValue {
  permissionStatus: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<void>;
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  permissionStatus: 'default',
  requestPermission: async () => {},
  showToast: () => {},
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!user) return;
    const token = await requestNotificationPermission(user.uid);
    setPermissionStatus(token ? 'granted' : 'denied');
  }, [user]);

  // Register service worker with Firebase config
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const script = document.createElement('script');
    script.textContent = `self.__FIREBASE_CONFIG__ = ${JSON.stringify(firebaseConfig)};`;
    document.head.appendChild(script);

    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {
      // Service worker registration failed silently
    });

    return () => {
      script.remove();
    };
  }, []);

  // Auto-request permission after login
  useEffect(() => {
    if (user && permissionStatus === 'default') {
      requestPermission();
    }
  }, [user, permissionStatus, requestPermission]);

  // Listen for foreground messages
  useEffect(() => {
    if (typeof window === 'undefined' || !user || permissionStatus !== 'granted') return;

    try {
      const messaging = getFirebaseMessaging();
      const unsubscribe = onMessage(messaging, (payload) => {
        showToast({
          title: payload.notification?.title ?? 'Notification',
          message: payload.notification?.body,
          variant: 'info',
        });
      });
      return unsubscribe;
    } catch {
      // Messaging not available
    }
  }, [user, permissionStatus, showToast]);

  return (
    <NotificationContext.Provider value={{ permissionStatus, requestPermission, showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              message={toast.message}
              variant={toast.variant}
              onDismiss={dismissToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
