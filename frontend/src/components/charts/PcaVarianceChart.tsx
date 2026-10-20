import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { pcaVariance } from '@/data';
import { formatPercent } from '@/utils/formatters';

interface PcaVarianceChartProps {
  height?: number | string;
  className?: string;
}

export const PcaVarianceChart: React.FC<PcaVarianceChartProps> = ({
  height = 320,
  className = '',
}) => {
  const options = useMemo<echarts.EChartsOption>(() => {
    const components = pcaVariance.map((p) => p.component);
    const individual = pcaVariance.map((p) => p.explained_variance_percent);
    const cumulative = pcaVariance.map((p) => p.cumulative_variance_percent);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: unknown) => {
          const items = params as Array<{ name: string; seriesName: string; value: number; color: string; dataIndex: number }>;
          if (!items || items.length === 0) return '';
          const idx = items[0].dataIndex;
          const p = pcaVariance[idx];

          return `<div class="p-1">
            <div class="font-semibold text-slate-100 text-xs mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
              <span>${p.component}</span>
              <span class="text-violet-400 font-mono text-[10px]">Rank #${idx + 1}</span>
            </div>
            <div class="text-xs text-slate-300 font-mono space-y-1">
              <div class="flex justify-between gap-4">
                <span>Individual Variance:</span>
                <span class="text-violet-300 font-bold">${formatPercent(p.explained_variance_percent)}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span>Cumulative Variance:</span>
                <span class="text-cyan-300 font-bold">${formatPercent(p.cumulative_variance_percent)}</span>
              </div>
              <div class="text-[10px] text-slate-400 pt-1 border-t border-white/5 font-sans">
                ${p.primary_interpretation}
              </div>
            </div>
          </div>`;
        },
      },
      legend: {
        show: true,
        top: 0,
        left: 'center',
        textStyle: { color: '#94A3B8', fontSize: 11 },
      },
      grid: {
        top: 35,
        right: 45,
        bottom: 25,
        left: 50,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: components,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#94A3B8', fontSize: 11 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Individual %',
          nameTextStyle: { color: '#8B5CF6', fontSize: 10 },
          max: 50,
          min: 0,
          axisLabel: {
            color: '#8B5CF6',
            fontSize: 10,
            formatter: '{value}%',
          },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        },
        {
          type: 'value',
          name: 'Cumulative %',
          nameTextStyle: { color: '#06B6D4', fontSize: 10 },
          position: 'right',
          max: 100,
          min: 0,
          axisLabel: {
            color: '#06B6D4',
            fontSize: 10,
            formatter: '{value}%',
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Explained Variance (%)',
          type: 'bar',
          yAxisIndex: 0,
          data: individual,
          barWidth: 20,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#8B5CF6' },
                { offset: 1, color: '#6D28D9' },
              ],
            },
          },
        },
        {
          name: 'Cumulative Variance (%)',
          type: 'line',
          yAxisIndex: 1,
          data: cumulative,
          smooth: 0.3,
          lineStyle: { width: 3, color: '#06B6D4' },
          itemStyle: { color: '#06B6D4' },
          symbolSize: 6,
          markLine: {
            symbol: ['none', 'none'],
            data: [
              {
                yAxis: 95.967,
                lineStyle: { color: '#10B981', type: 'dashed', width: 1.5 },
                label: {
                  show: true,
                  formatter: '95.97% (PC7 Target)',
                  position: 'insideEndTop',
                  color: '#10B981',
                  fontSize: 10,
                  backgroundColor: 'rgba(17, 24, 39, 0.85)',
                  padding: [2, 6],
                  borderRadius: 4,
                },
              },
            ],
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
        aria-label="PCA scree plot showing 7 principal components explaining 95.967% of cumulative behavioral variance"
      />
    </div>
  );
};
