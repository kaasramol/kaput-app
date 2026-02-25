'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createUserDoc, createVehicleDoc, createMechanicProfileDoc } from '@/lib/firestore-helpers';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/types';

const SERVICE_OPTIONS = [
  'Oil Change',
  'Brake Repair',
  'Tire Service',
  'Engine Diagnostics',
  'Transmission',
  'Electrical',
  'Body Work',
  'General Maintenance',
];

export default function OnboardingPage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as UserRole) || 'car_owner';

  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Car owner fields
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  // Mechanic fields
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.replace('/login');
    }
  }, [authLoading, firebaseUser, router]);

  if (authLoading || !firebaseUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserDoc({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName,
        role,
        avatarUrl: firebaseUser.photoURL ?? undefined,
      });

      if (role === 'car_owner') {
        await createVehicleDoc({
          ownerId: firebaseUser.uid,
          make,
          model,
          year: parseInt(year, 10),
        });
        router.replace('/dashboard');
      } else {
        await createMechanicProfileDoc({
          userId: firebaseUser.uid,
          businessName,
          address,
          phone,
          services: selectedServices,
        });
        router.replace('/dashboard/mechanic');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h1 className="mb-2 text-center text-2xl font-bold text-text-primary">Complete Your Profile</h1>
      <p className="mb-6 text-center text-sm text-text-secondary">
        {role === 'car_owner' ? 'Tell us about you and your vehicle' : 'Set up your mechanic profile'}
      </p>

      {error && (
        <div className="mb-4 rounded-[var(--radius-sm)] bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Display Name"
          placeholder="Your name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        {role === 'car_owner' ? (
          <>
            <Input
              label="Vehicle Make"
              placeholder="e.g. Toyota"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
            />
            <Input
              label="Vehicle Model"
              placeholder="e.g. Camry"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
            <Input
              label="Vehicle Year"
              type="number"
              placeholder="e.g. 2020"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={1900}
              max={new Date().getFullYear() + 1}
              required
            />
          </>
        ) : (
          <>
            <Input
              label="Business Name"
              placeholder="Your shop name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <Input
              label="Address"
              placeholder="Shop address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="(604) 555-0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Services</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={
                      selectedServices.includes(service)
                        ? 'rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white'
                        : 'rounded-full border border-border bg-bg-secondary px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-accent/30'
                    }
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Complete Setup
        </Button>
      </form>
    </Card>
  );
}
