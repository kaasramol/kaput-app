'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 }; // NYC fallback
const DEFAULT_ZOOM = 12;

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#12121a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#222238' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a0f' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

let optionsSet = false;

interface UseMapResult {
  mapRef: React.RefObject<HTMLDivElement | null>;
  map: google.maps.Map | null;
  userLocation: google.maps.LatLngLiteral | null;
  loading: boolean;
  error: string | null;
}

export function useMap(): UseMapResult {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initMap = useCallback(async (center: google.maps.LatLngLiteral) => {
    if (!mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key is not configured.');
      setLoading(false);
      return;
    }

    try {
      if (!optionsSet) {
        setOptions({ key: apiKey, v: 'weekly' });
        optionsSet = true;
      }

      const { Map } = await importLibrary('maps') as google.maps.MapsLibrary;

      const mapInstance = new Map(mapRef.current, {
        center,
        zoom: DEFAULT_ZOOM,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      setMap(mapInstance);
    } catch {
      setError('Failed to load Google Maps.');
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
        initMap(location);
      },
      () => {
        initMap(DEFAULT_CENTER);
      },
      { timeout: 5000 }
    );
  }, [initMap]);

  return { mapRef, map, userLocation, loading, error };
}
