# Case Management System - UI/UX Design Document

## 1. Overview
This design document outlines the Case Management interface with an integrated milestone workflow, case status tracking, and work order management system.

---

## 2. Page Layout Structure

### 2.1 Main Container Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                        CASE HEADER                              │
│  Case #: CASE-20260525-00100 | Priority: Medium | Status: Open  │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                    MILESTONE WORKFLOW                           │
│  ✓ Open → ✓ Assigned → ✓ In Progress → ✓ Resolved → ⊙ Closed   │
└─────────────────────────────────────────────────────────────────┘
┌──────────────────────────┬─────────────────────────────────────┐
│                          │  [10px gap]                         │
│    LEFT PANEL            │      RIGHT PANEL                    │
│                          │                                     │
│  • Case Details          │  • Work Order Details               │
│  • Fleet Units           │  • Milestones & SLA                 │
│  • Customer Info         │  • Timeline Flow                    │
│  • Account Details       │  • Action Buttons                   │
│                          │    - Mark Status as Complete        │
│                          │    - Accept / Acknowledge           │
│                          │                                     │
│                          │  [Check Parts Availability Button]  │
└──────────────────────────┴─────────────────────────────────────┘
```

---

## 3. Case Parameter Field Mapping

### 3.1 Case Status Parameters
```javascript
CASE_STATUS_MAPPING = {
  1: {
    status: "Open",
    badge_color: "#4A90E2",
    icon: "circle-outline",
    workflow_position: 0,
    next_status: 2
  },
  2: {
    status: "Assigned",
    badge_color: "#0073E6",
    icon: "checkmark-circle",
    workflow_position: 1,
    next_status: 3
  },
  3: {
    status: "In Progress",
    badge_color: "#FFB81C",
    icon: "arrow-right-circle",
    workflow_position: 2,
    next_status: 4
  },
  4: {
    status: "Resolved",
    badge_color: "#34C759",
    icon: "checkmark-circle-fill",
    workflow_position: 3,
    next_status: 5
  },
  5: {
    status: "Closed",
    badge_color: "#6C7681",
    icon: "lock-circle",
    workflow_position: 4,
    next_status: null
  }
}
```

---

## 4. Left Panel - Case Details Section

### 4.1 Case Information Header
```
┌──────────────────────────────────────┐
│  Case #: CASE-20260525-00100         │
│  Priority: Medium | Status: Assigned │
│  Created: 26/05/2026 | Owner: System │
└──────────────────────────────────────┘
```

**Fields:**
- Case Number (read-only)
- Priority Badge (High/Medium/Low)
- Current Status Badge
- Created Date
- Last Updated Date
- Case Owner

### 4.2 Fleet Units / Assets Section
```
┌──────────────────────────────────────┐
│  FLEET UNITS (4)                     │
├──────────────────────────────────────┤
│ ☐ GD-829                   [Active]  │
│   Komatsu D85ESS-2                   │
│   HM: 14,250 hrs                     │
│   📍 Site 8-Pit 4                    │
├──────────────────────────────────────┤
│ ☐ GD-830              [Maint. Req.]  │
│   PC200-8                            │
│   HM: 12,500 hrs                     │
│   📍 Site A-Loading                  │
├──────────────────────────────────────┤
│ ☐ GD-831              [Operational]  │
│   WA200-6                            │
│   HM: 16,750 hrs                     │
│   📍 Transportation                  │
├──────────────────────────────────────┤
│ ☐ GD-832               [In Repair]   │
│   D65EX-12                           │
│   HM: 11,200 hrs                     │
│   📍 Workshop                        │
└──────────────────────────────────────┘
```

### 4.3 Affected Unit Details
```
┌──────────────────────────────────────┐
│  AFFECTED UNIT                       │
├──────────────────────────────────────┤
│  Asset ID: EQ-HT-9942                │
│  Model: Komatsu D85ESS-2             │
│  Location: Site B - Pit 4            │
└──────────────────────────────────────┘
```

### 4.4 Account Details Section
```
┌──────────────────────────────────────┐
│  ACCOUNT DETAILS                     │
├──────────────────────────────────────┤
│  Company: PUTRA PERKASA ABADI        │
│  Tier: 1 Enterprise                  │
│  Primary Contact: Andi Wijaya        │
│  Email: andi@putraabadi.co.id        │
│  Phone: +62-811-111-2222             │
└──────────────────────────────────────┘
```

---

## 5. Right Panel - Work Order & Tracking Section

### 5.1 Work Order Object Structure
```
┌─────────────────────────────────────────┐
│  WORK ORDER                             │
├─────────────────────────────────────────┤
│  WO Number: SAP-21315419                │
│  Created: 20/05/2026, 15:27             │
│  Plant: JBI                             │
│  Work Center: FD-JBI                    │
│                                         │
│  Schedule:                              │
│  ├─ Start: 20/05/2026, 15:27            │
│  ├─ End: [Pending Assignment]           │
│  └─ Duration: [Calculated]              │
│                                         │
│  Work Details:                          │
│  ├─ Object Type: Equipment Repair       │
│  ├─ Breakdown: [Standard breakdown]     │
│  ├─ Cause Test: [In Progress]           │
│  └─ Damage Test: [Pending]              │
│                                         │
│  [Check Parts Availability Button]      │
│  [Upload Files Button]                  │
└─────────────────────────────────────────┘
```

### 5.2 Milestones & SLA Tracking
```
┌─────────────────────────────────────────┐
│  🎯 MILESTONES                          │
├─────────────────────────────────────────┤
│  SLA Compliance: 0%                     │
│  ⚠️  OVER SLA - BREACHED: 17 Days       │
│                                         │
│  Targets:                               │
│  ├─ 1st Response: 4h (0.5h ✓)          │
│  ├─ Resolution: 5d (153d ✗)            │
│  └─ OTF Mechanic: FAILED (+6.0d)       │
│     OTF Solution: PENDING              │
│                                         │
│  [Acknowledge Breach Button]            │
└─────────────────────────────────────────┘
```

### 5.3 Timeline Flow Section
```
┌─────────────────────────────────────────┐
│  📅 TIMELINE FLOW                       │
├─────────────────────────────────────────┤
│  26/10/2026 | 14:30                    │
│  ✓ CASE CLOSED                         │
│  System User - SLA review completed    │
│                                         │
│  28/05/2026 | 16:45                    │
│  📝 COMPLETION NOTE                    │
│  "All repairs completed. System tested │
│   and verified."                       │
│                                         │
│  27/05/2026 | 09:00                    │
│  📦 PARTS ARRIVED                      │
│  Warehouse - Items verified and issued │
│  to technician                         │
│                                         │
│  26/05/2026 | 07:31                    │
│  🆕 CASE CREATED                       │
│  System User - Automated case creation │
│  from inspection                       │
│                                         │
│  [View More Timeline Events]            │
└─────────────────────────────────────────┘
```

### 5.4 Action Buttons Section
```
┌─────────────────────────────────────────┐
│  ACTION BUTTONS                         │
├─────────────────────────────────────────┤
│  [✓ Mark Status as Complete]            │
│  [Accept]                               │
│  [Acknowledge Breach]                   │
│  [New Note]                             │
│  [Follow]                               │
│  [Delete]                               │
└─────────────────────────────────────────┘
```

---

## 6. Milestone Workflow Component

### 6.1 Visual Workflow Bar
```
Status Progress Indicator:
═══════════════════════════════════════════════════════════

  ✓ Open (100%)
   ├─ Completed on: 26/05/2026
   └─ Duration: [Auto]
   
  ✓ Assigned (100%)
   ├─ Completed on: 26/05/2026
   └─ Duration: [Auto]
   
  ✓ In Progress (100%)
   ├─ Completed on: 26/05/2026
   └─ Duration: [Auto]
   
  ✓ Resolved (100%)
   ├─ Completed on: 26/05/2026
   └─ Duration: [Auto]
   
  ⊙ Closed (Current - In Progress)
   ├─ Target Date: [Set by SLA]
   ├─ Remaining: 21 days
   └─ [Mark Status as Complete] ← PRIMARY ACTION BUTTON

═══════════════════════════════════════════════════════════
```

---

## 7. Mark Status Component

### 7.1 Status Transition Logic
```
CURRENT_STATUS = getStatusParameter(caseId)

if (CURRENT_STATUS < 5) {
  next_status = CURRENT_STATUS + 1
  display [Mark Status as Complete] button
  
  onClick:
    → Calculate elapsed time
    → Validate SLA compliance
    → Update case_parameter field
    → Update workflow position
    → Add timeline entry
    → Send notification
    → Refresh UI
}
```

### 7.2 Mark Status Button States

**Default State:**
```
┌────────────────────────────────────┐
│ ✓ Mark Status as Complete          │
│   Click to advance: In Progress    │
│   → Resolved                       │
└────────────────────────────────────┘
```

**Hover State:**
```
┌────────────────────────────────────┐
│ ✓ Mark Status as Complete [Active] │
│   Advancing to: Resolved           │
│   SLA Status: On-Time              │
└────────────────────────────────────┘
```

**Disabled State (When status = Closed):**
```
┌────────────────────────────────────┐
│ ⊗ Case Closed - No Further Changes │
│   Status is finalized              │
└────────────────────────────────────┘
```

---

## 8. Spacing & Layout Specifications

### 8.1 Layout Dimensions
```
Container Width: 100%
Left Panel Width: 48%
Right Panel Width: 48%
Gap Between Panels: 10px (CSS: gap: 10px)

Breakpoints:
├─ Desktop (1200px+): Full layout
├─ Tablet (768px-1199px): Stack panels vertically
└─ Mobile (<768px): Single column layout

Internal Padding:
├─ Panel Padding: 16px
├─ Section Padding: 12px
├─ Element Gap: 8px
└─ Button Spacing: 8px between buttons
```

### 8.2 Card Layout
```
┌─ [Padding: 16px] ─────────────────────┐
│                                        │
│  ┌─────────────────────────────────┐  │
│  │  Section Header [Font-weight: 600]  │
│  ├─────────────────────────────────┤  │
│  │                                 │  │
│  │  Content [Font-weight: 400]      │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                        │
└─ [Padding: 16px] ─────────────────────┘
```

---

## 9. Data Flow & Interactions

### 9.1 Case Parameter Field
```
Field Name: case_parameter
Data Type: Integer (1-5)
Read Only: No
Validation Rules:
├─ Must be numeric
├─ Range: 1-5
└─ Cannot skip stages (2 requires 1 to be complete)

Location: Hidden from UI (Backend metadata)
Usage: Determines workflow position, button states, and SLA tracking
```

### 9.2 Status Update Flow
```
User Action: Click "Mark Status as Complete"
    ↓
Validation: Check case_parameter value
    ↓
Calculate: Elapsed time since last status change
    ↓
Check: SLA compliance for current stage
    ↓
Update: case_parameter = case_parameter + 1
    ↓
Trigger: Workflow redraw with new status
    ↓
Create: Timeline entry with timestamp
    ↓
Notify: Assign team members (if applicable)
    ↓
Refresh: UI components (milestones, buttons)
```

---

## 10. Color Palette & Styling

### 10.1 Status Colors
```
Open (#4A90E2):
├─ Background: rgba(74, 144, 226, 0.1)
├─ Border: #4A90E2
└─ Text: #4A90E2

Assigned (#0073E6):
├─ Background: rgba(0, 115, 230, 0.1)
├─ Border: #0073E6
└─ Text: #0073E6

In Progress (#FFB81C):
├─ Background: rgba(255, 184, 28, 0.1)
├─ Border: #FFB81C
└─ Text: #FFB81C

Resolved (#34C759):
├─ Background: rgba(52, 199, 89, 0.1)
├─ Border: #34C759
└─ Text: #34C759

Closed (#6C7681):
├─ Background: rgba(108, 118, 129, 0.1)
├─ Border: #6C7681
└─ Text: #6C7681

Alert/SLA Breach (#E74C3C):
├─ Background: rgba(231, 76, 60, 0.1)
├─ Border: #E74C3C
└─ Text: #E74C3C
```

### 10.2 Typography
```
Heading 1 (Case Number): 24px, Weight: 700
Heading 2 (Section Headers): 16px, Weight: 600
Body Text: 14px, Weight: 400
Secondary Text: 12px, Weight: 400, Color: #999
Badge Text: 12px, Weight: 500
Button Text: 14px, Weight: 500
```

---

## 11. Responsive Design

### 11.1 Desktop View (1200px+)
- Two-column layout with 10px gap
- Left panel: Case details and assets
- Right panel: Work order and timeline
- All sections visible simultaneously

### 11.2 Tablet View (768px-1199px)
- Stack panels vertically
- Full width for each panel
- Maintain all functionality
- Adjust button sizing if needed

### 11.3 Mobile View (<768px)
- Single column layout
- Collapsible sections
- Full-width buttons
- Optimized touch targets (44px minimum)

---

## 12. Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Semantic HTML structure
- ARIA labels for button states
- Color not the only indicator (icons/text required)
- Keyboard navigation support
- Focus indicators on interactive elements
- Screen reader friendly timeline

---

## 13. Error Handling & Edge Cases

### 13.1 Cannot Mark Status Complete If:
- Case is already in "Closed" status
- Required fields are missing
- SLA has been breached beyond threshold
- User lacks permissions

**Error Message:**
```
⚠️  Action Unavailable
Cannot advance status. [Reason]
Contact administrator for assistance.
```

### 13.2 SLA Breach Handling
```
If elapsed_time > target_time:
├─ Display red "OVER SLA - BREACHED" indicator
├─ Show days exceeded: "17 Days"
├─ Enable "Acknowledge Breach" button
├─ Add warning icon to workflow bar
└─ Flag in timeline for escalation
```

---

## 14. Implementation Notes

- Use CSS Grid for layout with 10px gap property
- Implement case_parameter as database field
- Create status mapping object in frontend
- Debounce timeline updates
- Cache case data for performance
- Implement real-time updates via WebSocket
- Add audit logging for status changes

---

**Document Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Ready for Development
