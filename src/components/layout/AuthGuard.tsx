'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { Spinner } from '@/components/ui/Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { firebaseUser, user, loading, needsOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!firebaseUser) {
      router.replace('/login');
      return;
    }

    if (needsOnboarding) {
      router.replace('/onboarding');
    }
  }, [firebaseUser, loading, needsOnboarding, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!firebaseUser || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
