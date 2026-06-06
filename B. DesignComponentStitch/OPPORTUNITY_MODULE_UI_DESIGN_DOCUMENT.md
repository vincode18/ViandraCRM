# Opportunity Module - UI Design Document

## 1. Executive Summary

The **Opportunity Module** is the centerpiece of the sales pipeline management system, providing sales teams with comprehensive visibility into customer opportunities from initial prospecting through closed deals. This design document outlines a sophisticated two-column interface featuring:

- **Dynamic Milestone Process Tracker** - Visual representation of deal progression
- **Dual-Column Layout** - Detailed opportunity data with linked object relationships
- **Four-Tab Navigation System** - Details, Activity, Chatter, and Similar Opportunities
- **Contextual Quick Links** - Fast navigation to related records and quotations
- **Real-Time Status Management** - Deal stage transitions and approval workflows

---

## 2. Core Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       OPPORTUNITY RECORD                         │
│  (Central Hub for Sales Deal Management & Customer Engagement)   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MILESTONE PROCESS TRACKER                               │  │
│  │  Prospecting → Submit → Preparation → Quotation →        │  │
│  │  Negotiation → Closed Won/Lost                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────┬──────────────────────────────┐ │
│  │  COLUMN 1: OPPORTUNITY DETAILS  │  COLUMN 2: LINKED DATA   │ │
│  │  • Customer Information         │  • Related List Links    │ │
│  │  • Sales Information            │  • Products/Materials    │ │
│  │  • Amount & Forecast            │  • Quotes/Quotations     │ │
│  │  • Dates & Milestones           │  • Stage History         │ │
│  │  • SAP Integration Details      │  • Approval History      │ │
│  │  • Lost Reason Analysis         │  • Cases                 │ │
│  │                                 │  • Maintenance Plans     │ │
│  │  4 MAIN TABS:                   │  • Lost Reason Details   │ │
│  │  1. Details Tab                 │                          │ │
│  │  2. Activity Tab                │                          │ │
│  │  3. Chatter Tab                 │                          │ │
│  │  4. Similar Opportunities       │                          │ │
│  └─────────────────────────────────┴──────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Page-Level Layout Structure

### 3.1 Header Section

**Purpose**: Display opportunity identity, key metrics, and global actions.

```
┌──────────────────────────────────────────────────────────────────┐
│  UT Service Console > Opportunities / Projects                    │
│                                                                   │
│  🏢 PAKET PAKET SERVICE 9500 HM GR500EX-3                        │
│                                                                   │
│  Account Name:           KOP PEKERJA PERTAMINA PATRA WIJAYA      │
│  Opportunity Number:     OP-1502927                              │
│  Final Amount:           IDR 4,440,000.00                        │
│  Opportunity Owner:      📌 PIPIT NAWA HIDAYAT                   │
│                                                                   │
│  [Follow]  [Submit/Approve Opportunity]  [Retrieve Price] [...]  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 Header Components
- **Breadcrumb Navigation**: Context path (UT Service Console > Opportunities)
- **Record Identity**: Icon + Record Name with prominent display
- **Key Metrics Row**: Account Name, Opportunity Number, Amount, Owner
- **Action Buttons**: Follow, Submit/Approve, Retrieve Price, Generate Quotation, More (⋮)

---

### 3.2 Milestone Process Tracker

**Purpose**: Visualize opportunity progression through sales pipeline stages.

```
┌──────────────────────────────────────────────────────────────────┐
│  SALES PIPELINE STAGES (Visual Progress Bar)                     │
│                                                                   │
│  Prospecting  →  Submit  →  Preparation  →  Quotation  →         │
│     ✓           ✓           ✓              ▶◀ Current            │
│                                                  Negotiation      │
│                                                  ↓                │
│                                    ╔═══════════════════════════╗  │
│                                    ║ Closed Lost (Current)  ✗  ║  │
│                                    ║ Change Closed Stage    □  ║  │
│                                    ╚═══════════════════════════╝  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.2.1 Milestone Process Features
- **Sequential Stage Display**: 6 primary stages in left-to-right flow
- **Progress Indicators**: 
  - ✓ Completed stages (gray background)
  - ▶ Current stage (blue highlight with active indicator)
  - → Future stages (light gray)
- **Stage Buttons**: Clickable to transition between stages
- **Status Badges**: Color-coded outcome labels (Won = Green, Lost = Red)
- **Stage Change Actions**: Dedicated button to modify current stage
- **Hover Details**: Show stage entry date, expected completion

#### 3.2.2 Pipeline Stages

| Stage | Description | Typical Activities |
|-------|-------------|-------------------|
| **Prospecting** | Initial lead identification | Lead qualification, research, initial contact |
| **Submit** | Opportunity submitted for consideration | Documentation preparation, stakeholder engagement |
| **Preparation** | Internal preparation phase | Needs analysis, proposal drafting, pricing |
| **Quotation** | Formal quotation issued | Quote generation, customer review, feedback |
| **Negotiation** | Terms and conditions negotiation | Deal refinement, contract review, final terms |
| **Closed Won** | Deal successfully closed | Order creation, fulfillment, success tracking |
| **Closed Lost** | Deal lost/rejected | Reason documentation, feedback collection, analysis |

---

## 4. Column 1: Opportunity Details (Main Content Area)

**Layout**: 65% width of the two-column layout

### 4.1 Tab Navigation Structure

The Details tab is the primary view with three additional tabs for context switching:

```
┌─────────────────────────────────────────────────────────────┐
│  Details  │  Activity  │  Chatter  │  Similar Opportunities │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [TAB CONTENT AREA - Dynamic based on selected tab]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.1 Tab Styling
- **Active Tab**: Blue underline, bold text, white background
- **Inactive Tabs**: Gray text, clickable, hover state shows underline
- **Tab Icons**: Optional small icons for visual distinction
- **Badge Indicators**: Number of new/unread items (e.g., "Activity (12)")

---

### 4.2 Details Tab Structure

**Purpose**: Display comprehensive opportunity information organized by logical sections.

#### 4.2.1 Customer Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ CUSTOMER INFORMATION                                 [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Account Name              KOP PEKERJA PERTAMINA...  [Edit] │
│  Account Division          SM - KOP PEKERJAARAH...  [Edit]  │
│  Sales Office              SM-SMG                    [Edit]  │
│  Contact                   AGUS                      [Edit]  │
│  Operation Type            CON                       [Edit]  │
│  Approval Status           Approve                   [Edit]  │
│  Service Area              Semarang ST               [Edit]  │
│  Service Area Name         Semarang                          │
│  Transaction Type          With Mechanic             [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Expandable/collapsible section with [▼] icon
- Organized field pairs (label on left, value on right)
- Inline edit icons [Edit] on modifiable fields
- Linked values as clickable hyperlinks
- Read-only derived fields without edit capability

#### 4.2.2 Billing Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ BILLING                                              [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Billing Account           CAHAYA TURANGGA SAKTI    [Edit]  │
│  Billing Account Division  SM - CAHAYA TURANGGA...  [Edit]  │
│  Billing Contact Name      YULIA                     [Edit]  │
│  Billing Sales Office      SM-SMG                            │
│  Billing Division Code     SM                               │
│  Billing Sales Office Code SMG                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Account and contact information for billing purposes
- Separate from customer information for complex organizational structures
- Sales organization breakdown (Code hierarchies)

#### 4.2.3 Opportunity Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ OPPORTUNITY INFORMATION                              [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Opportunity Name          PAKET PAKET SERVICE 9500...[Edit] │
│  Opportunity Number        OP-1502927                       │
│  Source                    New Market                [Edit]  │
│  Opportunity Description   PAKET PAKET SERVICE 9500...[Edit] │
│  Case                      01553561                  [Edit]  │
│  Opportunity Owner         📌 PIPIT NAWA HIDAYAT           │
│  Close Date                16/08/2026                [Edit]  │
│  Stage                     Closed Lost               [Edit]  │
│  Pronumeration             Hot prospect              [Edit]  │
│  Amount Estimated          IDR 0 - 50,000,000.00    [Edit]  │
│  Opportunity Currency      IDR - Indonesian Rupiah         │
│  Exchange Rate IDR         0.00                      [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Primary opportunity identification and metadata
- Stage selection with current value highlighted
- Owner assignment with profile indicator
- Estimated amount range for forecasting
- Currency and exchange rate for multi-currency support

#### 4.2.4 Amount Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ AMOUNT INFORMATION                                   [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Inquiry Amount            IDR 4,440,000.00          [Edit] │
│  Quotation Amount          IDR 0.00                  [Edit]  │
│  Inquiry Amount (IDR)      0.00                             │
│  Quotation Amount (IDR)    0.00                      [Edit]  │
│  Validate Amount                                    [Edit]  │
│  SR Amount                 [empty]                          │
│  Probability (%)           0%                        [Edit]  │
│  Winning Ratio Inquiry vs SR    0%                  [Edit]  │
│  Winning Ratio Opportunity     0%                    [Edit]  │
│  Price Date                18/05/2026                [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Dual amount tracking (Inquiry vs Quotation)
- Currency conversion fields
- Probability and win ratio calculations
- Price validity date tracking
- Validation mechanism for amount consistency

#### 4.2.5 Additional Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ ADDITIONAL INFORMATION                               [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Next Step                 [empty]                  [Edit]  │
│  Age (Days)                10                               │
│  Stage Age (Days)          10                       [Edit]  │
│  Primary Promotion Source  [empty]                  [Edit]  │
│  Lead Source               [empty]                  [Edit]  │
│  Coverage Target           [empty]                  [Edit]  │
│  Date Coverage Target      [empty]                  [Edit]  │
│  Submit / Preparation date [empty]                  [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Temporal tracking (Age, Stage Age)
- Lead and promotion source attribution
- Coverage and submission timeline
- Next steps for deal progression

#### 4.2.6 SAP Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ SAP INFORMATION                                      [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SAP Notification          21315229                 [Edit]  │
│  SAP Inquiry ID            310394584                [Edit]  │
│  SAP Quotation ID          [empty]                  [Edit]  │
│  SF Case Number            202651801553561         [Edit]  │
│  SAP SO ID                 [empty]                  [Edit]  │
│  SAP SR ID                 [empty]                  [Edit]  │
│  SAP Account ID            0000041323               [Edit]  │
│  Division Code             SM                              │
│  Sales Office Code         SMG                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Integration identifiers for SAP system
- Cross-reference tracking (Notification, Inquiry, Quotation, Order, Service Request)
- Division and sales office codes for organizational structure

#### 4.2.7 Description Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ DESCRIPTION INFORMATION                              [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Description               [empty]                  [Edit]  │
│  TSM External Key          [empty]                  [Edit]  │
│  Lost Reason               Double Opportunity       [Edit]  │
│  Detailed Lost Reason      Double opportunity       [Edit]  │
│  Lost Reason Detail        [empty]                  [Edit]  │
│  Lost Reason Group         [empty]                  [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Rich text description field
- Detailed lost reason tracking with taxonomy
- Reason grouping for analytics
- Competitor reference when applicable

#### 4.2.8 System Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ SYSTEM INFORMATION                                   [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Created By                👤 PIPIT NAWA HIDAYAT,           │
│                            18/05/2026, 14:33               │
│                                                              │
│  Last Modified By          👤 UT Integration,              │
│                            27/05/2026, 05:00               │
│                                                              │
│  Record Type               Service FSL Opportunity          │
│  Opportunity Accurate      False                   [Edit]  │
│  Customer Accurate         ☐ (unchecked)           [Edit]  │
│  Product History           PERIODICAL SERVICE 2 GR500       │
│  Need Follow Up            ☑ (checked)                     │
│  Is_Send_Ing               ☐ (unchecked)           [Edit]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Audit trail (Created By, Last Modified By with timestamps)
- System flags and checkboxes
- Data accuracy indicators
- Product history reference

---

### 4.3 Activity Tab Structure

**Purpose**: Display chronological record of all activities (calls, meetings, emails) related to the opportunity.

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
│  │  • 2024-05-18: Sales call with procurement - John  │  │
│  │  • 2024-05-16: Email follow-up sent - Sarah       │  │
│  │  • 2024-05-14: Meeting notes - Technical review   │  │
│  │  • 2024-05-12: Quote revision sent - PDF attached │  │
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

### 4.4 Chatter Tab Structure

**Purpose**: Enable team collaboration through threaded conversations and status updates.

```
┌─────────────────────────────────────────────────────────────┐
│  Chatter Tab                                                │
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
│  │  👤 April Romadani closed this opportunity as       │  │
│  │  Closed Lost. | 21 May 2026 at 08:38               │  │
│  │                                                      │  │
│  │  Stage: Preparation to Closed Lost                 │  │
│  │                                                      │  │
│  │  ❤ Like    💬 Comment                              │  │
│  │  👤 Write a comment...                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  [Similar post structure for other updates...]              │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  📌 Stage submitted to Preparation                 │  │
│  │                                                      │  │
│  │  Inquiry Amount: IDR 0.00 to IDR 4,440,000.00     │  │
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

### 4.5 Similar Opportunities Tab Structure

**Purpose**: Display related opportunities with similar characteristics for cross-selling and upselling.

```
┌─────────────────────────────────────────────────────────────┐
│  Similar Opportunities Tab                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Filter & Sort Controls]                                   │
│  Show: [All Statuses ▼]  Sort: [Amount High to Low ▼]      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Similar Opportunities List                        │  │
│  │                                                     │  │
│  │  1. PAKET SERVICE 6000 HM GR500                    │  │
│  │     Account: KOP PEKERJA PERTAMINA...              │  │
│  │     Amount: IDR 2,200,000.00 | Stage: Quotation   │  │
│  │     Owner: PIPIT NAWA HIDAYAT                      │  │
│  │                                                     │  │
│  │  2. PERIODICAL SERVICE 2 GR500                     │  │
│  │     Account: KOP PEKERJA PERTAMINA...              │  │
│  │     Amount: IDR 1,800,000.00 | Stage: Submit      │  │
│  │     Owner: PIPIT NAWA HIDAYAT                      │  │
│  │                                                     │  │
│  │  [Load More...]                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Display opportunities from same customer/account
- Filter by status, owner, date range
- Sort by amount, stage, date, probability
- Quick access to related records
- Click to open in new tab/modal

---

## 5. Column 2: Related List Quick Links (35% Width)

**Purpose**: Provide instant navigation to linked records and related objects.

### 5.1 Related List Quick Links Panel

```
┌──────────────────────────────────────────────────────┐
│  RELATED LIST QUICK LINKS                       [?]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🧡 Products / Materials (1)                        │
│  📊 Quotes / Quotations (1)                         │
│  ✓ Stage History (6)                               │
│  📋 Opportunity Field History (3)                   │
│  📁 Files (0)                                       │
│  🔴 Approval History (2)                            │
│                                                      │
│  [Show All (8)]                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 5.1.1 Quick Links Features
- **Icon-Based Navigation**: Visual differentiation for each record type
- **Count Indicators**: Number of linked records in parentheses
- **Color Coding**: Icons with distinct colors for easy scanning
- **Show All Link**: Expand to full list view when needed
- **Clickable Items**: Navigate directly to related records

---

### 5.2 Promotion Info Section

**Purpose**: Display promotional offers and incentives related to the opportunity.

```
┌──────────────────────────────────────────────────────┐
│  🧡 Promotion Info (0)                         [New] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  (No active promotions)                             │
│                                                      │
│  [New Promotion]                                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Display promotional offerings
- Add new promotion button
- Link promos to quotes/orders

---

### 5.3 Products / Materials Section

**Purpose**: Show bill-of-materials and product line items for the opportunity.

```
┌──────────────────────────────────────────────────────┐
│  🧡 Products / Materials (1)                    [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  PERIODICAL SERVICE 2 GR500                         │
│  Quantity: 1.00                                     │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Product/material listing
- Quantity display
- Link to full product details
- Expandable section with [⋮] menu

---

### 5.4 Quotes / Quotations Section

**Purpose**: Display linked quotations and pricing documents.

```
┌──────────────────────────────────────────────────────┐
│  ✓ Quotes / Quotations (1)                      [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Quote: 00145608                                    │
│  Quote Name: Quotation - v1 - PAKET PAKET...       │
│  Expiration Date: 01/06/2026                        │
│  Grand Total Amount: IDR 17,227,577.00              │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Quotation listing with key details
- Quote status and validity dates
- Total amounts and pricing
- Link to edit/view full quote

---

### 5.5 Stage History Section

**Purpose**: Audit trail of stage transitions with dates and details.

```
┌──────────────────────────────────────────────────────┐
│  ✓ Stage History (3+)                           [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Stage: Closed Lost                                │
│  Estimated Amount: IDR 4,440,000.00                │
│  Probability (%): 0%                               │
│  Expected Revenue: IDR 0.00                        │
│  Close Date: 16/08/2026                            │
│  Last Modified By: April Romadani                  │
│  Last Modified: 21/05/2026, 08:37                  │
│                                                      │
│  Stage: Preparation                                │
│  Estimated Amount: IDR 4,440,000.00                │
│  Probability (%): 35%                              │
│  Expected Revenue: IDR 1,554,000.00                │
│  Close Date: 16/08/2026                            │
│  Last Modified By: April Romadani                  │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Chronological stage progression
- Metrics at each stage (Amount, Probability, Expected Revenue)
- User attribution and modification dates
- Sortable columns

---

### 5.6 Opportunity Field History Section

**Purpose**: Track changes to opportunity fields over time.

```
┌──────────────────────────────────────────────────────┐
│  📋 Opportunity Field History (3+)              [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Date: 21/05/2026, 06:38                           │
│  Field: Stage                                      │
│  User: April Romadani                              │
│  Original Value: Preparation                       │
│  New Value: Closed Lost                            │
│  [Record unlocked]                                 │
│                                                      │
│  Date: 18/05/2026, 14:35                           │
│  Field: Stage                                      │
│  User: April Romadani                              │
│  Original Value: Submit                            │
│  New Value: Preparation                            │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Complete audit trail of field modifications
- Before/after values
- User and timestamp attribution
- Reason for change (when applicable)

---

### 5.7 Files Section

**Purpose**: Store and access attachments related to the opportunity.

```
┌──────────────────────────────────────────────────────┐
│  📁 Files (0)                                    [⋮]  │
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

### 5.8 Approval History Section

**Purpose**: Display approval workflow status and history.

```
┌──────────────────────────────────────────────────────┐
│  🔴 Approval History (2)                        [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Approval to Selected Users                        │
│  Date: 18/05/2026, 14:35                           │
│  Status: Approved                                  │
│  Assigned To: April Romadani                       │
│  Actual Approver: April Romadani                   │
│  Comments: [No comments]                           │
│                                                      │
│  Approval Request Submitted                        │
│  Date: 18/05/2026, 14:35                           │
│  Status: Submitted                                 │
│  Assigned To: PIPIT NAWA HIDAYAT                  │
│  Actual Approver: PIPIT NAWA HIDAYAT              │
│  Comments: [No comments]                           │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Approval workflow steps
- Approval status (Pending, Approved, Rejected)
- Approver assignments and actions
- Approval comments and feedback

---

### 5.9 Cases Section

**Purpose**: Link support/service cases related to the opportunity.

```
┌──────────────────────────────────────────────────────┐
│  Cases (1)                                     [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  01553561                                           │
│  Subject: PAKET PAKET SERVICE 9500 HM GR500EX-3   │
│  DateITime Opened: 18/05/2026, 14:35               │
│  Priority: Medium                                  │
│                                                      │
│                                    [View All]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Related case listing
- Case number and subject
- Priority and status indicators
- Quick link to case details

---

### 5.10 Maintenance Plans Section

**Purpose**: Show maintenance/service plan agreements related to opportunity.

```
┌──────────────────────────────────────────────────────┐
│  Maintenance Plans (0)                         [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  (No maintenance plans linked)                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Maintenance plan listing
- Coverage dates and terms
- Service level agreements

---

### 5.11 Lost Reason Section

**Purpose**: Detailed analysis of lost opportunities.

```
┌──────────────────────────────────────────────────────┐
│  Lost Reason                                   [⋮]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Lost Reason Group: [Value]                        │
│  Detailed Lost Reason: Double opportunity          │
│  Lost Reason: Double opportunity [Edit]            │
│  Last O/H By: [Value]                              │
│  Last SMR: 9500                                    │
│  Lifetime Target: [Value]                 [Edit]  │
│  Start Date: [Value]                      [Edit]  │
│  Competitor Data Name: [Value]            [Edit]  │
│  Suggested Service Area: [Value]          [Edit]  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Lost reason classification
- Competitor analysis
- Lifetime value tracking
- Suggested next actions

---

## 6. Navigation & Global Actions

### 6.1 Header Action Buttons

```
┌──────────────────────────────────────────────────────┐
│  [Follow] [Submit/Approve Opportunity]               │
│  [Retrieve Price] [Generate Quotation] [More ⋮]     │
└──────────────────────────────────────────────────────┘
```

#### 6.1.1 Button Descriptions

| Button | Purpose | Availability |
|--------|---------|--------------|
| **Follow** | Subscribe to opportunity updates via email | Always |
| **Submit/Approve Opportunity** | Submit for review or approve in workflow | Draft/Submitted status |
| **Retrieve Price** | Fetch current pricing from SAP system | When pricing needed |
| **Generate Quotation** | Create a new quotation from opportunity | Has line items |
| **More (⋮)** | Additional actions (Delete, Share, Lock, etc.) | Always |

---

## 7. Data Flow & Integration Architecture

### 7.1 Opportunity Data Flow

```
┌─────────────────────────────────────────────────────┐
│  CRM OPPORTUNITY CREATION                           │
│  (Account + Customer + Product Selection)           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  OPPORTUNITY OBJECT (Salesforce/SAP Integration)    │
│  • Customer & Account Info                          │
│  • Sales Metrics (Amount, Probability)              │
│  • Stage & Timeline                                 │
│  • SAP Cross-References                             │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │QUOTATION │ │ACTIVITIES│ │STAGE HISTORY │
   │  (SAP)   │ │(Linked)  │ │(Audit Trail) │
   └──────────┘ └──────────┘ └──────────────┘
```

### 7.2 SAP Integration Points

- **SAP Notification ID**: Link to SAP opportunity
- **SAP Inquiry ID**: Reference to initial SAP inquiry
- **SAP Quotation ID**: Link to SAP quotation document
- **SAP SO ID**: Link to SAP Sales Order when won
- **SAP SR ID**: Link to SAP Service Request
- **Price Retrieval**: Fetch current pricing from SAP
- **Data Sync**: Bi-directional sync of key fields (Amount, Stage, Status)

---

## 8. Milestone Process State Management

### 8.1 Valid Stage Transitions

```
PROSPECTING
    ↓
SUBMIT
    ├─→ PREPARATION
    │       ├─→ QUOTATION
    │       │     ├─→ NEGOTIATION
    │       │     │     ├─→ CLOSED WON → (Create Order)
    │       │     │     └─→ CLOSED LOST (with reason)
    │       │     └─→ CLOSED LOST
    │       └─→ CLOSED LOST
    └─→ CLOSED LOST

CLOSED WON (Final State)
CLOSED LOST (Final State)
```

### 8.2 Stage Entry Criteria

| Stage | Entry Criteria | Exit Actions |
|-------|----------------|--------------|
| Prospecting | Initial lead creation | Submit for review |
| Submit | Lead qualified | Move to Preparation |
| Preparation | Needs analysis complete | Request quote |
| Quotation | Quote generated & sent | Await customer feedback |
| Negotiation | Customer reviewing proposal | Win/Lose decision |
| Closed Won | Customer accepted | Create order, trigger fulfillment |
| Closed Lost | Rejection or withdrawal | Document reason |

---

## 9. Responsive Design Strategy

### 9.1 Desktop Layout (1920px+)
- Two-column layout fully visible (65/35 split)
- All fields visible without scrolling within sections
- Milestone tracker at full width
- Quick links panel always visible

### 9.2 Tablet Layout (768px - 1024px)
- Two-column stack (main field above quick links)
- Collapsible sections to save vertical space
- Milestone tracker may wrap to multiple lines
- Touch-friendly button sizes (48px minimum)

### 9.3 Mobile Layout (<768px)
- Single column, full-width content
- Milestone tracker as horizontal scroll or stacked
- Bottom sheet for quick links
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
- **Validation Messages**: Associated with form fields, not just shown globally
- **Error Recovery**: Clear instructions for fixing errors

### 10.3 Interactive Components
- **Button Labels**: Descriptive, not just "Click here"
- **Icon Buttons**: Include aria-label with full text alternative
- **Expandable Sections**: ARIA-expanded state management
- **Links**: Distinguishable from body text, underlined or similar

---

## 11. Performance Optimization

### 11.1 Data Loading Strategy
- **List View**: Lazy load 25 records per page
- **Detail View**: Load main record immediately, related records on demand
- **Activity Panel**: Stream updates with WebSocket
- **Search**: Debounce search input (300ms)

### 11.2 Rendering Performance
- **Virtual Scrolling**: For lists >500 items
- **Collapsible Sections**: Prevent DOM bloat with hidden sections
- **Image Optimization**: Lazy load images, use WebP format
- **CSS Animations**: Use transform/opacity for GPU acceleration

---

## 12. User Workflows

### Workflow 1: New Opportunity Creation & Progression
1. Sales rep creates new opportunity with customer details
2. System auto-populates fields from account master
3. Rep enters sales information (product, amount, close date)
4. Rep submits opportunity (triggers approval workflow)
5. Manager reviews opportunity in Chatter feed
6. Manager approves; opportunity moves to Preparation stage
7. Rep generates quotation from opportunity
8. Customer receives quotation, negotiations begin
9. Rep updates stage to Negotiation
10. Customer accepts terms; Rep marks as Closed Won
11. System triggers SAP order creation

### Workflow 2: Lost Opportunity Analysis
1. Rep closes opportunity as Closed Lost
2. System prompts for detailed lost reason
3. Rep selects reason from taxonomy (Competitor, Price, etc.)
4. Rep adds comments on why lost
5. System records lost reason details for analytics
6. Rep checks Similar Opportunities tab for cross-sell options
7. Rep creates follow-up activity for re-engagement

### Workflow 3: Opportunity Monitoring & Updates
1. Manager opens Opportunities list (dashboard)
2. Manager reviews stage pipeline (by drag & drop)
3. Manager filters for overdue opportunities
4. Manager opens opportunity record
5. Manager reviews Activity and Chatter tabs for engagement
6. Manager checks Stage History for progression speed
7. Manager identifies bottlenecks, provides guidance in Chatter

---

## 13. Business Rules & Validations

### 13.1 Required Fields
- **Opportunity Name**: Cannot be blank
- **Account Name**: Must be a valid account lookup
- **Close Date**: Must be future date
- **Amount Estimated**: Must be numeric, >= 0
- **Stage**: Cannot be null

### 13.2 Conditional Requirements
- **Close Date Change**: Requires justification comment if moved >30 days
- **Closed Lost**: Must include Lost Reason
- **Closed Won**: Must have Quotation linked
- **Submit Stage**: Requires non-zero Amount Estimated
- **Quotation Generation**: Requires line items in opportunity

### 13.3 Business Logic
- **Automatic Stage Aging**: Display days in current stage
- **Probability Weighting**: Calculate expected revenue based on stage probability
- **Revenue Forecast**: Sum all opportunities by stage for pipeline reporting
- **SAP Sync**: Trigger on stage change (Submit, Quotation, Closed Won)
- **Price Currency**: Auto-convert based on exchange rates

---

## 14. Component Library

### 14.1 UI Components Used
- **Data Tables**: Sortable, filterable grids for lists
- **Expandable Sections**: Collapsible field groups
- **Form Fields**: Text, Date, Lookup, Picklist, Currency
- **Buttons**: Primary (Submit), Secondary (Cancel), Tertiary (More)
- **Badges**: Status indicators (Won=Green, Lost=Red, Pending=Yellow)
- **Modal Dialogs**: Stage transitions, confirmations
- **Tabs**: Navigation between different views
- **Progress Tracker**: Milestone process visualization
- **Toasts**: Success/error notifications
- **Loading Spinners**: Async data loading indicators

---

## 15. Visual Design System

### 15.1 Color Palette

```
Primary Brand Colors:
  • Primary Blue: #0066CC (buttons, active states, links)
  • Success Green: #28A745 (Closed Won, approved, checkmarks)
  • Error Red: #DC3545 (Closed Lost, errors, warnings)
  • Warning Yellow: #FFC107 (Negotiation, pending, caution)
  • Info Blue: #17A2B8 (Stage changes, information)

Neutral Colors:
  • White: #FFFFFF (backgrounds, card surfaces)
  • Light Gray: #F8F9FA (alternate rows, disabled states)
  • Medium Gray: #E9ECEF (borders, dividers)
  • Dark Gray: #6C757D (secondary text, labels)
  • Black: #212529 (primary text, headings)

Semantic Colors:
  • Win Green: #20C997 (Closed Won state)
  • Lose Red: #FD7E14 (Closed Lost state)
  • Progress Blue: #0D6EFD (Stage progression)
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

### 16.1 Opportunity Forecasting
- **Pipeline Forecast**: Weighted by probability by stage
- **Revenue Forecast**: Expected revenue = Amount × Probability %
- **Stage Velocity**: Average days in each stage
- **Conversion Rate**: Win rate by customer/product/team
- **Quota Tracking**: Progress toward sales quotas

### 16.2 Opportunity Analytics
- **Win/Loss Analysis**: Reasons for outcome
- **Deal Size Distribution**: Amount distribution by stage
- **Sales Cycle Length**: Time from Prospecting to Closed Won
- **Competitive Analysis**: Competitor win rates
- **Customer Concentration**: Revenue concentration by customer

### 16.3 Mobile Capabilities
- **Mobile App**: Full CRUD on mobile device
- **Offline Mode**: Work offline, sync when online
- **Push Notifications**: Alerts for opportunity updates
- **Geolocation**: Track sales rep location during calls
- **Voice Notes**: Audio recording for meeting summaries

---

## 17. Implementation Roadmap

### Phase 1: Core (Weeks 1-4)
- [ ] Design database schema for Opportunity object
- [ ] Build list view with sorting and filtering
- [ ] Create detail view with two-column layout
- [ ] Implement milestone process tracker
- [ ] Build Details tab with all sections
- [ ] Create Activity tab with activity linking
- [ ] Basic SAP integration for notifications

### Phase 2: Enhancement (Weeks 5-8)
- [ ] Build Chatter tab with messaging
- [ ] Create Similar Opportunities view
- [ ] Implement approval workflow
- [ ] Add quotation linking
- [ ] Build stage history tracking
- [ ] Create field audit trail
- [ ] Email integration for notifications

### Phase 3: Advanced (Weeks 9-12)
- [ ] Analytics & reporting dashboard
- [ ] Mobile app development
- [ ] Advanced search and filtering
- [ ] AI-powered recommendations
- [ ] Forecasting models
- [ ] Custom field support
- [ ] Webhook integrations

---

## 18. Testing Strategy

### 18.1 Functional Testing
- Stage transitions validation
- Field validation and required field checks
- Calculation verification (probability, revenue, age)
- SAP integration sync verification
- Approval workflow execution

### 18.2 Performance Testing
- Load time for list view (1000+ records)
- Detail view rendering performance
- Search responsiveness
- Image and file loading optimization
- Concurrent user load testing

### 18.3 User Acceptance Testing (UAT)
- Sales team field testing
- Management review of reporting
- Integration testing with SAP
- Data migration validation
- User training and documentation

---

## 19. Future Enhancements

- **AI-Powered Deal Scoring**: ML model to predict win probability
- **Opportunity Recommendations**: Suggest similar products/bundles
- **Competitor Intelligence**: Automated competitor tracking
- **Email Integration**: Auto-sync emails to opportunity
- **Calendar Integration**: Schedule activities from opportunity
- **Document Generation**: Auto-generate proposals from opportunity
- **Territory Management**: Assign opportunities by geography
- **Commission Tracking**: Calculate commissions from closed deals
- **API Access**: RESTful API for third-party integrations
- **Custom Objects**: Allow orgs to create related objects

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation

---

## Appendix A: Field Reference Guide

### Opportunity Core Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Opportunity Name | Text | Deal name | PAKET SERVICE 9500 HM GR500EX-3 |
| Opportunity Number | Auto# | System identifier | OP-1502927 |
| Account Name | Lookup | Customer account | KOP PEKERJA PERTAMINA PATRA |
| Close Date | Date | Expected close date | 16/08/2026 |
| Stage | Picklist | Pipeline stage | Closed Lost |
| Amount Estimated | Currency | Estimated deal value | IDR 4,440,000.00 |
| Probability (%) | Percent | Win probability | 0% (Lost) / 35% (Prep) / 50% (Quote) |

### Related Objects
- **Quotations**: Pricing documents
- **Activities**: Calls, emails, meetings
- **Products**: Bill of materials
- **Cases**: Support tickets
- **Approval Records**: Workflow steps
- **Stage History**: Audit trail of stage changes

---

**END OF DOCUMENT**
