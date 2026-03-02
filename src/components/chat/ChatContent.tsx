'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import { getBookingById } from '@/lib/firestore-queries';
import { getUserDoc } from '@/lib/firestore-helpers';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import type { Booking, User as UserType } from '@/types';

interface ChatContentProps {
  bookingId: string;
}

export function ChatContent({ bookingId }: ChatContentProps) {
  const { user } = useAuth();
  const { messages, loading: chatLoading, error: chatError, sendMessage } = useChat(bookingId, user?.uid);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch booking and other user info
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      try {
        const b = await getBookingById(bookingId);
        if (!cancelled && b) {
          setBooking(b);
          // Determine the other user in the conversation
          const otherUid = b.carOwnerId === user!.uid ? b.mechanicId : b.carOwnerId;
          const otherUserDoc = await getUserDoc(otherUid);
          if (!cancelled) setOtherUser(otherUserDoc);
        } else if (!cancelled && !b) {
          setDataError('Booking not found.');
        }
      } catch {
        if (!cancelled) setDataError('Failed to load chat.');
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [bookingId, user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loading = dataLoading || chatLoading;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const error = dataError || chatError;
  if (error || !booking) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-text-primary">{error ?? 'Chat not found'}</p>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm" className="mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const otherName = otherUser?.displayName ?? 'User';
  const isChatDisabled = booking.status === 'cancelled' || booking.status === 'completed';

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ChatHeader
        otherUserName={otherName}
        bookingId={bookingId}
        bookingStatus={booking.status}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-bg-elevated p-4">
              <MessageSquare className="h-8 w-8 text-text-muted" />
            </div>
            <p className="font-medium text-text-primary">No messages yet</p>
            <p className="mt-1 text-sm text-text-secondary">
              Send a message to start the conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user?.uid}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      {isChatDisabled ? (
        <Card className="mx-4 mb-4 p-3 text-center">
          <p className="text-sm text-text-muted">
            This booking is {booking.status}. Chat is read-only.
          </p>
        </Card>
      ) : (
        <ChatInput onSend={sendMessage} />
      )}
    </div>
  );
}
