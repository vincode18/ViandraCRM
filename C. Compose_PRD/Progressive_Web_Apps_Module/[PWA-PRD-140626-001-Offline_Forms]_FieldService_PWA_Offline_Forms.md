# PRD-02: Field Service Mobile PWA — Offline Form Submission & Data Sync

**Product:** UT Service Console — Field Service Module  
**Document Type:** Product Requirements Document  
**Version:** 1.0  
**Date:** 2026-06-13  
**Status:** Draft  
**Author:** Product Team  
**Stakeholders:** Engineering, Field Ops, UX, QA, Backend / Data  
**Depends On:** PRD-01 (Field Service PWA Access Mechanics)

---

## 1. Overview

### 1.1 Background

Field technicians operate in locations where internet connectivity is unreliable or completely absent — underground facilities, rural areas, industrial zones, and multi-storey building interiors. The ability to fill out Work Order reports and Service Appointment completion forms is a core part of every technician's job. Today, this is done on paper or not at all until they return to a connected area.

This PRD defines the requirements for **offline form filling** within the Field Service PWA: how technicians fill out and save forms without a network connection, how those forms are queued locally, and how they are reliably uploaded to the database once connectivity is restored.

### 1.2 Problem Statement

Without offline form support, technicians face three failure modes:

1. **Data loss** — filling out a form on a poor connection that drops mid-submit results in no data saved anywhere
2. **Paper fallback** — technicians revert to paper, causing data entry delays of hours to days
3. **Blocked workflows** — dispatchers cannot see job completion status until technicians manually report in, creating cascading scheduling problems

### 1.3 Goals

| # | Goal |
|---|------|
| G1 | Allow technicians to fill out all field service forms with zero network connection |
| G2 | Store submitted forms locally in a reliable, durable queue that survives app closure |
| G3 | Automatically detect when connectivity is restored and upload queued submissions |
| G4 | Give technicians clear, real-time visibility of what has and has not been synced |
| G5 | Guarantee no data loss even if the app is closed, the phone restarts, or the upload partially fails |
| G6 | Resolve upload conflicts when the server record has changed since the offline form was cached |

### 1.4 Non-Goals

- PWA install mechanics and authentication (covered in PRD-01)
- Real-time collaborative editing of forms (not required for field use)
- Full two-way sync of all CRM modules (only Field Service forms are in scope)
- Editing or deleting records already submitted to the server

---

## 2. Target Users

### 2.1 Primary Persona: Field Technician

Same as PRD-01. The key offline-specific context:

| Attribute | Detail |
|-----------|--------|
| **Primary pain** | Loses form data mid-submit when signal drops; defaults to paper |
| **Trust requirement** | Needs to know the app has saved their work — not just a spinner |
| **Upload awareness** | Wants to know when data was sent to the server, without having to check manually |
| **Photo evidence** | Often required to attach photos of completed work — photos may also be taken offline |

### 2.2 Secondary Persona: Dispatcher / Field Supervisor

- Needs to trust that a "Completed" status on a Work Order is real and timestamped accurately
- Needs to see a queue of pending uploads so they know what data is in-flight
- Must be alerted if a technician's submission fails to sync after multiple retries

---

## 3. Forms in Scope

The following forms must be fully available and submittable offline:

| Form | Route | Record Type | Key Fields |
|------|-------|-------------|-----------|
| Work Order Completion Report | `/field-service/work-orders/:id/complete` | Work Order | Work performed, parts used, labour hours, technician notes, status, photos |
| Service Appointment Check-In | `/field-service/appointments/:id/checkin` | Service Appointment | Arrival time (auto-stamped), technician signature, customer contact name |
| Service Appointment Completion | `/field-service/appointments/:id/complete` | Service Appointment | Work summary, next steps, customer signature, photos, departure time |
| Fault / Defect Report | `/field-service/work-orders/:id/fault` | Work Order (sub-record) | Fault code, description, severity, photos, recommended action |
| Parts Usage Log | `/field-service/work-orders/:id/parts` | Work Order (sub-record) | Part number, quantity, supplier, cost |

---

## 4. User Stories

| ID | As a… | I want to… | So that… | Priority |
|----|--------|-----------|----------|----------|
| US-01 | Technician | Open and fill out a Work Order completion form with no signal | I can record my work immediately on site | P0 |
| US-02 | Technician | See that my form has been saved locally when I tap Submit | I know my data is safe even without connectivity | P0 |
| US-03 | Technician | Have my saved forms upload automatically when I get signal | I don't have to remember to manually sync | P0 |
| US-04 | Technician | See a list of forms waiting to be uploaded | I know what is still pending and what has been sent | P1 |
| US-05 | Technician | Attach photos to a form while offline | Photo evidence is part of my job requirement | P1 |
| US-06 | Technician | Have the app tell me clearly if an upload failed and why | I can take action instead of assuming everything is fine | P1 |
| US-07 | Technician | Edit a locally saved form before it uploads | I can correct a mistake without it going to the server wrong | P2 |
| US-08 | Dispatcher | See when a technician's form is "Pending Sync" vs "Submitted" | I know which data I can trust and which is in transit | P1 |
| US-09 | Technician | Have my forms survive if my phone battery dies after saving | I never lose data due to a dead battery | P0 |
| US-10 | Technician | Sign a form digitally while offline | Customer signature can be captured on-site | P2 |

---

## 5. Functional Requirements

### 5.1 Offline Data Caching (Pre-Requisite)

Before a technician can fill out a form offline, the app must have cached the relevant record data. This section defines what gets pre-cached.

#### 5.1.1 Data Pre-Fetch Strategy

When a technician opens the app with an active connection, the Service Worker must proactively cache:

- All Work Orders assigned to the logged-in technician with status `Open`, `Assigned`, or `In Progress`
- All Service Appointments scheduled for the current calendar day ± 3 days
- All associated Fault Codes (lookup list, refreshed weekly)
- All associated Parts catalogue (lookup list, refreshed weekly)
- Customer records linked to the above Work Orders and Appointments

Pre-fetch must occur:
- On app launch (if online)
- After a successful sync (to refresh stale data)
- When the app returns to foreground from background state

#### 5.1.2 Cache Storage Limits

| Data Type | Max Size | Eviction Policy |
|-----------|----------|-----------------|
| Work Order records (JSON) | 10 MB | Evict records older than 7 days and no longer in `Open`/`In Progress` |
| Appointment records (JSON) | 5 MB | Evict appointments older than 3 days past scheduled date |
| Lookup tables (fault codes, parts) | 2 MB | Replace on weekly refresh |
| Offline form queue | Unlimited (until synced) | Never evicted until successful server acknowledgement |
| Attached photos (pending sync) | 500 MB | Evict successfully synced photos after 48h |

Storage must use the browser's **Cache API** for API responses and **IndexedDB** for the offline form queue and photo blobs, to ensure persistence across browser sessions and page reloads.

---

### 5.2 Offline Form State Machine

Each offline form submission passes through the following states:

```
DRAFT → SAVED_LOCALLY → QUEUED → UPLOADING → SYNCED
                                     ↓
                                  FAILED (retryable)
                                     ↓
                              FAILED_PERMANENT (requires manual action)
```

| State | Description | User-Visible Label |
|-------|-------------|-------------------|
| `DRAFT` | Form is open and being filled — not yet submitted | — |
| `SAVED_LOCALLY` | Technician tapped Submit; stored in IndexedDB | "Saved — Waiting for connection" |
| `QUEUED` | Device is online; record is in the upload queue | "Upload pending…" |
| `UPLOADING` | Active HTTP request in progress | "Uploading…" |
| `SYNCED` | Server returned 201/200; record confirmed | "Submitted ✓" |
| `FAILED` | Upload failed; retrying (exponential backoff) | "Upload failed — Retrying" |
| `FAILED_PERMANENT` | Exceeded max retries or server returned unrecoverable error | "Upload failed — Tap to retry manually" |

Status badges for these states must follow the badge patterns in the design system:

| State | Badge Style |
|-------|------------|
| `SAVED_LOCALLY` | Warning amber — `#FFB81C` on `rgba(255,184,28,0.1)` |
| `QUEUED` | Info blue — `#4A90E2` on `rgba(74,144,226,0.1)` |
| `UPLOADING` | Info blue, animated pulse |
| `SYNCED` | Success green — `#34C759` on `rgba(52,199,89,0.1)` |
| `FAILED` | Danger red — `#C62828` on `#FFEBEE` |

---

### 5.3 Local Storage: IndexedDB Schema

The offline queue must be stored in IndexedDB under the database name `ut_field_service_offline`, version 1.

#### 5.3.1 Object Store: `offline_submissions`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID v4) | Client-generated unique ID for this submission |
| `record_type` | `string` | `work_order` \| `service_appointment` \| `fault_report` \| `parts_log` |
| `record_id` | `string` | Server-side ID of the parent record (e.g. `WO-2026-04812`) |
| `form_type` | `string` | `completion` \| `checkin` \| `fault` \| `parts` |
| `payload` | `object` | Full form data as JSON |
| `photo_ids` | `string[]` | Array of IDs referencing entries in `offline_photos` |
| `status` | `string` | One of the state machine values above |
| `created_at` | `string` (ISO 8601) | When the form was submitted by the technician |
| `last_attempt_at` | `string` \| `null` | Timestamp of last upload attempt |
| `retry_count` | `number` | Number of upload attempts so far |
| `error_message` | `string` \| `null` | Last server or network error message |
| `server_response` | `object` \| `null` | Server response body once successfully uploaded |

#### 5.3.2 Object Store: `offline_photos`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (UUID v4) | Client-generated photo ID |
| `submission_id` | `string` | Foreign key to `offline_submissions.id` |
| `blob` | `Blob` | Raw image data |
| `filename` | `string` | Original filename or generated name |
| `mime_type` | `string` | `image/jpeg` \| `image/png` \| `image/webp` |
| `size_bytes` | `number` | File size for quota management |
| `captured_at` | `string` (ISO 8601) | When the photo was taken |
| `upload_status` | `string` | `pending` \| `uploading` \| `uploaded` \| `failed` |

#### 5.3.3 Object Store: `cached_records`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Server-side record ID |
| `record_type` | `string` | `work_order` \| `service_appointment` \| `fault_code` \| `part` |
| `data` | `object` | Full record JSON from API |
| `cached_at` | `string` (ISO 8601) | When this was last fetched from server |
| `expires_at` | `string` (ISO 8601) | When this cached record should be re-fetched |

---

### 5.4 Form Submission Flow

#### 5.4.1 Online Path

```
Technician fills form
        ↓
  Tap "Submit"
        ↓
Validate form client-side
        ↓ (valid)
POST to API endpoint
        ↓ (201 OK)
Show success confirmation
Navigate to record detail
```

#### 5.4.2 Offline Path

```
Technician fills form
        ↓
  Tap "Submit"
        ↓
Validate form client-side
        ↓ (valid)
Save to IndexedDB (status: SAVED_LOCALLY)
        ↓
Show offline confirmation toast:
"Saved on your device. Will upload when you're back online."
        ↓
Navigate to record detail (shows offline badge)
        ↓
[Later: network restored]
        ↓
Background Sync triggered
        ↓
Upload queue processes items in chronological order
        ↓ (success)
Update IndexedDB record → status: SYNCED
Show push notification: "Your report for WO-2026-04812 has been uploaded."
```

#### 5.4.3 Conflict Detection

If the server record has been modified between when the technician's form was cached and when the offline submission uploads, the API must return a `409 Conflict` response with the current server state.

The client must:

1. Show the technician a conflict resolution screen side-by-side (their offline version vs current server version)
2. Allow them to choose: **Keep mine** (overwrite) or **Use server version** (discard local)
3. Never silently overwrite server data without technician acknowledgement

---

### 5.5 Background Sync

#### 5.5.1 Sync Trigger Conditions

The upload queue must be processed when any of the following occur:

| Trigger | Mechanism |
|---------|-----------|
| App comes online (from offline) | `navigator.onLine` event + `online` window event |
| App is opened while online | On app foreground / visibility change |
| Background Sync API fires | `sync` event in Service Worker (tag: `field-service-sync`) |
| Manual trigger by technician | "Sync now" button in Pending Uploads screen |

> **Background Sync API Note:** The Background Sync API is supported on Android Chrome but not on iOS Safari as of iOS 17. On iOS, the app must fall back to uploading when the app is foregrounded. A polyfill using periodic fetch is acceptable for iOS but must be documented as a known platform limitation.

#### 5.5.2 Retry Policy

| Attempt | Delay Before Retry |
|---------|-------------------|
| 1st failure | 30 seconds |
| 2nd failure | 2 minutes |
| 3rd failure | 10 minutes |
| 4th failure | 30 minutes |
| 5th+ failure | 2 hours (capped) |

After 10 failed attempts, the submission is moved to `FAILED_PERMANENT` and the technician is notified to manually retry or contact support.

#### 5.5.3 Upload Order

Submissions must be uploaded in `created_at` chronological order (oldest first) to ensure the server receives records in the correct sequence. Parallel uploads are permitted for submissions belonging to different parent records; submissions for the same parent record must be uploaded serially.

#### 5.5.4 Photo Upload

Photos must be uploaded as `multipart/form-data` separately from the JSON payload, in a two-step process:

1. Upload the form JSON → server returns a `submission_id`
2. For each photo in `offline_photos`, upload the blob referencing the `submission_id`

If step 1 succeeds but step 2 fails, the photos must retry independently without re-submitting the form JSON.

---

### 5.6 Connectivity Indicator

A persistent connectivity status indicator must be shown in the PWA header at all times.

| State | Indicator | Location |
|-------|-----------|----------|
| Online | Green dot, label "Online" | Top header, right of centre |
| Offline | Amber dot, label "Offline" | Top header, right of centre |
| Syncing | Animated spinner, label "Syncing…" | Top header, right of centre |
| Sync error | Red dot, label "Sync error" | Top header, right of centre — tappable to view details |

The indicator must use `--color-success` (green), `--color-warning` (amber), and `--color-danger` (red) from the design system semantic colour tokens.

---

### 5.7 Pending Uploads Screen

A dedicated screen accessible from the header sync icon or Profile tab:

**Route:** `/field-service/sync`

This screen must display:

1. **Pending count** — "3 reports waiting to upload"
2. **List of pending submissions**, each showing:
   - Record type and ID (e.g. "Work Order WO-2026-04812")
   - Form type (e.g. "Completion Report")
   - Saved timestamp ("Saved 14 minutes ago")
   - Current status badge (see Section 5.2)
   - Number of attached photos
3. **Manual retry** button for `FAILED_PERMANENT` items
4. **"Sync now"** button — triggers immediate upload attempt for all queued items
5. **Last synced** timestamp ("Last synced: Today at 14:32")

The list must use the `.card` pattern per the design system, with one card per pending submission.

---

### 5.8 Form UX Requirements

#### 5.8.1 Auto-Save (Draft Persistence)

- Forms must auto-save locally as `DRAFT` every 30 seconds while being filled
- Auto-save must also trigger on field blur
- If the technician navigates away from an incomplete form, a native-style bottom sheet must appear:

> **"Save draft?"**  
> "Your progress will be saved. You can come back and finish this later."
> 
> [**Save Draft**] [Discard] [Cancel]

- Saved drafts must appear as a "Continue" entry point when the technician next opens the same record

#### 5.8.2 Required Field Validation

- Required fields must be validated client-side before saving to IndexedDB
- Validation errors must be shown inline under each field using `var(--color-danger)` border + error text
- The Submit button must not be disabled while the form is incomplete — it should surface validation errors on tap rather than silently blocking the action, so technicians understand what is needed

#### 5.8.3 Timestamp Accuracy

- All form submissions must include a `device_timestamp` field capturing when the technician tapped Submit (ISO 8601, device local time with UTC offset)
- A `submitted_offline` boolean flag must be included in the payload to allow dispatchers to distinguish offline submissions from real-time ones
- The server must use `device_timestamp` as the official completion time for the record, not the server's receive time

#### 5.8.4 Signature Capture

For forms requiring technician or customer signature:

- Implement an HTML5 Canvas-based signature pad
- Signature data must be stored as a PNG blob in IndexedDB alongside the form
- On the canvas: stroke colour `#1A1A1A` on a white background; canvas size `400×160px` at `2× DPR` for sharpness
- Include a "Clear" button (`.btn-secondary`) and an "Accept Signature" button (`.btn-primary`)
- Signature canvas must be accessible: include `role="img"` and `aria-label="Signature pad — draw your signature here"`

#### 5.8.5 Photo Capture

For forms allowing photo attachments:

- Trigger the device camera using `<input type="file" accept="image/*" capture="environment">`
- Show a thumbnail preview grid after each photo is captured
- Allow up to **10 photos per form submission**
- Compress images client-side to a maximum of **1920px on the longest side**, JPEG quality 0.8, before storing in IndexedDB
- Show a total size indicator below the photo grid: "3 photos — 4.2 MB"
- Allow the technician to delete individual photos before submitting

---

### 5.9 API Contract

#### 5.9.1 Form Upload Endpoint

```
POST /api/field-service/submissions/
Content-Type: application/json
Authorization: Bearer {access_token}
```

**Request Body (Work Order Completion):**

```json
{
  "client_id": "3f8e1b2a-0c4d-4f7e-a91b-d3e6c0b2f1a9",
  "record_type": "work_order",
  "record_id": "WO-2026-04812",
  "form_type": "completion",
  "device_timestamp": "2026-06-13T09:47:32+07:00",
  "submitted_offline": true,
  "payload": {
    "status": "Completed",
    "work_performed": "Replaced HVAC compressor unit on Level 12.",
    "labour_hours": 3.5,
    "technician_notes": "Unit was heavily corroded. Recommended annual servicing.",
    "parts_used": [
      { "part_number": "COMP-4812", "quantity": 1, "unit_cost": 1850000 }
    ],
    "photo_count": 3
  }
}
```

**Success Response: 201 Created**

```json
{
  "submission_id": "srv-sub-00291",
  "record_id": "WO-2026-04812",
  "status": "received",
  "server_timestamp": "2026-06-13T10:15:09Z"
}
```

**Conflict Response: 409 Conflict**

```json
{
  "error": "conflict",
  "message": "The Work Order record was updated after your form was cached.",
  "server_version": { ... }
}
```

#### 5.9.2 Photo Upload Endpoint

```
POST /api/field-service/submissions/{submission_id}/photos/
Content-Type: multipart/form-data
Authorization: Bearer {access_token}
```

**Form Data Fields:**

| Field | Description |
|-------|-------------|
| `photo` | Binary image blob |
| `client_photo_id` | UUID from `offline_photos` store |
| `filename` | Original or generated filename |
| `captured_at` | ISO 8601 timestamp |

**Success Response: 201 Created**

```json
{
  "photo_id": "ph-00184",
  "url": "https://cdn.utserviceconsole.com/photos/ph-00184.jpg"
}
```

#### 5.9.3 Idempotency

All form upload requests must include the `client_id` field (UUID generated client-side). The server must implement idempotency based on this field: if the same `client_id` is received twice, the server must return the original success response without creating a duplicate record. This prevents duplicate submissions if the upload succeeds but the response is lost due to network interruption.

---

## 6. Conflict & Error Scenarios

| Scenario | Expected Behaviour |
|----------|--------------------|
| Form submitted offline, record deleted on server before sync | Return `404`; flag submission as `FAILED_PERMANENT`; notify technician |
| Form submitted offline, record re-assigned to another technician | Return `403`; flag submission as `FAILED_PERMANENT`; notify technician |
| Partial photo upload (some succeed, some fail) | Retry failed photos only; do not re-upload succeeded photos |
| IndexedDB quota exceeded | Alert technician; block new form saves; guide to sync or delete drafts |
| App killed mid-upload | On next open, detect `UPLOADING` state and reset to `QUEUED` for retry |
| Two technicians submit to the same record simultaneously | First write wins; second receives `409 Conflict` and must resolve |
| Phone restarted with pending queue | IndexedDB survives restart; Service Worker re-registers and resumes queue |

---

## 7. Non-Functional Requirements

### 7.1 Reliability

| Requirement | Target |
|-------------|--------|
| Zero data loss once form is in `SAVED_LOCALLY` state | 100% |
| Successful sync rate after connectivity restored | ≥ 99.5% |
| Maximum acceptable sync delay after reconnection | ≤ 30 seconds (online) / next foreground (iOS) |

### 7.2 Performance

| Metric | Target |
|--------|--------|
| Time to open a cached form in offline mode | ≤ 500ms |
| Time to save a completed form to IndexedDB | ≤ 200ms |
| Time to compress and store a 5MB photo | ≤ 2 seconds |
| Background Sync queue processing (10 forms, no photos) | ≤ 60 seconds |

### 7.3 Storage

- IndexedDB usage must be reported to the user in Profile / Settings
- Total local storage used by the PWA must not exceed 750 MB without user acknowledgement
- The app must gracefully degrade when storage is > 90% full, blocking new form saves and prompting the user to sync

### 7.4 Compatibility

| Platform | Notes |
|----------|-------|
| Android Chrome 90+ | Full Background Sync API support |
| iOS Safari 16.4+ | Background Sync not available — use foreground sync on app open |
| Offline photo capture | Both platforms: uses `<input capture="environment">` |

---

## 8. Design System Alignment

| Component | Token / Pattern |
|-----------|----------------|
| Submission status badges | Inline badge (Section 1.8 of Design System) |
| Connectivity indicator (dot + label) | `--color-success`, `--color-warning`, `--color-danger` |
| Form fields (all input types) | `.input-field`, focus ring `var(--accent)` |
| Submit / Save buttons | `.btn-primary` (full-width on mobile) |
| Cancel / Discard buttons | `.btn-secondary` |
| Draft save confirmation | Bottom sheet card, `.card` pattern |
| Pending uploads list | `.card` per item |
| Signature pad background | `#FFFFFF`, stroke `#1A1A1A` |
| Conflict resolution screen | Two-panel card layout, `.card` |
| Auto-save indicator | Small text `text-xs`, `var(--text-muted)`, bottom of form |
| Photo thumbnail grid | 3-column grid, border `1px solid var(--border)`, `rounded` |
| Error messages (field-level) | `var(--color-danger)` text, `text-xs` |

---

## 9. Analytics & Observability

| Event | Properties |
|-------|-----------|
| `form_opened_offline` | `form_type`, `record_id`, `record_type` |
| `form_saved_locally` | `form_type`, `record_id`, `photo_count`, `draft: bool` |
| `form_upload_attempted` | `form_type`, `record_id`, `retry_count`, `offline_duration_seconds` |
| `form_upload_success` | `form_type`, `record_id`, `retry_count` |
| `form_upload_failed` | `form_type`, `record_id`, `error_code`, `retry_count` |
| `form_upload_permanent_failure` | `form_type`, `record_id`, `total_attempts` |
| `conflict_detected` | `form_type`, `record_id` |
| `conflict_resolved_keep_mine` | `form_type`, `record_id` |
| `conflict_resolved_use_server` | `form_type`, `record_id` |
| `photo_attached_offline` | `submission_id`, `photo_count`, `total_size_bytes` |
| `sync_triggered` | `trigger: auto\|manual\|background`, `queue_size` |
| `indexeddb_quota_warning` | `used_bytes`, `available_bytes` |

---

## 10. Dependencies

| Dependency | Purpose |
|------------|---------|
| IndexedDB (browser native) | Durable local storage for form queue and photo blobs |
| Background Sync API (Chrome) | Automatic upload when network restores on Android |
| Cache API (Service Worker) | Caching API responses and lookup tables |
| Canvas API | Signature pad rendering |
| `<input type="file" capture>` | Camera access for photo attachment |
| Workbox (v7+) | Service Worker tooling (required by PRD-01) |
| `/api/field-service/submissions/` | New API endpoint — must be built in parallel |
| `/api/field-service/submissions/:id/photos/` | New photo upload endpoint |
| PRD-01 (PWA shell + auth) | All offline features depend on a functioning PWA shell |

---

## 11. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-01 | What is the maximum acceptable offline duration before a form submission is considered too stale to upload? (e.g. 7 days?) | Field Ops / Legal | Sprint 2 |
| OQ-02 | Does the customer signature need to be legally binding? If so, what additional metadata (e.g. IP, timestamp, geo) is required? | Legal / Compliance | Sprint 2 |
| OQ-03 | Should offline submissions from iOS (no Background Sync) show a different UX that explicitly asks technicians to open the app to sync? | UX | Sprint 3 |
| OQ-04 | Is the `/api/field-service/submissions/` endpoint a new microservice or extending the existing WO API? | Backend | Sprint 1 |
| OQ-05 | Are there any data residency requirements that affect where photo uploads are stored? (CDN vs regional storage) | Security / Infra | Sprint 1 |
| OQ-06 | Should photos be compressed on-device or should original quality be preserved for legal/audit purposes? | Field Ops / Legal | Sprint 2 |

---

## 12. Success Metrics

| Metric | Baseline | Target (3 months post-launch) |
|--------|----------|-------------------------------|
| % of field reports submitted digitally vs paper | ~30% | ≥ 85% |
| Form data loss rate (offline forms not reaching server) | Unknown | ≤ 0.1% |
| Average sync delay after reconnect | — | ≤ 30 seconds |
| % of offline submissions synced within 1 hour | — | ≥ 99% |
| Technician satisfaction score (forms UX) | — | ≥ 4.2 / 5.0 (internal survey) |
| Dispatcher trust in digital completion status | — | ≥ 90% agree "I trust the data" |

---

## 13. Milestones

| Milestone | Description | Target Sprint |
|-----------|-------------|--------------|
| M1 | IndexedDB schema implemented; form queue read/write working | Sprint 3 |
| M2 | All 5 forms in scope work in offline mode (no photos) | Sprint 3 |
| M3 | Auto-save (draft) and draft resume working | Sprint 3 |
| M4 | Background Sync on Android working end-to-end | Sprint 4 |
| M5 | Foreground sync fallback for iOS working end-to-end | Sprint 4 |
| M6 | Photo capture, compression, and upload working | Sprint 4 |
| M7 | Conflict detection and resolution screen | Sprint 5 |
| M8 | Signature capture working offline and uploading | Sprint 5 |
| M9 | Pending Uploads screen + connectivity indicator | Sprint 5 |
| M10 | End-to-end offline simulation QA pass | Sprint 6 |
| M11 | Staged rollout to 10% of field technicians | Sprint 6 |

---

## 14. Appendix

### A. Offline UX Principles for This Product

1. **Never block work** — a technician must be able to complete every form even if the app has been offline for 48 hours
2. **Be transparent, not alarming** — show sync status clearly, but don't create anxiety with aggressive error messages
3. **Recover silently** — when the upload succeeds, notify the technician once (toast + optional push notification), then get out of the way
4. **Respect the environment** — technicians may be in noisy, physically demanding situations; the UI must communicate status at a glance without reading

### B. Testing Requirements

| Test Scenario | Method |
|---------------|--------|
| Fill and submit form with Airplane Mode on | Manual QA + Cypress offline simulation |
| Restore connection mid-submit | Manual QA |
| Kill and reopen app while form is in `SAVED_LOCALLY` | Manual QA |
| 10 forms queued, all upload on reconnect | Automated integration test |
| Conflict: server record changed between cache and upload | API mock returning 409 |
| IndexedDB storage at 95% | Browser dev tools → Storage override |
| iOS: foreground sync after background | Manual QA on physical iPhone |
| Android: Background Sync fires when app is closed | Manual QA on physical Android device |

### C. Relevant Design System References

- **Section 1.5** Status Colours — Work Order and Service Appointment badges
- **Section 1.7** Semantic Colours — `--color-success`, `--color-warning`, `--color-danger`
- **Section 4** Buttons — `.btn-primary`, `.btn-secondary`
- **Section 5** Cards — `.card` for pending submissions list
- **Section 6** Form Inputs — `.input-field`, error states
- **Section 7** Badges — inline status badges for sync states
- **Section 11** Accessibility — touch targets, focus visibility

---

*End of PRD-02*
