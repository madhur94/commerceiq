import React from 'react';
import { cn } from '@/utils/cn';

export interface StatusIndicatorProps {
  status: 'verified' | 'ready' | 'caution' | 'in-progress' | 'info';
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = false,
  className,
}) => {
  const statusStyles = {
    verified: {
      dot: 'bg-accent-emerald',
      pill: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
      defaultLabel: 'Verified',
    },
    ready: {
      dot: 'bg-brand-cyan',
      pill: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
      defaultLabel: 'Ready',
    },
    caution: {
      dot: 'bg-accent-amber',
      pill: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
      defaultLabel: 'Caution / Outlier',
    },
    'in-progress': {
      dot: 'bg-brand-violet',
      pill: 'bg-brand-violet/10 text-brand-violet-light border-brand-violet/20',
      defaultLabel: 'In Progress',
    },
    info: {
      dot: 'bg-slate-400',
      pill: 'bg-slate-800/40 text-slate-300 border-slate-700/40',
      defaultLabel: 'Info',
    },
  };

  const current = statusStyles[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border tracking-wide select-none',
        current.pill,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              current.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)} />
      </span>
      <span>{label || current.defaultLabel}</span>
    </span>
  );
};
