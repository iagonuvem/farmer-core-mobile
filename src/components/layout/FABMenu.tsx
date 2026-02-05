/**
 * Floating Action Button with action sheet
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wheat, PackageMinus, Leaf, Settings2, MapPin, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function FABMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const actions = [
    {
      icon: Wheat,
      label: t('actions.logHarvest'),
      description: 'Registrar nova colheita',
      onClick: () => navigate('/harvest/new'),
      primary: true,
    },
    {
      icon: PackageMinus,
      label: t('actions.adjustInventory'),
      description: 'Ajustar quantidades do estoque',
      onClick: () => navigate('/inventory/adjust'),
    },
    {
      icon: Leaf,
      label: t('actions.addCrop'),
      description: 'Cadastrar nova cultura',
      onClick: () => navigate('/cultures'),
    },
    {
      icon: Settings2,
      label: t('actions.configureAvailability'),
      description: 'Configurar lista de disponibilidade',
      onClick: () => navigate('/availability/config'),
    },
  ];

  const handleAction = (action: typeof actions[0]) => {
    setOpen(false);
    action.onClick();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg -mt-6',
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'transition-transform active:scale-95'
          )}
        >
          <Plus className={cn('h-7 w-7 transition-transform', open && 'rotate-45')} />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">{t('home.quickActions')}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 pb-6">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl text-left transition-colors',
                action.primary
                  ? 'bg-primary/10 hover:bg-primary/20'
                  : 'bg-muted/50 hover:bg-muted'
              )}
            >
              <div className={cn(
                'flex items-center justify-center h-12 w-12 rounded-full',
                action.primary ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <p className={cn(
                  'font-medium',
                  action.primary && 'text-primary'
                )}>
                  {action.label}
                </p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
