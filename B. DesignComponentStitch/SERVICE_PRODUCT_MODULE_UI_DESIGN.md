# Service Product Module - UI Design Document

## 1. Executive Summary

The **Service Product Module** is the critical interface for managing service product catalog, pricing strategies, and service delivery configurations. It serves as the foundational data layer for service offerings across opportunities, quotations, and work orders, providing operations and sales teams with comprehensive visibility into service product definitions, pricing tiers, and service-related component linking. This design document outlines a sophisticated two-column interface featuring:

- **Comprehensive Product Definition** - Technical specifications and product classification
- **Dual-Column Layout** - Detailed product data with linked pricing and parts information
- **Two-Tab Navigation System** - Details and Related Objects
- **Pricebook Management** - Multi-tier pricing with standard price configuration
- **Parts Request Integration** - Link service products to component requirements
- **Price Book Tracking** - Dynamic pricing by geography, customer tier, and volume

---

## 2. Core Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE PRODUCT RECORD                       │
│  (Central Hub for Service Offering Definition & Pricing)        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SERVICE PRODUCT MASTER DATA                             │  │
│  │  • Product Identification & Classification               │  │
│  │  • Technical Specifications                              │  │
│  │  • Service Delivery Configuration                        │  │
│  │  • System Integration Details                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────┬──────────────────────────────┐ │
│  │ COLUMN 1: PRODUCT DETAILS   │  COLUMN 2: PRICING & PARTS   │ │
│  │ • Product Information       │  • Price Books (2+)          │ │
│  │ • Material Classification   │  • Pricing Tiers             │ │
│  │ • Technical Object Types    │  • Standard Price            │ │
│  │ • Product Description       │  • Active Status             │ │
│  │ • SKU & Categorization      │  • Notes                     │ │
│  │ • Status & Activation       │  • Files                     │ │
│  │                             │  • Parts Requests (3+)       │ │
│  │  2 MAIN TABS:               │  • Related Products          │ │
│  │  1. Details Tab             │                              │ │
│  │  2. Related Tab             │                              │ │
│  └─────────────────────────────┴──────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Page-Level Layout Structure

### 3.1 Header Section

**Purpose**: Display product identity, key metrics, and global actions.

```
┌──────────────────────────────────────────────────────────────────┐
│  Product / Material                                              │
│                                                                   │
│  🏷️ RI SWIVEL JOINT PC200                                       │
│                                                                   │
│  Material Number:        RISWJPC200                              │
│  Product Family:         [Standard Categories]                   │
│                                                                   │
│  [Edit]  [Delete]  [Clone]                                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 Header Components
- **Breadcrumb Navigation**: Product / Material path
- **Record Identity**: Icon + Product Name (Material Master)
- **Key Identifiers**: Material Number, Product Family
- **Action Buttons**: Edit, Delete, Clone

---

### 3.2 Tab Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Related  │  Details                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [TAB CONTENT AREA - Dynamic based on selected tab]         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2.1 Tab Order & Structure
1. **Related Tab** - Quick access to pricing and parts (default view)
2. **Details Tab** - Full product metadata and specifications

---

## 4. Column 1: Service Product Details (Main Content Area)

**Layout**: 65% width of the two-column layout

### 4.1 Details Tab Structure

**Purpose**: Display comprehensive product information organized by logical sections.

#### 4.1.1 Product Header Fields

```
┌─────────────────────────────────────────────────────────────┐
│  Details Tab                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Product Name              RI SWIVEL JOINT PC200           │
│  Material Number           RISWJPC200                       │
│  Product Family            [Family Classification]          │
│  Product Currency          IDR - Indonesian Rupiah          │
│  Material Type             Z55P                             │
│  SAP External Key          RISWJPC200                       │
│  Product Category          KOMAT                            │
│  Product Commodity         [empty]                          │
│  Material Status           Stock Item                       │
│  Product Hierarchy         [empty]                          │
│  Serial Number             [empty]                          │
│  Model Unit Number         [empty]                          │
│  Room                      [empty]                          │
│  Plant                     [empty]                          │
│  Material Number Field     [empty]                          │
│  Field Status              [empty]                          │
│  Equipment Number          [empty]                          │
│  Product Description       [empty]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Product identification fields (Name, Material Number)
- Classification hierarchy (Product Family, Type, Category)
- Currency and SAP integration
- Status tracking (Active, Inactive, Draft)
- Organizational attributes (Plant, Room, Area)
- Equipment and serial tracking

#### 4.1.2 System Information Section

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ SYSTEM INFORMATION                                   [▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Created By                👤 UT Integration,              │
│                            22/02/2020, 02:00               │
│                                                              │
│  Last Modified By          👤 UT Integration,              │
│                            07/04/2020, 10:37               │
│                                                              │
│  Active                    ✓ (checked)                     │
│  Description of technical object  [empty]                  │
│  Type of Technical Object   [empty]                        │
│  System Status              [empty]                        │
│  Industry Key               [empty]                        │
│  Time of Measurement        [empty]                        │
│  Main Work Center           [empty]                        │
│  Equipment UoM              ABCC2                          │
│  Part Type                  Service Product                │
│  Update Usage               [empty]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Audit trail (Created By, Last Modified By with timestamps)
- Active status indicator
- Technical classification (Object Type, Industry Key)
- Measurement and work center information
- UoM (Unit of Measure) tracking
- System status flags

---

### 4.2 Related Tab (Default View)

**Purpose**: Display price books, pricing tiers, notes, files, and parts requests.

```
┌─────────────────────────────────────────────────────────────┐
│  Related Tab (Pricing & Parts)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Price Books (2)                     [Add Standard Price] │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Price Book Name    List Price    Use Std Price  Active │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Standard Price...  IDR 4,070,000 ☐             ☑       │ │
│  │ Master Service     IDR 4,070,000 ☑             ✓       │ │
│  │ Pricebook         ...                                   │ │
│  │                                        [View All]       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📝 Notes (0)                                      [New]    │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  (No notes added yet)                                  │ │
│  │                                                         │ │
│  │  [New Note]                                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📁 Files (0)                                  [Add Files]  │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  [Upload Files]                                        │ │
│  │  Or drag files here                                    │ │
│  │                                                         │ │
│  │  (Currently: No files attached)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2.1 Price Books Section

**Purpose**: Manage multiple pricing catalogs and price tiers.

```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Price Books (2)                     [Add Standard Price] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Price Book Name              List Price  Use Std  Activ│
│  │                                         Price       e  │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Standard Price Book          IDR 4,070,000  ☐      ☑   │ │
│  │ Master Service Pricebook     IDR 4,070,000  ☑      ✓   │ │
│  │                                                         │ │
│  │                                        [View All]       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Multiple pricebook support (Standard, Master Service, Regional, etc.)
- Price list display with currency
- Use Standard Price checkbox for override control
- Active flag for price validity
- Add new pricebook button
- View All for complete list

#### 4.2.2 Notes Section

**Purpose**: Internal documentation and comments.

```
┌─────────────────────────────────────────────────────────────┐
│  📝 Notes (0)                                      [New]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  (No notes added yet)                                       │
│                                                              │
│  [New Note]                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Internal note management
- Create new note button
- Note author and timestamps
- Searchable note content

#### 4.2.3 Files Section

**Purpose**: Attach specifications, datasheets, and documentation.

```
┌─────────────────────────────────────────────────────────────┐
│  📁 Files (0)                                  [Add Files]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Upload Files]                                             │
│  Or drag files here                                         │
│                                                              │
│  (Currently: No files attached)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop file upload
- File type support (PDF, DOC, XLS, images, datasheets)
- File versioning
- Download/preview capabilities
- File categorization (Specs, Datasheet, Manual, etc.)

---

## 5. Column 2: Pricing & Parts Information (35% Width)

**Purpose**: Provide quick access to pricing tiers and service part requirements.

### 5.1 Parts Requests Section

**Purpose**: Display component/part requirements for service delivery.

```
┌──────────────────────────────────────────────────────────────┐
│  Parts Requests (3+)                                    [⋮]  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  PR - 000067548                                              │
│  Part Number:     703-06-95621                               │
│  Actual Part Number: 703-06-95621                            │
│  Wrong Part Number: [empty]                                  │
│                                                               │
│  PR - 000067549                                              │
│  Part Number:     07000-82105                                │
│  Actual Part Number: 07000-82105                             │
│  Wrong Part Number: [empty]                                  │
│                                                               │
│  PR - 000067550                                              │
│  Part Number:     703-06-95770                               │
│  Actual Part Number: 703-06-95770                            │
│  Wrong Part Number: [empty]                                  │
│                                                               │
│                                                [View All]    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- List of part requests linked to service product
- Part number tracking (Actual vs. Wrong)
- Quick reference to parts inventory
- Expandable section with full details
- Link to parts request records

---

## 6. Navigation & Global Actions

### 6.1 Header Action Buttons

```
┌──────────────────────────────────────────────────────────────┐
│  [Edit]  [Delete]  [Clone]                                   │
└──────────────────────────────────────────────────────────────┘
```

#### 6.1.1 Button Descriptions

| Button | Purpose | Availability |
|--------|---------|--------------|
| **Edit** | Modify product details and pricing | Always (with permissions) |
| **Delete** | Remove service product from system | Inactive products only |
| **Clone** | Duplicate product for similar offering | Always |

---

## 7. Data Structure & Field Organization

### 7.1 Product Information Hierarchy

```
SERVICE PRODUCT
├── Basic Information
│   ├── Product Name
│   ├── Material Number
│   ├── Product Family
│   └── SAP External Key
│
├── Classification
│   ├── Material Type
│   ├── Product Category
│   ├── Product Commodity
│   └── Part Type
│
├── Status & Activation
│   ├── Active (Boolean)
│   ├── Material Status (Stock Item, etc.)
│   └── Update Usage
│
├── Technical Details
│   ├── Equipment Number
│   ├── Serial Number
│   ├── Model Unit Number
│   ├── Equipment UoM
│   └── Type of Technical Object
│
├── Organizational
│   ├── Plant
│   ├── Room
│   ├── Main Work Center
│   └── Industry Key
│
└── System
    ├── Created By / Date
    ├── Last Modified By / Date
    └── Field Status
```

### 7.2 Pricing Structure

```
PRICE BOOKS
├── Standard Price Book
│   ├── List Price (IDR 4,070,000.00)
│   ├── Use Standard Price (Checkbox)
│   └── Active Status (Boolean)
│
├── Master Service Pricebook
│   ├── List Price (IDR 4,070,000.00)
│   ├── Use Standard Price (Checkbox)
│   └── Active Status (Boolean)
│
└── Additional Pricebooks
    ├── Regional Pricing
    ├── Customer Tier Pricing
    ├── Volume-Based Pricing
    └── Seasonal Pricing
```

---

## 8. Integration Architecture

### 8.1 Service Product Data Flow

```
┌─────────────────────────────────────────────────────┐
│  SERVICE PRODUCT CREATION                           │
│  (Define offering, classification, pricing)         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  SERVICE PRODUCT MASTER (System of Record)          │
│  • Product Definition                               │
│  • Pricing Catalogs                                 │
│  • Component Requirements                           │
│  • SAP Integration Data                             │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────────────┐
         │           │                   │
         ▼           ▼                   ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │QUOTATION │ │WORK ORDER │ │OPPORTUNITIES │
   │ PRODUCTS │ │ SERVICES  │ │  SERVICES   │
   └──────────┘ └──────────┘ └──────────────┘
         │           │                   │
         └───────────┼───────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │   PRICE REALIZATION  │
         │   REVENUE TRACKING   │
         └──────────────────────┘
```

### 8.2 Key Integration Points

- **SAP Integration**: Material master sync, pricing pull
- **Quotation Link**: Products added to quotes
- **Work Order Link**: Service delivery definition
- **Parts Inventory**: Component requirement tracking
- **Pricing Engine**: Multi-tier pricing calculation
- **Opportunity Link**: Service product bundling

---

## 9. Responsive Design Strategy

### 9.1 Desktop Layout (1920px+)
- Two-column layout fully visible (65/35 split)
- All sections visible without scrolling
- Complete pricing and parts view
- Details and Related tabs accessible

### 9.2 Tablet Layout (768px - 1024px)
- Two-column stack (details above pricing/parts)
- Collapsible sections to save space
- Expandable parts list
- Touch-friendly button sizes (48px minimum)

### 9.3 Mobile Layout (<768px)
- Single column, full-width content
- Accordion-style collapsible sections
- Bottom sheet for pricing details
- Simplified parts list view
- Tab navigation at bottom (sticky)

---

## 10. Accessibility Requirements

### 10.1 WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for all text
- **Focus Indicators**: Visible 2px focus rings on interactive elements
- **Keyboard Navigation**: Complete navigation without mouse
- **Screen Reader Support**: Proper ARIA labels and roles

### 10.2 Form Accessibility
- **Field Labels**: Clear, descriptive labels for all inputs
- **Required Fields**: Marked with * and aria-required
- **Validation Messages**: Associated with form fields
- **Error Recovery**: Clear instructions for fixing errors

### 10.3 Interactive Components
- **Button Labels**: Descriptive, not just "Click here"
- **Icon Buttons**: Include aria-label with full text alternative
- **Expandable Sections**: ARIA-expanded state management
- **Links**: Distinguishable from body text

---

## 11. Performance Optimization

### 11.1 Data Loading Strategy
- **Detail View**: Load main record immediately
- **Related Data**: Lazy load pricing and parts on tab click
- **Price Books**: Paginate if >50 records
- **Search**: Debounce input (300ms delay)

### 11.2 Rendering Performance
- **Virtual Scrolling**: For lists >200 items
- **Collapsible Sections**: Prevent DOM bloat
- **Image Optimization**: Lazy load product images
- **CSS Animations**: Use transform/opacity (GPU-accelerated)

---

## 12. User Workflows

### Workflow 1: New Service Product Creation
1. Operations team creates new service product
2. Enters product name, material number, category
3. Defines product family and classification
4. Sets product status to Active
5. System generates SAP External Key
6. Operations team clones pricing from similar product
7. Adjusts standard and master service prices
8. Adds parts requirements (component list)
9. Uploads product specification sheets
10. System syncs to SAP material master
11. Product available for quotations and work orders

### Workflow 2: Price Update & Pricebook Management
1. Pricing team opens service product
2. Reviews current pricebook entries
3. Updates Standard Price Book for new region
4. Adds regional pricing variation
5. Sets volume-based pricing tiers
6. Changes Active status on expired pricing
7. System cascades price updates to pending quotes
8. Notifications sent to sales team
9. New prices effective immediately
10. Audit trail records all changes

### Workflow 3: Product Linking to Work Order
1. Service delivery team opens work order
2. Searches for appropriate service product
3. Selects "RI SWIVEL JOINT PC200" from catalog
4. System displays current pricing from pricebook
5. System identifies required parts (3 part requests)
6. Parts automatically added to work order requirements
7. Service cost calculated using pricebook
8. Customer invoiced at standard price
9. Service completed, timesheet entries recorded
10. Parts consumption recorded against part requests

---

## 13. Business Rules & Validations

### 13.1 Required Fields
- **Product Name**: Cannot be blank
- **Material Number**: Unique across system
- **Product Family**: Required for categorization
- **Material Type**: Must be valid classification
- **Status**: Defaults to Active

### 13.2 Conditional Requirements
- **Standard Price**: Required if Use Standard Price checked
- **Equipment UoM**: Required for equipment products
- **Main Work Center**: Required for labor-intensive services
- **Parts Requests**: Minimum 1 for composite services

### 13.3 Business Logic
- **Price Inheritance**: Standard Price defaults to Master Service if not set
- **SAP Sync**: On Active status change, sync to SAP
- **Part Cascading**: Part requests flow to quotations and work orders
- **Price Validation**: List Price must be >= 0
- **Active Status**: Only active products appear in quotations

---

## 14. Component Library

### 14.1 UI Components Used
- **Data Tables**: Sortable, filterable grids for pricing and parts
- **Expandable Sections**: Collapsible field groups
- **Form Fields**: Text, Date, Lookup, Picklist, Currency, Checkbox
- **Buttons**: Primary (Edit), Secondary (Delete), Tertiary (Clone)
- **Badges**: Status indicators (Active=Green, Inactive=Gray)
- **Modal Dialogs**: Price creation, part linking
- **Tabs**: Navigation between Details and Related
- **Toasts**: Success/error notifications
- **Loading Spinners**: Async operations (SAP sync, price pull)

---

## 15. Visual Design System

### 15.1 Color Palette

```
Primary Brand Colors:
  • Primary Blue: #0066CC (buttons, active states, links)
  • Success Green: #28A745 (active status, checkmarks)
  • Warning Yellow: #FFC107 (draft, pending updates)
  • Error Red: #DC3545 (inactive, errors, warnings)
  • Info Blue: #17A2B8 (status changes, information)

Neutral Colors:
  • White: #FFFFFF (backgrounds, card surfaces)
  • Light Gray: #F8F9FA (alternate rows, disabled states)
  • Medium Gray: #E9ECEF (borders, dividers)
  • Dark Gray: #6C757D (secondary text, labels)
  • Black: #212529 (primary text, headings)

Semantic Colors:
  • Active Green: #20C997 (active products)
  • Inactive Gray: #ADB5BD (inactive products)
  • SAP Sync: #0D6EFD (integration status)
```

### 15.2 Typography

```
Font Family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif

Scale:
  • H1: 32px, Bold (700), #212529
  • H2: 24px, Bold (700), #212529
  • H3: 20px, Semi-Bold (600), #212529
  • Body: 14px, Regular (400), #333333
  • Small: 12px, Regular (400), #666666
  • Label: 11px, Regular (400), #999999

Line Height:
  • Headings: 1.2
  • Body: 1.5
  • Labels: 1.3
```

### 15.3 Spacing System

```
Base Unit: 8px

Padding:
  • Component: 16px (2 units)
  • Section: 24px (3 units)
  • Page: 32px (4 units)

Margins:
  • Element: 8px (1 unit)
  • Section: 16px (2 units)
  • Heading: 24px (3 units)

Gaps:
  • Form row: 16px
  • List item: 8px
  • Card group: 24px
```

---

## 16. Advanced Features

### 16.1 Pricing Management
- **Multi-Tier Pricing**: Support for volume, regional, customer-tier pricing
- **Price Overrides**: Manual price adjustments with approval
- **Currency Support**: Multi-currency pricing with exchange rates
- **Price Effective Dates**: Time-based pricing changes
- **Margin Analysis**: Track margin by product and customer

### 16.2 Product Variants
- **Version Control**: Track product revisions
- **Configuration Options**: Customizable service packages
- **Bundle Management**: Composite services with components
- **Substitute Products**: Define alternative offerings

### 16.3 Analytics & Reporting
- **Usage Analytics**: Track product usage in quotes and orders
- **Revenue Tracking**: Product-level revenue reporting
- **Pricing Compliance**: Monitor price deviations
- **Part Consumption**: Track parts usage over time
- **Margin Analysis**: Profitability by product and customer

### 16.4 Integration Capabilities
- **SAP Material Master**: Bi-directional sync
- **Inventory Management**: Link to inventory system
- **Manufacturing**: Bill of materials integration
- **Warranty Management**: Product warranty tracking
- **Configuration Engine**: Dynamic product configurator

---

## 17. Implementation Roadmap

### Phase 1: Core (Weeks 1-4)
- [ ] Design database schema for Service Product
- [ ] Build list view with sorting and filtering
- [ ] Create detail view with two-column layout
- [ ] Implement Details tab with all fields
- [ ] Build Related tab with pricing display
- [ ] Create parts requests linking
- [ ] Basic SAP integration for material master

### Phase 2: Enhancement (Weeks 5-8)
- [ ] Implement pricebook management interface
- [ ] Add multi-tier pricing support
- [ ] Create product cloning functionality
- [ ] Build file attachment management
- [ ] Add notes and documentation
- [ ] Create price comparison view
- [ ] Email integration for updates

### Phase 3: Advanced (Weeks 9-12)
- [ ] Analytics & reporting dashboard
- [ ] Product variant management
- [ ] Configuration engine
- [ ] Advanced pricing rules
- [ ] Margin analysis tools
- [ ] Integration with inventory system
- [ ] API access for third-party systems

---

## 18. Testing Strategy

### 18.1 Functional Testing
- Product creation and field validation
- Pricing calculations and multi-tier support
- SAP synchronization verification
- Parts request linking and cascading
- Clone functionality accuracy
- File attachment handling

### 18.2 Performance Testing
- Load time for product list view (1000+ records)
- Detail view rendering performance
- Pricing calculation performance
- Parts list rendering with 200+ items
- Search responsiveness
- Concurrent user load testing

### 18.3 User Acceptance Testing (UAT)
- Operations team field testing
- Sales team quote creation workflow
- Service delivery team work order creation
- Finance team pricing validation
- SAP integration testing
- End-to-end quote-to-order-to-service flow

---

## 19. Future Enhancements

- **AI-Powered Pricing**: ML model to optimize product pricing
- **Configurator**: Interactive product configuration UI
- **3D Visualization**: Product visualization for complex services
- **Dynamic Bundling**: Auto-recommend bundle combinations
- **Subscription Services**: Recurring service product support
- **Compliance Tracking**: Regulatory compliance by product
- **Performance Metrics**: KPI tracking by product
- **Mobile Catalog**: Mobile app product browsing
- **API Access**: RESTful API for third-party integrations
- **Custom Attributes**: Extensible custom field support

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation

---

## Appendix A: Field Reference Guide

### Service Product Core Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Product Name | Text | Service product name | RI SWIVEL JOINT PC200 |
| Material Number | Text | Unique identifier | RISWJPC200 |
| Product Family | Picklist | Product classification | Standard, Premium, Custom |
| Material Type | Text | Technical type | Z55P |
| Product Category | Text | Business category | KOMAT |
| Material Status | Picklist | Stock/Service status | Stock Item, Service Product |
| Product Currency | Picklist | Pricing currency | IDR, USD, EUR |
| Active | Boolean | Product availability | True (active), False (inactive) |

### Pricing Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Price Book Name | Text | Pricing catalog | Standard Price Book |
| List Price | Currency | Standard price | IDR 4,070,000.00 |
| Use Standard Price | Boolean | Price override control | True/False |
| Active (Price) | Boolean | Price validity | True/False |

### Parts Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Part Request ID | Text | Parts request reference | PR-000067548 |
| Part Number | Text | Component identifier | 703-06-95621 |
| Actual Part Number | Text | Verified part number | 703-06-95621 |
| Wrong Part Number | Text | Known substitute | [empty] |

### Related Objects
- **Price Books**: Multiple pricing catalogs
- **Parts Requests**: Component requirements
- **Quotations**: Quotes using this product
- **Work Orders**: Service deliveries
- **Notes**: Internal documentation
- **Files**: Specifications and datasheets

---

**END OF DOCUMENT**
