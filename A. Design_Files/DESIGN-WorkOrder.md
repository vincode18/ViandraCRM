# Work Order — 2-Column Agent UI Design

> **System:** UT Service Console  
> **Record Type:** Work Order Detail View  
> **Parent Record:** Case (linked via Case field)  
> **Layout:** 5-Layer Structure · 2-Column Body  
> **Reference:** UT Service Console screenshots (Work Order detail page)  
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
| `--color-success` | `#52C41A` | Closed / complete status |

### Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)           │  bg: #0D0D0D · border-bottom: 2px #F5C800
├─────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + Open Tabs / Recent History) │  bg: #1A1A1A · border-bottom: #2E2E2E
├─────────────────────────────────────────────────────────────────┤
│  LAYER 3 — WO Title Bar (WO Number, Meta, Action Buttons)       │  bg: #1A1A1A · border-bottom: #2E2E2E
├─────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Sub-Tab Bar (Details · Feed)                         │  bg: #141414 · active-tab: #F5C800
├────────────────────────────────────┬────────────────────────────┤
│  LAYER 5 — COL 1 (Main Form)       │  LAYER 5 — COL 2 (Related) │  bg: #0D0D0D
│  General · Ability Confirmation    │  Knowledge / Filters       │  cards: #1A1A1A
│  RC Info · Additional Info         │  Asset Details             │  border: #2E2E2E
│  WO Parameters · SA Info           │  Work Plans                │
│  Description · System Info         │  Work Steps                │
│                                    │  Service Appointments      │
│                                    │  Time Sheet Entries        │
│                                    │  Problems · Svc Products   │
│                                    │  Parts Requests            │
│                                    │  WO History                │
│                                    │  Opportunities · SMR       │
└────────────────────────────────────┴────────────────────────────┘
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

**Active Tab (from screenshot):** `01175378 (WO)` or similar WO tab — chip bg `#2D2600` · text `#F5C800`

---

## Layer 3 — Work Order Title Bar

**Position:** Below Layer 2  
**Height:** ~72px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

### Left Section — WO Identity

```
[🟨 Work Order icon — #F5C800]
Work Order                        ← 11px, #A0A0A0
01175-1508                        ← 22px, #F5C800, font-weight 600

Owner: UT Integration  ·  Case: 01532785  ·  Status: Cancelled
Start Date: 26/05/2026, 07:00  ·  End Date: 26/05/2026, 07:00
Subject: GD829 R&I STEERING VALVE
```

| Field | Value | Style |
|-------|-------|-------|
| Record label | Work Order | 11px · `#A0A0A0` |
| WO Number | 01175-1508 | 22px · `#F5C800` · font-weight 600 |
| Owner | UT Integration | 12px · `#F0F0F0` · link `#F5C800` |
| Case | 01532785 | 12px · link `#F5C800` |
| Status | Cancelled | badge bg `#2D0000` · text `#FF4D4F` |
| Start Date | 26/05/2026, 07:00 | 12px · `#A0A0A0` |
| End Date | 26/05/2026, 07:00 | 12px · `#A0A0A0` |
| Subject | GD829 R&I STEERING VALVE | 13px · `#F0F0F0` |

### Right Section — Action Buttons

> Visible on both **Details** and **Feed** tabs — always anchored top-right of Layer 3

| Button | Style | Action |
|--------|-------|--------|
| Add TSR | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#F5C800` | Add TSR score record |
| Book Appointment | Outline · same hover | Open appointment scheduler |
| Approve / Reject Work Order | Outline · same hover | Approval workflow trigger |
| Generate PDF | Outline · same hover | Export WO as formatted PDF |
| Enrich Parts Request | Outline · same hover | Enrich / update parts request data |
| Send Job Data to SAP | **Primary filled** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` | Push WO + job data to SAP |

---

## Layer 4 — Sub-Tab Bar

**Position:** Below Layer 3  
**Height:** ~36px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Tab | State | Style |
|-----|-------|-------|
| Details | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |
| Feed | **Active** | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |

> When **Feed** tab is active, a dedicated **Feed Function Button Bar** appears immediately below the sub-tab bar (before the body content).

### Feed Function Button Bar

**Position:** Below sub-tab strip · only visible when Feed tab is active  
**Height:** ~36px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`  
**Overflow:** horizontal scroll with custom scrollbar if buttons overflow viewport

```
[ Book Appointment ] [ Approve / Select W... ] [ Generate PDF ] [ Enrich Parts Request ] [ Send Job Data to S... ] [ Timesheet Approval ] [ Validate Checksheet ] [ Update TSR Score ] [ Post ] [ Debug EMR ] [ Debug OO ]
```

| Button | Style | Action |
|--------|-------|--------|
| Book Appointment | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#F5C800` · border-radius `4px` · 11px · padding `4px 10px` | Open appointment scheduling modal |
| Approve / Select W... | Outline · same hover | Approve or select work order workflow step |
| Generate PDF | Outline · same hover | Export WO as PDF document |
| Enrich Parts Request | Outline · same hover | Pull and enrich parts request data |
| Send Job Data to S... | Outline · same hover | Push job data to SAP system |
| Timesheet Approval | Outline · same hover | Open timesheet approval flow |
| Validate Checksheet | Outline · same hover | Run checksheet validation process |
| Update TSR Score | Outline · same hover | Open TSR score update form |
| Post | Outline · same hover | Post / publish WO update to feed |
| Debug EMR | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#FB923C` | Debug EMR integration (dev/admin) |
| Debug OO | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#FB923C` | Debug OO integration (dev/admin) |

**Button Group Styling:**
- Height: 26px · border-radius `4px` · font-size 11px · font-weight 500
- Default: border `1px solid #2E2E2E` · text `#A0A0A0` · bg `transparent`
- Hover: border `#F5C800` · text `#F5C800` · bg `rgba(245,200,0,0.06)`
- Active/pressed: border `#C9A100` · text `#C9A100` · bg `rgba(245,200,0,0.12)`
- Debug buttons hover: border `#FB923C` · text `#FB923C` · bg `rgba(251,146,60,0.06)`
- Gap between buttons: 6px
- Button strip scrollbar: 4px · thumb `#2E2E2E` · hover `#F5C800`

---

## Layer 5 — Two-Column Body

**Layout:** CSS Grid `[1fr] [320px]`  
**Gap:** 12px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card / Section defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · shadow `0 2px 8px rgba(0,0,0,0.6)`  
> **Section header:** text `#F5C800` · font-size 13px · font-weight 600 · border-bottom `1px solid #2E2E2E` · collapse toggle icon `#F5C800`  
> **Field label:** text `#A0A0A0` · font-size 11px  
> **Field value:** text `#F0F0F0` · font-size 13px  
> **Link value:** color `#F5C800` · hover underline  
> **Section divider:** `1px solid #2E2E2E`  
> **Row hover:** bg `#242424`

---

### Column 1 — Main Detail Form

**Width:** Flexible `1fr`  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

---

#### 1A. General

> Collapsible card · header `#F5C800` · bg `#1A1A1A`

**Left Sub-Column**

| Field | Value |
|-------|-------|
| Work Order Number | 3-120014 |
| System Status | CLSD PRT CSER GVPS MACV PRC |
| Case | 3-122785 *(link)* |
| Parent Work Case | — |
| Account | PUTRA PERKASA ABADI *(link)* |
| Contact | — |
| Subject | GD829 R&I STEERING VALVE |
| Description | GD829 R&I STEERING VALVE |
| Type | — |
| Actual SMR | 23094 |
| SMR Reducer | — |
| Location | — |
| Last Streaming Date | 25/05/2026, 00:04 |
| Case Number | 01532785 |
| SAP Work Order Number | 73028145 |
| Start Date | 26/05/2026 |
| End Date | 24/06/2026 |
| Open Time Release WO | 27/04/2026, 09:45 |
| Lead Time 0 | — |
| Aging WO Close | 21 |
| WO Key | ☐ |
| AR File Size | — |
| LT-AR | 22 |
| SA Compared | 14/06/2026 |

**Right Sub-Column**

| Field | Value |
|-------|-------|
| Status | Cancelled |
| Confirm Arrival | ☐ |
| Reason | — |
| Unit Shared | GD825A-2 / S3 – 13405 *(link)* |
| Serial Number | 13405 |
| Unit Model | GD825A-2 |
| Case Type | Schedule |
| Call Type | Service |
| Call Sub Type | FMC – PCR&OVH |
| Date/Time Completed | 06/05/2026, 13:42 |
| Open Time Order from SAP | 27/04/2026, 09:45 |
| Date/Time Pending Confirmation | 25/05/2026, 00:54 |
| Approved By | Fariindra Mika Pradesta *(link)* |
| Approved Date | 06/05/2026 |
| FMR Name | — |
| MACType | ☐ |
| AR/FMC | ☐ |
| WO Revenue Type | — |
| Open Time to AR Part | — |
| Date Time From Request Report | — |

---

#### 1B. Ability Confirmation

> Collapsible card · same card styling

| Field | Value |
|-------|-------|
| Status | — |
| Pertimbangan | — |

---

#### 1C. RC Information

> Collapsible card

| Field | Value |
|-------|-------|
| RC No letter | — |
| SAP Work Order Number RC | 73028145 |
| QK-SR Code | — |
| Form JS Cver | — |
| RC Type | — |
| Close Cver | — |
| Online Cver | — |
| QK Status | — |
| Done Status | No |
| Owner Status | — |

---

#### 1D. WorkOrder Parameters

> Collapsible card · visible on scroll (screenshot 2)

| Field | Value |
|-------|-------|
| SAP Work Order Summary | ☐ |
| Checksheet Done | ☐ |
| PA Accuracy | ☐ |
| PA Accuracy Percentage | — |

---

#### 1E. Additional Information

> Collapsible card · screenshot 2

| Field | Value |
|-------|-------|
| TSR (Daily Completion Score) | — |
| TSR (Root Cause Score) | — |
| TSR (Summary Score) | — |
| TSR Overall Score | — |
| Related Files URL | https://unitedtractors.lightning.force.com/lightning/r/WorkOrder/0WONg00000HoDpI/related/AttachedContent DocumentsView *(link)* |
| TSR More Lace Part No | — |
| Service Territory Name | Tanjung Enim PPA |
| Local User | ☐ |
| Local User 1 | 3.00 |
| Local User 1 Accounts | ☐ |
| Local User 5 | ☐ |
| Local User 5 Accounts | ☐ |

---

#### 1F. SA Information

> Collapsible card · screenshot 2

| Field | Value |
|-------|-------|
| First SA to Target | 0BgMg00003PoNAO *(link)* |
| First SA to In Progress | 0BgMg00003PoNAO *(link)* |
| First SA to Complete | 0BgMg00003PoNAO *(link)* |
| Begin Information Form | ☐ |

---

#### 1G. Description

> Collapsible card · single free-text field

| Field | Value |
|-------|-------|
| Last Work Plan | *(empty / free text)* |

---

#### 1H. System Information

> Collapsible card · screenshot 2 — bottom of form

| Field | Value |
|-------|-------|
| Created By | UT Integration *(link)* |
| Created Date | 27/04/2026, 09:45 |
| Last Modified By | UT Integration *(link)* |
| Last Modified Date | 19/05/2026, 14:55 |

---

### Column 2 — Related Panels (Right Sidebar)

**Width:** ~320px (fixed right)  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

> Each panel is a collapsible card with header text `#F5C800` · bg `#1A1A1A` · border `#2E2E2E` · collapse icon `#F5C800`

---

#### 2A. Knowledge

> Filter + search panel at top of sidebar

**Sub-components:**
- `[ Filters ]` — button · bg `#F5C800` · text `#0D0D0D` · font-weight 600
- Search bar — placeholder "Search Knowledge…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800`

---

#### 2B. Asset Details

> Collapsible card · header `#F5C800`

| Field | Value |
|-------|-------|
| Asset Name | GD825A-2 / S3 – 13405 *(link)* |
| Equipment Number | 232656 |
| Serial Number | 13405 |
| Unit Model | GD825A-2 |
| Unit Code | GD-829 |
| Material Number | GD825A-2 / S3 |
| SMR | 24043.0 |
| Service Area | Tanjung Enim PPA |
| Measurement Field | hm |
| Assessment Build | hm |
| Measuring Date | 25/05/2026, 20:04 |
| Warranty Start Date | 21/01/2022 |
| Warranty End Date | 21/01/2023 |
| In Warranty | ☐ |
| Plant | TJE |

---

#### 2C. Work Plans (0)

> Empty state · icon `#2E2E2E` · text `#A0A0A0`  
> `[ + ]` button top-right · bg `#F5C800` · text `#0D0D0D`

---

#### 2D. Work Steps (0)

> Empty state · same styling as Work Plans

---

#### 2E. Service Appointments (2)

> Compact list · 2 records visible · `[ View All ]` link color `#F5C800`

| Field | Value |
|-------|-------|
| SA ID | 28-2085811 *(link)* |
| Account | PUTRA PERKASA ABADI *(link)* |
| Status | Past Activity Match |
| TE | — |
| SA Operations | IT – FMC, Performance Match |
| IT Dispatch | 19 |

**[ View All ]** — text `#F5C800`

---

#### 2F. Time Sheet Entries (3+)

> Compact list · `[ View All ]` link

| Entry | SA | Operation | Start Time |
|-------|----|-----------|------------|
| TST-009 | SA-2085811 *(link)* | Operation Number: 0010 · Operation Description: Preparation | 25/04/2026, 12:21 |
| TST-009 | SA-2085811 *(link)* | Operation Number: 0020 · Operation Description: Trending · Duration: 0 | 25/04/2026, 12:27 |
| TST-007 | SA-2085811 *(link)* | Operation Number: 0030 · Operation Description: Waiting dur\_ngke · Duration: 0 | 25/04/2026, 12:27 |

**[ View All ]**

---

#### 2G. Problems (0)

> Empty state · icon `#2E2E2E` · text `#A0A0A0`

---

#### 2H. Service Products (0)

> Empty state · same styling

---

#### 2I. Parts Requests (0)

> Empty state · same styling

---

#### 2J. Work Order History (3+)

> Compact audit trail · `[ View All ]`

| Date | Field | User | Original → New |
|------|-------|------|----------------|
| 06/05/2026, 14:50 | Status | UT Integration | Complete → Cancelled |
| 19/05/2026, 13:42 | Actual Ma\*End Date | UT Integration | 27/04/2026, 07:00 → 04/05/2026, 12:42 |
| 19/05/2026, 13:11 | Actual Ma\*End Date | UT Integration | 27/04/2026, 07:00 → 21/04/2026, 07:00 |

> Timeline style · event dot `#F5C800` · connector line `#2E2E2E` · timestamp `#A0A0A0` · text `#F0F0F0`

**[ View All ]**

---

#### 2K. Opportunities (0)

> Empty state · icon `#2E2E2E` · text `#A0A0A0`

---

#### 2L. SMR (0)

> Empty state · same styling

---

#### 2M. Files (0)

> Upload zone · border `2px dashed #F5C800` · bg `#141414`

```
[ ⬆ Upload Files ]    ← bg #F5C800 · text #0D0D0D · font-weight 600
   — or drop files —  ← text #A0A0A0
```

> `(0 drag files)` count label · text `#A0A0A0`

---

#### 2N. Articles (0)

> Empty state · same styling

---

#### 2O. Service Records (0)

> Empty state · same styling

---

## Interaction Patterns

### Book Appointment Button
Opens a modal / side panel:
- Date picker · bg `#1A1A1A` · selected date bg `#F5C800` · text `#0D0D0D`
- Time slot grid · hover bg `#242424` · selected bg `#2D2600` · border `#F5C800`
- Confirm button · bg `#F5C800` · text `#0D0D0D`

### Send Info Data to SAP Button
Triggers async push:
- Loading spinner — stroke `#F5C800`
- Success toast · bg `#1A1A1A` · left-border `4px solid #52C41A` · text `#F0F0F0`
- Error toast · left-border `4px solid #FF4D4F`

### Generate PDF Button
Exports current WO view:
- [ ] PDF — formatted work order report
- [ ] Includes: General, Asset, SA, Time Sheet, History

### Tab: Details vs Feed
- **Details** — all structured fields (current view)
- **Feed** — chronological activity log, chatter, emails, notes (see Feed Tab Body below)

---

## Feed Tab — Body Design

> Activated when **Feed** sub-tab is selected. The Feed Function Button Bar appears above this body area. Column 2 (Related sidebar) remains unchanged.

**Layout:** Same 2-column grid `[1fr] [320px]` · Col 1 switches to Feed view · Col 2 remains Related panel

---

### Feed Col 1 — Feed Body

**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

#### Feed Sort & Search Bar

**Position:** Top of feed column · below function button bar  
**Height:** ~36px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Component | Detail |
|-----------|--------|
| Sort dropdown | "Most Recent Activity ▾" · bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` · 11px |
| Search feed input | Placeholder: "Search this feed…" · bg `#141414` · border `#2E2E2E` · focus-border `#F5C800` · text `#F0F0F0` · 11px · width ~240px |
| Filter icon | icon `#A0A0A0` · hover `#F5C800` |
| Refresh icon | icon `#A0A0A0` · hover `#F5C800` |

---

#### Feed Post / Activity Item

> Each feed entry is a card. Cards stack vertically with 8px gap.

**Card defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · padding `12px`

```
┌──────────────────────────────────────────────────────────────┐
│  [Avatar 28px]  Actor Name → Recipient · timestamp           │  ← header row
│                 Action description text                      │  ← body
│  ─────────────────────────────────────────────────────────── │
│  Like  ·  Comment                              [ ▼ expand ] │  ← footer
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Write a comment…                                    │    │  ← comment input
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

**Feed Item Components:**

| Component | Detail |
|-----------|--------|
| Avatar | 28px circle · bg `#2E2E2E` · initials `#F5C800` · font-size 10px |
| Actor name | 12px · `#F5C800` · font-weight 500 · hover underline |
| Arrow separator `→` | 11px · `#A0A0A0` |
| Recipient | 12px · `#F5C800` · hover underline |
| Timestamp | 11px · `#A0A0A0` · right-aligned (e.g. "21 May 2025 at 13:11") |
| Action text | 13px · `#F0F0F0` (e.g. "Approval Notes added") |
| Attachment chip | bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · icon `#F5C800` · 11px · hover border `#F5C800` |
| Like button | "Like" · 11px · `#A0A0A0` · hover `#F5C800` · active text `#F5C800` + icon filled |
| Comment button | "Comment" · 11px · `#A0A0A0` · hover `#F5C800` |
| Expand `▼` icon | right-aligned · `#A0A0A0` · hover `#F5C800` · toggles thread |
| Divider | `1px solid #2E2E2E` between footer and comment input |
| Comment input | Placeholder: "Write a comment…" · bg `#141414` · border `#2E2E2E` · focus-border `#F5C800` · text `#F0F0F0` · border-radius `4px` · full width · 11px |
| "View more details" link | 11px · `#F5C800` · hover underline · below long post bodies |

---

#### Feed Item Types

| Type | Icon Color | Body Style | Example |
|------|-----------|------------|--------|
| Approval / Note | `#F5C800` circle | text `#F0F0F0` | "Approval Notes added" |
| TSR Attachment | `#F5C800` document | attachment chip | "TSR Attachment" |
| Info created | `#52C41A` circle | text `#F0F0F0` | "created a one additional information" |
| RFL note | `#F5C800` circle | text `#F0F0F0` | "RFL" free-text note |
| System event | `#A0A0A0` circle | text `#A0A0A0` italic | Auto-generated log entries |
| Email | `#60A5FA` envelope | text `#F0F0F0` | Outbound/inbound email thread |

**Feed Item Data (from screenshot):**

| Actor | Action | Timestamp |
|-------|--------|----------|
| Tegar Alnu Indrawan | → PT United Tractors Tbk Only · Approval Notes added | 21 May 2025 at 13:11 |
| EM_Attachment? / Tegar Alnu Indrawan | created a one additional information | 21 May 2025 at 03:07 |
| TSR Attachment | *(attachment chip)* | — |
| NG – Tegar Alnu Indrawan | created a one additional information | 21 May 2025 at 03:49 |
| RFL | *(free-text note)* | — |

---

#### Loading State (Feed)

| Component | Detail |
|-----------|--------|
| Spinner | 24px circular spinner · stroke `#F5C800` · centered in feed area |
| Background | `#0D0D0D` |
| Text | "Loading…" · 12px · `#A0A0A0` · below spinner |

---

#### Empty State (Feed)

| Component | Detail |
|-----------|--------|
| Icon | Comment/feed icon · 32px · `#2E2E2E` |
| Heading | "No activity yet" · 14px · `#A0A0A0` |
| Sub-text | "Actions you take will appear here." · 12px · `#4A4A4A` |

---

## Color & Status Tokens (Work Order)

> All badge backgrounds use a dark tint of the accent color for dark-theme readability.

| Status | Text Color | Background | Usage |
|--------|-----------|------------|-------|
| New | `#A0A0A0` | `#2E2E2E` | WO not yet started |
| In Progress | `#FB923C` | `#2D1600` | WO actively underway |
| Complete | `#52C41A` | `#0D2200` | WO fully completed |
| Technical Complete | `#C084FC` | `#1E0033` | Technically done, pending admin close |
| Cancelled | `#FF4D4F` | `#2D0000` | WO cancelled |
| On Hold | `#F5C800` | `#2D2600` | WO paused / waiting |
| **Active / Highlighted** | `#0D0D0D` | `#F5C800` | CTA button · active tab step |

---

## Typography Scale

> **Font family:** `'Inter', 'Segoe UI', sans-serif`

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| WO Number | 22px | 600 | `#F5C800` | Layer 3 main heading |
| Record Label | 11px | 400 | `#A0A0A0` | "Work Order" above WO number |
| Section Title | 13px | 600 | `#F5C800` | Collapsible card headers |
| Field Label | 11px | 400 | `#A0A0A0` | Muted secondary labels |
| Field Value | 13px | 500 | `#F0F0F0` | Primary content |
| Link Value | 13px | 500 | `#F5C800` | Clickable / linked field value |
| Badge | 11px | 500 | *(per token)* | Status pills |
| Tab Active | 13px | 600 | `#F5C800` | Details / Feed active tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Details / Feed inactive tab |
| Body / Notes | 12px | 400 | `#F0F0F0` | Description, free-text fields |
| Timestamp | 11px | 400 | `#A0A0A0` | Dates in history / timeline |
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
├── Layer 3: WOTitleBar
│     ├── WOIdentity (icon, number, owner, case, status, dates, subject)
│     └── ActionButtons
│           ├── BookAppointment
│           ├── ApproveRejectWO
│           ├── GeneratePDF
│           ├── SearchItemRequest
│           └── SendInfoDataToSAP  ← primary yellow CTA
│
├── Layer 4: SubTabBar
│     └── Tabs [Details | Feed]
│
└── Layer 5: BodyGrid (2 columns)
      ├── Column1: MainForm
      │     ├── GeneralSection
      │     │     ├── LeftSubColumn (WO Number, Status, Case, Account …)
      │     │     └── RightSubColumn (Status, Confirm, Reason, Unit Shared …)
      │     ├── AbilityConfirmationSection
      │     ├── RCInformationSection
      │     ├── WorkOrderParametersSection
      │     ├── AdditionalInformationSection
      │     ├── SAInformationSection
      │     ├── DescriptionSection
      │     └── SystemInformationSection
      │
      └── Column2: RelatedSidebar
            ├── KnowledgePanel (Filters + Search)
            ├── AssetDetailsCard
            ├── WorkPlansCard (0)
            ├── WorkStepsCard (0)
            ├── ServiceAppointmentsCard (2)
            ├── TimeSheetEntriesCard (3+)
            ├── ProblemsCard (0)
            ├── ServiceProductsCard (0)
            ├── PartsRequestsCard (0)
            ├── WorkOrderHistoryCard (3+)
            ├── OpportunitiesCard (0)
            ├── SMRCard (0)
            ├── FilesCard (upload zone)
            ├── ArticlesCard (0)
            └── ServiceRecordsCard (0)
```

---

## Document Version

**Version 1.0** — UT Service Console Work Order Detail View Design  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-CaseManagement.md  
**Updated:** 2026-05-26
