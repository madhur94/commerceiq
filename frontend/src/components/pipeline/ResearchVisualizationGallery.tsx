import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { visualizationGallery } from '@/data';
import type { GalleryVisualizationItem } from '@/types/pipeline';
import {
  Image as ImageIcon,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const ResearchVisualizationGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<GalleryVisualizationItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const categories = [
    'All',
    'Event Behavior',
    'Revenue & Temporal',
    'Product & Category',
    'Brand Concentration',
    'Customer Distributions',
    'Statistical Relationships',
  ];

  const filteredItems = useMemo(() => {
    return visualizationGallery.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.plot_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.analytical_interpretation.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Modal navigation
  const currentIndex = useMemo(() => {
    if (!activeItem) return -1;
    return filteredItems.findIndex((i) => i.id === activeItem.id);
  }, [activeItem, filteredItems]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setActiveItem(filteredItems[currentIndex - 1]);
      setZoomLevel(1);
    }
  }, [currentIndex, filteredItems]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredItems.length - 1) {
      setActiveItem(filteredItems[currentIndex + 1]);
      setZoomLevel(1);
    }
  }, [currentIndex, filteredItems]);

  const handleClose = useCallback(() => {
    setActiveItem(null);
    setZoomLevel(1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;
      if (e.key === 'Escape') handleClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, handleClose, handlePrev, handleNext]);

  return (
    <SurfaceCard variant="default" id="research-gallery" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-violet-light">
            Section D · Empirical Visualization Gallery
          </span>
          <SectionHeading
            title="Research Visualization Gallery (29 Plots)"
            subtitle="Browse all 14 Phase 7 figures, 11 supplementary analytical plots, and interactive chart artifacts."
            className="mb-0 mt-1"
          />
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-subtle text-text-muted border border-hairline flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-brand-violet-light" />
            <span>29 Research Visualizations</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? visualizationGallery.length
                : visualizationGallery.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0',
                  selectedCategory === cat
                    ? 'bg-brand-violet/25 text-white font-bold border border-brand-violet/40 shadow-sm'
                    : 'bg-surface-subtle text-text-muted hover:text-text-primary border border-hairline'
                )}
              >
                <span>{cat}</span>
                <span className="text-[10px] font-mono text-text-subtle">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-subtle border border-hairline text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-brand-violet/50"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => setActiveItem(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveItem(item);
              }
            }}
            className="group relative p-3.5 rounded-xl bg-surface-subtle/70 border border-hairline hover:border-brand-violet/40 hover:bg-surface-subtle transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-1 focus:ring-brand-cyan"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-brand-midnight/80 border border-hairline/60 mb-3 flex items-center justify-center">
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback visual if path needs static bundle resolution
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[10px] font-medium text-white flex items-center gap-1 bg-surface-subtle/80 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                    <Maximize2 className="w-3 h-3 text-brand-cyan" />
                    <span>Expand Figure</span>
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-violet/15 text-brand-violet-light border border-brand-violet/30">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-text-subtle">{item.plot_type}</span>
              </div>

              {/* Title */}
              <h4 className="text-xs font-bold text-text-primary group-hover:text-brand-cyan transition-colors line-clamp-1 mb-1">
                {item.title}
              </h4>

              {/* Preview Description */}
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                {item.analytical_interpretation}
              </p>
            </div>

            <div className="pt-2.5 mt-2 border-t border-hairline/60 flex items-center justify-between text-[10px] text-text-subtle font-mono">
              <span>{item.phase}</span>
              <span className="text-brand-cyan group-hover:underline">Inspect →</span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center text-text-muted border border-dashed border-hairline rounded-xl">
          <p className="text-xs">No visualizations match the selected filters.</p>
        </div>
      )}

      {/* Accessible Lightbox Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {activeItem && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="lightbox-title"
                onClick={(e) => {
                  if (e.target === e.currentTarget) handleClose();
                }}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-surface-elevated border border-brand-violet/30 shadow-2xl flex flex-col z-10"
                >
              {/* Modal Top Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-4 px-6 bg-surface/95 backdrop-blur-md border-b border-hairline">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet-light font-bold border border-brand-violet/30">
                    {activeItem.phase}
                  </span>
                  <h3 id="lightbox-title" className="text-sm sm:text-base font-bold text-text-primary truncate">
                    {activeItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-subtle border border-hairline">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                      className="p-1 rounded text-text-muted hover:text-white"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono px-1 text-text-subtle">
                      {(zoomLevel * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                      className="p-1 rounded text-text-muted hover:text-white"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg bg-surface-subtle text-text-muted hover:text-white border border-hairline hover:bg-white/10"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Large Image on Top, Metadata Below */}
              <div className="p-6 space-y-6">
                {/* Image Stage with Prev/Next Controls */}
                <div className="relative rounded-xl bg-brand-midnight/90 border border-hairline p-4 min-h-[340px] max-h-[520px] flex items-center justify-center overflow-hidden">
                  <img
                    src={activeItem.image_url}
                    alt={activeItem.title}
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="max-h-[480px] w-auto max-w-full object-contain transition-transform duration-150"
                  />

                  {/* Previous Button */}
                  {currentIndex > 0 && (
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/80 text-white hover:bg-brand-cyan hover:text-brand-midnight border border-hairline shadow-lg transition-colors"
                      aria-label="Previous visualization"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {/* Next Button */}
                  {currentIndex < filteredItems.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface/80 text-white hover:bg-brand-cyan hover:text-brand-midnight border border-hairline shadow-lg transition-colors"
                      aria-label="Next visualization"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Analytical Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Interpretation & Significance (8 cols) */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                        Analytical Interpretation
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed font-sans">
                        {activeItem.analytical_interpretation}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                        Research & Commercial Significance
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed font-sans">
                        {activeItem.research_significance}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Technical Provenance & Caveats (4 cols) */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-surface-subtle/80 border border-hairline text-xs font-mono space-y-2">
                      <div>
                        <span className="text-[10px] text-text-subtle font-sans block">Category:</span>
                        <span className="text-brand-cyan">{activeItem.category}</span>
                      </div>
                      <div className="pt-1.5 border-t border-hairline/60">
                        <span className="text-[10px] text-text-subtle font-sans block">Plot Type:</span>
                        <span className="text-text-primary">{activeItem.plot_type}</span>
                      </div>
                      <div className="pt-1.5 border-t border-hairline/60">
                        <span className="text-[10px] text-text-subtle font-sans block">Source File:</span>
                        <span className="text-text-subtle break-all">{activeItem.source_file}</span>
                      </div>
                    </div>

                    {activeItem.caveats && (
                      <div className="p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/25 text-xs text-amber-200/90 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-accent-amber text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Analytical Caveat</span>
                        </div>
                        <p>{activeItem.caveats}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </SurfaceCard>
  );
};
