'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { SERVICE_CATEGORIES } from '@/lib/service-categories';

export interface MapFilterState {
  search: string;
  serviceType: string | null;
  minRating: number;
}

interface MapFiltersProps {
  filters: MapFilterState;
  onFilterChange: (filters: MapFilterState) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const RATING_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

export function MapFilters({ filters, onFilterChange, showFilters, onToggleFilters }: MapFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search + toggle */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search mechanics..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          size="md"
          onClick={onToggleFilters}
          className="shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="space-y-4 rounded-[var(--radius-md)] border border-border bg-bg-card p-4">
          {/* Service type */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Service Type</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange({ ...filters, serviceType: null })}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  filters.serviceType === null
                    ? 'border-accent bg-accent/15 text-accent-light'
                    : 'border-border text-text-secondary hover:border-accent/30'
                )}
              >
                All
              </button>
              {SERVICE_CATEGORIES.slice(0, -1).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      serviceType: filters.serviceType === cat.id ? null : cat.id,
                    })
                  }
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs transition-colors',
                    filters.serviceType === cat.id
                      ? 'border-accent bg-accent/15 text-accent-light'
                      : 'border-border text-text-secondary hover:border-accent/30'
                  )}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min rating */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-secondary">Minimum Rating</p>
            <div className="flex gap-2">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange({ ...filters, minRating: opt.value })}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs transition-colors',
                    filters.minRating === opt.value
                      ? 'border-accent bg-accent/15 text-accent-light'
                      : 'border-border text-text-secondary hover:border-accent/30'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {(filters.serviceType !== null || filters.minRating > 0 || filters.search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange({ search: '', serviceType: null, minRating: 0 })}
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
