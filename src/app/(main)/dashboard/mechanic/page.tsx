import type { Metadata } from 'next';
import { MechanicDashboardContent } from '@/components/mechanic-dashboard/MechanicDashboardContent';

export const metadata: Metadata = {
  title: 'Mechanic Dashboard | Kaput',
};

export default function MechanicDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <MechanicDashboardContent />
    </div>
  );
}
