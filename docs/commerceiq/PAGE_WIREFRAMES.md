# CommerceIQ — Page Wireframe & UX Interaction Specifications

**Document ID:** `CIQ-M00-WIREFRAMES`  
**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Author:** Principal UI/UX Designer & Creative Frontend Architect  

---

## 1. Global Navigation Shell & Wireframe Architecture

The CommerceIQ user interface operates within a persistent, responsive command shell designed for seamless transitions between all 6 analytical domains.

```
+-------------------------------------------------------------------------------------------------------+
| [C] COMMERCEIQ  | [Search metrics, brands, categories...] (Ctrl+K)   | [● Verified 42.3M] [Docs] [?] |
+-------+-----------------------------------------------------------------------------------------------+
|       | BREADCRUMBS: Suite > Overview                                              [Export] [Oct 2019]|
| [ = ] |-----------------------------------------------------------------------------------------------|
|  NAV  |                                                                                               |
|       |                                                                                               |
| [ 1 ] |                                                                                               |
| OVER- |                                   PAGE VIEWPORT CONTENT                                       |
| VIEW  |                                                                                               |
|       |                                                                                               |
| [ 2 ] |                                                                                               |
| SALES |                                                                                               |
|       |                                                                                               |
| [ 3 ] |                                                                                               |
| CUST- |                                                                                               |
| OMER  |                                                                                               |
|       |                                                                                               |
| [ 4 ] |                                                                                               |
| DATA  |                                                                                               |
|       |                                                                                               |
| [ 5 ] |                                                                                               |
|  ML   |                                                                                               |
|       |                                                                                               |
| [ 6 ] |                                                                                               |
| PIPE- |                                                                                               |
| LINE  |                                                                                               |
|       |                                                                                               |
+-------+-----------------------------------------------------------------------------------------------+
| [Col] | ASBD Project Companion  •  Apache Spark & HDFS Verified Artifacts  •  Precomputed Engine      |
+-------+-----------------------------------------------------------------------------------------------+
```

### 1.1 Persistent Shell Specifications
* **Sidebar (`w-64` expanded, `w-20` collapsed):**
  * Brand Logo: Hexagonal abstract data cube with violet-to-cyan gradient.
  * Nav Items: 6 core routes with Lucide icons (`LayoutDashboard`, `TrendingUp`, `Users`, `TableProperties`, `Binary`, `GitBranch`).
  * Status Pill: Pipeline status indicator (`Engine: Ready`, `Parquet: Verified`).
* **Header Bar (`h-16`, Sticky, Backdrop-blur-md):**
  * Search bar with instant keyboard shortcut (`Cmd/Ctrl + K`) for quick-jumping to brands or categories.
  * Dataset context pill: `October 2019 (31 Days + UTC Boundary)`.
  * Quick-links: Direct access to the Technical PDF Report and Methodology docs.

---

## 2. Screen 1: Overview (Executive Command Center)

The signature experience introduces an immediate sense of scale, combining high-level macro KPIs, an interactive 3D WebGL data torus, and immediate drill-down visual paths.

### 2.1 Screen Layout Wireframe
```
+-------------------------------------------------------------------------------------------------------+
| HERO SECTION: COMMERCE INTELLIGENCE NEXUS                                                             |
| +---------------------------------------------------------+ +---------------------------------------+ |
| | WELCOME TO COMMERCEIQ                                   | | [ 3D WEBGL DATA SCULPTURE ]           | |
| | High-Velocity Behavioral Intelligence Suite             | |                                       | |
| | Analyzing 42,349,874 verified customer events from      | |         * * * . . * * *               | |
| | October 2019 multi-category store behavior logs.        | |       *       (Nexus)     *           | |
| |                                                         | |     .        Data Torus     .         | |
| | [Explore Sales Trends]   [Inspect Customer Segments]    | |       *                   *           | |
| |                                                         | |         * * * . . * * *               | |
| | Status: All summaries grounded in Phase 7 Spark data    | | [Interactive 60 FPS Canvas]           | |
| +---------------------------------------------------------+ +---------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| MACRO KPI ROW (4 CARDS)                                                                               |
| +-------------------+ +-------------------+ +-------------------+ +---------------------------------+ |
| | TOTAL REVENUE     | | CLEANED EVENTS    | | ANALYZED USERS    | | RECORDED SESSIONS               | |
| | ₹229,933,212.63   | | 42,349,874        | | 3,021,435         | | 9,239,403                       | |
| | [▲ 742,773 Orders]| | [96.1% Views]     | | [8.29% High Power]| | [2.16% Purchase Ratio]          | |
| +-------------------+ +-------------------+ +-------------------+ +---------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| CORE TRENDS & EVENT FUNNEL (2 COLUMNS)                                                                |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | DAILY PURCHASE REVENUE & ACTIVITY TRAJECTORY| | EVENT FUNNEL RATIOS (NOT SESSION CONVERSION)      | |
| | [Area Line Chart: Oct 1 to Nov 1]           | | [Horizontal Funnel Visualization]                 | |
| | Peak: Oct 16 (₹9.81M / 31.4k purchases)     | | 1. VIEW EVENTS:     40,708,807  (100.00%)         | |
| | Note: Nov 1 represents partial UTC boundary | | 2. CART EVENTS:        898,294  (  2.21% of views)| |
| |                                             | | 3. PURCHASE EVENTS:    742,773  ( 82.69% of carts)| |
| | [Interactive ECharts Zoom & Crosshair]      | | [!] Disclaimer: Event ratios, not session funnel. | |
| +---------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| MERCHANDISING & SEGMENTATION PREVIEW (2 COLUMNS)                                                      |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | REVENUE BY TOP PRODUCT CATEGORIES           | | CUSTOMER SEGMENTATION SNAPSHOT (K=2 MODEL)        | |
| | [Horizontal Bar Chart]                      | | [Donut Chart + Metrics]                           | |
| | 1. electronics   ██████████████ ₹176.45M    | | Cluster 0 (High Activity): 250,388 Users ( 8.29%) | |
| | 2. Unknown       ███ ₹22.92M                | |   Avg Spend: ₹520.86  •  Avg Purchases: 1.58      | |
| | 3. appliances    ██ ₹13.58M                 | | Cluster 1 (Low Activity):  2,771,046 Users (91.71%)| |
| | 4. computers     █ ₹11.38M                  | |   Avg Spend:  ₹35.91  •  Avg Purchases: 0.125     | |
| | 5. furniture     ▎ ₹1.67M                   | | [Silhouette Score: 0.81115 | Outlier Excluded]    | |
| +---------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
```

### 2.2 Micro-Interactions & State Details
* **3D Data Torus Interaction:** Hovering over the canvas accelerates rotation slightly; mouse movement introduces parallax tilt. Hovering the "Total Revenue" KPI transmits a bright violet pulse across the wireframe shader.
* **Funnel Tooltip:** Hovering any funnel bar reveals:
  * Exact count formatted with thousands separators.
  * Ratio relative to previous stage and total views.
  * Contextual disclaimer badge reminding analysts of event-level mechanics.
* **Category Bar Click:** Clicking any category (e.g., `electronics`) navigates directly to the Data Explorer filtered to that category.

---

## 3. Screen 2: Sales Intelligence (Revenue & Temporal Trends)

This view provides deep temporal analysis, highlighting the critical decoupling between browsing activity and transaction revenue.

### 3.1 Screen Layout Wireframe
```
+-------------------------------------------------------------------------------------------------------+
| HEADER: SALES INTELLIGENCE & TEMPORAL DYNAMICS                                                        |
| Detailed revenue patterns, hourly purchasing behavior, price tiers, and merchandising concentration.  |
+-------------------------------------------------------------------------------------------------------+
| THE TEMPORAL DECOUPLING PHENOMENON (FULL WIDTH)                                                       |
| +---------------------------------------------------------------------------------------------------+ |
| | HOURLY BROWSING ACTIVITY VS. HOURLY PURCHASE REVENUE (00:00 - 23:00 UTC)                          | |
| | [Dual Y-Axis Dual-Line / Area Chart]                                                              | |
| |                                                                                                   | |
| |    Activity (Events)                                                    Revenue (₹ Millions)      | |
| |    3.0M |                     (Peak Browsing: 21:00 UTC / 3.06M)               | ₹18M             | |
| |         |                                  *  *                                |                  | |
| |    2.0M |                  * * *         *      *          (Peak Revenue: 14:00) | ₹12M             | |
| |         |             *  *       *     *            *       ▲ ₹17.53M          |                  | |
| |    1.0M |       *  *               * *               *  *                      | ₹6M              | |
| |         | *  *                                                                 |                  | |
| |       0 +----------------------------------------------------------------------+ 0                | |
| |          00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23                    | |
| |                                                                                                   | |
| | KEY TAKEAWAY: Browsing volume surges in the late evening (21:00 UTC), but high-value financial   | |
| | transactions peak during the early afternoon (14:00 UTC). Marketing spend must align to 14:00.   | |
| +---------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| DAY-OF-WEEK & PRICE DISTRIBUTION (2 COLUMNS)                                                          |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | DAY-OF-WEEK REVENUE & ORDER INTENSITY       | | PURCHASE VOLUME & REVENUE BY PRICE RANGE          | |
| | [Grouped Bar Chart: Mon - Sun]              | | [Double Bar Chart: Events vs Revenue]             | |
| |                                             | |                                                   | |
| | Wednesday: ₹37.13M (119,197 Orders) [PEAK]  | | Under ₹50:      117,065 Orders |  ₹3.45M Revenue  | |
| | Tuesday:   ₹35.49M (113,088 Orders)         | | ₹50–₹99.99:      92,299 Orders |  ₹6.73M Revenue  | |
| | Thursday:  ₹35.50M (112,606 Orders)         | | ₹100–₹249.99:   249,283 Orders | ₹41.74M Revenue  | |
| | Friday:    ₹32.55M (104,855 Orders)         | | ₹250–₹499.99:   147,749 Orders | ₹50.83M Revenue  | |
| | Monday:    ₹30.54M ( 96,799 Orders)         | | ₹500–₹999.99:    86,974 Orders | ₹62.93M Revenue  | |
| | Sunday:    ₹29.65M (100,218 Orders)         | | ₹1000 & Above:   49,403 Orders | ₹64.26M Revenue  | |
| | Saturday:  ₹29.07M ( 96,010 Orders) [TROUGH]| |                                                   | |
| | Mid-week momentum dominates total volume.   | | Note: Top price tier (>₹1000) drives 27.9% rev.   | |
| +---------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| BRAND CONCENTRATION & PARETO CURVE                                                                    |
| +---------------------------------------------------------------------------------------------------+ |
| | TOP BRANDS REVENUE SHARE & CUMULATIVE PARETO DISTRIBUTION                                         | |
| | [Pareto Combo Chart: Ranked Bars + Cumulative % Curve]                                            | |
| | Apple (₹111.2M / 48.4%) + Samsung (₹46.4M / 20.2%) = 68.5% of total platform revenue.              | |
| | Top 5 brands account for 78.4% of total revenue. Long tail spans 1,981 other brands.              | |
| +---------------------------------------------------------------------------------------------------+ |
```

---

## 4. Screen 3: Customer Intelligence (Segments & Behavior)

This view surfaces customer behavior profiles, K-Means clustering results, and user activity tiers.

### 4.1 Screen Layout Wireframe
```
+-------------------------------------------------------------------------------------------------------+
| HEADER: CUSTOMER INTELLIGENCE & BEHAVIORAL SEGMENTATION                                               |
| K-Means clustering ($K=2$), engagement frequency tiers, and user-level behavioral analytics.          |
+-------------------------------------------------------------------------------------------------------+
| SEGMENT PROFILE COMPARISON CARDS ($K=2$ SENSITIVITY EXPERIMENT)                                       |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | CLUSTER 0: HIGH-ACTIVITY COMMERCIAL CORE    | | CLUSTER 1: CASUAL BROWSERS & OCCASIONAL BUYERS    | |
| | [Badge: 250,388 Users (8.29%)]              | | [Badge: 2,771,046 Users (91.71%)]                 | |
| |                                             | |                                                   | |
| | Average Revenue:      ₹520.86               | | Average Revenue:      ₹35.91                      | |
| | Average Purchases:    1.58 events           | | Average Purchases:    0.125 events                | |
| | Average Carts:        1.85 events           | | Average Carts:        0.16 events                 | |
| | Average Views:        82.00 views           | | Average Views:        7.28 views                  | |
| | Average Sessions:     12.26 sessions        | | Average Sessions:     2.22 sessions               | |
| | Unique Products:      42.04 products        | | Unique Products:      4.60 products               | |
| |                                             | |                                                   | |
| | Profile: High-intent repeat purchasers with | | Profile: Vast majority of traffic; high bounce    | |
| | broad exploration across the store catalog. | | rate, single-session browsing with rare purchases.| |
| +---------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| USER ENGAGEMENT FREQUENCY TIERS                                                                       |
| +---------------------------------------------------------------------------------------------------+ |
| | USER ACTIVITY BRACKET DISTRIBUTION (3,021,435 TOTAL ANALYZED USERS)                               | |
| | [Stacked Horizontal Bar / Segmented Metric Strip]                                                 | |
| | 1–5 Events:   1,668,748 Users (55.23%) ██████████████████████████████                             | |
| | 6–10 Events:    447,969 Users (14.82%) ████████                                                   | |
| | 11–20 Events:   386,999 Users (12.81%) ███████                                                    | |
| | 21–50 Events:   340,039 Users (11.25%) ██████                                                     | |
| | >50 Events:     177,680 Users ( 5.88%) ███                                                        | |
| +---------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| OUTLIER DEEP-DIVE: EXTREME BROWSING CASE STUDY                                                        |
| +---------------------------------------------------------------------------------------------------+ |
| | [Alert Icon] CASE STUDY: USER ID WITH 7,429 VIEW EVENTS & ZERO PURCHASES                          | |
| | During the K-Means sensitivity audit, an extreme user was identified who generated 7,429 views    | |
| | across 7,393 distinct sessions with 0 carts and 0 purchases (likely an automated web scraper).     | |
| | Impact: Excluded from K=2 sensitivity model to preserve centroid validity. Retained in raw HDFS.  | |
| +---------------------------------------------------------------------------------------------------+ |
```

---

## 5. Screen 4: Data Explorer (Interactive Tables & Catalogs)

An interactive workspace for exploring brands, categories, and top-performing products.

### 5.1 Screen Layout Wireframe
```
+-------------------------------------------------------------------------------------------------------+
| HEADER: DATA EXPLORER & MERCHANDISING CATALOG                                                         |
| Search, sort, filter, and inspect verified brand revenue, category performance, and product leaders. |
+-------------------------------------------------------------------------------------------------------+
| EXPLORER TOOLBAR & FILTERS                                                                            |
| [Search by Brand, Category, or Product ID...] [Filter by Category: All v] [Min Buyers: 0] [Export CSV]|
+-------------------------------------------------------------------------------------------------------+
| DATA EXPLORER TABS                                                                                    |
| [Tab 1: Brand Revenue (1,986)] | [Tab 2: Categories (14)] | [Tab 3: Top Products (Revenue & Volume)]  |
+-------------------------------------------------------------------------------------------------------+
| TAB 1 CONTENT: BRAND REVENUE PERFORMANCE TABLE                                                        |
| +---------------------------------------------------------------------------------------------------+ |
| | BRAND NAME      | TOTAL REVENUE (₹)  | PURCHASE EVENTS | UNIQUE BUYERS | AVG ORDER VALUE | SHARE  | |
| |-----------------+--------------------+-----------------+---------------+-----------------+--------| |
| | apple           | ₹111,199,495.70    | 142,858         | 65,593        | ₹778.39         | 48.36% | |
| | samsung         |  ₹46,402,037.35    | 172,878         | 94,073        | ₹268.41         | 20.18% | |
| | xiaomi          |   ₹9,192,640.24    |  56,609         | 35,063        | ₹162.39         |  4.00% | |
| | Unknown         |   ₹8,539,747.08    |  58,210         | 38,231        | ₹146.71         |  3.71% | |
| | huawei          |   ₹4,883,104.73    |  23,499         | 15,378        | ₹207.80         |  2.12% | |
| | acer            |   ₹3,575,715.69    |   6,880         |  4,352        | ₹519.73         |  1.55% | |
| | lg              |   ₹3,387,360.91    |   8,725         |  5,970        | ₹388.24         |  1.47% | |
| | lucente         |   ₹3,123,438.96    |  11,576         |  6,928        | ₹269.82         |  1.36% | |
| | sony            |   ₹2,478,196.68    |   6,729         |  4,406        | ₹368.29         |  1.08% | |
| | oppo            |   ₹2,412,033.98    |  10,887         |  7,086        | ₹221.55         |  1.05% | |
| |-----------------+--------------------+-----------------+---------------+-----------------+--------| |
| | Showing 1–10 of 1,986 brands                     [ < Previous ]  Page 1 of 199  [ Next > ]        | |
| +---------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| PRODUCT BENCHMARK HIGHLIGHTS (2 COLUMNS)                                                              |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | TOP PRODUCTS BY REVENUE                     | | TOP PRODUCTS BY PURCHASE EVENT VOLUME             | |
| | 1. #1005115: ₹12.40M (12,541 purchases)     | | 1. #1004856: 28,938 purchases (₹3.80M revenue)    | |
| | 2. #1005105: ₹10.24M ( 7,293 purchases)     | | 2. #1004767: 21,804 purchases (₹5.43M revenue)    | |
| | 3. #1004249:  ₹6.73M ( 9,089 purchases)     | | 3. #1004833: 12,697 purchases (₹2.18M revenue)    | |
| | 4. #1005135:  ₹5.57M ( 3,218 purchases)     | | 4. #1005115: 12,541 purchases (₹12.40M revenue)   | |
| | 5. #1004767:  ₹5.43M (21,804 purchases)     | | 5. #4804056: 12,379 purchases (₹1.99M revenue)    | |
| +---------------------------------------------+ +---------------------------------------------------+ |
```

---

## 6. Screen 5: ML Insights (PCA & Clustering Science)

This screen documents the data science methodology: standardized user features, dimensionality reduction, scree plots, correlation matrices, and cluster validation.

### 6.1 Screen Layout Wireframe
```
+-------------------------------------------------------------------------------------------------------+
| HEADER: MACHINE LEARNING & DIMENSIONALITY REDUCTION INSIGHTS                                          |
| Rigorous documentation of PCA variance, feature correlation, and K-Means silhouette evaluation.       |
+-------------------------------------------------------------------------------------------------------+
| PCA VARIANCE EXPLANATION (SCREE PLOT & CUMULATIVE CURVE)                                              |
| +---------------------------------------------------------------------------------------------------+ |
| | PRINCIPAL COMPONENT ANALYSIS (7 COMPONENTS EXPLAIN 95.967% OF TOTAL VARIANCE)                     | |
| | [Scree Bar Chart + Cumulative Step Line]                                                          | |
| |                                                                                                   | |
| |   Variance (%)                                                             Cumulative (%)         | |
| |   45% |  [PC1: 40.71%]                                                       | 100%               | |
| |   40% |  ████                                                      * (95.97%)|                    | |
| |   30% |  ████                                            *                   | 75%                | |
| |   20% |  ████      [PC2: 17.93%]                   *                         |                    | |
| |   15% |  ████      ████      [PC3: 14.76%]   *                               | 50%                | |
| |   10% |  ████      ████      ████      [PC4: 8.43%]                          |                    | |
| |    5% |  ████      ████      ████      ████     [PC5: 5.80%] [PC6: 4.51%]    | 25%                | |
| |    0% +----------------------------------------------------------------------+ 0%                 | |
| |           PC1       PC2       PC3       PC4         PC5          PC6    PC7                       | |
| |                                                                                                   | |
| | Tabular Variance Breakdown:                                                                       | |
| | PC1: 40.71% (Cum: 40.71%) | PC2: 17.93% (Cum: 58.64%) | PC3: 14.76% (Cum: 73.40%)                 | |
| | PC4:  8.43% (Cum: 81.83%) | PC5:  5.80% (Cum: 87.63%) | PC6:  4.51% (Cum: 92.14%) | PC7: 3.82%    | |
| +---------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| K-MEANS MODEL EVALUATION & SILHOUETTE COMPARISON                                                      |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | MODEL SENSITIVITY EXPERIMENT RESULTS        | | MATHEMATICAL METHODOLOGY & LIMITATIONS            | |
| | [Comparison Table of Silhouette Scores]     | |                                                   | |
| | • K=2 (Outlier Excluded): 0.81115 [Selected]| | 1. Feature Standardization: Features standardized| |
| | • K=3 (Outlier Excluded): 0.51978           | |    to zero mean and unit variance prior to PCA.   | |
| | • K=4 (Outlier Excluded): 0.57195           | | 2. Outlier Influence: Single extreme user had     | |
| | • K=3 (Original Run):     0.81060           | |    outsized pull on centroids; excluded in K=2.  | |
| | • K=4 (Original Run):     0.51970           | | 3. Predictive Boundary: Clustering identifies     | |
| | • K=5 (Original Run):     0.57056           | |    historical patterns; does NOT forecast intent. | |
| +---------------------------------------------+ +---------------------------------------------------+ |
```

---

## 7. Screen 6: Data Pipeline & Provenance (Architecture & Audit)

This screen presents the end-to-end data pipeline, transformation details, and data-quality findings.

### 7.1 Screen Layout Wireframe
```
+-------------------------------------------------------------------------------------------------------+
| HEADER: BIG DATA PIPELINE ARCHITECTURE & AUDIT PROVENANCE                                             |
| Technical documentation of the Hadoop, HDFS, and PySpark pipeline from raw CSV to analytical Parquet. |
+-------------------------------------------------------------------------------------------------------+
| PIPELINE ARCHITECTURE FLOW DIAGRAM                                                                    |
| +---------------------------------------------------------------------------------------------------+ |
| | [1. RAW INGESTION]  --> [2. CLEANING]       --> [3. TRANSFORMATION] --> [4. REDUCTION]           | |
| | 42,448,764 CSV rows     42,349,874 Parquet      21 Feature Columns      16 Feature Columns        | |
| | HDFS: /raw/2019-Oct     98,890 rows removed     price_log, calendar     Parquet in HDFS           | |
| |                         (price <= 0 & dups)     Price skew 2.54 -> -0.27                          | |
| |                                                                                                   | |
| |             --> [5. DESCRIPTIVE ANALYTICS]  --> [6. PCA & K-MEANS]    --> [7. COMMERCEIQ SUITE]   | |
| |                 11 Summary CSVs                 7 Components (95.97%)     Interactive React App   | |
| |                 14 Matplotlib PNGs              K=2 Model (3.02M users)   Sub-second Query Speed  | |
| +---------------------------------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| DATA QUALITY AUDIT & SYSTEM TRANSPARENCY (2 COLUMNS)                                                  |
| +---------------------------------------------+ +---------------------------------------------------+ |
| | CLEANING & OUTLIER METRICS                  | | DUPLICATE AUDIT DISCLOSURE                        | |
| | • Raw Rows:             42,448,764          | | Status: Complete with recorded limitation.        | |
| | • Cleaned Rows:         42,349,874          | | An independent full-dataset de-duplication audit  | |
| | • Filtered (Price <= 0):    68,673          | | failed with a JVM Garbage Collection allocation   | |
| | • Missing Categories:   13,515,609 (Unknown)| | error on local hardware after 166 seconds.        | |
| | • Missing Brands:        6,113,008 (Unknown)| | A 1% random sample (424,129 rows) confirmed zero  | |
| | • IQR Outlier Events:    3,677,875 ( 8.69%) | | duplicates. Full corpus de-duplication was done   | |
| | • Z-Score Outliers:      1,158,750 ( 2.74%) | | via PySpark dropDuplicates().                     | |
| +---------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------+
| ORIGINAL VISUALIZATION GALLERY VIEWER                                                                 |
| [Search and inspect all 25 original Matplotlib/Seaborn PNGs and 4 Plotly interactive charts]          |
+-------------------------------------------------------------------------------------------------------+
```

---

*Approved for Milestone M01 implementation.*
