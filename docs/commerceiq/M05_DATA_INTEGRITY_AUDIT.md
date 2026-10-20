# CommerceIQ — M05 Data Integrity & Provenance Audit
**Milestone:** M05 — Final Application Polishing & Production Delivery  
**Audit Scope:** End-to-End Metric Reconciliation Across Phase 7 PySpark Outputs  
**Status:** 100% Validated (56 / 56 Assertions Passed)  

---

## 1. Master Pipeline Metrics Reconciliation

The table below reconciles all master analytical metrics across raw event logs, cleaning transformations, feature engineering, and customer segmentation:

| Metric Dimension | Authoritative Value | Source Artifact | Validation Check |
|---|---|---|---|
| **Raw Telemetry Events** | `42,448,764` | `2019-Oct.csv` (Kaggle e-commerce log) | Verified row count |
| **Cleaned Parquet Events** | `42,349,874` | `cleaned_ecommerce_data.parquet` (67 partitions) | Sum of views + carts + purchases |
| **Net Filtered Events** | `98,890` (0.233%) | PySpark Data Cleaning Pipeline | `42,448,764 - 42,349,874` |
| **Filtered Invalid Prices** | `68,673` (69.44%) | `price <= 0.00` rule | Zero/negative promotional entries |
| **Unsegregated Remainder** | `30,217` (30.56%) | Multi-condition cleaning delta | `98,890 - 68,673` (audited residual) |
| **Distinct Platform Users** | `3,021,435` | Phase 7 User Feature Matrix | Distinct `user_id` count in Parquet |
| **Distinct Sessions** | `9,239,403` | Phase 7 Session Grouping | Distinct `user_session` count |
| **Recorded Purchases** | `742,773` | `event_type == 'purchase'` | Verified across daily & category files |
| **Recorded Views** | `40,708,807` | `event_type == 'view'` | 96.12% of all events |
| **Recorded Cart Adds** | `898,294` | `event_type == 'cart'` | 2.12% of all events |
| **Summed Purchase Value** | `229,933,212.63` units | `daily_purchase_summary.csv` | Exact sum across all 32 intervals |

---

## 2. Deduplication Audit Reconciliation

A core requirement of M05 is the formal reconciliation of historical duplicate-audit sample sizes:

```
Full Telemetry Ingestion (42,448,764 records)
  ├── Sample Audit A: 1% Random Sample (424,129 records) ──────> 0 duplicates (0.0000%)
  ├── Sample Audit B: 1M Contiguous Block (1,000,000 records) ──> 28 duplicates (0.0028%)
  └── Full Dataset Protocol: PySpark dropDuplicates(all 9 cols) ──> Bounded in 98,890 net removals
```

### 2.1 Sample Audit A (1% Random Sample)
- **Sample Size:** `424,129` records (approximately 1% random slice of the 42.4M raw corpus).
- **Execution Environment:** Evaluated in Python/Pandas during the initial M00 forensic audit.
- **Result:** Zero duplicate rows detected (`0` duplicates, `0.0000%` collision rate).

### 2.2 Sample Audit B (1M Contiguous Event Block)
- **Sample Size:** `1,000,000` records from the primary event stream.
- **Execution Environment:** Distributed PySpark audit pass.
- **Result:** Exactly `28` duplicate events identified (`0.0028%` collision rate).

### 2.3 Reconciliation Finding
Both sample audits demonstrate that the raw telemetry log contains an exceptionally low rate of identical duplicate records (<0.003%). The full-corpus deduplication pass executed via `dropDuplicates()` across all 9 schema columns is mathematically bounded within the `98,890` net filtered rows (alongside `68,673` invalid prices and `30,217` unsegregated multi-condition entries). Neither sample contradicts the other; they reflect different sampling protocols across the same high-retention pipeline.

---

## 3. Unsupervised Machine Learning Provenance

### 3.1 Evaluated Customer Population
- **Total Phase 7 Users:** `3,021,435`
- **Quarantined Outlier:** `1` extreme browsing user (`usr_***849`, Telemetry ID: `5123****49`) with 7,429 views and 0 purchases.
- **Evaluated K-Means Population:** `3,021,434` users (`3,021,435 - 1`).

### 3.2 Selected K-Means Architecture (K=2)
- **Silhouette Cohesion:** `0.81115` (Best evaluated configuration across 6 sensitivity trials from K=2 to K=7).
- **Cluster 0 (Commercial Core):**
  - Population: `250,388` users
  - Population Share: `8.287%` (~8.29%)
  - Mean Purchase Spend: `520.86` monetary units
  - Mean Sessions: `12.26` sessions
- **Cluster 1 (Casual Browsers):**
  - Population: `2,771,046` users
  - Population Share: `91.713%` (~91.71%)
  - Mean Purchase Spend: `35.91` monetary units
  - Mean Sessions: `2.23` sessions
- **Total Users in Model:** `250,388 + 2,771,046 = 3,021,434`.

### 3.3 Strict Exclusion of Retracted Metrics
The invalid metrics from earlier draft experiments (`13,618` Power Buyers / `3,007,816` Casual Browsers / `858.4×` purchase multiple / `42.5×` value multiple) remain **strictly excluded** across all code, tests, documentation, and user-facing views.

---

## 4. PCA Dimensionality Reduction Invariants

- **Standardization:** Numeric user features were normalized via `log1p(x)` to eliminate skewness (+2.54 to -0.27) followed by Z-score standardization.
- **Retained Components:** 7 principal components out of 11 original features.
- **Cumulative Explained Variance:**
  - PC1: 40.710% (Activity volume factor)
  - PC2: 17.932% (Exploration breadth factor)
  - PC3: 11.894%
  - PC4: 9.421%
  - PC5: 6.812%
  - PC6: 5.123%
  - PC7: 4.075%
  - **Total Cumulative Variance:** `95.967%` (exceeding the 95.0% information retention threshold).

---

## 5. Temporal Semantics & Hourly Dynamics

- **24 Hourly Bins:** All hourly events sum exactly to `42,349,874` cleaned records.
- **Activity Peak:** `21:00 UTC` with `3,055,061` events (7.21% of daily activity).
- **Recorded Purchase Value Peak:** `14:00 UTC` with `17,531,268.91` units (7.62% of revenue).
- **Semantics Definition:** The 7-hour interval between 14:00 and 21:00 is an **aggregate temporal peak separation** across independent hourly bins, *not* an individual customer purchase delay.

---

## 6. Currency Neutrality Invariant

All monetary figures are presented in neutral `units` or `monetary units`. No raw currency symbols (`$` or `₹`) appear in data models, tables, charts, or export utilities.
