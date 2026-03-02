'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSend(text);
      setText('');
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border bg-bg-secondary p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        disabled={disabled || sending}
        className={cn(
          'flex-1 resize-none rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted',
          'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'max-h-32'
        )}
      />
      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors',
          text.trim()
            ? 'bg-accent text-white hover:bg-accent-hover'
            : 'bg-bg-elevated text-text-muted cursor-not-allowed'
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
