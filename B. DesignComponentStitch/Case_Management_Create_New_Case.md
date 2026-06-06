# Case Management - Create New Case Page with Admin Field Configuration

## Complete Create New Case Interface with Configurable Fields

---

## 1. CREATE NEW CASE PAGE - OVERVIEW

### 1.1 Navigation to Create New Case

```
┌─────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ LEFT SIDEBAR:                                                    │
│ ├─ UT Service                                                   │
│ ├─ Console                                                       │
│ ├─ Accounts                                                      │
│ ├─ Cases ◄─── ACTIVE (Highlighted in yellow)                   │
│ ├─ Contacts                                                      │
│ ├─ Knowledge                                                     │
│ └─ Reports                                                       │
│                                                                  │
│ MAIN AREA:                                                       │
│ ├─ [+ New Case] Button ◄─── CLICK TO CREATE                    │
│ ├─ Case List Display                                            │
│ └─ Filters & Search                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Create New Case Modal/Page

```
┌─────────────────────────────────────────────────────────────────┐
│ CREATE NEW CASE                                                 │
│                                                          [✕]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ FORM CONTENT:                                                    │
│ ├─ Dynamic Fields (Based on Admin Configuration)                │
│ ├─ Required Field Indicators (*)                                │
│ ├─ Field Validations                                            │
│ ├─ Auto-populated Fields (if applicable)                        │
│ └─ Help Text/Tooltips                                           │
│                                                                  │
│ ACTION BUTTONS:                                                  │
│ ├─ [Save] [Save & New] [Cancel]                                │
│ └─ [Save as Draft]                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. STANDARD CASE FIELDS - DEFAULT CONFIGURATION

### 2.1 Field List with Admin Configuration

| Field ID | Field Name | Type | Default Required | Default Visible | Description |
|----------|-----------|------|------------------|-----------------|-------------|
| **CASE001** | Case Subject | Text | ✓ YES | ✓ YES | Main subject/title of the case |
| **CASE002** | Description | Text Area | ✓ YES | ✓ YES | Detailed description of the issue |
| **CASE003** | Case Type | Dropdown | ✓ YES | ✓ YES | Service Request / Problem / Inquiry / Feedback |
| **CASE004** | Priority | Dropdown | ✓ YES | ✓ YES | Low / Medium / High / Critical |
| **CASE005** | Category | Dropdown | ☐ NO | ✓ YES | Technical / Billing / Delivery / Other |
| **CASE006** | Sub-Category | Dropdown | ☐ NO | ✓ YES | Dynamic based on Category |
| **CASE007** | Status | Dropdown | ✓ YES | ✓ YES | New / Open / In Progress / Resolved / Closed |
| **CASE008** | Account | Lookup | ✓ YES | ✓ YES | Customer account reference |
| **CASE009** | Contact | Lookup | ✓ YES | ✓ YES | Contact person from account |
| **CASE010** | Related Asset | Lookup | ☐ NO | ✓ YES | Equipment/Asset reference (optional) |
| **CASE011** | Due Date | Date | ☐ NO | ✓ YES | When case should be resolved |
| **CASE012** | SLA Terms | Dropdown | ☐ NO | ✓ YES | SLA agreement applicable |
| **CASE013** | Owner | Lookup | ✓ YES | ✓ YES | Case owner/assignee |
| **CASE014** | Team | Dropdown | ☐ NO | ✓ YES | Support team assignment |
| **CASE015** | Case Tags | Multi-select | ☐ NO | ✓ YES | Tags for categorization |
| **CASE016** | Custom Field 1 | Text | ☐ NO | ☐ NO | Admin-defined custom field |
| **CASE017** | Custom Field 2 | Dropdown | ☐ NO | ☐ NO | Admin-defined custom field |

### 2.2 Field Type Definitions

```
TEXT FIELDS:
├─ Case Subject
├─ Description
└─ Custom Text Fields

DROPDOWN FIELDS:
├─ Case Type
├─ Priority
├─ Category
├─ Sub-Category
├─ Status
├─ SLA Terms
├─ Team
└─ Custom Dropdowns

LOOKUP FIELDS:
├─ Account
├─ Contact
├─ Related Asset
├─ Owner
└─ Related Work Orders

DATE FIELDS:
├─ Due Date
└─ Custom Date Fields

MULTI-SELECT FIELDS:
├─ Case Tags
└─ Custom Multi-selects

CHECKBOX FIELDS:
├─ Escalation Required
├─ Internal Use Only
└─ Custom Checkboxes
```

---

## 3. CREATE NEW CASE FORM - DETAILED VIEW

### 3.1 Standard Form Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ CREATE NEW CASE                                      [✕]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│ SECTION 1: CASE DETAILS                                          │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ Case Subject * ◄─── REQUIRED                                     │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Text input field]                                            │ │
│ │ (Min: 10 chars, Max: 100 chars)                              │ │
│ │ Help: Brief title describing the issue                       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Description * ◄─── REQUIRED                                      │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Rich text editor with formatting]                           │ │
│ │                                                               │ │
│ │ [B] [I] [U] [List] [Link] [Attach]                           │ │
│ │ ────────────────────────────────────────────────────────────  │ │
│ │                                                               │ │
│ │                                                               │ │
│ │ Character count: 0/5000                                      │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ SECTION 2: CLASSIFICATION                                        │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ Case Type * ◄─── REQUIRED                                        │
│ ┌────────────────────┐ ┌────────────────────┐                    │
│ │ [Service Request ▼]│ │ Priority * ◄─ REQ  │                    │
│ │                    │ │ [High ▼]           │                    │
│ │ Options:           │ │                    │                    │
│ │ • Service Request  │ │ Options:           │                    │
│ │ • Problem Report   │ │ • Critical         │                    │
│ │ • Inquiry          │ │ • High             │                    │
│ │ • Feature Request  │ │ • Medium           │                    │
│ │ • Feedback         │ │ • Low              │                    │
│ │ • Complaint        │ │                    │                    │
│ │                    │ │                    │                    │
│ └────────────────────┘ └────────────────────┘                    │
│                                                                   │
│ Category                                                          │
│ ┌────────────────────┐ ┌────────────────────┐                    │
│ │ [Select ▼]         │ │ Sub-Category       │                    │
│ │                    │ │ [Select ▼]         │                    │
│ │ Options:           │ │                    │                    │
│ │ • Technical        │ │ (Dynamic based on  │                    │
│ │ • Billing          │ │  Category selected)│                    │
│ │ • Delivery         │ │                    │                    │
│ │ • Maintenance      │ │                    │                    │
│ │ • Other            │ │                    │                    │
│ │                    │ │                    │                    │
│ └────────────────────┘ └────────────────────┘                    │
│                                                                   │
│ SECTION 3: ASSIGNMENT                                            │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ Account * ◄─── REQUIRED                                          │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Search/Lookup: SIMS JAYA KALTIM]                            │ │
│ │                                                               │ │
│ │ ✓ SIMS JAYA KALTIM (Selected)                               │ │
│ │   ID: 0015578  | Status: Active                             │ │
│ │                                                               │ │
│ │ Or [Create New Account]                                      │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Contact * ◄─── REQUIRED                                          │
│ ┌────────────────────┐ ┌────────────────────┐                    │
│ │ [Search/Lookup]    │ │ [📞 Phone]         │                    │
│ │                    │ │ +62-811-234-5678   │                    │
│ │ Selected:          │ │                    │                    │
│ │ BURHAN             │ │ [✉️ Email]         │                    │
│ │ ID: 001            │ │ burhan@...         │                    │
│ │                    │ │                    │                    │
│ │ [Create New Contact]                       │                    │
│ └────────────────────┘ └────────────────────┘                    │
│                                                                   │
│ Related Asset (Optional)                                         │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Search/Lookup: GD825A-2]                                    │ │
│ │                                                               │ │
│ │ ✓ GD825A-2 Motor Grader (Selected)                          │ │
│ │   Serial: 120948A | Hours: 4,520 hm                         │ │
│ │                                                               │ │
│ │ [Clear Selection]                                            │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Owner * ◄─── REQUIRED (Auto-filled: Current User)               │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Search/Lookup: System User]                                 │ │
│ │ (Can be changed)                                             │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Team (Optional)                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Select Team ▼]                                              │ │
│ │                                                               │ │
│ │ Options:                                                     │ │
│ │ • Technical Support                                          │ │
│ │ • Billing Support                                            │ │
│ │ • Field Service                                              │ │
│ │ • Management                                                 │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ SECTION 4: DATES & SLA                                           │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ Due Date (Optional)                                              │
│ ┌────────────────────┐ ┌────────────────────┐                    │
│ │ [📅 Date Picker]   │ │ SLA Terms (Opt)    │                    │
│ │ [DD/MM/YYYY]       │ │ [Select ▼]         │                    │
│ │                    │ │                    │                    │
│ │ (Future dates only)│ │ Options:           │                    │
│ │                    │ │ • Standard (5 days)│                    │
│ │                    │ │ • Premium (24hrs)  │                    │
│ │                    │ │ • Critical (4hrs)  │                    │
│ └────────────────────┘ └────────────────────┘                    │
│                                                                   │
│ SECTION 5: ADDITIONAL OPTIONS                                    │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ Case Tags (Optional)                                             │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [Select Multiple Tags]                                       │ │
│ │                                                               │ │
│ │ Available Tags:                                              │ │
│ │ ☐ Urgent  ☐ VIP Customer  ☐ Follow-up  ☐ Escalated        │ │
│ │ ☐ Feedback  ☐ Technical  ☐ Billing  ☐ Warranty            │ │
│ │                                                               │ │
│ │ [Custom Tag] [+]                                             │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ Escalation Required (Optional)                                  │
│ ┌────────────────┐ ┌──────────────────────┐                      │
│ │ ☐ Check if     │ │ Internal Note (Opt)  │                      │
│ │   escalation   │ │ ┌──────────────────┐ │                      │
│ │   is needed    │ │ │ [Text area]      │ │                      │
│ │                │ │ │ (Not visible to  │ │                      │
│ │                │ │ │  customer)       │ │                      │
│ │                │ │ │                  │ │                      │
│ │                │ │ └──────────────────┘ │                      │
│ │                │ │                      │                      │
│ └────────────────┘ └──────────────────────┘                      │
│                                                                   │
│ SECTION 6: CUSTOM FIELDS                                         │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ [If admin configured custom fields, they appear here]            │
│                                                                   │
│ Custom Field 1: [Input field based on type]                     │
│ Custom Field 2: [Input field based on type]                     │
│                                                                   │
│ FORM ACTIONS:                                                    │
│ ════════════════════════════════════════════════════════════════ │
│                                                                   │
│ [Save] [Save & New] [Save as Draft] [Cancel]                    │
│ [More Options ▼]                                                 │
│ ├─ Save & Create Work Order                                     │
│ ├─ Save & Send Email                                            │
│ ├─ Save & Assign to Team                                        │
│ └─ Preview                                                       │
│                                                                   │
│ Validation Indicator:                                            │
│ ├─ ✓ Subject: OK                                                │
│ ├─ ✓ Description: OK                                            │
│ ├─ ✓ Case Type: OK                                              │
│ ├─ ✓ Priority: OK                                               │
│ ├─ ✓ Account: OK                                                │
│ ├─ ✓ Contact: OK                                                │
│ ├─ ✓ Owner: OK                                                  │
│ └─ ⚠ Category: Missing                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. ADMIN PANEL - FIELD CONFIGURATION

### 4.1 Admin Field Management Interface

```
┌────────────────────────────────────────────────────────────────────┐
│ ADMIN PANEL - CASE FIELD CONFIGURATION                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ NAVIGATION:                                                         │
│ ├─ Setup                                                            │
│ ├─ Customization                                                    │
│ ├─ Cases ◄─── CURRENT                                              │
│ ├─ Case Fields ◄─── ACTIVE                                         │
│ └─ Field Configuration                                              │
│                                                                     │
│ TOOLBAR:                                                            │
│ [+ Add Field] [Import Config] [Export Config] [Reset to Default]  │
│ [Settings] [Help] [Preview]                                        │
│                                                                     │
│ FIELD CONFIGURATION TABLE:                                         │
│ ════════════════════════════════════════════════════════════════   │
│                                                                     │
│ Field Name        Type        Required Visible Order Actions      │
│ ───────────────────────────────────────────────────────────────   │
│                                                                     │
│ Case Subject      Text           ✓        ✓        1   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Description       Text Area      ✓        ✓        2   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Case Type         Dropdown       ✓        ✓        3   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Priority          Dropdown       ✓        ✓        4   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Category          Dropdown       ☐        ✓        5   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Sub-Category      Dropdown       ☐        ✓        6   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Status            Dropdown       ✓        ✓        7   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Account           Lookup         ✓        ✓        8   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Contact           Lookup         ✓        ✓        9   [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Related Asset     Lookup         ☐        ✓        10  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Owner             Lookup         ✓        ✓        11  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Due Date          Date           ☐        ✓        12  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Team              Dropdown       ☐        ✓        13  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Case Tags         Multi-select   ☐        ✓        14  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Custom Field 1    Text           ☐        ☐        15  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Custom Field 2    Dropdown       ☐        ☐        16  [Edit]    │
│                                                          [Delete]  │
│                                                                     │
│ Pagination: [1] [2] [3]  | Showing 1-16 of 16 fields             │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 4.2 Edit Field Modal

```
┌────────────────────────────────────────────────────────────────────┐
│ EDIT FIELD: Case Subject                                   [✕]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ BASIC INFORMATION:                                                  │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Field Name *                                                        │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Case Subject]                                               │   │
│ │ (Read-only for standard fields)                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Field Type *                                                        │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Text ▼]                                                     │   │
│ │ (Read-only for standard fields)                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Field ID (System)                                                   │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ CASE001  (Read-only)                                         │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ CONFIGURATION:                                                      │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Required Field                                                      │
│ ┌────┐                                                             │
│ │ ☑  │  Make this field required                               │   │
│ └────┘                                                             │
│                                                                     │
│ Visible on Form                                                     │
│ ┌────┐                                                             │
│ │ ☑  │  Show on create/edit form                               │   │
│ └────┘                                                             │
│                                                                     │
│ Display Order                                                       │
│ ┌────┐                                                             │
│ │ 1  │  Position on form (1-based)                             │   │
│ └────┘                                                             │
│                                                                     │
│ Help Text (Optional)                                                │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Brief title describing the issue]                           │   │
│ │                                                               │   │
│ │ This text helps users understand what to enter              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Default Value (Optional)                                            │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ []                                                            │   │
│ │ (Auto-fills when creating new case)                          │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Field Validation:                                                   │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Min Length (for text fields)                                        │
│ ┌────┐                                                             │
│ │ 10 │ characters                                              │   │
│ └────┘                                                             │
│                                                                     │
│ Max Length (for text fields)                                        │
│ ┌────┐                                                             │
│ │ 100│ characters                                              │   │
│ └────┘                                                             │
│                                                                     │
│ Field Options (For Dropdown/Multi-select):                          │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Options for "Case Type":                                            │
│ ┌────────────────────────┬──────────────┬─────────┐               │
│ │ Option Name            │ Display Order│ Active  │ Actions      │
│ ├────────────────────────┼──────────────┼─────────┼──────────────┤
│ │ Service Request        │ 1            │ ✓       │ [Edit][Del]  │
│ │ Problem Report         │ 2            │ ✓       │ [Edit][Del]  │
│ │ Inquiry                │ 3            │ ✓       │ [Edit][Del]  │
│ │ Feature Request        │ 4            │ ✓       │ [Edit][Del]  │
│ │ Feedback               │ 5            │ ✓       │ [Edit][Del]  │
│ │ Complaint              │ 6            │ ✓       │ [Edit][Del]  │
│ └────────────────────────┴──────────────┴─────────┴──────────────┘
│                                                                     │
│ [+ Add New Option]                                                  │
│                                                                     │
│ PERMISSIONS:                                                        │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Who can edit this field:                                            │
│ ☑ Admins                                                            │
│ ☑ Managers                                                          │
│ ☑ Case Owners                                                       │
│ ☐ Anyone                                                            │
│                                                                     │
│ Who can view this field:                                            │
│ ☑ Everyone                                                          │
│ ☐ Specific Roles [Select Roles]                                    │
│                                                                     │
│ PREVIEW & ACTIONS:                                                  │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ [Preview] [Save Changes] [Cancel] [Delete Field]                   │
│                                                                     │
│ Created By: System User  | Created On: 26/05/2026                 │
│ Last Modified: Admin User | Modified On: 26/05/2026, 11:12         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 4.3 Add New Custom Field

```
┌────────────────────────────────────────────────────────────────────┐
│ ADD NEW CUSTOM FIELD                                       [✕]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Field Name * (for custom fields only)                              │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [e.g., Department, Customer Type, etc.]                     │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Field Type * (Select from available types)                         │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Select Field Type ▼]                                        │   │
│ │ Options:                                                     │   │
│ │ • Text                                                       │   │
│ │ • Text Area (Long Text)                                      │   │
│ │ • Dropdown (Single Select)                                   │   │
│ │ • Multi-select                                               │   │
│ │ • Date                                                       │   │
│ │ • Checkbox                                                   │   │
│ │ • Number                                                     │   │
│ │ • Lookup (to Account/Contact/Asset/User)                    │   │
│ │ • Email                                                      │   │
│ │ • Phone                                                      │   │
│ │ • URL                                                        │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ CONFIGURATION (Based on field type):                                │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Required                                                            │
│ ☐ Make this field mandatory                                        │
│                                                                     │
│ Visible on Form                                                     │
│ ☑ Show on case form                                                │
│                                                                     │
│ Display Order                                                       │
│ ┌────┐                                                             │
│ │ 17 │  (Will appear as 17th field)                            │   │
│ └────┘                                                             │
│                                                                     │
│ Help Text                                                           │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Optional help text for users]                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Default Value                                                       │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Optional default value]                                     │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ FIELD-SPECIFIC OPTIONS:                                             │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ If Dropdown/Multi-select selected:                                  │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ Add Options:                                                 │   │
│ │ ┌─────────────────┬──────────┐                              │   │
│ │ │ Option Name     │ Order    │ [x]                         │   │
│ │ ├─────────────────┼──────────┤                              │   │
│ │ │ [Input field]   │ 1        │ [x]                         │   │
│ │ │ [Input field]   │ 2        │ [x]                         │   │
│ │ │ [+ Add Option]  │          │                              │   │
│ │ └─────────────────┴──────────┘                              │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ If Lookup selected:                                                 │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ Lookup to:                                                   │   │
│ │ [Account ▼]                                                  │   │
│ │                                                               │   │
│ │ Options:                                                     │   │
│ │ • Account                                                    │   │
│ │ • Contact                                                    │   │
│ │ • Asset                                                      │   │
│ │ • User                                                       │   │
│ │ • Work Order                                                 │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ PERMISSIONS:                                                        │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Who can edit this field:                                            │
│ ☑ Admins                                                            │
│ ☑ Managers                                                          │
│ ☐ Case Owners                                                       │
│ ☐ Anyone                                                            │
│                                                                     │
│ Who can view this field:                                            │
│ ☑ Everyone                                                          │
│ ☐ Specific Roles [Select Roles]                                    │
│                                                                     │
│ ACTION BUTTONS:                                                     │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ [Create Field] [Cancel] [Save as Template]                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. FIELD CONFIGURATION SETTINGS

### 5.1 Global Form Settings

```
┌────────────────────────────────────────────────────────────────────┐
│ CASE FORM SETTINGS                                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ GENERAL SETTINGS:                                                   │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Form Title                                                          │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [CREATE NEW CASE]                                            │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Form Description                                                    │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [Please fill in all required fields (*) to create a case]   │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Enable Required Field Indicator                                     │
│ ☑ Show * for required fields                                       │
│                                                                     │
│ Enable Field Validation                                             │
│ ☑ Validate in real-time                                            │
│                                                                     │
│ Enable Help Text                                                    │
│ ☑ Show help icons on hover                                         │
│                                                                     │
│ Form Layout                                                         │
│ ○ Single Column                                                     │
│ ○ Two Columns (Default)                                            │
│ ○ Three Columns                                                    │
│                                                                     │
│ SUBMISSION SETTINGS:                                                │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Default Status on Create                                            │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [New ▼]                                                      │   │
│ │                                                               │   │
│ │ Options:                                                     │   │
│ │ • New (default)                                              │   │
│ │ • Open                                                       │   │
│ │ • In Progress                                                │   │
│ └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Auto-assign Owner                                                   │
│ ☑ Default to current user                                          │
│                                                                     │
│ Auto-populate Account                                               │
│ ☐ From logged-in user's account (if applicable)                    │
│                                                                     │
│ Create Work Order Automatically                                     │
│ ☐ Auto-create WO for new cases                                     │
│   └─ Work Order Template: [Select ▼]                               │
│                                                                     │
│ Send Confirmation Email                                             │
│ ☑ Send to case creator                                             │
│ ☑ Send to contact                                                  │
│ ☑ Send to owner                                                    │
│                                                                     │
│ VALIDATION RULES:                                                   │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Duplicate Check                                                     │
│ ☑ Check for similar open cases                                     │
│   └─ Similarity threshold: [80]%                                   │
│                                                                     │
│ Prevent Duplicate Accounts                                          │
│ ☐ Only allow unique accounts per priority                          │
│                                                                     │
│ Validate Contact belongs to Account                                 │
│ ☑ Ensure contact is from selected account                          │
│                                                                     │
│ ACTION BUTTONS:                                                     │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ [Save Settings] [Reset to Default] [Cancel]                        │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 5.2 Field Dependency/Conditional Rules

```
┌────────────────────────────────────────────────────────────────────┐
│ CONDITIONAL FIELD RULES                                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Configure which fields appear/are required based on other fields   │
│                                                                     │
│ CURRENT RULES:                                                      │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                     │
│ Rule 1: Sub-Category depends on Category                           │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Condition: When "Category" = "Technical"                       │ │
│ │ Then: Show "Sub-Category" and make it required               │ │
│ │                                                                │ │
│ │ Sub-Category Options (Technical):                              │ │
│ │ • Hardware Issue                                               │ │
│ │ • Software Issue                                               │ │
│ │ • Network Issue                                                │ │
│ │ • Other Technical                                              │ │
│ │                                                                │ │
│ │ [Edit Rule] [Delete Rule]                                     │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ Rule 2: Asset becomes required for certain case types             │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Condition: When "Case Type" = "Problem Report"                │ │
│ │ Then: Make "Related Asset" required                           │ │
│ │                                                                │ │
│ │ [Edit Rule] [Delete Rule]                                     │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ Rule 3: Team field visibility                                      │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ Condition: When "Case Type" = "Service Request"               │ │
│ │ Then: Show "Team" field (optional)                            │ │
│ │                                                                │ │
│ │ [Edit Rule] [Delete Rule]                                     │ │
│ └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ [+ Add New Rule]                                                    │
│                                                                     │
│ [Save All Rules] [Reset Rules] [Cancel]                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. CREATE CASE FORM - COMPLETE ASCII LAYOUT

```
┌────────────────────────────────────────────────────────────────────────────┐
│ UT SERVICE CONSOLE                                                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ LEFT SIDEBAR:          │  MAIN CONTENT AREA:                               │
│ ├─ UT Service         │  ┌──────────────────────────────────────────────┐ │
│ ├─ Console            │  │ CREATE NEW CASE                      [✕]     │ │
│ ├─ Accounts           │  ├──────────────────────────────────────────────┤ │
│ ├─ Cases ◄─ ACTIVE   │  │                                               │ │
│ ├─ Contacts           │  │ SECTION 1: CASE DETAILS                      │ │
│ ├─ Knowledge          │  │ ════════════════════════════════════════════ │ │
│ └─ Reports            │  │                                               │ │
│                        │  │ Case Subject *                               │ │
│                        │  │ ┌──────────────────────────────────────────┐ │ │
│                        │  │ │ [Hydraulic Leak on Right Cylinder]      │ │ │
│                        │  │ └──────────────────────────────────────────┘ │ │
│                        │  │                                               │ │
│                        │  │ Description *                                │ │
│                        │  │ ┌──────────────────────────────────────────┐ │ │
│                        │  │ │ [Rich Text Editor]                       │ │ │
│                        │  │ │                                           │ │ │
│                        │  │ │ [B] [I] [U] [Link]                       │ │ │
│                        │  │ │                                           │ │ │
│                        │  │ │ Operator reported significant hydraulic   │ │ │
│                        │  │ │ fluid leak near the right cylinder during │ │ │
│                        │  │ │ morning inspection...                     │ │ │
│                        │  │ │                                           │ │ │
│                        │  │ └──────────────────────────────────────────┘ │ │
│                        │  │                                               │ │
│                        │  │ SECTION 2: CLASSIFICATION                    │ │
│                        │  │ ════════════════════════════════════════════ │ │
│                        │  │                                               │ │
│                        │  │ Case Type *          Priority *              │ │
│                        │  │ ┌───────────────┐   ┌──────────────────┐   │ │
│                        │  │ │ Service Req ▼ │   │ High ▼           │   │ │
│                        │  │ └───────────────┘   └──────────────────┘   │ │
│                        │  │                                               │ │
│                        │  │ Category             Sub-Category             │ │
│                        │  │ ┌───────────────┐   ┌──────────────────┐   │ │
│                        │  │ │ Technical ▼   │   │ Hardware Issue ▼ │   │ │
│                        │  │ └───────────────┘   └──────────────────┘   │ │
│                        │  │                                               │ │
│                        │  │ SECTION 3: ASSIGNMENT                        │ │
│                        │  │ ════════════════════════════════════════════ │ │
│                        │  │                                               │ │
│                        │  │ Account *                                    │ │
│                        │  │ ┌──────────────────────────────────────────┐ │ │
│                        │  │ │ [SIMS JAYA KALTIM]                       │ │ │
│                        │  │ └──────────────────────────────────────────┘ │ │
│                        │  │                                               │ │
│                        │  │ Contact *            Owner *                 │ │
│                        │  │ ┌──────────────┐   ┌──────────────────┐   │ │
│                        │  │ │ [BURHAN]     │   │ [System User]    │   │ │
│                        │  │ └──────────────┘   └──────────────────┘   │ │
│                        │  │                                               │ │
│                        │  │ Related Asset (Optional)                     │ │
│                        │  │ ┌──────────────────────────────────────────┐ │ │
│                        │  │ │ [GD825A-2]                               │ │ │
│                        │  │ └──────────────────────────────────────────┘ │ │
│                        │  │                                               │ │
│                        │  │ SECTION 4: DATES & SLA                       │ │
│                        │  │ ════════════════════════════════════════════ │ │
│                        │  │                                               │ │
│                        │  │ Due Date             SLA Terms               │ │
│                        │  │ ┌──────────────┐   ┌──────────────────┐   │ │
│                        │  │ │ [📅 Picker]  │   │ [Premium 24hrs]  │   │ │
│                        │  │ └──────────────┘   └──────────────────┘   │ │
│                        │  │                                               │ │
│                        │  │ SECTION 5: ADDITIONAL OPTIONS                │ │
│                        │  │ ════════════════════════════════════════════ │ │
│                        │  │                                               │ │
│                        │  │ Case Tags              Escalation Required    │ │
│                        │  │ ┌──────────────┐   ┌──────────────────┐   │ │
│                        │  │ │ [Select ▼]   │   │ ☐ Escalate       │   │ │
│                        │  │ │ (Multi-select)   │                  │   │ │
│                        │  │ └──────────────┘   └──────────────────┘   │ │
│                        │  │                                               │ │
│                        │  │ Internal Note (Optional)                     │ │
│                        │  │ ┌──────────────────────────────────────────┐ │ │
│                        │  │ │ [Not visible to customer]                │ │ │
│                        │  │ └──────────────────────────────────────────┘ │ │
│                        │  │                                               │ │
│                        │  │ VALIDATION STATUS:                            │ │
│                        │  │ ════════════════════════════════════════════ │ │
│                        │  │ ✓ Case Subject: OK                          │ │
│                        │  │ ✓ Description: OK                           │ │
│                        │  │ ✓ Case Type: OK                             │ │
│                        │  │ ✓ Priority: OK                              │ │
│                        │  │ ✓ Account: OK                               │ │
│                        │  │ ✓ Contact: OK                               │ │
│                        │  │ ✓ Owner: OK                                 │ │
│                        │  │ ✓ Category: OK                              │ │
│                        │  │                                               │ │
│                        │  │ FORM ACTIONS:                                │ │
│                        │  │ ════════════════════════════════════════════ │ │
│                        │  │                                               │ │
│                        │  │ [Save] [Save & New] [Save as Draft] [Cancel]│ │
│                        │  │ [More Options ▼]                            │ │
│                        │  │                                               │ │
│                        │  └──────────────────────────────────────────────┘ │
│                        │                                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. FIELD MANAGEMENT - KEY OPERATIONS

### 7.1 Common Admin Tasks

```
TASK 1: MAKE A FIELD REQUIRED
───────────────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Find the field (e.g., "Category")
3. Click [Edit]
4. Check: ☑ Required Field
5. Click [Save Changes]
6. Field now required on form

TASK 2: HIDE A FIELD
────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Find the field to hide
3. Click [Edit]
4. Uncheck: ☐ Visible on Form
5. Click [Save Changes]
6. Field no longer appears on form

TASK 3: ADD NEW DROPDOWN OPTION
───────────────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Find the field (e.g., "Case Type")
3. Click [Edit]
4. Scroll to "Field Options"
5. Click [+ Add New Option]
6. Enter: Option Name & Display Order
7. Click [Save Changes]
8. Option available in dropdown

TASK 4: CHANGE FIELD ORDER
──────────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Find the field
3. Click [Edit]
4. Change: Display Order (e.g., from 5 to 3)
5. Click [Save Changes]
6. Form fields reorder automatically

TASK 5: CREATE CUSTOM FIELD
──────────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Click [+ Add Field]
3. Fill in:
   - Field Name
   - Field Type (Text/Dropdown/Date/etc)
   - Make Required? (☑/☐)
   - Visible on Form? (☑/☐)
   - Help Text
4. Click [Create Field]
5. Field available on case form

TASK 6: SET FIELD DEPENDENCY
───────────────────────────
1. Go to Admin Panel → Conditional Field Rules
2. Click [+ Add New Rule]
3. Set Condition:
   - When "Category" = "Technical"
4. Set Action:
   - Show "Sub-Category"
   - Make "Sub-Category" required
5. Click [Save Rule]
6. Form updates based on condition
```

### 7.2 Field Import/Export

```
EXPORT FIELD CONFIGURATION
──────────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Click [Export Config]
3. Select:
   - Format: JSON / CSV / Excel
   - Include: Field definitions, options, rules
4. Click [Download]
5. Save file locally

IMPORT FIELD CONFIGURATION
──────────────────────────
1. Go to Admin Panel → Cases → Case Fields
2. Click [Import Config]
3. Upload file (JSON/CSV/Excel)
4. Review:
   - Fields to import
   - Fields to update
   - Conflicts (if any)
5. Click [Confirm Import]
6. Configuration applied

BACKUP/RESTORE
──────────────
1. Go to Admin Panel → Cases → Case Fields
2. Click [Export Config]
3. Save as "Case_Fields_Backup_[DATE].json"
4. To restore:
   - Click [Import Config]
   - Select backup file
   - Click [Confirm Import]
```

---

## 8. VALIDATION & ERROR HANDLING

### 8.1 Form Validation Messages

```
REQUIRED FIELD VALIDATION:
┌─────────────────────────────────────────┐
│ ⚠️ Case Subject is required             │
│    Please enter a subject               │
└─────────────────────────────────────────┘

MIN/MAX LENGTH VALIDATION:
┌─────────────────────────────────────────┐
│ ⚠️ Case Subject must be at least 10     │
│    characters (currently: 8 chars)      │
└─────────────────────────────────────────┘

FORMAT VALIDATION:
┌─────────────────────────────────────────┐
│ ⚠️ Email format invalid                 │
│    Please enter a valid email address   │
└─────────────────────────────────────────┘

DEPENDENCY VALIDATION:
┌─────────────────────────────────────────┐
│ ⚠️ Contact must belong to selected      │
│    Account (SIMS JAYA KALTIM)           │
└─────────────────────────────────────────┘

DUPLICATE CHECK:
┌─────────────────────────────────────────┐
│ ⚠️ Similar case already exists:         │
│    Case #01553477 (80% match)           │
│    [View Existing] [Continue Anyway]    │
└─────────────────────────────────────────┘
```

### 8.2 Success Messages

```
ON SAVE:
┌─────────────────────────────────────────┐
│ ✓ Case created successfully             │
│   Case ID: 01532785                     │
│   [View Case] [Create Another]          │
└─────────────────────────────────────────┘

ON SAVE AS DRAFT:
┌─────────────────────────────────────────┐
│ ✓ Case saved as draft                   │
│   You can continue editing later        │
│   [Continue Editing] [Go to List]       │
└─────────────────────────────────────────┘

ON SAVE & NEW:
┌─────────────────────────────────────────┐
│ ✓ Case created successfully             │
│   Case ID: 01532785                     │
│   Form cleared for new case             │
│   [Back to List]                        │
└─────────────────────────────────────────┘
```

---

## 9. METADATA & SYSTEM INFORMATION

**System:** UT Service Console v3.2 (Advanced)
**Feature:** Case Management - Create New Case with Field Configuration
**Last Updated:** 26/05/2026 07:36
**Document Version:** Create Case Design v1.0

---

## 10. SUMMARY - KEY FEATURES

### Create New Case Form:
✅ **Dynamic Fields** - Configured via Admin Panel
✅ **Required Field Management** - Admin controls which fields are mandatory
✅ **Field Visibility Control** - Show/hide fields per configuration
✅ **Field Ordering** - Admin sets display order on form
✅ **Conditional Rules** - Fields appear based on other field values
✅ **Dropdown Options** - Admin manages all option values
✅ **Custom Fields** - Add unlimited custom fields
✅ **Field Validation** - Real-time validation with clear messages
✅ **Help Text** - Admin-defined tooltips & guidance
✅ **Pre-populated Values** - Auto-fill defaults

### Admin Field Configuration:
✅ **Field Management UI** - Table view of all fields
✅ **Edit Field Modal** - Modify field properties
✅ **Add Custom Fields** - Create new fields on demand
✅ **Field Types** - Text, Dropdown, Date, Lookup, Checkbox, etc.
✅ **Conditional Logic** - Set up field dependencies
✅ **Permission Control** - Who can view/edit each field
✅ **Option Management** - Add/edit dropdown values
✅ **Import/Export** - Backup & restore configurations
✅ **Form Settings** - Global form configuration
✅ **Default Values** - Set auto-fill values

### User Experience:
✅ **Intuitive Interface** - Easy to understand form
✅ **Real-time Validation** - Immediate feedback
✅ **Visual Indicators** - Clear required field markers
✅ **Helpful Tooltips** - Admin-provided guidance
✅ **Multi-column Layout** - Optimized spacing
✅ **Responsive Design** - Works on all devices
✅ **Save Options** - Save, Save & New, Save as Draft
✅ **Duplicate Detection** - Warn of similar cases
✅ **Error Messages** - Clear & actionable

---

*This document provides complete specification for Case Management Create New Case page with comprehensive Admin Panel field configuration system.*
