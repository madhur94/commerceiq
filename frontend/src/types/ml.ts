/**
 * CommerceIQ Data Contracts — Machine Learning, PCA & K-Means
 * Grounded in verified project documentation and results.
 */

export interface PCAComponentRecord {
  component: 'PC1' | 'PC2' | 'PC3' | 'PC4' | 'PC5' | 'PC6' | 'PC7';
  explained_variance_percent: number;
  cumulative_variance_percent: number;
  primary_interpretation: string;
}

export interface KMeansClusterProfile {
  cluster_id: 0 | 1;
  cluster_name: string;
  user_count: number;
  share_percent: number;
  average_events: number;
  average_views: number;
  average_carts: number;
  average_purchases: number;
  average_revenue: number;           // Average purchase-event value in monetary units
  average_sessions: number;
  unique_products: number;
  behavior_summary: string;
}

export interface KMeansExperimentScore {
  experiment_name: string;
  clusters_k: number;
  outlier_excluded: boolean;
  population_size: number;
  silhouette_score: number;
  is_selected: boolean;
  notes: string;
}
