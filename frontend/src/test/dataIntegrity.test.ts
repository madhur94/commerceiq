import { describe, it, expect } from 'vitest';
import {
  verifiedMetrics,
  eventDistribution,
  dailyPurchases,
  hourlyDynamics,
  categoryRevenue,
  kmeansClusters,
  pcaVariance,
} from '../data';

describe('CommerceIQ Data Integrity Invariants', () => {
  it('loads verified metrics matching master project figures', () => {
    expect(verifiedMetrics.raw_records).toBe(42448764);
    expect(verifiedMetrics.cleaned_records).toBe(42349874);
    expect(verifiedMetrics.net_records_removed).toBe(98890);
    expect(verifiedMetrics.invalid_price_records_filtered).toBe(68673);
    expect(verifiedMetrics.unsegregated_cleaning_difference).toBe(30217);
    expect(verifiedMetrics.users).toBe(3021435);
    expect(verifiedMetrics.sessions).toBe(9239403);
    expect(verifiedMetrics.purchase_events).toBe(742773);
    expect(verifiedMetrics.purchase_revenue).toBeCloseTo(229933212.63, 2);
  });

  it('verifies that event distribution sums to cleaned_records', () => {
    const sum = eventDistribution.reduce((acc, curr) => acc + curr.count, 0);
    expect(sum).toBe(verifiedMetrics.cleaned_records);
  });

  it('verifies hourly events sum to cleaned_records and detects peak hours', () => {
    const sum = hourlyDynamics.reduce((acc, curr) => acc + curr.event_count, 0);
    expect(sum).toBe(verifiedMetrics.cleaned_records);

    const peakAct = hourlyDynamics.find((h) => h.peak_activity);
    expect(peakAct?.event_hour).toBe(21);
    expect(peakAct?.event_count).toBe(3055061);

    const peakRev = hourlyDynamics.find((h) => h.peak_revenue);
    expect(peakRev?.event_hour).toBe(14);
    expect(peakRev?.total_revenue).toBeCloseTo(17531268.91, 2);
  });

  it('verifies daily purchases sum to 742,773 and tags partial day', () => {
    const sum = dailyPurchases.reduce((acc, curr) => acc + curr.purchase_events, 0);
    expect(sum).toBe(742773);

    const partialDay = dailyPurchases.find((d) => d.event_date === '2019-11-01');
    expect(partialDay?.is_partial_day).toBe(true);
    expect(partialDay?.purchase_events).toBe(1487);
  });

  it('verifies category purchases sum to 742,773', () => {
    const sum = categoryRevenue.reduce((acc, curr) => acc + curr.purchase_events, 0);
    expect(sum).toBe(742773);
  });

  it('verifies K=2 clustering population matches 3,021,434 (excluding 1 outlier)', () => {
    const totalClusterUsers = kmeansClusters.clusters.reduce((acc, curr) => acc + curr.user_count, 0);
    expect(totalClusterUsers).toBe(3021434);
    expect(verifiedMetrics.users - totalClusterUsers).toBe(1);
  });

  it('verifies PCA explains 95.967% cumulative variance across 7 components', () => {
    expect(pcaVariance.length).toBe(7);
    expect(pcaVariance[6].cumulative_variance_percent).toBeCloseTo(95.967, 3);
  });
});
