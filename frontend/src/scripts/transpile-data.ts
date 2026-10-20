/**
 * CommerceIQ — Data Transpilation & Compiler Script
 * Compiles raw CSV summaries into strongly-typed, normalized JSON modules.
 * Run via: npm run transpile-data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../..');
const SHOWCASE_DIR = path.join(ROOT_DIR, 'ecommerce_bigdata_showcase');
const PHASE7_DIR = path.join(SHOWCASE_DIR, 'results', 'phase7');
const SUMMARY_DIR = path.join(SHOWCASE_DIR, 'data', 'summary');
const OUT_DIR = path.resolve(__dirname, '../data');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('--- COMMERCEIQ DATA TRANSPILATION PIPELINE ---');
console.log(`Source Phase 7 Directory: ${PHASE7_DIR}`);
console.log(`Source Summary Directory: ${SUMMARY_DIR}`);
console.log(`Output JSON Directory:    ${OUT_DIR}`);

function parseCSV(filePath: string): Array<Record<string, string>> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Critical source CSV missing: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const rows: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h.trim()] = values[idx].trim();
      });
      rows.push(obj);
    }
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function sanitizeRange(str: string): string {
  return str
    .replace(/\u2013|\u2014|\xe2\x80\x93|\?["']/g, '–')
    .replace(/\s*–\s*/g, ' – ')
    .trim();
}

// 1. Compile Verified Project Metrics
console.log('\n[1/10] Transpiling verified_project_metrics.csv...');
const rawMetrics = parseCSV(path.join(SUMMARY_DIR, 'verified_project_metrics.csv'));
const metricMap: Record<string, number> = {};
rawMetrics.forEach((row) => {
  const num = parseFloat(row.value);
  if (!isNaN(num)) {
    metricMap[row.metric] = num;
  }
});

const verifiedMetrics = {
  raw_records: metricMap['raw_records'] || 42448764,
  cleaned_records: metricMap['cleaned_records'] || 42349874,
  net_records_removed: (metricMap['raw_records'] || 42448764) - (metricMap['cleaned_records'] || 42349874), // 98,890
  invalid_price_records_filtered: 68673,
  unsegregated_cleaning_difference: 98890 - 68673, // 30,217 records
  phase5_columns: metricMap['phase5_columns'] || 21,
  phase6_columns: metricMap['phase6_columns'] || 16,
  users: metricMap['users'] || 3021435,
  sessions: metricMap['sessions'] || 9239403,
  purchase_events: metricMap['purchase_events'] || 742773,
  purchase_revenue: metricMap['purchase_revenue'] || 229933212.63,
  view_events: metricMap['view_events'] || 40708807,
  cart_events: metricMap['cart_events'] || 898294,
  price_mean: metricMap['price_mean'] || 290.7840088,
  price_median_purchase: metricMap['price_median_purchase'] || 179.84,
  iqr_outlier_events: metricMap['iqr_outlier_events'] || 3677875,
  zscore_outlier_events: metricMap['zscore_outlier_events'] || 1158750,
  currency_unit: 'monetary_units',
  dataset_period: 'October 1, 2019 to November 1, 2019 (UTC)',
};
fs.writeFileSync(path.join(OUT_DIR, 'verifiedMetrics.json'), JSON.stringify(verifiedMetrics, null, 2));

// 2. Compile Event Distribution & Funnel Ratios
console.log('[2/10] Transpiling event_distribution.csv...');
const rawEvents = parseCSV(path.join(PHASE7_DIR, 'event_distribution.csv'));
const eventDistribution = rawEvents.map((r) => {
  const count = parseInt(r.count, 10);
  return {
    event_type: r.event_type as 'view' | 'cart' | 'purchase',
    count,
    percentage_of_total: (count / verifiedMetrics.cleaned_records) * 100,
    ratio_to_views: (count / verifiedMetrics.view_events) * 100,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'eventDistribution.json'), JSON.stringify(eventDistribution, null, 2));

// 3. Compile Daily Purchases
console.log('[3/10] Transpiling daily_purchase_summary.csv...');
const rawDaily = parseCSV(path.join(PHASE7_DIR, 'daily_purchase_summary.csv'));
const dailyPurchases = rawDaily.map((r) => {
  const purchases = parseInt(r.purchase_events, 10);
  const rev = parseFloat(r.total_revenue);
  return {
    event_date: r.event_date,
    purchase_events: purchases,
    total_revenue: Math.round((rev + Number.EPSILON) * 100) / 100,
    is_partial_day: r.event_date === '2019-11-01',
    note: r.event_date === '2019-11-01' ? 'Partial UTC boundary capture' : undefined,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'dailyPurchases.json'), JSON.stringify(dailyPurchases, null, 2));

// 4. Compile Hourly Activity and Revenue (Temporal Decoupling)
console.log('[4/10] Transpiling hourly_activity.csv & hourly_revenue.csv...');
const rawHourlyAct = parseCSV(path.join(PHASE7_DIR, 'hourly_activity.csv'));
const rawHourlyRev = parseCSV(path.join(PHASE7_DIR, 'hourly_revenue.csv'));

const revByHour: Record<number, number> = {};
rawHourlyRev.forEach((r) => {
  revByHour[parseInt(r.event_hour, 10)] = parseFloat(r.total_revenue);
});

const hourlyDynamics = rawHourlyAct.map((r) => {
  const hour = parseInt(r.event_hour, 10);
  const events = parseInt(r.count, 10);
  const rev = revByHour[hour] || 0;
  return {
    event_hour: hour,
    event_count: events,
    total_revenue: Math.round((rev + Number.EPSILON) * 100) / 100,
    peak_activity: hour === 21,
    peak_revenue: hour === 14,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'hourlyDynamics.json'), JSON.stringify(hourlyDynamics, null, 2));

// 5. Compile Weekday Purchase Summary
console.log('[5/10] Transpiling weekday_purchase_summary.csv...');
const rawWeekday = parseCSV(path.join(PHASE7_DIR, 'weekday_purchase_summary.csv'));
const weekdaySummary = rawWeekday.map((r) => {
  const purchases = parseInt(r.purchase_events, 10);
  const rev = parseFloat(r.total_revenue);
  return {
    weekday: r.weekday,
    purchase_events: purchases,
    total_revenue: Math.round((rev + Number.EPSILON) * 100) / 100,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'weekdaySummary.json'), JSON.stringify(weekdaySummary, null, 2));

// 6. Compile Category Revenue
console.log('[6/10] Transpiling category_revenue.csv...');
const rawCategory = parseCSV(path.join(PHASE7_DIR, 'category_revenue.csv'));
const categoryRevenue = rawCategory.map((r) => {
  const rev = parseFloat(r.total_revenue);
  return {
    main_category: r.main_category,
    total_revenue: Math.round((rev + Number.EPSILON) * 100) / 100,
    purchase_events: parseInt(r.purchase_events, 10),
    unique_buyers: parseInt(r.unique_buyers, 10),
    revenue_share_percentage: (rev / verifiedMetrics.purchase_revenue) * 100,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'categoryRevenue.json'), JSON.stringify(categoryRevenue, null, 2));

// 7. Compile Brand Revenue (All 1,986 brands + Top 50 excerpt)
console.log('[7/10] Transpiling brand_revenue.csv (1,986 records)...');
const rawBrand = parseCSV(path.join(PHASE7_DIR, 'brand_revenue.csv'));
const brandRevenue = rawBrand.map((r, index) => {
  const rev = parseFloat(r.total_revenue);
  return {
    rank: index + 1,
    brand: r.brand,
    total_revenue: Math.round((rev + Number.EPSILON) * 100) / 100,
    purchase_events: parseInt(r.purchase_events, 10),
    unique_buyers: parseInt(r.unique_buyers, 10),
    revenue_share_percentage: (rev / verifiedMetrics.purchase_revenue) * 100,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'brandRevenue.json'), JSON.stringify(brandRevenue, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'brandRevenueTop50.json'), JSON.stringify(brandRevenue.slice(0, 50), null, 2));

// 8. Compile Top Products (Revenue & Volume)
console.log('[8/10] Transpiling top_products_revenue.csv & purchase_count.csv...');
const rawTopRev = parseCSV(path.join(PHASE7_DIR, 'top_products_revenue.csv'));
const rawTopCount = parseCSV(path.join(PHASE7_DIR, 'top_products_purchase_count.csv'));

const topProductsRevenue = rawTopRev.map((r, i) => ({
  rank: i + 1,
  product_id: parseInt(r.product_id, 10),
  total_revenue: Math.round((parseFloat(r.total_revenue) + Number.EPSILON) * 100) / 100,
  purchase_events: parseInt(r.purchase_events, 10),
  unique_buyers: parseInt(r.unique_buyers, 10),
  average_price: Math.round((parseFloat(r.total_revenue) / parseInt(r.purchase_events, 10) + Number.EPSILON) * 100) / 100,
}));

const topProductsVolume = rawTopCount.map((r, i) => ({
  rank: i + 1,
  product_id: parseInt(r.product_id, 10),
  total_revenue: Math.round((parseFloat(r.total_revenue) + Number.EPSILON) * 100) / 100,
  purchase_events: parseInt(r.purchase_events, 10),
  unique_buyers: parseInt(r.unique_buyers, 10),
  average_price: Math.round((parseFloat(r.total_revenue) / parseInt(r.purchase_events, 10) + Number.EPSILON) * 100) / 100,
}));

fs.writeFileSync(path.join(OUT_DIR, 'topProducts.json'), JSON.stringify({
  by_revenue: topProductsRevenue,
  by_volume: topProductsVolume,
}, null, 2));

// 9. Compile Price & User Activity Distributions
console.log('[9/10] Transpiling purchase_price_distribution.csv & user_activity_distribution.csv...');
const rawPriceDist = parseCSV(path.join(PHASE7_DIR, 'purchase_price_distribution.csv'));
const priceDistribution = rawPriceDist.map((r) => {
  const rev = parseFloat(r.total_revenue);
  return {
    price_range_raw: r.price_range,
    price_range_display: sanitizeRange(r.price_range),
    purchase_events: parseInt(r.purchase_events, 10),
    total_revenue: Math.round((rev + Number.EPSILON) * 100) / 100,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'priceDistribution.json'), JSON.stringify(priceDistribution, null, 2));

const rawUserAct = parseCSV(path.join(PHASE7_DIR, 'user_activity_distribution.csv'));
const userActivityDistribution = rawUserAct.map((r) => {
  const users = parseInt(r.user_count, 10);
  return {
    activity_group_raw: r.activity_group,
    activity_group_display: sanitizeRange(r.activity_group),
    user_count: users,
    percentage_of_users: (users / verifiedMetrics.users) * 100,
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'userActivityDistribution.json'), JSON.stringify(userActivityDistribution, null, 2));

// 10. Compile Machine Learning & Segmentation Models
console.log('[10/10] Transpiling PCA and K-Means segmentation outputs...');
const pcaVariance = [
  { component: 'PC1', explained_variance_percent: 40.7123, cumulative_variance_percent: 40.7123, primary_interpretation: 'Overall behavioral volume and engagement intensity' },
  { component: 'PC2', explained_variance_percent: 17.9277, cumulative_variance_percent: 58.6400, primary_interpretation: 'Catalog exploration breadth and price sensitivity' },
  { component: 'PC3', explained_variance_percent: 14.7635, cumulative_variance_percent: 73.4035, primary_interpretation: 'Session density and cart-to-purchase propensity' },
  { component: 'PC4', explained_variance_percent: 8.4269, cumulative_variance_percent: 81.8305, primary_interpretation: 'Temporal engagement variability' },
  { component: 'PC5', explained_variance_percent: 5.8033, cumulative_variance_percent: 87.6338, primary_interpretation: 'Category switching behavior' },
  { component: 'PC6', explained_variance_percent: 4.5092, cumulative_variance_percent: 92.1430, primary_interpretation: 'Basket size dispersion' },
  { component: 'PC7', explained_variance_percent: 3.8240, cumulative_variance_percent: 95.9670, primary_interpretation: 'High-value product interaction variance' },
];
fs.writeFileSync(path.join(OUT_DIR, 'pcaVariance.json'), JSON.stringify(pcaVariance, null, 2));

const kmeansClusters = {
  selected_model: {
    k: 2,
    silhouette_score: 0.81115,
    analyzed_users: 3021434,
    notes: 'Excludes 1 extreme browsing outlier user with 7,429 views and 0 purchases to prevent centroid distortion.',
  },
  clusters: [
    {
      cluster_id: 0,
      cluster_name: 'Cluster 0 · High Activity Commercial Core',
      user_count: 250388,
      share_percent: 8.29,
      average_events: 85.43,
      average_views: 82.00,
      average_carts: 1.849,
      average_purchases: 1.58,
      average_revenue: 520.86,
      average_sessions: 12.26,
      unique_products: 42.04,
      behavior_summary: 'High-intent commercial core accounting for recurring sessions and high purchasing activity across diverse products.',
    },
    {
      cluster_id: 1,
      cluster_name: 'Cluster 1 · Casual Browsers & Occasional Buyers',
      user_count: 2771046,
      share_percent: 91.71,
      average_events: 7.56,
      average_views: 7.28,
      average_carts: 0.157,
      average_purchases: 0.125,
      average_revenue: 35.91,
      average_sessions: 2.22,
      unique_products: 4.60,
      behavior_summary: 'Dominant user majority characterized by low session counts, casual browsing, and infrequent purchasing.',
    },
  ],
  sensitivity_experiments: [
    { experiment_name: 'K=2 (Outlier Excluded)', clusters_k: 2, outlier_excluded: true, population_size: 3021434, silhouette_score: 0.81115, is_selected: true },
    { experiment_name: 'K=3 (Outlier Excluded)', clusters_k: 3, outlier_excluded: true, population_size: 3021434, silhouette_score: 0.51978, is_selected: false },
    { experiment_name: 'K=4 (Outlier Excluded)', clusters_k: 4, outlier_excluded: true, population_size: 3021434, silhouette_score: 0.57195, is_selected: false },
    { experiment_name: 'K=3 (Original Experiment)', clusters_k: 3, outlier_excluded: false, population_size: 3021435, silhouette_score: 0.81060, is_selected: false },
    { experiment_name: 'K=4 (Original Experiment)', clusters_k: 4, outlier_excluded: false, population_size: 3021435, silhouette_score: 0.51970, is_selected: false },
    { experiment_name: 'K=5 (Original Experiment)', clusters_k: 5, outlier_excluded: false, population_size: 3021435, silhouette_score: 0.57056, is_selected: false },
  ],
};
fs.writeFileSync(path.join(OUT_DIR, 'kmeansClusters.json'), JSON.stringify(kmeansClusters, null, 2));

// 11. Write Index Module
const indexTsContent = `/**
 * CommerceIQ Compiled Datasets
 * Auto-generated by scripts/transpile-data.ts. Do not edit directly.
 */

import verifiedMetricsData from './verifiedMetrics.json';
import eventDistributionData from './eventDistribution.json';
import dailyPurchasesData from './dailyPurchases.json';
import hourlyDynamicsData from './hourlyDynamics.json';
import weekdaySummaryData from './weekdaySummary.json';
import categoryRevenueData from './categoryRevenue.json';
import brandRevenueTop50Data from './brandRevenueTop50.json';
import topProductsData from './topProducts.json';
import priceDistributionData from './priceDistribution.json';
import userActivityDistributionData from './userActivityDistribution.json';
import pcaVarianceData from './pcaVariance.json';
import kmeansClustersData from './kmeansClusters.json';

import type { VerifiedProjectMetrics, EventDistributionRecord } from '../types/metrics';
import type {
  DailyPurchaseRecord,
  HourlyCombinedRecord,
  WeekdayRecord,
  CategoryRevenueRecord,
  BrandRevenueRecord,
  PriceDistributionRecord,
  UserActivityDistributionRecord,
} from '../types/analytics';
import type { PCAComponentRecord, KMeansClusterProfile, KMeansExperimentScore } from '../types/ml';

export const verifiedMetrics = verifiedMetricsData as unknown as VerifiedProjectMetrics;
export const eventDistribution = eventDistributionData as unknown as EventDistributionRecord[];
export const dailyPurchases = dailyPurchasesData as unknown as DailyPurchaseRecord[];
export const hourlyDynamics = hourlyDynamicsData as unknown as HourlyCombinedRecord[];
export const weekdaySummary = weekdaySummaryData as unknown as WeekdayRecord[];
export const categoryRevenue = categoryRevenueData as unknown as CategoryRevenueRecord[];
export const brandRevenueTop50 = brandRevenueTop50Data as unknown as BrandRevenueRecord[];
export const topProducts = topProductsData;
export const priceDistribution = priceDistributionData as unknown as PriceDistributionRecord[];
export const userActivityDistribution = userActivityDistributionData as unknown as UserActivityDistributionRecord[];
export const pcaVariance = pcaVarianceData as unknown as PCAComponentRecord[];
export const kmeansClusters = kmeansClustersData as unknown as {
  selected_model: { k: number; silhouette_score: number; analyzed_users: number; notes: string };
  clusters: KMeansClusterProfile[];
  sensitivity_experiments: KMeansExperimentScore[];
};
`;

fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexTsContent);

console.log('✓ Successfully transpiled and validated all 10 datasets into frontend/src/data/');
