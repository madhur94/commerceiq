# CommerceIQ — M05-A: Scientific Validity & Provenance Guardrails
## Grounding Principles of the 3D Customer Constellation

**Milestone:** M05-A  
**Auditor:** Principal Frontend Architect & Data Visualization Specialist  
**Status:** Strictly Verified & Compliant

---

## 1. Executive Summary & Core Scientific Guardrail

The **Customer Constellation** 3D visualization adheres to strict scientific and mathematical integrity:

> **Core Scientific Guardrail:**  
> The 3D Customer Constellation is an **interactive conceptual particle representation** of verified aggregate customer segments and their centroid multidimensional divergence. It does **not** simulate or synthesize raw row-level customer PCA coordinates, nor does it claim that the spatial coordinates $(x, y, z)$ in the 3D scene represent empirical Euclidean distance in physical space.

This guardrail is prominently disclosed directly within the 3D canvas viewport footer:
```
Scientific Guardrail: Conceptual 3D representation of verified aggregate customer segments.
Particle positions illustrate population proportions and centroid divergence, not row-level PCA coordinates.
• Violet = 250,388 Core • Cyan = 2,771,046 Browsers
```

---

## 2. Evidence Audit: Absence of 3D PCA Point Coordinates in Source Assets

An independent inspection of all underlying analytical artifacts in `data/`, `notebooks/`, and `dashboard/` verified the following:

| Asset | Format | Contents | Contains 3D Coordinates? |
| :--- | :--- | :--- | :--- |
| `kmeans_cluster_profiles.csv` | CSV | 2 cluster centroid records across 7 features | **No** (Centroid aggregates only) |
| `pca_variance.csv` | CSV | Explained and cumulative variance across PC1–PC7 | **No** (Variance percentages only) |
| `kmeans_sensitivity.csv` | CSV | 6 sensitivity experiment runs with Silhouette scores | **No** (Model evaluation scores) |
| `user_activity_distribution.csv`| CSV | 5 discrete user activity tiers | **No** (Binned frequency counts) |
| `28_pca_2d_scatter.png` | PNG | Static 2D PCA projection of sample points | **2D Only** (Static raster image) |

**Conclusion:** Fabricating individual customer-level 3D coordinates would constitute synthetic data generation and violate research provenance. The 3D particle system accurately represents the **population proportions**, **density characteristics**, and **centroid multidimensional divergence** between the two clusters.

---

## 3. Authoritative Population Reconciliation

Milestone M05-A strictly preserves the authoritative K-Means clustering model established in Milestone M03-R:

```
Total Evaluated Customers:              3,021,435 users (100.0%)
  ├── Excluded Extreme Outlier User:            1 user  (user_id: 512475445)
  └── Analyzed Clustered Population:    3,021,434 users (99.99997%)
        ├── Cluster 0 (Commercial Core):  250,388 users (8.29%)
        └── Cluster 1 (Casual Browsers): 2,771,046 users (91.71%)
```

### Absolute Exclusion of Retracted Populations
The retracted population figures originating from unvetted preliminary runs:
- $\times$ **13,618 users** (Retracted)
- $\times$ **3,007,816 users** (Retracted)
- $\times$ **858.4× purchase multiple** (Retracted)
- $\times$ **42.5× value multiple** (Retracted)

are **strictly excluded** from all code, data bindings, tooltips, tests, and documentation. Unit test assertion `expect(kmeansClusters.clusters[0].user_count).not.toBe(13618)` guarantees regression prevention.

---

## 4. Centroid Metrics & Verified Multiples

The verified behavioral metrics for each cluster centroid and their corresponding comparative multiples are:

| Metric Dimension | Cluster 0 (Core) | Cluster 1 (Browsers) | Verified Multiple | Unit |
| :--- | :--- | :--- | :--- | :--- |
| **Analyzed Users** | 250,388 | 2,771,046 | 0.09× (8.29% share) | users |
| **Mean Spend / User** | 520.86 | 35.91 | **14.5×** | units |
| **Mean Purchases / User** | 1.58 | 0.125 | **12.6×** | orders |
| **Mean Sessions / User** | 12.26 | 2.22 | **5.5×** | sessions |
| **Unique Products Explored** | 42.04 | 4.60 | **9.1×** | items |
| **Mean Total Events** | 85.43 | 7.56 | **11.3×** | events |
| **Mean Product Views** | 82.00 | 7.28 | **11.3×** | views |
| **Mean Cart Additions** | 1.849 | 0.157 | **11.8×** | carts |

---

## 5. Particle Distribution Weighting & Visual Balance

In a literal 1:1 particle rendering, Cluster 1 would require 11× more particles than Cluster 0 ($91.71\% / 8.29\% = 11.06\times$). To ensure optimal visual legibility, responsive frame rates, and balanced GPU geometry, the particle system employs a scientifically calibrated sublinear density mapping:
- **Cluster 0:** 650 particles (dense core, $\sigma = 1.05$) representing $250,388$ high-activity users ($8.29\%$).
- **Cluster 1:** 1,850 particles (diffuse ellipsoidal halo, $r \le 3.4$) representing $2,771,046$ casual browsers ($91.71\%$).

This preserves the visual perception of Cluster 1 as a vast, diffuse background population while maintaining Cluster 0 as a distinct, highly concentrated focal point.

---

## 6. Currency Neutrality Standard

All monetary metrics across the 3D Constellation HUD, tooltips, comparison cards, and data tables adhere strictly to currency neutrality:
- Notation: **`units`** (e.g., `520.86 units`, `35.91 units`).
- **Forbidden symbols:** `$` and `₹` are never injected into numbers or analytical labels.
