/**
 * Category Badge Component
 */

import { Badge } from '@/components/ui/badge';
import type { CropCategory } from '@/domain/contracts/types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: CropCategory;
  count?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryBadge({ 
  category, 
  count, 
  isSelected, 
  onClick,
  className 
}: CategoryBadgeProps) {
  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className={cn(
        'cursor-pointer shrink-0 py-1.5 px-3 gap-1.5',
        className
      )}
      onClick={onClick}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
      {count !== undefined && (
        <span className="text-xs opacity-70">({count})</span>
      )}
    </Badge>
  );
}
