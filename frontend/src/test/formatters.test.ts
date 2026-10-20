import { describe, it, expect } from 'vitest';
import {
  formatInteger,
  formatMonetaryValue,
  formatMonetaryUnits,
  formatCompactMonetary,
  formatCompactCount,
  formatPercent,
  formatHourUTC,
  sanitizeRangeString,
} from '../utils/formatters';

describe('CommerceIQ Formatting Utilities (Neutral Currency Mandate)', () => {
  it('formats integers with thousands separators', () => {
    expect(formatInteger(42349874)).toBe('42,349,874');
    expect(formatInteger(742773)).toBe('742,773');
    expect(formatInteger(0)).toBe('0');
    expect(formatInteger(null)).toBe('—');
    expect(formatInteger(undefined)).toBe('—');
  });

  it('formats monetary values without currency symbols (strictly neutral units)', () => {
    // Review requirement: No INR (₹), No USD ($)
    const formatted = formatMonetaryValue(229933212.63);
    expect(formatted).toBe('229,933,212.63');
    expect(formatted).not.toContain('₹');
    expect(formatted).not.toContain('$');

    const withSuffix = formatMonetaryValue(229933212.63, true);
    expect(withSuffix).toBe('229,933,212.63 units');
  });

  it('formats compact monetary values with units suffix', () => {
    expect(formatCompactMonetary(229933212.63)).toBe('229.93M units');
    expect(formatCompactMonetary(17531268.91)).toBe('17.53M units');
    expect(formatCompactMonetary(520.86)).toBe('520.86 units');
    expect(formatCompactMonetary(null)).toBe('—');
  });

  it('formats compact count numbers', () => {
    expect(formatCompactCount(40708807)).toBe('40.71M');
    expect(formatCompactCount(898294)).toBe('898.3k');
    expect(formatCompactCount(742773)).toBe('742.8k');
    expect(formatCompactCount(250)).toBe('250');
  });

  it('formats percentages accurately', () => {
    expect(formatPercent(96.1248)).toBe('96.12%');
    expect(formatPercent(8.2865, 2)).toBe('8.29%');
    expect(formatPercent(null)).toBe('—');
  });

  it('formats event hours with explicit UTC notation', () => {
    expect(formatHourUTC(14)).toBe('14:00 UTC');
    expect(formatHourUTC(21)).toBe('21:00 UTC');
    expect(formatHourUTC(0)).toBe('00:00 UTC');
  });

  it('sanitizes range strings containing corrupted encoding or dashes', () => {
    expect(sanitizeRangeString('50–99.99')).toBe('50 – 99.99');
    expect(sanitizeRangeString('1–5 events')).toBe('1 – 5 events');
    expect(sanitizeRangeString('50\xe2\x80\x9399.99')).toBe('50 – 99.99');
  });

  it('formats neutral monetary units using formatMonetaryUnits', () => {
    expect(formatMonetaryUnits(229933212.63, 'full')).toBe('229,933,212.63 units');
    expect(formatMonetaryUnits(229933212.63, 'compact')).toBe('229.93M units');
    expect(formatMonetaryUnits(null)).toBe('—');
  });
});
