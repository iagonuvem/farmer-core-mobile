/**
 * Cultures Page - CRUD for categories, crops, and cultivars
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Leaf, ChevronRight, Star, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCategories, useCrops } from '@/hooks';
import { CropFormDialog } from '@/components/cultures/CropFormDialog';
import { CropDetailSheet } from '@/components/cultures/CropDetailSheet';
import { CategoryBadge } from '@/components/cultures/CategoryBadge';
import type { Crop, CropCategory } from '@/domain/contracts/types';
import { cn } from '@/lib/utils';

export default function CulturesPage() {
  const { t } = useTranslation();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { crops, isLoading: cropsLoading, toggleFavorite, deleteCrop } = useCrops();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cropFormOpen, setCropFormOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  // Group crops by category
  const cropsByCategory = crops.reduce((acc, crop) => {
    if (!acc[crop.categoryId]) {
      acc[crop.categoryId] = [];
    }
    acc[crop.categoryId].push(crop);
    return acc;
  }, {} as Record<string, Crop[]>);

  // Filter crops if category selected
  const displayedCrops = selectedCategory
    ? crops.filter(c => c.categoryId === selectedCategory)
    : crops;

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setCropFormOpen(true);
  };

  const handleDeleteCrop = async (crop: Crop) => {
    if (confirm(t('confirmation.delete'))) {
      await deleteCrop(crop.id);
    }
  };

  const handleNewCrop = () => {
    setEditingCrop(null);
    setCropFormOpen(true);
  };

  const isLoading = categoriesLoading || cropsLoading;

  return (
    <AppShell>
      <PageHeader 
        title={t('crops.title')} 
        showBack 
        rightContent={
          <Button size="sm" onClick={handleNewCrop}>
            <Plus className="h-4 w-4 mr-1" />
            {t('crops.addCrop')}
          </Button>
        }
      />

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer shrink-0 py-1.5 px-3"
            onClick={() => setSelectedCategory(null)}
          >
            Todos ({crops.length})
          </Badge>
          {categories.map((category) => (
            <CategoryBadge
              key={category.id}
              category={category}
              count={cropsByCategory[category.id]?.length || 0}
              isSelected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            />
          ))}
        </div>

        {/* Crops List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 h-16 bg-muted/50" />
              </Card>
            ))}
          </div>
        ) : displayedCrops.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhuma cultura cadastrada</p>
              <Button className="mt-4" onClick={handleNewCrop}>
                <Plus className="h-4 w-4 mr-1" />
                {t('crops.addCrop')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {displayedCrops.map((crop) => {
              const category = categories.find(c => c.id === crop.categoryId);
              return (
                <Card 
                  key={crop.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedCrop(crop)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: category?.color ? `${category.color}20` : undefined }}
                        >
                          {category?.icon || '🌱'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{crop.name}</span>
                            {crop.isFavorite && (
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t(`units.${crop.defaultUnit}`)} • {crop.shelfLifeDaysDefault} dias
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover z-50">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(crop.id);
                            }}>
                              <Star className="h-4 w-4 mr-2" />
                              {crop.isFavorite ? 'Remover favorito' : 'Favoritar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditCrop(crop);
                            }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              {t('actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCrop(crop);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('actions.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Crop Form Dialog */}
      <CropFormDialog
        open={cropFormOpen}
        onOpenChange={setCropFormOpen}
        crop={editingCrop}
        categories={categories}
      />

      {/* Crop Detail Sheet */}
      <CropDetailSheet
        crop={selectedCrop}
        category={categories.find(c => c.id === selectedCrop?.categoryId)}
        onClose={() => setSelectedCrop(null)}
        onEdit={handleEditCrop}
      />
    </AppShell>
  );
}
