import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { kmeansClusters } from '@/data';
import { formatInteger, formatPercent, formatMonetaryUnits } from '@/utils/formatters';

interface ClusterDonutChartProps {
  height?: number | string;
  className?: string;
}

export const ClusterDonutChart: React.FC<ClusterDonutChartProps> = ({
  height = 240,
  className = '',
}) => {
  const options = useMemo<echarts.EChartsOption>(() => {
    const c0 = kmeansClusters.clusters.find((c) => c.cluster_id === 0);
    const c1 = kmeansClusters.clusters.find((c) => c.cluster_id === 1);

    const c0Users = c0?.user_count ?? 250388;
    const c1Users = c1?.user_count ?? 2771046;

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const item = params as { name: string; value: number; percent: number; color: string; dataIndex: number };
          const cluster = item.dataIndex === 0 ? c0 : c1;
          if (!cluster) return '';

          return `<div class="p-1">
            <div class="font-semibold text-slate-100 text-xs mb-1 flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${item.color}"></span>
              ${cluster.cluster_name}
            </div>
            <div class="text-xs text-slate-300 font-mono space-y-0.5">
              <div>Users: <span class="text-white font-bold">${formatInteger(cluster.user_count)}</span> (${formatPercent(cluster.share_percent)})</div>
              <div>Mean Spend: <span class="text-emerald-400 font-bold">${formatMonetaryUnits(cluster.average_revenue, 'full')}</span></div>
              <div>Mean Purchases: <span class="text-violet-300 font-bold">${cluster.average_purchases.toFixed(2)}</span> / user</div>
              <div>Mean Views: <span class="text-slate-300">${cluster.average_views.toFixed(1)}</span> · Sessions: <span class="text-slate-300">${cluster.average_sessions.toFixed(1)}</span></div>
            </div>
          </div>`;
        },
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: 'Customer Segments',
          type: 'pie',
          radius: ['52%', '78%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#111827',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: { percent?: number }) => `${params.percent?.toFixed(1)}%`,
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
            },
            scaleSize: 6,
          },
          data: [
            {
              value: c0Users,
              name: 'Commercial Core (8.3%)',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#8B5CF6' },
                    { offset: 1, color: '#6366F1' },
                  ],
                },
              },
            },
            {
              value: c1Users,
              name: 'Casual Browsers (91.7%)',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#0E7490' },
                    { offset: 1, color: '#06B6D4' },
                  ],
                },
              },
            },
          ],
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '38%',
          style: {
            text: '3.02M',
            fill: '#F8FAFC',
            font: "700 16px 'JetBrains Mono', monospace",
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '47%',
          style: {
            text: 'USERS',
            fill: '#64748B',
            font: "600 10px 'Plus Jakarta Sans', sans-serif",
          },
        },
      ],
    };
  }, []);

  const { containerRef } = useECharts({ options });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Donut chart showing K=2 customer segmentation: 8.29% Commercial Core vs 91.71% Casual Browsers"
      />
    </div>
  );
};
