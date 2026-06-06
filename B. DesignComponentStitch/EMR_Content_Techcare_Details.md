# EMR Tab Content Planning & Sidebar Panels
## Detailed Content Structure and Data Layout (English)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Sidebar Panels](#sidebar-panels)
- [Tab Navigation Structure](#tab-navigation-structure)
- [Details Tab](#details-tab)
- [FAR Tab](#far-tab)
- [TSI Tab](#tsi-tab)
- [TSR Tab](#tsr-tab)
- [Feed Tab](#feed-tab)

---

## Overview

### Purpose
This document provides comprehensive planning for all tab contents and sidebar panels in the EMR (Equipment Maintenance Record) system. It details the data structure, field specifications, validation rules, and visual representations for each section.

### Scope
- **Tabs**: Details, FAR, TSI, TSR, Feed
- **Sidebar Panels**: Upload Techcare Files, Get Image From Azure, EMR Additional Files, EMR Lead Time
- **Documentation**: English language with detailed specifications

### Key Sections
Each section includes: Purpose, Structure, Field Specifications, Data Models, and UI Layout

---

## Sidebar Panels

### Panel 1: Upload Techcare Files

**Purpose**: Upload and manage TechCare service documentation files

**Icon**: 📁 **Color**: #FF9800 (Amber)

#### Structure

```
Upload Techcare Files Panel
├── Dialog Title: "Upload Techcare Files"
├── Upload Area: Drag & drop zone (2px dashed border)
├── File Categories: Service Report, Technical Notes, Photos, etc.
├── File List: Recently uploaded files
├── Max File Size: 50MB per file
├── Supported Formats: PDF, DOCX, XLSX, JPG, PNG, ZIP
└── Actions: Cancel, Clear All, Upload Files
```

#### Field Specifications

| Field | Type | Required | Max Length | Validation |
|-------|------|----------|-----------|------------|
| Filename | Text | Yes | 255 | No special chars |
| File Category | Dropdown | Yes | - | Service Report, Technical Notes, Field Photos, Work Doc, Customer Comm, Other |
| File Size | Number | Auto | - | ≤ 50MB |
| Upload Date | DateTime | Auto | - | YYYY-MM-DD HH:MM:SS |
| Uploaded By | User Link | Auto | - | Current user |
| File Description | Text | No | 500 | Optional notes |
| Tags | Array | No | - | Search tags |

#### Recent Uploads Display
```
Shows last 10 uploads with:
- Filename (clickable)
- File Size (formatted: 2.4 MB)
- Upload Date (relative: "2 days ago")
- Uploaded By (user name)
- Actions (View, Download, Delete)
```

---

### Panel 2: Get Image From Azure

**Purpose**: Fetch and display images from Azure cloud storage

**Icon**: ☁️ **Color**: #2196F3 (Blue)

#### Structure

```
Get Image From Azure Panel
├── Sync Status: "Synced 3 min ago"
├── Image Count: 24 images available
├── Categories: Field Photos (18), Diagrams (4), History (2)
├── Quick View: 6 thumbnail grid
├── Actions: Sync Now, View Gallery
└── Gallery Modal: 4-column grid with filters
```

#### Image Categories

```
Field Photos (18)
├── Equipment Condition Photos
├── Problem Area Close-ups
├── Environmental Context
└── Before/After Comparison

Equipment Diagrams (4)
├── Component Layout
├── Wiring Schematic
├── Assembly Instructions
└── Part Identification

Maintenance History (2)
├── Previous Service Photos
└── Historical Comparison
```

#### Sync Process

```
Trigger: Manual click, Auto-sync (5 min), Panel open
Steps:
1. Connect to Azure Storage Account
2. List all images for current EMR
3. Compare with local cache
4. Download new/updated images
5. Update thumbnails
6. Show completion notification
7. Refresh gallery view

Status Messages:
- "Syncing... (3/24)"
- "Sync complete: 3 new images found"
- "No new images found"
- "Sync failed: Connection timeout - Retry"
```

#### Gallery Display

```
Per Image:
├── Thumbnail (150x150px)
├── Hover Effects: Preview, Download, Add to EMR
├── Image Title (truncated)
├── Upload Date
├── File Size
└── Actions: View, Download, Share, Add to EMR
```

---

### Panel 3: EMR Additional Files

**Purpose**: View and manage additional files attached to EMR

**Icon**: 📎 **Color**: #9C27B0 (Purple)

#### Structure

```
EMR Additional Files Panel
├── Filter Options: All, By Type, By Date, By Size
├── Search Box: Search files...
├── File List: Table with 6 documents
│   ├── Icon + Filename
│   ├── File Size
│   ├── Date Added
│   └── Actions (View, Download, Delete)
├── File Count Badge: 6 total files
└── Upload More: Quick upload link
```

#### File Organization

```
File Types:
├── 📄 PDF Documents
├── 📊 Excel Spreadsheets
├── 📝 Word Documents
├── 🖼️ Images
├── 📁 Archives (ZIP)
└── 📎 Other Files

Filter Options:
├── All Files (default)
├── Documents (PDF, DOCX, XLSX)
├── Images (JPG, PNG, GIF)
├── Archives (ZIP, RAR)
├── By Date: Today, This Week, This Month, Custom
├── By Size: <1MB, 1-10MB, 10-50MB, >50MB
└── By Status: Recent, Archived, Shared
```

#### File Preview Capability

```
Viewable Types:
├── PDF: Full-page viewer with zoom/scroll
├── Images: Full-size display with zoom
├── Text: Code editor view with syntax highlighting
└── Excel: Spreadsheet preview (first sheet)

Preview Actions:
├── [ Download ]
├── [ Share ]
├── [ Print ]
└── [ Close ]
```

---

### Panel 4: EMR Lead Time

**Purpose**: Track EMR processing time and SLA status

**Icon**: ⏱️ **Color**: #2196F3 (Blue)

#### Structure

```
EMR Lead Time Panel
├── Overall Status: On Track ✓
├── Lead Time Entries:
│   ├── Entry 1: L/T Create TSI (0 days)
│   └── Entry 2: L/T Re-Submit (2 days)
├── SLA Tracking:
│   ├── Target Completion: 30 days
│   ├── Days Elapsed: 14 days
│   ├── Days Remaining: 16 days
│   └── Progress: [██████████---] 47%
└── Actions: View Detailed Timeline
```

#### Lead Time Entry Fields

```
Per Entry:
├── Entry Number: 1, 2, 3
├── Entry Name: "L/T Create TSI"
├── Lead Time Duration: 0 days (or 2.5 hours)
├── From Status: "Closed"
├── To Status: "Closed"
├── Last Modified: 20/05/2026, 07:25
├── Created By: User name
└── Notes: Optional description
```

#### SLA Status Colors

```
🟢 On Track: SLA% ≤ 80%
🟡 At Risk: 80% < SLA% < 100%
🔴 Overdue: SLA% ≥ 100%
```

#### Timeline Modal

```
Displays:
├── Vertical timeline with checkpoints
├── Date/time markers on left
├── Event circle (color-coded)
├── Entry details on right
├── Connection lines between events
├── Stats summary (total, average, longest)
└── Export options (PDF, Excel, Print)
```

---

## Tab Navigation Structure

### Overview

```
Tab Bar:
├── Position: Below subject banner (sticky)
├── Height: 48px
├── Tabs: Details | FAR | TSI | TSR | Feed
├── Default Active: Details
├── Content: Fades in on tab switch
└── URL Update: #/emr/U-00021652?tab=FAR
```

### Tab Styling

```
Inactive Tab:
├── Color: #757575
├── Border-bottom: 2px transparent
└── Background: Transparent

Active Tab:
├── Color: #1976D2 (Blue)
├── Border-bottom: 2px solid #1976D2
└── Font-weight: 600

Hover:
├── Color: #1976D2
└── Border-bottom: 1px dashed #1976D2
```

---

## Details Tab

### Overview

Displays comprehensive EMR information in expandable sections.

### Section 1: EMR Basic Information

**Expanded by Default**: Yes

```
Fields:
├── EMR Name: U-00021652 (read-only, monospace)
├── Description: "Go Live Mekanik Shift secara Nasional" (text, 500 char max)
├── Supervisor/Analyst: "TSI KMIUT20260598 by Gamal" (user link, multi-line)
├── Priority: [Critical | High | Medium | Low] (dropdown)
│   └── Color codes: Red, Orange, Amber, Green
└── EMR Status: Closed (badge, read-only, clickable for history)
```

### Section 2: Asset & Equipment Information

**Expanded by Default**: Yes

```
Left Column (50%):
├── Asset ID/Code: "PC135F-10M0/24 - J12646" (link to asset)
├── Machine Model: "PC135F-10M0" (link)
├── Serial Number: "J12646" (text + QR barcode)
├── Machine Product: "KOMATSU" (link to manufacturer)
└── Machine Group: "KLTD" (dropdown, equipment category)

Right Column (50%):
├── Asset Condition: [New | Good | Fair | Poor | Repair]
├── Current Location: "Jambi, Indonesia" (with GPS map)
├── Operational Status: [Running | Idle | Maintenance | Out of Service]
├── Acquisition Date: 26/09/2025 (date picker)
└── Asset Value: USD $XXXXX.XX (currency, finance only)
```

### Section 3: Operator/Owner Information

**Expanded by Default**: Yes

```
Fields:
├── Owner Company: "SINAR AGUNG LESTARI PRATAMA" (link + logo)
├── Operator Name: "[Name]" (user link + contact)
├── Site/Branch: "Jambi" (location link)
├── Contact Information:
│   ├── Phone: [Clickable phone]
│   ├── Email: [Mailto link]
│   ├── Address: [Full address]
│   └── Timezone: [Auto-detected]
├── Warranty Information:
│   ├── Warranty Status: ACTIVE / EXPIRED
│   ├── Start Date: 26/09/2025
│   ├── End Date: 26/09/2027 (2 years)
│   ├── Days Remaining: 365 days
│   ├── Coverage Type: Comprehensive
│   └── Provider: Komatsu
└── Service Contract:
    ├── Type: Maintenance / SLA / Premium
    ├── Duration: 12 months
    ├── End Date: [Highlighted if expiring]
    ├── Response Time: 24 hours
    └── Covered Services: [Checkbox list]
```

### Section 4: EMR Creation & Tracking

**Expanded by Default**: No

```
Fields:
├── Created Date: 20/05/2026, 07:24 (read-only)
├── Created By: "GAMAL HARI PRASETYO" (user link + avatar)
├── Last Modified: 20/05/2026, 07:25 (read-only, relative time)
├── Last Modified By: "GAMAL HARI PRASETYO" (user link)
├── EMR Version: 1.2.5 (read-only, version history link)
├── Record Status History: (expandable timeline)
│   ├── Status changes with dates/users
│   └── Click to see change details
└── External References: (link lists)
    ├── Related Work Orders
    ├── Related Cases
    ├── Related PMs
    └── Related Documents
```

### Section 5: Service Interval & Maintenance

**Expanded by Default**: Yes

```
Fields:
├── Last Service Date: 19/04/2026 (date picker, 31 days ago)
├── Next Scheduled Service: 20/06/2026 (24 days remaining)
├── Service Interval: 30 days (number, admin only)
├── Hours on Component: XXXX hours (number with trending)
├── Service History: (expandable list, last 10)
│   ├── Date
│   ├── Service Type: Preventive / Corrective
│   ├── Mechanic Name
│   ├── Work Order Link
│   └── Description
└── Maintenance Plan:
    ├── Plan Type: [Preventive | Reactive | Hybrid]
    ├── Plan Level: [Standard | Premium | Custom]
    ├── Coverage Items: [Checklist]
    └── Next Scheduled PM: [Date link]
```

### Section 6: Additional Details

**Expanded by Default**: No

```
Fields:
├── Internal Notes: [Rich text, 2000 char, markdown support, @mentions]
├── Custom Fields: [As per system configuration]
├── Tags/Labels: [Taggable input, #critical #urgent, color-coded]
├── Attachments Count: "6 files attached" (link to file panel)
├── Related EMRs: [Links to EMRs for same asset, max 5 shown]
└── System Information:
    ├── Record ID: U-00021652
    ├── Database ID: [Internal ID]
    ├── Storage Location: [Path info]
    └── Archived: [Yes/No toggle, admin only]
```

---

## FAR Tab

### Overview

First Appearance Report - captures initial problem identification and preliminary investigation.

### Section 1: Problem Identification

**Expanded by Default**: Yes

```
Fields:
├── Problem Category:
│   ├── Mechanical Failure
│   ├── Electrical/Electronic
│   ├── Hydraulic System
│   ├── Structural Issue
│   ├── Software/Control Issue
│   ├── Environmental Damage
│   ├── Wear and Tear
│   └── Other

├── Problem Severity:
│   ├── 🔴 Critical: System inoperational
│   ├── 🟠 Major: Significant function loss
│   ├── 🟡 Minor: Some functionality affected
│   └── 🟢 Low: Cosmetic/very minor

├── First Appearance Description: [Rich text, 3000 char max, required]
│   └── Structure: What happened / When / How discovered / Initial impact

├── Observed Symptoms: [Checklist + custom text]
│   ├── ☐ No power/No response
│   ├── ☐ Unusual noise
│   ├── ☐ Overheating
│   ├── ☐ Fluid leak
│   ├── ☐ Error messages/Codes
│   ├── ☐ Reduced performance
│   ├── ☐ Vibration
│   ├── ☐ Smoke/Burning smell
│   ├── ☐ Discoloration/Damage
│   └── ☐ Other: [Text field]

└── Environmental Conditions:
    ├── Temperature: [°C, range: -20 to 60]
    ├── Humidity: [%, range: 0 to 100]
    ├── Operating Hours: [Number]
    ├── Load/Usage: [%, range: 0-100]
    ├── Recent Weather: [Text/Dropdown]
    ├── Location Conditions: [Text area]
    └── Recent Changes: [Yes/No + details]
```

### Section 2: Incident Timeline

**Expanded by Default**: Yes

```
Fields:
├── Date/Time First Noticed: 23/04/2026, 15:13 (date/time picker, to minutes)
├── How Problem Noticed: [Large text display]
│   └── "MOTOR WIPER INTERNAL DEFECT"
│   └── Options: Operator during use / Routine inspection / Maintenance / Complaint / Monitoring / Other
│   └── Detailed account: [Rich text area]

├── Duration of Problem:
│   ├── First Occurrence: [Date/time]
│   ├── Frequency: [One-time | Intermittent | Regular | Continuous]
│   └── Pattern: [If intermittent, describe pattern]

├── Immediate Response Taken: [Checklist]
│   ├── ☐ Equipment stopped/shut down
│   ├── ☐ Isolation/Lockout applied
│   ├── ☐ Safety measures implemented
│   ├── ☐ Workaround implemented
│   ├── ☐ Temporary repair attempted
│   ├── ☐ Service call placed
│   ├── ☐ Escalated to management
│   └── ☐ Other: [Specify]
│   └── Who took action: [Name + timestamp]
│   └── Effectiveness: [1-5 scale]

└── Safety Assessment:
    ├── Safety Risk Level: [Critical | High | Medium | Low]
    ├── Risk Factors: [Checklist]
    ├── Mitigation Measures: [Text]
    ├── PPE Required: [Checkboxes]
    └── Safety Clearance Required: [Yes/No]
```

### Section 3: Initial Investigation Findings

**Expanded by Default**: Yes

```
Fields:
├── Visual Inspection Results:
│   ├── Visible Damage: [Yes/No/Partial]
│   ├── Damage Description: [Rich text]
│   ├── Photos: [Azure image links + upload]
│   │   ├── Before photos (required)
│   │   ├── Close-up details
│   │   ├── Environmental context
│   │   └── Comparison reference
│   └── Measurable Findings: [Dimensions, fluid levels, leak rate, etc.]

├── Preliminary Root Cause Assessment:
│   ├── Suspected Cause(s): [Multi-select]
│   │   ├── ☐ Manufacturing defect
│   │   ├── ☐ Design limitation
│   │   ├── ☐ Maintenance failure
│   │   ├── ☐ Operator error
│   │   ├── ☐ External damage/accident
│   │   ├── ☐ Environmental factors
│   │   ├── ☐ Normal wear and tear
│   │   ├── ☐ Component fatigue
│   │   └── ☐ Unknown/Further investigation needed
│   ├── Supporting Evidence: [Rich text area]
│   └── Confidence Level: [Low | Medium | High]

├── Affected Components/Systems: [Table]
│   ├── Primary Component:
│   │   ├── Component Name
│   │   ├── Part Number (link)
│   │   ├── Serial Number
│   │   ├── Age/Hours
│   │   ├── Condition: [Good/Fair/Poor/Failed]
│   │   └── Photo/Diagram
│   └── Secondary Components: [Additional rows]

├── Scope Assessment:
│   ├── Localized Issue: [Yes/No]
│   ├── Affects Only One System: [Yes/No]
│   ├── Potential for Spreading: [Yes/No/Unknown]
│   ├── Other Units Affected: [Yes/No/Unknown, list IDs if yes]
│   ├── Recommendation: [Multiple choice]
│   │   ├── ☐ Immediate repair required
│   │   ├── ☐ Can wait for scheduled service
│   │   ├── ☐ Quarantine unit
│   │   ├── ☐ Escalate to engineering
│   │   └── ☐ Issue recall/bulletin
│   └── Priority: [Critical | High | Medium | Low]

└── Next Steps Recommendation:
    ├── Recommended Action: [Multiple choice]
    │   ├── ☐ Full troubleshooting investigation
    │   ├── ☐ Component replacement
    │   ├── ☐ System overhaul
    │   ├── ☐ Return to manufacturer
    │   ├── ☐ Field testing required
    │   └── ☐ Other
    ├── Estimated Timeline: [Hours/Days]
    ├── Estimated Cost: [Currency]
    ├── Required Parts/Materials: [List]
    ├── Required Expertise: [Skill level/Certifications]
    └── Urgency: [ASAP | Scheduled | Can defer]
```

---

## TSI Tab

### Overview

Technical Service Investigation - detailed diagnostic findings from comprehensive troubleshooting.

### Section 1: Detailed Troubleshooting

**Expanded by Default**: Yes

```
Fields:
├── Diagnostic Tests Performed: [Checklist with results]
│   ├── ☐ Visual Inspection
│   ├── ☐ Functional Test: [Method | Expected | Actual | Pass/Fail]
│   ├── ☐ Performance Measurement: [Parameter | Unit | Expected | Actual]
│   ├── ☐ Electrical Testing: [Voltage | Current | Resistance | Continuity]
│   ├── ☐ Fluid Analysis: [Type | Level | Color | Contamination | Lab Results]
│   ├── ☐ Vibration Analysis: [Baseline | Current | Frequency | Anomalies]
│   ├── ☐ Thermal Imaging: [Image | Temperature Map | Hotspots | Ranges]
│   └── ☐ Other Tests: [Specify + Results]

├── Troubleshooting Steps Documented: [Ordered list with outcomes]
│   ├── Step 1:
│   │   ├── Action: [What was done]
│   │   ├── Result: [What happened]
│   │   ├── Observation: [What was learned]
│   │   ├── Time Taken: [Minutes/Hours]
│   │   └── Next Step: [Based on result]
│   ├── Step 2, 3, N: [Same format]
│   └── Conclusion: [What was ultimately determined]

├── Component Isolation Testing: [Test matrix/table]
│   ├── Component | Tested? | Result | Notes
│   ├── Motor Wiper | Yes | FAILED | Internal damage
│   ├── Motor Driver | Yes | PASS | Functioning normally
│   └── [More components...]

└── Diagnostic Equipment Used: [List with specs]
    ├── Equipment Name
    ├── Model/Serial
    ├── Last Calibration: [Date, Valid: Yes/No]
    └── Accuracy: [±X%]
```

### Section 2: Root Cause Analysis

**Expanded by Default**: Yes

```
Fields:
├── Problem Statement: [Text summary]
├── Root Cause Identified:
│   ├── Primary Cause: [Clearly stated + Evidence + Probability]
│   ├── Contributing Factors: [Factor 1, 2, N with evidence]
│   └── Ruling Out Other Causes: [Alternatives considered]

├── Root Cause Category: [Classification]
│   ├── Material/Component Defect
│   ├── Design Issue
│   ├── Manufacturing Defect
│   ├── Installation/Setup Error
│   ├── Maintenance Inadequacy
│   ├── Operator Misuse
│   ├── Environmental Factor
│   ├── Normal Wear and Tear
│   └── Unknown
│   └── Warranty Applicable: [Yes/No]

├── Failure Mode Analysis:
│   ├── Failure Mode: [How did it fail]
│   ├── Failure Mechanism: [Physics of failure]
│   ├── Accelerating Factors: [What made it worse]
│   ├── Timeline to Failure: [When/how fast]
│   ├── Prevention Possible: [Y/N + method]
│   ├── Early Detection Possible: [Y/N + indicators]
│   └── Recurring Risk: [Likelihood in field]

├── Similar Cases Analysis:
│   ├── Has Similar Occurred: [Yes/No/Unknown]
│   ├── Previous EMR References: [Links]
│   ├── Equipment Affected: [Count/models]
│   ├── Total Occurrences: [Number]
│   ├── Frequency Trend: [Graph/increasing?]
│   ├── Suggested Fix: [If established]
│   └── Bulletin/Notice: [Link if applicable]

└── Investigation Conclusion: [Rich text summary]
    ├── Clear statement of findings
    ├── Confidence level
    ├── Limitations in investigation
    └── Areas requiring further study
```

### Section 3: Technical Findings & Analysis

**Expanded by Default**: Yes

```
Fields:
├── Component Failure Details:
│   ├── Failed Component:
│   │   ├── Name
│   │   ├── Part Number (link)
│   │   ├── Serial Number
│   │   ├── Function
│   │   ├── Specifications: [Power, Voltage, Frequency, etc.]
│   │   └── Age: [Date installed / Operating hours]
│   │
│   ├── Failure Evidence:
│   │   ├── Visual Signs: [Discoloration, burn marks, etc.]
│   │   ├── Photos: [Links]
│   │   ├── Measurements: [Actual vs. Spec]
│   │   └── Test Results: [From diagnostics]
│   │
│   ├── Failure Characteristics:
│   │   ├── Failure Type: [Mechanical/Electrical/Thermal/etc.]
│   │   ├── Extent: [Partial/Complete]
│   │   ├── Suddenness: [Gradual/Sudden/Intermittent]
│   │   ├── Secondary Damage: [Y/N + details]
│   │   └── Safety Impact: [Injury risk/Equipment damage]
│   │
│   └── Lab Analysis:
│       ├── Analysis Performed: [Yes/No]
│       ├── Lab/Facility: [Name]
│       ├── Analysis Type: [Metallurgy/Chemical/etc.]
│       ├── Key Findings: [Summary]
│       └── Full Report: [Link]

├── Design/Specification Comparison:
│   ├── Design Intent: [What was intended]
│   ├── Manufacturer Specification: [What spec says]
│   ├── Actual Performance: [What was found]
│   ├── Variance: [How much different]
│   ├── Within Tolerance: [Yes/No]
│   └── Design Recommendation: [Any improvement]

├── Environmental Factors Impact:
│   ├── Operating Conditions:
│   │   ├── Temperature: [Actual vs. Rated]
│   │   ├── Humidity: [Actual vs. Rated]
│   │   ├── Altitude: [Location altitude]
│   │   ├── Load/Usage: [Actual vs. Design]
│   │   └── Hours of Operation: [Usage rate]
│   │
│   ├── Environmental Stressors:
│   │   ├── Vibration: [High/Normal/Low]
│   │   ├── Contamination: [Types present]
│   │   ├── Corrosion: [Salt/Moisture/etc.]
│   │   ├── Weather: [Rain/UV/Extreme temps]
│   │   └── Chemical: [Types]
│   │
│   ├── Site Maintenance Quality: [Good/Fair/Poor]
│   └── Factor Contribution: [Did environment cause failure?]

└── Technical Documentation References:
    ├── Equipment Manual: [Link]
    ├── Troubleshooting Guide: [Link]
    ├── Service Bulletin: [Link]
    ├── Engineering Drawing: [Link]
    ├── Component DataSheet: [Link]
    ├── Warranty Terms: [Link]
    └── Similar Case References: [Links]
```

---

## TSR Tab

### Overview

Technical Service Report - documents corrective actions, parts used, and repair verification.

### Section 1: Corrective Action Plan

**Expanded by Default**: Yes

```
Fields:
├── Recommended Solution:
│   ├── Primary Solution:
│   │   ├── Action Type: [Replace | Repair | Adjust | Software | Overhaul | Other]
│   │   ├── Detailed Procedure: [Step-by-step instructions]
│   │   ├── Estimated Duration: [Hours]
│   │   ├── Required Tools: [List with specs]
│   │   ├── Required Parts: [See Section 2]
│   │   ├── Required Skills/Certifications: [List]
│   │   ├── Safety Precautions: [Detailed list]
│   │   ├── Approval Required: [Yes/No + from whom]
│   │   └── Alternative Approaches: [If applicable]
│   │
│   ├── Secondary Actions: [If multiple steps needed]
│   │   ├── Action 2: [Details]
│   │   └── Action 3: [As needed]
│   │
│   ├── Temporary Workarounds: [If repair delayed]
│   │   ├── Workaround 1: [Description]
│   │   ├── Limitations: [What won't work]
│   │   ├── Duration: [How long suitable]
│   │   └── Safety: [Any safety concerns?]
│   │
│   └── Why This Solution:
│       ├── Addresses Root Cause: [Yes/No]
│       ├── Cost-Effective: [Yes/No]
│       ├── Permanent vs. Temporary: [Classification]
│       └── Long-term Reliability: [Expected outcome]

├── Prevention Measures:
│   ├── To Prevent Recurrence:
│   │   ├── Preventive Maintenance: [Recommended schedule]
│   │   ├── Operating Procedures: [How to operate correctly]
│   │   ├── Environmental Controls: [Temp/Humidity/etc.]
│   │   ├── Inspection Frequency: [Regular checks]
│   │   ├── Component Monitoring: [What to watch for]
│   │   ├── Maintenance Training: [For operator/tech]
│   │   └── Documentation: [What to track]
│   │
│   ├── Industry Recommendations: [If applicable]
│   ├── Customer Communication: [What to tell operator]
│   └── Follow-up Plan: [Schedule for verification]

└── Approval & Authorization:
    ├── Approved By: [Manager name + date]
    ├── Authorization Level: [Standard | Premium | Special]
    ├── Budget Approval: [If cost > threshold]
    ├── Customer Notification: [Done/Pending]
    └── Work Order Created: [Link]
```

### Section 2: Parts & Materials Used

**Expanded by Default**: Yes

```
Fields:
├── Main Component Replaced:
│   ├── Component Name: "Motor Wiper Assembly"
│   ├── Part Number: [OEM number]
│   ├── Supplier: [Supplier name]
│   ├── Serial Number: [Of replacement]
│   ├── Quantity: 1
│   ├── Unit Price: [Currency]
│   ├── Total Cost: [Qty × Unit price]
│   ├── Warranty: [Replacement warranty terms]
│   ├── Source: [New | Refurbished | Reconditioned]
│   ├── Barcode: [Scannable code]
│   └── Received Date: [When arrived]
│   
│   ├── Old Component Disposition:
│   │   ├── Removed/Retained: [Date/time]
│   │   ├── Inspection Results: [Findings]
│   │   ├── Condition: [Working/Failed/Marginal]
│   │   ├── Disposition: [Returned | Sent to Repair | Archived | Scrapped | Customer]
│   │   └── Analysis Pending: [Yes/No]
│   
│   └── Installation Details:
│       ├── Installed Date: [Timestamp]
│       ├── Installed By: [Mechanic name]
│       ├── Installation Time: [Duration in hours]
│       ├── Installation Method: [Per manual/documented]
│       ├── Torque Specs Applied: [If applicable]
│       ├── Initial Test: [Passed/Failed]
│       └── Photo Documentation: [Links]

├── Secondary Parts/Fasteners: [Table]
│   ├── Description | Part Number | Quantity | Unit Price | Notes
│   ├── Gasket Seal Kit | 2A5-53-12721 | 1 | $15.50 | New seals
│   ├── Fastener Set | ZZZ-1234 | 1 | $8.25 | Screws + washers
│   └── [More items...]

├── Materials & Consumables:
│   ├── Lubricant: [Type | Quantity | Cost]
│   ├── Sealant: [Type | Quantity | Cost]
│   ├── Cleaner: [Type | Quantity | Cost]
│   └── Other: [Any other consumables]
│   
│   ├── Waste Management:
│   │   ├── Old Oil Disposal: [Method]
│   │   ├── Coolant Disposal: [Method]
│   │   ├── Packaging: [Recycled/Disposed]
│   │   └── Environmental Compliance: [Certified Y/N]

├── Total Parts & Materials Cost:
│   ├── Main Component: $[Amount]
│   ├── Secondary Parts: $[Amount]
│   ├── Materials/Consumables: $[Amount]
│   ├── Shipping/Handling: $[Amount]
│   ├── Taxes: $[Amount]
│   ├── Discount: -$[Amount]
│   └── TOTAL: $[Final Amount]

└── Part Sourcing & Logistics:
    ├── Lead Time: [Days]
    ├── Availability: [In Stock | Ordered | Backordered]
    ├── Substitute Parts Used: [Yes/No + Explanation]
    ├── Customer Approval Required: [Yes/No]
    └── Expedited Shipping: [Yes/No + Cost]
```

### Section 3: Repair Execution

**Expanded by Default**: Yes

```
Fields:
├── Work Performed:
│   ├── Work Session 1:
│   │   ├── Date: "19/04/2026"
│   │   ├── Start Time: "08:44"
│   │   ├── End Time: "20:44"
│   │   ├── Total Duration: "12 hours"
│   │   ├── Technician(s): [Names + IDs]
│   │   ├── Work Description: [Detailed account]
│   │   ├── Step-by-Step:
│   │   │   ├── 1. Disconnected power (0.25 hr)
│   │   │   ├── 2. Removed fasteners (0.5 hr)
│   │   │   ├── 3. Extracted failed component (1 hr)
│   │   │   ├── 4. Cleaned cavity/area (0.75 hr)
│   │   │   ├── 5. Installed new component (2 hrs)
│   │   │   ├── 6. Secured with fasteners (0.5 hr)
│   │   │   ├── 7. Applied sealant (0.5 hr)
│   │   │   ├── 8. Refilled with lubricant (0.5 hr)
│   │   │   ├── 9. Initial functional test (1 hr)
│   │   │   └── 10. Final inspection (2 hrs)
│   │   ├── Issues Encountered: [Issue 1, 2 with resolutions]
│   │   ├── Work Photos: [Before | During | After links]
│   │   └── Quality Checks: [Cleanliness ✓ | Torque ✓ | Sealant ✓ | Alignment ✓]
│   │
│   ├── Work Session 2 (if needed): [Same format as Session 1]
│   │
│   └── Downtime Analysis:
│       ├── Total Downtime: [Date range + duration]
│       ├── Planned Downtime: [Expected duration]
│       ├── Actual Downtime: [What occurred]
│       ├── Delays: [Reasons if exceeded planned]
│       └── Impact: [Production/Operational impact]

├── Inspections & Testing During Repair:
│   ├── Pre-Repair Inspection:
│   │   ├── Equipment Condition: [Documented]
│   │   ├── Reference Measurements: [Baseline]
│   │   ├── Functional Baseline: [Before state]
│   │   └── Photo Documentation: [Links]
│   │
│   ├── During-Repair Checks:
│   │   ├── Component Integrity: [No additional damage?]
│   │   ├── Fastener Torque: [To specification]
│   │   ├── Clearances: [Verified/Not rubbing]
│   │   ├── Fluid Levels: [Correct amount added]
│   │   ├── Electrical Continuity: [If applicable, tested]
│   │   └── Safety Interlocks: [Functioning]
│   │
│   ├── Post-Repair Testing:
│   │   ├── Visual Inspection: [Looks good Y/N]
│   │   ├── Functional Test: [Component operates Y/N]
│   │   ├── Full System Test: [All systems Y/N]
│   │   ├── Performance Measurements: [Charts/Data]
│   │   ├── No New Problems: [Verified Y/N]
│   │   ├── Test Duration: [Hours run]
│   │   └── Test Conditions: [Load/Temperature/etc.]
│   │
│   └── Final Acceptance:
│       ├── Quality Sign-off: [Technician name + date]
│       ├── Supervisor Approval: [Name + date]
│       ├── Customer Sign-off: [If required, name + date]
│       └── Outstanding Issues: [None / List details]

└── Repair Completion Summary:
    ├── Status: ✓ COMPLETE
    ├── All Objectives Achieved: [Yes/No]
    ├── Equipment Operational: [Yes/No]
    ├── Warranty Applicable: [Yes/No + details]
    ├── Next Service Due: [Date]
    └── Recommendations: [For customer/operator]
```

### Section 4: Post-Repair Verification

**Expanded by Default**: Yes

```
Fields:
├── Repair Effectiveness Verification:
│   ├── Original Problem Resolution:
│   │   ├── Original Symptom: "Motor wiper not functioning"
│   │   ├── Symptom Present Now: ☐ No (✓ Resolved)
│   │   ├── Verification Method: [How verified]
│   │   ├── Verification Date: "19/04/2026, 20:44"
│   │   └── Verified By: [Technician name]
│   │
│   ├── Performance Restoration:
│   │   ├── Original Specification: [Value/Range]
│   │   ├── Current Measurement: [Actual value]
│   │   ├── Within Specification: ✓ Yes
│   │   ├── Variation: [±X% from spec]
│   │   └── Acceptable: ✓ Yes
│   │
│   ├── Side Effects Check:
│   │   ├── Secondary Problems: ☐ None
│   │   ├── Other Components Affected: ☐ No issues
│   │   ├── System Interactions: ✓ Verified Normal
│   │   ├── Safety Features Functional: ✓ All Checked
│   │   └── Remaining Concerns: ☐ None
│   │
│   ├── Run-In Test Results:
│   │   ├── Test Duration: "4 hours continuous"
│   │   ├── Load/Stress: "100% nominal load"
│   │   ├── Ambient Conditions: "25°C, 55% humidity"
│   │   ├── Performance Stable: ✓ Yes
│   │   ├── Temperature Normal: ✓ Yes
│   │   ├── No Anomalies: ✓ Confirmed
│   │   └── Ready for Service: ✓ Approved
│   │
│   └── Customer Notification:
│       ├── Notified of Completion: ✓ Yes
│       ├── Notification Method: "Email + Phone"
│       ├── Pickup Scheduled: [Date/Time]
│       ├── Delivery Arranged: [If applicable]
│       └── Customer Feedback: [If provided]

├── Quality Assurance Sign-Off:
│   ├── Technician Certification:
│   │   ├── Name: "JEFRIADI JASEF"
│   │   ├── Certifications: [List]
│   │   ├── Work Completed Correctly: ✓ Yes
│   │   ├── Signature: [Digital signature]
│   │   └── Date: "19/04/2026, 20:44"
│   │
│   ├── Supervisor Review:
│   │   ├── Supervisor Name: [Name]
│   │   ├── Review Date: [Date]
│   │   ├── Work Quality: ✓ Meets Standards
│   │   ├── Parts Used Appropriate: ✓ Approved
│   │   ├── Testing Adequate: ✓ Sufficient
│   │   ├── Documentation Complete: ✓ Yes
│   │   ├── Approved: ✓ Yes
│   │   └── Signature: [Digital signature]
│   │
│   └── Customer Acceptance:
│       ├── Equipment Acceptable: [Y/N]
│       ├── Customer Satisfied: [Y/N]
│       ├── Final Payment Approved: [Y/N]
│       ├── Additional Feedback: [Notes]
│       ├── Follow-up Needed: [Y/N + details]
│       └── Signature: [Customer or Rep]

└── Warranty & Liability:
    ├── Parts Warranty:
    │   ├── Duration: "12 months"
    │   ├── Coverage: "Manufacturing defects"
    │   ├── Exclusions: [List any]
    │   └── Registration: [Link]
    │
    ├── Workmanship Warranty:
    │   ├── Duration: "90 days"
    │   ├── Coverage: [What's covered]
    │   ├── Conditions: [Requirements for coverage]
    │   └── Contact: [Support contact info]
    │
    └── Post-Warranty Support:
        ├── Extended Warranty Available: [Y/N + Cost]
        ├── Service Contract Options: [Link]
        ├── Preventive Maintenance Schedule: [Recommended]
        └── Future Support Contact: [Info]
```

---

## Feed Tab

### Overview

Chronological activity stream of all EMR-related events, changes, and communications.

### Feed Activity Types

```
Activity Type Examples:

1️⃣ Status Changes
   "Status changed from 'In Progress' → 'Pending Review'"
   Reason: "Awaiting customer feedback"

2️⃣ Comments/Notes
   "Added a comment: 'Motor wiper assembly successfully...'"
   Show full comment + reply option

3️⃣ Files Uploaded
   "Uploaded 3 files"
   • SERVICE_REPORT_FINAL.pdf (2.4 MB)
   • TECHNICAL_ANALYSIS.xlsx (356 KB)
   • REPAIR_PHOTOS.zip (45 MB)

4️⃣ Work Order Linked
   "Work Order 01255888 created and linked"
   Status: Technical Complete

5️⃣ Case Created/Linked
   "Case 01529658 created and linked"
   Subject: "Internal - Troubleshooting"

6️⃣ Parts Added/Updated
   "Added part: Motor Wiper Assembly (2A5-53-12721)"
   Quantity: 1 | Cost: $[Amount]

7️⃣ Assignment Changes
   "Assignment changed from Tech A → Tech B"
   Reason: "Load balancing"

8️⃣ Approval/Sign-Off
   "Approved EMR: 'Repair work completed to standard'"

9️⃣ Schedule Changes
   "Schedule updated from Jun 20 → Jun 18"
   Reason: "Parts arrived early"

🔟 Customer Communication
   "Customer notified via Email + SMS"
   Message preview: "Your equipment repair is complete..."
```

### Feed Display Format

```
Per Activity Entry:
├── [User Avatar] User Name        Time (Relative time)
├── 📝 Activity Type (emoji + text)
├── Activity Description
├── Additional Details/Content
└── Actions: [ Like ] [ Comment ] [ Share ]

Filtering Options:
├── All Activities (default)
├── Status Changes
├── Comments/Notes
├── Files
├── Work Orders
├── Cases
├── Parts
├── Assignments
├── Approvals
├── Schedules
└── Customer Communications

Sorting Options:
├── Most Recent First (default)
├── Oldest First
├── Most Liked
├── Most Commented
└── Custom Date Range

Search:
├── By: Text, User, Activity Type, Date
├── Autocomplete suggestions
└── Real-time filtering
```

### Comments & Discussion

```
Comment Thread:
├── [Avatar] User Name         Date/Time
├── Comment Text (full or preview)
├── Reactions: 👍 ❤️ 😄 😕
├── Reply Option: Opens reply form
├── Edit/Delete: (for author)
│
└── Replies (indented):
    ├── [Avatar] User Name         Date/Time
    ├── Reply Text
    ├── Actions
    └── [More replies...]

New Comment Form:
├── Rich Text Editor: [With formatting]
├── @Mentions: [Autocomplete to notify users]
├── #Hashtags: [For categorization]
├── Attachment Option: [File upload]
├── Preview Button
└── [ Cancel ] [ Post Comment ]
```

### Timeline View (Alternative)

```
Vertical Timeline:
├── Left side: Date markers
├── Center: Event circles (color-coded)
├── Right side: Event details
├── Connection lines: Between events

Example Timeline:
═══════════════════════════════════════════
23/04/2026                 EMR Created
─ 🔵 System
  "EMR U-00021652 created"
───────────────────────────────────────
23/04/2026 15:13          Problem Reported
─ 🔴 Alert
  "Motor wiper internal defect identified"
───────────────────────────────────────
19/04/2026 08:44          Repair Started
─ 🔵 Action
  "Work order 01255888 created"
───────────────────────────────────────
19/04/2026 20:44          Repair Complete
─ 🟢 Success
  "Repair completed and tested"
───────────────────────────────────────
20/05/2026 07:25          EMR Closed
─ 🔵 Completed
  "EMR closed by GAMAL HARI PRASETYO"
═══════════════════════════════════════════
```

---

## Summary

This document provides detailed specifications for:

✅ **Sidebar Panels**: Upload, Get Images, Additional Files, Lead Time  
✅ **Tab Navigation**: Details, FAR, TSI, TSR, Feed  
✅ **Tab Content**: Complete field specifications for each section  
✅ **Data Models**: Structure and validation rules  
✅ **UI Layout**: Display formats and component styling  
✅ **Business Logic**: SLA calculations, status transitions, workflows  

All components include:
- Field descriptions with data types
- Validation rules and constraints
- Visual layout and formatting
- Example data and use cases
- Interactive features and user actions

---

**Document Version**: 1.0  
**Status**: Complete & Ready for Development  
**Language**: English  
**Last Updated**: May 27, 2024
