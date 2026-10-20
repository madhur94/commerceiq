import { describe, it, expect } from 'vitest';
import { commerceIQChartTheme } from '../charts/theme';
import { brandRevenue, brandRevenueTop50, categoryRevenue, topProducts, verifiedMetrics } from '../data';

describe('CommerceIQ Interactive Analytics & Visual Engine Verification', () => {
  it('ECharts theme matches calibrated palette and dark accessibility specs', () => {
    expect(commerceIQChartTheme.backgroundColor).toBe('transparent');
    expect(commerceIQChartTheme.color[0]).toBe('#8B5CF6'); // Laser Violet
    expect(commerceIQChartTheme.color[1]).toBe('#06B6D4'); // Electric Cyan
    expect(commerceIQChartTheme.textStyle.color).toBe('#94A3B8');
  });

  it('verifies all 1,985 brands are loaded with correct rank and revenue dominance', () => {
    // 1,986 CSV lines = 1 header line + 1,985 distinct brand rows
    expect(brandRevenue.length).toBe(1985);
    expect(brandRevenueTop50.length).toBe(50);

    const rank1 = brandRevenue[0];
    expect(rank1.brand).toBe('apple');
    expect(rank1.rank).toBe(1);
    expect(rank1.revenue_share_percentage).toBeGreaterThan(48);

    const rank2 = brandRevenue[1];
    expect(rank2.brand).toBe('samsung');
    expect(rank2.rank).toBe(2);
    expect(rank2.revenue_share_percentage).toBeGreaterThan(20);

    // Apple + Samsung combine for over 68.5%
    const top2Share = rank1.revenue_share_percentage + rank2.revenue_share_percentage;
    expect(top2Share).toBeGreaterThan(68.5);
  });

  it('verifies category catalog covers 14 categories and electronics dominance', () => {
    expect(categoryRevenue.length).toBe(14);
    const electronics = categoryRevenue.find((c) => c.main_category === 'electronics');
    expect(electronics).toBeDefined();
    expect(electronics?.revenue_share_percentage).toBeCloseTo(76.74, 1);
  });

  it('verifies product leaders integrity in topProducts', () => {
    expect(topProducts.by_revenue.length).toBeGreaterThanOrEqual(10);
    expect(topProducts.by_volume.length).toBeGreaterThanOrEqual(10);

    // Product 1005115 dominates revenue
    expect(topProducts.by_revenue[0].product_id).toBe(1005115);
    // Product 1004856 dominates volume
    expect(topProducts.by_volume[0].product_id).toBe(1004856);
  });

  it('verifies gross brand revenue matches verified platform purchase revenue', () => {
    const totalBrandRev = brandRevenue.reduce((acc, b) => acc + b.total_revenue, 0);
    // Due to IEEE 754 precision in summing 1,986 floats, should match within 1 unit
    expect(Math.abs(totalBrandRev - verifiedMetrics.purchase_revenue)).toBeLessThan(1.0);
  });
});
