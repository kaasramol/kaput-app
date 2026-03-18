'use client';

import { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/format';
import type { Booking, Review } from '@/types';

interface AnalyticsSectionProps {
  bookings: Booking[];
  reviews: Review[];
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function AnalyticsSection({ bookings, reviews }: AnalyticsSectionProps) {
  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === 'completed');
    const paid = completed.filter((b) => b.paymentStatus === 'paid');

    // Monthly earnings for last 6 months
    const now = new Date();
    const monthlyEarnings: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthLabel = getMonthLabel(d);
      const amount = paid
        .filter((b) => {
          const completedDate = b.completedAt?.toDate?.() ?? new Date(b.completedAt as unknown as string);
          return completedDate >= d && completedDate <= monthEnd;
        })
        .reduce((sum, b) => sum + b.totalCost, 0);
      monthlyEarnings.push({ month: monthLabel, amount });
    }

    const maxEarning = Math.max(...monthlyEarnings.map((m) => m.amount), 1);

    // Completion rate
    const totalNonCancelled = bookings.filter((b) => b.status !== 'cancelled').length;
    const completionRate = totalNonCancelled > 0
      ? Math.round((completed.length / totalNonCancelled) * 100)
      : 0;

    // Average rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

    // Repeat customers
    const customerIds = completed.map((b) => b.carOwnerId);
    const uniqueCustomers = new Set(customerIds).size;
    const repeatCustomers = customerIds.length - uniqueCustomers;

    return { monthlyEarnings, maxEarning, completionRate, avgRating, uniqueCustomers, repeatCustomers };
  }, [bookings, reviews]);

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
        <BarChart3 className="h-5 w-5 text-accent-light" />
        Analytics
      </h2>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-md)] bg-success/15 p-2">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Completion Rate</p>
              <p className="text-lg font-bold text-text-primary">{stats.completionRate}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-md)] bg-warning/15 p-2">
              <Star className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Avg Rating</p>
              <p className="text-lg font-bold text-text-primary">{stats.avgRating}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-md)] bg-accent/15 p-2">
              <Users className="h-4 w-4 text-accent-light" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Customers</p>
              <p className="text-lg font-bold text-text-primary">
                {stats.uniqueCustomers}
                {stats.repeatCustomers > 0 && (
                  <span className="ml-1 text-xs font-normal text-text-muted">
                    ({stats.repeatCustomers} repeat)
                  </span>
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly earnings bar chart */}
      <Card className="p-4">
        <p className="mb-3 text-sm font-medium text-text-secondary">Monthly Earnings (Last 6 Months)</p>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {stats.monthlyEarnings.map((m) => {
            const height = stats.maxEarning > 0 ? (m.amount / stats.maxEarning) * 100 : 0;
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] text-text-muted">
                  {m.amount > 0 ? formatCurrency(m.amount) : ''}
                </span>
                <div
                  className="w-full rounded-t-[var(--radius-sm)] bg-accent/60 transition-all"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                <span className="text-[10px] text-text-muted">{m.month}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
