# Service Appointment — Detail UI Design

> **System:** UT Service Console  
> **Record Type:** Service Appointment Detail View  
> **Parent Record:** Work Order (linked via Work Order field)  
> **Layout:** 5-Layer Structure · 2-Column Body (Form + Activity Panel)  
> **Reference:** UT Service Console screenshot — Service Appointment detail page  
> **Theme:** ⬛🟨 Black & Yellow — Primary `#F5C800` · Surface `#1A1A1A` · Base `#0D0D0D`

---

## Layout Overview

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#F5C800` | Accent, active states, CTA buttons |
| `--color-primary-dark` | `#C9A100` | Hover / pressed primary |
| `--color-primary-light` | `#FFF0A0` | Highlight, badge background |
| `--color-bg-base` | `#0D0D0D` | Page / outermost background |
| `--color-surface` | `#1A1A1A` | Card & panel surfaces |
| `--color-surface-raised` | `#242424` | Elevated card, dropdown |
| `--color-border` | `#2E2E2E` | Dividers, card outlines |
| `--color-border-accent` | `#F5C800` | Active tab underline, focused input |
| `--color-text-primary` | `#F0F0F0` | Body text on dark |
| `--color-text-secondary` | `#A0A0A0` | Muted labels, placeholders |
| `--color-text-on-primary` | `#0D0D0D` | Text on yellow backgrounds |
| `--color-danger` | `#FF4D4F` | Delete / error states |
| `--color-success` | `#52C41A` | Complete / closed status |

### Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)           │  bg: #0D0D0D · border-bottom: 2px #F5C800
├─────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + Open Tabs / Recent History) │  bg: #1A1A1A · border-bottom: #2E2E2E
├─────────────────────────────────────────────────────────────────┤
│  LAYER 3 — SA Title Bar (SA Number, Meta, Action Buttons)       │  bg: #1A1A1A · border-bottom: #2E2E2E
├─────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Sub-Tab Bar (Related · Details)                      │  bg: #141414 · active-tab: #F5C800
├──────────────────────────────────────┬──────────────────────────┤
│  LAYER 5 — COL 1 (Detail Form)       │  LAYER 5 — COL 2         │  bg: #0D0D0D
│  General Information                 │  Activity Panel          │  cards: #1A1A1A
│  Scheduled Times                     │  - Activity tab          │  border: #2E2E2E
│  Actual Times                        │  - Chatter tab           │
│  System Information                  │  Upcoming & Overdue      │
└──────────────────────────────────────┴──────────────────────────┘
```

---

## Layer 1 — Global Top Bar

**Position:** Fixed, full-width, topmost  
**Height:** ~36px  
**Background:** `#0D0D0D`  
**Border-Bottom:** `2px solid #F5C800`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | App launcher grid icon | 4×4 dot grid 18px · icon color `#F5C800` |
| Center | Global Search Bar | Placeholder: "Search…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · rounded pill ~320px · text `#F0F0F0` |
| Right | Icon cluster | Help `?`, Notifications bell (badge `#F5C800` / text `#0D0D0D`), User avatar, Settings gear — icons `#A0A0A0`, hover `#F5C800` |

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1, full-width  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | Console label | Icon square `#F5C800` + "UT Service Console" text `#F0F0F0` bold 14px |
| Left+1 | Module dropdown | "Cases ▾" · bg `#242424` · text `#F0F0F0` · hover-bg `#F5C800` · hover-text `#0D0D0D` |
| Center–Right | Open Tabs strip | Horizontal scrollable · active tab border-bottom `2px solid #F5C800` · text `#F5C800` font-weight 600 · inactive text `#A0A0A0` |
| Far Right | "More ▾" overflow | Same styling as module dropdown |

**Visible Tabs (from screenshot):**
- 01415/34 (Case) · 01174/48 · SA 2083 (active) · + More ▾
- Active tab chip: bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800`

---

## Layer 3 — Service Appointment Title Bar

**Position:** Below Layer 2  
**Height:** ~72px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

### Left Section — SA Identity

```
[🟨 Service Appointment icon — #F5C800]
Service Appointment                  ← 11px, #A0A0A0
SA 2083611                           ← 22px, #F5C800, font-weight 600

Owner: UT Integration #   Account: PUTRA PERKASA ABADI
Parent Record: 01532785   Work Type: —   Status: Past Activity Match
Arrival Window Start: —
```

| Field | Value | Style |
|-------|-------|-------|
| Record label | Service Appointment | 11px · `#A0A0A0` |
| SA Number | SA 2083611 | 22px · `#F5C800` · font-weight 600 |
| Owner | UT Integration # | 12px · `#F0F0F0` · link `#F5C800` |
| Account | PUTRA PERKASA ABADI | 12px · link `#F5C800` |
| Parent Record | 01532785 | 12px · link `#F5C800` |
| Work Type | — | 12px · `#A0A0A0` |
| Status | Past Activity Match | badge bg `#2D2600` · text `#F5C800` |
| Arrival Window Start | — | 12px · `#A0A0A0` |

### Right Section — Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| Follow | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#F5C800` | Subscribe to SA updates |
| Change Status | Outline · same hover | Open status change modal |
| New Note | Outline · same hover | Create inline note |
| New Contact | **Primary filled** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` | Create new contact linked to SA |

---

## Layer 4 — Sub-Tab Bar

**Position:** Below Layer 3  
**Height:** ~36px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Tab | State | Style |
|-----|-------|-------|
| Related | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |
| Details | **Active** | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |

---

## Layer 5 — Two-Column Body

**Layout:** CSS Grid `[1fr] [340px]`  
**Gap:** 12px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card / Section defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · shadow `0 2px 8px rgba(0,0,0,0.6)`  
> **Section header:** text `#F5C800` · font-size 13px · font-weight 600 · border-bottom `1px solid #2E2E2E` · collapse toggle icon `#F5C800`  
> **Field label:** text `#A0A0A0` · font-size 11px  
> **Field value:** text `#F0F0F0` · font-size 13px  
> **Link value:** color `#F5C800` · hover underline  
> **Checkbox checked:** accent color `#F5C800`  
> **Row hover:** bg `#242424`

---

### Column 1 — Detail Form

**Width:** Flexible `1fr`  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

---

#### 1A. General Information

> Collapsible card · header `#F5C800` · bg `#1A1A1A`  
> 2-column field layout (left / right sub-columns)

**Left Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Appointment Number | SA 2083611 | Auto-generated · read-only |
| Account | PUTRA PERKASA ABADI *(link)* | Links to Account record |
| Contact | RYANSUKI | Contact person linked to SA |
| Parent Record | 01532785 *(link)* | Links to parent Case record |
| Service Territory | Tanjung Enim PPA ST | Territory assignment |
| Subject | GD825A-2 / S3 – 13105 – GD829 R&I STEERING VALVE | Auto-populated from Work Order |
| Description | GD829 R&I STEERING VALVE | Free-text field · 13px `#F0F0F0` |
| Work Type | S-10051504 *(link)* | Linked work type record |
| Case | S-1000785 *(link)* | Parent Case link |
| Waiting Reason | — | Dropdown · reason for delay |
| Travelling Delay Reason | — | Dropdown · travel delay code |
| In Progress Delay Reason | — | Dropdown · active delay code |
| General Completion Cost | — | Currency field |
| Positions Done | ☐ | Checkbox |
| Dispatched by | — | Lookup field |
| Dispatched by | Fariindra Mika Pradesta *(link)* | Agent who dispatched |
| Arrival Appointment Open | 21/04/2026, 13:01 | DateTime field |

**Right Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Confirm Start Timestamp | 27/04/2026, 09:44 | DateTime · read-only |
| User Role | 04/05/2026, 06:42 | DateTime field |
| Parent Resource Type | Work Order | Lookup · type of parent |
| Status | Past Activity Match | Dropdown status field |
| Status Category | Completed | Auto-derived from Status |
| Unit Model | GD825A-2 | Read-only from Asset |
| Actual Inval Date | 30/04/2026, 13:35 | DateTime · actual arrival |
| Actual In Progress Date | 30/04/2026, 13:22 | DateTime · work start time |
| Actual Completion Date | 07/05/2026, 07:11 | DateTime · work finished |
| Actual From Activity Hours | 07/05/2026, 01:15 | DateTime · hours tracking |
| Accuracy SA | — | Calculated field |
| Accuracy Dispatch | ☐ | Checkbox |
| SA Imaging Accuracy | ☐ | Checkbox |
| Error Location | UT/MC_AL_RENAME *(link)* | Lookup to error location |

---

#### 1B. Scheduled Times

> Collapsible card · same card styling

| Field | Value | Notes |
|-------|-------|-------|
| Arrival Window Start | — | DateTime · planned arrival start |
| Arrival Window End | — | DateTime · planned arrival end |
| Scheduled Start | 30/04/2026, 10:27 | DateTime · planned start time |
| Scheduled End | 30/04/2026, 18:53 | DateTime · planned end time |

---

#### 1C. Actual Times

> Collapsible card · same card styling

| Field | Value | Notes |
|-------|-------|-------|
| Actual Start | — | DateTime · actual work start (overrides Scheduled Start) |
| Actual End | — | DateTime · actual work end |
| Actual Duration (Minutes) | 12.53 | Numeric · auto-calculated from Actual Start → End |
| Actual Duration (Allocation) | — | Duration from resource allocation |

---

#### 1D. System Information

> Collapsible card · bottom of form · screenshot bottom strip

| Field | Value | Notes |
|-------|-------|-------|
| Owner | UT Integration *(link)* | Record owner · lookup |
| Created By | UT Integration *(link)* | Audit field · read-only |
| Created Date | 27/04/2026, 06:45 | DateTime · read-only |
| Last Modified By | CANDRA_AL_RENAME *(link)* · 11/05/2026, 07:10 | Audit field |
| Created Date (display) | 27/04/2026, 06:45 | Display format |

---

### Column 2 — Activity Panel (Right Sidebar)

**Width:** ~340px (fixed right)  
**Background:** `#1A1A1A`  
**Border:** `1px solid #2E2E2E`  
**Border-Radius:** `6px`  
**Scroll:** Independent vertical scroll

> This panel is **always visible** and not collapsible — it serves as the live activity feed for the SA record.

---

#### 2A. Activity / Chatter Tab Bar

**Position:** Top of the right panel  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Tab | State | Style |
|-----|-------|-------|
| Activity | **Active** | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Chatter | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |

**Toolbar row (below tabs):**

| Component | Detail |
|-----------|--------|
| Email compose icon | icon `#A0A0A0` · hover `#F5C800` · opens email compose inline |
| New Task icon | icon `#A0A0A0` · hover `#F5C800` · creates task |
| Log a Call icon | icon `#A0A0A0` · hover `#F5C800` |
| New Event icon | icon `#A0A0A0` · hover `#F5C800` |
| More actions `•••` | icon `#A0A0A0` · hover `#F5C800` · dropdown |

**Filter bar (below toolbar):**

| Component | Detail |
|-----------|--------|
| Filters | dropdown · "All time" · bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` |
| Activity types | dropdown · "All activities" · same styling |
| Activity sub-type | dropdown · "All types" · same styling |
| Refresh icon | icon `#A0A0A0` · hover `#F5C800` |

**Quick links row:**
- `Talkup` · text `#F5C800` · hover underline
- `Expand All` · text `#F5C800`
- `View All` · text `#F5C800`

---

#### 2B. Upcoming & Overdue

> Sub-section within Activity tab

**Empty state:**
```
No activities to show.

Get started by sending an email, scheduling a task, and more.
```
- Empty state icon · color `#2E2E2E`
- Text · color `#A0A0A0` · 12px
- `[ Show All Activities ]` button · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100`

---

## Interaction Patterns

### Change Status Button
Opens a modal:
- Status dropdown: options per workflow (e.g. Scheduled, Dispatched, In Progress, Completed, Cancelled)
- Dropdown bg `#1A1A1A` · border `#2E2E2E` · selected bg `#2D2600` · selected text `#F5C800`
- Confirm button · bg `#F5C800` · text `#0D0D0D` · font-weight 600
- Cancel button · bg transparent · border `#2E2E2E` · text `#A0A0A0`

### New Note Button
Opens inline note editor:
- Text area · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · text `#F0F0F0`
- Save button · bg `#F5C800` · text `#0D0D0D`

### New Contact Button (Primary CTA)
Opens new contact form in a modal or side panel:
- Form bg `#1A1A1A` · fields follow standard field styling
- Save button · bg `#F5C800` · text `#0D0D0D` · font-weight 600

### Follow Button
- Off state: border `#2E2E2E` · text `#A0A0A0` · icon bell outline
- On state: border `#F5C800` · text `#F5C800` · icon bell filled

### Tab: Related vs Details
- **Details** — all structured fields (current view, default open)
- **Related** — linked records list (Work Orders, Cases, Assets, etc.)

---

## Color & Status Tokens (Service Appointment)

> All badge backgrounds use a dark tint of the accent color for dark-theme readability.

| Status | Text Color | Background | Usage |
|--------|-----------|------------|-------|
| None / Draft | `#A0A0A0` | `#2E2E2E` | SA created, not yet scheduled |
| Scheduled | `#60A5FA` | `#1D3557` | SA has a scheduled start/end |
| Dispatched | `#F5C800` | `#2D2600` | Technician dispatched |
| In Progress | `#FB923C` | `#2D1600` | Work actively underway |
| Completed | `#52C41A` | `#0D2200` | SA fully completed |
| Cancelled | `#FF4D4F` | `#2D0000` | SA cancelled |
| Past Activity Match | `#F5C800` | `#2D2600` | Matched to past activity record |
| Cannot Complete | `#FF4D4F` | `#2D0000` | Work could not be completed |
| **Active / Highlighted** | `#0D0D0D` | `#F5C800` | CTA button · active tab |

---

## Typography Scale

> **Font family:** `'Inter', 'Segoe UI', sans-serif`

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| SA Number | 22px | 600 | `#F5C800` | Layer 3 main heading |
| Record Label | 11px | 400 | `#A0A0A0` | "Service Appointment" above SA number |
| Section Title | 13px | 600 | `#F5C800` | Collapsible card headers |
| Field Label | 11px | 400 | `#A0A0A0` | Muted secondary labels |
| Field Value | 13px | 500 | `#F0F0F0` | Primary content |
| Link Value | 13px | 500 | `#F5C800` | Clickable / linked field value |
| Badge | 11px | 500 | *(per token)* | Status pills |
| Tab Active | 13px | 600 | `#F5C800` | Details / Related active tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Details / Related inactive tab |
| Body / Notes | 12px | 400 | `#F0F0F0` | Description, free-text fields |
| Timestamp | 11px | 400 | `#A0A0A0` | Dates in fields / activity feed |
| Button Primary | 13px | 600 | `#0D0D0D` | CTA buttons on `#F5C800` bg |
| Button Outline | 13px | 400 | `#A0A0A0` | Secondary / outline buttons |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Hover (row / card) | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Focused input | `#1A1A1A` | `#F5C800` | `#F0F0F0` |
| Active / Selected | `#2D2600` | `#F5C800` | `#F5C800` |
| Disabled | `#141414` | `#1A1A1A` | `#4A4A4A` |
| Danger hover | `#2D0000` | `#FF4D4F` | `#FF4D4F` |

---

## Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0D0D0D; }
::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #F5C800; }
```

---

## Component Hierarchy Summary

```
App
├── Layer 1: GlobalTopBar
│     ├── AppLauncher
│     ├── SearchBar
│     └── IconCluster (Help, Notifications, User, Settings)
│
├── Layer 2: AppBar
│     ├── ConsoleLabel ("UT Service Console")
│     ├── ModuleDropdown ("Cases ▾")
│     └── TabStrip (recent tabs + overflow)
│
├── Layer 3: SATitleBar
│     ├── SAIdentity
│     │     ├── SAIcon (#F5C800)
│     │     ├── SANumber (22px #F5C800)
│     │     ├── MetaRow (Owner · Account · Parent Record · Work Type · Status)
│     │     └── ArrivalWindowStart
│     └── ActionButtons
│           ├── Follow (outline toggle)
│           ├── ChangeStatus (outline)
│           ├── NewNote (outline)
│           └── NewContact (primary yellow CTA)
│
├── Layer 4: SubTabBar
│     └── Tabs [Related | Details]
│
└── Layer 5: BodyGrid (2 columns)
      ├── Column1: DetailForm
      │     ├── GeneralInformationSection
      │     │     ├── LeftSubColumn
      │     │     │     ├── AppointmentNumber
      │     │     │     ├── Account
      │     │     │     ├── Contact
      │     │     │     ├── ParentRecord
      │     │     │     ├── ServiceTerritory
      │     │     │     ├── Subject
      │     │     │     ├── Description
      │     │     │     ├── WorkType
      │     │     │     ├── Case
      │     │     │     ├── WaitingReason
      │     │     │     ├── TravellingDelayReason
      │     │     │     ├── InProgressDelayReason
      │     │     │     ├── GeneralCompletionCost
      │     │     │     ├── PositionsDone (checkbox)
      │     │     │     ├── DispatchedBy
      │     │     │     └── ArrivalAppointmentOpen
      │     │     └── RightSubColumn
      │     │           ├── ConfirmStartTimestamp
      │     │           ├── UserRole
      │     │           ├── ParentResourceType
      │     │           ├── Status
      │     │           ├── StatusCategory
      │     │           ├── UnitModel
      │     │           ├── ActualInvalDate
      │     │           ├── ActualInProgressDate
      │     │           ├── ActualCompletionDate
      │     │           ├── ActualFromActivityHours
      │     │           ├── AccuracySA
      │     │           ├── AccuracyDispatch (checkbox)
      │     │           ├── SAImagingAccuracy (checkbox)
      │     │           └── ErrorLocation
      │     ├── ScheduledTimesSection
      │     │     ├── ArrivalWindowStart
      │     │     ├── ArrivalWindowEnd
      │     │     ├── ScheduledStart
      │     │     └── ScheduledEnd
      │     ├── ActualTimesSection
      │     │     ├── ActualStart
      │     │     ├── ActualEnd
      │     │     ├── ActualDurationMinutes
      │     │     └── ActualDurationAllocation
      │     └── SystemInformationSection
      │           ├── Owner
      │           ├── CreatedBy
      │           ├── CreatedDate
      │           └── LastModifiedBy
      │
      └── Column2: ActivityPanel
            ├── TabBar [Activity | Chatter]
            ├── ActivityToolbar (Email, Task, Call, Event, More)
            ├── FilterBar (Filters, Activity types, All types, Refresh)
            ├── QuickLinks (Talkup · Expand All · View All)
            └── UpcomingOverdueSection
                  └── EmptyState → ShowAllActivitiesButton
```

---

## Document Version

**Version 1.0** — UT Service Console Service Appointment Detail View Design  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-WorkOrder.md → DESIGN-CaseManagement.md  
**Updated:** 2026-05-26
