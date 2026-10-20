import React from 'react';
import { cn } from '@/utils/cn';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading analytical telemetry...',
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center p-12 text-center', className)}
    >
      <div className="relative w-10 h-10 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-brand-violet/20 border-t-brand-cyan animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-violet/40 border-b-brand-violet-light animate-spin-reverse" />
      </div>
      <p className="text-sm font-medium text-text-muted font-sans tracking-wide">
        {message}
      </p>
    </div>
  );
};
