'use client';

import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';
import type { Booking } from '@/types';

interface EarningsCardProps {
  bookings: Booking[];
}

export function EarningsCard({ bookings }: EarningsCardProps) {
  const completed = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completed
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalCost, 0);
  const pendingPayout = completed
    .filter((b) => b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + b.totalCost, 0);
  const jobCount = completed.length;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-[var(--radius-md)] bg-success/15 p-2">
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Total Earnings</p>
            <p className="text-xl font-bold text-text-primary">{formatCurrency(totalEarnings)}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-[var(--radius-md)] bg-warning/15 p-2">
            <TrendingUp className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Pending Payout</p>
            <p className="text-xl font-bold text-text-primary">{formatCurrency(pendingPayout)}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-[var(--radius-md)] bg-accent/15 p-2">
            <Briefcase className="h-5 w-5 text-accent-light" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Jobs Completed</p>
            <p className="text-xl font-bold text-text-primary">{jobCount}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
