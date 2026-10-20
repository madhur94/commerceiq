import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Info, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

export interface NoticeBannerProps {
  title?: string;
  message: string;
  expandableDetails?: string | React.ReactNode;
  type?: 'info' | 'warning' | 'success';
  className?: string;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  title,
  message,
  expandableDetails,
  type = 'info',
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const configs: Record<
    'info' | 'warning' | 'success',
    { icon: LucideIcon; border: string; bg: string; iconColor: string; titleColor: string }
  > = {
    info: {
      icon: Info,
      border: 'border-brand-violet/25',
      bg: 'bg-brand-violet/5',
      iconColor: 'text-brand-violet-light',
      titleColor: 'text-brand-violet-light',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-accent-amber/25',
      bg: 'bg-accent-amber/5',
      iconColor: 'text-accent-amber',
      titleColor: 'text-accent-amber',
    },
    success: {
      icon: CheckCircle,
      border: 'border-accent-emerald/25',
      bg: 'bg-accent-emerald/5',
      iconColor: 'text-accent-emerald',
      titleColor: 'text-accent-emerald',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      role="note"
      className={cn(
        'rounded-xl p-4 border flex items-start gap-3.5 leading-relaxed text-sm transition-all',
        config.border,
        config.bg,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {title && <div className={cn('font-semibold text-xs tracking-wide uppercase', config.titleColor)}>{title}</div>}
          {expandableDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-medium text-text-subtle hover:text-text-primary flex items-center gap-1 transition-colors py-0.5"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? 'Hide Methodology Details' : 'View Methodology Details'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <div className="text-text-muted text-xs sm:text-sm mt-1">{message}</div>
        {expandableDetails && isExpanded && (
          <div className="mt-3 pt-3 border-t border-hairline/60 text-xs text-text-subtle leading-relaxed animate-in fade-in duration-200">
            {expandableDetails}
          </div>
        )}
      </div>
    </div>
  );
};
