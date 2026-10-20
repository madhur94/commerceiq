# CommerceIQ — Milestone M02 Implementation Specification

**Document ID:** `CIQ-M02-IMPLEMENTATION`  
**Milestone:** M02 — Sales Intelligence & Connected Exploration  
**Status:** Complete & Production Verified  
**Date:** October 19, 2026  
**Architect:** Principal Frontend Engineer, Creative UI/UX Specialist & Senior Software Architect  

---

## 1. Executive Architectural Overview

Milestone M02 transforms CommerceIQ's commercial telemetry from static analytical charts into an interconnected, highly interactive commercial intelligence suite. Built on top of React 18, TypeScript 5.6, Tailwind CSS 3.4, and Apache ECharts 6.1, the implementation unifies disparate marginal summaries into a cohesive, responsive analytical experience across desktop, tablet, and mobile form factors.

### Core Architectural Objectives Delivered:
1. **End-to-End Sales Intelligence Overhaul (`SalesIntelligenceView.tsx`):** Structured across Sections A through G with real ground-truth metrics, interactive data point selection, and focused entity inspection panels.
2. **Connected Exploration System:** Dynamic focus state (`selectedDate`, `selectedHour`, `selectedCategory`, `selectedBrand`, `selectedBracket`, `selectedWeekday`) with two-way chart synchronization, live contextual telemetry bar, and a persistent disclosure disallowing unsupported multi-dimensional cross-filtering.
3. **Seamless Catalog Drill-Down Integration (`DataExplorerView.tsx`):** Bidirectional deep-linking via React Router `useSearchParams` (`?brand=...`, `?tab=...`, `?category=...`, `?tier=...`) with persistent filter notification banners, category row highlighting, and one-click filter resets.
4. **OWASP-Compliant Safe CSV Export (`csvExport.ts`):** Complete formula-injection defense protecting downstream spreadsheet operators from code execution vectors (`=`, `+`, `-`, `@`, `\t`, `\r`) while preserving numerical integrity and UTF-8 BOM formatting.
5. **Chart Lifecycle & Selection Enhancements:** Standardized ECharts event bindings (`onEvents.click`), markLines, markPoints, dynamic zoom sliders, and theme-consistent focus colors across all 6 core charting components.

---

## 2. Component Engineering Breakdown

### 2.1 Sales Overview & Macro Telemetry (Section A)
Implemented using `KpiCard` components with tabular monospace numerals, domain-specific Lucide iconography, and strict adherence to neutral currency units:
- **Recorded Purchase Value:** `229.93M units` (`229,933,212.63 units`, 100% of validated recorded revenue across 32 days).
- **Total Purchase Orders:** `742,773` orders.
- **Platform AOV:** `309.56 units` (`229,933,212.63 / 742,773`).
- **Top 2 Brand Concentration:** `68.54%` (Apple `48.36%` + Samsung `20.18%` = `157.60M units`).
- **Peak Transaction Velocity:** `14:00 UTC` (`17.53M units` / hour; 7.62% of daily revenue velocity).

### 2.2 Interactive Daily Revenue Trajectory (Section B)
- **Component:** `DailyRevenueAreaChart.tsx`
- **Interactive Features:**
  - Dual-axis display toggling between Gross Value (`#8B5CF6`) and Order Volume (`#06B6D4`).
  - Integrated ECharts dataZoom slider (`enableDataZoom={true}`) allowing users to pinch, pan, and zoom across all 32 observation days.
  - Interactive point/area clicking fires `onSelectDate(date)`.
  - Dynamic cyan vertical cursor (`markLine`) marking the focused date.
  - Distinct amber dashed markLine annotating the `Nov 1: Partial Day (1.49k orders / 537.95k units)` boundary.
- **Focused Day Inspection Panel:** Automatically computes and displays day metrics, deviation from 31-day daily mean (`7.42M units` and `23,960 orders`), and partial-day warnings.
- **Collapsible Accessible Data Table:** On-demand scrollable table displaying all 32 days, revenue, orders, AOV, and collection status, ensuring 100% data transparency and screen-reader accessibility.

### 2.3 The Temporal Decoupling Phenomenon (Section C)
- **Component:** `HourlyDecouplingChart.tsx`
- **Scientific Narrative:** Highlights the 7-hour temporal lag between aggregate peak browsing activity at **21:00 UTC (3,055,061 events)** and aggregate peak purchase revenue at **14:00 UTC (17,531,268.91 monetary units)**.
- **Interactive Features:**
  - Synchronized dual-axis curves with custom marker pins on macro peaks.
  - Click-to-select hour bin with dynamic vertical markLine.
  - Live inspection HUD computing monetization efficiency (`units / 1,000 events`). At 14:00 UTC, efficiency reaches `7,006 units / 1k events`, compared to `4,554 units / 1k events` during the 21:00 UTC browsing spike.
  - Explicit methodology notice: Formally notes that this 7-hour separation is a macro platform phenomenon across global timezones and sessions, not an individual consumer journey.

### 2.4 Category Hierarchy & Merchandising Share (Section D)
- **Component:** `CategoryRevenueChart.tsx`
- **Data Integrity:**
  - Preserves Electronics dominance (`176,445,577.86 units`, 76.74% share).
  - Preserves `Unknown` category (`22,922,165.08 units`, 9.97% share) as an unclassified sector without fabrication.
- **Connected Interactions:**
  - Clicking any horizontal bar fires `onSelectCategory` and applies amber selection styling.
  - Focused category card displays exact revenue, orders, unique buyers, AOV, and platform share.
  - Direct action button: **"Catalog Explorer →"** deep links directly to `/data-explorer?tab=categories&category=${category}`.

### 2.5 Brand Pareto Concentration & Distribution (Section E)
- **Component:** `BrandParetoChart.tsx`
- **Data Integrity:**
  - Captures the Apple (`111.20M units`, 48.36%) and Samsung (`46.40M units`, 20.18%) duopoly controlling 68.54% of gross recorded value.
  - Preserves Rank 4 `Unknown` brand (`8.54M units`, 3.71% share) as unbranded inventory.
  - Contextual note detailing that 1,980 other brands share the remaining 21.6% of revenue.
- **Connected Interactions:**
  - Interactive bar clicking fires `onSelectBrand`.
  - Focused brand card displays rank, revenue, orders, buyers, AOV, and share.
  - Direct action button: **"Filter Brand →"** deep links directly to `/data-explorer?brand=${brand}`.

### 2.6 Price Bracket Spectrum & Ticket Asymmetry (Section F)
- **Component:** `PriceBracketChart.tsx`
- **Key Commercial Finding:**
  - High-ticket concentration: Tiers `≥ 500 units` account for **55.32% of total revenue** (`127.19M units`) while representing only **18.36% of orders** (`136,377` transactions).
  - The `1000 and above` tier alone delivers `64.26M units` (27.95% of revenue) from only 49,403 transactions (6.65% of volume).
  - Low-ticket volume: Products under 50 units drive 117,065 orders (15.76% of volume) but only 3.45M units (1.50% of revenue).
- **Connected Interactions:**
  - Bar selection highlights the bracket and provides a deep link to the Data Explorer tier filter.

### 2.7 Day-of-Week Purchasing Rhythm (Section G)
- **Component:** `WeekdayChart.tsx`
- **Dynamics:** Highlights Wednesday weekly peak (`37.13M units`, 119,197 orders) vs Saturday trough (`29.07M units`, 96,010 orders).
- **Connected Interactions:** Click-to-focus day card with platform share calculations.

---

## 3. Data Explorer Integration & CSV Safety Architecture

### 3.1 Deep Linking via URL Query Parameters
`DataExplorerView.tsx` was re-engineered to synchronize state with URL search parameters:
- `?brand=apple`: Automatically switches to the `'brands'` tab, populates the search query, resets pagination to page 1, and filters the table.
- `?tab=categories&category=electronics`: Switches to the Category Hierarchy tab, scrolls to category table, and highlights the target category row with an active cyan border and violet background.
- `?tier=tier1`: Automatically sets the revenue tier dropdown filter.
- **Connected Drill-Down Notification Banner:** Displays a prominent banner informing the user that the view was filtered from Sales Intelligence, complete with a "Reset Filter" button that cleans the URL parameters and restores the unfiltered catalog.

### 3.2 Safe CSV Formula-Injection Prevention (`csvExport.ts`)
To defend against OWASP CSV Injection (formula injection vulnerabilities in Microsoft Excel, LibreOffice Calc, and Google Sheets), all table exports route through `buildSafeCsv()` and `downloadCsv()`:
1. **Trigger Detection:** Tests for leading characters `=, +, -, @, \t, \r` (including preceding whitespace).
2. **Text Neutralization:** Prepends a single quote (`'`) to dangerous cells to instruct spreadsheet parsers to treat cell contents strictly as string literals.
3. **Escaping:** Replaces internal double quotes with RFC 4180 compliant doubled quotes (`""`).
4. **UTF-8 Byte Order Mark:** Prepends `\uFEFF` to the generated Blob so Excel on Windows and macOS correctly renders special characters without mojibake.

---

## 4. Verification & Testing Matrix

| Suite / Verification Area | Command | Invariants / Tests | Outcome |
| :--- | :--- | :--- | :--- |
| **Data Integrity Validator** | `npm run validate-data` | 35 / 35 assertions | **PASSED** (0 failures) |
| **Vitest Unit Test Suite** | `npm test` | 33 / 33 unit tests | **PASSED** (0 failures) |
| **TypeScript Static Check** | `npx tsc --noEmit` | 0 errors | **PASSED** (Clean compile) |
| **Production Vite Build** | `npm run build` | 2,586 modules transformed | **PASSED** (10.33s compile) |
| **Playwright Visual Verification** | `capture-screenshots.ts` | 18 full-viewport screenshots | **PASSED** (All viewports captured) |
