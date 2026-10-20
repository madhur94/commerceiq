import React from 'react';
import { Menu, Calendar, ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TopNavProps {
  pageTitle: string;
  onOpenMobile: () => void;
  collapsed: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  pageTitle,
  onOpenMobile,
  collapsed,
}) => {
  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 glass-header flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out',
        // Offset for desktop sidebar
        collapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title display */}
        <div className="flex items-baseline gap-2 truncate">
          <span className="font-semibold text-base sm:text-lg text-text-primary tracking-tight truncate font-sans">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Dataset & Provenance Badges (Authentic & Verified only, no fake controls) */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* Period badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-surface border border-hairline text-text-muted">
          <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Oct 1 – Nov 1, 2019 (UTC)</span>
        </div>

        {/* Audit verification tag */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Phase 7 Verified</span>
          <span className="md:hidden">Verified</span>
        </div>
      </div>
    </header>
  );
};
