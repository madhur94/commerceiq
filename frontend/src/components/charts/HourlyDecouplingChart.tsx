import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { hourlyDynamics } from '@/data';
import { formatMonetaryUnits, formatInteger } from '@/utils/formatters';

interface HourlyDecouplingChartProps {
  height?: number | string;
  className?: string;
  selectedHour?: number | null;
  onSelectHour?: (hour: number) => void;
}

export const HourlyDecouplingChart: React.FC<HourlyDecouplingChartProps> = ({
  height = 360,
  className = '',
  selectedHour,
  onSelectHour,
}) => {
  const options = useMemo<echarts.EChartsOption>(() => {
    const hours = hourlyDynamics.map((h) => `${String(h.event_hour).padStart(2, '0')}:00`);
    const eventCounts = hourlyDynamics.map((h) => h.event_count);
    const revenues = hourlyDynamics.map((h) => h.total_revenue);

    // Peak indices
    const peakActivityIndex = hourlyDynamics.findIndex((h) => h.peak_activity); // hour 21
    const peakRevenueIndex = hourlyDynamics.findIndex((h) => h.peak_revenue); // hour 14

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
          const hour = items[0].name;
          const hData = hourlyDynamics[items[0].dataIndex];

          let html = `<div class="font-semibold text-slate-100 text-xs mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
            <span>${hour} UTC</span>
            ${hData?.peak_activity ? '<span class="text-cyan-400 font-mono text-[10px]">★ Peak Activity Hour</span>' : ''}
            ${hData?.peak_revenue ? '<span class="text-violet-400 font-mono text-[10px]">★ Peak Revenue Hour</span>' : ''}
          </div>`;

          items.forEach((item) => {
            const isRev = item.seriesName.includes('Revenue');
            const valStr = isRev ? formatMonetaryUnits(item.value, 'full') : `${formatInteger(item.value)} events`;
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
        top: 45,
        right: 55,
        bottom: 25,
        left: 55,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          interval: 2,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Events (Volume)',
          nameTextStyle: { color: '#06B6D4', fontSize: 10 },
          axisLabel: {
            color: '#06B6D4',
            fontSize: 10,
            formatter: (v: number) => `${(v / 1e6).toFixed(1)}M`,
          },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        },
        {
          type: 'value',
          name: 'Revenue (Units)',
          nameTextStyle: { color: '#8B5CF6', fontSize: 10 },
          position: 'right',
          axisLabel: {
            color: '#8B5CF6',
            fontSize: 10,
            formatter: (v: number) => `${(v / 1e6).toFixed(1)}M`,
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Logged Interaction Volume',
          type: 'line',
          yAxisIndex: 0,
          data: eventCounts,
          smooth: 0.35,
          showSymbol: false,
          symbolSize: 6,
          lineStyle: {
            width: 2.5,
            color: '#06B6D4',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(6, 182, 212, 0.25)' },
                { offset: 1, color: 'rgba(6, 182, 212, 0.0)' },
              ],
            },
          },
          markPoint: {
            data: [
              {
                name: 'Peak Browsing Activity',
                coord: [peakActivityIndex, eventCounts[peakActivityIndex]],
                value: 'Peak: 3.06M',
                symbol: 'pin',
                symbolSize: 50,
                itemStyle: { color: '#06B6D4' },
                label: { color: '#FFFFFF', fontSize: 10, fontWeight: 600, offset: [0, -3] },
              },
            ],
          },
        },
        {
          name: 'Purchase Revenue Value',
          type: 'line',
          yAxisIndex: 1,
          data: revenues,
          smooth: 0.35,
          showSymbol: false,
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#8B5CF6',
            shadowColor: 'rgba(139, 92, 246, 0.5)',
            shadowBlur: 10,
          },
          markPoint: {
            data: [
              {
                name: 'Peak Purchase Revenue',
                coord: [peakRevenueIndex, revenues[peakRevenueIndex]],
                value: 'Peak: 17.53M',
                symbol: 'pin',
                symbolSize: 50,
                itemStyle: { color: '#8B5CF6' },
                label: { color: '#FFFFFF', fontSize: 10, fontWeight: 600, offset: [0, -3] },
              },
            ],
          },
          markLine:
            selectedHour !== null && selectedHour !== undefined
              ? {
                  symbol: ['none', 'none'],
                  data: [
                    {
                      name: 'Selected Hour',
                      xAxis: selectedHour,
                      lineStyle: {
                        color: '#F59E0B',
                        type: 'solid',
                        width: 2,
                      },
                      label: {
                        show: true,
                        formatter: `Focused: ${String(selectedHour).padStart(2, '0')}:00 UTC`,
                        position: 'insideStartTop',
                        color: '#F59E0B',
                        fontSize: 10,
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        borderColor: 'rgba(245, 158, 11, 0.4)',
                        borderWidth: 1,
                        padding: [3, 6],
                        borderRadius: 4,
                      },
                    },
                  ],
                }
              : undefined,
        },
      ],
    };
  }, [selectedHour]);

  const onEvents = useMemo(() => {
    if (!onSelectHour) return undefined;
    return {
      click: (params: unknown) => {
        const item = params as { dataIndex: number };
        if (typeof item.dataIndex === 'number' && hourlyDynamics[item.dataIndex]) {
          onSelectHour(hourlyDynamics[item.dataIndex].event_hour);
        }
      },
    };
  }, [onSelectHour]);

  const { containerRef } = useECharts({ options, onEvents });

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Dual-axis line chart illustrating the 7-hour temporal decoupling between peak browsing activity at 21:00 UTC and peak purchase revenue at 14:00 UTC"
      />
    </div>
  );
};
