# Work Order Management System - Enhanced UI Design

## Complete Work Order Interface with Sidebar & Integrated Feed Tab

---

## 1. WORK ORDER MAIN LAYOUT - COMPLETE DESIGN

### 1.1 Full Page Layout with Sidebar

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                                           [Search] [🔔] [⚙] [👤] │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  [Console]  [01175-1508]  [Case 01532785]  [Additional Tabs...]               │
│                                                                                  │
├────────────┬───────────────────────────────────────────┬──────────────────────┤
│            │                                           │                      │
│  SIDEBAR   │   MAIN CONTENT AREA (70%)                │  RIGHT PANEL (25%)   │
│  (5%)      │                                           │                      │
│            │                                           │                      │
│ ┌────────┐ │ ┌─────────────────────────────────────┐  │ ┌────────────────┐  │
│ │ ☰      │ │ │ WORK ORDER #01175-1508              │  │ │                │  │
│ │ Menu   │ │ │                                     │  │ │ ASSET DETAILS  │  │
│ │        │ │ │ Subject: Excavator Hydraulic Failure│  │ │                │  │
│ │        │ │ │ Case: 01532785                      │  │ │ GD825A-2       │  │
│ │        │ │ │ Status: [Cancelled]                 │  │ │ Motor Grader   │  │
│ │        │ │ │ Owner: System                       │  │ │                │  │
│ │ 📌     │ │ │                                     │  │ │ Serial Number: │  │
│ │ Work   │ │ │ [Add TSR] [Book Appt.] [...]       │  │ │ 120948A        │  │
│ │ Orders │ │ │                                     │  │ │                │  │
│ │ (Active)
│ │        │ │ ├─────────────────────────────────────┤  │ │ Operating      │  │
│ │ 📋     │ │ │ Details  Feed  Related              │  │ │ Hours: 4,520   │  │
│ │ Cases  │ │ ├─────────────────────────────────────┤  │ │                │  │
│ │        │ │                                     │  │ ├────────────────┤  │
│ │ 📊     │ │ [Post] [File] [Link] [Filter]      │  │ │                │  │
│ │ Analytics
│ │        │ │                                     │  │ │ SUGGESTED      │  │
│ │ 📈     │ │ ┌─────────────────────────────────┐│  │ │ KNOWLEDGE      │  │
│ │ Reports │ │ │ TI  Tegar Alnu Indrawan       ││  │ │                │  │
│ │        │ │ │     created this Work Order   ││  │ │ [Filters]      │  │
│ │ ⚙      │ │ │     Oct 12, 14:32             ││  │ │ [Search KB...] │  │
│ │ Settings
│ │        │ │ │                               ││  │ │                │  │
│ │ ❓     │ │ │ Initial creation from Case    ││  │ │ • GD825A       │  │
│ │ Help   │ │ │ 01532785 regarding GD825A-2   ││  │ │   Hydraulic    │  │
│ │        │ │ │ hydraulic pressure drop.      ││  │ │   Pump Replac. │  │
│ │        │ │ │                               ││  │ │   Article      │  │
│ │ 🌐     │ │ │ [pump_wear_01.jpg]            ││  │ │   KN-0921      │  │
│ │ Language
│ │        │ │ │ [diagnostic_report.pdf]       ││  │ │   Rel: 85%     │  │
│ │        │ │ │                               ││  │ │                │  │
│ │ 🚪     │ │ │ [Expand] [Reply] [Like]       ││  │ │ • Troubleshoot │  │
│ │ Logout │ │ └─────────────────────────────────┘│  │ │   Thrust Plate │  │
│ │        │ │                                     │  │ │   Wear         │  │
│ │        │ │ ┌─────────────────────────────────┐│  │ │   Bulletin     │  │
│ │        │ │ │ ⟲  Status changed from New    ││  │ │   TB-1184      │  │
│ │        │ │ │     to In Progress             ││  │ │   Rel: 78%     │  │
│ │        │ │ │     Oct 12, 15:05              ││  │ │                │  │
│ │        │ │ │                               ││  │ │ ┌──────────────┐ │  │
│ │ ┌────┐ │ │ │ [Expand] [Reply] [Like]       ││  │ │ WORK PLANS   │ │  │
│ │ │⊕⊕⊕│ │ │ └─────────────────────────────────┘│  │ │ (0)          │ │  │
│ │ │    │ │ │                                     │  │ │              │ │  │
│ │ │Quick│ │ │ ┌─────────────────────────────────┐│  │ │ [+ Create] │ │  │
│ │ │Links│ │ │ │ TI  Tegar Alnu Indrawan       ││  │ │              │ │  │
│ │ │    │ │ │ │     added Approval Notes      ││  │ │ └──────────────┘ │  │
│ │ │    │ │ │ │     Oct 13, 09:15             ││  │ │                │  │
│ │ └────┘ │ │ │                               ││  │ │ WORK STEPS   │ │  │
│ │        │ │ │ Inspected the main pump.      ││  │ │ (0)          │ │  │
│ │        │ │ │ Found significant wear on     ││  │ │              │ │  │
│ │        │ │ │ thrust plate. Requires        ││  │ │ [+ Add Step] │ │  │
│ │        │ │ │ immediate replacement...      ││  │ │              │ │  │
│ │        │ │ │                               ││  │ │ └──────────────┘ │  │
│ │        │ │ │ [pump_wear_01.jpg]            ││  │ │                │  │
│ │        │ │ │ [approval_photo_01.jpg]       ││  │ │ SERVICE        │ │  │
│ │        │ │ │ [approval_photo_02.jpg]       ││  │ │ APPOINTMENTS   │ │  │
│ │        │ │ │                               ││  │ │ (1)            │ │  │
│ │        │ │ │ [Expand] [Reply] [Like]       ││  │ │                │ │  │
│ │        │ │ └─────────────────────────────────┘│  │ │ SA-2124973     │ │  │
│ │        │ │                                     │  │ │ Scheduled      │ │  │
│ │        │ │ ┌─────────────────────────────────┐│  │ │ [View All]     │ │  │
│ │        │ │ │ ⓘ System updated status        ││  │ │                │ │  │
│ │        │ │ │    Oct 14, 11:30               ││  │ │ └──────────────┘ │  │
│ │        │ │ │                               ││  │ │                │  │
│ │        │ │ │ 🔴 Work Order cancelled.      ││  │ │ WORK ORDER     │ │  │
│ │        │ │ │ Parts unavailable locally;    ││  │ │ LINE ITEMS     │ │  │
│ │        │ │ │ consolidated into WO-01176-   ││  │ │ (3+)           │ │  │
│ │        │ │ │ 0023 for depot repair.        ││  │ │                │ │  │
│ │        │ │ │                               ││  │ │ 00000001       │ │  │
│ │        │ │ │ [Expand] [Reply] [Like]       ││  │ │ Maintenance    │ │  │
│ │        │ │ └─────────────────────────────────┘│  │ │ Repair Record  │ │  │
│ │        │ │                                     │  │ │                │ │  │
│ │        │ │ [Write a post...]                  │  │ │ 00000002       │ │  │
│ │        │ │ [📎] [🏷️] [Share] [Save]           │  │ │ Problem Log    │ │  │
│ │        │ │                                     │  │ │                │ │  │
│ │        │ │ [Recent Items] [Macros] [Feed]    │  │ │ 00000003       │ │  │
│ │        │ │                                     │  │ │ General Info   │ │  │
│ │        │ │                                     │  │ │                │ │  │
│ │        │ │ [Omni-Channel (Offline)]           │  │ │ [View All]     │ │  │
│ │        │ │                                     │  │ │                │ │  │
│ │        │ └─────────────────────────────────────┘  │ │ FILES (0)      │ │  │
│ │        │                                           │ │ [📥 Upload]    │ │  │
│ │        │                                           │ │                │ │  │
│ │        │                                           │ │ ARTICLES (0)   │ │  │
│ │        │                                           │ │ [🔍 Search]    │ │  │
│ │        │                                           │ │                │ │  │
│ │        │                                           │ └────────────────┘  │
│ │        │                                           │                      │
│ └────────┘                                           └──────────────────────┘
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SIDEBAR NAVIGATION MENU

### 2.1 Sidebar Structure

```
┌──────────────────┐
│ UT SERVICE       │
│ CONSOLE          │
├──────────────────┤
│                  │
│ [☰ Menu]         │
│                  │
│ NAVIGATION       │
│ ────────────────│
│                  │
│ 📌 Work Orders   │ ← Active (Highlighted)
│    • Overview    │
│    • Schedule    │
│    • Dispatch    │
│    ► Work Orders │ (Current)
│    • Analytics   │
│    • Reports     │
│                  │
│ 📋 Cases         │
│                  │
│ 📊 Analytics     │
│                  │
│ 📈 Reports       │
│                  │
├──────────────────┤
│                  │
│ QUICK ACTIONS    │
│ ────────────────│
│                  │
│ ⚙ Settings       │
│                  │
│ ❓ Help & Support│
│                  │
│ 🌐 Language      │
│                  │
│ 🚪 Logout        │
│                  │
├──────────────────┤
│ ┌──────────────┐│
│ │ QUICK LINKS  ││
│ │              ││
│ │ • Open Cases ││
│ │ • My WOs     ││
│ │ • Today's    ││
│ │   Tasks      ││
│ │ • Favorites  ││
│ │              ││
│ └──────────────┘│
│                  │
└──────────────────┘
```

### 2.2 Sidebar Active States

```
COLLAPSED STATE:
┌──┐
│☰ │  ← Click to expand
│  │
│📌│
│  │
│📋│
│  │
│📊│
│  │
│📈│
│  │
│⚙ │
│  │
│❓│
│  │
└──┘

EXPANDED STATE:
┌────────────────┐
│ ☰ Menu         │
├────────────────┤
│ 📌 Work Orders │ ← Highlighted
│ 📋 Cases       │
│ 📊 Analytics   │
│ 📈 Reports     │
│ ⚙ Settings     │
│ ❓ Help        │
│ 🌐 Language    │
│ 🚪 Logout      │
└────────────────┘
```

---

## 3. WORK ORDER MAIN CONTENT AREA

### 3.1 Header Section

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  WORK ORDER #01175-1508 [NEW] [🏷️ Tag]                │
│  TRS HYDRAULIK SYSTEM HO785                             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ WORK ORDER HEADER INFO                           │  │
│  ├──────────────────────────────────────────────────┤  │
│  │                                                  │  │
│  │ Assigned Status: [Excavator Hydraulic Failure]  │  │
│  │ Case: [01532785]                                │  │
│  │ Status: [Cancelled]        ← Red Badge          │  │
│  │ Owner: System                                   │  │
│  │                                                  │  │
│  │ [Add TSR] [Book Appt.] [⋯ More]                │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Action Buttons Toolbar

```
┌──────────────────────────────────────────────────────┐
│ [Book Appointment]                                   │
│ [Approve/Reject WO]                                  │
│ [Generate PDF]                                       │
│ [Send Job Data to SAP]                               │
│ [🎯 Recommended Mechanic]                            │
│ [⋯ More Options]                                     │
└──────────────────────────────────────────────────────┘

MORE OPTIONS MENU:
• Print View
• Send to SAP
• Clone Work Order
• Change Owner
• Change Status
• Email Work Order
• View Audit Trail
• Delete Work Order
```

### 3.3 Tab Navigation

```
┌─────────────────────────────────────────────────────┐
│ [Details] [Feed] [Related] [Log]                    │
│    ↑       ↑       ↑        ↑                        │
│   Tab 1   Tab 2   Tab 3    Tab 4                    │
│                                                      │
│ DETAILS TAB (Image 2 Design)                        │
│ ├─ General Information (Expandable)                 │
│ ├─ Status & Completion (Expandable)                │
│ ├─ Technical & Service Details (Expandable)        │
│ ├─ Lead Time & Scheduling (Expandable)             │
│ ├─ Lokasi Pembebanan (Expandable)                  │
│ ├─ KC Information (Expandable)                     │
│ ├─ Information - Object Part (Expandable)          │
│ ├─ Additional Information (Expandable)             │
│ ├─ SA Information (Expandable)                     │
│ ├─ Description (Expandable)                        │
│ └─ System Information (Expandable)                 │
│                                                      │
│ FEED TAB (Image 1 Design) ← CURRENTLY VIEWING      │
│ ├─ Timeline feed with posts                        │
│ ├─ Activity history                                │
│ ├─ Comments & discussions                          │
│ └─ Real-time updates                               │
│                                                      │
│ RELATED TAB                                         │
│ ├─ Related Cases                                   │
│ ├─ Related Contacts                                │
│ ├─ Related Accounts                                │
│ └─ Related Documents                               │
│                                                      │
│ LOG TAB                                             │
│ ├─ System audit trail                              │
│ ├─ Field change history                            │
│ ├─ User activity log                               │
│ └─ Version history                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 4. FEED TAB DETAILED VIEW (Image 1 Design Reference)

### 4.1 Feed Main Content

```
┌────────────────────────────────────────────────────────┐
│ FEED TAB - WORK ORDER ACTIVITY TIMELINE                │
├────────────────────────────────────────────────────────┤
│                                                         │
│ [Post] [File] [Link] [▼ Filter]                       │
│                                                         │
│ ACTIVITY ENTRIES:                                      │
│ ═════════════════════════════════════════════════════ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ TI  Tegar Alnu Indrawan created this Work Order  │ │
│ │                                                   │ │
│ │     Oct 12, 14:32                                 │ │
│ │                                                   │ │
│ │     Initial creation from Case 01532785 regarding│ │
│ │     GD825A-2 hydraulic pressure drop.            │ │
│ │                                                   │ │
│ │ [🏷️ pump_wear_01.jpg] [🏷️ diagnostic_report.pdf]│ │
│ │                                                   │ │
│ │ [Expand] [Reply] [Like]                          │ │
│ │                                                   │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ ⟲  Status changed from New to In Progress        │ │
│ │                                                   │ │
│ │     Oct 12, 15:05                                 │ │
│ │                                                   │ │
│ │ [Expand] [Reply] [Like]                          │ │
│ │                                                   │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ TI  Tegar Alnu Indrawan added Approval Notes     │ │
│ │                                                   │ │
│ │     Oct 13, 09:15                                 │ │
│ │                                                   │ │
│ │     Inspected the main pump. Found significant   │ │
│ │     wear on the thrust plate. Requires immediate │ │
│ │     replacement before further operation to      │ │
│ │     prevent catastrophic failure.                │ │
│ │                                                   │ │
│ │ [🏷️ pump_wear_01.jpg]                            │ │
│ │ [🏷️ diagnostic_report.pdf]                       │ │
│ │ [🏷️ approval_photo_01.jpg]                       │ │
│ │ [🏷️ approval_photo_02.jpg]                       │ │
│ │                                                   │ │
│ │ [Expand] [Reply] [Like]                          │ │
│ │                                                   │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ ⓘ System updated status                          │ │
│ │                                                   │ │
│ │     Oct 14, 11:30                                 │ │
│ │                                                   │ │
│ │    🔴 Work Order cancelled. Parts unavailable    │ │
│ │    locally; consolidated into WO-01176-0023 for  │ │
│ │    depot repair.                                  │ │
│ │                                                   │ │
│ │ [Expand] [Reply] [Like]                          │ │
│ │                                                   │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ═════════════════════════════════════════════════════ │
│                                                         │
│ [Write a post...]                                      │
│ [📎 Attachment] [🏷️ Mention] [Share] [Save]           │
│                                                         │
│                                              [Share]   │
│                                                         │
│ [Recent Items] [Macros] [Chatter Feed]                │
│ [Omni-Channel (Offline)]                              │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 5. RIGHT PANEL - LINKED OBJECTS (Image 2 Reference)

### 5.1 Right Panel Full View

```
┌──────────────────────────────────┐
│ ASSET DETAILS                  [🔗]│
├──────────────────────────────────┤
│                                  │
│ Asset Name:    GD825A-2          │
│ Type:          Motor Grader      │
│                                  │
│ Serial Number: 120948A           │
│                                  │
│ Unit Model:    HD785-7           │
│                                  │
│ SMR:           6006I.0 hm        │
│                                  │
├──────────────────────────────────┤
│ [🔍 More Details]                │
│                                  │
├──────────────────────────────────┤
│                                  │
│ SUGGESTED KNOWLEDGE           [🔍]│
├──────────────────────────────────┤
│                                  │
│ [Filters] [Search Knowledge...] │
│                                  │
│ • GD825A Hydraulic Pump         │
│   Replacement Proc...           │
│   Article - KN-0921             │
│   Rel: 85% ⭐                    │
│                                  │
│ • Troubleshooting Thrust        │
│   Plate Wear                     │
│   Bulletin - TB-1184            │
│   Rel: 78% ⭐                    │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ WORK PLANS (0)            [🔽]│
│   [+ Create New]                │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ WORK STEPS (0)            [🔽]│
│   [+ Add Work Step]              │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ SERVICE APPOINTMENTS (1) [🔽]│
│                                  │
│   SA-2124973                     │
│   Status: Scheduled              │
│                                  │
│   [View All]                     │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ WORK ORDER LINE ITEMS   [🔽]│
│   (3+)                           │
│                                  │
│   00000001                       │
│   Maintenance Repair Record      │
│                                  │
│   00000002                       │
│   Problem Log                    │
│                                  │
│   00000003                       │
│   General Info                   │
│                                  │
│   [View All]                     │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ FILES (0)                 [🔽]│
│   [📥 Upload Files]              │
│   Drag & drop files              │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ ARTICLES (0)              [🔽]│
│   [🔍 Search Knowledge Base]     │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ SERVICE REPORTS (0)       [🔽]│
│   [+ Generate Report]            │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ TASK LISTS (3+)           [🔽]│
│                                  │
│   s1OMg0000lywstD                │
│   Op 0010: Preparation (1h)     │
│                                  │
│   s1OMg0000lywstF                │
│   Op 0020: Traveling (0h)       │
│                                  │
│   s1OMg0000lywstF                │
│   Op 0030: Waiting (0h)         │
│                                  │
│   [View All]                     │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ TIME SHEET ENTRIES (0)    [🔽]│
│   [+ Add Time Entry]             │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ PROBLEMS (0)              [🔽]│
│   [+ Report Problem]             │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ SERVICE PRODUCTS (0)      [🔽]│
│   [+ Add Service Product]        │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ PARTS REQUESTS (0)        [🔽]│
│   [+ Create Parts Request]       │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ WORK ORDER HISTORY (3+)   [🔽]│
│                                  │
│   26/05/2026, 07:36              │
│   Created by UT Integration      │
│                                  │
│   26/05/2026, 07:36              │
│   Asset added HD785-7 : BO76    │
│                                  │
│   26/05/2026, 07:36              │
│   WorkOrder Parameters: 1        │
│                                  │
│   [View All]                     │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ OPPORTUNITIES (0)         [🔽]│
│   [+ Create Opportunity]         │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ EMR (0)                   [🔽]│
│   [+ Add EMR Record]             │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ PCVs (0)                  [🔽]│
│   [+ Add PCV]                    │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ COMPETITOR INFO (0)       [🔽]│
│   [+ Add Competitor Info]        │
│                                  │
├──────────────────────────────────┤
│                                  │
│ ▼ PARTS SUPPLIED (0)        [🔽]│
│   [+ Record Parts Supplied]      │
│                                  │
└──────────────────────────────────┘
```

---

## 6. DETAILS TAB - EXPANDABLE SECTIONS (Image 2 Design)

### 6.1 Left Panel with Expandable Sections

```
┌────────────────────────────────────────────┐
│ DETAILS TAB CONTENT                        │
├────────────────────────────────────────────┤
│                                            │
│ ▼ GENERAL INFORMATION           [✏️]      │
│   Work Order Number: 01275781             │
│   System Status: REL-PRC-CSER-SAP-NMAT   │
│   Case: 01553477                          │
│   Parent Work Order: —                    │
│   Account: SIMS JAYA KALTIM               │
│   Contact: BURHAN                         │
│   Subject: TRS HYDRAULIK SYSTEM HO785     │
│   Description: TRS HYDRAULIK...           │
│                                            │
│ ▶ STATUS & COMPLETION                     │
│   [Click to expand]                       │
│                                            │
│ ▶ TECHNICAL & SERVICE DETAILS              │
│   [Click to expand]                       │
│                                            │
│ ▼ LEAD TIME & SCHEDULING        [✏️]      │
│   LeadTime 0: —                           │
│   Aging WO Claim: —                       │
│   ABR File: ☐                             │
│   LT ABR: 0                                │
│                                            │
│ ▼ LOKASI PEMBEBANAN              [✏️]      │
│   Akotasi: [_______________]              │
│   Pembaharan: [_______________]           │
│                                            │
│ ▼ KC INFORMATION                           │
│   KC Number: 51524826                     │
│   SAP Work Order Number KC: 51524826     │
│   DC QR Date: [___________]               │
│   Parts QR Date: [___________]            │
│   KC Rejected Reason: [___________]       │
│   Reason for Rejection: [___________]     │
│                                            │
│ ▶ INFORMATION - OBJECT PART                │
│   [Click to expand]                       │
│                                            │
│ ▶ ADDITIONAL INFORMATION                   │
│   [Click to expand]                       │
│                                            │
│ ▶ SA INFORMATION                           │
│   [Click to expand]                       │
│                                            │
│ ▶ DESCRIPTION                              │
│   [Click to expand]                       │
│                                            │
│ ▼ SYSTEM INFORMATION                       │
│   Created By: UT Integration               │
│              26/05/2026, 07:36             │
│   Last Modified By: M. Thoriqul...        │
│                    26/05/2026, 11:12      │
│                                            │
│ [Recent Items] [Macros] [Chatter Feed]   │
│                                            │
└────────────────────────────────────────────┘
```

---

## 7. DETAILED FIELD DEFINITIONS

### 7.1 General Information Fields

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

### 7.2 Status & Completion Fields

| Field | Value | Status |
|-------|-------|--------|
| **Status** | New | ✓ |
| **Complete/Cancel** | — | ☐ |
| **Case Type** | Request | ✓ |
| **Call Type** | Service | ✓ |
| **Sub Call Type** | NFMC - Troubleshooting | ✓ |
| **Date/Time In Progress** | 26/05/2026, 07:00 | ✓ |
| **Date/Time Completed** | — | Pending |
| **Date Time Send to SAP** | — | ☐ |

### 7.3 Technical & Service Details Fields

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

### 7.4 Lead Time & Scheduling Fields

| Field | Value | Edit |
|-------|-------|------|
| **LeadTime 0** | — | ✓ |
| **Aging WO Claim** | — | ✓ |
| **ABR File** | ☐ | ✓ |
| **ABR File Date** | — | ✓ |
| **LT ABR** | 0 | ✓ |
| **SA Completed** | — | ✓ |

### 7.5 Information - Object Part Fields

| Field | Value | Edit |
|-------|-------|------|
| **Object Part** | Hydraulic System | ✓ |
| **Specific Object Part** | Hydraulic System - related | ✓ |
| **Code** | See Description | ✓ |
| **Damage** | See Description | ✓ |
| **Malfunction Start Date** | 26/05/2026, 07:30 | ✓ |
| **Malfunction End Date** | — | ✓ |
| **Breakdown Indicator** | ☐ | ✓ |
| **Actual Malfunction Duration** | — | ✓ |
| **Mechanic Name** | UT Integration | ✓ |
| **Planned Action Date** | 26/05/2026, 07:45 | ✓ |
| **Service Territory** | Batukaang Others ST | ✓ |

---

## 8. WORK ORDER LAYOUT - COMPLETE ASCII

### 8.1 Full Desktop View

```
┌────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                          [Search...] [🔔] [⚙] [👤]    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  [Console] [01175-1508] [Case 01532785] [More Tabs...]                    │
│                                                                              │
├──────────┬───────────────────────────────────────┬──────────────────────────┤
│          │                                       │                          │
│ SIDEBAR  │     WORK ORDER #01175-1508            │   RIGHT PANEL            │
│          │     TRS HYDRAULIK SYSTEM HO785        │   (LINKED OBJECTS)       │
│          │                                       │                          │
│ ┌──────┐ │ [Add TSR] [Book Appt.] [⋯]          │ ┌──────────────────────┐ │
│ │☰ Menu│ │                                       │ │ ASSET DETAILS        │ │
│ │      │ │ ├─────────────────────────────────┐  │ │                      │ │
│ │📌 WOs│ │ │Details [Feed] [Related] [Log]  │  │ │ GD825A-2             │ │
│ │📋 Cs │ │ ├─────────────────────────────────┤  │ │ Motor Grader         │ │
│ │📊 An │ │ │                                 │  │ │                      │ │
│ │📈 Rp │ │ │ [Post] [File] [Link] [Filter]  │  │ │ Serial: 120948A      │ │
│ │      │ │ │                                 │  │ │ Hours: 4,520 hrs     │ │
│ │⚙ Set │ │ │ ┌───────────────────────────┐  │  │ │                      │ │
│ │❓ Hlp │ │ │ │ TI  Tegar Alnu Indrawan  │  │  │ │ ┌──────────────────┐ │ │
│ │🌐 Lng │ │ │ │                           │  │  │ │ │KNOWLEDGE (Filters)
│ │🚪 Lgt │ │ │ │ created this WO          │  │  │ │ │ • GD825A Hydraulic
│ │      │ │ │ │ Oct 12, 14:32             │  │  │ │ │   Pump Replac... │ │
│ │┌────┐│ │ │ │                           │  │  │ │ │   KN-0921 (85%)  │ │
│ ││QLINK││ │ │ │ Initial creation from     │  │  │ │ │                  │ │
│ ││ • OP││ │ │ │ Case 01532785...          │  │  │ │ │ • Troubleshoot   │ │
│ ││ • My││ │ │ │                           │  │  │ │ │   Thrust Plate   │ │
│ ││ • TD││ │ │ │ [pump_wear.jpg]           │  │  │ │ │   TB-1184 (78%)  │ │
│ ││ • Fv││ │ │ │ [diagnostic.pdf]          │  │  │ │ │                  │ │
│ │└────┘│ │ │ │                           │  │  │ │ └──────────────────┘ │
│ │      │ │ │ │ [Expand] [Reply] [Like]   │  │  │ │                      │ │
│ │      │ │ │ └───────────────────────────┘  │  │ │ WORK PLANS (0)      │ │
│ │      │ │ │                                 │  │ │ [+ Create]          │ │
│ │      │ │ │ ┌───────────────────────────┐  │  │ │                      │ │
│ │      │ │ │ │ ⟲ Status changed from New│  │  │ │ WORK STEPS (0)      │ │
│ │      │ │ │ │   to In Progress          │  │  │ │ [+ Add Step]        │ │
│ │      │ │ │ │ Oct 12, 15:05             │  │  │ │                      │ │
│ │      │ │ │ │                           │  │  │ │ SERVICE APPT (1)    │ │
│ │      │ │ │ │ [Expand] [Reply] [Like]   │  │  │ │ SA-2124973          │ │
│ │      │ │ │ └───────────────────────────┘  │  │ │ [View All]          │ │
│ │      │ │ │                                 │  │ │                      │ │
│ │      │ │ │ ┌───────────────────────────┐  │  │ │ WO LINE ITEMS (3+) │ │
│ │      │ │ │ │ TI  Tegar Alnu Indrawan  │  │  │ │ 00000001            │ │
│ │      │ │ │ │                           │  │  │ │ Maintenance...      │ │
│ │      │ │ │ │ added Approval Notes      │  │  │ │ 00000002            │ │
│ │      │ │ │ │ Oct 13, 09:15             │  │  │ │ Problem Log         │ │
│ │      │ │ │ │                           │  │  │ │ 00000003            │ │
│ │      │ │ │ │ Inspected main pump...    │  │  │ │ General Info        │ │
│ │      │ │ │ │ thrust plate wear...      │  │  │ │ [View All]          │ │
│ │      │ │ │ │                           │  │  │ │                      │ │
│ │      │ │ │ │ [photos] [files]          │  │  │ │ + 18 MORE OBJECTS   │ │
│ │      │ │ │ │                           │  │  │ │ (Scrollable)        │ │
│ │      │ │ │ │ [Expand] [Reply] [Like]   │  │  │ │                      │ │
│ │      │ │ │ └───────────────────────────┘  │  │ │                      │ │
│ │      │ │ │                                 │  │ │ [Bottom of panel]   │ │
│ │      │ │ │ ┌───────────────────────────┐  │  │ └──────────────────────┘ │
│ │      │ │ │ │ ⓘ System updated status   │  │  │                          │
│ │      │ │ │ │ Oct 14, 11:30             │  │  │                          │
│ │      │ │ │ │                           │  │  │                          │
│ │      │ │ │ │ 🔴 Work Order cancelled  │  │  │                          │
│ │      │ │ │ │ Parts unavailable...      │  │  │                          │
│ │      │ │ │ │ consolidated into WO...  │  │  │                          │
│ │      │ │ │ │                           │  │  │                          │
│ │      │ │ │ │ [Expand] [Reply] [Like]   │  │  │                          │
│ │      │ │ │ └───────────────────────────┘  │  │                          │
│ │      │ │ │                                 │  │                          │
│ │      │ │ │ [Write a post...]               │  │                          │
│ │      │ │ │ [📎] [🏷️] [Share] [Save]       │  │                          │
│ │      │ │ │                                 │  │                          │
│ │      │ │ │ [Recent] [Macros] [Feed]        │  │                          │
│ │      │ │ │ [Omni-Channel]                  │  │                          │
│ │      │ │                                   │  │                          │
│ │      │ └───────────────────────────────────┘  │                          │
│ │      │                                       │                          │
│ └──────┘                                       └──────────────────────────┘
│                                                                              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. RESPONSIVE DESIGN NOTES

### 9.1 Three-Column Layout Proportions

```
DESKTOP VIEW (1920px):
┌────┬──────────────────────────┬──────────┐
│ 5% │        70%               │   25%    │
│    │                          │          │
│ 96 │      1344px              │  480px   │
└────┴──────────────────────────┴──────────┘

TABLET VIEW (1024px):
┌────┬───────────────┬──────────┐
│ 8% │      65%      │   27%    │
│    │               │          │
│ 82 │   665px       │  275px   │
└────┴───────────────┴──────────┘

MOBILE VIEW (480px):
Sidebar collapses to icon only
Main content & right panel stack vertically
```

### 9.2 Sidebar Behavior

```
DESKTOP: Sidebar always visible (expanded or collapsed)
- Expanded: Full labels visible
- Collapsed: Icons only

TABLET: Sidebar toggleable
- Default: Expanded on load
- Toggle: Collapse/expand with menu icon

MOBILE: Sidebar as drawer/off-canvas
- Default: Hidden
- Toggle: Swipe or menu button to open
```

---

## 10. INTERACTION PATTERNS

### 10.1 Feed Timeline Interactions

```
USER INTERACTIONS:

1. HOVER OVER FEED ITEM
   ↓
   Show: [Expand] [Reply] [Like] [More ⋯]

2. CLICK [EXPAND]
   ↓
   Show: Full content with all attachments

3. CLICK [REPLY]
   ↓
   Show: Reply input box inline

4. CLICK [Like]
   ↓
   Update: Like count incremented

5. CLICK [MORE ⋯]
   ↓
   Show: [Edit] [Delete] [Share] [Report]

6. CLICK [POST]
   ↓
   Show: Text editor for new post
```

### 10.2 Right Panel Interactions

```
USER INTERACTIONS:

1. CLICK EXPANDABLE SECTION HEADER [▼]
   ↓
   Collapse section to save space

2. CLICK COLLAPSED SECTION HEADER [▶]
   ↓
   Expand section to show content

3. SCROLL RIGHT PANEL
   ↓
   Independent scroll (no sync with main)

4. CLICK [VIEW ALL] LINK
   ↓
   Show full list in modal or new tab

5. CLICK [+ Create/Add] BUTTON
   ↓
   Show creation form or inline editor

6. CLICK LINK ICON [🔗]
   ↓
   Open linked object in new tab
```

---

## 11. COLOR & STATUS BADGES

### 11.1 Status Badges

```
[New]          → Yellow/Blue badge
[In Progress]  → Blue badge
[Completed]    → Green badge
[Cancelled]    → Red badge ← Current WO
[Overdue]      → Red/Orange badge
[At Risk]      → Orange badge
[On Hold]      → Gray badge
```

### 11.2 Visual Hierarchy

```
FEED TIMELINE VISUAL HIERARCHY:

User Avatar      User Name        Timestamp
   ↓                ↓                ↓
  TI    Tegar Alnu Indrawan    Oct 12, 14:32
        
   Primary Content
   ↓
   "Initial creation from Case..."
   
   Attachments
   ↓
   [🏷️ pump_wear.jpg] [🏷️ diagnostic.pdf]
   
   Actions
   ↓
   [Expand] [Reply] [Like] [⋯]
```

---

## 12. METADATA & SYSTEM INFO

**System:** UT Service Console v2.2 (Enhanced)
**Data Model:** Salesforce Service Cloud + SAP Integration
**Last Updated:** 26/05/2026 07:36
**Generated By:** Work Order Management System
**Document Version:** Integrated Design v2.0

---

## 13. KEY FEATURES SUMMARY

### Main Design Features:
✅ **Sidebar Navigation** - Collapsible/expandable menu
✅ **3-Column Layout** - Sidebar, Main, Right Panel
✅ **Feed Tab (Image 1)** - Activity timeline with posts
✅ **Details Tab** - Expandable sections (Image 2 reference)
✅ **Related Tab** - Linked records
✅ **Log Tab** - System audit trail
✅ **Right Panel** - 18+ linked objects
✅ **Responsive Design** - Works on desktop, tablet, mobile
✅ **Interactive Elements** - Expandable sections, smooth scrolling
✅ **Real-time Updates** - Activity feed updates live

---

*This document provides complete UI/UX design documentation for Work Order Management integrating Image 1 (Feed Design) and Image 2 (Details & Right Panel) with full sidebar navigation and responsive layout.*
