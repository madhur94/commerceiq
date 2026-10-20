import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { PcaVarianceChart } from '@/components/charts';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface PipelineStep {
  step: number;
  shortName: string;
  title: string;
  tag: string;
  description: string;
  technicalDetails: string[];
}

export const PcaExplainerStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(4); // Default to PCA Variance Retention step

  const steps: PipelineStep[] = [
    {
      step: 1,
      shortName: 'Feature Extraction',
      title: 'Step 1 · Distributed Behavioral Feature Aggregation',
      tag: 'PySpark Upstream',
      description:
        'Raw event telemetry (42,349,874 records) was aggregated per distinct user into 11 behavioral features, including total event volume, view frequency, cart additions, purchase counts, gross recorded revenue, session counts, and unique product counts.',
      technicalDetails: [
        '3,021,435 initial user profiles synthesized',
        'Eliminated user sessions without active timestamps',
        'Engineered engagement density and basket size metrics',
      ],
    },
    {
      step: 2,
      shortName: 'Skewness Normalization',
      title: 'Step 2 · Log-Transformation & Z-Score Standardization',
      tag: 'Data Hygiene',
      description:
        'Raw monetary and frequency metrics exhibited severe right-skewness. A log1p(x) transformation was applied to price and spend variables, dramatically reducing skewness from +2.53991 to -0.26836, followed by zero-mean unit-variance Z-score standardization.',
      technicalDetails: [
        'Raw price skewness: +2.53991 (heavily right-tailed)',
        'Post-log1p skewness: -0.26836 (near-Gaussian symmetry)',
        'Standardization prevents high-magnitude features from dominating Euclidean distances',
      ],
    },
    {
      step: 3,
      shortName: 'Orthogonal Projection',
      title: 'Step 3 · Covariance Eigen-Decomposition',
      tag: 'Linear Algebra',
      description:
        'Correlations among the 11 standardized features were decomposed into an 11×11 covariance matrix. Eigen-decomposition projected the data onto orthogonal axes, eliminating collinearity and ranking dimensions by explanatory power.',
      technicalDetails: [
        'Diagonalized covariance matrix into orthogonal eigenvectors',
        'PC1 (40.71% variance): Dominant loadings on total events, views, and sessions (descriptive volume hypothesis)',
        'PC2 (17.93% variance): Contrast between catalog exploration and price metrics (descriptive breadth hypothesis)',
        'Component meanings represent linear algebraic factor weights, not physical behavioral laws',
      ],
    },
    {
      step: 4,
      shortName: 'Variance Retention',
      title: 'Step 4 · 7-Component Variance Retention Gate (95.97%)',
      tag: 'Information Gate',
      description:
        'To reduce dimensionality while preserving behavioral fidelity, a 95% cumulative variance retention threshold was established. The first 7 principal components retain 95.967% of total variance, allowing 4 redundant dimensions to be pruned.',
      technicalDetails: [
        'PC1 to PC7 cumulative variance: 95.967%',
        'Components 8 through 11 account for <4.03% residual variance',
        'Retains maximum behavioral variation with 36.4% fewer dimensions',
      ],
    },
    {
      step: 5,
      shortName: 'K-Means Partitioning',
      title: 'Step 5 · Cluster Optimization in 7D PCA Space',
      tag: 'Unsupervised ML',
      description:
        'K-Means clustering was executed within the standardized 7-dimensional PCA space across candidate K values (K=2 through K=5). Silhouette analysis evaluated cluster separation, identifying K=2 as the distinct empirical optimum.',
      technicalDetails: [
        'K=2 achieved a peak Silhouette score of 0.81115 (outlier-excluded)',
        'Higher K values (K=3, 4, 5) dropped Silhouette scores to ~0.52 - 0.57',
        'Silhouette 0.80 serves as a standard literature heuristic (Kaufman & Rousseeuw), not a universal physical threshold',
        '1 extreme browsing outlier account (7,429 views, 0 purchases) quarantined to protect centroids',
      ],
    },
    {
      step: 6,
      shortName: 'Centroid Characterization',
      title: 'Step 6 · Centroid Inversion to Human Metrics',
      tag: 'Explainable AI',
      description:
        'Normalized centroid coordinates in PCA space were mathematically inverted back to original business units (monetary units, purchase counts, visits). This revealed a clear bifurcation: an 8.29% commercial core vs a 91.71% casual browsing majority.',
      technicalDetails: [
        'Cluster 0: 520.86 units spend · 1.58 purchases · 12.26 sessions (Core)',
        'Cluster 1: 35.91 units spend · 0.125 purchases · 2.22 sessions (Browsers)',
        'Preserves scientific integrity: models describe observed history, not future determinism',
      ],
    },
  ];

  const current = steps[activeStep - 1];

  return (
    <SurfaceCard variant="default" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-violet-light">
            Section E · Explainable Machine Learning Pipeline
          </span>
          <SectionHeading
            title="PCA Dimensionality Reduction & Educational Pipeline"
            subtitle="Follow the step-by-step mathematical transformation from raw event logs to explainable customer clusters."
            className="mb-0 mt-1"
          />
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 font-semibold">
            95.97% Retained (PC7)
          </span>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {steps.map((s) => {
          const isActive = s.step === activeStep;
          const isCompleted = s.step < activeStep;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={cn(
                'p-2.5 rounded-xl text-left border transition-all relative overflow-hidden',
                isActive
                  ? 'bg-brand-violet/20 border-brand-violet/50 shadow-glow-violet'
                  : isCompleted
                  ? 'bg-surface-subtle border-hairline hover:bg-surface-elevated/60 text-text-muted'
                  : 'bg-surface-subtle/50 border-hairline/40 text-text-subtle hover:text-text-primary'
              )}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-text-subtle">
                  STEP {s.step}
                </span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />}
                {isActive && <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />}
              </div>
              <div className="text-xs font-semibold text-text-primary truncate">
                {s.shortName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Explainer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step Narrative (Left 6 Cols) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-6 p-5 rounded-xl bg-surface-subtle/60 border border-hairline flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-cyan">
                  {current.tag}
                </span>
                <span className="text-xs font-mono text-text-subtle">
                  Phase {activeStep} of 6
                </span>
              </div>

              <h4 className="text-base font-bold text-text-primary mb-3">
                {current.title}
              </h4>

              <p className="text-xs text-text-muted leading-relaxed mb-4">
                {current.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-hairline/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-subtle block font-sans">
                  Key Technical Invariants
                </span>
                {current.technicalDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-violet-light flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper Navigation Arrows */}
            <div className="mt-6 pt-3 border-t border-hairline/60 flex items-center justify-between">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-surface-elevated text-text-muted hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 border border-hairline"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>

              <button
                disabled={activeStep === 6}
                onClick={() => setActiveStep((prev) => Math.min(prev + 1, 6))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-cyan hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 border border-brand-violet/30"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scree Plot Chart (Right 6 Cols) */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-surface-subtle/50 border border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              PCA Scree Plot & Cumulative Retention
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/15 text-brand-violet-light border border-brand-violet/20">
              7 Principal Components
            </span>
          </div>

          <PcaVarianceChart height={280} />

          <div className="mt-3 pt-2.5 border-t border-hairline/60 text-[11px] text-text-subtle flex items-center justify-between">
            <span>Retaining ≥95% variance with minimal orthogonal dimensions</span>
            <span className="font-mono text-accent-emerald">PC1–PC7: 95.967%</span>
          </div>
        </div>
      </div>

      {/* Scientific Qualification Footer */}
      <div className="mt-4 pt-3 border-t border-hairline/60 flex items-center gap-2 text-xs text-text-subtle">
        <ShieldCheck className="w-4 h-4 text-accent-emerald flex-shrink-0" />
        <span>
          <strong>Scientific Principle:</strong> Explained variance quantifies mathematical preservation of feature dispersion. It does not measure prediction accuracy, causal customer motivation, or demographic intent.
        </span>
      </div>
    </SurfaceCard>
  );
};
