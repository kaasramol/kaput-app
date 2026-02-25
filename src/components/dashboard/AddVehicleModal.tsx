'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createVehicleDoc } from '@/lib/firestore-helpers';
import type { Vehicle } from '@/types';

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  ownerId: string;
  onVehicleAdded: (vehicle: Vehicle) => void;
}

export function AddVehicleModal({ open, onClose, ownerId, onVehicleAdded }: AddVehicleModalProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = make.trim() && model.trim() && year.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
      setError('Please enter a valid year.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const vehicle = await createVehicleDoc({
        ownerId,
        make: make.trim(),
        model: model.trim(),
        year: parsedYear,
        ...(color.trim() && { color: color.trim() }),
        ...(licensePlate.trim() && { licensePlate: licensePlate.trim() }),
      });
      onVehicleAdded(vehicle);
      resetForm();
      onClose();
    } catch {
      setError('Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setMake('');
    setModel('');
    setYear('');
    setColor('');
    setLicensePlate('');
    setError(null);
  }

  function handleClose() {
    if (!loading) {
      resetForm();
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Vehicle">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Make"
          placeholder="e.g. Toyota"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          required
        />
        <Input
          label="Model"
          placeholder="e.g. Camry"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
        <Input
          label="Year"
          placeholder="e.g. 2022"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <Input
          label="Color (optional)"
          placeholder="e.g. Silver"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <Input
          label="License Plate (optional)"
          placeholder="e.g. ABC 1234"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!canSubmit}>
            Add Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
}
