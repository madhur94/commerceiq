import React, { useMemo } from 'react';
import type * as echarts from 'echarts';
import { useECharts } from '@/charts/useECharts';
import { eventDistribution } from '@/data';
import { formatInteger } from '@/utils/formatters';
import { AlertCircle, ArrowDown } from 'lucide-react';

interface EventFunnelChartProps {
  height?: number | string;
  className?: string;
}

export const EventFunnelChart: React.FC<EventFunnelChartProps> = ({
  height = 240,
  className = '',
}) => {
  const options = useMemo<echarts.EChartsOption>(() => {
    // Stage counts: View, Cart, Purchase
    const viewItem = eventDistribution.find((e) => e.event_type === 'view') ?? { count: 40708807 };
    const cartItem = eventDistribution.find((e) => e.event_type === 'cart') ?? { count: 898294 };
    const purchaseItem = eventDistribution.find((e) => e.event_type === 'purchase') ?? { count: 742773 };

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const item = params as { name: string; value: number; percent: number; color: string };
          let ratioNote = '';
          if (item.name.toLowerCase().includes('view')) {
            ratioNote = 'Baseline Stage: 100.0% of logged user interactions';
          } else if (item.name.toLowerCase().includes('cart')) {
            ratioNote = '2.21% of total views · 898,294 logged additions';
          } else if (item.name.toLowerCase().includes('purchase')) {
            ratioNote = '82.69% of cart additions · 1.82% of view interactions';
          }

          return `<div class="p-1">
            <div class="font-semibold text-slate-100 text-xs mb-1 flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${item.color}"></span>
              ${item.name}
            </div>
            <div class="text-xs text-slate-300 font-mono mb-1">
              Recorded Events: <span class="text-white font-bold">${formatInteger(item.value)}</span>
            </div>
            <div class="text-[11px] text-violet-300 bg-violet-950/40 p-1.5 rounded border border-violet-500/20">
              ${ratioNote}
            </div>
          </div>`;
        },
      },
      series: [
        {
          name: 'Event Volume',
          type: 'funnel',
          left: '10%',
          top: 15,
          bottom: 15,
          width: '80%',
          min: 700000,
          max: 42000000,
          minSize: '24%',
          maxSize: '100%',
          sort: 'descending',
          gap: 6,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}\n{c}',
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.4)',
          },
          data: [
            {
              value: viewItem.count,
              name: 'Views (40.71M)',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: '#6366F1' },
                    { offset: 1, color: '#8B5CF6' },
                  ],
                },
              },
            },
            {
              value: cartItem.count,
              name: 'Carts (898K)',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: '#8B5CF6' },
                    { offset: 1, color: '#06B6D4' },
                  ],
                },
              },
            },
            {
              value: purchaseItem.count,
              name: 'Purchases (743K)',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: '#06B6D4' },
                    { offset: 1, color: '#10B981' },
                  ],
                },
              },
            },
          ],
        },
      ],
    };
  }, []);

  const { containerRef } = useECharts({ options });

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Funnel Canvas */}
      <div
        ref={containerRef}
        style={{ height, width: '100%' }}
        aria-label="Funnel chart of event count transitions: 40.7M Views to 898K Carts to 743K Purchases"
      />

      {/* Numerical Step-Down Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-center">
          <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">1. Views</div>
          <div className="text-sm font-mono font-bold text-indigo-300 mt-0.5">40,708,807</div>
          <div className="text-[10px] text-slate-400 mt-0.5">100% baseline</div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-center relative">
          <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">2. Carts</div>
          <div className="text-sm font-mono font-bold text-violet-300 mt-0.5">898,294</div>
          <div className="text-[10px] text-cyan-400 font-medium mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowDown className="w-2.5 h-2.5" /> 2.21% of views
          </div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 text-center">
          <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">3. Purchases</div>
          <div className="text-sm font-mono font-bold text-emerald-300 mt-0.5">742,773</div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowDown className="w-2.5 h-2.5" /> 82.69% of carts
          </div>
        </div>
      </div>

      {/* Analytical Semantics Footnote */}
      <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-200/90 leading-relaxed">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Methodological Disclosure:</span> These metrics represent{' '}
          <strong className="text-amber-100">event-count ratios</strong> across 42.3M raw interactions, not individual session conversion rates. 82.69% of cart events culminate in purchase events, but cart actions occur in only 2.21% of browsing interactions.
        </div>
      </div>
    </div>
  );
};
