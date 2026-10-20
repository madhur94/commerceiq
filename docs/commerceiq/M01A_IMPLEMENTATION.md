# CommerceIQ — Milestone M01-A Implementation Report
**Document ID:** `CIQ-M01A-IMPL`  
**Milestone:** M01-A (Premium Application Foundation & Engineering Baseline)  
**Status:** Completed & Empirically Verified  
**Date:** October 19, 2026  
**Author:** Principal Frontend Architect & Senior Systems Engineer  

---

## 1. Executive Summary

Milestone **M01-A** establishes the technical architecture, visual design system, data transpilation pipeline, component contracts, and application shell for **CommerceIQ**.

The application is implemented in a dedicated, isolated `frontend/` directory, leaving the original Python Streamlit showcase (`ecommerce_bigdata_showcase/dashboard/app.py`) and raw assets completely untouched.

All mandatory corrections from the review have been strictly enforced:
1. **Currency Integrity:** Neutral monetary-unit labeling (`monetary units`, `units`) has been applied across all formatters, types, and UI views. No unsupported currency symbols (`₹` or `$`) or artificial currency switchers have been introduced.
2. **Data Cleaning Audit:** The 98,890 net records removed have been audited and segregated into 68,673 filtered non-positive price records (`price <= 0`) and an unsegregated remainder of 30,217 rows, with full disclosure of the incomplete JVM duplicate audit.
3. **Analytical Semantics:** Event ratios are strictly labeled as *event-count ratios* (not conversion rates); peak hourly differences are described as aggregate phenomena; summed prices are labeled as recorded purchase-event value; and the November 1 UTC boundary is explicitly disclosed.
4. **Performance Reality:** Zero unmeasured performance claims. Bundles were empirically measured via Vite/Rollup (`< 47 KB` gzipped vendor UI, `< 68 KB` gzipped vendor React, `< 5 KB` per route view). Three.js and full ECharts have been excluded from M01-A to keep the initial baseline ultra-lightweight.
5. **Source of Truth:** Every displayed figure is traced directly to verified Phase 7 CSV summaries and canonical project metrics.

---

## 2. Directory Layout & Repository Structure

The complete frontend application lives in `frontend/`:

```
frontend/
├── index.html                                  # HTML5 entry with Plus Jakarta Sans & JetBrains Mono
├── package.json                                # React 18, Vite 5, Tailwind 3.4, Vitest, Motion, Lucide
├── tsconfig.json                               # Strict TypeScript configuration with @/* path alias
├── tsconfig.node.json                          # Vite configuration types
├── vite.config.ts                              # Vite config with manual Rollup chunking & Vitest setup
├── tailwind.config.js                          # Exact design tokens for midnight canvas & neon accents
├── postcss.config.js                           # Tailwind & Autoprefixer PostCSS config
├── dist/                                       # Verified production build output
├── src/
│   ├── main.tsx                                # React 18 StrictMode bootstrap
│   ├── App.tsx                                 # Application root with RouterProvider
│   ├── styles/
│   │   └── globals.css                         # Tailwind layers, glassmorphism, scrollbars, reduced motion
│   ├── types/                                  # Centralized TypeScript Data Contracts
│   │   ├── metrics.ts                          # VerifiedProjectMetrics, FunnelStageData
│   │   ├── analytics.ts                        # DailyPurchaseRecord, HourlyCombinedRecord, BrandRecord
│   │   ├── ml.ts                               # PCAComponentRecord, KMeansClusterProfile, ExperimentScore
│   │   └── navigation.ts                       # NavItemConfig, RouteId
│   ├── utils/
│   │   ├── cn.ts                               # Utility combining clsx and tailwind-merge
│   │   └── formatters.ts                       # formatInteger, formatMonetaryValue, formatCompactMonetary
│   ├── data/                                   # Transpiled & validated static JSON datasets
│   │   ├── index.ts                            # Export manifest of all typed datasets
│   │   ├── verifiedMetrics.json                # Master project metrics (42.4M raw, 42.3M clean)
│   │   ├── eventDistribution.json             # 40.7M views, 898.3k carts, 742.8k purchases
│   │   ├── dailyPurchases.json                # 32 daily records (including Nov 1 partial day)
│   │   ├── hourlyDynamics.json                # 24 hourly bins (21:00 activity peak, 14:00 revenue peak)
│   │   ├── weekdaySummary.json                # 7 weekdays (Wednesday peak)
│   │   ├── categoryRevenue.json               # 14 categories (electronics: 176.45M units)
│   │   ├── brandRevenueTop50.json             # Top 50 brands by revenue (Apple: 111.20M units)
│   │   ├── topProducts.json                   # Product leaders by revenue and volume
│   │   ├── priceDistribution.json             # 6 price brackets with sanitized en-dashes
│   │   ├── userActivityDistribution.json      # 5 user activity brackets with sanitized en-dashes
│   │   ├── pcaVariance.json                   # 7 principal components (95.967% cumulative)
│   │   └── kmeansClusters.json                # K=2 sensitivity model (3,021,434 users, Silhouette: 0.81115)
│   ├── scripts/
│   │   ├── transpile-data.ts                   # Deterministic CSV to typed JSON transpiler
│   │   ├── validate-data.ts                    # 35-assertion data integrity validator
│   │   └── capture-screenshots.ts              # Automated Playwright multi-viewport screenshot suite
│   ├── test/
│   │   ├── setup.ts                            # Vitest DOM matchers setup
│   │   ├── formatters.test.ts                  # 7 unit tests for neutral formatting and sanitization
│   │   └── dataIntegrity.test.ts               # 7 unit tests for dataset cross-table invariants
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                    # Main container with responsive drawer & sidebar
│   │   │   ├── Sidebar.tsx                     # 256px expanded / 80px collapsed navigation sidebar
│   │   │   ├── SidebarNavItem.tsx              # Nav item with active glow bar and collapsed tooltips
│   │   │   ├── TopNav.tsx                      # Sticky glass header with date & provenance tags
│   │   │   └── Footer.tsx                      # Telemetry attribution and milestone footer
│   │   └── common/
│   │       ├── SurfaceCard.tsx                 # Core dark midnight card with hover elevation
│   │       ├── KpiCard.tsx                     # Numerical KPI card with monospace numbers and pills
│   │       ├── PageHeader.tsx                  # Breadcrumb, title, description, and status tags
│   │       ├── SectionHeading.tsx              # Modular section header with badge slot
│   │       ├── ContentContainer.tsx            # Max-width responsive container (up to 1600px)
│   │       ├── StatusIndicator.tsx             # Semantic status dots/pills (verified, ready, caution)
│   │       ├── NoticeBanner.tsx                # Methodological caveat alert box (info, warning)
│   │       ├── PageTransition.tsx              # Motion spring wrapper with reduced-motion support
│   │       ├── LoadingState.tsx                # Accessible animated loader
│   │       └── ErrorState.tsx                  # Error boundary card with retry action
│   └── views/
│       ├── OverviewView.tsx                    # Screen 1: Flagship Overview with real metrics & Nexus placeholder
│       ├── SalesIntelligenceView.tsx           # Screen 2: Shell for temporal decoupling & weekday analysis
│       ├── CustomerIntelligenceView.tsx        # Screen 3: Shell for K-Means clusters & activity tiers
│       ├── DataExplorerView.tsx                # Screen 4: Shell for brand & category merchandising tables
│       ├── MLInsightsView.tsx                  # Screen 5: Shell for PCA scree & correlation analysis
│       ├── DataPipelineView.tsx                # Screen 6: Shell for Spark/HDFS architecture & cleaning audit
│       └── NotFoundView.tsx                    # Polished 404 boundary view
└── router/
    └── index.tsx                               # React Router with route-level lazy loading
```

---

## 3. Technology Stack & Empirical Bundling Measurements

| Technology | Installed Version | Architectural Purpose |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Core declarative UI runtime. |
| **ReactDOM** | `18.3.1` | DOM renderer. |
| **React Router DOM**| `6.28.0` | Client-side routing with lazy-loaded route chunks. |
| **Tailwind CSS** | `3.4.15` | Zero-runtime CSS utility engine with custom design system tokens. |
| **Framer Motion** | `11.11.17` | Motion for React with spring physics and reduced-motion fallback. |
| **Lucide React** | `0.460.0` | 24px consistent iconography. |
| **Vite** | `5.4.11` | ESM development server and Rollup production bundler. |
| **Vitest** | `2.1.5` | Fast Vite-native unit testing runner. |
| **Playwright** | `1.49.0` | Automated visual regression and multi-viewport screenshot verification. |

### 3.1 Empirical Production Bundle Measurements
Compiled via `npm run build` (`tsc && vite build`):
* `dist/index.html`: `1.40 kB` (gzip: `0.71 kB`)
* `dist/assets/index-*.css`: `26.64 kB` (gzip: `5.76 kB`)
* `vendor-react-*.js`: `206.12 kB` (gzip: `67.30 kB`)
* `vendor-ui-*.js`: `144.52 kB` (gzip: `46.45 kB`)
* `OverviewView-*.js`: `19.78 kB` (gzip: `4.73 kB`)
* `SalesIntelligenceView-*.js`: `5.02 kB` (gzip: `1.65 kB`)
* `CustomerIntelligenceView-*.js`: `7.88 kB` (gzip: `2.03 kB`)
* `DataExplorerView-*.js`: `5.60 kB` (gzip: `1.83 kB`)
* `MLInsightsView-*.js`: `5.38 kB` (gzip: `1.92 kB`)
* `DataPipelineView-*.js`: `8.01 kB` (gzip: `2.22 kB`)
* `NotFoundView-*.js`: `1.42 kB` (gzip: `0.73 kB`)

**Initial Critical JavaScript Footprint:** `~118.5 KB` gzipped for initial entry + Overview view, well below the `< 250 KB` performance budget.

---

## 4. Reusable Component Contracts

All components adhere to strict TypeScript interfaces with semantic HTML and accessibility attributes:

### 4.1 Layout Shell Components
* **`AppShell`:** Controls persistent layout geometry, desktop sidebar collapse toggling, mobile drawer state, background ambient radial glow, and `localStorage` preference persistence.
* **`Sidebar`:** Desktop `w-64` (expanded) / `w-20` (collapsed) fixed container with active cyan indicators, collapsed tooltips, and bottom telemetry status. Transforms to an accessible off-canvas drawer on mobile (`< 1024px`) with a blurred backdrop overlay.
* **`TopNav`:** Sticky frosted-glass header (`glass-header`, `h-16`) displaying active route title, date period pill (`Oct 1 – Nov 1, 2019 UTC`), and verified status pill. Omitted all fake controls (no artificial search inputs, notification bells, or user profile dropdowns).
* **`Footer`:** Grounded telemetry citation and pipeline provenance.

### 4.2 Core UI Primitives
* **`SurfaceCard`:** Dark midnight container (`#111827`, border: `rgba(255, 255, 255, 0.08)`) with spring hover elevation (`hover:-translate-y-0.5 hover:border-border-prominent`).
* **`KpiCard`:** Visual metric container with tabular monospace numerals (`font-mono text-2xl sm:text-3xl`), context badge pills (`emerald`, `cyan`, `violet`, `amber`), and explicit unit labeling.
* **`StatusIndicator`:** Accessible status badge with optional pulse indicator.
* **`NoticeBanner`:** Structured alert box for communicating research caveats and data boundaries.
* **`PageTransition`:** Framer Motion wrapper applying spring deceleration on mount and collapsing to instantaneous opacity crossfades under `prefers-reduced-motion: reduce`.

---

## 5. Screen 1: Flagship Overview Implementation

The Overview page (`OverviewView.tsx`) serves as the architectural benchmark for the platform:
1. **Hero Region:**
   * Contextual headline highlighting the 42,349,874 cleaned events and 3,021,435 users.
   * Executive metric pills displaying Cleaned Events and Gross Purchase Value.
   * **Commerce Nexus 3D Placeholder:** An elegant, static visual placeholder featuring concentric glowing rings, a compass anchor, and clear labeling indicating upcoming M01-B Three.js WebGL integration ($\le 4$ draw calls).
2. **Macro KPI Cards Grid (4 Columns):**
   * **Recorded Purchase Value:** `229.93M units` (summed purchase-event value: `229,933,212.63 units`).
   * **Cleaned Event Volume:** `42,349,874` (context: `96.1% Views`).
   * **Analyzed Customers:** `3,021,435` (context: `8.29% High Activity`).
   * **Recorded Sessions:** `9,239,403` (context: `2.16% Purchase Ratio`).
3. **Daily Trajectory & Event-Count Funnel Row:**
   * **Daily Trajectory Structure:** Previews the October 16 peak (`9.81M units` / 31,457 purchases) and November 1 UTC boundary partial day (`1,487 orders`).
   * **Event-Count Funnel Structure:** Visualizes views (`40,708,807`), carts (`898,294` / 2.21%), and purchases (`742,773` / 82.69% of carts), accompanied by an explicit methodological warning: *"These figures represent aggregate event-count ratios, not session-level or user-cohort conversion rates."*
4. **Merchandising & Customer Intelligence Row:**
   * **Top Categories:** Ranked list showing `electronics` (`176.45M units` / 76.74%), `Unknown` (`22.92M units`), `appliances` (`13.58M units`), `computers` (`11.38M units`), and `furniture` (`1.67M units`).
   * **Customer Segments Snapshot:** Real metrics for Cluster 0 (250,388 users / 8.29% / avg 520.86 units) vs. Cluster 1 (2,771,046 users / 91.71% / avg 35.91 units) from the $K=2$ sensitivity model.

---

## 6. Screens 2 through 6 Structural Foundations

The remaining five screens were implemented with real page shells, accurate typography, contextual descriptions, and intended content hierarchies with visually cohesive forthcoming-module states:
* **Screen 2: Sales Intelligence:** Temporal decoupling between 21:00 UTC browsing and 14:00 UTC transactions, weekday purchasing patterns, and price tier contributions.
* **Screen 3: Customer Intelligence:** Detailed K-Means segment matrix ($K=2$), user activity frequency tiers (1–5 to >50 events), and the 7,429-view extreme browsing outlier case study.
* **Screen 4: Data Explorer:** Top 10 brand revenue table excerpt (Apple, Samsung, Xiaomi, Unknown, Huawei) with M01-B full table virtualization notice, category hierarchy, and top product revenue vs volume leaderboards.
* **Screen 5: ML Insights:** Full 7-component PCA variance table (95.967% cumulative), log-transformation price skewness reduction metric (+2.54 $\rightarrow$ -0.27), and K-Means silhouette score comparisons ($K=2$ to $K=5$).
* **Screen 6: Data Pipeline:** Spark/HDFS 4-stage pipeline flow, data cleaning accounting audit, duplicate audit memory constraint disclosure, and outlier diagnostic fences.
* **Screen 7: 404 Route Not Found:** Polished dark midnight boundary view.

---

*Approved and signed off for Milestone M01-A.*
