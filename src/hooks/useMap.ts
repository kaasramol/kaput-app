'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type L from 'leaflet';

const DEFAULT_CENTER: [number, number] = [49.2827, -123.1207]; // Vancouver, BC
const DEFAULT_ZOOM = 12;

let leafletLoaded = false;
let leafletModule: typeof L | null = null;

interface UseMapResult {
  mapRef: React.RefObject<HTMLDivElement | null>;
  map: L.Map | null;
  leaflet: typeof L | null;
  userLocation: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
}

export function useMap(): UseMapResult {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [leaflet, setLeaflet] = useState<typeof L | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(async (center: [number, number]) => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      if (!leafletLoaded) {
        leafletModule = (await import('leaflet')).default;

        // Fix default marker icons for Leaflet + bundlers
        leafletModule.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Inject Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        leafletLoaded = true;
      }

      const LL = leafletModule!;

      const mapInstance = LL.map(mapRef.current, {
        center,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true,
      });

      // Dark-themed tiles from CartoDB
      LL.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);
      setLeaflet(LL);
    } catch {
      setError('Failed to load map.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      initMap(DEFAULT_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        initMap([location.lat, location.lng]);
      },
      () => {
        initMap(DEFAULT_CENTER);
      },
      { timeout: 5000 }
    );
  }, [initMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return { mapRef, map, leaflet, userLocation, loading, error };
}
