'use client';

import { useState, useRef } from 'react';
import { Send, ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string, imageUrl?: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!text.trim() && !imageFile) || sending || disabled) return;

    setSending(true);
    try {
      let uploadedUrl: string | undefined;

      if (imageFile) {
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const { getFirebaseStorage } = await import('@/lib/firebase');
        const storage = getFirebaseStorage();
        const path = `chat/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, imageFile);
        uploadedUrl = await getDownloadURL(storageRef);
      }

      await onSend(text.trim() || (uploadedUrl ? '📷 Image' : ''), uploadedUrl);
      setText('');
      clearImage();
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

  const canSend = (text.trim() || imageFile) && !sending && !disabled;

  return (
    <div className="border-t border-border bg-bg-secondary">
      {/* Image preview */}
      {imagePreview && (
        <div className="relative mx-4 mt-3 inline-block">
          <img
            src={imagePreview}
            alt="Upload preview"
            className="h-20 rounded-[var(--radius-sm)] border border-border object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -right-2 -top-2 rounded-full bg-bg-elevated p-0.5 text-text-muted hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:opacity-50"
        >
          <ImagePlus className="h-5 w-5" />
        </button>

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
          disabled={!canSend}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors',
            canSend
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-bg-elevated text-text-muted cursor-not-allowed'
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
