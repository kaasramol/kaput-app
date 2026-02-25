import type { Metadata } from 'next';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard | Kaput',
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <DashboardContent />
    </div>
  );
}
