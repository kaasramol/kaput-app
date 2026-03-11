'use client';

import { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { respondToAdditionalWork } from '@/lib/firestore-helpers';
import { sendAdditionalWorkResponseNotification } from '@/lib/notification-triggers';
import { formatCurrency } from '@/lib/format';
import type { AdditionalWorkRequest } from '@/types';

interface AdditionalWorkApprovalProps {
  bookingId: string;
  mechanicId: string;
  requests: AdditionalWorkRequest[];
  isOwner: boolean;
  onUpdated: (requestId: string, approved: boolean) => void;
}

const STATUS_BADGE = {
  pending: { label: 'Pending Approval', variant: 'warning' as const },
  approved: { label: 'Approved', variant: 'success' as const },
  declined: { label: 'Declined', variant: 'default' as const },
};

export function AdditionalWorkApproval({ bookingId, mechanicId, requests, isOwner, onUpdated }: AdditionalWorkApprovalProps) {
  if (requests.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
        <AlertTriangle className="h-5 w-5 text-warning" />
        Additional Work Requests
      </h3>
      {requests.map((request) => (
        <AdditionalWorkCard
          key={request.id}
          bookingId={bookingId}
          mechanicId={mechanicId}
          request={request}
          isOwner={isOwner}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  );
}

function AdditionalWorkCard({
  bookingId,
  mechanicId,
  request,
  isOwner,
  onUpdated,
}: {
  bookingId: string;
  mechanicId: string;
  request: AdditionalWorkRequest;
  isOwner: boolean;
  onUpdated: (requestId: string, approved: boolean) => void;
}) {
  const [responding, setResponding] = useState(false);
  const badge = STATUS_BADGE[request.status];

  async function handleRespond(approved: boolean) {
    setResponding(true);
    try {
      await respondToAdditionalWork(bookingId, request.id, approved);
      sendAdditionalWorkResponseNotification(mechanicId, bookingId, approved).catch(() => {});
      onUpdated(request.id, approved);
    } catch {
      // Failed to respond
    } finally {
      setResponding(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">{request.reason}</p>
          <div className="mt-2 space-y-1">
            {request.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {item.description}
                  <span className="ml-1 text-xs text-text-muted">({item.type})</span>
                </span>
                <span className="font-medium text-text-primary">{formatCurrency(item.cost)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-medium text-text-secondary">Additional Cost</span>
            <span className="font-bold text-text-primary">{formatCurrency(request.totalCost)}</span>
          </div>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </div>

      {isOwner && request.status === 'pending' && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleRespond(true)}
            disabled={responding}
          >
            <Check className="h-3.5 w-3.5" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleRespond(false)}
            disabled={responding}
          >
            <X className="h-3.5 w-3.5" />
            Decline
          </Button>
        </div>
      )}
    </Card>
  );
}
