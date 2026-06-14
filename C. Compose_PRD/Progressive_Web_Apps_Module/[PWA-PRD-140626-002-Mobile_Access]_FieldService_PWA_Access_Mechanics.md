# PRD-01: Field Service Mobile PWA — Access Mechanics

**Product:** UT Service Console — Field Service Module  
**Document Type:** Product Requirements Document  
**Version:** 1.0  
**Date:** 2026-06-13  
**Status:** Draft  
**Author:** Product Team  
**Stakeholders:** Engineering, Field Ops, UX, QA, IT Security

---

## 1. Overview

### 1.1 Background

Field service technicians operate in environments where desktop access is impractical — on job sites, inside facilities, in vehicles, and in areas with intermittent cellular connectivity. The UT Service Console's Field Service module currently exists only as a desktop-first web application, blocking technicians from doing their work digitally in the field.

This PRD defines the requirements for a **Progressive Web App (PWA)** layer on top of the existing Field Service module, focused specifically on how technicians **discover, install, authenticate, and gain access** to the application on their mobile devices.

### 1.2 Problem Statement

Technicians are unable to reliably access their Work Orders and Service Appointments from their phones because:

- The existing web application is not optimised for mobile viewports
- There is no installable app experience (no home screen icon, no splash screen)
- Login sessions expire and cannot be resumed offline
- There is no push notification channel to alert technicians of new assignments

### 1.3 Goals

| # | Goal |
|---|------|
| G1 | Allow technicians to install the Field Service PWA directly from their mobile browser with no App Store required |
| G2 | Provide a fast, app-native feel — splash screen, standalone display mode, no browser chrome |
| G3 | Authenticate users securely on mobile, with persistent session tokens that survive network loss |
| G4 | Enable push notifications for new Work Order assignments and Service Appointment updates |
| G5 | Gate access to the Field Service module only, scoping mobile permissions appropriately |

### 1.4 Non-Goals (Out of Scope for This PRD)

- Offline form submission and data sync (covered in PRD-02)
- Full desktop parity for all CRM modules on mobile
- Native iOS/Android apps
- Third-party SSO integration (deferred to v2)

---

## 2. Target Users

### 2.1 Primary Persona: Field Technician

| Attribute | Detail |
|-----------|--------|
| **Role** | Service technician in the field |
| **Device** | Personal or company-issued Android or iOS smartphone |
| **Connectivity** | Variable — strong in metro areas, weak or absent on job sites |
| **Tech literacy** | Moderate — comfortable with WhatsApp/apps but not enterprise software |
| **Pain point** | Constantly switches between phone calls, paper notes, and a desktop to get job info |
| **Success looks like** | Opens a single app, sees today's jobs, taps to start a report — no laptop needed |

### 2.2 Secondary Persona: Field Service Dispatcher

- Monitors technician assignments from desktop
- Needs assurance that technicians have received and acknowledged their appointments
- Depends on push notification read-receipts and status updates flowing back in real time

---

## 3. User Stories

| ID | As a… | I want to… | So that… | Priority |
|----|--------|-----------|----------|----------|
| US-01 | Technician | See an "Add to Home Screen" prompt when I first visit the app | I can install it without visiting an App Store | P0 |
| US-02 | Technician | Log in with my existing UT Service Console credentials | I don't need a separate account | P0 |
| US-03 | Technician | Stay logged in between sessions without re-entering my password | I can open the app quickly on a job site | P0 |
| US-04 | Technician | Receive a push notification when I'm assigned a new Work Order | I'm alerted immediately, even when the app is closed | P1 |
| US-05 | Technician | See a clear splash screen and app icon after installation | The app feels professional and is easy to find | P1 |
| US-06 | Technician | Access only the Field Service sections of the console | The UI isn't cluttered with modules not relevant to me | P1 |
| US-07 | Dispatcher | Know that a technician has opened and viewed their assignment | I can trust they've received the job details | P2 |
| US-08 | Technician | See a "You're offline" indicator but still open the app | I know my data is cached and I can still work | P0 |

---

## 4. Functional Requirements

### 4.1 PWA Manifest & Installation

#### 4.1.1 Web App Manifest

The application must serve a valid `manifest.json` at the root level, linked in the HTML `<head>`.

| Field | Value |
|-------|-------|
| `name` | `UT Field Service` |
| `short_name` | `Field Service` |
| `start_url` | `/field-service/?source=pwa` |
| `display` | `standalone` |
| `background_color` | `#1A1A1A` (dark) / `#FFFFFF` (light) |
| `theme_color` | `#F5C800` (brand gold — `--accent`) |
| `orientation` | `portrait-primary` |
| `scope` | `/field-service/` |

The `scope` field must be set to `/field-service/` to ensure deep links outside this scope open in the system browser, not the PWA shell.

#### 4.1.2 Icons

| Size | Usage |
|------|-------|
| 192×192 | Android home screen, splash |
| 512×512 | Android splash, PWA install prompt |
| 180×180 | Apple Touch Icon (iOS home screen) |
| 167×167 | iPad home screen |

All icons must use the brand gold (`#F5C800`) on a dark background (`#1A1A1A`) and display the UT logomark. Icons must be provided in PNG format. An SVG `maskable` variant must be included for Android adaptive icons.

#### 4.1.3 Install Prompt

- The `beforeinstallprompt` event must be captured and deferred
- A custom in-app install banner must be shown to users who have not yet installed and have visited the site more than once
- The banner must follow `.card` styling from the design system (see Section 9)
- iOS users (who cannot receive `beforeinstallprompt`) must be shown manual installation instructions ("Tap Share → Add to Home Screen") via a dismissible info sheet

#### 4.1.4 Splash Screen

- Android: generated automatically from manifest `background_color`, `theme_color`, icon, and `name`
- iOS: static splash images must be generated and linked for the following sizes (minimum):
  - 1125×2436 (iPhone X, XS)
  - 828×1792 (iPhone XR, 11)
  - 1242×2688 (iPhone XS Max, 11 Pro Max)
  - 1170×2532 (iPhone 12/13/14)
  - 1290×2796 (iPhone 14 Pro Max, 15)

Splash background: `#1A1A1A`. Centred logomark in `#F5C800`.

---

### 4.2 Service Worker

#### 4.2.1 Registration

- A Service Worker (`/sw.js`) must be registered on first page load
- It must operate under the `/field-service/` scope
- Registration must be deferred until after the initial page render to avoid blocking LCP

#### 4.2.2 Caching Strategy

| Resource Type | Strategy | Cache Name |
|---------------|----------|------------|
| App shell (HTML, CSS, JS bundles) | Cache First | `fs-app-shell-v{version}` |
| Inter font (Google Fonts) | Cache First | `fs-fonts-v1` |
| Lucide icons (SVG) | Cache First | `fs-icons-v1` |
| API: `/api/field-service/assignments/` | Network First, fallback to cache | `fs-api-v1` |
| API: `/api/field-service/work-orders/` | Network First, fallback to cache | `fs-api-v1` |
| Images / attachments | Stale While Revalidate | `fs-media-v1` |

Cache versioning must follow `v{semver}` naming. Old caches must be purged in the Service Worker `activate` event.

#### 4.2.3 Offline Shell

When fully offline and no cache is available, the Service Worker must serve a fallback page (`/field-service/offline.html`) that:

- Renders using brand tokens (gold on dark or white)
- Displays the connection status clearly
- Shows the last known sync timestamp
- Does not crash or show a browser error

---

### 4.3 Authentication

#### 4.3.1 Login Flow

1. Unauthenticated users land on the PWA login screen at `/field-service/login`
2. Email + password form (same credential system as desktop console)
3. On successful authentication, the server returns:
   - An **access token** (short-lived, 15 minutes, stored in memory)
   - A **refresh token** (long-lived, 30 days, stored in `httpOnly` cookie)
4. The login screen must match the existing desktop login styling, adapted to a mobile-first single-column layout

#### 4.3.2 Session Persistence

| Condition | Behaviour |
|-----------|-----------|
| App re-opened within 30 days, network available | Refresh token silently issues new access token; user goes straight to dashboard |
| App re-opened within 30 days, no network | User enters PWA in offline mode using cached data; access token validity check is skipped until reconnect |
| App re-opened after 30 days | Refresh token expired; user is redirected to login |
| User explicitly logs out | Refresh token is revoked server-side; all local cache is cleared |

#### 4.3.3 Security Requirements

- Refresh tokens must be stored in `httpOnly`, `SameSite=Strict`, `Secure` cookies — never in `localStorage`
- Access tokens must be stored in-memory only (JavaScript variable, cleared on page unload)
- Token refresh must occur silently in the background before expiry (at T-2 minutes)
- All API calls must include the `Authorization: Bearer {access_token}` header
- On 401 responses, the client must attempt one silent refresh before redirecting to login

#### 4.3.4 Mobile-Specific Login UX

- Input type `email` for the email field (triggers correct mobile keyboard)
- Input type `password` with a show/hide toggle (Lucide `Eye`/`EyeOff`)
- `autocomplete="current-password"` on the password field
- `inputmode="none"` must not be used — all form fields must trigger native keyboards
- Login button must be full-width on mobile: `w-full`, `min-h-[44px]`, `.btn-primary`

---

### 4.4 Push Notifications

#### 4.4.1 Permission Request

- Do not request push permission on first load — this degrades conversion
- Trigger the permission prompt only after the user has logged in and visited the dashboard at least once
- Present an in-app explanation before triggering the native browser permission dialog:

> **"Stay on top of your jobs"**  
> Get notified when you're assigned a new Work Order or a Service Appointment is updated. You can change this in settings.

The in-app pre-prompt must use the `.card` pattern with a primary CTA ("Turn on notifications") and a secondary CTA ("Maybe later").

#### 4.4.2 Notification Payload Schema

```json
{
  "title": "New Work Order Assigned",
  "body": "WO-2026-04812 — HVAC Inspection at Sudirman Tower, Lt 12",
  "icon": "/icons/icon-192.png",
  "badge": "/icons/badge-72.png",
  "tag": "wo-2026-04812",
  "data": {
    "type": "work_order",
    "id": "WO-2026-04812",
    "url": "/field-service/work-orders/WO-2026-04812"
  },
  "actions": [
    { "action": "view", "title": "View Details" },
    { "action": "dismiss", "title": "Dismiss" }
  ]
}
```

#### 4.4.3 Notification Types

| Trigger | Title | Priority |
|---------|-------|----------|
| New Work Order assigned | "New Work Order Assigned" | High |
| Service Appointment scheduled | "New Appointment Scheduled" | High |
| Work Order status changed by dispatcher | "Work Order Updated" | Medium |
| Appointment rescheduled | "Appointment Rescheduled" | High |
| Appointment cancelled | "Appointment Cancelled" | High |

#### 4.4.4 Click Behaviour

- Tapping a notification must open the PWA to the specific record's detail page
- If the PWA is already open, it must navigate to that URL using `clients.openWindow()` or `postMessage`
- Notifications must be dismissed from the notification tray once tapped

---

### 4.5 Mobile Navigation & Layout Scope

#### 4.5.1 Bottom Navigation Bar

The Field Service PWA must implement a fixed bottom navigation bar (replacing the desktop left sidebar) with the following tabs:

| Tab | Icon (Lucide) | Route |
|-----|--------------|-------|
| Today | `CalendarCheck` | `/field-service/today` |
| Work Orders | `ClipboardList` | `/field-service/work-orders` |
| Appointments | `CalendarClock` | `/field-service/appointments` |
| Reports | `FileText` | `/field-service/reports` |
| Profile | `UserCircle` | `/field-service/profile` |

The active tab indicator must use `--accent` (`#F5C800`) for the icon and label. Inactive tabs use `--text-muted`.

#### 4.5.2 Header

- Fixed top header, height 56px, `background-color: var(--bg-panel)`
- Left: UT logomark (24px)
- Centre: Page title, `text-sm font-semibold`, `color: var(--text-main)`
- Right: Connectivity indicator (online/offline dot) + notification bell (`Bell` icon)

#### 4.5.3 Module Scoping

The PWA must only expose the Field Service module. Navigation must not expose routes to Cases, Dashboard, or other console modules. If a technician attempts to navigate to `/dashboard` or `/cases`, they must be redirected to `/field-service/today`.

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| Largest Contentful Paint (LCP) | ≤ 2.5s on 4G |
| First Input Delay (FID) / INP | ≤ 200ms |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| Time to Interactive (TTI) | ≤ 4s on 4G |
| Lighthouse PWA score | ≥ 90 |
| App shell cache hit rate | ≥ 99% after first visit |

### 5.2 Compatibility

| Platform | Minimum Version |
|----------|----------------|
| Android Chrome | 90+ |
| Android Samsung Internet | 14+ |
| iOS Safari | 16.4+ (required for Push API support) |
| iOS Chrome | 16.4+ (WebKit-based, same as Safari) |

### 5.3 Security

- All network traffic must occur over HTTPS
- Content Security Policy (CSP) headers must be set to disallow inline scripts not from the application origin
- Service Worker scope must be restricted to `/field-service/`
- Push subscription endpoints must be stored server-side, not client-side

### 5.4 Accessibility

- All interactive elements must have `min-height: 44px` and `min-width: 44px`
- All icons must have `aria-label` or be paired with visible text labels
- Focus order must follow reading order; no focus traps
- WCAG 2.2 AA compliance required; contrast ratio ≥ 4.5:1 for all text

---

## 6. Design System Alignment

All components in the Field Service PWA must adhere to the UT Service Console Design System v1.0. Key applications:

| Component | Token / Class |
|-----------|-------------|
| Primary button (Install, Login, Enable Notifications) | `.btn-primary`, `background: var(--accent)` |
| Secondary button (Maybe Later, Cancel) | `.btn-secondary`, `background: var(--bg-light)` |
| Cards (Install banner, notification pre-prompt) | `.card`, `border: 1px solid var(--border)` |
| Input fields (Login form) | `.input-field`, focus ring `var(--accent)` |
| Offline status badge | `.badge`, custom offline/online colours |
| Bottom nav active state | `color: var(--accent)` |
| Top header background | `var(--bg-panel)` |
| Page background | `var(--bg-base)` |

Dark mode must be supported. The `ThemeContext` from the desktop console must be ported to the PWA, with the user's preference persisted to `localStorage`.

---

## 7. Analytics & Observability

| Event | Properties |
|-------|-----------|
| `pwa_install_prompt_shown` | `device_type`, `os`, `browser` |
| `pwa_install_accepted` | `device_type`, `os` |
| `pwa_install_dismissed` | — |
| `pwa_login_success` | `method: password` |
| `pwa_login_failure` | `error_code` |
| `pwa_push_permission_granted` | — |
| `pwa_push_permission_denied` | — |
| `pwa_notification_tapped` | `notification_type`, `record_id` |
| `pwa_offline_session_started` | `last_sync_at` |
| `pwa_session_restored` | `offline_duration_seconds` |

---

## 8. Dependencies

| Dependency | Purpose |
|------------|---------|
| Web Push Protocol (VAPID) | Server-sent push notifications |
| Workbox (v7+) | Service Worker generation and caching strategies |
| `manifest.json` | PWA install metadata |
| Existing auth API (`/api/auth/token/refresh/`) | Refresh token endpoint |
| Existing Field Service API | Work Order and Appointment data |
| Inter (Google Fonts) | Typography — must be cached by Service Worker |

---

## 9. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-01 | Should refresh tokens be 30 days for all technicians or configurable per-account by IT admins? | Security / IT | Sprint 2 |
| OQ-02 | Do company-issued devices have MDM policies that block PWA installation via certain browsers? | IT | Sprint 1 |
| OQ-03 | Should push notifications be enabled for iOS 16.3 and below via polling fallback? | Engineering | Sprint 2 |
| OQ-04 | Is there a backend VAPID key management service already, or does this need to be provisioned? | Backend | Sprint 1 |
| OQ-05 | Should the "Today" tab show only appointments for the logged-in technician's user ID, or also a team view? | Field Ops | Sprint 1 |

---

## 10. Success Metrics

| Metric | Baseline | Target (3 months post-launch) |
|--------|----------|-------------------------------|
| % of active field technicians using mobile PWA | 0% | ≥ 60% |
| PWA install rate (installs / first-time mobile visits) | — | ≥ 40% |
| Push notification opt-in rate | — | ≥ 55% |
| Average login time (mobile) | — | ≤ 8 seconds |
| Crash-free session rate | — | ≥ 99.5% |
| Session re-engagement via push notification | — | ≥ 25% of notified users open within 5 min |

---

## 11. Milestones

| Milestone | Description | Target Sprint |
|-----------|-------------|--------------|
| M1 | Manifest + icons + splash screens shipped | Sprint 1 |
| M2 | Service Worker with app shell caching live | Sprint 1 |
| M3 | Mobile login flow + session persistence | Sprint 2 |
| M4 | Bottom navigation + scoped Field Service layout | Sprint 2 |
| M5 | Push notification subscription + VAPID backend | Sprint 3 |
| M6 | Push notification delivery + click-through routing | Sprint 3 |
| M7 | QA pass: Lighthouse ≥ 90, WCAG AA, iOS + Android | Sprint 4 |
| M8 | Staged rollout to 10% of field technicians | Sprint 4 |

---

## 12. Appendix

### A. Lighthouse PWA Checklist

- [ ] `manifest.json` present and valid
- [ ] Service Worker registered with `fetch` handler
- [ ] Starts on HTTPS
- [ ] Redirects HTTP to HTTPS
- [ ] `<meta name="viewport">` configured
- [ ] Has a `<meta name="theme-color">`
- [ ] Provides valid Apple Touch Icon
- [ ] Splash screen configured
- [ ] Content sized correctly for viewport
- [ ] Interactive elements are keyboard accessible

### B. Relevant Design System References

- **Section 1.1** Brand Colours — `--accent: #F5C800`
- **Section 4** Buttons — `.btn-primary`, `.btn-secondary`
- **Section 5** Cards — `.card`
- **Section 6** Form Inputs — `.input-field`
- **Section 8** Light / Dark Mode — token comparison table
- **Section 11** Focus & Accessibility — `:focus-visible`, touch targets

---

*End of PRD-01*
