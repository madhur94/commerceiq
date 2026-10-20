import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 border-t border-hairline/60 text-xs text-text-subtle font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-text-muted">CommerceIQ</span> — Grounded in 42,349,874 verified events from October 2019.
        </div>
        <div className="text-[11px] text-text-subtle flex items-center gap-3">
          <span>Hadoop / HDFS / Spark Pipeline Artifacts</span>
          <span>•</span>
          <span>CommerceIQ Suite · Grounded Telemetry</span>
        </div>
      </div>
    </footer>
  );
};
