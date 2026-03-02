'use client';

import { useState } from 'react';
import { CreditCard, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';

interface PaymentSectionProps {
  amount: number;
  bookingId: string;
  carOwnerId: string;
  mechanicId: string;
  onPaymentComplete: (stripePaymentId: string) => void;
}

export function PaymentSection({
  amount,
  bookingId,
  carOwnerId,
  mechanicId,
  onPaymentComplete,
}: PaymentSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePayment() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingId, carOwnerId, mechanicId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Payment failed');
      }

      const { clientSecret } = await res.json();
      // In production, this would use Stripe Elements to confirm the payment.
      // For now, we simulate a successful payment with the client secret as the ID.
      onPaymentComplete(clientSecret as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-accent-light" />
          <h3 className="font-semibold text-text-primary">Payment</h3>
        </div>

        <div className="rounded-[var(--radius-md)] bg-bg-secondary p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Total Due</span>
            <span className="text-2xl font-bold text-text-primary">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Shield className="h-3.5 w-3.5" />
          <span>Secure payment powered by Stripe</span>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button
          onClick={handlePayment}
          loading={loading}
          className="w-full"
          size="lg"
        >
          <CreditCard className="h-4 w-4" />
          Pay {formatCurrency(amount)}
        </Button>
      </div>
    </Card>
  );
}
