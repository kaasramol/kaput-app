import type { Metadata } from 'next';
import { QuoteForm } from '@/components/quote/QuoteForm';

export const metadata: Metadata = {
  title: 'New Quote | Kaput',
};

export default function NewQuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <QuoteForm />
    </div>
  );
}
