import type { Metadata } from 'next';
import { SettingsContent } from '@/components/settings/SettingsContent';

export const metadata: Metadata = {
  title: 'Settings | Kaput',
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <SettingsContent />
    </div>
  );
}
