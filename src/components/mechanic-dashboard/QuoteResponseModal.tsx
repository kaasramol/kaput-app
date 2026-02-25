'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { submitQuoteResponse } from '@/lib/firestore-helpers';
import { formatCurrency } from '@/lib/format';
import type { Quote, QuoteItem, QuoteItemType } from '@/types';

interface QuoteResponseModalProps {
  open: boolean;
  onClose: () => void;
  quote: Quote;
  mechanicId: string;
  onResponseSubmitted: () => void;
}

interface LineItem {
  description: string;
  type: QuoteItemType;
  cost: string;
}

const EMPTY_ITEM: LineItem = { description: '', type: 'labor', cost: '' };

export function QuoteResponseModal({
  open,
  onClose,
  quote,
  mechanicId,
  onResponseSubmitted,
}: QuoteResponseModalProps) {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ ...EMPTY_ITEM }]);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCost = items.reduce((sum, item) => {
    const cost = parseFloat(item.cost);
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);

  const canSubmit =
    items.length > 0 &&
    items.every((i) => i.description.trim() && i.cost.trim()) &&
    estimatedTime.trim();

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function toggleType(index: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, type: item.type === 'labor' ? 'parts' : 'labor' } : item
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const quoteItems: QuoteItem[] = items.map((item) => ({
        description: item.description.trim(),
        type: item.type,
        cost: parseFloat(item.cost),
      }));

      await submitQuoteResponse({
        quoteId: quote.id,
        mechanicId,
        ...(message.trim() && { message: message.trim() }),
        items: quoteItems,
        totalCost,
        estimatedTime: estimatedTime.trim(),
      });

      onResponseSubmitted();
      onClose();
    } catch {
      setError('Failed to submit response. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Respond to Quote" className="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quote summary */}
        <div className="rounded-[var(--radius-md)] bg-bg-secondary p-3">
          <p className="text-sm font-medium text-text-primary">{quote.serviceCategory}</p>
          <p className="mt-0.5 text-sm text-text-secondary">{quote.description}</p>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Any notes for the car owner..."
            rows={2}
            className="w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none"
          />
        </div>

        {/* Line items */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-secondary">Line Items</p>
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => toggleType(index)}
                className="mt-1.5 shrink-0"
              >
                <Badge variant={item.type === 'parts' ? 'info' : 'default'}>
                  {item.type}
                </Badge>
              </button>
              <div className="flex-1">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
              </div>
              <div className="w-24">
                <Input
                  placeholder="Cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.cost}
                  onChange={(e) => updateItem(index, 'cost', e.target.value)}
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-2 text-text-muted hover:text-error transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addItem}>
            <Plus className="h-3.5 w-3.5" />
            Add item
          </Button>
        </div>

        {/* Estimated time */}
        <Input
          label="Estimated Time"
          placeholder="e.g. 2-3 hours"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          required
        />

        {/* Total */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium text-text-secondary">Total</span>
          <span className="text-lg font-bold text-text-primary">{formatCurrency(totalCost)}</span>
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!canSubmit}>
            Submit Quote
          </Button>
        </div>
      </form>
    </Modal>
  );
}
