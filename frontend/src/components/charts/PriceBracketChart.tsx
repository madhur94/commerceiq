import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { priceDistribution, verifiedMetrics } from '@/data';
import { formatMonetaryUnits, formatInteger, formatPercent } from '@/utils/formatters';

interface PriceBracketChartProps {
  height?: number | string;
  className?: string;
  selectedBracket?: string | null;
  onSelectBracket?: (bracket: string) => void;
}

export const PriceBracketChart: React.FC<PriceBracketChartProps> = ({
  height = 300,
  className = '',
  selectedBracket,
  onSelectBracket,
}) => {
  const options = useMemo<echarts.EChartsOption>(() => {
    const categories = priceDistribution.map((p) => p.price_range_display);
    const revenues = priceDistribution.map((p) => p.total_revenue);
    const orders = priceDistribution.map((p) => p.purchase_events);
    const totalRev = verifiedMetrics.purchase_revenue;
    const totalOrders = verifiedMetrics.purchase_events;

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const items = params as Array<{ name: string; seriesName: string; value: number; color: string; dataIndex: number }>;
          if (!items || items.length === 0) return '';
          const p = priceDistribution[items[0].dataIndex];
          const revShare = (p.total_revenue / totalRev) * 100;
          const orderShare = (p.purchase_events / totalOrders) * 100;

          return `<div class="p-1">
            <div class="font-semibold text-slate-100 text-xs mb-1.5 pb-1 border-b border-white/10">
              Bracket: ${p.price_range_display}
            </div>
            <div class="text-xs text-slate-300 font-mono space-y-1">
              <div class="flex justify-between gap-4">
                <span class="text-violet-300">Revenue:</span>
                <span class="text-white font-bold">${formatMonetaryUnits(p.total_revenue, 'full')} (${formatPercent(revShare)})</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-cyan-300">Orders:</span>
                <span class="text-white font-bold">${formatInteger(p.purchase_events)} (${formatPercent(orderShare)})</span>
              </div>
              <div class="text-[10px] text-slate-400 pt-1 border-t border-white/5">
                Mean Ticket: ${(p.total_revenue / p.purchase_events).toFixed(2)} units
              </div>
            </div>
          </div>`;
        },
      },
      legend: {
        show: true,
        top: 0,
        right: 10,
        textStyle: { color: '#94A3B8', fontSize: 11 },
      },
      grid: {
        top: 35,
        right: 45,
        bottom: 30,
        left: 50,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          interval: 0,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Revenue',
          nameTextStyle: { color: '#8B5CF6', fontSize: 10 },
          axisLabel: {
            color: '#8B5CF6',
            fontSize: 10,
            formatter: (v: number) => `${(v / 1e6).toFixed(0)}M`,
          },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        },
        {
          type: 'value',
          name: 'Orders',
          nameTextStyle: { color: '#06B6D4', fontSize: 10 },
          position: 'right',
          axisLabel: {
            color: '#06B6D4',
            fontSize: 10,
            formatter: (v: number) => `${(v / 1e3).toFixed(0)}k`,
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Recorded Revenue',
          type: 'bar',
          yAxisIndex: 0,
          data: revenues,
          barWidth: 14,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: (params: { dataIndex: number }) => {
              const b = priceDistribution[params.dataIndex];
              const isSelected = selectedBracket && b?.price_range_display.toLowerCase() === selectedBracket.toLowerCase();
              if (isSelected) {
                return '#F59E0B'; // Highlight selected bracket in bright amber
              }
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#8B5CF6' },
                  { offset: 1, color: '#6366F1' },
                ],
              };
            },
          },
        },
        {
          name: 'Purchase Orders',
          type: 'bar',
          yAxisIndex: 1,
          data: orders,
          barWidth: 14,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: (params: { dataIndex: number }) => {
              const b = priceDistribution[params.dataIndex];
              const isSelected = selectedBracket && b?.price_range_display.toLowerCase() === selectedBracket.toLowerCase();
              if (isSelected) {
                return '#FBBF24'; // Highlight selected bracket in warm amber
              }
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#06B6D4' },
                  { offset: 1, color: '#0891B2' },
                ],
              };
            },
          },
        },
      ],
    };
  }, [selectedBracket]);

  const onEvents = useMemo(() => {
    if (!onSelectBracket) return undefined;
    return {
      click: (params: unknown) => {
        const item = params as { name: string; dataIndex: number };
        const b = priceDistribution[item.dataIndex]?.price_range_display || item.name;
        if (b) onSelectBracket(b);
      },
    };
  }, [onSelectBracket]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Double-bar chart comparing revenue contribution versus purchase volume across 6 product price brackets"
      />
    </div>
  );
};
