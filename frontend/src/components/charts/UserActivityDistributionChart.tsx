import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { userActivityDistribution } from '@/data';
import { formatInteger, formatPercent } from '@/utils/formatters';

export interface UserActivityDistributionChartProps {
  selectedTier?: string | null;
  onSelectTier?: (tier: string) => void;
  height?: number | string;
  className?: string;
}

export const UserActivityDistributionChart: React.FC<UserActivityDistributionChartProps> = ({
  selectedTier = null,
  onSelectTier,
  height = 280,
  className = '',
}) => {
  const options = useMemo<echarts.EChartsOption>(() => {
    // Reverse array for top-to-bottom bar order
    const tiers = [...userActivityDistribution].reverse();
    const categories = tiers.map((t) => t.activity_group_display);
    const counts = tiers.map((t) => t.user_count);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        formatter: (params: unknown) => {
          const items = params as Array<{ dataIndex: number }>;
          if (!items || items.length === 0) return '';
          const idx = items[0].dataIndex;
          const tier = tiers[idx];

          return `<div class="p-1 space-y-1">
            <div class="font-bold text-xs text-brand-cyan pb-1 border-b border-white/10">
              ${tier.activity_group_display}
            </div>
            <div class="text-[11px] font-mono space-y-1">
              <div class="flex justify-between gap-4">
                <span class="text-text-subtle font-sans">User Count:</span>
                <span class="text-text-primary font-bold">${formatInteger(tier.user_count)}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-text-subtle font-sans">Population Share:</span>
                <span class="text-accent-emerald font-bold">${formatPercent(tier.percentage_of_users)}</span>
              </div>
            </div>
            <div class="text-[10px] text-text-subtle pt-1 border-t border-white/5 font-sans">
              Click bar to filter tier analysis
            </div>
          </div>`;
        },
      },
      grid: {
        top: 15,
        right: 30,
        bottom: 25,
        left: 125,
        containLabel: false,
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          formatter: (val: number) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`),
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#CBD5E1',
          fontSize: 11,
          fontWeight: 500,
        },
      },
      series: [
        {
          name: 'Users',
          type: 'bar',
          data: counts.map((count, idx) => {
            const tierName = tiers[idx].activity_group_raw;
            const isSelected = selectedTier === tierName;
            const isAnySelected = Boolean(selectedTier);

            return {
              value: count,
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: isSelected
                  ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        { offset: 0, color: '#06B6D4' },
                        { offset: 1, color: '#22D3EE' },
                      ],
                    }
                  : {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        { offset: 0, color: '#6366F1' },
                        { offset: 1, color: '#8B5CF6' },
                      ],
                    },
                opacity: isAnySelected && !isSelected ? 0.35 : 1,
              },
            };
          }),
          barWidth: 18,
          label: {
            show: true,
            position: 'right',
            formatter: (params: { dataIndex: number }) => {
              const tier = tiers[params.dataIndex];
              return `${formatPercent(tier.percentage_of_users)}`;
            },
            color: '#94A3B8',
            fontSize: 10,
            fontFamily: 'JetBrains Mono, monospace',
          },
        },
      ],
    };
  }, [selectedTier]);

  const onEvents = useMemo(() => {
    if (!onSelectTier) return undefined;
    return {
      click: (params: unknown) => {
        const p = params as { componentType?: string; dataIndex?: number };
        if (p.componentType === 'series' && typeof p.dataIndex === 'number') {
          const tiers = [...userActivityDistribution].reverse();
          const clickedTier = tiers[p.dataIndex];
          if (clickedTier) {
            onSelectTier(clickedTier.activity_group_raw);
          }
        }
      },
    };
  }, [onSelectTier]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="User activity frequency distribution bar chart displaying 5 frequency tiers"
      />
    </div>
  );
};
