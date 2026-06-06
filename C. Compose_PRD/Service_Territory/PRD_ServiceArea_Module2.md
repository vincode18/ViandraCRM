# Product Requirements Document
## Service Area — Full Module Specification
### Plant · Work Center · Service Territory

**Document Version:** 2.0
**Status:** Draft — For Review
**Last Updated:** 2026-06-06
**Prepared By:** Product Team
**Target Release:** TBD

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Glossary](#2-glossary)
3. [Module A — Plant](#3-module-a--plant)
4. [Module B — Work Center](#4-module-b--work-center)
5. [Module C — Service Territory](#5-module-c--service-territory)
6. [Entity Relationships & Hierarchy](#6-entity-relationships--hierarchy)
7. [Integration with Salesforce Field Service](#7-integration-with-salesforce-field-service)
8. [Acceptance Criteria](#8-acceptance-criteria)
9. [Open Issues & Future Scope](#9-open-issues--future-scope)

---

## 1. Purpose & Scope

This document defines the complete **Service Area** configuration module covering all three core sub-modules — **Plant**, **Work Center**, and **Service Territory** — for the field service management platform.

### Goals

- Establish a clear organizational and geographic hierarchy for field service operations.
- Support two primary business models: **Field Service (FD)** for regular dispatch work and **Facilities Management (FM)** for full-contract service engagements.
- Enable mechanics (service resources) to be assigned to specific geographic territories that are traceable back to a Plant (branch/site).

### Stakeholders

| Role | Responsibility |
|---|---|
| Field Service Operations | Configure Plants, Work Centers, and Territories |
| Dispatch Team | Use territories to route and assign mechanics |
| IT / System Admin | Maintain integrations and data governance |
| Contract Managers | Configure FM Work Centers and contract references |

---

## 2. Glossary

| Term | Definition |
|---|---|
| **Plant** | A physical branch or site; the top-level organizational unit |
| **Site Type** | Classification of a Plant (Branch, Site, HQ, Satellite) |
| **Work Center** | An operational business unit under a Plant, classified by service type |
| **FD (Field Service)** | Regular field dispatch model — technicians dispatched on-demand or scheduled |
| **FM (Facilities Management / Full Contract)** | A contract-based service model covering full facility maintenance obligations |
| **Service Territory** | A defined geographic zone in which field mechanics operate |
| **Territory Member** | A mechanic (service resource) assigned to a Service Territory |
| **Primary Territory** | The territory where a mechanic primarily operates |
| **Secondary Territory** | An additional territory a mechanic can cover as needed |
| **Relocation Territory** | A temporary territory override during a defined relocation period |
| **Home Base** | The default starting/ending point for a mechanic's daily travel, derived from the territory or member address |

---

## 3. Module A — Plant

### 3.1 Overview

The **Plant** module represents a physical branch or site operated by the organization. It is the root entity in the Service Area hierarchy. All Work Centers and Service Territories must trace back to a Plant.

Each Plant must be assigned a **Site Type** to define its role within the organizational structure.

---

### 3.2 Site Type Enum

| Code | Label | Description |
|---|---|---|
| `BRANCH` | Branch | A standard field service branch handling dispatch operations |
| `SITE` | Site | A dedicated operational site such as a depot or regional hub |
| `HQ` | Headquarters | The central organizational headquarters |
| `SATELLITE` | Satellite | A smaller satellite office dependent on a parent Branch |

---

### 3.3 Plant — Field Specifications

| # | Field Name | API Name | Type | Required | Editable | Description |
|---|---|---|---|---|---|---|
| 1 | Plant ID | `plant_id` | Auto Number | Yes | No | Unique system-generated identifier |
| 2 | Plant Name | `plant_name` | Text (100) | Yes | Yes | Full name of the branch or site |
| 3 | Plant Code | `plant_code` | Text (20) | Yes | Yes | Short code used for references and integrations |
| 4 | Site Type | `site_type` | Picklist | Yes | Yes | `BRANCH` / `SITE` / `HQ` / `SATELLITE` |
| 5 | Address | `address` | Address | Yes | Yes | Full physical address (must be geocoded) |
| 6 | City | `city` | Text (80) | Yes | Yes | City |
| 7 | Region / Province | `region` | Text (80) | Yes | Yes | Region or province |
| 8 | Country | `country` | Text (80) | Yes | Yes | Country |
| 9 | Latitude | `latitude` | Decimal | No | Auto | Auto-populated on geocoding |
| 10 | Longitude | `longitude` | Decimal | No | Auto | Auto-populated on geocoding |
| 11 | Is Active | `is_active` | Checkbox | Yes | Yes | Whether this plant is operational |
| 12 | Parent Plant | `parent_plant_id` | Lookup (Plant) | No | Yes | Required if `site_type = SATELLITE` |
| 13 | Operating Hours | `operating_hours_id` | Lookup (Operating Hours) | No | Yes | Default working hours for this plant |
| 14 | Description | `description` | Long Text | No | Yes | Notes about the plant |
| 15 | Created Date | `created_date` | DateTime | Yes | No | System-generated creation timestamp |
| 16 | Modified Date | `modified_date` | DateTime | Yes | No | System-generated last-modified timestamp |
| 17 | Created By | `created_by` | Lookup (User) | Yes | No | User who created the record |
| 18 | Modified By | `modified_by` | Lookup (User) | Yes | No | User who last modified the record |

---

### 3.4 Plant — Business Rules

| Rule ID | Rule |
|---|---|
| PLT-001 | `site_type` is mandatory. A Plant cannot be saved without a valid site type. |
| PLT-002 | If `site_type = SATELLITE`, then `parent_plant_id` must be populated with a valid active Plant. |
| PLT-003 | The address must be geocoded (latitude/longitude populated) before the Plant can be set to `is_active = true`. |
| PLT-004 | Deactivating a Plant (`is_active = false`) must trigger a warning if any child Work Centers or Service Territories are currently active. The deactivation will not cascade automatically. |
| PLT-005 | A Plant Code must be unique across all Plant records. |
| PLT-006 | `site_type = HQ` can only be assigned to one Plant per country/region grouping. |

---

## 4. Module B — Work Center

### 4.1 Overview

A **Work Center** is the operational unit that sits directly beneath a Plant. It defines the type of service business being conducted at that location. A single Plant may have multiple Work Centers — for example, one Work Center for regular field dispatch (`FD`) and one for full-contract management (`FM`).

---

### 4.2 Work Center Type Enum

| Code | Label | Description |
|---|---|---|
| `FD` | Field Service (Regular) | Standard on-demand and scheduled field dispatch. Technicians are assigned to jobs individually. Default model for general service operations. |
| `FM` | Facilities Management (Full Contract) | A full-contract engagement covering all maintenance obligations for a client's facility or asset portfolio. Includes preventive maintenance, SLA management, dedicated resource pools, and contract billing. |

> **Important:** `FM` Work Centers carry additional contract-specific fields not present on `FD` Work Centers. These fields are only visible and editable when `work_center_type = FM`.

---

### 4.3 Work Center — Field Specifications

#### 4.3.1 Core Fields (All Types)

| # | Field Name | API Name | Type | Required | Editable | Description |
|---|---|---|---|---|---|---|
| 1 | Work Center ID | `wc_id` | Auto Number | Yes | No | System-generated unique identifier |
| 2 | Work Center Name | `wc_name` | Text (100) | Yes | Yes | Descriptive name of the work center |
| 3 | Work Center Code | `wc_code` | Text (20) | Yes | Yes | Short code for referencing |
| 4 | Work Center Type | `wc_type` | Picklist | Yes | Yes* | `FD` or `FM`. *Cannot be changed after Service Territories are linked. |
| 5 | Plant | `plant_id` | Lookup (Plant) | Yes | Yes | The Plant this work center belongs to |
| 6 | Description | `description` | Long Text | No | Yes | Scope and operational notes for this work center |
| 7 | Is Active | `is_active` | Checkbox | Yes | Yes | Whether this work center is currently operational |
| 8 | Service Lead | `service_lead_id` | Lookup (User) | No | Yes | The person responsible for this work center |
| 9 | Operating Hours | `operating_hours_id` | Lookup (Operating Hours) | No | Yes | Operating hours; inherits from Plant if blank |
| 10 | Default SLA (Hours) | `default_sla_hours` | Integer | No | Yes | Default SLA response time in hours for jobs under this WC |
| 11 | Created Date | `created_date` | DateTime | Yes | No | System-generated creation timestamp |
| 12 | Modified Date | `modified_date` | DateTime | Yes | No | System-generated last-modified timestamp |

#### 4.3.2 FM-Specific Fields (Visible only when `wc_type = FM`)

| # | Field Name | API Name | Type | Required (for FM) | Description |
|---|---|---|---|---|---|
| 13 | Contract Reference | `fm_contract_ref` | Text (50) | Yes | The contract number or reference ID for the FM engagement |
| 14 | Contract Start Date | `fm_contract_start` | Date | Yes | The date the FM contract becomes effective |
| 15 | Contract End Date | `fm_contract_end` | Date | No | Contract expiry date; blank = open-ended |
| 16 | Client Name | `fm_client_name` | Text (100) | Yes | The client organization under this FM contract |
| 17 | Scope of Work | `fm_scope_of_work` | Long Text | Yes | Detailed description of contracted services |
| 18 | Preventive Maintenance Schedule | `fm_pm_schedule` | Picklist | No | Frequency of preventive maintenance: `Weekly`, `Monthly`, `Quarterly`, `Annual` |
| 19 | Dedicated Resource Count | `fm_resource_count` | Integer | No | Number of mechanics dedicated to this FM contract |
| 20 | Contract Value | `fm_contract_value` | Currency | No | Total value of the FM contract |
| 21 | SLA Priority Level | `fm_sla_priority` | Picklist | No | Contract-level SLA: `Standard`, `Priority`, `Critical` |

---

### 4.4 Work Center — Business Rules

| Rule ID | Rule |
|---|---|
| WC-001 | A Work Center must be linked to an existing, active Plant. |
| WC-002 | `wc_type` must be set at creation time. |
| WC-003 | `wc_type` cannot be changed after the Work Center has at least one linked Service Territory. |
| WC-004 | FM-specific fields (`fm_contract_ref`, `fm_client_name`, `fm_scope_of_work`) are mandatory when `wc_type = FM`. |
| WC-005 | FM fields are hidden from the UI when `wc_type = FD`. |
| WC-006 | A single Plant may have multiple Work Centers of both types. |
| WC-007 | Operating hours cascade: if not set on Work Center, inherit from Plant. |
| WC-008 | Deactivating a Work Center must warn if linked Service Territories are still active. |
| WC-009 | `wc_code` must be unique per Plant. |

---

## 5. Module C — Service Territory

### 5.1 Overview

A **Service Territory** defines the geographic zone in which one or more mechanics (service resources) are available to perform field work. Each Service Territory is linked to a **Plant** (its organizational home) and a **Work Center** (its operational context).

The Service Territory enables the dispatch system to match incoming jobs to the correct mechanics based on location, availability, and territory assignment type.

---

### 5.2 Service Territory — Field Specifications

#### 5.2.1 Territory Core Fields

| # | Field Name | API Name | Type | Required | Editable | Description |
|---|---|---|---|---|---|---|
| 1 | Territory ID | `territory_id` | Auto Number | Yes | No | System-generated unique identifier |
| 2 | Territory Name | `territory_name` | Text (100) | Yes | Yes | Descriptive name (e.g., "North Zone", "East Jakarta") |
| 3 | Plant | `plant_id` | Lookup (Plant) | Yes | Yes | Linked Plant record |
| 4 | Work Center | `work_center_id` | Lookup (Work Center) | Yes | Yes | Linked Work Center record |
| 5 | Is Active | `is_active` | Checkbox | Yes | Yes | Whether this territory is operational |
| 6 | Address | `address` | Address | No | Yes | Territory home base address (geocoded) |
| 7 | Operating Hours | `operating_hours_id` | Lookup (Operating Hours) | No | Yes | Operating hours; inherits from Work Center → Plant if blank |
| 8 | Parent Territory | `parent_territory_id` | Lookup (Service Territory) | No | Yes | Parent territory for hierarchical grouping |
| 9 | Top-Level Territory | `top_level_territory` | Text (Read-Only) | No | No | Auto-resolved top of the territory hierarchy |
| 10 | Travel Mode | `travel_mode` | Picklist | No | Yes | `Driving`, `Motorcycle`, `Walking`, `Public Transit` |
| 11 | Avg Travel Time (min) | `avg_travel_time_minutes` | Integer | No | Yes | Average travel time in minutes including buffer. Affects Work Capacity Usage (WCU). |
| 12 | Typical In-Territory Travel (min) | `typical_in_territory_travel` | Integer | No | Yes | Estimated travel time between two points within the territory |
| 13 | Description | `description` | Long Text | No | Yes | Coverage area notes and territory description |
| 14 | Created Date | `created_date` | DateTime | Yes | No | System-generated creation timestamp |
| 15 | Modified Date | `modified_date` | DateTime | Yes | No | System-generated last-modified timestamp |

---

#### 5.2.2 Service Territory Member (Mechanic Assignment) Fields

The Service Territory Members child object links individual mechanics to territories and defines the nature of their assignment.

| # | Field Name | API Name | Type | Required | Editable | Description |
|---|---|---|---|---|---|---|
| 1 | Member ID | `member_id` | Auto Number | Yes | No | Auto-generated member record ID |
| 2 | Service Territory | `territory_id` | Lookup (Service Territory) | Yes | No | The territory this member belongs to |
| 3 | Mechanic / Service Resource | `mechanic_id` | Lookup (Service Resource) | Yes | Yes | The mechanic being assigned |
| 4 | Territory Type | `territory_type` | Picklist | Yes | Yes | `Primary`, `Secondary`, or `Relocation` |
| 5 | Start Date | `start_date` | Date | Yes | Yes | When the mechanic's assignment begins |
| 6 | End Date | `end_date` | Date | No | Yes | When the assignment ends; blank = permanent |
| 7 | Address Override | `address_override` | Address | No | Yes | Member-specific home base; overrides territory address |
| 8 | Operating Hours Override | `operating_hours_override` | Lookup (Operating Hours) | No | Yes | Member-specific hours; overrides territory hours |
| 9 | Member Number | `member_number` | Auto Number (Read-Only) | Yes | No | System-generated display number |

---

### 5.3 Territory Type Logic

| Territory Type | Rule | Use Case |
|---|---|---|
| **Primary** | A mechanic can have only ONE active Primary territory at any time | Mechanic's regular working zone near their home base |
| **Secondary** | A mechanic can have MULTIPLE Secondary territories with overlapping dates | Overflow coverage or cross-territory support |
| **Relocation** | A mechanic can have a Relocation territory for a defined date range; this overrides dispatch routing during that period | Temporary reassignment, project-based relocation |

**Example mechanic territory setup:**

```
Mechanic: Budi Santoso
 ├── Primary Territory: West Jakarta [Permanent]
 ├── Secondary Territory: South Jakarta [Permanent]
 ├── Secondary Territory: Central Jakarta [Jan–Jun 2026]
 └── Relocation Territory: Surabaya [Feb 1 – Apr 30, 2026]
```

---

### 5.4 Service Territory — Business Rules

| Rule ID | Rule |
|---|---|
| ST-001 | A Service Territory must be linked to an active Plant. |
| ST-002 | A Service Territory must be linked to an active Work Center under the same Plant. |
| ST-003 | A mechanic can have only one active `Primary` territory at any point in time. |
| ST-004 | A mechanic may have multiple `Secondary` territories with overlapping date ranges. |
| ST-005 | A `Relocation` territory is only active during its `start_date` to `end_date` range. During this range, dispatch prioritizes the Relocation territory over Primary or Secondary. |
| ST-006 | If a territory's `address` is set, it becomes the home base for all mechanics in that territory who do not have an `address_override`. |
| ST-007 | `avg_travel_time_minutes` contributes to Work Capacity Usage (WCU) for scheduled service appointments. |
| ST-008 | Deactivating a territory prevents new mechanic assignments and new service appointment creation within that territory. |
| ST-009 | Operating hours cascade: Member Override → Territory → Work Center → Plant (in order of priority). |
| ST-010 | A territory linked to a Work Center of type `FM` should only accept mechanics assigned to that FM contract's dedicated resource pool (when `fm_resource_count` is set). |

---

## 6. Entity Relationships & Hierarchy

### 6.1 Full Hierarchy

```
┌─────────────────────────────┐
│           PLANT             │  ← Branch / Site / HQ / Satellite
│  plant_id | site_type       │
└────────────┬────────────────┘
             │ 1 : many
             ▼
┌─────────────────────────────┐
│        WORK CENTER          │  ← FD (Field Service) or FM (Full Contract)
│  wc_id | wc_type | plant_id │
└────────────┬────────────────┘
             │ 1 : many
             ▼
┌─────────────────────────────┐
│      SERVICE TERRITORY      │  ← Geographic Zone
│  territory_id | plant_id    │
│  work_center_id             │
└────────────┬────────────────┘
             │ 1 : many
             ▼
┌─────────────────────────────┐
│  SERVICE TERRITORY MEMBER   │  ← Mechanic Assignment
│  mechanic_id | territory_id │
│  territory_type             │
└─────────────────────────────┘
```

### 6.2 Key Relationships

| Relationship | Cardinality | Notes |
|---|---|---|
| Plant → Work Center | One-to-Many | One Plant can have many Work Centers |
| Plant → Service Territory | One-to-Many | Territories trace back to their Plant |
| Work Center → Service Territory | One-to-Many | One Work Center can have multiple territories |
| Service Territory → Territory Members | One-to-Many | Many mechanics per territory |
| Mechanic → Primary Territory | One-to-One (at a time) | Only one Primary at any given time |
| Mechanic → Secondary Territory | One-to-Many | Multiple Secondary territories allowed |

---

## 7. Integration with Salesforce Field Service

This module maps to and extends the following Salesforce Field Service (SFS) objects:

| This PRD | Salesforce Field Service Object | Notes |
|---|---|---|
| Plant | Custom Object (Plant__c) | Not a native SFS object; custom-built |
| Work Center | Custom Object (Work_Center__c) | Not a native SFS object; custom-built |
| Service Territory | `ServiceTerritory` | Native SFS object; extended with Plant/WC lookups |
| Territory Member | `ServiceTerritoryMember` | Native SFS object; extended with territory type logic |
| Mechanic | `ServiceResource` | Native SFS object |
| Operating Hours | `OperatingHours` | Native SFS object |

> Geocoding for Plant and Service Territory addresses relies on Salesforce's native address geocoding pipeline.

---

## 8. Acceptance Criteria

| # | ID | Criteria | Module |
|---|---|---|---|
| 1 | AC-PLT-01 | A Plant can be created with a valid Site Type from the defined enum. | Plant |
| 2 | AC-PLT-02 | A Satellite Plant cannot be saved without a valid `parent_plant_id`. | Plant |
| 3 | AC-PLT-03 | Deactivating a Plant with active child Work Centers triggers a system warning. | Plant |
| 4 | AC-PLT-04 | Plant Code is validated for uniqueness on save. | Plant |
| 5 | AC-WC-01 | A Work Center can be created with type `FD` or `FM`, linked to an active Plant. | Work Center |
| 6 | AC-WC-02 | FM-specific fields are only visible and editable when `wc_type = FM`. | Work Center |
| 7 | AC-WC-03 | FM fields `fm_contract_ref`, `fm_client_name`, and `fm_scope_of_work` are required when `wc_type = FM`. | Work Center |
| 8 | AC-WC-04 | `wc_type` cannot be changed after a Service Territory has been linked. | Work Center |
| 9 | AC-ST-01 | A Service Territory can be created and linked to a valid Plant and Work Center under the same Plant. | Service Territory |
| 10 | AC-ST-02 | A mechanic can be assigned to a territory with type `Primary`, `Secondary`, or `Relocation`. | Service Territory |
| 11 | AC-ST-03 | A mechanic with an existing active Primary territory cannot be assigned a second Primary territory. | Service Territory |
| 12 | AC-ST-04 | Operating hours resolve correctly in cascade order: Member → Territory → Work Center → Plant. | Service Territory |
| 13 | AC-ST-05 | Deactivating a territory prevents new service appointments from being created within it. | Service Territory |
| 14 | AC-ST-06 | `avg_travel_time_minutes` is reflected in Work Capacity Usage (WCU) calculations. | Service Territory |

---

## 9. Open Issues & Future Scope

| ID | Topic | Status | Notes |
|---|---|---|---|
| OI-001 | FM contract billing integration | Open | Billing module to be defined in a separate PRD |
| OI-002 | Preventive maintenance scheduler for FM Work Centers | Open | PM scheduling engine scope TBD |
| OI-003 | Territory boundary polygon mapping | Future | Geo-boundary drawing on map UI for territory visualization |
| OI-004 | Mobile mechanic app — territory display | Future | Mechanic-facing mobile view of assigned territories |
| OI-005 | Real-time mechanic GPS tracking within territory | Future | Requires GPS integration layer |
| OI-006 | Multi-plant Service Territory spanning | Future | Territories that span more than one Plant (cross-border cases) |

---

*End of PRD — Service Area Full Module Specification (v2.0)*
*Modules covered: Plant · Work Center (FD + FM) · Service Territory*
