import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { brandRevenueTop50, verifiedMetrics } from '@/data';
import { formatMonetaryUnits, formatPercent } from '@/utils/formatters';

interface BrandParetoChartProps {
  height?: number | string;
  limit?: number;
  className?: string;
  selectedBrand?: string | null;
  onSelectBrand?: (brand: string) => void;
}

export const BrandParetoChart: React.FC<BrandParetoChartProps> = ({
  height = 320,
  limit = 12,
  className = '',
  selectedBrand,
  onSelectBrand,
}) => {
  const topBrands = useMemo(() => {
    return brandRevenueTop50.slice(0, limit);
  }, [limit]);

  const options = useMemo<echarts.EChartsOption>(() => {
    const brands = topBrands.map((b) => b.brand);
    const revenues = topBrands.map((b) => b.total_revenue);

    // Compute cumulative percentage against total platform revenue
    const totalRev = verifiedMetrics.purchase_revenue;
    let runningSum = 0;
    const cumulativeShares = topBrands.map((b) => {
      runningSum += b.total_revenue;
      return Number(((runningSum / totalRev) * 100).toFixed(2));
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: unknown) => {
          const items = params as Array<{ name: string; seriesName: string; value: number; color: string; dataIndex: number }>;
          if (!items || items.length === 0) return '';
          const idx = items[0].dataIndex;
          const brandData = topBrands[idx];
          const cumShare = cumulativeShares[idx];

          return `<div class="p-1">
            <div class="font-semibold text-slate-100 text-xs mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
              <span class="capitalize">${brandData.brand}</span>
              <span class="text-violet-400 font-mono text-[10px]">Rank #${idx + 1}</span>
            </div>
            <div class="text-xs text-slate-300 font-mono space-y-1">
              <div class="flex justify-between gap-4">
                <span>Revenue:</span>
                <span class="text-white font-bold">${formatMonetaryUnits(brandData.total_revenue, 'full')}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span>Brand Share:</span>
                <span class="text-cyan-300 font-bold">${formatPercent(brandData.revenue_share_percentage)}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span>Cumulative Platform Share:</span>
                <span class="text-emerald-400 font-bold">${formatPercent(cumShare)}</span>
              </div>
              <div class="text-[10px] text-slate-400 pt-1 border-t border-white/5">
                Purchases: ${brandData.purchase_events.toLocaleString()} · Mean Order: ${(brandData.total_revenue / brandData.purchase_events).toFixed(2)} units
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
        bottom: 40,
        left: 50,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: brands,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          interval: 0,
          rotate: 30,
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
          name: 'Cumulative %',
          nameTextStyle: { color: '#10B981', fontSize: 10 },
          position: 'right',
          max: 100,
          min: 0,
          axisLabel: {
            color: '#10B981',
            fontSize: 10,
            formatter: '{value}%',
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Recorded Brand Revenue',
          type: 'bar',
          yAxisIndex: 0,
          data: revenues,
          barWidth: 16,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: (params: { dataIndex: number }) => {
              const b = topBrands[params.dataIndex];
              const isSelected = selectedBrand && b?.brand.toLowerCase() === selectedBrand.toLowerCase();
              if (isSelected) {
                return '#F59E0B'; // Highlight selected brand in bright amber
              }
              if (params.dataIndex === 0) {
                // Apple
                return '#8B5CF6';
              }
              if (params.dataIndex === 1) {
                // Samsung
                return '#06B6D4';
              }
              return '#4F46E5';
            },
          },
        },
        {
          name: 'Cumulative Share (%)',
          type: 'line',
          yAxisIndex: 1,
          data: cumulativeShares,
          smooth: 0.3,
          lineStyle: { width: 2.5, color: '#10B981' },
          itemStyle: { color: '#10B981' },
          symbolSize: 6,
        },
      ],
    };
  }, [topBrands, selectedBrand]);

  const onEvents = useMemo(() => {
    if (!onSelectBrand) return undefined;
    return {
      click: (params: unknown) => {
        const item = params as { name: string; dataIndex: number };
        const b = topBrands[item.dataIndex]?.brand || item.name;
        if (b) onSelectBrand(b);
      },
    };
  }, [onSelectBrand, topBrands]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Pareto combination chart showing top brand revenues and cumulative percentage, with Apple and Samsung driving 68.5% of gross revenue"
      />
    </div>
  );
};
