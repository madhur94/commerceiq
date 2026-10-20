# E-Commerce Big Data Analytics — Showcase Package

A five-page Streamlit showcase for the ASBD e-commerce big-data project.

## Pages
1. **Home** — dataset overview, project objectives, architecture, and key metrics.
2. **Data Preparation** — cleaning, quality checks, validation caveats, and outlier analysis.
3. **Visualization Gallery** — saved PNG charts and embedded interactive HTML charts.
4. **Data Analysis** — analytical feature preparation and descriptive analytics.
5. **PCA & Clustering** — user features, PCA explained variance, K-Means scores, and cluster profiles.

## Run locally
From the project root:

```bash
cd dashboard
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
streamlit run dashboard/app.py
```

The application uses local precomputed summaries and chart files. It does not scan the full HDFS dataset or rerun Spark jobs on page load.

## Important scope and caveats
- The showcase covers completed data preparation, descriptive analysis, PCA, and K-Means work.
- Predictive analytics, association rule mining, and closed/maximal frequent-itemset mining are not implemented in this version.
- The full independent duplicate audit did not complete; a 1% sample had zero duplicates, which does not establish that the full dataset is duplicate-free.
- Outlier flags indicate records for investigation, not necessarily invalid records.
- Event-level ratios must not be described as session-level conversion rates.
- The final K=2 sensitivity experiment excluded one extreme browsing user and contains 3,021,434 users. Original clustering results are preserved separately.
- PCA explained-variance figures and clustering summaries are recorded project results; this showcase does not read the HDFS outputs live.
