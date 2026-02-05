/**
 * useExport Hook
 * Manages data export functionality
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportService, type ExportResult } from '@/data/services/exportService';
import { useToast } from '@/hooks/use-toast';

export type ExportType = 'availability' | 'full';

export function useExport() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);

  const exportData = async (type: ExportType = 'full', farmName?: string) => {
    setIsExporting(true);
    
    try {
      const result = type === 'availability'
        ? await exportService.exportAvailabilityPack(farmName)
        : await exportService.exportFullHistory(farmName);

      // Trigger download
      exportService.downloadBlob(result.blob, result.filename);
      
      setLastExport(result);

      toast({
        title: t('export.success'),
        description: t('export.successDescription', {
          filename: result.filename,
          crops: result.stats.crops,
          harvests: result.stats.harvests
        })
      });

      return result;
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: t('export.error'),
        description: t('export.errorDescription'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting,
    lastExport
  };
}
