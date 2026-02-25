'use client';

import { useEffect, useState } from 'react';
import type { Vehicle, Quote, Booking } from '@/types';
import { getVehiclesByOwner, getQuotesByOwner, getBookingsByOwner } from '@/lib/firestore-queries';

interface DashboardData {
  vehicles: Vehicle[];
  quotes: Quote[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(userId: string | undefined): DashboardData {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        const [v, q, b] = await Promise.all([
          getVehiclesByOwner(userId!),
          getQuotesByOwner(userId!),
          getBookingsByOwner(userId!),
        ]);
        if (!cancelled) {
          setVehicles(v);
          setQuotes(q);
          setBookings(b);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [userId]);

  return { vehicles, quotes, bookings, loading, error };
}
