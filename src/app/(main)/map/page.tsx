import type { Metadata } from 'next';
import { MapContent } from '@/components/map/MapContent';

export const metadata: Metadata = {
  title: 'Find Mechanics | Kaput',
};

export default function MapPage() {
  return <MapContent />;
}
