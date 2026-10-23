import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarNavItemProps {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  collapsed: boolean;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  label,
  path,
  icon: Icon,
  badge,
  collapsed,
  onClick,
}) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 outline-none select-none',
          isActive
            ? 'bg-brass/15 text-text-primary border border-brass/30 shadow-sm font-semibold'
            : 'text-text-muted hover:text-text-primary hover:bg-forest-elevated/70 border border-transparent'
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left indicator bar in warm architectural brass */}
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 bg-brass rounded-r-full shadow-glow-brass" />
          )}

          <Icon
            className={cn(
              'w-5 h-5 flex-shrink-0 transition-colors duration-200',
              isActive ? 'text-brass' : 'text-text-muted group-hover:text-brass-hover'
            )}
          />

          <span
            className={cn(
              'truncate tracking-wide',
              collapsed ? 'hidden max-lg:inline' : 'inline'
            )}
          >
            {label}
          </span>

          {badge && (
            <span
              className={cn(
                'ml-auto text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-brass/20 text-brass border border-brass/30',
                collapsed ? 'hidden max-lg:inline' : 'inline'
              )}
            >
              {badge}
            </span>
          )}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-surface-elevated text-text-primary text-xs font-medium rounded-md shadow-xl border border-hairline opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};
