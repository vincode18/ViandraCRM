# Case Management — 3-Column Agent UI Design

> **System:** UT Service Console  
> **Record Type:** Case Detail View  
> **Layout:** 5-Layer Structure · 3-Column Body  
> **Reference:** Wireframe mockup + UT Service Console screenshots  
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
│  LAYER 3 — Case Title Bar (Case ID, Meta, Action Buttons)       │  bg: #1A1A1A · border-bottom: #2E2E2E
├─────────────────────────────────────────────────────────────────┤
│  LAYER 4 — Milestone Pipeline (Open → Assigned → … → Closed)   │  bg: #141414 · active-step: #F5C800
├──────────────────┬──────────────────────┬───────────────────────┤
│  LAYER 5 — COL 1 │  LAYER 5 — COL 2     │  LAYER 5 — COL 3      │  bg: #0D0D0D
│  Work Order      │  Case Details        │  Activity & History   │  cards: #1A1A1A
│  Plant / Asset   │  (Full detail form)  │  (WO, Files, Timer)   │  border: #2E2E2E
│  Account Info    │                      │  Opportunities, Plans  │
└──────────────────┴──────────────────────┴───────────────────────┘
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

**Fields & Interactions:**
- Search bar: full-text search across Cases, Accounts, Assets, Work Orders
- Notification badge: bg `#F5C800` · text `#0D0D0D` · unread count
- User avatar: dropdown bg `#1A1A1A` · border `#2E2E2E` → Profile, Logout, Preferences

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1, full-width  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | Console label | Icon square `#F5C800` + "UT Service Console" text `#F0F0F0` bold 14px |
| Left+1 | Module dropdown | "Cases ▾" · bg `#242424` · text `#F0F0F0` · border `#2E2E2E` · hover-bg `#F5C800` · hover-text `#0D0D0D` |
| Center–Right | Open Tabs strip | Horizontal scrollable · tab text `#A0A0A0` · hover text `#F0F0F0` |
| Far Right | "More ▾" overflow | Hidden tabs via dropdown · same styling as Module dropdown |

**Open Tab Chip Format:**
```
[Icon] [Record Label]  ×
```
- Icon: record-type color dot — Case = `#F5C800`, Account = `#A0A0A0`, WO = `#52C41A`
- Label: truncated to ~12 chars · text `#A0A0A0`
- **Active tab:** border-bottom `2px solid #F5C800` · text `#F5C800` · font-weight 600
- Inactive tab: hover text `#F0F0F0`
- Max visible tabs: ~10–12 before overflow

**Recent Tab Examples (from data):**
- 📋 Gagas Ik…
- 📋 01175…
- 👤 Jostriant…
- 📋 ISYA RA…
- 👤 IBSAR D…
- 📋 Randi N…
- 📋 Suharson…
- 📋 Ghairil Z…
- 📋 PSPMP2…
- **📋 01532… ← active**
- More ▾

---

## Layer 3 — Case Title Bar

**Position:** Below Layer 2  
**Height:** ~80px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

### Left Section — Case Identity

```
[� Case icon — #F5C800]
Case                         ← 11px, #A0A0A0
01532785                     ← 22px, #F5C800, font-weight 600

Priority: Medium   Status: ● Closed   Subject: GD829 R&I STEERING VALVE
```

| Field | Value | Style |
|-------|-------|-------|
| Record label | Case | 11px · `#A0A0A0` |
| Case Number | 01532785 | 22px · `#F5C800` · font-weight 600 |
| Priority | Medium | badge bg `#2E2E2E` · text `#F0F0F0` |
| Status | Closed | badge bg `#0D2200` · text `#52C41A` |
| Subject | GD829 R&I STEERING VALVE | 13px · `#F0F0F0` |

### Right Section — Action Buttons

| Button | Icon | Style | Action |
|--------|------|-------|--------|
| Follow | 🔔 | Outline · border `#2E2E2E` · text `#A0A0A0` · hover border+text `#F5C800` | Subscribe to case updates |
| Send to WA | 💬 | Outline · same hover | Send case summary via WhatsApp |
| Download Case | ⬇ | Outline · same hover | Export case as PDF/Excel |
| New Note | ✏️ | Outline · same hover | Open note editor inline |
| Delete | 🗑 | Outline danger · border `#FF4D4F` · text `#FF4D4F` · hover bg `#2D0000` | Delete case (with confirm modal) |
| Change Record Type | 🔄 | **Primary filled** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` | Switch case type |

---

## Layer 4 — Milestone Pipeline

**Position:** Below Layer 3  
**Height:** ~44px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`  
**Style:** Full-width segmented progress bar

```
  Open       Assigned     In Progress    Resolved    [✓ Closed]
──────────  ──────────   ─────────────  ──────────  ████████████
  ✓ done      ✓ done        ✓ done        ✓ done     ● ACTIVE
 #A0A0A0    #A0A0A0       #A0A0A0       #A0A0A0    #F5C800 fill
```

| Step | Label | State | Color |
|------|-------|-------|-------|
| 1 | Open | Completed | connector `#2E2E2E` · check `#F5C800` · label `#A0A0A0` |
| 2 | Assigned | Completed | same as above |
| 3 | In Progress | Completed | same as above |
| 4 | Resolved | Completed | same as above |
| 5 | Closed | **Active** | segment bg `#F5C800` · text `#0D0D0D` · font-weight 700 |

**Mark Status as Complete** button floats right — bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100`

---

## Layer 5 — Three-Column Body

**Layout:** CSS Grid `[280px] [1fr] [300px]`  
**Gap:** 12px  
**Padding:** 16px  
**Background:** `#0D0D0D`

> **Card / Section defaults:** bg `#1A1A1A` · border `1px solid #2E2E2E` · border-radius `6px` · shadow `0 2px 8px rgba(0,0,0,0.6)`  
> **Card header:** text `#F5C800` · font-size 13px · font-weight 600 · border-bottom `1px solid #2E2E2E`  
> **Field label:** text `#A0A0A0` · font-size 11px  
> **Field value:** text `#F0F0F0` · font-size 13px  
> **Link / interactive text:** color `#F5C800` · hover underline  
> **Collapse toggle icon:** color `#F5C800`  
> **Section divider:** `1px solid #2E2E2E`  
> **Row hover:** bg `#242424`

---

### Column 1 — Work Order, Asset & Account

**Width:** ~280px (fixed left)  
**Scroll:** Independent vertical scroll

---

#### 1A. Work Order Creation

> Section card with collapse toggle

| Field | Value |
|-------|-------|
| SAP Work Order Number | 73028145 |
| Plant | TJE |
| Work Center | FM-TJEPA *(link)* |
| Work Center Name | FM-TJEPA |
| Object Part | Steering System |
| Specific Object Part | Steering System – related |
| Cause | Scheduled Changeout |
| Damage | Scheduled Changeout |
| Task List Code | R2GS010A *(link)* |
| Notification Type | ZC |
| Order Type | ZFMC |
| PMAct Type | OVH |
| SAP Contract Number | 330062378 |
| SAP Contract Item | 000020 |
| SAP Notification Number | 260189911 |
| Malf Start Date | 27/04/2026, 07:00 |
| Malf End Date | 27/04/2026, 18:00 |
| Breakdown Indicator | ☐ |
| Cause Text | Scheduled Changeout |
| Damage Text | Scheduled Changeout |
| Actual Start Date | 27/04/2026, 07:03 |
| Actual End Date | 27/04/2026, 18:00 |
| Estimated Downtime Duration | 12.0 |
| Estimated Downtime UOM | H |

---

#### 1B. Asset Details

> Collapsible card

| Field | Value |
|-------|-------|
| Asset Name | GD825A-2/S3 – 13405 *(link)* |
| Equipment Number | 232656 |
| Serial Number | 13405 |
| Unit Model | GD825A-2 |
| Unit Code | GD-829 |
| Material Number | GD825A-2/S3 |
| SMR | 24043.0 |
| Equipment UoM | hm |
| Measuring Date | 25/05/2026, 00:04 |
| Warranty Start Date | 21/01/2022 |
| Warranty End Date | 21/01/2023 |
| In Warranty | ☐ |
| Plant | TJE |
| Service Area | Tanjung Enim PPA |

---

#### 1C. Account Details

> Collapsible card

| Field | Value |
|-------|-------|
| Account Name | PUTRA PERKASA ABADI |
| Customer Support Type | Dedicated Customer |
| Phone | — |
| Website | — |
| Industry | MNG |

---

#### 1D. Service FMC

> Collapsible card

| Field | Value |
|-------|-------|
| SAP Priority | — |
| Work Zone | — |
| Suggest Action | — |
| SAP Source | — |
| Contract Number | 330062378 |
| Contract Item | 000020 |
| Service Contract Line Item | SCL-000014859 *(link)* |

---

### Column 2 — Case Details (Center)

**Width:** Flexible `1fr`  
**Background:** `#0D0D0D`  
**Tabs:** Details · Feed

> **Tab bar:** bg `#1A1A1A` · border-bottom `1px solid #2E2E2E`  
> **Active tab:** text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600  
> **Inactive tab:** text `#A0A0A0` · hover text `#F0F0F0`

---

#### 2A. Customer Information

| Field | Value |
|-------|-------|
| Account Name | PUTRA PERKASA ABADI *(link)* |
| Account Division | — |
| Sales Office | — |
| Contact Name | — |
| Secondary Company Name | — |
| Secondary Caller Name | — |
| Secondary Caller Email | — |
| Title | — |
| Secondary Caller Phone | — |
| Handphone | — |
| Sales Funnel Opportunity | ☐ |
| Is From Maintenance Plan | ☐ |
| External MP Creation | ☐ |
| Maintenance Plan | — |
| Unit Breakdown | — |
| Contact Check | ☐ |
| Case Number | 01532785 |
| Case Owner | Suryadi Suryadi *(link)* |
| Asset | GD825A-2/S3 – 13405 *(link)* |
| Unit Model | GD825A-2 |
| Serial Number | 13405 |
| Equipment Number | 232656 |
| Service Area | Tanjung Enim PPA ST *(link)* |
| isWOExist | — |
| Account Type | Dedicated |

---

#### 2B. Informan

| Field | Value |
|-------|-------|
| Informan Name | — |
| Informan Title | SPV |
| Informan Phone | — |
| Informan_parameter | 3 |

---

#### 2C. Case Details

| Field | Value |
|-------|-------|
| Subject | GD829 R&I STEERING VALVE |
| Case Description | GD829 R&I STEERING VALVE |
| Location | — |
| SMR Problem | — |
| Object Part | Steering System |
| Specific Object Part | Steering System – related |
| Cause | Scheduled Changeout |
| Damage | Scheduled Changeout |
| Status | **Closed** |
| Update Information | — |
| CS Rating | — |
| EMR | — |
| Trouble Date | 28/05/2026 |
| Plant | TJE |
| Parent Case | — |
| Direction | — |
| Case Origin | SAP |
| Date/Time Opened | 27/04/2026, 09:45 |
| SAP Basic Start | 27/04/2026, 07:45 |
| Case Type | Schedule |
| Call Type | Service |
| Sub Call Type | FMC – PCR&OVH |
| Description | FMC – PCR&OVH |
| SAP Status | — |
| Close Reason | Finish |
| Whatsapp Update Progress | — |
| Whatsapp Closing Update | — |
| Whatsapp Number | — |
| Description Whatsapp | FMC – PCR&OVH |

---

#### 2D. Billing

| Field | Value |
|-------|-------|
| Billing Account | — |
| Billing Account Division | — |
| Billing Contact Name | — |
| Billing Sales Office | — |
| Billing Sales Office Code | — |

---

#### 2E. Additional Information

| Field | Value |
|-------|-------|
| Case Record Type | Request Service |
| Priority | Medium |
| Case Parameters | 5 |
| SAP Priority | — |
| Object Group | Z3FS7 |
| Object Code | Z3SZ |
| Cause Group | ZCALUSED |
| Cause Code | ZSCH |
| Damage Group | ZDAMAGE |
| Damage Code | ZSCC |
| Customer Code | 000012907 |
| Customer Segmentation | Uspire A |
| Sales Office Code | — |
| Cause Text | Scheduled Changeout |
| Damage Text | Schedule Changeout |
| Equipment UOM | hm |
| Approval Status | — |
| Need Man Power | ✓ |
| Case Cancel | — |
| First Change Owner | ✓ |
| Mechanic First Travel | ✓ |
| Actual Machine Location | — |
| Service Contract Line Item | SCL-000014859 *(link)* |
| LasWithAsset | ✓ |
| Unique Update | — |
| PS Type | R2S |
| Default Asset Location | 8.79644892, 105.6215661 |
| Last Transmitted Date | 03/05/2026 |
| Fault Postal Code | — |
| Fault Location City | — |
| Fault Location Street | — |
| Post Verification Notes | — |
| Web Email | — |
| Target Commission Date | — |
| Expected Commissioning Date | — |
| Operational Sub Type | — |
| Date/Time Assigned | — |
| Date/Time In Progress | 10/04/2026, 13:03 |
| Date/Time Resolved | 08/05/2026, 13:42 |
| Date/Time Job Submit | — |
| Date/Time Supervisor Approve | — |
| Date/Time Release WO | 27/04/2026, 09:45 |
| Aging Pending Case Closed (in days) | 17 |
| Aging (in days) | — |
| Aging Approval (in Hours) | — |
| CasecreateDate | 27/04/2026 |
| Date/Time Closed | 08/05/2026, 13:42 |
| Date/Time Change Owner First | 27/04/2026, 09:45 |
| Description | FMC – PCR&OVH |
| Original Record Type | — |
| Material Unit | — |
| Actual SMR | 25606 |
| First Owner | 0052v00000gVvgzAAC |
| Back to FirstOwner | ☐ |
| First Owner User | UT Integration *(link)* |
| Call Recording Link | — |
| Custom Product Delivery | — |
| Technical Type Delivery | — |
| Technical Type | GD8 |
| Object Part | Steering System – related *(link)* |
| Whatsapp Case | — |
| From MsgSession | ☐ |

---

#### 2F. Text Post (Free-text agent note)

```
@Customer, Portal Telah Selesai Mekanik UT
Tanggal Mekanik Selesai: 04/05/2026, 19:12
Nama Mekanik: Cip Andrik
No Hp:
Case Terbentuk: 27/04/2026, 09:45
```

| Field | Value |
|-------|-------|
| Text Post Modified By | Riyindra Miko Pradiesta *(link)* |
| Text Post Last Modified | 08/05/2026, 13:42 |
| Approval Manual Backdate | — |
| UMK | — |

---

#### 2G. Completion OTIF

| Field | Value |
|-------|-------|
| Start Date OTIF Mechanic | — |
| Target Date OTIF Mechanic | — |
| Start Date OTIF Solution | — |
| Target Date OTIF Solution | — |
| Start Date SLA | 27/04/2026, 09:45 |
| Target Date SLA | 27/05/2026, 09:45 |
| Completion Date Mechanic | 10/04/2026, 13:05 |
| OTIF Mechanic SLA Expired | ☐ |
| Completion Date Solution | — |
| OTIF Solution SLA Expired | — |
| Completion SLA | — |
| Over SLA | — |

---

#### 2H. System

| Field | Value |
|-------|-------|
| TSM External Key | — |
| Notification Type | ZC |
| Entitlement Name | UT Site Entitlement *(link)* |
| Business Hours | UT Site *(link)* |
| recalculateOTIF | ☐ |
| Stopped | ☐ |
| Created By | UT Integration |
| Created Date | 27/04/2026, 09:45 |
| SF Case Number | 202631001532785 |
| Last Modified By | Yustinus Candra T.P |
| Last Modified Date | 08/05/2026, 13:42 |

---

### Column 3 — Activity, History & Related

**Width:** ~300px (fixed right)  
**Background:** `#0D0D0D`  
**Scroll:** Independent vertical scroll

---

#### 3A. Case History

> Compact timeline · connector line `#2E2E2E` · event dot `#F5C800` · text `#F0F0F0` · timestamp `#A0A0A0`

| Date | Field Changed | User | From → To |
|------|--------------|------|-----------|
| 08/05/2026, 13:42 | Status | Yustinus Candra T.P | Resolved → Closed |
| 08/05/2026, 13:42 | Status | Yustinus Candra T.P | In Progress → Resolved |
| 27/04/2026, 09:45 | Status | UT Integration | — → Open |

---

#### 3B. Work Orders (1)

> Card per work order

| Field | Value |
|-------|-------|
| Work Order ID | 01234938 *(link)* |
| Subject | GD829 R&I STEERING VALVE |
| Account | PUTRA PERKASA ABADI *(link)* |
| Priority | — |
| Status | — |

**[ View All ]**

---

#### 3C. Past Cases for this Asset (50)

> Compact list, 4 visible + View All

| Case # | Type | Status | Sub Call Type |
|--------|------|--------|--------------|
| 01599036 | Schedule | In Progress | FMC – Periodic Inspection |
| 01558225 | Schedule | Closed | FMC – Periodic Inspection |
| 01556024 | Schedule | Closed | FMC – Periodic Inspection |
| 01553796 | Schedule | Closed | FMC – Periodic Service |

> Asset: GD825A-2/S3 – 13405

**[ View All ]**

---

#### 3D. Related Work Order (50)

> Compact list, 4 visible + View All

| WO # | Description | Status | PMAct |
|------|-------------|--------|-------|
| 01274315 | PI GD829 25 Mei 2026 | In Progress | INS |
| 01273602 | PI GD829 23 Mei 2026 | Technical Complete | INS |
| 01272027 | PI GD829 21 Mei 2026 | Technical Complete | INS |
| 01270598 | GD829 PS4 HM 24000 | Complete | SER |

**[ View All ]**

---

#### 3E. Related Work Order Backlog (50)

> Compact list, 4 visible + View All

| WO # | Description | Status | PMAct |
|------|-------------|--------|-------|
| 01254936 | GD829 R&I Pump | New | LOG |
| 01254589 | GD829 RESEAL BRAKE SYSTEM | New | LOG |
| 01254582 | GD829 R&I DIFFERENTIAL LOCK PUMP | New | LOG |
| 01211627 | GD829 Replace Brake Valve Air Pressure Dr | New | LOG |

**[ View All ]**

---

#### 3F. Milestones

> **✅ You completed all the milestones.** — banner bg `#F5C800` · text `#0D0D0D` · font-weight 600

**Milestone Timer** — tracks SLA duration from case open to close:
```
Start Date SLA : 27/04/2026, 09:45   ← label #A0A0A0 · value #F0F0F0
Target Date SLA: 27/05/2026, 09:45
Elapsed        : 17 days              ← value #F5C800
Status         : ✅ Within SLA        ← #52C41A
```

---

#### 3G. Files (0)

> Upload zone · border `2px dashed #F5C800` · bg `#141414` · icon `#F5C800` · text `#A0A0A0`

```
[ ⬆ Upload Files ]    ← bg #F5C800 · text #0D0D0D · font-weight 600
   — or drop files —  ← text #A0A0A0
```

---

#### 3H. Approval History (0)

> Empty state — no approvals recorded.

---

#### 3I. Opportunities (0)

> Empty state — no opportunities linked.

---

#### 3J. Parts Requests (0)

> Empty state — no parts requests.

---

#### 3K. Maintenance Plans (0)

> Empty state — no maintenance plans linked.

---

#### 3L. Messaging Sessions (0)

> Empty state — no messaging sessions.

---

#### 3M. Knowledge — Suggested Articles

> Auto-matched by asset model and case subject

| # | Article Title | Type |
|---|--------------|------|
| 1 | GD825A-2 SHOP MANUAL SN12105 UP | Shop Manual |
| 2 | (DX11KA)(HD785-7) Rear brake proportional pressure reducing solenoid valve output circuit: Disco... | Diagnostic |
| 3 | (15SELH)(D65-15) 1st clutch: See the list (LH) — Steering and transmission controller system | Diagnostic |
| 4 | WA300-1 OMM SEAM04180103 | O&M Manual |
| 5 | PC350-8 Shop Manual SEN01983-13 | Shop Manual |
| 6 | (D65-18) Brake potentiometer: Disconnection (NN) — Steering and transmission controller... | Diagnostic |
| 7 | (D65-18) Brake potentiometer: Short circuit (NS) — Steering and transmission controller... | Diagnostic |
| 8 | HD465-7R PART BOOK LEPBH467R4 | Part Book |
| 9 | GDS25A-3 OMM FRAMAST-12 | O&M Manual |
| 10 | (1OOBHD785-1S) Hydraulic oil temperature sensor: Input signal is out of normal range... | Diagnostic |

---

## Interaction Patterns

### Send to WA Button
Opens a modal pre-filled with:
```
Case: 01532785
Subject: GD829 R&I STEERING VALVE
Account: PUTRA PERKASA ABADI
Status: Closed
Asset: GD825A-2 / SN: 13405
Plant: TJE | Service Area: Tanjung Enim PPA
WO: 01234938
Closed: 08/05/2026, 13:42
```
- Phone number field (pre-filled from account)
- Send button → triggers WhatsApp API / deep link

### Download Case Button
Exports current case view as:
- [ ] PDF — formatted case report
- [ ] Excel — raw field data
- [ ] includes: Asset, WO, Case Details, OTIF, History

### Tab: Details vs Feed
- **Details** — all structured fields (current view)
- **Feed** — chronological activity log, chatter, emails, notes

---

## Color & Status Tokens

> All badge backgrounds use a dark tint of the accent color for dark-theme readability.

| Status | Text Color | Background | Usage |
|--------|-----------|------------|-------|
| Open | `#60A5FA` | `#1D3557` | Case is new/open |
| Assigned | `#F5C800` | `#2D2600` | Case assigned to agent |
| In Progress | `#FB923C` | `#2D1600` | Work actively underway |
| Resolved | `#2DD4BF` | `#00221F` | Solution provided |
| Closed | `#52C41A` | `#0D2200` | Case fully closed |
| New (WO) | `#A0A0A0` | `#2E2E2E` | WO not yet started |
| Technical Complete | `#C084FC` | `#1E0033` | WO technically done |
| Complete | `#52C41A` | `#0D2200` | WO fully complete |
| **Active / Highlighted** | `#0D0D0D` | `#F5C800` | Current milestone step · CTA |

---

## Typography Scale

> **Font family:** `'Inter', 'Segoe UI', sans-serif`

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Case ID | 22px | 600 | `#F5C800` | Layer 3 main heading |
| Record Label | 11px | 400 | `#A0A0A0` | "Case" label above Case ID |
| Section Title | 13px | 600 | `#F5C800` | Card / section headers |
| Field Label | 11px | 400 | `#A0A0A0` | Muted secondary |
| Field Value | 13px | 500 | `#F0F0F0` | Primary content |
| Link Value | 13px | 500 | `#F5C800` | Clickable / linked field value |
| Badge | 11px | 500 | *(per token)* | Status pills |
| Tab Active | 13px | 600 | `#F5C800` | Details / Feed active tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Details / Feed inactive tab |
| Body / Notes | 12px | 400 | `#F0F0F0` | Text post, description |
| Timestamp | 11px | 400 | `#A0A0A0` | Dates in history / timeline |
| Button Primary | 13px | 600 | `#0D0D0D` | CTA buttons on `#F5C800` bg |
| Button Outline | 13px | 400 | `#A0A0A0` | Secondary / outline buttons |

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
├── Layer 3: CaseTitleBar
│     ├── CaseIdentity (icon, number, priority, status, subject)
│     └── ActionButtons (Follow, SendWA, Download, Note, Delete, ChangeType)
│
├── Layer 4: MilestonePipeline
│     └── Steps [Open, Assigned, InProgress, Resolved, Closed]
│
└── Layer 5: BodyGrid (3 columns)
      ├── Column1: LeftPanel
      │     ├── WorkOrderCreationCard
      │     ├── AssetDetailsCard
      │     ├── AccountDetailsCard
      │     └── ServiceFMCCard
      │
      ├── Column2: CenterPanel (tabs: Details | Feed)
      │     ├── CustomerInformationSection
      │     ├── InformanSection
      │     ├── CaseDetailsSection
      │     ├── BillingSection
      │     ├── AdditionalInformationSection
      │     ├── TextPostSection
      │     ├── CompletionOTIFSection
      │     └── SystemSection
      │
      └── Column3: RightPanel
            ├── CaseHistoryTimeline
            ├── WorkOrdersCard (1)
            ├── PastCasesCard (50)
            ├── RelatedWorkOrderCard (50)
            ├── RelatedWOBacklogCard (50)
            ├── MilestonesCard + SLATimer
            ├── FilesCard (upload zone)
            ├── ApprovalHistoryCard
            ├── OpportunitiesCard
            ├── PartsRequestsCard
            ├── MaintenancePlansCard
            ├── MessagingSessionsCard
            └── KnowledgeArticlesCard
```

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

## Document Version

**Version 2.0** — UT Service Console Case Management 3-Column Agent Design  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Updated:** 2026-05-26