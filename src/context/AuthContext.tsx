'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types';
import { onAuthChange } from '@/lib/auth';
import { getUserDoc } from '@/lib/firestore-helpers';
import { useAuthStore } from '@/lib/store';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  needsOnboarding: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
  needsOnboarding: false,
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { setUser: setStoreUser, clearUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      if (fbUser) {
        // Load the profile before exposing the signed-in user. Otherwise there is
        // a moment where firebaseUser is set but user is null, which looks like a
        // brand-new account and wrongly redirects to onboarding.
        setLoading(true);
        let userDoc: User | null = null;
        try {
          userDoc = await getUserDoc(fbUser.uid);
        } catch {
          userDoc = null;
        }
        setFirebaseUser(fbUser);
        setUser(userDoc);
        if (userDoc) {
          setStoreUser(userDoc);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        clearUser();
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [setStoreUser, clearUser]);

  const refreshUser = useCallback(async () => {
    if (!firebaseUser) return;
    const userDoc = await getUserDoc(firebaseUser.uid);
    setUser(userDoc);
    if (userDoc) setStoreUser(userDoc);
  }, [firebaseUser, setStoreUser]);

  const needsOnboarding = firebaseUser !== null && user === null && !loading;

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, needsOnboarding, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
