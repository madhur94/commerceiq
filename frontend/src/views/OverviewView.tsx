import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageTransition } from '@/components/common/PageTransition';
import { KpiCard } from '@/components/common/KpiCard';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { NoticeBanner } from '@/components/common/NoticeBanner';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { CommerceNexusScene } from '@/components/3d/CommerceNexusScene';
import {
  DailyRevenueAreaChart,
  EventFunnelChart,
  CategoryRevenueChart,
  ClusterDonutChart,
} from '@/components/charts';
import {
  DollarSign,
  Activity,
  Users,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  verifiedMetrics,
  kmeansClusters,
} from '@/data';
import {
  formatInteger,
  formatMonetaryValue,
  formatCompactMonetary,
} from '@/utils/formatters';
import { Link } from 'react-router-dom';

export const OverviewView: React.FC = () => {
  return (
    <PageTransition>
      {/* Page Header */}
      <PageHeader
        title="Executive Command Center"
        category="Commerce Intelligence Suite"
        description="High-velocity behavioral telemetry synthesized from 42,349,874 verified customer events. Grounded in Phase 7 PySpark and HDFS analytical outputs."
        badge={<StatusIndicator status="verified" label="Pipeline Grounded" />}
      />

      {/* Macro KPI Cards Grid (4 Columns) - Elevated to top for immediate hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard
          label="Recorded Purchase Value"
          value={formatCompactMonetary(verifiedMetrics.purchase_revenue, false)}
          unitLabel="monetary units"
          icon={DollarSign}
          contextPill="742.8k Orders"
          contextVariant="emerald"
          footnote={`Summed purchase-event value: ${formatMonetaryValue(verifiedMetrics.purchase_revenue, true)}`}
        />

        <KpiCard
          label="Cleaned Event Volume"
          value={formatInteger(verifiedMetrics.cleaned_records)}
          icon={Activity}
          contextPill="96.1% Views"
          contextVariant="violet"
          footnote="Filtered 98,890 rows (68,673 price ≤ 0 & cleaning adjustments)"
        />

        <KpiCard
          label="Analyzed Customers"
          value={formatInteger(verifiedMetrics.users)}
          icon={Users}
          contextPill="8.29% High Activity"
          contextVariant="cyan"
          footnote="3,021,435 users in user-level feature aggregation"
        />

        <KpiCard
          label="Recorded Sessions"
          value={formatInteger(verifiedMetrics.sessions)}
          icon={TrendingUp}
          contextPill="2.16% Purchase Ratio"
          contextVariant="neutral"
          footnote="Mean 3.06 sessions per analyzed user"
        />
      </div>

      {/* Command Center: 3D Commerce Nexus Spatial Anchor & Daily Revenue Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* 3D Hardware-Accelerated Commerce Nexus Spatial Anchor */}
        <SurfaceCard
          variant="elevated"
          className="lg:col-span-5 flex flex-col justify-between p-5 border-hairline bg-surface-subtle/40 relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-violet-light" />
                <span>Commerce Nexus · 3D Spatial Telemetry</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                Interactive 3D
              </span>
            </div>

            {/* Three.js WebGL Spatial Canvas */}
            <div className="rounded-xl bg-canvas-deep/80 border border-hairline relative overflow-hidden">
              <CommerceNexusScene />
            </div>
          </div>

          <div className="text-[11px] text-text-subtle leading-relaxed border-t border-hairline/60 pt-3 mt-3 flex items-center justify-between font-mono">
            <span>≤3 Draw Calls · 42.3M Events</span>
            <Link
              to="/sales-intelligence"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-violet-light hover:text-white transition-colors"
            >
              <span>Sales Dynamics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </SurfaceCard>

        {/* Daily Revenue Trajectory Interactive Area Chart */}
        <SurfaceCard
          variant="default"
          className="lg:col-span-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Daily Purchase Revenue Trajectory"
                subtitle="Day-by-day progression from October 1 to November 1, 2019 (UTC)."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/15 text-brand-violet-light border border-brand-violet/20 flex-shrink-0">
                Interactive ECharts
              </span>
            </div>

            {/* Key stats summary bar */}
            <div className="grid grid-cols-3 gap-3 my-3 p-2.5 rounded-lg bg-surface-subtle border border-hairline/60 text-xs">
              <div>
                <span className="text-text-subtle block text-[11px]">Peak Day (Oct 16)</span>
                <span className="font-mono font-semibold text-text-primary">9.81M units</span>
              </div>
              <div>
                <span className="text-text-subtle block text-[11px]">Peak Purchases</span>
                <span className="font-mono font-semibold text-text-primary">31,438 orders</span>
              </div>
              <div>
                <span className="text-text-subtle block text-[11px]">Nov 1 Boundary</span>
                <span className="font-mono font-semibold text-accent-amber">Partial Day (1.49k)</span>
              </div>
            </div>

            {/* Active ECharts Area Canvas */}
            <DailyRevenueAreaChart height={280} />
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-[11px] text-text-subtle flex items-center justify-between">
            <span>Source: daily_purchase_summary.csv (32 daily intervals)</span>
            <span className="font-mono text-brand-cyan">Hover data points for full breakdown</span>
          </div>
        </SurfaceCard>
      </div>

      {/* Behavioral Flow & Category Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Event-Count Funnel Structure (Strict Semantic Integrity) */}
        <SurfaceCard
          variant="default"
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Event-Count Funnel Ratios"
                subtitle="Stage distribution across recorded behavior event types."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 flex-shrink-0">
                Event Ratios
              </span>
            </div>

            {/* Active ECharts Funnel Component */}
            <EventFunnelChart height={220} />
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-[11px] text-text-subtle flex items-center justify-between">
            <span>Stage baseline: 40.71M views</span>
            <span className="font-mono text-accent-emerald">82.69% cart-to-order ratio</span>
          </div>
        </SurfaceCard>

        {/* Category Revenue Leaders with Interactive Bar Chart */}
        <SurfaceCard variant="default" className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Top Categories by Recorded Value"
                subtitle="Electronics accounts for 76.74% of all platform purchase-event value."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                14 Total
              </span>
            </div>

            {/* ECharts Horizontal Category Bar Chart */}
            <div className="mt-2">
              <CategoryRevenueChart height={240} limit={6} />
            </div>
          </div>

          <Link
            to="/data-explorer"
            className="mt-4 pt-3 border-t border-hairline/60 flex items-center justify-between text-xs text-brand-violet-light hover:text-white font-medium transition-colors"
          >
            <span>Explore all 14 categories in Data Explorer</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </SurfaceCard>
      </div>

      {/* Customer Behavioral Segmentation Preview Row */}
      <div className="mb-8">
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Customer Segmentation Snapshot (K=2 Model)"
                subtitle="Sensitivity experiment evaluating 3,021,434 users (Silhouette: 0.81115)."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                K-Means
              </span>
            </div>

            {/* Visual Donut Chart and Cluster Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mt-4">
              <div className="sm:col-span-5 lg:col-span-4 flex items-center justify-center">
                <ClusterDonutChart height={240} />
              </div>

              <div className="sm:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-4">
                {/* Cluster 0 Card */}
                <div className="p-4 rounded-xl bg-brand-violet/10 border border-brand-violet/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-brand-cyan uppercase tracking-wide">Cluster 0 · High-Activity Core</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                      8.29%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-text-primary">High-Frequency Multi-Session Buyers</div>
                  <div className="text-xs font-mono text-text-muted mt-1.5 flex flex-wrap gap-4">
                    <span>Users: {formatInteger(kmeansClusters.clusters[0].user_count)}</span>
                    <span>Avg Revenue: {formatMonetaryValue(kmeansClusters.clusters[0].average_revenue, true)}</span>
                  </div>
                </div>

                {/* Cluster 1 Card */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-hairline">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wide">Cluster 1 · Casual Browsers</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-text-muted">
                      91.71%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-text-primary">Low-Frequency Exploratory Visitors</div>
                  <div className="text-xs font-mono text-text-muted mt-1.5 flex flex-wrap gap-4">
                    <span>Users: {formatInteger(kmeansClusters.clusters[1].user_count)}</span>
                    <span>Avg Revenue: {formatMonetaryValue(kmeansClusters.clusters[1].average_revenue, true)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/customer-intelligence"
            className="mt-6 pt-3 border-t border-hairline/60 flex items-center justify-between text-xs text-brand-cyan hover:text-white font-medium transition-colors"
          >
            <span>Inspect full cluster profiles & outlier study</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </SurfaceCard>
      </div>

      {/* Methodological Transparency Note */}
      <NoticeBanner
        type="info"
        title="Analytical Boundaries & Grounding"
        message="This showcase is driven exclusively by verified precomputed summaries from Phase 7 descriptive analytics, PCA dimensionality reduction, and K-Means segmentation. In adherence to research boundaries, no speculative recommendation engine, live ingestion, or synthetic predictive models are simulated."
      />
    </PageTransition>
  );
};
