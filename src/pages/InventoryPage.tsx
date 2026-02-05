/**
 * Inventory Page - Lot management with expiration tracking
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryGroupCard, AdjustmentDialog } from '@/components/inventory';
import { useInventory } from '@/hooks/useInventory';
import { useCrops, useCultivars } from '@/hooks';
import type { InventorySnapshot, Lot, Crop, Cultivar, AdjustmentReason } from '@/domain/contracts/types';
import { lotRepository } from '@/data/repositories';
import { db } from '@/data/db/schema';

export default function InventoryPage() {
  const { t } = useTranslation();
  const { generateSnapshot, adjustLot, expiringLots } = useInventory();
  const { crops } = useCrops();
  const { cultivars } = useCultivars();
  
  const [snapshot, setSnapshot] = useState<InventorySnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState<{
    lot: Lot;
    crop?: Crop;
    cultivar?: Cultivar;
  } | null>(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  // Load snapshot on mount
  useEffect(() => {
    loadSnapshot();
  }, []);

  const loadSnapshot = async () => {
    setIsLoading(true);
    try {
      const snap = await generateSnapshot();
      setSnapshot(snap);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLot = async (lotId: string) => {
    const lot = await lotRepository.getById(lotId);
    if (!lot) return;

    const crop = crops.find(c => c.id === lot.cropId);
    const cultivar = lot.cultivarId 
      ? cultivars.find(c => c.id === lot.cultivarId)
      : undefined;

    setSelectedLot({ lot, crop, cultivar });
    setAdjustDialogOpen(true);
  };

  const handleAdjust = async (delta: number, reason: AdjustmentReason, notes?: string) => {
    if (!selectedLot) return;
    await adjustLot(selectedLot.lot.id, delta, reason, notes);
    await loadSnapshot();
  };

  const expiringCount = expiringLots.length;

  return (
    <AppShell>
      <PageHeader
        title={t('inventory.title')}
        rightContent={
          expiringCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {expiringCount}
            </Badge>
          )
        }
      />

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Stats header */}
        {snapshot && snapshot.items.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('inventory.totalItems', { count: snapshot.items.length })}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadSnapshot}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {t('actions.regenerate')}
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!snapshot || snapshot.items.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">{t('inventory.empty')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('inventory.startHarvesting')}
            </p>
          </div>
        )}

        {/* Inventory list */}
        {!isLoading && snapshot && snapshot.items.length > 0 && (
          <div className="space-y-3">
            {snapshot.items.map((item) => (
              <InventoryGroupCard
                key={`${item.cropId}-${item.cultivarId ?? 'default'}`}
                item={item}
                onSelectLot={handleSelectLot}
              />
            ))}
          </div>
        )}
      </div>

      {/* Adjustment Dialog */}
      {selectedLot && (
        <AdjustmentDialog
          open={adjustDialogOpen}
          onOpenChange={setAdjustDialogOpen}
          lot={selectedLot.lot}
          crop={selectedLot.crop}
          cultivar={selectedLot.cultivar}
          onAdjust={handleAdjust}
        />
      )}
    </AppShell>
  );
}
