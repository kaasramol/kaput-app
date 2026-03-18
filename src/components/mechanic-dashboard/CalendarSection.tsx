'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/types';

interface CalendarSectionProps {
  bookings: Booking[];
}

const STATUS_COLOR: Record<BookingStatus, string> = {
  confirmed: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-gray-500',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getBookingDate(booking: Booking): Date {
  const s = booking.scheduledAt;
  if (typeof s?.toDate === 'function') return s.toDate();
  return new Date(s as unknown as string);
}

export function CalendarSection({ bookings }: CalendarSectionProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group bookings by date string (YYYY-MM-DD)
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      if (b.status === 'cancelled') continue;
      const d = getBookingDate(b);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return map;
  }, [bookings]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { date: number; key: string; isToday: boolean }[] = [];
    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      days.push({ date: d, key, isToday });
    }

    return { days, firstDay };
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const selectedBookings = selectedDate ? bookingsByDate.get(selectedDate) ?? [] : [];

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
        <Calendar className="h-5 w-5 text-accent-light" />
        Calendar
      </h2>

      <Card className="p-4">
        {/* Month navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-text-primary">{monthLabel}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS_OF_WEEK.map((d) => (
            <span key={d} className="py-1 text-[10px] font-medium text-text-muted">{d}</span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: calendarDays.firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {calendarDays.days.map(({ date, key, isToday }) => {
            const dayBookings = bookingsByDate.get(key);
            const hasBookings = !!dayBookings && dayBookings.length > 0;
            const isSelected = selectedDate === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(isSelected ? null : key)}
                className={cn(
                  'relative flex flex-col items-center rounded-[var(--radius-sm)] py-1.5 text-xs transition-colors',
                  isToday && 'font-bold',
                  isSelected
                    ? 'bg-accent/20 text-accent-light'
                    : 'text-text-primary hover:bg-bg-elevated',
                )}
              >
                {date}
                {hasBookings && (
                  <div className="mt-0.5 flex gap-0.5">
                    {dayBookings.slice(0, 3).map((b, i) => (
                      <span
                        key={i}
                        className={cn('h-1 w-1 rounded-full', STATUS_COLOR[b.status])}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected date detail */}
      {selectedDate && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {selectedBookings.length === 0 ? (
            <p className="text-sm text-text-muted">No appointments scheduled.</p>
          ) : (
            selectedBookings.map((b) => (
              <Card key={b.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {getBookingDate(b).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-text-secondary">{formatCurrency(b.totalCost)}</p>
                  </div>
                  <Badge
                    variant={
                      b.status === 'confirmed' ? 'info' :
                      b.status === 'in_progress' ? 'warning' :
                      'success'
                    }
                  >
                    {b.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
