/**
 * Adjustment Dialog - Manual inventory adjustment
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Lot, AdjustmentReason, Crop, Cultivar } from '@/domain/contracts/types';

interface AdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lot: Lot;
  crop?: Crop;
  cultivar?: Cultivar;
  onAdjust: (delta: number, reason: AdjustmentReason, notes?: string) => Promise<void>;
}

const ADJUSTMENT_REASONS: AdjustmentReason[] = [
  'sold',
  'consumed',
  'damage',
  'loss',
  'gift',
  'correction',
  'processing'
];

export function AdjustmentDialog({
  open,
  onOpenChange,
  lot,
  crop,
  cultivar,
  onAdjust
}: AdjustmentDialogProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [reason, setReason] = useState<AdjustmentReason>('sold');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;

    setIsSubmitting(true);
    try {
      const delta = isAdding ? qty : -qty;
      await onAdjust(delta, reason, notes || undefined);
      onOpenChange(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuantity('');
    setIsAdding(false);
    setReason('sold');
    setNotes('');
  };

  const displayName = cultivar 
    ? `${crop?.name} - ${cultivar.name}`
    : crop?.name ?? 'Item';

  const maxRemove = lot.quantityRemaining;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('inventory.adjustTitle')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Item info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              {t('inventory.lots')}: {lot.quantityRemaining} {lot.unit}
            </p>
          </div>

          {/* Add/Remove toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!isAdding ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setIsAdding(false)}
            >
              <Minus className="h-4 w-4 mr-2" />
              Remover
            </Button>
            <Button
              type="button"
              variant={isAdding ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label>{t('harvest.quantity')} ({lot.unit})</Label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max={!isAdding ? maxRemove : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="text-lg"
            />
            {!isAdding && (
              <p className="text-xs text-muted-foreground">
                Máximo: {maxRemove} {lot.unit}
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>{t('inventory.adjustReason')}</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as AdjustmentReason)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {t(`inventory.reasons.${r}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>{t('harvest.notes')}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('harvest.notesPlaceholder')}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !quantity || parseFloat(quantity) <= 0}
          >
            {t('actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
