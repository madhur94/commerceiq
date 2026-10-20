# CommerceIQ — Design System & Visual Specification

**Document ID:** `CIQ-M00-DESIGN`  
**Version:** 1.0.0  
**Theme:** Premium Futuristic Commerce Intelligence  
**Status:** Approved for Implementation  
**Author:** Principal UI/UX Designer & Creative Frontend Architect  

---

## 1. Design Vision & Guiding Philosophy

**CommerceIQ** is designed to look and feel like an elite financial intelligence and high-velocity commerce operations terminal. It departs decisively from generic, cookie-cutter dashboard templates and bright, flat dashboards. Instead, it utilizes a **Dark Midnight-Navy** architectural foundation, elevated with laser-precise **Violet and Cyan lighting accents**, subtle frosted-glass depth layers, and surgical typographic hierarchy.

### 1.1 Core Aesthetic Tenets
1. **Depth Without Noise:** Visual layering is achieved through luminance steps, hairline borders, and subtle back-drop blurs—never heavy drop shadows or cluttered decorative gradients.
2. **Intentional Chromatic Hierarchy:** 85% of the visual surface is quiet, neutral dark midnight tone. Vibrant cyan and violet are reserved for high-value metrics, active states, key interactive points, and primary chart series.
3. **Information First:** Data is never obscured by visual flair. Large tabular numbers use monospace/tabular figures; labels are crisp, and metadata is always legible.
4. **Cinematic Micro-Interactions:** Subtle, spring-calibrated micro-animations guide user focus and reward interaction without feeling sluggish or distracting.
5. **Purposeful 3D Presence:** Selective WebGL hardware-accelerated 3D elements (e.g., the signature Overview Data Torus) function as ambient status markers and interactive spatial anchors, not gimmicks.

---

## 2. Color Palette & Design Tokens

The color system is organized into foundational surfaces, interactive accents, semantic states, and unified chart colorways. All tokens are WCAG 2.1 AA compliant for contrast against their respective backgrounds.

### 2.1 Foundational Surfaces (Dark Midnight-Navy)
| Token Name | Hex Code | HSL Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `surface-canvas` | `#070A13` | `hsl(225, 46%, 5%)` | Deep viewport canvas, body background. |
| `surface-ground` | `#0B0F19` | `hsl(222, 47%, 7%)` | Primary layout shell, sidebar, and page container background. |
| `surface-card` | `#111827` | `hsl(220, 39%, 11%)` | Standard card surfaces, metric containers, table rows. |
| `surface-elevated` | `#162032` | `hsl(217, 39%, 14%)` | Hover states, active tabs, floating popovers, dropdown menus. |
| `surface-glass` | `rgba(17, 24, 39, 0.72)` | — | Frosted glass modals, sticky headers (`backdrop-blur-md`). |
| `border-subtle` | `rgba(255, 255, 255, 0.06)` | — | Hairline card borders, secondary dividers. |
| `border-prominent`| `rgba(255, 255, 255, 0.12)` | — | Card headers, table dividers, active borders. |
| `border-accent` | `rgba(139, 92, 246, 0.40)` | — | Focused inputs, selected card borders, active KPI rings. |

### 2.2 Brand & Accent Palette
| Token Name | Hex Code | HSL Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `accent-violet-primary` | `#8B5CF6` | `hsl(258, 90%, 66%)` | Signature primary accent, brand icons, primary buttons, PC1 series. |
| `accent-violet-glow` | `rgba(139, 92, 246, 0.25)` | — | Ambient backlights, focus rings, glow gradients. |
| `accent-cyan-primary` | `#06B6D4` | `hsl(189, 94%, 43%)` | Secondary electric accent, conversion funnels, purchase metrics. |
| `accent-cyan-bright` | `#22D3EE` | `hsl(187, 92%, 69%)` | Active chart highlights, hover markers, sparkline peaks. |
| `accent-indigo-deep` | `#6366F1` | `hsl(239, 84%, 67%)` | Multi-series charts, cluster segmentation profiles. |
| `accent-emerald` | `#10B981` | `hsl(159, 70%, 43%)` | Positive trends, high activity cluster badges, verification tags. |
| `accent-amber` | `#F59E0B` | `hsl(38, 92%, 50%)` | Warnings, outlier flags, incomplete audit disclosures. |
| `accent-rose` | `#F43F5E` | `hsl(348, 89%, 60%)` | Critical notices, severe negative deltas, price floor filters. |

### 2.3 Typography & Text Palette
| Token Name | Hex Code | Opacity / Weight | Usage |
| :--- | :--- | :--- | :--- |
| `text-primary` | `#F8FAFC` | 100% / SemiBold–Bold | Metric values, page headings, active links, primary labels. |
| `text-secondary` | `#94A3B8` | 100% / Regular–Medium | Section descriptions, table headers, sub-labels, axis titles. |
| `text-muted` | `#64748B` | 100% / Regular | Chart grid notes, footnotes, disabled states, timestamps. |
| `text-accent-cyan`| `#38BDF8` | 100% / Medium | Clickable filters, active badge text, positive indicators. |
| `text-accent-violet`| `#A78BFA` | 100% / Medium | Key analytical takeaways, ML component tags. |

### 2.4 Data Visualization Palette (ECharts Colorway)
To maintain visual harmony across all chart components, a unified 6-color sequential/categorical palette is calibrated specifically for dark backgrounds:

```css
:root {
  --chart-series-1: #8B5CF6; /* Laser Violet (Primary: Revenue, PC1, Cluster 0) */
  --chart-series-2: #06B6D4; /* Electric Cyan (Secondary: Events, Purchases) */
  --chart-series-3: #6366F1; /* Neon Indigo (Tertiary: Views, Sessions) */
  --chart-series-4: #EC4899; /* Radiant Magenta (Quaternary: Top Brands, Carts) */
  --chart-series-5: #10B981; /* Emerald Mint (Quinary: Cluster 1, Low Activity) */
  --chart-series-6: #F59E0B; /* Amber Spark (Senary: Outliers, Alerts) */
}
```

---

## 3. Typography Hierarchy & Font Stacks

CommerceIQ utilizes a dual font-stack pairing: **Inter** (or **Plus Jakarta Sans**) for ultra-crisp UI and editorial typography, paired with **JetBrains Mono** for numerical precision, timestamps, and mathematical formulas.

### 3.1 Font Stacks
```css
/* UI and Headings */
--font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Metrics, Currency, Table Data, Code */
--font-mono: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace;
```

### 3.2 Type Scale
| Level | Font Size | Line Height | Weight | Letter Spacing | Font Family | Example Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `36px` (`2.25rem`) | `44px` | `700 Bold` | `-0.03em` | Sans | Overview Screen Welcome Title |
| **Heading 1** | `28px` (`1.75rem`) | `36px` | `600 SemiBold` | `-0.02em` | Sans | Section Headers (Sales Intelligence) |
| **Heading 2** | `20px` (`1.25rem`) | `28px` | `600 SemiBold` | `-0.01em` | Sans | Card Titles, Modal Headers |
| **Heading 3** | `16px` (`1.00rem`) | `24px` | `500 Medium` | `0` | Sans | Subsection Headers, Chart Titles |
| **KPI Value Hero** | `32px` (`2.00rem`) | `40px` | `700 Bold` | `-0.02em` | Mono | Total Revenue, Event Counts |
| **KPI Value Card** | `24px` (`1.50rem`) | `32px` | `600 SemiBold` | `-0.01em` | Mono | Standard Metric Card Numbers |
| **Body Large** | `15px` (`0.938rem`)| `24px` | `400 Regular` | `0` | Sans | Hero Lead In, Methodological Notes |
| **Body Default** | `14px` (`0.875rem`)| `20px` | `400 Regular` | `0` | Sans | Paragraphs, Card Descriptions |
| **Body Small** | `12px` (`0.75rem`) | `16px` | `400 Regular` | `+0.01em` | Sans | Footnotes, Axis Labels, Timestamps |
| **Caption / Mono** | `11px` (`0.688rem`)| `14px` | `500 Medium` | `+0.03em` | Mono | Badges, Table Headers, Metric Delta |

---

## 4. Spacing Scale, Grid Architecture & Layout System

The interface is constructed using a strict **4px/8px modular base scale**, ensuring spatial equilibrium and rhythm across complex dashboard layouts.

### 4.1 Modular Spacing Scale
| Name | Pixels | Rem Value | Common Application |
| :--- | :--- | :--- | :--- |
| `space-1` | `4px` | `0.25rem` | Icon gaps, tight badge padding, hairline offsets. |
| `space-2` | `8px` | `0.50rem` | Button vertical padding, chip gaps, small borders. |
| `space-3` | `12px` | `0.75rem` | Card internal item gaps, input padding. |
| `space-4` | `16px` | `1.00rem` | Standard container padding, small card gutters. |
| `space-6` | `24px` | `1.50rem` | Primary grid gap, card padding, section separators. |
| `space-8` | `32px` | `2.00rem` | Major module separation, header margins. |
| `space-12`| `48px` | `3.00rem` | Page section dividers, hero bottom clearance. |

### 4.2 Responsive Layout Grid
* **App Shell Layout:** Persistent collapsible left sidebar (`w-64` expanded, `w-20` collapsed), full-width sticky glass header (`h-16`), and fluid content viewport with max-width bounding.
* **Max Container Width:** `1600px` (`max-w-[1600px]` with auto margins).
* **Grid Breakpoints:**
  * **Mobile (`< 640px`):** Single column (`grid-cols-1`), full-width cards, auto-collapsing drawer navigation.
  * **Tablet (`640px – 1023px`):** 2-column grid (`grid-cols-2`), compact KPI rows, responsive horizontal scrolling tables.
  * **Desktop (`1024px – 1439px`):** 3-column / 4-column mixed grid (`grid-cols-3` or `grid-cols-4`), sidebar pinned.
  * **Ultra-Wide (`≥ 1440px`):** Full 12-column analytical layout (`grid-cols-12`) with multi-card analytics groupings.

---

## 5. Component Styling Specifications

### 5.1 Card Anatomy & Elevation System
Cards are the core structural element of CommerceIQ.
* **Surface Background:** `#111827` (slate-900 tint).
* **Border:** `1px solid rgba(255, 255, 255, 0.08)`.
* **Border Radius:** `12px` (`rounded-xl`).
* **Hover Interaction:** Subtle vertical lift (`translate-y-[-2px]`), border brightness transition (`rgba(139, 92, 246, 0.3)`), and a faint ambient glow:
  ```css
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px 0 rgba(139, 92, 246, 0.05);
  ```
* **Internal Structure:**
  * Header: Title (`text-sm font-semibold text-slate-200`), subtitle/badge, and contextual action (info tooltip, range selector).
  * Body: Chart canvas, table, or numerical KPI readout.
  * Footer: Optional statistical citation (e.g., *"Source: Verified Phase 7 CSV"*).

### 5.2 KPI Metric Card Anatomy
```
+-----------------------------------------------------------+
| [Icon] TOTAL REVENUE                      [Verified Tag]  |
|                                                           |
| ₹229,933,212.63                                          |
|                                                           |
| [▲ 742,773 Purchases]  •  Mean Order: ₹309.56            |
+-----------------------------------------------------------+
```
* **Label:** `text-xs font-medium tracking-wider text-slate-400 uppercase`.
* **Value:** `text-2xl sm:text-3xl font-bold font-mono text-slate-100 tracking-tight`.
* **Delta / Context:** Flex row with a colored status pill (`bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`) and supporting contextual notes (`text-xs text-slate-400`).

### 5.3 Buttons & Interactive Controls
* **Primary Button:** Gradient background from `#8B5CF6` to `#6366F1`, hover state `#7C3AED`, focus ring `ring-2 ring-violet-500/50`, radius `rounded-lg`, typography `font-medium text-sm text-white`.
* **Secondary / Outline Button:** Surface `bg-slate-800/60`, border `border-slate-700`, text `text-slate-300`, hover `bg-slate-700/60 text-white`.
* **Segmented Controls / Tabs:** Pill container `bg-slate-900/80 p-1 rounded-xl border border-white/5`. Active tab gets `bg-violet-600/30 text-violet-300 border border-violet-500/30 shadow-sm`. Inactive tab gets `text-slate-400 hover:text-slate-200`.

### 5.4 Data Tables
* **Table Wrapper:** Seamless dark card container with horizontal scrolling support.
* **Header Row:** `bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider py-3 px-4 border-b border-white/5`.
* **Data Rows:** `text-sm text-slate-300 py-3.5 px-4 border-b border-white/[0.04] hover:bg-slate-800/40 transition-colors`. Numeric cells right-aligned in `font-mono`.
* **Pagination & Search Bar:** Integrated top toolbar with instant client-side debounced search (`<input>` with search icon) and export action button.

---

## 6. Chart Styling & Apache ECharts Specifications

All charts are standardized via a unified Apache ECharts custom theme (`commerceiq-dark`).

### 6.1 Unified ECharts Theme Configuration
```typescript
export const CommerceIQChartTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#94A3B8'
  },
  title: {
    textStyle: { color: '#F8FAFC', fontWeight: 600, fontSize: 15 },
    subtextStyle: { color: '#64748B', fontSize: 12 }
  },
  grid: {
    top: 45,
    right: 25,
    bottom: 35,
    left: 55,
    containLabel: true,
    borderColor: 'transparent'
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
    axisTick: { show: false },
    axisLabel: { color: '#94A3B8', fontSize: 11 },
    splitLine: { show: false }
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#94A3B8', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } }
  },
  tooltip: {
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    padding: [10, 14],
    textStyle: { color: '#F8FAFC', fontSize: 12 },
    extraCssText: 'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); border-radius: 8px;'
  },
  color: [
    '#8B5CF6', '#06B6D4', '#6366F1', '#EC4899', '#10B981', '#F59E0B'
  ]
};
```

### 6.2 Specialized Chart Types
1. **Area / Line Trends:** Gradient fill from `rgba(139, 92, 246, 0.35)` to `rgba(139, 92, 246, 0.0)`. Smooth bezier curves (`smooth: 0.3`), hover crosshair (`axisPointer: { type: 'cross' }`).
2. **Category / Brand Bar Charts:** Rounded bar caps (`borderRadius: [4, 4, 0, 0]`), subtle hover highlight.
3. **Event Funnel:** Step-down funnel visual with customized tooltips displaying absolute event count, step-down ratio, and disclaimer badge (*"Event ratios only — not session conversion"*).
4. **Hierarchical Treemap / Sunburst:** Multi-level depth with distinct hues per parent category (`electronics`, `appliances`, `computers`) and variable opacity based on revenue magnitude.

---

## 7. Motion Design Principles & Micro-Interactions

Motion in CommerceIQ is engineered to communicate spatial relationship and system status, following the core physical rules of **spring physics** rather than linear transitions.

### 7.1 Physics & Easing Tokens
* **Standard Easing Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` (Fluid exponential deceleration).
* **Spring Configuration (Motion for React):**
  * Entrance / Modal: `stiffness: 260, damping: 20, mass: 0.8`
  * Card Hover: `stiffness: 400, damping: 25`
  * Micro-toggle / Checkbox: `stiffness: 500, damping: 30`
* **Durations:**
  * Micro-action (hover, click, icon swap): `150ms – 200ms`
  * Card entrance / layout shift: `300ms – 400ms`
  * Page transition: `400ms – 500ms`

### 7.2 Staggered Entrances
When a dashboard page loads, cards enter using a subtle vertical offset (`y: 12 -> 0`) and opacity fade (`0 -> 1`), staggered by `50ms` per card to create an orderly, organic reveal:
```typescript
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

export const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 280, damping: 22 } 
  }
};
```

### 7.3 Reduced Motion Compliance (`prefers-reduced-motion`)
Whenever the user's OS indicates `prefers-reduced-motion: reduce`:
* All position transitions (`y`, `x`, `scale`) are disabled (`y: 0, scale: 1`).
* Transitions collapse to instantaneous or gentle opacity crossfades (`opacity: 1, duration: 150ms`).
* The WebGL 3D canvas disables continuous rotation, rendering a static ambient representation.

---

## 8. Selective 3D Art Direction (WebGL / Three.js)

To deliver a memorable signature visual experience without sacrificing performance or battery life, 3D visualization is strictly scoped and optimized.

### 8.1 The "Commerce Nexus" 3D Data Torus
Located in the Overview screen's hero section, the **Commerce Nexus** is an interactive, low-poly procedural data sculpture symbolizing the multi-dimensional flow of 42 million e-commerce transactions:
* **Geometry:** Parametric Torus Knot (`TorusKnotGeometry(1.6, 0.45, 128, 32)`), paired with an ambient point-cloud particle halo (1,200 particle vertices).
* **Material:** Custom metallic/physical wireframe shader with glowing rim Fresnel lighting:
  * Base Color: Deep navy obsidian (`#0B132B`).
  * Emissive Accent: Electric violet (`#8B5CF6`) and cyan (`#06B6D4`) gradient along the parametric UV coordinate.
  * Roughness: `0.2`, Metalness: `0.85`, Transmission / Glass effect: `0.3`.
* **Animation Behavior:**
  * Gentle, continuous ambient axial rotation (`0.003 rad/frame`).
  * Subtle mouse-follow parallax tilt (clamped to $\pm 15^\circ$ pitch and yaw with spring dampening).
  * Interactive pulse on metric hover: hovering the "Total Revenue" card transmits a violet luminescence wave through the torus shader.

### 8.2 Technical Performance Budget for 3D
* **Target Framerate:** Locked 60 FPS on modern desktop GPUs; automatic downgrade to 30 FPS or static fallback on low-power devices.
* **Draw Calls:** Strict limit of $\le 4$ draw calls per frame.
* **Canvas Sizing:** Rendered into a bounded container (`w-[380px] h-[340px]`), never a full-screen viewport.
* **Offscreen Pausing:** Three.js render loop is suspended via `IntersectionObserver` when the hero section scrolls out of view.
* **Mobile Handling:** Hidden or replaced with a lightweight CSS gradient orb on mobile screens (`< 640px`) to conserve CPU cycles and battery.

---

## 9. Accessibility, Usability & Contrast Specifications

CommerceIQ adheres to **WCAG 2.1 Level AA** standards:

1. **Contrast Ratios:**
   * Text Primary (`#F8FAFC`) on Canvas (`#070A13`): **18.2:1** (Passes AAA).
   * Text Secondary (`#94A3B8`) on Card Surface (`#111827`): **6.8:1** (Passes AA).
   * Violet Accent (`#8B5CF6`) on Card Surface: **4.9:1** (Passes AA for graphical elements & large text).
   * Cyan Accent (`#06B6D4`) on Card Surface: **5.6:1** (Passes AA).
2. **Keyboard Navigation:**
   * All interactive cards, table headers, tab selectors, and buttons feature visible focus indicators (`ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-950`).
   * Skip-to-content anchor provided at page top.
   * Full keyboard arrow traversal for segmented controls and tab lists.
3. **Screen Readers & ARIA:**
   * Landmark elements used throughout (`<nav>`, `<main>`, `<aside>`, `<section>`, `<footer>`).
   * Charts include hidden semantic fallback descriptions and data tables accessible via screen reader (`aria-label`, `aria-describedby`).
   * Live regions (`aria-live="polite"`) announce filter results and sort updates.

---

*Approved for Milestone M01 implementation.*
