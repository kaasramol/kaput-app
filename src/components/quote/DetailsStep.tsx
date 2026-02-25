'use client';

import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DetailsStepProps {
  description: string;
  photos: File[];
  onDescriptionChange: (value: string) => void;
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (index: number) => void;
}

export function DetailsStep({
  description,
  photos,
  onDescriptionChange,
  onAddPhotos,
  onRemovePhoto,
}: DetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddPhotos(files);
    }
    // Reset so the same file can be selected again
    e.target.value = '';
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">Describe the issue</h2>
        <p className="text-sm text-text-secondary">
          Provide any additional details that would help a mechanic understand your issue.
        </p>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="e.g. The noise started last week and gets louder when I accelerate..."
          rows={5}
          className={cn(
            'w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors',
            'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50',
            'resize-none'
          )}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">Photos (optional)</h3>
        <p className="text-sm text-text-secondary">
          Add photos of the issue to help mechanics give a more accurate quote.
        </p>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg-elevated">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemovePhoto(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          Add Photos
        </Button>
      </div>
    </div>
  );
}
