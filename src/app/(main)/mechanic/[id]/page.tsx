import type { Metadata } from 'next';
import { MechanicProfileContent } from '@/components/mechanic/MechanicProfileContent';

export const metadata: Metadata = {
  title: 'Mechanic Profile | Kaput',
};

interface MechanicProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function MechanicProfilePage({ params }: MechanicProfilePageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <MechanicProfileContent mechanicId={id} />
    </div>
  );
}
