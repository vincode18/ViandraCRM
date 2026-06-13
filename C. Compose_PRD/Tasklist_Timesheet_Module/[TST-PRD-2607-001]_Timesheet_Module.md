# DESIGN-TS-001 — Timesheet Module
## UI & UX Design Specification

> **Product:** UT Service Console — Work Order Mobile App
> **Version:** 1.0
> **Date:** 07 June 2026
> **Status:** Draft
> **References:** [PRD-TS-001](./PRD-TS-001_Timesheet_Module.md) · [DESIGN-TL-001](./DESIGN-TL-001_Task_List_Module.md) · [Design System v1.0](./Design_System.md)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [User Personas](#2-user-personas)
3. [Information Architecture](#3-information-architecture)
4. [UX Flows](#4-ux-flows)
5. [Mobile App — Timesheet Screen](#5-mobile-app--timesheet-screen)
6. [Service Console — Time Sheet Entries Related List](#6-service-console--time-sheet-entries-related-list)
7. [Service Console — Time Sheet Detail Page](#7-service-console--time-sheet-detail-page)
8. [Service Console — Approval Queue](#8-service-console--approval-queue)
9. [Component Anatomy & States](#9-component-anatomy--states)
10. [Interaction Patterns](#10-interaction-patterns)
11. [Accessibility](#11-accessibility)
12. [Responsive Behaviour](#12-responsive-behaviour)
13. [Error & Empty States](#13-error--empty-states)
14. [Revision History](#14-revision-history)

---

## 1. Design Principles

### 1.1 Pre-filled by Default
The mechanic should never open a blank timesheet. Every entry arrives pre-seeded from the Task List. Editing is the exception, not the starting point. The UI reinforces this by showing planned durations as reference anchors next to editable actual fields.

### 1.2 One-Tap Submit
Submission must be a single intentional action, not a multi-step form. The mechanic's cognitive load is already high in the field. The submit flow is: review → confirm dialog → done.

### 1.3 Approval is Fast or Not at All
The supervisor approval queue is designed for speed. Scanning 5 entries and approving in bulk should take under 30 seconds. The UI front-loads deviations (entries where actual ≠ planned) so supervisors focus only on exceptions.

### 1.4 The Chain is Visible
At every surface — mobile and console — the connection between Task List operation → Timesheet Entry → SAP posting is traceable. Status progression (`Draft → Submitted → Approved → Sent to SAP`) is always displayed, never hidden.

---

## 2. User Personas

### 2.1 Mohammad (Field Mechanic)
- **Context:** Finishing work on-site; phone battery at 40%; filling in timesheet before leaving
- **Goal:** Submit accurate hours in under 2 minutes
- **Pain points:** Having to remember and type each operation manually; confusing forms; no feedback on whether submission worked
- **Design implication:** Pre-filled entries; numeric stepper (not free-text) for durations; clear submit CTA; offline queue with visual confirmation

### 2.2 Sari (Service Coordinator / Supervisor)
- **Context:** Office, end-of-day review, multiple WOs to approve
- **Goal:** Approve correct timesheets quickly; reject and explain anomalies clearly
- **Pain points:** Opening every TST individually; no at-a-glance deviation indicator; unclear which entries are still pending
- **Design implication:** Approval queue with deviation flags; bulk approve; rejection with pre-filled reason templates

### 2.3 Rudi (Supervisor — Field)
- **Context:** Tablet in field office; checking SAP posting status after approval
- **Goal:** Confirm hours have reached SAP; audit trail for disputes
- **Design implication:** `Sent to SAP` status visible on TSE list; integration log accessible from TST detail

---

## 3. Information Architecture

```
Work Order Detail
├── Tab: Related
│   ├── Work Order Task List
│   └── Time Sheet Entries  ← CONSOLE SURFACE
│       ├── TSE-0001  Preparation    Approved ✓ Sent to SAP
│       ├── TSE-0002  Traveling      Approved ✓ Sent to SAP
│       ├── TSE-0003  Inspection     Approved ✓ Sent to SAP
│       ├── TSE-0004  Field Guide    Approved ✓ Sent to SAP
│       └── TSE-0005  Reporting      Approved ✓ Sent to SAP
│
└── [link] Time Sheet TST-2606668
    ├── Header (Service Resource, Dates, Status, Duration)
    ├── Tab: Related
    │   └── Time Sheet Entries (same list, scoped to this TST)
    └── Tab: Details
        ├── Section: Information
        └── Section: System Information

Approval Queue (Console)
└── Pending Timesheets List
    ├── TST-2606668  Mohammad Ficri Kaban  18/05/2026  12.00H  Submitted
    └── TST-2606701  Budi Santoso          18/05/2026   8.00H  Submitted

Mobile App
└── Work Order Screen
    ├── Tab: Task List
    └── Tab: Timesheet  ← PRIMARY MOBILE SURFACE
        ├── TSE Card (0010 — Preparation)
        ├── TSE Card (0020 — Traveling)
        ├── TSE Card (0030 — Inspection)
        ├── TSE Card (0040 — Field Guide)
        ├── TSE Card (0050 — Reporting)
        └── Footer: Total + Submit button
```

---

## 4. UX Flows

### 4.1 Mechanic — Fill & Submit Timesheet (Happy Path)

```
WO Mobile App
  │
  └─[tap WO card]─▶ WO Detail
                      │
                      └─[tap "Timesheet" tab]
                           │
                           ├─ 5 TSE cards, all Draft, pre-filled from Task List
                           │
                           ├─[review durations — all correct]
                           │
                           └─[tap "Submit All" button]
                                │
                                ├─ Confirmation dialog opens:
                                │  "Submit 5 entries — 12.00 hours total?"
                                │  [Cancel]  [Submit]
                                │
                                └─[tap "Submit"]
                                     │
                                     ├─ All TSEs → Submitted
                                     ├─ Time Sheet Submitted = now
                                     ├─ Success state: checkmark animation
                                     └─ Footer label: "Submitted — awaiting approval"
```

---

### 4.2 Mechanic — Edit Duration Before Submit

```
Timesheet Tab
  │
  └─[tap edit icon on TSE card "Inspection"]
       │
       ├─ Duration field activates (numeric keyboard opens)
       ├─ Planned duration shown as greyed reference: "Planned: 1.00 H"
       ├─ Mechanic types 1.5 or uses stepper +/−
       │
       └─[tap ✓ confirm]
            │
            ├─ Duration updates to 1.50 H
            ├─ Deviation indicator: "▲ +0.50 H vs planned"
            └─ Total in footer recalculates live
```

---

### 4.3 Supervisor — Approve Timesheet (Console)

```
Approval Queue
  │
  └─[click TST row]─▶ Time Sheet Detail
                          │
                          ├─ Header: Mohammad Ficri Kaban · 18/05/2026 · 12.00H · Submitted
                          ├─ TSE list shows 5 entries; 1 has deviation flag (Inspection 1.50H vs 1.00H planned)
                          │
                          ├─[review deviation entry]
                          │   Inspection: Actual 1.50H · Planned 1.00H · ▲ +0.50H
                          │
                          └─[click "Approve All"]
                               │
                               ├─ Confirmation: "Approve 5 entries for Mohammad Ficri Kaban?"
                               └─[confirm]
                                    │
                                    ├─ All TSEs → Approved
                                    ├─ Time Sheet Approved = now
                                    ├─ SAP posting triggered automatically
                                    └─ TST exits approval queue
```

---

### 4.4 Supervisor — Reject a Single TSE

```
Time Sheet Detail
  │
  └─[click "Reject" on Inspection TSE]
       │
       ├─ Rejection panel slides in (inline, below the TSE row)
       │  ┌─────────────────────────────────────────────┐
       │  │ Rejection reason *                           │
       │  │ [Exceeded planned — please justify       ]  │
       │  │                                             │
       │  │ Quick reasons:                              │
       │  │ [Over planned] [Wrong operation] [Missing]  │
       │  │                                             │
       │  │              [Cancel]  [Confirm Rejection]  │
       │  └─────────────────────────────────────────────┘
       │
       └─[confirm rejection]
            │
            ├─ TSE → Rejected (red border + reason shown)
            ├─ TST status → Draft
            ├─ Push notification sent to Mohammad
            └─ Supervisor stays on same page (no full reload)
```

---

### 4.5 Mechanic — Respond to Rejection

```
Mechanic receives push notification
  │
  └─[tap notification]─▶ Opens WO · Timesheet tab
                              │
                              ├─ Rejected TSE highlighted in red:
                              │  "Rejected: Exceeded planned — please justify"
                              │
                              └─[tap edit icon on rejected TSE]
                                   │
                                   ├─ Edit duration (e.g., keep 1.50H)
                                   ├─ Add remark: "Extra time due to valve seizure"
                                   │
                                   └─[tap Resubmit]
                                        │
                                        └─ TSE → Submitted; supervisor notified
```

---

### 4.6 SAP Posting Confirmation Flow

```
All TSEs Approved
  │
  └─ System auto-triggers SAP posting
       │
       ├─ "Posting to SAP…" spinner on TST status badge
       │
       ├─ Success ─▶ Sent to SAP = true on all TSEs
       │              TST detail shows: ✓ Posted to SAP · 23/05/2026, 11:36
       │
       └─ Failure ─▶ TST status = "Posting Failed" (red badge)
                      Admin alert sent
                      [Retry Post to SAP] button appears on TST detail
```

---

## 5. Mobile App — Timesheet Screen

### 5.1 Screen Structure

```
┌──────────────────────────────┐
│ ← WO 01269822         [⋮]   │  ← Navigation bar (56px)
├──────────────────────────────┤
│ [Task List] [Timesheet ●5]   │  ← Tab bar (48px); badge = pending count
├──────────────────────────────┤
│ TST-2606668 · 18/05/2026     │  ← Context strip (36px)
│ DE7AP20 · 5 entries          │
├──────────────────────────────┤
│ ┌────────────────────────┐   │
│ │ 0010  Preparation      │   │  ← TSE cards
│ │ Actual [ 1.00 ] H      │   │
│ │ Planned: 1.00 H        │   │
│ │ Status: ○ Draft        │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ 0020  Traveling        │   │
│ │ Actual [ 4.00 ] H      │   │
│ │ Planned: 0.00 H  ⚠     │   │  ← Warning: planned was 0
│ │ Status: ○ Draft        │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │  ← Deviation example
│ │ 0030  Inspection       │   │
│ │ Actual [ 1.50 ] H      │   │
│ │ Planned: 1.00 H ▲+0.50 │   │
│ │ Status: ○ Draft        │   │
│ │ 💬 Remarks (optional)  │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ 0040  Field Guide      │   │
│ │ Actual [ 1.00 ] H      │   │
│ │ Planned: 1.00 H        │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ 0050  Reporting        │   │
│ │ Actual [ 1.00 ] H      │   │
│ │ Planned: 1.00 H        │   │
│ └────────────────────────┘   │
├──────────────────────────────┤
│ Total: 8.50 H                │  ← Sticky footer
│ [       Submit All        ]  │
└──────────────────────────────┘
```

### 5.2 Context Strip

- Height: 36px; background `var(--bg-light)`; padding `px-4`
- Left: TST number in `text-xs font-mono font-medium var(--text-secondary)` · `•` · date
- Right: Task List Code pill + entry count in `text-xs var(--text-muted)`

### 5.3 TSE Card

**Default / Draft state:**

```
┌────────────────────────────────────────────────────────┐
│  [0030]  Inspection                                    │
│                                                        │
│  Actual    [  −  ]  [ 1.50 ]  [  +  ]   H             │
│  Planned:  1.00 H   ▲ +0.50 H                         │
│                                                        │
│  Status: ○ Draft                                       │
│  💬 Add remarks...  (placeholder, tap to expand)       │
└────────────────────────────────────────────────────────┘
```

**Rejected state:**

```
┌────────────────────────────────────────────────────────┐  ← border-left: 3px solid #C62828
│  [0030]  Inspection                                    │
│                                                        │
│  ✕  Rejected: "Exceeded planned — please justify"      │  ← #FFEBEE bg, #C62828 text
│                                                        │
│  Actual    [  −  ]  [ 1.50 ]  [  +  ]   H             │
│  Planned:  1.00 H   ▲ +0.50 H                         │
│                                                        │
│  Remarks: [________________________________]           │
│                                                        │
│                           [     Resubmit     ]         │
└────────────────────────────────────────────────────────┘
```

**Approved state:**

```
┌────────────────────────────────────────────────────────┐  ← border-left: 3px solid #388E3C
│  [0030]  Inspection                                    │
│                                                        │
│  1.50 H                       ✓  Approved             │  ← read-only, no stepper
│  Planned: 1.00 H  ▲ +0.50 H                           │
│                                                        │
│  Approved 23/05/2026, 11:36   ✓ Sent to SAP           │
└────────────────────────────────────────────────────────┘
```

### 5.4 TSE Card Anatomy

| Element | Spec |
|---------|------|
| Card container | `rounded-lg border border-[var(--border)] bg-[var(--bg-card)] mx-4 mb-3 p-4` |
| Operation Number pill | `text-xs font-mono font-medium px-2 py-0.5 rounded` · bg `var(--accent-pale)` · text `var(--text-main)` |
| Subject / Description | `text-sm font-semibold var(--text-main)` |
| Duration stepper | See §9.3 |
| Planned reference | `text-xs var(--text-muted)` · "Planned: X.XX H" |
| Deviation indicator | `text-xs font-medium` · `▲` in `#F57C00` (over) or `▼` in `#1976D2` (under) · only shown when actual ≠ planned |
| Planned = 0 warning | `text-xs` `⚠` icon in `#F57C00` · "Planned was 0H — confirm actual time" |
| Status chip | See §9.1 |
| Rejection reason banner | `rounded p-2 mb-2` bg `#FFEBEE` · `text-xs var(--color-danger)` · `✕` icon |
| Remarks field | `text-sm var(--text-secondary)` expandable textarea · `border-[var(--border)]` · placeholder `var(--text-muted)` |
| Resubmit button | `btn-primary` full-width · only visible on rejected cards |

### 5.5 Sticky Footer

```
┌────────────────────────────────────────────────────────┐
│  Total: 8.50 H                    ← text-sm font-semibold
│                                                        │
│  [             Submit All              ]               │
│                                     ← btn-primary full-width min-h-[44px]
└────────────────────────────────────────────────────────┘
```

- Background: `var(--bg-card)`; top border: `1px solid var(--border)`
- Total recalculates live as durations are edited
- Submit All button: disabled (opacity-50) if any duration is 0 and there is no submitted/approved entry
- Footer respects `env(safe-area-inset-bottom)` on iOS

### 5.6 Submission Confirmation Dialog

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              Submit Timesheet?                           │
│           text-lg font-semibold centered                 │
│                                                          │
│  5 entries · 8.50 hours total                            │
│  text-sm var(--text-secondary) centered                  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 0010  Preparation    1.00 H  ✓                    │  │
│  │ 0020  Traveling      4.00 H  ✓ ⚠ planned: 0.00H  │  │
│  │ 0030  Inspection     1.50 H  ▲ +0.50H             │  │
│  │ 0040  Field Guide    1.00 H  ✓                    │  │
│  │ 0050  Reporting      1.00 H  ✓                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│              [ Cancel ]    [ Submit ]                    │
│                             btn-primary                  │
└──────────────────────────────────────────────────────────┘
```

- Modal: full-screen bottom sheet on mobile (slides up 80% of screen height)
- Mini summary table: `text-xs` · each row shows operation, actual hours, and deviation if any
- Cancel: `btn-secondary` full-width · Submit: `btn-primary` full-width

### 5.7 Submission Success State

After successful submission, the Timesheet tab transforms:

```
┌──────────────────────────────┐
│                              │
│   [✓ circle icon — gold]     │
│                              │
│   Timesheet Submitted        │
│   text-lg font-semibold      │
│                              │
│   Awaiting supervisor        │
│   approval                   │
│   text-sm text-muted         │
│                              │
│   Submitted 18/05/2026       │
│   11:53  · 5 entries         │
│   text-xs text-muted         │
│                              │
│  [    View Entries    ]       │
│  btn-secondary               │
└──────────────────────────────┘
```

- Checkmark icon: 48px circle, gold background, white check
- Animation: scale from 0 to 1, `duration-300 ease-out`

---

## 6. Service Console — Time Sheet Entries Related List

### 6.1 Layout

Rendered as a Related List card on the Work Order detail page.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Time Sheet Entries                                                                                  [ New ] │
│ 5 items • Sorted by Status • Updated 11 minutes ago                                                        │
├───┬───────────┬──────────────────┬─────────────────────┬──────────┬───────────┬──────────────┬────────────┤
│ # │ Name      │ Subject          │ Start Time          │ Duration │ Status    │ TSH Approved │ Sent to SAP│
├───┼───────────┼──────────────────┼─────────────────────┼──────────┼───────────┼──────────────┼────────────┤
│ 1 │ TSE-0001  │ Preparation      │ 18/05/2026, 11:51   │ 1.00     │ Approved  │ 23/05, 11:36 │ ☑          │
│ 2 │ TSE-0002  │ Traveling        │ 18/05/2026, 11:51   │ 4.00     │ Approved  │ 23/05, 11:36 │ ☑          │
│ 3 │ TSE-0003  │ Inspection       │ 18/05/2026, 11:51   │ 5.00     │ Approved  │ 23/05, 11:36 │ ☑          │
│ 4 │ TSE-0004  │ Field Guide      │ 18/05/2026, 11:51   │ 1.00     │ Approved  │ 23/05, 11:36 │ ☑          │
│ 5 │ TSE-0005  │ Reporting        │ 18/05/2026, 11:51   │ 1.00     │ Approved  │ 23/05, 11:36 │ ☑          │
└───┴───────────┴──────────────────┴─────────────────────┴──────────┴───────────┴──────────────┴────────────┘
```

### 6.2 Column Specifications

| Column | Width | Alignment | Notes |
|--------|-------|-----------|-------|
| # | 48px | Center | Row number; `text-xs text-muted` |
| Name (TSE link) | 120px | Left | `text-sm` hyperlink; monospace; opens TSE detail |
| Subject | 160px | Left | `text-sm`; operation description |
| Start Time | 180px | Left | `text-xs font-mono`; format `DD/MM/YYYY, HH:mm` |
| Duration | 100px | Right | `text-sm font-mono`; decimal |
| Status | 120px | Center | Status badge (see §9.1) |
| Time Sheet Approved | 160px | Left | `text-xs font-mono`; shows date/time or `—` |
| Time Sheet Submitted | 160px | Left | `text-xs font-mono`; shows date/time or `—` |
| Sent to SAP | 100px | Center | Checkbox icon: `☑` (green `#388E3C`) or `☐` (muted); read-only |
| Last Modified Date | 160px | Left | `text-xs font-mono` |

### 6.3 Status Badges

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| `Draft` | `#F5F5F5` | `#757575` | — |
| `Submitted` | `#E3F2FD` | `#1976D2` | — |
| `Approved` | `#E8F5E9` | `#388E3C` | — |
| `Rejected` | `#FFEBEE` | `#C62828` | — |

Badge spec: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium height-[24px]`

### 6.4 Row Colouring

| Condition | Row background |
|-----------|---------------|
| Default (even) | `var(--bg-card)` white |
| Default (odd) | `var(--bg-light)` `#F5F5F5` |
| Rejected TSE | `#FFF5F5` (very light red tint) |
| Hover | `var(--bg-lighter)` |

---

## 7. Service Console — Time Sheet Detail Page

### 7.1 Page Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [📋 icon]   Time Sheet                                                       │
│             TST-2606668                         (text-2xl font-bold)         │
├──────────────────────────────────────────────────────────────────────────────┤
│  Service Resource          Time Sheet Start Date    Time Sheet End Date      │
│  Mohammad Ficri Kaban      18/05/2026               18/05/2026               │
│  (link, blue)              (text-sm)                (text-sm)                │
│                                                                              │
│  Total Duration (Hours)    Status                                            │
│  0.00 (header) / 12.00     [ Approved ]                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Status badge: uses §9.1 status badge spec; size `height-[28px] text-sm`
- Total Duration: shows 0.00 on TST header until all TSEs approved (then roll-up applies)
- Duration next to header: prominently shown as roll-up total `text-xl font-bold`

### 7.2 Tab Navigation

Same pattern as Task List Code detail: `Related | Details ●`

### 7.3 Details Tab — Information Section

Two-column grid (50% / 50%).

**Left column:**

| Label | Value |
|-------|-------|
| Time Sheet Start Date | `18/05/2026` |
| Status | Status badge |
| Time Sheet Entry Count | `5` |
| Currency ISO Code | `IDR - Indonesian Rupiah` |
| Task List Code | `DE7AP20` |

**Right column:**

| Label | Value |
|-------|-------|
| Time Sheet End Date | `18/05/2026` |
| Duration | `12.00` |
| Service Resource | `Mohammad Ficri Kaban` (link) |
| Service Territory | `Padang.ST` (link) |
| Owner | `[avatar] Mohammad Ficri Kaban` |

### 7.4 Details Tab — System Information Section

Collapsible. Shows:

| Label | Value |
|-------|-------|
| Created By | `[avatar] SARIEF RAHMATTULLOH · 18/05/2026, 11:49` |
| Last Modified By | `[avatar] SARIEF RAHMATTULLOH · 23/05/2026, 11:36` |
| JA & JE | `May 2026` (link) |
| JA & JE Territory | `—` |
| WorkOrder | `01269822` (link) |
| Work Order ID | `0WOMg0000GbA8rOAF` (monospace, copyable) |

**Copyable field spec:** Shows copy icon (16px) on hover; click copies to clipboard; brief "Copied!" tooltip confirmation.

### 7.5 Approve All Banner (Console)

When all TSEs on a TST are in `Submitted` status, a banner appears above the Related tab content:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ✓  All 5 entries submitted by Mohammad Ficri Kaban     [ Approve All ]   │
│  text-sm var(--text-secondary) on var(--accent-pale) background            │
└────────────────────────────────────────────────────────────────────────────┘
```

- Background: `var(--accent-pale)` `#FFFDE7`; left border `4px solid var(--accent)`
- Approve All: `btn-primary` compact `px-4 py-2`
- Banner disappears once all TSEs are approved or any TSE is rejected

---

## 8. Service Console — Approval Queue

### 8.1 Queue Layout

Accessible via the main navigation: **Approvals** → **Timesheets**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Timesheet Approvals                                                        │
│  3 pending                                                                  │
├──────────────────┬──────────────────┬────────────┬──────────┬──────────────┤
│ Time Sheet       │ Service Resource │ Date       │ Duration │ Submitted    │
├──────────────────┼──────────────────┼────────────┼──────────┼──────────────┤
│ TST-2606668      │ Mohammad Ficri K.│ 18/05/2026 │ 12.00 H  │ 18/05, 15:53 │
│ TST-2606701      │ Budi Santoso     │ 18/05/2026 │  8.00 H  │ 18/05, 16:10 │
│ TST-2606715      │ Ari Wibowo       │ 19/05/2026 │  9.50 H ⚠│ 19/05, 08:22 │
└──────────────────┴──────────────────┴────────────┴──────────┴──────────────┘
  ⚠ = has deviation entries (actual ≠ planned)
```

### 8.2 Queue Column Specifications

| Column | Width | Notes |
|--------|-------|-------|
| Time Sheet | 140px | Link; monospace |
| Service Resource | 200px | Truncated at 1 line |
| Date | 120px | WO date |
| Duration | 100px | Right-aligned; `font-mono`; `⚠` flag if any TSE deviates |
| Submitted | 140px | `text-xs font-mono` |

### 8.3 Deviation Flag

- `⚠` icon (16px, `#F57C00`) appended to Duration if any TSE has actual ≠ planned
- Tooltip on hover: "One or more entries deviate from planned duration"

### 8.4 Quick Approve (Row-Level)

Each row has an inline **Approve** button on hover (console), enabling approval without opening the detail page.

```
│ TST-2606668  │ Mohammad Ficri K. │ 18/05/2026 │ 12.00H  │ 18/05, 15:53  [Approve ✓] │
```

- Inline button: `btn-secondary compact` → `px-3 py-1.5 text-xs`; appears on row hover
- Clicking opens a small confirmation popover: "Approve all 5 entries?" `[Cancel] [Approve]`

---

## 9. Component Anatomy & States

### 9.1 TSE Status Chip

| Status | Label | Background | Text | Left border (mobile card) |
|--------|-------|-----------|------|--------------------------|
| `Draft` | `○ Draft` | `#F5F5F5` | `#757575` | none |
| `Submitted` | `⏳ Submitted` | `#E3F2FD` | `#1976D2` | `3px solid #1976D2` |
| `Approved` | `✓ Approved` | `#E8F5E9` | `#388E3C` | `3px solid #388E3C` |
| `Rejected` | `✕ Rejected` | `#FFEBEE` | `#C62828` | `3px solid #C62828` |

Chip spec:
- `text-xs font-medium font-mono`
- `px-2 py-0.5 rounded`
- `border: 1px solid` at 30% opacity of text colour
- Min-width: `96px`

### 9.2 Duration Stepper (Mobile)

```
┌──────┐  ┌────────────┐  ┌──────┐
│  −   │  │    1.50    │  │  +   │  H
└──────┘  └────────────┘  └──────┘
  44×44px   96px wide       44×44px
```

- Decrement (`−`): `btn-secondary` circular, `44×44px`, disabled at `0.00`
- Value field: `text-sm font-mono text-center` · read-only display; tap opens numeric keyboard
- Increment (`+`): `btn-secondary` circular, `44×44px`, disabled at `24.00`
- Increment step: `0.25` hours
- Max: `24.00` hours (configurable)
- Min: `0.00` hours (submit validation blocks 0.00)
- Unit label: `text-xs var(--text-muted)` · "H" · non-interactive, right of stepper

### 9.3 Planned Duration Reference

Displayed below the stepper, always read-only:

```
Planned: 1.00 H           ▲ +0.50H
text-xs var(--text-muted)  text-xs font-medium #F57C00
```

- No deviation shown when actual = planned
- `▲` (over) in `#F57C00` warning orange
- `▼` (under) in `#1976D2` info blue
- Planned = 0 shows: `⚠ Planned: 0.00 H — confirm actual time` in warning orange

### 9.4 Sent to SAP Indicator

**On TSE list (console):**
- `☑` checkmark: `text-[#388E3C]` · `font-bold` · 16px
- `☐` empty: `var(--text-muted)` · 16px
- Both: `aria-label="Sent to SAP: Yes/No"`

**On TSE card (mobile — approved state only):**
```
✓ Sent to SAP  ·  23/05/2026, 11:36
text-xs #388E3C           text-xs var(--text-muted) font-mono
```

### 9.5 Rejection Reason Panel (Console)

Slides in below a TSE row when supervisor clicks Reject:

```
┌──────────────────────────────────────────────────────────┐
│  Rejection reason *                                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Exceeded planned — please justify             ↵  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Quick:  [Over planned]  [Wrong entry]  [Data missing]  │
│                                                          │
│  Characters remaining: 157                              │
│                                                          │
│                      [ Cancel ]   [ Confirm Rejection ] │
└──────────────────────────────────────────────────────────┘
```

- Panel: animated slide-down `duration-200 ease-out`; `var(--bg-light)` background; padding `p-4`; left border `4px solid #C62828`
- Textarea: `.input-field` class; 3 rows; max 200 chars; shows counter
- Quick reason chips: `text-xs px-2 py-1 rounded border border-[var(--border)]`; click to populate textarea
- Confirm Rejection: `btn-primary` with danger override: background `#C62828`, hover `#B71C1C`
- Cancel: `btn-secondary`

---

## 10. Interaction Patterns

### 10.1 Duration Edit (Mobile)

1. Mechanic taps `−` or `+` button → value changes by 0.25h; haptic feedback (if available)
2. Mechanic taps value field → numeric keyboard opens; value clears; mechanic types; keyboard closes on `Done`
3. On keyboard close: value rounds to nearest 0.25h; deviation indicator recalculates
4. Total in footer recalculates in real time after every change

### 10.2 Remarks Expand (Mobile)

- Remarks row is collapsed by default: shows `💬 Add remarks...` placeholder in `text-muted`
- Tapping placeholder expands a `TextArea` (3 rows, max 500 chars)
- Keyboard pushes the card up; footer stays sticky above keyboard
- Character counter appears at `< 100 chars remaining`

### 10.3 Submit All (Mobile)

1. Mechanic taps **Submit All** in footer
2. Validation runs:
   - Any TSE with duration = 0 → highlight that card in warning orange; scroll to it; show "Duration cannot be 0"
   - Total > 24h → toast: "Total exceeds 24 hours — please review"
3. If valid: confirmation bottom sheet slides up (§5.6)
4. Mechanic confirms → loading spinner on Submit button
5. On success: success state (§5.7); tab badge clears
6. On failure: toast error; mechanic remains on form

### 10.4 Approve All (Console)

1. Supervisor clicks **Approve All** on banner or TST detail
2. Confirmation modal: "Approve 5 entries for Mohammad Ficri Kaban? This will trigger SAP posting."
3. Supervisor confirms
4. Optimistic UI: all TSE rows flash → Approved badges
5. SAP posting spinner on TST status
6. On success: "Posted to SAP" badge; TST exits approval queue
7. On failure: "Posting Failed" badge; manual retry available

### 10.5 Keyboard Navigation Additions (Console)

| Key | Behaviour |
|-----|-----------|
| `Enter` on TST row | Opens TST detail |
| `A` key (when TST row focused) | Shortcut to Approve (if TST is Submitted) |
| `R` key (when TSE row focused) | Opens rejection panel |

---

## 11. Accessibility

### 11.1 Touch Targets

| Element | Touch size |
|---------|-----------|
| Duration stepper `−`/`+` | 44×44px |
| Duration value tap area | 96×44px |
| Submit All button | Full width × 44px |
| TSE card tap area | Full width × min 64px |
| Remarks expand | Full width × 44px |
| Status chip (read-only) | n/a (non-interactive) |
| Checkbox (console) | 44×44px tap zone |

### 11.2 Colour Contrast

| Pair | Ratio | Pass |
|------|-------|------|
| `#388E3C` on `#E8F5E9` (Approved badge) | 4.7:1 | ✅ AA |
| `#1976D2` on `#E3F2FD` (Submitted badge) | 4.8:1 | ✅ AA |
| `#C62828` on `#FFEBEE` (Rejected badge) | 5.1:1 | ✅ AA |
| `#757575` on `#F5F5F5` (Draft badge) | 4.6:1 | ✅ AA |
| `#1A1A1A` on `#F5C800` (button label on gold) | 9.8:1 | ✅ AAA |
| `#F57C00` on `#FFF3E0` (deviation warning) | 4.6:1 | ✅ AA |

### 11.3 Screen Reader Support

- Duration stepper: `aria-label="Duration for Inspection, currently 1.50 hours"` on value field
- Stepper buttons: `aria-label="Decrease duration"` / `aria-label="Increase duration"` with `aria-disabled` when at limit
- Deviation indicator: `aria-label="0.50 hours over planned duration"`
- Submit button: `aria-label="Submit all 5 timesheet entries, total 8.50 hours"`
- Status chips: `role="status"` + `aria-live="polite"` for transitions
- Rejection reason panel: `role="dialog"` + `aria-modal="true"` + focus trap
- Sent to SAP checkbox: `aria-label="Sent to SAP: Yes"` / `aria-label="Sent to SAP: No"`

### 11.4 Focus Management

- On rejection panel open: focus moves to the reason textarea
- On rejection panel close: focus returns to the Reject button on the TSE row
- On submission confirmation open: focus moves to Cancel button (safe default)
- On submission success: focus moves to "View Entries" button

---

## 12. Responsive Behaviour

### 12.1 Console Breakpoints

| Breakpoint | Column visibility |
|-----------|------------------|
| ≥ 1440px | All columns visible |
| 1280px–1439px | Time Sheet Submitted column hidden |
| 1024px–1279px | Last Modified Date + Time Sheet Submitted hidden |
| 768px–1023px | Only: Name, Subject, Duration, Status, Sent to SAP |
| < 768px | Card view (not table); each TSE as stacked label-value pairs |

### 12.2 Mobile App

- Designed for **360px–414px** width
- No horizontal scroll; all content wraps
- Duration stepper always full-width within card
- Bottom sheet (confirmation dialog) maximum height: 80vh with internal scroll

### 12.3 Tablet (768px–1024px) — Approval Queue

On tablet, the approval queue and TST detail panel show side by side:
- Left: queue list (40% width)
- Right: selected TST detail (60% width)
- Selecting a TST row loads its detail in the right panel without navigation

---

## 13. Error & Empty States

### 13.1 Empty State — No Timesheet Yet (Mobile)

Shown when WO has no TST (SAP sync incomplete, mechanic not yet assigned).

```
┌──────────────────────────────┐
│                              │
│  [⏱ icon — 48px — muted]    │
│                              │
│  No timesheet yet            │
│  text-sm font-medium         │
│                              │
│  Your timesheet will be      │
│  created automatically once  │
│  you're assigned to this WO. │
│  text-xs muted               │
└──────────────────────────────┘
```

### 13.2 Empty State — Approval Queue Empty

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│              [✓ icon — 48px — #388E3C]                           │
│                                                                  │
│              All caught up                                       │
│          text-lg font-semibold centered                          │
│                                                                  │
│         No timesheets pending approval.                          │
│         text-sm var(--text-muted) centered                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 13.3 SAP Posting Failed State (Console)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ✕  SAP posting failed — last attempt 23/05/2026, 11:40    [Retry Post]  │
│  text-sm #C62828 on #FFEBEE background                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

- Banner: placed above the Details tab content area on the TST detail page
- Background: `#FFEBEE`; left border: `4px solid #C62828`
- Retry Post: `btn-secondary compact` · triggers manual re-post with spinner feedback
- Banner disappears on successful re-post

### 13.4 Validation Error States (Mobile)

**Duration = 0:**
```
┌────────────────────────────────────────────────────────┐  ← border: 1px solid #F57C00
│ 0030  Inspection                                       │
│                                                        │
│ ⚠  Duration cannot be 0 before submitting             │  ← text-xs #F57C00
│                                                        │
│ Actual  [ − ] [ 0.00 ] [ + ]  H                       │  ← stepper value highlighted
└────────────────────────────────────────────────────────┘
```

**Total exceeds 24h:**
Toast notification:
```
┌──────────────────────────────────────────────────────┐
│  ⚠  Total 26.50H exceeds 24-hour daily limit         │
│     Please review your entries                       │
└──────────────────────────────────────────────────────┘
```
- Toast: slides up from bottom, 5-second auto-dismiss, `#FFF3E0` background, `#F57C00` text

### 13.5 Loading States

**Mobile — timesheet loading:**
- 5 skeleton cards, height matching a collapsed TSE card (72px)
- Shimmer animation `animate-pulse`

**Console — TSE list loading:**
- 5 skeleton rows, standard table row height (48px)
- Shimmer on all cells

**SAP posting in progress:**
- TST status badge changes to `[ ⟳ Posting to SAP... ]` with spinner
- Approve All button disabled during posting
- Duration: `200ms` spinner, then badge updates to final state

---

## 14. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 07 Jun 2026 | Design Team | Initial draft |
