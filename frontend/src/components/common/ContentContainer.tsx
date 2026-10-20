import React from 'react';
import { cn } from '@/utils/cn';

export interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'standard' | 'wide' | 'full';
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className,
  maxWidth = 'standard',
  ...props
}) => {
  const maxWidthStyles = {
    standard: 'max-w-7xl',
    wide: 'max-w-[1600px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8 py-6',
        maxWidthStyles[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
