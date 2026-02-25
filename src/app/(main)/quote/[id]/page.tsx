import type { Metadata } from 'next';
import { QuoteDetailContent } from '@/components/quote/QuoteDetailContent';

export const metadata: Metadata = {
  title: 'Quote Details | Kaput',
};

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <QuoteDetailContent quoteId={id} />
    </div>
  );
}
