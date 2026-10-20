/**
 * CommerceIQ Data Contracts — Master Project Metrics
 * Grounded strictly in verified_project_metrics.csv and phase7_summary.csv.
 */

export interface VerifiedProjectMetrics {
  raw_records: number;              // 42,448,764
  cleaned_records: number;          // 42,349,874
  net_records_removed: number;      // 98,890 (68,673 price <= 0 plus 30,217 unsegregated remainder / cleaning adjustments)
  invalid_price_records_filtered?: number; // 68,673
  unsegregated_cleaning_difference?: number; // 30,217
  phase5_columns: number;           // 21
  phase6_columns: number;           // 16
  users: number;                    // 3,021,435
  sessions: number;                 // 9,239,403
  purchase_events: number;          // 742,773
  purchase_revenue: number;         // 229,933,212.63 (Recorded purchase-event value in undenominated monetary units)
  view_events: number;              // 40,708,807
  cart_events: number;              // 898,294
  price_mean: number;               // 290.7840088
  price_median_purchase: number;    // 179.84
  iqr_outlier_events: number;       // 3,677,875 (Upper fence: 796.465)
  zscore_outlier_events: number;    // 1,158,750 (|z| > 3, price > 1,365.97)
  currency_unit: string;            // 'monetary_units' (strictly neutral; currency metadata is not established in source)
}

export type EventType = 'view' | 'cart' | 'purchase';

export interface EventDistributionRecord {
  event_type: EventType;
  count: number;
  percentage_of_total: number;      // Computed against 42,349,874 cleaned events
  ratio_to_views: number;           // Computed against 40,708,807 view events (event-count ratio, NOT conversion rate)
}

export interface FunnelStageData {
  stage: EventType;
  label: string;
  count: number;
  ratio_to_previous_percent: number; // View->Cart: 2.21%; Cart->Purchase: 82.69%
  ratio_to_views_percent: number;
  semantic_note: string;             // Mandatory: "Event-count ratio only; not a session-level conversion rate"
}
