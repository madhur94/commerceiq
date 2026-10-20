/**
 * CommerceIQ Data Contracts — Descriptive Analytics & Merchandising
 * Grounded strictly in results/phase7/*.csv.
 */

export interface DailyPurchaseRecord {
  event_date: string;              // 'YYYY-MM-DD' (2019-10-01 to 2019-11-01)
  purchase_events: number;
  total_revenue: number;           // Recorded purchase-event value (monetary units)
  is_partial_day: boolean;         // true for 2019-11-01 (UTC boundary capture, 1,487 purchases)
}

export interface HourlyCombinedRecord {
  event_hour: number;              // 0 to 23 (UTC)
  event_count: number;             // Total events (Peak: 21:00 UTC with 3,055,061 events)
  total_revenue: number;           // Purchase-event value (Peak: 14:00 UTC with 17,531,268.91 monetary units)
  peak_activity?: boolean;
  peak_revenue?: boolean;
}

export interface WeekdayRecord {
  weekday: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  purchase_events: number;
  total_revenue: number;           // Recorded purchase-event value (monetary units)
}

export interface CategoryRevenueRecord {
  main_category: string;           // 14 categories: electronics, Unknown, appliances, etc.
  total_revenue: number;
  purchase_events: number;
  unique_buyers: number;
  revenue_share_percentage: number;
}

export interface BrandRevenueRecord {
  rank?: number;
  brand: string;                   // 'apple', 'samsung', 'xiaomi', 'Unknown', etc.
  total_revenue: number;
  purchase_events: number;
  unique_buyers: number;
  revenue_share_percentage: number;
}

export interface TopProductRecord {
  product_id: number;              // e.g. 1005115, 1004856
  total_revenue: number;
  purchase_events: number;
  unique_buyers: number;
  average_price: number;
}

export interface PriceDistributionRecord {
  price_range_raw: string;         // 'Under 50', '50–99.99', etc.
  price_range_display: string;     // Normalized with clean en-dash
  purchase_events: number;
  total_revenue: number;
}

export interface UserActivityDistributionRecord {
  activity_group_raw: string;      // '1–5 events', etc.
  activity_group_display: string;  // Normalized with clean en-dash
  user_count: number;
  percentage_of_users: number;     // Share of 3,021,435 users
}
