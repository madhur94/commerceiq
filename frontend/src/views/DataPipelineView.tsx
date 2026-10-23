import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageTransition } from '@/components/common/PageTransition';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import {
  InteractivePipelineFlow,
  DataCleaningAuditPanel,
  DataLineageExplorer,
  ResearchVisualizationGallery,
  InteractiveChartStudio,
  ProjectMethodologyWalkthrough,
} from '@/components/pipeline';
import { verifiedMetrics } from '@/data';
import { formatInteger } from '@/utils/formatters';
import {
  Database,
  CheckCircle2,
  GitBranch,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const DataPipelineView: React.FC = () => {
  return (
    <PageTransition>
      {/* Page Header */}
      <PageHeader
        title="Big Data Pipeline Architecture & Research Provenance"
        category="Data Engineering & Methodology"
        description="End-to-end distributed data processing architecture: tracing 42,448,764 raw telemetry events through Apache Spark cleaning, Parquet storage, feature engineering, and complete artifact lineage."
      />

      {/* Executive Hero KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
        <div className="p-4 rounded-xl bg-surface-subtle border border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-subtle mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Raw Telemetry</span>
            <Database className="w-3.5 h-3.5 text-brass" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-text-primary">
              {formatInteger(verifiedMetrics.raw_records)}
            </div>
            <div className="text-[11px] text-text-subtle mt-0.5">~5.6 GB raw CSV</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle border border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-subtle mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Cleaned Parquet</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-accent-emerald">
              {formatInteger(verifiedMetrics.cleaned_records)}
            </div>
            <div className="text-[11px] text-text-subtle mt-0.5">67 Snappy partitions</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle border border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-subtle mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Row Retention</span>
            <ShieldCheck className="w-3.5 h-3.5 text-brass" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-text-primary">99.77%</div>
            <div className="text-[11px] text-accent-amber mt-0.5">98,890 net filtered (0.23%)</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle border border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-subtle mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Typed Artifacts</span>
            <GitBranch className="w-3.5 h-3.5 text-brass" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-brass">18 Files</div>
            <div className="text-[11px] text-text-subtle mt-0.5">Full schema registry</div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-surface-subtle border border-hairline flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-subtle mb-1">
            <span className="text-[11px] font-mono uppercase font-semibold">Research Visuals</span>
            <ImageIcon className="w-3.5 h-3.5 text-accent-amber" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-accent-amber">29 Plots</div>
            <div className="text-[11px] text-text-subtle mt-0.5">Phase 7 + Plotly studio</div>
          </div>
        </div>
      </div>

      {/* Quick Jump Navigation */}
      <SurfaceCard variant="subtle" className="mb-8 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-text-subtle font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>M04 Quick Navigation:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#pipeline-flow"
              className="px-2.5 py-1 rounded-lg bg-surface-subtle text-text-muted hover:text-brass hover:border-brass/40 border border-hairline text-[11px] transition-colors"
            >
              01. Architecture
            </a>
            <a
              href="#cleaning-audit"
              className="px-2.5 py-1 rounded-lg bg-surface-subtle text-text-muted hover:text-brass hover:border-brass/40 border border-hairline text-[11px] transition-colors"
            >
              02. Cleaning Audit
            </a>
            <a
              href="#lineage-explorer"
              className="px-2.5 py-1 rounded-lg bg-surface-subtle text-text-muted hover:text-brass hover:border-brass/40 border border-hairline text-[11px] transition-colors"
            >
              03. Lineage Registry
            </a>
            <a
              href="#research-gallery"
              className="px-2.5 py-1 rounded-lg bg-surface-subtle text-text-muted hover:text-brass hover:border-brass/40 border border-hairline text-[11px] transition-colors"
            >
              04. Research Gallery
            </a>
            <a
              href="#chart-studio"
              className="px-2.5 py-1 rounded-lg bg-surface-subtle text-text-muted hover:text-brass hover:border-brass/40 border border-hairline text-[11px] transition-colors"
            >
              05. Chart Studio
            </a>
            <a
              href="#methodology-walkthrough"
              className="px-2.5 py-1 rounded-lg bg-surface-subtle text-text-muted hover:text-brass hover:border-brass/40 border border-hairline text-[11px] transition-colors"
            >
              06. Methodology
            </a>
          </div>
        </div>
      </SurfaceCard>

      {/* SECTION A: Distributed Processing Pipeline Flow */}
      <InteractivePipelineFlow />

      {/* SECTION B: Data Cleaning Audit & Row Accounting */}
      <DataCleaningAuditPanel />

      {/* SECTION C: Data Lineage & Typed Artifact Registry */}
      <DataLineageExplorer />

      {/* SECTION D: Research Visualization Gallery */}
      <ResearchVisualizationGallery />

      {/* SECTION E: Interactive Chart Studio (Plotly Reimplementation) */}
      <InteractiveChartStudio />

      {/* SECTION F: 10-Stage Project Methodology Walkthrough */}
      <ProjectMethodologyWalkthrough />
    </PageTransition>
  );
};
