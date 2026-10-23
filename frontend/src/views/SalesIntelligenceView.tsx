import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { PageTransition } from '@/components/common/PageTransition';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { SectionHeading } from '@/components/common/SectionHeading';
import { NoticeBanner } from '@/components/common/NoticeBanner';
import { KpiCard } from '@/components/common/KpiCard';
import {
  DailyRevenueAreaChart,
  HourlyDecouplingChart,
  WeekdayChart,
  PriceBracketChart,
  BrandParetoChart,
  CategoryRevenueChart,
} from '@/components/charts';
import {
  dailyPurchases,
  hourlyDynamics,
  weekdaySummary,
  categoryRevenue,
  brandRevenueTop50,
  priceDistribution,
  verifiedMetrics,
} from '@/data';
import {
  formatInteger,
  formatMonetaryValue,
  formatMonetaryUnits,
  formatPercent,
  formatHourUTC,
} from '@/utils/formatters';
import {
  Clock,
  DollarSign,
  Award,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Compass,
} from 'lucide-react';

export const SalesIntelligenceView: React.FC = () => {
  const navigate = useNavigate();

  // Connected Exploration State
  const [selectedDate, setSelectedDate] = useState<string | null>('2019-10-16'); // Default to peak day
  const [selectedHour, setSelectedHour] = useState<number | null>(14); // Default to peak revenue hour
  const [selectedCategory, setSelectedCategory] = useState<string | null>('electronics'); // Default to leading category
  const [selectedBrand, setSelectedBrand] = useState<string | null>('apple'); // Default to #1 brand
  const [selectedBracket, setSelectedBracket] = useState<string | null>('500 - 1000'); // Default to highest revenue bracket
  const [selectedWeekday, setSelectedWeekday] = useState<string | null>('Wednesday'); // Default to peak day of week

  // Collapsible table states
  const [showDailyTable, setShowDailyTable] = useState(false);

  // Active connected filter entity calculation
  const hasActiveFilter = Boolean(selectedDate || selectedBrand || selectedCategory || selectedBracket);

  const resetAllFilters = () => {
    setSelectedDate(null);
    setSelectedHour(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedBracket(null);
    setSelectedWeekday(null);
  };

  // 1. Selected Day Metrics
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    return dailyPurchases.find((d) => d.event_date === selectedDate) ?? null;
  }, [selectedDate]);

  // Daily platform averages across the 31 full days
  const dailyMeanRevenue = 7417202.16;
  const dailyMeanOrders = 23960;

  // 2. Selected Hour Metrics
  const selectedHourData = useMemo(() => {
    if (selectedHour === null) return null;
    return hourlyDynamics.find((h) => h.event_hour === selectedHour) ?? null;
  }, [selectedHour]);

  // 3. Selected Category Metrics
  const selectedCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return categoryRevenue.find((c) => c.main_category.toLowerCase() === selectedCategory.toLowerCase()) ?? null;
  }, [selectedCategory]);

  // 4. Selected Brand Metrics
  const selectedBrandData = useMemo(() => {
    if (!selectedBrand) return null;
    return brandRevenueTop50.find((b) => b.brand.toLowerCase() === selectedBrand.toLowerCase()) ?? null;
  }, [selectedBrand]);

  // 5. Selected Price Bracket Metrics
  const selectedBracketData = useMemo(() => {
    if (!selectedBracket) return null;
    return priceDistribution.find((p) => p.price_range_display.toLowerCase() === selectedBracket.toLowerCase()) ?? null;
  }, [selectedBracket]);

  // 6. Selected Weekday Metrics
  const selectedWeekdayData = useMemo(() => {
    if (!selectedWeekday) return null;
    return weekdaySummary.find((w) => w.weekday.toLowerCase() === selectedWeekday.toLowerCase()) ?? null;
  }, [selectedWeekday]);

  return (
    <PageTransition>
      <PageHeader
        title="Sales Intelligence & Connected Exploration"
        category="Commercial Performance"
        description="Comprehensive analysis of recorded purchase-event value, 32-day daily revenue trajectories, hourly temporal decoupling, category hierarchy, brand concentration, and price spectrum."
      />

      {/* Analytical Methodology Disclosure */}
      <NoticeBanner
        type="info"
        title="Analytical Semantics & Aggregate Independence"
        message="All analytical summaries represent historical, precomputed marginal aggregations across October 2019 logs. Entity selections highlight verified dimensions without cross-table fabrication."
        expandableDetails="Cross-dimensional combinations (e.g. brand-by-hour or category-by-date) do not exist in the source telemetry and are not fabricated. Clicking entities highlights verified dimensions and provides direct drill-down links to the primary Data Explorer with preserved query context."
        className="mb-8"
      />

      {/* SECTION A: MACRO TELEMETRY & SALES OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-4 mb-8">
        <KpiCard
          label="Recorded Value"
          value={formatMonetaryUnits(verifiedMetrics.purchase_revenue, 'compact')}
          footnote="Gross recorded purchase-event value"
          contextPill="Oct 01 – Nov 01"
          contextVariant="neutral"
          icon={DollarSign}
        />
        <KpiCard
          label="Purchase Orders"
          value={formatInteger(verifiedMetrics.purchase_events)}
          footnote="Total transactions across 32 days"
          contextPill="Transactions"
          contextVariant="cyan"
          icon={ShoppingBag}
        />
        <KpiCard
          label="Platform AOV"
          value={formatMonetaryValue(verifiedMetrics.purchase_revenue / verifiedMetrics.purchase_events, true)}
          footnote="Mean ticket per recorded purchase"
          contextPill="Mean Ticket"
          contextVariant="emerald"
          icon={TrendingUp}
        />
        <KpiCard
          label="Top 2 Concentration"
          value="68.54%"
          footnote="Apple + Samsung (157.60M units)"
          contextPill="Duopoly Index"
          contextVariant="violet"
          icon={Award}
        />
        <KpiCard
          label="Peak Velocity Hour"
          value="14:00 UTC"
          footnote="17.53M units (7.62% of revenue) · 7h separation from 21:00 activity peak"
          contextPill="7h Peak Delta"
          contextVariant="amber"
          icon={Clock}
        />
      </div>

      {/* CONNECTED EXPLORATION BAR (Shows when an entity is focused) */}
      {hasActiveFilter && (
        <div className="mb-8 p-4 rounded-xl bg-surface-elevated/90 border border-brass/40 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brass/15 text-brass border border-brass/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
                  Connected Exploration Focus:
                </span>
                <span className="text-xs font-mono font-bold text-brass">
                  {selectedDate && `Day: ${selectedDate}`}
                  {selectedBrand && ` · Brand: ${selectedBrand}`}
                  {selectedCategory && ` · Category: ${selectedCategory}`}
                  {selectedBracket && ` · Price: ${selectedBracket}`}
                </span>
              </div>
              <p className="text-xs text-text-subtle mt-0.5">
                Interact with chart data points to shift focus. Drill down directly into the Data Explorer catalog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {selectedBrand && (
              <button
                type="button"
                onClick={() => navigate(`/data-explorer?brand=${encodeURIComponent(selectedBrand)}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brass text-brass-dark hover:bg-brass-hover border border-brass text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Explore {selectedBrand} in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedCategory && !selectedBrand && (
              <button
                type="button"
                onClick={() => navigate(`/data-explorer?tab=categories&category=${encodeURIComponent(selectedCategory)}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brass text-brass-dark hover:bg-brass-hover border border-brass text-xs font-semibold transition-colors shadow-sm"
              >
                <span>Explore {selectedCategory} in Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-elevated text-text-muted hover:text-text-primary border border-hairline text-xs transition-colors"
              title="Reset selection filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION B: DAILY REVENUE TRAJECTORY EXPLORATION */}
      <SurfaceCard variant="default" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <SectionHeading
            title="Daily Purchase Revenue & Order Trajectory"
            subtitle="Click any date or pan the zoom slider below to inspect daily velocity across October 1 to November 1, 2019."
            className="mb-0"
          />
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-brass/20 text-brass border border-brass/30">
              32 Days Captured
            </span>
          </div>
        </div>

        {/* Selected Day Focus Panel */}
        {selectedDayData && (
          <div className="mb-4 p-4 rounded-xl bg-surface-subtle border border-hairline/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Focused Date
              </span>
              <span className="text-base font-bold font-mono text-brass flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-brass" />
                {selectedDayData.event_date}
              </span>
              {selectedDayData.is_partial_day && (
                <span className="text-[10px] font-mono text-accent-amber block mt-0.5">
                  Partial UTC Capture
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Recorded Value
              </span>
              <span className="text-base font-bold font-mono text-text-primary mt-0.5 block">
                {formatMonetaryUnits(selectedDayData.total_revenue, 'full')}
              </span>
              <span className="text-[11px] text-text-subtle font-mono">
                {selectedDayData.total_revenue >= dailyMeanRevenue
                  ? `+${(((selectedDayData.total_revenue - dailyMeanRevenue) / dailyMeanRevenue) * 100).toFixed(1)}% vs daily mean`
                  : `${(((selectedDayData.total_revenue - dailyMeanRevenue) / dailyMeanRevenue) * 100).toFixed(1)}% vs daily mean`}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Purchase Orders
              </span>
              <span className="text-base font-bold font-mono text-brass mt-0.5 block">
                {formatInteger(selectedDayData.purchase_events)} orders
              </span>
              <span className="text-[11px] text-text-subtle font-mono">
                {selectedDayData.purchase_events >= dailyMeanOrders
                  ? `+${(((selectedDayData.purchase_events - dailyMeanOrders) / dailyMeanOrders) * 100).toFixed(1)}% vs daily orders`
                  : `${(((selectedDayData.purchase_events - dailyMeanOrders) / dailyMeanOrders) * 100).toFixed(1)}% vs daily orders`}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Daily Mean AOV
              </span>
              <span className="text-base font-bold font-mono text-accent-emerald mt-0.5 block">
                {formatMonetaryValue(
                  selectedDayData.purchase_events > 0
                    ? selectedDayData.total_revenue / selectedDayData.purchase_events
                    : 0,
                  true
                )}
              </span>
              <span className="text-[11px] text-text-subtle font-mono">
                Oct 16 Peak: 9.81M units
              </span>
            </div>
          </div>
        )}

        {/* Interactive ECharts Daily Area Chart */}
        <DailyRevenueAreaChart
          height={340}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
          enableDataZoom={true}
        />

        {/* Collapsible Accessible Data Summary Table */}
        <div className="mt-4 pt-3 border-t border-hairline/60">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowDailyTable((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brass hover:text-brass-hover transition-colors"
            >
              <span>{showDailyTable ? 'Hide Complete Daily Table' : 'Show Complete 32-Day Table Breakdown'}</span>
              {showDailyTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs text-text-subtle font-mono">Source: daily_purchase_summary.csv</span>
          </div>

          {showDailyTable && (
            <div className="mt-4 overflow-x-auto rounded-lg border border-hairline max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-subtle text-text-muted uppercase sticky top-0 border-b border-hairline">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-right">Recorded Value</th>
                    <th className="py-2 px-3 text-right">Orders</th>
                    <th className="py-2 px-3 text-right">Mean Ticket</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/50">
                  {dailyPurchases.map((d) => (
                    <tr
                      key={d.event_date}
                      onClick={() => setSelectedDate(d.event_date)}
                      className={`cursor-pointer transition-colors ${
                        selectedDate === d.event_date
                          ? 'bg-brass/20 text-brass font-bold'
                          : 'hover:bg-surface-elevated/40 text-text-muted'
                      }`}
                    >
                      <td className="py-2 px-3 text-text-primary">{d.event_date}</td>
                      <td className="py-2 px-3 text-right text-brass font-bold">
                        {formatMonetaryUnits(d.total_revenue, 'full')}
                      </td>
                      <td className="py-2 px-3 text-right">{formatInteger(d.purchase_events)}</td>
                      <td className="py-2 px-3 text-right text-accent-emerald">
                        {(d.total_revenue / d.purchase_events).toFixed(2)} units
                      </td>
                      <td className="py-2 px-3 text-center">
                        {d.is_partial_day ? (
                          <span className="text-[10px] text-accent-amber font-sans px-1.5 py-0.5 rounded bg-accent-amber/10 border border-accent-amber/20">
                            Partial Day
                          </span>
                        ) : d.event_date === '2019-10-16' ? (
                          <span className="text-[10px] text-brass font-sans px-1.5 py-0.5 rounded bg-brass/20 border border-brass/30">
                            Peak Day
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-subtle font-sans">Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SurfaceCard>

      {/* SECTION C: THE TEMPORAL DECOUPLING PHENOMENON */}
      <SurfaceCard variant="default" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <SectionHeading
            title="The Temporal Decoupling Phenomenon"
            subtitle="Comparing hourly event activity (views + carts + purchases) against recorded purchase-event value across 24 UTC hours."
            className="mb-0"
          />
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-brass/15 text-brass border border-brass/30 self-start sm:self-auto flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-brass" />
            <span>7-Hour Peak Lag</span>
          </span>
        </div>

        {/* Peak Bins Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div
            onClick={() => setSelectedHour(21)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedHour === 21
                ? 'bg-brass/15 border-brass shadow-lg'
                : 'bg-surface-subtle border-hairline hover:border-brass/40'
            } flex items-start gap-3`}
          >
            <Clock className="w-5 h-5 text-brass flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block">
                  Peak Browsing Activity Hour
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brass/20 text-brass border border-brass/30">
                  Macro Peak
                </span>
              </div>
              <span className="text-lg font-bold font-mono text-text-primary block mt-0.5">
                {formatHourUTC(21)}
              </span>
              <span className="text-xs text-text-subtle block mt-0.5">
                Recorded volume: <strong>3,055,061 events</strong> (7.21% of all activity)
              </span>
              <span className="text-[11px] text-text-subtle font-mono block mt-1 pt-1 border-t border-hairline/60">
                Revenue generated: 13.91M units (4,554 units / 1,000 events)
              </span>
            </div>
          </div>

          <div
            onClick={() => setSelectedHour(14)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedHour === 14
                ? 'bg-brass/15 border-brass shadow-lg'
                : 'bg-surface-subtle border-hairline hover:border-brass/40'
            } flex items-start gap-3`}
          >
            <DollarSign className="w-5 h-5 text-brass flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block">
                  Peak Purchase Revenue Hour
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brass/20 text-brass border border-brass/30">
                  Monetary Peak
                </span>
              </div>
              <span className="text-lg font-bold font-mono text-text-primary block mt-0.5">
                {formatHourUTC(14)}
              </span>
              <span className="text-xs text-text-subtle block mt-0.5">
                Recorded value: <strong>17,531,268.91 monetary units</strong> (7.62% of gross revenue)
              </span>
              <span className="text-[11px] text-text-subtle font-mono block mt-1 pt-1 border-t border-hairline/60">
                Event volume: 2.50M events (7,006 units / 1,000 events)
              </span>
            </div>
          </div>
        </div>

        {/* Selected Hour Details Readout */}
        {selectedHourData && (
          <div className="mb-4 p-3 rounded-lg bg-surface-subtle border border-hairline flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Focused Hour:</span>
              <strong className="text-brass">{formatHourUTC(selectedHourData.event_hour)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Event Activity:</span>
              <strong className="text-text-primary">{formatInteger(selectedHourData.event_count)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Revenue:</span>
              <strong className="text-brass">{formatMonetaryUnits(selectedHourData.total_revenue, 'compact')}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">Monetization Velocity:</span>
              <strong className="text-accent-emerald">
                {((selectedHourData.total_revenue / selectedHourData.event_count) * 1000).toFixed(1)} units / 1k events
              </strong>
            </div>
          </div>
        )}

        {/* Interactive Dual-Axis ECharts Component */}
        <HourlyDecouplingChart
          height={340}
          selectedHour={selectedHour}
          onSelectHour={(hour) => setSelectedHour(hour)}
        />

        <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Marketing Takeaway: Promotional bids and paid acquisition should align with transactional velocity (14:00 UTC) rather than raw browsing traffic (21:00 UTC).
          </span>
          <span className="font-mono text-brass">Source: hourly_purchase_dynamics.csv</span>
        </div>
      </SurfaceCard>

      {/* SECTION D & E: CATEGORY HIERARCHY & BRAND PARETO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Module 1: Category Hierarchy & Share */}
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Category Hierarchy & Dominance"
                subtitle="Electronics generates 76.74% of revenue, followed by unclassified items (9.97%)."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass/15 text-brass border border-brass/30">
                14 Sectors
              </span>
            </div>

            {/* Selected Category Inspector */}
            {selectedCategoryData && (
              <div className="my-3 p-3 rounded-xl bg-surface-subtle border border-hairline flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                    Focused Category
                  </span>
                  <span className="text-sm font-bold capitalize text-brass block">
                    {selectedCategoryData.main_category}
                  </span>
                  <span className="text-xs text-text-subtle font-mono mt-0.5 block">
                    {formatMonetaryUnits(selectedCategoryData.total_revenue, 'compact')} · {formatPercent(selectedCategoryData.revenue_share_percentage)} platform share
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/data-explorer?tab=categories&category=${encodeURIComponent(selectedCategoryData.main_category)}`
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brass text-brass-dark hover:bg-brass-hover border border-brass text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>Catalog Explorer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="mt-2">
              <CategoryRevenueChart
                height={280}
                limit={8}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex items-center justify-between">
            <span>Unknown category (22.92M units) preserved without fabrication.</span>
            <span className="font-mono text-brass">Source: category_revenue.csv</span>
          </div>
        </SurfaceCard>

        {/* Module 2: Brand Pareto Distribution & Concentration */}
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Brand Pareto Concentration"
                subtitle="Apple (36.72%) and Samsung (31.82%) control 68.54% of gross recorded value."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass/15 text-brass border border-brass/30 flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Top 5 = 78.39%</span>
              </span>
            </div>

            {/* Selected Brand Inspector */}
            {selectedBrandData && (
              <div className="my-3 p-3 rounded-xl bg-surface-subtle border border-hairline flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                    Focused Brand
                  </span>
                  <span className="text-sm font-bold capitalize text-brass block">
                    {selectedBrandData.brand} (#{selectedBrandData.rank})
                  </span>
                  <span className="text-xs text-text-subtle font-mono mt-0.5 block">
                    {formatMonetaryUnits(selectedBrandData.total_revenue, 'compact')} · {formatInteger(selectedBrandData.purchase_events)} orders · {formatPercent(selectedBrandData.revenue_share_percentage)} share
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/data-explorer?brand=${encodeURIComponent(selectedBrandData.brand)}`)
                  }
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brass text-brass-dark hover:bg-brass-hover border border-brass text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>Filter Brand</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="mt-2">
              <BrandParetoChart
                height={280}
                limit={12}
                selectedBrand={selectedBrand}
                onSelectBrand={(b) => setSelectedBrand(b)}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex items-center justify-between">
            <span>Extreme concentration: 1,980 other brands share remaining 21.6%.</span>
            <span className="font-mono text-brass">Source: brand_revenue_top50.csv</span>
          </div>
        </SurfaceCard>
      </div>

      {/* SECTION F & G: PRICE BRACKETS & WEEKDAY RHYTHMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Module 1: Price Bracket Spectrum */}
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Price Bracket Spectrum & Ticket Asymmetry"
                subtitle="Comparing order volume against recorded revenue across 6 price tiers."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass/15 text-brass border border-brass/30">
                6 Tiers
              </span>
            </div>

            {/* Selected Bracket Inspector */}
            {selectedBracketData && (
              <div className="my-3 p-3 rounded-xl bg-surface-subtle border border-hairline flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                    Focused Price Tier
                  </span>
                  <span className="text-sm font-bold text-brass block">
                    {selectedBracketData.price_range_display} monetary units
                  </span>
                  <span className="text-xs text-text-subtle font-mono mt-0.5 block">
                    {formatMonetaryUnits(selectedBracketData.total_revenue, 'compact')} revenue ({formatPercent((selectedBracketData.total_revenue / verifiedMetrics.purchase_revenue) * 100)}) · {formatInteger(selectedBracketData.purchase_events)} orders
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const tierParam =
                      selectedBracketData.price_range_display.includes('1000') || selectedBracketData.price_range_display.includes('500')
                        ? 'tier1'
                        : selectedBracketData.price_range_display.includes('200')
                        ? 'tier2'
                        : 'all';
                    navigate(`/data-explorer?tier=${tierParam}`);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brass text-brass-dark hover:bg-brass-hover border border-brass text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>Inspect in Catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="mt-2">
              <PriceBracketChart
                height={280}
                selectedBracket={selectedBracket}
                onSelectBracket={(bracket) => setSelectedBracket(bracket)}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex items-center justify-between">
            <span>Tiers ≥ 500 units deliver 75.54% of revenue from only 11.26% of orders.</span>
            <span className="font-mono text-brass">Source: price_distribution.csv</span>
          </div>
        </SurfaceCard>

        {/* Module 2: Day-of-Week Purchasing Momentum */}
        <SurfaceCard variant="default" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionHeading
                title="Day-of-Week Purchasing Rhythm"
                subtitle="Wednesday drove peak order volume (119,197) and revenue (37.13M units)."
                className="mb-0"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass/15 text-brass border border-brass/30">
                Weekly Cycle
              </span>
            </div>

            {/* Selected Weekday Inspector */}
            {selectedWeekdayData && (
              <div className="my-3 p-3 rounded-xl bg-surface-subtle border border-hairline flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                    Focused Weekday
                  </span>
                  <span className="text-sm font-bold text-brass block">
                    {selectedWeekdayData.weekday}
                  </span>
                  <span className="text-xs text-text-subtle font-mono mt-0.5 block">
                    {formatMonetaryUnits(selectedWeekdayData.total_revenue, 'compact')} · {formatInteger(selectedWeekdayData.purchase_events)} orders · Mean ticket: {(selectedWeekdayData.total_revenue / selectedWeekdayData.purchase_events).toFixed(2)} units
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-text-muted block">Platform Share</span>
                  <span className="text-xs font-mono font-bold text-brass">
                    {formatPercent((selectedWeekdayData.total_revenue / verifiedMetrics.purchase_revenue) * 100)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-2">
              <WeekdayChart
                height={280}
                selectedWeekday={selectedWeekday}
                onSelectWeekday={(day) => setSelectedWeekday(day)}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 text-xs text-text-subtle flex items-center justify-between">
            <span>Peak on Wednesday (37.13M units) vs Saturday trough (29.07M units).</span>
            <span className="font-mono text-brass">Source: weekday_purchase_summary.csv</span>
          </div>
        </SurfaceCard>
      </div>

      {/* FOOTER NOTICE ON SCIENTIFIC RIGOR */}
      <NoticeBanner
        type="info"
        title="Scientific Data Provenance & Reproducibility"
        message="All aggregations derive directly from the clean PySpark pipeline executions documented in results/data_pipeline_summary.csv. Temporal bins adhere strictly to UTC. Currency is denominated in neutral monetary units. No synthetic conversions or customer models were introduced."
      />
    </PageTransition>
  );
};
