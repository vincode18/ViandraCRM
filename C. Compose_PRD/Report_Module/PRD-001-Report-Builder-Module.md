# PRD-001 — Report Builder Module
## UT Service Console · Custom Report Builder

> **Document Version:** 1.0
> **Status:** Draft
> **Last Updated:** 2026-06-13
> **Author:** Product Team
> **Reviewers:** Engineering Lead, UX Lead, QA Lead

---

## 1. Overview

### 1.1 Summary

The Report Builder Module is a self-service, drag-and-drop report creation tool embedded within the UT Service Console. It enables users to build structured tabular reports from any module's data (Cases, Work Orders, Service Appointments, Field Service), customise column layouts, apply filters and sorting, preview live results, and export the final dataset in CSV or Excel format.

The module is inspired by Power BI's report canvas UX pattern — a left-side field panel, a central canvas, and a right-side configuration panel — adapted to the UT Service Console design system.

### 1.2 Problem Statement

Currently, users who need data exports or custom views of service records must either:
- Use rigid pre-built list views with no column flexibility
- Request IT to run database queries ad hoc
- Manually copy-paste data from the UI into spreadsheets

This creates bottlenecks, delays operational decision-making, and increases IT overhead for simple data requests.

### 1.3 Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Allow any authorised user to create a custom report without engineering help | 90% of report requests handled self-service within 30 days of launch |
| G2 | Reduce average time-to-export from ~2 days (IT request) to < 5 minutes | Measured via support ticket volume |
| G3 | Export-ready data in CSV and Excel with correct formatting | 0 reported data integrity bugs post-launch |
| G4 | All reports persist per-user and are re-runnable | User retention on saved reports > 40% within 60 days |

### 1.4 Non-Goals

- This module does **not** build chart/visualisation reports (bar charts, gauges, funnels) — that is covered in PRD-002 (Visual Report Builder)
- Real-time streaming data is out of scope for v1; reports refresh on demand
- Cross-organisation data sharing is not included in v1
- Scheduled email delivery of reports is a v2 feature

---

## 2. User Stories

### 2.1 Primary Personas

**Persona A — Operations Manager (Maya)**
> "I need a weekly export of all open Work Orders assigned to my team, with SLA status, priority, and last updated date — formatted so I can paste it straight into our ops review deck."

**Persona B — Service Coordinator (James)**
> "I want to quickly pull all Service Appointments for a specific customer account this month, filtered by region, without asking IT."

**Persona C — Admin / System Configurator (Priya)**
> "I need to control which users have access to which modules' data through reports, so a field tech can't accidentally export customer PII they shouldn't see."

### 2.2 User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|---------|
| US-01 | Operations Manager | Select a data source module (e.g. Work Orders) and drag the fields I need onto a report canvas | I can build a custom table without IT help |
| US-02 | Operations Manager | Apply filters to the report (e.g. Status = "In Progress", Priority = "High") | My export only contains relevant records |
| US-03 | Service Coordinator | Save my report configuration and re-run it next week | I don't have to rebuild it every time |
| US-04 | Service Coordinator | Preview the live data in the report canvas before exporting | I can verify the data looks correct |
| US-05 | Any User | Download the report as a CSV or Excel file | I can use it in external tools |
| US-06 | Admin | Assign report access permissions per user or role | Data access remains controlled |
| US-07 | Any User | Sort columns ascending or descending | I can organise data before exporting |
| US-08 | Any User | Rename column headers in the report | Exported headers match my team's naming conventions |
| US-09 | Any User | Reorder columns via drag-and-drop on the canvas | The export column order matches my preferred layout |
| US-10 | Admin | View an audit log of all reports created and exported | I can track data access for compliance |

---

## 3. Functional Requirements

### 3.1 Report Builder Canvas

#### 3.1.1 Data Source Selection
- User must first select a **source module** from a dropdown: Cases, Work Orders, Service Appointments, Field Service
- Module selection filters the available fields shown in the Field Panel (§3.2)
- Module selection can be changed before any fields are added; once fields are added, changing module triggers a confirmation dialog ("Changing the module will clear all current fields. Continue?")

#### 3.1.2 Canvas Table View
- The canvas displays a live-preview table of the report
- Columns correspond to dragged fields; rows show paginated live data (default: first 50 rows)
- Table columns are resizable by dragging the column divider
- Columns can be reordered by dragging the column header left or right
- Each column header has a context menu (right-click or `⋮` icon on hover):
  - Rename column
  - Sort ascending / descending
  - Remove column
  - Move left / Move right
- Empty state: "Drag fields from the panel to start building your report"
- The canvas supports a minimum of 1 column and a maximum of 30 columns

#### 3.1.3 Row Count Indicator
- Live badge showing: `Showing 50 of [total] rows — export will include all [total] rows`

### 3.2 Field Panel (Left Sidebar)

- Lists all available fields for the selected module, grouped by category (e.g. Record Info, Assignment, Dates, Status, Custom Fields)
- Each field shows: field label, field type icon (text, number, date, status, boolean)
- Search bar to filter fields by name
- Fields are draggable onto the canvas table header row
- Fields already on the canvas are visually dimmed in the panel (still draggable to reorder)
- Fields are organised in collapsible category groups

**Field Categories per Module:**

| Module | Field Groups |
|--------|-------------|
| Cases | Record Info, Customer, Status & Priority, Dates, Assignment, SLA, Custom |
| Work Orders | Record Info, Asset, Status, Dates, Assignment, Location, Custom |
| Service Appointments | Record Info, Scheduling, Resource, Status, Location, Custom |
| Field Service | Record Info, Technician, Dispatch, Status, Time Tracking, Custom |

### 3.3 Configuration Panel (Right Sidebar)

#### 3.3.1 Filters
- Users can add up to 15 filter rules
- Each filter rule: `[Field] [Operator] [Value]`
- Operators by field type:
  - Text: `equals`, `contains`, `starts with`, `is empty`, `is not empty`
  - Number: `equals`, `greater than`, `less than`, `between`
  - Date: `is`, `is before`, `is after`, `is between`, `is in last N days`
  - Status/Enum: `is`, `is not`, `is any of`
- Filters can be grouped with AND / OR logic (default: AND)
- Active filter count badge shown on the Filters tab

#### 3.3.2 Sort
- Up to 3 sort levels (primary, secondary, tertiary)
- Each sort: `[Column] [Ascending | Descending]`
- Sort levels are orderable (drag to reorder priority)

#### 3.3.3 Report Properties
- Report Name (required, max 80 chars)
- Description (optional, max 255 chars)
- Visibility: Private (only me) / Shared (specific users or roles) — see §3.6

### 3.4 Save & Run

- **Run Report** button: re-executes the query and refreshes the canvas preview
- **Save Report** button: persists the configuration (module, fields, filters, sort, name) under the user's account
- Auto-save draft: every 60 seconds while the builder is open, a draft is stored locally
- Saved reports appear in the Reports list view (§3.5)

### 3.5 Reports List View

- Accessible from the main navigation under "Reports"
- Lists all reports the user has created or has been shared access to
- Columns: Report Name, Module, Last Run, Created By, Created Date, Actions
- Actions per row: Run, Edit, Duplicate, Delete, Export (CSV / Excel)
- Search by report name
- Filter by module
- Sorted by Last Run (most recent first) by default

### 3.6 Sharing & Permissions

- Report creators can share reports with:
  - Specific users (by name search)
  - Roles (e.g. "Operations Manager", "Service Coordinator")
- Shared recipients can: View and Run, or View, Run and Edit (set per share)
- Admins can see all reports across all users in the Admin panel
- Field-level permissions: if a user does not have access to a specific field (set in User Settings), that field is not shown in the Field Panel and is stripped from any shared report they receive

### 3.7 Export

#### 3.7.1 CSV Export
- UTF-8 encoded
- First row: column headers (using the user's custom column names)
- Date format: `YYYY-MM-DD`
- Numbers: unformatted (no currency symbols, no `k` suffixes)
- Filename: `[ReportName]_[YYYY-MM-DD].csv`

#### 3.7.2 Excel Export
- `.xlsx` format
- Sheet name: truncated report name (max 31 chars per Excel spec)
- Header row: bold, background `#F5C800` (brand gold), text `#1A1A1A`
- Column widths: auto-fit to content (max 60 chars)
- Date columns: formatted as `DD/MM/YYYY` in Excel date cells
- Number columns: right-aligned
- Filename: `[ReportName]_[YYYY-MM-DD].xlsx`

#### 3.7.3 Export Behaviour
- Export triggers a loading state with progress indicator
- Maximum export row limit: **100,000 rows**
- Exports above 50,000 rows trigger a warning: "Large export — this may take a moment"
- Export runs server-side; user receives a download prompt when ready

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| Performance | Report preview (first 50 rows) must load in < 2 seconds for datasets up to 10,000 records |
| Performance | Full export generation must complete in < 30 seconds for up to 100,000 rows |
| Security | All report queries must respect the authenticated user's field-level and record-level permissions |
| Security | Export files must not be cached server-side; streamed directly to the client |
| Accessibility | Full keyboard navigation of field panel and canvas (WCAG 2.2 AA) |
| Accessibility | Drag-and-drop must have an equivalent keyboard alternative (arrow key reordering) |
| Reliability | Report configurations must be recoverable from auto-saved drafts on browser crash |
| Browser Support | Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ |
| Mobile | Builder is desktop-only; Reports list view is responsive for mobile read access |

---

## 5. UI / UX Specifications

### 5.1 Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Report Name input          [Run Report]  [Save]  [Export ▾]│
├──────────────┬──────────────────────────────────┬───────────────────┤
│              │                                  │                   │
│  FIELD PANEL │        CANVAS (Table Preview)    │  CONFIG PANEL     │
│  (240px)     │        (flex fill)               │  (280px)          │
│              │                                  │                   │
│  [Module ▾]  │  ┌──────┬──────┬──────┬──────┐  │  [Filters]        │
│              │  │ Col1 │ Col2 │ Col3 │ Col4 │  │  [Sort]           │
│  🔍 Search   │  ├──────┼──────┼──────┼──────┤  │  [Properties]     │
│              │  │ data │ data │ data │ data │  │                   │
│  ▾ Record    │  │ data │ data │ data │ data │  │                   │
│    □ ID      │  │ data │ data │ data │ data │  │                   │
│    □ Name    │  │ ...  │ ...  │ ...  │ ...  │  │                   │
│  ▾ Status    │  └──────┴──────┴──────┴──────┘  │                   │
│    □ Status  │                                  │                   │
│    □ Priority│  Showing 50 of 1,243 rows        │                   │
│  ▾ Dates     │                                  │                   │
│    □ Created │                                  │                   │
│    □ Updated │                                  │                   │
│              │                                  │                   │
└──────────────┴──────────────────────────────────┴───────────────────┘
```

### 5.2 Design Tokens (from Design System)

| Element | Token / Value |
|---------|--------------|
| Page background | `var(--bg-base)` |
| Panel backgrounds | `var(--bg-panel)` |
| Canvas background | `var(--bg-card)` |
| Panel borders | `1px solid var(--border)` |
| Header row (table) | `var(--bg-light)` |
| Primary action button | `.btn-primary` (gold `var(--accent)`) |
| Secondary buttons | `.btn-secondary` |
| Active field (dragging) | `var(--accent-pale)` background |
| Focus ring | `2px solid var(--accent)`, offset 2px |
| Column resize handle | `var(--border)` hover → `var(--accent)` |
| Export Excel header fill | `#F5C800` |

### 5.3 Drag-and-Drop Interaction States

| State | Visual Behaviour |
|-------|----------------|
| Field hover (panel) | Background → `var(--bg-light)`, cursor `grab` |
| Field being dragged | Ghost element with `0.6` opacity, cursor `grabbing` |
| Valid drop target (canvas header) | Column insertion guide: 2px `var(--accent)` vertical line |
| Invalid drop zone | Cursor `no-drop`, no visual guide |
| Column being reordered | Ghost column with `0.4` opacity, blue insertion guide |

### 5.4 Empty & Error States

| State | Message | Action |
|-------|---------|--------|
| No module selected | "Select a module to begin building your report" | Module dropdown |
| No fields added | "Drag fields from the left panel to add columns" | — |
| Filter returns 0 rows | "No records match your current filters" | "Clear Filters" button |
| Export failed | "Export failed. Please try again or contact support." | "Retry" button |
| Report name empty on save | Inline validation: "Report name is required" | — |

---

## 6. Technical Considerations

### 6.1 Data Layer
- Reports are stored as JSON configurations: `{ module, fields[], filters[], sorts[], meta }`
- Report execution generates a parameterised SQL query server-side; never client-side
- Field metadata (labels, types, relationships) served from a `/api/report-schema/:module` endpoint
- Live preview uses the same endpoint as full export, with a `?preview=true&limit=50` param

### 6.2 Drag-and-Drop Library
- Recommended: `@dnd-kit/core` (used in existing codebase for WO drag interactions)
- Keyboard accessibility built-in via `@dnd-kit/sortable`

### 6.3 Export Engine
- CSV: streamed via `text/csv` response with `Content-Disposition: attachment`
- Excel: generated server-side using `exceljs` or `xlsx` library
- Large exports: background job with polling (`GET /api/reports/:id/export/status`)

### 6.4 Permissions Integration
- Field visibility controlled by existing `FieldPermission` model in the CRM backend
- Report-sharing uses the existing `UserRole` and `Permission` tables

---

## 7. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-01 | User can select a module and see all available fields grouped by category |
| AC-02 | User can drag a field from the panel to the canvas and see it appear as a column with live data |
| AC-03 | User can remove a column via the column context menu |
| AC-04 | User can add a filter and see the canvas preview update to reflect filtered results |
| AC-05 | User can save a report and find it in the Reports list view |
| AC-06 | User can export a report as CSV and the file downloads with correct headers and data |
| AC-07 | User can export a report as Excel and the file opens correctly in Microsoft Excel |
| AC-08 | User cannot see fields in the panel they do not have permission to access |
| AC-09 | Shared report recipients can run but not delete the original owner's report |
| AC-10 | Column rename persists in both canvas preview and export header |

---

## 8. Open Questions

| # | Question | Owner | Due |
|---|---------|-------|-----|
| OQ-01 | Should custom formula fields (e.g. calculated duration) be in scope for v1? | Engineering | Sprint 1 |
| OQ-02 | What is the maximum number of saved reports per user? | Product | Sprint 1 |
| OQ-03 | Should the Reports module appear in the main sidebar nav or as a sub-item under each module? | UX | Sprint 1 |
| OQ-04 | Do we need row-level security beyond field-level? (e.g. a field tech can only see their own WOs) | Security | Sprint 2 |

---

## 9. Dependencies

| Dependency | Team | Notes |
|-----------|------|-------|
| Field permission API (`/api/report-schema/:module`) | Backend | New endpoint required |
| Export job queue | Backend/Infra | For large exports > 10k rows |
| `@dnd-kit` integration | Frontend | Already in use; extend for canvas |
| Admin settings page (user role config) | Frontend | See PRD-002 for User Settings integration |

---

## 10. Milestones

| Milestone | Deliverable | Target |
|-----------|-----------|--------|
| M1 | Field panel + canvas table (no live data) | Week 2 |
| M2 | Live data preview + module selection | Week 4 |
| M3 | Filters + sort configuration | Week 6 |
| M4 | Save / load report configurations | Week 7 |
| M5 | CSV + Excel export | Week 8 |
| M6 | Sharing + permissions | Week 10 |
| M7 | QA, accessibility audit, performance test | Week 11 |
| M8 | Production release | Week 12 |

---

*End of PRD-001*
