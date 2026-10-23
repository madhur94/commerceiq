import React, { useState } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { projectMethodology } from '@/data';
import type { MethodologyStep } from '@/types/pipeline';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectMethodologyWalkthrough: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1); // Default step 1 open

  const toggleStep = (stepNumber: number) => {
    setExpandedStep((prev) => (prev === stepNumber ? null : stepNumber));
  };

  const expandAll = () => setExpandedStep(-1);
  const collapseAll = () => setExpandedStep(null);

  return (
    <SurfaceCard variant="default" className="mb-8" id="methodology-walkthrough">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-hairline/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-brass/10 text-brass border border-brass/30">
              <BookOpen className="w-3 h-3" />
              Section F · 10-Stage Methodology
            </span>
            <span className="text-[11px] font-mono text-text-subtle">
              Research Lifecycle
            </span>
          </div>
          <SectionHeading
            title="Complete 10-Stage Project Methodology Walkthrough"
            subtitle="The complete end-to-end scientific methodology: from raw clickstream ingestion to explainable behavioral intelligence."
            className="mb-0"
          />
        </div>

        {/* Global Expand/Collapse Controls */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-hairline text-text-muted hover:text-text-primary transition-colors"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-hairline text-text-muted hover:text-text-primary transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Stepper Timeline & Detail Cards */}
      <div className="space-y-3 mt-6">
        {projectMethodology.map((step: MethodologyStep) => {
          const isExpanded = expandedStep === -1 || expandedStep === step.step_number;

          return (
            <div
              key={step.step_number}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-forest-sidebar/70 border-brass/40 shadow-sm'
                  : 'bg-surface-subtle/50 border-hairline/60 hover:border-hairline hover:bg-surface-subtle'
              }`}
            >
              {/* Step Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleStep(step.step_number)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 transition-colors focus:outline-none focus:ring-1 focus:ring-brass/40 rounded-xl"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-brass text-forest-sidebar font-bold'
                        : 'bg-forest-surface text-text-subtle border border-hairline'
                    }`}
                  >
                    {String(step.step_number).padStart(2, '0')}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-brass uppercase tracking-wider font-semibold">
                        {step.phase_label}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-text-primary truncate">
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-text-subtle hidden sm:inline">
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-brass" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  )}
                </div>
              </button>

              {/* Collapsed Brief Preview */}
              {!isExpanded && (
                <div className="px-4 pb-3.5 -mt-1 text-xs text-text-muted truncate max-w-4xl pl-16">
                  {step.summary}
                </div>
              )}

              {/* Expanded Detailed Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-hairline/40 space-y-4 text-xs">
                  {/* Summary Callout */}
                  <div className="p-3.5 rounded-lg bg-surface-subtle border border-hairline text-text-secondary leading-relaxed">
                    {step.summary}
                  </div>

                  {/* Dual Column: Key Takeaways & Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Key Findings / Takeaways */}
                    <div className="p-4 rounded-xl bg-forest-surface/50 border border-hairline space-y-2.5">
                      <div className="flex items-center gap-2 font-semibold text-text-primary text-xs">
                        <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                        Key Analytical Takeaways
                      </div>
                      <ul className="space-y-2 text-text-muted text-[11px] leading-relaxed">
                        {step.key_points.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-brass mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Parameters / Architecture */}
                    <div className="p-4 rounded-xl bg-forest-surface/50 border border-hairline space-y-2.5">
                      <div className="flex items-center gap-2 font-semibold text-text-primary text-xs">
                        <Terminal className="w-4 h-4 text-brass shrink-0" />
                        Engineering & Execution Specifications
                      </div>
                      <ul className="space-y-2 text-text-muted text-[11px] leading-relaxed">
                        {step.technical_details.map((detail: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-brass mt-0.5 font-mono">›</span>
                            <span className="font-mono text-text-secondary">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Related Route Link */}
                  {step.related_route && (
                    <div className="flex items-center justify-between pt-2 border-t border-hairline/30 text-xs">
                      <span className="text-text-subtle">Explore related analytical visualizer:</span>
                      <Link
                        to={step.related_route}
                        className="inline-flex items-center gap-1.5 font-medium text-brass hover:underline text-xs"
                      >
                        Navigate to {step.related_route}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
};
