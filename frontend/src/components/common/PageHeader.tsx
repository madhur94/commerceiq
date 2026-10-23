import React from 'react';
import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  category?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  category,
  className,
}) => {
  return (
    <header className={cn('mb-8 pb-6 border-b border-hairline', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {category && (
            <div className="text-xs font-semibold tracking-wider uppercase text-brass mb-1.5 flex items-center gap-2">
              <span>{category}</span>
              <span className="text-text-subtle">•</span>
              <span className="text-text-subtle font-normal">October 2019 Dataset</span>
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight font-sans">
              {title}
            </h1>
            {badge && <div className="mt-0.5">{badge}</div>}
          </div>
          {description && (
            <p className="mt-2 text-sm sm:text-base text-text-muted max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 self-start sm:self-center">{actions}</div>}
      </div>
    </header>
  );
};
