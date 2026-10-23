import React, { useState } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { UserX, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/utils/cn';

export const OutlierCaseStudyPanel: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'excluded' | 'included'>('excluded');

  return (
    <SurfaceCard variant="default" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-amber">
            Section G · Data Hygiene & Outlier Case Study
          </span>
          <SectionHeading
            title="Extreme Browsing User: Sensitivity Investigation"
            subtitle="Forensic examination of 1 extreme browsing outlier account excluded from the final K-Means model."
            className="mb-0 mt-1"
          />
        </div>

        {/* State Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-hairline self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('excluded')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              activeMode === 'excluded'
                ? 'bg-accent-emerald/20 text-accent-emerald font-bold border border-accent-emerald/30 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Model State: Outlier Excluded (Selected)</span>
          </button>
          <button
            onClick={() => setActiveMode('included')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              activeMode === 'included'
                ? 'bg-accent-amber/20 text-accent-amber font-bold border border-accent-amber/30 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Counterfactual: Outlier Included Baseline</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Outlier Behavioral Profile Card (Left 6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-surface-subtle/60 border border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent-amber/15 text-accent-amber">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  Identified Outlier Behavioral Telemetry
                </h4>
                <span className="text-[11px] text-text-subtle font-mono">
                  Masked Account: usr_***849 (Telemetry ID: 5123****49)
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent-amber/20 text-accent-amber border border-accent-amber/30">
              Extreme Browsing Outlier
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-surface/70 border border-hairline/60">
              <span className="text-[10px] text-text-subtle font-sans block">Total Views</span>
              <span className="text-base font-bold text-accent-amber">7,429</span>
              <span className="text-[10px] text-text-subtle font-sans block mt-0.5">Platform Max</span>
            </div>

            <div className="p-3 rounded-lg bg-surface/70 border border-hairline/60">
              <span className="text-[10px] text-text-subtle font-sans block">Sessions</span>
              <span className="text-base font-bold text-text-primary">7,393</span>
              <span className="text-[10px] text-text-subtle font-sans block mt-0.5">~1 view / session</span>
            </div>

            <div className="p-3 rounded-lg bg-surface/70 border border-hairline/60">
              <span className="text-[10px] text-text-subtle font-sans block">Cart Adds</span>
              <span className="text-base font-bold text-text-subtle">0</span>
              <span className="text-[10px] text-text-subtle font-sans block mt-0.5">Zero intent</span>
            </div>

            <div className="p-3 rounded-lg bg-surface/70 border border-hairline/60">
              <span className="text-[10px] text-text-subtle font-sans block">Purchases</span>
              <span className="text-base font-bold text-text-subtle">0</span>
              <span className="text-[10px] text-text-subtle font-sans block mt-0.5">Zero revenue</span>
            </div>
          </div>

          {/* Comparative Matrix Table */}
          <div className="overflow-x-auto rounded-lg border border-hairline/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface/60 text-text-muted text-[10px] uppercase font-semibold">
                <tr>
                  <th className="py-2 px-3 font-sans">Behavioral Dimension</th>
                  <th className="py-2 px-3 text-right">Outlier User</th>
                  <th className="py-2 px-3 text-right">Platform Median</th>
                  <th className="py-2 px-3 text-right">Cluster 0 Mean</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/40 text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-sans text-text-primary">View Count</td>
                  <td className="py-2 px-3 text-right font-bold text-accent-amber">7,429</td>
                  <td className="py-2 px-3 text-right text-text-muted">2</td>
                  <td className="py-2 px-3 text-right text-brass">82.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-text-primary">Session Count</td>
                  <td className="py-2 px-3 text-right font-bold text-accent-amber">7,393</td>
                  <td className="py-2 px-3 text-right text-text-muted">1</td>
                  <td className="py-2 px-3 text-right text-brass">12.26</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-text-primary">Purchases</td>
                  <td className="py-2 px-3 text-right font-bold text-text-subtle">0</td>
                  <td className="py-2 px-3 text-right text-text-muted">0</td>
                  <td className="py-2 px-3 text-right text-brass">1.58</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodological Rationale & Model Impact (Right 6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-surface-subtle/60 border border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-brass">
              Impact on Clustering Mathematics
            </span>
            <span className="text-xs font-mono text-text-subtle">
              {activeMode === 'excluded' ? 'Optimized State (Selected)' : 'Illustrative Counterfactual'}
            </span>
          </div>

          <div
            className={cn(
              'p-4 rounded-xl border transition-all text-xs space-y-2',
              activeMode === 'excluded'
                ? 'bg-accent-emerald/10 border-accent-emerald/30 text-emerald-200'
                : 'bg-accent-amber/10 border-accent-amber/30 text-amber-200'
            )}
          >
            <div className="flex items-center justify-between font-mono font-bold">
              <span>Evaluated User Population:</span>
              <span>{activeMode === 'excluded' ? '3,021,434 users' : '3,021,435 users'}</span>
            </div>
            <div className="flex items-center justify-between font-mono font-bold">
              <span>Silhouette Score:</span>
              <span>{activeMode === 'excluded' ? '0.81115 (Selected Optimum)' : '0.81060 (Historical Baseline)'}</span>
            </div>
            <div className="flex items-center justify-between font-mono font-bold">
              <span>Distance Sensitivity:</span>
              <span>{activeMode === 'excluded' ? 'Centroids Unbiased' : 'Illustrative Baseline Contrast'}</span>
            </div>
          </div>

          <div className="text-xs text-text-muted leading-relaxed space-y-2.5">
            <p>
              <strong>Why K-Means is Sensitive to Outliers:</strong> K-Means minimizes the sum of squared Euclidean distances ($\sum ||x_i - \mu_k||^2$). A single user with 7,429 views (over 90 times the Cluster 0 mean) exerts disproportionate leverage on centroid placement, pulling cluster centers toward extreme coordinates and diluting natural cluster boundaries.
            </p>
            <p>
              <strong>Data Governance & Provenance:</strong> The outlier record was quarantined from unsupervised distance calculations in the selected K=2 run (0.81115 silhouette). The 0.81060 score reflects the historical unsegregated baseline experiment recorded in PySpark logs, presented here as an illustrative counterfactual. This record remains completely preserved in raw HDFS telemetry and upstream tables.
            </p>
          </div>

          <div className="pt-3 border-t border-hairline/60 flex items-center justify-between text-[11px] text-text-subtle font-mono">
            <span>Preserved in raw HDFS: 42,349,874 events</span>
            <span className="text-accent-emerald">Evaluated in ML: 3,021,434</span>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
};
