# Functional Requirements Document
## Service Appointment (SA) Field Configuration
### OPERATIONS Platform · v4.2.0-stable

---

**Document Type:** Functional Requirements Document (FRD)  
**Module:** Service Appointment — Field Schema  
**Platform:** OPERATIONS CRM · Field Service Module  
**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** 2026-06-06  

---

## 1. Purpose

This document defines the complete field schema for the **Service Appointment (SA)** object within the OPERATIONS platform. It serves as the authoritative reference for developers, administrators, and QA teams implementing, validating, or integrating SA records. The SA record is the core scheduling and dispatch unit in the Field Service workflow, created from a Work Order's Feed tab and subsequently assignable to Gantt Chart Service Resources.

---

## 2. Scope

This FRD covers:

- All standard fields on the `ServiceAppointment` object
- Field data types, descriptions, and validation rules
- Read-only and computed field behavior
- Integration notes for external data mapping (Latitude/Longitude)
- Status lifecycle and Status Category definitions
- Bundle and Offsite appointment field behavior

---

## 3. SA Object Overview

| Property | Value |
|---|---|
| Object API Name | `ServiceAppointment` |
| Parent Objects | Work Order, Work Order Line Item, Account, Asset, Lead, Opportunity |
| Primary Key Field | `Appointment Number` (auto-assigned) |
| Scheduling Target | Gantt Chart Resource Assignment |
| Trigger Source | Work Order Feed Tab → "Book Appointment" action |

---

## 4. Field Definitions

### 4.1 Identification & Reference Fields

#### `Appointment Number`
| Attribute | Value |
|---|---|
| API Name | `AppointmentNumber` |
| Data Type | Auto Number |
| Required | Yes |
| Visible | Yes |
| Read Only | Yes |
| Description | An auto-assigned number that uniquely identifies the appointment. Immutable after creation. |

---

#### `Subject`
| Attribute | Value |
|---|---|
| API Name | `Subject` |
| Data Type | Short Text |
| Required | Recommended |
| Visible | Yes |
| Read Only | No |
| Description | A short phrase describing the appointment. Displayed as the primary label on the Gantt Chart appointment block. |

---

#### `Parent Record`
| Attribute | Value |
|---|---|
| API Name | `ParentRecordId` |
| Data Type | Reference (Polymorphic) |
| Required | Yes |
| Visible | Yes |
| Read Only | After Creation |
| Description | The parent record associated with the appointment. **Cannot be updated after the service appointment is created.** Accepted parent types: Account, Asset, Lead, Opportunity, Work Order, Work Order Line Item. |

---

#### `Parent Record Type`
| Attribute | Value |
|---|---|
| API Name | `ParentRecordType` |
| Data Type | Text (Read Only) |
| Required | No |
| Visible | Yes |
| Read Only | Yes |
| Description | The type of parent record. Possible values: `Account`, `Asset`, `Lead`, `Opportunity`, `Work Order`, `Work Order Line Item`. Computed automatically from the Parent Record relationship. |

---

#### `Parent Record Status Category`
| Attribute | Value |
|---|---|
| API Name | `ParentRecordStatusCategory` |
| Data Type | Text (Read Only) |
| Required | No |
| Visible | Yes |
| Read Only | Yes |
| Description | The Status Category of the parent record. Populated only if the parent record is a Work Order or Work Order Line Item; otherwise remains blank. |

---

#### `Work Type`
| Attribute | Value |
|---|---|
| API Name | `WorkTypeId` |
| Data Type | Reference |
| Required | No |
| Visible | Yes |
| Read Only | Conditional |
| Description | The work type associated with the service appointment. Inherited from the parent Work Order or Work Order Line Item. Read-only unless Lightning Scheduler is enabled, in which case it is editable — however, updating it to a different work type than the parent record's work type will produce a validation error. |

---

### 4.2 Account & Contact Fields

#### `Account`
| Attribute | Value |
|---|---|
| API Name | `AccountId` |
| Data Type | Reference |
| Required | No |
| Visible | Yes |
| Read Only | Yes |
| Description | The account associated with the appointment. If the parent record is a Work Order or Work Order Line Item, this value is inherited from the parent. Otherwise, it remains blank. |

---

#### `Contact`
| Attribute | Value |
|---|---|
| API Name | `ContactId` |
| Data Type | Reference |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The contact associated with the appointment. If the parent record is a Work Order or Work Order Line Item, this value is inherited from the parent. |

---

### 4.3 Address & Location Fields

#### `Address`
| Attribute | Value |
|---|---|
| API Name | `Street`, `City`, `State`, `PostalCode`, `Country` (compound) |
| Data Type | Address (Compound) |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The address where the appointment is taking place. Inherited from the parent record if the parent is a Work Order or Work Order Line Item. |

---

#### `Latitude`
| Attribute | Value |
|---|---|
| API Name | `Latitude` |
| Data Type | Number (Geolocation) |
| Required | No |
| Visible | API Only |
| Read Only | No |
| Accepted Range | –90 to 90 (up to 15 decimal places) |
| Description | Used with Longitude to specify the precise geolocation where the service appointment is completed. **Integration Note:** Map external data to `ServiceAppointment.Latitude`, NOT `ServiceAppointment.FSL__InternalSLRGeolocation__Latitude__s`. |

---

#### `Longitude`
| Attribute | Value |
|---|---|
| API Name | `Longitude` |
| Data Type | Number (Geolocation) |
| Required | No |
| Visible | API Only |
| Read Only | No |
| Accepted Range | –180 to 180 (up to 15 decimal places) |
| Description | Used with Latitude to specify the precise geolocation where the service appointment is completed. **Integration Note:** Map external data to `ServiceAppointment.Longitude`, NOT `ServiceAppointment.FSL__InternalSLRGeolocation__Longitude__s`. |

---

#### `Service Territory`
| Attribute | Value |
|---|---|
| API Name | `ServiceTerritoryId` |
| Data Type | Reference |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The service territory associated with the appointment. If the parent record is a Work Order or Work Order Line Item, the appointment inherits the parent's service territory. |

---

### 4.4 Scheduling & Timing Fields

#### `Duration`
| Attribute | Value |
|---|---|
| API Name | `Duration` |
| Data Type | Number |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The estimated length of the appointment. Inherited from the parent Work Order or Work Order Line Item but can be manually updated. Unit is determined by the `Duration Type` field. |

---

#### `Duration Type`
| Attribute | Value |
|---|---|
| API Name | `DurationType` |
| Data Type | Picklist |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Values | `Minutes`, `Hours` |
| Description | Specifies the unit of measurement for the `Duration` field. |

---

#### `DurationInMinutes`
| Attribute | Value |
|---|---|
| API Name | `DurationInMinutes` |
| Data Type | Number |
| Required | No |
| Visible | No (Internal) |
| Read Only | Computed |
| Description | The estimated time required to complete the service appointment, expressed in minutes. This field is for **internal use** only and is computed from `Duration` + `Duration Type`. |

---

#### `Earliest Start Permitted`
| Attribute | Value |
|---|---|
| API Name | `EarliestStartTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The date and time after which the appointment must be completed. Typically reflects terms in the customer's Service Level Agreement (SLA). Used in conjunction with `Due Date`. |

---

#### `Due Date`
| Attribute | Value |
|---|---|
| API Name | `DueDate` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The date and time by which the appointment must be completed. Typically reflects terms in the customer's SLA. Used in conjunction with `Earliest Start Permitted`. |

---

#### `Arrival Window Start`
| Attribute | Value |
|---|---|
| API Name | `ArrivalWindowStartTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The beginning of the window of time in which the mobile worker is scheduled to arrive at the site. This window is typically larger than the Scheduled Start/End window to accommodate delays and scheduling changes. May be shared with the customer; Scheduled Start/End may remain internal-only. |

---

#### `Arrival Window End`
| Attribute | Value |
|---|---|
| API Name | `ArrivalWindowEndTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The end of the window of time in which the mobile worker is scheduled to arrive at the site. This window is typically larger than the Scheduled Start/End window to accommodate delays and scheduling changes. |

---

#### `Scheduled Start`
| Attribute | Value |
|---|---|
| API Name | `SchedStartTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The time at which the appointment is scheduled to start. When using the Field Service managed package with the scheduling optimizer, this field is populated when the appointment is assigned to a resource. Relationship: `Scheduled End – Scheduled Start = Estimated Duration`. |

---

#### `Scheduled End`
| Attribute | Value |
|---|---|
| API Name | `SchedEndTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The time at which the appointment is scheduled to end. When using the Field Service managed package with the scheduling optimizer, this field is populated when the appointment is assigned to a resource. |

---

### 4.5 Actual Time & Duration Fields

#### `Actual Start`
| Attribute | Value |
|---|---|
| API Name | `ActualStartTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The actual date and time the appointment started. Populated by the mobile worker upon commencing work. |

---

#### `Actual End`
| Attribute | Value |
|---|---|
| API Name | `ActualEndTime` |
| Data Type | DateTime |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The actual date and time the appointment ended. Populated by the mobile worker upon completing work. |

---

#### `Actual Duration (Minutes)`
| Attribute | Value |
|---|---|
| API Name | `ActualDuration` |
| Data Type | Number |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | The number of minutes it took the resource to complete the appointment after arriving. When values are first added to `Actual Start` and `Actual End`, this field is **automatically populated** as the difference. **Important:** If `Actual Start` and `Actual End` are subsequently updated, this field does NOT automatically re-update — it must be manually corrected. |

---

### 4.6 Status Fields

#### `Status`
| Attribute | Value |
|---|---|
| API Name | `Status` |
| Data Type | Picklist |
| Required | Yes |
| Visible | Yes |
| Read Only | No |

**Standard Picklist Values:**

| Value | Description |
|---|---|
| `None` | Default value. No status assigned. |
| `Scheduled` | The service appointment is scheduled. |
| `Dispatched` | The service resource is in transit to the site. |
| `In Progress` | The service resource has started the work. |
| `Cannot Complete` | The service resource could not complete the appointment for any reason. |
| `Completed` | The service resource has completed the work. |
| `Canceled` | The service appointment has been canceled. |

> **Note:** Picklist values are customizable. Custom values must be mapped to a Status Category (see below).

---

#### `Status Category`
| Attribute | Value |
|---|---|
| API Name | `StatusCategory` |
| Data Type | Picklist |
| Required | Yes |
| Visible | Yes |
| Read Only | No |
| Description | The category each `Status` value falls into. Standard Status Category values mirror the standard Status values. Custom Status values must be mapped to one of the standard categories. For example, a custom `Customer Absent` value would be mapped to the `Cannot Complete` category. Processes and automations reference `Status Category` rather than `Status` for portability across custom configurations. |

---

#### `Schedule Mode`
| Attribute | Value |
|---|---|
| API Name | `ScheduleMode` |
| Data Type | Text (Read Only) |
| Required | No |
| Visible | Yes |
| Read Only | Yes |
| Description | Shows `Auto` or `Manual` following automated or manual scheduling. When Enhanced Scheduling and Optimization is in use, displays the specific scheduling method: `Drag and Drop`, `Schedule`, `Global Optimization`, `In-Day Optimization`, or `Resource Optimization`. |

---

### 4.7 Description & Notes Fields

#### `Description`
| Attribute | Value |
|---|---|
| API Name | `Description` |
| Data Type | Long Text Area |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | A detailed description of the appointment, its purpose, and any special instructions. |

---

#### `Service Note`
| Attribute | Value |
|---|---|
| API Name | `ServiceNote` |
| Data Type | Long Text Area |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Description | Notes added by the field technician, such as an appointment summary or recommendations for future work. Depending on configuration settings, these notes may appear on a customer-facing service report. |

---

### 4.8 Bundle Fields

#### `Bundle`
| Attribute | Value |
|---|---|
| API Name | `IsBundle` |
| Data Type | Checkbox (Boolean) |
| Required | No |
| Visible | Conditional |
| Read Only | No |
| Default | `false` |
| Description | Indicates if this service appointment is a **bundle** service appointment (the parent of a bundle group). Applicable when using the Appointment Bundler feature. |

---

#### `Bundle Member`
| Attribute | Value |
|---|---|
| API Name | `IsBundleMember` |
| Data Type | Checkbox (Boolean) |
| Required | No |
| Visible | Conditional |
| Read Only | No |
| Default | `false` |
| Description | Indicates if this service appointment is a **bundle member** (a child within a bundle group). Applicable when using the Appointment Bundler feature. |

---

#### `Bundle Policy`
| Attribute | Value |
|---|---|
| API Name | `BundlePolicyId` |
| Data Type | Reference |
| Required | No |
| Visible | Conditional |
| Read Only | No |
| Description | Reference to the bundle policy associated with this service appointment. Applicable when using the Appointment Bundler. |

---

#### `Related Bundle`
| Attribute | Value |
|---|---|
| API Name | `RelatedBundleId` |
| Data Type | Reference |
| Required | No |
| Visible | Conditional |
| Read Only | No |
| Description | The bundle that this service appointment is a member of. Applicable when using the Appointment Bundler. |

---

#### `Manually Bundled`
| Attribute | Value |
|---|---|
| API Name | `IsManuallyBundled` |
| Data Type | Checkbox (Boolean) |
| Required | No |
| Visible | Conditional |
| Read Only | Yes |
| Default | `false` |
| Description | Read-only field. Indicates if this bundle was created manually (rather than by the automated bundler). Applicable when using the Appointment Bundler. |

---

### 4.9 Enhanced Scheduling Fields

#### `Offsite Appointment`
| Attribute | Value |
|---|---|
| API Name | `IsOffsiteAppointment` |
| Data Type | Checkbox (Boolean) |
| Required | No |
| Visible | Yes |
| Read Only | No |
| Prerequisites | Enhanced Scheduling and Optimization must be enabled |
| Description | Indicates whether this appointment can be done remotely. If selected, no travel time is added to the scheduled resource record when the job is scheduled. Applicable for remote work such as technical assistance, report filing, or health and safety certification renewal. **Exception:** If the Service Resource Availability work rule is configured with a fixed gap (minimum break time), this setting is ignored and travel time is still calculated and displayed on the Gantt. **Note:** As of Summer '23, new Salesforce orgs have Enhanced Scheduling and Optimization enabled by default. Pre-Summer '23 orgs must manually add this field to the page layout. |

---

#### `Transaction`
| Attribute | Value |
|---|---|
| API Name | `FSL__InternalSLRTransaction__c` |
| Data Type | Text |
| Required | No |
| Visible | No (Internal) |
| Read Only | Yes |
| Description | The last transaction ID of the scheduling and optimization request that updated this object. Auto-generated and populated by the Enhanced Scheduling and Optimization engine. |

---

## 5. Field Summary Matrix

| # | Field Name | API Name | Data Type | Required | Visible | Read Only |
|---|---|---|---|---|---|---|
| 1 | Appointment Number | AppointmentNumber | Auto Number | Yes | Yes | Yes |
| 2 | Subject | Subject | Short Text | Rec. | Yes | No |
| 3 | Parent Record | ParentRecordId | Reference | Yes | Yes | After Create |
| 4 | Parent Record Type | ParentRecordType | Text | No | Yes | Yes |
| 5 | Parent Record Status Category | ParentRecordStatusCategory | Text | No | Yes | Yes |
| 6 | Work Type | WorkTypeId | Reference | No | Yes | Conditional |
| 7 | Account | AccountId | Reference | No | Yes | Yes |
| 8 | Contact | ContactId | Reference | No | Yes | No |
| 9 | Address | (Compound) | Address | No | Yes | No |
| 10 | Latitude | Latitude | Number | No | API | No |
| 11 | Longitude | Longitude | Number | No | API | No |
| 12 | Service Territory | ServiceTerritoryId | Reference | No | Yes | No |
| 13 | Duration | Duration | Number | No | Yes | No |
| 14 | Duration Type | DurationType | Picklist | No | Yes | No |
| 15 | DurationInMinutes | DurationInMinutes | Number | No | No | Yes |
| 16 | Earliest Start Permitted | EarliestStartTime | DateTime | No | Yes | No |
| 17 | Due Date | DueDate | DateTime | No | Yes | No |
| 18 | Arrival Window Start | ArrivalWindowStartTime | DateTime | No | Yes | No |
| 19 | Arrival Window End | ArrivalWindowEndTime | DateTime | No | Yes | No |
| 20 | Scheduled Start | SchedStartTime | DateTime | No | Yes | No |
| 21 | Scheduled End | SchedEndTime | DateTime | No | Yes | No |
| 22 | Actual Start | ActualStartTime | DateTime | No | Yes | No |
| 23 | Actual End | ActualEndTime | DateTime | No | Yes | No |
| 24 | Actual Duration (Minutes) | ActualDuration | Number | No | Yes | No |
| 25 | Status | Status | Picklist | Yes | Yes | No |
| 26 | Status Category | StatusCategory | Picklist | Yes | Yes | No |
| 27 | Schedule Mode | ScheduleMode | Text | No | Yes | Yes |
| 28 | Description | Description | Long Text | No | Yes | No |
| 29 | Service Note | ServiceNote | Long Text | No | Yes | No |
| 30 | Bundle | IsBundle | Boolean | No | Cond. | No |
| 31 | Bundle Member | IsBundleMember | Boolean | No | Cond. | No |
| 32 | Bundle Policy | BundlePolicyId | Reference | No | Cond. | No |
| 33 | Related Bundle | RelatedBundleId | Reference | No | Cond. | No |
| 34 | Manually Bundled | IsManuallyBundled | Boolean | No | Cond. | Yes |
| 35 | Offsite Appointment | IsOffsiteAppointment | Boolean | No | Yes | No |
| 36 | Transaction | FSL__Transaction__c | Text | No | No | Yes |

---

## 6. Status Lifecycle

```
[Created]
    │
    ▼
  None
    │
    ▼
Scheduled ──────────────────────────────► Canceled
    │
    ▼
Dispatched
    │
    ▼
In Progress ────────────────────────────► Cannot Complete
    │
    ▼
Completed
```

---

## 7. Integration Notes

### 7.1 Geolocation Mapping

When integrating external data sources for geolocation:

- ✅ Map to: `ServiceAppointment.Latitude`
- ❌ Do NOT map to: `ServiceAppointment.FSL__InternalSLRGeolocation__Latitude__s`
- ✅ Map to: `ServiceAppointment.Longitude`
- ❌ Do NOT map to: `ServiceAppointment.FSL__InternalSLRGeolocation__Longitude__s`

### 7.2 Actual Duration Auto-Population

The `Actual Duration (Minutes)` field is automatically populated **only on first write** of `Actual Start` and `Actual End`. Subsequent updates to those fields do NOT trigger a recalculation. Integrations that update `Actual Start`/`Actual End` must explicitly recalculate and write `Actual Duration (Minutes)`.

### 7.3 Status Category Usage

Automated processes, SLA evaluations, and optimization engines reference `Status Category`, not `Status`. Custom Status values that are not mapped to a `Status Category` will be ignored by these processes.

---

## 8. Revision History

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 1.0.0 | 2026-06-06 | System Admin | Initial draft — complete SA field schema documentation |

---

*OPERATIONS Platform · Field Service Module · Confidential Internal Document*
