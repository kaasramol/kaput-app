'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  onDismiss: (id: string) => void;
  duration?: number;
}

const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof Info; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-success' },
  error: { icon: AlertCircle, color: 'text-error' },
  info: { icon: Info, color: 'text-accent-light' },
};

export function Toast({ id, title, message, variant = 'info', onDismiss, duration = 5000 }: ToastProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, onDismiss, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className="w-80 rounded-[var(--radius-md)] border border-border bg-bg-card p-4 shadow-[var(--shadow-elevated)]"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.color)} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          {message && <p className="mt-0.5 text-xs text-text-secondary">{message}</p>}
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="shrink-0 rounded-sm p-0.5 text-text-muted transition-colors hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
