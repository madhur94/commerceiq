# CommerceIQ — Milestone M04 Interaction Testing Matrix
## Verification of Keyboard Accessibility, Responsive Controls & Dynamic Interactions

**Project:** CommerceIQ — Premium Futuristic Commerce Intelligence  
**Milestone:** M04  
**Date:** October 20, 2026  
**Status:** All 12 Interaction Scenarios Verified  

---

## 1. Interaction Test Execution Matrix

| Test ID | Interactive Feature | Target Component | User Action | Expected Behavioral Response | Verified Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **INT-01** | Stage Tab Switching | `InteractivePipelineFlow` | Click Stage Tab (1–6) | Active stage details, metrics, transformations, and limitations update with smooth transition. | **PASS** |
| **INT-02** | Stage Keyboard Nav | `InteractivePipelineFlow` | `ArrowRight` / `ArrowLeft` on tab | Focus advances to adjacent stage tab and automatically activates the stage. | **PASS** |
| **INT-03** | Stage Keyboard Select | `InteractivePipelineFlow` | `Enter` / `Space` on stage card | Selected stage becomes active; aria-selected reflects true state. | **PASS** |
| **INT-04** | Dedup Collapsible Toggle | `DataCleaningAuditPanel` | Click Deduplication Audit | Drawer expands revealing sample audit metrics (1M rows, 28 collisions, 0.0028%) and PySpark protocol. | **PASS** |
| **INT-05** | Lineage Layout Toggle | `DataLineageExplorer` | Click "Registry Table" | View toggles from visual grid cards to sortable tabular registry; persists state seamlessly. | **PASS** |
| **INT-06** | Lineage Search Filtering | `DataLineageExplorer` | Type "parquet" in search | Filters 18 artifacts down to matching items (`ART-02`); updates count dynamically. | **PASS** |
| **INT-07** | Lineage Phase Filter | `DataLineageExplorer` | Click "Phase 7" chip | Displays only Phase 7 analytical rollup artifacts; hides preceding stages. | **PASS** |
| **INT-08** | Gallery Category Tabs | `ResearchVisualizationGallery`| Click "Event Behavior" | Filters 29 plots down to 3 event-related figures; card counts update instantly. | **PASS** |
| **INT-09** | Lightbox Modal Open | `ResearchVisualizationGallery`| Click any gallery card | Lightbox Modal mounts to `document.body` via React Portal with deep backdrop blur and focus lock. | **PASS** |
| **INT-10** | Lightbox Zoom & Nav | `ResearchVisualizationGallery`| Click ZoomIn / ArrowRight | Image scales from 100% to 120%; `ArrowRight` navigates to next sequential figure. | **PASS** |
| **INT-11** | Lightbox Dismissal | `ResearchVisualizationGallery`| Press `Escape` or click backdrop| Modal closes cleanly; returns focus to triggering card; restores scroll position. | **PASS** |
| **INT-12** | Chart Studio Mode Toggle | `InteractiveChartStudio` | Toggle "Legacy Plotly (Sandbox)"| Switches from native ECharts canvas to sandboxed iframe running original Plotly HTML asset. | **PASS** |
| **INT-13** | Chart Studio Treemap Tab | `InteractiveChartStudio` | Click "Treemap" tab | Renders 159-node squarified treemap; clicking electronics zooms to children; breadcrumbs update. | **PASS** |
| **INT-14** | Methodology Accordion | `ProjectMethodologyWalkthrough`| Click "Expand All" | All 10 methodology stages expand simultaneously showing analytical takeaways and technical specs. | **PASS** |

---

## 2. Accessibility & Keyboard Navigation Audit

- **WAI-ARIA Conformance:**
  - `role="tablist"` and `role="tab"` with dynamic `aria-selected` attributes on the pipeline stage selector.
  - `role="dialog"` and `aria-modal="true"` with `aria-labelledby="lightbox-title"` on the Lightbox Modal.
  - `role="button"` and `tabIndex={0}` on all interactive gallery cards and accordions.
- **Keyboard Traps:** Verified zero keyboard traps; `Escape` key reliably dismisses modals and drawers across all operating systems.
- **Reduced Motion Support:** Tested and verified that CSS transitions and Three.js / ECharts animation loops gracefully respect `prefers-reduced-motion: reduce`.
