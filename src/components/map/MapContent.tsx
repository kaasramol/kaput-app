'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { MapPin, List } from 'lucide-react';
import { useMap } from '@/hooks/useMap';
import { getMechanics } from '@/lib/firestore-queries';
import { SERVICE_CATEGORIES } from '@/lib/service-categories';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { MechanicCard } from '@/components/map/MechanicCard';
import { MapFilters, type MapFilterState } from '@/components/map/MapFilters';
import type { MechanicProfile } from '@/types';

export function MapContent() {
  const { mapRef, map, loading: mapLoading, error: mapError } = useMap();
  const [mechanics, setMechanics] = useState<MechanicProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(true);
  const [filters, setFilters] = useState<MapFilterState>({
    search: '',
    serviceType: null,
    minRating: 0,
  });
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Fetch mechanics
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getMechanics();
        if (!cancelled) setMechanics(data);
      } catch {
        // Silently fail — empty list is shown
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Filter mechanics
  const filtered = useMemo(() => {
    return mechanics.filter((m) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          m.businessName.toLowerCase().includes(q) ||
          m.address.toLowerCase().includes(q) ||
          m.services.some((s) => s.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (filters.serviceType) {
        const category = SERVICE_CATEGORIES.find((c) => c.id === filters.serviceType);
        if (category && !m.services.some((s) => s.toLowerCase().includes(category.label.toLowerCase()))) {
          return false;
        }
      }
      if (filters.minRating > 0 && m.rating < filters.minRating) return false;
      return true;
    });
  }, [mechanics, filters]);

  // Place markers on map
  const placeMarkers = useCallback(async () => {
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const infoWindow = new google.maps.InfoWindow();

    filtered.forEach((mechanic) => {
      if (!mechanic.location) return;
      const lat = mechanic.location.latitude;
      const lng = mechanic.location.longitude;
      if (lat === 0 && lng === 0) return;

      const marker = new google.maps.Marker({
        map,
        position: { lat, lng },
        title: mechanic.businessName,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#2563eb',
          strokeWeight: 2,
          scale: 8,
        },
      });

      marker.addListener('click', () => {
        setSelectedId(mechanic.id);
        infoWindow.setContent(`
          <div style="color:#0a0a0f;padding:4px;">
            <strong>${mechanic.businessName}</strong><br/>
            <span style="font-size:12px;">${mechanic.address}</span>
          </div>
        `);
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [map, filtered]);

  useEffect(() => {
    placeMarkers();
  }, [placeMarkers]);

  const loading = mapLoading || dataLoading;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          showList ? 'flex' : 'hidden lg:flex'
        } w-full flex-col border-r border-border bg-bg-secondary lg:w-[400px]`}
      >
        <div className="border-b border-border p-4">
          <MapFilters
            filters={filters}
            onFilterChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="md" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-bg-elevated p-3">
                <MapPin className="h-6 w-6 text-text-muted" />
              </div>
              <p className="font-medium text-text-primary">No mechanics found</p>
              <p className="mt-1 text-sm text-text-secondary">
                Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-muted">
                {filtered.length} mechanic{filtered.length !== 1 ? 's' : ''} found
              </p>
              {filtered.map((mechanic) => (
                <MechanicCard
                  key={mechanic.id}
                  mechanic={mechanic}
                  selected={selectedId === mechanic.id}
                  onSelect={() => {
                    setSelectedId(mechanic.id);
                    if (map && mechanic.location) {
                      const lat = mechanic.location.latitude;
                      const lng = mechanic.location.longitude;
                      if (lat !== 0 || lng !== 0) {
                        map.panTo({ lat, lng });
                        map.setZoom(15);
                      }
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-secondary">
            <Spinner size="lg" />
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg-secondary text-center">
            <MapPin className="mb-3 h-10 w-10 text-text-muted" />
            <p className="font-medium text-text-primary">Map unavailable</p>
            <p className="mt-1 text-sm text-text-secondary">{mapError}</p>
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" />

        {/* Mobile toggle */}
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 lg:hidden">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowList(!showList)}
            className="shadow-lg"
          >
            {showList ? (
              <>
                <MapPin className="h-4 w-4" />
                Show Map
              </>
            ) : (
              <>
                <List className="h-4 w-4" />
                Show List
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
