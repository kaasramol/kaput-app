'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  user: null,
  loading: true,
  needsOnboarding: false,
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
      setFirebaseUser(fbUser);

      if (fbUser) {
        const userDoc = await getUserDoc(fbUser.uid);
        setUser(userDoc);
        if (userDoc) {
          setStoreUser(userDoc);
        }
      } else {
        setUser(null);
        clearUser();
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [setStoreUser, clearUser]);

  const needsOnboarding = firebaseUser !== null && user === null && !loading;

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, needsOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
