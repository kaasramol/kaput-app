import type { Metadata } from 'next';
import { ChatContent } from '@/components/chat/ChatContent';

export const metadata: Metadata = {
  title: 'Chat | Kaput',
};

interface ChatPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { bookingId } = await params;

  return <ChatContent bookingId={bookingId} />;
}
