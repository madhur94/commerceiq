import React, { useState } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { cleaningAudit } from '@/data';
import { formatInteger } from '@/utils/formatters';
import {
  ShieldCheck,
  Filter,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const DataCleaningAuditPanel: React.FC = () => {
  const [showDeduplicationDetails, setShowDeduplicationDetails] = useState<boolean>(false);

  const { summary, removals_breakdown, categorical_missingness, deduplication_audit, cleaning_pipeline_stages } =
    cleaningAudit;

  return (
    <SurfaceCard variant="default" id="cleaning-audit" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-emerald">
            Section B · Data Quality & Cleaning Audit
          </span>
          <SectionHeading
            title="Data Hygiene & Quality Transparency"
            subtitle="Transparent verification of 42.4M raw records down to 42.35M cleaned events (99.77% retention)."
            className="mb-0 mt-1"
          />
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>99.77% Retention Verified</span>
          </span>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline">
          <span className="text-xs text-text-subtle font-sans block mb-1">Raw Ingested Records</span>
          <span className="text-lg sm:text-xl font-bold font-mono text-text-primary">
            {formatInteger(summary.raw_records)}
          </span>
          <span className="text-[11px] text-text-muted font-mono block mt-1">100.0% Baseline Volume</span>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline">
          <span className="text-xs text-text-subtle font-sans block mb-1">Verified Cleaned Records</span>
          <span className="text-lg sm:text-xl font-bold font-mono text-accent-emerald">
            {formatInteger(summary.cleaned_records)}
          </span>
          <span className="text-[11px] text-accent-emerald font-mono block mt-1">
            {summary.retention_rate_percent}% Retained
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline">
          <span className="text-xs text-text-subtle font-sans block mb-1">Invalid Prices (≤ 0.00)</span>
          <span className="text-lg sm:text-xl font-bold font-mono text-accent-amber">
            {formatInteger(removals_breakdown[0].records_removed)}
          </span>
          <span className="text-[11px] text-accent-amber font-mono block mt-1">
            69.44% of All Removals
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-subtle/80 border border-hairline">
          <span className="text-xs text-text-subtle font-sans block mb-1">Unsegregated Remainder</span>
          <span className="text-lg sm:text-xl font-bold font-mono text-brass">
            {formatInteger(removals_breakdown[1].records_removed)}
          </span>
          <span className="text-[11px] text-brass font-mono block mt-1">
            30.56% of All Removals
          </span>
        </div>
      </div>

      {/* Visual Retention & Removal Bar Breakdown */}
      <div className="mb-8 p-5 rounded-xl bg-surface-subtle/50 border border-hairline">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="font-bold text-text-primary">Dataset Hygiene Composition</span>
          <span className="text-text-muted">Net Removals: {formatInteger(summary.net_removed_records)} (0.233%)</span>
        </div>

        {/* Multi-segment Visual Progress Bar */}
        <div className="h-4 w-full bg-surface rounded-full overflow-hidden flex border border-hairline">
          <div
            style={{ width: `${summary.retention_rate_percent}%` }}
            className="bg-accent-emerald/80 h-full transition-all"
            title={`Retained: ${formatInteger(summary.cleaned_records)}`}
          />
          <div
            style={{ width: '0.162%' }}
            className="bg-accent-amber h-full transition-all"
            title="Invalid Prices: 68,673"
          />
          <div
            style={{ width: '0.071%' }}
            className="bg-brass h-full transition-all"
            title="Unsegregated Remainder: 30,217"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald" />
            <span>Retained Events ({summary.retention_rate_percent}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
            <span>Invalid Price ≤ 0.00 (68,673 rows · 0.162%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brass" />
            <span>Unsegregated Multi-Condition Remainder (30,217 rows · 0.071%)</span>
          </div>
        </div>
      </div>

      {/* Two Column Deep Dives: Removals & Missingness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Removals Breakdown */}
        <div className="p-5 rounded-xl bg-surface-subtle/60 border border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Filter className="w-4 h-4 text-brass" />
              <span>Record Removal Breakdown (98,890 Rows)</span>
            </h4>
          </div>

          <div className="space-y-3">
            {removals_breakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-surface/70 border border-hairline/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-text-primary">{item.cause}</span>
                  <span className={idx === 0 ? 'text-accent-amber font-bold' : 'text-brass font-bold'}>
                    -{formatInteger(item.records_removed)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-subtle font-mono">
                  <span>{item.rule_type}</span>
                  <span>{item.share_of_removals_percent}% of total removals</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-sans pt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Unsegregated Remainder Disclosure Banner */}
          <div className="p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/25 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-accent-amber">Methodological Boundary:</strong> The 30,217 unsegregated rows reflect combined filtering in the upstream PySpark ETL scripts without individual logging tags. They are preserved as an audited residual difference and are <em>not</em> assumed to be confirmed duplicates.
            </div>
          </div>
        </div>

        {/* Right: Categorical Missingness & Deduplication */}
        <div className="p-5 rounded-xl bg-surface-subtle/60 border border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Tag className="w-4 h-4 text-brass" />
              <span>Categorical Missingness Disclosures</span>
            </h4>
          </div>

          <div className="space-y-3">
            {categorical_missingness.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-surface/70 border border-hairline/60 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-text-primary">{item.field}</span>
                  <span className="text-accent-amber font-bold">
                    {formatInteger(item.missing_count)} ({item.missing_percent}%)
                  </span>
                </div>
                <div className="text-[11px] text-brass font-mono">
                  {item.handling_strategy}
                </div>
                <p className="text-xs text-text-muted leading-relaxed font-sans pt-1">
                  {item.impact}
                </p>
              </div>
            ))}
          </div>

          {/* Deduplication Collapsible Card */}
          <div className="p-3.5 rounded-lg bg-surface/70 border border-hairline/60">
            <button
              onClick={() => setShowDeduplicationDetails(!showDeduplicationDetails)}
              className="w-full flex items-center justify-between text-xs font-bold text-text-primary hover:text-brass transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-accent-emerald" />
                <span>Deduplication Audit & dropDuplicates() Protocol</span>
              </div>
              {showDeduplicationDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDeduplicationDetails && (
              <div className="mt-3 pt-3 border-t border-hairline/60 text-xs text-text-secondary space-y-2 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-surface border border-hairline">
                    <span className="text-text-subtle block text-[10px]">Sample A (1% Random Sample):</span>
                    <span className="font-bold text-text-primary">
                      {formatInteger(deduplication_audit.random_1pct_sample_size || 424129)} events ·{' '}
                      <span className="text-accent-emerald">{deduplication_audit.random_1pct_duplicates_found || 0} duplicates (0.00%)</span>
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface border border-hairline">
                    <span className="text-text-subtle block text-[10px]">Sample B (1M Contiguous Block):</span>
                    <span className="font-bold text-text-primary">
                      {formatInteger(deduplication_audit.sample_audit_size)} events ·{' '}
                      <span className="text-accent-emerald">
                        {deduplication_audit.sample_duplicates_found} duplicates ({deduplication_audit.sample_duplicate_rate_percent}%)
                      </span>
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed">
                  <strong>Full Pipeline Action:</strong> {deduplication_audit.full_data_action}
                </p>
                <p className="text-[11px] text-text-subtle leading-relaxed">
                  {deduplication_audit.methodological_caveat}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cleaning Pipeline Steps Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
          <span>Sequential Cleaning Pipeline Execution Log</span>
        </h4>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4 font-sans">Step</th>
                <th className="py-2.5 px-4 font-sans">Operation</th>
                <th className="py-2.5 px-4 text-right">Input Records</th>
                <th className="py-2.5 px-4 text-right">Output Records</th>
                <th className="py-2.5 px-4 text-right">Net Delta</th>
                <th className="py-2.5 px-4 font-sans">Validation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-[11px]">
              {cleaning_pipeline_stages.map((st) => (
                <tr key={st.step} className="hover:bg-surface-subtle/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-brass">0{st.step}</td>
                  <td className="py-2.5 px-4 font-sans text-text-primary font-medium">{st.name}</td>
                  <td className="py-2.5 px-4 text-right text-text-muted">{formatInteger(st.input_count)}</td>
                  <td className="py-2.5 px-4 text-right text-text-primary font-bold">{formatInteger(st.output_count)}</td>
                  <td
                    className={cn(
                      'py-2.5 px-4 text-right font-bold',
                      st.delta < 0 ? 'text-accent-amber' : 'text-text-subtle'
                    )}
                  >
                    {st.delta === 0 ? '0' : formatInteger(st.delta)}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-text-muted text-[11px]">{st.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SurfaceCard>
  );
};
