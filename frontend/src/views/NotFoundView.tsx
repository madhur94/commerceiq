import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  return (
    <PageTransition className="flex items-center justify-center min-h-[60vh]">
      <SurfaceCard variant="elevated" className="max-w-md w-full p-8 text-center border-brand-violet/30">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-violet/10 border border-brand-violet/30 flex items-center justify-center text-brand-cyan shadow-glow">
          <Compass className="w-7 h-7" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-violet-light font-bold">
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
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-violet-dark text-white text-sm font-medium hover:opacity-95 transition-opacity shadow-card"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Command Center</span>
        </Link>
      </SurfaceCard>
    </PageTransition>
  );
};
