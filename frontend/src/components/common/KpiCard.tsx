import React from 'react';
import { cn } from '@/utils/cn';
import { SurfaceCard } from './SurfaceCard';
import { LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  unitLabel?: string;
  icon?: LucideIcon;
  contextPill?: string;
  contextVariant?: 'emerald' | 'cyan' | 'violet' | 'amber' | 'neutral' | 'brass';
  footnote?: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unitLabel,
  icon: Icon,
  contextPill,
  contextVariant = 'brass',
  footnote,
  className,
}) => {
  const pillVariants = {
    brass: 'bg-brass/10 text-brass border-brass/25',
    emerald: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
    cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    violet: 'bg-brand-violet/10 text-brand-violet-light border-brand-violet/20',
    amber: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
    neutral: 'bg-surface-subtle text-text-muted border-hairline',
  };

  return (
    <SurfaceCard
      variant="default"
      className={cn('flex flex-col justify-between p-5 group hover:border-brass/35 transition-all', className)}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted font-sans flex items-center gap-1.5">
            {Icon && <Icon className="w-4 h-4 text-brass/80 group-hover:text-brass transition-colors" />}
            {label}
          </span>
          {contextPill && (
            <span
              className={cn(
                'text-[11px] font-medium px-2 py-0.5 rounded-full border tracking-wide select-none',
                pillVariants[contextVariant]
              )}
            >
              {contextPill}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-text-primary tracking-tight">
            {value}
          </span>
          {unitLabel && (
            <span className="text-xs font-mono text-text-subtle lowercase">
              {unitLabel}
            </span>
          )}
        </div>
      </div>

      {footnote && (
        <div className="mt-3 pt-3 border-t border-hairline/60 flex items-center justify-between text-[11px] text-text-subtle">
          <span>{footnote}</span>
        </div>
      )}
    </SurfaceCard>
  );
};
