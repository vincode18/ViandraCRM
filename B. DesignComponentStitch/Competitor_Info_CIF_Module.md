# Competitor Info (CIF) Module Documentation

## Overview
The Competitor Information (CIF) module is a dedicated component within the UT Service Console designed to capture, manage, and track competitive intelligence data. This module allows users to create, view, and manage detailed competitor information records that support strategic business decisions and market analysis.

---

## Table of Contents
1. [Module Navigation](#module-navigation)
2. [CIF Object Structure](#cif-object-structure)
3. [List View](#list-view)
4. [Form View & Data Entry](#form-view--data-entry)
5. [CIF Fields Reference](#cif-fields-reference)
6. [User Workflows](#user-workflows)
7. [Form Controls & Actions](#form-controls--actions)
8. [Data Validation Rules](#data-validation-rules)
9. [Integration Points](#integration-points)
10. [User Permissions](#user-permissions)

---

## Module Navigation

### Accessing the Competitor Info Module

#### Step 1: Navigate from Main Console
1. Open **UT Service Console**
2. Locate the **Module Dropdown** in the header (currently showing active module name)
3. Click on the dropdown selector

#### Step 2: Select Competitor Information
```
UT Service Console [v]
├── Cases
├── Assets
├── Contacts
├── Knowledge
├── Reports
├── Accounts
├── Competitor Information ← SELECT HERE
└── [Other Modules]
```

#### Step 3: View Module
Upon selection, the system will:
- Navigate to Competitor Information module
- Display the **List View** of all CIF records
- Show module-specific controls and actions

### Module Header
The module header displays:
- **Module Name**: "Competitor Information"
- **Record Count**: "50+ Items • Sorted by: CIF ID • Updated 3 minutes ago"
- **View Toggle**: Switch between List, Grid, or Detail views
- **Action Buttons**: New, Printable View, Search, Filter, Sort

---

## CIF Object Structure

### Definition
A CIF (Competitor Information Form) record is a standardized document that captures detailed information about competing organizations, their products, pricing, market strategies, and other competitive intelligence.

### Record Identifier
- **CIF ID**: Unique identifier in format XXXXXXX-CIF or XXXXXXX-CIF1
  - Example: 00382851-CIF1
  - Auto-generated upon record creation
  - Immutable and globally unique

### Record Type
- **Type**: Mechanic CIF
- **Classification**: Type of competitor information being tracked

### Key Relationships
```
CIF Record
├── Customer Name (Account Link)
├── Sales Office
├── Informan (Informant/Contact)
├── Case (Related Case Link)
├── Opportunity (Related Opportunity)
└── Created By & Approval Chain
```

---

## List View

### List View Layout
The Competitor Information list view displays all CIF records in a tabular format with the following columns:

#### Column Definitions

| Column | Data Type | Description | Sortable |
|--------|-----------|-------------|----------|
| CIF ID | Text (Link) | Unique competitor information identifier | ✓ |
| Record Type | Dropdown | Type of CIF record (e.g., Mechanic CIF) | ✓ |
| Created Date | DateTime | Date and time record was created | ✓ |
| Created By | Text | User who created the CIF record | ✓ |
| Plant | Dropdown | Manufacturing plant or location | ✓ |
| Plant Code | Text | Code identifier for plant | ✓ |

#### Sample List Data
```
Row  CIF ID              Record Type      Created Date      Created By                Plant
1    0012222             Mechanic CIF     14/11/2023, 10:07 SHOFWAN HANIF (inactive) -
2    0024484 - CIF1      Mechanic CIF     10/08/2023, 16:56 Mursalim Mursalim        -
3    0028089 - CIF1      Mechanic CIF     10/08/2023, 09:52 Danil Afandi             -
4    0037180 - CIF1      Mechanic CIF     24/07/2023, 06:53 Danil Afandi             -
5    00382851 - CIF1     Mechanic CIF     13/12/2022, 08:04 Mahendra Noveya Rahman   -
6    0043017 - CIF1      Mechanic CIF     19/09/2023, 09:00 Mursalim Mursalim        -
...
50   0045994 - CIF1      Mechanic CIF     28/12/2022, 10:32 MUHAMMAD SYAH            -
```

### List View Controls

#### Search & Filter Bar
```
[Search this list...]  [Filter v] [Column Display v] [New] [Refresh v]
```

- **Search this list**: Real-time search across CIF ID, customer name, and informant
- **Filter**: Apply conditional filters to list records
- **Column Display**: Show/hide columns
- **New Button**: Create new CIF record
- **Refresh**: Reload list from database

#### Sorting
- **Primary Sort**: CIF ID (ascending/descending)
- **Multi-column Sort**: Click column header to change sort order
- **Sort Indicator**: Arrow icon showing sort direction

#### View Options
- **List View** (current): Table format
- **Printable View**: Print-optimized format
- **Grid View**: Card-based layout

#### Pagination
- **Record Count**: Displays "50+ Items"
- **Page Navigation**: Previous/Next buttons for large datasets
- **Records Per Page**: Configurable (10, 25, 50, 100 items)

---

## Form View & Data Entry

### Accessing the Form

#### Method 1: Create New Record
1. Click **"New"** button in List View
2. System opens blank CIF Form
3. Enter required data
4. Click **"Save"** to create record

#### Method 2: Edit Existing Record
1. Click on **CIF ID** link in List View
2. Opens existing CIF record in Form View
3. Click **"Edit"** button
4. Modify fields as needed
5. Click **"Save"** to apply changes

### Form Layout

#### Header Section
```
┌─────────────────────────────────────────────┐
│ Competitor Information                      │
│ 00382851 - CIF1                             │
│                                             │
│ No. WO: 00382851          Record Type: Mechanic CIF │
└─────────────────────────────────────────────┘
```

**Header Elements**:
- **Title**: "Competitor Information"
- **CIF ID**: Unique record identifier
- **No. WO**: Work order number (if linked)
- **Record Type**: Type of competitor information

#### Action Buttons
- **Edit**: Enable edit mode for the record
- **Delete**: Remove the CIF record (with confirmation)
- **Save**: Persist changes (appears during edit)
- **Cancel**: Discard changes and return to view mode

### Form Sections

#### Section 1: Competitor Information
This section captures basic competitor details.

**Fields**:
| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| CIF ID | Text | Yes | Unique identifier (auto-generated) |
| No. WO | Text | No | Work order number reference |
| CIF Name | Text | No | Display name for this CIF record |
| Customer Name | Text | Yes | Name of the customer account |
| Account Name | Text | Yes | Account record link |
| Account Division | Text | No | Division within the account |
| Sales Office | Dropdown | No | Sales office location (e.g., TJ-TJR) |
| Informan Name | Text | Yes | Name of the informant/contact person |
| Phone | Text | No | Contact phone number |
| Location Customer (CIF) | Text | No | Customer location for this CIF |
| Note | TextArea | No | Additional notes and observations |

#### Section 2: CIF Progress
This section tracks the status and workflow of the CIF record.

**Fields**:
| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| CIF Progress | Dropdown | No | Status of CIF (e.g., New, In Progress, Completed) |
| Case | Lookup | No | Related case record |
| Opportunity | Lookup | No | Related opportunity record |
| Created By | Lookup | Read-only | User who created the record |
| Supervisor | Lookup | No | Supervisor approval or oversight |
| Approve Date | DateTime | No | Date of supervisor approval |

### Form Data Entry Example

```
┌─── COMPETITOR INFORMATION DETAILS ─────────────────────┐
│                                                         │
│  CIF ID:           00382851 - CIF1                     │
│  No. WO:           00382851                            │
│  CIF Name:         [blank]                             │
│  Customer Name:    Harmoni Panca Utama                 │
│  Account Name:     Harmoni Panca Utama                 │
│  Account Division: [blank]                             │
│  Sales Office:     TJ-TJR                              │
│  Informan Name:    Tulus                               │
│  Phone:            0                                    │
│  Location:         [blank]                             │
│  Note:             [blank]                             │
│                                                         │
│  ─── CIF PROGRESS ───                                   │
│  CIF Progress:     New                                 │
│  Case:             [blank]                             │
│  Opportunity:      [blank]                             │
│  Created By:       Mahendra Noveya Rahman (13/12/2022) │
│  Supervisor:       [blank]                             │
│  Approve Date:     [blank]                             │
│                                                         │
│  [Save] [Cancel]                                        │
└─────────────────────────────────────────────────────────┘
```

---

## CIF Fields Reference

### Core Fields

#### CIF Identification
| Field | Type | Length | Format | Notes |
|-------|------|--------|--------|-------|
| CIF ID | Text | 20 | XXXXXXX-CIF[1] | Auto-generated, unique |
| CIF Name | Text | 100 | Free text | Optional display name |
| Record Type | Dropdown | - | Predefined list | Default: "Mechanic CIF" |

#### Customer & Account Information
| Field | Type | Length | Format | Notes |
|-------|------|--------|--------|-------|
| Customer Name | Text | 100 | Free text | Must match account |
| Account Name | Lookup | - | Account table | Must exist in system |
| Account Division | Text | 100 | Free text | Optional sub-division |
| Sales Office | Dropdown | - | Office codes | Examples: TJ-TJR, DKI, Bandung |

#### Contact Information
| Field | Type | Length | Format | Notes |
|-------|------|--------|--------|-------|
| Informan Name | Text | 100 | Free text | Person providing information |
| Phone | Text | 20 | Numeric/symbols | Optional contact number |
| Location Customer (CIF) | Text | 100 | Free text | Physical location |
| Note | TextArea | 1000 | Free text | General observations/notes |

#### Work Order Reference
| Field | Type | Length | Format | Notes |
|-------|------|--------|--------|-------|
| No. WO | Text | 20 | Numeric | Work order reference |

#### Progress & Approval
| Field | Type | Length | Format | Notes |
|-------|------|--------|--------|-------|
| CIF Progress | Dropdown | - | New, In Progress, Completed | Current workflow status |
| Case | Lookup | - | Case table | Related support case |
| Opportunity | Lookup | - | Opportunity table | Related business opportunity |
| Created By | Lookup | - | User table | Read-only, auto-populated |
| Supervisor | Lookup | - | User table | Approval authority |
| Approve Date | DateTime | - | YYYY-MM-DD HH:MM | Approval timestamp |
| Last Modified By | Lookup | - | User table | Read-only, auto-populated |

---

## User Workflows

### Workflow 1: Create New CIF Record

```
START
  │
  ├─→ Open UT Service Console
  │
  ├─→ Select "Competitor Information" from Module Dropdown
  │
  ├─→ Click "New" Button
  │    └─→ Blank CIF Form Opens
  │
  ├─→ Enter Required Fields:
  │    ├─ Customer Name
  │    ├─ Account Name
  │    ├─ Informan Name
  │    └─ Sales Office (optional)
  │
  ├─→ Enter Optional Fields:
  │    ├─ CIF Name
  │    ├─ Phone
  │    ├─ Location
  │    ├─ Note
  │    └─ CIF Progress
  │
  ├─→ Link Related Records (optional):
  │    ├─ Case
  │    └─ Opportunity
  │
  ├─→ Click "Save"
  │    └─→ Record Created
  │        CIF ID Auto-Generated
  │        Timestamp Recorded
  │
  ├─→ System Returns to List View
  │    └─→ New Record Visible at Top
  │
  END
```

### Workflow 2: View & Edit CIF Record

```
START
  │
  ├─→ View Competitor Information List
  │
  ├─→ Click CIF ID Link
  │    └─→ Existing Record Opens in View Mode
  │
  ├─→ Click "Edit" Button
  │    └─→ Record Enters Edit Mode
  │        All Fields Become Editable
  │
  ├─→ Modify Required Fields
  │    └─→ Customer Name, Account, Informan, etc.
  │
  ├─→ Update Progress Status
  │    └─→ Change CIF Progress to "In Progress" or "Completed"
  │
  ├─→ Add/Link Related Records
  │    ├─→ Assign to Case
  │    ├─→ Link to Opportunity
  │    └─→ Assign Supervisor
  │
  ├─→ Click "Save"
  │    └─→ Changes Persisted to Database
  │        Last Modified By & Timestamp Updated
  │
  ├─→ System Returns to View Mode
  │    └─→ Updated Data Displayed
  │
  END
```

### Workflow 3: Delete CIF Record

```
START
  │
  ├─→ Open CIF Record
  │
  ├─→ Click "Delete" Button
  │
  ├─→ Confirmation Dialog Appears
  │    "Are you sure you want to delete this record?"
  │
  ├─→ Confirm Deletion
  │    └─→ Record Deleted
  │        Audit Log Entry Created
  │
  ├─→ Return to List View
  │    └─→ Record No Longer Visible
  │
  END
```

### Workflow 4: Search & Filter CIF Records

```
START
  │
  ├─→ View Competitor Information List
  │
  ├─→ Option A: Quick Search
  │    ├─→ Click in "Search this list..." field
  │    ├─→ Type CIF ID, Customer Name, or Informant
  │    └─→ Results Filter in Real-Time
  │
  ├─→ Option B: Advanced Filter
  │    ├─→ Click "Filter" button
  │    ├─→ Select Filter Criteria:
  │    │    ├─ Record Type = "Mechanic CIF"
  │    │    ├─ Created Date (Date Range)
  │    │    ├─ Sales Office (Dropdown)
  │    │    ├─ CIF Progress (Status)
  │    │    └─ Created By (User)
  │    │
  │    ├─→ Apply Filter
  │    └─→ List Updates with Matching Records
  │
  ├─→ Option C: Sort List
  │    ├─→ Click Column Header to Sort
  │    ├─→ First Click: Ascending Order
  │    ├─→ Second Click: Descending Order
  │    └─→ List Reorders Accordingly
  │
  ├─→ View Filtered Results
  │
  END
```

---

## Form Controls & Actions

### Top-Level Actions

#### New Button
- **Location**: List View toolbar
- **Function**: Create new CIF record
- **Behavior**: Opens blank form with default values
- **Permissions**: Requires CIF Create privilege

#### Edit Button
- **Location**: Form view header
- **Function**: Enable edit mode
- **Behavior**: Converts read-only fields to editable
- **Permissions**: Requires CIF Update privilege

#### Delete Button
- **Location**: Form view header
- **Function**: Remove CIF record
- **Behavior**: Shows confirmation dialog, then deletes
- **Permissions**: Requires CIF Delete privilege

#### Save Button
- **Location**: Form footer (appears during edit)
- **Function**: Persist changes to database
- **Behavior**: Validates required fields, saves, returns to view
- **Validations**: 
  - Required fields must be populated
  - Account name must exist
  - Phone number format validation

#### Cancel Button
- **Location**: Form footer (appears during edit)
- **Function**: Discard changes
- **Behavior**: Returns to view mode without saving
- **Data Loss**: Any unsaved changes are lost

### Search & Filter Controls

#### Search Box
```
[Search this list...]
```
- Real-time filtering across:
  - CIF ID
  - Customer Name
  - Informant Name
  - Sales Office

#### Filter Dropdown
```
[Filter v]
```
- Predefined filter templates:
  - By Record Type
  - By Creation Date Range
  - By Sales Office
  - By Progress Status
  - By Created User

#### Column Display Control
```
[Column Display v]
```
- Show/hide columns:
  - CIF ID, Record Type, Created Date, Created By, Plant, Plant Code
  - Sortable columns indicated with arrow icons

#### Sort Order
```
Sorted by: CIF ID • Updated 3 minutes ago
```
- Current sort column and direction
- Click column header to change sort
- Multi-column sort supported (Ctrl+Click)

### Printable View

#### Printable Format Options
- **Print Button**: Generate printer-friendly format
- **PDF Export**: Save as PDF document
- **Header/Footer**: Page numbers, date, company info
- **Table Formatting**: Optimized for paper output

---

## Data Validation Rules

### Required Field Validation

#### Must Be Filled
- **Customer Name**: Free text entry, must not be empty
- **Account Name**: Must reference existing account record
- **Informan Name**: Free text entry, must not be empty

#### Validation Logic
```
IF Customer Name = NULL → Display Error: "Customer Name is required"
IF Account Name = NULL OR Account not exist → Display Error: "Please select valid Account"
IF Informan Name = NULL → Display Error: "Informan Name is required"
```

### Conditional Validations

#### CIF Progress Status
```
IF CIF Progress = "Completed"
  → REQUIRE: Approve Date must be populated
  → REQUIRE: Supervisor must be assigned
  → WARN: Has Case assignment
```

#### Account Linkage
```
IF Account Name selected
  → AUTO-FILL: Customer Name from Account record
  → AUTO-FILL: Account Division (if available)
  → VALIDATE: Sales Office matches Account division
```

#### Work Order Reference
```
IF No. WO is populated
  → VALIDATE: Work order exists in system
  → VALIDATE: Work order status allows CIF creation
  → LINK: CIF to Work Order record
```

### Field-Level Validations

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| Phone | Numeric or standard format | "Invalid phone number format" |
| Approve Date | Must be after Created Date | "Approve date cannot be in past" |
| Supervisor | Must be active user | "Selected supervisor is inactive" |
| CIF ID | Unique across system | "CIF ID already exists" |
| Account Name | Must exist in Account table | "Account not found" |

---

## Integration Points

### Related Objects & Relationships

#### Case Integration
```
CIF Record ←→ Case Record

Relationship Type: Many-to-One
├─ One CIF can link to one Case
├─ One Case can have multiple CIFs
└─ Use: Track competitor intel related to specific service case
```

**Actions**:
- Link CIF to Case during CIF creation
- View all CIFs linked to a Case
- Create new Case from CIF record

#### Opportunity Integration
```
CIF Record ←→ Opportunity Record

Relationship Type: Many-to-One
├─ One CIF can link to one Opportunity
├─ One Opportunity can have multiple CIFs
└─ Use: Associate competitive intelligence with sales opportunity
```

**Actions**:
- Link CIF to Opportunity
- View competitor data in Opportunity context
- Influence opportunity strategy with CIF data

#### Account Integration
```
CIF Record ←→ Account Record

Relationship Type: Many-to-One
├─ One CIF must link to one Account
├─ One Account can have many CIFs
└─ Use: Organize competitor data by customer account
```

**Account Information Pulled**:
- Customer Name
- Account Division
- Sales Office
- Account Status

#### User Integration
```
CIF Record ←→ User Record

Relationships:
├─ Created By: User who created CIF
├─ Last Modified By: User who last edited CIF
├─ Supervisor: User who approves CIF
└─ Informant: Contact person providing information
```

### API Integration Points

#### REST Endpoints

```
GET /competitor-info
├─ Retrieve list of all CIF records
├─ Parameters: filter, sort, page
└─ Response: Array of CIF objects

GET /competitor-info/{cifId}
├─ Retrieve specific CIF record
├─ Parameters: cifId
└─ Response: Single CIF object

POST /competitor-info
├─ Create new CIF record
├─ Body: CIF object with required fields
└─ Response: Created CIF with ID

PUT /competitor-info/{cifId}
├─ Update existing CIF record
├─ Parameters: cifId
├─ Body: Updated CIF fields
└─ Response: Updated CIF object

DELETE /competitor-info/{cifId}
├─ Delete CIF record
├─ Parameters: cifId
└─ Response: Confirmation message

GET /competitor-info/{cifId}/cases
├─ Get all cases linked to CIF
├─ Parameters: cifId
└─ Response: Array of Case objects

GET /competitor-info/{cifId}/opportunities
├─ Get all opportunities linked to CIF
├─ Parameters: cifId
└─ Response: Array of Opportunity objects
```

#### JSON Schema

```json
{
  "cifId": "00382851-CIF1",
  "noWo": "00382851",
  "cifName": "Competitor Analysis Q4 2023",
  "recordType": "Mechanic CIF",
  "customerName": "Harmoni Panca Utama",
  "accountName": "Harmoni Panca Utama",
  "accountDivision": "Service Division",
  "salesOffice": "TJ-TJR",
  "informanName": "Tulus",
  "phone": "0",
  "locationCustomer": "Jakarta, Indonesia",
  "note": "Detailed observations about competitor activities",
  "cifProgress": "New",
  "caseId": null,
  "opportunityId": null,
  "createdBy": "Mahendra Noveya Rahman",
  "createdDate": "2022-12-13T08:04:00Z",
  "supervisor": null,
  "approveDate": null,
  "lastModifiedBy": "Mahendra Noveya Rahman",
  "lastModifiedDate": "2022-12-13T08:04:00Z"
}
```

---

## User Permissions

### Role-Based Access Control

#### Permission Levels

| Role | Create | Read | Update | Delete | Approve | Export |
|------|--------|------|--------|--------|---------|--------|
| System Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sales Manager | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| Sales Rep | ✓ | ✓ | Own | ✗ | ✗ | ✓ |
| Service Manager | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| Service Agent | ✓ | ✓ | Own | ✗ | ✗ | ✗ |
| Guest User | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |

#### Permission Details

**Create CIF**: Users can create new CIF records
- Required Role: Sales Rep or higher
- Required Field Access: All core fields must be writable
- Action: "New" button visible and functional

**Read CIF**: Users can view CIF records
- Required Role: All authenticated users
- Scope: Can view records they created or assigned to them
- Action: List view and record details visible

**Update CIF**: Users can edit CIF records
- Required Role: Sales Rep (own records) or Sales Manager (all records)
- Scope: Own records or all records based on role
- Action: "Edit" button visible and functional
- Protected Fields: CIF ID (immutable), Created By (read-only)

**Delete CIF**: Users can remove CIF records
- Required Role: Sales Manager or System Admin only
- Scope: All CIF records
- Action: "Delete" button visible (restricted roles)
- Confirmation: Required confirmation before deletion

**Approve CIF**: Users can approve CIF records
- Required Role: Sales Manager or designated Supervisor
- Field: Can set Supervisor and Approve Date
- Status: Can mark CIF Progress as "Completed"

**Export CIF**: Users can export/print CIF data
- Required Role: Sales Rep or higher
- Format: PDF, CSV, Print
- Scope: Can export records they have read access to

### Field-Level Security

#### Public Fields (All Users Can Read)
- CIF ID
- Customer Name
- Record Type
- Created Date
- Created By

#### Restricted Fields (Requires Update Permission)
- CIF Progress
- Supervisor
- Approve Date
- Note
- Informan Name

#### Read-Only Fields (Never Editable)
- CIF ID (auto-generated)
- Created By (system set)
- Created Date (system set)
- Last Modified By (system set)
- Record Type (set at creation)

---

## Best Practices

### For CIF Data Entry

1. **Accuracy**: Verify all customer and account information before saving
2. **Completeness**: Fill in all optional fields when available for better analytics
3. **Timeliness**: Create CIF records promptly after gathering competitive intelligence
4. **Clarity**: Use Note field to document source and context of information
5. **Linkage**: Link CIFs to related Cases or Opportunities for context

### For CIF Management

1. **Regular Review**: Review CIF Progress status periodically
2. **Approval Flow**: Route to Supervisor for approval before marking Complete
3. **Cleanup**: Archive or delete outdated CIF records
4. **Consistency**: Use standardized Informant names and locations
5. **Documentation**: Maintain clear audit trail through Notes field

### For CIF Utilization

1. **Strategic Use**: Reference CIFs in competitive analysis meetings
2. **Opportunity Integration**: Link CIFs to related business opportunities
3. **Case Resolution**: Use CIF data to support service case decisions
4. **Reporting**: Export CIF data for competitive intelligence reports
5. **Training**: Use CIF examples to train sales and service teams

---

## Troubleshooting

### Common Issues

#### Issue: Cannot Create New CIF
**Causes**:
- Insufficient permissions (Create privilege required)
- Account name does not exist or is inactive
- Required fields left empty

**Solution**:
1. Check user role and permissions
2. Verify Account record exists and is active
3. Populate all required fields: Customer Name, Account Name, Informan Name

#### Issue: CIF Not Appearing in List
**Causes**:
- Record just created (may require page refresh)
- Active filter hiding the record
- Search criteria too restrictive

**Solution**:
1. Click Refresh button to reload list
2. Clear any active filters
3. Check search box is empty
4. Verify record was saved successfully

#### Issue: Cannot Link to Case or Opportunity
**Causes**:
- Case/Opportunity record does not exist
- Record is in inactive status
- Permission restrictions

**Solution**:
1. Verify Case or Opportunity exists in system
2. Check record status is Active
3. Confirm update permissions for CIF
4. Try searching for record by full ID

#### Issue: Approval Not Saving
**Causes**:
- Supervisor field not populated
- Approve Date in invalid format
- Missing required fields

**Solution**:
1. Select valid Supervisor user
2. Set Approve Date using date picker
3. Ensure all required fields are filled
4. Click Save again

---

## Reporting & Analytics

### Standard CIF Reports

#### 1. CIF Summary by Sales Office
- Count of CIF records per sales office
- Creation trends over time
- Progress status breakdown
- Most active informants

#### 2. Competitor Intelligence Dashboard
- Top competitors referenced in CIFs
- Customer accounts with competitor threats
- Linked opportunities with CIF data
- CIF approval metrics

#### 3. CIF Activity Report
- CIF records created per user
- Average time to approval
- CIF progress pipeline
- Aged/stale CIF records

#### 4. Account Competitive Analysis
- All CIFs linked to specific account
- Competitor information by account
- Related opportunities
- Action items and follow-ups

---

## Security & Compliance

### Data Protection
- CIF records contain sensitive competitive intelligence
- Access restricted by user role and permissions
- Audit log tracks all create/read/update/delete operations
- Data encrypted in transit and at rest

### Compliance Considerations
- Maintain confidentiality of competitor information
- Document source of information in Note field
- Obtain approval before sharing externally
- Comply with antitrust and competition laws

### Audit Trail
All CIF activities logged with:
- User ID and timestamp
- Field changes with before/after values
- Deletion records with reason
- Access logs for compliance review

---

## API Integration Examples

### Create CIF via API

```javascript
POST /competitor-info
Content-Type: application/json

{
  "customerName": "Harmoni Panca Utama",
  "accountName": "Harmoni Panca Utama",
  "informanName": "Tulus",
  "salesOffice": "TJ-TJR",
  "recordType": "Mechanic CIF",
  "phone": "0",
  "note": "Competitive intelligence gathered from market survey"
}

Response:
{
  "cifId": "00382851-CIF1",
  "status": "created",
  "createdDate": "2023-12-13T08:04:00Z"
}
```

### Update CIF via API

```javascript
PUT /competitor-info/00382851-CIF1
Content-Type: application/json

{
  "cifProgress": "In Progress",
  "supervisor": "manager@company.com",
  "note": "Analysis in progress - preliminary findings show market shift"
}

Response:
{
  "cifId": "00382851-CIF1",
  "status": "updated",
  "lastModifiedDate": "2023-12-13T09:30:00Z"
}
```

### Retrieve CIF Records via API

```javascript
GET /competitor-info?salesOffice=TJ-TJR&progress=New&limit=10

Response:
{
  "total": 25,
  "records": [
    {
      "cifId": "00382851-CIF1",
      "customerName": "Harmoni Panca Utama",
      "informanName": "Tulus",
      "salesOffice": "TJ-TJR",
      "cifProgress": "New",
      "createdBy": "Mahendra Noveya Rahman",
      "createdDate": "2022-12-13T08:04:00Z"
    },
    ...
  ]
}
```

---

## Form Submission Workflow

### Step-by-Step Form Completion

#### Step 1: Basic Information
- Fill Customer Name
- Select Account Name
- Enter Informan Name (contact person)

#### Step 2: Contact Details
- Enter Phone number (optional)
- Specify Location Customer
- Select Sales Office

#### Step 3: Observations & Notes
- Add competitive intelligence details in Note field
- Reference sources of information
- Document relevant market insights

#### Step 4: Workflow Setup
- Set CIF Progress status
- Link to related Case (if applicable)
- Link to related Opportunity (if applicable)

#### Step 5: Approval Setup
- Assign Supervisor (for approval)
- Complete form

#### Step 6: Submission
- Click "Save" to create/update record
- System validates all required fields
- CIF ID generated (for new records)
- Confirmation message displayed

---

## Module Settings & Configuration

### System Administrator Controls

#### CIF Record Types
- Mechanic CIF (current)
- Sales CIF (optional)
- Strategic CIF (optional)
- Add custom types as needed

#### Sales Office Configuration
- Dropdown values: TJ-TJR, DKI, Bandung, Surabaya, etc.
- Customize based on company structure
- Link to geographic regions and territories

#### Approval Workflows
- Configure multi-level approvals
- Set up email notifications on status changes
- Define completion criteria

#### Field Customization
- Hide/show optional fields
- Change field labels
- Adjust field order on form
- Add custom fields for business needs

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-05-27 | Initial Competitor Info (CIF) module documentation |

---

## Quick Reference

### Key CIF Record ID: 00382851-CIF1
- **Customer**: Harmoni Panca Utama
- **Informant**: Tulus
- **Sales Office**: TJ-TJR
- **Record Type**: Mechanic CIF
- **Status**: New
- **Created By**: Mahendra Noveya Rahman (13/12/2022, 08:04)

### Module Access Path
UT Service Console → [Module Dropdown] → Competitor Information

### Common Actions
- **Create New**: Click "New" button → Fill form → Save
- **View Record**: Click CIF ID → View details
- **Edit Record**: Click "Edit" → Modify fields → Save
- **Search**: Use "Search this list" box → Enter criteria
- **Filter**: Click "Filter" button → Set conditions → Apply
- **Export**: Click "Printable View" or print icon

---

**Document Owner**: Service Console Administration Team  
**Last Updated**: May 27, 2025  
**Next Review**: August 27, 2025  
**Status**: PUBLISHED
