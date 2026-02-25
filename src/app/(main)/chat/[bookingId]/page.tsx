import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat | Kaput',
};

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary">Chat</h1>
      <p className="mt-2 text-text-secondary">Message your mechanic about this booking.</p>
    </div>
  );
}
