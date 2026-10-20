import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { categoryBrandTreemap } from '@/data';
import { formatMonetaryValue } from '@/utils/formatters';

export interface CategoryBrandTreemapChartProps {
  height?: number | string;
  className?: string;
}

export const CategoryBrandTreemapChart: React.FC<CategoryBrandTreemapChartProps> = ({
  height = 420,
  className = '',
}) => {
  const treeData = useMemo(() => {
    const topLevel = categoryBrandTreemap.filter((n) => !n.parent || n.parent === '');
    return topLevel.map((cat) => {
      const children = categoryBrandTreemap
        .filter((n) => n.parent === cat.id)
        .map((child) => ({
          name: child.label || child.id,
          value: child.value,
          id: child.id,
        }));

      return {
        name: cat.label || cat.id,
        value: cat.value,
        id: cat.id,
        children: children.length > 0 ? children : undefined,
      };
    });
  }, []);

  const options = useMemo<echarts.EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; treePathInfo?: Array<{ name: string }> };
          const path = p.treePathInfo ? p.treePathInfo.map((t) => t.name).filter(Boolean).join(' › ') : p.name;
          return `<div class="p-1 space-y-1">
            <div class="text-[10px] text-text-muted font-sans">${path}</div>
            <div class="text-xs font-bold text-brand-cyan">${p.name}</div>
            <div class="text-xs font-mono text-text-primary">Revenue: <span class="text-emerald-400 font-bold">${formatMonetaryValue(p.value, true)}</span></div>
            <div class="text-[10px] text-text-subtle pt-1 border-t border-white/10">Click node to drill down</div>
          </div>`;
        },
      },
      series: [
        {
          name: 'Category & Brand Revenue',
          type: 'treemap',
          visibleMin: 300,
          label: {
            show: true,
            formatter: '{b}',
            fontSize: 11,
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          upperLabel: {
            show: true,
            height: 24,
            fontSize: 12,
            color: '#94A3B8',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
          },
          itemStyle: {
            borderColor: '#0A0E17',
            borderWidth: 2,
            gapWidth: 2,
          },
          levels: [
            {
              itemStyle: {
                borderColor: '#0A0E17',
                borderWidth: 3,
                gapWidth: 3,
              },
              upperLabel: {
                show: false,
              },
            },
            {
              color: [
                '#8B5CF6',
                '#3B82F6',
                '#06B6D4',
                '#10B981',
                '#F59E0B',
                '#EC4899',
                '#6366F1',
                '#14B8A6',
                '#F97316',
              ],
              colorMappingBy: 'id',
              itemStyle: {
                borderColor: '#111827',
                borderWidth: 2,
                gapWidth: 2,
              },
            },
            {
              colorSaturation: [0.35, 0.7],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 1,
                borderWidth: 1,
              },
            },
          ],
          breadcrumb: {
            show: true,
            left: 10,
            bottom: 5,
            itemStyle: {
              color: '#1E293B',
              borderColor: '#334155',
              textStyle: { color: '#CBD5E1', fontSize: 11 },
            },
          },
          data: treeData,
        },
      ],
    };
  }, [treeData]);

  const { containerRef } = useECharts({ options });

  return (
    <div className={`relative w-full ${className}`}>
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
};
