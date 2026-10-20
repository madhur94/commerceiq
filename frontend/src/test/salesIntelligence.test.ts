import { describe, it, expect } from 'vitest';
import {
  dailyPurchases,
  hourlyDynamics,
  weekdaySummary,
  categoryRevenue,
  brandRevenueTop50,
  priceDistribution,
  verifiedMetrics,
} from '../data';

describe('Sales Intelligence Analytical Invariants & Connected Dimensions', () => {
  it('verifies peak daily revenue and order volume on October 16, 2019', () => {
    const oct16 = dailyPurchases.find((d) => d.event_date === '2019-10-16');
    expect(oct16).toBeDefined();
    expect(oct16?.total_revenue).toBeCloseTo(9810197.33, 2);
    expect(oct16?.purchase_events).toBe(31457);
    expect(oct16?.is_partial_day).toBe(false);
  });

  it('verifies partial-day collection boundary caveat on November 1, 2019', () => {
    const nov1 = dailyPurchases.find((d) => d.event_date === '2019-11-01');
    expect(nov1).toBeDefined();
    expect(nov1?.total_revenue).toBeCloseTo(537945.66, 2);
    expect(nov1?.purchase_events).toBe(1487);
    expect(nov1?.is_partial_day).toBe(true);
  });

  it('verifies the 7-hour temporal decoupling between browsing activity and purchase revenue', () => {
    const peakActivity = hourlyDynamics.find((h) => h.peak_activity);
    const peakRevenue = hourlyDynamics.find((h) => h.peak_revenue);

    expect(peakActivity).toBeDefined();
    expect(peakRevenue).toBeDefined();

    expect(peakActivity?.event_hour).toBe(21);
    expect(peakActivity?.event_count).toBe(3055061);

    expect(peakRevenue?.event_hour).toBe(14);
    expect(peakRevenue?.total_revenue).toBeCloseTo(17531268.91, 2);

    const hourLag = (peakActivity!.event_hour - peakRevenue!.event_hour + 24) % 24;
    expect(hourLag).toBe(7);
  });

  it('verifies Wednesday peak and Saturday trough in weekly purchasing momentum', () => {
    const wednesday = weekdaySummary.find((w) => w.weekday === 'Wednesday');
    const saturday = weekdaySummary.find((w) => w.weekday === 'Saturday');

    expect(wednesday).toBeDefined();
    expect(saturday).toBeDefined();

    expect(wednesday?.total_revenue).toBeCloseTo(37129880.02, 2);
    expect(wednesday?.purchase_events).toBe(119197);

    expect(saturday?.total_revenue).toBeCloseTo(29071361.02, 2);
    expect(saturday?.purchase_events).toBe(96010);
  });

  it('verifies category hierarchy and preservation of unclassified telemetry', () => {
    expect(categoryRevenue.length).toBe(14);

    const electronics = categoryRevenue[0];
    expect(electronics.main_category).toBe('electronics');
    expect(electronics.total_revenue).toBeCloseTo(176445577.86, 2);
    expect(electronics.revenue_share_percentage).toBeCloseTo(76.74, 1);

    const unknownCat = categoryRevenue.find((c) => c.main_category === 'Unknown');
    expect(unknownCat).toBeDefined();
    expect(unknownCat?.total_revenue).toBeCloseTo(22922165.08, 2);
    expect(unknownCat?.revenue_share_percentage).toBeCloseTo(9.97, 1);
  });

  it('verifies brand duopoly concentration and preservation of unbranded records', () => {
    const apple = brandRevenueTop50.find((b) => b.brand.toLowerCase() === 'apple');
    const samsung = brandRevenueTop50.find((b) => b.brand.toLowerCase() === 'samsung');
    const unknownBrand = brandRevenueTop50.find((b) => b.brand === 'Unknown');

    expect(apple).toBeDefined();
    expect(samsung).toBeDefined();
    expect(unknownBrand).toBeDefined();

    expect(apple?.rank).toBe(1);
    expect(apple?.total_revenue).toBeCloseTo(111199495.7, 1);
    expect(apple?.revenue_share_percentage).toBeCloseTo(48.36, 1);

    expect(samsung?.rank).toBe(2);
    expect(samsung?.total_revenue).toBeCloseTo(46402037.35, 1);
    expect(samsung?.revenue_share_percentage).toBeCloseTo(20.18, 1);

    const top2Revenue = (apple?.total_revenue ?? 0) + (samsung?.total_revenue ?? 0);
    const top2Share = (top2Revenue / verifiedMetrics.purchase_revenue) * 100;
    expect(top2Share).toBeCloseTo(68.54, 2);

    expect(unknownBrand?.rank).toBe(4);
    expect(unknownBrand?.total_revenue).toBeCloseTo(8539747.08, 1);
  });

  it('verifies high-ticket price bracket revenue asymmetry (>= 500 units)', () => {
    const tier500to1000 = priceDistribution.find((p) => p.price_range_display.includes('500'));
    const tier1000plus = priceDistribution.find((p) => p.price_range_display.includes('1000'));

    expect(tier500to1000).toBeDefined();
    expect(tier1000plus).toBeDefined();

    const highTicketRevenue = tier500to1000!.total_revenue + tier1000plus!.total_revenue;
    const highTicketOrders = tier500to1000!.purchase_events + tier1000plus!.purchase_events;

    const highTicketRevShare = (highTicketRevenue / verifiedMetrics.purchase_revenue) * 100;
    const highTicketOrderShare = (highTicketOrders / verifiedMetrics.purchase_events) * 100;

    // Over 55% of revenue from only ~18.36% of transactions
    expect(highTicketRevShare).toBeCloseTo(55.32, 1);
    expect(highTicketOrderShare).toBeCloseTo(18.36, 1);
  });
});
