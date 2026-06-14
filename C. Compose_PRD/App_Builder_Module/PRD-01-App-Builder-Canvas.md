# PRD-01 — App Builder Canvas
**Product:** UT Service Console  
**Feature:** Drag-and-Drop Page Layout Builder  
**Version:** 1.0  
**Status:** Draft  
**Author:** Product Team  
**Last Updated:** 2026-06-13

---

## 1. Overview

### 1.1 Problem Statement

Field service and CRM teams need to customise how data appears on record pages (Cases, Work Orders, Service Appointments) without writing code. Today, field layout is hard-coded, forcing administrators to open source files to reposition a single field. This slows iteration, creates dependency on developers, and limits the console's adoption in enterprise accounts with diverse workflow needs.

### 1.2 Goal

Deliver a visual, no-code App Builder Canvas that lets administrators drag, drop, and configure field positions on any object page — comparable to Salesforce Lightning App Builder — while staying fully within the UT Service Console design system.

### 1.3 Success Metrics

| Metric | Target |
|--------|--------|
| Time to reorder fields on a page | < 2 minutes (no dev involvement) |
| Admin satisfaction score | ≥ 4.2 / 5.0 (post-launch survey) |
| Pages customised per account in first 90 days | ≥ 3 |
| Support tickets related to layout requests | −60 % vs baseline |

---

## 2. Scope

### 2.1 In Scope (v1.0)

- Canvas view for **Case**, **Work Order**, and **Service Appointment** object pages
- Drag-and-drop reordering of fields within a section
- Drag-and-drop reordering of sections on the page
- Creating new sections with a custom label
- Hiding / showing fields per layout
- Two-column and one-column section layouts
- Live preview pane (desktop viewport, read-only)
- Save and Publish flow with versioning (current + draft)
- Access gated by **Admin** role only

### 2.2 Out of Scope (v1.0 — deferred to v2)

- Custom formula fields or new field creation
- Mobile/tablet preview
- Role-based field visibility rules
- Multi-language label overrides
- Undo / redo history beyond a single session

---

## 3. User Stories

### Persona: Console Administrator (Sarah)
> "I need to rearrange which fields appear at the top of a Case page without asking the dev team."

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-01 | As an admin, I can open App Builder from the Settings gear so that I reach the canvas in one click. | Settings gear → "App Builder Canvas" entry visible; click loads canvas in < 1.5 s |
| US-02 | As an admin, I can select an object type (Case / WO / SA) so that I edit the right page layout. | Object switcher in canvas toolbar; switching objects reloads field schema |
| US-03 | As an admin, I can drag a field card from one position to another within a section so that priority fields appear first. | Drag handle visible on hover; drop target highlights; order persists after Save |
| US-04 | As an admin, I can drag a section to reorder it on the page so that related fields group logically. | Section header acts as drag handle; ghost preview during drag |
| US-05 | As an admin, I can create a new section with a label so that I can group fields meaningfully. | "+ Add Section" button; label input required before save; new section appears at bottom |
| US-06 | As an admin, I can hide a field from the layout so that irrelevant data doesn't clutter the form. | Toggle per field card; hidden fields move to a "Hidden Fields" tray; re-enable by drag-back |
| US-07 | As an admin, I can switch a section between 1-column and 2-column layout so that I use screen space efficiently. | Column toggle in section header; live preview updates immediately |
| US-08 | As an admin, I can publish my changes so that end users see the new layout. | "Publish" button active only when draft differs from live; confirmation modal lists changes |
| US-09 | As an admin, I can revert to the last published layout so that I can undo mistakes. | "Revert to Published" button in toolbar; confirmation required |

---

## 4. Functional Requirements

### 4.1 Canvas Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]  Object: [Case ▾]  View: [Desktop]   [Revert] [Publish] │
├────────────────────┬────────────────────────────────────────┤
│  FIELD TRAY        │  CANVAS (drag zone)                    │
│  ─────────────     │  ┌── Section: Case Info ─────────── ┐  │
│  Available Fields  │  │  [Field] [Field]                  │  │
│  • Case Number     │  │  [Field] [Field]                  │  │
│  • Subject         │  └──────────────────────────────────┘  │
│  • Status          │  ┌── Section: Customer ──────────── ┐  │
│  • Priority        │  │  [Field]                          │  │
│  • [hidden…]       │  └──────────────────────────────────┘  │
│                    │  [+ Add Section]                        │
└────────────────────┴────────────────────────────────────────┘
```

### 4.2 Field Card Component

Each field in the canvas renders as a card with:
- **Left:** drag handle icon (6-dot grid)
- **Centre:** field label (semibold) + API name (muted, monospace)
- **Right:** field type badge + visibility toggle + settings icon (opens Field Properties panel)

### 4.3 Section Component

- **Header:** drag handle + section label (editable inline) + column-toggle + collapse chevron + delete button (disabled if it contains required fields)
- **Body:** drop target; fields arrange in 1 or 2 columns per config
- **Empty state:** dashed border with "Drag fields here" prompt

### 4.4 Field Tray

- Shows all fields for the selected object not currently on canvas
- Searchable by label or API name
- Grouped by: Standard Fields / Custom Fields
- Drag from tray to canvas to add; drag from canvas to tray to hide

### 4.5 Save & Publish

- **Auto-save draft** every 30 seconds to `localStorage` + server draft endpoint
- **Publish** writes layout JSON to the live config; triggers a cache bust for end users
- **Version record** stores last 10 published states with timestamp + author

---

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Canvas load time | < 1.5 s on standard broadband |
| Drag-and-drop response | < 16 ms frame time (60 fps) |
| Layout JSON payload | < 50 KB per object page |
| Accessibility | WCAG 2.2 AA — keyboard drag via arrow keys + Enter/Space |
| Browser support | Chrome 120+, Edge 120+, Safari 17+ |

---

## 6. Design Tokens (from Design System)

All canvas UI uses the UT Service Console design system:

- **Canvas background:** `var(--bg-base)`
- **Card background:** `var(--bg-card)`, border `var(--border)`
- **Drag-over highlight:** `var(--accent-pale)` border `var(--accent)`
- **Section header:** `var(--bg-light)`
- **Primary action (Publish):** `.btn-primary` (gold `var(--accent)`)
- **Secondary actions:** `.btn-secondary`
- **Field type badges:** use status/priority badge tokens

---

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Layout conflicts between admin-defined and system-required fields | Medium | High | Mark required fields as non-removable; show tooltip on hover |
| Performance degradation with 50+ fields on canvas | Low | Medium | Virtualise field tray list; throttle drag events |
| Admins accidentally publishing breaking layouts | Medium | High | Publish confirmation modal + 1-click revert |
| Dark mode contrast issues on drag ghost | Low | Low | Test ghost element against both `--bg-base` variants |

---

## 8. Open Questions

1. Should layout changes be tracked in an audit log visible to super-admins?
2. Do we support layout variants per user role in v1, or strictly per object?
3. Should "Revert" restore the last publish or allow selecting from version history?

---

## 9. Appendix — Layout JSON Schema (v1 Draft)

```json
{
  "object": "Case",
  "schemaVersion": "1.0",
  "sections": [
    {
      "id": "s-001",
      "label": "Case Info",
      "columns": 2,
      "fields": [
        { "apiName": "CaseNumber", "label": "Case Number", "visible": true },
        { "apiName": "Subject",    "label": "Subject",     "visible": true }
      ]
    }
  ],
  "hiddenFields": ["Internal_Notes__c"]
}
```
