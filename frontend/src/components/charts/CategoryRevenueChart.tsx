import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { categoryRevenue } from '@/data';
import { formatMonetaryUnits, formatPercent } from '@/utils/formatters';

interface CategoryRevenueChartProps {
  height?: number | string;
  limit?: number;
  className?: string;
  selectedCategory?: string | null;
  onSelectCategory?: (category: string) => void;
}

export const CategoryRevenueChart: React.FC<CategoryRevenueChartProps> = ({
  height = 280,
  limit = 7,
  className = '',
  selectedCategory,
  onSelectCategory,
}) => {
  const topCategories = useMemo(() => {
    return [...categoryRevenue]
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, limit)
      .reverse(); // For horizontal bar chart bottom-to-top ordering
  }, [limit]);

  const options = useMemo<echarts.EChartsOption>(() => {
    const categories = topCategories.map((c) => c.main_category);
    const revenues = topCategories.map((c) => c.total_revenue);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const items = params as Array<{ name: string; value: number }>;
          if (!items || items.length === 0) return '';
          const cat = categoryRevenue.find((c) => c.main_category === items[0].name);
          return `<div class="p-1">
            <div class="font-semibold text-slate-100 text-xs mb-1">${items[0].name}</div>
            <div class="text-xs text-slate-300 font-mono mb-0.5">
              Revenue: <span class="text-white font-bold">${formatMonetaryUnits(items[0].value, 'full')}</span>
            </div>
            ${
              cat
                ? `<div class="text-xs text-violet-400 font-mono">
                    Share: <span class="font-bold">${formatPercent(cat.revenue_share_percentage)}</span> · ${cat.purchase_events.toLocaleString()} orders
                   </div>`
                : ''
            }
          </div>`;
        },
      },
      grid: {
        top: 10,
        right: 40,
        bottom: 20,
        left: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          formatter: (v: number) => `${(v / 1e6).toFixed(0)}M`,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#F1F5F9',
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
        },
      },
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: revenues,
          barWidth: 16,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: { dataIndex: number }) => {
              const catName = topCategories[params.dataIndex]?.main_category;
              const isSelected = selectedCategory && catName?.toLowerCase() === selectedCategory.toLowerCase();
              if (isSelected) {
                return '#F59E0B'; // Highlight selected category in bright amber
              }
              // Highlight top category (electronics) in brand violet gradient
              const isTop = params.dataIndex === topCategories.length - 1;
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: isTop
                  ? [
                      { offset: 0, color: '#6366F1' },
                      { offset: 1, color: '#8B5CF6' },
                    ]
                  : [
                      { offset: 0, color: '#0E7490' },
                      { offset: 1, color: '#06B6D4' },
                    ],
              };
            },
          },
          label: {
            show: true,
            position: 'right',
            formatter: (params: { value: unknown }) => `${((params.value as number) / 1e6).toFixed(1)}M`,
            color: '#94A3B8',
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
          },
        },
      ],
    };
  }, [topCategories, selectedCategory]);

  const onEvents = useMemo(() => {
    if (!onSelectCategory) return undefined;
    return {
      click: (params: unknown) => {
        const item = params as { name: string };
        if (item.name) onSelectCategory(item.name);
      },
    };
  }, [onSelectCategory]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Horizontal bar chart of revenue across top product categories, with electronics leading at 176.45M units"
      />
    </div>
  );
};
