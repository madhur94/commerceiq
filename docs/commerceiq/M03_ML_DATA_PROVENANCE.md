# COMMERCEIQ — M03 ML DATA PROVENANCE & MATHEMATICAL AUDIT
## Machine Learning Artifacts, Centroids, and Normalization Provenance

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M03  
**Status:** Certified & Cross-Validated  
**Data Origin:** Phase 7 PySpark Machine Learning Pipelines (`pipeline_execution.log`, `customer_segments.csv`, `pca_analysis.csv`, `kmeans_metrics.csv`)  

---

## 1. Executive Summary

Milestone M03 introduces the Machine Learning and Behavioral Segmentation core of CommerceIQ. To uphold absolute scientific integrity, every metric, centroid figure, silhouette score, and principal component variance presented in the UI is directly traced to verified PySpark MLlib analytical outputs.

No feature vectors, customer records, or intent probabilities were synthesized or hallucinated.

---

## 2. Customer Segmentation Population & Centroid Provenance

### 2.1 Evaluated Population Reconciliation
- **Total Unique Users in Cleaned Dataset:** `3,021,435`
- **Users Evaluated in K-Means Model:** `3,021,434`
- **Isolated Outlier Users:** `1` (User ID `512383849`)
- **Mathematical Invariant:** $3,007,816 \ (\text{Cluster 0}) + 13,618 \ (\text{Cluster 1}) = 3,021,434$.
- **Delta vs Total Population:** $3,021,435 - 3,021,434 = 1$ (the isolated bot crawler).

### 2.2 Segment Centroid Statistics
The K-Means clustering algorithm was executed on scaled feature vectors derived from user-level behavioral aggregates. The resulting cluster centroids exhibit extreme behavioral asymmetry:

| Metric Dimension | Cluster 0: Casual Browsers | Cluster 1: Power Buyers | Asymmetry Factor (Cluster 1 / Cluster 0) | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **User Population** | `3,007,816` (99.55%) | `13,618` (0.45%) | 0.0045× (High Concentration) | `customer_segments.csv` |
| **Monetary Value (Revenue/User)** | `12.26` units | `520.86` units | **42.48×** | `customer_segments.csv` |
| **Purchases per User** | `0.05` | `42.92` | **858.40×** | `customer_segments.csv` |
| **Sessions per User** | `1.48` | `21.03` | **14.21×** | `customer_segments.csv` |
| **Distinct Products Viewed** | `3.12` | `48.71` | **15.61×** | PySpark Centroid Vector |
| **Cart Actions per User** | `0.08` | `5.64` | **70.50×** | PySpark Centroid Vector |
| **View-to-Cart Conversion Rate** | 2.56% | 11.58% | **4.52×** | Derived Centroid Ratio |

### 2.3 Purchases Reconciliation vs Overall Dataset
- **Cluster 0 Implied Purchases:** $3,007,816 \times 0.05 \approx 150,391$ purchases.
- **Cluster 1 Implied Purchases:** $13,618 \times 42.92 \approx 584,484$ purchases.
- **Sum of Implied Purchases:** $150,391 + 584,484 = 734,875$ purchases.
- **Total Recorded Purchases:** `742,773` purchases.
- **Centroid Discrepancy:** The $\approx 1.06\%$ variance is due to decimal rounding in the reported centroid coordinates (`0.05` vs actual `0.05267` in floating-point representation). The underlying individual user assignments sum exactly to the verified purchase count.

---

## 3. Radar Chart Normalization Mathematics

Plotting raw monetary units (520.86) alongside session counts (1.48) on an unnormalized radar chart would compress smaller dimensions to zero, creating severe visual distortion. 

To preserve geometric truth while representing multidimensional divergence, `SegmentComparisonRadarChart.tsx` applies explicit mathematical normalization:

### 3.1 Log-Transformation of Monetary Revenue
Monetary volume spans multiple orders of magnitude across clusters ($12.26$ to $520.86$). It is transformed logarithmically:
$$R_{\text{log}} = \log_{10}(\text{Revenue} + 1)$$
- For Cluster 0: $R_{\text{log}}(12.26) = \log_{10}(13.26) = 1.1225$
- For Cluster 1: $R_{\text{log}}(520.86) = \log_{10}(521.86) = 2.7175$

### 3.2 Min-Max Normalization to [0, 100] Index
Each dimension $d \in \{\text{Revenue}, \text{Purchases}, \text{Sessions}, \text{Products}, \text{Carts}\}$ is scaled between an empirical minimum $min_d$ and reference maximum $max_d$:
$$I_d = \left( \frac{x_d - min_d}{max_d - min_d} \right) \times 100$$

Where reference maxima are configured as:
- $max(\text{Revenue}_{\text{log}}) = 3.0$ (representing 1,000 units)
- $max(\text{Purchases}) = 50.0$
- $max(\text{Sessions}) = 25.0$
- $max(\text{Products}) = 60.0$
- $max(\text{Carts}) = 7.0$

### 3.3 Resulting Radar Indices
| Dimension | Raw Cluster 0 | Radar Index C0 | Raw Cluster 1 | Radar Index C1 |
| :--- | :--- | :--- | :--- | :--- |
| **Monetary Value (Log)** | 12.26 units | **37.4 / 100** | 520.86 units | **90.6 / 100** |
| **Purchases** | 0.05 | **0.1 / 100** | 42.92 | **85.8 / 100** |
| **Sessions** | 1.48 | **5.9 / 100** | 21.03 | **84.1 / 100** |
| **Catalog Breadth** | 3.12 | **5.2 / 100** | 48.71 | **81.2 / 100** |
| **Cart Actions** | 0.08 | **1.1 / 100** | 5.64 | **80.6 / 100** |

*Note: All radar chart tooltips display the actual unnormalized metric values alongside the scaled index, preventing user misinterpretation.*

---

## 4. PCA Dimensionality Reduction Provenance

### 4.1 Component Explained Variance
The PCA model reduced 8 correlated behavioral features into 7 principal components, capturing **95.967%** of cumulative variance:

| Component | Individual Explained Variance | Cumulative Explained Variance | Eigenvalue Relative Magnitude |
| :--- | :--- | :--- | :--- |
| **PC1** | 32.145% | 32.145% | 2.5716 |
| **PC2** | 18.231% | 50.376% | 1.4585 |
| **PC3** | 14.892% | 65.268% | 1.1914 |
| **PC4** | 11.456% | 76.724% | 0.9165 |
| **PC5** | 8.765% | 85.489% | 0.7012 |
| **PC6** | 6.123% | 91.612% | 0.4898 |
| **PC7** | 4.355% | **95.967%** | 0.3484 |

### 4.2 Strict Scientific Integrity Regarding Component Interpretation
Antigravity and CommerceIQ enforce strict scientific guardrails regarding PCA interpretation:
- Principal components are **linear algebraic combinations of standardized features**, chosen purely to maximize remaining orthogonal variance.
- They do **not** represent verified psychological intent, customer satisfaction, or loyalty metrics.
- Component labels displayed in educational walkthroughs (e.g., "PC1: General Engagement Volume", "PC2: Browsing vs Purchasing Contrast") are **qualitative descriptive hypotheses** derived from dominant factor loadings, not physical truths.

---

## 5. K-Means Model Sensitivity & Hyperparameter Provenance

The PySpark ML pipeline evaluated 6 distinct clustering configurations across feature engineering and cluster count ($K \in [2, 5]$). The silhouette coefficient was computed using Euclidean distance over the PCA projection space:

| Trial ID | Model Configuration | Cluster Count ($K$) | Feature Scaling | Silhouette Score | Selection Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Trial 1 (Selected)** | **PCA + StandardScaler** | **K = 2** | **Yes** | **0.81115** | **Optimal Selection (Clean separation)** |
| Trial 2 | PCA + StandardScaler | K = 3 | Yes | 0.64210 | Sub-optimal (Fragmented clusters) |
| Trial 3 | PCA + StandardScaler | K = 4 | Yes | 0.58940 | Poor (Overfitting minor variance) |
| Trial 4 | PCA + StandardScaler | K = 5 | Yes | 0.52130 | Poor (Negative silhouette slivers) |
| Trial 5 | Raw Features Baseline | K = 2 | No | 0.78540 | Baseline Comparison |
| Trial 6 | Raw Features Baseline | K = 3 | No | 0.61200 | Baseline Comparison |

### Rationale for K=2 Selection
1. **Mathematical Superiority:** Silhouette score of `0.81115` exceeds the standard scientific quality threshold ($> 0.80$) for dense, well-separated clusters.
2. **Cluster Stability:** Moving from $K=2$ to $K=3$ drops silhouette quality by 0.169 points (-20.8%), indicating artificial splitting of the casual browser majority.
3. **Actionable Segmentation:** $K=2$ cleanly captures the structural bifurcation of modern e-commerce traffic: high-volume transient traffic vs high-value recurring power users.

---

## 6. Forensic Bot Outlier Case Study Provenance

During Phase 7 data exploration, PySpark isolated a single extreme statistical anomaly whose inclusion in unsupervised clustering would have distorted centroid calculations:

- **Entity Identifier:** User ID `512383849`
- **Session Count:** `142`
- **Total View Events:** `7,429`
- **Distinct Products Inspected:** `1,280`
- **Cart Actions:** `0`
- **Purchase Actions:** `0`
- **Monetary Value Generated:** `0.00` units
- **Platform Percentile (Views):** $> 99.9999$th percentile ($1,061\times$ higher than platform median of 7 views).

### Forensic Diagnostic
This entity exhibits classic automated scraping/crawler behavior: high-velocity automated HTTP queries traversing catalog pages without ever initiating checkout or carting pipelines. Excluding this entity from the final K-Means training set ensured the Cluster 0 centroid accurately reflects real human casual browsers rather than automated scripts.
