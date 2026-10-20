# CommerceIQ — Milestone M02 Data Validation & Integrity Audit

**Document ID:** `CIQ-M02-DATA-VALIDATION`  
**Milestone:** M02 — Sales Intelligence & Connected Exploration  
**Status:** 100% Ground-Truth Verified  
**Date:** October 19, 2026  
**Auditor:** Senior Data Engineering Specialist & Quantitative QA Lead  

---

## 1. Executive Data Audit Summary

Every numerical figure, metric badge, chart series, and tooltip displayed across CommerceIQ's Milestone M02 implementation has been audited against the underlying PySpark analytical artifacts in `ecommerce_bigdata_showcase/results/`. Zero synthetic figures, sample customers, or simulated conversions have been introduced.

All 35 automated invariant assertions in `src/scripts/validate-data.ts` and 33 Vitest unit tests in `src/test/` execute and pass with zero discrepancies.

---

## 2. Source-of-Truth Data Ledger & Mapping

| Metric / Dimension | Source CSV File | Verified Numerical Value | Application Presentation | Semantics & Boundaries |
| :--- | :--- | :--- | :--- | :--- |
| **Gross Recorded Value** | `daily_purchase_summary.csv` | `229,933,212.63` | `229.93M units` / `229,933,212.63 units` | Neutral monetary units. Denotes recorded purchase-event value across 32 days. |
| **Total Purchase Events** | `daily_purchase_summary.csv` | `742,773` | `742,773` orders | Verified transaction count. Sum of all daily orders equals sum of category/brand orders. |
| **Platform Mean Ticket (AOV)** | Calculated from ground truth | `309.563` | `309.56 units` | Derived from `229,933,212.63 / 742,773`. |
| **Peak Daily Revenue** | `daily_purchase_summary.csv` | `9,810,197.33` (Oct 16) | `9.81M units` (Oct 16, 2019) | Peak revenue day of the 32-day capture period (`31,457` orders). |
| **Partial Collection Boundary** | `daily_purchase_summary.csv` | `537,945.66` (Nov 01) | `537.95k units` / `1,487` orders | Partial UTC day collection on Nov 1 boundary. Explicitly annotated in charts and tables. |
| **Peak Browsing Activity Hour**| `hourly_purchase_dynamics.csv`| `3,055,061` events (Hour 21)| `21:00 UTC` (3.06M events) | 7.21% of total event activity (views + carts + purchases). Macro platform observation. |
| **Peak Purchase Revenue Hour** | `hourly_purchase_dynamics.csv`| `17,531,268.91` units (Hour 14)| `14:00 UTC` (17.53M units) | 7.62% of gross revenue velocity (`56,197` orders). 7-hour temporal lag from browsing peak. |
| **Top 2 Brand Concentration** | `brand_revenue_top50.csv` | `157,601,533.05` units | `68.54%` of platform revenue | Apple (`111.20M`, 48.36%) + Samsung (`46.40M`, 20.18%). Severe merchandising duopoly. |
| **Unbranded Inventory Preservation** | `brand_revenue.csv` | `8,539,747.08` units (Rank 4) | `8.54M units` (Rank #4, `Unknown`) | Unbranded source records preserved as `Unknown` without synthetic brand fabrication. |
| **Dominant Category Share** | `category_revenue.csv` | `176,445,577.86` units | `176.45M units` (76.74%) | Electronics category dominates commercial volume (`422,979` orders). |
| **Unclassified Category Share** | `category_revenue.csv` | `22,922,165.08` units | `22.92M units` (9.97%) | Preserved unclassified telemetry (`173,411` orders) without assigning artificial categories. |
| **Peak Weekday Momentum** | `weekday_purchase_summary.csv`| `37,129,880.02` units (Wed) | `37.13M units` (`119,197` orders)| Wednesday drives highest order velocity and recorded value. |
| **Trough Weekday Momentum** | `weekday_purchase_summary.csv`| `29,071,361.02` units (Sat) | `29.07M units` (`96,010` orders) | Saturday records lowest purchasing volume. |
| **High-Ticket Asymmetry** | `price_distribution.csv` | `127,191,294.23` units (≥500) | `55.32%` revenue from `18.36%` orders| Tiers `500–999.99` and `1000 and above` dominate revenue while orders remain concentrated under 50. |

---

## 3. Discrepancy Reconciliation & Semantic Enforcements

### 3.1 Brand Count Reconciliation: 1,985 vs 1,986
- **Source Inspection:** `ecommerce_bigdata_showcase/results/brand_revenue.csv` has exactly 1,986 total lines in the file system.
- **Header Line:** Line 1 is the CSV header: `brand,total_revenue,purchase_events,unique_buyers,revenue_share_percentage`.
- **Data Rows:** Lines 2 through 1,986 contain exactly **1,985 distinct brand records**.
- **Audit Conclusion:** The count of distinct recorded brands is 1,985. All UI labels, table count badges, and documentation now state: *"1,985 recorded brands (1,986 CSV rows including header)"*.

### 3.2 Temporal Decoupling: Macro Platform Observation
- **The Observation:** Aggregated interaction events reach their diurnal zenith at **21:00 UTC (3.06M events)**, whereas completed transactions reach peak value at **14:00 UTC (17.53M units)**.
- **Semantic Constraint Enforced:** This 7-hour difference is strictly documented as an **aggregate platform phenomenon** across global user distributions and time zones. The application forbids claiming that individual consumers browse for 7 hours before buying, as individual cross-session journey duration is not tracked in the telemetry.

### 3.3 Currency Neutrality
- **Review Finding:** The raw telemetry headers specify `price` without country or currency tags.
- **Constraint Enforced:** No symbols (`$`, `₹`, `€`, `£`) are rendered. Values are denominated purely as `monetary units` or `units`. Automated regex tests in `src/test/formatters.test.ts` verify 0 forbidden currency symbols across all outputs.

### 3.4 Event Ratios vs User Conversion
- **Review Finding:** 40,708,807 views, 898,294 carts, and 742,773 purchases represent aggregate logged events across 3,021,435 users.
- **Constraint Enforced:** Step-downs are strictly described as aggregate event-count ratios (e.g. cart-to-view event ratio = `2.21%`), explicitly preventing false equivalencies to unique customer conversion rates.

### 3.5 Marginal vs Joint Distribution Independence
- **Review Finding:** Precomputed analytical summaries provide marginal distributions along discrete dimensions (dates, hours, categories, brands, price tiers). No multi-dimensional joint cross-tabulation table (e.g. brand-by-category-by-hour) exists in the original data showcase.
- **Constraint Enforced:** When a user focuses on an entity (such as selecting Apple or Electronics), CommerceIQ highlights verified metrics for that dimension and provides a deep link into the Data Explorer. The application prominently displays an **Analytical Semantics Notice Banner** confirming that joint multi-dimensional cross-filtering is not simulated.

---

## 4. Verification Checkpoint Status

- **Automated Data Validator:** 35 / 35 passed (`npm run validate-data`).
- **Vitest Unit Test Suite:** 33 / 33 passed (`npm test`).
- **Data Tracing Check:** 100% of numerical readouts trace directly to verified JSON assets.
