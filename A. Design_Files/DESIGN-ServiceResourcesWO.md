# Service Resource — Design Document

> **System:** UT Service Console  
> **Record Type:** Service Resource — linked to Service Appointment (SA) and Time Sheet (TST)  
> **Sample Record:** Sulaiman Nurkholik — Technician  
> **Layout:** 5-Layer Structure · 2-Column Body · Related + Details Sub-Tabs + Activity/Chatter Panel  
> **Reference:** UT Service Console Service Resource screenshots (4 views)  
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
| `--color-success` | `#52C41A` | Active / complete status |
| `--color-warning` | `#FB923C` | Tentative / attention states |
| `--color-link` | `#F5C800` | All linked record values |

### Structure Diagram

```
┌──────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)            │  bg: #0D0D0D · border-bottom: 2px #F5C800
├──────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + Open Tabs)                   │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────────────────────────────────────────────────────┤
│  LAYER 3 — SR Title Bar (Name, Meta, Action Buttons)             │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4 — SR Identity Bar (Unit, Resource Type, Active flag)    │  bg: #141414 · text: #A0A0A0
├──────────────────────────────────────────────────────────────────┤
│  LAYER 4B — Sub-Tab Bar (Related · Details)                      │  bg: #141414 · active: #F5C800
├───────────────────────────────────┬──────────────────────────────┤
│  LAYER 5 — COL 1 (Main Content)   │  LAYER 5 — COL 2 (Activity) │  bg: #0D0D0D
│  Tab: Details                     │  Activity Panel              │  cards: #1A1A1A
│  · Information Section            │  · Activity tab              │  border: #2E2E2E
│  · System Information Section     │  · Chatter tab               │
│  Tab: Related                     │  · Upcoming & Overdue        │
│  · Service Appointments           │  · Show All Activities       │
│  · Service Resource Skills        │                              │
│  · Service Territories            │                              │
│  · Notes & Attachments            │                              │
│  · Notes                          │                              │
│  · Service Resource History       │                              │
│  · Absences                       │                              │
│  · Capacities                     │                              │
│  · Time Sheets                    │                              │
│  · Service Crews                  │                              │
│  · Approval History               │                              │
│  · Shifts                         │                              │
│  · Mechanics Specialization       │                              │
│  · JA & JJE                       │                              │
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
| Left | UT app launcher logo | Yellow/orange icon · `#F5C800` |
| Center | Global Search Bar | Placeholder: "Search…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · pill ~320px |
| Right | Icon cluster | `+` New, Help `?`, Setup gear, Notifications (badge `#F5C800`), User avatar — icons `#A0A0A0` · hover `#F5C800` |

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | "UT Service Console" label | Icon `#F5C800` + text `#F0F0F0` bold 14px |
| Left+1 | **Time Sheets** tab | Active tab · bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800` |
| Center | Open record tabs: TST-2551959, Sulaiman…, Mechanics… | Active resource sub-tabs · `#A0A0A0` · close `×` on each |
| Center+ | Agent/record tabs: Dagan L, 0/1757, Justiran, RNA K, ISSA R, Randi N, Suhara, Ghani, PSP4P, 015227, Cara G, Cara M, Closed, TST-25…, MR-246 | Multiple inactive tabs · `#A0A0A0` |
| Far Right | `+ More ▾` | Overflow menu · `#A0A0A0` · hover `#F5C800` |

**Tab strip style:**
- Pill shape · bg `#1A1A1A` · border `#2E2E2E` · text `#A0A0A0` · close `×` `#A0A0A0`
- Hover: border `#F5C800` · text `#F0F0F0`
- Active: bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800`

---

## Layer 3 — Service Resource Title Bar

**Position:** Below App Bar  
**Height:** ~64px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

### Left Section — Record Identity

| Component | Detail |
|-----------|--------|
| Breadcrumb | "Service Resource" · 11px · `#A0A0A0` · hover `#F5C800` |
| Resource avatar | Square icon · person silhouette bg `#F5C800` · 36px |
| Resource name | **Sulaiman Nurkholik** · 22px · `#F0F0F0` · font-weight 600 |

### Right Section — Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| **Follow** | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border `#F5C800` · hover text `#F5C800` | Subscribe to record changes |
| **New Contact** | Outline · same | Create contact linked to this resource |
| **New Note** | Outline · same | Add a note |
| **Edit ▾** | Outline with dropdown chevron | Edit inline · dropdown: Clone, Delete, Change Owner |

---

## Layer 4 — SR Identity Bar

**Position:** Below Title Bar  
**Height:** ~40px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`  
**Layout:** Horizontal flex · 3 fields · gap 32px · padding `0 16px`

| Field | Label | Value | Style |
|-------|-------|-------|-------|
| User | User | SULAIMAN NURKHOLIK *(link)* | Label `#A0A0A0` 11px · Value `#F5C800` 13px · ALL CAPS |
| Resource Type | Resource Type | Technician | Label `#A0A0A0` 11px · Value `#F0F0F0` 13px |
| Active | Active | ✓ checkmark | Label `#A0A0A0` 11px · Checkmark `#52C41A` 14px |

---

## Layer 4B — Sub-Tab Bar

**Position:** Below Identity Bar  
**Height:** ~36px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Tab | State | Style |
|-----|-------|-------|
| Related | Active (default on Related view) | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Details | Inactive | text `#A0A0A0` · hover text `#F0F0F0` |

---

## Layer 5 — Two-Column Body

**Layout:** CSS Grid `[1fr] [320px]`  
**Gap:** 16px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · padding `12px 16px`  
> **Card header icon:** colored square icon · left of header text · 16px  
> **Section header:** text `#F0F0F0` · 13px · font-weight 600  
> **Count badge:** `(n)` · `#A0A0A0` inline after header  
> **Field label:** `#A0A0A0` · 11px  
> **Field value:** `#F0F0F0` · 13px  
> **Link value:** `#F5C800` · hover underline  
> **Edit pencil:** `#A0A0A0` · hover `#F5C800` · appears on row hover  
> **New / action button (card):** Outline · float right · border `#2E2E2E` · text `#A0A0A0` · hover `#F5C800`

---

## Tab: Details

### Section 1 — Information

**Collapse toggle:** `▼` · header "Information" · `#F0F0F0` · 13px · font-weight 600

**2-column layout**

#### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Name | Sulaiman Nurkholik | Text · `#F0F0F0` · edit pencil on hover |
| User | SULAIMAN NURKHOLIK *(link)* | User record link · `#F5C800` |
| Service Only | — | Checkbox ☐ |
| Resource Type | Technician | Dropdown value · `#F0F0F0` |
| Capacity Assist | ☐ | Checkbox unchecked |
| Scheduling Constraint | — | Free text |
| SA11 Area | JKT | Text · `#F0F0F0` |
| Mechanic Specialization Skills | PCE/WAS,BW/MS | Comma-separated skills · `#F0F0F0` |

#### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Active | ✓ | Checkbox checked · `#52C41A` |
| Include in Scheduling Optimization | ☐ | Checkbox unchecked |
| NIP | 7/07/21094 | Employee ID · `#F0F0F0` |
| Description | — | Multi-line textarea |
| Last Service Appointment | SA 2/126/73 *(link)* | Linked SA record · `#F5C800` |
| Monthly Schedule | ☐ | Checkbox |
| Primary Service Territory | KT ST *(link)* | Linked territory · `#F5C800` |
| Grade | MGA | Grade code · `#F0F0F0` |

---

### Section 2 — System Information

**Collapse toggle:** `▼` · header "System Information" · `#F0F0F0` · 13px · font-weight 600

**2-column layout**

#### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Created By | Admin Service.DAD *(link)* · 11/10/2021, 11:34 | User link `#F5C800` + DateTime `#A0A0A0` inline |
| Owner | Admin Service.DAD *(link)* | User link · `#F5C800` · with pin icon |
| Check End of Month | ☐ | Checkbox |

#### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Last Modified By | Tegur Atma Indrawan *(link)* · 29/05/2026, 10:22 | User link `#F5C800` + DateTime `#A0A0A0` |
| Already Created Mechanic Specialization | ☐ | Checkbox |
| Already Created A.R. | ✓ | Checkbox checked · `#52C41A` |

---

## Tab: Related

### Related Card 1 — Service Appointments (5+)

**Header:** "Service Appointments (5+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** green appointment icon · left of header

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Service Appointment | Service Appointment | flex | Link · `#F5C800` |
| Created Date | Created Date | ~140px | DateTime · `#A0A0A0` · 12px |
| Created By | Created By | ~120px | User link · `#F5C800` |
| System ModStamp | System ModStamp | ~140px | DateTime · `#A0A0A0` · 12px |
| Actions | — | 32px | Row dropdown `▾` · `#A0A0A0` |

**Sample data rows (from screenshot — key SA link to Time Sheet):**

| Service Appointment | Created Date | Created By | System ModStamp |
|--------------------|-------------|-----------|----------------|
| SA-2-34172 *(link)* | 26/04/2026, 18:47 | Tegur A. *(link)* | 26/04/2026, 18:47 |
| SA-2-30459 *(link)* | 26/04/2026, 18:56 | Tegur A. *(link)* | 26/04/2026, 18:58 |
| SA-2-29483 *(link)* | 20/05/2026, 13:22 | Tegur A. *(link)* | 20/05/2026, 13:22 |
| SA-2-232119 *(link)* | 21/05/2026, 11:09 | Tegur A. *(link)* | 21/05/2026, 11:09 |
| SA-2-225603 *(link)* | 20/05/2026, 11:25 | Tegur A. *(link)* | 20/05/2026, 11:25 |
| SA-1769714 *(link)* | 10/05/2026, 14:54 | Tegur A. *(link)* | 10/05/2026, 14:54 |

**Footer:** "View All" · `#F5C800` · 11px · centered · hover underline

---

### Related Card 2 — Service Resource Skills (4)

**Header:** "Service Resource Skills (4)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** green skills/star icon · left of header  
**Action button:** `[ New ]` · Outline · float right

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Resource Skill Number | Resource Skill Number | ~100px | Link · `#F5C800` |
| Competency | Competency | flex | `#F0F0F0` · 13px |
| Description | Description | flex | `#A0A0A0` · 12px |
| Experience | Experience | ~80px | `#F0F0F0` · 13px |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows:**

| Resource Skill Number | Competency | Description | Experience |
|----------------------|-----------|------------|-----------|
| SRS-J0468 *(link)* | — | — | — |
| SRS-J0456 *(link)* | — | — | — |
| SRS-J65404 *(link)* | — | — | — |
| SRS-J0485 *(link)* | — | — | — |

**Footer:** "View All" · `#F5C800` · 11px

---

### Related Card 3 — Service Territories (2)

**Header:** "Service Territories (2)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** green territory/location icon · left of header  
**Action button:** `[ New ]` · Outline · float right

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Member Number | Member Number | ~100px | Link · `#F5C800` |
| Service Territory | Service Territory | flex | Link · `#F5C800` |
| Territory Type | Territory Type | ~100px | Badge / text · `#F0F0F0` |
| Start Date | Start Date | ~120px | Date · `#A0A0A0` |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows:**

| Member Number | Service Territory | Territory Type | Start Date |
|--------------|-----------------|---------------|-----------|
| STM-12993 *(link)* | JKT ST *(link)* | Primary | 27/12/2018, 00:00 |
| STM-44293 *(link)* | Rohina ST *(link)* | Secondary | 22/09/2013, 00:00 |

**Footer:** "View All" · `#F5C800` · 11px

**Territory Type Badge Tokens:**

| Type | Background | Text |
|------|-----------|------|
| Primary | `#0D2200` | `#52C41A` |
| Secondary | `#1D3557` | `#60A5FA` |

---

### Related Card 4 — Notes & Attachments

**Header:** "Notes & Attachments (0)" · `#F0F0F0` · 13px · font-weight 600  
**Action button:** `[ Upload Files ]` · Outline · float right

**Upload drop zone:**
- Background: `#141414`
- Border: `1.5px dashed #2E2E2E` · border-radius `6px`
- Height: ~60px
- Center: upload icon `#A0A0A0` + "Upload Files" text `#F5C800`
- Sub-text: "Or drop files" · `#A0A0A0` · 11px

---

### Related Card 5 — Notes

**Header:** "Notes (0)" · `#F0F0F0` · 13px · font-weight 600  
**Action button:** `[ New ]` · Outline · float right  
**Empty state:** No rows shown

---

### Related Card 6 — Service Resource History (6+)

**Header:** "Service Resource History (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** clock/history icon · left of header

**Column layout:** 5 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Date | Date | ~140px | DateTime · `#A0A0A0` · 11px |
| Field | Field | ~140px | `#F0F0F0` · 12px |
| User | User | ~120px | User link · `#F5C800` |
| Original Value | Original Value | ~100px | `#A0A0A0` · 12px · checkbox ☐ |
| New Value | New Value | ~100px | `#F0F0F0` · 12px · checkbox ☑ |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows (from screenshot):**

| Date | Field | User | Original Value | New Value |
|------|-------|------|----------------|-----------|
| 02/05/2026, 00:00 | Already Created A.R. | UT Integration *(link)* | ☐ | ☑ |
| 07/05/2026, 22:58 | Already Created A.R. | UT Integration *(link)* | ☐ | ☑ |
| 07/04/2026, 00:00 | Already Created A.R. | UT Integration *(link)* | ☐ | ☑ |
| 02/04/2026, 11:19 | Already Created A.R. | UT Integration *(link)* | ☐ | ☑ |
| 01/03/2026, 02:14 | Already Created A.R. | UT Integration *(link)* | ☐ | ☑ |
| 01/02/2026, 10:02 | Already Created A.R. | UT Integration *(link)* | ☑ | ☐ |

**Footer:** "View All" · `#F5C800` · 11px

---

### Related Card 7 — Absences

**Header:** "Absences (0)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** absence/calendar icon  
**Action buttons:** `[ New ]` · `[ View Recurring Absence ]` · both Outline · float right  
**Empty state:** No rows

---

### Related Card 8 — Capacities

**Header:** "Capacities (0)" · `#F0F0F0` · 13px · font-weight 600  
**Action button:** `[ New ]` · Outline · float right  
**Empty state:** No rows

---

### Related Card 9 — Time Sheets (6+)

**Header:** "Time Sheets (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** timesheet/clock icon · left of header  
**Action button:** `[ New ]` · Outline · float right

> **Key Link:** This card connects the Service Resource record to all related Time Sheet (TST) records.

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Name | Name | ~100px | Link · `#F5C800` |
| Time Sheet Start Date | Time Sheet Start Date | ~130px | Date · `#A0A0A0` |
| Time Sheet End Date | Time Sheet End Date | ~130px | Date · `#A0A0A0` |
| Duration | Duration | ~80px | Decimal · `#F0F0F0` · right-aligned |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows (from screenshot):**

| Name | Start Date | End Date | Duration |
|------|-----------|---------|---------|
| TST-0459756 *(link)* | 30/05/2026 | 30/05/2026 | 0.00 |
| TST-0457216 *(link)* | 25/05/2026 | 25/05/2026 | 0.00 |
| TST-0416241 *(link)* | 10/05/2026 | 10/05/2026 | 0.00 |
| TST-0418010 *(link)* | 31/05/2026 | 31/05/2026 | 10.00 |
| TST-041 1910 *(link)* | 20/05/2026 | 20/05/2026 | 0.00 |
| TST-0409737 *(link)* | 10/02/2026 | 10/02/2026 | 10.00 |

**Footer:** "View All" · `#F5C800` · 11px

---

### Related Card 10 — Service Crews (6+)

**Header:** "Service Crews (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** crew/group icon · left of header  
**Action button:** `[ New ]` · Outline · float right

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Name | Name | ~80px | Link · `#F5C800` |
| Service Crew | Service Crew | flex | Link · `#F5C800` |
| Leader | Leader | ~60px | Checkbox ☐/☑ |
| Start Date | Start Date | ~140px | DateTime · `#A0A0A0` |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows (from screenshot):**

| Name | Service Crew | Leader | Start Date |
|------|-------------|--------|-----------|
| SCM-0022 *(link)* | Team HIM *(link)* | ☐ | 12/03/2026, 00:07 |
| SCM-0038 *(link)* | TEAM WORKSHOP-1 *(link)* | ☐ | 21/01/2026, 00:01 |
| SCM-0054 *(link)* | TEAM WORKSHOP-2 *(link)* | ☐ | 21/01/2022, 00:00 |
| SCM-0016 *(link)* | TEAM WORKSHOP-3 *(link)* | ☐ | 19/12/2022, 00:00 |
| SCM-0015 *(link)* | TEAM WORKSHOP-4 *(link)* | ☐ | 19/12/2022, 00:00 |
| SCM-0008 *(link)* | TEAM WORKSHOP-5 *(link)* | ☐ | 14/12/2022, 00:00 |

**Footer:** "View All" · `#F5C800` · 11px

---

### Related Card 11 — Approval History

**Header:** "Approval History (0)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** orange/amber approval icon · left of header  
**Empty state:** No rows — card collapses to header only

**Populated state columns:**

| Column | Width | Style |
|--------|-------|-------|
| Step | ~40px | `#A0A0A0` · 11px |
| Approver | flex | User link · `#F5C800` |
| Status | ~80px | Badge per token |
| Date | ~120px | DateTime · `#A0A0A0` |
| Comments | flex | `#F0F0F0` · 12px |

---

### Related Card 12 — Shifts (6+)

**Header:** "Shifts (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** shift/clock icon · left of header  
**Action button:** `[ New ]` · Outline · float right

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Shift Number | Shift Number | ~100px | Link · `#F5C800` |
| Service Territory | Service Territory | flex | Link · `#F5C800` |
| Label | Label | ~80px | Text · `#F0F0F0` |
| Status | Status | ~100px | Badge per token |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows (from screenshot):**

| Shift Number | Service Territory | Label | Status |
|-------------|-----------------|-------|--------|
| SFT-303-6580 *(link)* | JKT ST *(link)* | OFT | Tentative |
| SFT-303-4611 *(link)* | JKT ST *(link)* | OFT | Tentative |
| SFT-303-6820 *(link)* | JKT ST *(link)* | DAY | Tentative |
| SFT-303-6698 *(link)* | JKT ST *(link)* | DAY | Tentative |
| SFT-30310990 *(link)* | JKT ST *(link)* | OFT | Tentative |
| SFT-30310939 *(link)* | JKT ST *(link)* | DAY | Tentative |

**Footer:** "View All" · `#F5C800` · 11px

**Shift Status Badge Tokens:**

| Status | Background | Text |
|--------|-----------|------|
| Tentative | `#2D2600` | `#F5C800` |
| Confirmed | `#0D2200` | `#52C41A` |
| Cancelled | `#2D0000` | `#FF4D4F` |

---

### Related Card 13 — Mechanics Specialization (6+)

**Header:** "Mechanics Specialization (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** mechanic/wrench icon · left of header  
**Action button:** `[ New ]` · Outline · float right

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Mechanic Specialization Name | Name | flex | Link · `#F5C800` |
| Mechanic Specialization Year | Year | ~80px | Year text · `#F0F0F0` |
| Total Not Suitable Specialization | Not Suitable | ~120px | Number · `#FF4D4F` if >0 |
| Total Suitable Specialization | Suitable | ~120px | Number · `#52C41A` if >0 |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows (from screenshot):**

| Name | Year | Not Suitable | Suitable |
|------|------|-------------|---------|
| Sulaiman Nurkholik – March 2026 *(link)* | 2022 | 7 | 0 |
| Sulaiman Nurkholik – April 2026 *(link)* | 2022 | 11 | 0 |
| Sulaiman Nurkholik – May 2026 *(link)* | 2024 | 11 | 0 |
| Sulaiman Nurkholik – June 2026 *(link)* | 2022 | 11 | 0 |
| Sulaiman Nurkholik – July 2026 *(link)* | 2025 | 11 | 0 |
| Sulaiman Nurkholik – August 2026 *(link)* | 2026 | 0 | 11 |

**Footer:** "View All" · `#F5C800` · 11px

---

### Related Card 14 — JA & JJE (6+)

**Header:** "JA & JJE (6+)" · `#F0F0F0` · 13px · font-weight 600  
**Icon:** calendar/report icon · left of header

**Column layout:** 4 columns

| Column | Header | Width | Style |
|--------|--------|-------|-------|
| Month | Month | ~100px | Link · `#F5C800` · month-year format |
| Qty SA | Qty SA | ~80px | Number · `#F0F0F0` · right-aligned |
| ACM | ACM | ~80px | Decimal · `#F0F0F0` · right-aligned |
| HIM | HIM | ~80px | Decimal · `#F0F0F0` · right-aligned |
| Actions | — | 32px | Row dropdown `▾` |

**Sample data rows (from screenshot):**

| Month | Qty SA | ACM | HIM |
|-------|--------|-----|-----|
| May 2026 *(link)* | 7 | 41.00 | 41.00 |
| April 2026 *(link)* | 24 | 190.00 | 152.50 |
| March 2026 *(link)* | 19 | 122.50 | 116.00 |
| February 2026 *(link)* | 19 | 102.00 | 89.00 |
| January 2026 *(link)* | 6 | 57.00 | 57.00 |
| December 2025 *(link)* | 25 | 145.00 | 141.00 |

**Footer:** "View All" · `#F5C800` · 11px

---

## Column 2 — Activity / Chatter Panel

**Width:** ~320px  
**Background:** `#1A1A1A`  
**Border:** `1px solid #2E2E2E`  
**Border-radius:** `6px`  
**Scroll:** Independent vertical scroll

### Panel Tab Bar

| Tab | State | Style |
|-----|-------|-------|
| Activity | Default active | text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Chatter | Inactive | text `#A0A0A0` · hover `#F0F0F0` |

---

### Activity Tab

**Activity Filter Bar:**

| Button Group | Icons | Color |
|-------------|-------|-------|
| Email | envelope + `▾` | `#52C41A` |
| Task | checkmark + `▾` | `#F5C800` |
| Log | log + `▾` | `#60A5FA` |
| Event | calendar + `▾` | `#A0A0A0` |
| More ▾ | — | `#A0A0A0` |

**Filter chips:** "All time ▾ · All activities ▾ · All types ▾" + Refresh icon · `#A0A0A0` · 11px  
**Links row:** "Refresh · Expand All · View All" · `#F5C800` · 11px

**Upcoming & Overdue section:**
- Header: "Upcoming & Overdue" · `#F0F0F0` · 13px · collapse `▼`
- Empty: "No activities to show." · `#A0A0A0` · 12px
- Sub-text: "Get started by sending an email, scheduling a task, and more." · `#A0A0A0` · 11px

**Filters hint:** "To change what's shown, try changing your filters." · `#A0A0A0` · 11px · info icon

**Show All Activities button:** Full-width · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · height `32px` · hover `#C9A100`

---

### Chatter Tab

**When Chatter tab is active:**
- Feed area: bg `#0D0D0D` · posts as cards bg `#1A1A1A`
- Post input: bg `#141414` · border `#2E2E2E` · placeholder "Share an update…" · `#A0A0A0`
- Share button: bg `#F5C800` · text `#0D0D0D` · font-weight 600
- Each post: avatar + name `#F5C800` + timestamp `#A0A0A0` + body `#F0F0F0`
- Like / Comment actions: `#A0A0A0` · hover `#F5C800`

---

## Record Link Map — SA & Time Sheet Integration

This diagram shows how the Service Resource record connects to Service Appointments and Time Sheets:

```
Service Resource (SR)
├── Details Tab
│     ├── Last Service Appointment → SA record link (#F5C800)
│     └── Primary Service Territory → Territory record link (#F5C800)
│
└── Related Tab
      ├── Service Appointments (5+)  ← SA records assigned to this resource
      │     └── Each SA row → navigates to SA record
      │           └── SA record → Work Order → EMR → Time Sheet (via WO Feed tab)
      │
      └── Time Sheets (6+)           ← TST records directly linked
            └── Each TST row → navigates to Time Sheet record
                  ├── TST → Details → Work Order field → WO record
                  └── TST → Related → Time Sheet Entries (TSE-XXXX)
```

**Bidirectional navigation flows:**

| From | Via | To |
|------|-----|----|
| Service Resource | Related → Service Appointments | SA record |
| SA record | Related → Service Resource | Service Resource record |
| Service Resource | Related → Time Sheets | TST record |
| TST record | Details → System Info → Work Order | WO record |
| WO record | Feed tab → Timesheet Approval | TST record |
| TST record | Details → Service Resource field | Service Resource record |

---

## Interaction Patterns

### Navigate to Service Appointment

1. Open Related tab
2. Click SA number link (e.g., SA-2-34172) · `#F5C800` · hover underline
3. SA record opens in new console sub-tab
4. SA record shows: WO link, assigned Resource link, Scheduled Start/End

### Navigate to Time Sheet

1. Open Related tab → scroll to Time Sheets card
2. Click TST number link (e.g., TST-0418010) · `#F5C800`
3. Time Sheet opens in new console sub-tab
4. Duration "10.00" visible inline before opening

### Add New Time Sheet (from SR)

1. Click `[ New ]` on Time Sheets card
2. Quick-create modal: Service Resource pre-filled, Start Date, End Date, Status = New
3. Save → new TST row appears · count increments

### Inline Edit Fields (Details tab)

1. Hover field row → pencil icon appears `#A0A0A0`
2. Click → field converts to input · border `#F5C800` · bg `#141414`
3. Tab/Enter → save · click away → cancel
4. Save: inline checkmark `#52C41A`

### Sub-Tab Switch (Related ↔ Details)

1. Click tab → active: text `#F5C800` · border-bottom `2px solid #F5C800`
2. Content swaps: opacity 0→1 · 150ms ease
3. URL hash: `#related` / `#details`

### Activity / Chatter Tab Switch

1. Click "Activity" or "Chatter" tab in right panel
2. Active: text `#F5C800` · border-bottom `2px solid #F5C800`
3. Content swaps smoothly

---

## Color & Status Tokens

| Token | Text | Background | Usage |
|-------|------|-----------|-------|
| Active / Approved | `#52C41A` | `#0D2200` | Active checkmark, Approved status |
| Tentative | `#F5C800` | `#2D2600` | Shift tentative status |
| Confirmed | `#52C41A` | `#0D2200` | Shift confirmed |
| Cancelled | `#FF4D4F` | `#2D0000` | Shift / approval cancelled |
| Primary Territory | `#52C41A` | `#0D2200` | Primary service territory |
| Secondary Territory | `#60A5FA` | `#1D3557` | Secondary service territory |
| Not Suitable | `#FF4D4F` | — | Mechanics specialization not suitable count |
| Suitable | `#52C41A` | — | Mechanics specialization suitable count |

---

## Typography Scale

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Record Name | 22px | 600 | `#F0F0F0` | SR title bar name |
| Identity Bar Value | 13px | 500 | `#F5C800` | User link in identity bar |
| Identity Bar Label | 11px | 400 | `#A0A0A0` | Identity bar field labels |
| Section Header | 13px | 600 | `#F0F0F0` | Collapsible section titles |
| Card Header | 13px | 600 | `#F0F0F0` | Related card titles |
| Tab Active | 13px | 600 | `#F5C800` | Related / Details active tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Inactive tab |
| Field Label | 11px | 400 | `#A0A0A0` | Form field labels |
| Field Value | 13px | 500 | `#F0F0F0` | Form field values |
| Link Value | 13px | 500 | `#F5C800` | Linked record values |
| Table Header | 11px | 600 | `#A0A0A0` | Column headers |
| Table Cell | 12px | 400 | `#F0F0F0` | Table data |
| Timestamp | 11px | 400 | `#A0A0A0` | DateTime values |
| Badge | 11px | 500 | per token | Status pills |
| Button Primary | 13px | 600 | `#0D0D0D` | Show All Activities on `#F5C800` |
| Button Outline | 13px | 400 | `#A0A0A0` | New, Upload Files, Follow |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default row | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Row hover | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Field edit active | `#141414` | `#F5C800` | `#F0F0F0` |
| Active tab | — | `#F5C800` (bottom 2px) | `#F5C800` |
| File drop zone | `#141414` | `1.5px dashed #2E2E2E` | — |
| File drop zone active | `rgba(245,200,0,0.08)` | `1.5px dashed #F5C800` | — |
| Focused input | `#141414` | `#F5C800` | `#F0F0F0` |
| Disabled | `#141414` | `#1A1A1A` | `#4A4A4A` |
| Checkbox checked | — | `#F5C800` | `#52C41A` ✓ |

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
│     └── IconCluster
│
├── Layer 2: AppBar (Console + Tabs)
│     ├── ConsoleLabel ("UT Service Console")
│     ├── TimeSheetsTab  ← active
│     └── OpenRecordTabs[] (TST-2551959, Sulaiman…, Mechanics…, + agent tabs)
│
├── Layer 3: SRTitleBar
│     ├── Breadcrumb ("Service Resource")
│     ├── ResourceAvatar (#F5C800 person icon)
│     ├── ResourceName ("Sulaiman Nurkholik") ← #F0F0F0 22px
│     └── ActionButtons
│           ├── Follow
│           ├── NewContact
│           ├── NewNote
│           └── EditDropdown
│
├── Layer 4: IdentityBar
│     ├── UserLink ("SULAIMAN NURKHOLIK") ← #F5C800
│     ├── ResourceType ("Technician")
│     └── ActiveFlag (✓ #52C41A)
│
├── Layer 4B: SubTabBar
│     ├── RelatedTab
│     └── DetailsTab  ← active on Details view
│
└── Layer 5: BodyGrid (2 columns)
      ├── Column1: MainContent
      │     ├── [DetailsTab]
      │     │     ├── InformationSection
      │     │     │     ├── LeftColumn (Name, User, Service Only, Resource Type, Capacity Assist,
      │     │     │     │              Scheduling Constraint, SA11 Area, Mechanic Specialization Skills)
      │     │     │     └── RightColumn (Active, Include in Scheduling, NIP, Description,
      │     │     │                      Last Service Appointment, Monthly Schedule,
      │     │     │                      Primary Service Territory, Grade)
      │     │     └── SystemInformationSection
      │     │           ├── LeftColumn (Created By, Owner, Check End of Month)
      │     │           └── RightColumn (Last Modified By, Already Created Mechanic Specialization,
      │     │                           Already Created A.R.)
      │     │
      │     └── [RelatedTab]
      │           ├── ServiceAppointmentsCard (5+)  ← SA LINK
      │           │     └── Columns: SA Number · Created Date · Created By · System ModStamp
      │           ├── ServiceResourceSkillsCard (4)
      │           │     └── Columns: Skill Number · Competency · Description · Experience
      │           ├── ServiceTerritoriesCard (2)
      │           │     └── Columns: Member Number · Service Territory · Territory Type · Start Date
      │           ├── NotesAttachmentsCard (upload zone)
      │           ├── NotesCard (0)
      │           ├── ServiceResourceHistoryCard (6+)
      │           │     └── Columns: Date · Field · User · Original Value · New Value
      │           ├── AbsencesCard (0) + View Recurring Absence button
      │           ├── CapacitiesCard (0)
      │           ├── TimeSheetsCard (6+)  ← TIME SHEET LINK
      │           │     └── Columns: Name · Start Date · End Date · Duration
      │           ├── ServiceCrewsCard (6+)
      │           │     └── Columns: Name · Service Crew · Leader · Start Date
      │           ├── ApprovalHistoryCard (0)
      │           ├── ShiftsCard (6+)
      │           │     └── Columns: Shift Number · Service Territory · Label · Status
      │           ├── MechanicsSpecializationCard (6+)
      │           │     └── Columns: Name · Year · Not Suitable · Suitable
      │           └── JAJJECard (6+)
      │                 └── Columns: Month · Qty SA · ACM · HIM
      │
      └── Column2: ActivityChatterPanel
            ├── PanelTabBar [Activity | Chatter]
            ├── [ActivityTab]
            │     ├── FilterBar (Email · Task · Log · Event · More)
            │     ├── FilterChips (All time · All activities · All types)
            │     ├── UpcomingOverdueSection (empty state)
            │     ├── FilterHint
            │     └── ShowAllActivitiesButton ← primary #F5C800
            └── [ChatterTab]
                  ├── PostInputArea
                  └── FeedPosts[]
```

---

## Document Version

**Version 1.0** — UT Service Console Service Resource Design  
**Record:** Service Resource (SR) — Technician  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-WorkOrder.md  
**Linked Records:** Service Appointment (SA) · Time Sheet (TST) · Service Territory · Service Crews · Shifts  
**Updated:** 2026-05-26
