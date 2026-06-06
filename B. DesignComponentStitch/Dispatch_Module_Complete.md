# Dispatch Module - Service Appointments & Field Dispatch Management

## Complete Dispatch Console with Business Process Flow

---

## 1. DISPATCH MODULE OVERVIEW

### 1.1 Module Purpose & Scope

```
┌──────────────────────────────────────────────────────────────────┐
│ DISPATCH MODULE - CORE FUNCTIONALITY                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ PRIMARY FUNCTIONS:                                                │
│ ├─ Manage service appointments scheduling                         │
│ ├─ Assign work to mechanics/technicians                           │
│ ├─ Track real-time location & status                              │
│ ├─ Optimize route & scheduling                                    │
│ ├─ Manage field resources & equipment                             │
│ ├─ Monitor job completion in real-time                            │
│ ├─ Collect field data (EMR, TSR, KSR)                            │
│ └─ Generate completion reports & signatures                       │
│                                                                   │
│ KEY STAKEHOLDERS:                                                 │
│ ├─ Dispatch Manager (Oversees all dispatches)                     │
│ ├─ Field Mechanic (Executes work in field)                        │
│ ├─ Service Appointment Manager (Creates/manages SA)               │
│ ├─ Operations Manager (Reviews metrics & reports)                 │
│ └─ Customer (Receives service)                                    │
│                                                                   │
│ BUSINESS GOALS:                                                   │
│ ├─ Reduce empty travel time                                       │
│ ├─ Increase jobs completed per day                                │
│ ├─ Improve customer satisfaction                                  │
│ ├─ Optimize mechanic utilization                                  │
│ ├─ Ensure on-time completion (OTIF)                               │
│ ├─ Accurate field data collection                                 │
│ └─ Real-time visibility of operations                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. DISPATCH BUSINESS PROCESS FLOW

### 2.1 Complete Business Process Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DISPATCH BUSINESS PROCESS                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│  STAGE 1: SERVICE APPOINTMENT CREATION                              │
│  ════════════════════════════════════════════════════════════════   │
│                                                                      │
│      ┌──────────────────┐                                           │
│      │  Customer        │ (Case Created)                            │
│      │  Calls Service   │                                           │
│      └────────┬─────────┘                                           │
│               │                                                     │
│      ┌────────▼─────────┐                                           │
│      │   Case Status:   │                                           │
│      │ In-Progress      │                                           │
│      │                  │                                           │
│      │ Create Service   │                                           │
│      │ Appointment      │                                           │
│      │ (SA)             │                                           │
│      └────────┬─────────┘                                           │
│               │                                                     │
│               │ SA Details:                                         │
│               │ ├─ Customer info                                    │
│               │ ├─ Location/Address                                 │
│               │ ├─ Required service type                            │
│               │ ├─ Equipment/Asset                                  │
│               │ ├─ Appointment date/time                            │
│               │ └─ Special requirements                             │
│               │                                                     │
│  STAGE 2: DISPATCH ASSIGNMENT                                      │
│  ════════════════════════════════════════════════════════════════   │
│               │                                                     │
│      ┌────────▼──────────────┐                                      │
│      │  Mechanic Travel      │                                      │
│      │  (En-route to site)   │                                      │
│      │                       │                                      │
│      │ Case Status:          │                                      │
│      │ In-Progress           │                                      │
│      │ WO Status:            │                                      │
│      │ In-Progress           │                                      │
│      │ SA Status:            │                                      │
│      │ Travel                │                                      │
│      └────────┬──────────────┘                                      │
│               │                                                     │
│      ┌────────▼──────────────┐                                      │
│      │  Mechanic Start Work  │                                      │
│      │  (Arrive at site)     │                                      │
│      │                       │                                      │
│      │ SA Status:            │                                      │
│      │ In-Progress           │                                      │
│      └────────┬──────────────┘                                      │
│               │                                                     │
│  STAGE 3: FIELD WORK & DATA COLLECTION                             │
│  ════════════════════════════════════════════════════════════════   │
│               │                                                     │
│      ┌────────▼────────────────────┐                               │
│      │  Mechanic Input TimeSheet   │                               │
│      │  ├─ Start time              │                               │
│      │  ├─ Task description        │                               │
│      │  ├─ Duration                │                               │
│      │  └─ Location                │                               │
│      └────────┬────────────────────┘                               │
│               │                                                     │
│      ┌────────▼──────────────────────────┐                         │
│      │ Mechanic Update Status SA        │                         │
│      │ (Cannot completed)                │                         │
│      │                                   │                         │
│      │ Decision: Job Completed?          │                         │
│      └─────┬──────────────────────┬──────┘                         │
│            │ NO                   │ YES                             │
│            │                      │                                │
│            │                      │                                │
│  ┌─────────▼──────────────┐  ┌────▼──────────────────┐             │
│  │ SA Status: Cannot      │  │ Mechanic Update       │             │
│  │ Completed              │  │ Status SA             │             │
│  │                        │  │ (completed)           │             │
│  │ Reason:                │  │                       │             │
│  │ • Parts unavailable    │  │ SA Status:            │             │
│  │ • Equipment issue      │  │ In-Progress           │             │
│  │ • Technical problem    │  └────┬───────────────────┘             │
│  │                        │       │                                │
│  │ Re-schedule or create  │       │                                │
│  │ new Work Order         │       │                                │
│  └────────────────────────┘       │                                │
│                                   │                                │
│  STAGE 4: COMPLETION & REPORTING                                   │
│  ════════════════════════════════════════════════════════════════   │
│                                   │                                │
│      ┌────────────────────────────▼────────┐                       │
│      │ Mechanic Fills Up:                  │                       │
│      │ • Last SMR Hour / Last SMR KM       │                       │
│      │ • Fill load form (EMR, TSR,         │                       │
│      │   KSR, MRR, CMIP, consumed parts    │                       │
│      │   problem log)                      │                       │
│      │                                     │                       │
│      │ SA Status: Completed                │                       │
│      └────────┬────────────────────────────┘                       │
│               │                                                     │
│      ┌────────▼────────────────────────┐                           │
│      │ Create Service Report           │                           │
│      │ • Work summary                  │                           │
│      │ • Materials used                │                           │
│      │ • Problems encountered          │                           │
│      │ • Cost breakdown                │                           │
│      └────────┬────────────────────────┘                           │
│               │                                                     │
│      ┌────────▼────────────────────────┐                           │
│      │ Get Signature (Customer)        │                           │
│      │ • Approval of work              │                           │
│      │ • Receipt acknowledgment        │                           │
│      └────────┬────────────────────────┘                           │
│               │                                                     │
│      ┌────────▼────────────────────────┐                           │
│      │ Mechanic Input Time Sheet       │                           │
│      │ • End time                      │                           │
│      │ • Total hours worked            │                           │
│      │ • Billable hours                │                           │
│      │ • Break time                    │                           │
│      └────────┬────────────────────────┘                           │
│               │                                                     │
│      ┌────────▼────────────────────────┐                           │
│      │ Check Status SA, Check form     │                           │
│      │ (EMR, TSR, KSR/MRR, CMIP,      │                           │
│      │  problem log], Time Sheet,      │                           │
│      │  Dokumen List, PS, Dokumen Lain)│                           │
│      │                                 │                           │
│      │ All documents complete?         │                           │
│      └─────┬─────────────┬─────────────┘                           │
│            │ NO          │ YES                                      │
│            │             │                                         │
│   ┌────────▼──────┐  ┌────▼─────────────────┐                     │
│   │ Request user  │  │ Service Appointment  │                     │
│   │ to complete   │  │ CLOSED               │                     │
│   │ missing docs  │  │                      │                     │
│   │               │  │ Create invoicing     │                     │
│   │ Loop back to  │  │ entry (if billable)  │                     │
│   │ previous step │  │                      │                     │
│   └───────────────┘  └────┬─────────────────┘                     │
│                           │                                       │
│                    ┌──────▼─────────┐                             │
│                    │ Job Completed  │                             │
│                    │ SUCCESS ✓      │                             │
│                    └────────────────┘                             │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Process Step Details

#### **Step 1: Mechanic Travel**
```
┌──────────────────────────────────────────────┐
│ MECHANIC TRAVEL                              │
├──────────────────────────────────────────────┤
│                                              │
│ TRIGGER: SA assigned to mechanic             │
│                                              │
│ STATUS UPDATES:                              │
│ ├─ Case Status: In-Progress                  │
│ ├─ WO Status: In-Progress                    │
│ └─ SA Status: Travel                         │
│                                              │
│ MECHANIC ACTIONS:                            │
│ ├─ View appointment details                  │
│ ├─ Check address & location                  │
│ ├─ Review equipment/asset info               │
│ ├─ Plan route                                │
│ └─ Start navigation                          │
│                                              │
│ REAL-TIME TRACKING:                          │
│ ├─ GPS location updates                      │
│ ├─ ETA calculation                           │
│ ├─ Distance remaining                        │
│ └─ Offline mode support                      │
│                                              │
│ TIMELINE:                                    │
│ ├─ Travel start: When SA status → Travel     │
│ ├─ Duration: Variable (0.5-4 hours)          │
│ └─ End: Arrival at site                      │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 2: Mechanic Start Work**
```
┌──────────────────────────────────────────────┐
│ MECHANIC START WORK                          │
├──────────────────────────────────────────────┤
│                                              │
│ TRIGGER: Mechanic arrives at site            │
│                                              │
│ STATUS UPDATE:                               │
│ └─ SA Status: In-Progress                    │
│                                              │
│ MECHANIC ACTIONS:                            │
│ ├─ Confirm arrival                           │
│ ├─ Mark work started                         │
│ ├─ Inspect equipment/asset                   │
│ ├─ Review job requirements                   │
│ ├─ Gather initial SMR/readings               │
│ └─ Start documenting work                    │
│                                              │
│ SYSTEM ACTIONS:                              │
│ ├─ Record start time                         │
│ ├─ Lock previous SA (prevent changes)        │
│ ├─ Enable field forms                        │
│ └─ Update dashboard/dispatch console         │
│                                              │
│ TIMELINE:                                    │
│ ├─ Start: Arrival confirmation               │
│ └─ Duration: Until job completion            │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 3: Input TimeSheet & Perform Work**
```
┌──────────────────────────────────────────────┐
│ MECHANIC INPUT TIMESHEET & WORK              │
├──────────────────────────────────────────────┤
│                                              │
│ TIMESHEET DATA:                              │
│ ├─ Start time (auto-filled)                  │
│ ├─ Task description (manual)                 │
│ ├─ Duration (calculated or manual)           │
│ ├─ Location (auto from GPS)                  │
│ └─ Work type (WO, service activity)          │
│                                              │
│ MULTIPLE ENTRIES:                            │
│ ├─ Morning: Preparation (1h)                 │
│ ├─ Midday: Equipment service (3h)            │
│ ├─ Break: Lunch (1h - non-billable)          │
│ └─ Afternoon: Final inspection (1h)          │
│                                              │
│ FIELD ACTIONS:                               │
│ ├─ Perform actual work                       │
│ ├─ Document activities                       │
│ ├─ Collect readings (SMR, fuel, etc.)        │
│ ├─ Take photos/videos                        │
│ └─ Track materials used                      │
│                                              │
│ VALIDATION:                                  │
│ ├─ Check work progress                       │
│ ├─ Verify asset readings                     │
│ └─ Monitor time tracking                     │
│                                              │
│ TIMELINE:                                    │
│ ├─ Multiple entries throughout day           │
│ └─ Updated in real-time                      │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 4: Update SA Status (Completed/Cannot)**
```
┌──────────────────────────────────────────────┐
│ MECHANIC UPDATE SA STATUS                    │
├──────────────────────────────────────────────┤
│                                              │
│ DECISION POINT:                              │
│                                              │
│ IF JOB COMPLETED:                            │
│ ├─ SA Status → Completed                     │
│ ├─ Next step: Fill completion forms          │
│ └─ Continue to form filling                  │
│                                              │
│ IF CANNOT COMPLETE:                          │
│ ├─ SA Status → Cannot Completed              │
│ ├─ Select reason:                            │
│ │  ├─ Parts not available                    │
│ │  ├─ Equipment malfunction                  │
│ │  ├─ Customer unavailable                   │
│ │  ├─ Site access issue                      │
│ │  └─ Technical problem                      │
│ │                                            │
│ ├─ Add detailed notes                        │
│ ├─ Create follow-up action                   │
│ ├─ Reschedule appointment (if needed)        │
│ ├─ Notify dispatch manager                   │
│ └─ Continue with timesheet                   │
│                                              │
│ SYSTEM ACTIONS:                              │
│ ├─ Record decision & timestamp               │
│ ├─ Update all linked records                 │
│ ├─ Notify relevant parties                   │
│ └─ Trigger next workflow step                │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 5: Fill Completion Forms**
```
┌──────────────────────────────────────────────┐
│ MECHANIC FILLS COMPLETION FORMS              │
├──────────────────────────────────────────────┤
│                                              │
│ FORMS TO COMPLETE:                           │
│                                              │
│ 1. EQUIPMENT MAINTENANCE RECORD (EMR)        │
│    ├─ Last SMR Hour                          │
│    ├─ Last SMR KM                            │
│    ├─ Maintenance items performed            │
│    ├─ Issues found                           │
│    └─ Recommendations                        │
│                                              │
│ 2. TECHNICAL SERVICE RECORD (TSR)            │
│    ├─ Technical issues diagnosed             │
│    ├─ Repairs performed                      │
│    ├─ Parts replaced                         │
│    └─ Test results                           │
│                                              │
│ 3. KNOWLEDGE SERVICE RECORD (KSR)            │
│    ├─ Knowledge base referenced              │
│    ├─ Technical tips used                    │
│    └─ Solutions documented                   │
│                                              │
│ 4. MATERIALS & CONSUMPTION LOG               │
│    ├─ Fuel consumed                          │
│    ├─ Hydraulic fluid used                   │
│    ├─ Parts installed                        │
│    ├─ Labor hours                            │
│    └─ Consumables used                       │
│                                              │
│ 5. PROBLEM LOG                               │
│    ├─ Issues encountered                     │
│    ├─ Workarounds applied                    │
│    ├─ Customer impact                        │
│    └─ Follow-up required                     │
│                                              │
│ VALIDATION:                                  │
│ ├─ All required fields completed             │
│ ├─ Data accuracy verified                    │
│ └─ Ready for next step                       │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 6: Create Service Report**
```
┌──────────────────────────────────────────────┐
│ CREATE SERVICE REPORT                        │
├──────────────────────────────────────────────┤
│                                              │
│ REPORT GENERATION:                           │
│                                              │
│ 1. WORK SUMMARY                              │
│    ├─ Services performed                     │
│    ├─ Start & end times                      │
│    ├─ Total duration                         │
│    ├─ Billable hours                         │
│    └─ Work description                       │
│                                              │
│ 2. MATERIALS USED                            │
│    ├─ Parts with cost                        │
│    ├─ Labor hours with rates                 │
│    ├─ Travel charges (if applicable)         │
│    └─ Additional fees                        │
│                                              │
│ 3. PROBLEMS ENCOUNTERED                      │
│    ├─ Technical issues                       │
│    ├─ Workarounds applied                    │
│    ├─ Customer communication                 │
│    └─ Escalations (if any)                   │
│                                              │
│ 4. COST BREAKDOWN                            │
│    ├─ Labor cost                             │
│    ├─ Materials cost                         │
│    ├─ Travel cost                            │
│    └─ Total invoice amount                   │
│                                              │
│ 5. ATTACHMENTS                               │
│    ├─ Photos before/after                    │
│    ├─ Inspection reports                     │
│    ├─ Test results                           │
│    └─ Related documents                      │
│                                              │
│ SYSTEM ACTIONS:                              │
│ ├─ Auto-generate from collected data         │
│ ├─ Format for customer delivery              │
│ ├─ Prepare for invoicing                     │
│ └─ Store for records                         │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 7: Get Customer Signature**
```
┌──────────────────────────────────────────────┐
│ GET CUSTOMER SIGNATURE                       │
├──────────────────────────────────────────────┤
│                                              │
│ SIGNATURE CAPTURE:                           │
│                                              │
│ 1. DIGITAL SIGNATURE                         │
│    ├─ Pad/tablet input                       │
│    ├─ Mobile signature capture               │
│    ├─ Stylus or finger                       │
│    └─ High resolution image                  │
│                                              │
│ 2. AUTHENTICATION                            │
│    ├─ Name confirmation                      │
│    ├─ Photo identification (optional)        │
│    ├─ Timestamp recording                    │
│    └─ GPS location capture                   │
│                                              │
│ 3. APPROVAL STATEMENT                        │
│    ├─ "I approve the work completed"         │
│    ├─ "I accept the service charges"         │
│    ├─ "I received all documentation"         │
│    └─ "I understand the warranty terms"      │
│                                              │
│ 4. DELIVERY CONFIRMATION                     │
│    ├─ Physical copies provided               │
│    ├─ Digital copy available                 │
│    ├─ Email confirmation sent                │
│    └─ SMS notification sent                  │
│                                              │
│ VALIDATION:                                  │
│ ├─ Signature captured                        │
│ ├─ Customer acknowledged                     │
│ ├─ Timestamp recorded                        │
│ └─ Ready for closure                         │
│                                              │
│ NEXT STEPS:                                  │
│ ├─ Input final timesheet                     │
│ ├─ Verify all documentation                  │
│ ├─ Mark SA as closed                         │
│ └─ Prepare for invoicing                     │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 8: Input Final TimeSheet**
```
┌──────────────────────────────────────────────┐
│ MECHANIC INPUT FINAL TIMESHEET               │
├──────────────────────────────────────────────┤
│                                              │
│ FINAL ENTRY:                                 │
│ ├─ End time (auto-filled on completion)      │
│ ├─ Total hours worked (calculated)           │
│ ├─ Billable hours (manual if different)      │
│ ├─ Break time (calculated from entries)      │
│ ├─ Travel time (if logged separately)        │
│ └─ Job site comments                         │
│                                              │
│ CALCULATION:                                 │
│ ├─ Start: 08:00                              │
│ ├─ End: 17:15                                │
│ ├─ Total: 9.25 hours                         │
│ ├─ Break: 1.0 hour (lunch)                   │
│ ├─ Billable: 8.25 hours                      │
│ └─ Cost: 8.25 × $50 = $412.50                │
│                                              │
│ VALIDATION:                                  │
│ ├─ Check against SA appointment time         │
│ ├─ Verify breaktime deduction                │
│ ├─ Calculate daily total                     │
│ └─ Check overtime (if any)                   │
│                                              │
│ FINAL REVIEW:                                │
│ ├─ All forms completed (EMR, TSR, etc.)      │
│ ├─ Customer signature obtained               │
│ ├─ Documentation complete                    │
│ ├─ Service report generated                  │
│ └─ Ready for approval                        │
│                                              │
└──────────────────────────────────────────────┘
```

#### **Step 9: Verify All Documentation**
```
┌──────────────────────────────────────────────┐
│ VERIFY DOCUMENTATION CHECKLIST               │
├──────────────────────────────────────────────┤
│                                              │
│ REQUIRED DOCUMENTS:                          │
│                                              │
│ ✓ Service Appointment (SA) Status            │
│   └─ Must be marked "Completed"              │
│                                              │
│ ✓ Forms Completed:                           │
│   ├─ Equipment Maintenance Record (EMR)      │
│   ├─ Technical Service Record (TSR)          │
│   ├─ Knowledge Service Record (KSR)          │
│   ├─ Materials & Consumption Log (MRR)       │
│   ├─ Customer Materials Items Used (CMIP)    │
│   ├─ Problem Log                             │
│   └─ Service Report                          │
│                                              │
│ ✓ Customer Approval:                         │
│   ├─ Customer Signature (Digital)            │
│   ├─ Approval Date/Time                      │
│   └─ Photo ID (if required)                  │
│                                              │
│ ✓ Time Documentation:                        │
│   ├─ Timesheet entries (all tasks)           │
│   ├─ Start & end time                        │
│   ├─ Total billable hours                    │
│   └─ Break time deductions                   │
│                                              │
│ ✓ Photographic/Visual Evidence:              │
│   ├─ Before photos (condition at arrival)    │
│   ├─ Work-in-progress photos                 │
│   ├─ After photos (completed work)           │
│   └─ Parts/materials used (if applicable)    │
│                                              │
│ ✓ Additional Documentation:                  │
│   ├─ Inspection reports                      │
│   ├─ Test results                            │
│   ├─ Performance certificates                │
│   ├─ Warranty cards                          │
│   └─ Customer handover docs                  │
│                                              │
│ ✓ System Records:                            │
│   ├─ All forms saved in system               │
│   ├─ All data validated                      │
│   ├─ No missing required fields              │
│   └─ All attachments uploaded                │
│                                              │
│ VERIFICATION RESULT:                         │
│ ├─ All documents complete ✓                  │
│ └─ Ready for closure & invoicing             │
│                                              │
│ OR                                           │
│                                              │
│ ├─ Missing: [specify missing docs]           │
│ └─ Request user to complete & resubmit       │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 3. DISPATCH CONSOLE - WEB INTERFACE

### 3.1 Complete Console Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│ DISPATCH CONSOLE                                                            │
│ Classic Dispatch Console × SA-69283 ×                                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ NAVIGATION BAR:                                                             │
│ ├─ [Search resources, jobs...]                   [Console] [Resources]     │
│ │                                                [Territories] [Reports]   │
│ ├─ Policy: [Customer Put ▼]  [GANTT] [MAP]      [Filter ▼]               │
│ │                                                                             │
│ ├─ Schedule: [Today ▼] [Tue, 28 May 2026 ►]   [Calendar]                  │
│ │ Time slots: 08:00 09:00 10:00 11:00 12:00 13:00 14:00 15:00 16:00 17:00  │
│ │                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│ LEFT SIDEBAR:                    │  MAIN CALENDAR VIEW:                     │
│ ═══════════════════════════════  │  ═══════════════════════════════════   │
│                                  │                                         │
│ SERVICE APPOINTMENTS (42):        │  TIME SLOTS:                            │
│                                  │                                         │
│ ☐ SA-69283 (NEW)                 │  08:00  [Empty]                         │
│   PM Service - Excavator C320    │                                         │
│   ○ 2h    ○ Site A               │  09:00  [           ]                   │
│                                  │          SA-69283 (NEW)                  │
│ ☑ SA-69284 (DISPATCHED)          │          Site Prep (2h)                  │
│   Emergency Repair - Hyd          │          Mechanic: [Avatar]             │
│   ○ 4h    ○ Site B               │          Status: New                    │
│                                  │                                         │
│ ☐ SA-69285 (NEW)                 │  11:00  [           ]                   │
│   Inspection Routine              │          (Lunch break)                   │
│   ○ 1.5h  ○ Base                 │                                         │
│                                  │  12:00  [           ]                   │
│ RESOURCES (24):                   │          Mechanic: AGUS MIZMI           │
│                                  │          Status: In-Progress             │
│ [Avatar] AGUS MIZMI              │                                         │
│ ≡ Preventative                   │  14:00  [           ]                   │
│                                  │          SA-69285 (2h)                   │
│ [Avatar] BUDI APYANS             │          Morning Inspect                 │
│ ≡ Diagnostics                    │          Mechanic: BUDI APYANS           │
│                                  │                                         │
│ ☑ SA-69286 (DISPATCHED)          │  15:00  [           ]                   │
│   Emergency Repair - Hyd          │                                         │
│   ○ 4h    ○ Site B               │  16:00  [           ]                   │
│                                  │                                         │
│ UNASSIGNED (2):                   │  17:00  [           ]                   │
│ ⚠ Rule Violations (2)             │                                         │
│                                  │                                         │
└──────────────────────────────────┴─────────────────────────────────────────┘
│ Status: Offline  [Sync Status: Online]                                      │
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Service Appointments Panel (Left Sidebar)

```
┌─────────────────────────────────────────┐
│ SERVICE APPOINTMENTS (42)                │
│ Count: 42 total appointments             │
├─────────────────────────────────────────┤
│                                         │
│ APPOINTMENT 1:                          │
│ ┌────────────────────────────────────┐ │
│ │ ☐ SA-69283                 [NEW]  │ │
│ │ PM Service - Excavator C320        │ │
│ │ ○ 2h (Duration)                    │ │
│ │ ○ Site A (Location)                │ │
│ │ ○ 09:00-11:00 (Time slot)          │ │
│ │ ○ Unassigned (No mechanic yet)     │ │
│ │ ○ Priority: Medium                 │ │
│ │                                    │ │
│ │ [Expand] [Assign] [Details]        │ │
│ └────────────────────────────────────┘ │
│                                         │
│ APPOINTMENT 2:                          │
│ ┌────────────────────────────────────┐ │
│ │ ☑ SA-69284              [DISPATCHED]│ │
│ │ Emergency Repair - Hydraulic       │ │
│ │ ○ 4h (Duration)                    │ │
│ │ ○ Site B (Location)                │ │
│ │ ○ 11:00-15:00 (Time slot)          │ │
│ │ ○ Assigned: AGUS MIZMI             │ │
│ │ ○ Priority: High                   │ │
│ │ ○ Status: In-Progress              │ │
│ │                                    │ │
│ │ [Expand] [Contact] [Reassign]      │ │
│ └────────────────────────────────────┘ │
│                                         │
│ APPOINTMENT 3:                          │
│ ┌────────────────────────────────────┐ │
│ │ ☐ SA-69285                 [NEW]  │ │
│ │ Inspection Routine                 │ │
│ │ ○ 1.5h (Duration)                  │ │
│ │ ○ Base (Location)                  │ │
│ │ ○ 14:00-15:30 (Time slot)          │ │
│ │ ○ Unassigned (No mechanic yet)     │ │
│ │ ○ Priority: Low                    │ │
│ │                                    │ │
│ │ [Expand] [Assign] [Details]        │ │
│ └────────────────────────────────────┘ │
│                                         │
│ [View More Appointments...]             │
│                                         │
│ FILTERS:                                │
│ ├─ Status: [All ▼]                     │
│ ├─ Priority: [All ▼]                   │
│ ├─ Location: [All ▼]                   │
│ └─ Mechanic: [All ▼]                   │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 Resources Panel (Left Sidebar)

```
┌─────────────────────────────────────────┐
│ RESOURCES (24)                          │
│ Available mechanics/technicians          │
├─────────────────────────────────────────┤
│                                         │
│ RESOURCE 1: AGUS MIZMI                  │
│ ┌────────────────────────────────────┐ │
│ │ [Avatar] AGUS MIZMI                │ │
│ │ ≡ Preventative Services             │ │
│ │                                    │ │
│ │ Status: In-Progress                │ │
│ │ Current job: SA-69284              │ │
│ │ Location: Site B                   │ │
│ │ Est. finish: 15:00                 │ │
│ │ Next available: 15:00              │ │
│ │ Capacity: 80% (4h of 5h available) │ │
│ │ Skills: Hydraulics, Diesel, Elec.  │ │
│ │ Rating: ★★★★★ (4.8/5)             │ │
│ │                                    │ │
│ │ [Assign Job] [Track] [Contact]     │ │
│ └────────────────────────────────────┘ │
│                                         │
│ RESOURCE 2: BUDI APYANS                 │
│ ┌────────────────────────────────────┐ │
│ │ [Avatar] BUDI APYANS               │ │
│ │ ≡ Diagnostics                       │ │
│ │                                    │ │
│ │ Status: Available (On-break)        │ │
│ │ Current job: None                  │ │
│ │ Location: Site C                   │ │
│ │ Next available: Now                │ │
│ │ Capacity: 100% (0h of 8h used)     │ │
│ │ Skills: Electrical, Controls, Data  │ │
│ │ Rating: ★★★★☆ (4.5/5)             │ │
│ │                                    │ │
│ │ [Assign Job] [Track] [Contact]     │ │
│ └────────────────────────────────────┘ │
│                                         │
│ [View More Resources...]                │
│                                         │
│ FILTERS:                                │
│ ├─ Status: [All ▼]                     │
│ ├─ Skill: [All ▼]                      │
│ ├─ Location: [All ▼]                   │
│ └─ Capacity: [All ▼]                   │
│                                         │
└─────────────────────────────────────────┘
```

### 3.4 Calendar/Gantt View (Main Area)

```
┌───────────────────────────────────────────────────────────────┐
│ DISPATCH CALENDAR VIEW                                        │
│                                                               │
│ Date: [Today ▼] [Tue, 28 May 2026 ►]     [Calendar icon]    │
│ Time: [08:00] [09:00] [10:00] ... [16:00] [17:00]           │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│ 08:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │  [Empty slot]                                        │
│       │                                                       │
│ 09:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │                                                       │
│       │  ┌──────────────────────────────────┐                │
│       │  │ SA-69283 (NEW)                   │ Status badge    │
│       │  │ Site Prep Work                   │ [Yellow NEW]    │
│       │  │ Duration: 2h                     │                │
│       │  │ Mechanic: [Avatar] AGUS MIZMI   │                │
│       │  │ Location: Site A                 │                │
│       │  │ [Details] [Assign] [Reassign]   │                │
│       │  └──────────────────────────────────┘                │
│       │                                                       │
│ 11:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │                                                       │
│       │  ┌──────────────────────────────────────────┐         │
│       │  │ SA-69284 (DISPATCHED)                    │ Status  │
│       │  │ Emergency Repair - Hydraulic            │ [Green] │
│       │  │ Duration: 4h (11:00-15:00)               │         │
│       │  │ Mechanic: [Avatar] AGUS MIZMI            │         │
│       │  │ Location: Site B                         │         │
│       │  │ Progress: 60% (in progress)              │         │
│       │  │ [Details] [Track] [Contact] [Reassign]  │         │
│       │  └──────────────────────────────────────────┘         │
│       │                                                       │
│ 12:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │                                                       │
│       │  (Lunch break - reserved time)                       │
│       │                                                       │
│ 14:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │                                                       │
│       │  ┌──────────────────┐                                │
│       │  │ SA-69285 (NEW)   │ Status badge                   │
│       │  │ Inspection (1.5h)│ [Yellow NEW]                   │
│       │  │ Mechanic: BUDI   │                                │
│       │  │ Site Base        │                                │
│       │  └──────────────────┘                                │
│       │                                                       │
│ 16:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │  [Available for assignment]                          │
│       │                                                       │
│ 17:00 ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│       │  [End of day]                                        │
│                                                               │
└───────────────────────────────────────────────────────────────┘

STATUS BADGES:
├─ [Yellow NEW] - New appointment, not assigned
├─ [Green DISPATCHED] - Assigned & dispatched to mechanic
├─ [Blue IN-PROGRESS] - Mechanic currently working
├─ [Orange PENDING] - Waiting for customer
├─ [Red OVERDUE] - Past scheduled time
└─ [Gray COMPLETED] - Job finished
```

---

## 4. APPOINTMENT DETAIL VIEW

### 4.1 SA Detail Modal

```
┌──────────────────────────────────────────────────┐
│ SERVICE APPOINTMENT DETAILS                      │
│ SA-69283                                   [✕]  │
├──────────────────────────────────────────────────┤
│                                                  │
│ APPOINTMENT INFO:                                │
│ ├─ SA ID: SA-69283                              │
│ ├─ Status: [NEW] [DISPATCHED] [IN-PROGRESS]    │
│ ├─ Priority: [HIGH/MEDIUM/LOW]                  │
│ ├─ Date: Tue, 28 May 2026                       │
│ ├─ Time: 09:00 - 11:00 (2 hours)               │
│ └─ Created: 27 May 2026, 14:30                  │
│                                                  │
│ CUSTOMER INFORMATION:                            │
│ ├─ Customer: SIMS JAYA KALTIM                   │
│ ├─ Contact: BURHAN (+62-811-234-5678)           │
│ ├─ Site: Site A, Batukaang, East Kaltim       │
│ └─ Address: [Full address]                      │
│                                                  │
│ EQUIPMENT DETAILS:                              │
│ ├─ Asset: GD825A-2 (Motor Grader)               │
│ ├─ Serial: 120948A                              │
│ ├─ Model: HD785-7                               │
│ ├─ Hours: 4,520 hm                              │
│ └─ Last service: 15/03/2025                     │
│                                                  │
│ SERVICE REQUIREMENTS:                            │
│ ├─ Type: Preventive Maintenance                 │
│ ├─ Work: 500-hour service                       │
│ ├─ Special instructions: Check brake system    │
│ └─ Estimated duration: 2 hours                  │
│                                                  │
│ ASSIGNMENT DETAILS:                             │
│ ├─ Assigned to: [Select mechanic ▼]            │
│ │  Current: AGUS MIZMI (Preventative specialist)│
│ ├─ Assigned date: 27 May 2026, 16:00           │
│ ├─ Expected completion: 28 May 2026, 11:00    │
│ └─ Notes: "Urgent - customer waiting"          │
│                                                  │
│ ACTION BUTTONS:                                  │
│ ├─ [Assign Mechanic] [Reassign]                │
│ ├─ [Start Work] [Complete] [Cancel]            │
│ ├─ [View History] [Print] [Email]              │
│ └─ [Close]                                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 5. REAL-TIME TRACKING

### 5.1 Live Mechanic Tracking

```
┌──────────────────────────────────────────────────┐
│ LIVE MECHANIC TRACKING                           │
│ SA-69284 (AGUS MIZMI)                            │
├──────────────────────────────────────────────────┤
│                                                  │
│ LOCATION INFORMATION:                            │
│ ├─ Current location: Site B, Coordinates        │
│ ├─ GPS: -0.5128, 117.1492                       │
│ ├─ Last updated: 28 May 2026, 13:45 (2 mins ago)│
│ └─ Accuracy: ±10 meters                         │
│                                                  │
│ JOURNEY STATUS:                                  │
│ ├─ Start point: Service Center                  │
│ ├─ Destination: Site B                          │
│ ├─ Distance traveled: 42.5 km                   │
│ ├─ Distance remaining: 0 km (at site)           │
│ ├─ Travel time: 1h 23m                          │
│ └─ Status: ON-SITE                              │
│                                                  │
│ WORK PROGRESS:                                   │
│ ├─ Start time: 11:00                            │
│ ├─ Current time: 13:45                          │
│ ├─ Elapsed: 2h 45m                              │
│ ├─ Expected end: 15:00                          │
│ ├─ Time remaining: 1h 15m                       │
│ └─ Progress: 73% (on track)                     │
│                                                  │
│ COMMUNICATION:                                   │
│ ├─ [Call Mechanic]                              │
│ ├─ [Send SMS]                                   │
│ ├─ [Send Message via App]                       │
│ └─ [View Chat History]                          │
│                                                  │
│ [MAP VIEW] [DETAILS] [CLOSE]                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 6. DISPATCH ACTIONS & OPERATIONS

### 6.1 Common Dispatch Operations

```
┌──────────────────────────────────────────────────┐
│ DISPATCH OPERATIONS                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ 1. ASSIGN APPOINTMENT                            │
│    Step 1: Select appointment (SA-69283)         │
│    Step 2: Choose mechanic (AGUS MIZMI)         │
│    Step 3: Confirm time slot (09:00-11:00)      │
│    Step 4: Add any special instructions          │
│    Step 5: Send notification to mechanic        │
│    Result: SA status → DISPATCHED                │
│                                                  │
│ 2. REASSIGN MECHANIC                             │
│    Step 1: Open appointment (SA-69284)           │
│    Step 2: View current mechanic (AGUS)          │
│    Step 3: Select new mechanic (BUDI)            │
│    Step 4: Confirm reassignment                  │
│    Step 5: Send notifications to both mechanics │
│    Result: Mechanic reassigned successfully      │
│                                                  │
│ 3. OPTIMIZE ROUTE                                │
│    Step 1: View all pending appointments         │
│    Step 2: Analyze mechanic locations            │
│    Step 3: Calculate optimal routing             │
│    Step 4: Reorder appointments if needed        │
│    Step 5: Update mechanic schedules             │
│    Result: Minimized travel time                 │
│                                                  │
│ 4. HANDLE EMERGENCY                              │
│    Step 1: Create urgent appointment             │
│    Step 2: Mark priority as [URGENT]             │
│    Step 3: Find available mechanic nearby        │
│    Step 4: Immediate dispatch                    │
│    Step 5: Real-time tracking activated          │
│    Result: Fastest response time                 │
│                                                  │
│ 5. RESCHEDULE APPOINTMENT                        │
│    Step 1: Select appointment to reschedule      │
│    Step 2: Choose new date/time                  │
│    Step 3: Check mechanic availability           │
│    Step 4: Confirm rescheduling                  │
│    Step 5: Notify customer & mechanic            │
│    Result: New appointment created               │
│                                                  │
│ 6. CANCEL APPOINTMENT                            │
│    Step 1: Select appointment to cancel          │
│    Step 2: Confirm cancellation                  │
│    Step 3: Select reason (customer/mechanic)     │
│    Step 4: Notify all parties                    │
│    Step 5: Update mechanic availability          │
│    Result: SA marked as cancelled                │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 7. DASHBOARD METRICS & REPORTING

### 7.1 KPI Dashboard

```
┌────────────────────────────────────────────────────┐
│ DISPATCH DASHBOARD - KPI METRICS                   │
│ Date: 28 May 2026                                  │
├────────────────────────────────────────────────────┤
│                                                     │
│ TODAY'S METRICS:                                    │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Appointments Scheduled:       42                   │
│ Appointments Dispatched:      28 (67%)             │
│ In-Progress:                  12 (29%)             │
│ Completed:                    8 (19%)              │
│ Pending:                      14 (33%)             │
│ Cancelled:                    2 (5%)               │
│ Overdue:                      3 (7%)               │
│                                                     │
│ RESOURCE UTILIZATION:                              │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Total mechanics available:    24                   │
│ Currently assigned:           18 (75%)             │
│ Available for assignment:     6 (25%)              │
│ On break:                     2 (8%)               │
│ Off duty:                     4 (17%)              │
│                                                     │
│ PERFORMANCE METRICS:                               │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Average dispatch time:        8 minutes            │
│ Average job duration:         2.5 hours            │
│ Average travel time:          45 minutes           │
│ Jobs completed on-time:       38 (95%)             │
│ Customer satisfaction:        4.7/5.0 ⭐          │
│ Average rating per mechanic:  4.6/5.0              │
│                                                     │
│ EFFICIENCY:                                        │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Total billable hours:         156 hours            │
│ Average per mechanic:         6.5 hours            │
│ Utilization rate:             82%                  │
│ Empty travel %:               12%                  │
│ Revenue generated today:      $7,800               │
│                                                     │
│ [View Detailed Report] [Export] [Print]            │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## 8. SYSTEM SPECIFICATIONS & REQUIREMENTS

### 8.1 Technical Requirements

```
┌──────────────────────────────────────────────────┐
│ DISPATCH MODULE TECHNICAL SPECIFICATIONS          │
├──────────────────────────────────────────────────┤
│                                                  │
│ PLATFORM:                                        │
│ ├─ Web-based (Desktop & Mobile)                  │
│ ├─ Browser: Chrome, Safari, Firefox, Edge       │
│ ├─ Mobile OS: iOS 12+, Android 8.0+             │
│ └─ Offline mode: Available                       │
│                                                  │
│ REAL-TIME FEATURES:                              │
│ ├─ GPS tracking: Every 30 seconds                │
│ ├─ Live notifications: Instant push              │
│ ├─ WebSocket connection: Always-on               │
│ └─ Backup polling: 5-minute intervals            │
│                                                  │
│ DATA SYNCHRONIZATION:                            │
│ ├─ Auto-sync every 1 minute                      │
│ ├─ Conflict resolution: Last-write-wins          │
│ ├─ Offline queue: Up to 100 actions              │
│ └─ Retry mechanism: 3 attempts with backoff      │
│                                                  │
│ PERFORMANCE:                                     │
│ ├─ Map load time: < 2 seconds                    │
│ ├─ Appointment update: < 500ms                   │
│ ├─ Mechanic assignment: < 1 second               │
│ └─ Report generation: < 5 seconds                │
│                                                  │
│ STORAGE:                                         │
│ ├─ Database: PostgreSQL                          │
│ ├─ Cache: Redis                                  │
│ ├─ File storage: S3 (photos, documents)          │
│ └─ Backups: Daily incremental                    │
│                                                  │
│ SECURITY:                                        │
│ ├─ SSL/TLS encryption: All communications        │
│ ├─ Authentication: OAuth 2.0                     │
│ ├─ Authorization: Role-based (RBAC)              │
│ ├─ Data protection: GDPR compliant               │
│ └─ Audit logs: All actions recorded              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 9. USER ROLES & PERMISSIONS

### 9.1 Role-Based Access Control

```
┌──────────────────────────────────────────────────┐
│ DISPATCH MODULE - USER ROLES & PERMISSIONS       │
├──────────────────────────────────────────────────┤
│                                                  │
│ DISPATCH MANAGER:                                │
│ ├─ View all appointments (read-only)             │
│ ├─ Assign/reassign mechanics                     │
│ ├─ View real-time tracking                       │
│ ├─ Handle emergency dispatches                   │
│ ├─ Generate reports                              │
│ ├─ View KPI dashboard                            │
│ └─ Escalate issues                               │
│                                                  │
│ FIELD MECHANIC:                                  │
│ ├─ View assigned appointments                    │
│ ├─ View navigation to site                       │
│ ├─ Start/complete work                           │
│ ├─ Input timesheet                               │
│ ├─ Fill completion forms                         │
│ ├─ Capture customer signature                    │
│ ├─ View payment/ratings                          │
│ └─ Access offline mode                           │
│                                                  │
│ SA COORDINATOR:                                  │
│ ├─ Create/edit appointments                      │
│ ├─ Schedule appointments                         │
│ ├─ View mechanic availability                    │
│ ├─ Reschedule appointments                       │
│ ├─ Cancel appointments                           │
│ └─ Notify customers                              │
│                                                  │
│ OPERATIONS MANAGER:                              │
│ ├─ View all dispatch data                        │
│ ├─ View KPI dashboards                           │
│ ├─ Generate reports                              │
│ ├─ Export data                                   │
│ ├─ View historical trends                        │
│ └─ Generate invoice reports                      │
│                                                  │
│ CUSTOMER:                                        │
│ ├─ View appointment schedule                     │
│ ├─ Track mechanic location (live)                │
│ ├─ Receive notifications                         │
│ ├─ Communicate with mechanic                     │
│ ├─ View estimated arrival time                   │
│ └─ Provide feedback/rating                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 10. NOTIFICATIONS & ALERTS

### 10.1 Notification Types

```
┌──────────────────────────────────────────────────┐
│ DISPATCH NOTIFICATIONS & ALERTS                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ FOR MECHANIC:                                    │
│ ├─ "New appointment assigned: SA-69283"          │
│ ├─ "Appointment starting in 30 minutes"          │
│ ├─ "Customer called, they are waiting"           │
│ ├─ "Follow-up appointment scheduled"             │
│ ├─ "Job report requires review"                  │
│ └─ "Payment received: $412.50"                   │
│                                                  │
│ FOR DISPATCH MANAGER:                            │
│ ├─ "Appointment overdue: SA-69284"               │
│ ├─ "Mechanic cannot complete: SA-69281"          │
│ ├─ "New urgent appointment: SA-69289"            │
│ ├─ "Mechanic offline: AGUS MIZMI"                │
│ ├─ "Quality issue reported: 2 jobs"              │
│ └─ "Daily KPI report ready"                      │
│                                                  │
│ FOR CUSTOMER:                                    │
│ ├─ "Your appointment scheduled: 28 May, 09:00"   │
│ ├─ "Mechanic en-route, ETA 10 minutes"           │
│ ├─ "Work started at 09:15"                       │
│ ├─ "Work completed successfully"                 │
│ ├─ "Please provide feedback"                     │
│ └─ "Invoice ready: $412.50"                      │
│                                                  │
│ ALERT CHANNELS:                                  │
│ ├─ In-app notifications                          │
│ ├─ Push notifications (mobile)                   │
│ ├─ Email notifications                           │
│ ├─ SMS alerts (urgent only)                      │
│ └─ WhatsApp messages (regional)                  │
│                                                  │
│ ALERT PRIORITY:                                  │
│ ├─ CRITICAL: System down, emergency dispatch     │
│ ├─ HIGH: Overdue jobs, safety issues             │
│ ├─ MEDIUM: Status changes, new assignments       │
│ └─ LOW: Informational, daily reports              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 11. METADATA & DOCUMENTATION

**System:** UT Service Console - Dispatch Module v2.0
**Feature Type:** Appointment & Field Dispatch Management
**Last Updated:** 26/05/2026
**Document Version:** Complete Dispatch Design v1.0

---

## 12. SUMMARY - KEY FEATURES

### Dispatch Module Features:
✅ **Service Appointment Management** - Create, schedule, assign
✅ **Mechanic Assignment & Optimization** - Intelligent routing
✅ **Real-Time GPS Tracking** - Live location monitoring
✅ **Appointment Calendar/Gantt** - Visual scheduling
✅ **Resource Management** - Track mechanic availability
✅ **Field Forms** - EMR, TSR, KSR, timesheet collection
✅ **Digital Signatures** - Customer approval capture
✅ **Service Reports** - Auto-generated from field data
✅ **Performance Metrics** - KPI dashboard & analytics
✅ **Offline Mode** - Work without connectivity
✅ **Notifications** - Multi-channel alerts
✅ **Mobile Responsive** - Tablets & smartphones

### Business Process:
✅ **Appointment Creation** - Customer books service
✅ **Mechanic Assignment** - Optimal resource allocation
✅ **Travel Management** - Route optimization
✅ **Field Work** - On-site service execution
✅ **Data Collection** - Forms & documentation
✅ **Completion** - Customer approval
✅ **Invoicing** - Billing & payment
✅ **Follow-up** - Post-service support

---

*This document provides complete specification for Dispatch Module with detailed business process flow, web-based console design, and real-time field dispatch management capabilities.*
