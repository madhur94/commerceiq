import React, { useState, useMemo } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { dataLineage } from '@/data';
import { Link } from 'react-router-dom';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const DataLineageExplorer: React.FC = () => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('ART-02');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  const selectedArtifact = useMemo(() => {
    return dataLineage.find((a) => a.artifact_id === selectedArtifactId) ?? dataLineage[1];
  }, [selectedArtifactId]);

  const phases = ['All', 'Phase 1', 'Phase 3 & 4', 'Phase 5 & 7', 'Phase 6', 'Phase 7'];

  const filteredArtifacts = useMemo(() => {
    return dataLineage.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.artifact_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_filename.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPhase = selectedPhase === 'All' || item.research_phase.includes(selectedPhase);

      return matchesSearch && matchesPhase;
    });
  }, [searchQuery, selectedPhase]);

  return (
    <SurfaceCard variant="default" id="lineage-explorer" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-cyan">
            Section C · Data Lineage & Provenance Explorer
          </span>
          <SectionHeading
            title="Artifact Lineage & Pipeline Provenance"
            subtitle="Trace the end-to-end lineage of 18 typed research artifacts from raw clickstream to application views."
            className="mb-0 mt-1"
          />
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-hairline self-start sm:self-auto">
          <button
            onClick={() => setViewLayout('grid')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              viewLayout === 'grid'
                ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/30 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Artifact Cards</span>
          </button>
          <button
            onClick={() => setViewLayout('table')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
              viewLayout === 'table'
                ? 'bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/30 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
            aria-label="Table view"
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>Registry Table</span>
          </button>
        </div>
      </div>

      {/* Search & Phase Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search artifacts by ID, name, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-subtle border border-hairline text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-brand-cyan/50"
          />
        </div>

        {/* Phase Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {phases.map((ph) => (
            <button
              key={ph}
              onClick={() => setSelectedPhase(ph)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex-shrink-0',
                selectedPhase === ph
                  ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-bold'
                  : 'bg-surface-subtle text-text-muted hover:text-text-primary border border-hairline'
              )}
            >
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Registry on Left/Top, Detailed Inspector on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Artifact Selector (7 cols in Grid, 12 in Table) */}
        <div className={viewLayout === 'grid' ? 'lg:col-span-7' : 'lg:col-span-12'}>
          {viewLayout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredArtifacts.map((art) => {
                const isSelected = art.artifact_id === selectedArtifactId;

                return (
                  <button
                    key={art.artifact_id}
                    onClick={() => setSelectedArtifactId(art.artifact_id)}
                    className={cn(
                      'p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group',
                      isSelected
                        ? 'bg-brand-cyan/15 border-brand-cyan/50 shadow-md shadow-brand-cyan/10 ring-1 ring-brand-cyan/40'
                        : 'bg-surface-subtle/70 border-hairline hover:border-white/20'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-hairline text-brand-cyan font-bold">
                          {art.artifact_id}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle text-text-subtle">
                          {art.format}
                        </span>
                      </div>
                      <h4
                        className={cn(
                          'text-xs font-bold mb-1 transition-colors line-clamp-1',
                          isSelected ? 'text-white' : 'text-text-primary group-hover:text-brand-cyan'
                        )}
                      >
                        {art.display_name}
                      </h4>
                      <p className="text-[11px] text-text-subtle font-mono line-clamp-1 mb-2">
                        {art.source_filename}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-hairline/60 flex items-center justify-between text-[10px] text-text-muted font-mono">
                      <span>{art.research_phase.split(':')[0]}</span>
                      <span className="text-text-primary font-bold">
                        {typeof art.record_count === 'number' ? `${art.record_count.toLocaleString()} rows` : art.record_count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-hairline max-h-[560px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-subtle text-text-muted text-[10px] uppercase font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 font-sans">Artifact ID</th>
                    <th className="py-2.5 px-3 font-sans">Name</th>
                    <th className="py-2.5 px-3 font-sans">Filename</th>
                    <th className="py-2.5 px-3 font-sans">Format</th>
                    <th className="py-2.5 px-3 text-right">Records</th>
                    <th className="py-2.5 px-3 text-right">Size</th>
                    <th className="py-2.5 px-3 font-sans">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-[11px]">
                  {filteredArtifacts.map((art) => (
                    <tr
                      key={art.artifact_id}
                      onClick={() => setSelectedArtifactId(art.artifact_id)}
                      className={cn(
                        'cursor-pointer transition-colors',
                        art.artifact_id === selectedArtifactId
                          ? 'bg-brand-cyan/20 text-white font-bold'
                          : 'hover:bg-surface-subtle/50 text-text-secondary'
                      )}
                    >
                      <td className="py-2 px-3 text-brand-cyan font-bold">{art.artifact_id}</td>
                      <td className="py-2 px-3 font-sans">{art.display_name}</td>
                      <td className="py-2 px-3 text-text-muted">{art.source_filename}</td>
                      <td className="py-2 px-3 text-text-subtle">{art.format}</td>
                      <td className="py-2 px-3 text-right text-text-primary">
                        {typeof art.record_count === 'number' ? art.record_count.toLocaleString() : art.record_count}
                      </td>
                      <td className="py-2 px-3 text-right text-text-muted">{art.byte_size}</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
                          {art.verification_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Detailed Artifact Inspector (5 cols in Grid, 12 in Table) */}
        <div className={viewLayout === 'grid' ? 'lg:col-span-5' : 'lg:col-span-12'}>
          <div className="p-5 rounded-xl bg-surface-subtle/80 border border-hairline space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan font-bold border border-brand-cyan/30">
                  {selectedArtifact.artifact_id}
                </span>
                <span className="text-xs font-mono text-accent-emerald flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{selectedArtifact.verification_status.toUpperCase()}</span>
                </span>
              </div>
              <span className="text-xs font-mono text-text-subtle">
                {selectedArtifact.research_phase}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-text-primary mb-1">
                {selectedArtifact.display_name}
              </h3>
              <div className="p-2.5 rounded-lg bg-surface border border-hairline/60 font-mono text-[11px] text-text-muted space-y-1">
                <div>
                  <span className="text-text-subtle block text-[10px] font-sans">Storage Path:</span>
                  <span className="text-brand-cyan break-all">{selectedArtifact.storage_path}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-hairline/40">
                  <span>Format: {selectedArtifact.format}</span>
                  <span>Footprint: {selectedArtifact.byte_size}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Transformation Description
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {selectedArtifact.transformation_description}
              </p>
            </div>

            {/* Dependency Mapping */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-surface/70 border border-hairline/60 text-xs">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                  Inputs (Upstream)
                </span>
                <ul className="space-y-1 font-mono text-[11px]">
                  {selectedArtifact.input_dependencies.map((dep, i) => (
                    <li key={i} className="text-text-secondary truncate" title={dep}>
                      ← {dep}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-surface/70 border border-hairline/60 text-xs">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                  Outputs (Downstream)
                </span>
                <ul className="space-y-1 font-mono text-[11px]">
                  {selectedArtifact.output_dependencies.map((dep, i) => (
                    <li key={i} className="text-brand-cyan truncate" title={dep}>
                      → {dep}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Caveats */}
            {selectedArtifact.known_caveats.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-1.5 text-accent-amber text-xs font-semibold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Research Caveats</span>
                </div>
                <ul className="space-y-1 text-xs text-text-muted">
                  {selectedArtifact.known_caveats.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-accent-amber">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Application Views */}
            <div className="pt-3 border-t border-hairline flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-text-subtle">Integrated In:</span>
              {selectedArtifact.related_views.map((v) => (
                <Link
                  key={v}
                  to={v}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 border border-brand-cyan/30 flex items-center gap-1 transition-colors"
                >
                  <span>{v}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
};
