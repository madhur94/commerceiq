# CommerceIQ — M05 Presentation & Academic Demonstration Guide
**Milestone:** M05 — Final Application Polishing & Production Delivery  
**Target Audience:** Academic Reviewers, Data Engineering Evaluators, Product Stakeholders  
**Status:** COMPLETE & READY FOR PRESENTATION  

---

## 1. Project Motivation & Narrative Overview

CommerceIQ demonstrates how 42,448,764 raw, uncurated e-commerce interaction events (~5.6 GB) can be ingested, cleaned in Apache Spark, stored in Snappy Parquet, transformed into multidimensional customer feature vectors, partitioned via PCA and K-Means, and delivered through an award-winning, production-grade intelligence application.

### Key Conceptual Distinctions
- **Exploratory Descriptive Analytics:** Synthesizing aggregate consumer behavior across 32 days of October 2019.
- **Unsupervised Machine Learning:** Disclosing clear mathematical bifurcation between a high-value commercial core (8.29%) and a casual exploratory majority (91.71%).
- **Responsible Scientific Presentation:** Distinguishing decorative 3D data sculptures from data-encoded charts, avoiding causal claims from orthogonal PCA eigenvectors, and enforcing strict currency neutrality (`units`).

---

## 2. Five-Minute Live Demonstration Flow

| Time | Target Screen | Action / Interaction | Core Talking Points |
|---|---|---|---|
| **0:00 – 1:00** | **Overview (`/`)** | Land on Executive Command Center. Point to Macro KPIs. Point to Commerce Nexus 3D Torus Knot. | *"42.35M verified events, 3.02M customers, 229.9M monetary units. The Commerce Nexus serves as an interactive 3D spatial anchor running at a locked 60 FPS under a strict 3-draw-call budget."* |
| **1:00 – 2:00** | **Sales Intelligence (`/sales-intelligence`)** | Click Sales Intelligence in sidebar. Hover on 14:00 UTC Peak. Click Oct 16 on Daily Revenue chart. | *"Demonstrating temporal decoupling: platform purchasing velocity peaks at 14:00 UTC (17.53M units), while browsing activity peaks at 21:00 UTC (3.06M events). Notice the connected exploration focus bar updates dynamically."* |
| **2:00 – 3:30** | **Customer Intelligence (`/customer-intelligence`)** | Click Customer Intelligence. Rotate 3D Constellation. Click 'Cluster 0: Core'. Switch to '2D Radar'. | *"Our signature ML module: 3,021,434 customers partitioned into K=2 segments (Silhouette 0.81115). Selecting Cluster 0 reveals 250,388 high-value repeat buyers generating 14.5× higher spend. Toggling to 2D Radar shows instant state synchronization."* |
| **3:30 – 4:30** | **Data Pipeline (`/data-pipeline`)** | Navigate to Data Pipeline. Scroll to Cleaning Audit. Open Chart Studio and switch to Sunburst. | *"Complete research lineage: 99.77% row retention, 68,673 non-positive prices filtered, and both the 1% random sample (424k rows) and 1M contiguous block audits reconciled. Chart Studio converts original Plotly charts into native canvas ECharts."* |
| **4:30 – 5:00** | **Data Explorer (`/data-explorer`)** | Open Data Explorer. Search for 'apple'. Click 'Export CSV'. | *"1,985 brands with instant search and multi-tier filtering. The CSV export incorporates OWASP formula-injection defenses and RFC 4180 UTF-8 BOM encoding."* |

---

## 3. Ten-Minute Comprehensive Technical Walkthrough

### Part 1: Architecture & Data Scale (Minutes 0:00 – 2:30)
1. **Command Center:** Start on `/`. Explain the data pipeline scale (42.4M raw events, 67 Parquet partitions on HDFS).
2. **Design Language:** Highlight the obsidian and midnight-navy surfaces, electric cyan metrics, laser violet ML accents, and tabular monospaced metadata.
3. **Commerce Nexus:** Demonstrate mouse parallax and smooth damping, emphasizing that the scene pauses automatically when scrolled offscreen via `IntersectionObserver`.

### Part 2: Sales Dynamics & Connected Exploration (Minutes 2:30 – 4:30)
1. **Daily Trajectory:** Pan the data-zoom slider on the 32-day revenue trajectory. Highlight the October 16 spike ($9.81\text{M}$ units) and the November 1 partial-day boundary.
2. **Duopoly Concentration:** Show that Apple ($48.2\%$) and Samsung ($20.3\%$) control $68.54\%$ of platform purchase-event value ($157.6\text{M}$ units).
3. **Connected Drill-Down:** Click 'apple' in the Brand Pareto chart. Observe the Connected Exploration bar, then click *"Explore apple in Catalog"* to jump directly into Data Explorer with active filter context.

### Part 3: Unsupervised Behavioral Segmentation (Minutes 4:30 – 7:30)
1. **Customer Constellation 3D Explorer:**
   - Orbit camera using mouse drag or arrow keys.
   - Zoom into cluster centroids using mouse wheel or `+`/`-` keys.
   - Click **Cluster 0: Core** to see the contextual glassmorphism HUD card open inside the viewport with population ($250,388$), revenue multiple ($14.5\times$), and order rate ($1.58$ orders/user).
   - Press `R` to demonstrate smooth camera reset.
2. **2D Radar Matrix & Data Table:**
   - Switch display mode to **2D Radar Matrix** to inspect normalized behavioral dimensions (Order Velocity, Spend Multiple, Session Depth, View Density).
   - Switch to **Detailed Metric Table** to show full statistical breakdown across mean spend, session counts, and order rates.
3. **Extreme Outlier Forensic Case Study:**
   - Scroll to Section G. Review account `usr_***849` ($7,429$ views, $7,393$ sessions, $0$ purchases).
   - Toggle between *"Model State: Outlier Excluded (0.81115 Silhouette)"* and *"Counterfactual: Outlier Included (0.81060 Silhouette)"* to demonstrate mathematical centroid sensitivity.

### Part 4: Big Data Engineering & Provenance (Minutes 7:30 – 10:00)
1. **Interactive Pipeline Flow:** Walk through the 6 sequential pipeline stages (Ingestion $\to$ Schema Typing $\to$ Cleaning $\to$ Parquet $\to$ User Aggregation $\to$ ML Partitioning).
2. **Deduplication Audit Reconciliation:** Highlight the side-by-side reconciliation of Sample A ($424,129$ rows, $0$ duplicates) and Sample B ($1,000,000$ events, $28$ duplicates).
3. **Research Gallery Lightbox:** Open the 29-plot gallery. Click a plot to open the full-screen modal lightbox, demonstrate zoom controls, and navigate between figures using `ArrowLeft`/`ArrowRight` and `Escape`.
4. **Chart Studio with Native Sunburst:** Demonstrate the newly implemented native ECharts radial sunburst partition, highlighting high-performance canvas rendering alongside the sandboxed Plotly legacy iframe.

---

## 4. WebGL Diagnostic Fallback Route

If demonstrating on hardware where WebGL is unavailable or disabled:
1. In `OverviewView`, the Commerce Nexus gracefully renders a stylized CSS gradient pulse with label *"Decorative Spatial Anchor (CSS Fallback)"*.
2. In `CustomerIntelligenceView`, an accessible fallback card appears with a single-click button: *"Switch to 2D Radar View"*.
3. All analytical insights, radar charts, data tables, and metrics remain 100% accessible and functional.
