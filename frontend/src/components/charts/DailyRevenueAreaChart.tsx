import React, { useMemo, useState } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { dailyPurchases } from '@/data';
import { formatMonetaryUnits, formatInteger } from '@/utils/formatters';

interface DailyRevenueAreaChartProps {
  height?: number | string;
  className?: string;
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
  enableDataZoom?: boolean;
}

type ViewMode = 'both' | 'revenue' | 'volume';

export const DailyRevenueAreaChart: React.FC<DailyRevenueAreaChartProps> = ({
  height = 340,
  className = '',
  selectedDate,
  onSelectDate,
  enableDataZoom = true,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  const options = useMemo<echarts.EChartsOption>(() => {
    const dates = dailyPurchases.map((d) => d.event_date.slice(5)); // '10-01', '10-02', etc.
    const revenues = dailyPurchases.map((d) => d.total_revenue);
    const purchases = dailyPurchases.map((d) => d.purchase_events);

    // Peak day: Oct 16
    const oct16Index = dailyPurchases.findIndex((d) => d.event_date === '2019-10-16');
    const oct16Revenue = dailyPurchases[oct16Index]?.total_revenue ?? 9812022.04;

    // Boundary day: Nov 1
    const nov1Index = dailyPurchases.findIndex((d) => d.event_date === '2019-11-01');

    // Selected day index
    const selectedIndex = selectedDate ? dailyPurchases.findIndex((d) => d.event_date === selectedDate) : -1;

    const markLineData: Array<Record<string, unknown>> = [
      {
        name: 'Partial UTC Boundary',
        xAxis: nov1Index,
        lineStyle: {
          color: '#F59E0B',
          type: 'dashed',
          width: 1.5,
        },
        label: {
          show: true,
          formatter: 'Nov 1: Partial Day (1.49k)',
          position: 'insideEndTop',
          color: '#F59E0B',
          fontSize: 10,
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          padding: [3, 6],
          borderRadius: 4,
        },
      },
    ];

    if (selectedIndex >= 0 && selectedIndex !== nov1Index) {
      markLineData.push({
        name: 'Selected Date',
        xAxis: selectedIndex,
        lineStyle: {
          color: '#06B6D4',
          type: 'solid',
          width: 2,
        },
        label: {
          show: true,
          formatter: `Focused: ${dailyPurchases[selectedIndex]?.event_date.slice(5)}`,
          position: 'insideStartTop',
          color: '#06B6D4',
          fontSize: 10,
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          borderWidth: 1,
          padding: [3, 6],
          borderRadius: 4,
        },
      });
    }

    const series: echarts.SeriesOption[] = [];

    if (viewMode === 'both' || viewMode === 'revenue') {
      series.push({
        name: 'Recorded Purchase Value',
        type: 'line',
        yAxisIndex: 0,
        data: revenues,
        smooth: 0.35,
        showSymbol: false,
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#8B5CF6',
          shadowColor: 'rgba(139, 92, 246, 0.4)',
          shadowBlur: 10,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.45)' },
              { offset: 0.8, color: 'rgba(139, 92, 246, 0.05)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.0)' },
            ],
          },
        },
        markPoint: {
          data: [
            {
              name: 'Peak Revenue',
              coord: [oct16Index, oct16Revenue],
              value: 'Peak: 9.81M',
              symbol: 'pin',
              symbolSize: 48,
              itemStyle: {
                color: '#8B5CF6',
                shadowBlur: 12,
                shadowColor: 'rgba(139, 92, 246, 0.6)',
              },
              label: {
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 600,
                offset: [0, -3],
              },
            },
          ],
        },
        markLine: {
          symbol: ['none', 'none'],
          silent: false,
          data: markLineData,
        },
      });
    }

    if (viewMode === 'both' || viewMode === 'volume') {
      series.push({
        name: 'Purchase Orders',
        type: 'line',
        yAxisIndex: viewMode === 'volume' ? 0 : 1,
        data: purchases,
        smooth: 0.35,
        showSymbol: false,
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#06B6D4',
          type: viewMode === 'both' ? 'dashed' : 'solid',
        },
        itemStyle: {
          color: '#06B6D4',
        },
      });
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#1E293B',
            color: '#F8FAFC',
          },
        },
        formatter: (params: unknown) => {
          const items = params as Array<{
            name: string;
            seriesName: string;
            value: number;
            color: string;
            dataIndex: number;
          }>;
          if (!items || items.length === 0) return '';
          const dataIndex = items[0].dataIndex;
          const dayData = dailyPurchases[dataIndex];
          const fullDate = dayData?.event_date ?? items[0].name;

          let html = `<div class="font-semibold text-slate-100 text-xs mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
            <span>${fullDate}</span>
            ${dayData?.is_partial_day ? '<span class="text-amber-400 text-[10px] ml-2 font-mono">Partial UTC Collection</span>' : ''}
          </div>`;

          items.forEach((item) => {
            const isRevenue = item.seriesName.includes('Revenue') || item.seriesName.includes('Value');
            const formattedVal = isRevenue
              ? formatMonetaryUnits(item.value, 'full')
              : `${formatInteger(item.value)} orders`;

            html += `<div class="flex items-center justify-between text-xs py-0.5 gap-4">
              <span class="flex items-center gap-1.5 text-slate-300">
                <span class="w-2 h-2 rounded-full inline-block" style="background:${item.color}"></span>
                ${item.seriesName}
              </span>
              <span class="font-mono font-medium text-slate-100">${formattedVal}</span>
            </div>`;
          });

          return html;
        },
      },
      legend: {
        show: true,
        top: 0,
        right: 0,
        textStyle: {
          color: '#94A3B8',
          fontSize: 11,
        },
      },
      grid: {
        top: 36,
        right: viewMode === 'both' ? 50 : 20,
        bottom: enableDataZoom ? 44 : 24,
        left: 55,
        containLabel: false,
      },
      dataZoom: enableDataZoom
        ? [
            {
              type: 'inside',
              start: 0,
              end: 100,
            },
            {
              type: 'slider',
              show: true,
              bottom: 2,
              height: 18,
              borderColor: 'rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              fillerColor: 'rgba(139, 92, 246, 0.25)',
              handleStyle: {
                color: '#8B5CF6',
                borderColor: '#C4B5FD',
              },
              textStyle: {
                color: '#94A3B8',
                fontSize: 9,
              },
            },
          ]
        : undefined,
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          interval: 4,
        },
      },
      yAxis:
        viewMode === 'both'
          ? [
              {
                type: 'value',
                name: 'Revenue',
                nameTextStyle: { color: '#64748B', fontSize: 10 },
                axisLabel: {
                  color: '#94A3B8',
                  fontSize: 10,
                  formatter: (v: number) => `${(v / 1e6).toFixed(1)}M`,
                },
                splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
              },
              {
                type: 'value',
                name: 'Orders',
                nameTextStyle: { color: '#64748B', fontSize: 10 },
                position: 'right',
                axisLabel: {
                  color: '#06B6D4',
                  fontSize: 10,
                  formatter: (v: number) => `${(v / 1e3).toFixed(0)}k`,
                },
                splitLine: { show: false },
              },
            ]
          : [
              {
                type: 'value',
                axisLabel: {
                  color: '#94A3B8',
                  fontSize: 10,
                  formatter: (v: number) =>
                    viewMode === 'revenue' ? `${(v / 1e6).toFixed(1)}M` : `${(v / 1e3).toFixed(0)}k`,
                },
                splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
              },
            ],
      series,
    };
  }, [viewMode, selectedDate, enableDataZoom]);

  const onEvents = useMemo(() => {
    if (!onSelectDate) return undefined;
    return {
      click: (params: unknown) => {
        const item = params as { dataIndex: number };
        if (typeof item.dataIndex === 'number' && dailyPurchases[item.dataIndex]) {
          onSelectDate(dailyPurchases[item.dataIndex].event_date);
        }
      },
    };
  }, [onSelectDate]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Sub-header Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Trajectory:</span>
          <span className="text-xs font-mono text-violet-400 font-semibold">32 Observations</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">(Oct 01 – Nov 01, 2019)</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              viewMode === 'both'
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dual Axis
          </button>
          <button
            type="button"
            onClick={() => setViewMode('revenue')}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              viewMode === 'revenue'
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setViewMode('volume')}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              viewMode === 'volume'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Daily purchase revenue and order volume trajectory chart from October 1 to November 1, 2019"
      />
    </div>
  );
};
