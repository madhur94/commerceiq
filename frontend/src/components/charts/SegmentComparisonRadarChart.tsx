import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { kmeansClusters } from '@/data';
import { formatMonetaryValue } from '@/utils/formatters';

export interface SegmentComparisonRadarChartProps {
  focusedCluster?: 0 | 1 | null;
  height?: number | string;
  className?: string;
}

export const SegmentComparisonRadarChart: React.FC<SegmentComparisonRadarChartProps> = ({
  focusedCluster = null,
  height = 340,
  className = '',
}) => {
  const c0 = kmeansClusters.clusters[0];
  const c1 = kmeansClusters.clusters[1];

  // Normalized dimensions [0 to 100] with documented scaling
  // 1. Log-Revenue: log10(x + 1) normalized to Cluster 0 max
  const logRev0 = Math.log10(c0.average_revenue + 1);
  const logRev1 = Math.log10(c1.average_revenue + 1);
  const normRev0 = 100;
  const normRev1 = Number(((logRev1 / logRev0) * 100).toFixed(1)); // 57.6%

  // 2. Purchases: normalized to Cluster 0 max (1.58)
  const normPurch0 = 100;
  const normPurch1 = Number(((c1.average_purchases / c0.average_purchases) * 100).toFixed(1)); // 7.9%

  // 3. Sessions: normalized to Cluster 0 max (12.26)
  const normSess0 = 100;
  const normSess1 = Number(((c1.average_sessions / c0.average_sessions) * 100).toFixed(1)); // 18.1%

  // 4. Catalog Breadth: normalized to Cluster 0 max (42.04)
  const normProd0 = 100;
  const normProd1 = Number(((c1.unique_products / c0.unique_products) * 100).toFixed(1)); // 10.9%

  // 5. Cart Activity: normalized to Cluster 0 max (1.849)
  const normCart0 = 100;
  const normCart1 = Number(((c1.average_carts / c0.average_carts) * 100).toFixed(1)); // 8.5%

  const options = useMemo<echarts.EChartsOption>(() => {
    const isC0Active = focusedCluster === null || focusedCluster === 0;
    const isC1Active = focusedCluster === null || focusedCluster === 1;

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        formatter: (params: unknown) => {
          const item = params as { name: string; value: number[]; color: string };
          const isCluster0 = item.name.includes('Cluster 0');
          const target = isCluster0 ? c0 : c1;

          return `<div class="p-1.5 space-y-2 min-w-[220px]">
            <div class="font-bold text-xs pb-1 border-b border-white/10 flex items-center justify-between" style="color: ${item.color}">
              <span>${item.name}</span>
              <span class="text-[10px] font-mono text-text-subtle">${target.share_percent}% share</span>
            </div>
            <div class="space-y-1 text-[11px] font-mono">
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Avg Revenue:</span>
                <span class="text-text-primary font-bold">${formatMonetaryValue(target.average_revenue, true)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Avg Purchases:</span>
                <span class="text-text-primary font-bold">${target.average_purchases.toFixed(2)} orders</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Avg Sessions:</span>
                <span class="text-text-primary font-bold">${target.average_sessions.toFixed(2)} visits</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Catalog Breadth:</span>
                <span class="text-text-primary font-bold">${target.unique_products.toFixed(1)} items</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Avg Cart Adds:</span>
                <span class="text-text-primary font-bold">${target.average_carts.toFixed(2)} carts</span>
              </div>
            </div>
            <div class="text-[10px] text-text-muted border-t border-white/5 pt-1 font-sans">
              Axes represent normalized behavioral intensity [0 to 100].
            </div>
          </div>`;
        },
      },
      legend: {
        show: true,
        bottom: 0,
        textStyle: { color: '#94A3B8', fontSize: 11 },
        itemGap: 24,
      },
      radar: {
        indicator: [
          { name: 'Revenue Index\n(Log10 Scale)', max: 100 },
          { name: 'Purchase Rate\n(Avg Orders)', max: 100 },
          { name: 'Session Density\n(Visits / User)', max: 100 },
          { name: 'Catalog Breadth\n(Unique Products)', max: 100 },
          { name: 'Cart Activity\n(Cart Adds)', max: 100 },
        ],
        center: ['50%', '46%'],
        radius: '62%',
        splitNumber: 4,
        shape: 'polygon',
        axisName: {
          color: '#CBD5E1',
          fontSize: 10.5,
          fontFamily: 'Inter, sans-serif',
          lineHeight: 13,
        },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(255, 255, 255, 0.04)',
              'rgba(255, 255, 255, 0.08)',
              'rgba(255, 255, 255, 0.12)',
              'rgba(255, 255, 255, 0.18)',
            ],
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(15, 23, 42, 0.5)', 'rgba(30, 41, 59, 0.3)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
      series: [
        {
          name: 'Cluster Behavioral Profiles',
          type: 'radar',
          data: [
            {
              value: [normRev0, normPurch0, normSess0, normProd0, normCart0],
              name: 'Cluster 0 · Commercial Core (8.29%)',
              symbol: 'circle',
              symbolSize: 5,
              lineStyle: {
                color: '#8B5CF6',
                width: isC0Active ? 2.5 : 1,
                opacity: isC0Active ? 1 : 0.25,
              },
              itemStyle: {
                color: '#8B5CF6',
                opacity: isC0Active ? 1 : 0.25,
              },
              areaStyle: {
                color: 'rgba(139, 92, 246, 0.32)',
                opacity: isC0Active ? 1 : 0.1,
              },
            },
            {
              value: [normRev1, normPurch1, normSess1, normProd1, normCart1],
              name: 'Cluster 1 · Casual Browsers (91.71%)',
              symbol: 'circle',
              symbolSize: 5,
              lineStyle: {
                color: '#06B6D4',
                width: isC1Active ? 2.5 : 1,
                opacity: isC1Active ? 1 : 0.25,
              },
              itemStyle: {
                color: '#06B6D4',
                opacity: isC1Active ? 1 : 0.25,
              },
              areaStyle: {
                color: 'rgba(6, 182, 212, 0.32)',
                opacity: isC1Active ? 1 : 0.1,
              },
            },
          ],
        },
      ],
    };
  }, [c0, c1, focusedCluster, normRev0, normRev1, normPurch0, normPurch1, normSess0, normSess1, normProd0, normProd1, normCart0]);

  const { containerRef } = useECharts({ options });

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Normalized radar chart comparing Cluster 0 Commercial Core against Cluster 1 Casual Browsers across revenue, purchases, sessions, catalog breadth, and cart activity"
      />
    </div>
  );
};
