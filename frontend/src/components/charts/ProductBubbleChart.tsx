import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { productBubbleData } from '@/data';
import { formatMonetaryValue, formatInteger } from '@/utils/formatters';

export interface ProductBubbleChartProps {
  height?: number | string;
  className?: string;
}

export const ProductBubbleChart: React.FC<ProductBubbleChartProps> = ({
  height = 420,
  className = '',
}) => {
  const chartPoints = useMemo(() => {
    return productBubbleData.map((p) => [
      p.purchases, // x
      p.revenue, // y
      p.unique_buyers, // size
      p.average_price, // color
      p.product_rank,
      p.product_label,
    ]);
  }, []);

  const options = useMemo<echarts.EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { value: [number, number, number, number, number, string] };
          const [purchases, revenue, buyers, avgPrice, rank, label] = p.value;
          return `<div class="p-1 space-y-1.5 min-w-[200px]">
            <div class="flex items-center justify-between border-b border-white/10 pb-1">
              <span class="text-xs font-bold text-brand-cyan">${label}</span>
              <span class="text-[10px] font-mono text-text-muted">Rank #${rank}</span>
            </div>
            <div class="space-y-0.5 text-[11px] font-mono">
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Purchases:</span>
                <span class="text-text-primary font-bold">${formatInteger(purchases)} orders</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Gross Revenue:</span>
                <span class="text-emerald-400 font-bold">${formatMonetaryValue(revenue, true)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Unique Buyers:</span>
                <span class="text-text-primary font-bold">${formatInteger(buyers)} buyers</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Average Price:</span>
                <span class="text-brand-violet-light font-bold">${formatMonetaryValue(avgPrice, true)}</span>
              </div>
            </div>
          </div>`;
        },
      },
      grid: {
        top: 30,
        right: 40,
        bottom: 60,
        left: 80,
      },
      visualMap: [
        {
          show: true,
          dimension: 3, // average_price
          min: 10,
          max: 1500,
          calculable: true,
          precision: 0.1,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          text: ['High Price', 'Low Price'],
          textStyle: { color: '#94A3B8', fontSize: 10 },
          inRange: {
            color: ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'],
          },
        },
      ],
      xAxis: {
        type: 'value',
        name: 'Purchase Count (Orders)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: '#94A3B8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`),
        },
      },
      yAxis: {
        type: 'value',
        name: 'Gross Purchase Revenue (Monetary Units)',
        nameTextStyle: { color: '#94A3B8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          formatter: (v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v}`),
        },
      },
      series: [
        {
          name: 'Top 100 Products',
          type: 'scatter',
          data: chartPoints,
          symbolSize: (data: number[]) => {
            const buyers = data[2];
            // Scale buyer count (typically 500 to 20,000) to bubble radius 8 to 38
            return Math.max(8, Math.min(38, Math.sqrt(buyers) * 0.28));
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0.85,
          },
        },
      ],
    };
  }, [chartPoints]);

  const { containerRef } = useECharts({ options });

  return (
    <div className={`relative w-full ${className}`}>
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
};
