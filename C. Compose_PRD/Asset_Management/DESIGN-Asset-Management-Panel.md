# OPERATIONS Platform — Design Specification
## Asset Management Module — Panel Layout & Detail View
### UI Design Guide · Light & Dark Mode · v1.0.0

> **Platform:** OPERATIONS CRM v4.2.0-stable
> **Fonts:** Hanken Grotesk (body/headings) · JetBrains Mono (labels/codes)
> **Icons:** Material Symbols Outlined
> **Theme Engine:** Tailwind CSS (`darkMode: "class"` — toggle via `<html class="dark">`)
> **Related FRDs:** FRD-Asset-Management.md · DESIGN-SA-FieldService-Module.md

---

## Table of Contents

1. [Design Token Reference](#1-design-token-reference)
2. [Page Layout Architecture](#2-page-layout-architecture)
3. [Left Sidebar — Account / Unit Selector](#3-left-sidebar--account--unit-selector)
4. [Main Panel (80%) — Asset Detail View](#4-main-panel-80--asset-detail-view)
5. [Right Panel (20%) — Related Links & Context](#5-right-panel-20--related-links--context)
6. [Component Specifications](#6-component-specifications)
7. [Interaction Patterns](#7-interaction-patterns)
8. [Light Mode Wireframe](#8-light-mode-wireframe)
9. [Dark Mode Wireframe](#9-dark-mode-wireframe)
10. [Animation & Transition Specs](#10-animation--transition-specs)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Acceptance Criteria](#12-acceptance-criteria)

---

## 1. Design Token Reference

### 1.1 Color Tokens

All color values are defined as Tailwind CSS custom properties. No hardcoded hex values in component code — always reference tokens.

| Token Name | Tailwind Class | Light Mode | Dark Mode | Usage |
|---|---|---|---|---|
| `--color-bg-page` | `bg-page` | `#f8f9fa` | `#1a1c1c` | Page root background |
| `--color-bg-surface` | `bg-surface` | `#ffffff` | `#242626` | Card / panel surface |
| `--color-bg-surface-2` | `bg-surface-2` | `#f1f3f4` | `#2e3030` | Nested / inset surface |
| `--color-bg-surface-hover` | `bg-surface-hover` | `#e8eaed` | `#363838` | Hover state on surfaces |
| `--color-bg-sidebar` | `bg-sidebar` | `#f1f3f4` | `#202222` | Left nav / sidebar |
| `--color-bg-sidebar-active` | `bg-sidebar-active` | `#e4e9f0` | `#2a3040` | Active nav item background |
| `--color-border` | `border-default` | `#e0e0e0` | `#3a3c3c` | Default border |
| `--color-border-strong` | `border-strong` | `#bdc1c6` | `#4a4c4c` | Emphasized border |
| `--color-text-primary` | `text-primary` | `#1a1c1c` | `#f0f0f0` | Headings, primary body |
| `--color-text-secondary` | `text-secondary` | `#5f6368` | `#9aa0a6` | Labels, metadata |
| `--color-text-tertiary` | `text-tertiary` | `#9aa0a6` | `#6c7074` | Placeholder, disabled |
| `--color-accent` | `text-accent` | `#f5c800` | `#f5c800` | Brand accent, active indicator |
| `--color-accent-muted` | `bg-accent-muted` | `#fffbeb` | `#2a2700` | Accent chip background |
| `--color-link` | `text-link` | `#1a73e8` | `#8ab4f8` | Hyperlinks, action text |

### 1.2 Status Badge Tokens

| Status | Light bg | Light text | Dark bg | Dark text |
|---|---|---|---|---|
| Purchased | `#e8f0fe` | `#1967d2` | `#1a2a4a` | `#8ab4f8` |
| Shipped | `#fef3e2` | `#b06000` | `#3a2200` | `#ffa040` |
| Installed | `#e6f4ea` | `#137333` | `#0d2e1a` | `#4caf6e` |
| Registered | `#f3e8fd` | `#7b1fa2` | `#2a1040` | `#c58af9` |
| Obsolete | `#f1f3f4` | `#5f6368` | `#2e3030` | `#9aa0a6` |
| Competitor | `#fce8e6` | `#c5221f` | `#3c0e0c` | `#f28b82` |
| Internal | `#e6f4ea` | `#137333` | `#0d2e1a` | `#4caf6e` |

### 1.3 Typography Scale

| Role | Font | Size | Weight | Line Height | Tailwind |
|---|---|---|---|---|---|
| Page Title | Hanken Grotesk | 22px | 600 | 1.3 | `text-2xl font-semibold` |
| Section Heading | Hanken Grotesk | 14px | 600 | 1.4 | `text-sm font-semibold uppercase tracking-wide` |
| Field Label | Hanken Grotesk | 11px | 500 | 1.3 | `text-xs font-medium` |
| Field Value | Hanken Grotesk | 13px | 400 | 1.5 | `text-sm` |
| Asset ID / Code | JetBrains Mono | 12px | 400 | 1.4 | `font-mono text-xs` |
| Timeline Timestamp | JetBrains Mono | 11px | 400 | 1.3 | `font-mono text-xs` |
| Sidebar Label | Hanken Grotesk | 12px | 500 | 1.4 | `text-xs font-medium` |
| Button Text | Hanken Grotesk | 13px | 500 | 1 | `text-sm font-medium` |

### 1.4 Spacing & Radius

| Token | Value | Usage |
|---|---|---|
| Panel gap | `16px` | Gap between main panel and right panel |
| Section padding | `20px 24px` | Internal padding of each card section |
| Field row gap | `12px` | Vertical gap between field rows |
| Card border radius | `8px` | All surface cards |
| Badge border radius | `4px` | Status badges |
| Chip border radius | `16px` | Filter chips |
| Avatar size | `32px` | User / account avatars |

---

## 2. Page Layout Architecture

### 2.1 Overall Structure

The Asset Management detail view uses a **three-zone layout**:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  TOP NAV BAR  (header — full width, 56px)                                           │
│  [Module Tabs: Cases | Work Orders | Field Service | Assets ← active | ...]         │
├──────────────┬──────────────────────────────────────────┬──────────────────────────┤
│              │                                          │                          │
│  LEFT        │   MAIN PANEL                             │   RIGHT PANEL            │
│  SIDEBAR     │   (Asset Detail — 80% of remaining)      │   (Related / Context     │
│  (240px      │                                          │    panel — 20% of        │
│   fixed)     │                                          │    remaining)            │
│              │                                          │                          │
│  Account /   │  ┌──────────────────────────────────┐   │  ┌──────────────────┐   │
│  Unit        │  │  Asset Header Bar                │   │  │  Account Info    │   │
│  Selector    │  ├──────────────────────────────────┤   │  ├──────────────────┤   │
│              │  │  Section: Asset Information      │   │  │  Service History │   │
│  [Unit list  │  ├──────────────────────────────────┤   │  ├──────────────────┤   │
│   grouped    │  │  Section: Product Details        │   │  │  Past Cases      │   │
│   by         │  ├──────────────────────────────────┤   │  ├──────────────────┤   │
│   account]   │  │  Section: Dates & Financials     │   │  │  Work Orders     │   │
│              │  ├──────────────────────────────────┤   │  ├──────────────────┤   │
│              │  │  Section: Classification         │   │  │  History Records │   │
│              │  ├──────────────────────────────────┤   │  ├──────────────────┤   │
│              │  │  Section: Hierarchy              │   │  │  Related Assets  │   │
│              │  ├──────────────────────────────────┤   │  ├──────────────────┤   │
│              │  │  Section: Description            │   │  │  SA / WO Links   │   │
│              │  └──────────────────────────────────┘   │  └──────────────────┘   │
│              │                                          │                          │
└──────────────┴──────────────────────────────────────────┴──────────────────────────┘
```

### 2.2 Column Widths

| Zone | Width | Behavior |
|---|---|---|
| Left Sidebar | `240px` | Fixed, always visible on desktop |
| Main Panel | `calc(80% of remaining space)` | `flex: 4` — scrollable vertically |
| Right Panel | `calc(20% of remaining space)` | `flex: 1` — sticky, scrolls independently |

**Calculation example at 1440px viewport:**
- Left sidebar: `240px`
- Remaining: `1440 - 240 - 16px (gap) = 1184px`
- Main panel: `1184 × 0.80 = ~947px`
- Right panel: `1184 × 0.20 = ~237px`

### 2.3 CSS Layout

```css
.asset-detail-root {
  display: flex;
  height: calc(100vh - 56px); /* subtract top nav */
  overflow: hidden;
}

.asset-sidebar {
  width: 240px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
}

.asset-content-area {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.asset-main-panel {
  flex: 4;              /* 80% */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-right-panel {
  flex: 1;              /* 20% */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 220px;
  max-width: 280px;
}
```

---

## 3. Left Sidebar — Account / Unit Selector

### 3.1 Purpose

The left sidebar provides **contextual navigation** within the Asset Management module. It lists accounts and their associated units (assets), allowing users to quickly switch between assets without returning to the list view.

### 3.2 Sidebar Structure

```
┌─────────────────────────────────────┐
│  🔍  Search units...                │  ← search input, 32px height
├─────────────────────────────────────┤
│  FILTER                             │  ← section label
│  [All] [Active] [Obsolete]          │  ← filter chips, wrapping
├─────────────────────────────────────┤
│                                     │
│  ▼ Northern Region Fleet            │  ← Account group header (collapsible)
│    ├── 🚛 Truck 01 - NR  [Installed]│  ← Unit row
│    ├── 🚛 Truck 02 - NR  [Installed]│
│    └── 🚛 Truck 03 - NR  [Shipped] │
│                                     │
│  ▼ Central Workshop                 │
│    ├── ⚙️  Compressor Unit A  [Reg] │
│    └── ⚙️  Compressor Unit B  [Obs] │
│                                     │
│  ► Eastern Fleet Account            │  ← collapsed group (► = collapsed)
│                                     │
│  ▼ Internal Assets                  │
│    └── 🖥️  Diagnostic Tool #7       │
│                                     │
└─────────────────────────────────────┘
```

### 3.3 Sidebar Field Specs

| Element | Spec |
|---|---|
| Sidebar width | `240px` fixed |
| Search input height | `32px`, border radius `6px` |
| Search placeholder | `"Search units or accounts..."` |
| Account group label | 11px / 500 / uppercase / `text-secondary` / `tracking-wider` |
| Group collapse icon | `expand_more` / `chevron_right` (Material Symbols, 16px) |
| Unit row height | `36px` |
| Unit row padding | `8px 12px 8px 28px` (28px left = indent) |
| Unit icon | Material Symbols: `local_shipping` (vehicle) / `settings` (equipment) / `computer` (IT) / `build` (tool) — 16px |
| Unit name | 12px / 400 / `text-primary` — truncated with ellipsis |
| Status badge (inline) | 10px / 500 / pill, 4px border radius — right-aligned |
| Active unit indicator | 3px left border `color-accent (#f5c800)` + `bg-sidebar-active` |

### 3.4 Sidebar Light & Dark Mode

```
Light Mode:
  background:          #f1f3f4   (bg-sidebar)
  border-right:        #e0e0e0
  search input bg:     #ffffff
  search input border: #e0e0e0
  group label:         #5f6368
  unit row text:       #1a1c1c
  unit row hover bg:   #e8eaed
  active row bg:       #e4e9f0
  active row border:   #f5c800
  scrollbar thumb:     #bdc1c6

Dark Mode:
  background:          #202222   (bg-sidebar)
  border-right:        #3a3c3c
  search input bg:     #2e3030
  search input border: #3a3c3c
  group label:         #9aa0a6
  unit row text:       #f0f0f0
  unit row hover bg:   #363838
  active row bg:       #2a3040
  active row border:   #f5c800
  scrollbar thumb:     #4a4c4c
```

### 3.5 Interaction Behavior

- Clicking an account group header **toggles** expand/collapse with a 150ms ease transition on the chevron rotation.
- Clicking a unit row **loads that asset's detail** in the main panel. Active row persists until another row is selected.
- The search field **filters** both account names and unit names in real time (debounced 200ms).
- Filter chips (All / Active / Obsolete) are **single-select**; tapping a chip filters all groups simultaneously.
- On load, the sidebar auto-expands the group containing the **currently viewed asset** and scrolls it into view.

---

## 4. Main Panel (80%) — Asset Detail View

### 4.1 Asset Header Bar

Pinned to the top of the main panel (does not scroll away). Height: `56px`.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [← Back to Assets]    Truck 01 - NR        [Installed ▼]   [Edit] [⋮]   │
│                         AST-00142 · Northern Region Fleet                  │
└────────────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Back link | `← Back to Assets` — 12px / link color / `text-link` |
| Asset name | 22px / 600 / `text-primary` |
| Asset ID | 12px mono / `text-secondary` / `font-mono` — format: `AST-XXXXX` |
| Account context | 12px / `text-secondary` — account name, truncated |
| Status badge | Pill badge, dropdown-enabled (click to change status inline) |
| Edit button | Secondary button, 32px height |
| Action menu (`⋮`) | Icon button — opens: Clone, Delete, View Hierarchy, Export |
| Header background | `bg-surface` |
| Header border-bottom | `1px solid border-default` |
| Header padding | `0 24px` |

### 4.2 Section Cards — Shared Spec

All content sections in the main panel are rendered as **cards** with consistent structure:

```
┌─────────────────────────────────────────────────────────┐
│  SECTION TITLE                          [Edit]  [▼]     │  ← card header 40px
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Field grid content                                     │  ← card body
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Card background | `bg-surface` |
| Card border | `1px solid border-default` |
| Card border radius | `8px` |
| Card header height | `40px` |
| Card header padding | `0 16px` |
| Card header font | 11px / 600 / uppercase / `tracking-wider` / `text-secondary` |
| Card header border-bottom | `1px solid border-default` |
| Card body padding | `16px 20px` |
| Edit icon | `edit` Material Symbol, 16px, `text-secondary`, appears on card hover |
| Collapse icon | `expand_more` / `expand_less`, 16px |

### 4.3 Section: Asset Information

Field grid: **2 columns**, auto-fill.

| Field | Type | Notes |
|---|---|---|
| Asset Name | Text | Editable inline |
| Status | Badge + dropdown | Color-coded per status token table |
| Account | Link | Opens account record in modal or new tab |
| Contact | Link | Opens contact record |
| Serial Number | Mono text | `font-mono`, copyable (click-to-copy icon on hover) |
| Location | Text | With `location_on` icon prefix |
| Asset Owner | Avatar + name | 24px avatar, owner name |
| Install Date | Date | Format: `DD MMM YYYY` |

### 4.4 Section: Product Details

Field grid: **2 columns**.

| Field | Type | Notes |
|---|---|---|
| Product | Link | Links to product record |
| Product Code | Mono text | Read-only, `font-mono` |
| Product Family | Text | Read-only |
| Product SKU | Mono text | Read-only, `font-mono` |
| Product Description | Long text | Full-width, read-only, collapsible after 3 lines |

### 4.5 Section: Dates & Financials

Field grid: **3 columns**.

| Field | Type | Notes |
|---|---|---|
| Purchase Date | Date | |
| Install Date | Date | |
| Usage End Date | Date | Highlighted in amber if within 30 days of today |
| Price | Currency | Format: `$X,XXX.XX` |
| Quantity | Number | |
| — | — | Spacer in 3rd column of row 2 |

**Usage End Date warning state:**

```
Light:  background #fef3e2  · text #b06000  · border #fdd663
Dark:   background #3a2200  · text #ffa040  · border #5a3600
```

### 4.6 Section: Classification

Field grid: **2 columns**.

| Field | Type | Notes |
|---|---|---|
| Competitor Asset | Toggle + label | Label: "Yes — competitor product" in red if checked |
| Internal Asset | Toggle + label | |
| Asset Provided By | Link | Account name |
| Asset Serviced By | Link | Account name |

Competitor Asset checked state:

```
Light:  label color #c5221f  · bg chip #fce8e6
Dark:   label color #f28b82  · bg chip #3c0e0c
```

### 4.7 Section: Hierarchy

Displays a **mini tree** of the asset's position in its hierarchy, not a full tree (full tree is in View Hierarchy). Max depth shown: 3 levels.

```
  ◉ Northern Region Fleet Root  (Level 1 — Root)
    └── ◉ Truck Fleet - NR     (Level 2)
        └── ● Truck 01 - NR    (Level 3 — THIS ASSET)   ← highlighted
```

| Element | Spec |
|---|---|
| Root node icon | `account_tree` 14px |
| Current asset node | Filled circle `●` in `color-accent` |
| Other nodes | Hollow circle `◉` in `text-secondary` |
| Level indentation | `16px` per level |
| Parent Asset link | Clickable text link |
| Root Asset link | Clickable text link |
| "View Full Hierarchy" | Text link at bottom of section |

### 4.8 Section: Description

Full-width text area. Collapsible after 4 lines (shows "Show more" link). Editable inline via pencil icon.

---

## 5. Right Panel (20%) — Related Links & Context

The right panel is a **sticky contextual sidebar** that persists while the main panel scrolls. It is organized into collapsible **widget cards** stacked vertically.

### 5.1 Right Panel Header

```
┌──────────────────────────┐
│  Related                 │   ← section label, 13px / 600
│  Truck 01 - NR           │   ← current asset name, 11px / text-secondary
└──────────────────────────┘
```

### 5.2 Widget: Account Information

Shows the linked account's key details at a glance. No navigation away required.

```
┌──────────────────────────────┐
│  ACCOUNT INFO           [↗]  │  ← header + open-in-full icon
├──────────────────────────────┤
│  [Avatar]  Northern Region   │  ← 32px account avatar + name (13px/600)
│            Fleet             │
│  ────────────────────────    │
│  Industry   Transport        │
│  Phone      +1 555 000 0000  │
│  Owner      Jane Carter      │
│  Since      12 Mar 2021      │
│  SLA Tier   Gold ★           │
└──────────────────────────────┘
```

| Field | Notes |
|---|---|
| Account name | 13px / 600 / `text-primary` — click opens account detail |
| Avatar | 32px circle, initials fallback |
| Industry / Phone / Owner | 11px label / 12px value, 2-col grid |
| Since | Account creation / association date |
| SLA Tier | Pill badge — Gold `#f5c800`, Silver `#9aa0a6`, Bronze `#cd7f32` |

### 5.3 Widget: Past Cases

Shows the last 5 cases linked to this asset. Cases that are open are highlighted.

```
┌──────────────────────────────┐
│  PAST CASES  (8)        [→]  │  ← count + "View All" arrow
├──────────────────────────────┤
│  ● CS-10421  Open            │  ← dot: red = open, green = closed
│    Engine overheating        │
│    14 May 2026               │
│  ─────────────────────────   │
│  ● CS-10187  Closed          │
│    Brake inspection          │
│    02 Apr 2026               │
│  ─────────────────────────   │
│  + 6 more  →  View All       │
└──────────────────────────────┘
```

| Element | Spec |
|---|---|
| Case ID | 11px mono `font-mono` / `text-link` — clickable |
| Status dot | 8px circle: Open `#ea4335`, Closed `#34a853`, In Progress `#fbbc04` |
| Case subject | 12px / `text-primary` — truncated 1 line |
| Date | 11px / `text-secondary` |
| Row hover | `bg-surface-hover` |
| Row height | `52px` |
| View All link | 11px / `text-link` / right-aligned |

### 5.4 Widget: Work Orders

Last 5 work orders linked to this asset.

```
┌──────────────────────────────┐
│  WORK ORDERS  (3)       [→]  │
├──────────────────────────────┤
│  ▣ WO-00891  In Progress     │
│    Quarterly maintenance     │
│    Due: 10 Jun 2026          │
│  ─────────────────────────   │
│  ▣ WO-00762  Completed       │
│    Oil change & filter       │
│    28 Feb 2026               │
└──────────────────────────────┘
```

| Element | Spec |
|---|---|
| WO ID | 11px mono / `text-link` — clickable |
| Status | Inline badge: same token table as SA statuses |
| Subject | 12px / `text-primary` — truncated 1 line |
| Due date | 11px / `text-secondary` — red if overdue |

### 5.5 Widget: Service Appointments

Last 5 service appointments linked to this asset.

```
┌──────────────────────────────┐
│  SERVICE APPTS  (2)     [→]  │
├──────────────────────────────┤
│  📋 SA-00341  Scheduled      │
│    Preventive Service        │
│    08 Jun 2026 09:00         │
│  ─────────────────────────   │
│  📋 SA-00298  Completed      │
│    Emergency call-out        │
│    01 May 2026               │
└──────────────────────────────┘
```

### 5.6 Widget: History Records

Chronological audit trail of all changes made to this asset record. Acts as an activity feed.

```
┌──────────────────────────────┐
│  HISTORY                [↓]  │  ← expand / collapse
├──────────────────────────────┤
│  Today                       │  ← date group label
│                              │
│  [JC]  Status changed        │  ← 24px avatar initials
│        Shipped → Installed   │
│        14:32                 │
│                              │
│  Yesterday                   │
│                              │
│  [SA]  Serial Number set     │
│        — → VIN-8842-NR01     │
│        09:15                 │
│                              │
│  03 Jun 2026                 │
│                              │
│  [SYS] Asset created         │
│        via import            │
│        11:02                 │
│                              │
│  ─── Load earlier ───        │
└──────────────────────────────┘
```

| Element | Spec |
|---|---|
| Date group | 10px / 600 / uppercase / `text-secondary` / `tracking-wider` |
| Avatar | 24px circle — user initials or `SYS` for system events |
| Action line | 12px / 500 / `text-primary` — e.g., "Status changed" |
| Change detail | 11px / `text-secondary` — old → new value |
| Timestamp | 11px mono / `text-tertiary` / `font-mono` |
| "Load earlier" | 11px / `text-link` / center-aligned |
| Row hover | `bg-surface-hover` |

### 5.7 Widget: Related Assets

Non-hierarchical asset relationships (Asset Relationship object).

```
┌──────────────────────────────┐
│  RELATED ASSETS  (1)    [+]  │  ← + opens Add Relationship modal
├──────────────────────────────┤
│  Truck 01-A (Retired)        │  ← linked asset name
│  Replacement  →  from 2024   │  ← relationship type + from date
└──────────────────────────────┘
```

### 5.8 Widget: Files & Attachments

```
┌──────────────────────────────┐
│  FILES  (4)             [+]  │
├──────────────────────────────┤
│  📄  Service_Manual.pdf      │
│      2.4 MB · Jun 2025       │
│  📄  Registration.pdf        │
│      0.8 MB · Mar 2024       │
│  + 2 more files  →           │
└──────────────────────────────┘
```

---

## 6. Component Specifications

### 6.1 Field Display Component (Read Mode)

```
┌──────────────────────────────────────────┐
│  FIELD LABEL                             │  ← 10px / 500 / uppercase / text-secondary
│  Field value text here                   │  ← 13px / 400 / text-primary
└──────────────────────────────────────────┘
  height: auto, min-height 40px
  padding: 4px 0
```

### 6.2 Field Edit Mode (Inline)

When a field enters edit mode (via pencil icon or double-click):

```
  FIELD LABEL
  ┌────────────────────────────────┐
  │  Current value text         ✎ │  ← input with 1px accent border
  └────────────────────────────────┘
  [✓ Save]  [✗ Cancel]  ← appear below field
```

```
Light:  input border #f5c800 · input bg #ffffff · focus shadow 0 0 0 2px rgba(245,200,0,0.25)
Dark:   input border #f5c800 · input bg #2e3030 · focus shadow 0 0 0 2px rgba(245,200,0,0.20)
```

### 6.3 Status Badge Dropdown

Clicking the status badge in the header opens an inline dropdown:

```
  ┌─────────────────────────────┐
  │  ● Purchased                │
  │  ● Shipped                  │
  │  ● Installed    ← current   │  ← checkmark on current
  │  ● Registered               │
  │  ● Obsolete                 │
  └─────────────────────────────┘
  Width: 160px, border radius 8px, shadow: 0 4px 16px rgba(0,0,0,0.15)
```

### 6.4 Collapsible Widget Header

All right panel widgets use this pattern:

```css
.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  user-select: none;
}

.widget-header:hover {
  background: var(--color-bg-surface-hover);
}
```

### 6.5 Account Avatar Component

```
  Sizes: 24px (history), 32px (account info), 40px (header)

  If photo: circular img
  If initials: circle with background color derived from account name hash
  If system event: grey circle with `settings` icon (Material Symbols, 14px)

  Initials color palette (8 colors, hashed from name):
    Light: bg #e8f0fe text #1967d2
           bg #fef3e2 text #b06000
           bg #e6f4ea text #137333
           bg #f3e8fd text #7b1fa2
           bg #fce8e6 text #c5221f
           bg #e4f0fb text #0066cc
           bg #fff8e1 text #8a6400
           bg #f5f0ff text #5c35cc
    Dark: same hue families, adjusted for contrast
```

---

## 7. Interaction Patterns

### 7.1 Sidebar → Main Panel Navigation

```
1.  User clicks unit in sidebar
2.  Active row highlight: immediate (0ms)
3.  Main panel: fade out current content (100ms ease-out, opacity 1→0)
4.  New asset data loads
5.  Main panel: fade in new content (150ms ease-in, opacity 0→1)
6.  Right panel: refreshes in place, no animation
7.  URL updates to /assets/{assetId} (pushState)
8.  Page title updates in browser tab
```

### 7.2 Section Expand / Collapse

```
1.  User clicks section card header
2.  Chevron icon rotates 180° (150ms ease)
3.  Card body: height 0 → auto via max-height transition (200ms ease)
4.  Collapsed state persists per-section in localStorage key:
    "ops-asset-sections-{userId}"
```

### 7.3 Right Panel Widget Expand / Collapse

```
1.  User clicks widget header
2.  Widget body: height transition (150ms ease)
3.  Widget collapsed state persists in localStorage key:
    "ops-asset-widgets-{userId}"
```

### 7.4 Inline Field Edit

```
1.  User hovers over field row → pencil icon appears (opacity 0→1, 100ms)
2.  User clicks pencil or double-clicks value
3.  Input field appears with yellow accent border
4.  ✓ Save / ✗ Cancel buttons fade in below
5.  On Save: optimistic update (value updates immediately)
             API call in background
             On error: revert + error toast
6.  On Cancel: revert to original, no API call
7.  Pressing Enter = Save, Escape = Cancel
```

### 7.5 History Load More

```
1.  User clicks "Load earlier" link
2.  Link replaced with spinner (24px)
3.  Next page of history records appends below existing (no replace)
4.  If no more records: "No earlier history" message, link removed
```

### 7.6 Status Change

```
1.  User clicks status badge
2.  Dropdown opens (fade in 100ms)
3.  User selects new status
4.  Dropdown closes (fade out 80ms)
5.  Badge color transitions to new status color (200ms)
6.  History widget prepends new "Status changed" entry (slide-down, 200ms)
7.  API call in background; on error: revert + toast
```

---

## 8. Light Mode Wireframe

```
╔═══════════════════════════════════════════════════════════════════════════════════╗
║  OPERATIONS  │ Cases  │ Work Orders  │ Field Service  │ Assets ●  │ ...   🌙  👤  ║
╠══════════════╪═══════════════════════════════════════════╪═══════════════════════╣
║              │                                           │                       ║
║  🔍 Search   │  ← Back to Assets                        │  Related              ║
║  ────────    │  Truck 01 - NR                           │  Truck 01 - NR        ║
║              │  AST-00142 · Northern Region Fleet        │                       ║
║  All Active  │  ────────────────────────  Installed ▼ [Edit] [⋮]               ║
║  Obsolete    │                                           │  ACCOUNT INFO    [↗]  ║
║              │  ╔══════════════════════════════════╗    │  ┌──────────────────┐ ║
║  ▼ Northern  │  ║ ASSET INFORMATION          [✎][▼]║    │  │ 🏢 Northern Reg  │ ║
║  ├ Truck 01 ●│  ╠══════════════════════════════════╣    │  │ Industry: Trans  │ ║
║  ├ Truck 02  │  ║ Asset Name    Truck 01 - NR       ║    │  │ Owner: J. Carter │ ║
║  └ Truck 03  │  ║ Account       Northern Region     ║    │  │ SLA: Gold ★      │ ║
║              │  ║ Serial No.    VIN-8842-NR01       ║    │  └──────────────────┘ ║
║  ▼ Central   │  ║ Location      Yard A, Dock 3      ║    │                       ║
║  ├ Comp A    │  ║ Install Date  12 Mar 2024         ║    │  PAST CASES  (8) [→]  ║
║  └ Comp B    │  ╚══════════════════════════════════╝    │  ┌──────────────────┐ ║
║              │                                           │  │● CS-10421  Open  │ ║
║  ► Eastern   │  ╔══════════════════════════════════╗    │  │  Engine overheat │ ║
║              │  ║ PRODUCT DETAILS            [✎][▼]║    │  │  14 May 2026     │ ║
║  ▼ Internal  │  ╠══════════════════════════════════╣    │  ├──────────────────┤ ║
║  └ Diag #7   │  ║ Product       TRK-HVY-X4          ║    │  │● CS-10187 Closed │ ║
║              │  ║ Product Code  HVY-X4-2024         ║    │  │  Brake inspect  │ ║
║              │  ║ SKU           SKU-44821-NR        ║    │  │  02 Apr 2026     │ ║
║              │  ╚══════════════════════════════════╝    │  └──────────────────┘ ║
║              │                                           │  + 6 more →           ║
║              │  ╔══════════════════════════════════╗    │                       ║
║              │  ║ DATES & FINANCIALS         [✎][▼]║    │  WORK ORDERS  (3) [→] ║
║              │  ╠══════════════════════════════════╣    │  ┌──────────────────┐ ║
║              │  ║ Purchase Date  01 Jan 2024        ║    │  │▣ WO-00891 In Prg │ ║
║              │  ║ Install Date   12 Mar 2024        ║    │  │  Qtrly maint     │ ║
║              │  ║ Usage End  ⚠ 30 Jun 2026          ║    │  │  Due 10 Jun 2026 │ ║
║              │  ║ Price          $48,500.00         ║    │  └──────────────────┘ ║
║              │  ╚══════════════════════════════════╝    │                       ║
║              │                                           │  HISTORY         [↓]  ║
║              │  ╔══════════════════════════════════╗    │  ┌──────────────────┐ ║
║              │  ║ CLASSIFICATION             [✎][▼]║    │  │ TODAY            │ ║
║              │  ╠══════════════════════════════════╣    │  │[JC] Status chgd  │ ║
║              │  ║ Competitor Asset  ○ No            ║    │  │   Shipped→Instld │ ║
║              │  ║ Internal Asset    ○ No            ║    │  │   14:32          │ ║
║              │  ║ Provided By   Volvo Trucks AU     ║    │  ├──────────────────┤ ║
║              │  ║ Serviced By   FleetCare Pty Ltd   ║    │  │ YESTERDAY        │ ║
║              │  ╚══════════════════════════════════╝    │  │[SA] Serial set   │ ║
║              │                                           │  │  14:32           │ ║
╚══════════════╧═══════════════════════════════════════════╧═══════════════════════╝

COLORS (Light Mode):
  Page bg:        #f8f9fa   Sidebar bg:    #f1f3f4
  Card bg:        #ffffff   Card border:   #e0e0e0
  Text primary:   #1a1c1c   Text secondary:#5f6368
  Accent:         #f5c800   Active border: #f5c800 (left 3px)
  Nav active:     #f5c800   Tab underline: #f5c800
  Header height:  56px      Sidebar width: 240px
```

---

## 9. Dark Mode Wireframe

```
╔═══════════════════════════════════════════════════════════════════════════════════╗
║  OPERATIONS  │ Cases  │ Work Orders  │ Field Service  │ Assets ●  │ ...   ☀️  👤  ║
║  ─────────────────────────────────────────────────────────────────────────────   ║
╠══════════════╪═══════════════════════════════════════════╪═══════════════════════╣
║ bg:#202222   │ bg: #1a1c1c                               │ bg:#1a1c1c            ║
║              │                                           │                       ║
║  🔍 Search   │  ← Back to Assets                        │  Related              ║
║  ────────    │  Truck 01 - NR                           │  Truck 01 - NR        ║
║  [All][Act.] │  AST-00142 · Northern Region Fleet        │                       ║
║  [Obs.]      │  ────────────────  [Installed ▼] [Edit]   │                       ║
║              │                                           │  ACCOUNT INFO   [↗]   ║
║  ▼ Northern  │  ╔══════════════════════════════════╗    │  ┌──────────────────┐ ║
║  ├ Truck 01 ●│  ║ bg:#242626  bdr:#3a3c3c          ║    │  │ bg:#242626       │ ║
║   (bdr-l     │  ║ ASSET INFORMATION                ║    │  │ 🏢 Northern Reg  │ ║
║   #f5c800)   │  ╠══════════════════════════════════╣    │  │ text:#f0f0f0     │ ║
║  ├ Truck 02  │  ║ text-label: #9aa0a6              ║    │  │ SLA: Gold ★      │ ║
║  └ Truck 03  │  ║ Asset Name    Truck 01 - NR       ║    │  └──────────────────┘ ║
║              │  ║ text-value: #f0f0f0               ║    │                       ║
║  ▼ Central   │  ║ Account       Northern Region     ║    │  PAST CASES  (8) [→]  ║
║  ├ Comp A    │  ║ Serial No.    VIN-8842-NR01       ║    │  ┌──────────────────┐ ║
║  └ Comp B    │  ║ (mono: #8ab4f8 / font-mono)       ║    │  │● CS-10421  Open  │ ║
║              │  ╚══════════════════════════════════╝    │  │  dot: #ea4335    │ ║
║  ► Eastern   │                                           │  │  14 May 2026     │ ║
║              │  ╔══════════════════════════════════╗    │  │  text:#9aa0a6    │ ║
║  ▼ Internal  │  ║ PRODUCT DETAILS                  ║    │  ├──────────────────┤ ║
║  └ Diag #7   │  ╠══════════════════════════════════╣    │  │● CS-10187 Closed │ ║
║              │  ║ Product Code  HVY-X4-2024         ║    │  │  dot: #34a853    │ ║
║              │  ║ (mono #8ab4f8)                    ║    │  └──────────────────┘ ║
║              │  ╚══════════════════════════════════╝    │                       ║
║              │                                           │  WORK ORDERS  (3) [→] ║
║              │  ╔══════════════════════════════════╗    │  ┌──────────────────┐ ║
║              │  ║ DATES & FINANCIALS               ║    │  │▣ WO-00891 In Prg │ ║
║              │  ╠══════════════════════════════════╣    │  │  Due 10 Jun 2026 │ ║
║              │  ║ Usage End  ⚠ 30 Jun 2026          ║    │  │  overdue:#f28b82 │ ║
║              │  ║ (warn bg:#3a2200 text:#ffa040)    ║    │  └──────────────────┘ ║
║              │  ╚══════════════════════════════════╝    │                       ║
║              │                                           │  HISTORY        [↓]   ║
║              │  ╔══════════════════════════════════╗    │  ┌──────────────────┐ ║
║              │  ║ CLASSIFICATION                   ║    │  │ TODAY            │ ║
║              │  ╠══════════════════════════════════╣    │  │ date:#9aa0a6     │ ║
║              │  ║ Competitor Asset  ○ No            ║    │  │[JC] Status chgd  │ ║
║              │  ║ toggle bg (off): #3a3c3c          ║    │  │ bg:#2e3030       │ ║
║              │  ║ Provided By   Volvo Trucks AU     ║    │  │ ts:#6c7074 mono  │ ║
║              │  ╚══════════════════════════════════╝    │  └──────────────────┘ ║
╚══════════════╧═══════════════════════════════════════════╧═══════════════════════╝

COLORS (Dark Mode):
  Page bg:        #1a1c1c   Sidebar bg:    #202222
  Card bg:        #242626   Card border:   #3a3c3c
  Text primary:   #f0f0f0   Text secondary:#9aa0a6
  Text tertiary:  #6c7074   Mono text:     #8ab4f8
  Accent:         #f5c800   Active border: #f5c800 (left 3px)
  Surface-2:      #2e3030   Hover:         #363838
  Link:           #8ab4f8   Theme toggle:  ☀️ sun icon
```

---

## 10. Animation & Transition Specs

| Interaction | Property | Duration | Easing |
|---|---|---|---|
| Theme toggle (all colors) | `color`, `background-color`, `border-color` | `200ms` | `ease-in-out` |
| Sidebar unit selection | `opacity` (main panel) | `100ms out / 150ms in` | `ease-out / ease-in` |
| Section card collapse | `max-height` | `200ms` | `ease` |
| Chevron rotate | `transform: rotate()` | `150ms` | `ease` |
| Widget collapse | `max-height` | `150ms` | `ease` |
| Status badge change | `background-color`, `color` | `200ms` | `ease` |
| Field edit pencil icon | `opacity` | `100ms` | `ease` |
| History new entry | `transform: translateY(-8px→0)`, `opacity 0→1` | `200ms` | `ease-out` |
| Right panel widget hover | `background-color` | `80ms` | `ease` |
| Status dropdown open | `opacity`, `transform: scale(0.97→1)` | `100ms` | `ease-out` |
| Inline edit input appear | `opacity` | `80ms` | `ease` |

Theme preference stored in: `localStorage["ops-theme"]`
Section collapse state stored in: `localStorage["ops-asset-sections-{userId}"]`
Widget collapse state stored in: `localStorage["ops-asset-widgets-{userId}"]`

---

## 11. Responsive Behavior

| Breakpoint | Layout Change |
|---|---|
| `>= 1280px` | Full 3-zone layout (sidebar + main + right panel) |
| `1024px – 1279px` | Right panel collapses to icon-strip; expands as overlay on demand |
| `768px – 1023px` | Left sidebar collapses to icon-only (48px); right panel hidden, accessible via bottom sheet |
| `< 768px` | Sidebar hidden (accessible via hamburger); single-column stacked layout; right panel content moves below main panel sections |

---

## 12. Acceptance Criteria

### 12.1 Layout

- [ ] Left sidebar renders at exactly `240px` on viewports `>= 1280px`
- [ ] Main panel occupies `80%` of the content area (excluding sidebar)
- [ ] Right panel occupies `20%` of the content area (excluding sidebar)
- [ ] Right panel remains sticky while main panel scrolls independently
- [ ] Both panels are independently scrollable with custom scrollbar styling

### 12.2 Sidebar

- [ ] Account groups render as collapsible sections with chevron toggle
- [ ] Currently viewed asset is highlighted with `3px left border #f5c800`
- [ ] Search filters both account names and unit names in real time (debounce 200ms)
- [ ] Filter chips (All / Active / Obsolete) filter all groups simultaneously
- [ ] On page load, sidebar auto-expands the group of the current asset and scrolls it into view

### 12.3 Main Panel

- [ ] Asset header bar is sticky (does not scroll away)
- [ ] All 6 section cards render correctly in sequence
- [ ] Each section card is independently collapsible
- [ ] Collapsed state persists per-user in `localStorage`
- [ ] Usage End Date displays amber warning state when within 30 days of today
- [ ] Competitor Asset checked state renders red badge/text
- [ ] Mini hierarchy tree correctly shows up to 3 levels
- [ ] Current asset node is highlighted with accent color in hierarchy

### 12.4 Right Panel

- [ ] All 7 widgets render in the correct order: Account Info, Past Cases, Work Orders, Service Appointments, History, Related Assets, Files
- [ ] Each widget is independently collapsible and state persists in `localStorage`
- [ ] Account Info shows correct account data from linked account
- [ ] Past Cases shows last 5 cases with correct status dot colors
- [ ] Work Orders shows last 5 WOs with overdue date in red
- [ ] History records render in reverse chronological order with date group headers
- [ ] "Load earlier" in History appends records (no replace/scroll-to-top)
- [ ] View All links navigate to filtered list views for that object

### 12.5 Light & Dark Mode

- [ ] All zones (sidebar, main panel, right panel) respond to theme toggle
- [ ] Color transitions are smooth at `200ms ease-in-out` — no flash
- [ ] All token references match the table in Section 1.1 exactly
- [ ] No hardcoded hex values in component code
- [ ] Theme preference persists in `localStorage["ops-theme"]`
- [ ] Status badges render correct colors per token table in Section 1.2 for both modes
- [ ] Mono text (`JetBrains Mono`) renders in `#8ab4f8` in dark mode for IDs/codes

### 12.6 Interactions

- [ ] Inline field edit activates on pencil click or double-click
- [ ] Enter key saves, Escape key cancels inline edit
- [ ] Optimistic update on save; reverts with toast on API error
- [ ] Status dropdown opens on badge click, closes on selection or outside-click
- [ ] History new entry animates in from above (`translateY -8px → 0`)

---

## Appendix A — File Reference

| File | Purpose |
|---|---|
| `code.html` | Design token source, Tailwind config |
| `FRD-Asset-Management.md` | Asset object field schema & fleet management requirements |
| `DESIGN-SA-FieldService-Module.md` | Parent design system reference (tokens, nav, Gantt) |
| `DESIGN-Asset-Management-Panel.md` | **This document** — panel layout & detail view design |

---

*OPERATIONS Platform · Asset Management Module · Panel Design Specification*
*v1.0.0 · June 2026 · Confidential Internal Document*
