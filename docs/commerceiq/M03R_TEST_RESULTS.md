# COMMERCEIQ — M03R TEST & VERIFICATION RESULTS
## Full Regression Testing Suite, Data Invariant Validation, and Build Audit

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M03-R (Provenance & Visual Acceptance Gate)  
**Status:** ALL TESTS PASSING (100% Green)  
**Date:** October 2026  

---

## 1. Executive Summary

Milestone M03-R underwent end-to-end regression testing to verify data contracts, numerical consistency, component state logic, TypeScript types, and production build readiness. 

### Core Test Metrics
- **Data Validation Suite:** `35 / 35` Invariants Passing (`100%`)
- **Vitest Unit Test Suite:** `41 / 41` Unit Tests Passing (`100%`)
- **TypeScript Static Analysis:** `0` Errors (`npx tsc --noEmit`)
- **Vite Production Build:** Succeeded in `9.04s` (`0` Warnings, `0` Errors)
- **Automated Browser Captures:** `10 / 10` Screenshots Successfully Generated

---

## 2. Data Invariant & Integrity Validation (`npm run validate-data`)

Command executed: `tsx src/scripts/validate-data.ts`
Result: **35 / 35 PASS (0 FAIL)**

```text
=== COMMERCEIQ DATA INTEGRITY & AUDIT VALIDATOR ===

Test Suite 1: Master Project Metrics Consistency
  ✓ PASS: Raw records count (Value: 42448764)
  ✓ PASS: Cleaned records count (Value: 42349874)
  ✓ PASS: Net records removed (Value: 98890)
  ✓ PASS: Filtered invalid prices (price <= 0) (Value: 68673)
  ✓ PASS: Remaining unsegregated cleaning difference (98,890 - 68,673) (Value: 30217)
  ✓ PASS: Distinct users in Phase 7 (Value: 3021435)
  ✓ PASS: Distinct sessions (Value: 9239403)
  ✓ PASS: Purchase events (Value: 742773)
  ✓ PASS: View events (Value: 40708807)
  ✓ PASS: Cart events (Value: 898294)
  ✓ PASS: Recorded purchase-event value (Value: 229933212.63)

Test Suite 2: Event Type Summation & Distribution Invariant
  ✓ PASS: Sum of (views + carts + purchases) equals cleaned_records (Value: 42349874)

Test Suite 3: Hourly Activity Sum Invariant
  ✓ PASS: 24 hourly bins (0 to 23 UTC) (Value: 24)
  ✓ PASS: Sum of hourly events equals cleaned_records (Value: 42349874)
  ✓ PASS: Peak activity hour is 21:00 UTC (Value: 21)
  ✓ PASS: Peak hourly event count is 3,055,061 (Value: 3055061)
  ✓ PASS: Peak revenue hour is 14:00 UTC (Value: 14)
  ✓ PASS: Peak hourly revenue is 17,531,268.91 (Value: 17531268.91)

Test Suite 4: Daily Purchase Summary Consistency
  ✓ PASS: 32 daily date records (including Nov 1 UTC boundary) (Value: 32)
  ✓ PASS: Sum of daily purchases equals 742,773 (Value: 742773)
  ✓ PASS: Sum of daily revenue equals 229,933,212.63 (Value: 229933212.63)

Test Suite 5: Weekday Purchase Summary Consistency
  ✓ PASS: 7 weekdays (Value: 7)
  ✓ PASS: Sum of weekday purchases equals 742,773 (Value: 742773)
  ✓ PASS: Sum of weekday revenue equals 229,933,212.63 (Value: 229933212.63)

Test Suite 6: Category Revenue Consistency
  ✓ PASS: 14 main categories (Value: 14)
  ✓ PASS: Sum of category purchases equals 742,773 (Value: 742773)
  ✓ PASS: Sum of category revenue equals 229,933,212.63 (Value: 229933212.62999997)

Test Suite 7: User Activity Distribution Consistency
  ✓ PASS: 5 user activity tier brackets (Value: 5)
  ✓ PASS: Sum of user activity tiers equals 3,021,435 users (Value: 3021435)

Test Suite 8: K-Means Cluster Model Invariants
  ✓ PASS: Selected model K = 2 (Value: 2)
  ✓ PASS: Silhouette score is 0.81115 (Value: 0.81115)
  ✓ PASS: K=2 cluster user total equals 3,021,434 (excluding 1 extreme browsing outlier user) (Value: 3021434)
  ✓ PASS: Difference between total users and K=2 population is exactly 1 outlier user (Value: 1)

Test Suite 9: PCA Explained Variance Invariants
  ✓ PASS: 7 principal components retained (Value: 7)
  ✓ PASS: Cumulative explained variance reaches 95.967% (Value: 95.967)

----------------------------------------
TOTAL ASSERTIONS: 35
PASSED:           35
FAILED:           0
----------------------------------------
✓ ALL DATA INTEGRITY INVARIANTS VERIFIED SUCCESSFULLY!
```

---

## 3. Vitest Unit Test Suite Execution (`npm test`)

Command executed: `vitest run`
Result: **41 / 41 PASS (0 FAIL)**

```text
 RUN  v2.1.9 C:/Users/madhur/Downloads/ecommerce/frontend

 ✓ src/test/csvExport.test.ts (6 tests) 5ms
 ✓ src/test/formatters.test.ts (8 tests) 145ms
 ✓ src/test/dataIntegrity.test.ts (7 tests) 5ms
 ✓ src/test/salesIntelligence.test.ts (7 tests) 6ms
 ✓ src/test/customerIntelligence.test.ts (8 tests) 7ms
 ✓ src/test/chartsAndExplorer.test.ts (5 tests) 4ms

 Test Files  6 passed (6)
      Tests  41 passed (41)
   Duration  3.65s
```

### Detailed Breakdown of Customer Intelligence Tests (`src/test/customerIntelligence.test.ts`)
| Test Assertion | Invariant Verified | Outcome |
| :--- | :--- | :--- |
| **User Population Invariant** | Total users (3,021,435) - Model users (3,021,434) = exactly 1 outlier | **PASS** |
| **Segment Shares Invariant** | Cluster 0 (250,388 users, 8.29%) + Cluster 1 (2,771,046 users, 91.71%) = 100.0% | **PASS** |
| **Cluster 0 Centroid Baseline** | Avg spend: 520.86, purchases: 1.58, sessions: 12.26, products: 42.04 | **PASS** |
| **Cluster 1 Centroid Baseline** | Avg spend: 35.91, purchases: 0.125, sessions: 2.22, products: 4.60 | **PASS** |
| **Empirical Multiple Ratios** | Spend: 14.5×, Purchases: 12.6×, Sessions: 5.5×, Catalog: 9.1× | **PASS** |
| **PCA Variance Structure** | PC1 (40.7123%) through PC7 sum to exactly 95.967% | **PASS** |
| **K-Means Model Selection** | K=2 outlier-excluded model attains optimal score of 0.81115 | **PASS** |
| **Activity Tiers Completeness** | 5 activity tiers sum to exactly 3,021,435 users | **PASS** |

---

## 4. TypeScript Static Analysis (`npx tsc --noEmit`)

Command executed: `npx tsc --noEmit`
Result: **0 Errors, 0 Warnings**

All types across `kmeansClusters`, `pcaVariance`, `userActivityDistribution`, and custom component props compile with strict null and type safety.

---

## 5. Production Build Audit (`npm run build`)

Command executed: `tsc && vite build`
Build Time: **9.04 seconds**

### Output Chunks Breakdown
```text
dist/index.html                                       1.40 kB │ gzip:   0.70 kB
dist/assets/index-B4k7eilG.css                       36.61 kB │ gzip:   6.96 kB
dist/assets/CustomerIntelligenceView-BTzheoHN.js     69.06 kB │ gzip:  14.44 kB
dist/assets/SalesIntelligenceView-C-FQu7_B.js        37.15 kB │ gzip:   8.27 kB
dist/assets/DataExplorerView-D3FXNtUZ.js             20.52 kB │ gzip:   4.81 kB
dist/assets/OverviewView-pgOxQhO9.js                 21.94 kB │ gzip:   6.83 kB
dist/assets/DataPipelineView-InELCKa6.js              7.94 kB │ gzip:   2.19 kB
dist/assets/MLInsightsView-F13QVZxy.js                6.61 kB │ gzip:   2.24 kB
dist/assets/formatters-3a5TvwJF.js                  280.99 kB │ gzip:  60.29 kB
dist/assets/vendor-three-CmIr_IEF.js                515.93 kB │ gzip: 128.82 kB
dist/assets/vendor-echarts-CnsiqC7u.js            1,127.59 kB │ gzip: 379.05 kB
dist/assets/vendor-react-CThAqjad.js                206.72 kB │ gzip:  67.49 kB
dist/assets/vendor-ui-BfD_evgU.js                   155.33 kB │ gzip:  48.87 kB
```
- Total initial load CSS: 36.61 kB raw (6.96 kB gzip).
- `CustomerIntelligenceView` is properly code-split into an isolated 69.06 kB chunk (14.44 kB gzip).
