import { describe, it, expect } from 'vitest';
import {
  pipelineStages,
  cleaningAudit,
  dataLineage,
  visualizationGallery,
  categoryBrandTreemap,
  productBubbleData,
  projectMethodology,
} from '@/data';

describe('M04: Distributed Data Pipeline Architecture', () => {
  it('should have 6 sequential pipeline stages with correct record flows', () => {
    expect(pipelineStages).toHaveLength(6);
    expect(pipelineStages.map((s) => s.stage_id)).toEqual([1, 2, 3, 4, 5, 6]);

    // Stage 1 Ingestion
    expect(pipelineStages[0].records_in).toBe(42448764);
    expect(pipelineStages[0].records_out).toBe(42448764);
    expect(pipelineStages[0].partitions).toBe(13);

    // Stage 3 Spark Cleaning
    expect(pipelineStages[2].records_in).toBe(42448764);
    expect(pipelineStages[2].records_out).toBe(42349874);
    expect(pipelineStages[2].records_in - pipelineStages[2].records_out).toBe(98890);

    // Stage 4 Parquet Conversion
    expect(pipelineStages[3].records_in).toBe(42349874);
    expect(pipelineStages[3].records_out).toBe(42349874);
  });

  it('should include technical specifications, limitations, and related views for each stage', () => {
    pipelineStages.forEach((stage) => {
      expect(stage.technology).toBeTruthy();
      expect(stage.input_source).toBeTruthy();
      expect(stage.output_target).toBeTruthy();
      expect(stage.key_transformations.length).toBeGreaterThanOrEqual(2);
      expect(stage.limitations.length).toBeGreaterThanOrEqual(1);
      expect(stage.related_view.startsWith('/')).toBe(true);
    });
  });
});

describe('M04: Data Cleaning & Hygiene Audit Invariants', () => {
  it('should verify exact row reconciliation math', () => {
    const { summary, removals_breakdown, cleaning_pipeline_stages } = cleaningAudit;

    expect(summary.raw_records).toBe(42448764);
    expect(summary.cleaned_records).toBe(42349874);
    expect(summary.net_removed_records).toBe(98890);
    expect(summary.retention_rate_percent).toBeCloseTo(99.77, 2);
    expect(summary.removal_rate_percent).toBeCloseTo(0.23, 2);

    const totalBreakdown = removals_breakdown.reduce((acc, curr) => acc + curr.records_removed, 0);
    expect(totalBreakdown).toBe(98890);

    // Deterministic price vs unsegregated remainder
    expect(removals_breakdown[0].records_removed).toBe(68673);
    expect(removals_breakdown[1].records_removed).toBe(30217);
    expect(removals_breakdown[0].records_removed + removals_breakdown[1].records_removed).toBe(98890);

    // 5-stage cleaning log
    expect(cleaning_pipeline_stages).toHaveLength(5);
    expect(cleaning_pipeline_stages[0].input_count).toBe(42448764);
    expect(cleaning_pipeline_stages[4].output_count).toBe(42349874);
  });

  it('should document categorical missingness and deduplication sample metrics', () => {
    const { categorical_missingness, deduplication_audit } = cleaningAudit;

    expect(categorical_missingness).toHaveLength(2);
    const categoryCode = categorical_missingness.find((c) => c.field === 'category_code');
    const brand = categorical_missingness.find((c) => c.field === 'brand');

    expect(categoryCode?.missing_count).toBe(13515601);
    expect(categoryCode?.missing_percent).toBeCloseTo(31.91, 2);
    expect(brand?.missing_count).toBe(6117080);
    expect(brand?.missing_percent).toBeCloseTo(14.44, 2);

    expect(deduplication_audit.sample_audit_size).toBe(1000000);
    expect(deduplication_audit.sample_duplicates_found).toBe(28);
    expect(deduplication_audit.sample_duplicate_rate_percent).toBe(0.0028);
    expect(deduplication_audit.methodological_caveat).toBeTruthy();
  });
});

describe('M04: Typed Data Lineage Registry', () => {
  it('should register exactly 18 research artifacts with unique IDs', () => {
    expect(dataLineage).toHaveLength(18);

    const ids = dataLineage.map((a) => a.artifact_id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(18);
  });

  it('should provide valid paths, formats, and dependencies for all artifacts', () => {
    dataLineage.forEach((artifact) => {
      expect(artifact.artifact_id.startsWith('ART-')).toBe(true);
      expect(artifact.display_name).toBeTruthy();
      expect(artifact.source_filename).toBeTruthy();
      expect(artifact.storage_path).toBeTruthy();
      expect(typeof artifact.format).toBe('string');
      expect(artifact.format.length).toBeGreaterThan(0);
      expect(Array.isArray(artifact.input_dependencies)).toBe(true);
      expect(Array.isArray(artifact.output_dependencies)).toBe(true);
      expect(['baseline', 'derived', 'verified']).toContain(artifact.verification_status);
      expect(artifact.known_caveats.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('M04: Research Visualization Gallery', () => {
  it('should contain all 29 research plots across 6 analytical categories', () => {
    expect(visualizationGallery).toHaveLength(29);

    const categories = new Set(visualizationGallery.map((v) => v.category));
    expect(categories.size).toBe(6);
    expect(categories.has('Event Behavior')).toBe(true);
    expect(categories.has('Revenue & Temporal')).toBe(true);
    expect(categories.has('Product & Category')).toBe(true);
    expect(categories.has('Brand Concentration')).toBe(true);
    expect(categories.has('Customer Distributions')).toBe(true);
    expect(categories.has('Statistical Relationships')).toBe(true);
  });

  it('should include 14 Phase 7 plots, 11 supplementary plots, and 4 interactive charts', () => {
    const phase7 = visualizationGallery.filter((v) => v.phase.includes('Phase 7'));
    expect(phase7).toHaveLength(14);

    const interactive = visualizationGallery.filter(
      (v) => v.interactive_type === 'echarts_reimplementation'
    );
    expect(interactive).toHaveLength(4);

    visualizationGallery.forEach((item) => {
      expect(item.id.startsWith('plot-')).toBe(true);
      expect(item.title).toBeTruthy();
      expect(item.image_url.startsWith('/visualizations/')).toBe(true);
      expect(item.analytical_interpretation.length).toBeGreaterThan(20);
      expect(item.research_significance.length).toBeGreaterThan(20);
    });
  });
});

describe('M04: Interactive Chart Studio Datasets', () => {
  it('should validate the 159-node Category & Brand Treemap hierarchy', () => {
    expect(categoryBrandTreemap).toHaveLength(159);

    const roots = categoryBrandTreemap.filter((n) => !n.parent || n.parent === '');
    expect(roots).toHaveLength(9);

    const leaves = categoryBrandTreemap.filter((n) => n.parent && n.parent !== '');
    expect(leaves).toHaveLength(150);

    // Verify Apple and Electronics existence and scale
    const electronics = roots.find((r) => r.id === 'electronics');
    expect(electronics).toBeDefined();
    expect(electronics?.value).toBeGreaterThan(160000000);

    const apple = leaves.find((l) => l.id === 'electronics/apple');
    expect(apple).toBeDefined();
    expect(apple?.value).toBeGreaterThan(100000000);
  });

  it('should validate the 100-item Product Bubble Matrix dataset', () => {
    expect(productBubbleData).toHaveLength(100);

    productBubbleData.forEach((p, idx) => {
      expect(p.product_rank).toBe(idx + 1);
      expect(p.product_label).toBeTruthy();
      expect(p.purchases).toBeGreaterThan(0);
      expect(p.revenue).toBeGreaterThan(0);
      expect(p.unique_buyers).toBeGreaterThan(0);
      expect(p.average_price).toBeGreaterThan(0);
    });

    // Rank 1 product should have highest purchases
    expect(productBubbleData[0].product_rank).toBe(1);
    expect(productBubbleData[0].purchases).toBeGreaterThan(productBubbleData[99].purchases);
  });
});

describe('M04: Project Methodology Walkthrough', () => {
  it('should contain 10 sequential methodology steps covering the full lifecycle', () => {
    expect(projectMethodology).toHaveLength(10);
    expect(projectMethodology.map((m) => m.step_number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    projectMethodology.forEach((step) => {
      expect(step.title).toBeTruthy();
      expect(step.phase_label).toBeTruthy();
      expect(step.summary).toBeTruthy();
      expect(step.key_points.length).toBeGreaterThanOrEqual(2);
      expect(step.technical_details.length).toBeGreaterThanOrEqual(2);
      expect(step.related_route.startsWith('/')).toBe(true);
    });
  });

  it('should verify 4 of 4 legacy Plotly charts have authentic source files and hierarchy', () => {
    // 159 nodes in hierarchical category/brand dataset
    expect(categoryBrandTreemap).toHaveLength(159);
    const roots = categoryBrandTreemap.filter((n) => !n.parent || n.parent === '');
    expect(roots).toHaveLength(9);

    // Electronics root should be present with highest value
    const electronics = roots.find((r) => r.id === 'electronics');
    expect(electronics).toBeDefined();
    expect(electronics!.value).toBeGreaterThan(160000000);
  });
});

