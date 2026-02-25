'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
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
      await signInWithEmail(email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h1 className="mb-6 text-center text-2xl font-bold text-text-primary">Welcome Back</h1>

      {error && (
        <div className="mb-4 rounded-[var(--radius-sm)] bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

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
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Sign In
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
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-accent hover:text-accent-hover">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
