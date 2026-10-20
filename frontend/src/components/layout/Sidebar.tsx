import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  TableProperties,
  Binary,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Database,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SidebarNavItem } from './SidebarNavItem';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

import type { LucideIcon } from 'lucide-react';

export const NAV_ITEMS: Array<{
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  description: string;
}> = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/',
    icon: LayoutDashboard,
    description: 'Executive command center and macro KPI summaries',
  },
  {
    id: 'sales-intelligence',
    label: 'Sales Intelligence',
    path: '/sales-intelligence',
    icon: TrendingUp,
    description: 'Temporal decoupling, price tiers, and weekday dynamics',
  },
  {
    id: 'customer-intelligence',
    label: 'Customer Intelligence',
    path: '/customer-intelligence',
    icon: Users,
    description: 'K-Means behavioral clusters and user activity tiers',
  },
  {
    id: 'data-explorer',
    label: 'Data Explorer',
    path: '/data-explorer',
    icon: TableProperties,
    description: 'Multi-dimensional brand and category tables',
  },
  {
    id: 'ml-insights',
    label: 'ML Insights',
    path: '/ml-insights',
    icon: Binary,
    description: 'PCA variance breakdown, scree analysis, and model validation',
  },
  {
    id: 'data-pipeline',
    label: 'Data Pipeline',
    path: '/data-pipeline',
    icon: GitBranch,
    description: 'Spark/HDFS architecture, cleaning audits, and gallery',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-surface border-r border-hairline transition-all duration-300 ease-in-out',
          'w-64',
          collapsed && 'lg:w-20',
          // Mobile responsive drawer positioning
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-hairline">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan p-0.5 flex-shrink-0 shadow-glow">
              <div className="w-full h-full bg-canvas rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-bold text-base text-brand-cyan">CIQ</span>
              </div>
            </div>

            <div className={cn('flex flex-col min-w-0', collapsed ? 'hidden max-lg:flex' : 'flex')}>
              <span className="font-bold text-sm text-text-primary tracking-tight font-sans truncate">
                CommerceIQ
              </span>
              <span className="text-[10px] text-text-subtle truncate">
                Intelligence Suite
              </span>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            aria-label="Close mobile navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.id}
              label={item.label}
              path={item.path}
              icon={item.icon}
              badge={item.badge}
              collapsed={collapsed}
              onClick={onCloseMobile}
            />
          ))}
        </nav>

        {/* Provenance & Telemetry Status Box */}
        <div
          className={cn(
            'p-3 mx-3 mb-3 rounded-xl bg-surface-subtle border border-hairline/60 text-xs',
            collapsed ? 'hidden max-lg:block' : 'block'
          )}
        >
          <div className="flex items-center gap-2 text-text-muted mb-1 font-medium">
            <Database className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Telemetry Grounded</span>
          </div>
          <p className="text-[11px] text-text-subtle leading-tight">
            42.3M verified events · October 2019
          </p>
        </div>

        {collapsed && (
          <div
            className="hidden lg:flex p-3 mx-auto mb-3 justify-center text-text-muted"
            title="Telemetry Grounded (42.3M events)"
          >
            <Database className="w-4 h-4 text-accent-emerald" />
          </div>
        )}

        {/* Desktop Collapse Toggle Control */}
        <div className="p-3 border-t border-hairline hidden lg:flex justify-end">
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-surface-elevated/50 hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors text-xs font-medium gap-2 border border-hairline"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
