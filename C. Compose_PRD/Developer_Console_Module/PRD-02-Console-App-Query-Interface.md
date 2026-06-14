# PRD-02 — Console App Query Interface
## UT Service Console · Settings → Console App → Query Interface

**Status:** Draft  
**Version:** 1.0  
**Last Updated:** 2026-06-12  
**Owner:** Product  
**Relates to:** PRD-01 (Data Query Module), Design System v1.0

---

## 1. Overview

The Console App Query Interface is the end-user-facing query surface within the UT Service Console's **Console App** configuration area. While PRD-01 (Data Query Module) covers the raw developer-level query tool under App Settings, this module targets the **Console App runtime context** — providing configured query tabs, pre-built query templates, object-specific search tools, and result-driven actions for Service Console operators and field service coordinators.

It enables users to query Cases, Work Orders, Service Appointments, and Contacts directly from within their active console session, inspect field-level data, and execute guided DML actions (update status, reassign, close) without leaving their current context.

---

## 2. Problem Statement

Service Console operators and field coordinators need to look up specific records, cross-reference related objects, and perform quick field updates as part of their daily workflow. Currently this requires navigating to separate detail pages, opening multiple tabs, or relying on developers to run queries on their behalf.

The Console App Query Interface brings structured search and field-level inspection directly into the operator's working context — without exposing raw SQL syntax or requiring technical knowledge.

---

## 3. Goals

| Goal | Metric |
|------|--------|
| Operators can find any record in <30 seconds | Search-to-result time ≤ 30s (P90) |
| Reduce context-switching during case resolution | 0 navigations outside the console for data lookup tasks |
| Enable guided DML actions from query results | Target: UPDATE and UPSERT status from result row within 2 clicks |
| Surface related object data in a single result view | Related records visible without a second query |
| Provide pre-built query templates for common workflows | ≥10 templates at launch covering top query patterns |

---

## 4. Non-Goals

- This module does **not** expose raw query syntax to non-technical users (that is PRD-01)
- It does **not** replace the full Case or Work Order detail page
- It does **not** support DDL or schema modification
- It does **not** support SOSL free-text search (that remains in the App Settings Query Console per PRD-01)

---

## 5. User Personas

### 5.1 Service Console Operator
Manages incoming Cases. Needs to quickly look up a contact's account, check a case's history, or verify work order status without leaving the console session.

### 5.2 Field Service Coordinator
Assigns and tracks Work Orders and Service Appointments. Needs to query by technician, by region, or by date range and take bulk status actions from the result list.

### 5.3 Team Lead / Supervisor
Reviews workload distribution and SLA adherence. Uses pre-built query templates to get a snapshot of open cases by priority or overdue appointments.

---

## 6. Entry Point & Navigation

### 6.1 Access Path

```
App Header → Settings (gear icon)
  └── Console App
        └── Query Interface  ← new menu item
```

This is a separate configuration namespace from **App Settings → Query Console** (PRD-01) and serves a different permission profile.

### 6.2 Permissions Matrix

| Role | Run Queries | Use Templates | Guided DML | Create Templates | Export |
|------|-------------|---------------|------------|------------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Developer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Team Lead | ✅ | ✅ | ✅ | ✅ | ✅ |
| Console Operator | ✅ | ✅ | ✅ | ❌ | ✅ |
| Field Coordinator | ✅ | ✅ | ✅ | ❌ | ✅ |
| Read-Only User | ✅ | ✅ | ❌ | ❌ | ✅ |

---

## 7. Module Layout

The Console App Query Interface uses a tabbed layout with a persistent search bar at the top and an inline results panel below.

```
┌─────────────────────────────────────────────────────────────────┐
│  QUERY INTERFACE HEADER                                         │
│  [Cases] [Work Orders] [Service Appointments] [Contacts] [+]   │
├─────────────────────────────────────────────────────────────────┤
│  SEARCH BAR                                                     │
│  ┌─────────────────────────────────────────┐  [Search] [Reset] │
│  │  Search or enter field filter...        │                    │
│  └─────────────────────────────────────────┘  [Templates ▾]    │
│                                                                 │
│  FILTER ROW                                                     │
│  Status: [All ▾]  Priority: [All ▾]  Date: [Range picker]      │
├─────────────────────────────────────────────────────────────────┤
│  RESULTS PANEL                                                  │
│  Query Results — Total Rows: 20     [Export CSV] [Bulk Action ▾]│
│  ┌────┬───────────────┬──────────┬────────────────────────────┐ │
│  │ ☐  │ Record ID     │ Field 2  │ Field 3                    │ │
│  ├────┼───────────────┼──────────┼────────────────────────────┤ │
│  │ ☐  │ value (link)  │ value    │ value                      │ │
│  │ ☐  │ value (link)  │ value    │ value                      │ │
│  └────┴───────────────┴──────────┴────────────────────────────┘ │
│  ← 1  2  3 →                              Showing 1–20 of 20   │
├─────────────────────────────────────────────────────────────────┤
│  DETAIL DRAWER (slide in from right when row is selected)       │
│  Field-level inspection panel for selected record               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Feature Specifications

### 8.1 Object Tabs

The top tab bar provides one tab per queryable object type:

| Tab | Primary Object | Default Sort |
|-----|---------------|--------------|
| Cases | `Case` | Created Date DESC |
| Work Orders | `WorkOrder` | Scheduled Date ASC |
| Service Appointments | `ServiceAppointment` | Appointment Date ASC |
| Contacts | `Contact` | Last Name ASC |
| `+` | User-configurable | — |

The `+` tab allows Team Leads and Admins to pin a custom object type and field set. Configuration is saved per-user in `localStorage` with server fallback.

Switching tabs:
- Resets the filter row to defaults for that object
- Clears the search bar
- Loads the default query for that object (first 50 records, default sort)

### 8.2 Search Bar

- Free-text input searches across all text fields defined in the object's default search layout
- Search is debounced (300ms) to prevent excessive API calls while typing
- Displays a loading spinner in the input during active query execution
- Placeholder text adapts to the active tab: _"Search cases by subject, account, or case number..."_
- Pressing `Enter` or clicking **Search** executes immediately without waiting for debounce

### 8.3 Filter Row

Filters are rendered as compact dropdowns and date range inputs below the search bar. Each filter applies an additional `WHERE` clause condition to the underlying query.

**Case filters:**
- Status: All / Open / Assigned / In Progress / Resolved / Closed
- Priority: All / Critical / High / Medium / Low
- Created Date: date range picker (from/to)
- Assigned To: typeahead user search

**Work Order filters:**
- Status: All / Open / In Progress / Completed / On Hold / Scheduled / Cancelled
- Priority: All / Critical / High / Medium / Low
- Scheduled Date: date range picker
- Technician: typeahead user search
- Region/Territory: dropdown from org-defined territories

**Service Appointment filters:**
- Status: All / Scheduled / In Progress / Completed / Cancelled
- Appointment Date: date range picker
- Assigned Resource: typeahead

**Contacts filters:**
- Account: typeahead account search
- Created Date: date range picker

Filters persist within the current session for each tab independently. **Reset** clears all filters and the search bar for the active tab.

### 8.4 Query Templates

Templates are pre-built parameterised queries accessible from the **Templates** dropdown button. They surface common workflows without requiring the user to construct a query manually.

**Launch templates (10 minimum):**

| Template Name | Object | Description |
|--------------|--------|-------------|
| Open Critical Cases | Case | All open cases with Priority = Critical, sorted by age |
| My Assigned Cases | Case | Cases assigned to the current user, not closed |
| Overdue Work Orders | WorkOrder | Scheduled date is in the past, status is not Completed |
| Today's Appointments | ServiceAppointment | Appointments scheduled for today |
| Unassigned Work Orders | WorkOrder | Work orders with no assigned technician |
| Cases Escalated This Week | Case | Cases with escalation flag set, this calendar week |
| Contacts Without Cases | Contact | Contacts who have no linked open cases |
| Cases by Account | Case | Filter by a specific account (prompts for account name) |
| Work Orders by Territory | WorkOrder | Filter by territory (prompts for territory selection) |
| SLA Breach Risk | Case | Cases nearing SLA deadline (within 2 hours) |

Templates that require user input (marked with "prompts for") display a lightweight parameter modal before executing.

Team Leads and Admins can create, edit, and share custom templates. Custom templates are stored server-side per-org and are visible to all users with access.

### 8.5 Results Grid

- Column headers reflect the field set defined for the active tab (configurable per template)
- Record ID column values are clickable links — clicking opens the detail page in the main console workspace
- Rows support **inline selection** (checkbox) for bulk actions
- **Select All** checkbox in the header selects all rows on the current page
- Status and Priority fields render as inline badges using the Design System badge components (§7 of Design System)
- Timestamps render in monospace font using the user's locale timezone
- Column widths are configurable and persist in `localStorage`

**Pagination:**
- 20 rows per page (default), configurable to 50 or 100
- Pagination controls at the bottom: previous / page numbers / next
- Total row count displayed: `Showing 1–20 of N`

### 8.6 Bulk Actions

Available when one or more rows are selected:

| Action | Objects | DML Operation | Requires Confirmation |
|--------|---------|---------------|----------------------|
| Update Status | Case, WO, SA | UPDATE | Yes |
| Reassign | Case, WO, SA | UPDATE | Yes |
| Close (Bulk) | Case, WO | UPDATE (Status = Closed/Completed) | Yes |
| Export Selection | All | — (read) | No |
| Add to Queue | Case, WO | UPDATE | Yes |

The **Bulk Action** dropdown is disabled (greyed out with `opacity-50`) when no rows are selected.

All bulk DML operations:
1. Show a confirmation modal listing the number of records affected and the proposed change
2. Execute only after the user clicks **Confirm**
3. Display a success toast on completion: _"N records updated."_
4. Display an error state inline if any record in the batch fails

### 8.7 Detail Drawer

Clicking the expand icon on a result row opens a right-side detail drawer (using `slideInRight` animation, 250ms ease-out per Design System §10).

The detail drawer contains:

- **Summary section**: key fields (ID, Status, Priority, Assigned To, Created/Modified)
- **Field Inspector**: full flat list of all fields and values for the selected record, displayed as label-value pairs
- **Related Objects**: tabbed sub-panel showing related records (e.g., for a Case: linked Work Orders, related Contacts, attached files count)
- **Quick Actions**: context-sensitive action buttons (Update Status, Reassign, View Full Record)

The drawer does not replace the main results grid — it overlays it on the right side. Closing the drawer returns focus to the selected row.

### 8.8 Export

- **Export CSV** button exports all rows matching the current query (not just the current page), up to 10,000 rows
- File named: `{ObjectType}_query_{YYYYMMDD_HHMMSS}.csv`
- For exports > 10,000 rows, the system queues the export and sends a download link via in-app notification when ready
- Export respects the current column selection (only exports visible columns)

---

## 9. Underlying Query Construction

The interface constructs SQL queries transparently — users interact with filters and search, not raw SQL. However, Admins and Developers can optionally click **View Query** to inspect the generated statement (read-only, opened in App Settings Query Console for editing).

**Example of a generated query from filter state:**

```sql
SELECT Id, CaseNumber, Subject, Status, Priority, CreatedDate, Account.Name
FROM Case
WHERE Status IN ('Open', 'In Progress')
  AND Priority = 'Critical'
  AND CreatedDate = THIS_WEEK
ORDER BY CreatedDate DESC
LIMIT 50
```

The query generation layer:
- Never produces unbounded queries (always applies a LIMIT)
- Sanitises all user-supplied filter values before constructing the statement
- Validates against the org's object permission set before execution

---

## 10. Performance Requirements

| Scenario | Target |
|----------|--------|
| Default tab load (first 50 records) | ≤ 1.5s |
| Search with 1–3 filters applied | ≤ 2s |
| Bulk action on ≤ 100 records | ≤ 3s |
| Export of ≤ 500 rows | ≤ 5s |
| Export of > 10,000 rows (async) | Queued within 5s, delivered within 60s |

---

## 11. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Query returns 0 results | Empty state illustration + message: _"No records matched your filters."_ + Reset link |
| Network error during search | Inline error banner: _"Search failed. Check your connection and try again."_ |
| Bulk action partial failure | Toast with count of successes and failures; failures listed in a collapsible detail |
| Session expired mid-query | Redirect to login with return URL preserved |
| Permission denied on object | Graceful empty state with explanation; tab is hidden for users without access |
| Export too large (>100,000 rows) | Blocks export and shows message: _"Narrow your filters to export fewer than 100,000 records."_ |

---

## 12. Design Tokens

All visual elements follow Design System v1.0:

- Tab bar active: `var(--accent-pale)` background, `2px solid var(--accent)` bottom border
- Search input: `.input-field` class
- Filter dropdowns: `.input-field` class, `text-xs` labels
- Run/Search button: `.btn-primary`
- Reset button: `.btn-secondary`
- Results grid header: `var(--bg-light)` background, `var(--text-tertiary)` text, `text-xs font-semibold uppercase tracking-wider`
- Results grid row hover: `var(--bg-lighter)`
- Status badges: Design System §7.2 status badge classes
- Priority badges: Design System §7.3 priority badge classes
- Detail drawer: `var(--bg-panel)`, `border-left: 1px solid var(--border)`, width 400px
- Bulk action disabled state: `opacity-50 cursor-not-allowed`
- Toast (success): `var(--color-success)` accent
- Toast (error): `var(--color-danger)` accent

---

## 13. Acceptance Criteria

- [ ] Module accessible via Settings → Console App → Query Interface
- [ ] Object tabs render for Cases, Work Orders, Service Appointments, and Contacts
- [ ] Default query loads on tab activation within 1.5s
- [ ] Search bar filters results as user types (debounced 300ms)
- [ ] Filter row controls correctly modify the underlying query
- [ ] Template dropdown shows all 10 launch templates
- [ ] Parameterised templates prompt for required input before executing
- [ ] Results grid renders correct badges for Status and Priority
- [ ] Row checkboxes enable Bulk Action dropdown
- [ ] All bulk DML operations require and receive confirmation before execution
- [ ] Detail drawer opens on row expand and shows all field values
- [ ] Export CSV produces correct file with current column set
- [ ] Empty state shown when query returns 0 rows
- [ ] Error states shown inline for all failure scenarios listed in §11
- [ ] View Query reveals generated SQL in read-only mode (Admin/Developer only)
- [ ] Module fully functional in both light and dark mode
- [ ] All interactive elements meet 44px minimum touch target

---

## 14. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | Should custom templates be org-wide or user-scoped by default? | Product | TBD |
| 2 | Should the `+` custom tab support multi-object joins? | Engineering | TBD |
| 3 | What is the maximum number of rows for inline bulk action (vs async job)? | Engineering | TBD |
| 4 | Should the Detail Drawer support inline editing, or redirect to the full detail page? | Product | TBD |
| 5 | Is a SOSL tab needed here in a future phase? | Product | TBD |

---

## 15. Relationship to PRD-01

| Dimension | PRD-01 (App Settings Query Console) | PRD-02 (Console App Query Interface) |
|-----------|--------------------------------------|---------------------------------------|
| Target user | Developers, Admins | Operators, Coordinators, Team Leads |
| Query input | Raw SQL / SOQL / SOSL / DML | Guided filters + templates |
| Permissions required | Admin or Developer role | Any Console App user |
| DML | Full (raw) | Guided only (status update, reassign, close) |
| Schema Browser | Yes | No |
| Query History | Session-local | No |
| Use case | Debug, build, inspect schema | Daily operations, record lookup, bulk actions |

The two modules share the same underlying query execution API but serve different personas and expose different levels of power and complexity accordingly.

---

*End of PRD-02*
