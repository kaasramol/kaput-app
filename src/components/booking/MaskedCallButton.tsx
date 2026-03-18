'use client';

import { useState } from 'react';
import { Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MaskedCallButtonProps {
  bookingId: string;
  callerId: string;
  callerPhone?: string;
  targetRole: 'mechanic' | 'car_owner';
  mechanicId: string;
  carOwnerId: string;
}

export function MaskedCallButton({
  bookingId,
  callerId,
  callerPhone,
  targetRole,
  mechanicId,
  carOwnerId,
}: MaskedCallButtonProps) {
  const [proxyNumber, setProxyNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInitiate() {
    if (!callerPhone) {
      setError('Add your phone number in Settings to make calls.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/call/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          callerId,
          callerPhone,
          targetRole,
          mechanicId,
          carOwnerId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProxyNumber(data.proxyNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set up call.');
    } finally {
      setLoading(false);
    }
  }

  const targetLabel = targetRole === 'mechanic' ? 'Mechanic' : 'Customer';

  if (proxyNumber) {
    return (
      <Card className="border-accent/30 bg-accent/5 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent/15 p-2">
            <PhoneCall className="h-5 w-5 text-accent-light" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              Call this number to reach the {targetLabel.toLowerCase()}:
            </p>
            <a
              href={`tel:${proxyNumber}`}
              className="mt-1 block text-lg font-bold text-accent-light hover:underline"
            >
              {proxyNumber}
            </a>
            <p className="mt-1 text-xs text-text-muted">
              Your phone number is hidden. This number expires in 30 minutes.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Button variant="secondary" size="sm" onClick={handleInitiate} loading={loading}>
        <Phone className="h-4 w-4" />
        Call {targetLabel}
      </Button>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
