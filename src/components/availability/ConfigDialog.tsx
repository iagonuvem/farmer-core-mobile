/**
 * Config Dialog - Edit availability message settings
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { AvailabilityConfig } from '@/domain/contracts/types';

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: AvailabilityConfig;
  onSave: (config: Partial<AvailabilityConfig>) => Promise<void>;
}

export function ConfigDialog({
  open,
  onOpenChange,
  config,
  onSave
}: ConfigDialogProps) {
  const { t } = useTranslation();
  const [farmName, setFarmName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (config) {
      setFarmName(config.farmName || '');
      setContactInfo(config.contactInfo || '');
      setHeaderText(config.defaultHeaderText || '');
      setFooterText(config.defaultFooterText || '');
    }
  }, [config, open]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave({
        farmName: farmName || undefined,
        contactInfo: contactInfo || undefined,
        defaultHeaderText: headerText || undefined,
        defaultFooterText: footerText || undefined
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('actions.configureAvailability')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t('settings.farmName')}</Label>
            <Input
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder={t('settings.farmNamePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('settings.contact')}</Label>
            <Input
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder={t('settings.contactPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label>Cabeçalho personalizado</Label>
            <Textarea
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="🌿 Produtos Frescos do Sítio..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Rodapé personalizado</Label>
            <Textarea
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="Entregas às terças e sextas..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {t('actions.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
