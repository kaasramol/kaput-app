'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface DateTimePickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00',
];

function formatTimeSlot(time: string): string {
  const [hours] = time.split(':');
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export function DateTimePicker({ selectedDate, onSelect }: DateTimePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [pickedDay, setPickedDay] = useState<Date | null>(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : null
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    setPickedDay(date);
  }

  function handleTimeClick(time: string) {
    if (!pickedDay) return;
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(pickedDay);
    date.setHours(hours, minutes, 0, 0);
    onSelect(date);
  }

  function isDayPast(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day);
    return date < today;
  }

  function isDaySelected(day: number): boolean {
    if (!pickedDay) return false;
    return (
      pickedDay.getDate() === day &&
      pickedDay.getMonth() === viewMonth &&
      pickedDay.getFullYear() === viewYear
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-text-primary">{monthLabel}</span>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="py-1 text-xs font-medium text-text-muted">{d}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const past = isDayPast(day);
            const selected = isDaySelected(day);

            return (
              <button
                key={day}
                disabled={past}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'rounded-[var(--radius-sm)] py-1.5 text-sm transition-colors',
                  past && 'cursor-not-allowed text-text-muted/40',
                  !past && !selected && 'text-text-primary hover:bg-bg-elevated',
                  selected && 'bg-accent text-white'
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {pickedDay && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">Select a time</p>
          <div className="grid grid-cols-5 gap-2">
            {TIME_SLOTS.map((time) => {
              const isSelected =
                selectedDate &&
                pickedDay.getDate() === selectedDate.getDate() &&
                pickedDay.getMonth() === selectedDate.getMonth() &&
                selectedDate.getHours() === parseInt(time.split(':')[0], 10);

              return (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className={cn(
                    'rounded-[var(--radius-sm)] border py-2 text-xs transition-colors',
                    isSelected
                      ? 'border-accent bg-accent/15 text-accent-light'
                      : 'border-border text-text-secondary hover:border-accent/30'
                  )}
                >
                  {formatTimeSlot(time)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
