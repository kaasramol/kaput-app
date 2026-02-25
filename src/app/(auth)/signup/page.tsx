'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; description: string; icon: typeof Car }[] = [
  { value: 'car_owner', label: 'Car Owner', description: 'Find mechanics and get quotes', icon: Car },
  { value: 'mechanic', label: 'Mechanic', description: 'List your shop and get customers', icon: Wrench },
];

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('car_owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && firebaseUser) {
      router.replace('/dashboard');
    }
  }, [authLoading, firebaseUser, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      router.replace(`/onboarding?role=${selectedRole}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace(`/onboarding?role=${selectedRole}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h1 className="mb-6 text-center text-2xl font-bold text-text-primary">Create Account</h1>

      {error && (
        <div className="mb-4 rounded-[var(--radius-sm)] bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelectedRole(role.value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 text-center transition-all',
              selectedRole === role.value
                ? 'border-accent bg-accent/10 text-text-primary'
                : 'border-border bg-bg-secondary text-text-secondary hover:border-accent/30'
            )}
          >
            <role.icon className="h-6 w-6" />
            <span className="text-sm font-semibold">{role.label}</span>
            <span className="text-xs text-text-muted">{role.description}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-bg-card px-2 text-text-muted">or</span>
        </div>
      </div>

      <Button variant="secondary" onClick={handleGoogle} loading={loading} className="w-full">
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
