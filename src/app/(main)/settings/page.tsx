import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Kaput',
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
      <p className="mt-2 text-text-secondary">Manage your account, notifications, and preferences.</p>
    </div>
  );
}
