'use client';

import { useEffect, useState } from 'react';
import type { MechanicProfile, Quote, Booking, Review } from '@/types';
import {
  getMechanicByUserId,
  getIncomingQuotes,
  getBookingsByMechanic,
  getReviewsByMechanic,
} from '@/lib/firestore-queries';

interface MechanicDashboardData {
  profile: MechanicProfile | null;
  incomingQuotes: Quote[];
  bookings: Booking[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

export function useMechanicDashboardData(userId: string | undefined): MechanicDashboardData {
  const [profile, setProfile] = useState<MechanicProfile | null>(null);
  const [incomingQuotes, setIncomingQuotes] = useState<Quote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
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
        // First get the mechanic profile to get the mechanic ID
        const mechanicProfile = await getMechanicByUserId(userId!);
        if (!cancelled) setProfile(mechanicProfile);

        if (!mechanicProfile) {
          if (!cancelled) setLoading(false);
          return;
        }

        // Then fetch everything in parallel
        const [quotes, jobs, revs] = await Promise.all([
          getIncomingQuotes(),
          getBookingsByMechanic(mechanicProfile.id),
          getReviewsByMechanic(mechanicProfile.id),
        ]);

        if (!cancelled) {
          setIncomingQuotes(quotes);
          setBookings(jobs);
          setReviews(revs);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [userId]);

  return { profile, incomingQuotes, bookings, reviews, loading, error };
}
