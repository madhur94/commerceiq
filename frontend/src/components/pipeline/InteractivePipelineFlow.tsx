import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { pipelineStages } from '@/data';
import { formatInteger } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import {
  Database,
  HardDrive,
  Filter,
  FileCode2,
  BarChart3,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const stageIcons = [Database, HardDrive, Filter, FileCode2, BarChart3, Cpu];

export const InteractivePipelineFlow: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<number>(3); // Default to PySpark Cleaning stage

  const currentStage = pipelineStages.find((s) => s.stage_id === activeStageId) ?? pipelineStages[0];
  const CurrentIcon = stageIcons[currentStage.stage_id - 1] || Database;

  const handleKeyDown = (e: React.KeyboardEvent, stageId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveStageId(stageId);
    } else if (e.key === 'ArrowRight' && stageId < pipelineStages.length) {
      e.preventDefault();
      setActiveStageId(stageId + 1);
    } else if (e.key === 'ArrowLeft' && stageId > 1) {
      e.preventDefault();
      setActiveStageId(stageId - 1);
    }
  };

  return (
    <SurfaceCard variant="elevated" id="pipeline-flow" className="border-brand-cyan/20 p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-cyan">
              Section A · Distributed Architecture Flow
            </span>
          </div>
          <SectionHeading
            title="Interactive Distributed Data Pipeline"
            subtitle="Explore how 42.4M raw event logs flow through distributed HDFS storage, PySpark cleaning, and ML intelligence."
            className="mb-0 mt-1"
          />
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-subtle text-text-muted border border-hairline flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            <span>6 Processing Stages</span>
          </span>
        </div>
      </div>

      {/* Pipeline Stages Navigation (Responsive Flow) */}
      <div className="mb-8">
        {/* Desktop / Tablet Horizontal Stepper */}
        <div className="hidden md:grid grid-cols-6 gap-2 relative">
          {pipelineStages.map((stage, idx) => {
            const Icon = stageIcons[idx];
            const isSelected = stage.stage_id === activeStageId;
            const isPast = stage.stage_id < activeStageId;

            return (
              <button
                key={stage.stage_id}
                onClick={() => setActiveStageId(stage.stage_id)}
                onKeyDown={(e) => handleKeyDown(e, stage.stage_id)}
                aria-selected={isSelected}
                role="tab"
                tabIndex={0}
                className={cn(
                  'relative p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
                  isSelected
                    ? 'bg-brand-cyan/15 border-brand-cyan/50 shadow-lg shadow-brand-cyan/10'
                    : isPast
                    ? 'bg-surface-subtle/80 border-hairline/80 hover:border-brand-cyan/30'
                    : 'bg-surface/60 border-hairline hover:border-white/20'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        'text-[10px] font-mono px-1.5 py-0.5 rounded font-bold',
                        isSelected
                          ? 'bg-brand-cyan text-brand-midnight font-bold'
                          : 'bg-surface text-text-subtle border border-hairline/60'
                      )}
                    >
                      0{stage.stage_id}
                    </span>
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isSelected ? 'text-brand-cyan' : 'text-text-muted group-hover:text-text-primary'
                      )}
                    />
                  </div>
                  <h4
                    className={cn(
                      'text-xs font-bold tracking-tight mb-1 line-clamp-1',
                      isSelected ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'
                    )}
                  >
                    {stage.short_name}
                  </h4>
                  <p className="text-[10px] text-text-subtle font-mono line-clamp-1">
                    {formatInteger(stage.records_out)} rows
                  </p>
                </div>

                {/* Bottom Active Glow Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activePipelineGlow"
                    className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-gradient-to-r from-brand-cyan to-brand-violet rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Vertical / Scrollable Strip */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-2 scrollbar-thin">
          {pipelineStages.map((stage, idx) => {
            const Icon = stageIcons[idx];
            const isSelected = stage.stage_id === activeStageId;

            return (
              <button
                key={stage.stage_id}
                onClick={() => setActiveStageId(stage.stage_id)}
                className={cn(
                  'flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all',
                  isSelected
                    ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/40 font-bold'
                    : 'bg-surface-subtle text-text-muted border-hairline'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>0{stage.stage_id}. {stage.short_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.stage_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl bg-surface-subtle/70 border border-hairline p-5 sm:p-7"
        >
          {/* Top Bar: Stage Title, Phase, Technology */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-hairline">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan flex-shrink-0">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-mono font-bold text-brand-cyan uppercase tracking-wider">
                    Stage {currentStage.stage_id} · {currentStage.phase}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet-light border border-brand-violet/30">
                    {currentStage.technology}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  {currentStage.title}
                </h3>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface/80 border border-hairline/60">
                <span className="text-[10px] text-text-subtle font-sans block">Records In / Out</span>
                <span className="font-bold text-text-primary">
                  {formatInteger(currentStage.records_out)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/80 border border-hairline/60">
                <span className="text-[10px] text-text-subtle font-sans block">Storage Footprint</span>
                <span className="font-bold text-brand-cyan">{currentStage.byte_size}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/80 border border-hairline/60 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-text-subtle font-sans block">Distributed Splits</span>
                <span className="font-bold text-accent-emerald">{currentStage.partitions} Partitions</span>
              </div>
            </div>
          </div>

          {/* Stage Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            {/* Left Column: Summary & Transformations (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Architectural Summary
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {currentStage.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Key Processing Steps & Transformations
                </h4>
                <ul className="space-y-2">
                  {currentStage.key_transformations.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Source, Target, Limitations & Direct View Link (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-surface/60 border border-hairline/60 space-y-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-text-subtle font-sans block">Input Source:</span>
                  <span className="text-text-primary break-all">{currentStage.input_source}</span>
                </div>
                <div className="pt-2 border-t border-hairline/40">
                  <span className="text-[10px] text-text-subtle font-sans block">Output Target:</span>
                  <span className="text-brand-cyan break-all">{currentStage.output_target}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent-amber" />
                  <h4 className="text-xs font-semibold text-accent-amber uppercase tracking-wider">
                    Source Caveats & Boundaries
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {currentStage.limitations.map((lim, i) => (
                    <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                      <span className="text-accent-amber flex-shrink-0">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View Deep-Dive Link */}
              <div className="pt-2">
                <Link
                  to={currentStage.related_view}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-cyan hover:text-white transition-colors p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 hover:border-brand-cyan/40"
                >
                  <span>Explore output in {currentStage.related_view.replace('/', '').replace('-', ' ')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </SurfaceCard>
  );
};
