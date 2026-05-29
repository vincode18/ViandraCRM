# Dispatch Console - Redesigned Schedule View

## Modern Dispatch Schedule Interface with Gantt Timeline

---

## 1. REDESIGN OVERVIEW

### 1.1 Design Comparison: Old vs New

```
OLD DESIGN (Image 1 Reference):
├─ Vertical layout
├─ Calendar grid cells
├─ Horizontal scheduling
├─ Resource list on right
└─ Basic appointment display

NEW DESIGN (Image 2 Reference - Target):
├─ Horizontal timeline (Gantt)
├─ Time slots across (08:00-17:00)
├─ Resource/Mechanic down (vertical)
├─ Color-coded appointment bars
├─ Drag-and-drop capability
├─ Real-time sync
└─ Resource utilization visual
```

---

## 2. NEW DISPATCH CONSOLE LAYOUT

### 2.1 Complete Redesigned Console

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ⊞ DISPATCH CONSOLE                                                          │
│                                                                             │
│ Search resources, jobs...        [Console] [Resources] [Territories]       │
│                                  [Reports]                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ UT Service Console   Classic Dispatch Console × SA-69283 ×                │
│                                                                             │
│ @ Policy: Customer Put ▼  ⊞ GANTT ⊞ MAP       Date: [Today ▼]            │
│                                                 [Tue, 28 May 2026 ►]       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ LEFT PANEL (20%):          │   MAIN GANTT VIEW (80%):                      │
│ ═══════════════════════════╪═════════════════════════════════════════════  │
│                            │                                               │
│ SERVICE APPOINTMENTS (42): │   TIME SLOTS:                                │
│                            │   08:00 09:00 10:00 11:00 12:00 13:00       │
│ ☐ SA-69283 (NEW)          │   14:00 15:00 16:00 17:00 [Filter ▼]        │
│   PM Service - Excav C320  │                                               │
│   ○ 2h    ○ Site A        │   ┌─ MON 23 ─────┬─ TUE 24 ────┬─ WED 25     │
│                            │   │              │             │ (Today)     │
│ ☑ SA-69284 (DISPATCHED)   │   ├──────────────┼─────────────┼─────        │
│   Emergency Repair - Hyd   │   │              │             │             │
│   ○ 4h    ○ Site B        │   RESOURCES:   │             │             │
│                            │   │              │             │             │
│ ☐ SA-69285 (NEW)          │   Budi Santoso │ [08:00]     │ [09:00]     │
│   Inspection Routine       │   (SMR: Wrench)│ ▐▄▄▄▄▄▄▌ 2h │ ▐▄▄▄▄▄▌ 3h │
│   ○ 1.5h  ○ Base          │   Capacity: 80%│ SA-69283    │ SA-69284    │
│                            │   │              │             │             │
│ RESOURCES (24):            │   Agus Setiawan │ [10:00-    │ [13:00-     │
│                            │   (Service)     │  14:00]    │  17:00]     │
│ [Avatar] Budi Santoso      │   Capacity: 60%│ ▐▄▄▄▄▄▄▄▄▌ │ ▐▄▄▄▄▄▄▌   │
│ ≡ Internal Tech            │   │              │ Scheduled  │ In-Shift    │
│ Capacity: 80%             │   │              │            │             │
│                            │   Sdn Aminah    │ [14:00-     │ [17:00]     │
│ [Avatar] Agus Setiawan     │   (Contractor)  │  17:00]    │ ▐▄▄▄▌ 1h    │
│ ≡ Service                  │   Capacity: 100%│ ▐▄▄▄▄▄▄▌   │ Project    │
│ Capacity: 60%             │   │              │ Project    │ Alpha      │
│                            │   │              │ Alpha Site │            │
│ [Avatar] Sdn Aminah        │   │              │ A          │            │
│ ≡ Contractor               │   │              │            │            │
│ Capacity: 100%            │   │              │            │            │
│                            │   ├──────────────┼────────────┼────        │
│ FILTERS:                   │   │ Confirmed Shift │ Tentative │ Absence  │
│ ├─ Territory:             │   │                 │ Shift     │          │
│ │  ⊙ JKT ST (Jakarta South)   │                 │           │          │
│ │  ⊙ JKT MT (Jakarta Metro)   │                 │           │          │
│ │  ⊙ SDG-C (Bandung Central)  │                 │           │          │
│ │                            │                 │           │          │
│ ├─ Skill Level:            │                 │           │          │
│ │  ○ All Skills           │                 │           │          │
│ │                            │                 │           │          │
│ ├─ Resource Type:          │                 │           │          │
│ │  ⊙ Internal Tech        │                 │           │          │
│ │  ○ Contractor           │                 │           │          │
│ │                            │                 │           │          │
│ ├─ Capacity View:         │                 │           │          │
│ │  ○ High to Low          │                 │           │          │
│ │  ○ Overallocated        │                 │           │          │
│ │  ○ Available Only       │                 │           │          │
│ │                            │                 │           │          │
│ [Reset Filters]            │                 │           │          │
│                            │                 │           │          │
└────────────────────────────┴─────────────────────────────────────────────┘
│ Status: Offline   ⊞ Sync Status: Online                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. LEFT SIDEBAR - SERVICE APPOINTMENTS PANEL

### 3.1 Appointments List with Status

```
┌─────────────────────────────────────────┐
│ SERVICE APPOINTMENTS (42)                │
│ Count badge shows total appointments     │
├─────────────────────────────────────────┤
│                                         │
│ APPOINTMENT CARD 1:                     │
│ ┌────────────────────────────────────┐ │
│ │ ☐ SA-69283              [NEW]      │ │
│ │                                    │ │
│ │ PM Service - Excav C320             │ │
│ │ (Customer description)              │ │
│ │                                    │ │
│ │ ○ 2h (Duration)                    │ │
│ │ ○ Site A (Location)                │ │
│ │                                    │ │
│ │ [View] [Assign] [Details]          │ │
│ └────────────────────────────────────┘ │
│                                         │
│ APPOINTMENT CARD 2:                     │
│ ┌────────────────────────────────────┐ │
│ │ ☑ SA-69284          [DISPATCHED]   │ │
│ │                                    │ │
│ │ Emergency Repair - Hydraulic       │ │
│ │ (Customer: SIMS JAYA KALTIM)       │ │
│ │                                    │ │
│ │ ○ 4h (Duration)                    │ │
│ │ ○ Site B (Location)                │ │
│ │                                    │ │
│ │ [View] [Contact] [Reassign]        │ │
│ └────────────────────────────────────┘ │
│                                         │
│ APPOINTMENT CARD 3:                     │
│ ┌────────────────────────────────────┐ │
│ │ ☐ SA-69285              [NEW]      │ │
│ │                                    │ │
│ │ Inspection Routine                 │ │
│ │ (Customer: PT DINAMIKA)            │ │
│ │                                    │ │
│ │ ○ 1.5h (Duration)                  │ │
│ │ ○ Base (Location)                  │ │
│ │                                    │ │
│ │ [View] [Assign] [Details]          │ │
│ └────────────────────────────────────┘ │
│                                         │
│ [Load More Appointments...]             │
│                                         │
├─────────────────────────────────────────┤
│ QUICK STATS:                            │
│ ├─ Total: 42                            │
│ ├─ New: 14                              │
│ ├─ Dispatched: 18                       │
│ ├─ Overdue: 3                           │
│ └─ Unassigned: 7                        │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Resources Panel with Capacity

```
┌─────────────────────────────────────────┐
│ RESOURCES (24)                          │
│ Available mechanics & capacity view      │
├─────────────────────────────────────────┤
│                                         │
│ RESOURCE 1:                             │
│ ┌────────────────────────────────────┐ │
│ │ [Avatar] Budi Santoso              │ │
│ │ ≡ Internal Tech (SMR: Wrench icon) │ │
│ │                                    │ │
│ │ Capacity: 80% [████████░░]         │ │
│ │ Current job: SA-69283              │ │
│ │ Time: 08:00 - 11:00 (2h)          │ │
│ │ Status: In-Shift                   │ │
│ │                                    │ │
│ │ Skills: Hydraulic, Diesel          │ │
│ │ Rating: ★★★★★ (4.8/5)             │ │
│ │ Location: Site A                   │ │
│ │                                    │ │
│ │ [Assign] [Track] [Contact]         │ │
│ └────────────────────────────────────┘ │
│                                         │
│ RESOURCE 2:                             │
│ ┌────────────────────────────────────┐ │
│ │ [Avatar] Agus Setiawan             │ │
│ │ ≡ Service (Icon)                   │ │
│ │                                    │ │
│ │ Capacity: 60% [██████░░░░]         │ │
│ │ Current job: SA-69284              │ │
│ │ Time: 10:00 - 14:00 (4h)          │ │
│ │ Status: In-Progress                │ │
│ │                                    │ │
│ │ Skills: Electrical, Controls       │ │
│ │ Rating: ★★★★☆ (4.5/5)             │ │
│ │ Location: Site B                   │ │
│ │                                    │ │
│ │ [Assign] [Track] [Contact]         │ │
│ └────────────────────────────────────┘ │
│                                         │
│ RESOURCE 3:                             │
│ ┌────────────────────────────────────┐ │
│ │ [Avatar] Sdn Aminah                │ │
│ │ ≡ Contractor (Briefcase icon)      │ │
│ │                                    │ │
│ │ Capacity: 100% [██████████]        │ │
│ │ Current job: Project Alpha Site A  │ │
│ │ Time: 14:00 - 17:00 (3h)          │ │
│ │ Status: Scheduled                  │ │
│ │                                    │ │
│ │ Skills: General Maintenance        │ │
│ │ Rating: ★★★☆☆ (3.8/5)             │ │
│ │ Location: Site A                   │ │
│ │                                    │ │
│ │ [Assign] [Track] [Contact]         │ │
│ └────────────────────────────────────┘ │
│                                         │
│ [View All Resources...]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 Filters Panel

```
┌─────────────────────────────────────────┐
│ FILTERS                                 │
├─────────────────────────────────────────┤
│                                         │
│ TERRITORY:                              │
│ ⊙ JKT ST (Jakarta South)                │
│ ⊙ JKT MT (Jakarta Metro)                │
│ ⊙ SDG-C (Bandung Central)               │
│                                         │
│ SKILL LEVEL:                            │
│ [All Skills ▼]                          │
│ Options:                                │
│ ├─ All Skills                           │
│ ├─ Advanced                             │
│ ├─ Intermediate                         │
│ └─ Basic                                │
│                                         │
│ RESOURCE TYPE:                          │
│ ⊙ Internal Tech                         │
│ ○ Contractor                            │
│ ○ Both                                  │
│                                         │
│ CAPACITY VIEW:                          │
│ ○ High to Low                           │
│ ○ Overallocated                         │
│ ○ Available Only                        │
│ ○ All Resources                         │
│                                         │
│ [Reset Filters] [Apply]                 │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. MAIN GANTT VIEW - SCHEDULE TIMELINE

### 4.1 Timeline Header

```
┌────────────────────────────────────────────────────────────────┐
│ TIME SLOTS & DATE NAVIGATION                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ [◄] [Today ▼]  [Tue, 28 May 2026 ►]         [📅 Calendar]    │
│                                                                 │
│ TIME SLOTS (Hourly):                                           │
│ 08:00 | 09:00 | 10:00 | 11:00 | 12:00 | 13:00 | 14:00 | 15:00 │
│ 16:00 | 17:00 | 18:00 (optional)                              │
│                                                                 │
│ DATE COLUMN HEADERS:                                           │
│ ┌──────────────┬──────────────┬──────────────┐                 │
│ │ MON 23       │ TUE 24       │ WED 25 (Today)              │
│ │ Oct 2024     │ Oct 2024     │ Oct 2024                    │
│ │ 5 SA's       │ 3 SA's       │ 7 SA's                      │
│ └──────────────┴──────────────┴──────────────┘                 │
│                                                                 │
│ [Filter ▼]  [View: Week] [Refresh ⟳]  [Sync Status: Online] │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Gantt Chart - Appointment Bars

```
┌────────────────────────────────────────────────────────────────┐
│ GANTT SCHEDULE VIEW - RESOURCE ALLOCATION                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ RESOURCE 1: Budi Santoso (SMR: Wrench)                        │
│ ├─ Mon 23:                                                     │
│ │  [08:00] ▐████████▌ 2h [SA-69283] PM Service               │
│ │  [10:00] ▐████████▌ 2h [SA-69280] Routine Check            │
│ │  [14:00] ▐██████▌ 1.5h [SA-69281] Inspection              │
│ │  Capacity: 80% (5.5 / 8 hours)                             │
│ │                                                             │
│ ├─ Tue 24:                                                     │
│ │  [09:00] ▐████████████▌ 3h [SA-69284] Emergency Repair    │
│ │  [13:00] ▐███████▌ 2h [SA-69285] Service Check            │
│ │  Capacity: 75% (5 / 8 hours)                               │
│ │                                                             │
│ ├─ Wed 25:                                                     │
│ │  [08:00] ▐████████████████▌ 4h [SA-69289] Full Service    │
│ │  [14:00] ▐██████▌ 1.5h [SA-69290] Follow-up               │
│ │  Capacity: 69% (5.5 / 8 hours)                             │
│ │                                                             │
│                                                                │
│ RESOURCE 2: Agus Setiawan (Service icon)                      │
│ ├─ Mon 23:                                                     │
│ │  [10:00] ▐████████████████████▌ 4.5h [SA-69282] Full Maint │
│ │  [15:00] ▐███▌ 0.5h [SA-69283] Setup                       │
│ │  Capacity: 56% (4.5 / 8 hours)                             │
│ │                                                             │
│ ├─ Tue 24:                                                     │
│ │  [08:00] ▐██████▌ 2h [SA-69286] Inspection                │
│ │  [11:00] ▐████████████▌ 3h [SA-69287] Repair               │
│ │  Capacity: 63% (5 / 8 hours)                               │
│ │                                                             │
│ ├─ Wed 25:                                                     │
│ │  [10:00] ▐████████▌ 2h [SA-69288] Routine Maint            │
│ │  [15:00] ▐████████████▌ 3h [SA-69291] Full Service         │
│ │  Capacity: 63% (5 / 8 hours)                               │
│ │                                                             │
│                                                                │
│ RESOURCE 3: Sdn Aminah (Contractor - Briefcase)               │
│ ├─ Mon 23:                                                     │
│ │  [14:00] ▐██████████▌ 3h [Project Alpha Site A]            │
│ │  Capacity: 100% (3 / 3 hours - Full)                       │
│ │  Status: ⚠ FULLY ALLOCATED                                 │
│ │                                                             │
│ ├─ Tue 24:                                                     │
│ │  [08:00] ▐██████████████████▌ 5h [Project Alpha Site A]    │
│ │  Capacity: 100% (5 / 5 hours - Full)                       │
│ │  Status: ⚠ FULLY ALLOCATED                                 │
│ │                                                             │
│ ├─ Wed 25:                                                     │
│ │  [Available] - Open slots (Can assign new work)             │
│ │  Capacity: 0% (0 / 8 hours)                                │
│ │  Status: ✓ Available                                        │
│ │                                                             │
│                                                                │
│ LEGEND:                                                        │
│ ├─ ▐████▌ = Confirmed Shift (Green color)                     │
│ ├─ ▐▄▄▄▄▌ = Tentative Shift (Yellow color)                    │
│ ├─ ▐░░░░░▌ = Absence/Leave (Gray color)                      │
│ └─ [OVERALLOCATED] = More than 8 hours (Red)                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 4.3 Appointment Card on Gantt

```
APPOINTMENT CARD FORMAT ON GANTT:

┌──────────────────────────────┐
│ ▐████████▌ 2h               │
│ [SA-69283]                  │
│ PM Service                  │
│ Site A                      │
│                              │
│ Status: [NEW/DISPATCHED/...] │
│ [Details] [Reassign]        │
└──────────────────────────────┘

COLOR CODING:
├─ Green: Confirmed Shift
├─ Yellow: Tentative/In-Progress
├─ Orange: Pending
├─ Red: Overdue/High Priority
└─ Gray: Completed/Cancelled

INTERACTIVE FEATURES:
├─ Hover: Shows tooltip (SA#, customer, duration)
├─ Click: Opens appointment details
├─ Drag: Reschedule to different time
└─ Drop: Assign to different mechanic
```

---

## 5. DATE/WEEK/MONTH VIEW OPTIONS

### 5.1 View Toggle

```
┌─────────────────────────────────────┐
│ VIEW OPTIONS                        │
├─────────────────────────────────────┤
│                                     │
│ [Day]  [Week ▼]  [Month]  [Year]   │
│                                     │
│ CURRENT VIEW: Week                  │
│                                     │
│ Week of Oct 23-29, 2024             │
│ ├─ Mon 23                           │
│ ├─ Tue 24                           │
│ ├─ Wed 25 (Today)                   │
│ ├─ Thu 26                           │
│ ├─ Fri 27                           │
│ ├─ Sat 28                           │
│ └─ Sun 29                           │
│                                     │
│ NAVIGATION:                         │
│ [◄ Previous] [Today] [Next ►]       │
│                                     │
│ QUICK JUMP:                         │
│ [📅 Month Picker] [Go to date...]   │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. CAPACITY VISUALIZATION

### 6.1 Resource Capacity Indicators

```
┌──────────────────────────────────────────┐
│ CAPACITY BAR VISUALIZATION               │
├──────────────────────────────────────────┤
│                                          │
│ MECHANIC 1: Budi Santoso                 │
│ ├─ Capacity: 80% [████████░░]            │
│ │  Allocated: 5.5 hours / 8 hours       │
│ │  Status: ✓ Well-balanced              │
│ │  Recommendation: Can accept more      │
│ │                                       │
│ ├─ By Type:                              │
│ │  ├─ Service: 3.5h [████░░░░]          │
│ │  ├─ Maintenance: 1.5h [██░░░░░░]      │
│ │  ├─ Inspection: 0.5h [█░░░░░░░]       │
│ │  └─ Travel: 0.5h [█░░░░░░░]           │
│ │                                       │
│ └─ Daily breakdown:                      │
│    Mon: 80% | Tue: 75% | Wed: 69%       │
│                                          │
│                                          │
│ MECHANIC 2: Agus Setiawan                │
│ ├─ Capacity: 60% [██████░░░░]            │
│ │  Allocated: 5 hours / 8 hours        │
│ │  Status: ✓ Available                  │
│ │  Recommendation: Can accept 3 more    │
│ │                                       │
│ ├─ By Type:                              │
│ │  ├─ Service: 2.5h [███░░░░░]          │
│ │  ├─ Repair: 2.5h [███░░░░░]           │
│ │  └─ Other: 0h [░░░░░░░░░░]            │
│ │                                       │
│ └─ Daily breakdown:                      │
│    Mon: 56% | Tue: 63% | Wed: 63%       │
│                                          │
│                                          │
│ MECHANIC 3: Sdn Aminah                   │
│ ├─ Capacity: 100% [██████████] ⚠        │
│ │  Allocated: 8 hours / 8 hours        │
│ │  Status: ⚠ FULLY ALLOCATED            │
│ │  Recommendation: No more capacity     │
│ │                                       │
│ ├─ By Type:                              │
│ │  ├─ Project Work: 8h [██████████]     │
│ │  ├─ Service: 0h [░░░░░░░░░░]          │
│ │  └─ Maintenance: 0h [░░░░░░░░░░]      │
│ │                                       │
│ └─ Daily breakdown:                      │
│    Mon: 100% (3h) | Tue: 100% (5h)      │
│    Wed: 0% (Available)                   │
│                                          │
│ COLOR CODES:                             │
│ ├─ Green [████]: 0-70% (Good capacity)   │
│ ├─ Yellow [████]: 70-90% (Near full)     │
│ └─ Red [████]: 90-100% (Overallocated)   │
│                                          │
└──────────────────────────────────────────┘
```

---

## 7. DRAG-AND-DROP FUNCTIONALITY

### 7.1 Interaction Model

```
┌────────────────────────────────────────────┐
│ DRAG-AND-DROP SCHEDULING                   │
├────────────────────────────────────────────┤
│                                            │
│ ACTION 1: RESCHEDULE APPOINTMENT            │
│ ────────────────────────────────────       │
│                                            │
│ Step 1: Click & Hold appointment card     │
│ Step 2: Drag to new time slot              │
│ Step 3: Drop on desired time               │
│ Result: Appointment rescheduled            │
│                                            │
│ Example:                                   │
│ SA-69283 [08:00-10:00] ──drag──>           │
│                        └──> [10:00-12:00]  │
│                                            │
│ ✓ Reschedule successful                    │
│ ✓ Notification sent to mechanic             │
│ ✓ Calendar updated                         │
│                                            │
│                                            │
│ ACTION 2: REASSIGN TO DIFFERENT MECHANIC   │
│ ────────────────────────────────────       │
│                                            │
│ Step 1: Click & Hold appointment card     │
│ Step 2: Drag to different mechanic row     │
│ Step 3: Drop on mechanic                   │
│ Result: Appointment reassigned             │
│                                            │
│ Example:                                   │
│ SA-69283 from Budi ──drag──>               │
│                   └──> Agus (same time)    │
│                                            │
│ ✓ Reassignment successful                  │
│ ✓ Both mechanics notified                   │
│ ✓ Capacity updated                         │
│                                            │
│                                            │
│ ACTION 3: EXTEND APPOINTMENT                │
│ ────────────────────────────────────       │
│                                            │
│ Step 1: Hover over appointment border      │
│ Step 2: Click & drag border to new time    │
│ Step 3: Release to extend                  │
│ Result: Duration increased                 │
│                                            │
│ Example:                                   │
│ SA-69283 [08:00-10:00] (2h)                │
│         ──drag right──>                    │
│ SA-69283 [08:00-11:00] (3h)                │
│                                            │
│ ✓ Duration updated                         │
│ ✓ Overlapping conflict check               │
│ ✓ Mechanic notified                        │
│                                            │
│                                            │
│ CONFLICT DETECTION:                        │
│                                            │
│ Red Warning: Cannot drop due to conflict   │
│ ├─ Time overlaps with existing appointment │
│ ├─ Mechanic exceeded capacity              │
│ ├─ Outside working hours                   │
│ └─ Customer unavailable at that time       │
│                                            │
│ Yellow Warning: Soft conflicts             │
│ ├─ Mechanic at 95% capacity                │
│ ├─ Close to end of shift                   │
│ └─ High travel time required               │
│                                            │
│ GREEN CONFIRMATION: Can drop successfully  │
│ ├─ Time slot available                     │
│ ├─ Mechanic has capacity                   │
│ ├─ No conflicts detected                   │
│ └─ Optimal assignment                      │
│                                            │
└────────────────────────────────────────────┘
```

---

## 8. QUICK ACTION MENU

### 8.1 Right-Click Context Menu

```
┌──────────────────────────────────────┐
│ APPOINTMENT CONTEXT MENU             │
│ (Right-click on appointment card)     │
├──────────────────────────────────────┤
│                                      │
│ [Details]          View full details │
│ [Edit]             Edit appointment  │
│ [Reassign]         Assign to mechanic│
│ [Reschedule]       Change date/time  │
│ [Duplicate]        Clone appointment │
│ [Split]            Split into 2 jobs │
│ ─────────────────────────────────── │
│ [Call Mechanic]    Make phone call   │
│ [Send Message]     Send SMS/app msg  │
│ [Email]            Send email        │
│ ─────────────────────────────────── │
│ [Mark Complete]    Finish this job   │
│ [Cancel]           Cancel this job   │
│ [Postpone]         Move to later     │
│ ─────────────────────────────────── │
│ [View History]     Past interactions │
│ [Print]            Print appointment │
│ [Export]           Export data       │
│                                      │
└──────────────────────────────────────┘
```

---

## 9. FILTERS & SEARCH

### 9.1 Advanced Filtering

```
┌──────────────────────────────────────────┐
│ ADVANCED FILTERS                         │
├──────────────────────────────────────────┤
│                                          │
│ QUICK FILTERS (Visible on top):          │
│ ├─ Territory: [JKT ST] [JKT MT] [SDG-C] │
│ ├─ Skill Level: [All Skills ▼]          │
│ ├─ Resource Type: [Internal] [Contract]  │
│ └─ View: [All] [Overallocated] [Free]  │
│                                          │
│ ADVANCED OPTIONS:                        │
│ ├─ Date Range: [From] [To]              │
│ ├─ Status: [All] [New] [Dispatched]     │
│ │         [In-Progress] [Completed]     │
│ ├─ Priority: [All] [High] [Medium] [Low]│
│ ├─ Mechanic Rating: [4.5★+] [All]       │
│ ├─ Capacity: [<50%] [50-80%] [>80%]     │
│ ├─ Duration: [<1h] [1-2h] [2-4h] [>4h] │
│ └─ Cost Range: [Min] [Max]              │
│                                          │
│ SEARCH:                                  │
│ ├─ Customer name                         │
│ ├─ Appointment ID (SA-#####)             │
│ ├─ Location/Site name                    │
│ ├─ Mechanic name                         │
│ └─ Equipment/Asset                       │
│                                          │
│ [Apply Filters] [Reset] [Save as view]  │
│                                          │
│ SAVED VIEWS:                             │
│ ├─ My Assignments                        │
│ ├─ Critical Priority                     │
│ ├─ Overallocated Resources               │
│ ├─ Available Slots                       │
│ └─ [+ Create New View]                   │
│                                          │
└──────────────────────────────────────────┘
```

---

## 10. STATUS INDICATORS & LEGENDS

### 10.1 Color & Status Legend

```
┌────────────────────────────────────────────┐
│ STATUS BADGES & COLOR LEGEND               │
├────────────────────────────────────────────┤
│                                            │
│ APPOINTMENT STATUS:                        │
│ ├─ [NEW] - Yellow badge                   │
│ │  Newly created, not yet assigned         │
│ │                                          │
│ ├─ [DISPATCHED] - Blue badge              │
│ │  Assigned to mechanic, awaiting start    │
│ │                                          │
│ ├─ [IN-PROGRESS] - Green badge            │
│ │  Mechanic actively working               │
│ │                                          │
│ ├─ [PENDING] - Orange badge               │
│ │  Waiting for customer or approval        │
│ │                                          │
│ ├─ [OVERDUE] - Red badge                  │
│ │  Past scheduled completion time          │
│ │                                          │
│ └─ [COMPLETED] - Gray badge               │
│    Job finished successfully               │
│                                            │
│                                            │
│ GANTT BAR COLORS:                          │
│ ├─ Green ▐████▌ - Confirmed Shift         │
│ │  Mechanic confirmed available            │
│ │                                          │
│ ├─ Yellow ▐▄▄▄▄▌ - Tentative Shift       │
│ │  Provisional, not yet confirmed          │
│ │                                          │
│ ├─ Gray ▐░░░░░▌ - Absence/Leave          │
│ │  Mechanic off duty                       │
│ │                                          │
│ ├─ Red ▐████▌ - Overallocated            │
│ │  Exceeds 8-hour capacity                 │
│ │                                          │
│ └─ Striped ▐▒▒▒▒▌ - Tentative Hold       │
│    Awaiting confirmation                  │
│                                            │
│                                            │
│ CAPACITY INDICATORS:                       │
│ ├─ ░░░░░░░░ = 0-25% capacity (Very low)   │
│ ├─ ████░░░░ = 50% capacity (Half full)    │
│ ├─ ████████ = 80% capacity (Near max)     │
│ └─ ███████████ = 100%+ (Overallocated)   │
│                                            │
│                                            │
│ ICONS:                                     │
│ ├─ 🔒 = Internal Staff (Salaried)         │
│ ├─ 👔 = Contractor (External)             │
│ ├─ ⭐ = Top performer (4.8+)              │
│ ├─ ⚠ = Flagged/Needs attention            │
│ ├─ ✓ = Confirmed                          │
│ ├─ ✗ = Cancelled/Unavailable              │
│ └─ 🔄 = Pending confirmation              │
│                                            │
└────────────────────────────────────────────┘
```

---

## 11. BOTTOM STATUS BAR

### 11.1 System Status Information

```
┌────────────────────────────────────────────────────────────────┐
│ STATUS BAR (Bottom of console)                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Unassigned (42)  │  Rule Violations (2)  │  Sync Status: Online │
│                                                                 │
│ Unassigned count:         42 appointments waiting assignment   │
│ Rule violations:          2 scheduling conflicts detected      │
│ Sync Status:              Real-time sync active (green light)  │
│ Last Update:              27 May 2026, 14:35                   │
│ System Health:            ✓ All systems operational            │
│                                                                 │
│ [Refresh ⟳]  [Full Screen] [Help ?]  [Settings ⚙]            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 12. RESPONSIVE BEHAVIOR

### 12.1 Device Breakpoints

```
┌────────────────────────────────────────────┐
│ RESPONSIVE DESIGN BEHAVIOR                 │
├────────────────────────────────────────────┤
│                                            │
│ DESKTOP (1440px+):                         │
│ ├─ Sidebar: 20% (Fixed)                    │
│ ├─ Gantt view: 80% (Full timeline)         │
│ ├─ Multiple time slots visible: 08-17:00   │
│ ├─ 3-4 days visible simultaneously        │
│ └─ All filters & options visible           │
│                                            │
│ LAPTOP (1024px-1440px):                    │
│ ├─ Sidebar: 25% (Fixed)                    │
│ ├─ Gantt view: 75% (Slightly compressed)   │
│ ├─ Time slots visible: 08-17:00            │
│ ├─ 2-3 days visible                        │
│ └─ Filters in dropdown                     │
│                                            │
│ TABLET LANDSCAPE (900px-1024px):           │
│ ├─ Sidebar: Collapsible (icon only)        │
│ ├─ Gantt view: Full width                  │
│ ├─ Time slots: 09:00-17:00 (reduced)       │
│ ├─ 1-2 days visible                        │
│ └─ Horizontal scroll for more hours        │
│                                            │
│ TABLET PORTRAIT (600px-900px):             │
│ ├─ Sidebar: Hidden (tap icon to toggle)    │
│ ├─ Gantt view: Full width                  │
│ ├─ Time slots: 10:00-16:00 (key hours)     │
│ ├─ 1 day visible                           │
│ ├─ Horizontal scroll enabled                │
│ └─ Vertical scroll for resources            │
│                                            │
│ MOBILE (<600px):                           │
│ ├─ Sidebar: Bottom drawer (swipe up)       │
│ ├─ Gantt view: Simplified list view        │
│ ├─ Time slots: 4 hour slots (compressed)   │
│ ├─ Single resource per view                │
│ ├─ Swipe navigation (prev/next day)        │
│ └─ Touch-optimized (44px min targets)      │
│                                            │
└────────────────────────────────────────────┘
```

---

## 13. SYSTEM SPECIFICATIONS

**System:** UT Service Console - Dispatch Module v2.1 (Redesigned)
**Feature Type:** Schedule/Gantt-based Dispatch Console
**View Type:** Calendar Timeline with Resource Allocation
**Last Updated:** 26/05/2026
**Document Version:** Redesigned Console v1.0

---

## 14. SUMMARY - NEW DESIGN BENEFITS

### Key Improvements:
✅ **Gantt Timeline View** - Visual scheduling at a glance
✅ **Drag-and-Drop** - Intuitive appointment rescheduling
✅ **Capacity Visualization** - See mechanic utilization immediately
✅ **Real-Time Sync** - Live updates across all views
✅ **Resource-Centric** - Mechanic row showing all assignments
✅ **Multiple Date View** - See 3-4 days simultaneously
✅ **Color Coding** - Quick status recognition
✅ **Conflict Detection** - Prevent scheduling conflicts
✅ **Quick Actions** - Context menu for common tasks
✅ **Responsive** - Works on all devices
✅ **Filter Rich** - Advanced filtering options
✅ **Performance** - Fast rendering of 40+ appointments

---

*This document provides complete specification for redesigned Dispatch Console with Gantt timeline, resource allocation, and modern scheduling interface.*
