# Time Sheet Work Order — Design Document

> **System:** UT Service Console  
> **Record Type:** Time Sheet — linked to Work Order  
> **Record Number:** TST-2551959  
> **Layout:** 5-Layer Structure · 2-Column Body · Related + Details Sub-Tabs  
> **Reference:** UT Service Console Time Sheet screenshots (Detail view + Related view)  
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
| `--color-danger` | `#FF4D4F` | Error / reject states |
| `--color-success` | `#52C41A` | Approved / complete status |
| `--color-warning` | `#FB923C` | Pending / attention states |
| `--color-link` | `#F5C800` | All linked record values |

### Structure Diagram

```
┌──────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)            │  bg: #0D0D0D · border-bottom: 2px #F5C800
├──────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + Open Tabs)                   │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────────────────────────────────────────────────────┤
│  LAYER 3 — Time Sheet Title Bar (TST Number, Meta, Action Btns)  │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Quick Summary Bar (Service Resource, Dates, Duration) │  bg: #141414 · text: #A0A0A0
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4B — Sub-Tab Bar (Related · Details)                      │  bg: #141414 · active: #F5C800
├───────────────────────────────────┬──────────────────────────────┤
│  LAYER 5 — COL 1 (Main Content)   │  LAYER 5 — COL 2 (Activity) │  bg: #0D0D0D
│  Tab: Related                     │  Activity Panel              │  cards: #1A1A1A
│  · Approval History               │  · Filter Bar                │  border: #2E2E2E
│  · Files                          │  · Upcoming & Overdue        │
│  · Time Sheet History             │  · Show All Activities       │
│  · Time Sheet Entries             │                              │
│  Tab: Details                     │                              │
│  · Information Section            │                              │
│  · System Information Section     │                              │
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
| Left | App launcher / UT logo | Yellow/orange icon · `#F5C800` |
| Center | Global Search Bar | Placeholder: "Search…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · pill ~320px |
| Right | Icon cluster | `+` New, Help `?`, Setup gear, Notifications (badge count `#F5C800`), User avatar — icons `#A0A0A0` · hover `#F5C800` |

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | "UT Service Console" label | Icon `#F5C800` + text `#F0F0F0` bold 14px |
| Left+1 | **Time Sheets** tab | Active · bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800` |
| Center | Agent tabs (Dagan L, 0/1757, Justiran, Drik R, ISSA1, Randi, Suhara, Ghani, PSP4P, 015227, Cara G, Cara M, Closed, TST-25…) | Multiple inline person/record tabs · `#A0A0A0` · close `×` on each |
| Far Right | `+ More ▾` | Overflow menu · `#A0A0A0` · hover `#F5C800` |

**Tab strip style:**
- Each person/record tab: pill shape · bg `#1A1A1A` · border `#2E2E2E` · text `#A0A0A0` · close `×` `#A0A0A0`
- Hover: border `#F5C800` · text `#F0F0F0`
- Active: bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800`

---

## Layer 3 — Time Sheet Title Bar

**Position:** Below App Bar  
**Height:** ~56px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

### Left Section — Record Identity

| Component | Detail |
|-----------|--------|
| Breadcrumb | "Time Sheet" · 11px · `#A0A0A0` · hover `#F5C800` |
| Record Number | **TST-2551959** · 22px · `#F5C800` · font-weight 600 |

### Right Section — Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| **New Contact** | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border `#F5C800` · hover text `#F5C800` | Create new contact from this time sheet |
| **New Note** | Outline · same as above | Add a note to this record |
| **Edit ▾** | Outline with dropdown chevron · hover `#F5C800` | Edit record · dropdown: Clone, Delete, Change Owner |

---

## Layer 4 — Quick Summary Bar

**Position:** Below Title Bar  
**Height:** ~48px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`  
**Layout:** Horizontal flex · 4 columns · gap 24px · padding `0 16px`

| Column | Label | Value | Style |
|--------|-------|-------|-------|
| 1 | Service Resource | Sulaiman Nurkholis *(link)* | Label `#A0A0A0` 11px · Value `#F5C800` 13px link |
| 2 | Time Sheet Start Date | 22/04/2026 | Label `#A0A0A0` 11px · Value `#F0F0F0` 13px |
| 3 | Time Sheet End Date | 22/04/2026 | Label `#A0A0A0` 11px · Value `#F0F0F0` 13px |
| 4 | Total Duration (in Hours) | 0.00 | Label `#A0A0A0` 11px · Value `#F0F0F0` 13px |
| 5 | Status | **Approved** | Label `#A0A0A0` 11px · Badge: bg `#0D2200` · text `#52C41A` · 11px · border-radius 4px |

---

## Layer 4B — Sub-Tab Bar

**Position:** Below Quick Summary Bar  
**Height:** ~36px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Tab | State | Style |
|-----|-------|-------|
| Related | Active (default) | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Details | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |

---

## Layer 5 — Two-Column Body

**Layout:** CSS Grid `[1fr] [320px]`  
**Gap:** 16px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · padding `12px 16px`  
> **Section header:** text `#F0F0F0` · 13px · font-weight 600 · collapse toggle `▼` `#A0A0A0`  
> **Field label:** `#A0A0A0` · 11px  
> **Field value:** `#F0F0F0` · 13px  
> **Link value:** `#F5C800` · hover underline  
> **Edit pencil icon:** `#A0A0A0` · hover `#F5C800` · appears on row hover

---

## Tab: Related

### Related Card 1 — Approval History

**Header:** "Approval History (0)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** orange/amber approval icon · left of header  
**Count badge:** `(0)` · `#A0A0A0`

**Empty state:**
- No rows
- No action buttons visible (approval not yet triggered)
- Card height collapses to header only

**Populated state (when approvals exist):**

| Column | Width | Style |
|--------|-------|-------|
| Step | ~40px | `#A0A0A0` · 11px |
| Approver | flex | User link · `#F5C800` |
| Status | ~80px | Badge per token |
| Date | ~120px | DateTime · `#A0A0A0` |
| Comments | flex | `#F0F0F0` · 12px |

**Approval Status Badge Tokens:**

| Status | Background | Text |
|--------|-----------|------|
| Approved | `#0D2200` | `#52C41A` |
| Pending | `#2D2600` | `#F5C800` |
| Rejected | `#2D0000` | `#FF4D4F` |
| Not Started | `#2E2E2E` | `#A0A0A0` |

---

### Related Card 2 — Files

**Header:** "Files (0)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** file/document icon · left of header  
**Action button:** `[ Add Files ]` · Outline · border `#2E2E2E` · text `#A0A0A0` · hover border `#F5C800` · hover text `#F5C800` · float right

**Upload drop zone:**
- Background: `#141414`
- Border: `1.5px dashed #2E2E2E` · border-radius `6px`
- Height: ~60px
- Center content: upload icon `#A0A0A0` + "Upload Files" text `#F5C800` (clickable link)
- Divider text: "Or drop files" · `#A0A0A0` · 11px · centered

**Populated state (when files attached):**

| Column | Width | Style |
|--------|-------|-------|
| File icon | 20px | type-based color icon |
| File name | flex | link `#F5C800` · hover underline |
| Size | ~60px | `#A0A0A0` · 11px |
| Date uploaded | ~120px | DateTime `#A0A0A0` · 11px |
| Download | 24px | icon `#A0A0A0` · hover `#F5C800` |
| Delete | 24px | icon `#A0A0A0` · hover `#FF4D4F` |

---

### Related Card 3 — Time Sheet History

**Header:** "Time Sheet History (5)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** clock/history icon · left of header

**Column layout:** 5 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Date | Date | ~140px | DateTime · `#A0A0A0` · 11px |
| Field | Field | ~120px | `#F0F0F0` · 12px |
| User | User | ~140px | User link · `#F5C800` |
| Original Value | Original Value | ~120px | `#A0A0A0` · 12px |
| New Value | New Value | flex | `#F0F0F0` · 12px |

**Sample data rows (from screenshot):**

| Date | Field | User | Original Value | New Value |
|------|-------|------|----------------|-----------|
| 08/05/2026, 22:47 | Status | Checkal Kikami *(link)* | New | Approved |
| 22/04/2026, 10:22 | JA & Territory | Tegur Atma Indrawan *(link)* | — | JKT ST April 2026 |
| 22/04/2026, 10:22 | JA & JJE | Tegur Atma Indrawan *(link)* | — | April 2026 |
| 22/04/2026, 10:22 | Service Territory | Tegur Atma Indrawan *(link)* | — | JKT ST |
| 22/04/2026, 13:55 | Created | Tegur Atma Indrawan *(link)* | — | — |

**Footer:** "View All" · `#F5C800` · 11px · centered · hover underline

**Row styles:**
- Row bg: `#1A1A1A`
- Row hover: `#242424`
- Row border-bottom: `1px solid #2E2E2E`
- User link: `#F5C800` · hover underline

---

### Related Card 4 — Time Sheet Entries

**Header:** "Time Sheet Entries (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** list/entry icon · left of header  
**Action button:** `[ New ]` · Outline · border `#2E2E2E` · text `#A0A0A0` · hover border `#F5C800` · hover text `#F5C800` · float right

**Column layout:** 5 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Name | Name | ~80px | Link · `#F5C800` |
| Subject | Subject | flex | `#F0F0F0` · 13px |
| Start Time | Start Time | ~140px | DateTime · `#A0A0A0` · 12px |
| Duration | Duration | ~80px | Number `#F0F0F0` · right-aligned |
| Actions | — | 32px | Row action dropdown `▾` · `#A0A0A0` |

**Sample data rows (from screenshot):**

| Name | Subject | Start Time | Duration |
|------|---------|-----------|---------|
| TSE-1001 | Preparation | 22/04/2026, 10:25 | 1.00 |
| TSE-1002 | Traveling | 22/04/2026, 10:14 | 2.00 |
| TSE-1003 | Waiting during job | 22/04/2026, 10:25 | 1.00 |
| TSE-1004 | Remove | 22/04/2026, 10:25 | 1.00 |
| TSE-1005 | Inspection & Measuring | 22/04/2026, 10:26 | 1.00 |
| TSE-1006 | Install & Completed | 22/04/2026, 10:25 | 1.00 |

**Footer:** "View All" · `#F5C800` · 11px · centered · hover underline

**Row styles:**
- Row bg: `#1A1A1A`
- Row hover: `#242424`
- Row border-bottom: `1px solid #2E2E2E`
- Name link: `#F5C800` · hover underline
- Duration: `#F0F0F0` · font-weight 500 · right-aligned

**Horizontal scroll indicator:** thin scrollbar at card bottom · bg `#0D0D0D` · thumb `#2E2E2E` · hover thumb `#F5C800`

---

## Tab: Details

### Section 1 — Information

**Collapse toggle:** `▼` · section header "Information" · `#F0F0F0` · 13px · font-weight 600

**2-column layout**

#### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Time Sheet Start Date | 22/04/2026 | Date · `#F0F0F0` · edit pencil on hover |
| Status | **Approved** | Badge: bg `#0D2200` · text `#52C41A` · edit pencil |
| Time Sheet Entry Count | 0 | Numeric · `#F0F0F0` |
| Currency ISO Code | IDR - Indonesian Rupiah | Text · `#F0F0F0` |
| Last List Code | BJALU51 | Text · `#F0F0F0` |

#### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Time Sheet End Date | 22/04/2026 | Date · `#F0F0F0` · edit pencil on hover |
| Duration | 10.00 | Numeric (hours) · `#F0F0F0` |
| Service Resource | Sulaiman Nurkholis *(link)* | User link · `#F5C800` |
| Service Territory | JKT ST | Text · `#F0F0F0` |
| Owner | SULAIMAN NURKHOLIS *(link)* | User link · `#F5C800` · ALL CAPS |

---

### Section 2 — System Information

**Collapse toggle:** `▼` · section header "System Information" · `#F0F0F0` · 13px · font-weight 600

**2-column layout**

#### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Created By | Tegur Atma Indrawan *(link)* · 22/04/2026, 10:22 | User link `#F5C800` + DateTime `#A0A0A0` inline |
| Last Modified By | M. Thoriqul Anwar Kikami *(link)* · 21/05/2026, 14:55 | User link `#F5C800` + DateTime `#A0A0A0` inline |

#### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| JA & JJE | April 2026 | Text · `#F0F0F0` |
| JA & JJE Territory | JKT ST April 2026 *(link)* | Link · `#F5C800` |
| Work Order | 01/22/996 *(link)* | **WO link** · `#F5C800` · bold — key link back to Work Order |
| Work Order ID | {WOMgf00000FImTBOA} | Internal SF ID · `#A0A0A0` · 12px · monospace |

---

## Column 2 — Activity Panel

**Width:** ~320px  
**Background:** `#1A1A1A`  
**Border:** `1px solid #2E2E2E`  
**Border-radius:** `6px`  
**Scroll:** Independent vertical scroll

### Activity Panel Header

**Label:** "Activity" · `#F0F0F0` · 14px · font-weight 600  
**Position:** top of right column · sticky

### Activity Filter Bar

**Background:** `#141414`  
**Border-bottom:** `1px solid #2E2E2E`  
**Height:** ~36px

Icon button groups (left to right):

| Button Group | Icons | Style |
|-------------|-------|-------|
| Email | envelope icon + `▾` | bg `#1A1A1A` · icon `#52C41A` · hover bg `#242424` |
| Task | checkmark icon + `▾` | bg `#1A1A1A` · icon `#F5C800` · hover bg `#242424` |
| Log | log icon + `▾` | bg `#1A1A1A` · icon `#60A5FA` · hover bg `#242424` |
| Event | calendar icon + `▾` | bg `#1A1A1A` · icon `#A0A0A0` · hover bg `#242424` |
| More ▾ | additional types | bg `#1A1A1A` · icon `#A0A0A0` |

**Filter chips (right side):**

| Chip | Detail |
|------|--------|
| Filters: All time | dropdown `▾` · `#A0A0A0` · 11px |
| All activities | dropdown `▾` · `#A0A0A0` · 11px |
| All types | dropdown `▾` · `#A0A0A0` · 11px |
| Refresh icon | `#A0A0A0` · hover `#F5C800` |

**Links row:** "Refresh · Expand All · View All" · `#F5C800` · 11px · hover underline

---

### Upcoming & Overdue Section

**Header:** "Upcoming & Overdue" · `#F0F0F0` · 13px · font-weight 600 · collapse `▼`

**Empty state:**
- Text: "No activities to show." · `#A0A0A0` · 12px · centered
- Sub-text: "Get started by sending an email, scheduling a task, and more." · `#A0A0A0` · 11px · centered

---

### Filters Hint

**Text:** "To change what's shown, try changing your filters." · `#A0A0A0` · 11px · centered  
**Icon:** info circle `#A0A0A0`

---

### Show All Activities Button

| Component | Detail |
|-----------|--------|
| Button label | "Show All Activities" |
| Style | Full-width · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · border-radius `4px` · height `32px` |
| Hover | bg `#C9A100` |

---

## Work Order Link — Key Integration Point

The Time Sheet links to its parent Work Order via two fields in the **Details tab → System Information section**:

| Field | Value | Purpose |
|-------|-------|---------|
| **Work Order** | 01/22/996 *(link)* | Human-readable WO number · navigates to WO record |
| **Work Order ID** | `{WOMgf00000FImTBOA}` | Salesforce internal ID · used for API/system reference |

**Navigation flow:**
1. From WO record → Feed tab → Timesheet Approval button → opens Time Sheet record (TST-XXXXXXX)
2. From Time Sheet record → Details tab → System Information → Work Order link → back to WO record
3. WO record → Related list → Time Sheets section → lists all linked TST records

---

## Time Sheet Entry — Record Detail Spec

Each row in **Time Sheet Entries** is its own child record (TSE-XXXX):

| Field | Type | Style |
|-------|------|-------|
| Name | Auto-number | Link `#F5C800` |
| Subject | Text | `#F0F0F0` · options: Preparation · Traveling · Waiting during job · Remove · Inspection & Measuring · Install & Completed |
| Start Time | DateTime | `#A0A0A0` · format DD/MM/YYYY, HH:MM |
| Duration | Decimal | `#F0F0F0` · right-aligned · unit: hours |
| Time Sheet | Lookup | Parent TST link · `#F5C800` |
| Work Order | Lookup | Grandparent WO link · `#F5C800` |

**Standard Subject values for UT Mechanic Time Sheets:**

| # | Subject | Typical Duration |
|---|---------|-----------------|
| 1 | Preparation | 1.00 hr |
| 2 | Traveling | 2.00 hr |
| 3 | Waiting during job | 1.00 hr |
| 4 | Remove | 1.00 hr |
| 5 | Inspection & Measuring | 1.00 hr |
| 6 | Install & Completed | 1.00 hr |

---

## Approval Flow

### Status Machine

```
New → [Submit for Approval] → Pending → [Approve] → Approved
                                      → [Reject]  → Rejected → [Resubmit] → Pending
```

### Approval History Entry

| Field | Detail |
|-------|--------|
| Step | Numeric · 11px · `#A0A0A0` |
| Approver | User lookup · link `#F5C800` |
| Status | Badge per token (Approved/Pending/Rejected) |
| Date | DateTime · `#A0A0A0` · 11px |
| Comments | Optional text · `#F0F0F0` · 12px |

### Status Badge Tokens (full set)

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| New | `#1A1A1A` | `#A0A0A0` | `#2E2E2E` |
| Approved | `#0D2200` | `#52C41A` | `#0D2200` |
| Pending | `#2D2600` | `#F5C800` | `#2D2600` |
| Rejected | `#2D0000` | `#FF4D4F` | `#2D0000` |

---

## Interaction Patterns

### Submit for Approval

1. Status = "New" → Edit dropdown shows "Submit for Approval"
2. Click → confirmation modal: "Submit TST-2551959 for approval?"
3. Confirm → Status badge changes to "Pending" `#F5C800`
4. Approval History card populates with Step 1 row
5. Success toast: bg `#1A1A1A` · left-border `4px solid #F5C800` · "Time Sheet submitted for approval"

### Approve / Reject

1. Approver receives notification
2. Opens Time Sheet record
3. Edit dropdown → "Approve" or "Reject"
4. Approve → Status "Approved" `#52C41A` · Approval History row updated
5. Reject → Status "Rejected" `#FF4D4F` · comment required modal
6. Toast per action

### Add Time Sheet Entry (New)

1. Click `[ New ]` button on Time Sheet Entries card
2. Quick-create modal opens: Subject (dropdown) · Start Time (datetime) · Duration (number)
3. Save → new TSE row appears at bottom of list · count increments
4. Duration total recalculates in Quick Summary Bar

### Upload File

1. Click `[ Add Files ]` or drag file to drop zone
2. Drop zone border highlights: `#F5C800` · bg `rgba(245,200,0,0.08)`
3. Upload progress bar: `#F5C800` fill · `#2E2E2E` track · inside drop zone
4. Success: file appears in Files list · count increments

### Inline Edit Field

1. Hover field row → pencil icon `#A0A0A0` appears at right
2. Click pencil → field converts to input · border `#F5C800` · bg `#141414`
3. Tab / Enter → save · click away → cancel
4. Save: inline checkmark `#52C41A` · value updates

### Sub-Tab Switch (Related ↔ Details)

1. Click tab → active: text `#F5C800` · border-bottom `2px solid #F5C800`
2. Content swaps: opacity 0→1 · 150ms ease
3. URL hash: `#related` / `#details`

---

## Color & Status Tokens

| Token | Text | Background | Usage |
|-------|------|-----------|-------|
| Approved | `#52C41A` | `#0D2200` | Status: Approved |
| New | `#A0A0A0` | `#1A1A1A` | Status: New |
| Pending | `#F5C800` | `#2D2600` | Status: Pending Approval |
| Rejected | `#FF4D4F` | `#2D0000` | Status: Rejected |
| IDR Currency | `#F0F0F0` | — | Currency display |
| WO Link | `#F5C800` | — | Work Order reference |

---

## Typography Scale

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Record Number | 22px | 600 | `#F5C800` | TST title bar number |
| Summary Label | 11px | 400 | `#A0A0A0` | Quick summary bar labels |
| Summary Value | 13px | 500 | `#F0F0F0` | Quick summary bar values |
| Summary Link | 13px | 500 | `#F5C800` | Summary clickable values |
| Section Header | 13px | 600 | `#F0F0F0` | Collapsible section titles |
| Tab Active | 13px | 600 | `#F5C800` | Related / Details active tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Inactive tab |
| Field Label | 11px | 400 | `#A0A0A0` | Form field labels |
| Field Value | 13px | 500 | `#F0F0F0` | Form field values |
| Link Value | 13px | 500 | `#F5C800` | Linked record values |
| Table Header | 11px | 600 | `#A0A0A0` | Column headers in related cards |
| Table Cell | 12px | 400 | `#F0F0F0` | Table cell values |
| Timestamp | 11px | 400 | `#A0A0A0` | DateTime values in history |
| Badge | 11px | 500 | per token | Status pills |
| Button Primary | 13px | 600 | `#0D0D0D` | "Show All Activities" on `#F5C800` |
| Button Outline | 13px | 400 | `#A0A0A0` | New Contact, New Note, Edit |
| SF Internal ID | 12px | 400 | `#A0A0A0` | Work Order ID monospace |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default row | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Row hover | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Field edit active | `#141414` | `#F5C800` | `#F0F0F0` |
| Active tab | — | `#F5C800` (bottom 2px) | `#F5C800` |
| File drop zone default | `#141414` | `1.5px dashed #2E2E2E` | — |
| File drop zone active | `rgba(245,200,0,0.08)` | `1.5px dashed #F5C800` | — |
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
│     ├── UTLogo (#F5C800)
│     ├── SearchBar
│     └── IconCluster (New, Help, Setup, Notifications, Avatar)
│
├── Layer 2: AppBar (Console + Tabs)
│     ├── ConsoleLabel ("UT Service Console")
│     ├── TimeSheetsTab  ← active #F5C800
│     └── PersonTabs[] (Dagan, 0/1757, Justiran, Drik, ISSA1, Randi, Suhara, Ghani, PSP4P, 015227, Cara G, Cara M, Closed, TST-25…)
│
├── Layer 3: TitleBar
│     ├── Breadcrumb ("Time Sheet")
│     ├── RecordNumber ("TST-2551959") ← #F5C800 22px
│     └── ActionButtons
│           ├── NewContact
│           ├── NewNote
│           └── EditDropdown (Edit · Clone · Delete · Change Owner)
│
├── Layer 4: QuickSummaryBar
│     ├── ServiceResource (link #F5C800)
│     ├── StartDate
│     ├── EndDate
│     ├── TotalDuration
│     └── StatusBadge ("Approved" #52C41A)
│
├── Layer 4B: SubTabBar
│     ├── RelatedTab  ← active
│     └── DetailsTab
│
└── Layer 5: BodyGrid (2 columns)
      ├── Column1: MainContent
      │     ├── [RelatedTab]
      │     │     ├── ApprovalHistoryCard (0 rows / populated)
      │     │     ├── FilesCard (upload zone + file list)
      │     │     ├── TimeSheetHistoryCard (5 rows + View All)
      │     │     │     └── Columns: Date · Field · User · Original Value · New Value
      │     │     └── TimeSheetEntriesCard (6+ rows + New button)
      │     │           └── Columns: Name · Subject · Start Time · Duration · Actions
      │     │
      │     └── [DetailsTab]
      │           ├── InformationSection
      │           │     ├── LeftColumn (Start Date, Status, Entry Count, Currency ISO, Last List Code)
      │           │     └── RightColumn (End Date, Duration, Service Resource, Service Territory, Owner)
      │           └── SystemInformationSection
      │                 ├── LeftColumn (Created By + date, Last Modified By + date)
      │                 └── RightColumn (JA & JJE, JA & Territory, Work Order link ← KEY, Work Order ID)
      │
      └── Column2: ActivityPanel
            ├── ActivityHeader ("Activity")
            ├── FilterBar (Email · Task · Log · Event · More + filter chips)
            ├── UpcomingOverdueSection (empty state)
            ├── FilterHint
            └── ShowAllActivitiesButton ← primary #F5C800
```

---

## Document Version

**Version 1.0** — UT Service Console Time Sheet Work Order Design  
**Record:** Time Sheet (TST) linked to Work Order (WO)  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-WorkOrder.md  
**Child Records:** Time Sheet Entries (TSE-XXXX)  
**Updated:** 2026-05-26
