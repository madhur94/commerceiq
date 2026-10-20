# CommerceIQ — Milestone M04 Source Artifact Inventory
## Comprehensive Registry of Typed Research Artifacts & Visualizations

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M04  
**Date:** October 20, 2026  
**Status:** Grounded in Primary Research Assets  

---

## 1. Overview

This document provides an exhaustive, authoritative registry of all **18 typed research datasets** and **29 research visualizations** supporting the CommerceIQ intelligence suite. Every analytical figure, KPI card, and interactive chart in the application traces directly to these documented artifacts.

---

## 2. Typed Data Lineage Artifact Registry (18 Artifacts)

| Artifact ID | Display Name | Source Filename | Storage Path | Format | Research Phase | Record Count | File Size | Status | Downstream Views |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ART-01** | Raw Clickstream Telemetry CSV | `2019-Oct.csv` | `hdfs:///ecommerce/raw/` | CSV (UTF-8) | Phase 1: Ingestion | 42,448,764 | 5.6 GB | `baseline` | Data Pipeline, Data Explorer |
| **ART-02** | Cleaned Columnar Parquet Master | `2019-Oct.parquet` | `hdfs:///ecommerce/cleaned/` | Parquet (Snappy) | Phase 3 & 4: Storage | 42,349,874 | 1.4 GB | `verified` | All Analytical Views |
| **ART-03** | Event Type Distribution Rollup | `event_distribution.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 3 | 63 B | `verified` | Overview, Pipeline, Explorer |
| **ART-04** | Hourly Activity Frequency Matrix | `hourly_activity.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 24 | 290 B | `verified` | Sales Intelligence, Overview |
| **ART-05** | Hourly Purchase Revenue Matrix | `hourly_revenue.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 24 | 508 B | `verified` | Sales Intelligence |
| **ART-06** | Category Order & Revenue Aggregates | `category_revenue.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 14 | 600 B | `verified` | Sales Intelligence, Overview |
| **ART-07** | Brand Commercial Revenue Ranking | `brand_revenue.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 1,986 | 50.5 kB | `verified` | Sales Intelligence, Overview |
| **ART-08** | Daily Purchase & Revenue Timeseries | `daily_purchase_summary.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 32 | 1.2 kB | `verified` | Overview, Sales Intelligence |
| **ART-09** | Weekday Purchase & Activity Summary | `weekday_purchase_summary.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 7 | 278 B | `verified` | Sales Intelligence |
| **ART-10** | Top 100 Products Purchase Revenue | `top_products_revenue.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 100 | 4.6 kB | `verified` | Sales Intelligence, Pipeline |
| **ART-11** | Top Spender Commercial Accounts | `top_spenders.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 10 | 412 B | `verified` | Customer Intelligence |
| **ART-12** | Category & Brand Revenue Cross-Tab | `category_brand_revenue.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 159 | 6.8 kB | `verified` | Sales Intelligence, Pipeline |
| **ART-13** | Price Bracket Transaction Frequencies | `price_bracket_summary.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 6 | 245 B | `verified` | Sales Intelligence |
| **ART-14** | User Activity Frequency Tiers | `user_activity_tiers.csv` | `results/phase7/` | CSV Summary | Phase 7: Analytics | 5 | 198 B | `verified` | Customer Intelligence |
| **ART-15** | PCA Cumulative Variance Retained | `pca_variance.csv` | `results/phase6/` | CSV Summary | Phase 6: ML Prep | 7 | 215 B | `verified` | Customer Intelligence |
| **ART-16** | Selected K-Means Cluster Profiles | `kmeans_cluster_profiles.csv` | `results/phase6/` | CSV Summary | Phase 6: ML Models | 2 | 280 B | `verified` | Customer Intelligence, Overview |
| **ART-17** | K-Means Model Sensitivity Metrics | `kmeans_sensitivity.csv` | `results/phase6/` | CSV Summary | Phase 6: ML Models | 7 | 320 B | `verified` | Customer Intelligence |
| **ART-18** | End-to-End Spark Pipeline Notebook | `eda_clustering_pipeline.ipynb` | `notebooks/` | Jupyter Notebook | Complete Lifecycle | 84 cells | 1.2 MB | `derived` | Data Pipeline |

---

## 3. Research Visualization Gallery Inventory (29 Items)

The application catalogs **29 empirical research figures** copied directly into the frontend public directory (`frontend/public/visualizations/`) and accessible without external dependencies.

### A. Phase 7 Summary Visualizations (14 PNGs)

| Plot ID | Title | File Path | Category | Dimensions | Research Significance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **plot-01** | Event Type Distribution | `phase7/01_event_distribution.png` | Event Behavior | 1200 × 750 | Demonstrates extreme asymmetry: Views (96.12%), Carts (2.12%), Purchases (1.75%). |
| **plot-02** | Hourly Activity Profile (UTC) | `phase7/02_hourly_activity.png` | Revenue & Temporal | 1200 × 750 | Tracks diurnal traffic ramp, peaking at 21:00 UTC (3.05M events). |
| **plot-03** | Hourly Purchase Revenue Profile | `phase7/03_hourly_revenue.png` | Revenue & Temporal | 1200 × 750 | Demonstrates hourly decoupling; peak revenue at 14:00 UTC (17.5M units). |
| **plot-04** | Category Revenue Breakdown | `phase7/04_category_revenue.png` | Product & Category | 1200 × 750 | Electronics leads catalog revenue with 166.7M units (72.5%). |
| **plot-05** | Top 10 Commercial Brands Revenue | `phase7/05_top_brands.png` | Brand Concentration | 1200 × 750 | Apple (109.4M) and Samsung (34.3M) account for 62.5% of total revenue. |
| **plot-06** | Top 10 Spender Accounts | `phase7/06_top_spenders.png` | Customer Distributions | 1200 × 750 | Highlights highest cumulative purchase accounts during October 2019. |
| **plot-07** | User Activity Frequency Tiers | `phase7/07_user_activity.png` | Customer Distributions | 1200 × 750 | 5 tiers: 1-5 events bracket contains 60.1% of all users (1.82M users). |
| **plot-08** | Purchase Counts across Price Ranges | `phase7/08_price_distribution.png` | Statistical Relationships | 1200 × 750 | High volume in 100-250 price bracket; long-tail luxury electronics. |
| **plot-09** | Category Event Conversion Funnel | `phase7/09_category_funnel.png` | Event Behavior | 1200 × 750 | Conversion rates by category: Electronics shows highest purchase conversion. |
| **plot-10** | Top 10 Products by Purchase Revenue | `phase7/10_top_products_revenue.png` | Product & Category | 1200 × 750 | Flagship smartphones dominate gross sales revenue. |
| **plot-11** | Top 10 Products by Purchase Events | `phase7/11_top_products_purchases.png`| Product & Category | 1200 × 750 | Unit sales volume leaderboards across consumable accessories and phones. |
| **plot-12** | Daily Purchase Revenue Timeseries | `phase7/12_daily_revenue.png` | Revenue & Temporal | 1200 × 750 | 32 daily date points; peak sales on October 18, 2019 (10.1M units). |
| **plot-13** | Weekday Revenue Distribution | `phase7/13_weekday_revenue.png` | Revenue & Temporal | 1200 × 750 | Friday generates highest sales (38.8M units); Sunday is lowest (28.7M units). |
| **plot-14** | Brand Revenue Pareto Cumulative | `phase7/14_pareto_brand.png` | Brand Concentration | 1200 × 750 | Pareto principle confirmed: top 11 brands generate 80% of total catalog revenue. |

### B. Supplementary Analytical Visualizations (11 PNGs)

| Plot ID | Title | File Path | Category | Dimensions | Research Significance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **plot-15** | Daily Event Activity Timeseries | `additional/15_daily_events.png` | Revenue & Temporal | 1200 × 750 | Overall clickstream velocity by day, tracking traffic stability across October. |
| **plot-16** | Daily Unique Buyers Timeseries | `additional/16_daily_buyers.png` | Revenue & Temporal | 1200 × 750 | Unique buyer accounts active per calendar day. |
| **plot-17** | Hourly Activity by Event Type | `additional/17_hourly_by_event_type.png`| Event Behavior | 1200 × 750 | Decomposed hourly curves for views, carts, and purchases. |
| **plot-18** | Category Event Breakdown | `additional/18_category_events.png` | Product & Category | 1200 × 750 | Gross clickstream interaction counts per catalog sector. |
| **plot-19** | Category Average Product Price | `additional/19_category_avg_price.png`| Product & Category | 1200 × 750 | Mean logged item price across departments (Computers highest average price). |
| **plot-20** | Top Brands by Purchase Events | `additional/20_top_brands_purchases.png`| Brand Concentration | 1200 × 750 | Unit order counts by brand; Samsung leads Apple in unit count. |
| **plot-21** | Brand Pareto by Purchase Events | `additional/21_pareto_brand_purchases.png`| Brand Concentration | 1200 × 750 | Pareto curve applied to order volumes rather than currency value. |
| **plot-22** | Weekday Event Activity Distribution | `additional/22_weekday_events.png` | Revenue & Temporal | 1200 × 750 | Interaction volume across Monday through Sunday. |
| **plot-23** | Price Outlier Boxplot Diagnostics | `additional/23_price_boxplot.png` | Statistical Relationships | 1200 × 750 | Visualizing IQR fence (796.47) and extreme price values. |
| **plot-24** | Price Log-Transformed Distribution | `additional/24_price_log_dist.png` | Statistical Relationships | 1200 × 750 | Demonstrates normalization of skewed price distribution (skewness: -0.27). |
| **plot-28** | Correlation Heatmap of Features | `additional/28_correlation_heatmap.png`| Statistical Relationships | 1200 × 750 | Pearson correlation matrix across numerical event and user features. |

### C. Interactive Chart Artifacts (4 Reimplementations & Sandboxes)

| Plot ID | Title | File Path | Category | Interactive Engine | Analytical Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **plot-25** | Top 100 Products Bubble Matrix | `plotly/25_product_bubble_chart.html` | Product & Category | Native ECharts & Sandbox | 100 products (Purchases, Revenue, Buyers, Avg Price). |
| **plot-26** | Category & Brand Revenue Treemap | `plotly/26_category_brand_treemap.html`| Brand Concentration | Native ECharts & Sandbox | 159 hierarchical nodes (9 sectors, 150 brands). |
| **plot-27** | Category & Brand Revenue Sunburst | `plotly/27_category_brand_sunburst.html`| Brand Concentration | Sandboxed Plotly Preview | Radial multi-tier decomposition of market share. |
| **plot-29** | Event Conversion Funnel | `plotly/29_event_funnel.html` | Event Behavior | Native ECharts & Sandbox | 40.7M views → 898K carts → 743K purchases. |

---

## 4. Integrity and Asset Location

All static visualization files reside under:
`frontend/public/visualizations/`

They are referenced via standard absolute web paths (`/visualizations/...`), guaranteeing that Vite copies them verbatim into `frontend/dist/visualizations/` during production builds with zero bundling overhead.
