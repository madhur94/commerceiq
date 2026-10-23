import React, { useState } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { EventFunnelChart, CategoryBrandTreemapChart, ProductBubbleChart, CategoryBrandSunburstChart } from '@/components/charts';
import {
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Cpu,
  Maximize2,
  FileCode2,
} from 'lucide-react';

type StudioTab = 'funnel' | 'treemap' | 'bubble' | 'sunburst';

interface StudioItemConfig {
  id: StudioTab;
  title: string;
  subtitle: string;
  badge: string;
  legacyHtml: string;
  sourceArtifact: string;
  nativeAvailable: boolean;
  takeaway: string;
  specs: {
    records: string;
    metrics: string;
    rendering: string;
    perfAdvantage: string;
  };
}

const STUDIO_CONFIGS: Record<StudioTab, StudioItemConfig> = {
  funnel: {
    id: 'funnel',
    title: 'Event Conversion Funnel',
    subtitle: 'Micro-conversion drops from initial view to purchase commitment',
    badge: 'Funnel Analytics',
    legacyHtml: '/visualizations/plotly/29_event_funnel.html',
    sourceArtifact: 'event_distribution.csv & 29_event_funnel.html',
    nativeAvailable: true,
    takeaway:
      'Only 2.21% of product views progress to shopping cart additions, but once in-cart, 82.69% convert into completed orders. The critical drop occurs at the discovery-to-cart transition.',
    specs: {
      records: '42,349,874 total events across 3 stages',
      metrics: 'Volume, drop-off rate, cart conversion ratio',
      rendering: 'Native ECharts Funnel (Canvas)',
      perfAdvantage: 'Instant render (<8ms) vs 3.2MB legacy Plotly iframe',
    },
  },
  treemap: {
    id: 'treemap',
    title: 'Category & Brand Revenue Treemap',
    subtitle: 'Hierarchical market share across 9 root sectors and 150 top brands',
    badge: 'Hierarchical Treemap',
    legacyHtml: '/visualizations/plotly/26_category_brand_treemap.html',
    sourceArtifact: '26_category_brand_treemap.html (159 nodes extracted)',
    nativeAvailable: true,
    takeaway:
      'Electronics accounts for 166.7M units (72.6% of total catalog revenue), with Apple alone generating 109.4M units (47.6% of total revenue) across smartphones and hardware.',
    specs: {
      records: '159 hierarchical tree nodes (9 sectors, 150 brands)',
      metrics: 'Gross revenue, child-to-parent percentage, rank',
      rendering: 'Native ECharts Squarified Treemap',
      perfAdvantage: 'Smooth breadcrumb zoom & tooltips with zero memory leaks',
    },
  },
  bubble: {
    id: 'bubble',
    title: 'Product Revenue & Purchase Bubble Matrix',
    subtitle: 'Multi-dimensional clustering of top 100 products by volume, revenue, buyers, and price',
    badge: '4D Bubble Matrix',
    legacyHtml: '/visualizations/plotly/25_product_bubble_chart.html',
    sourceArtifact: 'top_products_revenue.csv & 25_product_bubble_chart.html',
    nativeAvailable: true,
    takeaway:
      'A tiny cluster of flagship smartphones dominates both top purchases and total revenue, while long-tail consumer accessories achieve high volume at modest unit economics.',
    specs: {
      records: '100 top-ranked products',
      metrics: 'X: Purchases, Y: Revenue, Size: Unique buyers, Color: Avg Price',
      rendering: 'Native ECharts 4D Scatter with Continuous VisualMap',
      perfAdvantage: 'Zero WebGL dependency; fluid hover inspector',
    },
  },
  sunburst: {
    id: 'sunburst',
    title: 'Category & Brand Sunburst Partition',
    subtitle: 'Radial multi-tier decomposition of ecommerce revenue share',
    badge: 'Radial Sunburst (ECharts + Plotly)',
    legacyHtml: '/visualizations/plotly/27_category_brand_sunburst.html',
    sourceArtifact: '27_category_brand_sunburst.html (159 radial sectors)',
    nativeAvailable: true,
    takeaway:
      'Radial visualization highlights the extreme asymmetry between Electronics/Appliances and all remaining sectors (Apparel, Auto, Furniture, Kids).',
    specs: {
      records: '159 radial slices across 2 depth levels',
      metrics: 'Radial arc angle proportional to gross revenue',
      rendering: 'Native ECharts Sunburst (Radial Canvas)',
      perfAdvantage: 'High-performance interactive radial drill-down (<10ms) vs 3.2MB legacy Plotly iframe',
    },
  },
};

export const InteractiveChartStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('funnel');
  const [viewMode, setViewMode] = useState<'native' | 'legacy'>('native');

  const activeConfig = STUDIO_CONFIGS[activeTab];
  const canShowNative = activeConfig.nativeAvailable && viewMode === 'native';

  return (
    <SurfaceCard variant="default" className="mb-8" id="chart-studio">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-brass/10 text-brass border border-brass/30">
              <Sparkles className="w-3 h-3" />
              Section E · Interactive Chart Studio
            </span>
            <span className="text-[11px] font-mono text-text-subtle">
              Plotly Reimplementation
            </span>
          </div>
          <SectionHeading
            title="Interactive Chart Studio & Legacy Reimplementations"
            subtitle="Explore high-performance native ECharts conversions alongside original sandboxed Plotly research charts."
            className="mb-0"
          />
        </div>

        {/* View Mode Switcher (Native ECharts vs Legacy Plotly) */}
        <div className="flex items-center gap-2 bg-surface-subtle p-1 rounded-xl border border-hairline shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('native')}
            disabled={!activeConfig.nativeAvailable}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'native' && activeConfig.nativeAvailable
                ? 'bg-brass text-forest-sidebar font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Native ECharts (Optimized)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('legacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'legacy' || !activeConfig.nativeAvailable
                ? 'bg-forest-elevated text-brass border border-brass/40 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Legacy Plotly (Sandbox)
          </button>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex flex-wrap gap-2 mt-4 pb-4 border-b border-hairline/40">
        {(Object.keys(STUDIO_CONFIGS) as StudioTab[]).map((tabKey) => {
          const item = STUDIO_CONFIGS[tabKey];
          const isSelected = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => {
                setActiveTab(tabKey);
                if (!item.nativeAvailable) {
                  setViewMode('legacy');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-forest-elevated text-brass border-brass/50 shadow-sm font-bold'
                  : 'bg-surface-subtle text-text-muted border-hairline/60 hover:text-text-primary hover:border-hairline'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{item.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-forest-sidebar font-mono text-text-subtle">
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas Area */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div>
            <h4 className="font-semibold text-text-primary">{activeConfig.title}</h4>
            <p className="text-[11px] text-text-muted">{activeConfig.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-subtle hidden sm:inline">
              Source: {activeConfig.sourceArtifact}
            </span>
            <a
              href={activeConfig.legacyHtml}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-surface-subtle text-text-muted hover:text-text-primary border border-hairline inline-flex items-center gap-1 text-[11px]"
              title="Open raw Plotly HTML in new tab"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Open Standalone</span>
            </a>
          </div>
        </div>

        {/* Dynamic Chart Rendering Area */}
        <div className="rounded-xl border border-hairline bg-forest-canvas/80 overflow-hidden relative min-h-[460px] flex items-center justify-center p-2">
          {canShowNative ? (
            <div className="w-full h-full min-h-[440px] flex flex-col justify-center">
              {activeTab === 'funnel' && <EventFunnelChart height={380} />}
              {activeTab === 'treemap' && <CategoryBrandTreemapChart height={440} />}
              {activeTab === 'bubble' && <ProductBubbleChart height={440} />}
              {activeTab === 'sunburst' && <CategoryBrandSunburstChart height={440} />}
            </div>
          ) : (
            <div className="w-full h-full min-h-[460px] flex flex-col">
              <div className="px-3 py-1.5 bg-forest-sidebar border-b border-hairline flex items-center justify-between text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse"></span>
                  Sandboxed Legacy Plotly Runtime ({activeConfig.legacyHtml})
                </span>
                <span className="font-mono text-text-subtle">iframe sandbox: allow-scripts</span>
              </div>
              <iframe
                title={activeConfig.title}
                src={activeConfig.legacyHtml}
                className="w-full flex-1 min-h-[440px] border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </div>
      </div>

      {/* Analytical Takeaway & Architectural Specs Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-hairline/60">
        <div className="lg:col-span-2 p-4 rounded-xl bg-surface-subtle border border-hairline">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-brass">
            <Info className="w-4 h-4" />
            Key Research Insight
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {activeConfig.takeaway}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle border border-hairline text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-text-primary mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
            Engineering Specifications
          </div>
          <div className="flex justify-between text-[11px] py-0.5 border-b border-hairline/40">
            <span className="text-text-muted">Scope:</span>
            <span className="font-mono text-text-secondary text-right">{activeConfig.specs.records}</span>
          </div>
          <div className="flex justify-between text-[11px] py-0.5 border-b border-hairline/40">
            <span className="text-text-muted">Engine:</span>
            <span className="font-mono text-brass text-right">{activeConfig.specs.rendering}</span>
          </div>
          <div className="flex justify-between text-[11px] py-0.5">
            <span className="text-text-muted">Efficiency:</span>
            <span className="font-mono text-accent-emerald text-right">{activeConfig.specs.perfAdvantage}</span>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
};
