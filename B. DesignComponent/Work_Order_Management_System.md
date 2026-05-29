# Work Order Management System - Detailed Documentation

## Overview
Sistem manajemen Work Order yang terintegrasi dengan Case Management. Work Order berfungsi untuk tracking dan penyelesaian pekerjaan teknis di lapangan dengan linked objects dan detailed information.

---

## 1. WORK ORDER HEADER & NAVIGATION

### 1.1 Tab Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  [Console] [WO-01175508] [Case 01532785]  [Additional Tabs...]             │
│                                                                               │
│  Current Work Order: 01275781                                              │
│  ├─ Parent Case: 01553477                                                  │
│  ├─ Status: New → In Progress → Completed                                  │
│  └─ Owner: UT Integration                                                  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Tab Layout When Opened from Case

```
CASE VIEW → WORK ORDER TAB
│
├─ Case #01532785 (Previous Tab - Still Available)
│  ├─ Details
│  ├─ Feed
│  ├─ Related
│  └─ History
│
└─ Work Order #01275781 (New Tab - Opened from Case)
   ├─ Details
   ├─ Feed
   └─ Related
   
USER CAN SWITCH BETWEEN CASE & WORK ORDER TABS SEAMLESSLY
```

---

## 2. WORK ORDER MAIN VIEW - 2 COLUMN LAYOUT

### 2.1 Column Layout Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781                                                       │
├────────────────────────────┬────────────────────────────────────────────────┤
│                            │                                                │
│   COLUMN 1                 │         COLUMN 2                              │
│   WO DETAILS               │         LINKED OBJECTS                        │
│   (Left Panel - 60%)       │         (Right Panel - 40%)                   │
│                            │                                                │
│ ┌──────────────────────┐   │ ┌──────────────────────────────────┐          │
│ │                      │   │ │                                  │          │
│ │ • General Info       │   │ │ • Recommended Mechanic           │          │
│ │ • Status Details     │   │ │ • Knowledge Base                 │          │
│ │ • Asset Info         │   │ │ • Asset Details                  │          │
│ │ • Dates & Times      │   │ │ • Work Plans                     │          │
│ │ • Service Details    │   │ │ • Work Steps                     │          │
│ │ • KC Information     │   │ │ • Service Appointments           │          │
│ │ • Additional Info    │   │ │ • Work Order Line Items          │          │
│ │                      │   │ │ • Files & Attachments            │          │
│ │ [Expandable Sections]│   │ │ • Articles & Documentation       │          │
│ │                      │   │ │ • Service Reports                │          │
│ │                      │   │ │ • Work Order Task Lists          │          │
│ │                      │   │ │ • Time Sheet Entries             │          │
│ │                      │   │ │ • Problems                       │          │
│ │                      │   │ │ • PCVs                           │          │
│ │                      │   │ │ • Competitor Information         │          │
│ │                      │   │ │ • Parts Supplied                 │          │
│ │                      │   │ │ • Work Order History             │          │
│ │                      │   │ │ • Opportunities                  │          │
│ │                      │   │ │ • EMR Records                    │          │
│ │                      │   │                                    │          │
│ └──────────────────────┘   │ └──────────────────────────────────┘          │
│                            │                                                │
└────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 3. COLUMN 1 - WORK ORDER DETAILS (LEFT PANEL)

### 3.1 General Information Section

| Field | Value | Editable |
|-------|-------|----------|
| **Work Order Number** | 01275781 | ✓ |
| **System Status** | REL-PRC-CSER-SAAP-NMAT | ✓ |
| **Case** | 01553477 | ✓ |
| **Parent Work Order** | — | ✓ |
| **Account** | SIMS JAYA KALTIM | ✓ |
| **Contact** | BURHAN | ✓ |
| **Subject** | TRS HYDRAULIK SYSTEM HO785 | ✓ |
| **Description** | TRS HYDRAULIK SYSTEM HO785 | ✓ |

### 3.2 Status & Completion Details

| Field | Value | Status |
|-------|-------|--------|
| **Status** | New | 🟡 In Progress |
| **Complete/Cancel** | — | ☐ |
| **Case Type** | Request | — |
| **Call Type** | Service | — |
| **Sub Call Type** | NFMC - Troubleshooting | — |
| **Date/Time in Progress** | 26/05/2026, 07:00 | — |
| **Date/Time Completed** | — | Pending |
| **Date Time Send to SAP** | — | ☐ |

### 3.3 Technical & Service Details

| Field | Value | Edit |
|-------|-------|------|
| **Last SMR** | 6006I.0 | ✓ |
| **Actual SMR** | — | ✓ |
| **SMR Problem** | — | ✓ |
| **Location** | — | ✓ |
| **Last Measuring Date** | 15/03/2025, 15:58 | ✓ |
| **Data Number** | 01553477 | ✓ |
| **SAP Work Order Number** | 51524826 | ✓ |
| **Start Date** | 26/05/2026 | ✓ |
| **End Date** | 28/05/2026 | ✓ |
| **Date Time Release WO** | 26/05/2026, 07:36 | ✓ |

### 3.4 Lead Time & Scheduling

| Field | Value | Edit |
|-------|-------|------|
| **LeadTime 0** | — | ✓ |
| **Aging WO Claim** | — | ✓ |
| **ABR File** | ☐ | ✓ |
| **ABR File Date** | — | ✓ |
| **LT ABR** | 0 | ✓ |
| **SA Completed** | — | ✓ |

### 3.5 Lokasi Pembebanan (Location Charging) Section

```
┌─────────────────────────────────────────────────────┐
│ ▼ LOKASI PEMBEBANAN                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Akotasi: [_____________________] [✏️]              │
│                                                     │
│ Pembaharan: [_____________________] [✏️]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.6 KC (Knowledge/Cost) Information Section

```
┌─────────────────────────────────────────────────────┐
│ ▼ KC INFORMATION                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ KC Number:              51524826          [✏️]     │
│ SAP Work Order Number KC: 51524826        [✏️]     │
│ DC QR Date:             [___________]      [✏️]     │
│ Parts QR Date:          [___________]      [✏️]     │
│ KC Rejected Reason:     [___________]      [✏️]     │
│ Reason for Rejection:   [___________]      [✏️]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.7 Information Section - Object Part

```
┌─────────────────────────────────────────────────────┐
│ ▼ INFORMATION                                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Object Part:            Hydraulic System   [✏️]     │
│ Specific Object Part:    Hydraulic System-related [✏️]│
│ Code:                   See Description    [✏️]     │
│ Damage:                 See Description    [✏️]     │
│ Malfunction Start Date: 26/05/2026, 07:30 [✏️]     │
│ Malfunction End Date:   [___________]      [✏️]     │
│ Breakdown Indicator:    ☐                  [✏️]     │
│ Actual Malfunction Duration: [___________] [✏️]    │
│ Mechanic Name:          UT Integration     [✏️]     │
│ Actual Malfunction Start Date: 26/05/2026 [✏️]    │
│ Actual Malfunction End Date: 26/05/2026   [✏️]    │
│ Planned Action Date:    26/05/2026, 07:45 [✏️]     │
│ Owner:                  UT Integration     [👤]     │
│ Service Territory:      Batukaang Others ST[✏️]     │
│ Actual Machine Location:[___________]      [✏️]     │
│ Purchase Order Date:    27/12/2009        [✏️]     │
│ WorkOrder Parameters:   1                  [✏️]     │
│ Chesshead Done:         ☐                  [✏️]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.8 Additional Information Section

```
┌─────────────────────────────────────────────────────┐
│ ▼ ADDITIONAL INFORMATION                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ TSR Data Completeness Score:  [______]     [✏️]    │
│ TSR Root Cause Score:         [______]     [✏️]    │
│ TSR Monitoring Score:         [______]     [✏️]    │
│ TSR Overall Score:            [______]     [✏️]    │
│ Related Files URL:                                 │
│ https://unitedtractors.lightning.force...         │
│ qfcb/related/AttachedContentDocuments/view [🔗]   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.9 SA Information Section

```
┌─────────────────────────────────────────────────────┐
│ ▼ SA INFORMATION                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ First SA to Travel:       [____________]   [ℹ️]    │
│ First SA to In Progress:  [____________]   [ℹ️]    │
│ First SA to Complete:     [____________]   [ℹ️]    │
│ Asynchronous Form:        ☐               [✏️]    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.10 Description Section

```
┌─────────────────────────────────────────────────────┐
│ ▼ DESCRIPTION                                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Load Work Plan:                                    │
│ [_________________________________________] [✏️]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.11 System Information Section

```
┌─────────────────────────────────────────────────────┐
│ ▼ SYSTEM INFORMATION                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Created By:   UT Integration  26/05/2026, 07:36   │
│ Last Modified By: M. Thoriqul Anwar Hidayat       │
│               26/05/2026, 11:12                    │
│                                                     │
│ [Recent Items] [Macros] [Chatter Feed]            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. COLUMN 2 - LINKED OBJECTS (RIGHT PANEL)

### 4.1 Recommended Mechanic

```
┌──────────────────────────────────────────────────┐
│ ⭐ RECOMMENDED MECHANIC                          │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Blue Button: "Rekomendasi Mekanik"]            │
│                                                  │
│ Displays recommended mechanic for this WO       │
│ based on skills, availability, and location     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.2 Knowledge Base

```
┌──────────────────────────────────────────────────┐
│ 📚 KNOWLEDGE                                     │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Filter] [Search Knowledge...]                  │
│                                                  │
│ 📄 Related Articles:                            │
│                                                  │
│ • GD825A Hydraulic Pump Replacement Proc...    │
│   Article - KN-0921          [Relevance: 85%]  │
│                                                  │
│ • Troubleshooting Thrust Plate Wear             │
│   Bulletin - TB-1184          [Relevance: 78%]  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.3 Asset Details

```
┌──────────────────────────────────────────────────┐
│ 🏭 ASSET DETAILS                                │
├──────────────────────────────────────────────────┤
│                                                  │
│ Asset Name:           GD785-7 : BO76  [🔗]      │
│ Warranty Start Date:  27/12/2009      [✏️]      │
│ Warranty End Date:    27/12/2010      [✏️]      │
│                                                  │
│ Serial Number:        BO76            [✏️]      │
│ Unit Model:           HD785-7         [✏️]      │
│ Unit Code:            HD1114          [✏️]      │
│ Material Number:      HD785-7         [✏️]      │
│ SMR:                  6006I.0         [✏️]      │
│ Equipment UoM:        hm              [✏️]      │
│ Measuring Date:       15/03/2025, 15:58 [✏️]   │
│                                                  │
├──────────────────────────────────────────────────┤
│ [Expand] View Full Asset Details                │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.4 Work Plans (0)

```
┌──────────────────────────────────────────────────┐
│ 📋 WORK PLANS (0)                       [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No work plans currently linked to this WO      │
│                                                  │
│ [➕ Create New Work Plan]                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.5 Work Steps (0)

```
┌──────────────────────────────────────────────────┐
│ 👣 WORK STEPS (0)                       [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No work steps currently defined for this WO    │
│                                                  │
│ [➕ Add Work Step]                              │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.6 Service Appointments (1)

```
┌──────────────────────────────────────────────────┐
│ 📅 SERVICE APPOINTMENTS (1)             [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ SA-2124973                                      │
│ ├─ Account: SIMS JAYA KALTIM                   │
│ ├─ Status: Scheduled                           │
│ └─ UT Dispatch: Assigned                       │
│                                                  │
│ [View All]                                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.7 Work Order Line Items (3+)

```
┌──────────────────────────────────────────────────┐
│ 📦 WORK ORDER LINE ITEMS (3+)          [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ 00000001                                        │
│ ├─ Parent WO Line Item: Maintenance Repair     │
│ ├─ Subject: Maintenance Repair Record          │
│ ├─ Status: New                                 │
│                                                  │
│ 00000002                                        │
│ ├─ Parent WO Line Item: Problem Log             │
│ ├─ Subject: Problem Log                        │
│ ├─ Status: New                                 │
│                                                  │
│ 00000003                                        │
│ ├─ Parent WO Line Item: General Info            │
│ ├─ Subject: General Info                       │
│ ├─ Status: New                                 │
│                                                  │
│ [View All]                                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.8 Files & Attachments (0)

```
┌──────────────────────────────────────────────────┐
│ 📁 FILES (0)                            [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ [📥 Upload Files]                               │
│ Or drag & drop files                            │
│                                                  │
│ No files currently attached                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.9 Articles & Documentation (0)

```
┌──────────────────────────────────────────────────┐
│ 📖 ARTICLES (0)                         [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No related articles attached                    │
│                                                  │
│ [🔍 Search Knowledge Base]                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.10 Service Reports (0)

```
┌──────────────────────────────────────────────────┐
│ 📊 SERVICE REPORTS (0)                  [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No service reports generated yet               │
│                                                  │
│ [➕ Generate Report]                            │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.11 Work Order Task Lists (3+)

```
┌──────────────────────────────────────────────────┐
│ ✅ WORK ORDER TASK LISTS (3+)          [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ s1OMg0000lywstD                                 │
│ ├─ Operation Number: 0010                       │
│ ├─ Operation Description: Preparation           │
│ ├─ Duration: 1                                 │
│                                                  │
│ s1OMg0000lywstF                                 │
│ ├─ Operation Number: 0020                       │
│ ├─ Operation Description: Traveling             │
│ ├─ Duration: 0                                 │
│                                                  │
│ s1OMg0000lywstF                                 │
│ ├─ Operation Number: 0030                       │
│ ├─ Operation Description: Waiting during job    │
│ ├─ Duration: 0                                 │
│                                                  │
│ [View All]                                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.12 Time Sheet Entries (0)

```
┌──────────────────────────────────────────────────┐
│ ⏱️ TIME SHEET ENTRIES (0)               [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No time sheet entries recorded yet             │
│                                                  │
│ [➕ Add Time Entry]                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.13 Problems (0)

```
┌──────────────────────────────────────────────────┐
│ ⚠️ PROBLEMS (0)                         [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No problems documented for this WO             │
│                                                  │
│ [➕ Report Problem]                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.14 Service Products (0)

```
┌──────────────────────────────────────────────────┐
│ 🔧 SERVICE PRODUCTS (0)                [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No service products linked to this WO          │
│                                                  │
│ [➕ Add Service Product]                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.15 Parts Requests (0)

```
┌──────────────────────────────────────────────────┐
│ 📦 PARTS REQUESTS (0)                   [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No parts requests created yet                  │
│                                                  │
│ [➕ Create Parts Request]                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.16 Work Order History (3+)

```
┌──────────────────────────────────────────────────┐
│ 📜 WORK ORDER HISTORY (3+)             [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ Date: 26/05/2026, 07:36                       │
│ Field: Created                                  │
│ User: UT Integration                           │
│ Original Value: —                               │
│ New Value: —                                    │
│                                                  │
│ Date: 26/05/2026, 07:36                       │
│ Field: Asset                                   │
│ User: UT Integration                           │
│ Original Value: —                               │
│ New Value: HD785-7 : BO76                      │
│                                                  │
│ Date: 26/05/2026, 07:36                       │
│ Field: WorkOrder Parameters                    │
│ User: UT Integration                           │
│ Original Value: —                               │
│ New Value: 1                                   │
│                                                  │
│ [View All]                                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.17 Opportunities (0)

```
┌──────────────────────────────────────────────────┐
│ 💰 OPPORTUNITIES (0)                    [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No opportunities linked to this WO             │
│                                                  │
│ [➕ Create Opportunity]                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.18 EMR Records (0)

```
┌──────────────────────────────────────────────────┐
│ 🏥 EMR (0)                              [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No EMR records associated with this WO        │
│                                                  │
│ [➕ Add EMR Record]                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.19 PCVs (0)

```
┌──────────────────────────────────────────────────┐
│ 🔐 PCVs (0)                             [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No PCV records linked to this WO               │
│                                                  │
│ [➕ Add PCV]                                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.20 Competitor Information (0)

```
┌──────────────────────────────────────────────────┐
│ 🏢 COMPETITOR INFORMATION (0)          [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No competitor information recorded             │
│                                                  │
│ [➕ Add Competitor Info]                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4.21 Parts Supplied (0)

```
┌──────────────────────────────────────────────────┐
│ 🚚 PARTS SUPPLIED (0)                   [⬇]     │
├──────────────────────────────────────────────────┤
│                                                  │
│ No parts supplied for this WO yet              │
│                                                  │
│ [➕ Record Parts Supplied]                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 5. WORK ORDER TABS & NAVIGATION

### 5.1 Tab Structure in Details View

```
┌─────────────────────────────────────────────────────────────┐
│ Work Order #01275781                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ [Details] [Feed] [Related]                                 │
│   │
│   └─> Details Tab shows 2-Column Layout (Left + Right)
│       ├─ Left Panel: WO Details (Sections 3.1-3.11)
│       └─ Right Panel: Linked Objects (Sections 4.1-4.21)
│                                                              │
│ [Feed] [Related]                                            │
│   │
│   └─> Feed Tab shows:
│       ├─ Recent Activity
│       ├─ Comments
│       ├─ Change History
│       └─ Chatter Messages
│                                                              │
│ [Related]                                                   │
│   │
│   └─> Related Tab shows:
│       ├─ Related Cases
│       ├─ Related Contacts
│       ├─ Related Accounts
│       └─ Related Documents
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Tab Behavior When Opened from Case

```
CASE VIEW (Tab 1)
├─ [Details] [Feed] [Related]
├─ Displays Case #01532785
└─ Options: Edit, Change Owner, Print, etc.

WORK ORDER VIEW (Tab 2) - Opened from Case
├─ [Details] [Feed] [Related]
├─ Displays Work Order #01275781
├─ Links back to Case #01532785
└─ Options: Book Appt., Approve/Reject, Generate PDF, etc.

USER INTERACTION:
• Click on Work Order link in Case → Opens as new Tab
• Both Case Tab & Work Order Tab remain visible
• User can switch between tabs seamlessly
• Data in both tabs updates in real-time
```

---

## 6. WORK ORDER ACTION BUTTONS & TOOLBAR

### 6.1 Top Toolbar Actions

```
┌──────────────────────────────────────────────────────────────────────┐
│ Work Order #01275781                                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ [Book Appointment] [Approve/Reject WO] [Generate PDF] [Send Job...] │
│ [🎯 Recommend Mechanic] [⋯ More Options]                           │
│                                                                       │
│ Quick Actions:                                                        │
│ • Print View → Generate PDF for printing/sharing                    │
│ • Send to SAP → Sync with SAP system                                │
│ • Book Appointment → Schedule field visit                           │
│ • Approve/Reject → Validate WO before execution                     │
│ • Recommend Mechanic → AI-powered mechanic assignment               │
│                                                                       │
│ Additional Options (⋯):                                              │
│ • Clone Work Order                                                   │
│ • Create Similar WO                                                 │
│ • Change Owner                                                       │
│ • Change Status                                                      │
│ • Email Work Order                                                   │
│ • Export to Excel                                                    │
│ • View Audit Trail                                                  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. WORK ORDER FEED TAB

### 7.1 Feed Tab Content

```
┌──────────────────────────────────────────────────────────────────────┐
│ Work Order #01275781 › FEED                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ [Post] [File] [Link] [Filter ▼]                                    │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ TI  Tegar Alnu Indrawan created this Work Order            │    │
│ │     Oct 12, 14:32                                           │    │
│ │                                                              │    │
│ │     Initial creation from Case 01532785 regarding           │    │
│ │     GD825A-2 hydraulic pressure drop.                       │    │
│ │                                                              │    │
│ │ [pump_wear_01.jpg] [diagnostic_report.pdf]                 │    │
│ └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ ⟲   Status changed from New to In Progress                 │    │
│ │     Oct 12, 15:05                                           │    │
│ │                                                              │    │
│ └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ TI  Tegar Alnu Indrawan added Approval Notes               │    │
│ │     Oct 13, 09:15                                           │    │
│ │                                                              │    │
│ │     Inspected the main pump. Found significant wear on      │    │
│ │     the thrust plate. Requires immediate replacement        │    │
│ │     before further operation to prevent catastrophic        │    │
│ │     failure.                                                │    │
│ │                                                              │    │
│ │ [🏷️ approval_photo_01.jpg] [🏷️ approval_photo_02.jpg]     │    │
│ └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ ⓘ System updated status                                     │    │
│ │    Oct 14, 11:30                                            │    │
│ │                                                              │    │
│ │    🔴 Work Order cancelled. Parts unavailable locally;      │    │
│ │    consolidated into WO-01176-0023 for depot repair.        │    │
│ │                                                              │    │
│ │    [🏷️ cancellation_reason_doc.pdf]                        │    │
│ └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│ [Write a post...]                                                    │
│                                                    [📎 File] [Share] │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 8. DETAILED OBJECT DEFINITIONS

### 8.1 Work Plan Object

| Attribute | Description |
|-----------|-------------|
| **Work Plan ID** | Unique identifier for the work plan |
| **Work Plan Title** | Name of the work plan |
| **Status** | Draft, Active, Completed, Cancelled |
| **Start Date** | Planned start date |
| **End Date** | Planned end date |
| **Assigned To** | Mechanic or technician assigned |
| **Description** | Detailed work plan description |
| **Estimated Hours** | Expected labor hours |
| **Parts List** | Associated parts/materials |
| **Attachments** | Related documents |

### 8.2 Work Step Object

| Attribute | Description |
|-----------|-------------|
| **Step Number** | Sequential step ID |
| **Step Title** | Name of the step |
| **Sequence** | Order in work process |
| **Description** | Detailed instructions |
| **Estimated Duration** | Time estimate per step |
| **Tools Required** | Equipment needed |
| **Safety Notes** | Safety precautions |
| **Completed By** | Technician who completed |
| **Completion Date** | When completed |
| **Notes** | Additional remarks |

### 8.3 Service Appointment Object

| Attribute | Description |
|-----------|-------------|
| **Appointment ID** | SA-XXXXXXX |
| **Appointment Date** | Scheduled date/time |
| **Duration** | Length of appointment |
| **Location** | Service location |
| **Account** | Customer account |
| **Contact** | Customer contact person |
| **Status** | Scheduled, Confirmed, Completed |
| **Mechanic Assigned** | Service technician |
| **Notes** | Special instructions |
| **Confirmation** | Customer acknowledgment |

### 8.4 Work Order Line Item Object

| Attribute | Description |
|-----------|-------------|
| **Line Item ID** | XXXXXXXXXX |
| **Subject** | Line item description |
| **Type** | Maintenance, Repair, Inspection, etc. |
| **Status** | New, In Progress, Completed |
| **Parts Count** | Number of parts in this line |
| **Labor Hours** | Hours allocated |
| **Cost Estimate** | Estimated cost |
| **Parent WO** | Reference to main WO |
| **Completion Date** | When completed |

### 8.5 Work Order Task Object

| Attribute | Description |
|-----------|-------------|
| **Task ID** | sXXXXXXXXXXXXXX |
| **Operation Number** | 0010, 0020, 0030, etc. |
| **Operation Description** | Preparation, Traveling, Waiting, etc. |
| **Duration** | Time in hours |
| **Sequence** | Order of operations |
| **Assigned To** | Resource allocation |
| **Status** | Pending, In Progress, Done |
| **Notes** | Special instructions |

### 8.6 Time Sheet Entry Object

| Attribute | Description |
|-----------|-------------|
| **Entry ID** | Unique identifier |
| **Date** | Work date |
| **Start Time** | Start of work |
| **End Time** | End of work |
| **Total Hours** | Calculated hours |
| **Task** | Associated task |
| **Description** | Work performed |
| **Mechanic** | Employee who worked |
| **Billable** | Yes/No flag |

### 8.7 Problem Object

| Attribute | Description |
|-----------|-------------|
| **Problem ID** | Issue reference number |
| **Title** | Problem description |
| **Severity** | High, Medium, Low |
| **Status** | Open, In Investigation, Resolved |
| **Root Cause** | Identified root cause |
| **Impact** | Business/Safety impact |
| **Resolution** | How it was fixed |
| **Reported By** | Technician name |
| **Report Date** | When reported |

### 8.8 Service Product Object

| Attribute | Description |
|-----------|-------------|
| **Product ID** | Service product code |
| **Product Name** | TRS HYDRAULIK SYSTEM, etc. |
| **Item Number** | Service product item code |
| **Description** | Detailed service description |
| **Labor Hours** | Standard labor time |
| **Parts List** | Associated parts |
| **Cost** | Service cost |
| **Status** | Active, Inactive |
| **Category** | Classification |

### 8.9 Parts Request Object

| Attribute | Description |
|-----------|-------------|
| **Request ID** | Parts request number |
| **Part Number** | OEM part number |
| **Part Description** | What part is needed |
| **Quantity** | Number of units |
| **Urgency** | Critical, High, Normal |
| **Status** | Submitted, Approved, Ordered, Received |
| **Supplier** | Parts supplier |
| **ETA** | Estimated arrival |
| **Cost** | Unit cost |

---

## 9. WORK ORDER FLOW DIAGRAM

### 9.1 Work Order Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ WORK ORDER LIFECYCLE                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                      ┌────────┐                             │
│                      │  CASE  │                             │
│                      └────────┘                             │
│                          │                                  │
│                          │ Create WO                        │
│                          ▼                                  │
│                  ┌──────────────┐                           │
│                  │ NEW (Status) │                           │
│                  └──────────────┘                           │
│                          │                                  │
│                          │ Release to Field                 │
│                          ▼                                  │
│              ┌────────────────────────┐                     │
│              │ IN PROGRESS (Working)  │                     │
│              └────────────────────────┘                     │
│                    │        │        │                      │
│       ┌────────────┘        │        └──────────┐          │
│       │                     │                   │          │
│       │          Parts Needed?           Field Complete?    │
│       │                     │                   │          │
│   [Request]              [Waiting]          [Report]       │
│       │                     │                   │          │
│       └────────────────────────────────────────┘          │
│                          │                                 │
│                          ▼                                 │
│              ┌─────────────────────┐                       │
│              │ COMPLETED (Ready)   │                       │
│              └─────────────────────┘                       │
│                          │                                 │
│                          │ Approve & Close                 │
│                          ▼                                 │
│              ┌─────────────────────┐                       │
│              │ CLOSED (Finished)   │                       │
│              └─────────────────────┘                       │
│                          │                                 │
│                          │ Archive                         │
│                          ▼                                 │
│              ┌─────────────────────┐                       │
│              │ ARCHIVED (History)  │                       │
│              └─────────────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. CASE-TO-WORK-ORDER NAVIGATION

### 10.1 Opening Work Order from Case

```
┌─────────────────────────────────────────────────────────┐
│ CASE #01532785 (OPENED)                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Tab 1: Cases] [Tab 2: 01175508] [Tab 3: ...]         │
│                                                          │
│ Case Details:                                           │
│ ├─ Status: Open/In Progress/Closed                     │
│ ├─ Related Work Orders:                                │
│ │  ├─ [WO-01175508] Excavator Hydraulic Failure       │
│ │  ├─ [WO-01176-0023] Depot Repair (Consolidated)     │
│ │  └─ [WO-01177-0001] Follow-up Service               │
│ │                                                       │
│ │  Click on WO-01175508 →                              │
│ │                                                       │
│ └─ [Opens New Tab #2 with WO Details]                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
                              │
                              │ User clicks WO link
                              ▼
┌─────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781 (NEWLY OPENED)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Tab 1: Cases] [Tab 2: 01175508] [Tab 3: ...]         │
│ ↑                                    ↑                   │
│ Case tab still available    WO tab now open             │
│                                                          │
│ WO Details (2-Column Layout):                          │
│ ├─ Left: WO Information & Status                       │
│ └─ Right: Linked Objects & References                 │
│                                                          │
│ Can see Case reference in WO Details:                  │
│ ├─ Parent Case: 01532785                              │
│ └─ [Link to Case] → Click to return to Case Tab       │
│                                                          │
│ Navigation Breadcrumb:                                 │
│ Case #01532785 > Work Order #01275781                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Maintaining Previous Tabs

```
TAB MANAGEMENT:

User Action 1: Open Case #01532785
Result: Tab 1 created [Cases - 01532785]

User Action 2: Click on Work Order link within Case
Result: Tab 2 created [Work Order - 01275781]
        Tab 1 remains open and accessible

User Action 3: Click on Related Case link in WO
Result: Focuses on Tab 1 [Cases - 01532785]
        Tab 2 remains open in background

User Action 4: Open another Work Order from same Case
Result: Tab 3 created [Work Order - 01275782]
        Tab 1 & 2 remain accessible

NAVIGATION PATTERN:
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│  Cases Tab  │  │  Work Order  │  │  Work Order  │
│  #01532785  │  │  #01275781   │  │  #01275782   │
└─────────────┘  └──────────────┘  └──────────────┘
      ↑                ↑                   ↑
   [Click]         [Click]             [Click]
   Case           WO Details           WO Details
   Details        (2-Column)           (2-Column)
```

---

## 11. WORK ORDER UI - ASCII DIAGRAM MOCKUPS

### 11.1 Work Order Main View (2-Column Layout)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE - WORK ORDER                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [Cases 01532785] [WO 01275781] [Additional Tabs...]                         │
│                                                                               │
│  Work Order: 01275781                                                       │
│  ├─ Parent Case: 01553477                                                   │
│  ├─ Asset: GD825A-2                                                         │
│  ├─ Status: New → In Progress → Completed                                   │
│  └─ Owner: UT Integration                                                   │
│                                                                               │
│  [Book Appt.] [Approve/Reject WO] [Generate PDF] [Send to SAP] [⋯]        │
│                                                                               │
├────────────────────────────────────────┬───────────────────────────────────┤
│                                        │                                    │
│  LEFT COLUMN (60%)                     │  RIGHT COLUMN (40%)               │
│  ════════════════════════════════════  │  ═══════════════════════════════ │
│                                        │                                    │
│  WO DETAILS                            │  LINKED OBJECTS                    │
│                                        │                                    │
│  Details  Feed  Related                │  [Recommended Mechanic]           │
│  ───────────────────────               │  [Knowledge Base]                │
│                                        │                                    │
│  ▼ GENERAL INFORMATION                 │  ▼ ASSET DETAILS                  │
│  ├─ Work Order #: 01275781             │  ├─ Asset Name: GD825A-2         │
│  ├─ System Status: REL-PRC-CSER        │  ├─ Serial Number: 120948A       │
│  ├─ Case: 01553477          [🔗]       │  ├─ Operating Hours: 4,520 hrs   │
│  ├─ Account: SIMS JAYA KALTIM         │  ├─ Location: Site B - Pit 4     │
│  ├─ Contact: BURHAN         [👤]       │  └─ Service Territory: Batuk... │
│  ├─ Subject: TRS HYDRAULIK SYSTEM      │                                    │
│  ├─ Description: TRS HYDRAULIK...      │  ▼ WORK PLANS (0)                │
│  └─ [Show More Fields] ▼               │  ├─ No work plans linked         │
│                                        │  └─ [+ Create New Plan]          │
│  ▼ STATUS & COMPLETION                │                                    │
│  ├─ Status: New              [✏️]      │  ▼ WORK STEPS (0)                │
│  ├─ Complete/Cancel: ☐       [✏️]      │  ├─ No work steps defined        │
│  ├─ Case Type: Request       [✏️]      │  └─ [+ Add Work Step]            │
│  ├─ Call Type: Service       [✏️]      │                                    │
│  ├─ Sub Call Type: NFMC...   [✏️]      │  ▼ SERVICE APPOINTMENTS (1)      │
│  ├─ Date/Time In Progress: 26/05/2026  │  ├─ SA-2124973                   │
│  │  07:00                     [✏️]      │  ├─ Status: Scheduled            │
│  └─ Date/Time Completed: —  [✏️]       │  └─ [View All]                   │
│                                        │                                    │
│  ▼ TECHNICAL & SERVICE DETAILS         │  ▼ WORK ORDER LINE ITEMS (3+)    │
│  ├─ Last SMR: 6006I.0       [✏️]      │  ├─ 00000001: Maintenance       │
│  ├─ Actual SMR: —           [✏️]       │  │  Repair Record               │
│  ├─ SMR Problem: —          [✏️]       │  ├─ 00000002: Problem Log       │
│  ├─ Location: —             [✏️]       │  ├─ 00000003: General Info      │
│  ├─ Last Measuring Date: 15/03/2025    │  └─ [View All]                   │
│  │                           [✏️]      │                                    │
│  ├─ Start Date: 26/05/2026  [✏️]      │  ▼ FILES (0)                     │
│  ├─ End Date: 28/05/2026    [✏️]       │  ├─ [📥 Upload Files]            │
│  └─ Release Date: 26/05/2026 [✏️]     │  └─ Drag & drop files            │
│                                        │                                    │
│  ▼ LEAD TIME & SCHEDULING              │  ▼ ARTICLES (0)                  │
│  ├─ LeadTime 0: —           [✏️]       │  ├─ No related articles         │
│  ├─ Aging WO Claim: —       [✏️]       │  └─ [🔍 Search KB]               │
│  ├─ ABR File: ☐             [✏️]       │                                    │
│  └─ LT ABR: 0               [✏️]       │  ▼ SERVICE REPORTS (0)           │
│                                        │  ├─ No reports generated         │
│  ▼ LOKASI PEMBEBANAN                   │  └─ [+ Generate Report]          │
│  ├─ Akotasi: [___________] [✏️]        │                                    │
│  └─ Pembaharan: [___________] [✏️]     │  ▼ TASK LISTS (3+)               │
│                                        │  ├─ 0010: Preparation (1h)      │
│  ▼ KC INFORMATION                      │  ├─ 0020: Traveling (0h)        │
│  ├─ KC Number: 51524826     [✏️]      │  ├─ 0030: Waiting (0h)          │
│  ├─ SAP WO KC: 51524826     [✏️]      │  └─ [View All]                   │
│  ├─ DC QR Date: ___         [✏️]       │                                    │
│  └─ Parts QR Date: ___      [✏️]       │  ▼ TIME SHEET (0)                │
│                                        │  ├─ No entries recorded          │
│  ▼ INFORMATION - OBJECT PART            │  └─ [+ Add Time Entry]           │
│  ├─ Object Part: Hydraulic System      │                                    │
│  │                           [✏️]      │  ▼ PROBLEMS (0)                  │
│  ├─ Specific Part: Hydraulic-related   │  ├─ No problems documented      │
│  │                           [✏️]      │  └─ [+ Report Problem]           │
│  ├─ Damage: See Description [✏️]      │                                    │
│  ├─ Malfunction Start: 26/05/2026      │  ▼ SERVICE PRODUCTS (0)          │
│  │                           [✏️]      │  ├─ No products linked          │
│  ├─ Mechanic Name: UT Integration      │  └─ [+ Add Service Product]      │
│  │                                    │                                    │
│  ├─ Planned Action: 26/05/2026 [✏️]   │  ▼ PARTS REQUESTS (0)            │
│  ├─ Service Territory: Batukaang ST    │  ├─ No parts requests           │
│  │                           [✏️]      │  └─ [+ Create Parts Request]     │
│  └─ Owner: UT Integration   [👤]      │                                    │
│                                        │  ▼ WORK ORDER HISTORY (3+)       │
│  ▼ ADDITIONAL INFORMATION               │  ├─ 26/05/2026: Created         │
│  ├─ TSR Completeness Score: __[✏️]    │  ├─ 26/05/2026: Asset added     │
│  ├─ TSR Root Cause Score: __[✏️]      │  ├─ 26/05/2026: Parameters set  │
│  ├─ TSR Monitoring Score: __[✏️]      │  └─ [View All]                   │
│  └─ TSR Overall Score: __[✏️]         │                                    │
│                                        │  ▼ OPPORTUNITIES (0)             │
│  ▼ SA INFORMATION                      │  └─ [+ Create Opportunity]       │
│  ├─ First SA to Travel: __[ℹ️]         │                                    │
│  ├─ First SA Progress: __[ℹ️]          │  ▼ EMR (0)                       │
│  └─ First SA Complete: __[ℹ️]          │  └─ [+ Add EMR Record]           │
│                                        │                                    │
│  ▼ DESCRIPTION                         │  ▼ COMPETITORS (0)               │
│  ├─ Load Work Plan: [________] [✏️]    │  └─ [+ Add Competitor Info]     │
│  └─ [More Info]                        │                                    │
│                                        │  ▼ PARTS SUPPLIED (0)            │
│  ▼ SYSTEM INFORMATION                  │  └─ [+ Record Parts Supplied]    │
│  ├─ Created By: UT Integration         │                                    │
│  │  26/05/2026, 07:36                  │                                    │
│  └─ Last Modified: M. Thoriqul...      │                                    │
│     26/05/2026, 11:12                  │                                    │
│                                        │                                    │
└────────────────────────────────────────┴───────────────────────────────────┘
```

### 11.2 Work Order Feed Tab

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781 › FEED                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ [Post] [File] [Link] [Filter ▼]                                             │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ TI  Tegar Alnu Indrawan created this Work Order     Oct 12, 14:32    │  │
│ │                                                                         │  │
│ │     Initial creation from Case 01532785 regarding GD825A-2 hydraulic   │  │
│ │     pressure drop.                                                     │  │
│ │                                                                         │  │
│ │ [🏷️ pump_wear_01.jpg] [🏷️ diagnostic_report.pdf]                     │  │
│ │ [Expand] [Reply] [Like]                                               │  │
│ │                                                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ ⟲  Status changed from New to In Progress         Oct 12, 15:05     │  │
│ │    By: UT Integration System                                          │  │
│ │                                                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ TI  Tegar Alnu Indrawan added Approval Notes      Oct 13, 09:15      │  │
│ │                                                                         │  │
│ │     Inspected the main pump. Found significant wear on the thrust      │  │
│ │     plate. Requires immediate replacement before further operation    │  │
│ │     to prevent catastrophic failure.                                  │  │
│ │                                                                         │  │
│ │ [🏷️ approval_photo_01.jpg] [🏷️ approval_photo_02.jpg]                │  │
│ │ [🏷️ inspection_report.pdf]                                            │  │
│ │ [Expand] [Reply] [Like]                                               │  │
│ │                                                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ ⓘ System updated status                           Oct 14, 11:30      │  │
│ │                                                                         │  │
│ │    🔴 Work Order cancelled. Parts unavailable locally; consolidated   │  │
│ │    into WO-01176-0023 for depot repair.                               │  │
│ │                                                                         │  │
│ │ [🏷️ cancellation_reason_doc.pdf] [🏷️ depot_assignment.pdf]           │  │
│ │ [Expand] [Reply] [Like]                                               │  │
│ │                                                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ [Write a post...]                                                     │  │
│ │ [📎 Attachment] [🏷️ Mention] [@ Record] [Link] [Share]              │  │
│ │                                                          [Share]       │  │
│ │                                                                         │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ [Recent Items] [Macros] [Chatter Feed]   [Omni-Channel (Offline)]           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Tab Navigation from Case to Work Order

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TAB BAR SHOWING BOTH CASE AND WORK ORDER:                                   │
│  ───────────────────────────────────────────                                 │
│                                                                               │
│  [Cases] [🔄 01553477] [🔄 01275781] [Additional Tabs...]  [More ⋯]        │
│     ↑           ↑                ↑                                            │
│  System    Case Tab          Work Order Tab                                  │
│  Level    (Parent)          (Linked from Case)                               │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         CASE #01553477                                  │ │
│  │                    (ACTIVE TAB - SHOWING CASE)                          │ │
│  │                                                                           │ │
│  │  Status: New                                                            │ │
│  │  Related Work Orders:                                                   │ │
│  │  ├─ [WO-01275781] ✓ Click to open as new tab                           │ │
│  │  ├─ [WO-01176-0023] Related WO                                         │ │
│  │  └─ [WO-01177-0001] Follow-up Service                                  │ │
│  │                                                                           │ │
│  │  [Edit] [Change Owner] [Print] [More]                                  │ │
│  │                                                                           │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  WHEN USER CLICKS ON [WO-01275781]:                                          │
│  ↓                                                                            │
│  [Cases] [🔄 01553477] [🔄 01275781 ← FOCUS] [Additional...]  [More ⋯]     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    WORK ORDER #01275781                                 │ │
│  │               (NEW TAB - SHOWING WORK ORDER DETAILS)                    │ │
│  │                                                                           │ │
│  │  Parent Case: [01553477] ← Can click back to Case Tab                   │ │
│  │  Status: New                                                            │ │
│  │  Asset: GD825A-2                                                        │ │
│  │                                                                           │ │
│  │  [Book Appt] [Approve/Reject] [Generate PDF] [More]                    │ │
│  │                                                                           │ │
│  │  2-Column Layout:                                                       │ │
│  │  ├─ Left: WO Details (Sections)                                         │ │
│  │  └─ Right: Linked Objects (18+ items)                                   │ │
│  │                                                                           │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  KEY FEATURES:                                                                │
│  • Case Tab remains open (click to switch back)                              │
│  • WO Tab now active (shows WO details)                                      │
│  • Both tabs are accessible for seamless navigation                          │
│  • Data updates in real-time across both tabs                                │
│  • User can open multiple WOs from same Case                                 │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 11.4 Expandable Sections Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│ LEFT PANEL - EXPANDABLE SECTIONS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ▼ GENERAL INFORMATION (EXPANDED)                               │
│   ├─ Work Order Number: 01275781          [✏️]                 │
│   ├─ System Status: REL-PRC-CSER-SAAP-NMAT [✏️]                │
│   ├─ Case: 01553477                       [✏️]                 │
│   ├─ Parent Work Order: —                 [✏️]                 │
│   ├─ Account: SIMS JAYA KALTIM            [✏️]                 │
│   ├─ Contact: BURHAN                      [✏️]                 │
│   ├─ Subject: TRS HYDRAULIK SYSTEM HO785  [✏️]                 │
│   └─ Description: TRS HYDRAULIK...        [✏️]                 │
│                                                                  │
│ ▶ STATUS & COMPLETION (COLLAPSED)                              │
│   [Click to expand] ◀─────────────────────                      │
│                                                                  │
│ ▶ TECHNICAL & SERVICE DETAILS (COLLAPSED)                      │
│   [Click to expand] ◀─────────────────────                      │
│                                                                  │
│ ▼ KC INFORMATION (EXPANDED)                                    │
│   ├─ KC Number: 51524826                  [✏️]                 │
│   ├─ SAP Work Order Number KC: 51524826   [✏️]                 │
│   ├─ DC QR Date: [___________]             [✏️]                 │
│   ├─ Parts QR Date: [___________]          [✏️]                 │
│   ├─ KC Rejected Reason: [___________]     [✏️]                 │
│   └─ Reason for Rejection: [___________]   [✏️]                 │
│                                                                  │
│ ▶ ADDITIONAL INFORMATION (COLLAPSED)                           │
│   [Click to expand] ◀─────────────────────                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

INTERACTION PATTERN:
• Click on ▼ = Section expands to show all fields
• Click on ▶ = Section collapses to save space
• All fields within sections are editable [✏️]
• Default: General & KC sections expanded
• User can customize which sections stay open
```

### 11.5 Right Panel - Linked Objects Scrolling

```
┌──────────────────────────────────────────┐
│ RIGHT PANEL - SCROLLABLE LINKED OBJECTS  │
├──────────────────────────────────────────┤
│                                          │
│ ⭐ RECOMMENDED MECHANIC                 │
│ [Blue Button]                            │
│                                          │
│ ─────────────────────────────────────   │
│                                          │
│ 📚 KNOWLEDGE                             │
│ [Filter] [Search Knowledge...]           │
│                                          │
│ • GD825A Hydraulic Pump Replac...        │
│   Article - KN-0921 [Rel: 85%]          │
│                                          │
│ • Troubleshooting Thrust Plate           │
│   Bulletin - TB-1184 [Rel: 78%]         │
│                                          │
│ ─────────────────────────────────────   │
│                                          │
│ 🏭 ASSET DETAILS                         │
│ Asset Name: GD785-7 : BO76     [🔗]     │
│ Serial Number: BO76            [✏️]      │
│ Unit Model: HD785-7            [✏️]      │
│ SMR: 6006I.0                   [✏️]      │
│                                          │
│ ─────────────────────────────────────   │
│                                          │
│ 📋 WORK PLANS (0)               [⬇]     │
│ [Expand to show list]                   │
│                                          │
│ 👣 WORK STEPS (0)               [⬇]     │
│ [Expand to show list]                   │
│                                          │
│ 📅 SERVICE APPOINTMENTS (1)     [⬇]     │
│ [Expand to show 1 appointment]           │
│                                          │
│ 📦 WORK ORDER LINE ITEMS (3+)  [⬇]     │
│ [Expand to show 3+ items]                │
│                                          │
│ ↓ SCROLL DOWN FOR MORE...                │
│                                          │
│ 📁 FILES (0)                    [⬇]     │
│ 📖 ARTICLES (0)                 [⬇]     │
│ 📊 SERVICE REPORTS (0)          [⬇]     │
│ ✅ TASK LISTS (3+)              [⬇]     │
│ ⏱️ TIME SHEET ENTRIES (0)       [⬇]     │
│ ⚠️ PROBLEMS (0)                 [⬇]     │
│ 🔧 SERVICE PRODUCTS (0)         [⬇]     │
│ 📦 PARTS REQUESTS (0)           [⬇]     │
│ 📜 WORK ORDER HISTORY (3+)      [⬇]     │
│ 💰 OPPORTUNITIES (0)            [⬇]     │
│ 🏥 EMR (0)                      [⬇]     │
│ 🔐 PCVs (0)                     [⬇]     │
│ 🏢 COMPETITOR INFO (0)          [⬇]     │
│ 🚚 PARTS SUPPLIED (0)           [⬇]     │
│                                          │
└──────────────────────────────────────────┘

SCROLLING BEHAVIOR:
• Each object section has a header with count (0), (1), (3+)
• Click [⬇] or section header to expand/collapse
• Smooth scrolling on right panel
• Left panel is independently scrollable
• No scroll sync between left & right panels
• Sticky headers when scrolling within sections
```

### 11.6 Related Tab View

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781 › RELATED                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ 📌 RELATED CASES                                                        │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │                                                                           │  │
│ │ 01553477 - GD825A-2 Hydraulic Failure              Status: New         │  │
│ │           Created: 26/05/2026  Owner: System User                      │  │
│ │           [View Case]                                                  │  │
│ │                                                                           │  │
│ │ 01465523 - Related Service Request                 Status: Closed      │  │
│ │           Created: 20/05/2026  Owner: Service Team                    │  │
│ │           [View Case]                                                  │  │
│ │                                                                           │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ 👥 RELATED CONTACTS                                                     │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │                                                                           │  │
│ │ BURHAN                                                                  │  │
│ │ Title: Maintenance Manager                                             │  │
│ │ Account: SIMS JAYA KALTIM                                              │  │
│ │ Email: burhan@simsjaya.co.id    Phone: +62-8xx-xxx-xxxx               │  │
│ │ [View Contact]                                                         │  │
│ │                                                                           │  │
│ │ Andi Wijaya                                                             │  │
│ │ Title: Operations Supervisor                                           │  │
│ │ Account: SIMS JAYA KALTIM                                              │  │
│ │ Email: andi.wijaya@simsjaya.co.id    Phone: +62-8xx-xxx-xxxx          │  │
│ │ [View Contact]                                                         │  │
│ │                                                                           │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ 🏢 RELATED ACCOUNTS                                                     │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │                                                                           │  │
│ │ SIMS JAYA KALTIM (Primary Account)                                      │  │
│ │ Status: Active              Industry: Mining & Equipment               │  │
│ │ Revenue: Multi-Million      Location: Kaltim, Indonesia                │  │
│ │ [View Account] [Related WOs: 12]  [Open Cases: 3]                      │  │
│ │                                                                           │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │ 📄 RELATED DOCUMENTS                                                    │  │
│ ├─────────────────────────────────────────────────────────────────────────┤  │
│ │                                                                           │  │
│ │ [pump_wear_01.jpg] - Inspection Photo          Size: 2.4MB            │  │
│ │                    Uploaded: 26/05/2026 by Tegar                      │  │
│ │                    [Download] [Share] [Delete]                         │  │
│ │                                                                           │  │
│ │ [diagnostic_report.pdf] - Diagnostic Report     Size: 1.8MB            │  │
│ │                         Uploaded: 26/05/2026 by Tegar                 │  │
│ │                         [Download] [Share] [Delete]                    │  │
│ │                                                                           │  │
│ │ [maintenance_manual.pdf] - Reference Manual     Size: 12.5MB           │  │
│ │                          Uploaded: 15/05/2026 by Admin                │  │
│ │                          [Download] [Share] [Delete]                   │  │
│ │                                                                           │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## METADATA & SYSTEM INFO

**System:** UT Service Console v2.1 (Updated)
**Data Model:** Salesforce Service Cloud + SAP Integration
**Last Updated:** 26/05/2026 07:36
**Generated By:** Work Order Management System
**Document Version:** Enhanced Design v1.1

---

*This document provides comprehensive documentation of the Work Order Management system with 2-column layout design, 18+ linked objects, and seamless tab-based navigation between Cases and Work Orders.*
