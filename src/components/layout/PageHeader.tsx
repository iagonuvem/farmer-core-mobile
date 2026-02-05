/**
 * Reusable page header with back button support
 */

import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  showSettings = false,
  onSettingsClick,
  rightContent,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn('bg-card border-b border-border sticky top-0 z-30', className)}>
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left */}
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {rightContent}
          {showSettings && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsClick || (() => navigate('/settings'))}
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
