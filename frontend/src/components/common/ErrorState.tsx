import React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { SurfaceCard } from './SurfaceCard';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Ingestion Error',
  message,
  onRetry,
  className,
}) => {
  return (
    <SurfaceCard
      variant="default"
      className={cn('flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto border-accent-rose/30', className)}
    >
      <div className="w-12 h-12 rounded-full bg-accent-rose/10 border border-accent-rose/20 flex items-center justify-center mb-4 text-accent-rose">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2 font-sans">
        {title}
      </h3>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated hover:bg-forest-elevated text-sm font-medium text-text-primary border border-hairline hover:border-brass/40 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-brass" />
          <span>Retry Operation</span>
        </button>
      )}
    </SurfaceCard>
  );
};
