# CommerceIQ — Milestone M01-A Data Validation & Integrity Audit
**Document ID:** `CIQ-M01A-VALIDATION`  
**Milestone:** M01-A (Data Transpilation & Statistical Verification)  
**Status:** 100% Passed (35 of 35 Invariants Verified)  
**Date:** October 19, 2026  
**Author:** Principal Data Engineer & Senior Systems Architect  

---

## 1. Executive Summary & Verification Scope

The CommerceIQ data pipeline converts upstream PySpark analytical outputs and precomputed CSV summaries into strongly typed, normalized static JSON modules.

To ensure strict compliance with research boundaries and empirical truth, all datasets were audited via an automated test suite (`npm run validate-data` executing `src/scripts/validate-data.ts`). Every cross-table invariant, row sum, revenue aggregate, outlier fence, and user population was verified with zero discrepancies.

```
------------------------------------------------------------------------
TOTAL INVARIANT ASSERTIONS EXECUTED:  35
ASSERTIONS PASSED:                    35 (100.00%)
ASSERTIONS FAILED:                    0  (0.00%)
STATUS:                               VERIFIED PRODUCTION QUALITY
------------------------------------------------------------------------
```

---

## 2. Invariant Verification Results by Test Suite

### 2.1 Suite 1: Master Project Metrics Consistency
*Source: `data/summary/verified_project_metrics.csv` & `results/phase7/phase7_summary.csv`*

| Metric Key | Verified Value | Unit / Definition | Verification Status |
| :--- | :--- | :--- | :--- |
| `raw_records` | `42,448,764` | Raw CSV event rows in HDFS | **PASS** |
| `cleaned_records` | `42,349,874` | Cleaned Snappy Parquet event rows | **PASS** |
| `net_records_removed` | `98,890` | Gross difference (`raw_records - cleaned_records`) | **PASS** |
| `invalid_price_records` | `68,673` | Events filtered where `price <= 0` | **PASS** |
| `unsegregated_difference`| `30,217` | Remainder (`98,890 - 68,673`) | **PASS** |
| `users` | `3,021,435` | Distinct user IDs in Phase 7 feature table | **PASS** |
| `sessions` | `9,239,403` | Distinct user sessions in Phase 7 | **PASS** |
| `purchase_events` | `742,773` | Gross completed purchase transactions | **PASS** |
| `view_events` | `40,708,807` | Product browsing view events | **PASS** |
| `cart_events` | `898,294` | Shopping cart addition events | **PASS** |
| `purchase_revenue` | `229,933,212.63` | Sum of purchase-event prices (monetary units) | **PASS** |

### 2.2 Suite 2: Event Type Summation Invariant
*Formula:* $\sum(\text{views} + \text{carts} + \text{purchases}) = \text{cleaned\_records}$
* Calculation: $40,708,807 + 898,294 + 742,773 = 42,349,874$
* Target: `42,349,874`
* Result: **PASS** (Exact equality).

### 2.3 Suite 3: Hourly Activity & Revenue Summation (Temporal Decoupling)
*Source: `results/phase7/hourly_activity.csv` & `results/phase7/hourly_revenue.csv`*
* Bins Tested: Exactly 24 hourly intervals (00:00 to 23:00 UTC).
* Sum of Hourly Events: $\sum_{h=0}^{23} \text{events}_h = 42,349,874$ (Matches `cleaned_records`). Result: **PASS**.
* Peak Browsing Activity Hour: **Hour 21 (21:00 UTC)** with `3,055,061` events. Result: **PASS**.
* Peak Transaction Revenue Hour: **Hour 14 (14:00 UTC)** with `17,531,268.91` monetary units. Result: **PASS**.
* *Empirical Confirmation:* Temporal decoupling is mathematically verified: browsing surges at 21:00 UTC while financial volume peaks 7 hours earlier at 14:00 UTC.

### 2.4 Suite 4: Daily Purchase Summary Consistency
*Source: `results/phase7/daily_purchase_summary.csv`*
* Intervals Tested: 32 daily records spanning 2019-10-01 to 2019-11-01.
* Sum of Daily Purchases: $\sum_{d=1}^{32} \text{purchases}_d = 742,773$. Result: **PASS**.
* Sum of Daily Revenue: $\sum_{d=1}^{32} \text{revenue}_d = 229,933,212.63$ monetary units. Result: **PASS**.
* Peak Revenue Day: **2019-10-16** (`31,457` purchases | `9,810,197.33` monetary units).
* November 1 UTC Boundary Audit: Verified `1,487` purchases and `537,945.66` monetary units. Tagged as `is_partial_day: true`.

### 2.5 Suite 5: Weekday Purchase Summary Consistency
*Source: `results/phase7/weekday_purchase_summary.csv`*
* Intervals Tested: 7 weekdays (Sunday through Saturday).
* Sum of Weekday Purchases: $\sum_{w=1}^{7} \text{purchases}_w = 742,773$. Result: **PASS**.
* Sum of Weekday Revenue: $\sum_{w=1}^{7} \text{revenue}_w = 229,933,212.63$ monetary units. Result: **PASS**.
* Peak Weekday: **Wednesday** (`119,197` purchases | `37,129,880.02` monetary units).
* Trough Weekday: **Saturday** (`96,010` purchases | `29,071,361.02` monetary units).

### 2.6 Suite 6: Category Revenue Consistency
*Source: `results/phase7/category_revenue.csv`*
* Categories Tested: 14 main category buckets.
* Sum of Category Purchases: $\sum_{c=1}^{14} \text{purchases}_c = 742,773$. Result: **PASS**.
* Sum of Category Revenue: $\sum_{c=1}^{14} \text{revenue}_c = 229,933,212.63$ monetary units. Result: **PASS**.
* Category Dominance: `electronics` accounts for `176,445,577.86` monetary units (**76.74%** of total revenue).

### 2.7 Suite 7: User Activity Distribution Consistency
*Source: `results/phase7/user_activity_distribution.csv`*
* Brackets Tested: 5 engagement tiers (`1–5`, `6–10`, `11–20`, `21–50`, `>50 events`).
* Sum of Users Across Tiers: $1,668,748 + 447,969 + 386,999 + 340,039 + 177,680 = 3,021,435$.
* Target: `3,021,435` users.
* Result: **PASS** (Exact equality).

### 2.8 Suite 8: K-Means Cluster Model Invariants
*Source: Technical Project Report & `results/phase7/user_activity_distribution.csv`*
* Selected Model: $K=2$ Sensitivity Experiment.
* Recorded Silhouette Score: `0.81115`. Result: **PASS**.
* Evaluated Population: Cluster 0 (`250,388`) + Cluster 1 (`2,771,046`) = `3,021,434` users. Result: **PASS**.
* Outlier Accounting Invariant: Total users (`3,021,435`) minus K=2 population (`3,021,434`) = **exactly 1 outlier user**. Result: **PASS**.
* *Outlier Case Study Verified:* Single user ID with 7,429 views, 7,393 sessions, 0 carts, and 0 purchases. Excluded solely from the $K=2$ sensitivity run.

### 2.9 Suite 9: PCA Explained Variance Invariants
*Source: Technical Project Report (Phase 8 notes)*
* Principal Components Retained: Exactly 7 components (`PC1` through `PC7`).
* Cumulative Explained Variance: `95.9670%`. Result: **PASS**.

---

## 3. Forensic Investigation of the Data Cleaning Difference

In compliance with Review Requirement 3.2, a forensic investigation of the 98,890 removed records was conducted using the technical report and cleaning notes:

```
Raw Event Records Ingested:        42,448,764
Cleaned Event Records Retained:    42,349,874
---------------------------------------------
Net Records Removed:                   98,890 (0.23% removal rate)
  ├── Invalid Non-Positive Prices:     68,673 (price <= 0 filtered)
  └── Unsegregated Remainder:          30,217 (Cleaning pipeline adjustment)
```

### 3.1 Forensic Findings on the Remaining 30,217 Records
1. **Pipeline Execution:** The PySpark data preparation script executed `dropDuplicates()` alongside the price filter `filter(col('price') > 0)`.
2. **Duplicate Audit Failure:** When an independent audit was executed to isolate the exact count of duplicates using `exceptAll()` on the full 42-million-row dataset, the Spark JVM crashed with a Garbage Collection overhead limit error after 166 seconds.
3. **Sample Verification:** A 1% random sample (`424,129` rows) was successfully audited and contained zero duplicate rows.
4. **Engineering Conclusion:** Because duplicate filtering and invalid price filtering operated in the same pipeline stage without intermediate checkpointing, it cannot be asserted that the entire 30,217 remainder represents pure duplicates. There may be overlap between duplicates and invalid price records. CommerceIQ transparently reports:
   *"98,890 records were removed during cleaning, consisting of 68,673 invalid non-positive prices and an unsegregated remainder of 30,217 records from de-duplication and schema sanitation."*

---

## 4. Character Encoding & String Normalization Audit

### 4.1 UTF-8 En-Dash Normalization (`\xe2\x80\x93`)
* **Problem:** In `purchase_price_distribution.csv` and `user_activity_distribution.csv`, range separators were stored using the UTF-8 en-dash byte sequence (`0xE2 0x80 0x93`). When loaded in environments with non-UTF-8 default code pages (e.g. Windows CP1252), these rendered corrupted as `50?"99.99` and `1?"5 events`.
* **Verification:** The transpiler script applied `sanitizeRangeString()`:
  * `50\xe2\x80\x9399.99` $\rightarrow$ `50 – 99.99`
  * `1\xe2\x80\x935 events` $\rightarrow$ `1 – 5 events`
* Both unit tests and browser screenshots confirm clean, standardized Unicode en-dash rendering.

### 4.2 IEEE 754 Floating-Point Precision Normalization
* **Problem:** Raw sums in CSV files exhibited IEEE 754 floating-point precision artifacts (e.g., `111199495.70000108` and `176445577.86001062`).
* **Verification:** The transpiler normalizes currency amounts via `Math.round((val + Number.EPSILON) * 100) / 100`, preserving exact monetary precision down to the cent without floating-point artifacts.

---

*Verified and signed off for Milestone M01-A.*
