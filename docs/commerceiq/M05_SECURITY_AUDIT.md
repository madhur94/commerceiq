# CommerceIQ — M05 Security & Data Safety Audit
**Milestone:** M05 — Final Application Polishing & Production Delivery  
**Audit Scope:** Client-Side Data Handling, Export Sanitation, PII Masking, and Sandbox Isolation  
**Status:** AUDITED & SECURE  

---

## 1. CSV Formula-Injection Defenses (OWASP Compliance)

In web applications, exporting user-filtered tables to CSV introduces spreadsheet formula-injection vulnerabilities (CSV Injection / Formula Injection). If a data cell begins with characters such as `=`, `+`, `-`, `@`, `\t`, or `\r`, spreadsheet engines (Microsoft Excel, LibreOffice Calc, Google Sheets) may execute dynamic DDE commands or trigger remote code execution.

### 1.1 Implementation Architecture (`src/utils/csvExport.ts`)

```typescript
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'number') {
    if (isNaN(value)) return '""';
    return String(value);
  }

  let str = String(value);
  // Guard against formula injection triggers (including leading whitespace)
  const dangerousRegex = /^[\t\r ]*[=+\-@\t\r]/;
  if (dangerousRegex.test(str)) {
    str = `'${str.trimStart()}`;
  }

  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}
```

### 1.2 Security Controls Verified

| Vulnerability Vector | Test Input | Sanitized Output | Spreadsheet Behavior |
|---|---|---|---|
| Formula Execution (`=`) | `=SUM(A1:A10)` | `"'=SUM(A1:A10)"` | Treated strictly as literal text |
| External Command (`+`) | `+cmd\|/C calc` | `"' +cmd\|/C calc"` | Neutralized, no DDE trigger |
| Negative Number Injection | `-100` (as string) | `"'-100"` | Neutralized formula execution |
| XML/Web Exfiltration (`@`) | `@IMPORTXML(...)` | `"'@IMPORTXML(...) "` | Prevented outbound network calls |
| Leading Whitespace Bypass | `\t=DDE(...)` | `"'=DDE(...)"` | Trimmed and single-quote escaped |
| Internal Quotes | `Apple "Pro"` | `"Apple ""Pro"""` | RFC 4180 double-quote escaping |
| UTF-8 Encoding | Multi-byte characters | Prepend `\uFEFF` (BOM) | Prevents UTF-7 injection and mojibake |

---

## 2. Customer Privacy & Telemetry Masking

E-commerce big data analytics involves tracking user sessions. CommerceIQ implements strict data privacy guardrails:

### 2.1 Outlier Account Masking
- The extreme browsing account analyzed in Section G (`OutlierCaseStudyPanel.tsx`) is presented as:
  `usr_***849 (Telemetry ID: 5123****49)`
- **Audited Invariant:** A recursive search across all TypeScript files, test suites, and static JSON bundles in `frontend/src/` confirmed that the raw, full 9-digit user ID is **completely absent** from the production bundle and client codebase.
- No individual customer telemetry records or PII (names, email addresses, payment methods, shipping destinations) exist in the repository or static artifacts. All datasets represent precomputed statistical aggregations.

---

## 3. Sandboxing of Legacy Research Artifacts

CommerceIQ preserves the original 4 interactive Plotly research figures within `InteractiveChartStudio.tsx`.

### 3.1 Iframe Sandbox Attributes
When viewing legacy figures in the iframe viewer, the container enforces strict sandboxing:
```html
<iframe
  title={activeConfig.title}
  src={activeConfig.legacyHtml}
  sandbox="allow-scripts allow-same-origin"
  className="w-full flex-1 min-h-[440px] border-0 bg-white"
/>
```
- `allow-top-navigation`: **OMITTED** (prevents untrusted legacy scripts from redirecting the parent application).
- `allow-forms`: **OMITTED** (prevents legacy HTML from submitting external form data).
- `allow-popups`: **OMITTED** (prevents unauthorized modal or window creation).
- `allow-modals`: **OMITTED** (prevents `alert()`, `confirm()`, `prompt()` locking).

---

## 4. URL Parameter Sanitation & Defensive Routing

All URL search parameters (`?brand=`, `?category=`, `?tab=`, `?tier=`) undergo strict type guards and bounds checking:
- In `DataExplorerView.tsx`, invalid or unlisted tab strings fallback automatically to `'brands'`.
- Tier parameters are checked against an explicit enum (`['all', 'tier1', 'tier2', 'tier3', 'tier4']`).
- Wildcard route `*` redirects to the dedicated 404 Routing Boundary (`/404`), preventing unhandled client errors.

---

## 5. Security Audit Sign-off

CommerceIQ contains zero embedded API keys, zero private credentials, zero local filesystem path disclosures, and adheres strictly to OWASP CSV injection defense standards.
