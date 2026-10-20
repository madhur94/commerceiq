# Project Progress Checklist

| Workstream | Status | Evidence / note |
|---|---|---|
| Hadoop/Spark and HDFS setup | Completed | Local Hadoop/Spark environment |
| Data ingestion and preparation | Completed | 42,349,874 cleaned rows recorded |
| Data quality | Completed with limitation | Full independent duplicate audit failed; 1% sample checked |
| Outlier analysis | Completed | IQR and Z-score flags; plausible values retained |
| Feature transformations | Completed | Price transformations validated |
| Reduced analytical dataset | Completed | 16-column dataset recorded |
| Descriptive analytics | Completed | Summary CSVs and visualization artifacts |
| User-level feature engineering | Completed | Corrected HDFS user features, 3,021,435 users |
| PCA | Completed | Seven components explain about 95.97% variance |
| K-Means | Completed for current showcase | K=2 sensitivity experiment; 3,021,434 users |
| Predictive analytics | Deferred | Intentionally out of current integration scope |
| Association rule mining | Deferred | Not implemented in current scope |
| Closed/maximal frequent itemsets | Deferred | Not implemented in current scope |
| Final showcase integration | In progress | Five-page Streamlit showcase |
| Final report and presentation | Pending | Complete after review of showcase |

## Important caveats
- The dataset is an event log; do not imply multi-source data integration.
- `Unknown` is used as a missing-category placeholder where needed.
- Event-level view/cart/purchase ratios are not session-level conversion rates.
- Some plots use sampled/top-N views; disclose this in captions where relevant.
- Phase 5 readback previously emitted a duplicate `event_date` partition-column warning; investigate if Phase 5 is rerun.
- The full duplicate audit did not complete. A 1% sample with zero duplicates does not prove the full dataset contains no duplicates.
- The final K=2 sensitivity experiment excluded one extreme user. Original cluster results remain preserved.
