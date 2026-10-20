import React from 'react';
import { cn } from '@/utils/cn';

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'subtle';
  hoverable?: boolean;
  glow?: 'none' | 'violet' | 'cyan';
}

export const SurfaceCard: React.FC<SurfaceCardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = true,
  glow = 'none',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-hairline',
    elevated: 'bg-surface-elevated border border-hairline',
    glass: 'glass-card',
    subtle: 'bg-surface-subtle border border-hairline',
  };

  const glowStyles = {
    none: '',
    violet: 'hover:shadow-glow hover:border-brand-violet/40',
    cyan: 'hover:shadow-glow-cyan hover:border-brand-cyan/40',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-5 transition-all duration-300 relative overflow-hidden',
        variantStyles[variant],
        hoverable && 'hover:border-border-prominent hover:-translate-y-0.5 shadow-card',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
