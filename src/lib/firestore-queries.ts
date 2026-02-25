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

export async function getIncomingQuotes(): Promise<Quote[]> {
  const q = query(
    collection(getFirebaseDb(), 'quotes'),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Quote);
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

export async function getBookingsByOwner(carOwnerId: string): Promise<Booking[]> {
  const q = query(
    collection(getFirebaseDb(), 'bookings'),
    where('carOwnerId', '==', carOwnerId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as Booking);
}
