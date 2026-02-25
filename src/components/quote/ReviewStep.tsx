'use client';

import { Car, Wrench, MessageSquare, Image } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Vehicle } from '@/types';

interface ReviewStepProps {
  vehicle: Vehicle | undefined;
  serviceCategory: string;
  symptoms: string[];
  description: string;
  photoCount: number;
}

export function ReviewStep({ vehicle, serviceCategory, symptoms, description, photoCount }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">Review your quote request</h2>
      <p className="text-sm text-text-secondary">Make sure everything looks correct before submitting.</p>

      <div className="space-y-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Vehicle</p>
              <p className="font-medium text-text-primary">
                {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Wrench className="mt-0.5 h-5 w-5 text-accent-light" />
            <div>
              <p className="text-xs text-text-muted">Service Category</p>
              <p className="font-medium text-text-primary">{serviceCategory}</p>
              {symptoms.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {symptoms.map((s) => (
                    <Badge key={s} variant="info">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {description && (
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 text-accent-light" />
              <div>
                <p className="text-xs text-text-muted">Description</p>
                <p className="text-sm text-text-primary whitespace-pre-wrap">{description}</p>
              </div>
            </div>
          </Card>
        )}

        {photoCount > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Image className="h-5 w-5 text-accent-light" />
              <div>
                <p className="text-xs text-text-muted">Photos</p>
                <p className="font-medium text-text-primary">
                  {photoCount} photo{photoCount !== 1 ? 's' : ''} attached
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
