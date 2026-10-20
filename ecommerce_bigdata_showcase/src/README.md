# Spark source organization recommendation

For showcase-quality normal project files, keep reusable Spark code modular:
- `src/ingest.py` — read raw CSV and enforce schema
- `src/clean.py` — missing values, invalid prices, de-duplication
- `src/features.py` — time fields, purchase/revenue features, price transforms
- `src/analytics.py` — distributed summary tables and user aggregates
- `src/export_summaries.py` — write compact CSV/Parquet summaries for dashboard

Keep Spark transformations separate from Streamlit UI code. Do not copy the whole raw CSV into the dashboard app. The source scripts are a recommended structure; the existing project-specific execution scripts should be copied in after reviewing their actual contents.
