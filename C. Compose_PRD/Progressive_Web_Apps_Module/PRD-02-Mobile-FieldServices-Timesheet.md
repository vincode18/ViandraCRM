# PRD-02: Mobile Field Services & Timesheet — Mechanic User Interface

> **Document Type:** Product Requirements Document  
> **Version:** 1.0  
> **Status:** Draft  
> **Last Updated:** 2026-06-13  
> **Author:** Product Team  
> **Design System Reference:** UT Service Console Design System v1.0  
> **Companion:** PRD-01 — Responsive Module Redesign

---

## 1. Overview

### 1.1 Background

Mechanics are field-based users who access the UT Service Console primarily — and often exclusively — from a smartphone while on-site at a customer location. The current desktop-first layout fails this user group in critical ways:

- Work Order details require horizontal scrolling on mobile
- Timesheet entry is a multi-step desktop form that is unusable with one hand
- Photo/document attachment requires drag-and-drop, which has no mobile equivalent
- Status updates (e.g., marking a WO "In Progress" or "Completed") require navigating deeply into the UI

This PRD defines the **mobile-first design and feature requirements** for two modules used exclusively or primarily by mechanics:

1. **Field Services** — Viewing and acting on assigned Work Orders and Service Appointments
2. **Timesheet** — Logging and submitting work hours against Work Orders

### 1.2 User Persona

**Marco R. — Field Mechanic**

- Age: 34
- Device: iPhone 13 (375×812px), uses the app in sunlight outdoors
- Network: 4G LTE, occasionally drops to 3G or no signal in industrial zones
- Usage pattern: Checks assigned jobs in the morning, updates status throughout the day, logs hours at the end of the day or per job
- Pain points: Logging hours takes too long, can't find the right WO fast, form submissions fail without warning when offline

### 1.3 Goal

Deliver a **purpose-built mobile experience** for the mechanic role within the UT Service Console (as a responsive PWA — no separate app required) that makes the most common field workflows achievable in under 30 seconds each.

### 1.4 Core Field Workflows

| # | Workflow | Frequency | Target Time |
|---|----------|-----------|-------------|
| 1 | View today's assigned jobs | Daily, morning | < 10 seconds |
| 2 | Mark a Work Order as "In Progress" | Per job start | < 15 seconds |
| 3 | Log work hours against a WO | End of day / per job | < 30 seconds |
| 4 | Upload a photo to a WO | As needed | < 20 seconds |
| 5 | Mark a WO as "Completed" + add note | Per job completion | < 45 seconds |
| 6 | View Service Appointment details + navigate to location | Per appointment | < 15 seconds |

### 1.5 Success Metrics

| Metric | Target |
|--------|--------|
| Workflow #3 (log hours) completion time on mobile | ≤ 30 seconds |
| Mechanic daily active usage on mobile | ≥ 80% of field staff |
| Timesheet submission errors (offline-related) | Reduce by ≥ 90% vs. current |
| App crash / blank screen on poor network | 0 critical failures |
| Lighthouse PWA score | ≥ 80 |

---

## 2. Mechanic Login & Role-Based Entry

### 2.1 Login Screen

The login screen for mobile must be optimised for one-handed use in field conditions.

**Layout:**
```
┌────────────────────────────┐
│                            │
│       [UT Logo]            │
│                            │
│   Service Console          │  ← text-2xl font-bold, var(--text-main)
│                            │
│  ┌──────────────────────┐  │
│  │ Email / Employee ID  │  │  ← .input-field, min-h-[44px]
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ Password          👁 │  │  ← .input-field, password toggle
│  └──────────────────────┘  │
│                            │
│  [        Log In        ]  │  ← .btn-primary, full-width
│                            │
│  Forgot password?          │  ← text-sm, var(--color-info)
│                            │
└────────────────────────────┘
```

**Specifications:**
- Input fields: full-width, `min-h-[44px]`, `.input-field` class from design system
- Login button: full-width `btn-primary`, `min-h-[44px]`
- Logo: SVG, max-height 48px
- Background: `var(--bg-base)`
- On error: apply `jiggle` animation (400ms, design system) to the form; show inline error below the field in `var(--color-danger)`
- Biometric login (Face ID / Touch ID): show a biometric prompt on subsequent logins if the browser supports WebAuthn

### 2.2 Role-Based Redirect

After successful authentication:
- **Mechanic role:** Redirect to **Field Services → My Jobs** (not the general Dashboard)
- **Other roles:** Redirect to Dashboard (existing behavior)

The role-based redirect is determined by the user's `role` field in the auth response.

### 2.3 Session Persistence

- Session token stored in `localStorage` (encrypted via Web Crypto API)
- Auto-logout after 12 hours of inactivity
- On mobile, offer "Remember me" toggle to extend session to 30 days

---

## 3. Field Services Module — Mobile Layout

### 3.1 Navigation Structure for Mechanics

On mobile, mechanics see a simplified bottom navigation (4 tabs only):

```
┌──────────────────────────────────────┐
│  [My Jobs] [Appointments] [Timesheet] [Profile] │
└──────────────────────────────────────┘
```

| Tab | Icon | Destination |
|-----|------|-------------|
| My Jobs | `Wrench` (lucide) | Field Services → Assigned Work Orders |
| Appointments | `CalendarClock` | Service Appointments → My Appointments |
| Timesheet | `Clock` | Timesheet → My Hours |
| Profile | `CircleUser` | User profile + settings |

Active tab indicator: `var(--accent)` (#F5C800) for icon + label. Inactive: `var(--text-muted)`.

---

### 3.2 My Jobs Screen

The entry screen for mechanics. Shows all Work Orders assigned to the logged-in mechanic.

#### 3.2.1 Layout

```
┌──────────────────────────────────────┐
│  My Jobs            [Filter] [Search]│  ← header
├──────────────────────────────────────┤
│  Today — 3 jobs                      │  ← section header, text-xs uppercase
│                                      │
│ ┌────────────────────────────────┐   │
│ │ [In Progress]    WO-10042      │   │
│ │ Hydraulic pump — Unit 7        │   │
│ │ 📍 Site A, Building 3          │   │
│ │ ⏱ Due 2:00 PM                  │   │
│ │                    [Update]    │   │
│ └────────────────────────────────┘   │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ [Scheduled]      WO-10051      │   │
│ │ Compressor service — Unit 12   │   │
│ │ 📍 Site B, Lot 4               │   │
│ │ ⏱ Due 4:30 PM                  │   │
│ │                    [Start]     │   │
│ └────────────────────────────────┘   │
│                                      │
│  This Week — 2 more                  │
│  ───────────────────────────────     │
│  [WO card]                           │
│  [WO card]                           │
└──────────────────────────────────────┘
```

#### 3.2.2 Job Card Specifications

| Element | Token / Style |
|---------|--------------|
| Card background | `var(--bg-card)` |
| Card border | `1px solid var(--border)` |
| Card padding | `p-4` |
| Card gap | `gap-3` (between cards) |
| Status badge | Inline badge per §1.8 of Design System |
| WO number | `text-xs font-mono`, `var(--text-tertiary)` |
| Job title | `text-sm font-semibold`, `var(--text-main)` |
| Location | `text-xs`, `var(--text-tertiary)`, prefixed with `MapPin` icon |
| Due time | `text-xs`, overdue shows `var(--color-danger)` |
| CTA button | `btn-primary` compact (`px-3 py-1.5 text-xs`) |

**CTA button label by status:**

| WO Status | Button Label |
|-----------|-------------|
| Scheduled / Open | **Start Job** |
| In Progress | **Update** |
| On Hold | **Resume** |
| Completed | **View** (read-only) |

#### 3.2.3 Filter / Search

- Search bar: sticky below header, full-width, `.input-field`
- Filter drawer: slides in from bottom; filter options: Status, Priority, Due Date range
- Active filters shown as dismissible chips below the search bar

---

### 3.3 Work Order Detail — Mobile View

Opened when a mechanic taps a job card. Designed for one-handed use with key actions always visible.

#### 3.3.1 Header Zone (sticky)

```
┌──────────────────────────────────────┐
│ ← Back    WO-10042    [In Progress ▼]│
└──────────────────────────────────────┘
```

- Status is a **tappable dropdown** directly in the header — the most common action is just changing status
- Status change confirms with a bottom sheet confirmation (not a modal) to avoid accidental taps

#### 3.3.2 Status Change Bottom Sheet

```
┌──────────────────────────────────────┐
│  ────                                │  ← drag handle
│  Update Status                       │
│                                      │
│  ○ Open                              │
│  ● In Progress  ✓                    │
│  ○ On Hold                           │
│  ○ Completed                         │
│  ○ Cancelled                         │
│                                      │
│  [      Confirm Change       ]       │  ← .btn-primary full-width
│  [          Cancel           ]       │  ← .btn-secondary full-width
└──────────────────────────────────────┘
```

#### 3.3.3 Detail Body (scrollable)

Content is sectioned using the collapsible section card pattern from the design system, but **all sections are expanded by default on mobile** (mechanic needs info fast, not hidden behind taps).

**Sections:**
1. **Job Info** — Description, priority badge, WO type, created date
2. **Location** — Site name, address, `[Open in Maps]` button (deeplinks to native maps)
3. **Customer** — Customer name, contact number (`[Call]` button), equipment ID
4. **Parts & Materials** — Compact table: part name, qty, status
5. **Attachments** — Photo thumbnails in 3-column grid; `[+ Add Photo]` prominent CTA
6. **Notes / Activity** — Timeline of activity; `[+ Add Note]` at bottom

#### 3.3.4 Floating Action Bar

A persistent bar at the bottom of the WO Detail screen (above bottom nav):

```
┌────────────────────────────────────────┐
│  [📷 Photo]  [📝 Note]  [⏱ Log Hours] │
└────────────────────────────────────────┘
```

| Action | Icon | Behaviour |
|--------|------|-----------|
| Photo | `Camera` | Opens device camera or photo picker |
| Note | `FileText` | Opens bottom sheet with textarea |
| Log Hours | `Clock` | Opens Timesheet quick-entry (see §4) |

Background: `var(--bg-panel)`, `border-top: 1px solid var(--border)`, `padding: 12px 16px`, safe-area inset bottom.

---

### 3.4 Service Appointments — Mobile View

#### 3.4.1 My Appointments List

Same card-based pattern as My Jobs. Card shows:
- Appointment number (mono font)
- Customer name + address
- Date and time (prominent, `text-base font-semibold`)
- Assigned Work Order number (if linked)
- Status badge

#### 3.4.2 Appointment Detail

```
┌──────────────────────────────────────┐
│ ← Back    SA-2042                    │
├──────────────────────────────────────┤
│  [Confirmed]                         │
│  Hydraulic Inspection                │
│  Monday 16 Jun · 10:00–11:30 AM      │
│                                      │
│  📍 Site A, Building 3               │
│  [  Navigate to Location  ]          │  ← .btn-primary, full-width
│                                      │
│  Customer: Apex Manufacturing        │
│  Contact: +1 (555) 820-4400          │
│  [  Call Customer  ]                 │  ← .btn-secondary, full-width
│                                      │
│  Linked WO: WO-10042                 │
│  [  Open Work Order  ]               │  ← text link, var(--color-info)
└──────────────────────────────────────┘
```

---

## 4. Timesheet Module — Mobile-First Design

### 4.1 Overview

The Timesheet module allows mechanics to log hours worked against Work Orders. On mobile, it must support:

- Quick log from WO Detail (via floating action bar)
- Standalone timesheet view to see all logged hours
- Week summary and submission

### 4.2 Quick Log Entry (from WO Detail)

Triggered from the `[⏱ Log Hours]` button in the WO Detail floating action bar. Opens as a **bottom sheet** that partially covers the WO Detail.

```
┌──────────────────────────────────────┐
│  ────                                │  ← drag handle
│  Log Hours — WO-10042                │
│                                      │
│  Date                                │
│  ┌────────────────────────────────┐  │
│  │ Mon, 16 Jun 2026             ▼ │  │  ← native date picker
│  └────────────────────────────────┘  │
│                                      │
│  Hours Worked                        │
│  ┌──────────┐  ┌──────────┐          │
│  │    8     │  :  │   00   │          │  ← HH:MM spinner or +/- stepper
│  └──────────┘     └──────────┘        │
│                                      │
│  Work Type                           │
│  ┌────────────────────────────────┐  │
│  │ Regular                      ▼ │  │  ← select: Regular, Overtime, Travel
│  └────────────────────────────────┘  │
│                                      │
│  Note (optional)                     │
│  ┌────────────────────────────────┐  │
│  │                                │  │  ← textarea, 2 rows
│  └────────────────────────────────┘  │
│                                      │
│  [        Save Hours         ]       │  ← .btn-primary full-width
│  [          Cancel           ]       │  ← .btn-secondary full-width
└──────────────────────────────────────┘
```

**Specifications:**

| Field | Component | Validation |
|-------|-----------|------------|
| Date | Native `<input type="date">` | Required; defaults to today |
| Hours | Numeric input or `+`/`-` stepper | 0.25–24 range; 0.25 increments |
| Work Type | Native `<select>` with `.input-field` class | Required |
| Note | `<textarea>` 2 rows | Optional, max 500 chars |

**Save behaviour:**
- On success: sheet closes, brief toast appears: `"Hours logged for WO-10042"` (2 seconds)
- On offline: hours saved to local queue; toast: `"Saved offline — will sync when connected"` using `var(--color-warning)` background
- On error: inline error, sheet stays open

---

### 4.3 Timesheet Screen (Standalone)

Accessed via the `Timesheet` tab in bottom navigation.

#### 4.3.1 Week View Layout

```
┌──────────────────────────────────────┐
│  Timesheet                [Submit ↑] │  ← header; Submit button disabled if not ready
├──────────────────────────────────────┤
│  ◀  Week of Jun 9–15, 2026  ▶        │  ← week navigator
│                                      │
│  Total: 38.5 hrs    Approved: 32 hrs │  ← summary row
├──────────────────────────────────────┤
│  Mon 9 Jun            8.0 hrs  [+]   │  ← day row, expandable
│  ├ WO-10038 · Regular · 6.0h         │
│  └ WO-10041 · Travel  · 2.0h         │
│                                      │
│  Tue 10 Jun           7.5 hrs  [+]   │
│  ├ WO-10042 · Regular · 7.5h         │
│                                      │
│  Wed 11 Jun           8.0 hrs  [+]   │
│  ...                                 │
│                                      │
│  Thu 12 Jun           0.0 hrs  [+]   │  ← 0 hrs shows in var(--text-muted)
│                                      │
│  Fri 13 Jun           8.0 hrs  [+]   │
│                                      │
│  Sat / Sun            —              │  ← collapsed by default, expandable
├──────────────────────────────────────┤
│  [  + Add Entry  ]                   │  ← .btn-secondary, full-width
└──────────────────────────────────────┘
```

#### 4.3.2 Day Row Specifications

| Element | Style |
|---------|-------|
| Day label | `text-sm font-semibold`, `var(--text-main)` |
| Total hours | `text-sm font-semibold`, right-aligned |
| `[+]` add button | Icon-only button, `var(--accent)`, `p-1.5` |
| Entry rows (expanded) | Indented `pl-4`, `text-xs`, `var(--text-tertiary)` |
| WO link | Tappable, `var(--color-info)` |
| Zero hours | `var(--text-muted)`, `text-sm` |

#### 4.3.3 Entry Row Actions

Long-press (or swipe-left) on an entry row reveals:
- **Edit** (pencil icon, `var(--color-info)`)
- **Delete** (trash icon, `var(--color-danger)`) — requires confirmation

#### 4.3.4 Add Entry Flow

Tapping `[+ Add Entry]` opens the same **Quick Log bottom sheet** (§4.2) but with a WO selector field added at the top (since we're not coming from a specific WO).

```
│  Work Order                          │
│  ┌────────────────────────────────┐  │
│  │ Search or select WO...       ▼ │  │  ← searchable dropdown
│  └────────────────────────────────┘  │
```

The WO dropdown shows only WOs assigned to the mechanic, sorted by most recent activity.

---

### 4.4 Timesheet Submission

#### 4.4.1 Submit Flow

Tapping `[Submit ↑]` in the header opens a confirmation bottom sheet:

```
┌──────────────────────────────────────┐
│  ────                                │
│  Submit Timesheet?                   │
│                                      │
│  Week of Jun 9–15, 2026              │
│  Total: 38.5 hours                   │
│  Entries: 12                         │
│                                      │
│  ⚠️ Once submitted, entries cannot   │
│  be edited without supervisor        │
│  approval.                           │
│                                      │
│  [  Confirm Submission  ]            │  ← .btn-primary full-width
│  [       Cancel         ]            │  ← .btn-secondary full-width
└──────────────────────────────────────┘
```

**Validation before submission:**
- All days Monday–Friday must have ≥ 1 entry (warning, not a block — some days may be leave)
- No single entry may exceed 24 hours (hard block)
- Week total may not exceed 80 hours (soft warning, requires confirmation to override)

#### 4.4.2 Submission States

| State | UI Treatment |
|-------|-------------|
| Draft | `[Submit ↑]` button active, entries editable |
| Submitted (pending approval) | Button changes to `[Submitted ✓]`, entries read-only, badge shown |
| Approved | Green `[Approved ✓]` badge, entries read-only |
| Rejected | Red banner: "Rejected — see supervisor comments", entries re-editable |

---

## 5. Offline Support

### 5.1 Requirements

Field mechanics regularly work in areas with poor connectivity. The module must degrade gracefully.

| Feature | Online | Offline |
|---------|--------|---------|
| View assigned WOs | Live data | Cached data (last sync) |
| View WO details | Live data | Cached data |
| Update WO status | Immediate sync | Queued; syncs on reconnect |
| Log timesheet hours | Immediate sync | Queued; syncs on reconnect |
| Upload photos | Immediate upload | Queued; uploads on reconnect |
| View SA details | Live data | Cached data |

### 5.2 Offline Indicator

A persistent banner appears at the top of the screen when offline:

```
┌────────────────────────────────────────────┐
│ 📵  No connection — showing cached data    │
└────────────────────────────────────────────┘
```

Style: `background: var(--color-warning)` at 15% opacity, `var(--color-warning)` left border 4px, `text-sm`, full-width.

### 5.3 Sync Queue

When connectivity is restored:
- Background sync processes the queue silently
- On completion: toast `"X changes synced successfully"` using `var(--color-success)` styling
- On sync failure: persistent notification with `[Retry]` option

### 5.4 Implementation Approach

- Use **Service Worker** with Workbox for asset caching and background sync
- Cache strategy: Network-first for API calls, stale-while-revalidate for static assets
- Store offline queue in **IndexedDB** (not localStorage — larger capacity needed for photo blobs)
- Sync trigger: `navigator.connection` change event + `BackgroundSyncManager` where supported

---

## 6. Photo Upload

### 6.1 Mobile Photo Flow

```
Tap [📷 Photo] 
  → Action sheet: "Take Photo" / "Choose from Library" / "Cancel"
  → Device camera OR photo picker opens
  → Photo selected
  → Thumbnail preview + optional caption input
  → [Upload] button
  → Progress indicator (linear bar, var(--accent))
  → On success: thumbnail appears in WO Attachments section
```

### 6.2 Specifications

| Property | Value |
|----------|-------|
| Max file size | 20MB per image |
| Accepted formats | JPEG, PNG, HEIC (auto-converted to JPEG on upload) |
| Compression | Client-side resize to max 2000px on longest side before upload |
| Multiple photos | Support up to 10 in one upload session |
| Offline queue | Photos stored as blobs in IndexedDB, uploaded when online |

---

## 7. Notifications (Push)

Mechanics should receive push notifications for:

| Event | Message |
|-------|---------|
| New WO assigned | "You've been assigned WO-10065: [title]" |
| SA reminder | "Appointment in 1 hour: [SA title] at [location]" |
| Timesheet due | "Reminder: Submit your timesheet for this week" |
| WO update from dispatcher | "[Name] updated WO-10042: [brief change summary]" |

- Notifications use browser Push API (Web Push)
- Permission requested after second login (not on first visit)
- Mechanic can manage notification preferences in Profile tab

---

## 8. Accessibility — Mobile-Specific

| Requirement | Detail |
|-------------|--------|
| Font size | Minimum 14px (`text-sm`) for all body content; no fixed-size px on text |
| Tap targets | All interactive elements: `min-height: 44px`, `min-width: 44px` |
| Bottom sheet | Announce with `role="dialog"`, `aria-modal="true"`, focus trapped |
| Status changes | Announce via `aria-live="polite"` region on status update |
| Colour + icon | Never use colour alone to communicate state — always pair with text or icon |
| Reduced motion | All animations respect `prefers-reduced-motion: reduce` |
| Dark mode | All screens support dark mode via design system tokens |

---

## 9. Design Tokens — Mechanic Mobile Additions

These supplement the shared design system (§7 of PRD-01) with module-specific values.

```css
/* Timesheet-specific */
--ts-approved: #388E3C;          /* = var(--color-success) */
--ts-submitted: #1976D2;         /* = var(--color-info) */
--ts-rejected: #C62828;          /* = var(--color-danger) */
--ts-draft: var(--text-muted);

/* Floating action bar */
--fab-height: 60px;
--fab-bg: var(--bg-panel);

/* Offline banner */
--offline-banner-bg: rgba(245, 124, 0, 0.1);  /* warning at 10% */
--offline-banner-border: var(--color-warning);
```

---

## 10. Screen Inventory

| Screen | Route | Entry Point |
|--------|-------|-------------|
| Login (mobile) | `/login` | Direct URL / PWA launch |
| My Jobs | `/field/jobs` | Bottom nav: My Jobs |
| WO Detail (mobile) | `/field/jobs/:id` | Job card tap |
| My Appointments | `/field/appointments` | Bottom nav: Appointments |
| SA Detail (mobile) | `/field/appointments/:id` | Appointment card tap |
| Timesheet | `/timesheet` | Bottom nav: Timesheet |
| Timesheet Week Detail | `/timesheet/:week` | Week navigator |
| Quick Log (bottom sheet) | — (overlay) | `[⏱ Log Hours]` button |
| Profile | `/profile` | Bottom nav: Profile |

---

## 11. Technical Stack

| Concern | Solution |
|---------|----------|
| Offline caching | Workbox (Service Worker) |
| Offline data store | IndexedDB via `idb` library |
| Push notifications | Web Push API + backend push service |
| Camera/gallery access | `<input type="file" accept="image/*" capture="environment">` |
| Biometric auth | WebAuthn API (`navigator.credentials`) |
| Location (maps deeplink) | `geo:` URI / Apple Maps / Google Maps deeplink |
| State management | Existing app state (Context or Redux) — no new library |
| PWA manifest | `manifest.json` with `display: standalone`, icons, theme colour `#F5C800` |

---

## 12. Rollout Plan

| Phase | Deliverable | Target |
|-------|-------------|--------|
| Phase 1 | Login screen mobile optimisation + role redirect | Week 9 |
| Phase 2 | My Jobs screen + WO Detail mobile layout | Week 10 |
| Phase 3 | Floating action bar + status change bottom sheet | Week 10 |
| Phase 4 | Quick Log entry (bottom sheet) | Week 11 |
| Phase 5 | Timesheet screen (week view + add/edit/delete) | Week 11–12 |
| Phase 6 | Submission flow + validation | Week 12 |
| Phase 7 | Offline support (Service Worker + IndexedDB queue) | Week 13 |
| Phase 8 | Photo upload + push notifications | Week 13–14 |
| Phase 9 | QA, field testing with mechanic group, accessibility audit | Week 14–15 |

---

## 13. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Should mechanics be able to create new WOs from mobile, or only update existing ones? | Product | Open |
| 2 | What is the timesheet approval flow — who approves, and is that UI in scope? | Product | Open |
| 3 | Do we need geofencing (auto-start job when mechanic arrives on-site)? | Product | Deferred |
| 4 | HEIC-to-JPEG conversion: client-side (Canvas API) or server-side? | Engineering | Open |
| 5 | Maximum offline queue duration before alerting the mechanic to sync? | Product | Open |
| 6 | Should the mechanic see other team members' WOs for coordination? | Product | Open |

---

## 14. References

- Design System v1.0 — `DEVELOPMENT_CRM/frontend/src/index.css`
- PRD-01: Responsive Module Redesign
- WCAG 2.2 — [2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Workbox documentation: https://developer.chrome.com/docs/workbox
- Web Push API: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- PWA best practices: https://web.dev/progressive-web-apps
