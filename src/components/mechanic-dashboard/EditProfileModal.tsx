'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { updateMechanicProfile } from '@/lib/firestore-helpers';
import { geocodeAddress } from '@/lib/geocoding';
import type { MechanicProfile, BusinessHours } from '@/types';

const SERVICE_OPTIONS = [
  'Oil Change',
  'Brake Repair',
  'Tire Service',
  'Engine Diagnostics',
  'Transmission',
  'Electrical',
  'Body Work',
  'General Maintenance',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: MechanicProfile;
  onProfileUpdated: (updates: Partial<MechanicProfile>) => void;
}

export function EditProfileModal({ open, onClose, profile, onProfileUpdated }: EditProfileModalProps) {
  const [description, setDescription] = useState(profile.description);
  const [address, setAddress] = useState(profile.address);
  const [phone, setPhone] = useState(profile.phone);
  const [services, setServices] = useState<string[]>(profile.services);
  const [certifications, setCertifications] = useState(profile.certifications.join(', '));
  const [hours, setHours] = useState<BusinessHours>(() => {
    const h: BusinessHours = {};
    for (const day of DAYS) {
      h[day] = profile.hours[day] ?? { open: '09:00', close: '17:00' };
    }
    return h;
  });
  const [enabledDays, setEnabledDays] = useState<Set<string>>(() => new Set(Object.keys(profile.hours)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleService(service: string) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  function toggleDay(day: string) {
    setEnabledDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function updateHour(day: string, field: 'open' | 'close', value: string) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const activeHours: BusinessHours = {};
    for (const day of DAYS) {
      if (enabledDays.has(day)) {
        activeHours[day] = hours[day];
      }
    }

    const certsArray = certifications
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      const addressChanged = address.trim() !== profile.address;
      const geo = addressChanged ? await geocodeAddress(address.trim()) : null;

      await updateMechanicProfile(profile.id, {
        description: description.trim(),
        address: address.trim(),
        phone: phone.trim(),
        services,
        certifications: certsArray,
        hours: activeHours,
        ...(geo && { latitude: geo.latitude, longitude: geo.longitude }),
      });
      onProfileUpdated({
        description: description.trim(),
        address: address.trim(),
        phone: phone.trim(),
        services,
        certifications: certsArray,
        hours: activeHours,
      });
      onClose();
    } catch {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        {/* Basic info */}
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell car owners about your shop..."
            rows={3}
            className="w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Services */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Services</label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  services.includes(service)
                    ? 'bg-accent text-white'
                    : 'border border-border bg-bg-secondary text-text-secondary hover:border-accent/30'
                )}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <Input
          label="Certifications (comma-separated)"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          placeholder="e.g. ASE Certified, Red Seal"
        />

        {/* Hours of operation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">Hours of Operation</label>
          <div className="space-y-2">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'w-24 shrink-0 rounded-full px-2 py-1 text-xs font-medium transition-colors',
                    enabledDays.has(day)
                      ? 'bg-accent/15 text-accent-light'
                      : 'bg-bg-elevated text-text-muted'
                  )}
                >
                  {day.slice(0, 3)}
                </button>
                {enabledDays.has(day) ? (
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={hours[day]?.open ?? '09:00'}
                      onChange={(e) => updateHour(day, 'open', e.target.value)}
                      className="rounded-[var(--radius-sm)] border border-border bg-bg-secondary px-2 py-1 text-xs text-text-primary"
                    />
                    <span className="text-text-muted">to</span>
                    <input
                      type="time"
                      value={hours[day]?.close ?? '17:00'}
                      onChange={(e) => updateHour(day, 'close', e.target.value)}
                      className="rounded-[var(--radius-sm)] border border-border bg-bg-secondary px-2 py-1 text-xs text-text-primary"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
