# PRD — Application Log (Data & API Specification)
**Product:** UT Service Console  
**Module:** Settings → App Settings → Application Log  
**Version:** 1.0  
**Last Updated:** 2026-06-12  
**Status:** Draft  

---

## 1. Overview

This document specifies the data model, event schema, REST API contract, and backend requirements for the Application Log. It is the technical companion to the UI/UX PRD. Engineers building the log service, the event-capture pipeline, and the frontend API client should use this document as the authoritative reference.

---

## 2. Log Entry Data Model

Every entry in the Application Log is stored as an `AppLogEntry` record.

### 2.1 Core Fields (All Entry Types)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `UUID` | ✅ | Unique identifier for the log entry |
| `orgId` | `UUID` | ✅ | Tenant / organisation identifier |
| `timestamp` | `ISO 8601 datetime` | ✅ | UTC datetime the event was recorded |
| `eventType` | `enum` | ✅ | See §2.3 |
| `moduleId` | `string` | ✅ | Identifier of the module that generated the event (e.g., `work-orders`, `integration-salesforce`) |
| `objectId` | `string` | ✅ | Identifier of the affected object (e.g., `WO-00432`, `CASE-0091`) |
| `objectType` | `string` | ✅ | Type/entity name of the object (e.g., `WorkOrder`, `Case`) |
| `actorType` | `enum` | ✅ | `USER` \| `SYSTEM` \| `INTEGRATION` |
| `actorId` | `string` | ✅ | User ID, system process name, or integration ID |
| `actorLabel` | `string` | ✅ | Display name or email for UI rendering |
| `description` | `string` | ✅ | Human-readable summary (auto-generated) |
| `requestStatus` | `enum` | ✅ | `S` (Success) \| `F` (Failure) |
| `errorMessage` | `string` | ❌ | Present only when `requestStatus = F` |
| `metadata` | `object` | ❌ | Type-specific payload — see §2.4 and §2.5 |

### 2.2 Indexed Fields

The following fields must be indexed for query performance:

- `orgId`
- `timestamp`
- `objectId`
- `moduleId`
- `eventType`
- `requestStatus`
- `actorId`

### 2.3 Event Types (`eventType` Enum)

| Value | Description |
|-------|-------------|
| `OBJECT_CREATE` | A new object record was created |
| `OBJECT_UPDATE` | One or more fields on an existing object were changed |
| `OBJECT_DELETE` | An object record was deleted or deactivated |
| `OBJECT_STATUS_CHANGE` | Status field specifically changed (sub-type for visibility) |
| `REST_API_INBOUND` | Inbound REST API request received by an integration module |
| `REST_API_OUTBOUND` | Outbound REST API request sent by an integration module |

### 2.4 Object Change Metadata (`metadata` for `OBJECT_*` events)

```jsonc
{
  "changedFields": [
    {
      "fieldName": "status",
      "displayLabel": "Status",
      "oldValue": "Open",
      "newValue": "In Progress"
    },
    {
      "fieldName": "assignedToId",
      "displayLabel": "Assigned To",
      "oldValue": null,
      "newValue": "usr_8842"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `changedFields` | `array` | List of field-level diffs |
| `changedFields[].fieldName` | `string` | Internal API field name |
| `changedFields[].displayLabel` | `string` | Human-readable label for UI |
| `changedFields[].oldValue` | `any \| null` | Value before the change |
| `changedFields[].newValue` | `any \| null` | Value after the change |

### 2.5 REST API Event Metadata (`metadata` for `REST_API_*` events)

Captures the ELF (Event Log File) fields for API integration events.

```jsonc
{
  "method": "POST",
  "query": "SELECT Id, Name, StageName FROM Opportunity WHERE CloseDate = TODAY",
  "responseSize": 1204,
  "rowsProcessed": 12,
  "entityName": "Opportunity",
  "direction": "OUTBOUND",
  "integrationName": "Salesforce Sync",
  "httpStatusCode": 200,
  "durationMs": 342
}
```

| Field | Type | Required | ELF Field | Description |
|-------|------|----------|-----------|-------------|
| `method` | `string` | ✅ | `METHOD` | HTTP method (`GET`, `POST`, `PATCH`, `DELETE`, etc.) |
| `query` | `string` | ❌ | `QUERY` | SOQL query used, if applicable |
| `responseSize` | `integer` | ✅ | `RESPONSE_SIZE` | Size of the response payload in bytes |
| `rowsProcessed` | `integer` | ✅ | `ROWS_PROCESSED` | Number of rows returned or written |
| `entityName` | `string` | ✅ | `ENTITY_NAME` | Object/entity accessed (e.g., `Account`, `Contact`) |
| `direction` | `enum` | ✅ | — | `INBOUND` \| `OUTBOUND` |
| `integrationName` | `string` | ✅ | — | Human-readable integration module name |
| `httpStatusCode` | `integer` | ✅ | — | HTTP response code (e.g., `200`, `404`, `500`) |
| `durationMs` | `integer` | ❌ | — | Round-trip latency in milliseconds |

> **Note:** `requestStatus` maps from `httpStatusCode` automatically: `2xx` → `S`, all others → `F`.

---

## 3. REST API Contract

All Application Log endpoints live under `/api/v1/app-log`.

### 3.1 Authentication

- All endpoints require a valid session token via `Authorization: Bearer <token>`.
- Access is restricted to users with the `admin` or `integration_manager` role.

---

### 3.2 `GET /api/v1/app-log`

Returns a paginated list of log entries for the authenticated organisation.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `objectId` | `string` | ❌ | — | Filter by specific object ID |
| `moduleId` | `string` | ❌ | — | Filter by specific module ID |
| `eventType` | `string (comma-sep)` | ❌ | — | One or more `eventType` values |
| `actorId` | `string (comma-sep)` | ❌ | — | Filter by user(s) or integration ID(s) |
| `requestStatus` | `S \| F` | ❌ | — | Filter by success or failure |
| `from` | `ISO 8601 datetime` | ❌ | 30 days ago | Start of date range |
| `to` | `ISO 8601 datetime` | ❌ | now | End of date range |
| `page` | `integer` | ❌ | `1` | Page number (1-indexed) |
| `pageSize` | `integer` | ❌ | `50` | Rows per page. Max: `100` |
| `sortBy` | `string` | ❌ | `timestamp` | Field to sort by |
| `sortOrder` | `asc \| desc` | ❌ | `desc` | Sort direction |

#### Success Response `200 OK`

```jsonc
{
  "data": [
    {
      "id": "log_3f8a12cd-...",
      "orgId": "org_00123",
      "timestamp": "2026-06-12T14:32:07Z",
      "eventType": "REST_API_OUTBOUND",
      "moduleId": "integration-salesforce",
      "objectId": "OPP-0091",
      "objectType": "Opportunity",
      "actorType": "INTEGRATION",
      "actorId": "int_salesforce_001",
      "actorLabel": "Salesforce Sync",
      "description": "Outbound POST to Salesforce Opportunity entity. 12 rows processed.",
      "requestStatus": "S",
      "errorMessage": null,
      "metadata": {
        "method": "POST",
        "query": null,
        "responseSize": 1204,
        "rowsProcessed": 12,
        "entityName": "Opportunity",
        "direction": "OUTBOUND",
        "integrationName": "Salesforce Sync",
        "httpStatusCode": 200,
        "durationMs": 342
      }
    }
    // ... more entries
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalRecords": 1240,
    "totalPages": 25
  }
}
```

#### Error Responses

| Code | Condition |
|------|-----------|
| `400 Bad Request` | Invalid query parameter value or format |
| `401 Unauthorized` | Missing or expired token |
| `403 Forbidden` | Authenticated user lacks required role |
| `500 Internal Server Error` | Unexpected server failure |

---

### 3.3 `GET /api/v1/app-log/:id`

Returns the full detail of a single log entry including the complete `metadata` payload.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `UUID` | ✅ | Log entry ID |

#### Success Response `200 OK`

Returns a single `AppLogEntry` object (same shape as items in `data[]` above).

#### Error Responses

| Code | Condition |
|------|-----------|
| `404 Not Found` | Log entry does not exist or belongs to a different org |
| `401 Unauthorized` | Missing or expired token |
| `403 Forbidden` | Insufficient role |

---

### 3.4 `GET /api/v1/app-log/filters/options`

Returns available filter values for the current org (used to populate filter panel dropdowns).

#### Success Response `200 OK`

```jsonc
{
  "users": [
    { "id": "usr_001", "label": "alice@company.com" },
    { "id": "usr_002", "label": "bob@company.com" }
  ],
  "modules": [
    { "id": "work-orders", "label": "Work Orders" },
    { "id": "integration-salesforce", "label": "Salesforce Sync" }
  ],
  "objectTypes": ["WorkOrder", "Case", "ServiceAppointment", "Opportunity"],
  "eventTypes": [
    "OBJECT_CREATE",
    "OBJECT_UPDATE",
    "OBJECT_DELETE",
    "OBJECT_STATUS_CHANGE",
    "REST_API_INBOUND",
    "REST_API_OUTBOUND"
  ]
}
```

---

## 4. Event Capture — Write Path

### 4.1 Object Change Events

Object change events are captured by service-layer hooks, not at the API controller level. Every service method that mutates an object must call the log service **after** a successful write:

```typescript
await logService.record({
  eventType: 'OBJECT_UPDATE',
  moduleId: 'work-orders',
  objectId: workOrder.id,
  objectType: 'WorkOrder',
  actorType: 'USER',
  actorId: currentUser.id,
  actorLabel: currentUser.email,
  requestStatus: 'S',
  metadata: {
    changedFields: diff(previousSnapshot, updatedWorkOrder),
  },
});
```

Rules:
- Capture is **fire-and-forget** (non-blocking) — log failures must not surface to the end user.
- If the log write itself fails, emit to an error monitoring queue; do not throw.
- Bulk operations generate one log entry **per affected object**, not one entry for the batch.

### 4.2 REST API Integration Events

Integration modules must call the log service at the conclusion of each outbound request and upon receipt of each inbound request:

```typescript
// Outbound — after receiving HTTP response
await logService.record({
  eventType: 'REST_API_OUTBOUND',
  moduleId: 'integration-salesforce',
  objectId: relatedObjectId ?? 'N/A',
  objectType: entityName,
  actorType: 'INTEGRATION',
  actorId: integrationConfig.id,
  actorLabel: integrationConfig.name,
  requestStatus: httpStatusCode >= 200 && httpStatusCode < 300 ? 'S' : 'F',
  errorMessage: isFailure ? responseBody.error : undefined,
  metadata: {
    method,
    query: soqlQuery ?? null,
    responseSize: Buffer.byteLength(responseBody),
    rowsProcessed: recordCount,
    entityName,
    direction: 'OUTBOUND',
    integrationName: integrationConfig.name,
    httpStatusCode,
    durationMs: endTime - startTime,
  },
});
```

---

## 5. Log Retention

| Tier | Retention | Storage |
|------|-----------|---------|
| Hot (queryable via UI) | 90 days | Primary database |
| Warm (downloadable on request) | 1 year | Object storage (S3-compatible) |
| Cold (archived) | 7 years | Glacier / cold storage |

Retention windows are configurable in **Settings → Audit Settings** (separate module, out of scope for v1.0).

---

## 6. Performance Requirements

| Metric | Target |
|--------|--------|
| `GET /app-log` p95 response time | < 400 ms |
| `GET /app-log/:id` p95 response time | < 150 ms |
| Log write throughput | ≥ 500 writes/sec sustained |
| Max query window without pagination | 90 days |
| UI table render (50 rows) | < 200 ms client-side |

---

## 7. Security & Privacy

- Log entries are **immutable** — no update or delete endpoints are exposed.
- Sensitive field values (passwords, tokens, PII) must be **redacted** at the service layer before writing to `changedFields`. Redaction list is maintained in `logService.redactedFields`.
- All log data is scoped to `orgId` — cross-tenant access is prevented at the query layer.
- Role requirement: `admin` or `integration_manager`. Read-only access only.
- Audit logs themselves are not logged (no infinite recursion).

---

## 8. Dependencies

| Dependency | Purpose |
|------------|---------|
| `logService` | Central service for writing log entries |
| `ThemeContext` | Dark/light mode tokens consumed by frontend |
| `AuthContext` | Supplies `orgId`, `actorId`, `actorLabel` |
| Integration config store | Provides `integrationName`, `integrationConfig.id` for API events |
| Object snapshot service | Provides `previousSnapshot` for field-diff computation |

---

## 9. Out of Scope (v1.0)

- Export endpoints (`GET /app-log/export.csv`).
- Real-time WebSocket streaming of new log entries.
- Log-level alerting / notification rules.
- SOQL query storage for inbound queries larger than 4 KB.
- Admin ability to purge or redact specific log entries.

---

## 10. Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ1 | Should full API response bodies be stored in `metadata`? Storage and privacy implications need review. | Platform / Security |
| OQ2 | Confirm the exact retention tiers with legal/compliance. | Legal |
| OQ3 | Is `durationMs` available from all integration adapters? Flag any that need instrumentation. | Integration team |
| OQ4 | Define the `redactedFields` list for PII and secrets before service implementation. | Security |
