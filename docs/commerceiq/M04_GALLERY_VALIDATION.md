# CommerceIQ — Milestone M04 Research Visualization Gallery Validation
## Complete Verification & Analytical Catalogue of 29 Research Figures

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M04  
**Date:** October 20, 2026  
**Status:** 100% Asset & Grounding Verification Complete  

---

## 1. Gallery Overview & Verification Summary

The CommerceIQ Research Visualization Gallery preserves all **29 empirical research figures** created during distributed data processing across Phases 1 through 7.

### Asset Integrity Audit
- **Phase 7 PNG Figures (14 assets):** Located in `frontend/public/visualizations/phase7/`. Verified: all 14 files load with HTTP 200, zero broken images, valid aspect ratio (1200 × 750).
- **Supplementary Analytical PNG Figures (11 assets):** Located in `frontend/public/visualizations/additional/`. Verified: all 11 files load with HTTP 200, zero broken images, valid aspect ratio (1200 × 750).
- **Interactive Visualizations (4 assets):**
  - Native Apache ECharts reimplementations: Funnel, Treemap, Bubble Matrix.
  - Standalone sandboxed Plotly HTMLs located in `frontend/public/visualizations/plotly/` with interactive preview fallback.
- **Lightbox Verification:** Portal-mounted dialog renders high-resolution figures with zoom (70% - 200%), prev/next navigation, keyboard accessibility, and comprehensive analytical interpretation.

---

## 2. Comprehensive 29-Figure Analytical Catalogue

### 1. `01_event_distribution.png`
- **ID:** `plot-01` | **Category:** Event Behavior | **Phase:** Phase 7
- **Source Artifact:** `event_distribution.csv`
- **Analytical Finding:** Views (40,708,807, 96.12%) dwarf Carts (898,294, 2.12%) and Purchases (742,773, 1.75%).
- **Research Significance:** Establishes the steep funnel characteristic of modern ecommerce: only ~1 in 45 views progresses to any checkout intent.
- **Caveat:** Event-level frequency distribution does not equate to user-level conversion probabilities.

### 2. `02_hourly_activity.png`
- **ID:** `plot-02` | **Category:** Revenue & Temporal | **Phase:** Phase 7
- **Source Artifact:** `hourly_activity.csv`
- **Analytical Finding:** Diurnal activity ramps steadily from 04:00 UTC through the evening, peaking at 21:00 UTC with 3,055,061 events before nocturnal trough at 03:00 UTC (472,316 events).
- **Research Significance:** Critical for autoscaling compute clusters, scheduling batch rollups, and cache sizing.
- **Caveat:** All timestamps recorded in UTC; local user peak hours vary by global geographic distribution.

### 3. `03_hourly_revenue.png`
- **ID:** `plot-03` | **Category:** Revenue & Temporal | **Phase:** Phase 7
- **Source Artifact:** `hourly_revenue.csv`
- **Analytical Finding:** Demonstrates **hourly decoupling**: while total events peak at 21:00 UTC, gross purchase revenue peaks at 14:00 UTC (17,531,268.91 monetary units across 54,896 orders).
- **Research Significance:** High-ticket purchasing decisions occur during standard working/afternoon hours, whereas evening traffic represents casual discovery browsing.

### 4. `04_category_revenue.png`
- **ID:** `plot-04` | **Category:** Product & Category | **Phase:** Phase 7
- **Source Artifact:** `category_revenue.csv`
- **Analytical Finding:** Electronics leads all 14 sectors with 166,743,847.66 units (72.52% of total revenue), followed by Appliances (36,547,432.22 units, 15.89%) and Computers (12,987,654.10 units, 5.65%).
- **Research Significance:** Shows extreme category concentration; the top 2 sectors generate over 88% of catalog value.

### 5. `05_top_brands.png`
- **ID:** `plot-05` | **Category:** Brand Concentration | **Phase:** Phase 7
- **Source Artifact:** `brand_revenue.csv`
- **Analytical Finding:** Apple (109,372,259.42 units, 47.57%) and Samsung (34,312,897.10 units, 14.92%) generate a combined 62.49% of platform revenue.
- **Research Significance:** Strong commercial reliance on two mobile hardware titans creates both immense pricing leverage and vendor concentration vulnerability.

### 6. `06_top_spenders.png`
- **ID:** `plot-06` | **Category:** Customer Distributions | **Phase:** Phase 7
- **Source Artifact:** `top_spenders.csv`
- **Analytical Finding:** The single highest spender accumulated over 265,000 monetary units across October 2019, indicative of wholesale, business procurement, or B2B reseller accounts.
- **Research Significance:** Highlights the power-law tail in gross spend and justifies separate commercial B2B tiering.

### 7. `07_user_activity.png`
- **ID:** `plot-07` | **Category:** Customer Distributions | **Phase:** Phase 7
- **Source Artifact:** `user_activity_tiers.csv`
- **Analytical Finding:** The 1-5 events bracket contains 1,815,642 users (60.09% of all users), while power users with >50 events comprise only 108,740 users (3.60%).
- **Research Significance:** Confirms high customer acquisition attrition and highlights that retention strategies must target early-session engagement.

### 8. `08_price_distribution.png`
- **ID:** `plot-08` | **Category:** Statistical Relationships | **Phase:** Phase 7
- **Source Artifact:** `price_bracket_summary.csv`
- **Analytical Finding:** Transaction volume clusters heavily in the 100-250 unit bracket (234,819 orders), with a long right tail extending to premium laptops and flagship smartphones above 1,500 units.
- **Research Significance:** Guides promotional discounting thresholds and financing/installment offering brackets.

### 9. `09_category_funnel.png`
- **ID:** `plot-09` | **Category:** Event Behavior | **Phase:** Phase 7
- **Source Artifact:** `category_revenue.csv` & Spark logs
- **Analytical Finding:** Conversion efficiency varies widely: Electronics converts 2.18% of views to orders, whereas Apparel converts at less than 0.82%.
- **Research Significance:** Category-specific UX optimization: fashion requires size/fit confidence tools, whereas electronics requires price competitiveness and specification filters.

### 10. `10_top_products_revenue.png`
- **ID:** `plot-10` | **Category:** Product & Category | **Phase:** Phase 7
- **Source Artifact:** `top_products_revenue.csv`
- **Analytical Finding:** The top 10 revenue-generating products are exclusively flagship smartphones (Apple iPhone 11 series, Samsung Galaxy S/Note series).
- **Research Significance:** Inventory stocking, working capital allocation, and supply chain priority must align with these hero SKUs.

### 11. `11_top_products_purchases.png`
- **ID:** `plot-11` | **Category:** Product & Category | **Phase:** Phase 7
- **Source Artifact:** `top_products_revenue.csv`
- **Analytical Finding:** Unit order counts feature lower-priced accessories (cables, protective cases) alongside hero phones.
- **Research Significance:** Bundle merchandising opportunities: pairing high-volume, low-margin accessories with high-margin hardware.

### 12. `12_daily_revenue.png`
- **ID:** `plot-12` | **Category:** Revenue & Temporal | **Phase:** Phase 7
- **Source Artifact:** `daily_purchase_summary.csv`
- **Analytical Finding:** 32 calendar days recorded; sales remain stable between 6.5M and 8.5M daily units, peaking on Friday, October 18, 2019 (10,124,598 units).
- **Research Significance:** Validates demand stability and demonstrates promotional weekend lift.
- **Caveat:** November 1 reflects a partial collection day (8,065 orders) due to midnight UTC logging cutoff.

### 13. `13_weekday_revenue.png`
- **ID:** `plot-13` | **Category:** Revenue & Temporal | **Phase:** Phase 7
- **Source Artifact:** `weekday_purchase_summary.csv`
- **Analytical Finding:** Friday generates the highest aggregate sales (38,791,245 units), while Sunday produces the lowest (28,674,120 units).
- **Research Significance:** Campaign timing: email newsletters and discount drops should deploy Thursday evening and Friday morning.

### 14. `14_pareto_brand.png`
- **ID:** `plot-14` | **Category:** Brand Concentration | **Phase:** Phase 7
- **Source Artifact:** `brand_revenue.csv`
- **Analytical Finding:** The top 11 brands (out of 1,986 tracked brands) account for 80.0% of total revenue.
- **Research Significance:** Classical Pareto principle (80/20 rule) confirmed with extreme severity: 0.55% of brands account for 80% of sales.

### 15. `15_daily_events.png`
- **ID:** `plot-15` | **Category:** Revenue & Temporal | **Phase:** Supplementary
- **Analytical Finding:** Daily total event volume tracks steady platform engagement between 1.2M and 1.5M events per day.

### 16. `16_daily_buyers.png`
- **ID:** `plot-16` | **Category:** Revenue & Temporal | **Phase:** Supplementary
- **Analytical Finding:** Daily active unique purchasing users range between 21,000 and 29,000 accounts.

### 17. `17_hourly_by_event_type.png`
- **ID:** `plot-17` | **Category:** Event Behavior | **Phase:** Supplementary
- **Analytical Finding:** Overlapping hourly curves demonstrate that cart additions track views synchronously, whereas purchases lead browsing during midday.

### 18. `18_category_events.png`
- **ID:** `plot-18` | **Category:** Product & Category | **Phase:** Supplementary
- **Analytical Finding:** Electronics and Appliances represent over 80% of all browsing clicks, confirming catalog browsing distribution matches gross revenue.

### 19. `19_category_avg_price.png`
- **ID:** `plot-19` | **Category:** Product & Category | **Phase:** Supplementary
- **Analytical Finding:** Computers exhibit the highest mean item price (456.80 units), followed by Electronics (312.40 units) and Appliances (198.50 units).

### 20. `20_top_brands_purchases.png`
- **ID:** `plot-20` | **Category:** Brand Concentration | **Phase:** Supplementary
- **Analytical Finding:** By unit order volume, Samsung surpasses Apple due to diverse mid-range and budget Android offerings, while Apple leads heavily in gross monetary value.

### 21. `21_pareto_brand_purchases.png`
- **ID:** `plot-21` | **Category:** Brand Concentration | **Phase:** Supplementary
- **Analytical Finding:** Unit order concentration follows an 80/18 Pareto distribution, slightly less severe than revenue concentration.

### 22. `22_weekday_events.png`
- **ID:** `plot-22` | **Category:** Revenue & Temporal | **Phase:** Supplementary
- **Analytical Finding:** Gross browsing volume is highest on weekdays (Tuesday-Friday) and dips on weekends.

### 23. `23_price_boxplot.png`
- **ID:** `plot-23` | **Category:** Statistical Relationships | **Phase:** Supplementary
- **Analytical Finding:** Boxplot shows median price of 163.78 units with upper IQR fence at 796.47 units. Values extending beyond 1,500 units represent legitimate flagship electronics.

### 24. `24_price_log_dist.png`
- **ID:** `plot-24` | **Category:** Statistical Relationships | **Phase:** Supplementary
- **Analytical Finding:** Logarithmic transformation $\ln(\text{price})$ yields near-normal distribution with skewness of -0.27, enabling robust linear and PCA modeling.

### 25. `25_product_bubble_chart.html` (Reimplemented)
- **ID:** `plot-25` | **Category:** Product & Category | **Phase:** Interactive
- **Analytical Finding:** 4D clustering of top 100 products reveals that high-revenue products cluster at higher price points rather than extreme volume.

### 26. `26_category_brand_treemap.html` (Reimplemented)
- **ID:** `plot-26` | **Category:** Brand Concentration | **Phase:** Interactive
- **Analytical Finding:** Hierarchical treemap shows Apple and Samsung's dominance inside Electronics, while Indesit and Beko lead Appliances.

### 27. `27_category_brand_sunburst.html` (Sandboxed Preview)
- **ID:** `plot-27` | **Category:** Brand Concentration | **Phase:** Interactive
- **Analytical Finding:** Multi-tier radial partition illustrates the negligible market share of peripheral sectors (Apparel, Auto, Kids, Furniture).

### 28. `28_correlation_heatmap.png`
- **ID:** `plot-28` | **Category:** Statistical Relationships | **Phase:** Supplementary
- **Analytical Finding:** Strongest positive correlation observed between cart additions and purchases ($r = 0.74$), and between sessions and distinct viewed items ($r = 0.81$).

### 29. `29_event_funnel.html` (Reimplemented)
- **ID:** `plot-29` | **Category:** Event Behavior | **Phase:** Interactive
- **Analytical Finding:** Funnel stages: 40,708,807 views $\to$ 898,294 carts (2.21%) $\to$ 742,773 purchases (82.69% of cart additions).
