# PRD-02 — Flow Logic & Integration
**Product:** UT Service Console  
**Module:** Setup → App Flows → Flow Builder  
**Version:** 1.0  
**Last Updated:** 2026-06-13  
**Status:** Draft — Awaiting Engineering Review

> This document is a companion to **PRD-01 — Flow Builder: UI & Navigation**. PRD-01 covers the canvas shell, toolbox, and navigation. PRD-02 covers all business logic elements, variable system, external integrations (REST / C#), and trigger configuration.

---

## 1. Overview

A flow is composed of **elements** (nodes on the canvas) connected by **paths** (edges). Each element has a type — logic, data, or action — and is configured via the Inspector panel. This document defines the data model, configuration schema, and runtime behaviour for every element type and integration pattern available in the Flow Builder.

---

## 2. Element Catalogue

### 2.1 Decision

**Purpose:** Branch the flow based on one or more conditions evaluated against variables or record fields.

**Visual:** Orange diamond `◇` node on canvas.

#### Configuration — Inspector Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Label | Text | ✅ | Display name on canvas |
| API Name | Text | ✅ | Auto-generated from label |
| Default Outcome Label | Text | ✅ | The branch taken when no condition matches |
| Outcomes | List | ✅ | At least one outcome required |

#### Outcome Configuration (per branch)

| Field | Type | Notes |
|-------|------|-------|
| Outcome Label | Text | Label shown on the connector arrow |
| Outcome API Name | Text | Used in flow metadata |
| Condition Logic | Select | `All Conditions Met (AND)` / `Any Condition Met (OR)` / `Custom` |
| Conditions | List of rows | Each row: `[Resource] [Operator] [Value]` |

**Condition Row Spec:**

```
[ Resource selector ▼ ]   [ Operator ▼ ]   [ Value / Resource ▼ ]
```

- **Resource selector:** Searchable dropdown listing all variables, record fields, and formula results accessible in the current flow scope.
- **Operator options** (vary by data type):

| Data Type | Available Operators |
|-----------|-------------------|
| Text | Equals, Does Not Equal, Contains, Starts With, Ends With, Is Null |
| Number / Currency | Equals, Does Not Equal, Greater Than, Less Than, ≥, ≤, Is Null |
| Boolean | Equals True, Equals False |
| Date / DateTime | Equals, Before, After, Is Null |
| Record (sObject) | Is Null, Is Not Null |
| Collection | Contains, Does Not Contain, Is Empty |

- **Value:** Can be a literal value (typed inline) or a reference to another flow resource (resource picker).

#### Runtime Behaviour

Outcomes are evaluated **top to bottom** in the order listed. The first matching outcome wins. If no outcome matches, the **Default Outcome** path is taken. If the Default Outcome has no connection, the flow ends without error (unless the element is the final step; then a warning fires on activation).

---

### 2.2 Assignment

**Purpose:** Set or modify the value of one or more flow variables.

**Visual:** Orange rectangle with `≡` (lines) icon.

#### Configuration — Inspector Fields

| Field | Type | Notes |
|-------|------|-------|
| Label | Text | Display name on canvas |
| API Name | Text | — |
| Assignments | List of rows | Each row: `[Variable] [Operator] [Value]` |

**Assignment Row Operators:**

| Operator | Behaviour |
|----------|-----------|
| `Equals` | Sets the variable to the value |
| `Add` | Adds the value (number/date) or appends (text/collection) |
| `Subtract` | Subtracts (number/date only) |
| `Multiply` | Multiplies (number only) |
| `Divide` | Divides (number only) |
| `Add Item` | Appends a record to a collection variable |
| `Remove Item` | Removes matching record from collection |

---

### 2.3 Loop

**Purpose:** Iterate over each item in a collection variable, executing child elements for each record.

#### Configuration

| Field | Type | Notes |
|-------|------|-------|
| Label | Text | — |
| Collection Variable | Resource picker | Must be a Collection data type |
| Loop Variable | Auto-created | Single-item variable of the same sObject type, usable inside the loop body |
| Iteration Direction | Select | `First Item to Last Item` / `Last Item to First Item` |

**Loop paths:** Two output connectors — `For Each Item` (loops back) and `After Last Item` (exits the loop).

---

### 2.4 Pause

**Purpose:** Suspend flow execution until a defined condition is met (time-based or platform-event-based).

> Pause is only available in **Autolaunched** and **Screen** flows.

#### Configuration

| Field | Type | Notes |
|-------|------|-------|
| Label | Text | — |
| Resume Conditions | List | Each condition: `[Resume Event Type] + optional criteria` |

**Resume Event Types:**

| Type | Description |
|------|-------------|
| Alarm | Resume at an absolute or relative date/time |
| Platform Event | Resume when a specific platform event message is received |
| Record Change | Resume when a specified record field changes to a target value |

---

### 2.5 Get Records

**Purpose:** Query records from the database into a flow variable.

#### Configuration

| Field | Type | Notes |
|-------|------|-------|
| Label | Text | — |
| Object | Object picker | e.g. `Account`, `Case`, `Work_Order__c` |
| Filter Conditions | Condition rows | Same row structure as Decision conditions |
| Sort Order | Optional | Field + `ASC` / `DESC` |
| How Many Records | Select | `Only the first record` / `All records` |
| Store Output In | Resource picker | Auto-creates variable if none exists |

When `Only the first record` is selected, output is a single **Record variable** of the chosen object type.  
When `All records` is selected, output is a **Collection variable**.

---

### 2.6 Create Records

**Purpose:** Insert one or more new records into the database.

#### Configuration

| Field | Notes |
|-------|-------|
| Object | Object picker |
| Set Field Values | Table of `[Field] = [Value / Resource]` rows |
| Store Record ID | Optional — saves the new record's ID to a Text variable |

---

### 2.7 Update Records

**Purpose:** Update records that match filter conditions.

#### Configuration

| Field | Notes |
|-------|-------|
| How to Find Records | `Use the IDs and all field values from a record variable` / `Specify conditions` |
| Object (if conditions) | Object picker |
| Filter Conditions | Condition rows |
| Set Field Values | Table of `[Field] = [Value / Resource]` rows |

---

### 2.8 Delete Records

**Purpose:** Delete records that match filter conditions.

#### Configuration

| Field | Notes |
|-------|-------|
| How to Find Records | `Use the IDs from a record variable or collection` / `Specify conditions` |
| Object (if conditions) | Object picker |
| Filter Conditions | Condition rows |

---

## 3. Variable System

### 3.1 Resource Types

| Type | Description | Scope |
|------|-------------|-------|
| Variable | Stores a single value or record; can be input/output | Flow-wide |
| Collection Variable | Stores a list of values or records | Flow-wide |
| Constant | Fixed value defined at design time | Flow-wide |
| Formula | Computed expression, evaluated at runtime | Flow-wide |
| Text Template | Rich text with merge fields | Flow-wide |
| Choice | Used with Screen Flow picklist inputs | Flow-wide |
| Record Choice Set | Dynamic list from Get Records | Flow-wide |

### 3.2 Data Types

`Text` · `Number` · `Currency` · `Boolean` · `Date` · `DateTime` · `Picklist` · `Multi-Select Picklist` · `sObject (Record)` · `Apex-Defined`

### 3.3 Global Variables (system-injected, read-only)

| Variable | Value |
|----------|-------|
| `$Flow.CurrentDate` | Today's date |
| `$Flow.CurrentDateTime` | Current datetime |
| `$Flow.CurrentStage` | Active stage name (Screen flows) |
| `$User.Id` | Running user's ID |
| `$User.Name` | Running user's full name |
| `$Organization.Id` | Org / tenant ID |

### 3.4 Variable Scope & Lifetime

Variables are **scoped to a single interview** (one execution instance of the flow). They do not persist across interviews unless explicitly written to a record field or external system via an API action.

---

## 4. External Action: REST API Integration

### 4.1 Overview

The **Action** element (Interaction category in Toolbox) supports invoking external REST endpoints. This is the primary integration point for calling C# services, middleware, or third-party APIs from within a flow.

**Visual:** Apex/Code Action node — navy rectangle `>_` icon.

### 4.2 REST Action Configuration — Inspector

**Tab: General**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Label | Text | ✅ | Canvas display name |
| Action Type | Select | ✅ | `REST API Call` / `Apex Class` / `External Service` |
| HTTP Method | Select | ✅ (REST only) | `GET` · `POST` · `PUT` · `PATCH` · `DELETE` |
| Endpoint URL | Text / Formula | ✅ | Can reference flow variables via `{!VariableName}` merge syntax |
| Authentication | Select | ✅ | `None` · `Named Credential` · `Bearer Token (variable)` · `Basic Auth` |
| Named Credential | Resource picker | If auth = Named Credential | Selects pre-configured credential from Setup → Named Credentials |
| Request Timeout (ms) | Number | ✅ | Default: `30000` (30s). Max: `120000` |

**Tab: Request**

| Field | Notes |
|-------|-------|
| Headers | Key-value table. Values can reference flow variables. Default: `Content-Type: application/json` |
| Request Body | Code editor (JSON). Supports `{!Variable}` merge fields. Shown only for `POST`, `PUT`, `PATCH` |
| Query Parameters | Key-value table (for `GET`). Values can reference flow variables |

**Request Body Example:**
```json
{
  "caseId": "{!CurrentCase.Id}",
  "assignedTo": "{!AssignedUserId}",
  "priority": "{!CurrentCase.Priority__c}",
  "timestamp": "{!$Flow.CurrentDateTime}"
}
```

**Tab: Response**

| Field | Notes |
|-------|-------|
| HTTP Status Code Variable | Optional Text variable to store the response status (e.g. `"200"`) |
| Response Body Variable | Optional Text variable to store the full raw JSON response body |
| Parsed Field Mappings | Table of `[JSON Path] → [Flow Variable]` rows for extracting specific fields |

**Parsed Field Mapping Row:**

```
[ JSON Path (e.g. $.data.userId) ]    →    [ Flow Variable (resource picker) ]
```

Uses [JSONPath](https://goessner.net/articles/JsonPath/) dot-notation. Nested paths supported (e.g. `$.result.owner.id`).

### 4.3 C# Service Integration Pattern

When connecting to a C# REST API hosted as an internal service:

1. **Register the endpoint** in Setup → External Services (or use a Named Credential for auth).
2. **In the Flow Builder**, add an `Action` element and select `REST API Call`.
3. Set the endpoint URL to the C# service base URL + path (can use a flow variable for dynamic paths).
4. Map response JSON fields back to flow variables using the Parsed Field Mapping table (Section 4.2).
5. Use subsequent **Decision** or **Assignment** elements to act on the response data.

**Example C# service call sequence:**

```
[Get Records: Get Case]
        ↓
[Action: REST POST → C# /api/owner/assign]
   Body: { caseId, priority, region }
        ↓ (success)
[Assignment: Set AssignedUserId = $.result.userId]
        ↓
[Update Records: Update Case.OwnerId = AssignedUserId]
        ↓
[Action: Alert Owner]
        ↓ (fault)
[Assignment: Set ErrorMessage = "Owner assignment failed"]
        ↓
[Action: Log Error to Platform Event]
```

### 4.4 Fault Handling (REST Actions)

All REST Action elements expose a **Fault path** (dashed red connector). The fault path fires when:
- The HTTP response status is 4xx or 5xx.
- The request times out.
- A JSON parse error occurs during field mapping.

On the fault path, two system variables are automatically populated:

| Variable | Type | Content |
|----------|------|---------|
| `$Flow.FaultMessage` | Text | Human-readable error description |
| `$Flow.FaultStatusCode` | Text | HTTP status code as string (e.g. `"404"`) |

Best practice: always connect a fault path. Unhandled faults cause the flow interview to terminate and log a system error.

---

## 5. Apex Class Action

For complex logic that cannot be expressed in the visual builder, flows can invoke **Apex classes** exposed as invocable methods.

### 5.1 C# Equivalent

In the UT Service Console context, the Apex Action pattern maps to calling a **server-side C# method** exposed as an invocable action endpoint. The C# method must:

1. Be decorated with the `[InvocableMethod]` attribute equivalent (in the platform's extensibility layer).
2. Accept a strongly-typed input class.
3. Return a strongly-typed output class.
4. Handle its own exception management.

### 5.2 Apex Action Configuration — Inspector

| Field | Notes |
|-------|-------|
| Label | Canvas display name |
| Apex Class | Searchable dropdown listing all registered invocable classes |
| Input Variables | Table mapping flow variables → class input properties |
| Output Variables | Table mapping class output properties → flow variables |

---

## 6. Trigger Configuration

### 6.1 Schedule-Triggered Flow

Configured in the **Start node** Inspector.

| Field | Type | Notes |
|-------|------|-------|
| Flow Starts | DateTime picker | First run date and time |
| Frequency | Select | `Once` · `Daily` · `Weekly` · `Custom (CRON)` |
| CRON Expression | Text | Shown when Frequency = `Custom` |
| Object | Object picker | The sObject type to iterate over |
| Filter Conditions | Condition rows | Filters which records are included in the batch |
| Sort Order | Field + direction | Optional |
| Batch Size | Number | Default: 200. Max: 2000. Controls records per transaction |

**Runtime behaviour:** The scheduler creates one flow interview per matching record. Interviews run in serial within a batch transaction. If one interview fails, subsequent interviews in the same batch may also fail — design fault paths defensively.

### 6.2 Record-Triggered Flow

| Field | Type | Notes |
|-------|------|-------|
| Object | Object picker | e.g. `Case`, `Work_Order__c` |
| Trigger | Select | `A record is created` · `A record is updated` · `A record is created or updated` · `A record is deleted` |
| Entry Conditions | Condition rows | Optional. If blank, all records of the object type trigger the flow |
| When to Run Flow | Select | `Only when a record is created or updated to meet the condition` / `Every time a record is saved and meets the condition` |
| Run Order | Number | When multiple record-triggered flows exist on the same object, run order determines execution sequence (lower = earlier) |
| Optimise For | Select | `Actions and Related Records` (after-save, default) / `Fast Field Updates` (before-save) |

**Before-save vs After-save:**

| Mode | Timing | Can Update Triggering Record? | Can Create / DML Other Records? |
|------|--------|------------------------------|--------------------------------|
| Fast Field Updates (before-save) | Before commit | ✅ (direct field update, no DML) | ❌ |
| Actions and Related Records (after-save) | After commit | Via Update Records element | ✅ |

### 6.3 Autolaunched Flow

Autolaunched flows have no Start node trigger configured in the builder. They are invoked programmatically:

| Invocation Method | How |
|------------------|-----|
| From Apex / C# | `Flow.Interview.start()` or REST invocation URL |
| From Process Builder | Legacy — use Record-Triggered flow instead for new builds |
| From REST API | `POST /v1/flows/{flowApiName}/interviews` with input variables as JSON body |
| From another Flow | **Subflow** element |
| From Platform Event | Configure a Platform Event-Triggered flow instead |
| On a Schedule | Configure a Schedule-Triggered flow instead |

**REST invocation body example:**
```json
{
  "inputs": [
    {
      "CaseId": "5003000000D8cuI",
      "Priority": "High",
      "RequestedBy": "user@example.com"
    }
  ]
}
```

Response includes output variables (if the flow has variables marked as available for output).

### 6.4 Platform Event-Triggered Flow

| Field | Notes |
|-------|-------|
| Platform Event | Searchable dropdown of all registered platform event types |
| Condition Requirements | Optional criteria on the event payload fields |
| Resume Interviews | Toggle: `When a new platform event message is received` / `When any resume event is received` |

---

## 7. Screen Flow Elements

Screen flows display UI to the user and collect input. The following **Screen** component types are available inside a Screen element:

| Component | Input Type | Notes |
|-----------|-----------|-------|
| Text Input | Text variable | Single-line text |
| Long Text Area | Text variable | Multi-line |
| Number | Number variable | With optional min/max validation |
| Currency | Currency variable | — |
| Date | Date variable | Date picker |
| DateTime | DateTime variable | — |
| Checkbox | Boolean variable | — |
| Radio Buttons | Choice set | Static or record choice set |
| Picklist | Choice set | Single select |
| Multi-Select Picklist | Collection (Text) | — |
| Lookup | sObject variable | Record search with object + filter |
| Display Text | — | Read-only label using merge fields |
| Display Image | URL variable | Renders image from URL |

Screen navigation buttons:

| Button | Behaviour |
|--------|-----------|
| Next | Advances to the next screen element |
| Back | Returns to the previous screen element |
| Finish | Ends the screen flow and fires the `Finished` outcome |
| Pause | Saves interview state; user can resume later |

---

## 8. Error Handling Strategy

### 8.1 Recommended Fault Path Pattern

For every element that can fault (REST actions, Get/Update/Create/Delete Records, Apex actions):

```
[Element] ──(fault)──→ [Assignment: Set ErrorDetail = $Flow.FaultMessage]
                               ↓
                        [Create Records: Log error to Error_Log__c]
                               ↓
                        [Action: Notify admin via platform event or email]
```

### 8.2 Validation on Activation

The builder blocks activation if:

| Condition | Error Message |
|-----------|--------------|
| Decision has no outcomes | "Add at least one outcome to this Decision" |
| Loop has no `For Each Item` path | "Connect the For Each Item path" |
| REST Action has no endpoint URL | "Endpoint URL is required" |
| Variable referenced in a condition does not exist | "Resource '{name}' not found in this flow" |
| Schedule-triggered flow has no Object | "Select an object to iterate over" |
| Record-triggered flow has no Object | "Select the object that triggers this flow" |

### 8.3 Warnings (non-blocking)

| Condition | Warning |
|-----------|---------|
| Action element has no fault path | "Add a fault path to handle errors from this action" |
| Flow has input variables not used in any element | "Variable '{name}' is defined but never referenced" |
| Loop body is empty | "No elements connected inside this loop" |

---

## 9. Subflow (Reusable Flow Composition)

### 9.1 Purpose

The **Subflow** element calls another flow from within the current flow — enabling modular, reusable logic.

### 9.2 Configuration

| Field | Notes |
|-------|-------|
| Flow | Searchable picker — only Autolaunched and Screen flows are valid targets |
| Input Variable Assignments | Maps current flow variables → target flow's input variables |
| Output Variable Assignments | Maps target flow's output variables → current flow variables |

Subflow interviews run **synchronously** within the same transaction as the parent.

---

## 10. Design Constraints & Platform Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Max elements per flow | 2,000 | Includes connectors |
| Max variables per flow | 250 | — |
| Max scheduled flow batch size | 2,000 records | Per transaction |
| Max REST API callouts per transaction | 100 | Applies to REST Action elements |
| Max REST response body size | 12 MB | — |
| Max flow interview CPU time | 10,000 ms (10s) | — |
| Max SOQL queries per transaction | 100 | Applies to Get Records elements |
| Max DML rows per transaction | 10,000 | Applies to Create / Update / Delete Records |

---

## 11. Related Documents

| Document | Description |
|----------|-------------|
| PRD-01 — Flow Builder: UI & Navigation | Canvas layout, toolbox, node visuals, flow type creation wizard |
| Design_System.md v1.0 | Colour tokens, typography, spacing, badge patterns |
| Setup → Named Credentials | Authentication configuration for REST integrations |
| Setup → External Services | OpenAPI/Swagger-based external service registration |
| REST API Reference | `POST /v1/flows/{flowApiName}/interviews` endpoint spec |
