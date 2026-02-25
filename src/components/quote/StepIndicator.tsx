'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  'h-px w-6 sm:w-10',
                  isCompleted ? 'bg-accent' : 'bg-border'
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isCompleted && 'bg-accent text-white',
                  isCurrent && 'border-2 border-accent text-accent',
                  !isCompleted && !isCurrent && 'border border-border text-text-muted'
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  'hidden text-sm sm:inline',
                  isCurrent ? 'font-medium text-text-primary' : 'text-text-muted'
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
