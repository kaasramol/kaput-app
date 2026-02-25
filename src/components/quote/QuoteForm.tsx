'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { createQuoteDoc } from '@/lib/firestore-helpers';
import { SERVICE_CATEGORIES } from '@/lib/service-categories';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { AddVehicleModal } from '@/components/dashboard/AddVehicleModal';
import { StepIndicator } from '@/components/quote/StepIndicator';
import { VehicleStep } from '@/components/quote/VehicleStep';
import { ServiceStep } from '@/components/quote/ServiceStep';
import { DetailsStep } from '@/components/quote/DetailsStep';
import { ReviewStep } from '@/components/quote/ReviewStep';
import type { Vehicle } from '@/types';

const STEPS = ['Vehicle', 'Service', 'Details', 'Review'];

export function QuoteForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { vehicles, loading } = useDashboardData(user?.uid);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  // AddVehicle modal
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [localVehicles, setLocalVehicles] = useState<Vehicle[]>([]);

  const allVehicles = [...localVehicles, ...vehicles];
  const selectedVehicle = allVehicles.find((v) => v.id === selectedVehicleId);
  const categoryLabel = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)?.label ?? '';

  const handleVehicleAdded = useCallback((vehicle: Vehicle) => {
    setLocalVehicles((prev) => [vehicle, ...prev]);
    setSelectedVehicleId(vehicle.id);
  }, []);

  function handleSelectCategory(categoryId: string) {
    if (categoryId !== selectedCategory) {
      setSelectedSymptoms([]);
    }
    setSelectedCategory(categoryId);
  }

  function handleToggleSymptom(symptom: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  function handleAddPhotos(files: File[]) {
    setPhotos((prev) => [...prev, ...files]);
  }

  function handleRemovePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return selectedVehicleId !== null;
      case 1: return selectedCategory !== null;
      case 2: return true; // description and photos are optional on this step
      case 3: return true;
      default: return false;
    }
  }

  async function handleSubmit() {
    if (!user || !selectedVehicleId || !selectedCategory) return;

    setSubmitting(true);
    setError(null);

    try {
      // TODO: Upload photos to Firebase Storage and get URLs
      const photoUrls: string[] = [];

      const quote = await createQuoteDoc({
        carOwnerId: user.uid,
        vehicleId: selectedVehicleId,
        serviceCategory: categoryLabel,
        symptoms: selectedSymptoms,
        description: description.trim(),
        photos: photoUrls,
      });

      router.push(`/quote/${quote.id}`);
    } catch {
      setError('Failed to submit quote. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="min-h-[300px]">
        {step === 0 && (
          <VehicleStep
            vehicles={allVehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={setSelectedVehicleId}
            onAddVehicle={() => setShowAddVehicle(true)}
          />
        )}
        {step === 1 && (
          <ServiceStep
            selectedCategory={selectedCategory}
            selectedSymptoms={selectedSymptoms}
            onSelectCategory={handleSelectCategory}
            onToggleSymptom={handleToggleSymptom}
          />
        )}
        {step === 2 && (
          <DetailsStep
            description={description}
            photos={photos}
            onDescriptionChange={setDescription}
            onAddPhotos={handleAddPhotos}
            onRemovePhoto={handleRemovePhoto}
          />
        )}
        {step === 3 && (
          <ReviewStep
            vehicle={selectedVehicle}
            serviceCategory={categoryLabel}
            symptoms={selectedSymptoms}
            description={description}
            photoCount={photos.length}
          />
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canAdvance()}
          >
            <Send className="h-4 w-4" />
            Submit Quote Request
          </Button>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {user && (
        <AddVehicleModal
          open={showAddVehicle}
          onClose={() => setShowAddVehicle(false)}
          ownerId={user.uid}
          onVehicleAdded={handleVehicleAdded}
        />
      )}
    </div>
  );
}
