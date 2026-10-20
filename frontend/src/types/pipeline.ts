export interface PipelineStageRecord {
  stage_id: number;
  title: string;
  short_name: string;
  phase: string;
  technology: string;
  input_source: string;
  output_target: string;
  records_in: number;
  records_out: number;
  byte_size: string;
  partitions: number;
  summary: string;
  key_transformations: string[];
  limitations: string[];
  related_view: string;
}

export interface CleaningRemovalItem {
  cause: string;
  records_removed: number;
  share_of_removals_percent: number;
  share_of_raw_dataset_percent: number;
  rule_type: string;
  description: string;
}

export interface CategoricalMissingnessItem {
  field: string;
  missing_count: number;
  missing_percent: number;
  handling_strategy: string;
  impact: string;
}

export interface DeduplicationAuditInfo {
  sample_audit_size: number;
  sample_duplicates_found: number;
  sample_duplicate_rate_percent: number;
  random_1pct_sample_size?: number;
  random_1pct_duplicates_found?: number;
  random_1pct_duplicate_rate_percent?: number;
  full_data_action: string;
  methodological_caveat: string;
}

export interface CleaningPipelineStep {
  step: number;
  name: string;
  input_count: number;
  output_count: number;
  delta: number;
  notes: string;
}

export interface CleaningAuditData {
  summary: {
    raw_records: number;
    cleaned_records: number;
    net_removed_records: number;
    retention_rate_percent: number;
    removal_rate_percent: number;
    audit_period: string;
    cleaning_engine: string;
  };
  removals_breakdown: CleaningRemovalItem[];
  categorical_missingness: CategoricalMissingnessItem[];
  deduplication_audit: DeduplicationAuditInfo;
  cleaning_pipeline_stages: CleaningPipelineStep[];
}

export interface DataLineageArtifact {
  artifact_id: string;
  display_name: string;
  source_filename: string;
  storage_path: string;
  format: string;
  research_phase: string;
  record_count: number | string;
  byte_size: string;
  transformation_description: string;
  input_dependencies: string[];
  output_dependencies: string[];
  related_views: string[];
  verification_status: 'verified' | 'derived' | 'baseline';
  known_caveats: string[];
}

export interface GalleryVisualizationItem {
  id: string;
  title: string;
  category:
    | 'Event Behavior'
    | 'Revenue & Temporal'
    | 'Product & Category'
    | 'Brand Concentration'
    | 'Customer Distributions'
    | 'Statistical Relationships';
  phase: string;
  plot_type: string;
  image_url: string;
  source_file: string;
  data_source: string;
  interactive_type?: 'echarts_reimplementation';
  analytical_interpretation: string;
  research_significance: string;
  caveats: string;
}

export interface MethodologyStepRecord {
  step_number: number;
  title: string;
  phase_label: string;
  summary: string;
  key_points: string[];
  technical_details: string[];
  related_route: string;
}

export type MethodologyStep = MethodologyStepRecord;

export interface TreemapNodeRecord {
  id: string;
  label: string;
  parent: string;
  value: number;
}

export interface ProductBubbleRecord {
  product_rank: number;
  product_label: string;
  purchases: number;
  revenue: number;
  unique_buyers: number;
  average_price: number;
}
