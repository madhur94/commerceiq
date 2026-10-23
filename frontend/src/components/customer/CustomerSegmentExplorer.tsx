import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SegmentComparisonRadarChart } from '@/components/charts';
import { CustomerConstellationScene } from '@/components/3d';
import { kmeansClusters } from '@/data';
import { formatInteger, formatMonetaryValue, formatPercent } from '@/utils/formatters';
import {
  Sparkles,
  Users,
  TrendingUp,
  ShoppingBag,
  Layers,
  ArrowRightLeft,
  Table as TableIcon,
  Eye,
  ShieldAlert,
  Orbit,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export type SegmentSelectionMode = 'both' | 0 | 1;
export type ViewDisplayMode = 'constellation' | 'visual' | 'table';

export const CustomerSegmentExplorer: React.FC = () => {
  const isMobileClient = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const [selectedSegment, setSelectedSegment] = useState<SegmentSelectionMode>('both');
  const [displayMode, setDisplayMode] = useState<ViewDisplayMode>(() =>
    isMobileClient ? 'visual' : 'constellation'
  );

  const c0 = kmeansClusters.clusters[0];
  const c1 = kmeansClusters.clusters[1];

  // Verified summary comparisons
  const revenueMultiple = (c0.average_revenue / c1.average_revenue).toFixed(1);
  const purchaseMultiple = (c0.average_purchases / c1.average_purchases).toFixed(1);
  const sessionMultiple = (c0.average_sessions / c1.average_sessions).toFixed(1);
  const productMultiple = (c0.unique_products / c1.unique_products).toFixed(1);

  return (
    <SurfaceCard variant="elevated" className="border-hairline hover:border-brass/30 p-6 sm:p-8 mb-8">
      {/* Header with Segment Toggle & Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brass">
              Section B · Interactive Signature Feature
            </span>
          </div>
          <SectionHeading
            title="Interactive Customer Segment Explorer"
            subtitle="Explore verified multidimensional centroid metrics across the two K-Means clusters."
            className="mb-0 mt-1"
          />
        </div>

        {/* Controls: Segment Selector & Display Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segment Selector */}
          <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-hairline">
            <button
              onClick={() => setSelectedSegment('both')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                selectedSegment === 'both'
                  ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                  : 'text-text-muted hover:text-text-primary'
              )}
              aria-label="View side-by-side comparison"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-brass" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setSelectedSegment(0)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                selectedSegment === 0
                  ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                  : 'text-text-muted hover:text-text-primary'
              )}
              aria-label="Select Cluster 0 High-Activity Core"
            >
              <span className="w-2 h-2 rounded-full bg-brand-violet inline-block" />
              <span>Cluster 0 (8.29%)</span>
            </button>
            <button
              onClick={() => setSelectedSegment(1)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                selectedSegment === 1
                  ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                  : 'text-text-muted hover:text-text-primary'
              )}
              aria-label="Select Cluster 1 Casual Browsers"
            >
              <span className="w-2 h-2 rounded-full bg-brand-cyan inline-block" />
              <span>Cluster 1 (91.71%)</span>
            </button>
          </div>

          {/* Mode Switcher: 3D Constellation / 2D Radar / Data Table */}
          <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-hairline" role="tablist" aria-label="Visualization Mode Selector">
            <button
              onClick={() => setDisplayMode('constellation')}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                displayMode === 'constellation'
                  ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                  : 'text-text-muted hover:text-text-primary'
              )}
              title="3D Customer Constellation WebGL View"
              aria-label="3D Constellation Mode"
              role="tab"
              aria-selected={displayMode === 'constellation'}
            >
              <Orbit className="w-3.5 h-3.5 text-brass" />
              <span className="hidden sm:inline">3D Constellation</span>
            </button>
            <button
              onClick={() => setDisplayMode('visual')}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                displayMode === 'visual'
                  ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                  : 'text-text-muted hover:text-text-primary'
              )}
              title="2D Behavioral Radar Mode"
              aria-label="2D Radar Mode"
              role="tab"
              aria-selected={displayMode === 'visual'}
            >
              <Eye className="w-3.5 h-3.5 text-brass" />
              <span className="hidden sm:inline">2D Radar</span>
            </button>
            <button
              onClick={() => setDisplayMode('table')}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                displayMode === 'table'
                  ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                  : 'text-text-muted hover:text-text-primary'
              )}
              title="Detailed Centroid Metrics Table Mode"
              aria-label="Data Table Mode"
              role="tab"
              aria-selected={displayMode === 'table'}
            >
              <TableIcon className="w-3.5 h-3.5 text-brass" />
              <span className="hidden sm:inline">Data Table</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {displayMode === 'constellation' && (
          <motion.div
            key="constellation-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Revenue Multiple</span>
                  <TrendingUp className="w-4 h-4 text-accent-emerald" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {revenueMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({formatMonetaryValue(c0.average_revenue, true)}) vs Cluster 1 ({formatMonetaryValue(c1.average_revenue, true)})
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Purchase Order Multiple</span>
                  <ShoppingBag className="w-4 h-4 text-brand-violet-light" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {purchaseMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({c0.average_purchases.toFixed(2)} orders) vs Cluster 1 ({c1.average_purchases.toFixed(3)} orders)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Session Frequency</span>
                  <Users className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {sessionMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({c0.average_sessions.toFixed(1)} sessions) vs Cluster 1 ({c1.average_sessions.toFixed(2)} sessions)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Catalog Exploration Breadth</span>
                  <Layers className="w-4 h-4 text-accent-amber" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {productMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({c0.unique_products.toFixed(1)} items) vs Cluster 1 ({c1.unique_products.toFixed(1)} items)
                </p>
              </div>
            </div>

            {/* 3D Customer Constellation WebGL Canvas (Protected scene internals unchanged) */}
            <div className="rounded-xl overflow-hidden border border-hairline bg-canvas-deep/90 shadow-2xl">
              <CustomerConstellationScene
                selectedCluster={selectedSegment}
                onSelectCluster={setSelectedSegment}
                height={520}
              />
            </div>

            {/* Segment Comparative Panels: synchronized with 3D selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cluster 0 Panel */}
              <div
                className={cn(
                  'p-5 rounded-xl border transition-all duration-300',
                  selectedSegment === 0 || selectedSegment === 'both'
                    ? 'bg-brand-violet/10 border-brand-violet/40 shadow-lg'
                    : 'bg-surface-subtle/40 border-hairline opacity-40'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-brand-violet/20 text-brand-violet-light">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">Cluster 0 · High-Activity Commercial Core</h4>
                      <span className="text-[11px] text-brand-cyan font-mono">
                        {formatInteger(c0.user_count)} users ({formatPercent(c0.share_percent)})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                    Top 8.29%
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed my-3">
                  {c0.behavior_summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-hairline/60 text-xs font-mono">
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Avg Revenue</span>
                    <span className="font-bold text-brand-cyan">{formatMonetaryValue(c0.average_revenue, true)}</span>
                  </div>
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Avg Orders</span>
                    <span className="font-bold text-text-primary">{c0.average_purchases.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Avg Visits</span>
                    <span className="font-bold text-text-primary">{c0.average_sessions.toFixed(1)}</span>
                  </div>
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Products</span>
                    <span className="font-bold text-text-primary">{c0.unique_products.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Cluster 1 Panel */}
              <div
                className={cn(
                  'p-5 rounded-xl border transition-all duration-300',
                  selectedSegment === 1 || selectedSegment === 'both'
                    ? 'bg-surface-subtle border-hairline shadow-lg'
                    : 'bg-surface-subtle/40 border-hairline opacity-40'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">Cluster 1 · Casual Browsers & Occasional Buyers</h4>
                      <span className="text-[11px] text-text-muted font-mono">
                        {formatInteger(c1.user_count)} users ({formatPercent(c1.share_percent)})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-text-muted border border-hairline">
                    Majority 91.71%
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed my-3">
                  {c1.behavior_summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-hairline/60 text-xs font-mono">
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Avg Revenue</span>
                    <span className="font-bold text-text-muted">{formatMonetaryValue(c1.average_revenue, true)}</span>
                  </div>
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Avg Orders</span>
                    <span className="font-bold text-text-primary">{c1.average_purchases.toFixed(3)}</span>
                  </div>
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Avg Visits</span>
                    <span className="font-bold text-text-primary">{c1.average_sessions.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                    <span className="text-[10px] text-text-subtle font-sans block">Products</span>
                    <span className="font-bold text-text-primary">{c1.unique_products.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {displayMode === 'visual' && (
          <motion.div
            key="visual-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Mobile WebGL Advisory Banner */}
            <div className="md:hidden flex items-center justify-between p-3 rounded-lg bg-brass/10 border border-brass/25 text-xs">
              <div className="flex items-center gap-2 text-text-muted">
                <Smartphone className="w-4 h-4 text-brass flex-shrink-0" />
                <span>2D Radar view loaded for mobile battery optimization.</span>
              </div>
              <button
                onClick={() => setDisplayMode('constellation')}
                className="px-2.5 py-1 rounded bg-brass text-brass-dark hover:bg-brass-hover font-semibold text-[11px] whitespace-nowrap transition-colors shadow-sm"
              >
                Launch 3D
              </button>
            </div>

            {/* Top Metric Cards: Responsive wrapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Revenue Multiple</span>
                  <TrendingUp className="w-4 h-4 text-accent-emerald" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {revenueMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({formatMonetaryValue(c0.average_revenue, true)}) vs Cluster 1 ({formatMonetaryValue(c1.average_revenue, true)})
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Purchase Order Multiple</span>
                  <ShoppingBag className="w-4 h-4 text-brand-violet-light" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {purchaseMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({c0.average_purchases.toFixed(2)} orders) vs Cluster 1 ({c1.average_purchases.toFixed(3)} orders)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Session Frequency</span>
                  <Users className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {sessionMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({c0.average_sessions.toFixed(1)} sessions) vs Cluster 1 ({c1.average_sessions.toFixed(2)} sessions)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                  <span className="font-sans">Catalog Exploration Breadth</span>
                  <Layers className="w-4 h-4 text-accent-amber" />
                </div>
                <div className="text-2xl font-bold font-mono text-text-primary tracking-tight">
                  {productMultiple}×
                </div>
                <p className="text-[11px] text-text-subtle mt-1.5">
                  Cluster 0 ({c0.unique_products.toFixed(1)} items) vs Cluster 1 ({c1.unique_products.toFixed(1)} items)
                </p>
              </div>
            </div>

            {/* Split Grid: Radar on Left, Deep Segment Card on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Radar Chart (Left 6 Columns) */}
              <div className="lg:col-span-6 p-4 rounded-xl bg-surface-subtle/50 border border-hairline flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Normalized Behavioral Radar
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass/15 text-brass border border-brass/25">
                      Min-Max Scaled [0 - 100]
                    </span>
                  </div>
                  <p className="text-[11px] text-text-subtle mb-3">
                    Every axis is normalized to [0, 100] using explicit scaling to prevent distortion of incomparable raw units.
                  </p>

                  <SegmentComparisonRadarChart
                    focusedCluster={selectedSegment === 'both' ? null : selectedSegment}
                    height={320}
                  />
                </div>

                <div className="text-[11px] text-text-subtle border-t border-hairline/60 pt-2.5 mt-2 flex items-center justify-between font-mono">
                  <span>Cluster 0 Peak: 100 (Indexed)</span>
                  <span className="text-brass">Cluster 1 Log Revenue: 57.6</span>
                </div>
              </div>

              {/* Segment Comparative Panels (Right 6 Columns) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Cluster 0 Panel */}
                <div
                  className={cn(
                    'p-5 rounded-xl border transition-all duration-300',
                    selectedSegment === 0 || selectedSegment === 'both'
                      ? 'bg-brand-violet/10 border-brand-violet/40 shadow-lg'
                      : 'bg-surface-subtle/40 border-hairline opacity-40'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-brand-violet/20 text-brand-violet-light">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Cluster 0 · High-Activity Commercial Core</h4>
                        <span className="text-[11px] text-brand-cyan font-mono">
                          {formatInteger(c0.user_count)} users ({formatPercent(c0.share_percent)})
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                      Top 8.29%
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed my-3">
                    {c0.behavior_summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-hairline/60 text-xs font-mono">
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Avg Revenue</span>
                      <span className="font-bold text-brand-cyan">{formatMonetaryValue(c0.average_revenue, true)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Avg Orders</span>
                      <span className="font-bold text-text-primary">{c0.average_purchases.toFixed(2)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Avg Visits</span>
                      <span className="font-bold text-text-primary">{c0.average_sessions.toFixed(1)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Products</span>
                      <span className="font-bold text-text-primary">{c0.unique_products.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Cluster 1 Panel */}
                <div
                  className={cn(
                    'p-5 rounded-xl border transition-all duration-300',
                    selectedSegment === 1 || selectedSegment === 'both'
                      ? 'bg-surface-subtle border-hairline shadow-lg'
                      : 'bg-surface-subtle/40 border-hairline opacity-40'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Cluster 1 · Casual Browsers & Occasional Buyers</h4>
                        <span className="text-[11px] text-text-muted font-mono">
                          {formatInteger(c1.user_count)} users ({formatPercent(c1.share_percent)})
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-text-muted border border-hairline">
                      Majority 91.71%
                    </span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed my-3">
                    {c1.behavior_summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-hairline/60 text-xs font-mono">
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Avg Revenue</span>
                      <span className="font-bold text-text-muted">{formatMonetaryValue(c1.average_revenue, true)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Avg Orders</span>
                      <span className="font-bold text-text-primary">{c1.average_purchases.toFixed(3)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Avg Visits</span>
                      <span className="font-bold text-text-primary">{c1.average_sessions.toFixed(2)}</span>
                    </div>
                    <div className="p-2 rounded bg-surface/50 border border-hairline/40">
                      <span className="text-[10px] text-text-subtle font-sans block">Products</span>
                      <span className="font-bold text-text-primary">{c1.unique_products.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {displayMode === 'table' && (
          /* Table Display Mode: Comprehensive Accessible Matrix */
          <motion.div
            key="table-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-auto rounded-xl border border-hairline"
          >
            <table className="w-full text-left text-sm font-sans" aria-label="Customer Segment Comparison Table">
              <thead className="bg-surface-subtle text-text-muted text-xs uppercase tracking-wider font-semibold border-b border-hairline">
                <tr>
                  <th className="py-3 px-4">Behavioral Dimension</th>
                  <th className="py-3 px-4 text-right">Cluster 0 (Commercial Core)</th>
                  <th className="py-3 px-4 text-right">Cluster 1 (Casual Browsers)</th>
                  <th className="py-3 px-4 text-right">Absolute Difference</th>
                  <th className="py-3 px-4 text-right">Relative Multiple</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/60 font-mono text-xs">
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Analyzed User Population</td>
                  <td className="py-3 px-4 text-right text-brand-violet-light font-bold">{formatInteger(c0.user_count)}</td>
                  <td className="py-3 px-4 text-right text-text-muted font-bold">{formatInteger(c1.user_count)}</td>
                  <td className="py-3 px-4 text-right text-text-subtle">−{formatInteger(c1.user_count - c0.user_count)}</td>
                  <td className="py-3 px-4 text-right text-text-subtle">0.09×</td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Population Share (%)</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">{formatPercent(c0.share_percent)}</td>
                  <td className="py-3 px-4 text-right text-text-primary font-bold">{formatPercent(c1.share_percent)}</td>
                  <td className="py-3 px-4 text-right text-text-subtle">−83.42%</td>
                  <td className="py-3 px-4 text-right text-text-subtle">0.09×</td>
                </tr>
                <tr className="hover:bg-surface-elevated/40 bg-brand-violet/5">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Mean Recorded Revenue / User</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">{formatMonetaryValue(c0.average_revenue, true)}</td>
                  <td className="py-3 px-4 text-right text-text-primary font-bold">{formatMonetaryValue(c1.average_revenue, true)}</td>
                  <td className="py-3 px-4 text-right text-accent-emerald font-bold">+{formatMonetaryValue(c0.average_revenue - c1.average_revenue, true)}</td>
                  <td className="py-3 px-4 text-right text-accent-emerald font-bold">{revenueMultiple}×</td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Mean Purchase Orders / User</td>
                  <td className="py-3 px-4 text-right text-brand-violet-light font-bold">{c0.average_purchases.toFixed(2)} orders</td>
                  <td className="py-3 px-4 text-right text-text-primary font-bold">{c1.average_purchases.toFixed(3)} orders</td>
                  <td className="py-3 px-4 text-right text-accent-emerald font-bold">+{(c0.average_purchases - c1.average_purchases).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-accent-emerald font-bold">{purchaseMultiple}×</td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Mean Sessions / User</td>
                  <td className="py-3 px-4 text-right text-brand-violet-light font-bold">{c0.average_sessions.toFixed(2)} visits</td>
                  <td className="py-3 px-4 text-right text-text-primary font-bold">{c1.average_sessions.toFixed(2)} visits</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">+{(c0.average_sessions - c1.average_sessions).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">{sessionMultiple}×</td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Catalog Breadth (Unique Products)</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">{c0.unique_products.toFixed(1)} items</td>
                  <td className="py-3 px-4 text-right text-text-primary font-bold">{c1.unique_products.toFixed(1)} items</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">+{(c0.unique_products - c1.unique_products).toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-brand-cyan font-bold">{productMultiple}×</td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-sans font-medium text-text-primary">Mean Total Events (Views + Carts + Buys)</td>
                  <td className="py-3 px-4 text-right text-text-primary font-bold">{c0.average_events.toFixed(2)} events</td>
                  <td className="py-3 px-4 text-right text-text-muted font-bold">{c1.average_events.toFixed(2)} events</td>
                  <td className="py-3 px-4 text-right text-text-subtle">+{(c0.average_events - c1.average_events).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-text-subtle">{(c0.average_events / c1.average_events).toFixed(1)}×</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical Scientific Boundary Footer */}
      <div className="mt-6 pt-4 border-t border-hairline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-subtle">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent-amber flex-shrink-0" />
          <span>
            <strong>Aggregation Constraint:</strong> Segment metrics represent cluster centroid means across 3.02M users. Individual customer feature records are not simulated.
          </span>
        </div>
        <span className="font-mono text-brass whitespace-nowrap">Source: kmeans_cluster_profiles.csv</span>
      </div>
    </SurfaceCard>
  );
};
