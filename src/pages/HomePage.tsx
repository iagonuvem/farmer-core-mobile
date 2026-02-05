/**
 * Home Page - Dashboard with availability and quick actions
 */

import { useTranslation } from 'react-i18next';
import { Copy, RefreshCw, Wheat, AlertTriangle, ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrops, useCategories, useHarvests, useInventory } from '@/hooks';
import type { HarvestEvent, Crop } from '@/domain/contracts/types';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { crops } = useCrops();
  const { categories } = useCategories();
  const { recentHarvests, allCrops } = useHarvests();
  const { lots, expiringLots } = useInventory();

  const handleDuplicate = (harvest: HarvestEvent) => {
    // Navigate to harvest wizard with pre-fill params
    const params = new URLSearchParams({
      cropId: harvest.cropId,
      ...(harvest.cultivarId && { cultivarId: harvest.cultivarId }),
      unit: harvest.unit,
    });
    navigate(`/harvest/new?${params.toString()}`);
  };

  const getCropName = (cropId: string) => {
    return allCrops.find(c => c.id === cropId)?.name || 'Unknown';
  };

  return (
    <AppShell>
      <PageHeader 
        title={t('app.name')} 
        subtitle={t('app.tagline')}
        showSettings 
      />

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Current Availability Card */}
        <Card 
          className="border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
          onClick={() => navigate('/availability')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                📋 {t('home.currentAvailability')}
              </CardTitle>
              <Badge variant="outline" className="text-muted-foreground">
                {t('home.noAvailability')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('home.generateFirst')}
            </p>
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/availability');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('actions.generate')}
              </Button>
              <Button variant="outline" disabled>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Harvests */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wheat className="h-5 w-5" />
                {t('home.recentHarvests')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {recentHarvests.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Wheat className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>{t('home.noHarvests')}</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/harvest/new')}
                >
                  {t('actions.logHarvest')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentHarvests.slice(0, 5).map((harvest) => (
                  <div
                    key={harvest.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg',
                      'bg-muted/50 hover:bg-muted transition-colors'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {getCropName(harvest.cropId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {harvest.quantity} {t(`units.${harvest.unit}`)} • {format(new Date(harvest.harvestedAt), 'dd/MM')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(harvest)}
                      className="shrink-0 ml-2"
                      title={t('harvest.duplicate')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {recentHarvests.length > 5 && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2" 
                    size="sm"
                  >
                    {t('home.viewAll')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('home.expiringSoon')}
              {expiringLots.length > 0 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  {expiringLots.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringLots.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>{t('home.noExpiring')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {expiringLots.slice(0, 3).map((lot) => (
                  <div
                    key={lot.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {getCropName(lot.cropId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lot.quantityRemaining} {t(`units.${lot.unit}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/cultures')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{crops.length}</p>
              <p className="text-sm text-muted-foreground">Culturas</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/inventory')}>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{lots.length}</p>
              <p className="text-sm text-muted-foreground">Lotes no estoque</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}