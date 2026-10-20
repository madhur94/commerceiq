import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageTransition } from '@/components/common/PageTransition';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { NoticeBanner } from '@/components/common/NoticeBanner';
import { PcaVarianceChart } from '@/components/charts';
import { CheckCircle, BarChart3, Sliders } from 'lucide-react';
import { pcaVariance, kmeansClusters, verifiedMetrics } from '@/data';

export const MLInsightsView: React.FC = () => {
  return (
    <PageTransition>
      <PageHeader
        title="Machine Learning & Dimensionality Reduction"
        category="Data Science & ML"
        description="Mathematical foundations: user feature standardization, 7-component PCA explaining 95.967% variance, and K-Means model selection."
      />

      {/* PCA Explained Variance Section (Scree Plot + Table) */}
      <SurfaceCard variant="default" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <SectionHeading
            title="Principal Component Analysis (PCA) Variance Structure"
            subtitle="Numeric user features were standardized before PCA. Seven principal components explain 95.967% of total variance."
            className="mb-0"
          />
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>95.97% Retained (PC7)</span>
          </span>
        </div>

        {/* Scree Plot Chart */}
        <div className="my-4 p-2 rounded-xl bg-surface-subtle/50 border border-hairline">
          <PcaVarianceChart height={300} />
        </div>

        {/* Component Table */}
        <div className="overflow-x-auto rounded-xl border border-hairline mt-4">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-surface-subtle text-text-muted text-xs uppercase tracking-wider font-semibold border-b border-hairline">
              <tr>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4 text-right">Explained Variance (%)</th>
                <th className="py-3 px-4 text-right">Cumulative Variance (%)</th>
                <th className="py-3 px-4">Primary Behavioral Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {pcaVariance.map((p) => (
                <tr key={p.component} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-xs text-brand-cyan">{p.component}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-text-primary">
                    {p.explained_variance_percent.toFixed(4)}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-brand-violet-light font-semibold">
                    {p.cumulative_variance_percent.toFixed(4)}%
                  </td>
                  <td className="py-3 px-4 text-xs text-text-muted">
                    {p.primary_interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Dimensionality reduction target: retaining ≥95% variance with minimal orthogonal dimensions. Interpretations reflect mathematical feature loadings, not causal psychological intent.</span>
          <span className="font-mono text-brand-cyan whitespace-nowrap">7 of 11 user features retained</span>
        </div>
      </SurfaceCard>

      {/* Feature Transformation & K-Means Experiment Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Feature Transformation Result */}
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-brand-violet-light" />
              <SectionHeading
                title="Feature Normalization: Skewness Reduction"
                subtitle="Impact of log-transformation on price distribution."
                className="mb-0"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-hairline my-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Raw Price Skewness:</span>
                <span className="font-mono text-accent-amber font-bold">+2.53991 (Strongly Right-Skewed)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Post log1p(price) Skewness:</span>
                <span className="font-mono text-accent-emerald font-bold">−0.26836 (Near-Normal Distribution)</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Logarithmic scaling successfully stabilized extreme right-tail price outliers, reducing skewness by over 2.8 units and preparing data for distance-based clustering algorithms.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-[11px] text-text-subtle">
            Baseline mean price: {verifiedMetrics.price_mean.toFixed(2)} units · Median: {verifiedMetrics.price_median_purchase.toFixed(2)} units
          </div>
        </SurfaceCard>

        {/* K-Means Model Evaluation */}
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-brand-cyan" />
              <SectionHeading
                title="K-Means Silhouette Score Evaluation"
                subtitle="Comparison across sensitivity and baseline clustering trials."
                className="mb-0"
              />
            </div>

            <div className="space-y-2.5 mt-4">
              {kmeansClusters.sensitivity_experiments.slice(0, 4).map((exp) => (
                <div
                  key={exp.experiment_name}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-hairline/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {exp.is_selected && <CheckCircle className="w-4 h-4 text-accent-emerald flex-shrink-0" />}
                    <span className="font-medium text-text-primary">{exp.experiment_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-cyan">
                      {exp.silhouette_score.toFixed(5)}
                    </span>
                    {exp.is_selected && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-accent-emerald/20 text-accent-emerald">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-[11px] text-text-subtle">
            Selected K=2 model excludes 1 extreme browsing user (7,429 views, 0 purchases).
          </div>
        </SurfaceCard>
      </div>

      <NoticeBanner
        type="info"
        title="Predictive Modeling Scope"
        message="This showcase focuses strictly on completed unsupervised learning (PCA and K-Means clustering). Predictive conversion modeling and association rule mining remain deferred and are intentionally outside the current analytical scope."
      />
    </PageTransition>
  );
};
