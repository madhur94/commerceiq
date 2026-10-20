import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageTransition } from '@/components/common/PageTransition';
import { KpiCard } from '@/components/common/KpiCard';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { NoticeBanner } from '@/components/common/NoticeBanner';
import {
  CustomerSegmentExplorer,
  BehavioralComparisonLab,
  ActivityTiersPanel,
  PcaExplainerStepper,
  KMeansModelExplorer,
  OutlierCaseStudyPanel,
} from '@/components/customer';
import { Users, Award, Sparkles, TrendingUp } from 'lucide-react';
import { kmeansClusters } from '@/data';
import { formatInteger, formatMonetaryValue } from '@/utils/formatters';

export const CustomerIntelligenceView: React.FC = () => {
  const c0 = kmeansClusters.clusters[0];
  const c1 = kmeansClusters.clusters[1];
  const revenueMultiple = (c0.average_revenue / c1.average_revenue).toFixed(1);

  return (
    <PageTransition>
      {/* Page Header */}
      <PageHeader
        title="Customer Intelligence & Behavioral Segments"
        category="Behavioral Analytics · Machine Learning"
        description="Unsupervised behavioral segmentation, multidimensional cohort comparisons, engagement frequency spectrum, and mathematical ML explainability across 3,021,434 verified customers."
        badge={<StatusIndicator status="verified" label="K=2 Model Grounded" />}
      />

      {/* SECTION A: EXECUTIVE TELEMETRY HERO (4 Macro KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard
          label="Evaluated Customers"
          value={formatInteger(kmeansClusters.selected_model.analyzed_users)}
          unitLabel="users"
          icon={Users}
          contextPill="1 Outlier Isolated"
          contextVariant="cyan"
          footnote="Excludes 1 extreme browsing outlier account (7,429 views, 0 purchases)"
        />

        <KpiCard
          label="Selected Cluster Architecture"
          value="K = 2 Segments"
          icon={Award}
          contextPill="Silhouette 0.81115"
          contextVariant="emerald"
          footnote="Best evaluated configuration across 6 documented sensitivity trials (K=2 to K=7)"
        />

        <KpiCard
          label="Commercial Core Share"
          value="8.29%"
          icon={Sparkles}
          contextPill="250,388 Users"
          contextVariant="violet"
          footnote="High-intent cluster generating repeated multi-session orders"
        />

        <KpiCard
          label="Revenue Concentration"
          value={`${revenueMultiple}× Multiple`}
          icon={TrendingUp}
          contextPill="520.86 vs 35.91"
          contextVariant="emerald"
          footnote={`Mean spend: ${formatMonetaryValue(c0.average_revenue, true)} vs ${formatMonetaryValue(c1.average_revenue, true)}`}
        />
      </div>

      {/* SECTION B: INTERACTIVE CUSTOMER SEGMENT EXPLORER (Signature Feature) */}
      <CustomerSegmentExplorer />

      {/* SECTION C: BEHAVIORAL COMPARISON LAB */}
      <BehavioralComparisonLab />

      {/* SECTION D: CUSTOMER ACTIVITY FREQUENCY DISTRIBUTION */}
      <ActivityTiersPanel />

      {/* SECTION E: PCA DIMENSIONALITY REDUCTION & EDUCATIONAL STEPPER */}
      <PcaExplainerStepper />

      {/* SECTION F: K-MEANS MODEL ARCHITECTURE & SILHOUETTE SENSITIVITY */}
      <KMeansModelExplorer />

      {/* SECTION G: EXTREME OUTLIER INVESTIGATION */}
      <OutlierCaseStudyPanel />

      {/* SECTION H: METHODOLOGICAL TRANSPARENCY & RESEARCH BOUNDARIES */}
      <NoticeBanner
        type="info"
        title="Machine Learning & Behavioral Boundaries"
        message="Cluster labels reflect observed aggregate engagement patterns in the October 2019 event log. Unsupervised clustering groups users by geometric similarity in standardized PCA space without inferring demographic attributes or deterministic individual intent."
        expandableDetails="All metrics represent descriptive, unsupervised statistical groupings from historical PySpark logs. No predictive conversion models, speculative customer lifetime values, or synthetic customer feature profiles are simulated. The K=2 model represents an objective statistical summary of behavioral dispersion across the 3.02M analyzed user base."
        className="mb-8"
      />
    </PageTransition>
  );
};
