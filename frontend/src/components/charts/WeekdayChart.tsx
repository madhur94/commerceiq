import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { weekdaySummary } from '@/data';
import { formatMonetaryUnits, formatInteger } from '@/utils/formatters';

interface WeekdayChartProps {
  height?: number | string;
  className?: string;
  selectedWeekday?: string | null;
  onSelectWeekday?: (weekday: string) => void;
}

export const WeekdayChart: React.FC<WeekdayChartProps> = ({
  height = 300,
  className = '',
  selectedWeekday,
  onSelectWeekday,
}) => {
  // Sort in standard calendar order: Monday -> Sunday
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDays = useMemo(() => {
    return [...weekdaySummary].sort(
      (a, b) => daysOrder.indexOf(a.weekday) - daysOrder.indexOf(b.weekday)
    );
  }, []);

  const options = useMemo<echarts.EChartsOption>(() => {
    const days = sortedDays.map((d) => d.weekday.slice(0, 3));
    const revenues = sortedDays.map((d) => d.total_revenue);
    const purchases = sortedDays.map((d) => d.purchase_events);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const items = params as Array<{ name: string; seriesName: string; value: number; color: string; dataIndex: number }>;
          if (!items || items.length === 0) return '';
          const fullDay = sortedDays[items[0].dataIndex]?.weekday ?? items[0].name;

          let html = `<div class="font-semibold text-slate-100 text-xs mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
            <span>${fullDay}</span>
            ${fullDay === 'Wednesday' ? '<span class="text-violet-400 font-mono text-[10px]">★ Peak Weekday</span>' : ''}
            ${fullDay === 'Saturday' ? '<span class="text-amber-400 font-mono text-[10px]">▼ Lowest Volume</span>' : ''}
          </div>`;

          items.forEach((item) => {
            const isRev = item.seriesName.includes('Revenue');
            const valStr = isRev ? formatMonetaryUnits(item.value, 'full') : `${formatInteger(item.value)} orders`;
            html += `<div class="flex items-center justify-between text-xs py-0.5 gap-4">
              <span class="flex items-center gap-1.5 text-slate-300">
                <span class="w-2 h-2 rounded-full inline-block" style="background:${item.color}"></span>
                ${item.seriesName}
              </span>
              <span class="font-mono font-medium text-slate-100">${valStr}</span>
            </div>`;
          });

          return html;
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
        bottom: 25,
        left: 50,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: days,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: { color: '#94A3B8', fontSize: 11 },
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
          barWidth: 16,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: (params: { dataIndex: number }) => {
              const day = sortedDays[params.dataIndex]?.weekday;
              const isSelected = selectedWeekday && day?.toLowerCase() === selectedWeekday.toLowerCase();
              if (isSelected) {
                return '#F59E0B'; // Highlight selected weekday in bright amber
              }
              const isPeak = day === 'Wednesday';
              return isPeak
                ? {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: '#A78BFA' },
                      { offset: 1, color: '#7C3AED' },
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
                      { offset: 1, color: '#4C1D95' },
                    ],
                  };
            },
          },
        },
        {
          name: 'Purchase Orders',
          type: 'line',
          yAxisIndex: 1,
          data: purchases,
          smooth: 0.3,
          lineStyle: { width: 2.5, color: '#06B6D4' },
          itemStyle: { color: '#06B6D4' },
          symbolSize: 6,
        },
      ],
    };
  }, [sortedDays, selectedWeekday]);

  const onEvents = useMemo(() => {
    if (!onSelectWeekday) return undefined;
    return {
      click: (params: unknown) => {
        const item = params as { name: string; dataIndex: number };
        const day = sortedDays[item.dataIndex]?.weekday || item.name;
        if (day) onSelectWeekday(day);
      },
    };
  }, [onSelectWeekday, sortedDays]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Bar and line combo chart of weekday revenue and order intensity, showing Wednesday peak at 37.13M units"
      />
    </div>
  );
};
