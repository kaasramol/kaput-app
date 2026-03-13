import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import type { User, UserRole, Vehicle, MechanicProfile, Quote, QuoteItem, QuoteResponse, Booking, BookingType, AdditionalWorkItem, AdditionalWorkRequest, Message, Review } from '@/types';

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

interface UpdateUserParams {
  displayName?: string;
  phone?: string;
  avatarUrl?: string;
}

export async function updateUserDoc(uid: string, params: UpdateUserParams): Promise<void> {
  const db = getFirebaseDb();
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (params.displayName !== undefined) updates.displayName = params.displayName;
  if (params.phone !== undefined) updates.phone = params.phone;
  if (params.avatarUrl !== undefined) updates.avatarUrl = params.avatarUrl;
  await updateDoc(doc(db, 'users', uid), updates);
}

export async function deleteVehicleDoc(vehicleId: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, 'vehicles', vehicleId));
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
  description?: string;
  certifications?: string[];
  hours?: Record<string, { open: string; close: string }>;
  latitude?: number;
  longitude?: number;
}

export async function createMechanicProfileDoc(params: CreateMechanicProfileParams): Promise<MechanicProfile> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'mechanics'));
  const profileDoc: MechanicProfile = {
    id: ref.id,
    userId: params.userId,
    businessName: params.businessName,
    address: params.address,
    location: { latitude: params.latitude ?? 0, longitude: params.longitude ?? 0 } as MechanicProfile['location'],
    phone: params.phone,
    hours: params.hours ?? {},
    services: params.services,
    certifications: params.certifications ?? [],
    portfolioImages: [],
    description: params.description ?? '',
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

interface UpdateMechanicProfileParams {
  description?: string;
  services?: string[];
  certifications?: string[];
  hours?: Record<string, { open: string; close: string }>;
  portfolioImages?: string[];
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export async function updateMechanicProfile(mechanicId: string, params: UpdateMechanicProfileParams): Promise<void> {
  const db = getFirebaseDb();
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (params.description !== undefined) updates.description = params.description;
  if (params.services !== undefined) updates.services = params.services;
  if (params.certifications !== undefined) updates.certifications = params.certifications;
  if (params.hours !== undefined) updates.hours = params.hours;
  if (params.portfolioImages !== undefined) updates.portfolioImages = params.portfolioImages;
  if (params.address !== undefined) updates.address = params.address;
  if (params.phone !== undefined) updates.phone = params.phone;
  if (params.latitude !== undefined && params.longitude !== undefined) {
    updates.location = { latitude: params.latitude, longitude: params.longitude };
  }
  await updateDoc(doc(db, 'mechanics', mechanicId), updates);
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

interface CreateBookingParams {
  quoteId: string;
  carOwnerId: string;
  mechanicId: string;
  vehicleId: string;
  scheduledAt: Date;
  type: BookingType;
  totalCost: number;
}

export async function createBookingDoc(params: CreateBookingParams): Promise<Booking> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'bookings'));
  const bookingDoc: Booking = {
    id: ref.id,
    quoteId: params.quoteId,
    carOwnerId: params.carOwnerId,
    mechanicId: params.mechanicId,
    vehicleId: params.vehicleId,
    scheduledAt: params.scheduledAt as unknown as Booking['scheduledAt'],
    type: params.type,
    status: 'confirmed',
    totalCost: params.totalCost,
    paymentStatus: 'pending',
    createdAt: serverTimestamp() as Booking['createdAt'],
  };
  await setDoc(ref, bookingDoc);
  return bookingDoc;
}

export async function updateBookingPayment(
  bookingId: string,
  stripePaymentId: string
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'bookings', bookingId), {
    paymentStatus: 'paid',
    stripePaymentId,
  });
}

export async function cancelBooking(
  bookingId: string,
  reason: string
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'bookings', bookingId), {
    status: 'cancelled',
    cancellationReason: reason,
    cancelledAt: serverTimestamp(),
  });
}

interface CreateReviewParams {
  bookingId: string;
  carOwnerId: string;
  mechanicId: string;
  rating: number;
  comment: string;
}

export async function createReviewDoc(params: CreateReviewParams): Promise<Review> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'reviews'));
  const reviewDoc: Review = {
    id: ref.id,
    bookingId: params.bookingId,
    carOwnerId: params.carOwnerId,
    mechanicId: params.mechanicId,
    rating: params.rating,
    comment: params.comment,
    flagged: false,
    createdAt: serverTimestamp() as Review['createdAt'],
  };
  await setDoc(ref, reviewDoc);

  // Update mechanic's rating and review count
  const mechanicRef = doc(db, 'mechanics', params.mechanicId);
  const mechanicSnap = await getDoc(mechanicRef);
  if (mechanicSnap.exists()) {
    const mechanic = mechanicSnap.data() as MechanicProfile;
    const newCount = mechanic.reviewCount + 1;
    const newRating = ((mechanic.rating * mechanic.reviewCount) + params.rating) / newCount;
    await updateDoc(mechanicRef, {
      rating: Math.round(newRating * 10) / 10,
      reviewCount: newCount,
    });
  }

  return reviewDoc;
}

export async function replyToReview(reviewId: string, reply: string): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'reviews', reviewId), {
    mechanicReply: reply,
  });
}

interface SendMessageParams {
  bookingId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
}

// --- Subscription Management ---

export async function updateMechanicSubscription(
  mechanicId: string,
  status: 'active' | 'trial' | 'inactive',
  planName: string,
  stripeSubscriptionId?: string
): Promise<void> {
  const db = getFirebaseDb();
  const updates: Record<string, unknown> = {
    subscriptionStatus: status,
    subscriptionPlan: planName,
    updatedAt: serverTimestamp(),
  };
  if (stripeSubscriptionId !== undefined) {
    updates.stripeSubscriptionId = stripeSubscriptionId;
  }
  await updateDoc(doc(db, 'mechanics', mechanicId), updates);
}

export async function updateMechanicStripeCustomerId(
  mechanicId: string,
  stripeCustomerId: string
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'mechanics', mechanicId), {
    stripeCustomerId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateMechanicConnectAccount(
  mechanicId: string,
  stripeConnectAccountId: string,
  onboardingComplete: boolean
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'mechanics', mechanicId), {
    stripeConnectAccountId,
    connectOnboardingComplete: onboardingComplete,
    updatedAt: serverTimestamp(),
  });
}

// --- Additional Work Approval ---

interface RequestAdditionalWorkParams {
  bookingId: string;
  reason: string;
  items: AdditionalWorkItem[];
  totalCost: number;
}

export async function requestAdditionalWork(params: RequestAdditionalWorkParams): Promise<AdditionalWorkRequest> {
  const db = getFirebaseDb();
  const ref = doc(db, 'bookings', params.bookingId);
  const requestId = doc(collection(db, '_ids')).id; // generate unique ID

  const request: AdditionalWorkRequest = {
    id: requestId,
    reason: params.reason,
    items: params.items,
    totalCost: params.totalCost,
    status: 'pending',
    createdAt: serverTimestamp() as AdditionalWorkRequest['createdAt'],
  };

  await updateDoc(ref, {
    additionalWork: arrayUnion(request),
  });

  return request;
}

export async function respondToAdditionalWork(
  bookingId: string,
  requestId: string,
  approved: boolean
): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(db, 'bookings', bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const booking = snap.data() as Booking;
  const requests = booking.additionalWork ?? [];
  const updated = requests.map((r) => {
    if (r.id === requestId) {
      return { ...r, status: approved ? 'approved' as const : 'declined' as const, respondedAt: new Date() };
    }
    return r;
  });

  const costToAdd = approved
    ? requests.find((r) => r.id === requestId)?.totalCost ?? 0
    : 0;

  await updateDoc(ref, {
    additionalWork: updated,
    ...(costToAdd > 0 && { totalCost: booking.totalCost + costToAdd }),
  });
}

export async function sendMessage(params: SendMessageParams): Promise<Message> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'messages'));
  const messageDoc: Message = {
    id: ref.id,
    bookingId: params.bookingId,
    senderId: params.senderId,
    text: params.text,
    ...(params.imageUrl && { imageUrl: params.imageUrl }),
    createdAt: serverTimestamp() as Message['createdAt'],
  };
  await setDoc(ref, messageDoc);
  return messageDoc;
}
