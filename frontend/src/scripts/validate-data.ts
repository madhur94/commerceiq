/**
 * CommerceIQ — Data Validation & Integrity Verification Script
 * Validates cross-table invariants, row counts, and numerical precision.
 * Run via: npm run validate-data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');

console.log('=== COMMERCEIQ DATA INTEGRITY & AUDIT VALIDATOR ===\n');

let failedAssertions = 0;
let passedAssertions = 0;

function assertEqual(actual: number | string, expected: number | string, testName: string, tolerance: number = 0) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
      console.log(`  ✓ PASS: ${testName} (Value: ${actual})`);
      passedAssertions++;
      return;
    }
  } else if (actual === expected) {
    console.log(`  ✓ PASS: ${testName} (Value: ${actual})`);
    passedAssertions++;
    return;
  }
  console.error(`  ✗ FAIL: ${testName}`);
  console.error(`          Expected: ${expected}`);
  console.error(`          Actual:   ${actual}`);
  failedAssertions++;
}

function loadJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`FATAL: Dataset missing: ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// 1. Verify Verified Project Metrics
console.log('Test Suite 1: Master Project Metrics Consistency');
const metrics = loadJSON<any>('verifiedMetrics.json');
assertEqual(metrics.raw_records, 42448764, 'Raw records count');
assertEqual(metrics.cleaned_records, 42349874, 'Cleaned records count');
assertEqual(metrics.net_records_removed, 98890, 'Net records removed');
assertEqual(metrics.invalid_price_records_filtered, 68673, 'Filtered invalid prices (price <= 0)');
assertEqual(metrics.unsegregated_cleaning_difference, 30217, 'Remaining unsegregated cleaning difference (98,890 - 68,673)');
assertEqual(metrics.users, 3021435, 'Distinct users in Phase 7');
assertEqual(metrics.sessions, 9239403, 'Distinct sessions');
assertEqual(metrics.purchase_events, 742773, 'Purchase events');
assertEqual(metrics.view_events, 40708807, 'View events');
assertEqual(metrics.cart_events, 898294, 'Cart events');
assertEqual(metrics.purchase_revenue, 229933212.63, 'Recorded purchase-event value', 0.01);

// 2. Verify Event Distribution
console.log('\nTest Suite 2: Event Type Summation & Distribution Invariant');
const events = loadJSON<any[]>('eventDistribution.json');
const sumEvents = events.reduce((acc, curr) => acc + curr.count, 0);
assertEqual(sumEvents, metrics.cleaned_records, 'Sum of (views + carts + purchases) equals cleaned_records');

// 3. Verify Hourly Activity Sum
console.log('\nTest Suite 3: Hourly Activity Sum Invariant');
const hourly = loadJSON<any[]>('hourlyDynamics.json');
assertEqual(hourly.length, 24, '24 hourly bins (0 to 23 UTC)');
const sumHourlyEvents = hourly.reduce((acc, curr) => acc + curr.event_count, 0);
assertEqual(sumHourlyEvents, metrics.cleaned_records, 'Sum of hourly events equals cleaned_records');
const peakActivityHour = hourly.reduce((max, curr) => (curr.event_count > max.event_count ? curr : max), hourly[0]);
assertEqual(peakActivityHour.event_hour, 21, 'Peak activity hour is 21:00 UTC');
assertEqual(peakActivityHour.event_count, 3055061, 'Peak hourly event count is 3,055,061');
const peakRevenueHour = hourly.reduce((max, curr) => (curr.total_revenue > max.total_revenue ? curr : max), hourly[0]);
assertEqual(peakRevenueHour.event_hour, 14, 'Peak revenue hour is 14:00 UTC');
assertEqual(peakRevenueHour.total_revenue, 17531268.91, 'Peak hourly revenue is 17,531,268.91', 0.01);

// 4. Verify Daily Purchase Summary Sum
console.log('\nTest Suite 4: Daily Purchase Summary Consistency');
const daily = loadJSON<any[]>('dailyPurchases.json');
assertEqual(daily.length, 32, '32 daily date records (including Nov 1 UTC boundary)');
const sumDailyPurchases = daily.reduce((acc, curr) => acc + curr.purchase_events, 0);
assertEqual(sumDailyPurchases, metrics.purchase_events, 'Sum of daily purchases equals 742,773');
const sumDailyRevenue = daily.reduce((acc, curr) => acc + curr.total_revenue, 0);
assertEqual(sumDailyRevenue, metrics.purchase_revenue, 'Sum of daily revenue equals 229,933,212.63', 0.05);

// 5. Verify Weekday Purchases
console.log('\nTest Suite 5: Weekday Purchase Summary Consistency');
const weekdays = loadJSON<any[]>('weekdaySummary.json');
assertEqual(weekdays.length, 7, '7 weekdays');
const sumWeekdayPurchases = weekdays.reduce((acc, curr) => acc + curr.purchase_events, 0);
assertEqual(sumWeekdayPurchases, metrics.purchase_events, 'Sum of weekday purchases equals 742,773');
const sumWeekdayRevenue = weekdays.reduce((acc, curr) => acc + curr.total_revenue, 0);
assertEqual(sumWeekdayRevenue, metrics.purchase_revenue, 'Sum of weekday revenue equals 229,933,212.63', 0.05);

// 6. Verify Category Revenue Sum
console.log('\nTest Suite 6: Category Revenue Consistency');
const categories = loadJSON<any[]>('categoryRevenue.json');
assertEqual(categories.length, 14, '14 main categories');
const sumCategoryPurchases = categories.reduce((acc, curr) => acc + curr.purchase_events, 0);
assertEqual(sumCategoryPurchases, metrics.purchase_events, 'Sum of category purchases equals 742,773');
const sumCategoryRevenue = categories.reduce((acc, curr) => acc + curr.total_revenue, 0);
assertEqual(sumCategoryRevenue, metrics.purchase_revenue, 'Sum of category revenue equals 229,933,212.63', 0.05);

// 7. Verify User Activity Distribution
console.log('\nTest Suite 7: User Activity Distribution Consistency');
const userActivity = loadJSON<any[]>('userActivityDistribution.json');
assertEqual(userActivity.length, 5, '5 user activity tier brackets');
const sumActivityUsers = userActivity.reduce((acc, curr) => acc + curr.user_count, 0);
assertEqual(sumActivityUsers, metrics.users, 'Sum of user activity tiers equals 3,021,435 users');

// 8. Verify K-Means Segmentation
console.log('\nTest Suite 8: K-Means Cluster Model Invariants');
const kmeans = loadJSON<any>('kmeansClusters.json');
assertEqual(kmeans.selected_model.k, 2, 'Selected model K = 2');
assertEqual(kmeans.selected_model.silhouette_score, 0.81115, 'Silhouette score is 0.81115');
const sumClusterUsers = kmeans.clusters.reduce((acc: number, curr: any) => acc + curr.user_count, 0);
assertEqual(sumClusterUsers, 3021434, 'K=2 cluster user total equals 3,021,434 (excluding 1 extreme browsing outlier user)');
assertEqual(metrics.users - sumClusterUsers, 1, 'Difference between total users and K=2 population is exactly 1 outlier user');

// 9. Verify PCA Variance
console.log('\nTest Suite 9: PCA Explained Variance Invariants');
const pca = loadJSON<any[]>('pcaVariance.json');
assertEqual(pca.length, 7, '7 principal components retained');
assertEqual(pca[6].cumulative_variance_percent, 95.967, 'Cumulative explained variance reaches 95.967%', 0.001);

// 10. Verify Pipeline Stages
console.log('\nTest Suite 10: Distributed Pipeline Stages Invariants');
const stages = loadJSON<any[]>('pipelineStages.json');
assertEqual(stages.length, 6, '6 sequential pipeline stages defined');
assertEqual(stages[0].records_in, 42448764, 'Stage 1 records in equals raw count');
assertEqual(stages[2].records_out, 42349874, 'Stage 3 records out equals cleaned count');
assertEqual(stages[2].records_in - stages[2].records_out, 98890, 'Stage 3 delta equals net records removed');

// 11. Verify Cleaning Audit Invariants
console.log('\nTest Suite 11: Data Cleaning Audit Accounting');
const audit = loadJSON<any>('cleaningAudit.json');
assertEqual(audit.summary.raw_records, 42448764, 'Audit raw records match');
assertEqual(audit.summary.cleaned_records, 42349874, 'Audit cleaned records match');
assertEqual(audit.summary.net_removed_records, 98890, 'Audit net removed match');
const sumRemovals = audit.removals_breakdown.reduce((acc: number, curr: any) => acc + curr.records_removed, 0);
assertEqual(sumRemovals, 98890, 'Sum of deterministic removals and unsegregated remainder equals 98,890');
assertEqual(audit.removals_breakdown[0].records_removed, 68673, 'Deterministic price <= 0 removals equal 68,673');
assertEqual(audit.removals_breakdown[1].records_removed, 30217, 'Unsegregated remainder equals 30,217');
assertEqual(audit.cleaning_pipeline_stages.length, 5, '5 cleaning pipeline execution steps logged');

// 12. Verify Lineage Artifact Registry
console.log('\nTest Suite 12: Typed Data Lineage Registry Invariants');
const lineage = loadJSON<any[]>('dataLineage.json');
assertEqual(lineage.length, 18, '18 typed research artifacts registered');
const allHaveIds = lineage.every((item) => item.artifact_id && item.display_name && item.storage_path);
assertEqual(allHaveIds ? 1 : 0, 1, 'All 18 artifacts contain valid identifiers and paths');

// 13. Verify Research Visualization Gallery
console.log('\nTest Suite 13: Research Visualization Gallery Inventory');
const gallery = loadJSON<any[]>('visualizationGallery.json');
assertEqual(gallery.length, 29, '29 research visualizations cataloged');
const phase7Count = gallery.filter((item) => item.phase.includes('Phase 7')).length;
assertEqual(phase7Count, 14, '14 Phase 7 summary visualizations present');
const interactiveCount = gallery.filter((item) => item.interactive_type === 'echarts_reimplementation').length;
assertEqual(interactiveCount, 4, '4 legacy interactive charts cataloged');

// 14. Verify Category Brand Treemap Hierarchy
console.log('\nTest Suite 14: Category & Brand Treemap Hierarchy');
const treemap = loadJSON<any[]>('categoryBrandTreemap.json');
assertEqual(treemap.length, 159, '159 total nodes in category-brand treemap');
const rootNodes = treemap.filter((node) => !node.parent || node.parent === '');
assertEqual(rootNodes.length, 9, '9 root category sector nodes');
const brandNodes = treemap.filter((node) => node.parent && node.parent !== '');
assertEqual(brandNodes.length, 150, '150 brand child leaf nodes');

// 15. Verify Product Bubble Matrix & Methodology Walkthrough
console.log('\nTest Suite 15: Product Bubble Matrix & Methodology Walkthrough');
const bubbleData = loadJSON<any[]>('productBubbleData.json');
assertEqual(bubbleData.length, 100, '100 top product data points in bubble matrix');
const methodology = loadJSON<any[]>('projectMethodology.json');
assertEqual(methodology.length, 10, '10 educational methodology steps in project walkthrough');

console.log('\n----------------------------------------');
console.log(`TOTAL ASSERTIONS: ${passedAssertions + failedAssertions}`);
console.log(`PASSED:           ${passedAssertions}`);
console.log(`FAILED:           ${failedAssertions}`);
console.log('----------------------------------------');

if (failedAssertions > 0) {
  console.error('\n❌ DATA INTEGRITY VALIDATION FAILED!');
  process.exit(1);
} else {
  console.log('\n✓ ALL DATA INTEGRITY INVARIANTS VERIFIED SUCCESSFULLY!');
  process.exit(0);
}
