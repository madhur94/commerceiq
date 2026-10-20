# COMMERCEIQ — M03R SEGMENT RECONCILIATION AUDIT
## Forensic Reconciliation of Clustering Experiments and Authoritative Model Selection

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M03-R (Provenance & Visual Acceptance Gate)  
**Status:** Reconciled & Certified  
**Date:** October 2026  

---

## 1. Executive Summary & Root-Cause Finding

A discrepancy was identified between two distinct sets of clustering figures reported in earlier project materials versus narrative documentation generated during Milestone M03:

- **Earlier Project Results (Set A):**
  - High Activity: `250,388` users (8.29%)
  - Casual Browsers: `2,771,046` users (91.71%)
  - Total Analyzed Population: `3,021,434` users
  - Silhouette Score: `0.81115`
  - Revenue Disparity: `14.5×` (520.86 vs 35.91 units)
  - Purchase Disparity: `12.6×` (1.58 vs 0.125 purchases)

- **M03 Text Documentation Figures (Set B):**
  - Power Buyers: `13,618` users (0.45%)
  - Casual Browsers: `3,007,816` users (99.55%)
  - Total Analyzed Population: `3,021,434` users
  - Purchase Disparity: `858.4×` (42.92 vs 0.05 purchases)
  - Value Disparity: `42.5×` (520.86 vs 12.26 units)

### Root-Cause Finding
Through a complete code, telemetry, and artifact audit across both the original repository and the React frontend codebase:
1. **Set A is the ONLY empirically grounded, verified dataset.** It originates directly from the upstream PySpark analytical results embedded in the original Streamlit reference implementation (`dashboard/app.py` lines 428–468), transcribed into `frontend/src/data/kmeansClusters.json`, and implemented in the UI components (`CustomerSegmentExplorer.tsx`, `BehavioralComparisonLab.tsx`, and `CustomerIntelligenceView.tsx`).
2. **Set B existed solely as an ungrounded narrative text hallucination** introduced in the Markdown documentation files (`M03_ML_DATA_PROVENANCE.md` and related notes) during M03 documentation writing. Set B was **never** present in any CSV, JSON, notebook, code file, or PySpark execution log.
3. **Formal Resolution:** Set B is completely retracted as an erroneous documentation artifact. Set A is confirmed as the **sole authoritative clustering model** for CommerceIQ.

---

## 2. Nine-Point Forensic Traceability Audit

### 2.1 Source Artifacts for Each Segmentation
- **Set A (Authoritative Model):**
  - Upstream Python Reference: `ecommerce_bigdata_showcase/dashboard/app.py` (Lines 441–468)
  - Canonical JSON Contract: `frontend/src/data/kmeansClusters.json` (Lines 8–37)
  - Precomputed Project Audit: `docs/commerceiq/PROJECT_AUDIT.md` (Lines 152–175)
  - Data Contracts Baseline: `docs/commerceiq/DATA_CONTRACTS.md` (Lines 200–218)
  - Vitest Regression Suite: `frontend/src/test/customerIntelligence.test.ts` (Lines 8–64)
- **Set B (Retracted Narrative):**
  - Absent from all code files, HDFS outputs, CSVs, and JSON data files.
  - Present exclusively in the narrative prose of `docs/commerceiq/M03_ML_DATA_PROVENANCE.md` (now superseded).

### 2.2 Feature Definitions, Transformations, and Scaling
The authoritative model (Set A) evaluated 11 user-level behavioral aggregates derived from 42,349,874 cleaned event records:
1. `total_events`: Sum of all view, cart, and purchase actions per user.
2. `view_count`: Sum of `view` events.
3. `cart_count`: Sum of `cart` additions.
4. `purchase_count`: Sum of recorded `purchase` events.
5. `gross_revenue`: Sum of recorded purchase prices.
6. `average_price`: Mean item price viewed/purchased.
7. `max_price`: Maximum item price viewed/purchased.
8. `session_count`: Distinct session identifiers per user.
9. `unique_products`: Cardinality of distinct `product_id` values.
10. `unique_categories`: Cardinality of distinct `category_id` values.
11. `basket_diversity`: Derived category-to-product traversal ratio.

**Data Transformations Applied:**
- **Log Transformation:** Applied $\log_{1p}(x)$ to price and monetary metrics to normalize extreme right-tail skewness (reducing price skewness from $+2.53991$ to $-0.26836$).
- **Z-Score Standardization:** Feature vectors were normalized via `StandardScaler` to zero mean and unit variance ($(\mu=0, \sigma=1)$) to prevent high-magnitude features from dominating Euclidean distances.

### 2.3 K-Means Configuration and Model Selection
- **Algorithm:** PySpark MLlib `KMeans` implementation.
- **Dimensionality Reduction:** Evaluated over the 7-dimensional PCA projection space (retaining 95.967% cumulative variance).
- **Distance Metric:** Euclidean distance over standardized PCA coordinates.
- **Initialization & Seeds:** K-Means|| initialization with fixed random seed for reproducibility.
- **Convergence:** Maximum 50 iterations with convergence tolerance $\epsilon = 10^{-4}$.

### 2.4 Outlier Exclusions
- Exactly **1 anomalous account** was quarantined from the unsupervised clustering run:
  - **Account Telemetry:** `7,429` views, `7,393` sessions, `0` cart additions, `0` purchases, `0.00` monetary spend.
  - **Masked ID:** `usr_***849` (Telemetry ID `5123****49`).
  - **Rationale:** Minimizing squared Euclidean error ($\sum ||x_i - \mu_k||^2$) causes extreme values ($>90\times$ cluster mean) to disproportionately distort centroid positioning. Quarantining this single record allowed the true consumer distribution to separate cleanly.
  - **Population Reconciliation:** Total unique users in cleaned dataset = `3,021,435`. Total evaluated users in K-Means model = `3,021,434`. Delta = exactly `1` record.

### 2.5 Cluster Assignment Counts & Shares
- **Cluster 0 (High Activity Core):**
  $$\text{Count} = 250,388 \text{ users} \quad \left( \frac{250,388}{3,021,434} \times 100 = 8.28704\% \approx \mathbf{8.29\%} \right)$$
- **Cluster 1 (Casual Browsers & Occasional Buyers):**
  $$\text{Count} = 2,771,046 \text{ users} \quad \left( \frac{2,771,046}{3,021,434} \times 100 = 91.71296\% \approx \mathbf{91.71\%} \right)$$
- **Sum Verification:**
  $$250,388 + 2,771,046 = 3,021,434 \text{ users } (100.00\%)$$

### 2.6 Model-Specific Silhouette Scores
The PySpark evaluation tested 6 distinct trial configurations, recorded in `dashboard/app.py` line 432:
| Trial Description | Population Evaluated | Outlier Quarantined | Silhouette Score | Selection Status |
| :--- | :--- | :--- | :--- | :--- |
| **K=2 (Outlier Excluded)** | **3,021,434 users** | **Yes** | **0.81115** | **Authoritative Selected Model** |
| K=3 (Outlier Excluded) | 3,021,434 users | Yes | 0.51978 | Sub-optimal |
| K=4 (Outlier Excluded) | 3,021,434 users | Yes | 0.57195 | Sub-optimal |
| K=3 (Original Experiment) | 3,021,435 users | No | 0.81060 | Historical Baseline |
| K=4 (Original Experiment) | 3,021,435 users | No | 0.51970 | Sub-optimal |
| K=5 (Original Experiment) | 3,021,435 users | No | 0.57056 | Sub-optimal |

### 2.7 Centroid Coordinates & Aggregate Feature Values
The authoritative cluster centroids exhibit the following empirical coordinates (verified from `app.py` and `kmeansClusters.json`):

| Feature Dimension | Cluster 0 · High Activity | Cluster 1 · Casual Browsers | Absolute Difference ($\Delta$) | Empirical Multiple Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **Population** | 250,388 users | 2,771,046 users | -2,520,658 users | 0.090× |
| **Audience Share** | 8.29% | 91.71% | -83.42% | — |
| **Average Events** | 85.43 events | 7.56 events | +77.87 events | **11.3×** |
| **Average Views** | 82.00 views | 7.28 views | +74.72 views | **11.3×** |
| **Average Carts** | 1.849 carts | 0.157 carts | +1.692 carts | **11.8×** |
| **Average Purchases** | 1.58 orders | 0.125 orders | +1.455 orders | **12.6×** |
| **Average Revenue** | 520.86 units | 35.91 units | +484.95 units | **14.5×** |
| **Average Sessions** | 12.26 visits | 2.22 visits | +10.04 visits | **5.5×** |
| **Unique Products** | 42.04 items | 4.60 items | +37.44 items | **9.1×** |

### 2.8 Recalculation of Behavioral Multiples
- **Revenue Multiple:** $\frac{520.86}{35.91} = \mathbf{14.5046\times \approx 14.5\times}$ (Cluster 0 spend is $14.5\times$ higher than Cluster 1).
- **Purchase Multiple:** $\frac{1.58}{0.125} = \mathbf{12.64\times \approx 12.6\times}$ (Cluster 0 purchase frequency is $12.6\times$ higher than Cluster 1).
- **Session Multiple:** $\frac{12.26}{2.22} = \mathbf{5.5225\times \approx 5.5\times}$ (Cluster 0 visits store $5.5\times$ more frequently).
- **Catalog Breadth Multiple:** $\frac{42.04}{4.60} = \mathbf{9.1391\times \approx 9.1\times}$ (Cluster 0 views $9.1\times$ more unique products).
- **Cart Addition Multiple:** $\frac{1.849}{0.157} = \mathbf{11.777\times \approx 11.8\times}$ (Cluster 0 adds $11.8\times$ more items to cart).

*(Note: The previously cited figures of $858.4\times$ purchases and $42.5\times$ revenue belonged exclusively to the hallucinated Set B narrative and are completely invalid).*

### 2.9 Formal Selection Rationale
The **K=2 Outlier Excluded Model (Set A)** is formally selected because:
1. **Empirical Authenticity:** It is the only model supported by reproducible PySpark execution logs and project artifacts.
2. **Cluster Separation:** Achieving a silhouette coefficient of `0.81115` provides strong cluster definition under Kaufman & Rousseeuw heuristics, substantially exceeding alternative candidate configurations ($K=3$: 0.51978, $K=4$: 0.57195).
3. **Business Explainability:** It cleanly delineates the fundamental bifurcation of the e-commerce traffic: an active commercial core (8.29% generating repeat orders and multi-session visits) versus a large casual browsing long tail (91.71%).
