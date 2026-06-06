# Service Product Module - Enhanced UI Design Document
## Sidebar Navigation & Multi-Tab Interface

## 1. Executive Summary

This enhanced design document builds upon the foundational Service Product Module design to provide a complete specification for the **Sidebar Navigation Architecture** and **Multi-Tab Interface System**. The module now features a sophisticated left-side navigation panel providing instant access to core service product management functions (Service Product, Pricebook, Problem, PartRequest), combined with a main content area supporting multiple viewing modes (Details, History, Attachments, Feed) and linked object panels. This architecture optimizes workflow efficiency for product managers, pricing teams, and service delivery personnel.

---

## 2. Complete System Architecture

### 2.1 Overall Page Layout Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          HEADER NAVIGATION                                 │
│  UT Console > Service Product / Pricebook / Problem / PartRequest > Record │
└────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────┬──────────────────────┐
│                  │                                 │                      │
│   SIDEBAR NAV    │    MAIN CONTENT AREA            │   LINKED OBJECTS     │
│   (Left Panel)   │    (65% width)                  │   PANEL (Right)      │
│   18% width      │                                 │   17% width          │
│                  │  ┌─────────────────────────────┐│                      │
│  • Service Prod. │  │ Details │ History │ Feed    ││  • Linked Data       │
│  • Pricebook     │  │ Attachments (Additional)     ││  • Related Records   │
│  • Problem       │  ├─────────────────────────────┤│  • Quick Links       │
│  • PartRequest   │  │                             ││  • Status Indicators │
│                  │  │  TAB CONTENT                 ││  • Actions Panel     │
│  [Icons + Labels]│  │  (Dynamic based on selection)│                      │
│                  │  │                             ││                      │
│  +New Request    │  │                             ││                      │
│                  │  └─────────────────────────────┘│                      │
│                  │                                 │                      │
└──────────────────┴─────────────────────────────────┴──────────────────────┘
```

---

## 3. Sidebar Navigation Architecture

### 3.1 Sidebar Structure & Design

**Purpose**: Provide quick navigation between related modules and current record management.

```
┌──────────────────────────┐
│  UT Console              │
│  Service Product         │ ← Current Module Label
├──────────────────────────┤
│                          │
│  🔧 Service Product (A)  │
│  📚 Pricebook            │
│  ⚠️  Problem              │
│  📦 PartRequest          │
│                          │
│  [+ New Request Button] │
│                          │
└──────────────────────────┘
```

#### 3.1.1 Sidebar Navigation Items

| Icon | Label | Purpose | Active State | Navigation |
|------|-------|---------|--------------|-----------|
| 🔧 | Service Product | Main product definition module | Current view | Highlights in yellow |
| 📚 | Pricebook | Pricing catalog management | Related navigation | Opens new view |
| ⚠️ | Problem | Problem/Issue tracking | Related navigation | Opens Problem module |
| 📦 | PartRequest | Parts requirement management | Related navigation | Opens PartRequest list |

#### 3.1.2 Active State Styling
- **Current Module**: Yellow/gold background highlight
- **Icon + Text**: Bold font weight when active
- **Hover State**: Light gray background for non-active items
- **Visual Indicator**: Left border stripe for current selection

#### 3.1.3 Action Button
```
┌──────────────────────────┐
│  + New Request           │
│                          │
│  (Click to create new)   │
│  PartRequest record      │
│                          │
└──────────────────────────┘
```

**Features:**
- Creates new PartRequest linked to current Service Product
- Quick action for parts management
- Located at bottom of sidebar
- Always visible regardless of scroll position

---

## 4. Enhanced Main Content Area

### 4.1 Tab Navigation System (Multi-Tab Interface)

**Purpose**: Organize related information into logically grouped views for different use cases.

```
┌─────────────────────────────────────────────────────────────┐
│  Details  │  History  │  Attachments (2)  │  Feed            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [TAB CONTENT - Dynamic based on selected tab]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.1 Tab Descriptions

**Tab 1: Details** (Primary View)
- **Content**: Product specification, classification, technical details
- **Default**: Opens on page load
- **Use Case**: Product information review and editing
- **Features**:
  - Expandable field sections
  - Inline edit capability
  - Field grouping by category
  - Related record links
  - Active status indicators

**Tab 2: History** (Audit Trail)
- **Content**: Change history, audit log, version tracking
- **Use Case**: Track modifications and compliance auditing
- **Features**:
  - Chronological change log
  - User attribution
  - Field-level change tracking
  - Before/after values
  - Timestamp tracking
  - Bulk change visibility

**Tab 3: Attachments (2)** (Document Management)
- **Content**: Specifications, datasheets, images, documentation
- **Use Case**: Access related documentation and visual references
- **Features**:
  - File list with counts
  - File type icons
  - Download capability
  - File versioning
  - Upload interface
  - Drag-and-drop support
  - Preview capability

**Tab 4: Feed** (Collaboration)
- **Content**: Chatter feed, comments, team updates
- **Use Case**: Team collaboration and communication
- **Features**:
  - Post/comment interface
  - Threaded discussions
  - @mention support
  - Like/emoji reactions
  - Rich text formatting
  - File sharing
  - Activity streaming

#### 4.1.2 Tab Styling & States
```
Active Tab:
  • Blue underline (3px)
  • Bold text (#212529)
  • White background
  
Inactive Tab:
  • Gray text (#6C757D)
  • Transparent background
  • Hover: Gray underline preview

Badge System:
  • Attachments (2) - Shows count
  • Feed - Shows unread count if applicable
  • History - Optional activity count
```

---

## 5. Details Tab - Comprehensive Structure

### 5.1 Details Tab Layout (Organized Sections)

**Purpose**: Display complete product metadata organized by logical categories.

```
┌─────────────────────────────────────────────────────────────┐
│  Details Tab (Primary View)                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ▼ PRODUCT IDENTIFICATION                              [▼]  │
│  ├─ Product Name: RI SWIVEL JOINT PC200                    │
│  ├─ Material Number: RISWJPC200                            │
│  ├─ Material Type: Z55P                                    │
│  ├─ Equipment UoM: ABCC2                                   │
│  └─ SAP External Key: RISWJPC200                           │
│                                                              │
│  ▼ CLASSIFICATION                                      [▼]  │
│  ├─ Service Product Classification: B1Z                    │
│  ├─ Material Group: A20                                    │
│  ├─ Product Hierarchy: 123456789012345678                  │
│  ├─ Product Commodity: [empty]                             │
│  └─ Product Family: [Standard Category]                    │
│                                                              │
│  ▼ TECHNICAL DETAILS                                   [▼]  │
│  ├─ Base Unit of Measure: EA                               │
│  ├─ Net Weight: 165.00 KG                                  │
│  ├─ Gross Weight: 150.00 KG                                │
│  ├─ Volume: 0.75 M3                                        │
│  └─ Type of Technical Object: [empty]                      │
│                                                              │
│  ▼ STATUS & ACTIVATION                                 [▼]  │
│  ├─ Active: ✓ (Checked)                                    │
│  ├─ Material Status: Stock Item                            │
│  ├─ Part Type: Service Product                             │
│  ├─ Description of Technical Object: [empty]               │
│  └─ Update Usage: [empty]                                  │
│                                                              │
│  ▼ ORGANIZATIONAL INFORMATION                          [▼]  │
│  ├─ Plant: [empty]                                         │
│  ├─ Room: [empty]                                          │
│  ├─ Main Work Center: [empty]                              │
│  ├─ Service Area: [empty]                                  │
│  └─ Industry Key: [empty]                                  │
│                                                              │
│  ▼ SYSTEM INFORMATION                                  [▼]  │
│  ├─ Created By: SYSTEM_ADMIN (2023-10-27)                 │
│  ├─ Last Modified By: JDOE_ENG (2024-01-15)               │
│  ├─ Product Currency: IDR - Indonesian Rupiah             │
│  └─ System Status: [empty]                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Field Organization Strategy

**Expandable Sections** (Collapsible for space optimization)

1. **Product Identification** - Core identifiers
2. **Classification** - Hierarchical categorization
3. **Technical Details** - Specifications and measurements
4. **Status & Activation** - Availability and lifecycle
5. **Organizational Information** - Operational context
6. **System Information** - Metadata and audit

**Features**:
- Toggle collapse/expand with [▼] arrow
- All sections expanded by default
- Collapsed state indicates section has hidden content
- Smooth animation on expand/collapse
- Keyboard accessible (Enter key expands)

---

## 6. History Tab - Audit Trail Interface

### 6.1 History Tab Structure

**Purpose**: Track all changes to the service product for compliance and debugging.

```
┌─────────────────────────────────────────────────────────────┐
│  History Tab (Audit Trail)                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Filter Controls]                                          │
│  Timeframe: [All Time ▼]  Field: [All Fields ▼]            │
│  User: [All Users ▼]  Action: [All ▼]                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CHANGE HISTORY LOG                                  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │ 2024-01-15 14:32 | JDOE_ENG modified Product      │   │
│  │ Field: Material Status                              │   │
│  │ From: "Active" → To: "Stock Item"                  │   │
│  │ ─────────────────────────────────────────────────  │   │
│  │                                                     │   │
│  │ 2024-01-10 09:15 | SYSTEM_ADMIN created record    │   │
│  │ All fields initialized                              │   │
│  │ ─────────────────────────────────────────────────  │   │
│  │                                                     │   │
│  │ 2023-12-22 16:45 | PSMITH modified Product         │   │
│  │ Field: Equipment UoM                                │   │
│  │ From: "PCE" → To: "ABCC2"                          │   │
│  │ ─────────────────────────────────────────────────  │   │
│  │                                                     │   │
│  │ 2023-10-27 02:00 | SYSTEM_ADMIN created record    │   │
│  │ Initial SAP sync                                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [Load More History...]                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 History View Features

**Display Elements**:
- **Timestamp**: Date and time of change
- **User Attribution**: Who made the change
- **Action Type**: Created, Modified, Deleted, etc.
- **Field Name**: Which field was changed
- **Before Value**: Original value
- **After Value**: New value
- **Change Summary**: Brief description

**Filter Controls**:
- **Timeframe**: All Time, Last 30 Days, Last 90 Days, Custom Range
- **Field**: Specific field selection or All Fields
- **User**: Filter by user who made change
- **Action**: Create, Modify, Delete, Status Change

**Features**:
- Chronological sorting (newest first)
- Expandable change details
- User profile links
- Field-level change tracking
- Color-coded change types
- Pagination for large datasets
- Export to CSV option
- Search within history

---

## 7. Attachments Tab - Document Management

### 7.1 Attachments Tab Structure

**Purpose**: Manage product specifications, datasheets, images, and related documentation.

```
┌─────────────────────────────────────────────────────────────┐
│  Attachments (2) Tab                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Upload Area (Drag & Drop Support)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [+ Upload Files]  or drag files here              │   │
│  │                                                     │   │
│  │  Supported: PDF, DOC, XLS, JPG, PNG, ZIP          │   │
│  │  Max 100MB per file                                │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│  ATTACHED FILES (2)                                         │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📄 RI-SWIVEL-JOINT-PC200-Datasheet.pdf               │  │
│  │    Uploaded: 2024-01-10 | Size: 2.4 MB               │  │
│  │    Uploaded By: JDOE_ENG                             │  │
│  │    [Download]  [Preview]  [Delete]                  │  │
│  │    [Show Image if supported]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🖼️  RI-SWIVEL-JOINT-ASSEMBLY.jpg                     │  │
│  │    Uploaded: 2024-01-05 | Size: 1.8 MB               │  │
│  │    Uploaded By: PSMITH                               │  │
│  │    [Download]  [Preview]  [Delete]                  │  │
│  │    [Show Image: Yes ✓]                              │  │
│  │                                                      │  │
│  │    [IMAGE PREVIEW AREA]                              │  │
│  │    [Thumbnail or inline image display]               │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 File Management Features

**Upload Functionality**:
- Drag-and-drop support
- Click to upload button
- Multiple file selection
- Progress indicator during upload
- File type validation
- Size validation (100MB max)
- Duplicate file detection

**File List Display**:
- File icon (by type)
- File name (clickable for download)
- Upload date and time
- File size
- Uploaded by (user attribution)
- Version number if applicable

**File Actions**:
- **Download**: Save file locally
- **Preview**: View file inline (PDFs, images)
- **Delete**: Remove from record (with confirmation)
- **Show Image**: Toggle image preview on/off
- **Rename**: Change file name
- **Share**: Get shareable link

**File Type Support**:
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT
- Images: JPG, PNG, GIF, BMP, SVG
- Archives: ZIP, RAR, 7Z
- Other: TXT, CSV, JSON

---

## 8. Feed Tab - Collaboration Interface

### 8.1 Feed Tab Structure (Chatter)

**Purpose**: Enable team collaboration through threaded discussions and updates.

```
┌─────────────────────────────────────────────────────────────┐
│  Feed Tab (Collaboration)                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Post Composer (Sticky at Top)                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 Your Name                                         │   │
│  │                                                     │   │
│  │ [Share an update...]                                │   │
│  │                                                     │   │
│  │ [B I U] [@mention] [emoji] [file]  [Share]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Feed Controls                                              │
│  Sort by: [Most Recent ▼]  Filter: [All ▼]                │
│  [Search feed...]                                           │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│  ACTIVITY FEED                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 JDOE_ENG                                          │   │
│  │    Modified service product specifications           │   │
│  │    18 Jan 2024 at 14:32                              │   │
│  │                                                     │   │
│  │    Field: Equipment UoM                              │   │
│  │    Updated to: ABCC2                                │   │
│  │                                                     │   │
│  │    ❤️ Like  💬 Comment (2)  ⋯ More                  │   │
│  │                                                     │   │
│  │    👤 PSMITH (2 days ago)                           │   │
│  │    Good catch! This aligns with new standards       │   │
│  │    ❤️ Like  ↩️ Reply                                 │   │
│  │                                                     │   │
│  │    👤 @SYSTEM_ADMIN                                 │   │
│  │    Thanks for the collaboration on this update      │   │
│  │    ❤️ Like  ↩️ Reply                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📌 SYSTEM                                            │   │
│  │    Created product record                            │   │
│  │    10 Jan 2024 at 09:15                              │   │
│  │                                                     │   │
│  │    Service Product: RI SWIVEL JOINT PC200           │   │
│  │    Status: Active                                   │   │
│  │                                                     │   │
│  │    ❤️ Like  💬 Comment  ⋯ More                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [Load More Updates...]                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Feed Features

**Post Composer**:
- Text input area with rich text formatting
- Formatting toolbar (Bold, Italic, Underline)
- @mention support for team notifications
- Emoji picker
- File attachment button
- Post/Cancel buttons

**Post Display**:
- User avatar and name
- Action description
- Timestamp
- Post content
- Change details or message
- Attachment thumbnails

**Engagement Features**:
- Like button (heart icon)
- Comment count badge
- Comment thread support
- Reply functionality
- Rich text in comments
- User notifications via @mention

**Feed Controls**:
- Sort dropdown (Most Recent, Oldest, Most Liked)
- Activity type filter (All, Posts, Changes, System)
- Search/filter posts
- Refresh button

**Activity Types**:
- 👤 User posts (discussions, updates)
- 📌 System events (record created, modified)
- 🔗 Link events (related records created)
- ⚡ Status changes (activation, deactivation)

---

## 9. Right Panel - Linked Objects & Actions

### 9.1 Linked Objects Panel Structure

**Purpose**: Display related records and quick action items in sidebar context.

```
┌──────────────────────────────────────┐
│  LINKED OBJECTS PANEL (Right Side)   │
├──────────────────────────────────────┤
│                                      │
│  Linked Price Books                  │
│  ┌──────────────────────────────────┐│
│  │ ID      Region  Valid To  Manage │││
│  │ PS-2024-  North  2024-12-31  [⋮] │││
│  │ NA                                │││
│  │ PS-2024-  Europe 2024-12-31  [⋮] │││
│  │ EU                                │││
│  │                     [View All (4)]│││
│  └──────────────────────────────────┘│
│                                      │
│  Recent Part Requests                │
│  ┌──────────────────────────────────┐│
│  │ REQ-#0612                         │││
│  │ Excavator Boom Maintenance        │││
│  │ Status: PENDING                   │││
│  │                                   │││
│  │ REQ-#8845                         │││
│  │ Roadside Service Kit              │││
│  │ Status: APPROVED                  │││
│  │                     [View All]    │││
│  └──────────────────────────────────┘│
│                                      │
│  Quick Actions                       │
│  ┌──────────────────────────────────┐│
│  │ [Create Request]                  │││
│  │ [Generate PDF]                    │││
│  │ [Export to SAP]                   │││
│  │ [Manage Pricing]                  │││
│  └──────────────────────────────────┘│
│                                      │
└──────────────────────────────────────┘
```

### 9.2 Panel Components

**Linked Price Books**:
- Display 2 most recent pricebooks
- Show ID, Region, Valid To date
- Menu button for manage/edit options
- View All link for complete list
- Quick price update access

**Recent Part Requests**:
- Show 2 most recent requests
- Display request ID and name
- Status badge (Pending, Approved)
- Quick access to details
- View All for complete history

**Quick Actions**:
- Create new PartRequest
- Generate product PDF
- Export to SAP system
- Manage pricing tiers
- Create new version
- Archive product

**Status Indicators**:
- Color-coded badges (Green=Active, Red=Inactive, Yellow=Pending)
- Status counts
- Alert indicators for overdue items

---

## 10. Complete Data Flow by Module

### 10.1 Service Product Flow
```
Service Product (Main Record)
├── Identification
│   ├── Product Name: RI SWIVEL JOINT PC200
│   ├── Material Number: RISWJPC200
│   └── SAP External Key: RISWJPC200
│
├── Classification
│   ├── Product Family: Standard
│   ├── Material Type: Z55P
│   └── Product Category: KOMAT
│
└── Related Records
    ├── Pricebooks (2)
    ├── Part Requests (3+)
    └── Problems (linked)
```

### 10.2 Pricebook Flow
```
Pricebook (Pricing Catalog)
├── Standard Price Book
│   ├── List Price: IDR 4,070,000.00
│   ├── Region: North America
│   └── Valid To: 2024-12-31
│
├── Master Service Pricebook
│   ├── List Price: IDR 4,070,000.00
│   ├── Currency: IDR, USD
│   └── Active: Yes
│
└── Linked to Service Product
    └── Automatic price lookup
```

### 10.3 Part Request Flow
```
Part Request (Component Requirement)
├── PR - 000067556
│   ├── Product: O-RING -p
│   ├── Quantity: 4
│   ├── Status: Pending
│   └── Created By: Muji Mustafa
│
├── Part Details
│   ├── Part Number: 07000-13032
│   ├── Actual Part: 07000-13032
│   └── Service Product: RI SWIVEL JOINT PC200
│
└── Work Order Link
    └── Used in service delivery
```

### 10.4 Problem Flow
```
Problem (Issue Tracking)
├── 01248021 - SWIVEL JOINT LEAKAGE
│   ├── Cause: Poor Durability
│   ├── Damage: Leaking Oil/Coolant
│   ├── Priority: High
│   └── Service Area: Palu
│
├── Service Product Link
│   └── RI SWIVEL JOINT PC200
│
└── Related Files
    └── Problem photos/documentation
```

---

## 11. Navigation Workflows

### 11.1 Service Product Management Workflow

```
1. User opens Service Product List
   ↓
2. Clicks on Service Product → Main Details View
   ↓
3. [Option A] Review current product
   - Details tab shows all specifications
   - Linked objects show pricing and parts
   - History tab shows change audit trail
   
4. [Option B] Navigate to related module via Sidebar
   - Click Pricebook → View pricing catalogs
   - Click Problem → View related issues
   - Click PartRequest → View component requirements
   
5. [Option C] Collaborate on product
   - Post update in Feed tab
   - View comments and team discussions
   - Mention team members for notification
   
6. [Option D] Upload documentation
   - Attachments tab
   - Drag-and-drop or upload files
   - Preview specifications
```

### 11.2 Cross-Module Navigation (Sidebar)

```
Current View: Service Product Details
│
├─ Click Pricebook (Sidebar)
│  └─ Opens Pricebook module
│     └─ Shows pricing for this product
│        └─ Can return to Service Product
│
├─ Click Problem (Sidebar)
│  └─ Opens Problem list
│     └─ Filtered to related problems
│        └─ Can return to Service Product
│
└─ Click PartRequest (Sidebar)
   └─ Opens PartRequest list
      └─ Filtered to parts for this product
         └─ Can return to Service Product
```

---

## 12. Responsive Design for Sidebar

### 12.1 Desktop Layout (1920px+)
- Sidebar: 18% width (left)
- Main content: 65% width (center)
- Linked objects: 17% width (right)
- All components fully visible
- Sidebar sticky on scroll

### 12.2 Tablet Layout (768px - 1024px)
- Sidebar: 20% width
- Main content: 80% width (full-width content)
- Linked objects: Collapsed to bottom panel
- Sidebar icons become smaller
- Tab navigation horizontal

### 12.3 Mobile Layout (<768px)
- Sidebar: Hamburger menu (collapsible)
- Main content: Full width
- Linked objects: Bottom sheet (swipe up)
- Tabs: Scrollable horizontal
- Sidebar overlays main content when open

---

## 13. Accessibility Enhancements

### 13.1 Sidebar Navigation
- **Keyboard**: Tab through sidebar items
- **Focus**: Visible 2px focus ring on active item
- **ARIA**: `aria-label` on icons
- **Landmarks**: `nav` region for sidebar
- **Current**: `aria-current="page"` on active item

### 13.2 Tab Navigation
- **Keyboard**: Arrow keys navigate between tabs
- **Enter**: Open selected tab
- **ARIA**: `role="tablist"` on tab container
- **Focus Management**: Focus moves to tab content on open
- **Indicators**: Tab badge counts accessible via screen reader

### 13.3 Content Structure
- **Headings**: Proper hierarchy (H1 > H2 > H3)
- **Sections**: `<section>` tags with aria-labelledby
- **Forms**: Labels associated with inputs
- **Buttons**: Descriptive labels, not just icons
- **Links**: Context in link text

---

## 14. Performance Considerations

### 14.1 Lazy Loading Strategy
- **Sidebar**: Pre-load all icons (minimal)
- **Details Tab**: Load on tab open
- **History Tab**: Paginate changes (50 per page)
- **Attachments**: Lazy load thumbnails
- **Feed**: Virtual scrolling for comments

### 14.2 Rendering Optimization
- **Collapsible Sections**: Prevent rendering hidden content
- **Tab Content**: Only render active tab
- **Images**: Lazy load with Intersection Observer
- **Animations**: GPU-accelerated (transform, opacity)
- **Virtual Lists**: For 50+ items (History, Feed)

---

## 15. User Workflows by Role

### 15.1 Product Manager Workflow
```
1. Opens Service Product list
2. Selects product from list
3. Reviews Details tab for specifications
4. Checks History tab for recent changes
5. Reviews linked Pricebooks in right panel
6. Updates pricing if needed
7. Posts update in Feed for team
8. Navigates to Problem view to assess issues
9. Creates new PartRequest if needed
```

### 15.2 Pricing Team Workflow
```
1. Opens Service Product
2. Clicks "Manage Pricing" in quick actions
3. Views all linked Pricebooks
4. Updates regional pricing
5. Sets effective dates
6. Uploads new price list in Attachments
7. Posts update in Feed
8. Checks History tab for approval audit trail
```

### 15.3 Service Delivery Workflow
```
1. Opens Service Product (via Work Order)
2. Reviews Details tab for specifications
3. Checks PartRequest for components
4. Downloads datasheet from Attachments
5. Reviews Problem history for known issues
6. Views related service notes in Feed
7. Posts work completion update
```

---

## 16. Business Rules & Validations

### 16.1 Service Product Rules
- **Unique Material Number**: System prevents duplicates
- **Active Status**: Inactive products don't appear in quotations
- **SAP Sync**: Changes sync within 5 minutes
- **Pricing Required**: Minimum 1 pricebook linked
- **Audit Trail**: All changes recorded in History

### 16.2 Pricebook Rules
- **Valid Date Range**: End date > Start date
- **Price Validation**: Must be >= 0
- **Currency**: Must be valid ISO code
- **Regional**: Only one price per region/currency
- **Active Flag**: Controls price availability

### 16.3 PartRequest Rules
- **Quantity**: Must be positive integer
- **Part Number**: Must be valid material number
- **Status**: Pending → Approved → Fulfilled
- **Service Product**: Must be linked
- **Tracking**: All changes recorded

---

## 17. Visual Design Specifications

### 17.1 Sidebar Styling
```
Background: #F8F9FA (light gray)
Border-right: 1px solid #E9ECEF (gray border)
Width: 18% (responsive)
Position: Fixed or sticky

Navigation Item:
  Padding: 16px 12px
  Border-left: 3px solid transparent
  Hover: Background #E9ECEF
  Active: Background #FFD700 (yellow)
  Active: Border-left #0066CC (blue)
  
Icon:
  Size: 20px x 20px
  Color: #6C757D (gray)
  Active: Color #0066CC (blue)
  
Label:
  Font: 14px, Regular
  Color: #333333
  Active: Color #000000, Bold
```

### 17.2 Tab Styling
```
Tab List:
  Background: #FFFFFF (white)
  Border-bottom: 2px solid #E9ECEF
  Padding: 0 16px
  
Tab Item:
  Padding: 12px 16px
  Font: 14px, Regular
  Color: #6C757D (gray)
  Border-bottom: 3px solid transparent
  Hover: Color #333333
  
Active Tab:
  Color: #0066CC (blue)
  Border-bottom: 3px solid #0066CC
  Font-weight: Bold
  
Badge:
  Background: #28A745 (green)
  Color: #FFFFFF
  Padding: 2px 6px
  Border-radius: 12px
  Font: 11px, Bold
  Margin-left: 4px
```

### 17.3 Content Area Styling
```
Main Content:
  Width: 65%
  Padding: 32px
  Background: #FFFFFF
  
Section Header:
  Font: 16px, Bold
  Color: #212529
  Margin-bottom: 16px
  
Field Label:
  Font: 11px, Regular
  Color: #999999
  Text-transform: Uppercase
  Margin-bottom: 4px
  
Field Value:
  Font: 14px, Regular
  Color: #333333
  Margin-bottom: 16px
  
Expandable Section:
  Border: 1px solid #E9ECEF
  Padding: 16px
  Margin-bottom: 16px
  Border-radius: 4px
```

---

## 18. Implementation Checklist

### Phase 1: Core Structure (Weeks 1-2)
- [ ] Build sidebar navigation component
- [ ] Implement tab navigation system
- [ ] Create responsive layout grid
- [ ] Build Details tab with sections
- [ ] Implement expand/collapse functionality
- [ ] Add inline edit capability

### Phase 2: Additional Tabs (Weeks 3-4)
- [ ] Build History tab with change log
- [ ] Implement Attachments tab with upload
- [ ] Create Feed tab with Chatter
- [ ] Add comment threading support
- [ ] Build right panel linked objects
- [ ] Add quick action buttons

### Phase 3: Integration & Polish (Weeks 5-6)
- [ ] SAP sync on Details updates
- [ ] Price pull from Pricebook
- [ ] History audit trail population
- [ ] Feed activity streaming
- [ ] Mobile responsiveness
- [ ] Accessibility audit & fixes
- [ ] Performance optimization

---

## 19. Testing Strategy

### 19.1 UI/UX Testing
- Sidebar navigation on all screen sizes
- Tab switching and content loading
- Expand/collapse section functionality
- Attachment upload and preview
- Feed post and comment creation
- Right panel linked objects display

### 19.2 Performance Testing
- Sidebar render time <100ms
- Tab content load <500ms
- History pagination with 1000+ items
- Attachment preview performance
- Feed scroll with 100+ comments
- Mobile sidebar performance

### 19.3 Accessibility Testing
- Keyboard navigation through sidebar
- Tab navigation with arrow keys
- Screen reader testing of all content
- Color contrast verification (4.5:1 minimum)
- Focus indicator visibility
- ARIA label accuracy

---

**Document Version**: 2.0 (Enhanced)  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation - Production Ready

---

## Appendix A: Component Specifications

### Sidebar Navigation Component
```
Props:
  - activeModule (string): Current module
  - items (array): Navigation items
  - onNavigate (function): Navigation handler
  - newRequestAction (function): Create action
  
States:
  - active: Yellow background
  - hover: Light gray background
  - disabled: Grayed out
  
Events:
  - onClick: Navigate to module
  - onNewRequest: Create new PartRequest
```

### Tab Navigation Component
```
Props:
  - tabs (array): Tab definitions
  - activeTab (string): Current tab
  - onTabChange (function): Tab change handler
  - badges (object): Count badges by tab
  
Features:
  - Accessible keyboard navigation
  - Dynamic badge display
  - Lazy content loading
  - Smooth transitions
```

### Details Section Component
```
Props:
  - title (string): Section title
  - fields (array): Field definitions
  - collapsed (boolean): Initial state
  - onExpand (function): Expand handler
  
Features:
  - Collapsible/expandable
  - Inline editing
  - Field grouping
  - Linked record handling
```

---

**END OF ENHANCED DESIGN DOCUMENT**
