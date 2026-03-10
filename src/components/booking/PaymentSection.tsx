'use client';

import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Shield } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/format';

interface PaymentSectionProps {
  amount: number;
  bookingId: string;
  carOwnerId: string;
  mechanicId: string;
  onPaymentComplete: (stripePaymentId: string) => void;
}

const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#12121a',
    colorText: '#f1f5f9',
    colorTextSecondary: '#94a3b8',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '10px',
    colorInputBackground: '#12121a',
    colorInputText: '#f1f5f9',
    colorInputPlaceholder: '#64748b',
  },
  rules: {
    '.Input': {
      border: '1px solid #2d2d44',
    },
    '.Input:focus': {
      border: '1px solid #3b82f6',
      boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.5)',
    },
  },
};

function CheckoutForm({ amount, onPaymentComplete }: {
  amount: number;
  onPaymentComplete: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message ?? 'Payment failed. Please try again.');
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentComplete(paymentIntent.id);
    } else {
      setError('Payment was not completed. Please try again.');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && <p className="text-sm text-error">{error}</p>}

      <Button
        type="submit"
        loading={loading}
        disabled={!stripe || !elements || loading}
        className="w-full"
        size="lg"
      >
        <CreditCard className="h-4 w-4" />
        Pay {formatCurrency(amount)}
      </Button>
    </form>
  );
}

export function PaymentSection({
  amount,
  bookingId,
  carOwnerId,
  mechanicId,
  onPaymentComplete,
}: PaymentSectionProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function createIntent() {
      try {
        const res = await fetch('/api/stripe/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, bookingId, carOwnerId, mechanicId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to initialize payment');
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to initialize payment.');
      }
    }
    createIntent();
  }, [amount, bookingId, carOwnerId, mechanicId]);

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

        {fetchError && <p className="text-sm text-error">{fetchError}</p>}

        {clientSecret ? (
          <Elements
            stripe={getStripe()}
            options={{ clientSecret, appearance: stripeAppearance }}
          >
            <CheckoutForm amount={amount} onPaymentComplete={onPaymentComplete} />
          </Elements>
        ) : !fetchError ? (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Shield className="h-3.5 w-3.5" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </div>
    </Card>
  );
}
