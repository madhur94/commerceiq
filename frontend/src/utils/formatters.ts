/**
 * CommerceIQ Formatting Utilities
 * Adheres strictly to neutral monetary-unit labeling as mandated by project review.
 * No currency symbols (no ₹, no $) are applied because source metadata specifies 'currency_units'.
 */

/**
 * Formats an integer with standard digit grouping (thousands separators).
 * Example: 42349874 -> "42,349,874"
 */
export function formatInteger(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(val);
}

/**
 * Formats monetary amounts in undenominated monetary units with 2 decimal places.
 * Example: 229933212.63 -> "229,933,212.63 units" or "229,933,212.63"
 */
export function formatMonetaryValue(
  val: number | null | undefined,
  includeSuffix: boolean = false
): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
  return includeSuffix ? `${formatted} units` : formatted;
}

/**
 * Formats a number with neutral monetary units.
 * Supports 'full' (2 decimal places) or 'compact' (M/k suffix).
 */
export function formatMonetaryUnits(
  val: number | null | undefined,
  style: 'full' | 'compact' = 'full'
): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return style === 'compact' ? formatCompactMonetary(val, true) : formatMonetaryValue(val, true);
}

/**
 * Formats a monetary amount into a compact notation for high-level KPI cards and chart axes.
 * Example: 229933212.63 -> "229.93M units"
 */
export function formatCompactMonetary(
  val: number | null | undefined,
  includeSuffix: boolean = true
): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const suffix = includeSuffix ? ' units' : '';
  if (Math.abs(val) >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(2)}M${suffix}`;
  }
  if (Math.abs(val) >= 1_000) {
    return `${(val / 1_000).toFixed(1)}k${suffix}`;
  }
  return `${val.toFixed(2)}${suffix}`;
}

/**
 * Formats compact numbers for count metrics.
 * Example: 40708807 -> "40.71M", 898294 -> "898.3k"
 */
export function formatCompactCount(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  if (Math.abs(val) >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(val) >= 1_000) {
    return `${(val / 1_000).toFixed(1)}k`;
  }
  return formatInteger(val);
}

/**
 * Formats a percentage value.
 * Example: 96.12 -> "96.12%"
 */
export function formatPercent(val: number | null | undefined, decimals: number = 2): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${val.toFixed(decimals)}%`;
}

/**
 * Formats an event hour (0-23) with explicit UTC timezone notation.
 * Example: 14 -> "14:00 UTC", 21 -> "21:00 UTC"
 */
export function formatHourUTC(hour: number): string {
  const pad = hour.toString().padStart(2, '0');
  return `${pad}:00 UTC`;
}

/**
 * Sanitizes range strings by replacing corrupted encoding artifacts or en-dashes
 * with a standardized Unicode en-dash (–, U+2013).
 */
export function sanitizeRangeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/\u2013|\u2014|\xe2\x80\x93|\?["']/g, '–')
    .replace(/\s*–\s*/g, ' – ')
    .trim();
}
