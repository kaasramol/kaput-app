'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { requestAdditionalWork } from '@/lib/firestore-helpers';
import { sendAdditionalWorkNotification } from '@/lib/notification-triggers';
import { formatCurrency } from '@/lib/format';
import type { AdditionalWorkItem, AdditionalWorkRequest } from '@/types';

interface AdditionalWorkModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  carOwnerId: string;
  onRequestSent: (request: AdditionalWorkRequest) => void;
}

const EMPTY_ITEM: AdditionalWorkItem = { description: '', type: 'parts', cost: 0 };

export function AdditionalWorkModal({ open, onClose, bookingId, carOwnerId, onRequestSent }: AdditionalWorkModalProps) {
  const [reason, setReason] = useState('');
  const [items, setItems] = useState<AdditionalWorkItem[]>([{ ...EMPTY_ITEM }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof AdditionalWorkItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const isValid = reason.trim().length >= 5 && items.length > 0 && items.every((i) => i.description.trim() && i.cost > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    setError(null);

    try {
      const request = await requestAdditionalWork({
        bookingId,
        reason: reason.trim(),
        items,
        totalCost,
      });
      onRequestSent(request);
      sendAdditionalWorkNotification(carOwnerId, bookingId, totalCost).catch(() => {});
      onClose();
      // Reset form
      setReason('');
      setItems([{ ...EMPTY_ITEM }]);
    } catch {
      setError('Failed to send request.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request Additional Work" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what additional work is needed and why..."
            rows={2}
            className="w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">Line Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="flex-1"
              />
              <select
                value={item.type}
                onChange={(e) => updateItem(index, 'type', e.target.value)}
                className="rounded-[var(--radius-md)] border border-border bg-bg-secondary px-2 py-2 text-sm text-text-primary"
              >
                <option value="parts">Parts</option>
                <option value="labor">Labor</option>
              </select>
              <Input
                type="number"
                placeholder="Cost"
                value={item.cost || ''}
                onChange={(e) => updateItem(index, 'cost', parseFloat(e.target.value) || 0)}
                className="w-24"
                min={0}
                step={0.01}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-2 text-text-muted transition-colors hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-light"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Item
          </button>
        </div>

        <div className="rounded-[var(--radius-md)] bg-bg-elevated px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Additional Total</span>
            <span className="text-lg font-bold text-text-primary">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={!isValid}>
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
