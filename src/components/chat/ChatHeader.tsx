'use client';

import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { BookingStatus } from '@/types';

interface ChatHeaderProps {
  otherUserName: string;
  bookingId: string;
  bookingStatus: BookingStatus;
}

const STATUS_LABEL: Record<BookingStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'default' }> = {
  confirmed: { label: 'Confirmed', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export function ChatHeader({ otherUserName, bookingId, bookingStatus }: ChatHeaderProps) {
  const status = STATUS_LABEL[bookingStatus];

  return (
    <div className="flex items-center gap-3 border-b border-border bg-bg-secondary px-4 py-3">
      <Link
        href={`/booking/${bookingId}`}
        className="rounded-[var(--radius-sm)] p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated">
        <User className="h-5 w-5 text-text-muted" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-text-primary">{otherUserName}</p>
        <p className="text-xs text-text-muted">Booking #{bookingId.slice(0, 8)}</p>
      </div>
      <Badge variant={status.variant}>{status.label}</Badge>
    </div>
  );
}
