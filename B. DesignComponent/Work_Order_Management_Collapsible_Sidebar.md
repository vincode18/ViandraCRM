# Work Order Management System - Complete with Collapsible Sidebar

## Advanced Work Order Interface with Dynamic Sidebar Navigation

---

## 1. MAIN LAYOUT - COLLAPSIBLE SIDEBAR DESIGN

### 1.1 Full Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                           [Search...] [🔔] [⚙] [👤]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ [Console] [01275781 (WO)] [01553477 (Case)] [More Tabs...]                 │
│                                                                               │
├────┬──────────────────────────────────────────────┬────────────────────────┤
│    │                                              │                        │
│ SB │   MAIN CONTENT AREA (65%)                    │ RIGHT PANEL (25%)      │
│ │  │                                              │                        │
│ ID │   Work Order #01275781                       │ ┌──────────────────┐   │
│ │  │   TRS HYDRAULIK SYSTEM HO785                │ │ RECOMMENDED       │   │
│ CO │                                              │ │ MECHANIC          │   │
│ │  │ [Book Appt] [Approve/Reject] [Generate PDF] │ │                  │   │
│ NS │ [Send to SAP] [Recommended Mechanic]        │ │ [Blue Button]     │   │
│ │  │                                              │ │                  │   │
│ (S │ ├──────────────────────────────────────────┐ │ ├──────────────────┤   │
│ EE │ │Details [Feed] [Related] [Log]            │ │ │ KNOWLEDGE        │   │
│ │  │ ├──────────────────────────────────────────┤ │ │ [Filters]        │   │
│ SE │ │                                            │ │ │ [Search...]      │   │
│ │  │ │ ▼ GENERAL INFORMATION          [✏️]       │ │ │                  │   │
│ CT │ │   Work Order Number: 01275781            │ │ │ • GD825A Pump... │   │
│ │  │   System Status: REL-PRC-CSER-SAP         │ │ │   KN-0921 (85%)  │   │
│ IO │ │   Case: 01553477                         │ │ │                  │   │
│ │  │   Account: SIMS JAYA KALTIM                │ │ │ • Thrust Plate.. │   │
│ NS │ │   Contact: BURHAN                        │ │ │   TB-1184 (78%)  │   │
│    │ │   Subject: TRS HYDRAULIK SYSTEM HO785    │ │ │                  │   │
│ │  │                                            │ │ │ ┌────────────────┐ │   │
│ │  │ │ ▶ STATUS & COMPLETION                     │ │ │ ASSET DETAILS  │ │   │
│ │  │   [Click to expand]                        │ │ │ GD785-7 : BO76 │ │   │
│ │  │                                            │ │ │ Serial: 8076   │ │   │
│ │  │ │ ▶ TECHNICAL & SERVICE DETAILS             │ │ │ Hours: 4,520   │ │   │
│ │  │   [Click to expand]                        │ │ │ Model: HD785-7 │ │   │
│ │  │                                            │ │ │                │ │   │
│ │  │ │ ▼ LEAD TIME & SCHEDULING         [✏️]     │ │ └────────────────┘ │   │
│ │  │   LeadTime 0: —                          │ │ │ WORK PLANS (0)  │   │
│ │  │   ABR File: ☐                            │ │ │ [+ Create]      │   │
│ │  │                                            │ │ │                  │   │
│ │  │ │ ▼ KC INFORMATION                         │ │ │ WORK STEPS (0)  │   │
│ │  │   KC Number: 51524826                     │ │ │ [+ Add]         │   │
│ │  │   SAP WO KC: 51524826                     │ │ │                  │   │
│ │  │   DC QR Date: [___________]                │ │ │ SERVICE APPTS(1)│   │
│ │  │                                            │ │ │ SA-2124973      │   │
│ │  │ │ ▶ INFORMATION - OBJECT PART               │ │ │ [View All]      │   │
│ │  │   [Click to expand]                        │ │ │                  │   │
│ │  │                                            │ │ │ + 18 MORE OBJ   │   │
│ │  │ │ ▶ ADDITIONAL INFORMATION                  │ │ │ (Scrollable)    │   │
│ │  │   [Click to expand]                        │ │ │                  │   │
│ │  │                                            │ │ └──────────────────┘   │
│ │  │ │ ▶ SA INFORMATION                          │                        │
│ │  │   [Click to expand]                        │                        │
│ │  │                                            │                        │
│ │  │ │ ▶ DESCRIPTION                             │                        │
│ │  │   [Click to expand]                        │                        │
│ │  │                                            │                        │
│ │  │ │ ▼ SYSTEM INFORMATION            [✏️]      │                        │
│ │  │   Created By: UT Integration              │                        │
│ │  │   26/05/2026, 07:36                      │                        │
│ │  │   Last Modified: M. Thoriqul...           │                        │
│ │  │   26/05/2026, 11:12                       │                        │
│ │  │                                            │                        │
│ │  └──────────────────────────────────────────┘ │                        │
│ │                                                │                        │
└────┴──────────────────────────────────────────────┴────────────────────────┘

SIDEBAR LEGEND:
├─ ID CONSOLE (Icons on left)
├─ COLLAPSIBLE MENU
├─ QUICK NAVIGATION
├─ RECENT ITEMS
├─ FAVORITES
└─ SETTINGS
```

---

## 2. COLLAPSIBLE SIDEBAR - DETAILED DESIGN

### 2.1 Sidebar Structure (Collapsed & Expanded)

#### **COLLAPSED STATE (Icons Only)**

```
┌────┐
│ ☰  │  ← Menu toggle
├────┤
│ 📋 │  ← Work Orders (Active)
│    │
│ 📌 │  ← Cases
│    │
│ 📊 │  ← Analytics
│    │
│ 📈 │  ← Reports
│    │
│ ⚙  │  ← Settings
│    │
│ ❓ │  ← Help & Support
│    │
│ 🌐 │  ← Language
│    │
│ 🚪 │  ← Logout
│    │
├────┤
│ ⭐ │  ← Favorites
│    │
│ 🕐 │  ← Recent Items
│    │
├────┤
│ 💬 │  ← Support
│    │
│ 📢 │  ← Feedback
│    │
└────┘
```

#### **EXPANDED STATE (Full Menu)**

```
┌─────────────────────┐
│ ☰ MENU              │
├─────────────────────┤
│                     │
│ NAVIGATION          │
│ ─────────────────  │
│                     │
│ 📋 WORK ORDERS      │ ← Active (Highlighted)
│    • Overview       │
│    • Schedule       │
│    • Dispatch       │ ← NEW OPTION
│    • Analytics      │
│    • Reports        │
│                     │
│ 📌 CASES            │
│                     │
│ 📊 ANALYTICS        │
│                     │
│ 📈 REPORTS          │
│                     │
├─────────────────────┤
│ QUICK ACTIONS       │
│ ─────────────────  │
│                     │
│ ⚙ SETTINGS          │
│                     │
│ ❓ HELP & SUPPORT   │
│                     │
│ 🌐 LANGUAGE         │
│                     │
│ 🚪 LOGOUT           │
│                     │
├─────────────────────┤
│ FAVORITES           │
│ ─────────────────  │
│                     │
│ ⭐ Recent WOs       │
│ ⭐ Open Cases       │
│ ⭐ My Dashboard     │
│                     │
├─────────────────────┤
│ RECENT ITEMS        │
│ ─────────────────  │
│                     │
│ 🕐 WO-01275781     │
│ 🕐 Case-01553477   │
│ 🕐 Asset-HD785-7   │
│ 🕐 Dispatch-D001   │
│                     │
├─────────────────────┤
│ RESOURCES           │
│ ─────────────────  │
│                     │
│ 💬 SUPPORT          │
│ 📢 FEEDBACK         │
│                     │
├─────────────────────┤
│ ACCOUNT             │
│ ─────────────────  │
│                     │
│ 👤 Shadcn          │
│    mg@example.com   │
│    [Settings] [Log] │
│                     │
└─────────────────────┘
```

### 2.2 Sidebar Toggle Behavior

```
USER INTERACTION:

1. CLICK HAMBURGER MENU [☰]
   ↓
   Sidebar expands smoothly (300ms animation)
   Main content shifts right
   Saves user preference

2. CLICK [☰] AGAIN
   ↓
   Sidebar collapses smoothly (300ms animation)
   Main content expands
   Saves user preference

3. CLICK ON MENU ITEM (Work Orders, Cases, etc.)
   ↓
   Item highlights (active state)
   Submenu expands/collapses
   Related view loads in main area

4. RESIZE WINDOW
   ↓
   Auto-collapse on mobile (< 768px)
   Stay expanded on desktop (> 1024px)
   Tablet: toggleable

5. CLICK OUTSIDE SIDEBAR (Mobile)
   ↓
   Sidebar closes automatically
   Main content visible
```

---

## 3. SIDEBAR NAVIGATION ITEMS - DETAILED

### 3.1 Work Orders Menu

```
┌─────────────────────────────────────────┐
│ 📋 WORK ORDERS          (Active)         │
├─────────────────────────────────────────┤
│                                         │
│ SUBMENU:                                │
│ ├─ Overview                             │
│ │  ├─ All Work Orders                  │
│ │  ├─ Open/Active WOs                  │
│ │  ├─ Completed WOs                    │
│ │  └─ Overdue WOs                      │
│ │                                      │
│ ├─ Schedule                             │
│ │  ├─ Daily Schedule                   │
│ │  ├─ Weekly Schedule                  │
│ │  ├─ Calendar View                    │
│ │  └─ My Assignments                   │
│ │                                      │
│ ├─ Dispatch                ⭐ NEW       │
│ │  ├─ Dispatch Queue                   │
│ │  ├─ Pending Assignments              │
│ │  ├─ Field Status Map                 │
│ │  └─ Real-time Tracking               │
│ │                                      │
│ ├─ Analytics                            │
│ │  ├─ WO Metrics                       │
│ │  ├─ Performance Reports              │
│ │  ├─ SLA Compliance                   │
│ │  └─ Team Performance                 │
│ │                                      │
│ └─ Reports                              │
│    ├─ Daily Report                     │
│    ├─ Weekly Report                    │
│    ├─ Custom Reports                   │
│    └─ Export Data                      │
│                                         │
│ ACTION BUTTONS:                         │
│ [+ New Work Order] [Search]             │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Additional Sidebar Sections

```
┌─────────────────────────────────────────┐
│ 📌 CASES                                │
├─────────────────────────────────────────┤
│ ├─ All Cases                            │
│ ├─ Open Cases                           │
│ ├─ In Progress                          │
│ ├─ Closed Cases                         │
│ └─ My Cases                             │
│                                         │
│ [+ New Case] [Search]                   │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📊 ANALYTICS                            │
├─────────────────────────────────────────┤
│ ├─ Dashboard                            │
│ ├─ KPI Metrics                          │
│ ├─ Trends Analysis                      │
│ ├─ Team Performance                     │
│ └─ Customer Satisfaction                │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📈 REPORTS                              │
├─────────────────────────────────────────┤
│ ├─ Scheduled Reports                    │
│ ├─ Ad-hoc Reports                       │
│ ├─ Export Data                          │
│ └─ Report Templates                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. NEW DISPATCH SECTION IN SIDEBAR

### 4.1 Dispatch Overview

```
┌─────────────────────────────────────────────────┐
│ 📍 DISPATCH                     (New Addition)   │
├─────────────────────────────────────────────────┤
│                                                 │
│ DISPATCH QUEUE:                                 │
│ ├─ Pending Assignments: 15                      │
│ ├─ Ready for Dispatch: 8                        │
│ ├─ In Transit: 12                               │
│ ├─ At Site: 5                                   │
│ └─ Completed Today: 23                          │
│                                                 │
│ REAL-TIME TRACKING:                             │
│ ├─ All Mechanics: 18 online                     │
│ ├─ Available: 12                                │
│ ├─ Busy: 6                                      │
│ └─ Break: 0                                     │
│                                                 │
│ QUICK ACTIONS:                                  │
│ ├─ [View Dispatch Board]                        │
│ ├─ [Assign Work Order]                          │
│ ├─ [Track Mechanic]                             │
│ ├─ [Update Status]                              │
│ └─ [Create Dispatch]                            │
│                                                 │
│ FILTERS:                                        │
│ ├─ By Region: [All ▼]                          │
│ ├─ By Mechanic: [All ▼]                        │
│ ├─ By Priority: [All ▼]                        │
│ └─ By Status: [All ▼]                          │
│                                                 │
│ RECENT DISPATCHES:                              │
│ ├─ D-2024-001 → WO-00263272                    │
│ ├─ D-2024-002 → WO-00264271                    │
│ ├─ D-2024-003 → WO-00048651                    │
│ └─ [View All]                                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2 Dispatch Data Model

```
DISPATCH OBJECT STRUCTURE:

Dispatch Header:
├─ Dispatch ID: D-2024-001
├─ Dispatch Date: 26/05/2026
├─ Status: Assigned / In Transit / At Site / Completed
├─ Priority: High / Medium / Low
└─ Target Location: [Address]

Assignment Details:
├─ Assigned Mechanic: Budi Santoso
├─ Assigned Contact: +62-811-234-5678
├─ Work Orders (1+): [WO-00263272]
├─ Assets (1+): [HD785-7]
└─ Estimated Duration: 8 hours

Timing:
├─ Dispatch Time: 26/05/2026, 08:00
├─ Expected Arrival: 26/05/2026, 09:30
├─ Start Work Time: 26/05/2026, 09:45
├─ Expected Completion: 26/05/2026, 17:30
└─ Actual Completion: [Pending]

Location & Tracking:
├─ Current Location: [GPS Coordinates]
├─ Start Point: Service Center (Main Office)
├─ Destination: Site B - Pit 4
├─ Distance: 45 km
├─ ETA: [Real-time]
└─ Route: [Map Link]

Related Records:
├─ Parent Case: 01553477
├─ Related Asset: HD785-7 - 8076
├─ Related Account: SIMS JAYA KALTIM
└─ Contact: BURHAN

Actions:
├─ [View on Map]
├─ [Call Mechanic]
├─ [Send Message]
├─ [Update Status]
└─ [Complete Dispatch]
```

---

## 5. TIMESHEET ENTRIES IN SIDEBAR

### 5.1 Timesheet Overview

```
┌─────────────────────────────────────────────────┐
│ ⏱️ TIMESHEET ENTRIES      (Sidebar Accessible)   │
├─────────────────────────────────────────────────┤
│                                                 │
│ TODAY'S TIMESHEET:                              │
│ ├─ Total Hours Logged: 6.5 hours                │
│ ├─ Billable Hours: 6.5 hours                    │
│ ├─ Break Time: 1.0 hour                         │
│ ├─ Overtime: 0.5 hour                           │
│ └─ Status: In Progress                          │
│                                                 │
│ ENTRIES (Latest 5):                             │
│ ├─ 08:00-09:30: Preparation                     │
│ │  Work Order: WO-00263272                      │
│ │  Hours: 1.5, Billable: Yes                    │
│ │                                               │
│ ├─ 09:30-12:30: Travel + Site Work              │
│ │  Work Order: WO-00263272                      │
│ │  Hours: 3.0, Billable: Yes                    │
│ │                                               │
│ ├─ 12:30-13:30: Break                           │
│ │  Hours: 1.0, Billable: No                     │
│ │                                               │
│ ├─ 13:30-16:45: Asset Inspection                │
│ │  Work Order: WO-00264271                      │
│ │  Hours: 3.25, Billable: Yes                   │
│ │                                               │
│ └─ 16:45-17:15: Overtime (Waiting)              │
│    Work Order: WO-00264271                      │
│    Hours: 0.5, Billable: Yes                    │
│                                                 │
│ WEEKLY SUMMARY:                                 │
│ ├─ Monday: 8.5 hours                            │
│ ├─ Tuesday: 8.0 hours                           │
│ ├─ Wednesday: 7.5 hours                         │
│ ├─ Thursday: 6.5 hours                          │
│ ├─ Friday: [In Progress]                        │
│ └─ Total: 30.5 hours (Target: 40)              │
│                                                 │
│ QUICK ACTIONS:                                  │
│ ├─ [+ Add Entry]                                │
│ ├─ [Edit Current]                               │
│ ├─ [Stop Timer]                                 │
│ ├─ [View Full Timesheet]                        │
│ └─ [Submit Approval]                            │
│                                                 │
│ FILTERS:                                        │
│ ├─ By Date: [Today ▼]                          │
│ ├─ By WO: [All ▼]                              │
│ ├─ By Status: [All ▼]                          │
│ └─ By Project: [All ▼]                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5.2 Timesheet Entry Structure

```
TIMESHEET ENTRY OBJECT:

Entry Identification:
├─ Entry ID: TS-2024-005
├─ Date: 26/05/2026
├─ Employee/Mechanic: Budi Santoso
└─ Entry Type: Work / Break / Travel / Waiting / Other

Time Information:
├─ Start Time: 08:00
├─ End Time: 09:30
├─ Duration: 1.5 hours
├─ Break Duration: 0.5 hours
└─ Net Time: 1.0 hours

Work Classification:
├─ Work Order: WO-00263272
├─ Asset: HD785-7 - 8076
├─ Task Code: PREP-001
├─ Task Description: Preparation & Diagnostics
└─ Task Category: Preparation / Traveling / On-site Work

Billing Information:
├─ Billable: Yes / No
├─ Billable Hours: 1.5
├─ Non-Billable Hours: 0.0
├─ Billing Rate: $50/hour
├─ Total Billing: $75
└─ Currency: USD

Status & Approvals:
├─ Entry Status: Draft / Submitted / Approved / Rejected
├─ Submitted By: Budi Santoso
├─ Submitted Date: 26/05/2026, 17:30
├─ Approved By: [Manager Name]
└─ Approval Date: [Date]

Notes:
├─ Work Notes: "Completed inspection on pump assembly"
├─ Issues: "Found wear on thrust plate"
├─ Next Steps: "Parts ordering required"
└─ Attachments: [photos, documents]

Actions:
├─ [Edit Entry]
├─ [Delete Entry]
├─ [Add Notes]
├─ [Attach Files]
└─ [Submit for Approval]
```

---

## 6. SERVICE APPOINTMENTS IN SIDEBAR

### 6.1 Service Appointments Overview

```
┌──────────────────────────────────────────────────┐
│ 📅 SERVICE APPOINTMENTS   (Sidebar Accessible)    │
├──────────────────────────────────────────────────┤
│                                                  │
│ TODAY'S APPOINTMENTS:                            │
│ ├─ Total: 3 appointments                         │
│ ├─ Completed: 1                                  │
│ ├─ In Progress: 1                                │
│ ├─ Upcoming: 1                                   │
│ └─ Rescheduled: 0                                │
│                                                  │
│ APPOINTMENT LIST (Today):                        │
│                                                  │
│ [09:00] SA-2124973 - CONFIRMED                  │
│ ├─ Asset: HD785-7 - 8076                        │
│ ├─ Location: Site B - Pit 4                     │
│ ├─ Contact: BURHAN                              │
│ ├─ Duration: 4 hours                            │
│ ├─ Mechanic: Budi Santoso                       │
│ ├─ Related WO: WO-00263272                      │
│ └─ Status: [Completed] ✓                        │
│                                                  │
│ [13:00] SA-2124974 - IN PROGRESS                │
│ ├─ Asset: GD825A-2 (Motor Grader)               │
│ ├─ Location: Site C - Pit 1                     │
│ ├─ Contact: Ahmad Wijaya                        │
│ ├─ Duration: 3 hours                            │
│ ├─ Mechanic: Andi Kusuma                        │
│ ├─ Related WO: WO-00264271                      │
│ └─ Status: [In Progress] ⟲                      │
│                                                  │
│ [16:30] SA-2124975 - SCHEDULED                  │
│ ├─ Asset: PC200-8 (Excavator)                   │
│ ├─ Location: Site D - Main                      │
│ ├─ Contact: Setiawan Hartono                    │
│ ├─ Duration: 2 hours                            │
│ ├─ Mechanic: [Unassigned]                       │
│ ├─ Related WO: WO-00048651                      │
│ └─ Status: [Scheduled] ⏱                        │
│                                                  │
│ UPCOMING (Next 7 Days): 8 appointments          │
│ ├─ 27/05: 2 appointments                        │
│ ├─ 28/05: 2 appointments                        │
│ ├─ 29/05: 1 appointment                         │
│ ├─ 30/05: 2 appointments                        │
│ └─ 31/05: 1 appointment                         │
│                                                  │
│ QUICK ACTIONS:                                   │
│ ├─ [+ Schedule New]                             │
│ ├─ [View Calendar]                              │
│ ├─ [Reschedule]                                 │
│ ├─ [Confirm Appointment]                        │
│ └─ [Send Reminder]                              │
│                                                  │
│ FILTERS:                                         │
│ ├─ By Status: [All ▼]                           │
│ ├─ By Date: [Today ▼]                           │
│ ├─ By Mechanic: [All ▼]                         │
│ └─ By Customer: [All ▼]                         │
│                                                  │
│ CALENDAR VIEW:                                   │
│ ├─ [← May 2026 →]                               │
│ ├─ [Sun] [Mon] [Tue] [Wed] [Thu] [Fri] [Sat]   │
│ ├─ Dots indicate days with appointments        │
│ └─ Click date for detailed view                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 6.2 Service Appointment Structure

```
SERVICE APPOINTMENT OBJECT:

Appointment Identification:
├─ Appointment ID: SA-2124973
├─ Appointment Number: [Reference]
├─ Appointment Type: Service / Maintenance / Inspection
└─ Priority: High / Medium / Low

Scheduling Information:
├─ Appointment Date: 26/05/2026
├─ Start Time: 09:00
├─ End Time: 13:00
├─ Duration: 4 hours
├─ Estimated Duration: 4 hours
├─ Actual Duration: [4 hours]
└─ Status: Scheduled / Confirmed / In Progress / Completed / Cancelled

Related Records:
├─ Parent Work Order: WO-00263272
├─ Related Asset: HD785-7 - 8076
├─ Related Case: 01553477
├─ Related Account: SIMS JAYA KALTIM
└─ Related Contact: BURHAN

Personnel Assignment:
├─ Assigned Mechanic: Budi Santoso
├─ Mechanic Contact: +62-811-234-5678
├─ Backup Mechanic: Andi Kusuma
├─ Assistant: [Name]
└─ Supervisor: [Name]

Location & Details:
├─ Service Location: Site B - Pit 4
├─ Address: [Full Address]
├─ GPS Coordinates: [Lat, Long]
├─ Driving Distance: 45 km
├─ Travel Time: 1.5 hours
└─ Parking Instructions: [Details]

Service Details:
├─ Service Description: Hydraulic system repair
├─ Parts Required: [List]
├─ Tools Required: [List]
├─ Service Level: Premium / Standard
└─ Special Instructions: [Details]

Customer Information:
├─ Primary Contact: BURHAN
├─ Contact Phone: [Phone]
├─ Contact Email: [Email]
├─ Secondary Contact: [Name]
└─ Escalation Contact: [Name]

Confirmation & Reminders:
├─ Customer Confirmation: Confirmed
├─ Confirmation Date: 25/05/2026
├─ Reminder Sent: 26/05/2026, 08:00
├─ Follow-up Required: Yes / No
└─ Follow-up Date: [Date]

Status & Timeline:
├─ Created Date: 24/05/2026
├─ Confirmation Status: Confirmed
├─ Dispatch Status: Assigned
├─ Start Status: In Progress
├─ Completion Status: Completed
└─ Follow-up Status: [Pending]

Notes & Documents:
├─ Pre-visit Notes: [Details]
├─ On-site Notes: "Completed inspection and repair"
├─ Post-visit Notes: [Details]
├─ Attachments: [Photos, documents]
└─ Customer Signature: [Digital signature]

Actions:
├─ [Edit Appointment]
├─ [Confirm Attendance]
├─ [Send Notification]
├─ [Reschedule]
├─ [Complete Appointment]
└─ [Create Follow-up]
```

---

## 7. COMPLETE SIDEBAR LAYOUT - ASCII DIAGRAM

```
┌──────────────────────────────────────┐
│ UT SERVICE CONSOLE                    │
├──────────────────────────────────────┤
│                                       │
│ ┌────────────────────────────────┐   │
│ │ ☰ MENU             [← Collapse]│   │
│ └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ PLATFORM                       │   │
│ ├────────────────────────────────┤   │
│ │ 📋 WORK ORDERS (Active)        │   │
│ │    • Overview                  │   │
│ │    • Schedule                  │   │
│ │    • Dispatch        ⭐ New    │   │
│ │    • Analytics                 │   │
│ │    • Reports                   │   │
│ │                                │   │
│ │ 📌 CASES                       │   │
│ │    • All Cases                 │   │
│ │    • Open Cases                │   │
│ │    • Closed Cases              │   │
│ │                                │   │
│ │ 📊 ANALYTICS                   │   │
│ │    • Dashboard                 │   │
│ │    • KPI Metrics               │   │
│ │    • Trends                    │   │
│ │                                │   │
│ │ 📈 REPORTS                     │   │
│ │    • Scheduled                 │   │
│ │    • Custom                    │   │
│ │    • Export                    │   │
│ └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ QUICK ACCESS                   │   │
│ ├────────────────────────────────┤   │
│ │                                │   │
│ │ 📍 DISPATCH                    │   │
│ │    Pending: 15 | Ready: 8     │   │
│ │    [View Board]                │   │
│ │                                │   │
│ │ ⏱️ TIMESHEET                    │   │
│ │    Today: 6.5 hrs              │   │
│ │    Week: 30.5 hrs              │   │
│ │    [Add Entry]                 │   │
│ │                                │   │
│ │ 📅 SERVICE APPOINTMENTS        │   │
│ │    Today: 3 | Upcoming: 8     │   │
│ │    [Schedule New]              │   │
│ │                                │   │
│ └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ SHORTCUTS                      │   │
│ ├────────────────────────────────┤   │
│ │                                │   │
│ │ ⭐ FAVORITES                   │   │
│ │    • Recent WOs                │   │
│ │    • Open Cases                │   │
│ │    • My Dashboard              │   │
│ │    • Quick Links               │   │
│ │                                │   │
│ │ 🕐 RECENT ITEMS                │   │
│ │    • WO-01275781               │   │
│ │    • Case-01553477             │   │
│ │    • Asset-HD785-7             │   │
│ │    • Dispatch-D001             │   │
│ │                                │   │
│ └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ MORE OPTIONS                   │   │
│ ├────────────────────────────────┤   │
│ │ ⚙ SETTINGS                     │   │
│ │ ❓ HELP & SUPPORT              │   │
│ │ 🌐 LANGUAGE                    │   │
│ │ 🚪 LOGOUT                      │   │
│ └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ RESOURCES                      │   │
│ ├────────────────────────────────┤   │
│ │ 💬 CONTACT SUPPORT             │   │
│ │ 📢 SEND FEEDBACK               │   │
│ │ 📚 DOCUMENTATION               │   │
│ └────────────────────────────────┘   │
│                                       │
│ ┌────────────────────────────────┐   │
│ │ ACCOUNT                        │   │
│ ├────────────────────────────────┤   │
│ │ 👤 Shadcn                      │   │
│ │    mg@example.com              │   │
│ │    [Profile] [Settings] [Log]  │   │
│ └────────────────────────────────┘   │
│                                       │
└──────────────────────────────────────┘
```

---

## 8. MAIN CONTENT AREA - DETAILS TAB

### 8.1 Details Tab with Expandable Sections

```
┌─────────────────────────────────────────────────────┐
│ WORK ORDER #01275781                                │
├─────────────────────────────────────────────────────┤
│                                                      │
│ [Details] [Feed] [Related] [Log]                   │
│    ↑        ↑       ↑       ↑                        │
│  Active   Available Available Available             │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ▼ GENERAL INFORMATION                      [✏️]     │
│   ├─ Work Order Number: 01275781                    │
│   ├─ System Status: REL-PRC-CSER-SAAP-NMAT         │
│   ├─ Case: 01553477                                │
│   ├─ Parent Work Order: —                          │
│   ├─ Account: SIMS JAYA KALTIM                     │
│   ├─ Contact: BURHAN                               │
│   ├─ Subject: TRS HYDRAULIK SYSTEM HO785           │
│   └─ Description: TRS HYDRAULIK SYSTEM HO785       │
│                                                      │
│ ▶ STATUS & COMPLETION                              │
│   [Click to expand]                                 │
│                                                      │
│ ▶ TECHNICAL & SERVICE DETAILS                      │
│   [Click to expand]                                 │
│                                                      │
│ ▼ LEAD TIME & SCHEDULING                  [✏️]     │
│   ├─ LeadTime 0: —                                  │
│   ├─ Aging WO Claim: —                             │
│   ├─ ABR File: ☐                                   │
│   └─ LT ABR: 0                                      │
│                                                      │
│ ▼ KC INFORMATION                                    │
│   ├─ KC Number: 51524826                           │
│   ├─ SAP Work Order Number KC: 51524826            │
│   ├─ DC QR Date: [___________]                     │
│   ├─ Parts QR Date: [___________]                  │
│   ├─ KC Rejected Reason: [___________]             │
│   └─ Reason for Rejection: [___________]           │
│                                                      │
│ ▶ INFORMATION - OBJECT PART                         │
│   [Click to expand]                                 │
│                                                      │
│ ▶ ADDITIONAL INFORMATION                            │
│   [Click to expand]                                 │
│                                                      │
│ ▶ SA INFORMATION                                    │
│   [Click to expand]                                 │
│                                                      │
│ ▶ DESCRIPTION                                       │
│   [Click to expand]                                 │
│                                                      │
│ ▼ SYSTEM INFORMATION                       [✏️]     │
│   ├─ Created By: UT Integration                    │
│   │              26/05/2026, 07:36                 │
│   └─ Last Modified By: M. Thoriqul...              │
│                      26/05/2026, 11:12              │
│                                                      │
│ [Recent Items] [Macros] [Chatter Feed]             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 9. RESPONSIVE SIDEBAR BEHAVIOR

### 9.1 Breakpoints & Visibility

```
DESKTOP (≥1024px):
├─ Sidebar: Always visible (expanded)
├─ Width: 250-300px
├─ Main Content: Adjusts to remaining width
├─ Right Panel: Visible (25%)
└─ Collapse option: Always available

TABLET (768px - 1023px):
├─ Sidebar: Toggleable (collapsed by default)
├─ Width: 80% of screen when expanded
├─ Main Content: Full width when sidebar collapsed
├─ Right Panel: Visible on landscape, hidden on portrait
├─ Hamburger Menu: Visible
└─ Animation: Smooth slide-in/out (300ms)

MOBILE (<768px):
├─ Sidebar: Drawer/Off-canvas (hidden by default)
├─ Width: 100% full-width
├─ Main Content: Full width
├─ Right Panel: Scrollable below main content
├─ Hamburger Menu: Visible & prominent
├─ Animation: Slide from left (300ms)
└─ Click outside: Auto-close sidebar
```

### 9.2 Touch Gestures (Mobile)

```
SWIPE LEFT:
├─ Closes sidebar (if open)
├─ Expands main content
└─ Smooth animation

SWIPE RIGHT:
├─ Opens sidebar (if closed)
├─ Shifts main content right
└─ Smooth animation

TAP HAMBURGER:
├─ Toggles sidebar open/close
└─ Remembers state

TAP MENU ITEM:
├─ Navigates to section
├─ Loads content in main area
├─ Keeps sidebar open (tablet)
└─ Closes sidebar (mobile)
```

---

## 10. DATA INTEGRATION - SIDEBAR WIDGETS

### 10.1 Real-time Updates

```
DISPATCH WIDGET:
├─ Updates every 30 seconds
├─ Shows live queue count
├─ Alerts for new assignments
├─ Color-coded status

TIMESHEET WIDGET:
├─ Updates in real-time
├─ Running timer for current task
├─ Daily total auto-calculation
├─ Alerts for break time

SERVICE APPOINTMENTS WIDGET:
├─ Live calendar sync
├─ Upcoming alerts
├─ Status changes in real-time
├─ Customer confirmations reflected

NOTIFICATION SYSTEM:
├─ Toast notifications for urgent items
├─ Badge counts on sidebar items
├─ Pulse animation for new items
└─ Sound alerts (optional)
```

### 10.2 API Endpoints for Sidebar Data

```
Dispatch Data:
GET /api/dispatch/queue?status=all&limit=10
GET /api/dispatch/{id}/realtime-tracking
POST /api/dispatch/assign

Timesheet Data:
GET /api/timesheet/today
GET /api/timesheet/weekly
POST /api/timesheet/entry
PATCH /api/timesheet/entry/{id}

Service Appointments:
GET /api/appointments/today
GET /api/appointments/upcoming
POST /api/appointments/confirm
PATCH /api/appointments/{id}/status
```

---

## 11. ACCESSIBILITY & KEYBOARD NAVIGATION

### 11.1 Keyboard Shortcuts

```
Ctrl + S  : Save current record
Ctrl + /  : Open search
Ctrl + K  : Open command palette
Alt + D   : Go to Dispatch
Alt + T   : Go to Timesheet
Alt + A   : Go to Appointments
Alt + Q   : Toggle sidebar
Alt + O   : Open Work Orders
Alt + C   : Open Cases
? (when focused): Show help

TAB       : Navigate through menu items
ENTER     : Select highlighted item
ARROW UP/DOWN: Navigate menu items
ESC       : Close sidebar (mobile)
```

### 11.2 Screen Reader Support

```
ARIA Labels:
├─ Sidebar: "Main navigation sidebar"
├─ Hamburger: "Toggle navigation menu"
├─ Menu items: "[Icon] [Label]"
├─ Submenu: "Submenu for [Section]"
└─ Widget: "[Name] Widget - [Status]"

ARIA Attributes:
├─ aria-expanded: For collapsible sections
├─ aria-current: For active menu item
├─ aria-label: For icon-only buttons
├─ aria-live: For real-time updates
└─ role: For semantic structure
```

---

## 12. COMPLETE WORK ORDER LAYOUT - FULL VIEW

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                                [Search] [🔔] [⚙] [👤]      │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ [Console] [01275781 (WO)] [01553477 (Case)] [More Tabs...]                    │
│                                                                                 │
├──────────┬────────────────────────────────────────────┬──────────────────────┤
│          │                                            │                      │
│ SIDEBAR  │   WORK ORDER #01275781                     │  RIGHT PANEL (25%)   │
│ (Toggle) │   TRS HYDRAULIK SYSTEM HO785               │  ┌──────────────────┐│
│          │                                            │  │ RECOMMENDED      ││
│ ☰ MENU   │   [Actions Toolbar]                        │  │ MECHANIC         ││
│ │        │                                            │  │ [Blue Button]    ││
│ 📋 WO    │   ├──────────────────────────────────────┐ │  │                  ││
│ │        │   │Details [Feed] [Related] [Log]       │ │  │ KNOWLEDGE        ││
│ ├─ Overv │   ├──────────────────────────────────────┤ │  │ [Filters]        ││
│ ├─ Sch  │   │                                        │ │  │ [Search...]      ││
│ ├─ Disp │   │ ▼ GENERAL INFO            [✏️]        │ │  │                  ││
│ ├─ Anal │   │   WO#: 01275781                       │ │  │ • GD825A...      ││
│ └─ Rep  │   │   Case: 01553477                      │ │  │   KN-0921 (85%) ││
│         │   │   Account: SIMS JAYA KALTIM           │ │  │                  ││
│ 📌 CASE │   │   Contact: BURHAN                     │ │  │ • Thrust Plate.. ││
│ │        │   │   Subject: TRS HYDRAULIK...          │ │  │   TB-1184 (78%) ││
│ ├─ All  │   │                                        │ │  │ ┌────────────────┐│
│ ├─ Open │   │ ▶ STATUS & COMPLETION                 │ │  │ │ ASSET DETAILS  ││
│ └─ MyCS │   │   [Click to expand]                   │ │  │ │ GD785-7 : BO76 ││
│         │   │                                        │ │  │ │ Serial: 8076   ││
│ 📊 ANALY│   │ ▶ TECHNICAL & SERVICE DETAILS         │ │  │ │ Hours: 4,520   ││
│         │   │   [Click to expand]                   │ │  │ │ Model: HD785-7 ││
│ 📈 REPS │   │                                        │ │  │ │                ││
│         │   │ ▼ LEAD TIME & SCHEDULING   [✏️]       │ │  │ └────────────────┘│
│ ┌─────┐ │   │   LeadTime: —                         │ │  │ WORK PLANS (0) ││
│ │📍  │ │   │   ABR: ☐                              │ │  │ [+ Create]      ││
│ │DISP│ │   │                                        │ │  │                  ││
│ │Q: 15│ │   │ ▼ KC INFO                            │ │  │ WORK STEPS (0) ││
│ │Ready│ │   │   KC#: 51524826                       │ │  │ [+ Add]         ││
│ │: 8 │ │   │   DC QR: [_______]                    │ │  │                  ││
│ └─────┘ │   │                                        │ │  │ SERVICE APPTS(1)││
│         │   │ ▶ INFO - OBJECT PART                  │ │  │ SA-2124973      ││
│ ┌─────┐ │   │   [Click to expand]                   │ │  │ [View All]      ││
│ │⏱️  │ │   │                                        │ │  │                  ││
│ │TIME │ │   │ ▶ ADDITIONAL INFO                     │ │  │ + 18 MORE OBJ ││
│ │Today│ │   │   [Click to expand]                   │ │  │ (Scrollable)    ││
│ │6.5h │ │   │                                        │ │  │                  ││
│ │[Add]│ │   │ ▶ SA INFO                              │ │  │                  ││
│ └─────┘ │   │   [Click to expand]                   │ │  │                  ││
│         │   │                                        │ │  │                  ││
│ ┌─────┐ │   │ ▶ DESCRIPTION                         │ │  │                  ││
│ │📅  │ │   │   [Click to expand]                   │ │  │                  ││
│ │APPT│ │   │                                        │ │  │                  ││
│ │Today│ │   │ ▼ SYSTEM INFO                         │ │  │                  ││
│ │3    │ │   │   Created: UT Integration             │ │  │                  ││
│ │Next:│ │   │   26/05/2026, 07:36                  │ │  │                  ││
│ │8    │ │   │   Last Modified: M. Thoriqul...       │ │  │                  ││
│ │[Sch]│ │   │   26/05/2026, 11:12                   │ │  │                  ││
│ └─────┘ │   │                                        │ │  │                  ││
│         │   │ [Recent] [Macros] [Chatter Feed]      │ │  └──────────────────┘│
│ ⭐ FAV  │   │                                        │                      │
│ ⚙ SET   │   │                                        │                      │
│ ❓ HELP │   │                                        │                      │
│ 🚪 LOGO │   │                                        │                      │
│         │   │                                        │                      │
│ [Recent │   │                                        │                      │
│  Items] │   │                                        │                      │
│         │   │                                        │                      │
│ 💬 SUP  │   │                                        │                      │
│ 📢 FB   │   │                                        │                      │
│         │   │                                        │                      │
└──────────┴────────────────────────────────────────────┴──────────────────────┘
```

---

## 13. METADATA & SYSTEM INFORMATION

**System:** UT Service Console v3.0 (Advanced)
**Sidebar Version:** Collapsible Dynamic Navigation v2.0
**Features:** Work Orders + Dispatch + Timesheet + Appointments
**Last Updated:** 26/05/2026 07:36
**Document Version:** Complete Design v1.0

---

## 14. SUMMARY - KEY FEATURES

### Sidebar Features:
✅ **Collapsible Menu** - Expand/collapse with smooth animation
✅ **Platform Navigation** - Work Orders, Cases, Analytics, Reports
✅ **NEW: Dispatch Section** - Queue management + real-time tracking
✅ **NEW: Timesheet Widget** - Daily/weekly tracking with quick entry
✅ **NEW: Appointments Widget** - Calendar + upcoming appointments
✅ **Favorites** - Quick access to frequently used items
✅ **Recent Items** - Last accessed records
✅ **Quick Actions** - Contextual buttons for each section
✅ **Responsive Design** - Desktop, tablet, mobile
✅ **Accessibility** - Keyboard shortcuts + screen reader support
✅ **Real-time Updates** - Live data refresh for all widgets
✅ **Notification System** - Alerts and status badges

### Main Content Features:
✅ **Expandable Sections** - Details tab with collapsible fields
✅ **Feed Tab** - Activity timeline
✅ **Related Tab** - Linked objects
✅ **Log Tab** - System audit trail
✅ **Action Buttons** - Toolbar for quick actions
✅ **Right Panel** - 18+ linked objects

---

*This document provides comprehensive documentation of the Work Order Management System with advanced collapsible sidebar, dispatch management, timesheet tracking, and service appointment scheduling.*
