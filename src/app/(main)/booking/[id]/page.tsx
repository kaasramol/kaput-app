import type { Metadata } from 'next';
import { BookingDetailContent } from '@/components/booking/BookingDetailContent';

export const metadata: Metadata = {
  title: 'Booking Details | Kaput',
};

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <BookingDetailContent bookingId={id} />
    </div>
  );
}
