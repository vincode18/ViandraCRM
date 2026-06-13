# DESIGN-TL-001 — Task List Module
## UI & UX Design Specification

> **Product:** UT Service Console — Work Order Mobile App
> **Version:** 1.0
> **Date:** 07 June 2026
> **Status:** Draft
> **References:** [PRD-TL-001](./PRD-TL-001_Task_List_Module.md) · [Design System v1.0](./Design_System.md)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [User Personas](#2-user-personas)
3. [Information Architecture](#3-information-architecture)
4. [UX Flows](#4-ux-flows)
5. [Service Console — WO Task List Tab](#5-service-console--wo-task-list-tab)
6. [Service Console — Task List Code Detail Page](#6-service-console--task-list-code-detail-page)
7. [Mobile App — Task List Screen](#7-mobile-app--task-list-screen)
8. [Component Anatomy & States](#8-component-anatomy--states)
9. [Interaction Patterns](#9-interaction-patterns)
10. [Accessibility](#10-accessibility)
11. [Responsive Behaviour](#11-responsive-behaviour)
12. [Error & Empty States](#12-error--empty-states)
13. [Revision History](#13-revision-history)

---

## 1. Design Principles

These four principles govern all design decisions in the Task List Module.

### 1.1 Sequence is Sacred
Operations must always be presented in Operation Number order. Visual hierarchy must make the sequence immediately legible — the mechanic should never have to think about what comes next.

### 1.2 Read Before You Act
The Task List is primarily a reference surface. Read-only states should feel calm and information-dense. Action affordances (Start, Complete) appear only when the mechanic is ready to transition state — not as the dominant visual weight.

### 1.3 Offline-First Confidence
Any operation visible on screen must be available offline. The UI must communicate connectivity status passively — never blocking the mechanic from reading their task list because of a network issue.

### 1.4 Fidelity to SAP Data
Fields sourced from SAP are read-only and visually distinguished from editable fields. No affordance for editing SAP-owned data should ever appear to non-admin users.

---

## 2. User Personas

### 2.1 Mohammad (Field Mechanic)
- **Context:** On-site, often outdoors, gloved hands, direct sunlight on screen, variable connectivity
- **Device:** Android smartphone (360px–414px viewport), operating the WO Mobile App
- **Primary goal:** Know what to do next and record when he's done it
- **Pain points:** Too many taps to reach task info; unclear operation sequence; no signal
- **Design implication:** Large touch targets (min 44px), high-contrast status chips, task list visible within 1 tap from WO home

### 2.2 Sari (Service Coordinator)
- **Context:** Office, desktop browser, managing multiple WOs simultaneously
- **Device:** 1440px widescreen, UT Service Console web app
- **Primary goal:** Verify correct task list was applied; spot-check operation scope
- **Pain points:** Switching context between WO header and task list; unclear which items came from SAP vs manual override
- **Design implication:** Task list as inline related list (no navigation away); SAP Override badge on manual items; compact table density

### 2.3 Rudi (Supervisor)
- **Context:** Office or field, reviewing WO before approving timesheets
- **Device:** Tablet (768px–1024px) or desktop
- **Primary goal:** Confirm operations match what was scoped; validate against task list code spec
- **Design implication:** Task List Code detail accessible in 1 click; crew size and skill requirements prominently shown

---

## 3. Information Architecture

```
Work Order Detail
├── Header (WO Number, Status, Task List Code link)
├── Tab: Details
├── Tab: Related
│   ├── Work Order Task List  ← PRIMARY SURFACE
│   │   ├── Task List Item 1 (0010 — Preparation)
│   │   ├── Task List Item 2 (0020 — Traveling)
│   │   ├── Task List Item 3 (0030 — Inspection)
│   │   ├── Task List Item 4 (0040 — Field Guide)
│   │   └── Task List Item 5 (0050 — Reporting)
│   └── [other related lists...]
└── Task List Code Detail (linked from header)
    ├── Tab: Related
    └── Tab: Details
        ├── Section: Description
        └── Section: System Information

Mobile App
└── Work Order Screen
    ├── Header (WO Number, Asset, Status)
    ├── Tab: Task List  ← PRIMARY MOBILE SURFACE
    │   ├── Operation Card (0010 — Preparation)
    │   ├── Operation Card (0020 — Traveling)
    │   ├── Operation Card (0030 — Inspection)
    │   ├── Operation Card (0040 — Field Guide)
    │   └── Operation Card (0050 — Reporting)
    └── Tab: Timesheet
```

---

## 4. UX Flows

### 4.1 Coordinator — View Task List on a Work Order

```
WO List
  │
  └─[click WO row]─▶ WO Detail Page
                        │
                        └─[click "Related" tab]─▶ Related Lists
                                                     │
                                                     └─[scroll to "Work Order Task List"]
                                                          │
                                                          ├─ See 5 operations sorted by Op# ✓
                                                          └─[click Task List Code link in header]
                                                               │
                                                               └─▶ Task List Code Detail Page
                                                                     └─ Read-only fields ✓
```

**Success criteria:** Coordinator reaches task list within 2 clicks from WO list.

---

### 4.2 Coordinator — Add Manual Task List Item (Override)

```
WO Task List Related List
  │
  └─[click "New" button (top-right)]
       │
       ├─ Permission check
       │   ├─ Authorised ─▶ New Task List Item modal opens
       │   │                  Fields: Operation Number, Description, Duration, UOM
       │   │                  SAP Override Flag = true (auto-set, not shown to user)
       │   │                  [Save] ─▶ Item appears with ⚠ Override badge
       │   └─ Unauthorised ─▶ Toast: "You don't have permission to add task items"
       │
       └─ Item added to list, audit log entry created
```

---

### 4.3 Mechanic (Mobile) — Execute Task List

```
WO Mobile App Home
  │
  └─[tap WO card]─▶ WO Detail
                      │
                      └─[tap "Task List" tab]─▶ Task List Screen
                                                  │
                                                  ├─ Operations listed 0010 → 0050
                                                  │
                                                  └─[tap Operation 0010 card]
                                                       │
                                                       ├─ Card expands: description + field guide
                                                       └─[tap "Start"]
                                                            │
                                                            ├─ Status chip: "In Progress"
                                                            ├─ Start time recorded
                                                            └─[tap "Complete"]
                                                                 │
                                                                 ├─ Status chip: "Completed" (green)
                                                                 ├─ Actual duration calculated
                                                                 └─ TSE on Timesheet auto-updated
```

---

### 4.4 Offline Flow

```
Mechanic opens WO (offline)
  │
  └─ Yellow banner: "You're offline — showing cached data"
       │
       ├─ Task list fully readable from cache ✓
       ├─[tap "Start"] ─▶ Status saved to local cache
       ├─[tap "Complete"] ─▶ Duration saved to local cache
       │
       └─ Device reconnects
            │
            └─ Background sync: push cached status changes to server
                 │
                 ├─ Success ─▶ Banner disappears silently
                 └─ Conflict ─▶ Toast: "Sync conflict on Operation 0030 — server version kept"
```

---

## 5. Service Console — WO Task List Tab

### 5.1 Layout

The Task List is rendered as a **Related List card** within the Work Order's Related tab. It sits below the WO header and above other related lists.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Work Order Task Lists                                           [ New  ] [⚙] │
│ 5 items • Sorted by Operation Number • Updated 7 minutes ago                │
├──┬───┬────────────────────────────┬──────────────────┬───────────────────────┤
│  │ # │ Task List Item Name        │ Operation Number │ Operation Description │
├──┼───┼────────────────────────────┼──────────────────┼───────────────────────┤
│□ │ 1 │ a1OMg000000IQzbC           │ 0010             │ Preparation           │
│□ │ 2 │ a1OMg000000IQzbD           │ 0020             │ Traveling             │
│□ │ 3 │ a1OMg000000IQzbE           │ 0030             │ Inspection            │
│□ │ 4 │ a1OMg000000IQzbF           │ 0040             │ Field Guide           │
│□ │ 5 │ a1OMg000000IQzbG ⚠Override │ 0050             │ Reporting             │
└──┴───┴────────────────────────────┴──────────────────┴───────────────────────┘

(continued columns)
├──────────┬──────────────┤
│ Duration │ Duration UOM │
├──────────┼──────────────┤
│ 1        │ H            │
│ 0        │ H            │
│ 1        │ H            │
│ 1        │ H            │
│ 1        │ H            │
└──────────┴──────────────┘
```

### 5.2 Column Specifications

| Column | Width | Alignment | Notes |
|--------|-------|-----------|-------|
| Checkbox | 40px | Center | Multi-select; select-all in header |
| # (Row number) | 48px | Center | Non-interactive; `text-xs text-muted` |
| Task List Item Name | Flexible (min 200px) | Left | Hyperlink → item detail; monospace font; shows ⚠ Override badge if `SAP Override Flag = true` |
| Operation Number | 160px | Left | Monospace; `text-sm`; sortable |
| Operation Description | Flexible (min 180px) | Left | `text-sm`; truncate at 1 line with tooltip on hover |
| Duration | 100px | Right | Decimal; `text-sm`; `0` values shown in `text-muted` |
| Duration UOM | 120px | Left | `text-xs`; `H` displayed as label |

### 5.3 Header Bar

```
┌─────────────────────────────────────────────────────────┐
│ Work Order Task Lists          [ New ] [Settings icon ⚙]│
│ text-xs text-muted: "5 items • Sorted by Operation      │
│ Number • Updated 7 minutes ago"                         │
└─────────────────────────────────────────────────────────┘
```

- Title: `text-sm font-semibold` in `var(--text-main)`
- Meta line: `text-xs` in `var(--text-muted)`
- **New** button: `btn-secondary` style, only visible to users with `Modify` permission
- Settings icon: `icon-only` button, opens column chooser

### 5.4 Sorting

- Clicking any column header toggles ascending / descending
- Active sort column shows `↑` or `↓` icon in `var(--accent)` gold
- Default: Operation Number ascending

### 5.5 Override Badge

Items added outside SAP sync display an inline badge next to the item name:

```
a1OMg000000IQzbG  ⚠ Override
```

- Badge: `text-[10px] font-medium uppercase` in `#F57C00` (warning colour) on `#FFF3E0` background
- Tooltip on hover: `"This item was added manually and is not synced from SAP"`

### 5.6 Row Hover State

- Background transitions to `var(--bg-light)` on hover
- Cursor changes to `pointer` on Task List Item Name cell only
- Other cells: `default` cursor

---

## 6. Service Console — Task List Code Detail Page

### 6.1 Page Header

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [📋 icon]  Task List code                                                   │
│            DE7AP20                                       (text-2xl font-bold)│
├─────────────────────────────────────────────────────────────────────────────┤
│ Estimated Duration    Duration Type                                          │
│ 4.00                  Hours                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- Record icon: 36×36px, rounded, `var(--accent)` gold background with white icon
- Title label: `text-xs text-muted uppercase tracking-wider`
- Title value: `text-2xl font-bold var(--text-main)`
- Sub-fields: `text-sm text-muted` label + `text-sm font-medium var(--text-secondary)` value
- Sub-fields separated by `24px` horizontal gap
- Header background: `var(--bg-panel)`; bottom border: `1px solid var(--border)`

### 6.2 Tab Navigation

```
[ Related ]  [ Details ● ]
```

- Active tab: bottom border `2px solid var(--accent)`, `font-semibold`
- Inactive tab: `var(--text-tertiary)`, no underline
- Tab bar: `border-bottom: 1px solid var(--border)`

### 6.3 Details Tab — Description Section

Two-column grid (50% / 50%), separated by a vertical `1px solid var(--border)` divider.

**Left column:**

| Label | Value display |
|-------|---------------|
| Task List code Name | `text-sm font-medium` |
| Duration Type | `text-sm` |
| Estimated Duration | `text-sm` |
| Units of Measure | `text-sm` |
| Description | `text-sm` (multi-line, no truncation) |

**Right column:**

| Label | Value display |
|-------|---------------|
| Required Skill | Link if populated; `text-muted` dash if empty |
| Recommended Crew Size | `text-sm` |
| Minimum Crew Size | `text-sm` |
| Operating Hours | `text-sm`; `text-muted` if empty |
| Auto-Create Service Appointment | Checkbox icon (read-only: ☑ / ☐) |
| Service Report Template | Link if populated; `text-muted` dash if empty |

**Field row anatomy:**

```
Label (text-xs text-muted, 40% width)    Value (text-sm, 60% width)    [✏ edit icon - hidden for read-only]
─────────────────────────────────────────────────────────────────────────────────
```

- Row height: 36px minimum
- Alternating row background: odd rows `var(--bg-card)`, even rows `var(--bg-light)` (subtle)
- Edit pencil icon (`16px`) appears on hover for editable fields; hidden for SAP-owned read-only fields

### 6.4 Details Tab — System Information Section

Collapsible section with `ChevronDown` icon.

```
▼ System Information
─────────────────────────────────────────────────────────────────────────────
Created By          [avatar] UT.Integration · 21/02/2020, 17:21
Last Modified By    [avatar] UT.Integration · 13/02/2025, 02:30
Owner               [avatar] UT.Integration                         [👤 icon]
SF Worktype ID      DE7AP20                                         [✏ icon]
```

- Section header: `text-xs font-bold uppercase tracking-wider text-muted`
- Avatar: 20×20px circle
- User links: `text-sm` in `var(--color-info)` blue, underline on hover
- Timestamps: `text-xs text-muted` monospace

---

## 7. Mobile App — Task List Screen

### 7.1 Screen Structure

```
┌──────────────────────────────┐
│ ← WO 01269822         [⋮]   │  ← Navigation bar (56px)
│ Pump Station A — Annual Maint│
├──────────────────────────────┤
│ [Task List] [Timesheet] [Doc]│  ← Tab bar (48px)
├──────────────────────────────┤
│ DE7AP20  •  5 operations     │  ← Context strip (36px, bg-light)
│ Est. total: 4.00 H           │
├──────────────────────────────┤
│ ┌────────────────────────┐   │
│ │ [0010] Preparation     │   │  ← Operation cards
│ │ 1.00 H  ● Not Started  │   │
│ │            [  Start  ] │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ [0020] Traveling       │   │
│ │ 0.00 H  ● Not Started  │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ [0030] Inspection  ▼   │   │  ← Expanded card
│ │ 1.00 H  ◑ In Progress  │   │
│ │ ─────────────────────  │   │
│ │ Desc: Check all valves │   │
│ │ and record readings.   │   │
│ │ 📎 Field Guide.pdf     │   │
│ │         [  Complete  ] │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ [0040] Field Guide     │   │
│ │ 1.00 H  ● Not Started  │   │
│ └────────────────────────┘   │
│ ┌────────────────────────┐   │
│ │ [0050] Reporting       │   │
│ │ 1.00 H  ● Not Started  │   │
│ └────────────────────────┘   │
└──────────────────────────────┘
```

### 7.2 Navigation Bar

- Height: 56px; background: `var(--bg-panel)`; bottom border: `1px solid var(--border)`
- Back arrow: `24px` icon, `min-tap: 44px`
- Title: `text-sm font-semibold var(--text-main)` (WO number)
- Subtitle: `text-xs var(--text-tertiary)` (asset description, truncated at 1 line)
- More menu (⋮): icon-only button, right-aligned

### 7.3 Tab Bar

- Height: 48px; background: `var(--bg-panel)`; bottom border: `1px solid var(--border)`
- Active tab: `text-sm font-semibold var(--text-main)`; bottom indicator `2px var(--accent)` gold
- Inactive tab: `text-sm var(--text-tertiary)`
- Badge on Timesheet tab: shows count of pending TSEs (orange dot when > 0)

### 7.4 Context Strip

- Height: 36px; background: `var(--bg-light)`; padding: `px-4`
- Left: Task List Code pill `[DE7AP20]` — `text-xs font-medium` monospace, `var(--accent)` gold background `var(--accent-pale)`, `var(--text-main)` text; followed by `text-xs var(--text-tertiary)` "• 5 operations"
- Right: `text-xs var(--text-muted)` "Est. total: 4.00 H"

### 7.5 Operation Card

**Collapsed state (default):**

```
┌────────────────────────────────────────────────────────┐
│  [0030]  Inspection                          ▼ expand  │
│          1.00 H          ◑ In Progress                 │
└────────────────────────────────────────────────────────┘
```

**Expanded state:**

```
┌────────────────────────────────────────────────────────┐
│  [0030]  Inspection                          ▲ collapse │
│          1.00 H          ◑ In Progress                 │
│  ──────────────────────────────────────────────────    │
│  Check all valves and record pressure readings         │
│  before and after cleaning.                            │
│  📎 Field_Guide_DE7AP20.pdf                            │
│                                                        │
│                              [        Complete       ] │
└────────────────────────────────────────────────────────┘
```

**Card anatomy:**

| Element | Spec |
|---------|------|
| Card container | `rounded-lg border border-[var(--border)] bg-[var(--bg-card)] mx-4 mb-3` shadow `0 1px 3px rgba(0,0,0,0.08)` |
| Operation Number pill | `text-xs font-medium font-mono` · background `var(--accent-pale)` · text `var(--text-main)` · `px-2 py-0.5 rounded` |
| Operation Description | `text-sm font-semibold var(--text-main)` · max 1 line collapsed, full height expanded |
| Duration | `text-xs var(--text-tertiary)` · `font-mono` |
| Status chip | See §8.2 below |
| Expand/collapse icon | `ChevronDown` / `ChevronUp` · `16px` · `var(--text-muted)` · min tap `44px` |
| Divider | `1px solid var(--border)` · `my-3` |
| Description text | `text-sm var(--text-secondary)` · line-height 20px |
| Attachment link | `📎` icon + `text-sm var(--color-info)` underline on tap |
| Action button | `btn-primary` full-width · `min-h-[44px]` · only shown when relevant to status |

### 7.6 Progress Summary Bar

Sticky below context strip when scrolling. Shows overall completion.

```
┌──────────────────────────────────────────────────────┐
│  ████████░░░░░░░░░░░░░░  2 / 5 completed             │
└──────────────────────────────────────────────────────┘
```

- Height: 32px; background: `var(--bg-light)`
- Progress bar: `h-1.5 rounded-full`; filled: `var(--accent)` gold; unfilled: `var(--bg-lighter)`
- Text: `text-xs var(--text-muted)` right-aligned

### 7.7 Offline Banner

Appears at the very top of the screen (below navigation bar) when device has no connectivity.

```
┌──────────────────────────────────────────────────────┐
│  ⚡  You're offline — showing cached data             │
└──────────────────────────────────────────────────────┘
```

- Height: 36px; background: `#FFF3E0`; text: `text-xs font-medium` in `#F57C00`
- Icon: `WifiOff` (16px)
- Slides down with `slideIn` animation (250ms ease-out) on connectivity loss
- Slides up and disappears on reconnect (300ms ease-out)

---

## 8. Component Anatomy & States

### 8.1 Operation Status Chips

| Status | Label | Background | Text colour | Icon |
|--------|-------|-----------|-------------|------|
| Not Started | Not Started | `#F5F5F5` | `#757575` | `●` circle outline |
| In Progress | In Progress | `rgba(245,200,0,0.12)` | `#8B7500` | `◑` half-filled |
| Completed | Completed | `#E8F5E9` | `#388E3C` | `✓` checkmark |

**Chip spec:**
- `text-xs font-medium font-mono`
- `px-2 py-0.5 rounded`
- `border: 1px solid` matching the text colour at 30% opacity
- Min-width: `96px` (prevents layout shift between states)

### 8.2 Task List Item States (Console Table)

| State | Visual treatment |
|-------|-----------------|
| Normal | Default row colours (alternating white / `#F5F5F5`) |
| Hover | `var(--bg-light)` fill; name cell cursor `pointer` |
| Selected | `var(--accent-pale)` fill; left border `3px solid var(--accent)` |
| Override | Name cell appended with ⚠ Override badge in `#FFF3E0` / `#F57C00` |
| Sync pending | Row has spinner icon in row number cell; `text-muted` on all cells |
| Soft-deleted | Strikethrough text; `text-muted`; not shown by default (visible in audit view only) |

### 8.3 Operation Card States (Mobile)

| State | Visual treatment |
|-------|-----------------|
| Not Started | Standard card; `Start` button visible (gold) |
| In Progress | Left border `3px solid var(--accent)` gold; `Complete` button visible |
| Completed | Left border `3px solid #388E3C`; no action button; status chip green |
| Expanded | Extra padding-bottom `pb-4`; `ChevronUp` icon; description + attachment visible |
| Sync pending | Subtle pulse animation on card; no action buttons until sync resolves |

### 8.4 Start Button

```
btn-primary
background: var(--accent)        ← #F5C800 gold
color: var(--text-main)          ← #1A1A1A dark text
border-radius: 4px
padding: px-4 py-2.5
min-height: 44px
font: text-sm font-medium
width: 100% (mobile) / auto (console)
```

States:
- **Default:** `var(--accent)` background
- **Hover:** `var(--accent-light)` (#FFC800)
- **Active/pressed:** `var(--accent-dark)` (#E0B200)
- **Disabled:** Same + `opacity-50 cursor-not-allowed`
- **Loading:** Replace label with 16px spinner; maintain full width

### 8.5 Complete Button

Same as Start button. Colour remains gold (not green) — colour semantics are communicated via the status chip, not the button.

---

## 9. Interaction Patterns

### 9.1 Card Expand / Collapse (Mobile)

- **Trigger:** Tap anywhere on the card (except the action button)
- **Animation:** Height expands with `max-height` transition, `duration-200 ease-out`
- **Collapse:** Same animation in reverse
- **Only one card expanded at a time** (accordion behaviour); tapping a new card collapses the previous

### 9.2 Start / Complete (Mobile)

1. Mechanic taps **Start**
2. Immediate optimistic UI update: button label → "Starting…", spinner replaces icon
3. Status chip transitions to "In Progress" (100ms delay for visual confirmation)
4. API call fires in background
5. On success: persisted; button swaps to **Complete**
6. On failure: revert to "Not Started" state; toast error: "Failed to start — tap to retry"

### 9.3 Sort (Console)

- Click column header → sort ascending; click again → sort descending
- Third click → remove sort (return to default: Operation Number ASC)
- Sorted column header: gold `▲`/`▼` arrow icon (16px)
- Transition: fade rows out (100ms), reorder, fade back in (100ms)

### 9.4 New Item Modal (Console)

Opens as a centred modal overlay (not a full-page navigation).

```
┌──────────────────────────────────────────────────────────────┐
│  New Task List Item                                    [✕]   │
├──────────────────────────────────────────────────────────────┤
│  Operation Number *   [____]  e.g. 0060                      │
│  Operation Description *  [________________________________] │
│  Duration *           [____]  Hours                          │
│  Duration UOM         [  H ▾]                                │
│                                                              │
│  ⚠ This item will be flagged as a manual override            │
│    and is not synced back to SAP.                            │
│                                                              │
│                              [ Cancel ]  [ Save Override ]  │
└──────────────────────────────────────────────────────────────┘
```

- Modal width: 480px; backdrop: `rgba(0,0,0,0.4)`
- Warning notice: `text-xs` in `#F57C00` on `#FFF3E0` background; `rounded p-3`
- Save button: `btn-primary`; Cancel: `btn-secondary`
- On save: modal closes, item added to list with Override badge, success toast

### 9.5 Tooltips

Appear on hover (desktop) with `delay: 400ms` to avoid flickering.

- Override badge → "This item was added manually and is not synced from SAP"
- Operation Number → "SAP operation step sequence number"
- Duration UOM "H" → "Hours"
- Truncated descriptions → full text

Tooltip spec: `text-xs` white text, `var(--text-main)` dark background, `rounded px-2 py-1`, max-width 240px.

---

## 10. Accessibility

### 10.1 Touch Targets

All interactive elements meet **WCAG 2.2 Level AA Target Size (44×44px)**:

| Element | Actual size | Notes |
|---------|-------------|-------|
| Start / Complete button | Full width × 44px height | — |
| Card tap area | Full card width × min 64px height | — |
| Expand/collapse icon | 44×44px tap area (visual: 16px icon) | Padding added |
| Checkbox (console) | 20×20px visual; 44×44px tap | — |
| Column sort header | Full column width × 44px height | — |
| Override badge info | 44×44px tap → tooltip/popover | — |

### 10.2 Colour Contrast

All text/background pairs meet **WCAG AA (4.5:1 for normal text, 3:1 for large text)**:

| Pair | Ratio | Pass |
|------|-------|------|
| `#1A1A1A` on `#F5C800` (button label on gold) | 9.8:1 | ✅ AAA |
| `#757575` on `#FFFFFF` (muted text on white) | 4.6:1 | ✅ AA |
| `#388E3C` on `#E8F5E9` (completed badge) | 4.7:1 | ✅ AA |
| `#8B7500` on `#FFFDE7` (in-progress badge) | 5.2:1 | ✅ AA |
| `#F57C00` on `#FFF3E0` (override / warning) | 4.6:1 | ✅ AA |

### 10.3 Keyboard Navigation (Console)

| Key | Behaviour |
|-----|-----------|
| `Tab` | Move through interactive elements in reading order |
| `Enter` / `Space` | Activate button or link; toggle checkbox |
| `↑` / `↓` | Navigate table rows when table is focused |
| `Esc` | Close modal or tooltip |
| `Shift+Tab` | Reverse tab order |

### 10.4 Screen Reader Support

- Operation Number pills: `aria-label="Operation 0010"` (reads as "Operation zero zero ten")
- Status chips: `role="status"` + `aria-live="polite"` so state changes are announced
- Start/Complete buttons: `aria-label="Start operation 0010 Preparation"`
- Offline banner: `role="alert"` + `aria-live="assertive"`
- Expand/collapse: `aria-expanded="true|false"` on card trigger; `aria-controls` linking to content panel
- Table: proper `<thead>` / `<tbody>` with `scope="col"` on header cells

### 10.5 Focus Styles

```css
:focus-visible {
  outline: 2px solid var(--accent);   /* gold ring */
  outline-offset: 2px;
  border-radius: 4px;
}
```

Focus rings always visible (not suppressed on mouse click via `:focus-visible`).

---

## 11. Responsive Behaviour

### 11.1 Console Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| ≥ 1280px | Full table; all columns visible |
| 1024px–1279px | Duration UOM column hidden; Operation Description truncated at 40 chars |
| 768px–1023px | Duration UOM and Duration columns collapse into single "Duration" cell (`1.00 H`); row number column hidden |
| < 768px | Not a supported console viewport; degraded card view shown with warning |

### 11.2 Mobile App

The mobile app is designed exclusively for **360px–414px** viewport widths (Android standard).

- All cards span full width with `mx-4` horizontal margin
- No horizontal scrolling
- Operation Description wraps; card height is dynamic

### 11.3 Safe Areas

On iOS and notched Android devices:
- Navigation bar respects `env(safe-area-inset-top)`
- Bottom action buttons respect `env(safe-area-inset-bottom)` (`pb-[env(safe-area-inset-bottom)]`)

---

## 12. Error & Empty States

### 12.1 Empty State — No Task List Items (Console)

Shown when a WO has no task list items yet (SAP sync pending or no Task List Code assigned).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Work Order Task Lists                                           [ New  ] [⚙] │
│ 0 items                                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    [📋 icon — 48px — var(--text-muted)]                     │
│                                                                              │
│              No task list items yet                                          │
│          text-sm var(--text-muted) centered                                  │
│                                                                              │
│     Task list operations will appear here once SAP syncs this Work Order.   │
│                  text-xs var(--text-muted) centered max-w-xs                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Empty State — No Task List Items (Mobile)

```
┌──────────────────────────────┐
│   [📋 icon 48px muted]       │
│                              │
│   No operations yet          │
│   text-sm font-medium        │
│                              │
│   Your task list will appear │
│   once the WO is synced.     │
│   text-xs muted centered     │
└──────────────────────────────┘
```

### 12.3 Sync Error State (Console)

Shown when the last integration sync for this WO failed.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠ Task list sync failed — last attempt 14:32 today          [ Retry Sync ] │
│ text-xs in #C62828 on #FFEBEE background                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

- Banner placed above the table, below the header bar
- Retry Sync button: `btn-secondary` compact (`text-xs px-3 py-1.5`)

### 12.4 Start / Complete Error (Mobile)

If the API call to update status fails:

```
┌──────────────────────────────────────────────────────┐
│  ✕  Failed to update — tap to retry                  │
└──────────────────────────────────────────────────────┘
```

- Toast notification: slides up from bottom, auto-dismisses after 5 seconds
- Background: `#FFEBEE`; icon + text: `#C62828`
- Tap anywhere on toast to retry the action

### 12.5 Loading State

**Console table loading:**
- Skeleton rows: 5 rows of grey shimmer placeholders (`animate-pulse`)
- Columns maintain correct widths during load

**Mobile card loading:**
- 3 skeleton cards with shimmer animation
- Card height matches collapsed card height (64px)

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 07 Jun 2026 | Design Team | Initial draft |
