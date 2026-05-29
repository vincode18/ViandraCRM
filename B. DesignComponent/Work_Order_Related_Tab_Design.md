# Work Order Related Tab - Complete Documentation

## Overview
Related Tab pada Work Order Management menampilkan semua linked objects dan related records yang terhubung dengan Work Order. Tab ini memberikan pandangan holistik tentang relasi Work Order dengan Cases, Contacts, Work Orders lainnya, Assets, Maintenance Plans, dan Service Contracts.

---

## 1. RELATED TAB NAVIGATION & STRUCTURE

### 1.1 Tab Location in Work Order

```
┌─────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [Details] [Feed] [Related] [Log]                       │
│              ↑        ↑      ↑     ↑                    │
│           Active   Target  Tab3  Tab4                   │
│                                                          │
│ RELATED TAB CONTENT:                                    │
│ ├─ Cases (6+)                                          │
│ ├─ Work Orders (6+)                                    │
│ ├─ Assets                                              │
│ ├─ Maintenance Plans (6+)                              │
│ ├─ Service Contract Assets (3+)                        │
│ ├─ Komtrax Faults (0)                                  │
│ └─ [Additional Related Objects]                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Two-Section Layout

```
┌────────────────────────────────────────┬─────────────────┐
│                                        │                 │
│ LEFT SECTION (70%)                     │ RIGHT SECTION   │
│ MAIN RELATED OBJECTS                   │ (30%)           │
│                                        │ QUICK SUMMARY   │
│ • Cases (6+)                           │                 │
│ • Work Orders (6+)                     │ Asset Info      │
│ • Maintenance Plans (6+)               │ Contract Assets │
│ • Service Contract Assets (5)          │ Faults Summary  │
│ • Komtrax Faults (0)                   │ History (1)     │
│ • Asset History (1)                    │                 │
│                                        │                 │
└────────────────────────────────────────┴─────────────────┘
```

---

## 2. ASSET INFORMATION SECTION (Asset HD785-7 - 8076)

### 2.1 Asset Header

```
┌──────────────────────────────────────────────────────────┐
│ 📦 Asset                                                 │
│    HD785-7 - 8076                                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Account:         SIMS JAYA KALTIM                       │
│ Contact:         BURHAN                                 │
│ Quantity:        1                                      │
│                                                          │
│ [Edit] [Delete] [Clone] [⋯]                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Asset Details

| Field | Value |
|-------|-------|
| **Asset Name** | GD785-7 - 8076 |
| **Asset Type** | Motor Grader |
| **Serial Number** | 8076 |
| **Unit Model** | HD785-7 |
| **Equipment UoM** | hm |
| **SMR (Service Meter Reading)** | 6006I.0 hm |
| **Account** | SIMS JAYA KALTIM |
| **Account ID** | HD785-7 |
| **Contact** | BURHAN |
| **Warranty Start Date** | 27/12/2009 |
| **Warranty End Date** | 27/12/2010 |
| **Status** | Active |
| **Location** | Site B - Pit 4 |

### 2.3 Asset Tabs Structure

```
┌──────────────────────────────────────┐
│ Asset: HD785-7 - 8076               │
├──────────────────────────────────────┤
│                                      │
│ [Details] [Related] [Contact]       │
│           [Quantity]                 │
│                                      │
│ DETAILS TAB (Currently Viewing):     │
│ ├─ General Information               │
│ ├─ Warranty Details                 │
│ ├─ Location & Account Info          │
│ └─ Service History                  │
│                                      │
│ RELATED TAB:                         │
│ ├─ Work Orders (6)                  │
│ ├─ Cases (6)                        │
│ ├─ Service Contracts (5)            │
│ ├─ Maintenance Plans (6)            │
│ └─ Asset History (1)                │
│                                      │
│ CONTACT TAB:                         │
│ ├─ Primary Contact: BURHAN          │
│ ├─ Account: SIMS JAYA KALTIM        │
│ └─ Contact Method: Phone/Email      │
│                                      │
│ QUANTITY TAB:                        │
│ ├─ Available Qty: 1                 │
│ ├─ In Service Qty: 1                │
│ └─ Maintenance Qty: 0               │
│                                      │
└──────────────────────────────────────┘
```

---

## 3. CASES LINKED TO ASSET (6+)

### 3.1 Cases Section Header

```
┌─────────────────────────────────────────────────────────┐
│ 📌 Cases (6+)                                   [New]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Contact Name    Subject                    Priority      │
│ ──────────────────────────────────────────────────────  │
│ (Table showing 6+ cases)                                │
│                                                          │
│ [View All]                                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Cases Table Detail

| Case ID | Contact Name | Subject | Priority | Status |
|---------|--------------|---------|----------|--------|
| **01553477** | BURHAN | PERFORM BACKLOG HO785-7 HD1114 | Medium | Open |
| **01467893** | BURHAN | Periodic Service 4000 Hrs HD1114 | Medium | In Progress |
| **01553475** | BURHAN | ADDITIONAL PACKAGE SERVICE 1000Hrs HD1114 | Medium | Pending |
| **01156148** | BURHAN | Hose brake cooling leaks HD1114 | Medium | Closed |
| **01142385** | BURHAN | LOW POWER HD1114 | Medium | Completed |
| **01089745** | — | [Additional Case] | — | — |

### 3.3 Case Fields Information

```
CASE RECORD CONTAINS:

General Information:
├─ Case ID: 01553477
├─ Case Status: Open/In Progress/Closed
├─ Case Type: Service Request
├─ Case Priority: Low/Medium/High
└─ Created Date: 26/05/2026

Related Entity:
├─ Contact Name: BURHAN
├─ Account: SIMS JAYA KALTIM
├─ Related Asset: HD785-7 - 8076
└─ Related Work Order: 01275781

Case Details:
├─ Subject: PERFORM BACKLOG HO785-7 HD1114
├─ Description: [Details of the service request]
├─ SLA Status: On Track / At Risk / Breached
├─ Owner: Service Manager
└─ Last Modified: 26/05/2026, 11:12

Actions Available:
├─ [Edit Case]
├─ [View Details]
├─ [Close Case]
└─ [Change Status]
```

---

## 4. WORK ORDERS LINKED TO ASSET (6+)

### 4.1 Work Orders Section

```
┌─────────────────────────────────────────────────────────┐
│ 🔧 Work Orders (6+)                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Work Order Number │ Subject      │ PMRct Type │ Account │
│ ────────────────────────────────────────────────────── │
│                                                          │
│ 00263272         │ AC Burtu HD1114 │ USC   │ SIMS JAYA │
│ 00264271         │ AC Hot HD1114   │ USC   │ SIMS JAYA │
│ 00048651         │ AC Hot HD1114   │ USC   │ SIMS JAYA │
│ 00685493         │ AC Hot HD1114   │ USC   │ SIMS JAYA │
│ 00087786         │ AC Hot HD1114   │ USC   │ SIMS JAYA │
│ 00147201         │ AC Panas HD1114 │ USC   │ SIMS JAYA │
│                                                          │
│ [View All]                                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Work Orders Detailed Information

| WO Number | Subject | PMRct Type | Account | Status | Priority |
|-----------|---------|-----------|---------|--------|----------|
| **00263272** | AC Burtu HD1114 | USC | SIMS JAYA KALTIM | New | Medium |
| **00264271** | AC Hot HD1114 | USC | SIMS JAYA KALTIM | In Progress | High |
| **00048651** | AC Hot HD1114 | USC | SIMS JAYA KALTIM | Completed | Medium |
| **00685493** | AC Hot HD1114 | USC | SIMS JAYA KALTIM | Closed | Low |
| **00087786** | AC Hot HD1114 | USC | SIMS JAYA KALTIM | In Progress | Medium |
| **00147201** | AC Panas HD1114 | USC | SIMS JAYA KALTIM | New | High |

### 4.3 Work Order Record Structure

```
WORK ORDER RECORD CONTAINS:

Header Information:
├─ Work Order Number: 00263272
├─ Subject: AC Burtu HD1114
├─ Status: New / In Progress / Completed / Closed
└─ Priority: Low / Medium / High

Service Details:
├─ PMRct Type: USC (Unscheduled Service Call)
├─ Service Category: [Category]
├─ Work Description: [Details]
└─ Assigned Mechanic: [Name]

Related Information:
├─ Parent Case: 01553477
├─ Related Asset: HD785-7 - 8076
├─ Account: SIMS JAYA KALTIM
└─ Contact: BURHAN

Dates & Time:
├─ Created Date: 26/05/2026
├─ Start Date: 26/05/2026, 07:00
├─ Target Completion: 28/05/2026
└─ Last Modified: 26/05/2026, 15:30

Actions:
├─ [View Work Order]
├─ [Edit]
├─ [Change Status]
└─ [View Linked Cases]
```

---

## 5. MAINTENANCE PLANS (6+)

### 5.1 Maintenance Plans Section

```
┌─────────────────────────────────────────────────────────┐
│ 📋 Maintenance Plans (0)                        [New]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ No maintenance plans currently linked to this asset     │
│                                                          │
│ [+ Create New Maintenance Plan]                         │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📄 Maintenance Plan Items (6+)                  [New]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Maintenance Plan Item │ Plan Date │ Tasklist Code │ SMR │
│ ──────────────────────────────────────────────────── │
│                                                      │
│ MI-0231911           │ 25/08/2020│ RAPH0008   │ 49,750 │
│ MI-0231912           │ 10/09/2020│ RAPH0008   │ 50,000 │
│ MI-0231913           │ 03/10/2020│ RAPH0008   │ 50,250 │
│ MI-0231914           │ 20/10/2020│ RAPH0008   │ 50,500 │
│ MI-0231915           │ 29/11/2020│ RAPH0008   │ 50,750 │
│ MI-0231916           │ 20/12/2020│ RAPH0008   │ 51,000 │
│                                                      │
│ [View All]                                          │
│                                                      │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Maintenance Plan Items Details

| Plan Item ID | Plan Date | Tasklist Code | Task Code | SMR (Plan) | Status |
|--------------|-----------|---------------|-----------|-----------|--------|
| **MI-0231911** | 25/08/2020 | RAPH0008 | PREP-001 | 49,750 hm | Scheduled |
| **MI-0231912** | 10/09/2020 | RAPH0008 | PREP-001 | 50,000 hm | Scheduled |
| **MI-0231913** | 03/10/2020 | RAPH0008 | PREP-001 | 50,250 hm | Scheduled |
| **MI-0231914** | 20/10/2020 | RAPH0008 | PREP-001 | 50,500 hm | Scheduled |
| **MI-0231915** | 29/11/2020 | RAPH0008 | PREP-001 | 50,750 hm | Completed |
| **MI-0231916** | 20/12/2020 | RAPH0008 | PREP-001 | 51,000 hm | Completed |

### 5.3 Maintenance Plan Item Fields

```
MAINTENANCE PLAN ITEM RECORD:

Plan Information:
├─ Maintenance Plan Item ID: MI-0231911
├─ Plan Type: Preventive Maintenance
├─ Plan Frequency: Every 250 hours
└─ Status: Scheduled / Due / Completed / Overdue

Service Details:
├─ Tasklist Code: RAPH0008
├─ Task Description: 500-hour service interval
├─ Related Asset: HD785-7 - 8076
└─ Account: SIMS JAYA KALTIM

Scheduled Dates:
├─ Plan Date: 25/08/2020
├─ Service Meter Reading (SMR): 49,750 hm
├─ Due Date: 27/08/2020
└─ Estimated Duration: 16 hours

Execution Status:
├─ Status: Scheduled
├─ Assigned Mechanic: [Name]
├─ Work Order Created: [WO Number]
└─ Actual Completion: [Date]

Actions:
├─ [View Plan]
├─ [Create Work Order]
├─ [Mark Complete]
└─ [Reschedule]
```

---

## 6. SERVICE CONTRACT ASSETS (3+)

### 6.1 Service Contract Assets Section

```
┌─────────────────────────────────────────────────────────┐
│ 🤝 Service Contract Assets (3+)                [New]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Service Contract Asset Name │ Service Program Type │    │
│ Contract Asset Key                                   │
│ ────────────────────────────────────────────────── │
│                                                      │
│ SA-0006175                                         │
│ Service Program Type: [Premium Support]            │
│ Special Support: [Yes]                             │
│ Contract Asset Key: 330026962-002700-0001         │
│                                                      │
│ SA-0006173                                         │
│ Service Program Type: [Extended Warranty]          │
│ Special Support: [Yes]                             │
│ Contract Asset Key: 330026962-002680-0001         │
│                                                      │
│ SA-0006159                                         │
│ Service Program Type: [Standard Support]           │
│ Special Support: [No]                              │
│ Contract Asset Key: 330026962-002490-0001         │
│                                                      │
│ SA-0001395                                         │
│ Service Program Type: [Premium Support]            │
│ Special Support: [Yes]                             │
│ Contract Asset Key: 330013295-000010-0001         │
│                                                      │
│ SA-0000906                                         │
│ Service Program Type: [Standard Support]           │
│ Special Support: [No]                              │
│ Contract Asset Key: 330009971-000010-0001         │
│                                                      │
│ [View All]                                          │
│                                                      │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Service Contract Asset Details

| Contract Asset ID | Service Program Type | Special Support | Contract Asset Key | Status |
|-------------------|----------------------|-----------------|--------------------|--------|
| **SA-0006175** | Premium Support | Yes | 330026962-002700-0001 | Active |
| **SA-0006173** | Extended Warranty | Yes | 330026962-002680-0001 | Active |
| **SA-0006159** | Standard Support | No | 330026962-002490-0001 | Active |
| **SA-0001395** | Premium Support | Yes | 330013295-000010-0001 | Active |
| **SA-0000906** | Standard Support | No | 330009971-000010-0001 | Active |

### 6.3 Service Contract Asset Record Structure

```
SERVICE CONTRACT ASSET RECORD:

Identification:
├─ Contract Asset ID: SA-0006175
├─ Asset Name: HD785-7 - 8076
├─ Service Contract Number: [Contract #]
└─ Contract Asset Key: 330026962-002700-0001

Service Details:
├─ Service Program Type: Premium Support
├─ Service Level: Gold/Silver/Bronze
├─ Special Support: Yes / No
└─ Service Coverage: [Details]

Contract Terms:
├─ Start Date: 27/12/2009
├─ End Date: 27/12/2010
├─ Renewal Date: 27/12/2011
└─ Status: Active / Expired / Pending

Entitlements:
├─ On-Site Support: Yes/No
├─ Response Time: 4 hours / 24 hours
├─ Resolution Guarantee: Yes/No
└─ Number of Service Visits: [Unlimited/Limited]

Related Information:
├─ Related Asset: HD785-7 - 8076
├─ Related Account: SIMS JAYA KALTIM
└─ Related Contact: BURHAN

Actions:
├─ [View Contract]
├─ [Renew Contract]
├─ [Modify Terms]
└─ [Create Service Request]
```

---

## 7. KOMTRAX FAULTS (0)

### 7.1 Komtrax Faults Section

```
┌──────────────────────────────────────────────────────┐
│ ⚠️ Komtrax Faults (Last 30 Days) (0)        [New]  │
├──────────────────────────────────────────────────────┤
│                                                       │
│ No Komtrax faults recorded in the last 30 days      │
│                                                       │
│ [+ Record New Fault]                                 │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### 7.2 Komtrax Faults Information

```
KOMTRAX FAULT RECORD (When Present):

Fault Identification:
├─ Fault ID: [ID]
├─ Fault Code: [Code]
├─ Fault Type: Engine / Hydraulic / Electrical / Mechanical
└─ Severity: Critical / High / Medium / Low

Timing:
├─ First Detected: [Date/Time]
├─ Last Occurred: [Date/Time]
├─ Frequency: [Number of occurrences]
└─ Duration: [Hours/Days]

Technical Details:
├─ Equipment ID: HD785-7
├─ Serial Number: 8076
├─ Operating Hours at Fault: 6,245 hm
└─ Fault Description: [Description]

Status & Action:
├─ Status: Open / In Review / Resolved
├─ Related Work Order: [WO Number]
├─ Assigned Technician: [Name]
└─ Expected Resolution: [Date]

Actions:
├─ [View Fault Details]
├─ [Create Work Order]
├─ [Close Fault]
└─ [View Diagnostics]
```

---

## 8. ASSET HISTORY (1)

### 8.1 Asset History Section

```
┌──────────────────────────────────────────────────────────┐
│ 📜 Asset History (1)                                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Date        │ Field        │ User              │ Change │
│ ──────────────────────────────────────────────────────  │
│             │              │                   │        │
│ 22/08/2025  │ Work Center  │ UT Integration    │ FM-SKJ │
│ 02:32       │              │                   │ → FD-SKJ
│             │              │                   │        │
│ [View All]                                              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 8.2 Asset History Details

| Date | Time | Field | User | Original Value | New Value |
|------|------|-------|------|----------------|-----------|
| **22/08/2025** | 02:32 | Work Center | UT Integration | FM-SKJ | FD-SKJ |

### 8.3 Asset History Record Structure

```
ASSET HISTORY RECORD:

Change Information:
├─ Change ID: [ID]
├─ Date/Time: 22/08/2025, 02:32
├─ Modified By: UT Integration
└─ Change Type: Field Update / Status Change / Addition

Field Changed:
├─ Field Name: Work Center
├─ Previous Value: FM-SKJ (Field Maintenance - Semarang)
├─ New Value: FD-SKJ (Facility Depot - Jakarta)
└─ Reason: Equipment Transfer

Asset Information:
├─ Asset ID: HD785-7 - 8076
├─ Asset Name: Motor Grader
├─ Serial Number: 8076
└─ Related Account: SIMS JAYA KALTIM

Related Records:
├─ Work Orders Affected: [List]
├─ Maintenance Plans Affected: [List]
└─ Related Cases: [List]

Actions:
├─ [View Full History]
├─ [Revert Change]
└─ [View Related Changes]
```

---

## 9. RELATED TAB - FULL ASCII LAYOUT

### 9.1 Complete Related Tab View

```
┌────────────────────────────────────────────────────────────────┐
│ WORK ORDER #01275781 › RELATED                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 📦 Asset: HD785-7 - 8076                [Edit]      │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │ Account: SIMS JAYA KALTIM                           │        │
│ │ Contact: BURHAN                                     │        │
│ │ Quantity: 1                                         │        │
│ │ [Delete] [Clone]                                    │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 📌 Cases (6+)                              [New]    │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ Contact Name │ Subject                │ Priority   │        │
│ │ ───────────────────────────────────────────────── │        │
│ │ BURHAN       │ PERFORM BACKLOG        │ Medium    │        │
│ │              │ HO785-7 HD1114         │           │        │
│ │ BURHAN       │ Periodic Service       │ Medium    │        │
│ │              │ 4000 Hrs HD1114        │           │        │
│ │ BURHAN       │ ADDITIONAL PACKAGE     │ Medium    │        │
│ │              │ SERVICE 1000Hrs HD1114 │           │        │
│ │ BURHAN       │ Hose brake cooling     │ Medium    │        │
│ │              │ leaks HD1114           │           │        │
│ │ BURHAN       │ LOW POWER HD1114       │ Medium    │        │
│ │              │                        │           │        │
│ │ [View All Cases]                                  │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 🔧 Work Orders (6+)                                │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ WO Number │ Subject    │ PMRct Type │ Account      │        │
│ │ ──────────────────────────────────────────────── │        │
│ │ 00263272  │ AC Burtu   │ USC        │ SIMS JAYA   │        │
│ │           │ HD1114     │            │             │        │
│ │ 00264271  │ AC Hot     │ USC        │ SIMS JAYA   │        │
│ │           │ HD1114     │            │             │        │
│ │ 00048651  │ AC Hot     │ USC        │ SIMS JAYA   │        │
│ │           │ HD1114     │            │             │        │
│ │ 00685493  │ AC Hot     │ USC        │ SIMS JAYA   │        │
│ │           │ HD1114     │            │             │        │
│ │ 00087786  │ AC Hot     │ USC        │ SIMS JAYA   │        │
│ │           │ HD1114     │            │             │        │
│ │ 00147201  │ AC Panas   │ USC        │ SIMS JAYA   │        │
│ │           │ HD1114     │            │             │        │
│ │                                                     │        │
│ │ [View All Work Orders]                            │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 📋 Maintenance Plans (0)                    [New]  │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ No maintenance plans currently linked to this      │        │
│ │ asset                                              │        │
│ │                                                     │        │
│ │ [+ Create New Maintenance Plan]                    │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 📄 Maintenance Plan Items (6+)              [New]  │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ Maintenance Plan Item │ Plan Date │ Tasklist │ SMR │        │
│ │ ────────────────────────────────────────────────── │        │
│ │ MI-0231911           │ 25/08/2020│ RAPH0008  │ 49.7 │       │
│ │ MI-0231912           │ 10/09/2020│ RAPH0008  │ 50.0 │       │
│ │ MI-0231913           │ 03/10/2020│ RAPH0008  │ 50.2 │       │
│ │ MI-0231914           │ 20/10/2020│ RAPH0008  │ 50.5 │       │
│ │ MI-0231915           │ 29/11/2020│ RAPH0008  │ 50.7 │       │
│ │ MI-0231916           │ 20/12/2020│ RAPH0008  │ 51.0 │       │
│ │                                                     │        │
│ │ [View All Maintenance Plan Items]                  │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 🤝 Service Contract Assets (3+)             [New]  │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ Contract Asset │ Service Program Type │ Support   │        │
│ │ ────────────────────────────────────────────────── │        │
│ │ SA-0006175     │ Premium Support      │ Yes      │        │
│ │                │ Key: 330026962-...   │          │        │
│ │ SA-0006173     │ Extended Warranty    │ Yes      │        │
│ │                │ Key: 330026962-...   │          │        │
│ │ SA-0006159     │ Standard Support     │ No       │        │
│ │                │ Key: 330026962-...   │          │        │
│ │ SA-0001395     │ Premium Support      │ Yes      │        │
│ │                │ Key: 330013295-...   │          │        │
│ │ SA-0000906     │ Standard Support     │ No       │        │
│ │                │ Key: 330009971-...   │          │        │
│ │                                                     │        │
│ │ [View All Service Contracts]                       │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ ⚠️ Komtrax Faults (Last 30 Days) (0)        [New]  │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ No Komtrax faults recorded in the last 30 days   │        │
│ │                                                     │        │
│ │ [+ Record New Fault]                              │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────┐        │
│ │ 📜 Asset History (1)                               │        │
│ ├─────────────────────────────────────────────────────┤        │
│ │                                                     │        │
│ │ Date      │ Field      │ User        │ Change    │        │
│ │ ──────────────────────────────────────────────── │        │
│ │ 22/08/2025│ Work       │ UT          │ FM-SKJ →  │        │
│ │ 02:32     │ Center     │ Integration │ FD-SKJ   │        │
│ │                                                     │        │
│ │ [View All History]                                │        │
│ │                                                     │        │
│ └─────────────────────────────────────────────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 10. RIGHT PANEL - QUICK SUMMARY (Related Tab Context)

### 10.1 Right Panel Overview

```
┌─────────────────────────────────────┐
│ RELATED TAB - QUICK SUMMARY         │
├─────────────────────────────────────┤
│                                     │
│ Asset Information                   │
│ ┌─────────────────────────────────┐│
│ │ HD785-7 - 8076                  ││
│ │ Motor Grader                    ││
│ │ Serial: 8076                    ││
│ │ SMR: 6006I.0 hm                ││
│ │ Account: SIMS JAYA KALTIM       ││
│ │ Contact: BURHAN                 ││
│ └─────────────────────────────────┘│
│                                     │
│ Service Contracts (3+)              │
│ ┌─────────────────────────────────┐│
│ │ SA-0006175 - Premium            ││
│ │ SA-0006173 - Extended           ││
│ │ SA-0006159 - Standard           ││
│ │ SA-0001395 - Premium            ││
│ │ SA-0000906 - Standard           ││
│ │ [View All]                      ││
│ └─────────────────────────────────┘│
│                                     │
│ Related Cases (6+)                  │
│ ┌─────────────────────────────────┐│
│ │ 01553477 - BACKLOG              ││
│ │ 01467893 - Periodic Service     ││
│ │ 01553475 - Additional Package   ││
│ │ 01156148 - Hose Brake           ││
│ │ 01142385 - LOW POWER            ││
│ │ [View All]                      ││
│ └─────────────────────────────────┘│
│                                     │
│ Work Orders (6+)                    │
│ ┌─────────────────────────────────┐│
│ │ 00263272 - AC Burtu             ││
│ │ 00264271 - AC Hot               ││
│ │ 00048651 - AC Hot               ││
│ │ [View More]                     ││
│ └─────────────────────────────────┘│
│                                     │
│ Komtrax Faults (Last 30 Days)      │
│ ┌─────────────────────────────────┐│
│ │ No faults recorded              ││
│ │ [Record Fault]                  ││
│ └─────────────────────────────────┘│
│                                     │
│ Asset History (1)                   │
│ ┌─────────────────────────────────┐│
│ │ 22/08/2025 - Work Center        ││
│ │ FM-SKJ → FD-SKJ                 ││
│ │ [View All]                      ││
│ └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

---

## 11. INTERACTION & NAVIGATION PATTERNS

### 11.1 Related Tab Interactions

```
USER INTERACTIONS IN RELATED TAB:

1. CLICK ON CASE/WORK ORDER LINK
   ↓
   Opens record in new tab or modal

2. CLICK [VIEW ALL]
   ↓
   Shows full list with pagination
   Displays 20+ records per page
   With filters and sort options

3. CLICK [NEW] BUTTON
   ↓
   Opens form to create new related record
   Pre-fills asset/case/WO relationship

4. CLICK ON RECORD NAME (Linked)
   ↓
   Navigates to that record
   Maintains breadcrumb navigation

5. EXPAND/COLLAPSE SECTION
   ↓
   Shows/hides related records
   Saves state (remembers user preference)

6. SEARCH WITHIN SECTION
   ↓
   Filters records in that section
   Real-time search results
```

### 11.2 Navigation Breadcrumb

```
BREADCRUMB TRAIL:

Work Order #01275781 
  → Related Tab 
    → Cases (6+) 
      → Case 01553477 
        → Asset HD785-7 - 8076

Allows easy navigation between related records
and maintaining context of origin
```

---

## 12. DATA MODEL & RELATIONSHIPS

### 12.1 Entity Relationship Diagram

```
                    ┌─────────────────┐
                    │   WORK ORDER    │
                    │  #01275781      │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
            ┌────────┐  ┌────────┐  ┌────────┐
            │ CASES  │  │ ASSETS │  │ WORK   │
            │ (6+)   │  │ HD785-7│  │ ORDERS │
            └────────┘  └────────┘  │ (6+)   │
                             │      └────────┘
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
           ┌──────────┐ ┌──────────┐ ┌──────────────┐
           │MAIN PLANS│ │SERVICE   │ │KOMTRAX       │
           │(6+)      │ │CONTRACT  │ │FAULTS        │
           │          │ │ASSETS(5) │ │(Last 30 days)│
           └──────────┘ └──────────┘ └──────────────┘
                             │
                             ▼
                        ┌──────────┐
                        │ HISTORY  │
                        │ (1)      │
                        └──────────┘
```

### 12.2 Relationship Definitions

```
WORK ORDER ─related_to─ ASSET
├─ One Work Order can be linked to ONE Asset
├─ One Asset can have MANY Work Orders
└─ Relationship: 1:N (One-to-Many)

ASSET ─related_to─ CASE
├─ One Asset can have MANY Cases
├─ One Case references ONE Asset
└─ Relationship: 1:N (One-to-Many)

ASSET ─related_to─ MAINTENANCE PLAN
├─ One Asset can have MULTIPLE Maintenance Plans
├─ Each Plan Item is scheduled independently
└─ Relationship: 1:N (One-to-Many)

ASSET ─related_to─ SERVICE CONTRACT
├─ One Asset can have MULTIPLE Service Contracts
├─ Each Contract has different terms
└─ Relationship: M:N (Many-to-Many)

ASSET ─monitored_by─ KOMTRAX
├─ One Asset reports faults via Komtrax
├─ Faults tracked in last 30 days
└─ Relationship: 1:N (One-to-Many)
```

---

## 13. ACTION BUTTONS & FUNCTIONS

### 13.1 Available Actions per Section

```
CASES SECTION:
├─ [New] - Create new case linked to asset
├─ [View All] - Show all 6+ cases
├─ [Filter] - Filter by status, priority, date
└─ [Click on Case] - Open case record

WORK ORDERS SECTION:
├─ [New] - Create new work order
├─ [View All] - Show all 6+ work orders
├─ [Filter] - Filter by status, type
└─ [Click on WO] - Open work order record

MAINTENANCE PLANS SECTION:
├─ [New] - Create new maintenance plan
├─ [Create Plan Item] - Add item to existing plan
├─ [View All] - Show all plan items (6+)
└─ [Schedule Next] - Auto-schedule next maintenance

SERVICE CONTRACTS SECTION:
├─ [New] - Link new service contract
├─ [View All] - Show all contracts (5)
├─ [Renew] - Renew expiring contract
└─ [Modify Terms] - Edit contract details

KOMTRAX FAULTS SECTION:
├─ [Record Fault] - Log new fault from Komtrax
├─ [Create WO] - Create WO from fault
└─ [View Diagnostics] - View technical details

ASSET HISTORY SECTION:
├─ [View All] - Show complete history
├─ [Filter by Date] - Show changes in date range
└─ [Revert Change] - Undo previous change
```

---

## 14. RESPONSIVE BEHAVIOR

### 14.1 Related Tab on Different Screen Sizes

```
DESKTOP (1920px):
├─ Full table view with 5+ columns
├─ All sections expanded by default
├─ Pagination shows 10-20 records
└─ Side panel visible (25%)

TABLET (768px):
├─ Condensed table view
├─ Sections collapsed by default (expandable)
├─ Pagination shows 5 records
└─ Side panel hidden/drawer

MOBILE (480px):
├─ Card-based view (one record per card)
├─ Stacked layout
├─ Sections hidden (tap to expand)
└─ Side panel as slide-out drawer
```

---

## 15. METADATA & SYSTEM INFO

**System:** UT Service Console v2.2 (Enhanced)
**Tab Type:** Related Records Navigation Tab
**Related Objects Count:** 7 main categories
**Last Updated:** 26/05/2026 07:36
**Document Version:** Related Tab Design v1.0

---

## 16. SUMMARY OF RELATED OBJECTS

| Object | Count | Status | Primary Key |
|--------|-------|--------|-------------|
| **Asset** | 1 | Active | HD785-7 - 8076 |
| **Cases** | 6+ | Mixed | Case ID |
| **Work Orders** | 6+ | Mixed | WO Number |
| **Maintenance Plans** | 0 | Inactive | — |
| **Maintenance Plan Items** | 6+ | Scheduled | Plan Item ID |
| **Service Contract Assets** | 5 | Active | Contract Asset ID |
| **Komtrax Faults (30 days)** | 0 | Clean | — |
| **Asset History** | 1+ | Active | History Record ID |

---

*This document provides comprehensive documentation of the Related Tab in Work Order Management System, showing all linked objects, their relationships, data structure, and interaction patterns.*
