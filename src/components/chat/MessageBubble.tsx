'use client';

import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/format';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-[var(--radius-md)] px-4 py-2.5',
          isOwn
            ? 'bg-accent text-white rounded-br-sm'
            : 'bg-bg-card text-text-primary rounded-bl-sm'
        )}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Shared image"
            className="mb-2 max-h-48 rounded-[var(--radius-sm)] object-cover"
          />
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={cn(
            'mt-1 text-[10px]',
            isOwn ? 'text-white/60' : 'text-text-muted'
          )}
        >
          {message.createdAt ? formatRelativeTime(message.createdAt) : 'Sending...'}
        </p>
      </div>
    </div>
  );
}
