import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  return (
    <PageTransition className="flex items-center justify-center min-h-[60vh]">
      <SurfaceCard variant="elevated" className="max-w-md w-full p-8 text-center border-brass/30">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brass/10 border border-brass/30 flex items-center justify-center text-brass shadow-glow-brass">
          <Compass className="w-7 h-7" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-brass font-bold">
          404 — Routing Boundary
        </span>
        <h2 className="text-2xl font-bold text-text-primary mt-2 mb-2">
          Page Not Located
        </h2>
        <p className="text-sm text-text-muted mb-6 leading-relaxed">
          The requested analytical route does not exist in the CommerceIQ suite navigation index.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-brass hover:bg-brass-hover text-forest-sidebar text-sm font-bold transition-colors shadow-glow-brass"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Command Center</span>
        </Link>
      </SurfaceCard>
    </PageTransition>
  );
};
