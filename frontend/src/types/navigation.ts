import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';

export type RouteId =
  | 'overview'
  | 'sales-intelligence'
  | 'customer-intelligence'
  | 'data-explorer'
  | 'ml-insights'
  | 'data-pipeline';

export interface NavItemConfig {
  id: RouteId;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  description: string;
  component: ComponentType;
}
