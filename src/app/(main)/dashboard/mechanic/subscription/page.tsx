import type { Metadata } from 'next';
import { SubscriptionContent } from '@/components/mechanic-dashboard/SubscriptionContent';

export const metadata: Metadata = {
  title: 'Subscription | Kaput',
};

export default function SubscriptionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <SubscriptionContent />
    </main>
  );
}
