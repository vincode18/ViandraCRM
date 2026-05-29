# Quotation Module - UI Design Document

## 1. Executive Summary

The **Quotation Module** is the critical interface for managing customer quotes and formal pricing proposals. It serves as the bridge between opportunity management and order fulfillment, providing sales teams and finance stakeholders with comprehensive visibility into quotation lifecycle from creation through approval and acceptance. This design document outlines a sophisticated two-column interface featuring:

- **Dynamic Approval Workflow Tracker** - Visual representation of quotation approval stages
- **Dual-Column Layout** - Detailed quotation data with linked object relationships
- **Four-Tab Navigation System** - Details, Activity, Related Objects, and Feed (Chatter)
- **Contextual Quote Management** - Line items, pricing, and document generation
- **Real-Time Status Management** - Approval workflow transitions and compliance tracking
- **Comprehensive Pricing Breakdown** - Multi-level cost structure and total calculations

---

## 2. Core Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       QUOTATION RECORD                          │
│  (Central Hub for Quote Management, Approval & Customer Delivery)
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  APPROVAL WORKFLOW TRACKER                               │  │
│  │  Prospecting → Submit → Preparation → Quotation →        │  │
│  │  Negotiation → Accepted/Denied → Closed (Won/Lost)       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────┬──────────────────────────────┐ │
│  │ COLUMN 1: QUOTATION DETAILS │  COLUMN 2: LINKED DATA       │ │
│  │ • Quotation Metadata        │  • Quote New Version        │ │
│  │ • Customer Information      │  • Activity & Activity Log   │ │
│  │ • Line Items & Products     │  • Quote Line Items (1+)     │ │
│  │ • Pricing & Totals          │  • Quote Product Items (4+)  │ │
│  │ • SAP Integration Details   │  • Quote PDFs               │ │
│  │ • Approval History          │  • Notes                    │ │
│  │ • Prepared For / Billing    │  • Contracts                │ │
│  │ • Payment Terms             │  • Files                    │ │
│  │                             │  • Approval History         │ │
│  │  4 MAIN TABS:               │                             │ │
│  │  1. Details Tab             │                             │ │
│  │  2. Activity Tab            │                             │ │
│  │  3. Related Tab             │                             │ │
│  │  4. Feed Tab (Chatter)      │                             │ │
│  └─────────────────────────────┴──────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Page-Level Layout Structure

### 3.1 Header Section

**Purpose**: Display quotation identity, key metrics, and global actions.

```
┌──────────────────────────────────────────────────────────────────┐
│  Quote / Quotation                                               │
│                                                                   │
│  📋 Quotation - v1 - PAKET PAKET SERVICE 9500 HM GR500EX-3      │
│                                                                   │
│  Quote Number:           00145608                               │
│  Opportunity Name:       PAKET PAKET SERVICE 9500 HM GR500EX-3 │
│  Expiration Date:        01/06/2026                             │
│  Billing Account:        CAHAYA TURANGGA SAKTI                  │
│  Grand Total Amount:     IDR 17,227,977.00                      │
│  Grand Total SF:         IDR 15,520,700.00                      │
│                                                                   │
│  [Follow]  [Submit For Approval]  [Retrieve Price]              │
│  [Approve/Reject Approval]  [Generate PDF]  [More ⋮]            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 Header Components
- **Breadcrumb Navigation**: Quote / Quotation path
- **Record Identity**: Icon + Record Name (Quotation - v1 - [Name])
- **Key Metrics Row**: Quote Number, Opportunity Link, Expiration Date, Account, Amounts
- **Action Buttons**: Follow, Submit, Retrieve Price, Approve/Reject, Generate PDF, More (⋮)

---

### 3.2 Approval Workflow Tracker

**Purpose**: Visualize quotation progression through approval and customer acceptance stages.

```
┌──────────────────────────────────────────────────────────────────┐
│  QUOTATION APPROVAL WORKFLOW (Visual Progress Bar)               │
│                                                                   │
│  ✓ Prospecting  →  ✓ Submit  →  ✓ Preparation  →  ▶ Quotation  │
│                                                          │        │
│                                          ┌──────────────┴────┐   │
│                                          │   Negotiation     │   │
│                                          │   Accepted        │   │
│                                          │   Denied          │   │
│                                          └──────────────┬────┘   │
│                                                         │        │
│                                          ┌──────────────▼────┐  │
│                                          │  Negotiation (Cur) │  │
│                                          │  Mark Complete ✓   │  │
│                                          └───────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.2.1 Workflow Stages Features
- **Sequential Stage Display**: 4-6 stages showing quotation lifecycle
- **Progress Indicators**:
  - ✓ Completed stages (gray with checkmark)
  - ▶ Current stage (blue highlight)
  - → Future stages (light gray)
- **Stage Buttons**: Clickable to transition between stages
- **Status Badges**: Color-coded outcome labels
- **Stage Actions**: Ability to mark complete or change stage
- **Hover Details**: Show stage entry date, SLA status

#### 3.2.2 Approval Workflow Stages

| Stage | Description | Conditions |
|-------|-------------|-----------|
| **Prospecting** | Initial quotation created | Quote created from opportunity |
| **Submit** | Quote submitted for internal approval | Manager review required |
| **Preparation** | Internal teams review & finalize | Technical, legal, financial review |
| **Quotation** | Quotation sent to customer | Customer review & negotiation period |
| **Negotiation** | Terms under discussion with customer | Pricing, delivery, payment negotiation |
| **Accepted** | Customer accepted quotation | Customer approval, ready for order |
| **Denied** | Quote rejected by customer or org | Deal lost, archive for analytics |

---

## 4. Column 1: Quotation Details (Main Content Area)

**Layout**: 65% width of the two-column layout

### 4.1 Tab Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Related  │  Details  │  Feed  │  [Additional Tabs...]       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [TAB CONTENT AREA - Dynamic based on selected tab]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.1 Tab Navigation Order
1. **Related Tab** - Quick access to linked objects (default view)
2. **Details Tab** - Full quotation metadata and settings
3. **Feed Tab** - Chatter discussions and updates
4. **Activity Tab** - Chronological activities (optional)

---

### 4.2 Related Tab (Default View)

**Purpose**: Display quote line items and related products in a tabular format.

```
┌─────────────────────────────────────────────────────────────┐
│  Related Tab (Quote Line Items)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Quote Line Items (1)]          [Add Products/Materials]   │
│  1 item • Sorted by Item No • Updated a few seconds ago     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ☐ Product/  Item   Standard  Manpower  Rate/Man  Final  │ │
│  │   Material  No.    M...      ...       ...      Price  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ ☐ PERIODICAL 000010 10.00    11.00    IDR 300,0  IDR   │ │
│  │   SERVICE 2         ...      ...       00.00    3,300, │ │
│  │   GR500                                        000.00   │ │
│  │                                    [View All]          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Quote Product Items (4)]                [Delete Part]    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Quote Product  Material No.     Product        List Price│ │
│  │ Item Name                                               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ QPI-796866     36361427550     CARTRIDGE FILTER  IDR   │ │
│  │                                                2,654,000 │ │
│  │ QPI-798869     36361325330     ELEMENT KIT      IDR    │ │
│  │                                                2,461,100 │ │
│  │ QPI-796870     34988607510     ELEMENT ASSY     IDR    │ │
│  │                                                5,935,600 │ │
│  │ QPI-796871     15WA5-DH1/P20   KSO 15WA5 PAIL   IDR    │ │
│  │                                                1,375,300 │ │
│  │                                    [View All]          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Quote PDFs (0)]                                           │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  (No PDF files attached)                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Notes (0)]                                       [New]    │ │
│  [Contracts (Quote) (0)]                           [New]    │ │
│  [Files (0)]                                  [Add Files]  │ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.1 Quote Line Items Section
- **Sortable Grid**: By Item Number, Product, Price
- **Columns**: Product/Material, Item No, Standard Measure, Manpower, Rate/Manpower, Final Price
- **Selection**: Checkboxes for bulk actions
- **Actions**: View All, Edit Product Details
- **Totals**: Subtotal and Grand Total

#### 4.2.2 Quote Product Items Section
- **Grid Display**: Product listing with Material Numbers
- **Columns**: Quote Product Item Name, Material Number, Product, List Price
- **Expandable**: Show item details on click
- **Actions**: Delete Part, View All, Add Products
- **Links**: Direct access to product master records

#### 4.2.3 Related Objects Subsections
- **Quote PDFs**: Generated documents (0)
- **Notes**: Internal notes and comments (0)
- **Contracts**: Associated contracts (0)
- **Files**: Attachment management (0)

---

### 4.3 Details Tab Structure

**Purpose**: Display comprehensive quotation information organized by logical sections.

#### 4.3.1 Quotation Header Fields

```
┌─────────────────────────────────────────────────────────────┐
│  Details Tab                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Quote Number              00145608                         │
│  Quote Name                Quotation - v1 - PAKET PAKET...  │
│  Opportunity Name          PAKET PAKET SERVICE 9500 HM...  │
│  Job Location              [empty]               [Edit]     │
│  Mobilization              [empty]               [Edit]     │
│  Transportation            [empty]               [Edit]     │
│  Need Follow Up            ☐ (unchecked)         [Edit]     │
│  Remains                   4.00                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Expandable/collapsible sections
- Inline edit capability on modifiable fields
- Linked record references (Quote Name, Opportunity)
- Read-only calculated fields (Remains)

#### 4.3.2 Customer Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ CUSTOMER INFORMATION                                 [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Account Name              KOP PEKERJA PERTAMINA...  [Edit] │
│  Division Account          SM - KOP PEKERJA...      [Edit]  │
│  Contact Name              AGUS                      [Edit]  │
│  Asset                     GR-500EXL/P1 - 541542    [Edit]  │
│  Sales Office              SM-SMG                           │
│  Service Area              Semarang                  [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Expandable customer data
- Account hierarchy (Account > Division)
- Contact person assignment
- Service delivery location (Asset, Service Area)
- Sales organization tracking

#### 4.3.3 Billing Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ BILLING                                              [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Billing Account           CAHAYA TURANGGA SAKTI    [Edit]  │
│  Billing Account Division  SM - CAHAYA TURANGGA...  [Edit]  │
│  Billing Contact Name      YULIA                     [Edit]  │
│  Billing Sales Office      SM-SMG                           │
│  Billing Sales Office Code SMG                             │
│  SAP Payment Term          N7                        [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Separate billing entity from customer
- Complete billing hierarchy
- Payment terms configuration
- SAP integration for payment processing

#### 4.3.4 Quotation Details Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ QUOTATION DETAILS                                    [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Expiration Date           01/06/2026                [Edit]  │
│  Status                    Submit                    [Edit]  │
│  Description               PAKET PAKET SERVICE 9500...[Edit]  │
│  Reference                 [empty]                  [Edit]  │
│  Reference Date            [empty]                  [Edit]  │
│  Approve Date              [empty]                  [Edit]  │
│  Message Final Quote       [empty]                  [Edit]  │
│  Auto Final Quote          ☐ (unchecked)            [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Quotation lifecycle dates
- Status tracking (Submit, Approved, etc.)
- Reference documentation
- Auto-finalization settings
- Message templates for customer communication

#### 4.3.5 Totals Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ TOTALS                                               [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Total Price (Products)    IDR 3,300,000.00          [Edit] │
│  Total Price (Accommodation) IDR 0.00                [Edit]  │
│  Total Price (Fabrication) IDR 0.00                  [Edit]  │
│  Total Price (Transport)   IDR 0.00                  [Edit]  │
│  Total Price (Consumable Goods) IDR 0.00            [Edit]  │
│  Total Price (Parts)       IDR 12,473,700.00        [Edit]  │
│  Total Price (Component)   IDR 0.00                  [Edit]  │
│  Sub Total Amount          IDR 15,520,700.00        [Edit]  │
│  Grand Total Amount        IDR 17,227,977.00        [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Hierarchical cost breakdown by category:
  - Products, Accommodation, Fabrication
  - Transportation, Consumable Goods
  - Parts, Components
- Subtotal aggregation
- Grand Total with all adjustments
- Editable for manual adjustments

#### 4.3.6 SAP Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ SAP INFORMATION                                      [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SAP Quotation ID          320382859                 [Edit]  │
│  SAP Quotation ID 2        [empty]                  [Edit]  │
│  SAP Status                Success                  [Edit]  │
│  Quotation Approval        BCPPD Section Head       [Edit]  │
│  Bank Account              0521725001               [Edit]  │
│  Bank Account Name         BANK PERMATA             [Edit]  │
│  Lead Time 0               0.0                             │
│  Date Time Final Quote     [empty]                  [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- SAP integration identifiers
- Quotation approval path in SAP
- Banking information for payment
- Lead time tracking
- Final quote date management

#### 4.3.7 Prepared For Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ PREPARED FOR                                         [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Addressed to              YULIA                    [Edit]   │
│  Title                     STAFF                    [Edit]   │
│  Email                     [empty]                  [Edit]   │
│  Send to Email             YULIA                    [Edit]   │
│  Sender Title              STAFF                    [Edit]   │
│  Sender Email              [empty]                  [Edit]   │
│  Bill To Name              CAHAYA TURANGGA SAKTI    [Edit]   │
│  Bill To                   JL.MT.HARYONO NO.79-B...  [Edit]   │
│  Ship To Name              CAHAYA TURANGGA SAKTI    [Edit]   │
│  Ship To                   JL.MT.HARYONO NO.79-B...  [Edit]   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Quote recipient information
- Customer contact details
- Sender/sales rep information
- Billing and shipping addresses
- Email distribution settings

#### 4.3.8 System Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ SYSTEM INFORMATION                                   [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Product Not Approved      1                        [Edit]  │
│  SDH User                  Dunuarto Dunuarto        [Edit]  │
│  Level Approval            2                        [Edit]  │
│  Created By                April Romadani,          [Edit]  │
│                            18/05/2026, 14:35               │
│  Owner Name                April Romadani                  │
│  Error from SAP            Success                  [Edit]  │
│  Quote Product Unreturne   0                               │
│  Last Modified By          PIPIT NAWA HIDAYAT,             │
│                            18/05/2026, 15:15              │
│  Recalculate Total         ☐ (unchecked)            [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Audit trail (Created By, Last Modified By)
- System approval levels
- Approval status flags
- Error tracking from SAP
- Recalculation flags

---

### 4.4 Activity Tab Structure

**Purpose**: Display chronological record of all activities related to the quotation.

```
┌─────────────────────────────────────────────────────────────┐
│  Activity Tab                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Activity Type Filter Buttons]                             │
│  ☐ All  ☐ Call  ☐ Email  ☐ Meeting  ☐ Task              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Activity List]                                    │  │
│  │  • 2026-05-20: Quote sent to customer - Email      │  │
│  │  • 2026-05-18: Quotation approved - Status change  │  │
│  │  • 2026-05-17: Quote created from opportunity      │  │
│  │                                                     │  │
│  │  [Show More...]                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Activity type filtering (Calls, Emails, Meetings, Tasks)
- Chronological sorting (newest first)
- Quick view summary with key details
- Expandable entries for full content
- Create new activity button

---

### 4.5 Feed Tab (Chatter) Structure

**Purpose**: Enable team collaboration through threaded conversations and status updates.

```
┌─────────────────────────────────────────────────────────────┐
│  Feed Tab (Chatter)                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Post Input Area]                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Post  │  [Share an update...]          [Share]    │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  Sort by: [Most Recent Activity ▼]                          │
│  [Search this feed...]                                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  👤 April Romadani submitted quotation for approval │  │
│  │  | 18 May 2026 at 14:35                            │  │
│  │                                                      │  │
│  │  Status: Submitted                                  │  │
│  │  Reference: OP-1502927                              │  │
│  │                                                      │  │
│  │  ❤ Like    💬 Comment                              │  │
│  │  👤 Write a comment...                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  [Similar post structure for other updates...]              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  📌 Quotation created from opportunity              │  │
│  │                                                      │  │
│  │  Opportunity: PAKET PAKET SERVICE 9500 HM GR500EX-3│  │
│  │  Amount: IDR 17,227,977.00                          │  │
│  │                                                      │  │
│  │  [Show all Updates]                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Text input area for sharing updates
- Threading support for conversation branches
- Like and comment functionality
- @mention capability for team notifications
- Rich text formatting (bold, italic, links)
- File attachment support
- Emoji reactions
- Sortable feed (Recent, Most Commented, Oldest)

---

## 5. Column 2: Activity & Linked Objects Panel (35% Width)

**Purpose**: Provide real-time visibility into quote management, approvals, and activity tracking.

### 5.1 Quote New Version Section

**Purpose**: Create and manage quotation versions for revisions and updates.

```
┌──────────────────────────────────────────────────────┐
│  ✓ Quote New Version (0)                        [New]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  (No new versions created yet)                      │
│                                                      │
│  [Create New Version]                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Version management for quotation revisions
- Create new version button for updates
- Track version history
- Compare versions

---

### 5.2 Activity Section

**Purpose**: Track all activities and interactions related to the quotation.

```
┌──────────────────────────────────────────────────────┐
│  Activity                              [Generate PDF] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  📊 [Activity Type Icons]                           │
│  ☐ All  ☐ Call  ☐ Email  ☐ Meeting  ☐ Task       │
│                                                      │
│  Filters: All time • All activities • All types  [⚙]│
│  Refresh • Expand All • View All                     │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  No activities to show.                        │ │
│  │                                                 │ │
│  │  Get started by sending an email, scheduling   │ │
│  │  a task, and more.                             │ │
│  │                                                 │ │
│  │  To change what's shown, try changing your    │ │
│  │  filters.                                      │ │
│  │                                                 │ │
│  │      [Show All Activities]                     │ │
│  │                                                 │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Upcoming & Overdue                                 │
│  No activities to show.                             │
│                                                      │
│  [Show All Activities]                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Activity type filters with icons
- Generate PDF action for quotation
- Time range filtering
- Activity type filtering
- Upcoming & Overdue section
- Quick access to all activities

---

### 5.3 Quote Line Items Section

**Purpose**: Display line items in a compact related list view.

```
┌──────────────────────────────────────────────────────┐
│  ✓ Quote Line Items (1)                         [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  PERIODICAL SERVICE 2 GR500                         │
│  Quantity: 1.00                                     │
│  Unit Price: IDR 3,300,000.00                      │
│  Line Total: IDR 3,300,000.00                      │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Line item listing with key details
- Quantity and pricing
- Quick view summary
- Expandable section

---

### 5.4 Quote Product Items Section

**Purpose**: Show product/material breakdown with pricing.

```
┌──────────────────────────────────────────────────────┐
│  Quote Product Items (4)                        [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Quote Product Item Name: CARTRIDGE FILTER         │
│  Material Number: 36361427550                       │
│  Product: CARTRIDGE FILTER                          │
│  List Price: IDR 2,654,000.00                       │
│                                                      │
│  Quote Product Item Name: ELEMENT KIT              │
│  Material Number: 36361325330                       │
│  Product: ELEMENT KIT                               │
│  List Price: IDR 2,461,100.00                       │
│                                                      │
│  [Additional items...]                              │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Product item listing
- Material and product references
- List price display
- Expandable for full details

---

### 5.5 Quote PDFs Section

**Purpose**: Manage generated PDF documents of quotations.

```
┌──────────────────────────────────────────────────────┐
│  Quote PDFs (0)                                 [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  (No PDF files generated)                           │
│                                                      │
│  [Generate PDF]                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- PDF document management
- Generate PDF button
- Download/preview capabilities
- Version tracking

---

### 5.6 Notes Section

**Purpose**: Internal notes and comments on quotation.

```
┌──────────────────────────────────────────────────────┐
│  Notes (0)                                      [New]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  (No notes added yet)                               │
│                                                      │
│  [New Note]                                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Internal note management
- Create new note button
- Note author and timestamps
- Searchable note content

---

### 5.7 Contracts Section

**Purpose**: Link contracts and legal agreements to quotation.

```
┌──────────────────────────────────────────────────────┐
│  Contracts (Quote) (0)                          [New]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  (No contracts linked)                              │
│                                                      │
│  [New Contract]                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Contract linking
- Create new contract button
- Contract status tracking
- Version management

---

### 5.8 Files Section

**Purpose**: Store and access attachments related to quotation.

```
┌──────────────────────────────────────────────────────┐
│  Files (0)                                  [Add Files]
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Download Files]                                   │
│  Or drag files here                                 │
│                                                      │
│  (Currently: No files attached)                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop file upload
- File type support (PDF, DOC, XLS, images, etc.)
- File versioning
- Download/preview capabilities

---

### 5.9 Approval History Section

**Purpose**: Track approval workflow steps and status.

```
┌──────────────────────────────────────────────────────┐
│  Approval History (3)                           [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ⭕ Step: Technical Review                 PENDING   │
│  Assigned to: Tech Group Alpha                      │
│                                                      │
│  ✓ Step: Manager Approval                  APPROVED │
│  Approved by: J. Doe on Oct 24, 2023               │
│                                                      │
│  ✓ Approval Request Submitted              APPROVED │
│  Submitted by: You on Oct 23, 2023                 │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Approval workflow steps visualization
- Step status indicators (Pending, Approved, Rejected)
- Approver assignments and actions
- Timeline of approvals
- Approval comments and feedback

---

## 6. Navigation & Global Actions

### 6.1 Header Action Buttons

```
┌──────────────────────────────────────────────────────┐
│  [Follow] [Submit For Approval] [Retrieve Price]     │
│  [Approve/Reject Approval] [Generate PDF] [More ⋮]  │
└──────────────────────────────────────────────────────┘
```

#### 6.1.1 Button Descriptions

| Button | Purpose | Availability |
|--------|---------|--------------|
| **Follow** | Subscribe to quotation updates via email | Always |
| **Submit For Approval** | Submit quotation for review workflow | Draft status |
| **Retrieve Price** | Fetch current pricing from SAP system | When pricing needed |
| **Approve/Reject Approval** | Accept or reject in approval workflow | Awaiting approval |
| **Generate PDF** | Create PDF document of quotation | Quote complete |
| **More (⋮)** | Additional actions (Delete, Share, Lock, etc.) | Always |

---

## 7. Data Flow & Integration Architecture

### 7.1 Quotation Data Flow

```
┌─────────────────────────────────────────────────────┐
│  OPPORTUNITY CONVERSION                             │
│  (Select Products + Confirm Amount + Customer)      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  QUOTATION OBJECT (Pricing & Approval)              │
│  • Customer & Billing Info                          │
│  • Line Items & Products                            │
│  • Pricing & Cost Breakdown                         │
│  • Approval Workflow                                │
│  • SAP Cross-References                             │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼──────────────┐
         │           │              │
         ▼           ▼              ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │APPROVAL  │ │SAP QUOTE │ │PDF DOCUMENT │
   │ WORKFLOW │ │ CREATION │ │ GENERATION  │
   └──────────┘ └──────────┘ └──────────────┘
         │           │              │
         └───────────┴──────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │   ORDER CONVERSION   │
         │   (Customer Accept)  │
         └──────────────────────┘
```

### 7.2 SAP Integration Points

- **SAP Quotation ID**: Link to SAP quotation
- **SAP Quotation ID 2**: Secondary quotation reference
- **SAP Status**: Quotation status in SAP system
- **Price Retrieval**: Fetch current pricing from SAP
- **Data Sync**: Bi-directional sync of key fields (Amount, Products, Status)
- **PDF Generation**: Trigger SAP quote document generation
- **Bank Account**: Payment information from SAP

---

## 8. Approval Workflow State Management

### 8.1 Valid Status Transitions

```
DRAFT
    ↓
PROSPECTING
    ↓
SUBMIT (Awaiting Internal Approval)
    ├─→ APPROVED (by manager/finance)
    │       ↓
    │   PREPARATION (finalization)
    │       ↓
    │   QUOTATION (sent to customer)
    │       ├─→ NEGOTIATION (customer discussion)
    │       │       ├─→ ACCEPTED (customer approval)
    │       │       │       → ORDER CREATION
    │       │       └─→ DENIED (rejected)
    │       └─→ DENIED (customer reject)
    │
    └─→ REJECTED (by manager/finance)

ACCEPTED (Final State - Order Ready)
DENIED (Final State - Deal Lost)
```

### 8.2 Approval Entry Criteria

| Status | Entry Criteria | Next Actions |
|--------|----------------|--------------|
| Draft | Quote created | Add line items, pricing |
| Prospecting | Initial quote setup | Submit for approval |
| Submit | Ready for internal approval | Manager review |
| Approved | Manager approved | Finalize details |
| Preparation | Finance/Legal review | Send to customer |
| Quotation | Sent to customer | Await feedback |
| Negotiation | Customer reviewing | Win/Lose decision |
| Accepted | Customer accepted | Create order |
| Denied | Rejected or withdrawn | Archive, analyze |

---

## 9. Responsive Design Strategy

### 9.1 Desktop Layout (1920px+)
- Two-column layout fully visible (65/35 split)
- All sections visible without scrolling within sections
- Approval tracker at full width
- Activity panel always visible

### 9.2 Tablet Layout (768px - 1024px)
- Two-column stack (main field above activity panel)
- Collapsible sections to save vertical space
- Approval tracker may wrap to multiple lines
- Touch-friendly button sizes (48px minimum)

### 9.3 Mobile Layout (<768px)
- Single column, full-width content
- Approval tracker as horizontal scroll
- Bottom sheet for activity panel
- Accordion-style collapsible sections
- Tab navigation at bottom (sticky)

---

## 10. Accessibility Requirements

### 10.1 WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for all text
- **Focus Indicators**: Visible 2px focus rings on interactive elements
- **Keyboard Navigation**: Complete navigation without mouse
- **Screen Reader Support**: Proper ARIA labels and roles

### 10.2 Form Accessibility
- **Field Labels**: Clear, descriptive labels for all inputs
- **Required Fields**: Marked with * and aria-required
- **Validation Messages**: Associated with form fields
- **Error Recovery**: Clear instructions for fixing errors

### 10.3 Interactive Components
- **Button Labels**: Descriptive, not just "Click here"
- **Icon Buttons**: Include aria-label with full text alternative
- **Expandable Sections**: ARIA-expanded state management
- **Links**: Distinguishable from body text

---

## 11. Performance Optimization

### 11.1 Data Loading Strategy
- **List View**: Lazy load 25 items per page
- **Detail View**: Load main record immediately, related records on demand
- **Activity Panel**: Stream updates with WebSocket
- **Search**: Debounce input (300ms delay)
- **PDF Generation**: Async processing with progress indicator

### 11.2 Rendering Performance
- **Virtual Scrolling**: For lists >500 items
- **Collapsible Sections**: Prevent DOM bloat
- **Image Optimization**: Lazy load images
- **CSS Animations**: Use transform/opacity (GPU-accelerated)

---

## 12. User Workflows

### Workflow 1: Quote Creation to Customer Delivery
1. Sales rep creates quotation from opportunity
2. System auto-populates customer and billing info
3. Sales rep adds line items and products
4. System calculates pricing and totals
5. Sales rep submits for internal approval
6. Manager reviews in Approval History section
7. Manager approves; quota moves to Preparation
8. Finance/Legal team finalizes in Preparation stage
9. Sales rep marks as Quotation; sends to customer
10. Customer receives PDF quote via email
11. Customer negotiates or accepts terms
12. Sales rep marks as Accepted or Denied
13. If Accepted, system triggers SAP order creation

### Workflow 2: Quote Revision & Resubmission
1. Customer provides feedback on initial quote
2. Sales rep creates new version of quote
3. Updates pricing, products, or payment terms
4. Resubmits for internal approval
5. Approval workflow repeats with version 2
6. New PDF generated and sent to customer
7. Customer accepts revised quotation

### Workflow 3: Approval Workflow Tracking
1. Manager opens quotation dashboard
2. Filters for quotations in "Submit" status
3. Reviews pending approvals
4. Opens quotation record
5. Reviews Details and Related tabs
6. Checks Approval History section
7. Approves quotation (changes status to Approved)
8. Notification sent to sales rep
9. Sales rep proceeds with customer delivery

---

## 13. Business Rules & Validations

### 13.1 Required Fields
- **Quote Number**: Auto-generated
- **Opportunity Name**: Cannot be blank
- **Billing Account**: Must be valid account lookup
- **Expiration Date**: Must be future date
- **Status**: Cannot be null

### 13.2 Conditional Requirements
- **Line Items**: Minimum 1 required for quote completion
- **Pricing**: Totals must be > 0 for submission
- **Approval**: Manager approval required before customer delivery
- **PDFs**: Must be generated before customer delivery

### 13.3 Business Logic
- **Auto-Calculation**: Subtotals and Grand Total computed on save
- **Pricing Sync**: Pull latest prices from SAP on demand
- **Status Cascade**: Stage changes trigger related notifications
- **SAP Sync**: Push quote to SAP on Approved status
- **Expiration**: Automatic expiration warning 7 days before date

---

## 14. Component Library

### 14.1 UI Components Used
- **Data Tables**: Sortable, filterable grids for line items
- **Expandable Sections**: Collapsible field groups
- **Form Fields**: Text, Date, Lookup, Picklist, Currency
- **Buttons**: Primary (Submit), Secondary (Cancel), Tertiary (More)
- **Badges**: Status indicators (Approved=Green, Pending=Yellow, Rejected=Red)
- **Modal Dialogs**: Version creation, approval confirmations
- **Tabs**: Navigation between Details, Activity, Related, Feed
- **Progress Tracker**: Approval workflow visualization
- **Toasts**: Success/error notifications
- **Loading Spinners**: Async operations (PDF generation, SAP sync)

---

## 15. Visual Design System

### 15.1 Color Palette

```
Primary Brand Colors:
  • Primary Blue: #0066CC (buttons, active states, links)
  • Success Green: #28A745 (approved, accepted, checkmarks)
  • Warning Yellow: #FFC107 (pending, negotiation, caution)
  • Error Red: #DC3545 (rejected, denied, errors)
  • Info Blue: #17A2B8 (status changes, information)

Neutral Colors:
  • White: #FFFFFF (backgrounds, card surfaces)
  • Light Gray: #F8F9FA (alternate rows, disabled states)
  • Medium Gray: #E9ECEF (borders, dividers)
  • Dark Gray: #6C757D (secondary text, labels)
  • Black: #212529 (primary text, headings)

Semantic Colors:
  • Accept Green: #20C997 (accepted status)
  • Reject Red: #FD7E14 (rejected/denied status)
  • Progress Blue: #0D6EFD (approval progression)
```

### 15.2 Typography

```
Font Family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif

Scale:
  • H1: 32px, Bold (700), #212529
  • H2: 24px, Bold (700), #212529
  • H3: 20px, Semi-Bold (600), #212529
  • Body: 14px, Regular (400), #333333
  • Small: 12px, Regular (400), #666666
  • Label: 11px, Regular (400), #999999

Line Height:
  • Headings: 1.2
  • Body: 1.5
  • Labels: 1.3
```

### 15.3 Spacing System

```
Base Unit: 8px

Padding:
  • Component: 16px (2 units)
  • Section: 24px (3 units)
  • Page: 32px (4 units)

Margins:
  • Element: 8px (1 unit)
  • Section: 16px (2 units)
  • Heading: 24px (3 units)

Gaps:
  • Form row: 16px
  • List item: 8px
  • Card group: 24px
```

---

## 16. Advanced Features

### 16.1 Quote Management
- **Versioning**: Track multiple versions of quotations
- **Template System**: Pre-defined quote templates by product/service
- **Pricing Optimization**: Margin analysis and discount management
- **Comparison View**: Compare multiple versions side-by-side

### 16.2 Document Management
- **PDF Generation**: Auto-generate professional PDFs
- **Email Integration**: Send quotes directly to customers
- **E-signature**: Support for digital signature workflows
- **Archive**: Maintain complete quotation history

### 16.3 Analytics & Reporting
- **Quote-to-Order Conversion**: Track conversion rates
- **Time-to-Approval**: Measure approval cycle time
- **Quote Aging**: Monitor overdue quotations
- **Win/Loss Analysis**: Understand competitive positioning

### 16.4 Mobile Capabilities
- **Mobile App**: Full CRUD on mobile device
- **Offline Mode**: Work offline, sync when online
- **Push Notifications**: Alerts for quote updates
- **Mobile PDF**: Generate and send PDFs on-the-go

---

## 17. Implementation Roadmap

### Phase 1: Core (Weeks 1-4)
- [ ] Design database schema for Quotation object
- [ ] Build list view with sorting and filtering
- [ ] Create detail view with two-column layout
- [ ] Implement approval workflow tracker
- [ ] Build Details tab with all sections
- [ ] Create Related tab with line items
- [ ] Basic SAP integration for quotation IDs

### Phase 2: Enhancement (Weeks 5-8)
- [ ] Build Activity tab with activity linking
- [ ] Create Feed tab with messaging
- [ ] Implement approval workflow engine
- [ ] Add PDF generation capability
- [ ] Build line item management interface
- [ ] Create version control system
- [ ] Email integration for quote delivery

### Phase 3: Advanced (Weeks 9-12)
- [ ] Analytics & reporting dashboard
- [ ] Mobile app development
- [ ] Advanced search and filtering
- [ ] Quote comparison tool
- [ ] Template management system
- [ ] E-signature integration
- [ ] Webhook integrations

---

## 18. Testing Strategy

### 18.1 Functional Testing
- Status transitions validation
- Line item calculations and totals
- SAP integration sync verification
- Approval workflow execution
- PDF generation accuracy

### 18.2 Performance Testing
- Load time for list view (1000+ records)
- Detail view rendering performance
- Search responsiveness
- Concurrent user load testing
- PDF generation performance

### 18.3 User Acceptance Testing (UAT)
- Sales team field testing
- Finance review of approval workflow
- SAP integration testing
- PDF output validation
- End-to-end quote-to-order flow

---

## 19. Future Enhancements

- **AI-Powered Pricing**: ML model to optimize quote pricing
- **Quote Recommendations**: Suggest products based on customer history
- **Competitor Intelligence**: Track competitor pricing
- **Contract Templates**: Auto-generate contracts from quotes
- **Payment Plans**: Support flexible payment scheduling
- **Multi-Currency**: Enhanced multi-currency support
- **Subscription Quotes**: Support recurring billing quotes
- **Quote Analytics**: Predictive modeling for quote acceptance
- **API Access**: RESTful API for third-party integrations
- **Custom Objects**: Allow organizations to create custom quote types

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation

---

## Appendix A: Field Reference Guide

### Quotation Core Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Quote Number | Auto# | System identifier | 00145608 |
| Quote Name | Text | Quotation title | Quotation - v1 - PAKET PAKET SERVICE... |
| Opportunity Name | Lookup | Source opportunity | PAKET PAKET SERVICE 9500 HM GR500EX-3 |
| Expiration Date | Date | Quote validity end date | 01/06/2026 |
| Status | Picklist | Approval status | Submit, Approved, Quotation, Accepted |
| Grand Total Amount | Currency | Total quote value | IDR 17,227,977.00 |
| Billing Account | Lookup | Invoice recipient | CAHAYA TURANGGA SAKTI |

### Related Objects
- **Quote Line Items**: Individual service/product line items
- **Quote Product Items**: Product/material details with pricing
- **Approval History**: Workflow step tracking
- **Activities**: Associated tasks, calls, emails
- **Files**: Attached documents and PDFs
- **Contracts**: Related legal agreements
- **Notes**: Internal comments and observations

---

**END OF DOCUMENT**
