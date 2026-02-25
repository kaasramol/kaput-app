'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { VehicleSection } from '@/components/dashboard/VehicleSection';
import { QuoteSection } from '@/components/dashboard/QuoteSection';
import { BookingSection } from '@/components/dashboard/BookingSection';
import { AddVehicleModal } from '@/components/dashboard/AddVehicleModal';
import type { Vehicle } from '@/types';

export function DashboardContent() {
  const { user } = useAuth();
  const { vehicles, quotes, bookings, loading, error } = useDashboardData(user?.uid);
  const [localVehicles, setLocalVehicles] = useState<Vehicle[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const allVehicles = [...localVehicles, ...vehicles];

  const handleVehicleAdded = useCallback((vehicle: Vehicle) => {
    setLocalVehicles((prev) => [vehicle, ...prev]);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">Something went wrong</p>
        <p className="mt-1 text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Welcome back, {firstName}</h1>
          <p className="mt-1 text-text-secondary">Your vehicles, quotes, and bookings at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/quote/new">
            <Button variant="secondary" size="sm">
              <FileText className="h-4 w-4" />
              Request Quote
            </Button>
          </Link>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <VehicleSection vehicles={allVehicles} onAddVehicle={() => setModalOpen(true)} />
        </div>
        <div className="space-y-8 lg:col-span-2">
          <QuoteSection quotes={quotes} />
          <BookingSection bookings={bookings} />
        </div>
      </div>

      {/* Modal */}
      {user && (
        <AddVehicleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          ownerId={user.uid}
          onVehicleAdded={handleVehicleAdded}
        />
      )}
    </div>
  );
}
