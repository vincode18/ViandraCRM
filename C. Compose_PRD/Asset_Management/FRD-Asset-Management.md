# Functional Requirements Document
## Asset Management — Unit Field / Fleet Management Module
### OPERATIONS Platform · v4.2.0-stable

---

**Document Type:** Functional Requirements Document (FRD)  
**Module:** Asset Management — Unit Field & Fleet Management  
**Platform:** OPERATIONS CRM  
**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** 2026-06-06  
**Related FRDs:** FRD-SA-Fields.md · FRD-Field-Service-Tracking.md  

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Module Overview](#3-module-overview)
4. [Asset Object — Field Schema](#4-asset-object--field-schema)
5. [Asset Relationship Object — Field Schema](#5-asset-relationship-object--field-schema)
6. [Field Behavior & Validation Rules](#6-field-behavior--validation-rules)
7. [Asset Hierarchy](#7-asset-hierarchy)
8. [Status Lifecycle](#8-status-lifecycle)
9. [Fleet Management Integration](#9-fleet-management-integration)
10. [UI & Module Requirements](#10-ui--module-requirements)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Revision History](#12-revision-history)

---

## 1. Purpose

This document defines the complete functional requirements for the **Asset Management** module within the OPERATIONS platform. It serves as the authoritative reference for developers, administrators, and QA teams implementing the **Unit Field / Fleet Management** sub-module.

The Asset Management module enables organizations to track physical assets (units, equipment, fleet vehicles) associated with accounts or contacts, manage asset hierarchies, monitor status lifecycles, and record inter-asset relationships such as replacements and upgrades.

---

## 2. Scope

This FRD covers:

- Complete field schema for the `Asset` object
- Complete field schema for the `Asset Relationship` object
- Field data types, validation rules, read-only and computed behaviors
- Asset hierarchy structure and level computation
- Asset status lifecycle (Purchased → Shipped → Installed → Registered → Obsolete)
- Asset relationship types (Replacement, Upgrade, Crossgrade)
- Fleet/Unit management-specific requirements
- UI layout and module navigation requirements
- Integration with the SA and Field Service modules

---

## 3. Module Overview

### 3.1 Module Position

The Asset Management module is accessible from the main navigation as a dedicated module tab, positioned after the Field Service module. It is divided into two sub-views:

- **Asset List View** — searchable, filterable table of all assets
- **Asset Detail View** — full record view with related lists, hierarchy tree, and relationship graph

### 3.2 Key Concepts

| Concept | Description |
|---|---|
| **Asset** | A physical unit, equipment item, or fleet vehicle tied to an account or contact |
| **Asset Hierarchy** | Parent–child tree structure; root asset is Level 1, children are Level 2, and so on |
| **Root Asset** | Top-level asset in a hierarchy (read-only, auto-computed) |
| **Asset Relationship** | A non-hierarchical link between two assets (e.g., replacement, upgrade) |
| **Competitor Asset** | Flag indicating the asset belongs to a competitor's product line |
| **Internal Asset** | Flag indicating the asset is produced or used internally |

### 3.3 Core Associations

Each asset **must** be associated with either:
- An **Account**, OR
- A **Contact**

Both can be set simultaneously. If a Contact is a person account, the asset will NOT appear in that account's Assets related list.

---

## 4. Asset Object — Field Schema

### 4.1 Primary Fields

| # | Field Name | API Name | Data Type | Required | Editable | Read-Only | Description |
|---|---|---|---|---|---|---|---|
| 1 | Asset Name | Name | Text(255) | Yes | Yes | No | Identifying name for the asset. In classic UI, auto-populates from Product Name if left blank on save. |
| 2 | Account | AccountId | Reference (Account) | Cond. | Yes | No | Account associated with the asset. Required if Contact is not set. |
| 3 | Contact | ContactId | Reference (Contact) | Cond. | Yes | No | Contact associated with the asset. Required if Account is not set. Contacts not linked to an account cannot be associated. |
| 4 | Asset Owner | OwnerId | Reference (User) | Yes | Yes | No | User assigned to the asset. Defaults to the creator on record creation. |
| 5 | Product | Product2Id | Reference (Product) | No | Yes | No | The product on which the asset is based. |
| 6 | Product Code | ProductCode | Text | No | No | Yes | Internal code or product number of the related product. Auto-populated from Product. |
| 7 | Product Description | ProductDescription | Long Text Area | No | No | Yes | Description of the related product. Auto-populated from Product. |
| 8 | Product Family | ProductFamily | Picklist | No | No | Yes | Category of the related product. Auto-populated from Product. |
| 9 | Product SKU | StockKeepingUnit | Text | No | No | Yes | SKU of the related product. Auto-populated from Product. |
| 10 | Serial Number | SerialNumber | Text(255) | No | Yes | No | The model or serial number on the physical asset. |
| 11 | Status | Status | Picklist | No | Yes | No | Current status of the asset. See Section 8 for lifecycle values. |
| 12 | Price | Price | Currency | No | Yes | No | Amount the customer paid for the asset. |
| 13 | Quantity | Quantity | Number(10,2) | No | Yes | No | Number of assets purchased. |
| 14 | Purchase Date | PurchaseDate | Date | No | Yes | No | Date the customer bought the asset. |
| 15 | Install Date | InstallDate | Date | No | Yes | No | Date the asset was installed. |
| 16 | Usage End Date | UsageEndDate | Date | No | Yes | No | Date the asset expires or the last date it is under warranty. Business-configurable meaning. |
| 17 | Description | Description | Long Text Area | No | Yes | No | Free-text description of the asset. |
| 18 | Location | Location | Text(255) | No | Yes | No | Physical location of the asset (e.g., warehouse, van, site address). |

### 4.2 Hierarchy Fields

| # | Field Name | API Name | Data Type | Required | Editable | Read-Only | Description |
|---|---|---|---|---|---|---|---|
| 19 | Parent Asset | ParentId | Reference (Asset) | No | Yes | No | The asset's parent in the hierarchy. Setting this establishes a parent–child relationship. |
| 20 | Asset Level | Level | Number | No | No | Yes | Position in the hierarchy. Level 1 = root or standalone. Level 2 = child of root. Computed automatically. Assets created before Summer '17 default to –1 and recalculate on next save. |
| 21 | Root Asset | RootAssetId | Reference (Asset) | No | No | Yes | Top-level ancestor in the hierarchy. Equals Parent Asset if asset is a direct child of the root. Auto-computed. |

### 4.3 Classification Fields

| # | Field Name | API Name | Data Type | Required | Editable | Read-Only | Description |
|---|---|---|---|---|---|---|---|
| 22 | Competitor Asset | IsCompetitorProduct | Boolean | No | Yes | No | Checked = this asset is a competitor's product. Used for competitive tracking. |
| 23 | Internal Asset | IsInternal | Boolean | No | Yes | No | Checked = the asset is produced or used internally by the organization. |
| 24 | Asset Provided By | ManufacturerId | Reference (Account) | No | Yes | No | The account that manufactured or provided the asset. |
| 25 | Asset Serviced By | ServiceContractId | Reference (Account) | No | Yes | No | The account responsible for servicing the asset. |

### 4.4 Division Field (Organizations Using Divisions)

| # | Field Name | API Name | Data Type | Required | Editable | Read-Only | Description |
|---|---|---|---|---|---|---|---|
| 26 | Asset Division | Division | Picklist | No | No | Yes | Division to which the asset belongs. Inherited from related Account; falls back to Contact. Only visible in orgs with divisions enabled. |

---

## 5. Asset Relationship Object — Field Schema

Asset relationships represent **non-hierarchical** associations between assets due to replacements, upgrades, or custom relationship types. Relationships appear in the **Primary Assets** and **Related Assets** related lists on asset records.

| # | Field Name | API Name | Data Type | Required | Editable | Read-Only | Description |
|---|---|---|---|---|---|---|---|
| 1 | Asset Relationship Number | Name | Auto Number | No | No | Yes | Auto-generated identifier for the relationship record. |
| 2 | Asset | AssetId | Reference (Asset) | Yes | Yes | No | The replacement or successor asset in the relationship. |
| 3 | Related Asset | RelatedAssetId | Reference (Asset) | Yes | Yes | No | The original asset being replaced, upgraded, or crossgraded. |
| 4 | Relationship Type | RelationshipType | Picklist | Yes | Yes | No | Type of relationship. Default values: Replacement, Upgrade, Crossgrade. Custom values can be created in Setup. |
| 5 | From Date | FromDate | Date | No | Yes | No | The date the replacement/new asset is installed or the relationship begins. |
| 6 | To Date | ToDate | Date | No | Yes | No | The date the original asset is uninstalled or the relationship ends. |

### 5.1 Relationship Type Picklist Values

| Value | Description |
|---|---|
| **Replacement** | The new asset replaces the related asset (like-for-like swap). |
| **Upgrade** | The new asset is an upgraded version of the related asset. |
| **Crossgrade** | The new asset is a lateral/alternative model to the related asset. |
| *(Custom)* | Additional relationship types can be defined per business need in Setup. |

---

## 6. Field Behavior & Validation Rules

### 6.1 Asset Name Auto-Population

```
IF  Product is selected
AND Asset Name is blank at save time
THEN Asset Name = Product.Name
```
> ⚠️ This behavior applies in **Salesforce Classic** only. Lightning Experience does not auto-populate Asset Name.

### 6.2 Account / Contact Requirement

```
VALIDATION: At least one of Account or Contact must be populated.
ERROR MSG:  "An asset must be associated with an Account or a Contact."

EXCEPTION:  If Contact is a person account, the asset will not appear in
            the Account's Assets related list even if both are set.
```

### 6.3 Asset Level Computation

```
IF  Asset has no Parent Asset AND no Child Assets
THEN Asset Level = 1

IF  Asset is in a hierarchy
THEN Asset Level = parent.AssetLevel + 1

LEGACY NOTE:
  Assets created before Summer '17 default to Asset Level = –1.
  On the next save of the record, Asset Level is recalculated correctly.
```

### 6.4 Root Asset Computation

```
Root Asset = the top-most ancestor in the hierarchy.

IF  Asset has no Parent Asset
THEN Root Asset = Self (this asset is its own root)

IF  Asset has Parent Asset
THEN Root Asset = traverse up the hierarchy until no parent exists
```

### 6.5 Product-Derived Read-Only Fields

The following fields are read-only and auto-populated from the linked Product:

- `Product Code` ← `Product.ProductCode`
- `Product Description` ← `Product.Description`
- `Product Family` ← `Product.Family`
- `Product SKU` ← `Product.StockKeepingUnit`

These fields **cannot be edited directly** on the Asset record. To change their values, update the linked Product record.

### 6.6 Asset Division Inheritance

```
IF  Asset is linked to an Account
THEN Asset Division = Account.Division

ELSE IF  Asset is linked to a Contact (no Account)
THEN Asset Division = Contact.Division

NOTE: Only visible in organizations with the Divisions feature enabled.
```

### 6.7 Usage End Date

The `Usage End Date` field is a business-configurable date field. The platform does not enforce a specific interpretation. Common usages include:

- Warranty expiry date
- Lease end date
- Service contract end date
- Scheduled decommission date

---

## 7. Asset Hierarchy

### 7.1 Hierarchy Structure

```
Root Asset (Level 1)
├── Child Asset A (Level 2)
│   ├── Grandchild Asset A1 (Level 3)
│   └── Grandchild Asset A2 (Level 3)
└── Child Asset B (Level 2)
    └── Grandchild Asset B1 (Level 3)
```

### 7.2 Viewing the Hierarchy

| Interface | Method |
|---|---|
| Asset Detail Page | Click **View Asset Hierarchy** from the action drop-down menu |
| Child Assets | View, create, and delete child assets from the **Child Assets** related list |
| Tree Grid | Available in Lightning Experience on the Asset detail page |

### 7.3 Hierarchy Rules

- An asset can have **one parent** but **many children**.
- Circular references are not permitted (an asset cannot be its own ancestor).
- Deleting a parent asset requires resolving or re-parenting its child assets first.
- The `Root Asset` field is always read-only and computed by the system.

---

## 8. Status Lifecycle

### 8.1 Status Values

| Status | Description | Typical Trigger |
|---|---|---|
| **Purchased** | Asset has been purchased but not yet shipped. | Order confirmed / purchase recorded |
| **Shipped** | Asset is in transit to the customer or install location. | Fulfillment/shipping event |
| **Installed** | Asset has been physically installed at the location. | Install Date recorded / field technician update |
| **Registered** | Asset has been registered by the customer or organization. | Registration event |
| **Obsolete** | Asset is no longer in use or has been decommissioned. | End-of-life event / manual update |

### 8.2 Status Flow

```
Purchased
    │
    ▼
  Shipped
    │
    ▼
 Installed
    │
    ▼
 Registered
    │
    ▼
  Obsolete
```

> ℹ️ Status values are **customizable**. The five default values can be extended or relabeled in Setup to match business-specific lifecycle stages.

### 8.3 Status & Field Service Integration

| Asset Status | Effect on Field Service |
|---|---|
| Installed / Registered | Asset is eligible to be listed on Work Orders and Service Appointments |
| Purchased / Shipped | Asset may not yet be available for service scheduling |
| Obsolete | Asset should be excluded from active Work Order creation |

---

## 9. Fleet Management Integration

### 9.1 Unit Field Context

In a fleet/unit management context, an **Asset** represents a **vehicle or unit** in the fleet. The following field mappings are recommended for fleet use:

| Asset Field | Fleet / Unit Usage |
|---|---|
| Asset Name | Unit name or vehicle nickname (e.g., "Truck 14 - North Zone") |
| Serial Number | Vehicle Identification Number (VIN) or unit serial |
| Location | Current depot, yard, or last known location |
| Install Date | Date the unit was commissioned into the fleet |
| Usage End Date | Scheduled decommission or registration expiry date |
| Status | Fleet operational status (map to Installed = Active, Obsolete = Retired) |
| Asset Provided By | Vehicle manufacturer or supplier account |
| Asset Serviced By | Fleet maintenance partner or internal workshop account |
| Product | Vehicle model (linked Product record) |
| Quantity | Number of identical units in a batch purchase |

### 9.2 Fleet Hierarchy Example

```
Fleet Account: "Northern Region Fleet"
└── Root Asset: "Truck Fleet - Northern Region" (Level 1)
    ├── Unit: "Truck 01 - NR" (Level 2)
    │   └── Component: "GPS Unit #4421" (Level 3)
    ├── Unit: "Truck 02 - NR" (Level 2)
    └── Unit: "Truck 03 - NR" (Level 2)
```

### 9.3 Asset → Service Appointment Linkage

Assets can be linked to Service Appointments and Work Orders to track which unit is being serviced:

```
Work Order
└── Asset (unit being serviced)
    └── Service Appointment (SA)
        └── Assigned Resource (Gantt Chart)
```

This allows dispatchers to:
- See which unit is scheduled for service on the Gantt Chart
- Filter Service Appointments by Asset/Unit
- Track service history per unit via the Asset's related Work Orders

---

## 10. UI & Module Requirements

### 10.1 Module Navigation

- Asset Management is added to the **main module tab bar** after Field Service.
- Tab label: **"Assets"** with icon `inventory_2` (Material Symbols Outlined).
- Tab is accessible to users with the **Asset Read** permission.

### 10.2 Asset List View

| Element | Requirement |
|---|---|
| Page title | "Assets" with record count badge |
| Search bar | Full-text search across Asset Name, Serial Number, Account Name |
| Filter chips | Status · Asset Type (Internal / Competitor / Standard) · Product Family |
| Column headers | Asset Name · Account · Status · Serial Number · Install Date · Usage End Date · Owner |
| Row action | View · Edit · Delete · View Hierarchy |
| New button | Opens Asset creation modal |
| Sort | Sortable by all visible columns |

### 10.3 Asset Detail View — Section Layout

| Section | Fields Included |
|---|---|
| **Asset Information** | Asset Name, Account, Contact, Status, Serial Number, Location |
| **Product Details** | Product, Product Code, Product Description, Product Family, Product SKU |
| **Dates & Financials** | Purchase Date, Install Date, Usage End Date, Price, Quantity |
| **Classification** | Competitor Asset, Internal Asset, Asset Provided By, Asset Serviced By |
| **Hierarchy** | Parent Asset, Asset Level (R/O), Root Asset (R/O) |
| **Description** | Description (full-width text area) |
| **Related Lists** | Child Assets · Asset Relationships (Primary) · Asset Relationships (Related) · Work Orders · Service Appointments |
| **System Information** | Asset Division, Asset Owner, Created By, Last Modified By *(collapsed by default)* |

### 10.4 Asset Hierarchy View

- Accessible via **"View Asset Hierarchy"** action on the Asset detail page.
- Renders as a **tree grid** (collapsible nodes).
- Each node displays: Asset Name, Status badge, Level number.
- Click on any node navigates to that Asset's detail page.

### 10.5 Asset Relationship Panel

- Displays in two related lists on the Asset detail page:
  - **Primary Assets** — assets where this asset is the `Asset` (successor) field
  - **Related Assets** — assets where this asset is the `Related Asset` (predecessor) field
- Each row shows: Asset Name, Relationship Type, From Date, To Date.
- Inline **"Add Relationship"** button opens a quick-create form.

### 10.6 Light & Dark Mode

All Asset Management views must support light and dark mode using the OPERATIONS platform design token system.

| Token | Light Mode | Dark Mode |
|---|---|---|
| Page background | `#ffffff` | `#1a1c1c` |
| Surface / card | `#f8f9fa` | `#242626` |
| Border | `#e0e0e0` | `#3a3c3c` |
| Primary text | `#1a1c1c` | `#f0f0f0` |
| Secondary text | `#5f6368` | `#9aa0a6` |
| Accent / primary | `#f5c800` | `#f5c800` |
| Status: Installed | `#34a853` | `#4caf6e` |
| Status: Obsolete | `#9aa0a6` | `#6c7074` |
| Status: Purchased | `#4285f4` | `#5a95f5` |
| Status: Shipped | `#fb8c00` | `#ffa040` |
| Status: Registered | `#a142f4` | `#b36cf5` |

---

## 11. Acceptance Criteria

### 11.1 Asset Creation

- [ ] "New Asset" button is accessible from the Assets module tab and from an Account's Assets related list
- [ ] Validation fires if both Account and Contact are empty on save
- [ ] Asset Name auto-populates from Product Name if blank (Classic behavior documented; Lightning behavior explicitly noted as not auto-populating)
- [ ] Product-derived fields (Code, Description, Family, SKU) are read-only and populate automatically when Product is selected
- [ ] Asset Level defaults to `1` for new standalone assets
- [ ] Asset Level defaults to `parent.level + 1` when a Parent Asset is selected

### 11.2 Asset Hierarchy

- [ ] Parent Asset lookup excludes the current asset and its descendants (prevents circular references)
- [ ] Asset Level is recalculated on save when Parent Asset changes
- [ ] Root Asset is updated on save when hierarchy changes
- [ ] "View Asset Hierarchy" action is visible on asset detail page
- [ ] Tree grid renders correctly with expand/collapse per node
- [ ] Legacy assets with Asset Level = –1 recalculate on next save

### 11.3 Asset Relationships

- [ ] "Add Relationship" creates an Asset Relationship record linking two assets
- [ ] Relationship Type picklist includes Replacement, Upgrade, Crossgrade as defaults
- [ ] Primary Assets related list shows relationships where this asset is the successor
- [ ] Related Assets related list shows relationships where this asset is the predecessor
- [ ] From Date and To Date are optional on the relationship record

### 11.4 Status Management

- [ ] Status picklist displays all five default values: Purchased, Shipped, Installed, Registered, Obsolete
- [ ] Status badge renders with correct color in both light and dark mode per the token table in Section 10.6
- [ ] Status filter chip on List View filters records correctly

### 11.5 Fleet / Unit Module

- [ ] Assets linked to a fleet Account appear in the Account's Assets related list
- [ ] Assets with Status = Obsolete are visually distinguished (greyed badge) in List View
- [ ] Asset can be linked to a Work Order and via Work Order to a Service Appointment
- [ ] Asset Name, Serial Number, and Status are visible on the SA detail view when an asset is linked

### 11.6 Dark Mode

- [ ] All Asset Management views (List, Detail, Hierarchy, Relationship panel) support dark mode
- [ ] All color tokens match the dark mode specification in Section 10.6
- [ ] No hardcoded hex colors — all styling via Tailwind token classes
- [ ] Status badges render correctly in both light and dark mode

---

## 12. Revision History

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 1.0.0 | 2026-06-06 | System Admin | Initial draft — Asset Management / Unit Field / Fleet Management FRD |

---

*OPERATIONS Platform · Asset Management Module · Confidential Internal Document*  
*v1.0.0 · June 2026*
