'use client';

import { Car, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Vehicle } from '@/types';

interface VehicleSectionProps {
  vehicles: Vehicle[];
  onAddVehicle: () => void;
}

export function VehicleSection({ vehicles, onAddVehicle }: VehicleSectionProps) {
  if (vehicles.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-bg-elevated p-4">
          <Car className="h-8 w-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">No vehicles yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Add your first vehicle to get started.</p>
        <Button onClick={onAddVehicle} size="sm" className="mt-4">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">My Vehicles</h2>
        <Button variant="ghost" size="sm" onClick={onAddVehicle}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-md)] bg-bg-elevated p-2">
              <Car className="h-5 w-5 text-accent-light" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-text-primary">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              {(vehicle.color || vehicle.licensePlate) && (
                <p className="text-sm text-text-secondary">
                  {[vehicle.color, vehicle.licensePlate].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
