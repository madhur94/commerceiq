# COMMERCEIQ — M03R ML PROVENANCE & NORMALIZATION AUDIT
## Radar Normalization Verification, Dimensionality Reduction Audit, and Scientific Integrity Guardrails

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M03-R (Provenance & Visual Acceptance Gate)  
**Status:** Certified & Verified  
**Date:** October 2026  

---

## 1. Executive Summary

This document establishes the verified mathematical provenance for all machine learning assets in CommerceIQ, with particular focus on radar chart scaling mathematics, PCA component variances, silhouette heuristic interpretations, and outlier handling.

Every calculation and visualization parameter has been validated against upstream PySpark artifacts (`dashboard/app.py`, `frontend/src/data/pcaVariance.json`, and `frontend/src/data/kmeansClusters.json`).

---

## 2. Radar Chart Normalization Verification (Task 2)

### 2.1 The Need for Normalization
In the authoritative $K=2$ clustering model, centroid dimensions span radically different units and magnitudes:
- Monetary spend: $35.91$ to $520.86$ units (order of magnitude: $10^2$).
- Average purchases: $0.125$ to $1.58$ orders (order of magnitude: $10^0$).
- Average cart additions: $0.157$ to $1.849$ carts (order of magnitude: $10^0$).

Plotting these raw numbers directly on a standard Euclidean radar polygon would compress all purchase, cart, and session metrics to the coordinate center, creating severe visual distortion. 

### 2.2 Normalization Protocol & Mathematical Formulas
To ensure geometric balance without distorting behavioral reality, `SegmentComparisonRadarChart.tsx` applies explicit reference scaling:
- **Reference Baseline:** Cluster 0 (High Activity Core) represents the upper intensity benchmark ($100.0$) across all 5 axes.
- **Cluster 1 Coordinates:** Computed as a percentage of the Cluster 0 benchmark.

#### Dimension 1: Monetary Value (Revenue Index)
- **Raw Values:** Cluster 0 = $520.86$ units; Cluster 1 = $35.91$ units.
- **Transformation:** $\log_{10}(x + 1)$ is applied to compress multi-order exponential magnitude dispersion:
  $$\text{LogRev}_0 = \log_{10}(520.86 + 1) = \log_{10}(521.86) \approx 2.71755$$
  $$\text{LogRev}_1 = \log_{10}(35.91 + 1) = \log_{10}(36.91) \approx 1.56714$$
- **Radar Index:**
  $$\text{Index}_0 = 100.0$$
  $$\text{Index}_1 = \left( \frac{1.56714}{2.71755} \right) \times 100 = \mathbf{57.67\% \approx 57.7}$$
- **Meaning:** In log space, Cluster 1 achieves 57.7% of Cluster 0's monetary scale, reflecting that while Cluster 1's mean spend is lower ($35.91$), it remains a meaningful non-zero volume.

#### Dimension 2: Purchase Activity (Orders Index)
- **Raw Values:** Cluster 0 = $1.58$ orders; Cluster 1 = $0.125$ orders.
- **Radar Index:**
  $$\text{Index}_0 = 100.0$$
  $$\text{Index}_1 = \left( \frac{0.125}{1.58} \right) \times 100 = \mathbf{7.91\% \approx 7.9}$$
- **Meaning:** Cluster 1 achieves 7.9% of Cluster 0's purchase frequency, visually exposing the $12.6\times$ purchase volume disparity.

#### Dimension 3: Session Frequency (Visits Index)
- **Raw Values:** Cluster 0 = $12.26$ visits; Cluster 1 = $2.22$ visits.
- **Radar Index:**
  $$\text{Index}_0 = 100.0$$
  $$\text{Index}_1 = \left( \frac{2.22}{12.26} \right) \times 100 = \mathbf{18.11\% \approx 18.1}$$
- **Meaning:** Cluster 1 users generate 18.1% of the session visits observed in the commercial core ($5.5\times$ disparity).

#### Dimension 4: Catalog Breadth (Unique Products Index)
- **Raw Values:** Cluster 0 = $42.04$ products; Cluster 1 = $4.60$ products.
- **Radar Index:**
  $$\text{Index}_0 = 100.0$$
  $$\text{Index}_1 = \left( \frac{4.60}{42.04} \right) \times 100 = \mathbf{10.94\% \approx 10.9}$$
- **Meaning:** Cluster 1 browses 10.9% of the product variety explored by Cluster 0 ($9.1\times$ disparity).

#### Dimension 5: Cart Intent (Cart Additions Index)
- **Raw Values:** Cluster 0 = $1.849$ carts; Cluster 1 = $0.157$ carts.
- **Radar Index:**
  $$\text{Index}_0 = 100.0$$
  $$\text{Index}_1 = \left( \frac{0.157}{1.849} \right) \times 100 = \mathbf{8.49\% \approx 8.5}$$
- **Meaning:** Cluster 1 demonstrates 8.5% of Cluster 0's carting velocity ($11.8\times$ disparity).

### 2.3 Safeguards Against Concealing Important Differences
To guarantee that geometric normalization never obscures raw differences:
1. **Interactive Hover Tooltip:** Hovering over any radar vertex displays the **exact unnormalized metrics** (e.g., `Avg Revenue: 520.86 units vs 35.91 units`, `Avg Purchases: 1.58 orders vs 0.125 orders`).
2. **Dedicated Table Mode:** In `CustomerSegmentExplorer.tsx`, users can switch at any time to the `Detailed Metric Table`, which presents full unnormalized raw numbers and empirical multiple ratios side-by-side.
3. **Behavioral Comparison Lab:** Section C renders animated linear progress bars with explicit absolute and multiple callouts for each metric.

---

## 3. Dimensionality Reduction & PCA Provenance (Task 3)

### 3.1 PCA Component Variance Retention
The PCA model decomposed standardized user feature vectors into 7 principal components, capturing **95.967%** of cumulative variance:

| Component | Explained Variance (%) | Cumulative Variance (%) | Historical Factor Loading Dominance |
| :--- | :--- | :--- | :--- |
| **PC1** | **40.7123%** | 40.7123% | Total events, view counts, session frequency |
| **PC2** | **17.9277%** | 58.6400% | Catalog breadth vs price/spend metrics |
| **PC3** | **14.7635%** | 73.4035% | View-to-purchase conversion & cart density |
| **PC4** | **8.4269%** | 81.8305% | Temporal engagement dispersion |
| **PC5** | **5.8033%** | 87.6338% | Category switching & diversity |
| **PC6** | **4.5092%** | 92.1430% | Cart-to-session ratio |
| **PC7** | **3.8240%** | **95.9670%** | Residual price variance |

*(Components 8 through 11 account for $< 4.033\%$ residual variance and were pruned).*

### 3.2 Scientific Boundaries on Component Interpretation
In strict compliance with statistical rigor:
- Principal components are **linear algebraic combinations of standardized features**, chosen to maximize remaining orthogonal variance.
- They do **not** represent physical, psychological, or behavioral laws (such as "loyalty" or "purchase intent").
- Interpretive labels (such as "PC1: Behavioral volume", "PC2: Exploration breadth") are **qualitative descriptive hypotheses** based on dominant factor loadings, not deterministic proofs.

---

## 4. Silhouette Analysis & Model Selection Guardrails (Task 3)

### 4.1 Silhouette Score Interpretation
- In clustering literature (notably Kaufman & Rousseeuw, 1990), a silhouette coefficient $s(i) \ge 0.71$–$0.80$ is an **established literature heuristic** indicating strong, well-separated cluster structure.
- It is **not** a universal mathematical threshold or physical law.
- The UI and documentation explicitly label $0.80$ as a **"Literature Reference Heuristic"** rather than an absolute mathematical requirement.

### 4.2 Trial Comparison Matrix
| Model Trial | Evaluated Population | Outlier Quarantined | Silhouette Score | Evaluation Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Trial 1 (Selected K=2)** | **3,021,434** | **Yes** | **0.81115** | **Strong structure (Selected Optimum)** |
| Trial 2 (K=3) | 3,021,434 | Yes | 0.51978 | Moderate structure |
| Trial 3 (K=4) | 3,021,434 | Yes | 0.57195 | Moderate structure |
| Trial 4 (K=3 Original) | 3,021,435 | No | 0.81060 | Historical baseline experiment |
| Trial 5 (K=4 Original) | 3,021,435 | No | 0.51970 | Historical baseline experiment |
| Trial 6 (K=5 Original) | 3,021,435 | No | 0.57056 | Historical baseline experiment |

---

## 5. Outlier Case Study & Counterfactual Governance (Tasks 3 & 4)

### 5.1 Outlier Account Profile
- **Account Identifier:** Masked public presentation: `usr_***849` (Telemetry ID `5123****49`).
- **Telemetry Profile:**
  - View Events: `7,429` (Platform Max; platform median is `2` views).
  - Sessions: `7,393` (Nearly 1 view per session).
  - Cart Additions: `0`
  - Purchase Events: `0`
  - Monetary Spend: `0.00` units
- **Neutral Terminology:** Formally classified as an **"Extreme Browsing Outlier"** rather than a "confirmed bot". While the ratio of 7,429 views with zero purchases and 7,393 single-view sessions strongly resembles automated indexing, network headers or user-agent logs were not captured; therefore, neutral scientific terminology is strictly maintained.

### 5.2 Model Impact: Illustrative Counterfactual Presentation
- In `OutlierCaseStudyPanel.tsx`, toggling to the "Outlier Included" state displays an **Illustrative Counterfactual**:
  - The counterfactual score of `0.81060` corresponds to the historical unsegregated baseline recorded in PySpark logs (`dashboard/app.py` line 432).
  - The UI explicitly labels this as an **"Illustrative Counterfactual · Historical Baseline Contrast"** to clarify that it represents an archived comparative experiment rather than a live dynamic retrain.
  - The account remains 100% preserved in the raw HDFS dataset ($42,349,874$ records) and upstream reporting tables.
