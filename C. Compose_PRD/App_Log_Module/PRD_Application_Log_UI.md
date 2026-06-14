# PRD — Application Log (UI / UX)
**Product:** UT Service Console  
**Module:** Settings → App Settings → Application Log  
**Version:** 1.0  
**Last Updated:** 2026-06-12  
**Status:** Draft  

---

## 1. Overview

The Application Log is a read-only, chronological audit trail that records every change made to objects within the UT Service Console, as well as all inbound and outbound REST API events from integration modules. It is accessible via **Settings → App Settings → Application Log**.

The feature serves two primary audiences:

- **Administrators** — who need to audit user actions across objects and diagnose data-integrity issues.
- **Integration engineers** — who need to inspect API call payloads, response statuses, and query performance.

---

## 2. Goals

| # | Goal |
|---|------|
| G1 | Provide a unified, filterable log of all object-level changes and API events. |
| G2 | Allow filtering by Object ID, Module ID, event type, date range, user, and request status. |
| G3 | Surface REST API metadata (method, query, response size, rows processed, entity, status) in a structured, scannable format. |
| G4 | Maintain visual and interaction consistency with the UT Service Console design system. |
| G5 | Support both light and dark modes per the existing theme system. |

---

## 3. Entry Point

| Path | Action |
|------|--------|
| Main navigation → gear icon (⚙) | Opens **App Settings** |
| App Settings sidebar → **Application Log** | Loads the log view |

The gear icon is always visible in the main navigation bar. Application Log is a top-level item inside App Settings — not nested under any sub-section.

---

## 4. Page Layout

### 4.1 Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  App Settings Sidebar  │  Main Content Area                 │
│  ─────────────────────  │  ─────────────────────────────────│
│  General               │  [Page Heading] Application Log    │
│  Users & Permissions   │                                    │
│  ▶ Application Log     │  [Toolbar: Search + Filters]       │
│  Integrations          │  ─────────────────────────────────│
│  Audit Settings        │  [Active Filter Chips]             │
│                        │  ─────────────────────────────────│
│                        │  [Log Table / Timeline]            │
│                        │  ─────────────────────────────────│
│                        │  [Pagination]                      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Sidebar

- Uses the existing App Settings left-panel pattern.
- Active item highlighted with `var(--accent-pale)` background, `var(--accent)` left border (3px).
- Font: `text-sm font-medium`, colour `var(--text-main)`.

### 4.3 Main Content Area

- Page heading: `text-2xl font-bold`, colour `var(--text-main)`.
- Sub-label: `text-sm`, colour `var(--text-tertiary)` — "Showing changes to objects and integration API events."
- Container padding: `p-6` per layout standards.
- Max width: `max-w-screen-2xl`.

---

## 5. Toolbar

The toolbar sits directly below the page heading and contains all filtering controls.

```
┌──────────────────────────────────────────────────────────────────────┐
│ [🔍 Search by Object ID or Module ID…]  [Filters ▼]  [Date Range ▼] │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.1 Search Input

- Placeholder: `Search by Object ID or Module ID…`
- Class: `.input-field`, `min-h-[44px]`, `text-sm`.
- Triggers a live filter on `objectId` and `moduleId` fields as the user types (debounced 300 ms).
- Focus ring: `border-color: var(--accent)`, `box-shadow: 0 0 0 3px rgba(245, 200, 0, 0.1)`.

### 5.2 Filters Button

- Label: `Filters` with filter icon (lucide `SlidersHorizontal`).
- Class: `.btn-secondary`.
- Opens the **Filter Panel** (see §6).
- When active filters exist, shows a count badge: `bg-[var(--accent)] text-[var(--text-main)] text-xs font-medium rounded-full px-1.5 py-0.5`.

### 5.3 Date Range Picker

- Label: `Date Range` with lucide `CalendarDays` icon.
- Class: `.btn-secondary`.
- Opens a date range popover (From / To).
- Applied date range is shown as a chip in the Active Filter Chips row.

---

## 6. Filter Panel

Triggered by the **Filters** button. Renders as a floating panel anchored below the button (not a full drawer), consistent with the reference UI (Image 1).

```
┌────────────────────────────────────────┐
│ Activity Filters                    ✕  │
│ ─────────────────────────────────────  │
│ 👤 User                  3 selected  > │
│ ▣  Event Type            2 selected  > │
│ 📦 Object / Module                   > │
│ 📅 Date Range                        > │
│ ⚡ Request Status                    > │
│ ─────────────────────────────────────  │
│ [Apply filters]          [Clear all]   │
└────────────────────────────────────────┘
```

### 6.1 Filter Categories

| Filter | Type | Values |
|--------|------|--------|
| **User** | Multi-select | All system users |
| **Event Type** | Multi-select | `Object Change`, `REST API — Inbound`, `REST API — Outbound` |
| **Object / Module** | Multi-select | Dynamic list of objects and integration module IDs |
| **Date Range** | Date picker | From / To |
| **Request Status** | Toggle | `Success (S)`, `Failure (F)` |

### 6.2 Filter Panel Style

- Background: `var(--bg-card)`, border: `1px solid var(--border)`.
- Border radius: `rounded-lg`.
- Shadow: `0 4px 16px rgba(0,0,0,0.12)`.
- Width: `360px` fixed.
- Each row: `px-4 py-3`, `flex justify-between items-center`.
- Row label: `text-sm font-medium var(--text-secondary)`.
- Selected count: `text-sm var(--text-tertiary)`.
- Chevron: lucide `ChevronRight`, `var(--text-muted)`.
- **Apply filters** button: `.btn-primary`, full left weight.
- **Clear all** button: `.btn-secondary`.
- Divider between rows: `1px solid var(--border)`.

---

## 7. Active Filter Chips

Displayed as a horizontal row below the toolbar when any filter is active.

```
[User: Alice, Bob  ✕]  [Event Type: REST API  ✕]  [Status: Failure  ✕]  [Clear all]
```

- Background: `var(--accent-pale)`.
- Text: `text-xs font-medium var(--text-secondary)`.
- Close icon: lucide `X`, `12px`.
- Border: `1px solid var(--accent)`.
- Border radius: `rounded-full`.
- Padding: `px-3 py-1`.
- **Clear all** link: `text-sm text-[var(--color-info)] underline`.

---

## 8. Log Table

### 8.1 Table Columns

| Column | Width | Notes |
|--------|-------|-------|
| **Timestamp** | 160px | `text-xs font-mono var(--text-tertiary)` — date + time |
| **Event Type** | 160px | Badge (see §8.3) |
| **Object / Module** | 180px | Object name + ID, truncated with tooltip |
| **Description** | auto (flex-1) | Human-readable summary of the change or API event |
| **User / Source** | 160px | Avatar + email for user actions; integration name for API events |
| **Status** | 100px | Success / Failure badge |

### 8.2 Row Styles

- Row height: min `44px`.
- Background: `var(--bg-card)`.
- Hover: `var(--bg-light)`.
- Border bottom: `1px solid var(--border)`.
- Clickable rows expand to show full detail inline (accordion pattern).
- Font: `text-sm var(--text-secondary)`.

### 8.3 Event Type Badges

| Type | Text | Background | Border |
|------|------|------------|--------|
| Object Change | `#00897B` | `#E0F2F1` | — |
| REST API — Inbound | `#1976D2` | `#E3F2FD` | — |
| REST API — Outbound | `#F57C00` | `#FFF3E0` | — |

Badge class: `.badge` (`px-3 py-1 rounded-full text-xs font-medium h-[28px]`).

### 8.4 Status Badge

| Status | Text | Background |
|--------|------|------------|
| Success (S) | `#388E3C` | `#E8F5E9` |
| Failure (F) | `#C62828` | `#FFEBEE` |

### 8.5 Expandable Row Detail

Clicking a row reveals an inline detail panel:

**For Object Change events:**
```
┌──────────────────────────────────────────────────────┐
│  Object ID:     WO-00432                             │
│  Module ID:     work-orders                          │
│  Changed By:    alice@company.com                    │
│  Changed At:    2026-06-12  14:32:07 UTC             │
│  Fields Changed:                                     │
│    Status        "Open"  →  "In Progress"            │
│    Assigned To   —       →  "Bob Smith"              │
└──────────────────────────────────────────────────────┘
```

**For REST API events:**
```
┌──────────────────────────────────────────────────────┐
│  Module ID:        integration-salesforce            │
│  Direction:        Outbound                          │
│  Method:           POST                              │
│  Entity:           Opportunity                       │
│  Query:            SELECT Id, Name FROM Opportunity  │
│  Response Size:    1,204 bytes                       │
│  Rows Processed:   12                                │
│  Status:           S — Success                       │
│  Timestamp:        2026-06-12  14:32:07 UTC          │
└──────────────────────────────────────────────────────┘
```

Detail panel style:
- Background: `var(--bg-light)`.
- Border top: `1px solid var(--border)`.
- Padding: `px-6 py-4`.
- Label column: `text-xs font-semibold uppercase tracking-wider var(--text-muted)`, width `180px`.
- Value column: `text-sm font-mono var(--text-secondary)`.
- Field diff arrows (`→`): colour `var(--text-muted)`.
- Old value: `var(--color-danger)`, `line-through` (optional).
- New value: `var(--color-success)`.

---

## 9. Empty State

Shown when no results match the active filters.

```
          [magnifying glass illustration]
     No log entries match your filters.
     Try adjusting the date range or clearing filters.
          [Clear all filters]
```

- Illustration: lucide `SearchX`, `48px`, `var(--text-muted)`.
- Heading: `text-lg font-semibold var(--text-main)`.
- Body: `text-sm var(--text-tertiary)`.
- CTA: `.btn-secondary`.

---

## 10. Pagination

- Shown at the bottom of the table.
- Controls: `← Previous` / `Next →` buttons + page indicator (`Page 1 of 24`).
- Default page size: 50 rows. Selector: `25 / 50 / 100`.
- Font: `text-sm var(--text-tertiary)`.
- Buttons: `.btn-secondary compact` (`px-3 py-1.5 text-xs`).

---

## 11. Accessibility

- All table headers use `<th scope="col">`.
- Expandable rows use `aria-expanded` and `aria-controls`.
- Filter panel uses `role="dialog"` with `aria-label="Activity Filters"`.
- Focus management: when filter panel opens, focus moves to the first interactive element inside it; when closed, focus returns to the Filters button.
- All interactive elements meet `min-h-[44px]` touch target requirement.
- `:focus-visible` ring: `outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px`.
- Screen-reader text via `.sr-only` for icon-only controls.

---

## 12. Responsive Behaviour

| Breakpoint | Behaviour |
|-----------|-----------|
| `≥ 1280px` | Full table with all columns visible |
| `768–1279px` | Hide **Object / Module** column; show in expanded row only |
| `< 768px` | Table collapses to card-list layout; each row is a card with key fields visible |

---

## 13. Out of Scope (v1.0)

- Export to CSV / PDF.
- Webhook notifications on log events.
- Log retention policy configuration (handled in Audit Settings).
- Real-time streaming / auto-refresh.

---

## 14. Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ1 | Should API response payloads (full body) be stored and viewable in the expanded row? | Platform / Security |
| OQ2 | What is the default log retention window? | Product |
| OQ3 | Should Failure rows have an automatic alert/notification integration? | Product |
