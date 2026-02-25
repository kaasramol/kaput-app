'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { SERVICE_CATEGORIES } from '@/lib/service-categories';

interface ServiceStepProps {
  selectedCategory: string | null;
  selectedSymptoms: string[];
  onSelectCategory: (categoryId: string) => void;
  onToggleSymptom: (symptom: string) => void;
}

export function ServiceStep({
  selectedCategory,
  selectedSymptoms,
  onSelectCategory,
  onToggleSymptom,
}: ServiceStepProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">What type of service?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              hover
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 text-center',
                selectedCategory === cat.id && 'border-accent ring-1 ring-accent/50'
              )}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium text-text-primary">{cat.label}</span>
            </Card>
          ))}
        </div>
      </div>

      {category && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Select symptoms</h3>
          <p className="text-sm text-text-secondary">Select all that apply.</p>
          <div className="flex flex-wrap gap-2">
            {category.symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => onToggleSymptom(symptom)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition-colors',
                    isSelected
                      ? 'border-accent bg-accent/15 text-accent-light'
                      : 'border-border text-text-secondary hover:border-accent/30 hover:text-text-primary'
                  )}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
