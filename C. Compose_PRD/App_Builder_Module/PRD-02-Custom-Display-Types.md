# PRD-02 — Custom Object Display Types & Field Position Settings
**Product:** UT Service Console  
**Feature:** Object Display Type Creation + Canvas Field Position Settings  
**Version:** 1.0  
**Status:** Draft  
**Author:** Product Team  
**Last Updated:** 2026-06-13

---

## 1. Overview

### 1.1 Problem Statement

The App Builder Canvas (PRD-01) provides drag-and-drop layout editing for standard field grids. However, two gaps remain:

1. **Display Types** — Admins cannot choose *how* a section renders its data (e.g. detail grid vs. timeline vs. metric tiles). Every section currently renders as a static two-column field grid.
2. **Precise Position Settings** — Power admins need pixel-level or column-span control beyond simple drag order: they want to specify that a field spans both columns, pin a field to the top regardless of drag order, or set a minimum width.

This PRD covers both gaps as companion features to PRD-01, delivered in the **Settings → App Builder Canvas → Canvas Settings** panel.

### 1.2 Goals

- Let admins define new object display types (e.g. "Metric Tile Group", "Activity Timeline", "Compact List") that render a section's fields differently.
- Expose a **Field Position Settings** panel (accessible via the section's gear icon) for granular layout control.
- Ensure all new display types conform to the UT Service Console design system and support both light and dark mode.

### 1.3 Success Metrics

| Metric | Target |
|--------|--------|
| Display types created per account (90-day avg) | ≥ 2 |
| Reduction in "custom CSS injection" support requests | −40 % |
| Admin task completion rate for creating a new display type | ≥ 80 % without documentation |

---

## 2. Scope

### 2.1 In Scope (v1.0)

**Custom Object Display Types**
- 4 built-in display type templates: `Detail Grid` (default), `Metric Tile`, `Activity Timeline`, `Compact List`
- Admin can create a *Custom Display Type* by configuring a base template + overrides
- Custom display types are saved at the account level and reusable across objects
- Display type picker available in each section's header inside the canvas

**Canvas Field Position Settings (Settings Gear Panel)**
- Accessible via Settings gear → App Builder Canvas → "Canvas Settings" sub-page
- Per-field overrides: column span (1 or 2), pinned position (top / default), label visibility, read-only lock
- Per-section overrides: default column count, spacing density (compact / standard / relaxed), header style (visible / hidden / accent)
- Global canvas overrides: page gutter width, section gap, font scale (100% / 90% / 110%)

### 2.2 Out of Scope (v1.0)

- Custom CSS or HTML injection inside display types
- Display type marketplace / sharing between accounts
- Conditional display (show type X if field Y = value Z)

---

## 3. User Stories

### Persona: Power Admin (Marcus)
> "I want Cases to show KPI numbers at the top as big metric tiles, not just a plain field grid."

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-10 | As a power admin, I can open Canvas Settings from the Settings gear so that I access position controls in one place. | Settings gear → App Builder Canvas → Canvas Settings page loads in < 1 s |
| US-11 | As a power admin, I can select a display type for each section so that sections render data in the most appropriate format. | Display type dropdown in section header; changing type re-renders section preview instantly |
| US-12 | As a power admin, I can create a new display type from a base template so that I build bespoke renderers without code. | "New Display Type" button in Canvas Settings; wizard: name → base template → field mapping → save |
| US-13 | As a power admin, I can set a field to span two columns so that wide content like Description fills the row. | Field Properties panel: Column Span toggle (1 col / 2 col); canvas updates in real time |
| US-14 | As a power admin, I can pin a field to always appear first in its section so that critical info is never buried after a drag accident. | "Pin to Top" checkbox in Field Properties; pinned fields render with a gold pin icon in canvas |
| US-15 | As a power admin, I can hide a field's label so that icon-only or value-only displays are possible in compact sections. | "Show Label" toggle in Field Properties; label hidden in preview |
| US-16 | As a power admin, I can adjust section spacing density so that compact sections fit more data above the fold. | Density selector (Compact / Standard / Relaxed) in Section Settings; updates live in canvas |
| US-17 | As a power admin, I can name and save a custom display type so that I reuse it on other object pages. | Saved types appear in the display type dropdown with a "Custom" tag; editable and deletable |

---

## 4. Built-In Display Types

### 4.1 Detail Grid (Default)

Standard two-column field/value grid. Label left, value right. Used for most record detail pages.

```
┌─────────────────────────────┐
│ Case Number   00001234      │
│ Status        Open          │
│ Priority      High          │
│ Subject       Generator … │
└─────────────────────────────┘
```

### 4.2 Metric Tile

Renders selected numeric or status fields as large KPI tiles. Ideal for dashboards and summary sections at the top of a page.

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│  OPEN    │ │  HIGH    │ │  14 days │
│  Cases   │ │ Priority │ │  Avg Age │
└──────────┘ └──────────┘ └──────────┘
```

- Tile background: `var(--bg-light)`
- Value: `text-2xl font-bold`, colour from status/priority tokens
- Label: `text-[10px] uppercase tracking-wider var(--text-muted)`

### 4.3 Activity Timeline

Renders date-stamped fields as a vertical timeline. Suitable for audit trails, escalation history, appointment logs.

```
● 2026-06-10  Created by A.User
│
● 2026-06-11  Status → In Progress
│
● 2026-06-12  Assigned to Tech #4
```

- Timeline line: `var(--border)` 1px solid
- Node dot: `var(--accent)` filled circle 8px
- Entry label: `text-sm font-medium var(--text-main)`
- Timestamp: `text-xs var(--text-muted)` monospace

### 4.4 Compact List

Renders fields as a single-row inline list. Suited for metadata bars (e.g. tags, linked records, quick stats).

```
[ Case Number: 00001234 ] [ Status: Open ] [ SLA: 24h remaining ]
```

- Item: inline badge style, `px-2 py-0.5 rounded` `var(--bg-light)` border `var(--border)`
- Overflow: `+ N more` expander chip

---

## 5. Canvas Settings Panel — Functional Requirements

### 5.1 Navigation Path

```
Header → Settings Gear (⚙) → App Builder Canvas → Canvas Settings
```

### 5.2 Settings Panel Layout

```
┌─ Canvas Settings ──────────────────────────────────────────┐
│                                                             │
│  GLOBAL SETTINGS                                            │
│  Page Gutter      [  24px  ▾]                               │
│  Section Gap      [  20px  ▾]                               │
│  Font Scale       [  100%  ▾]                               │
│                                                             │
│  DISPLAY TYPES                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Detail Grid      (built-in)              [Preview] │    │
│  │ Metric Tile      (built-in)              [Preview] │    │
│  │ Activity Timeline (built-in)             [Preview] │    │
│  │ Compact List     (built-in)              [Preview] │    │
│  │ My Custom Type   (custom)       [Edit]   [Delete]  │    │
│  └────────────────────────────────────────────────────┘    │
│  [+ New Display Type]                                       │
│                                                             │
│  FIELD DEFAULTS                                             │
│  Default Column Span  [ 1 col ▾]                           │
│  Show Labels by Default  [● On]                             │
│  Allow Pinning          [● On]                              │
│                                                             │
│                             [Cancel]  [Save Settings]       │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 New Display Type Wizard

**Step 1 — Name & Base**
- Display type name (required, max 40 chars)
- Base template selector (radio: Detail Grid / Metric Tile / Activity Timeline / Compact List)
- Description (optional)

**Step 2 — Field Mapping**
- Select which fields from the object schema map to which role in the display type (e.g. for Metric Tile: "Value Field", "Label Field", "Colour Source")

**Step 3 — Style Overrides**
- Background colour (CSS variable picker, restricted to design system tokens)
- Value typography (size, weight — from type scale only)
- Border / shadow preset (None / Subtle / Raised)

**Step 4 — Preview & Save**
- Live preview rendered with real field names
- "Save" writes to account display-type registry

### 5.4 Field Properties Panel (per-field, opened from canvas)

```
┌─ Field: Priority ──────────────────┐
│                                    │
│  Label         Priority            │
│  API Name      Priority__c  (mono) │
│  Field Type    Picklist            │
│                                    │
│  POSITION                          │
│  Column Span   [● 1 col] [○ 2 col] │
│  Pin to Top    [○ Off]   [● On ]   │
│                                    │
│  DISPLAY                           │
│  Show Label    [● On]              │
│  Read-Only     [○ Off]             │
│  Badge Style   [● Yes]             │
│                                    │
│              [Cancel] [Apply]      │
└────────────────────────────────────┘
```

---

## 6. Data Model

### 6.1 Display Type Registry (account-scoped)

```json
{
  "displayTypes": [
    {
      "id": "dt-custom-001",
      "name": "My Custom Type",
      "baseTemplate": "MetricTile",
      "isBuiltIn": false,
      "fieldRoles": {
        "valueField": "SLA_Hours_Remaining__c",
        "labelField": "Subject",
        "colourSource": "Priority"
      },
      "styleOverrides": {
        "background": "var(--bg-light)",
        "valueSize": "text-2xl",
        "valueWeight": "font-bold",
        "border": "subtle"
      }
    }
  ]
}
```

### 6.2 Field Position Overrides (per layout, per field)

```json
{
  "fieldOverrides": {
    "Priority__c": {
      "columnSpan": 1,
      "pinned": true,
      "showLabel": true,
      "readOnly": false,
      "badgeStyle": true
    },
    "Description": {
      "columnSpan": 2,
      "pinned": false,
      "showLabel": true,
      "readOnly": false,
      "badgeStyle": false
    }
  }
}
```

---

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Display type preview render | < 300 ms |
| Canvas re-render on type switch | < 100 ms (no full page reload) |
| Max custom display types per account | 20 (v1) |
| Accessibility | WCAG 2.2 AA; all settings inputs keyboard-navigable |

---

## 8. Design Tokens — New Display Type Components

| Component | Token |
|-----------|-------|
| Metric tile background | `var(--bg-light)` |
| Metric tile border | `var(--border)` |
| Metric value (critical) | `var(--color-danger)` `#C62828` |
| Timeline node | `var(--accent)` |
| Timeline line | `var(--border)` |
| Compact list chip | `var(--bg-light)` border `var(--border)` |
| Settings panel background | `var(--bg-card)` |
| Pinned field indicator | `var(--accent)` |

---

## 9. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| PRD-01 App Builder Canvas | Frontend Team | In Design |
| Layout JSON schema (Appendix in PRD-01) | Architecture | Draft |
| Design system token updates (display type tokens above) | Design | Pending |

---

## 10. Open Questions

1. Should custom display types be exportable/importable between environments (dev → prod)?
2. What happens to a section using a custom display type if that type is deleted — fallback to Detail Grid?
3. Can the same display type be configured differently per object (e.g. Metric Tile on Cases vs WO)?

---

## 11. Appendix — Display Type Token Mapping

| Template | Required Field Roles | Optional Field Roles |
|----------|---------------------|---------------------|
| Detail Grid | — (uses all visible fields) | — |
| Metric Tile | `valueField`, `labelField` | `colourSource`, `iconSource` |
| Activity Timeline | `dateField`, `descriptionField` | `actorField`, `statusField` |
| Compact List | `fields[]` (ordered array) | `overflowThreshold` |
