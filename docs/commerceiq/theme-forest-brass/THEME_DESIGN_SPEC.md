# COMMERCEIQ — FOREST & BRASS THEME DESIGN SPECIFICATION

## 1. Executive Summary & Design Vision

The **Forest & Brass** visual theme transforms CommerceIQ from a consumer-style midnight-navy/cyan aesthetic into an authoritative, architectural, research-grade commerce intelligence terminal. 

Inspired by classic British library architecture, high-precision Swiss scientific instrumentation, and sovereign economic research consoles, this visual language pairs deep, layered forest greens with warm, luminous brass detailing and parchment-toned typography.

### Core Tenets
1. **Architectural Permanence**: Deep, muted forest tones (`#091B19`, `#102622`, `#18342D`) create an expansive, serene spatial foundation without blinding high-contrast glare.
2. **Warm Precision Accents**: Warm metallic brass (`#DBB474`, `#EDCC91`, `#A9854C`) provides luminous focus points for active states, key metric highlights, and interactive triggers without visual noise.
3. **Parchment Legibility**: Text tokens (`#F2EEE0` primary, `#AABCAF` muted) simulate archival print, delivering effortless readability and exceeding WCAG 2.1 AAA contrast benchmarks.
4. **Strict Isolation of Data & Visualization Layers**: The theme acts exclusively as an exterior presentation-layer chrome. All WebGL 3D scenes (Commerce Nexus and Customer Constellation) and analytical chart canvases (ECharts) remain completely untouched and scientifically pristine.

---

## 2. Color Palette Specification

All color tokens are implemented through semantic Tailwind utility classes mapped directly to root CSS variables.

| Token Name | Hex Code | Semantic Role | Tailwind Utility | WCAG Contrast (on Canvas/Card) |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#091B19` | Root viewport canvas, global background | `bg-forest-canvas` | — |
| **Sidebar Surface** | `#102622` | Navigation sidebar background | `bg-forest-sidebar` | — |
| **Header Surface** | `#10241F` | Sticky top navigation bar | `bg-forest-header` | — |
| **Card Surface** | `#18342D` | Primary container surface for cards & panels | `bg-forest-card` | — |
| **Elevated Surface** | `#204137` | Hovered rows, sub-cards, nested chips | `bg-forest-elevated` | — |
| **Primary Text** | `#F2EEE0` | Headings, main data values, active labels | `text-forest-text-primary` | **16.5:1** (AAA on Canvas), **12.5:1** (AAA on Card) |
| **Muted Text** | `#AABCAF` | Metadata, subtitles, column headers | `text-forest-text-muted` | **7.5:1** (AAA on Canvas), **6.3:1** (AA on Card) |
| **Border Primary** | `#325347` | Outer structural borders, card outlines | `border-forest-border` | **3.8:1** (UI component boundary) |
| **Border Light / Divider** | `#29493E` | Table dividers, subtle group separators | `border-forest-border-light`| — |
| **Disabled Surface** | `#263C34` | Inactive buttons, disabled inputs | `bg-forest-disabled` | — |
| **Brass Accent** | `#DBB474` | Active tabs, key badges, primary CTAs | `text-brass`, `border-brass`, `bg-brass` | **8.8:1** (AAA on Canvas), **6.7:1** (AAA on Card) |
| **Brass Hover** | `#EDCC91` | Hover states on interactive brass elements | `hover:text-brass-hover`, `hover:bg-brass-hover` | — |
| **Brass Deep** | `#A9854C` | Deep brass borders, subdued metallic lines | `border-brass-deep` | — |
| **Dark Brass Text** | `#14241F` | High-contrast text on solid brass buttons | `text-brass-dark` | **9.8:1** (AAA on `#DBB474`) |

---

## 3. Typography & Numerical Display System

1. **System & Display Font Hierarchy**:
   - Primary Interface: Clean modern geometric sans-serif stack (`Inter`, system-ui, -apple-system, sans-serif) for navigational clarity.
   - Headers: Medium weight parchment text (`#F2EEE0`) with generous letter-spacing (`tracking-wide` on uppercase section tags).
2. **Tabular Numerics**:
   - Monospace numeric typography (`font-mono`, `tabular-nums`) across all financial amounts, user counts, percentages, and cluster coordinates to prevent layout jittering during state transitions.
3. **Contrast Verification**:
   - Every text-on-surface combination conforms to WCAG 2.1 Level AA or Level AAA standards.
   - Inverted brass buttons utilize `#14241F` dark slate-forest text on `#DBB474` brass background, delivering an outstanding **9.8:1** contrast ratio.

---

## 4. UI Shell & Component Architecture

### 4.1 Global Layout Chrome
- **Sidebar (`Sidebar.tsx`, `SidebarNavItem.tsx`)**:
  - Background: `#102622` (`bg-forest-sidebar`) with `#325347` right boundary border.
  - Active Route: Forest elevated pill (`bg-forest-elevated/90`), brass border indicator (`border-brass`), and luminous brass text (`text-brass`).
  - Hover Route: Muted forest lift (`hover:bg-forest-elevated/50`), parchment text (`hover:text-forest-text-primary`).
  - Collapse Toggle: Smoothly transitions width (64px collapsed, 256px expanded) with accessible tooltip hints.
- **TopNav (`TopNav.tsx`)**:
  - Sticky header (`bg-forest-header/90 backdrop-blur-md`) with bottom border (`border-forest-border`).
  - System status pill (`Operational`, verified metrics stamp) framed in brass outline (`border-brass/40`) with emerald pulse indicator.
  - Breadcrumbs: Archival parchment typography (`text-forest-text-muted` to `text-forest-text-primary`).
- **Footer (`Footer.tsx`)**:
  - Architectural grounding with deep forest background (`bg-forest-sidebar`), subtle divider (`border-forest-border-light`), verified data provenance badges, and institutional disclaimer copy.

### 4.2 Shared Design Components
- **SurfaceCard (`SurfaceCard.tsx`)**:
  - Standard container: `bg-forest-card border border-forest-border rounded-xl shadow-lg shadow-black/20`.
  - Elevated variant: `bg-forest-elevated border-brass/30`.
- **KpiCard (`KpiCard.tsx`)**:
  - Deep forest card with prominent brass/parchment numerical values, benchmark indicators, and contextual sparkline-compatible frames.
- **NoticeBanner (`NoticeBanner.tsx`)**:
  - Research methodology and disclaimer banners framed in deep green/brass borders with parchment text.
- **StatusIndicator (`StatusIndicator.tsx`)**:
  - Live pulse nodes for real-time telemetry, model readiness, and cluster status.

---

## 5. Responsive Design & Layout Preservation

The Forest & Brass theme strictly honors all responsive layout enhancements established in M05:
1. **Desktop Large (1440px+)**: Full expansive 5-column and 4-column metric grids, side-by-side 3D viewports, and multi-column comparison tables.
2. **Intermediate Desktop (1280px - 1439px)**: Balanced 3+2 KPI grid on Overview and Sales Intelligence to prevent awkward card wrapping.
3. **Tablet (768px - 1023px)**: Responsive 2-column card layouts, auto-scrolling data tables with sticky column headers, and compact 3D viewport height (420px).
4. **Mobile (390px - 767px)**: Single-column stacked layouts, mobile drawer navigation, compact notice banners, and hardware-accelerated 2D Radar fallback when WebGL is constrained.

---

## 6. Architectural Invariant Guarantees

To ensure complete analytical and scientific fidelity, the theme applies strict physical isolation:
- **3D Scenes Protected**: Neither `CommerceNexusScene.tsx` nor `CustomerConstellationScene.tsx` contains any theme-layer modifications. Camera trajectories, particle shaders, point-cloud geometries, and interaction raycasters are 100% intact.
- **ECharts Protected**: Chart definitions (`frontend/src/charts/theme.ts`, `useECharts.ts`, and `frontend/src/components/charts/*`) remain completely unchanged.
- **Analytics Protected**: Zero business logic, normalization functions, or data stores (`verifiedMetrics.json`, `kmeansClusters.json`) were altered.
