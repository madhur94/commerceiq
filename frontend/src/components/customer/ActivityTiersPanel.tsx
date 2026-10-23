import React, { useState } from 'react';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { UserActivityDistributionChart } from '@/components/charts';
import { userActivityDistribution } from '@/data';
import { formatInteger, formatPercent } from '@/utils/formatters';
import { Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ActivityTiersPanel: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('1–5 events');

  const currentTier = userActivityDistribution.find(
    (t) => t.activity_group_raw === selectedTier
  ) ?? userActivityDistribution[0];

  // Cumulative percentage calculation
  let cumulativeCount = 0;
  for (const t of userActivityDistribution) {
    cumulativeCount += t.user_count;
    if (t.activity_group_raw === selectedTier) break;
  }
  const cumulativePercent = (cumulativeCount / 3021435) * 100;

  const tierContexts: Record<string, { role: string; notes: string }> = {
    '1–5 events': {
      role: 'Single-Visit & Casual Browsers',
      notes: 'Represents the vast majority of all registered users (55.23%). Typically involves a single session exploring 1 to 3 items with sporadic cart additions.',
    },
    '6–10 events': {
      role: 'Curious Explorers',
      notes: 'Users exploring multiple categories or returning for a second browsing session. Nearly 70.06% of platform users register 10 or fewer events.',
    },
    '11–20 events': {
      role: 'Engaged Consideration',
      notes: 'Transition tier exhibiting active cart additions, repeat search queries, and high category traversal.',
    },
    '21–50 events': {
      role: 'High-Velocity Prospects',
      notes: 'Active shoppers with multiple multi-product sessions, frequently comparing competing brands.',
    },
    'More than 50 events': {
      role: 'Power Cohort (Commercial Core)',
      notes: 'Top 5.88% of users generating heavy session counts, repeat orders, and broad catalog interactions. Forms the numerical foundation of Cluster 0.',
    },
  };

  const context = tierContexts[selectedTier] ?? tierContexts['1–5 events'];

  return (
    <SurfaceCard variant="default" className="p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brass">
            Section D · Engagement Frequency Spectrum
          </span>
          <SectionHeading
            title="Customer Activity Frequency Distribution"
            subtitle="Categorization of 3,021,435 users across 5 verified activity frequency brackets."
            className="mb-0 mt-1"
          />
        </div>
        <div className="text-xs font-mono text-text-subtle self-start sm:self-auto bg-surface-subtle px-3 py-1.5 rounded-lg border border-hairline">
          Total Users: <span className="text-text-primary font-bold">3,021,435</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Cols: Interactive Chart */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-surface-subtle/50 border border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-text-muted">
              Population Count by Activity Tier
            </span>
            <span className="text-[10px] font-mono text-brass">
              Click bar to inspect tier
            </span>
          </div>

          <UserActivityDistributionChart
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
            height={260}
          />

          <div className="text-[11px] text-text-subtle border-t border-hairline/60 pt-2.5 mt-2 flex items-center justify-between font-mono">
            <span>55.2% have 1–5 events</span>
            <span className="text-brass">Source: user_activity_distribution.csv</span>
          </div>
        </div>

        {/* Right 5 Cols: Selected Tier Focus Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-surface-subtle border border-hairline">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brass uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brass" />
                <span>Tier Analysis</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass/20 text-brass border border-brass/40 font-bold">
                {currentTier.activity_group_display}
              </span>
            </div>

            <h4 className="text-base font-bold text-text-primary mb-1">
              {context.role}
            </h4>

            <p className="text-xs text-text-muted leading-relaxed mb-4">
              {context.notes}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-hairline/60 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60">
                <span className="text-[10px] text-text-subtle font-sans block">User Count</span>
                <span className="text-sm font-bold text-text-primary">{formatInteger(currentTier.user_count)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60">
                <span className="text-[10px] text-text-subtle font-sans block">Tier Share</span>
                <span className="text-sm font-bold text-brass">{formatPercent(currentTier.percentage_of_users)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface/60 border border-hairline/60 col-span-2">
                <span className="text-[10px] text-text-subtle font-sans block">Cumulative Share</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-accent-emerald">{formatPercent(cumulativePercent)}</span>
                  <span className="text-[10px] text-text-subtle font-sans">of all analyzed users</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {userActivityDistribution.map((t) => (
              <button
                key={t.activity_group_raw}
                onClick={() => setSelectedTier(t.activity_group_raw)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all',
                  selectedTier === t.activity_group_raw
                    ? 'bg-brass/20 text-brass border border-brass/50 font-bold'
                    : 'bg-surface-subtle text-text-muted hover:text-text-primary border border-hairline'
                )}
              >
                {t.activity_group_display}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
};
