'use client';

import { Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';
import type { QuoteResponse } from '@/types';

interface QuoteResponseCardProps {
  response: QuoteResponse;
  isAccepted: boolean;
  canAccept: boolean;
  onAccept: () => void;
}

export function QuoteResponseCard({ response, isAccepted, canAccept, onAccept }: QuoteResponseCardProps) {
  return (
    <Card className={isAccepted ? 'border-success/50 ring-1 ring-success/30' : undefined}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-text-primary">Mechanic Quote</p>
            {response.message && (
              <p className="mt-1 text-sm text-text-secondary">{response.message}</p>
            )}
          </div>
          {isAccepted && <Badge variant="success">Accepted</Badge>}
        </div>

        {/* Line items */}
        <div className="space-y-2 rounded-[var(--radius-md)] bg-bg-secondary p-3">
          {response.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={item.type === 'parts' ? 'info' : 'default'}>
                  {item.type}
                </Badge>
                <span className="text-text-primary">{item.description}</span>
              </div>
              <span className="font-medium text-text-primary">{formatCurrency(item.cost)}</span>
            </div>
          ))}
        </div>

        {/* Total + time estimate */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold text-text-primary">{formatCurrency(response.totalCost)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Clock className="h-4 w-4" />
              <span>{response.estimatedTime}</span>
            </div>
          </div>
          {canAccept && !isAccepted && (
            <Button size="sm" onClick={onAccept}>
              Accept Quote
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
