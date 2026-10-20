# CommerceIQ — M05 Known Limitations & Scientific Boundaries
**Milestone:** M05 — Final Application Polishing & Production Delivery  
**Document Purpose:** Academic Honesty, Methodological Scope & Scientific Disclosures  
**Status:** FORMALIZED  

---

## 1. Historical Data Scope & Analytical Nature

- **Descriptive Historical Showcase:** CommerceIQ is an interactive showcase grounded strictly in historical, precomputed analytical summaries derived from 42,349,874 verified events recorded during October 2019 (UTC).
- **Not a Live Streaming Engine:** The platform does not perform real-time Kafka or web-socket ingestion of live e-commerce transactions.
- **Not a Functioning Recommendation Engine:** The application does not generate personalized dynamic collaborative-filtering recommendations or next-item predictions for live shoppers. All analytical modules reflect completed descriptive research (Phase 7 PySpark outputs).

---

## 2. Temporal Semantics & Hourly Dynamics

- **Aggregate Peak Separation:** The 7-hour interval between the peak purchasing value hour (14:00 UTC, 17.53M units) and the peak browsing activity hour (21:00 UTC, 3.06M events) represents an **aggregate temporal distribution separation** across independent hourly bins.
- **Scientific Limitation:** This peak difference cannot be cited as empirical proof of an individual shopper's 7-hour browsing-to-purchase delay. Tracking individual checkout latencies would require session-level funnel timestamp delta modeling.

---

## 3. Unsupervised Machine Learning Boundaries

### 3.1 PCA Component Interpretations
- The 7 retained principal components account for 95.967% of standardized feature variance.
- **Scientific Limitation:** While PC1 loads heavily on total event volume (descriptive volume factor) and PC2 contrasts catalog exploration against price metrics (descriptive breadth factor), component interpretations represent mathematical feature weights, not deterministic psychological laws or causal customer intent.

### 3.2 K-Means Clustering Optimality
- K=2 was selected because it achieved the highest silhouette cohesion score (`0.81115`) across 6 documented sensitivity trials (K=2 through K=7).
- **Scientific Limitation:** K=2 is the **best evaluated configuration** under the documented empirical experiments; it cannot be claimed as an absolute global mathematical optimum across all conceivable distance metrics, kernel transformations, or hierarchical clustering algorithms.

### 3.3 Silhouette Score Reference Heuristics
- The silhouette threshold of 0.80 serves as a standard academic heuristic from clustering literature (Kaufman & Rousseeuw), indicating strong empirical cohesion. It is not an immutable natural constant.

---

## 4. Data Engineering & Cleaning Audit Boundaries

### 4.1 Unsegregated Cleaning Remainder (30,217 Records)
- Of the 98,890 net filtered records between raw CSV (42,448,764) and cleaned Parquet (42,349,874), exactly 68,673 are non-positive prices (`price <= 0.00`).
- The remaining **30,217 records** reflect multi-condition compound filtering in upstream PySpark scripts without granular individual log tags.
- **Scientific Limitation:** These 30,217 rows are preserved as an audited residual difference and must **not** be assumed to consist entirely of verified duplicates.

### 4.2 Deduplication Sample Audit Reconciliation
- Audit Sample A (1% Random Sample, 424,129 records) found 0 duplicates (0.0000%).
- Audit Sample B (1M Contiguous Event Block, 1,000,000 records) found 28 duplicates (0.0028%).
- **Scientific Limitation:** Full-corpus deduplication relies on distributed PySpark `dropDuplicates()` across all 9 schema columns, which executed within the 98,890 net filtered rows.

### 4.3 Categorical Missingness
- Missing category codes (13,515,601 rows, 31.91%) and unbranded products (6,117,080 rows, 14.44%) were preserved as explicit `"Unknown"` tokens.
- **Scientific Limitation:** No synthetic natural language imputation or heuristic category guessing was performed, ensuring platform revenue and event counts remain 100% faithful to the raw logs.
