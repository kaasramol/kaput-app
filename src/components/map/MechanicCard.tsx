'use client';

import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MechanicProfile } from '@/types';

interface MechanicCardProps {
  mechanic: MechanicProfile;
  selected?: boolean;
  onSelect?: () => void;
}

export function MechanicCard({ mechanic, selected, onSelect }: MechanicCardProps) {
  return (
    <Card
      hover
      onClick={onSelect}
      className={cn('p-4', selected && 'border-accent ring-1 ring-accent/50')}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Link
              href={`/mechanic/${mechanic.id}`}
              className="font-semibold text-text-primary hover:text-accent transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {mechanic.businessName}
            </Link>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{mechanic.address}</span>
            </div>
          </div>
          {mechanic.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium text-text-primary">{mechanic.rating.toFixed(1)}</span>
              <span className="text-text-muted">({mechanic.reviewCount})</span>
            </div>
          )}
        </div>

        {mechanic.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mechanic.services.slice(0, 4).map((service) => (
              <Badge key={service} variant="info">{service}</Badge>
            ))}
            {mechanic.services.length > 4 && (
              <Badge variant="default">+{mechanic.services.length - 4}</Badge>
            )}
          </div>
        )}

        {Object.keys(mechanic.hours).length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {isOpenNow(mechanic.hours) ? (
                <span className="text-success">Open now</span>
              ) : (
                'Closed'
              )}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function isOpenNow(hours: MechanicProfile['hours']): boolean {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const day = days[now.getDay()];
  const dayHours = hours[day];
  if (!dayHours) return false;

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= dayHours.open && currentTime <= dayHours.close;
}
