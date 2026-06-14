# PRD-01 — Data Query Module
## UT Service Console · Settings → App Settings → Query Console

**Status:** Draft  
**Version:** 1.0  
**Last Updated:** 2026-06-12  
**Owner:** Product  
**Relates to:** Design System v1.0

---

## 1. Overview

The Data Query Module is an internal developer and admin tool embedded within the UT Service Console. Accessible via **Settings → App Settings → Query Console**, it provides a structured environment for executing SQL-style queries against the organisation's live database. It supports two query modes — **SOQL** (structured object queries) and **SOSL** (free-text search across objects) — and enables inline data manipulation via **DML operations** (INSERT, UPDATE, DELETE, UPSERT).

This is a power-user tool targeted at developers, system administrators, and technical support staff who need direct, programmatic visibility into the data model, field values, and object relationships within the platform.

---

## 2. Problem Statement

Currently, technical users have no in-product way to inspect raw database records, verify field values, or trace object relationships without escalating to an external database tool or requesting engineering access. This creates:

- Friction during incident investigation and support escalation
- Delayed debugging of automation/trigger logic
- Inability to perform bulk corrections without code deployment
- Dependency on engineering teams for routine data checks

The Data Query Module removes this bottleneck by putting structured query access directly in the hands of permissioned admin and developer roles — inside the console they already use.

---

## 3. Goals

| Goal | Metric |
|------|--------|
| Enable self-serve data inspection for admins and developers | 0 escalations to engineering for data lookup tasks |
| Reduce mean time to resolve data-related support tickets | Target: ≤15 min from query to resolution |
| Support full DML capability in a controlled environment | INSERT, UPDATE, DELETE, UPSERT all functional at launch |
| Surface schema/field metadata inline | No context switching to external documentation |
| Maintain full audit trail of all executed queries | 100% of queries logged with user, timestamp, and statement |

---

## 4. Non-Goals

- This module is **not** a reporting or analytics tool (that is handled by the Dashboard module)
- It does **not** replace a full IDE or external database client
- It does **not** expose raw infrastructure-level access (no DDL — no CREATE TABLE, DROP, ALTER)
- It does **not** allow unauthenticated or role-less access under any circumstances

---

## 5. User Personas

### 5.1 System Administrator
Needs to verify field values on individual records, check relationship integrity between Cases and Work Orders, and occasionally correct stale data without filing a dev ticket.

### 5.2 Platform Developer
Needs to test SOQL/SOSL queries while building triggers or automations. Uses query history to iterate on statements. Needs DML to set up and tear down test data.

### 5.3 Technical Support Engineer
Investigates data anomalies reported by field staff. Needs read-only query access and the ability to export results to share with other teams.

---

## 6. Entry Point & Navigation

### 6.1 Access Path

```
App Header → Settings (gear icon)
  └── App Settings
        └── Query Console  ← new menu item
```

### 6.2 Permissions Gate

Access to the Query Console is controlled by the user's role. The following role matrix applies:

| Role | SOQL (Read) | SOSL (Read) | DML (Write) | Schema Browser |
|------|-------------|-------------|-------------|----------------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Developer | ✅ | ✅ | ✅ | ✅ |
| Tech Support | ✅ | ✅ | ❌ | ✅ |
| Standard User | ❌ | ❌ | ❌ | ❌ |

Users without access who navigate to the route directly will see a permissions error state — not a blank page.

---

## 7. Module Layout

The Query Console uses a two-panel layout consistent with the UT Service Console detail page pattern.

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER: "Query Console"  [SOQL] [SOSL] [DML]       [Run] [Clear]│
├──────────────────────────────────────┬──────────────────────────┤
│                                      │  HISTORY PANEL           │
│  QUERY EDITOR                        │  ─────────────────────   │
│  (code-style textarea)               │  Executed                │
│                                      │  > SELECT Id, Name...    │
│                                      │  > SELECT Contact.Fi...  │
│                                      │                          │
├──────────────────────────────────────┤                          │
│  ERROR / STATUS BAR                  │                          │
├──────────────────────────────────────┴──────────────────────────┤
│  RESULTS PANEL                                                   │
│  Query Results — Total Rows: 20          [Export CSV] [Copy]     │
│  ┌──────────┬────────────────────────────────────────────────┐  │
│  │ Field 1  │  Field 2                                       │  │
│  ├──────────┼────────────────────────────────────────────────┤  │
│  │ value    │  value                                         │  │
│  └──────────┴────────────────────────────────────────────────┘  │
│  [Save Rows] [Insert Row] [Delete Row] [Refresh Grid]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Feature Specifications

### 8.1 Query Editor

- Multi-line textarea rendered in monospace font (`ui-monospace, SFMono-Regular, monospace`)
- Supports syntax highlighting for SQL keywords (`SELECT`, `FROM`, `WHERE`, `LIKE`, `ORDER BY`, `LIMIT`, `GROUP BY`, `HAVING`, `INSERT`, `UPDATE`, `DELETE`, `UPSERT`)
- Auto-complete for known object names and field names (populated from schema metadata API)
- Keyboard shortcut: `Ctrl+Enter` / `Cmd+Enter` to execute
- Line numbers displayed on the left gutter
- Tab key inserts 2 spaces (not a focus trap)
- Supports queries up to 10,000 characters
- Error underline (red) on syntax validation failure before execution

### 8.2 Query Mode Tabs

Three tabs are displayed in the module header: **SOQL**, **SOSL**, **DML**. Selecting a tab:

- Updates the editor placeholder text to reflect the correct syntax
- Updates the error parser to validate for the selected mode
- Persists to `localStorage` so the last-used mode is restored on next visit

**SOQL** example placeholder:
```sql
SELECT Id, Name, Status__c FROM Case WHERE Status__c = 'Open' LIMIT 20
```

**SOSL** example placeholder:
```
FIND {Grand Hotels} IN ALL FIELDS RETURNING Account(Id, Name), Contact(FirstName, LastName)
```

**DML** example placeholder:
```sql
UPDATE Case SET Status__c = 'Closed' WHERE Id = '500xx000001234'
```

### 8.3 Execution & Results

- **Run** button triggers query execution against the live org database
- Response renders in the Results Grid (see section 8.4)
- Execution time displayed in the status bar: `Executed in 142ms`
- Total row count displayed above the grid: `Query Results — Total Rows: N`
- For SOSL, results are grouped by object type with a section header per object
- Long-running queries (>10s) show a spinner and a **Cancel** option
- Queries that return 0 rows render an empty state: _"No records matched your query."_

### 8.4 Results Grid

- Column headers are the field API names returned by the query
- Rows are paginated: 50 rows per page, with pagination controls at the bottom
- Columns are resizable by dragging the header divider
- Clicking a record ID opens the record's detail page in a new tab
- **Grid action bar** (for DML-permissioned users only):
  - **Save Rows** — commits inline edits to the database
  - **Insert Row** — appends a blank editable row to the grid
  - **Delete Row** — marks selected row(s) for deletion (with confirmation dialog)
  - **Refresh Grid** — re-executes the last query

### 8.5 Query History Panel

- Right-side panel shows the last 20 executed queries for the current session
- Each entry shows a truncated preview (first 60 characters) of the statement
- Clicking an entry loads it back into the editor
- History is session-scoped (cleared on logout); it is not persisted to the server
- Labelled: **History** with `text-[11px] font-bold uppercase tracking-wider` using `var(--text-muted)`

### 8.6 Export

- **Export CSV** — exports the current results page to a `.csv` file named `query_results_YYYYMMDD_HHMMSS.csv`
- **Copy** — copies all result rows to clipboard as tab-separated values

### 8.7 Schema Browser (Side Sheet)

A collapsible side panel (right side sheet, `slideInRight` animation) exposes:

- Full list of queryable objects in the org
- Per-object: all field names, field types, nullability, and relationship names
- Search/filter within the object list
- Clicking a field name inserts it into the editor at cursor position

Trigger: **Schema** icon button in the module toolbar.

---

## 9. Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Syntax error (pre-execution) | Red underline in editor + inline error tooltip |
| Runtime query error | Error text displayed in status bar in `var(--color-danger)` |
| Timeout (>10s) | Warning banner + Cancel button |
| Permission denied (role check) | Full-page error state with explanation |
| DML action affects 0 rows | Status bar info message: _"No records were affected."_ |
| DML action without confirmation | Confirmation modal before any destructive operation |

---

## 10. Audit & Security

- Every executed query is logged server-side with: `userId`, `userEmail`, `timestamp`, `queryMode`, `queryText`, `rowsAffected`, `executionTimeMs`
- DML operations additionally log: `objectType`, `recordIds` affected
- Logs are accessible to Admins via **Settings → Audit Log** (separate module)
- The module is never accessible in read-only maintenance mode
- Rate limiting: max 60 query executions per user per minute

---

## 11. Design Tokens

All visual elements follow Design System v1.0:

- Editor background: `var(--bg-card)`
- Editor border: `1px solid var(--border)`
- Editor font: `ui-monospace, SFMono-Regular, monospace`
- Keyword highlight: `var(--accent)` (gold)
- Run button: `.btn-primary`
- Tab selectors: active tab uses `var(--accent-pale)` background + `var(--accent)` bottom border
- Results grid header: `var(--bg-light)` background, `var(--text-tertiary)` text
- Status bar: `var(--bg-panel)`, `text-xs`, `font-medium`
- Error text: `var(--color-danger)` (`#C62828`)

---

## 12. Acceptance Criteria

- [ ] Module accessible via Settings → App Settings → Query Console
- [ ] Role-based access gate in place before any query can be executed
- [ ] SOQL, SOSL, and DML tabs each execute correctly against the live org
- [ ] Results grid renders with column headers from the query's field list
- [ ] Row count displayed above the grid
- [ ] Query history panel shows last 20 queries for current session
- [ ] Export CSV produces a correctly formatted file
- [ ] All DML operations require confirmation before execution
- [ ] Every executed query is logged in the audit table
- [ ] Schema browser side panel lists all queryable objects and fields
- [ ] Module fully functional in both light and dark mode
- [ ] Keyboard shortcut `Ctrl/Cmd+Enter` triggers execution
- [ ] Empty state shown when query returns 0 rows
- [ ] Error state shown and explained when user lacks permission

---

## 13. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | Should query history persist across sessions (server-stored)? | Product | TBD |
| 2 | Should SOSL indexing delay be surfaced as a visible warning to users? | Engineering | TBD |
| 3 | What is the maximum result set before pagination is enforced? | Engineering | TBD |
| 4 | Should the Schema Browser include deprecated/hidden fields? | Product | TBD |

---

*End of PRD-01*
