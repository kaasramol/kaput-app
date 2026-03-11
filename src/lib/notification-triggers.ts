import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';

interface NotificationData {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

async function createNotification(params: NotificationData): Promise<void> {
  const db = getFirebaseDb();
  const ref = doc(collection(db, 'notifications'));
  await setDoc(ref, {
    id: ref.id,
    userId: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    data: params.data ?? {},
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function sendQuoteResponseNotification(
  carOwnerId: string,
  quoteId: string,
  mechanicName: string
): Promise<void> {
  await createNotification({
    userId: carOwnerId,
    type: 'quote_response',
    title: 'New Quote Response',
    body: `${mechanicName} has responded to your quote request.`,
    data: { quoteId },
  });
}

export async function sendBookingConfirmedNotification(
  mechanicId: string,
  bookingId: string,
  customerName: string
): Promise<void> {
  await createNotification({
    userId: mechanicId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    body: `${customerName} has booked an appointment.`,
    data: { bookingId },
  });
}

export async function sendNewReviewNotification(
  mechanicId: string,
  reviewId: string,
  rating: number
): Promise<void> {
  await createNotification({
    userId: mechanicId,
    type: 'new_review',
    title: 'New Review',
    body: `You received a ${rating}-star review.`,
    data: { reviewId },
  });
}

export async function sendAdditionalWorkNotification(
  carOwnerId: string,
  bookingId: string,
  amount: number
): Promise<void> {
  await createNotification({
    userId: carOwnerId,
    type: 'additional_work',
    title: 'Additional Work Requested',
    body: `Your mechanic has requested additional work ($${amount.toFixed(2)}). Please review and approve.`,
    data: { bookingId },
  });
}

export async function sendAdditionalWorkResponseNotification(
  mechanicId: string,
  bookingId: string,
  approved: boolean
): Promise<void> {
  await createNotification({
    userId: mechanicId,
    type: 'additional_work_response',
    title: approved ? 'Additional Work Approved' : 'Additional Work Declined',
    body: approved
      ? 'The car owner approved your additional work request.'
      : 'The car owner declined your additional work request.',
    data: { bookingId },
  });
}

export async function sendAppointmentReminderNotification(
  userId: string,
  bookingId: string,
  scheduledTime: string
): Promise<void> {
  await createNotification({
    userId,
    type: 'appointment_reminder',
    title: 'Appointment Reminder',
    body: `Your appointment is scheduled for ${scheduledTime}.`,
    data: { bookingId },
  });
}
