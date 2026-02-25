import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Details | Kaput',
};

export default function BookingDetailPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary">Booking Details</h1>
      <p className="mt-2 text-text-secondary">Track your appointment and payment status.</p>
    </div>
  );
}
