import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import type { Vehicle, Quote, Booking, MechanicProfile, Review } from '@/types';

export async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'vehicles', vehicleId));
  if (!snap.exists()) return null;
  return snap.data() as Vehicle;
}

export async function getVehiclesByOwner(ownerId: string): Promise<Vehicle[]> {
  const q = query(
    collection(getFirebaseDb(), 'vehicles'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as Vehicle);
}

export async function getQuotesByOwner(carOwnerId: string): Promise<Quote[]> {
  const q = query(
    collection(getFirebaseDb(), 'quotes'),
    where('carOwnerId', '==', carOwnerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as Quote);
}

export async function getQuoteById(quoteId: string): Promise<Quote | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'quotes', quoteId));
  if (!snap.exists()) return null;
  return snap.data() as Quote;
}

export async function getMechanics(): Promise<MechanicProfile[]> {
  const q = query(
    collection(getFirebaseDb(), 'mechanics'),
    where('subscriptionStatus', 'in', ['active', 'trial']),
    orderBy('rating', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as MechanicProfile);
}

export async function getMechanicById(mechanicId: string): Promise<MechanicProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'mechanics', mechanicId));
  if (!snap.exists()) return null;
  return snap.data() as MechanicProfile;
}

export async function getReviewsByMechanic(mechanicId: string): Promise<Review[]> {
  const q = query(
    collection(getFirebaseDb(), 'reviews'),
    where('mechanicId', '==', mechanicId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
}

export async function getMechanicByUserId(userId: string): Promise<MechanicProfile | null> {
  const q = query(
    collection(getFirebaseDb(), 'mechanics'),
    where('userId', '==', userId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as MechanicProfile;
}

/** Distance in km between two lat/lng points using the Haversine formula */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface GeoFilter {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export async function getIncomingQuotes(geoFilter?: GeoFilter): Promise<Quote[]> {
  const q = query(
    collection(getFirebaseDb(), 'quotes'),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const quotes = snap.docs.map((d) => d.data() as Quote);

  // No geo-filter or invalid coordinates — return all
  if (!geoFilter || (geoFilter.latitude === 0 && geoFilter.longitude === 0)) {
    return quotes;
  }

  const radius = geoFilter.radiusKm ?? 50;

  // Filter quotes that have location data by distance; include quotes without location
  return quotes.filter((quote) => {
    if (!quote.location) return true;
    const dist = haversineDistance(
      geoFilter.latitude, geoFilter.longitude,
      quote.location.latitude, quote.location.longitude
    );
    return dist <= radius;
  });
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'bookings', bookingId));
  if (!snap.exists()) return null;
  return snap.data() as Booking;
}

export async function getBookingsByMechanic(mechanicId: string): Promise<Booking[]> {
  const q = query(
    collection(getFirebaseDb(), 'bookings'),
    where('mechanicId', '==', mechanicId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Booking);
}

export async function getReviewByBooking(bookingId: string): Promise<Review | null> {
  const q = query(
    collection(getFirebaseDb(), 'reviews'),
    where('bookingId', '==', bookingId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Review;
}

export async function getBookingsByOwner(carOwnerId: string): Promise<Booking[]> {
  const q = query(
    collection(getFirebaseDb(), 'bookings'),
    where('carOwnerId', '==', carOwnerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as Booking);
}
