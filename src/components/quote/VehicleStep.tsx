'use client';

import { Car, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/types';

interface VehicleStepProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelect: (vehicleId: string) => void;
  onAddVehicle: () => void;
}

export function VehicleStep({ vehicles, selectedVehicleId, onSelect, onAddVehicle }: VehicleStepProps) {
  if (vehicles.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">Select a Vehicle</h2>
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-bg-elevated p-4">
            <Car className="h-8 w-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No vehicles added</h3>
          <p className="mt-1 text-sm text-text-secondary">Add a vehicle first to request a quote.</p>
          <Button onClick={onAddVehicle} size="sm" className="mt-4">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">Select a Vehicle</h2>
      <p className="text-sm text-text-secondary">Which vehicle needs service?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            hover
            onClick={() => onSelect(vehicle.id)}
            className={cn(
              'p-4',
              selectedVehicleId === vehicle.id && 'border-accent ring-1 ring-accent/50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-[var(--radius-md)] bg-bg-elevated p-2">
                <Car className="h-5 w-5 text-accent-light" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.color && (
                  <p className="text-sm text-text-secondary">{vehicle.color}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <button
        onClick={onAddVehicle}
        className="flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add another vehicle
      </button>
    </div>
  );
}
