import React, { useState } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { KMeansSensitivityChart } from '@/components/charts';
import { kmeansClusters } from '@/data';
import { CheckCircle2, Sliders, Award, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const KMeansModelExplorer: React.FC = () => {
  const [selectedExperiment, setSelectedExperiment] = useState<string>('K=2 (Outlier Excluded)');

  const experiments = kmeansClusters.sensitivity_experiments;
  const currentExp = experiments.find((e) => e.experiment_name === selectedExperiment) ?? experiments[0];

  const getScoreVerdict = (score: number) => {
    if (score >= 0.8) return { label: 'Strong Separation (Literature Heuristic)', color: 'text-accent-emerald bg-accent-emerald/20 border-accent-emerald/30' };
    if (score >= 0.5) return { label: 'Moderate Cluster Structure', color: 'text-brass bg-brass/20 border-brass/30' };
    return { label: 'Weak Cluster Boundary', color: 'text-accent-amber bg-accent-amber/20 border-accent-amber/30' };
  };

  const verdict = getScoreVerdict(currentExp.silhouette_score);

  return (
    <SurfaceCard variant="default" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brass">
            Section F · Cluster Quality & Sensitivity Analysis
          </span>
          <SectionHeading
            title="K-Means Model Architecture & Sensitivity Explorer"
            subtitle="Comparing silhouette cohesion across 6 sensitivity trials identifying K=2 as the best evaluated configuration."
            className="mb-0 mt-1"
          />
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Selected Model: K=2 (0.81115)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chart Column (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-surface-subtle/50 border border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Silhouette Scores Across Sensitivity Trials
            </span>
            <span className="text-[10px] font-mono text-brass">
              Click bar to inspect trial
            </span>
          </div>

          <KMeansSensitivityChart
            selectedExperiment={selectedExperiment}
            onSelectExperiment={setSelectedExperiment}
            height={260}
          />

          <div className="mt-3 pt-2.5 border-t border-hairline/60 text-[11px] text-text-subtle flex items-center justify-between">
            <span>Literature reference heuristic: Silhouette ≥ 0.80 (Strong Structure)</span>
            <span className="font-mono text-accent-emerald">Selected K=2: 0.81115</span>
          </div>
        </div>

        {/* Experiment Details Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-surface-subtle border border-hairline">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-text-muted">Trial Details</span>
              <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded font-bold border', verdict.color)}>
                {verdict.label}
              </span>
            </div>

            <h4 className="text-base font-bold text-text-primary mb-1">
              {currentExp.experiment_name}
            </h4>

            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60 flex justify-between items-center">
                <span className="text-text-subtle font-sans">Silhouette Score:</span>
                <span className="text-sm font-bold text-brass">{currentExp.silhouette_score.toFixed(5)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60 flex justify-between items-center">
                <span className="text-text-subtle font-sans">Cluster Count (K):</span>
                <span className="font-bold text-text-primary">K = {currentExp.clusters_k}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60 flex justify-between items-center">
                <span className="text-text-subtle font-sans">Outlier Treatment:</span>
                <span className={cn('font-bold', currentExp.outlier_excluded ? 'text-accent-emerald' : 'text-accent-amber')}>
                  {currentExp.outlier_excluded ? '1 Extreme Outlier Excluded' : 'Unfiltered (Includes Outlier)'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60 flex justify-between items-center">
                <span className="text-text-subtle font-sans">Evaluated Population:</span>
                <span className="text-text-primary font-bold">{currentExp.population_size.toLocaleString()} users</span>
              </div>
            </div>

            <p className="text-[11px] text-text-muted leading-relaxed mt-4 pt-3 border-t border-hairline/60">
              {currentExp.is_selected
                ? 'Selected as the final model due to optimal separation index (0.81115), reflecting natural binary segmentation between high-volume commercial purchasers and exploratory browsers.'
                : 'Sub-optimal trial showing diminished separation. As K increased to 3 or 4, silhouette dropped toward 0.52, indicating artificial fragmentation of the broad browsing majority.'}
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {experiments.map((exp) => (
              <button
                key={exp.experiment_name}
                onClick={() => setSelectedExperiment(exp.experiment_name)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all',
                  selectedExperiment === exp.experiment_name
                    ? 'bg-brass/20 text-brass border border-brass/50 font-bold'
                    : 'bg-surface-subtle text-text-muted hover:text-text-primary border border-hairline'
                )}
              >
                {exp.experiment_name.replace(' Experiment', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Metric Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-hairline/60 text-xs">
        <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-hairline/60">
          <div className="flex items-center gap-1.5 font-bold text-text-primary mb-1">
            <Sliders className="w-3.5 h-3.5 text-brass" />
            <span>Centroid Centers</span>
          </div>
          <p className="text-text-subtle text-[11px] leading-relaxed">
            K-Means represents each cluster by its geometric mean in 7D PCA space. Centroids represent collective center-of-gravity, not a literal user.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-hairline/60">
          <div className="flex items-center gap-1.5 font-bold text-text-primary mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-brass" />
            <span>Silhouette Metric</span>
          </div>
          <p className="text-text-subtle text-[11px] leading-relaxed">
            Measures how well-separated clusters are from -1 (misclassified) to +1 (dense, distant clusters). A score of 0.81 indicates strong separation.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-hairline/60">
          <div className="flex items-center gap-1.5 font-bold text-text-primary mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-accent-amber" />
            <span>Operational Realism</span>
          </div>
          <p className="text-text-subtle text-[11px] leading-relaxed">
            A high silhouette score confirms statistical clustering validity, but does not dictate business segmentation policies or promotional rules.
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
};
