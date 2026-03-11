'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { sendMessage as sendMessageHelper } from '@/lib/firestore-helpers';
import type { Message } from '@/types';

interface UseChatResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string, imageUrl?: string) => Promise<void>;
}

export function useChat(bookingId: string, senderId: string | undefined): UseChatResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener
  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(getFirebaseDb(), 'messages'),
      where('bookingId', '==', bookingId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => doc.data() as Message);
        setMessages(msgs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [bookingId]);

  const sendMessage = useCallback(
    async (text: string, imageUrl?: string) => {
      if (!senderId || (!text.trim() && !imageUrl)) return;
      await sendMessageHelper({
        bookingId,
        senderId,
        text: text.trim(),
        imageUrl,
      });
    },
    [bookingId, senderId]
  );

  return { messages, loading, error, sendMessage };
}
