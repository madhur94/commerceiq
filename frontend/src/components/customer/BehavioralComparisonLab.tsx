import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { kmeansClusters } from '@/data';
import { formatMonetaryValue } from '@/utils/formatters';
import { DollarSign, ShoppingBag, Users, Layers, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type ComparisonMetricKey = 'revenue' | 'purchases' | 'sessions' | 'products';

interface MetricConfig {
  key: ComparisonMetricKey;
  label: string;
  unit: string;
  icon: typeof DollarSign;
  val0: number;
  val1: number;
  display0: string;
  display1: string;
  diffDisplay: string;
  ratioDisplay: string;
  interpretation: string;
}

export const BehavioralComparisonLab: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<ComparisonMetricKey>('revenue');

  const c0 = kmeansClusters.clusters[0];
  const c1 = kmeansClusters.clusters[1];

  const metrics: Record<ComparisonMetricKey, MetricConfig> = {
    revenue: {
      key: 'revenue',
      label: 'Average Purchase Value',
      unit: 'monetary units / user',
      icon: DollarSign,
      val0: c0.average_revenue,
      val1: c1.average_revenue,
      display0: formatMonetaryValue(c0.average_revenue, true),
      display1: formatMonetaryValue(c1.average_revenue, true),
      diffDisplay: `+${formatMonetaryValue(c0.average_revenue - c1.average_revenue, true)}`,
      ratioDisplay: `${(c0.average_revenue / c1.average_revenue).toFixed(1)}×`,
      interpretation:
        'High-Activity Core customers generated an average of 520.86 units in verified purchases—over 14.5 times the mean recorded spend of casual browsers (35.91 units)—concentrating major commercial transaction value within 8.29% of the user base.',
    },
    purchases: {
      key: 'purchases',
      label: 'Average Purchase Count',
      unit: 'orders / user',
      icon: ShoppingBag,
      val0: c0.average_purchases,
      val1: c1.average_purchases,
      display0: `${c0.average_purchases.toFixed(2)} orders`,
      display1: `${c1.average_purchases.toFixed(3)} orders`,
      diffDisplay: `+${(c0.average_purchases - c1.average_purchases).toFixed(2)} orders`,
      ratioDisplay: `${(c0.average_purchases / c1.average_purchases).toFixed(1)}×`,
      interpretation:
        'Cluster 0 recorded an average of 1.58 purchases per analyzed user, reflecting repeat purchasing habits. In contrast, Cluster 1 averaged 0.125 purchases per user, indicating that approximately 1 in 8 casual browsers completed an order.',
    },
    sessions: {
      key: 'sessions',
      label: 'Session Frequency',
      unit: 'visits / user',
      icon: Users,
      val0: c0.average_sessions,
      val1: c1.average_sessions,
      display0: `${c0.average_sessions.toFixed(1)} visits`,
      display1: `${c1.average_sessions.toFixed(2)} visits`,
      diffDisplay: `+${(c0.average_sessions - c1.average_sessions).toFixed(1)} visits`,
      ratioDisplay: `${(c0.average_sessions / c1.average_sessions).toFixed(1)}×`,
      interpretation:
        'High-activity users visited the store across an average of 12.26 distinct sessions during October 2019, representing a 5.5-fold increase over the 2.22 sessions typical of casual browsers.',
    },
    products: {
      key: 'products',
      label: 'Catalog Exploration Breadth',
      unit: 'unique products / user',
      icon: Layers,
      val0: c0.unique_products,
      val1: c1.unique_products,
      display0: `${c0.unique_products.toFixed(1)} products`,
      display1: `${c1.unique_products.toFixed(1)} products`,
      diffDisplay: `+${(c0.unique_products - c1.unique_products).toFixed(1)} items`,
      ratioDisplay: `${(c0.unique_products / c1.unique_products).toFixed(1)}×`,
      interpretation:
        'Cluster 0 interacted with an average of 42.04 unique products across browsing and cart additions, compared to 4.60 products for Cluster 1, demonstrating significantly deeper catalog immersion and category traversal.',
    },
  };

  const current = metrics[selectedKey];
  const maxVal = Math.max(current.val0, current.val1);
  const pct0 = (current.val0 / maxVal) * 100;
  const pct1 = (current.val1 / maxVal) * 100;

  return (
    <SurfaceCard variant="default" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brass">
            Section C · Behavioral Comparison Lab
          </span>
          <SectionHeading
            title="Segment Behavioral Comparison Lab"
            subtitle="Select a primary behavioral dimension to contrast empirical centroid differences."
            className="mb-0 mt-1"
          />
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-subtle border border-hairline self-start sm:self-auto">
          {(Object.keys(metrics) as ComparisonMetricKey[]).map((key) => {
            const m = metrics[key];
            const Icon = m.icon;
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                  isSelected
                    ? 'bg-brass/15 text-brass font-semibold shadow-sm border border-brass/40'
                    : 'text-text-muted hover:text-text-primary'
                )}
                aria-pressed={isSelected}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Main Comparison Canvas */}
          <div className="p-6 rounded-2xl bg-surface-subtle/60 border border-hairline">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase text-text-subtle font-mono">
                  Active Comparison Dimension
                </span>
                <h3 className="text-lg font-bold text-text-primary mt-0.5">
                  {current.label} ({current.unit})
                </h3>
              </div>

              {/* Difference Badges */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-accent-emerald/15 border border-accent-emerald/30 text-xs font-mono">
                  <span className="text-text-subtle mr-1.5">Absolute Delta:</span>
                  <span className="text-accent-emerald font-bold">{current.diffDisplay}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-brass/15 border border-brass/30 text-xs font-mono">
                  <span className="text-text-subtle mr-1.5">Multiple:</span>
                  <span className="text-brass font-bold">{current.ratioDisplay}</span>
                </div>
              </div>
            </div>

            {/* Visual Comparative Bars */}
            <div className="space-y-5">
              {/* Cluster 0 Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="font-bold text-brass flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brass inline-block" />
                    <span>Cluster 0 · Commercial Core (8.29%)</span>
                  </span>
                  <span className="font-mono font-bold text-text-primary text-sm">
                    {current.display0}
                  </span>
                </div>
                <div className="w-full h-4 bg-forest-sidebar rounded-full overflow-hidden p-0.5 border border-hairline/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct0}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brass-deep to-brass rounded-full shadow-glow-brass"
                  />
                </div>
              </div>

              {/* Cluster 1 Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="font-bold text-text-muted flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-forest-border inline-block" />
                    <span>Cluster 1 · Casual Browsers (91.71%)</span>
                  </span>
                  <span className="font-mono font-bold text-text-muted text-sm">
                    {current.display1}
                  </span>
                </div>
                <div className="w-full h-4 bg-forest-sidebar rounded-full overflow-hidden p-0.5 border border-hairline/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct1}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-forest-elevated to-forest-border rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Automatically Derived Grounded Interpretation */}
            <div className="mt-6 p-4 rounded-xl bg-surface/80 border border-hairline flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0 mt-0.5" />
              <div className="text-xs text-text-muted leading-relaxed">
                <span className="font-bold text-text-primary mr-1">Empirical Interpretation:</span>
                {current.interpretation}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Methodological Context Note */}
      <div className="mt-4 pt-3 border-t border-hairline/60 flex items-center gap-2 text-xs text-text-subtle">
        <Info className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        <span>
          Differences in cluster centroids establish aggregate population contrast across 3.02M accounts. They do not imply deterministic purchasing outcomes for any single customer session.
        </span>
      </div>
    </SurfaceCard>
  );
};
