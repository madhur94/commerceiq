import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { categoryBrandTreemap } from '@/data';
import { formatMonetaryValue } from '@/utils/formatters';

export interface CategoryBrandSunburstChartProps {
  height?: number | string;
  className?: string;
}

export const CategoryBrandSunburstChart: React.FC<CategoryBrandSunburstChartProps> = ({
  height = 440,
  className = '',
}) => {
  const treeData = useMemo(() => {
    const topLevel = categoryBrandTreemap.filter((n) => !n.parent || n.parent === '');
    const palette = [
      '#8B5CF6',
      '#06B6D4',
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EC4899',
      '#6366F1',
      '#14B8A6',
      '#F97316',
    ];

    return topLevel.map((cat, idx) => {
      const catColor = palette[idx % palette.length];
      const children = categoryBrandTreemap
        .filter((n) => n.parent === cat.id)
        .map((child) => ({
          name: child.label || child.id,
          value: child.value,
        }));

      return {
        name: cat.label || cat.id,
        value: cat.value,
        itemStyle: {
          color: catColor,
        },
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
            <div class="text-xs font-mono text-text-primary">Recorded Value: <span class="text-emerald-400 font-bold">${formatMonetaryValue(p.value, true)}</span></div>
            <div class="text-[10px] text-text-subtle pt-1 border-t border-white/10">Click node to expand sector</div>
          </div>`;
        },
      },
      series: [
        {
          type: 'sunburst',
          data: treeData,
          radius: ['14%', '90%'],
          sort: undefined,
          emphasis: {
            focus: 'ancestor',
          },
          levels: [
            {},
            {
              r0: '14%',
              r: '44%',
              itemStyle: {
                borderWidth: 2,
                borderColor: '#0A0E17',
              },
              label: {
                rotate: 'tangential',
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: 'bold',
              },
            },
            {
              r0: '44%',
              r: '88%',
              label: {
                align: 'right',
                fontSize: 9,
                color: '#E2E8F0',
                formatter: (params: unknown) => {
                  const p = params as { value: number; name: string };
                  // Show label only for significant brands to prevent label collision
                  return p.value > 1500000 ? p.name : '';
                },
              },
              itemStyle: {
                borderWidth: 1,
                borderColor: '#0A0E17',
              },
            },
          ],
        },
      ],
    };
  }, [treeData]);

  const { containerRef } = useECharts({ options });

  return (
    <div
      ref={containerRef}
      style={{ height, minHeight: 400 }}
      className={`w-full ${className}`}
      role="img"
      aria-label="Category and brand radial sunburst hierarchy chart displaying revenue distribution"
    />
  );
};
