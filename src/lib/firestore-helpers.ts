import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import type { User, UserRole, Vehicle, MechanicProfile, Quote, QuoteItem, QuoteResponse } from '@/types';

export async function getUserDoc(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}

interface CreateUserParams {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export async function createUserDoc(params: CreateUserParams): Promise<User> {
  const db = getFirebaseDb();
  const userDoc: User = {
    uid: params.uid,
    email: params.email,
    displayName: params.displayName,
    role: params.role,
    ...(params.phone && { phone: params.phone }),
    ...(params.avatarUrl && { avatarUrl: params.avatarUrl }),
    createdAt: serverTimestamp() as User['createdAt'],
    updatedAt: serverTimestamp() as User['updatedAt'],
  };
  await setDoc(doc(db, 'users', params.uid), userDoc);
  return userDoc;
}

interface CreateVehicleParams {
  ownerId: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
}

export async function createVehicleDoc(params: CreateVehicleParams): Promise<Vehicle> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'vehicles'));
  const vehicleDoc: Vehicle = {
    id: ref.id,
    ownerId: params.ownerId,
    make: params.make,
    model: params.model,
    year: params.year,
    ...(params.color && { color: params.color }),
    ...(params.licensePlate && { licensePlate: params.licensePlate }),
    createdAt: serverTimestamp() as Vehicle['createdAt'],
  };
  await setDoc(ref, vehicleDoc);
  return vehicleDoc;
}

interface CreateMechanicProfileParams {
  userId: string;
  businessName: string;
  address: string;
  phone: string;
  services: string[];
}

export async function createMechanicProfileDoc(params: CreateMechanicProfileParams): Promise<MechanicProfile> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'mechanics'));
  const profileDoc: MechanicProfile = {
    id: ref.id,
    userId: params.userId,
    businessName: params.businessName,
    address: params.address,
    location: { latitude: 0, longitude: 0 } as MechanicProfile['location'],
    phone: params.phone,
    hours: {},
    services: params.services,
    certifications: [],
    portfolioImages: [],
    description: '',
    rating: 0,
    reviewCount: 0,
    subscriptionStatus: 'inactive',
    subscriptionPlan: '',
    createdAt: serverTimestamp() as MechanicProfile['createdAt'],
    updatedAt: serverTimestamp() as MechanicProfile['updatedAt'],
  };
  await setDoc(ref, profileDoc);
  return profileDoc;
}

interface CreateQuoteParams {
  carOwnerId: string;
  vehicleId: string;
  serviceCategory: string;
  symptoms: string[];
  description: string;
  photos: string[];
}

export async function createQuoteDoc(params: CreateQuoteParams): Promise<Quote> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'quotes'));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const quoteDoc: Quote = {
    id: ref.id,
    carOwnerId: params.carOwnerId,
    vehicleId: params.vehicleId,
    serviceCategory: params.serviceCategory,
    symptoms: params.symptoms,
    description: params.description,
    photos: params.photos,
    status: 'open',
    responses: [],
    createdAt: serverTimestamp() as Quote['createdAt'],
    expiresAt: serverTimestamp() as Quote['expiresAt'],
  };
  // Store expiresAt as a real date (not serverTimestamp) so we can query on it
  await setDoc(ref, { ...quoteDoc, expiresAt });
  return { ...quoteDoc, expiresAt: { toDate: () => expiresAt } as Quote['expiresAt'] };
}

interface SubmitQuoteResponseParams {
  quoteId: string;
  mechanicId: string;
  message?: string;
  items: QuoteItem[];
  totalCost: number;
  estimatedTime: string;
}

export async function submitQuoteResponse(params: SubmitQuoteResponseParams): Promise<QuoteResponse> {
  const db = getFirebaseDb();
  const ref = doc(db, 'quotes', params.quoteId);

  const response: QuoteResponse = {
    mechanicId: params.mechanicId,
    ...(params.message && { message: params.message }),
    items: params.items,
    totalCost: params.totalCost,
    estimatedTime: params.estimatedTime,
    respondedAt: serverTimestamp() as QuoteResponse['respondedAt'],
  };

  await updateDoc(ref, {
    responses: arrayUnion(response),
    status: 'quoted',
  });

  return response;
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, 'bookings', bookingId);
  const updates: Record<string, unknown> = { status };
  if (status === 'completed') {
    updates.completedAt = serverTimestamp();
  }
  if (status === 'cancelled') {
    updates.cancelledAt = serverTimestamp();
  }
  await updateDoc(ref, updates);
}
