'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, Car, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getVehiclesByOwner } from '@/lib/firestore-queries';
import { updateUserDoc, createVehicleDoc, deleteVehicleDoc } from '@/lib/firestore-helpers';
import { changePassword } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import type { Vehicle } from '@/types';

export function SettingsContent() {
  const { user, firebaseUser } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add vehicle modal
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleSaving, setVehicleSaving] = useState(false);

  // Delete vehicle
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  const isGoogleUser = firebaseUser?.providerData.some((p) => p.providerId === 'google.com');

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName);
    setPhone(user.phone ?? '');
    if (user.role === 'car_owner') {
      getVehiclesByOwner(user.uid)
        .then(setVehicles)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateUserDoc(user.uid, {
        displayName: displayName.trim(),
        phone: phone.trim() || undefined,
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch {
      setPasswordMsg({ type: 'error', text: 'Failed to change password. Check your current password.' });
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleAddVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setVehicleSaving(true);
    try {
      const vehicle = await createVehicleDoc({
        ownerId: user.uid,
        make: vehicleMake.trim(),
        model: vehicleModel.trim(),
        year: parseInt(vehicleYear, 10),
        color: vehicleColor.trim() || undefined,
        licensePlate: vehiclePlate.trim() || undefined,
      });
      setVehicles((prev) => [vehicle, ...prev]);
      setShowAddVehicle(false);
      setVehicleMake('');
      setVehicleModel('');
      setVehicleYear('');
      setVehicleColor('');
      setVehiclePlate('');
    } catch {
      // Error adding vehicle
    } finally {
      setVehicleSaving(false);
    }
  }

  async function handleDeleteVehicle(vehicleId: string) {
    setDeletingVehicleId(vehicleId);
    try {
      await deleteVehicleDoc(vehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch {
      // Error deleting vehicle
    } finally {
      setDeletingVehicleId(null);
    }
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-text-secondary">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-accent-light" />
          <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label="Email"
            value={user.email}
            disabled
          />
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(604) 555-1234"
          />
          <div className="flex items-center gap-2">
            <Badge variant={user.role === 'car_owner' ? 'info' : 'success'}>
              {user.role === 'car_owner' ? 'Car Owner' : 'Mechanic'}
            </Badge>
          </div>
          {profileMsg && (
            <p className={`text-sm ${profileMsg.type === 'success' ? 'text-success' : 'text-error'}`}>
              {profileMsg.text}
            </p>
          )}
          <Button type="submit" loading={profileSaving}>
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Vehicles Section (car owners only) */}
      {user.role === 'car_owner' && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-accent-light" />
              <h2 className="text-lg font-semibold text-text-primary">My Vehicles</h2>
            </div>
            <Button size="sm" onClick={() => setShowAddVehicle(true)}>
              Add Vehicle
            </Button>
          </div>

          {vehicles.length === 0 ? (
            <p className="text-sm text-text-secondary">No vehicles added yet.</p>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-bg-secondary p-3"
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      {v.year} {v.make} {v.model}
                    </p>
                    <div className="flex gap-3 text-xs text-text-muted">
                      {v.color && <span>{v.color}</span>}
                      {v.licensePlate && <span>{v.licensePlate}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVehicle(v.id)}
                    disabled={deletingVehicleId === v.id}
                  >
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Password Section (email users only) */}
      {!isGoogleUser && (
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent-light" />
            <h2 className="text-lg font-semibold text-text-primary">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.type === 'success' ? 'text-success' : 'text-error'}`}>
                {passwordMsg.text}
              </p>
            )}
            <Button type="submit" loading={passwordSaving}>
              Change Password
            </Button>
          </form>
        </Card>
      )}

      {/* Add Vehicle Modal */}
      <Modal open={showAddVehicle} onClose={() => setShowAddVehicle(false)} title="Add Vehicle">
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <Input
            label="Make"
            value={vehicleMake}
            onChange={(e) => setVehicleMake(e.target.value)}
            placeholder="e.g. Toyota"
            required
          />
          <Input
            label="Model"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="e.g. Camry"
            required
          />
          <Input
            label="Year"
            type="number"
            value={vehicleYear}
            onChange={(e) => setVehicleYear(e.target.value)}
            placeholder="e.g. 2022"
            required
            min={1900}
            max={2030}
          />
          <Input
            label="Color (optional)"
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            placeholder="e.g. Silver"
          />
          <Input
            label="License Plate (optional)"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            placeholder="e.g. ABC 1234"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowAddVehicle(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={vehicleSaving}>
              Add Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
