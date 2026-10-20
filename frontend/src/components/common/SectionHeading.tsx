import React from 'react';
import { cn } from '@/utils/cn';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-text-muted leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="self-center flex-shrink-0">{action}</div>}
    </div>
  );
};
