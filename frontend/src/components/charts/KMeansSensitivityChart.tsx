import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { kmeansClusters } from '@/data';

export interface KMeansSensitivityChartProps {
  selectedExperiment?: string | null;
  onSelectExperiment?: (name: string) => void;
  height?: number | string;
  className?: string;
}

export const KMeansSensitivityChart: React.FC<KMeansSensitivityChartProps> = ({
  selectedExperiment = null,
  onSelectExperiment,
  height = 290,
  className = '',
}) => {
  const experiments = kmeansClusters.sensitivity_experiments;

  const options = useMemo<echarts.EChartsOption>(() => {
    const names = experiments.map((e) => e.experiment_name);
    const scores = experiments.map((e) => e.silhouette_score);

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
          const exp = experiments[idx];

          return `<div class="p-1 space-y-1.5 min-w-[210px]">
            <div class="font-bold text-xs text-brand-cyan pb-1 border-b border-white/10 flex items-center justify-between">
              <span>${exp.experiment_name}</span>
              ${exp.is_selected ? '<span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Selected</span>' : ''}
            </div>
            <div class="text-[11px] font-mono space-y-1">
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Silhouette Score:</span>
                <span class="text-brand-cyan font-bold">${exp.silhouette_score.toFixed(5)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Cluster Count (K):</span>
                <span class="text-text-primary font-bold">K = ${exp.clusters_k}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Outlier Treatment:</span>
                <span class="${exp.outlier_excluded ? 'text-accent-emerald' : 'text-accent-amber'} font-bold">
                  ${exp.outlier_excluded ? '1 Outlier Excluded' : 'Unfiltered'}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-subtle font-sans">Population:</span>
                <span class="text-text-muted">${exp.population_size.toLocaleString()} users</span>
              </div>
            </div>
            <div class="text-[10px] text-text-subtle pt-1 border-t border-white/5 font-sans">
              Score ≥ 0.71–0.80 denotes strong cluster structure under Kaufman & Rousseeuw literature heuristics.
            </div>
          </div>`;
        },
      },
      grid: {
        top: 30,
        right: 25,
        bottom: 55,
        left: 55,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          rotate: 16,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Silhouette',
        nameTextStyle: { color: '#94A3B8', fontSize: 10 },
        min: 0.4,
        max: 0.9,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          formatter: (val: number) => val.toFixed(2),
        },
      },
      series: [
        {
          name: 'Silhouette Score',
          type: 'bar',
          data: scores.map((score, idx) => {
            const exp = experiments[idx];
            const isSelected = selectedExperiment === exp.experiment_name || (selectedExperiment === null && exp.is_selected);

            return {
              value: score,
              itemStyle: {
                borderRadius: [4, 4, 0, 0],
                color: exp.is_selected
                  ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: '#10B981' },
                        { offset: 1, color: '#059669' },
                      ],
                    }
                  : isSelected
                  ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: '#22D3EE' },
                        { offset: 1, color: '#06B6D4' },
                      ],
                    }
                  : {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: '#8B5CF6' },
                        { offset: 1, color: '#4F46E5' },
                      ],
                    },
                opacity: selectedExperiment && !isSelected ? 0.35 : 1,
              },
            };
          }),
          barWidth: 26,
          markLine: {
            symbol: ['none', 'none'],
            data: [
              {
                yAxis: 0.8,
                lineStyle: { color: '#10B981', type: 'dashed', width: 1.5 },
                label: {
                  show: true,
                  formatter: '0.80 Reference Heuristic',
                  position: 'insideEndTop',
                  color: '#10B981',
                  fontSize: 10,
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  padding: [2, 5],
                  borderRadius: 3,
                },
              },
            ],
          },
        },
      ],
    };
  }, [experiments, selectedExperiment]);

  const onEvents = useMemo(() => {
    if (!onSelectExperiment) return undefined;
    return {
      click: (params: unknown) => {
        const p = params as { componentType?: string; dataIndex?: number };
        if (p.componentType === 'series' && typeof p.dataIndex === 'number') {
          const clickedExp = experiments[p.dataIndex];
          if (clickedExp) {
            onSelectExperiment(clickedExp.experiment_name);
          }
        }
      },
    };
  }, [experiments, onSelectExperiment]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="K-Means Silhouette score sensitivity chart across 6 clustering trials"
      />
    </div>
  );
};
