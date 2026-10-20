from pathlib import Path
import html
import pandas as pd
import streamlit as st
import plotly.express as px
import streamlit.components.v1 as components

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"
PHASE7 = RESULTS / "phase7"
EXTRA = RESULTS / "additional_visualizations"
METRICS_FILE = ROOT / "data" / "summary" / "verified_project_metrics.csv"

st.set_page_config(
    page_title="E-Commerce Big Data Showcase",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------- Shared data helpers ----------
@st.cache_data
def read_csv(path_string):
    path = Path(path_string)
    if not path.exists():
        return pd.DataFrame()
    try:
        return pd.read_csv(path)
    except Exception:
        return pd.DataFrame()

metrics_df = read_csv(str(METRICS_FILE))
metrics = {}
if not metrics_df.empty and {"metric", "value"}.issubset(metrics_df.columns):
    metrics = dict(zip(metrics_df["metric"].astype(str), metrics_df["value"]))

def metric_value(key, fallback=None):
    return metrics.get(key, fallback)

def fmt_int(value):
    try:
        return f"{int(float(value)):,}"
    except (TypeError, ValueError):
        return "—"

def fmt_money(value):
    try:
        return f"₹{float(value):,.2f}"
    except (TypeError, ValueError):
        return "—"

def read_phase7(filename):
    return read_csv(str(PHASE7 / filename))

def image_gallery(files, captions=None, columns=2):
    if not files:
        st.info("No matching visualization files were found in this showcase package.")
        return
    for start in range(0, len(files), columns):
        cols = st.columns(columns)
        for col, file_path in zip(cols, files[start:start + columns]):
            with col:
                st.image(str(file_path), use_container_width=True)
                if captions and file_path.name in captions:
                    st.markdown(f"**{captions[file_path.name][0]}**")
                    st.caption(captions[file_path.name][1])
                else:
                    st.caption(file_path.stem.replace("_", " ").replace("-", " ").title())

# ---------- Sidebar navigation ----------
st.sidebar.title("E-Commerce Big Data")
st.sidebar.caption("ASBD project showcase · October 2019")
page = st.sidebar.radio(
    "Navigate",
    [
        "Home",
        "Data Preparation",
        "Visualization Gallery",
        "Data Analysis",
        "PCA & Clustering",
    ],
)
st.sidebar.divider()
st.sidebar.markdown("**Pipeline**")
st.sidebar.caption("Dataset → HDFS/Spark → Preparation → Analytics → PCA → K-Means")
st.sidebar.caption("This showcase uses precomputed outputs; it does not scan the full HDFS dataset.")

# ---------- Page 1: Home ----------
if page == "Home":
    st.title("Scalable E-Commerce Big Data Mining and Analytics Platform")
    st.markdown(
        "An end-to-end big-data analytics project using October 2019 e-commerce "
        "behavior events to study browsing, shopping-cart activity, purchases, revenue, "
        "and customer behavior."
    )
    st.info(
        "The application presents completed analysis artifacts and verified project metrics. "
        "Predictive analytics and association/frequent-itemset mining are intentionally outside "
        "the current showcase scope."
    )

    st.subheader("Dataset at a glance")
    c1, c2, c3 = st.columns(3)
    c1.metric("Raw records", fmt_int(metric_value("raw_records")))
    c2.metric("Cleaned records", fmt_int(metric_value("cleaned_records")))
    c3.metric("Phase 6 columns", fmt_int(metric_value("phase6_columns")))
    c4, c5, c6 = st.columns(3)
    c4.metric("Users", fmt_int(metric_value("users")))
    c5.metric("Sessions", fmt_int(metric_value("sessions")))
    c6.metric("Purchase events", fmt_int(metric_value("purchase_events")))

    st.subheader("Dataset overview")
    left, right = st.columns([1.25, 1])
    with left:
        st.markdown("""
        **Dataset:** E-Commerce Behavior Data from Multi-Category Store  
        **Source:** Kaggle  
        **Period:** October 2019  
        **Original format:** CSV event log  
        **Processing stack:** Hadoop, HDFS, Apache Spark, PySpark  
        **Analytical storage:** Parquet  

        Each event records an action such as a product view, cart action, or purchase, alongside
        available product, price, user, category, brand, timestamp, and session information.
        """)
    with right:
        st.markdown("#### Project workflow")
        st.code(
            "Raw CSV\n"
            "   ↓\n"
            "HDFS ingestion\n"
            "   ↓\n"
            "Cleaning and validation\n"
            "   ↓\n"
            "Feature engineering and Parquet\n"
            "   ↓\n"
            "Descriptive analytics\n"
            "   ↓\n"
            "User-level features → PCA → K-Means",
            language="text",
        )

    st.subheader("Key business questions")
    q1, q2, q3 = st.columns(3)
    q1.markdown("**When are customers active?**\n\nExplore hourly activity and daily purchasing patterns.")
    q2.markdown("**What drives revenue?**\n\nCompare product categories, brands, prices, and top products.")
    q3.markdown("**How do customers differ?**\n\nSummarize user activity and inspect behavior-based clusters.")

    st.subheader("Technology stack")
    st.markdown(
        "`Hadoop` · `HDFS` · `Apache Spark` · `PySpark` · `Parquet` · "
        "`Python` · `Pandas` · `Plotly` · `Streamlit`"
    )

# ---------- Page 2: Data Preparation ----------
elif page == "Data Preparation":
    st.title("Data Preparation & Quality")
    st.write(
        "This page documents the recorded data preparation, cleaning, transformation, and "
        "validation outcomes. The numbers below are based on the project metrics included with "
        "this showcase."
    )

    st.subheader("Dataset size before and after cleaning")
    a, b, c = st.columns(3)
    a.metric("Raw records", fmt_int(metric_value("raw_records")))
    b.metric("Cleaned records", fmt_int(metric_value("cleaned_records")))
    try:
        removed = int(float(metric_value("raw_records"))) - int(float(metric_value("cleaned_records")))
    except (TypeError, ValueError):
        removed = None
    c.metric("Net records removed", fmt_int(removed) if removed is not None else "—")

    st.markdown("""
    **Recorded cleaning operations**
    - Filtered records with non-positive prices.
    - Replaced missing categorical/session values with an `Unknown` placeholder.
    - Removed duplicate rows during the cleaning pipeline.
    - Derived time and analytical features for downstream work.
    - Stored processed data as Parquet in HDFS.
    """)

    st.subheader("Recorded dataset versions")
    version_data = pd.DataFrame([
        {"Stage": "Cleaned dataset", "Rows": metric_value("cleaned_records"), "Columns": 17, "Storage": "Parquet in HDFS"},
        {"Stage": "Phase 5 transformed dataset", "Rows": metric_value("cleaned_records"), "Columns": metric_value("phase5_columns"), "Storage": "Parquet in HDFS"},
        {"Stage": "Phase 6 reduced dataset", "Rows": metric_value("cleaned_records"), "Columns": metric_value("phase6_columns"), "Storage": "Parquet in HDFS"},
    ])
    st.dataframe(version_data, use_container_width=True, hide_index=True)

    st.subheader("Data-quality checks and limitations")
    st.markdown("""
    - **Missing values:** categorical and session fields were filled with `Unknown` where required.
    - **Invalid prices:** non-positive-price records were filtered during cleaning.
    - **Duplicate audit limitation:** a complete independent duplicate audit failed because of JVM garbage-collection/memory pressure. A 1% sample (424,129 rows) showed no duplicates; this does **not** prove the full dataset is duplicate-free.
    - **Outliers:** IQR and Z-score methods flagged high-price records. Plausible premium-product prices were retained rather than automatically deleted.
    - **Category handling:** `Unknown` remains an explicit category/brand group where values were unavailable.
    """)

    iqr = metric_value("iqr_outlier_events")
    zscore = metric_value("zscore_outlier_events")
    x, y = st.columns(2)
    x.metric("IQR-flagged price records", fmt_int(iqr))
    y.metric("Z-score flagged records (|z| > 3)", fmt_int(zscore))
    st.caption(
        f"Recorded baseline price mean: {fmt_money(metric_value('price_mean'))}. "
        f"Purchase-only median price: {fmt_money(metric_value('price_median_purchase'))}. "
        "Outlier counts are flags for investigation, not counts of records proven to be errors."
    )

    st.subheader("Validation summary")
    validation = pd.DataFrame([
        {"Check": "Cleaned row count", "Recorded result": fmt_int(metric_value("cleaned_records")), "Interpretation": "Matches the recorded processed dataset count"},
        {"Check": "Phase 5 feature count", "Recorded result": str(metric_value("phase5_columns", "—")), "Interpretation": "Transformed dataset"},
        {"Check": "Phase 6 feature count", "Recorded result": str(metric_value("phase6_columns", "—")), "Interpretation": "Reduced analytical dataset"},
        {"Check": "Full duplicate audit", "Recorded result": "Incomplete", "Interpretation": "Sample checked; full audit did not complete"},
    ])
    st.dataframe(validation, use_container_width=True, hide_index=True)

# ---------- Page 3: Visualization Gallery ----------
elif page == "Visualization Gallery":
    st.title("Visualization Gallery")
    st.write(
        "Explore the saved charts. Each visualization is a precomputed artifact; opening this page "
        "does not rerun Spark analytics."
    )

    captions = {
        "01_event_distribution.png": ("Event distribution", "Compares the volume of view, cart, and purchase events."),
        "02_hourly_activity.png": ("Hourly activity", "Shows when recorded events are most frequent."),
        "03_hourly_revenue.png": ("Hourly revenue", "Compares purchase revenue across hours."),
        "04_category_revenue.png": ("Revenue by category", "Highlights categories contributing to purchase revenue."),
        "05_top10_brand_revenue.png": ("Top brands by revenue", "Ranks brands by purchase revenue."),
        "06_top10_users_revenue.png": ("Top users by revenue", "Shows users with the highest recorded revenue."),
        "07_user_activity_distribution.png": ("User activity distribution", "Shows how user activity is distributed."),
        "08_purchase_count_by_price_range.png": ("Purchase count by price range", "Compares purchase-event counts across price buckets."),
        "09_purchase_revenue_by_price_range.png": ("Revenue by price range", "Compares revenue contributions across price buckets."),
        "10_top_products_revenue.png": ("Top products by revenue", "Ranks products by purchase revenue."),
        "11_top_products_purchase_count.png": ("Top products by purchase count", "Ranks products by purchase-event count."),
        "12_weekday_revenue.png": ("Revenue by weekday", "Compares purchase revenue by day of week."),
        "13_weekday_purchase_events.png": ("Purchases by weekday", "Compares purchase-event counts by weekday."),
        "14_daily_purchase_revenue.png": ("Daily purchase revenue", "Shows daily revenue over the dataset period."),
        "15_price_histogram.png": ("Price histogram", "Shows the distribution of recorded prices."),
        "16_price_vs_purchase_scatter.png": ("Price vs purchase", "Explores the relationship between price and purchase behavior."),
        "17_brand_revenue_pareto.png": ("Brand revenue Pareto", "Highlights concentration of revenue across brands."),
        "18_daily_revenue_area.png": ("Daily revenue area", "Shows daily revenue progression."),
        "19_price_violin_plot.png": ("Price violin plot", "Compares the price distribution shape."),
        "20_purchase_price_boxplot.png": ("Purchase price boxplot", "Summarizes the spread and potential extremes of purchase prices."),
        "21_numeric_correlation_heatmap.png": ("Numeric correlation heatmap", "Displays correlations among selected numeric features."),
        "22_category_radar_chart.png": ("Category radar chart", "Compares selected category-level metrics."),
        "23_event_doughnut.png": ("Event doughnut", "Shows the relative shares of event types."),
        "24_numerical_pair_plot.png": ("Numerical pair plot", "Explores pairwise relationships among selected numeric variables."),
        "28_price_strip_plot.png": ("Price strip plot", "Shows individual or sampled price observations across a distribution."),
    }

    tabs = st.tabs(["All charts", "Events & time", "Revenue & products", "Price & relationships", "Interactive charts"])
    pngs = sorted(list(PHASE7.glob("*.png")) + list(EXTRA.glob("*.png")))
    with tabs[0]:
        search = st.text_input("Filter charts by name", placeholder="e.g. revenue, price, event")
        filtered = [p for p in pngs if search.lower() in p.name.lower()]
        image_gallery(filtered, captions, columns=2)

    with tabs[1]:
        names = ["01_event_distribution.png", "02_hourly_activity.png", "03_hourly_revenue.png",
                 "12_weekday_revenue.png", "13_weekday_purchase_events.png", "14_daily_purchase_revenue.png",
                 "23_event_doughnut.png"]
        image_gallery([p for p in pngs if p.name in names], captions, columns=2)

    with tabs[2]:
        names = ["04_category_revenue.png", "05_top10_brand_revenue.png", "06_top10_users_revenue.png",
                 "10_top_products_revenue.png", "11_top_products_purchase_count.png",
                 "17_brand_revenue_pareto.png", "18_daily_revenue_area.png", "22_category_radar_chart.png"]
        image_gallery([p for p in pngs if p.name in names], captions, columns=2)

    with tabs[3]:
        names = ["08_purchase_count_by_price_range.png", "09_purchase_revenue_by_price_range.png",
                 "15_price_histogram.png", "16_price_vs_purchase_scatter.png", "19_price_violin_plot.png",
                 "20_purchase_price_boxplot.png", "21_numeric_correlation_heatmap.png",
                 "24_numerical_pair_plot.png", "28_price_strip_plot.png"]
        image_gallery([p for p in pngs if p.name in names], captions, columns=2)

    with tabs[4]:
        html_files = sorted(EXTRA.glob("*.html"))
        if not html_files:
            st.info("No interactive HTML files were found.")
        else:
            chosen_html = st.selectbox("Choose interactive chart", [p.name for p in html_files])
            selected_path = EXTRA / chosen_html
            try:
                html_content = selected_path.read_text(encoding="utf-8")
                components.html(html_content, height=650, scrolling=True)
                st.caption(f"Embedded from saved artifact: {chosen_html}")
            except Exception as exc:
                st.error(f"Could not display {chosen_html}: {exc}")

# ---------- Page 4: Data Analysis ----------
elif page == "Data Analysis":
    st.title("Analytical Dataset Preparation & Descriptive Analytics")
    st.write(
        "This page brings together the engineered analytical features and the main descriptive "
        "findings from the October 2019 event data."
    )

    st.subheader("Analytical dataset preparation")
    st.markdown("""
    The project prepared successive analytical datasets in HDFS and used Parquet for compact,
    column-oriented storage. Recorded transformations include:

    - **`price_minmax`** — min-max scaling of price.
    - **`price_zscore`** — standardized price values.
    - **`price_decimal`** — decimal-based price scaling.
    - **`price_log`** — logarithmic price transformation to reduce skew.
    - **Derived time features** — date, hour, day of week, year, and month.
    - **Derived analysis flags** — purchase indicator and revenue field.
    - **Phase 6 reduction** — a 16-column analytical dataset.

    Categorical encoding was explored, but the recorded Phase 6 output retains categorical strings;
    encoded categorical columns were not saved in that final dataset.
    """)

    st.subheader("Transformation result")
    st.markdown(
        "Recorded price skewness changed from **2.53991** before log transformation to "
        "**−0.26836** after the log transformation, indicating a substantially less right-skewed "
        "distribution in that transformed feature."
    )

    st.subheader("Descriptive analytics — key metrics")
    a, b, c = st.columns(3)
    a.metric("View events", fmt_int(metric_value("view_events")))
    b.metric("Cart events", fmt_int(metric_value("cart_events")))
    c.metric("Purchase events", fmt_int(metric_value("purchase_events")))
    d, e, f = st.columns(3)
    d.metric("Purchase revenue", fmt_money(metric_value("purchase_revenue")))
    e.metric("Customers", fmt_int(metric_value("users")))
    f.metric("Sessions", fmt_int(metric_value("sessions")))

    st.subheader("Event distribution")
    events = read_phase7("event_distribution.csv")
    if not events.empty:
        name_col = next((c for c in events.columns if "event" in c.lower() and not pd.api.types.is_numeric_dtype(events[c])), events.columns[0])
        value_col = next((c for c in events.columns if c.lower() in ("count", "event_count", "events", "total_events")), events.columns[-1])
        st.plotly_chart(px.pie(events, names=name_col, values=value_col, hole=0.45, title="Recorded events by type"), use_container_width=True)
    st.caption("Views dominate the event log. Event proportions describe recorded events, not session-level conversion rates.")

    left, right = st.columns(2)
    with left:
        hourly = read_phase7("hourly_activity.csv")
        st.markdown("#### Hourly activity")
        if not hourly.empty:
            x = next((c for c in hourly.columns if "hour" in c.lower()), hourly.columns[0])
            y = next((c for c in hourly.columns if c != x and pd.api.types.is_numeric_dtype(hourly[c])), hourly.columns[-1])
            st.plotly_chart(px.line(hourly, x=x, y=y, markers=True, title="Events by hour"), use_container_width=True)
        st.caption("The recorded peak overall activity was at 21:00, at approximately 3.06 million events.")
    with right:
        hourly_rev = read_phase7("hourly_revenue.csv")
        st.markdown("#### Hourly purchase revenue")
        if not hourly_rev.empty:
            x = next((c for c in hourly_rev.columns if "hour" in c.lower()), hourly_rev.columns[0])
            y = next((c for c in hourly_rev.columns if c != x and pd.api.types.is_numeric_dtype(hourly_rev[c])), hourly_rev.columns[-1])
            st.plotly_chart(px.line(hourly_rev, x=x, y=y, markers=True, title="Purchase revenue by hour"), use_container_width=True)
        st.caption("The recorded peak revenue hour was 14:00, with approximately ₹17.53 million.")

    categories = read_phase7("category_revenue.csv")
    brands = read_phase7("brand_revenue.csv")
    left, right = st.columns(2)
    with left:
        st.markdown("#### Revenue by category")
        if not categories.empty:
            x = next((c for c in categories.columns if "category" in c.lower()), categories.columns[0])
            y = next((c for c in categories.columns if "revenue" in c.lower()), categories.columns[-1])
            st.plotly_chart(px.bar(categories.sort_values(y, ascending=False).head(10), x=x, y=y, title="Top categories by purchase revenue"), use_container_width=True)
        st.caption("Electronics was the largest recorded category revenue contributor.")
    with right:
        st.markdown("#### Revenue by brand")
        if not brands.empty:
            x = next((c for c in brands.columns if "brand" in c.lower()), brands.columns[0])
            y = next((c for c in brands.columns if "revenue" in c.lower()), brands.columns[-1])
            st.plotly_chart(px.bar(brands.nlargest(min(10, len(brands)), y), x=y, y=x, orientation="h", title="Top brands by purchase revenue"), use_container_width=True)
        st.caption("Apple was the largest recorded brand revenue contributor.")

    st.subheader("Interpretation and caveats")
    st.markdown("""
    - View events account for most observed activity, while cart and purchase events are much less frequent.
    - Revenue is calculated from purchase events, not from every event.
    - Unknown categories and brands are retained as explicit groups.
    - The dataset covers October 2019 event logs and includes a small UTC boundary into November.
    - Descriptive patterns show association and activity, not causal effects.
    """)

# ---------- Page 5: PCA & Clustering ----------
elif page == "PCA & Clustering":
    st.title("User-Level Features, PCA & K-Means")
    st.write(
        "This page presents the user-level feature engineering, dimensionality reduction, and "
        "the final two-cluster experiment completed so far."
    )

    st.subheader("User-level feature engineering")
    st.markdown("""
    Events were aggregated by user to describe behavior through total events, views, carts,
    purchases, revenue, average and maximum price, sessions, unique products, and unique categories.
    The corrected user-feature output contains **3,021,435 users**.
    """)

    st.subheader("PCA — principal component analysis")
    st.markdown(
        "The numeric user features were standardized before PCA. Seven principal components were "
        "retained, explaining approximately **95.97%** of the variance."
    )
    variance = pd.DataFrame({
        "Component": ["PC1", "PC2", "PC3", "PC4", "PC5", "PC6", "PC7"],
        "Explained variance (%)": [40.7123, 17.9277, 14.7635, 8.4269, 5.8033, 4.5092, 3.8240],
        "Cumulative variance (%)": [40.7123, 58.6400, 73.4035, 81.8305, 87.6338, 92.1430, 95.9670],
    })
    st.dataframe(variance, use_container_width=True, hide_index=True)
    st.plotly_chart(
        px.bar(variance, x="Component", y="Explained variance (%)",
               title="Explained variance by principal component"),
        use_container_width=True,
    )
    st.plotly_chart(
        px.line(variance, x="Component", y="Cumulative variance (%)", markers=True,
                title="Cumulative explained variance", range_y=[0, 100]),
        use_container_width=True,
    )

    st.subheader("K-Means model selection")
    scores = pd.DataFrame({
        "Experiment": ["K=2 (outlier excluded)", "K=3 (outlier excluded)", "K=4 (outlier excluded)",
                       "K=3 (original experiment)", "K=4 (original experiment)", "K=5 (original experiment)"],
        "Silhouette score": [0.81115, 0.51978, 0.57195, 0.81060, 0.51970, 0.57056],
    })
    st.dataframe(scores, use_container_width=True, hide_index=True)
    st.caption(
        "Scores from different experiments are not perfectly comparable because the outlier-excluded "
        "run changes the population and cluster structure. The selected K=2 experiment is for "
        "3,021,434 users, excluding one investigated extreme browsing user."
    )

    st.subheader("Final K=2 customer segments")
    cluster_data = pd.DataFrame([
        {"Cluster": "Cluster 0 · High activity", "Users": 250388, "Share (%)": 8.29,
         "Average events": 85.43, "Average views": 82.00, "Average carts": 1.849,
         "Average purchases": 1.58, "Average revenue": 520.86, "Average sessions": 12.26,
         "Unique products": 42.04},
        {"Cluster": "Cluster 1 · Low activity", "Users": 2771046, "Share (%)": 91.71,
         "Average events": 7.56, "Average views": 7.28, "Average carts": 0.157,
         "Average purchases": 0.125, "Average revenue": 35.91, "Average sessions": 2.22,
         "Unique products": 4.60},
    ])
    c1, c2 = st.columns(2)
    c1.metric("High-activity segment", "250,388 users", "8.29%")
    c2.metric("Low-activity segment", "2,771,046 users", "91.71%")
    st.plotly_chart(px.pie(cluster_data, names="Cluster", values="Users",
                           title="User distribution by cluster", hole=0.42), use_container_width=True)
    st.dataframe(cluster_data, use_container_width=True, hide_index=True)
    st.plotly_chart(
        px.bar(cluster_data, x="Cluster", y="Average revenue",
               title="Average recorded revenue by cluster"),
        use_container_width=True,
    )
    st.plotly_chart(
        px.bar(cluster_data, x="Cluster", y="Average purchases",
               title="Average purchase events by cluster"),
        use_container_width=True,
    )

    st.subheader("Interpretation")
    st.markdown("""
    - **Cluster 0 — High activity:** a smaller group with higher average browsing, cart activity,
      purchase events, sessions, product diversity, and revenue.
    - **Cluster 1 — Low activity:** the majority group, with lower average activity and revenue.
    - These labels summarize observed behavior. They do not prove loyalty, customer lifetime value,
      or future purchasing intent.
    - The investigated extreme user had 7,429 view events, 7,393 sessions, no carts, and no purchases.
      It was excluded only from the K=2 sensitivity experiment; the original HDFS results remain preserved.
    - The final K=2 assignments were validated: 3,021,434 rows and 3,021,434 distinct user IDs.
    """)

    st.subheader("HDFS outputs")
    st.code(
        "hdfs:///ecommerce/results/user_features_corrected\n"
        "hdfs:///ecommerce/results/pca_user_features_7\n"
        "hdfs:///ecommerce/results/kmeans_user_clusters\n"
        "hdfs:///ecommerce/results/kmeans_user_clusters_k2",
        language="text",
    )
    st.caption("The showcase displays the recorded metrics; it does not read HDFS live.")

# ---------- Footer ----------
st.divider()
st.caption(
    "ASBD project showcase · Results are precomputed. "
    "Documented limitations are retained to keep the presentation reproducible and transparent."
)
