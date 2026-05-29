# EMR Work Order — Equipment Maintenance Report Design

> **System:** UT Service Console  
> **Record Type:** EMR (Equipment Maintenance Report) — Work Order Specialization Mechanic  
> **Full Title:** "Equipment Report Specialization Mechanic UT at SalesForce"  
> **Layout:** 5-Layer Structure · 2-Column Body · Multi-Tab Detail View  
> **Reference:** UT Service Console EMR Work Order screenshot  
> **Theme:** ⬛🟨 Black & Yellow — Primary `#F5C800` · Surface `#1A1A1A` · Base `#0D0D0D`

---

## Layout Overview

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#F5C800` | Accent, active states, CTA buttons |
| `--color-primary-dark` | `#C9A100` | Hover / pressed primary |
| `--color-bg-base` | `#0D0D0D` | Page background |
| `--color-surface` | `#1A1A1A` | Card & panel surfaces |
| `--color-surface-raised` | `#242424` | Elevated card, dropdown |
| `--color-border` | `#2E2E2E` | Dividers, card outlines |
| `--color-border-accent` | `#F5C800` | Active tab underline, focused input |
| `--color-text-primary` | `#F0F0F0` | Body text on dark |
| `--color-text-secondary` | `#A0A0A0` | Muted labels |
| `--color-text-on-primary` | `#0D0D0D` | Text on yellow backgrounds |
| `--color-danger` | `#FF4D4F` | Error / delete states |
| `--color-success` | `#52C41A` | Closed / complete status |
| `--color-link` | `#F5C800` | All linked record values |

### Structure Diagram

```
┌──────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)            │  bg: #0D0D0D · border-bottom: 2px #F5C800
├──────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + Open Tabs)                   │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────────────────────────────────────────────────────┤
│  LAYER 3 — EMR Title Bar (EMR Number, Meta, Action Buttons)      │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Stage Progress Bar (chevron pipeline)                 │  bg: #141414 · active: #F5C800
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4B — Record Banner (full-width title)                     │  bg: #F5C800 · text: #0D0D0D
├───────────────────────────────────┬──────────────────────────────┤
│  LAYER 5 — COL 1 (Detail Form)    │  LAYER 5 — COL 2 (Related)  │  bg: #0D0D0D
│  Sub-Tabs: Details · EMI · TSI    │  Field History               │  cards: #1A1A1A
│            TSR · Table            │  Work Orders                 │  border: #2E2E2E
│  ─────────────────────────────    │  EMR Additional Information  │
│  Sections:                        │  EMR Additional Group        │
│  · General Info                   │  Case                        │
│  · Customer Information           │                              │
│  · Unit Information               │                              │
│  · Other Information              │                              │
│  · Subject                        │                              │
│  · Action Taken                   │                              │
└───────────────────────────────────┴──────────────────────────────┘
```

---

## Layer 1 — Global Top Bar

**Position:** Fixed, full-width, topmost  
**Height:** ~36px  
**Background:** `#0D0D0D`  
**Border-Bottom:** `2px solid #F5C800`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | App launcher grid icon | 4×4 dot grid 18px · icon `#F5C800` |
| Center | Global Search Bar | Placeholder: "Search…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · pill ~320px |
| Right | Icon cluster | Help `?`, Notifications (badge `#F5C800`), User avatar, Settings — icons `#A0A0A0` · hover `#F5C800` |

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | "UT Service Console" label | Icon `#F5C800` + text `#F0F0F0` bold 14px |
| Left+1 | **EMR** tab | Active · bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800` |
| Center | Export / Import tabs | Inactive · `#A0A0A0` |
| Center+ | Status tabs (Stacks, Items, Suku, etc.) | Multiple inactive tabs · `#A0A0A0` |
| Center+ | ROAS, BPEC, Manpo, Grour, etc. | Additional inactive console tabs |
| Far Right | `+ More ▾` | overflow menu · `#A0A0A0` · hover `#F5C800` |

---

## Layer 3 — EMR Title Bar

**Position:** Below App Bar  
**Height:** ~56px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

### Left Section — EMR Identity

| Component | Detail |
|-----------|--------|
| Record icon | Yellow/orange square · `#F5C800` |
| Record label | "IT" / "EMR" · 11px · `#A0A0A0` |
| EMR Number | **UT-DE21N2** · 22px · `#F5C800` · font-weight 600 |
| Date display | 21/05/2026 · 12px · `#A0A0A0` |

### Right Section — Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| Follow | Outline · border `#2E2E2E` · text `#A0A0A0` · hover `#F5C800` | Subscribe to record |
| Upload to Pro... | Outline · hover `#F5C800` | Upload to production system |
| Add to High Point... | Outline · hover `#F5C800` | Add to high priority queue |
| Add to Low Point... | Outline · hover `#F5C800` | Add to low priority queue |
| Save Adm | Outline · hover `#F5C800` | Save as admin action |
| Change Owner | Outline · hover `#F5C800` | Reassign EMR owner |
| All ▾ | Outline · hover `#F5C800` | All actions overflow dropdown |
| **Closed** | **Primary** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` | Close / finalize EMR |

---

## Layer 4 — Stage Progress Bar

**Position:** Below Title Bar  
**Height:** ~28px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

Each stage is a chevron arrow segment:

| Stage | State | Color |
|-------|-------|-------|
| Stage 1 | Completed | bg `#52C41A` · checkmark `✓` · text `#0D0D0D` |
| Stage 2 | Completed | bg `#52C41A` · checkmark `✓` |
| Stage 3 | Completed | bg `#52C41A` · checkmark `✓` |
| Stage 4 | Completed | bg `#52C41A` · checkmark `✓` |
| Stage 5 | Completed | bg `#52C41A` · checkmark `✓` |
| Stage 6 | Completed | bg `#52C41A` · checkmark `✓` |
| **Closed** | **Active terminal** | bg `#F5C800` · text `#0D0D0D` · font-weight 600 |

---

## Layer 4B — Record Banner

**Position:** Below Stage Progress Bar  
**Height:** ~32px  
**Background:** `#F5C800`  
**Text:** `#0D0D0D` · font-size 14px · font-weight 600 · center-left aligned

```
Equipment Report Specialization Mechanic UT at SalesForce
```

---

## Layer 5 — Two-Column Body

**Layout:** CSS Grid `[1fr] [300px]`  
**Gap:** 12px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px`  
> **Section header:** text `#F5C800` · 13px · font-weight 600 · border-bottom `1px solid #2E2E2E` · collapse toggle `#F5C800`  
> **Field label:** `#A0A0A0` · 11px  
> **Field value:** `#F0F0F0` · 13px  
> **Link value:** `#F5C800` · hover underline  
> **Edit pencil icon:** `#A0A0A0` · hover `#F5C800`

---

## Column 1 — Detail Sub-Tab Bar

**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`  
**Height:** ~36px

| Tab | State | Style |
|-----|-------|-------|
| Details | **Active** | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| EMI | Inactive | text `#A0A0A0` · hover `#F0F0F0` |
| TSI | Inactive | text `#A0A0A0` · hover `#F0F0F0` |
| TSR | Inactive | text `#A0A0A0` · hover `#F0F0F0` |
| Table | Inactive | text `#A0A0A0` · hover `#F0F0F0` |

---

## Section 1 — General Information

**Collapse toggle:** `▼` · bg header `#F5C800` · 13px · font-weight 600 · text `#0D0D0D`

**2-column layout**

### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| EMR Name | UT-DE821 MO2 | Auto-generated EMR name |
| Customer Name | PT Poma Indro EXOANT06 by Garnet · TechPlan Multi Traction · Jamal Piers Multi 5 · UT Full Pincipex · As Full Pincipex, this unit (sold) seeing the Engine | Multi-line customer summary · 13px · `#F0F0F0` |
| Asset | UT_DT_COMPOSITE_1-2 *(link)* | Linked asset record · `#F5C800` |
| Ap - Report Remarks | — | Free text |
| Report for Customer | — | Free text |
| Report Date for Customer STO | — | Date field |

### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| EMS Status | Closed | Badge: bg `#0D2200` · text `#52C41A` |
| Closer | ABDOR_LAPH_PKLEVPTC *(link)* | User link · `#F5C800` |
| `[ Flag item ]` | Checkbox | `#F5C800` accent |
| Reg Alarm | — | Alarm field |

---

## Section 2 — Customer Information

**Collapse toggle:** `▼` · header `#F5C800`

### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Machine Model | PC 60F 1040 | Equipment model code |
| Serial No | J12919 | Unit serial number |
| HM | 38 | Hours meter reading |
| Service Area | Jambi | Territory/region |
| Last PM Date | 29/09/2021 | Previous PM date |
| Warranty By | WARRANTY | Warranty status |

### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Machine Source | ADVENT | Machine sourcing |
| Service Facility | KULONPALE 9 | Service facility code |
| Engine Number | 149544 | Engine serial |
| Province | ADHUN_LAPH_PKLEVPTC *(link)* | Province lookup · `#F5C800` |
| Elevation | +275 | Site elevation (meters) |

---

## Section 3 — Unit Information

**Collapse toggle:** `▼` · header `#F5C800`

### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Accessories | — | Linked accessories |
| Part Number | A12U410 | Part number |
| Case | A12U418 *(link)* | Linked Case record · `#F5C800` |
| Prob. Type | LEAK | Problem type classification |
| Sync/Off Type | KOFPTAL | Sync/off type |
| Last Call Info | Internal – Dasumanks Jacquot Moonly | Last call detail |

### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Service Date | 12/09/2026, 11:15 | DateTime of service |
| Service End | 12/09/2026, 11:15 | DateTime end of service |
| Service + Carpenter | 17/04/2023, 0964 | Carpenter assignment |
| Machine Source | ADM | Source flag |
| HM Usage | 100 | Hours meter usage |
| Sales Off. Type | GILSA | Sales office type code |

---

## Section 4 — Other Information

**Collapse toggle:** `▼` · header `#F5C800`

### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Job Control | KNTALJO | Job control code |
| Informant | Product Joy Jr. *(link)* | Informant contact · `#F5C800` |
| Concern | POPYLENA *(link)* | Concern record · `#F5C800` |
| Approver | 1ADMT9 | Approver user code |
| Responsibility | OF | Responsibility code |
| Late Status | No | Late flag |
| Leave Status | — | Leave status |

### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Shift | 1 | Work shift number |
| Solution Gallery | Alernphy | Solution category |
| Assist Support Info | Manufacy Support Convention | Support info |
| Sales Support Info | NG | Sales support flag |
| Well Back Emm | E1 | Well back field |
| EMs Serial Second Name | — | Secondary serial |
| Internal OC | Y_PRKY_NO2 | Internal OC code |

---

## Section 5 — Subject

**Collapse toggle:** `▼` · header `#F5C800`

| Field | Value | Notes |
|-------|-------|-------|
| Subject | IN-ELECTRIC SUBSEMA PC196 | Main subject/title of EMR · 13px · `#F0F0F0` · full-width |

---

## Section 6 — Action Taken

**Collapse toggle:** `▼` · header `#F5C800`

| Component | Detail |
|-----------|--------|
| Section header | "Action Taken" · `#F5C800` · 13px · font-weight 600 |
| List of Facilities Installations | Multi-line free text · bg `#141414` · border `#2E2E2E` · text `#F0F0F0` · 12px · min-height 80px |
| Inspection and Checking (current) So | Textarea · same styling as above |
| Edit pencil | `#A0A0A0` · hover `#F5C800` · top-right of each textarea |

---

## Column 2 — Related Panel

**Width:** ~300px  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

---

### Related Card: Field History (6+)

**Header:** "Field History (6+)" · `#F5C800` · 13px · font-weight 600  
**Expand icon:** `[ + ]` · bg `#F5C800` · text `#0D0D0D`  
**Collapse icon:** `[ - ]`

| Field | Value |
|-------|-------|
| Date | 31/05/2026, 07:38 |
| Field | Policy |
| Original Value | (blank) |
| Changed Value | OPE STATUS |
| Date | 31/05/2026, 07:36 |
| Field | BPM BulA |
| Original Value | (blank) |
| Changed Value | — |
| New Owner | ADHUR_LAPH_PKLEVPTC |
| Date | 31/05/2026, 07:23 |
| Field | Closed |
| New Value | — |
| Date | 29/05/2026, 07:21 |
| Field | Activity: Comments |
| New Value | ADHUR_LAPH_PKLEVPTC |
| (+ more) | "View All" link · `#F5C800` · 11px |

**Row styles:**
- Label column: 11px · `#A0A0A0`
- Value column: 11px · `#F0F0F0`
- Link values: `#F5C800` · hover underline
- Row border-bottom: `1px solid #2E2E2E`

---

### Related Card: Work Orders (2)

**Header:** "Work Orders (2)" · `#F5C800` · 13px · font-weight 600

| Field | Value |
|-------|-------|
| WO Number | J10-CE18 *(link)* |
| WO Type | PATINUE CORDING |
| Status | *(status badge)* |
| WO Number | C12NO10 *(link)* |
| Status | Terminal Complete |
| Date | 31/05/2026 |
| Subject | IN-ELECTRIC DISTRICT PT 102 |
| View All | `#F5C800` · 11px · hover underline |

---

### Related Card: EMR Additional Information (5+)

**Header:** "EMR Additional Information (5+)" · `#F5C800`

| Field | Value |
|-------|-------|
| Key | APV |
| Appearance | *(linked value)* |
| PALI | *(value)* |
| Description | *(multi-line)* |
| APT | BUPF SC |
| Attachment | *(URL link)* `#F5C800` · truncated with ellipsis |
| UPC | *(linked URL)* |
| Attachment URL (2) | *(URL link)* · `#F5C800` |
| Remarks Numerically | *(free text)* |
| Adm | *(linked value)* · `#F5C800` |
| View All | `#F5C800` · 11px |

**URL link style:**
- text `#F5C800` · 10px · word-break `break-all` · hover underline

---

### Related Card: EMR Additional Group (1+)

**Header:** "EMR Additional Group (1+)" · `#F5C800`

**Left Column:**

| Field | Value |
|-------|-------|
| EMR | *(link)* `#F5C800` |
| Group Type | *(text)* |
| Data Provides | *(value)* |
| OP Details | ☐ checkbox |
| Adm | *(value)* |
| LKMT Info | *(value)* |
| Adm 2 | *(value)* |
| Sales Accept | *(value)* |
| Data Mechanic Hours | *(value)* |

**Right Column:**

| Field | Value |
|-------|-------|
| Divition | *(text)* |
| *(empty)* | — |
| *(empty)* | — |
| *(empty)* | ☐ |
| Umkpas | *(value)* |
| *(empty)* | — |
| *(empty)* | ☐ |
| *(empty)* | — |

**View All** link · `#F5C800` · 11px

---

### Related Card: Case (1)

**Header:** "Case (1)" · `#F5C800`

| Field | Value |
|-------|-------|
| Case Number | C12U102 *(link)* · `#F5C800` |
| Expand icon | `[ + ]` |

---

## Tab: EMI (Equipment Maintenance Inspection)

> Tab activated when **EMI** sub-tab is selected

| Section | Fields |
|---------|--------|
| Inspection Header | Inspection date, Inspector, Inspection Type |
| Component Checks | Each component: Name · Status (OK/Attention/Defect) · Notes |
| Findings | Multi-line findings textarea |
| Recommendations | Action recommendation list |

**Component Status Badge Tokens:**

| Status | Background | Text |
|--------|-----------|------|
| OK / Good | `#0D2200` | `#52C41A` |
| Attention | `#2D1600` | `#FB923C` |
| Defect / Fail | `#2D0000` | `#FF4D4F` |
| Not Checked | `#2E2E2E` | `#A0A0A0` |

---

## Tab: TSI (Technical Service Information)

> Tab activated when **TSI** sub-tab is selected

| Section | Fields |
|---------|--------|
| TSI Number | Auto-generated reference |
| Issue Type | Dropdown: Electrical · Hydraulic · Mechanical · Structural |
| Description | Multi-line textarea · bg `#141414` · border `#2E2E2E` |
| Resolution | Steps taken · numbered list |
| Attachments | File list with upload button |
| Submitted By | User link · `#F5C800` |
| Submitted Date | DateTime |

---

## Tab: TSR (Technical Service Record)

> Tab activated when **TSR** sub-tab is selected

| Section | Fields |
|---------|--------|
| TSR Score | Numeric score input · 0–100 · `#F5C800` accent |
| Category | Dropdown: Electrical · Hydraulic · Engine · Structural · Other |
| Scoring Breakdown | Table: Category · Max Score · Actual Score · Weight |
| Comments | Textarea for evaluator notes |
| Evaluator | User link · `#F5C800` |
| Evaluation Date | DateTime |

**TSR Score Band Tokens:**

| Band | Range | Text | Background |
|------|-------|------|-----------|
| Excellent | 90–100 | `#52C41A` | `#0D2200` |
| Good | 75–89 | `#F5C800` | `#2D2600` |
| Satisfactory | 60–74 | `#FB923C` | `#2D1600` |
| Needs Improvement | 40–59 | `#FF4D4F` | `#2D0000` |
| Unsatisfactory | 0–39 | `#F0F0F0` | `#3D0000` |

---

## Tab: Table (Summary Grid View)

> Tab activated when **Table** sub-tab is selected — grid/list view of all related records

| Column | Width | Style |
|--------|-------|-------|
| Checkbox | 16px | accent `#F5C800` |
| Record # | ~80px | link `#F5C800` |
| Type | ~80px | `#F0F0F0` |
| Status | ~80px | Badge per token |
| Date | ~120px | DateTime `#A0A0A0` |
| Subject | flex | `#F0F0F0` truncated |
| Assigned To | ~120px | User link `#F5C800` |
| Actions | 48px | icon `#A0A0A0` · hover `#F5C800` |

---

## Interaction Patterns

### Close EMR (Primary CTA)
1. User clicks **Closed** button (primary yellow)
2. Confirmation modal: "Are you sure you want to close EMR UT-DE21N2?"
3. Confirm → Stage bar moves to "Closed" terminal state · bg `#F5C800`
4. EMS Status field → "Closed" badge `#52C41A`
5. Record banner text updates
6. Success toast: bg `#1A1A1A` · left-border `4px solid #52C41A` · "EMR closed successfully"

### Inline Edit Fields
1. Hover field row → pencil icon `#A0A0A0` appears
2. Click pencil → field converts to input · border `#F5C800` · bg `#141414`
3. Tab/Enter → save · blur → cancel with unchanged value
4. Save confirmation: inline checkmark `#52C41A`

### Sub-Tab Switching
1. Click tab → active state: text `#F5C800` · border-bottom `2px solid #F5C800`
2. Tab content swaps with fade (opacity 0→1 · 150ms)
3. URL hash updates: `#details` / `#emi` / `#tsi` / `#tsr` / `#table`

### Related Card Expand / Collapse
1. Click `[ + ]` → expand to full related list with pagination
2. Click `[ - ]` → collapse back to summary (default 5 rows)
3. "View All" → opens full-page related list in new tab

### Upload to Pro... Button
1. Opens modal with file picker
2. Drag-and-drop zone: dashed border `#F5C800` · bg `rgba(245,200,0,0.05)`
3. Progress bar: `#F5C800` fill · `#2E2E2E` track

---

## Color & Status Tokens (EMR)

| Token | Text | Background | Usage |
|-------|------|-----------|-------|
| Closed | `#52C41A` | `#0D2200` | EMS Status: Closed |
| Open | `#F5C800` | `#2D2600` | EMS Status: Open |
| In Progress | `#FB923C` | `#2D1600` | EMS Status: In Progress |
| Pending | `#A0A0A0` | `#2E2E2E` | EMS Status: Pending |
| Cancelled | `#FF4D4F` | `#2D0000` | EMS Status: Cancelled |
| Warranty | `#60A5FA` | `#1D3557` | Warranty By field badge |
| LEAK (Prob Type) | `#FF4D4F` | `#2D0000` | Problem type |
| OK (Inspection) | `#52C41A` | `#0D2200` | Component check pass |
| Attention | `#FB923C` | `#2D1600` | Component needs attention |
| Defect | `#FF4D4F` | `#2D0000` | Component defect |

---

## Typography Scale

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Record Number | 22px | 600 | `#F5C800` | EMR title bar number |
| Banner Title | 14px | 600 | `#0D0D0D` | Yellow banner text |
| Section Header | 13px | 600 | `#F5C800` | Collapsible section titles |
| Tab Active | 13px | 600 | `#F5C800` | Active sub-tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Inactive sub-tab |
| Field Label | 11px | 400 | `#A0A0A0` | Form field labels |
| Field Value | 13px | 500 | `#F0F0F0` | Form field values |
| Link Value | 13px | 500 | `#F5C800` | Linked record values |
| Related Header | 13px | 600 | `#F5C800` | Related card titles |
| Related Row Label | 11px | 400 | `#A0A0A0` | Related card field labels |
| Related Row Value | 11px | 400 | `#F0F0F0` | Related card field values |
| URL Link | 10px | 400 | `#F5C800` | Long URLs in related cards |
| Timestamp | 11px | 400 | `#A0A0A0` | Dates in field history |
| Badge | 11px | 500 | *(per token)* | Status pills |
| Button Primary | 13px | 600 | `#0D0D0D` | CTA on `#F5C800` bg |
| Button Outline | 13px | 400 | `#A0A0A0` | Secondary actions |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default row | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Row hover | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Field edit active | `#141414` | `#F5C800` | `#F0F0F0` |
| Active tab | — | `#F5C800` (bottom 2px) | `#F5C800` |
| Card expand | bg `#242424` | `#F5C800` | — |
| Focused input | `#141414` | `#F5C800` | `#F0F0F0` |
| Disabled | `#141414` | `#1A1A1A` | `#4A4A4A` |

---

## Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
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
│     └── IconCluster
│
├── Layer 2: AppBar (Console + Tabs)
│     ├── ConsoleLabel ("UT Service Console")
│     ├── EMRTab  ← active #F5C800
│     └── OtherTabs (Export, Import, etc.)
│
├── Layer 3: EMRTitleBar
│     ├── RecordIcon (#F5C800)
│     ├── RecordLabel ("IT" / "EMR")
│     ├── EMRNumber ("UT-DE21N2") ← #F5C800 22px
│     ├── DateDisplay
│     └── ActionButtons
│           ├── Follow
│           ├── UploadToPro
│           ├── AddToHighPoint
│           ├── AddToLowPoint
│           ├── SaveAdm
│           ├── ChangeOwner
│           ├── AllDropdown
│           └── ClosedButton  ← primary #F5C800
│
├── Layer 4: StageProgressBar
│     └── StageSegments[] (chevron, all completed → Closed active)
│
├── Layer 4B: RecordBanner
│     └── BannerTitle ("Equipment Report Specialization Mechanic UT at SalesForce")
│
└── Layer 5: BodyGrid (2 columns)
      ├── Column1: DetailPanel
      │     ├── SubTabBar [Details | EMI | TSI | TSR | Table]
      │     ├── DetailsTab
      │     │     ├── GeneralInfoSection
      │     │     │     ├── LeftColumn (EMR Name, Customer Name, Asset, Remarks, Date)
      │     │     │     └── RightColumn (EMS Status, Closer, Flag item, Reg Alarm)
      │     │     ├── CustomerInformationSection
      │     │     │     ├── LeftColumn (Machine Model, Serial, HM, Service Area, Last PM, Warranty)
      │     │     │     └── RightColumn (Machine Source, Facility, Engine No, Province, Elevation)
      │     │     ├── UnitInformationSection
      │     │     │     ├── LeftColumn (Accessories, Part No, Case, Prob Type, Sync/Off, Last Call)
      │     │     │     └── RightColumn (Service Date/End, Carpenter, Machine Source, HM Usage, Sales Off)
      │     │     ├── OtherInformationSection
      │     │     │     ├── LeftColumn (Job Control, Informant, Concern, Approver, Responsibility, Late/Leave)
      │     │     │     └── RightColumn (Shift, Solution Gallery, Assist/Sales Support, Well Back, EMs Serial, Internal OC)
      │     │     ├── SubjectSection
      │     │     │     └── SubjectField (full-width)
      │     │     └── ActionTakenSection
      │     │           ├── FacilitiesInstallationsTextarea
      │     │           └── InspectionCheckingTextarea
      │     ├── EMITab (Equipment Maintenance Inspection)
      │     ├── TSITab (Technical Service Information)
      │     ├── TSRTab (Technical Service Record + Score)
      │     └── TableTab (Summary Grid)
      │
      └── Column2: RelatedPanel
            ├── FieldHistoryCard (6+ rows)
            ├── WorkOrdersCard (2 records)
            ├── EMRAdditionalInformationCard (5+ rows)
            ├── EMRAdditionalGroupCard (1+ rows)
            └── CaseCard (1 record)
```

---

## Document Version

**Version 1.0** — UT Service Console EMR Work Order Design  
**Record:** Equipment Maintenance Report (EMR) — Specialization Mechanic  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-WorkOrder.md → DESIGN-ServiceAppointment.md  
**Updated:** 2026-05-26
