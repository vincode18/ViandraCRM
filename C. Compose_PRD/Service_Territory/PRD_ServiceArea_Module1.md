# Product Requirements Document
## Module: Service Area — Plant, Work Center (FD), and Service Territory

**Document Version:** 1.0
**Status:** Draft
**Last Updated:** 2026-06-06

---

## 1. Overview

This PRD defines the **Service Area** module, which is the foundational configuration layer for managing field service operations. The Service Area module governs how geographic and organizational service structures are set up, linking physical plant locations to operational work centers and, ultimately, to mechanic-level service territories.

The module is composed of three interconnected sub-modules:

| Sub-Module | Purpose |
|---|---|
| **Plant** | Defines branch/site configuration and type classification |
| **Work Center** | Defines the business operational unit under a Plant (e.g., Field Service / FD type) |
| **Service Territory** | Defines the geographic zone assigned to mechanics, linked to a Plant |

---

## 2. Module 1 — Plant

### 2.1 Description

A **Plant** represents a physical branch or operational site within the organization. It serves as the top-level grouping entity for all service operations in a given location. Each Plant must be classified by a **Site Type** to distinguish the nature of the branch.

### 2.2 Site Type Classification

| Site Type Code | Description |
|---|---|
| `BRANCH` | A standard service branch handling field operations |
| `SITE` | A dedicated operational site (e.g., depot, hub, regional office) |
| `HQ` | Headquarters — the central command site |
| `SATELLITE` | A smaller satellite office dependent on a parent branch |

### 2.3 Plant Fields

| Field Name | Type | Required | Description |
|---|---|---|---|
| `plant_id` | String (Auto) | Yes | Unique auto-generated identifier for the plant |
| `plant_name` | String | Yes | Name of the branch or site |
| `site_type` | Enum | Yes | Classification: `BRANCH`, `SITE`, `HQ`, `SATELLITE` |
| `address` | Address | Yes | Physical address of the plant |
| `city` | String | Yes | City where the plant is located |
| `region` | String | Yes | Region or province of the plant |
| `country` | String | Yes | Country of the plant |
| `is_active` | Boolean | Yes | Indicates if the plant is currently operational |
| `parent_plant_id` | String | No | Reference to a parent plant (for satellite branches) |
| `operating_hours` | Reference | No | Default operating hours for this plant |
| `created_date` | DateTime | Yes | Record creation timestamp |
| `modified_date` | DateTime | Yes | Last modification timestamp |

### 2.4 Business Rules

- A Plant must have a valid `site_type` before it can be activated.
- A Plant flagged as `SATELLITE` must reference a valid `parent_plant_id`.
- Deactivating a Plant (`is_active = false`) must cascade a warning if linked Work Centers or Service Territories are still active.
- Each Plant must have a geocoded address to support territory distance calculations.

---

## 3. Module 2 — Work Center

### 3.1 Description

A **Work Center** is the operational business unit that sits under a Plant. It defines the type of service business being conducted and carries the configuration for service delivery. Each Work Center must be linked to exactly one Plant.

### 3.2 Work Center Type Classification

The Work Center has a primary business type field. The key types are:

| Type Code | Name | Description |
|---|---|---|
| `FD` | Field Service (Regular) | Standard field service delivery — technicians dispatched to customer sites for regular maintenance and repair jobs |
| `FM` | Full Contract / Facilities Management | A full-contract service model where the Work Center manages an end-to-end service contract (includes preventive maintenance schedules, SLAs, asset management, and dedicated resource allocation) |

> **Note:** `FD` is the default field service type. `FM` represents a more complex contract-based engagement and will carry additional configuration fields specific to contract management (defined in a future PRD iteration).

### 3.3 Work Center Fields

| Field Name | Type | Required | Description |
|---|---|---|---|
| `work_center_id` | String (Auto) | Yes | Unique auto-generated identifier |
| `work_center_name` | String | Yes | Name of the work center |
| `work_center_type` | Enum | Yes | Type: `FD` (Field Service) or `FM` (Full Contract) |
| `plant_id` | Reference | Yes | Linked Plant record |
| `description` | Text | No | Description of the work center's scope and responsibilities |
| `is_active` | Boolean | Yes | Whether this work center is currently active |
| `service_lead` | Reference | No | The user/resource responsible for this work center |
| `default_sla_hours` | Integer | No | Default SLA response time in hours |
| `operating_hours` | Reference | No | Operating hours; inherited from Plant if not set |
| `fm_contract_ref` | String | No | Contract reference number (applicable only when type = `FM`) |
| `fm_scope_of_work` | Text | No | Scope of work detail for FM contracts |
| `created_date` | DateTime | Yes | Record creation timestamp |
| `modified_date` | DateTime | Yes | Last modification timestamp |

### 3.4 Business Rules

- A Work Center must be linked to an active Plant.
- `work_center_type` is required at creation and cannot be changed after the Work Center has associated Service Territories.
- Fields `fm_contract_ref` and `fm_scope_of_work` are only visible and editable when `work_center_type = FM`.
- A Work Center of type `FD` represents the standard dispatch model; no contract fields are required.
- A single Plant may have multiple Work Centers (e.g., one `FD` and one `FM` Work Center under the same branch).

---

## 4. Module 3 — Service Territory

### 4.1 Description

A **Service Territory** defines the geographic zone in which field mechanics (service resources) operate. Each Service Territory is linked to a Plant and falls under a Work Center, allowing dispatching systems to route jobs to the correct mechanics based on location and availability.

This module aligns with the Salesforce Field Service Service Territory model and extends it with Plant and Work Center linkage for organizational hierarchy.

### 4.2 Service Territory Fields

| Field Name | Type | Required | Description |
|---|---|---|---|
| `territory_id` | String (Auto) | Yes | Unique auto-generated identifier |
| `territory_name` | String | Yes | Name of the service territory (e.g., "North Zone", "East Jakarta") |
| `plant_id` | Reference | Yes | Linked Plant record — ties the territory to a branch/site |
| `work_center_id` | Reference | Yes | Linked Work Center record |
| `is_active` | Boolean | Yes | Whether this territory is currently operational |
| `address` | Address | No | Address used as the territory's home base |
| `operating_hours` | Reference | No | Operating hours for this territory; inherited from Plant if not set |
| `parent_territory_id` | Reference | No | Parent territory for hierarchical grouping |
| `top_level_territory` | String (Read-Only) | No | Auto-resolved top-level territory in the hierarchy |
| `travel_mode` | Enum | No | Mode of travel: `Driving`, `Walking`, `Motorcycle` |
| `avg_travel_time_minutes` | Integer | No | Average travel time within the territory in minutes |
| `typical_in_territory_travel` | Integer | No | Estimated travel time between two points within the territory |
| `description` | Text | No | Description of the territory coverage area |
| `created_date` | DateTime | Yes | Record creation timestamp |
| `modified_date` | DateTime | Yes | Last modification timestamp |

### 4.3 Service Territory Member (Mechanic Assignment)

Each Service Territory can have multiple **mechanic members** (service resources) assigned to it.

| Field Name | Type | Required | Description |
|---|---|---|---|
| `member_id` | String (Auto) | Yes | Auto-generated member record ID |
| `territory_id` | Reference | Yes | The Service Territory this mechanic belongs to |
| `mechanic_id` | Reference | Yes | The mechanic (service resource) being assigned |
| `territory_type` | Enum | Yes | `Primary`, `Secondary`, or `Relocation` |
| `start_date` | Date | Yes | Date the mechanic starts in this territory |
| `end_date` | Date | No | Date the mechanic's assignment ends (leave blank for permanent) |
| `operating_hours` | Reference | No | Mechanic-specific hours; inherits from territory if not set |

### 4.4 Business Rules

- A Service Territory must be linked to an active Plant.
- A Service Territory must be linked to an active Work Center under the same Plant.
- A mechanic can have only **one Primary territory** at any point in time.
- A mechanic can have **multiple Secondary territories** with overlapping dates.
- A **Relocation territory** overrides routing during the specified relocation period.
- Deactivating a Service Territory must prevent new mechanic assignments and new service appointment creation within that territory.
- The `address` of the territory serves as the home base for mechanics without a personal address override; used for first/last leg travel time calculations.

---

## 5. Entity Relationship Summary

```
Plant (Branch/Site)
 └── Work Center (FD or FM)
      └── Service Territory (Geographic Zone)
           └── Service Territory Members (Mechanics)
```

- **Plant** is the top-level organizational and physical node.
- **Work Center** is the operational classification under a Plant.
- **Service Territory** is the geographic zone linked to both a Plant and a Work Center.
- **Mechanic assignments** are made at the Service Territory level.

---

## 6. Out of Scope (This Version)

- FM (Full Contract) detailed billing and SLA management configuration — covered in a separate PRD.
- Scheduling engine and dispatch rules.
- Mobile mechanic app integration.
- Real-time GPS territory tracking.

---

## 7. Acceptance Criteria

| # | Criteria |
|---|---|
| 1 | A Plant record can be created with a valid Site Type (`BRANCH`, `SITE`, `HQ`, `SATELLITE`). |
| 2 | A Work Center record can be created with type `FD` or `FM`, linked to an active Plant. |
| 3 | FM-specific fields are only exposed when Work Center type is `FM`. |
| 4 | A Service Territory can be created and linked to both a Plant and a Work Center. |
| 5 | A mechanic can be assigned to a Service Territory with a defined territory type (Primary/Secondary/Relocation). |
| 6 | A mechanic cannot have two active Primary territories simultaneously. |
| 7 | Deactivating a Plant raises a warning if child Work Centers or Territories are still active. |
| 8 | Operating hours cascade correctly: Territory → Work Center → Plant (if not overridden). |

---

*End of PRD — Service Area Module 1 (FD Work Center)*
