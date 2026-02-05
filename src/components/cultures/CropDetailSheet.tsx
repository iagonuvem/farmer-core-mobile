/**
 * Crop Detail Sheet - View crop details and cultivars
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Pencil, Plus, Trash2, Clock, Package } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCultivars, useCrops } from '@/hooks';
import { CultivarFormDialog } from './CultivarFormDialog';
import type { Crop, CropCategory, Cultivar } from '@/domain/contracts/types';

interface CropDetailSheetProps {
  crop: Crop | null;
  category: CropCategory | undefined;
  onClose: () => void;
  onEdit: (crop: Crop) => void;
}

export function CropDetailSheet({ crop, category, onClose, onEdit }: CropDetailSheetProps) {
  const { t } = useTranslation();
  const { toggleFavorite } = useCrops();
  const { cultivars, deleteCultivar } = useCultivars(crop?.id);
  
  const [cultivarFormOpen, setCultivarFormOpen] = useState(false);
  const [editingCultivar, setEditingCultivar] = useState<Cultivar | null>(null);

  if (!crop) return null;

  const handleAddCultivar = () => {
    setEditingCultivar(null);
    setCultivarFormOpen(true);
  };

  const handleEditCultivar = (cultivar: Cultivar) => {
    setEditingCultivar(cultivar);
    setCultivarFormOpen(true);
  };

  const handleDeleteCultivar = async (cultivar: Cultivar) => {
    if (confirm(t('confirmation.delete'))) {
      await deleteCultivar(cultivar.id);
    }
  };

  return (
    <>
      <Sheet open={!!crop} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="text-left pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-14 w-14 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category?.color ? `${category.color}20` : undefined }}
                >
                  {category?.icon || '🌱'}
                </div>
                <div>
                  <SheetTitle className="flex items-center gap-2">
                    {crop.name}
                    {crop.isFavorite && (
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    )}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">{category?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toggleFavorite(crop.id)}
                >
                  <Star className={crop.isFavorite ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4'} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onEdit(crop)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 overflow-y-auto pb-6">
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unidade</p>
                    <p className="font-medium">{t(`units.${crop.defaultUnit}`)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Validade</p>
                    <p className="font-medium">{crop.shelfLifeDaysDefault} dias</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {crop.notes && (
              <div>
                <h3 className="text-sm font-medium mb-2">Observações</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {crop.notes}
                </p>
              </div>
            )}

            <Separator />

            {/* Cultivars */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{t('crops.cultivars')}</h3>
                <Button size="sm" variant="outline" onClick={handleAddCultivar}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('crops.addCultivar')}
                </Button>
              </div>

              {cultivars.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <p>{t('crops.noCultivars')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {cultivars.map((cultivar) => (
                    <Card key={cultivar.id}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cultivar.name}</p>
                          {cultivar.shelfLifeDaysOverride && (
                            <p className="text-xs text-muted-foreground">
                              Validade: {cultivar.shelfLifeDaysOverride} dias
                            </p>
                          )}
                          {cultivar.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {cultivar.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditCultivar(cultivar)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteCultivar(cultivar)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cultivar Form Dialog */}
      <CultivarFormDialog
        open={cultivarFormOpen}
        onOpenChange={setCultivarFormOpen}
        cultivar={editingCultivar}
        cropId={crop.id}
        defaultShelfLife={crop.shelfLifeDaysDefault}
      />
    </>
  );
}
