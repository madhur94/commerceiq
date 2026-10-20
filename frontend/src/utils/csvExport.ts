/**
 * CommerceIQ Safe CSV Export Utility
 * Implements strict formula injection prevention (OWASP CSV Injection Defense)
 * and RFC 4180 compliance with UTF-8 BOM encoding.
 */

/**
 * Sanitizes a single cell value for CSV export, preventing formula injection.
 * If a string begins with dangerous formula triggers (=, +, -, @, \t, \r),
 * it is prepended with a single quote (') to force spreadsheets (Excel, Calc, Google Sheets)
 * to interpret the content strictly as text without executing dynamic expressions or DDE commands.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  // Preserve numerical values directly without quoting if valid finite number
  if (typeof value === 'number') {
    if (isNaN(value)) return '""';
    return String(value);
  }

  let str = String(value);

  // Guard against spreadsheet formula injection triggers (including leading whitespace preceding a trigger)
  const dangerousRegex = /^[\t\r ]*[=+\-@\t\r]/;
  if (dangerousRegex.test(str)) {
    str = `'${str.trimStart()}`;
  }

  // Escape any existing double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Assembles a safe, RFC 4180 compliant CSV string from an array of headers and rows.
 */
export function buildSafeCsv(headers: string[], rows: (unknown[])[]): string {
  const headerLine = headers.map(sanitizeCsvCell).join(',');
  const rowLines = rows.map((row) => row.map(sanitizeCsvCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Triggers a client-side browser file download for generated CSV text.
 * Prepends a UTF-8 Byte Order Mark (BOM: \uFEFF) to guarantee correct symbol
 * rendering across Excel on Windows and macOS.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
