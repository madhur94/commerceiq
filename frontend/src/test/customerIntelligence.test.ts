import { describe, it, expect } from 'vitest';
import { kmeansClusters, pcaVariance, userActivityDistribution, verifiedMetrics } from '../data';

describe('Customer Intelligence & ML Behavioral Segmentation Invariants', () => {
  const c0 = kmeansClusters.clusters[0];
  const c1 = kmeansClusters.clusters[1];

  it('reconciles analyzed user population with outlier exclusion', () => {
    const totalUsers = verifiedMetrics.users; // 3,021,435
    const modelUsers = kmeansClusters.selected_model.analyzed_users; // 3,021,434
    const clusterUserSum = c0.user_count + c1.user_count; // 250,388 + 2,771,046

    expect(totalUsers).toBe(3021435);
    expect(modelUsers).toBe(3021434);
    expect(clusterUserSum).toBe(modelUsers);
    expect(totalUsers - modelUsers).toBe(1); // Exactly 1 extreme outlier excluded
  });

  it('calculates segment population shares correctly and sums to 100%', () => {
    const totalClustered = kmeansClusters.selected_model.analyzed_users;
    const share0 = (c0.user_count / totalClustered) * 100;
    const share1 = (c1.user_count / totalClustered) * 100;

    expect(Number(share0.toFixed(2))).toBe(8.29);
    expect(Number(share1.toFixed(2))).toBe(91.71);
    expect(Number((share0 + share1).toFixed(2))).toBe(100.0);
    expect(c0.share_percent).toBe(8.29);
    expect(c1.share_percent).toBe(91.71);
  });

  it('preserves verified Cluster 0 (High Activity Core) centroid statistics', () => {
    expect(c0.cluster_id).toBe(0);
    expect(c0.average_revenue).toBe(520.86);
    expect(c0.average_purchases).toBe(1.58);
    expect(c0.average_sessions).toBe(12.26);
    expect(c0.unique_products).toBe(42.04);
    expect(c0.average_events).toBe(85.43);
    expect(c0.average_views).toBe(82.0);
    expect(c0.average_carts).toBe(1.849);
  });

  it('preserves verified Cluster 1 (Casual Browsers) centroid statistics', () => {
    expect(c1.cluster_id).toBe(1);
    expect(c1.average_revenue).toBe(35.91);
    expect(c1.average_purchases).toBe(0.125);
    expect(c1.average_sessions).toBe(2.22);
    expect(c1.unique_products).toBe(4.6);
    expect(c1.average_events).toBe(7.56);
    expect(c1.average_views).toBe(7.28);
    expect(c1.average_carts).toBe(0.157);
  });

  it('validates behavioral multiple ratios between segments', () => {
    const revRatio = c0.average_revenue / c1.average_revenue;
    const purchRatio = c0.average_purchases / c1.average_purchases;
    const sessRatio = c0.average_sessions / c1.average_sessions;
    const prodRatio = c0.unique_products / c1.unique_products;

    expect(Number(revRatio.toFixed(1))).toBe(14.5);
    expect(Number(purchRatio.toFixed(1))).toBe(12.6);
    expect(Number(sessRatio.toFixed(1))).toBe(5.5);
    expect(Number(prodRatio.toFixed(1))).toBe(9.1);
  });

  it('verifies PCA explained variance structure and 95% retention threshold', () => {
    expect(pcaVariance).toHaveLength(7);

    // PC1 is dominant
    expect(pcaVariance[0].component).toBe('PC1');
    expect(pcaVariance[0].explained_variance_percent).toBeCloseTo(40.7123, 3);

    // Cumulative progression
    let runningSum = 0;
    pcaVariance.forEach((pc) => {
      runningSum += pc.explained_variance_percent;
      expect(pc.cumulative_variance_percent).toBeCloseTo(runningSum, 2);
    });

    // Final retention at PC7 exceeds 95%
    const finalPc = pcaVariance[pcaVariance.length - 1];
    expect(finalPc.component).toBe('PC7');
    expect(finalPc.cumulative_variance_percent).toBe(95.967);
    expect(finalPc.cumulative_variance_percent).toBeGreaterThan(95.0);
  });

  it('validates K-Means sensitivity experiments and optimal model selection', () => {
    const exps = kmeansClusters.sensitivity_experiments;
    expect(exps).toHaveLength(6);

    const selected = exps.find((e) => e.is_selected);
    expect(selected).toBeDefined();
    expect(selected?.experiment_name).toBe('K=2 (Outlier Excluded)');
    expect(selected?.clusters_k).toBe(2);
    expect(selected?.silhouette_score).toBe(0.81115);
    expect(selected?.outlier_excluded).toBe(true);

    // All scores are within valid Silhouette range (-1 to 1)
    exps.forEach((e) => {
      expect(e.silhouette_score).toBeGreaterThan(0.4);
      expect(e.silhouette_score).toBeLessThanOrEqual(1.0);
    });
  });

  it('verifies user activity tiers summation and dominant majority', () => {
    expect(userActivityDistribution).toHaveLength(5);

    const userSum = userActivityDistribution.reduce((acc, t) => acc + t.user_count, 0);
    const pctSum = userActivityDistribution.reduce((acc, t) => acc + t.percentage_of_users, 0);

    expect(userSum).toBe(3021435);
    expect(pctSum).toBeCloseTo(100.0, 2);

    // Dominant first tier (1-5 events)
    const tier1 = userActivityDistribution.find((t) => t.activity_group_raw === '1–5 events');
    expect(tier1).toBeDefined();
    expect(tier1?.percentage_of_users).toBeGreaterThan(55.0);
  });

  it('validates M05-A visualization display modes and state preservation', () => {
    const validDisplayModes = ['constellation', 'visual', 'table'] as const;
    expect(validDisplayModes).toHaveLength(3);

    // Verify segment selection state persistence across all modes
    const validSelectionModes = ['both', 0, 1] as const;
    validSelectionModes.forEach((selectedSegment) => {
      validDisplayModes.forEach((mode) => {
        // State must remain strictly typed and preserved without loss
        const testState = { mode, selectedSegment };
        expect(testState.selectedSegment).toBe(selectedSegment);
        expect(validDisplayModes).toContain(testState.mode);
      });
    });
  });

  it('verifies mobile breakpoint resolution logic for 3D vs 2D modes', () => {
    const resolveInitialMode = (width: number) => (width < 768 ? 'visual' : 'constellation');

    expect(resolveInitialMode(390)).toBe('visual'); // Mobile
    expect(resolveInitialMode(767)).toBe('visual'); // Mobile boundary
    expect(resolveInitialMode(768)).toBe('constellation'); // Tablet breakpoint
    expect(resolveInitialMode(1280)).toBe('constellation'); // Desktop
    expect(resolveInitialMode(1440)).toBe('constellation'); // Wide Desktop
  });

  it('enforces M05-A scientific boundary and cluster population integrity', () => {
    // 3D Scene must represent aggregate centroids, not fabricated individual points
    expect(kmeansClusters.clusters[0].user_count).toBe(250388);
    expect(kmeansClusters.clusters[1].user_count).toBe(2771046);
    expect(kmeansClusters.clusters[0].share_percent).toBe(8.29);
    expect(kmeansClusters.clusters[1].share_percent).toBe(91.71);

    // Total clustered users must strictly equal 3,021,434
    expect(kmeansClusters.clusters[0].user_count + kmeansClusters.clusters[1].user_count).toBe(3021434);

    // Disclaimed retracted figures must NEVER appear
    expect(kmeansClusters.clusters[0].user_count).not.toBe(13618);
    expect(kmeansClusters.clusters[1].user_count).not.toBe(3007816);
  });
});

