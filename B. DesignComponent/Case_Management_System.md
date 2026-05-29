# Case Management System - Enhanced Design

## Overview
Sistem manajemen kasus terintegrasi untuk tracking, monitoring, dan penyelesaian service requests dengan SLA management dan asset tracking.

---

## MOCKUP - USER INTERFACE LAYOUT

### Dashboard Layout - ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UT SERVICE CONSOLE - CASE MANAGEMENT                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [☰ Menu] [Search...........................] [🔔] [⚙] [?] [👤]  More [⋯]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CASE #01532785  [Medium Priority] [Closed]                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  Status Progress:                                                    │   │
│  │  ○─────○─────○─────○─────○                                          │   │
│  │  Open Assigned In Progress Resolved Closed                          │   │
│  │  ✓     ✓      ✓           ✓         ✓                              │   │
│  │                                                                        │   │
│  │  [Edit] [Change Owner] [Print View] [⋯]                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
├────────────────────────────────────────────┬───────────────────────────────┤
│ LEFT PANEL - WORK ORDER & ASSET             │ CENTER PANEL - DETAILS       │
├────────────────────────────────────────────┼───────────────────────────────┤
│                                             │                               │
│  📦 WORK ORDER                              │ Details  Feed  Related        │
│  ┌─────────────────────────────────┐       │ ────────────────────────     │
│  │ WO Number: 73028145             │       │                               │
│  │ Status:    Completed            │       │ 2A. CASE INFORMATION         │
│  │ Mechanic:  Budi Santoso (👤)   │       │ ┌───────────────────────┐   │
│  │                                 │       │ │ Case Owner: Sys User  │   │
│  └─────────────────────────────────┘       │ │ Status: Closed        │   │
│                                             │ │ Priority: Medium      │   │
│  🏭 ASSET DETAILS                           │ └───────────────────────┘   │
│  ┌─────────────────────────────────┐       │                               │
│  │ Asset Name: GD-829              │       │ 2B. DESCRIPTION INFO         │
│  │ Model: Komatsu D85ESS-2         │       │ ┌───────────────────────┐   │
│  │ HM (Hours Meter): 14,250 hrs    │       │ │ Subject:              │   │
│  │ Location: Site B - Pit 4        │       │ │ Hydraulic Leak on     │   │
│  │                                 │       │ │ Right Cylinder        │   │
│  └─────────────────────────────────┘       │ │                       │   │
│                                             │ │ Description:          │   │
│  👥 ACCOUNT                                 │ │ Operator reported ... │   │
│  ┌─────────────────────────────────┐       │ │                       │   │
│  │ Account: PUTRA PERKASA ABADI    │       │ │ [Edit] [Delete]       │   │
│  │ Contact: Andi Wijaya            │       │ └───────────────────────┘   │
│  │ Phone: +62-811-234-5678         │       │                               │
│  │ Email: andi@putraabadi.co.id    │       │                               │
│  └─────────────────────────────────┘       │                               │
│                                             │                               │
├────────────────────────────────────────────┴───────────────────────────────┤
│ RIGHT PANEL - QUICK INFO & HISTORY                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📊 Milestones SLA              [ℹ]                                          │
│  ┌──────────────────────────────────┐                                       │
│  │ ⏱ 17 Days Elapsed               │                                       │
│  │ 🎯 Target Met                   │                                       │
│  └──────────────────────────────────┘                                       │
│                                                                               │
│  📝 Case History                                                              │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ ✓ Status Changed to Closed                 System User       │           │
│  │   Oct 26, 2023 14:30                                         │           │
│  │                                                              │           │
│  │ ⊚ Work Order 73028145 Completed           Budi Santoso     │           │
│  │   Oct 24, 2023 13:15                                         │           │
│  │                                                              │           │
│  │ ◉ Case Assigned                            System User      │           │
│  │   Oct 07, 2023 09:30                                         │           │
│  │                                                              │           │
│  │ [View All]                                                   │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                               │
│  🔗 Related                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │ 🔴 Past Cases for this Asset (50)                            │           │
│  │    01555475 > Request    | HO785-7:BO76 | In Progress        │           │
│  │    01473917 > Engine Issue | Cooling | Closed                │           │
│  │    01465523 > Brake System | Brake Pads | Closed             │           │
│  │    [Show 50 Cases >]                                          │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### Service Details View - ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CASE #01532785 › SERVICE PRODUCTS & COMPLETION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COMPLETION & SLA TRACKING                                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  Completion OTIF                                                     │   │
│  │  ├─ Start Date OTF Mechanic  [26/05/2026, 07:31]   [✏️]            │   │
│  │  │  Target Date OTF Mechanic: 26/05/2026, 11:31    [✏️]            │   │
│  │  │                                                                    │   │
│  │  ├─ Start Date OTF Solution  [26/05/2026, 07:31]   [✏️]            │   │
│  │  │  Target Date OTF Solution: 02/06/2026, 07:31    [✏️]            │   │
│  │  │                                                                    │   │
│  │  ├─ Start Date SLA           [26/05/2026, 07:31]   [✏️]            │   │
│  │  │  Target Date SLA:          02/06/2026, 07:31    [✏️]            │   │
│  │  │                                                                    │   │
│  │  └─ Completion Status:                                              │   │
│  │     ✓ OTF Mechanic: Expired    | ✓ SLA Expired                     │   │
│  │     ☐ OTF Solution: (pending)  | ☐ Over SLA                        │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  BACKDATE INFORMATION                                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  ├─ OTIF Start              [26/05/2026, 07:31]   [✏️]             │   │
│  │  ├─ Mechanic Start(Backdate)[26/05/2026, 07:31]   [✏️] ☑ Manual   │   │
│  │  ├─ Solution Start(Backdate)[26/05/2026, 07:31]   [✏️] ☐ Pending  │   │
│  │  ├─ Job Complete(Backdate) [26/05/2026, 15:30]   [✏️] ☐ Pending  │   │
│  │  │                                                                    │   │
│  │  └─ Reason: Backdate Justification                [✏️]             │   │
│  │     Manual Backdate, Initial dispatch delayed                       │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  OTIF STATUS                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  OTIF Mechanic Status        [✓ Expired]          [✏️]             │   │
│  │  NOT OTIF Mechanic Status    [NOT OTF]             [✏️]             │   │
│  │  Non OTIF Mechanic Reason    [Exceeded time]       [✏️]             │   │
│  │                                                                        │   │
│  │  OTIF Solution Status        [☐ Not Yet]           [✏️]             │   │
│  │  NOT OTIF Solution Status    [☐ Not Yet]           [✏️]             │   │
│  │  Non OTIF Solution Reason    [☐ Not Yet]           [✏️]             │   │
│  │                                                                        │   │
│  │  Over SLA                    [☑ YES]                [✏️]             │   │
│  │  Reason Backdate             [Multiple causes]      [✏️]             │   │
│  │  Reason for Others           [Weather + Holidays]   [✏️]             │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  SERVICE PRODUCTS (2)                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                        │   │
│  │  🔧 TRS STEERING & BRAKE SYSTEM NOTES                               │   │
│  │     Service Product ID: 0010                                         │   │
│  │     Description: Brake system inspection & adjustment               │   │
│  │     [➕ Add]                                                         │   │
│  │                                                                        │   │
│  │  🔧 TRS HYDRAULIK SYSTEM NOTES                                      │   │
│  │     Service Product ID: 0020                                         │   │
│  │     Description: Hydraulic system repair & replacement              │   │
│  │     [➕ Add]                                                         │   │
│  │                                                                        │   │
│  │  [View All]                                                          │   │
│  │                                                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Asset & Troubleshooting View - ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CASE #01532785 › ASSET DETAILS & TROUBLESHOOTING                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ASSET DETAILS                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Plant Code: [BKJ        ]                                          │    │
│  │                                                                      │    │
│  │  Asset 1 - GD-829                                                   │    │
│  │  ├─ Model:           Komatsu D85ESS-2                              │    │
│  │  ├─ Type:            Excavator                                      │    │
│  │  ├─ Hours Meter:     14,250 hrs                                    │    │
│  │  ├─ Status:          Operational                                    │    │
│  │  ├─ Location:        Site B - Pit 4                                │    │
│  │  ├─ Engine:          SAA6D107E (179 kW)                            │    │
│  │  ├─ Capacity:        4.6 m³                                        │    │
│  │  ├─ Last Service:    26/05/2026                                    │    │
│  │  └─ Next Service:    26/06/2026 (31 days)                         │    │
│  │                                                                      │    │
│  │  Asset 2 - GD-830                          Asset 3 - GD-831         │    │
│  │  ├─ Model: Komatsu PC200-8          ├─ Model: Komatsu WA200-6     │    │
│  │  ├─ Type: Excavator                 ├─ Type: Wheel Loader         │    │
│  │  ├─ Hours: 12,500 hrs               ├─ Hours: 16,750 hrs          │    │
│  │  └─ Status: Maintenance Required    └─ Status: Operational        │    │
│  │                                                                      │    │
│  │  Asset 4 - GD-832                                                   │    │
│  │  ├─ Model: Komatsu D65EX-12                                        │    │
│  │  ├─ Type: Dozer                                                     │    │
│  │  ├─ Hours: 11,200 hrs                                              │    │
│  │  └─ Status: Repair In Progress                                     │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  TROUBLE CASE                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Problem Type:     Hydraulic System Failure                        │    │
│  │  Severity:         🔴 HIGH                                          │    │
│  │  Impact Level:     CRITICAL - Production Stopped                  │    │
│  │  Troubleshooting:  ✓ Diagnostic + Replacement                     │    │
│  │                                                                      │    │
│  │  Detailed Description:                                             │    │
│  │  ┌───────────────────────────────────────────────────────┐        │    │
│  │  │ Operator reported significant hydraulic fluid leak    │        │    │
│  │  │ near the right cylinder during morning inspection.    │        │    │
│  │  │ Machine grounded pending repair. Suspect blown seal   │        │    │
│  │  │ or damaged hose fitting. Requires immediate          │        │    │
│  │  │ inspection and replacement parts. Equipment is       │        │    │
│  │  │ critical for daily operations.                       │        │    │
│  │  └───────────────────────────────────────────────────────┘        │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  TROUBLESHOOTING STEPS                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  ┌─ Step 1: VISUAL INSPECTION                                      │    │
│  │  │  □ Locate exact leak source                                     │    │
│  │  │  □ Check hose connections                                       │    │
│  │  │  □ Inspect seal condition                                       │    │
│  │  │                                                                  │    │
│  │  ├─ Step 2: PRESSURE TEST                                          │    │
│  │  │  □ System pressure test: 280 bar                                │    │
│  │  │  □ Relief valve setting: 290 bar                                │    │
│  │  │  □ Leak rate measurement                                        │    │
│  │  │                                                                  │    │
│  │  ├─ Step 3: COMPONENT ANALYSIS                                     │    │
│  │  │  □ Right Cylinder Seal Kit (PART-HYD-001)                      │    │
│  │  │  □ Hose Assembly (PART-HYD-002)                                │    │
│  │  │  □ Fitting Connectors (PART-HYD-003)                           │    │
│  │  │                                                                  │    │
│  │  └─ Step 4: REMEDIATION                                            │    │
│  │     □ Replace damaged components                                   │    │
│  │     □ Refill hydraulic fluid (ISO VG 46)                           │    │
│  │     □ System flush and bleed                                       │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Communication & Timeline View - ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CASE #01532785 › COMMUNICATION TIMELINE & HISTORY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TIMELINE FLOW                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  26/05/2026 ─────────────────────────────────────────────────────  │    │
│  │  │                                                                   │    │
│  │  ├─ 07:31 ◆ CASE CREATED                                           │    │
│  │  │         System User - Case #01532785 opened                     │    │
│  │  │                                                                   │    │
│  │  ├─ 07:45 ◆ CASE ASSIGNED                                          │    │
│  │  │         Budi Santoso assigned as Mechanic (Tier 2)             │    │
│  │  │                                                                   │    │
│  │  ├─ 08:00 ◆ PHONE CALL - INITIAL ASSESSMENT                       │    │
│  │  │         Andi Wijaya ↔ Budi Santoso                             │    │
│  │  │         Discussed problem details & site location              │    │
│  │  │                                                                   │    │
│  │  ├─ 08:15 ◆ WORK STARTED                                           │    │
│  │  │         Budi Santoso - Field diagnostic initiated              │    │
│  │  │                                                                   │    │
│  │  ├─ 08:30 ◆ INSPECTION REPORT                                      │    │
│  │  │         "Confirmed right cylinder seal failure and hose damage  │    │
│  │  │          Parts ordered from supplier."                          │    │
│  │  │                                                                   │    │
│  │  ├─ 09:30 ◆ EMAIL - PARTS AVAILABILITY CHECK                      │    │
│  │  │         Andi Wijaya → Service Manager                          │    │
│  │  │         Requested expedited parts delivery                     │    │
│  │  │                                                                   │    │
│  │  27/05/2026 ─────────────────────────────────────────────────────  │    │
│  │  │                                                                   │    │
│  │  ├─ 09:00 ◆ PARTS ARRIVED                                          │    │
│  │  │         Quality check completed - All parts in good condition  │    │
│  │  │                                                                   │    │
│  │  ├─ 09:15 ◆ UPDATE NOTE                                            │    │
│  │  │         "Parts received. Beginning replacement procedure.       │    │
│  │  │          Estimated completion: 28/05/2026."                    │    │
│  │  │                                                                   │    │
│  │  ├─ 14:00 ◆ PHONE UPDATE                                           │    │
│  │  │         Budi Santoso → Andi Wijaya                             │    │
│  │  │         Repair progress update - 60% complete                  │    │
│  │  │                                                                   │    │
│  │  28/05/2026 ─────────────────────────────────────────────────────  │    │
│  │  │                                                                   │    │
│  │  ├─ 09:00 ◆ WORK CONTINUES                                         │    │
│  │  │         Replacement procedure in progress                      │    │
│  │  │                                                                   │    │
│  │  ├─ 16:45 ◆ COMPLETION NOTE                                        │    │
│  │  │         "All repairs completed. System pressure tested          │    │
│  │  │          successfully at 280 bar. Quality check passed."        │    │
│  │  │                                                                   │    │
│  │  26/10/2026 ─────────────────────────────────────────────────────  │    │
│  │  │                                                                   │    │
│  │  ├─ 13:00 ◆ FINAL PHONE CALL                                       │    │
│  │  │         Andi Wijaya → Account Manager                          │    │
│  │  │         Completion confirmation & delivery details             │    │
│  │  │                                                                   │    │
│  │  ├─ 14:00 ◆ CUSTOMER SIGN-OFF                                      │    │
│  │  │         "Equipment returned to service. No issues reported      │    │
│  │  │          during test run. ✓ SATISFIED"                         │    │
│  │  │                                                                   │    │
│  │  └─ 14:30 ◆ CASE CLOSED                                            │    │
│  │          System User - SLA review completed, Case closed          │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  COMMUNICATION SUMMARY                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Total Communications:  4                                           │    │
│  │  ├─ Phone Calls:        3    (08:00, 14:00, 13:00)                 │    │
│  │  ├─ Emails:             1    (09:30)                                │    │
│  │  ├─ Notes/Updates:      3    (08:30, 09:15, 16:45)                 │    │
│  │  └─ Participants:       4    (Andi, Budi, Service Mgr, Acct Mgr)  │    │
│  │                                                                      │    │
│  │  Response Time:                                                     │    │
│  │  ├─ First Response:     0.5 hours (Target: 4 hours) ✓             │    │
│  │  ├─ Parts Delivery:     1 day     (Target: 2 days) ✓              │    │
│  │  └─ Completion:         2 days    (Target: 5 days) ✓              │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### SLA & Metrics Dashboard - ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CASE #01532785 › SLA PERFORMANCE & ANALYTICS DASHBOARD                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  SLA STATUS INDICATOR                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  ┌────────────────────────────────────────────────────────────┐   │    │
│  │  │  Overall SLA Status: ⚠️  OVER SLA - BREACHED              │   │    │
│  │  │                                                             │   │    │
│  │  │  ├─ OTF Mechanic:      ❌ FAILED    (+6.0 days)           │   │    │
│  │  │  ├─ OTF Solution:      ⏳ PENDING   (Monitoring)           │   │    │
│  │  │  └─ Over SLA:          ⚠️  YES      (17 days elapsed)     │   │    │
│  │  │                                                             │   │    │
│  │  │  SLA Compliance Score: 0%  [██░░░░░░░░░░░░░░░░]          │   │    │
│  │  │                                                             │   │    │
│  │  └────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │  SLA Timeline Detail:                                               │    │
│  │  ┌────────────────────────────────────────────────────────────┐   │    │
│  │  │                                                             │   │    │
│  │  │  Target  Mechanic: 26/05/2026 11:31                        │   │    │
│  │  │  ───────────────────────────────────────────────           │   │    │
│  │  │  26/05   [████████████████████░░░░░] 100%                 │   │    │
│  │  │  27/05   [████░░░░░░░░░░░░░░░░░░░░░░░░]   25% (Extended) │   │    │
│  │  │                                                             │   │    │
│  │  │  Target  Solution: 02/06/2026 07:31                        │   │    │
│  │  │  ───────────────────────────────────────────────           │   │    │
│  │  │  26/05   [████████████░░░░░░░░░░░░░░░░░░] 40%             │   │    │
│  │  │  27/05   [██████████████████████░░░░░░░░░] 70%             │   │    │
│  │  │  02/06   [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  0% (Breached)│   │    │
│  │  │                                                             │   │    │
│  │  └────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  PERFORMANCE METRICS                                                          │
│  ┌──────────────────────────────────────────┬──────────────────────────┐    │
│  │ Metric                                   │ Target    Actual  Status  │    │
│  ├──────────────────────────────────────────┼──────────────────────────┤    │
│  │ First Response Time                      │ 4 hrs     0.5 hrs  ✓ OK  │    │
│  │ Resolution Time                          │ 5 days    153 days ✗ BAD │    │
│  │ Customer Satisfaction                    │ 4.5/5.0   3.5/5.0  ✗ BAD │    │
│  │ SLA Compliance                           │ 95%       0%       ✗ BAD │    │
│  │ Parts Delivery Time                      │ 2 days    1 day    ✓ OK  │    │
│  │ Quality Check Pass Rate                  │ 98%       100%     ✓ OK  │    │
│  └──────────────────────────────────────────┴──────────────────────────┘    │
│                                                                               │
│  ROOT CAUSE ANALYSIS                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Factor                    │ Impact      │ Severity │ Resolution    │    │
│  │  ──────────────────────────┼─────────────┼──────────┼───────────── │    │
│  │  Parts Availability        │ 5-7 days    │ 🔴 High  │ Improve      │    │
│  │  Technician Scheduling     │ 2-3 days    │ 🔴 High  │ Add Staff    │    │
│  │  Weather/External Factors  │ 1-2 days    │ 🟡 Med   │ Plan Ahead   │    │
│  │  Documentation/Procedures  │ 0.5-1 day   │ 🟢 Low   │ Update SOP   │    │
│  │                                                                      │    │
│  │  Key Finding: Delay caused by combination of parts shortage and     │    │
│  │  technician unavailability. Recommend dual-sourcing strategy.      │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  ESCALATION ALERT HISTORY                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  🔔 26/05/2026 11:31  → Escalated to Level 2 (Service Manager)     │    │
│  │     Reason: SLA Mechanic breached                                   │    │
│  │                                                                      │    │
│  │  🔔 02/06/2026 07:31  → Escalated to Level 3 (Operations Director) │    │
│  │     Reason: SLA Solution breached                                   │    │
│  │                                                                      │    │
│  │  🔔 03/06/2026 00:00  → Daily overdue report sent to Account Mgr   │    │
│  │     Reason: Case unresolved after 7 days                           │    │
│  │                                                                      │    │
│  │  ⚠️  ALERT: Consider escalation to Level 4 (Executive)             │    │
│  │     if unresolved by 06/06/2026                                    │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Multi-Asset Comparison View - ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CASE #01532785 › ASSET FLEET COMPARISON                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ASSET HEALTH DASHBOARD                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  GD-829 (Komatsu D85ESS-2)        GD-830 (Komatsu PC200-8)         │    │
│  │  ┌──────────────────────────┐     ┌──────────────────────────┐     │    │
│  │  │ Status: ✓ Operational    │     │ Status: ⚠️  Maintenance │     │    │
│  │  │ Hours: 14,250 hrs        │     │ Hours: 12,500 hrs       │     │    │
│  │  │ Health: ████████░░░░░░░░ 80%  │ Health: ██████░░░░░░░░░ 60%  │    │
│  │  │ Load: ███████░░░░░░░░░░░ 70%   │ Load: █████░░░░░░░░░░░░ 50%   │    │
│  │  │ Fuel: ██████████░░░░░░░░ 85%   │ Fuel: ████████░░░░░░░░░ 70%   │    │
│  │  │ Location: Site B-Pit 4   │     │ Location: Site B-Pit 4  │     │    │
│  │  │ Service: 31 days away    │     │ Service: 24 days away   │     │    │
│  │  └──────────────────────────┘     └──────────────────────────┘     │    │
│  │                                                                      │    │
│  │  GD-831 (Komatsu WA200-6)        GD-832 (Komatsu D65EX-12)         │    │
│  │  ┌──────────────────────────┐     ┌──────────────────────────┐     │    │
│  │  │ Status: ✓ Operational    │     │ Status: 🔧 In Repair    │     │    │
│  │  │ Hours: 16,750 hrs        │     │ Hours: 11,200 hrs       │     │    │
│  │  │ Health: █████░░░░░░░░░░░ 50%  │ Health: ███░░░░░░░░░░░░ 30%   │    │
│  │  │ Load: ████░░░░░░░░░░░░░░ 40%   │ Load: ██░░░░░░░░░░░░░░░ 20%   │    │
│  │  │ Fuel: ███████░░░░░░░░░░░ 70%   │ Fuel: █░░░░░░░░░░░░░░░░ 10%   │    │
│  │  │ Location: Site C-Pit 2   │     │ Location: Maintenance   │     │    │
│  │  │ Service: 59 days away    │     │ Service: 20 days away   │     │    │
│  │  └──────────────────────────┘     └──────────────────────────┘     │    │
│  │                                                                      │    │
│  │  CRITICAL ASSETS - PRIORITY ORDER                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐  │    │
│  │  │ 🔴 GD-832  │ Repair in Progress    │ 20 days to service    │  │    │
│  │  │ 🟡 GD-831  │ High Hours (16,750)   │ 59 days to service    │  │    │
│  │  │ 🟡 GD-830  │ Maintenance Required  │ 24 days to service    │  │    │
│  │  │ 🟢 GD-829  │ Operational           │ 31 days to service    │  │    │
│  │  └─────────────────────────────────────────────────────────────┘  │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  MAINTENANCE SCHEDULE GANTT CHART                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  May 2026              June 2026              July 2026              │    │
│  │  ├─────────────┤├─────────────────┤├──────────────┤                │    │
│  │                                                                      │    │
│  │  GD-829  ─────●═════════════════════════════●───────             │    │
│  │              26/05            Service Due 26/06                   │    │
│  │                                                                      │    │
│  │  GD-830  ─────●═════════════════●───────────────                 │    │
│  │              20/05     Due 19/06                                  │    │
│  │                                                                      │    │
│  │  GD-831  ─────┼──────────────────┼──────●═════════════●──         │    │
│  │                                        24/05     Due 24/07         │    │
│  │                                                                      │    │
│  │  GD-832  ─────●═════════════════●───────────────                 │    │
│  │              15/05     Due 15/06                                  │    │
│  │                                                                      │    │
│  │  Legend:  ● = Last Service  ═ = Service Window  ○ = Overdue      │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.1 Case Identification
| Field | Value | Status |
|-------|-------|--------|
| **Case Number** | 01532785 | Active |
| **Case Type** | Service Request | Medium Priority |
| **Status** | Closed | Oct 26, 2023 |
| **Priority Level** | Medium Priority | Target Met |

### 1.2 Case Status Timeline
```
Open → Assigned → In Progress → Resolved → Closed
 ✓       ✓          ✓            ✓         ✓
```

---

## 2. CASE OWNER & CONTACT INFORMATION

### 2.1 Case Ownership
| Attribute | Details |
|-----------|---------|
| **Case Owner** | System User |
| **Assigned To** | Budi Santoso |
| **Mechanic** | Authorized Service Center |
| **Support Level** | Tier 2 - Technical Support |

### 2.2 Account Details
| Field | Information |
|-------|-------------|
| **Account Name** | PUTRA PERKASA ABADI |
| **Account Type** | Corporate Customer |
| **Account Status** | Active |
| **Contact Person** | Andi Wijaya |
| **Phone** | +62-811-234-5678 |
| **Email** | andi.wijaya@putraabadi.co.id |

### 2.3 Escalation Contact
| Level | Name | Phone | Email |
|-------|------|-------|-------|
| **Primary** | Andi Wijaya | +62-811-234-5678 | andi@putraabadi.co.id |
| **Secondary** | Supervisor | +62-811-234-5679 | supervisor@putraabadi.co.id |
| **Tertiary** | Account Manager | +62-811-234-5680 | acct@putraabadi.co.id |

---

## 3. ASSET DETAILS (EXPANDED - 3+ ROWS)

### 3.1 Equipment Information
| Asset ID | Model | Type | Hours Meter | Condition |
|----------|-------|------|------------|-----------|
| **GD-829** | Komatsu D85ESS-2 | Excavator | 14,250 hrs | Operational |
| **GD-830** | Komatsu PC200-8 | Excavator | 12,500 hrs | Maintenance Required |
| **GD-831** | Komatsu WA200-6 | Wheel Loader | 16,750 hrs | Operational |
| **GD-832** | Komatsu D65EX-12 | Dozer | 11,200 hrs | Repair In Progress |

### 3.2 Asset Location & Site Information
| Asset | Location | Site | Site Manager | Last Service |
|-------|----------|------|--------------|--------------|
| GD-829 | Warehouse Main | Site B - Pit 4 | Hendra Kusuma | 26/05/2026 |
| GD-830 | Field A | Site B - Pit 4 | Hendra Kusuma | 20/05/2026 |
| GD-831 | Field B | Site C - Pit 2 | Bambang Wijaya | 24/05/2026 |
| GD-832 | Maintenance Bay | Site B - Pit 4 | Hendra Kusuma | 15/05/2026 |

### 3.3 Technical Specifications
| Asset | Engine | Power | Capacity | Max Depth |
|-------|--------|-------|----------|-----------|
| GD-829 | SAA6D107E | 179 kW | 4.6 m³ | 6.2 m |
| GD-830 | SAA6D102E | 125 kW | 1.0 m³ | 7.1 m |
| GD-831 | SAA6D107E | 155 kW | 3.0 m³ | N/A |
| GD-832 | SAA6D95 | 110 kW | 3.5 m³ | 5.8 m |

### 3.4 Maintenance History
| Asset | Last Service Date | Next Service Due | Service Type | Days Until Due |
|-------|------------------|------------------|--------------|----------------|
| GD-829 | 26/05/2026 | 26/06/2026 | 500-Hour Service | 31 |
| GD-830 | 20/05/2026 | 19/06/2026 | 250-Hour Service | 24 |
| GD-831 | 24/05/2026 | 24/07/2026 | Major Service | 59 |
| GD-832 | 15/05/2026 | 15/06/2026 | Minor Service | 20 |

---

## 4. ISSUE DESCRIPTION & TROUBLESHOOTING

### 4.1 Problem Statement
**Subject:** Hydraulic Leak on Right Cylinder

**Plant:** BKJ (Batu Kapur Jaya)

**Description:**
```
Operator reported significant hydraulic fluid leak near the right cylinder 
during morning inspection. Machine grounded pending repair. Suspect blown 
seal or damaged hose fitting. Requires immediate inspection and replacement 
parts. Equipment is critical for daily operations.
```

### 4.2 Problem Classification
| Category | Value |
|----------|-------|
| **Fault Type** | Hydraulic System Failure |
| **Severity** | High |
| **Impact Level** | Critical - Production Stopped |
| **Root Cause** | Mechanical Failure |
| **Troubleshooting** | Diagnostic + Replacement |

### 4.3 Detailed Troubleshooting Steps
1. **Visual Inspection**
   - Locate exact leak source
   - Check hose connections
   - Inspect seal condition

2. **Pressure Test**
   - System pressure: 280 bar
   - Relief valve setting: 290 bar
   - Leak rate measurement

3. **Component Analysis**
   - Right Cylinder Seal Kit: PART-HYD-001
   - Hose Assembly: PART-HYD-002
   - Fitting Connectors: PART-HYD-003

4. **Remediation**
   - Replace damaged components
   - Refill hydraulic fluid (ISO VG 46)
   - System flush and bleed

---

## 5. COMPLETION & SLA MANAGEMENT

### 5.1 Service Level Agreement (SLA)
| SLA Metric | Start Date | Target Date | Status | Days Elapsed |
|------------|------------|-------------|--------|--------------|
| **OTF Mechanic** | 26/05/2026 07:31 | 26/05/2026 11:31 | ✓ Expired | 17 |
| **OTF Solution** | 26/05/2026 07:31 | 02/06/2026 07:31 | ✓ Expired | 17 |
| **SLA** | 26/05/2026 07:31 | 02/06/2026 07:31 | ⚠ Over SLA | 17 |

### 5.2 Completion Status
| Milestone | Target Date | Mechanic Status | Solution Status | SLA Status |
|-----------|-------------|-----------------|-----------------|------------|
| **OTF Mechanic** | 26/05/2026 11:31 | ✓ Expired | — | Breached |
| **OTF Solution** | 02/06/2026 07:31 | ✓ Expired | ☐ Not Yet | Breached |
| **Overall SLA** | 02/06/2026 07:31 | ✓ Expired | ☐ Not Yet | **OVER SLA** |

### 5.3 Completion Dates Tracking
| Task | Start Date | Start Time | Actual Date | Actual Time | Status |
|------|------------|-----------|-------------|------------|--------|
| Case Created | 26/05/2026 | 07:31 | 26/05/2026 | 07:31 | ✓ |
| Assigned | — | — | 26/05/2026 | 07:45 | ✓ |
| Work Started | 26/05/2026 | 07:31 | 26/05/2026 | 08:15 | ✓ |
| Completed | — | — | 26/10/2026 | 14:30 | ✓ |

---

## 6. BACKDATE INFORMATION

### 6.1 Backdate Details
| Field | Value | Approval Status |
|-------|-------|-----------------|
| **OTF Start Date** | 26/05/2026 07:31 | Approved |
| **Mechanic Start (Backdate)** | 26/05/2026 07:31 | ✓ Manual |
| **Solution Start (Backdate)** | 26/05/2026 07:31 | ☐ Pending |
| **Job Complete (Backdate)** | 26/05/2026 15:30 | ☐ Pending |

### 6.2 Backdate Justification
| Reason | Details | Approver |
|--------|---------|----------|
| **Manual Backdate** | Initial dispatch delayed | System Admin |
| **Backdate OTF Mechanic** | Field technician unavailable | Service Manager |
| **Backdate OTF Solution** | Parts procurement delay | Operations Lead |
| **Reason for Others** | Plant holidays and weather | Plant Manager |

---

## 7. OTIF STATUS (On-Time, In-Full)

### 7.1 OTIF Tracking
| Metric | Mechanic | Solution | Status |
|--------|----------|----------|--------|
| **OTF Mechanic Status** | Not OTF | — | ✗ FAILED |
| **NOT OTF Mechanic Status** | NOT OTF | — | ✗ FAILED |
| **Non-OTF Mechanic Reason** | Exceeded time | — | Resource |

### 7.2 Non-OTF Analysis
| Category | Details | Impact |
|----------|---------|--------|
| **Delay Reason** | Parts shortage + technician availability | 4.5 hours |
| **Escalation Required** | Yes | Customer notification sent |
| **Penalty/Credit** | Service credit 15% | Applied to invoice |
| **Root Cause** | Supply chain issue | Process improvement needed |

---

## 8. SERVICE PRODUCTS & COMPONENTS

### 8.1 Service Products Used
| Service Product | Item Number | Description | Quantity | Cost |
|-----------------|------------|-------------|----------|------|
| **TRS STEERING & BRAKE SYSTEM NOTES** | 0010 | Brake system inspection & adjustment | 1 | Rp 2,500,000 |
| **TRS HYDRAULIK SYSTEM NOTES** | 0020 | Hydraulic system repair & replacement | 1 | Rp 5,750,000 |
| **TRS ENGINE OVERHAUL** | 0030 | Engine diagnostic & tuning | — | — |
| **TRS TRANSMISSION SERVICE** | 0040 | Transmission fluid & filter change | — | — |

### 8.2 Parts & Materials
| Part Number | Description | Unit | Qty | Unit Price | Total |
|-------------|-------------|------|-----|-----------|-------|
| PART-HYD-001 | Hydraulic Seal Kit | Set | 2 | Rp 850,000 | Rp 1,700,000 |
| PART-HYD-002 | Hose Assembly (Right) | Pcs | 1 | Rp 2,200,000 | Rp 2,200,000 |
| PART-HYD-003 | Fitting Connectors | Set | 3 | Rp 450,000 | Rp 1,350,000 |
| FLUID-ISO46 | Hydraulic Fluid ISO VG46 | Litre | 50 | Rp 85,000 | Rp 4,250,000 |
| **SUBTOTAL** | — | — | — | — | **Rp 9,700,000** |

---

## 9. CASE HISTORY & TIMELINE

### 9.1 Activity Log
| Date | Time | User | Activity | Field Changed | From | To |
|------|------|------|----------|---------------|------|-----|
| 26/05/2026 | 07:31 | System User | Case Created | Status | — | Open |
| 26/05/2026 | 07:31 | UT Integration | SAP Basic Start | Status | Open | Assigned |
| 26/05/2026 | 07:45 | UT Integration | Case Assigned | Assigned To | — | Budi Santoso |
| 26/05/2026 | 08:15 | Budi Santoso | Work Started | Status | Assigned | In Progress |
| 26/05/2026 | 15:30 | Budi Santoso | Inspection Done | Progress | 30% | 60% |
| 27/05/2026 | 09:00 | Budi Santoso | Parts Arrived | Progress | 60% | 80% |
| 26/10/2026 | 14:30 | System User | Case Closed | Status | In Progress | Closed |

### 9.2 Status Changes Detail
| Change # | From | To | Changed By | Changed At | Reason | Notes |
|----------|------|-----|-----------|-----------|--------|-------|
| 1 | — | Open | System User | 26/05/2026 07:31 | Auto-created | Initial case creation |
| 2 | Open | Assigned | UT Integration | 26/05/2026 07:31 | Assignment | Case routed to Tier 2 |
| 3 | Assigned | In Progress | Budi Santoso | 26/05/2026 08:15 | Acknowledgment | Work order started |
| 4 | In Progress | Resolved | Budi Santoso | 26/10/2026 14:15 | Completion | All repairs completed |
| 5 | Resolved | Closed | System User | 26/10/2026 14:30 | Auto-close | SLA review completed |

---

## 10. MESSAGING SESSIONS & COMMUNICATIONS

### 10.1 Communication Log
| Session ID | Participants | Channel | Date | Time | Topic | Status |
|------------|--------------|---------|------|------|-------|--------|
| MSG-001 | Andi Wijaya, Budi Santoso | Phone | 26/05/2026 | 08:00 | Initial Problem Assessment | Completed |
| MSG-002 | Andi Wijaya, Service Manager | Email | 26/05/2026 | 09:30 | Parts Availability Check | Completed |
| MSG-003 | Budi Santoso, Andi Wijaya | Phone | 27/05/2026 | 14:00 | Repair Update | Completed |
| MSG-004 | Andi Wijaya, Account Mgr | Phone | 26/10/2026 | 13:00 | Completion Confirmation | Completed |

### 10.2 Notes & Comments
- **26/05/2026 08:30** (Budi Santoso): "Inspection completed. Confirmed right cylinder seal failure and hose damage. Parts ordered from supplier."
- **27/05/2026 09:15** (Budi Santoso): "Parts received. Beginning replacement procedure. Estimated completion: 28/05/2026."
- **28/05/2026 16:45** (Budi Santoso): "All repairs completed. System pressure tested successfully at 280 bar. Quality check passed."
- **26/10/2026 14:00** (Andi Wijaya): "Equipment returned to service. No issues reported during test run."

---

## 11. RELATED CASES & LINKED RECORDS

### 11.1 Past Cases for this Asset
| Case # | Request | Asset | Status | Date | Priority | Resolution |
|--------|---------|-------|--------|------|----------|------------|
| 01555475 | Hydraulic Leak | HO785-7:BO76 | In Progress | 25/05/2026 | High | Pending |
| 01473917 | Engine Overheating | Cooling System | Closed | 20/05/2026 | Medium | Fixed |
| 01465523 | Brake System Issue | Brake Pads | Closed | 18/05/2026 | Low | Replaced |
| 01451289 | Transmission Slip | Transmission | Closed | 15/05/2026 | High | Serviced |

### 11.2 Linked Cases
| Link Type | Related Case # | Asset | Status | Days Active |
|-----------|----------------|-------|--------|-------------|
| **Duplicate Of** | 01532784 | Same Equipment | Merged | — |
| **Related To** | 01465523 | Brake System | Closed | 8 |
| **Caused By** | 01451289 | Transmission | Closed | 25 |
| **Follows** | 01533500 | Preventive Service | Closed | — |

### 11.3 Sub-Cases & Child Requests
| Sub-Case # | Type | Status | Priority | Assigned To | Days |
|-----------|------|--------|----------|------------|------|
| 01532785-01 | Diagnostic | Closed | High | Budi Santoso | 1 |
| 01532785-02 | Parts Order | Closed | High | Procurement | 1 |
| 01532785-03 | Repair Work | Closed | High | Budi Santoso | 4 |
| 01532785-04 | Quality Check | Closed | Medium | QA Team | 142 |

---

## 12. NOTIFICATIONS & ALERTS

### 12.1 Active Alerts
| Alert Type | Severity | Message | Triggered | Status |
|------------|----------|---------|-----------|--------|
| **SLA Breach** | High | OTF Mechanic SLA exceeded by 6+ days | 02/06/2026 | Acknowledged |
| **Overdue** | Medium | Case still open after 17 days | 03/06/2026 | Escalated |
| **Parts Delay** | Medium | Parts delivery exceeded ETA | 27/05/2026 | Resolved |

### 12.2 Escalation Notifications
- **26/05/2026 11:31** - SLA Mechanic alert to Service Manager
- **02/06/2026 07:31** - SLA Solution alert to Operations Lead
- **03/06/2026 00:00** - Daily overdue report to Account Manager
- **26/10/2026 14:30** - Case closure notification to Customer

---

## 13. METRICS & ANALYTICS

### 13.1 Performance Metrics
| Metric | Target | Actual | Status | Variance |
|--------|--------|--------|--------|----------|
| **First Response Time** | 4 hours | 0.5 hours | ✓ | -3.5 hrs |
| **Resolution Time** | 5 days | 153 days | ✗ | +148 days |
| **Customer Satisfaction** | 4.5/5 | 3.5/5 | ✗ | -1.0 pts |
| **SLA Compliance** | 95% | 0% | ✗ | -95% |

### 13.2 Root Cause Analysis
| Factor | Impact | Severity | Resolution |
|--------|--------|----------|------------|
| **Parts Availability** | 5-7 day delay | High | Improve supplier network |
| **Technician Scheduling** | 2-3 day delay | High | Increase staffing |
| **Weather/External** | 1-2 day delay | Medium | Better contingency planning |
| **Documentation** | Process delay | Low | Update procedures |

---

## 14. SERVICE LEVEL & ESCALATION

### 14.1 Current Escalation Status
```
Level 1: Field Technician ✓ RESOLVED
   └─ Assigned to: Budi Santoso
   └─ Contact: Direct phone
   └─ Response time: 30 minutes

Level 2: Service Manager ⚠ IN PROGRESS (Monitoring)
   └─ Assigned to: Service Manager
   └─ Contact: Email/Phone
   └─ Response time: 2 hours

Level 3: Operations Director (Standby)
   └─ Condition: If unresolved by Level 2
   └─ Response time: 4 hours

Level 4: Executive Escalation (Standby)
   └─ Condition: If unresolved after 10 days
   └─ Response time: 1 hour
```

### 14.2 Escalation Triggers
- ⚠ **SLA Breach Detected** → Auto-escalate to Level 2
- ⚠ **Customer Complaint** → Auto-escalate to Level 3
- ⚠ **Unresolved after 10 days** → Auto-escalate to Level 4
- ⚠ **Critical Equipment** → Auto-escalate to Level 2

---

## 15. ATTACHMENTS & DOCUMENTATION

### 15.1 Digital Attachments
| File Name | Type | Size | Upload Date | Created By |
|-----------|------|------|------------|-----------|
| Inspection_Report_GD829.pdf | PDF | 2.4 MB | 26/05/2026 | Budi Santoso |
| Parts_Diagram_Hydraulic.dwg | CAD | 1.8 MB | 26/05/2026 | Technical Team |
| Repair_Photos_001-015.zip | Images | 45 MB | 28/05/2026 | Budi Santoso |
| Pressure_Test_Results.xlsx | Excel | 520 KB | 28/05/2026 | QA Team |

### 15.2 Reference Documents
- Technical Manual: Komatsu D85ESS-2 Operation & Maintenance
- Hydraulic System Troubleshooting Guide v3.2
- Parts Catalog: Hydraulic Components (2026 Edition)
- Service Level Agreement: PUTRA PERKASA ABADI (Amended 2026)

---

## FOOTER & METADATA

**System:** UT Service Console v2.1
**Data Source:** Salesforce Service Cloud
**Last Updated:** 26/10/2026 14:30
**Generated By:** Automated Case Management System
**Report Version:** Enhanced Design v1.0

---

*This document represents a complete case management system design with enhanced tracking, detailed asset information, comprehensive SLA management, and full communication history.*
