/**
 * Settings Page
 */

import { useTranslation } from 'react-i18next';
import { Download, Wifi, Loader2, Package, Archive } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { APP_VERSION, SCHEMA_VERSION } from '@/domain/contracts';
import { useExport } from '@/hooks/useExport';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { exportData, isExporting } = useExport();

  const handleExportAvailability = () => {
    exportData('availability');
  };

  const handleExportFull = () => {
    exportData('full');
  };

  return (
    <AppShell>
      <PageHeader title={t('settings.title')} showBack />

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Farm Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('settings.farmInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">{t('settings.farmName')}</Label>
              <Input 
                id="farmName" 
                placeholder={t('settings.farmNamePlaceholder')} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">{t('settings.contact')}</Label>
              <Input 
                id="contact" 
                placeholder={t('settings.contactPlaceholder')} 
              />
            </div>
            <Button className="w-full">{t('actions.save')}</Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('settings.dataManagement')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={handleExportAvailability}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Package className="h-4 w-4" />
              )}
              <div className="text-left">
                <p className="font-medium">{t('export.availabilityPack')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('settings.exportDescription')}
                </p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={handleExportFull}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
              <div className="text-left">
                <p className="font-medium">{t('export.fullHistory')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('settings.exportDescription')}
                </p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('settings.about')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">{t('settings.version')}</span>
              <Badge variant="secondary">{APP_VERSION}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Schema</span>
              <Badge variant="outline">{SCHEMA_VERSION}</Badge>
            </div>
            <Separator />
            <div className="flex items-center gap-2 py-2 text-primary">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">{t('settings.offlineReady')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
