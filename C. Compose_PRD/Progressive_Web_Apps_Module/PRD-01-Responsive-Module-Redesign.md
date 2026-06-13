# PRD-01: Responsive Module Redesign — UT Service Console

> **Document Type:** Product Requirements Document  
> **Version:** 1.0  
> **Status:** Draft  
> **Last Updated:** 2026-06-13  
> **Author:** Product Team  
> **Design System Reference:** UT Service Console Design System v1.0

---

## 1. Overview

### 1.1 Background

The UT Service Console currently renders all modules — Dashboard, Cases, Work Orders, Service Appointments, and Field Services — in a desktop-first layout. As field teams and support staff increasingly access the system from mobile devices (phones and tablets), the current interface breaks at smaller viewports: tables overflow, panels stack incorrectly, and touch targets are too small for reliable field use.

The uploaded mockup (table-to-card transformation pattern) confirms the intended design direction: **tabular data collapses into stacked information cards** at mobile breakpoints, preserving all fields while adapting to constrained screen widths.

### 1.2 Goal

Redesign every module in the UT Service Console to be **fully responsive**, supporting three canonical viewport classes, so that all user roles — admin, dispatcher, and field mechanic — can operate effectively from any device without a separate mobile application.

### 1.3 Success Metrics

| Metric | Target |
|--------|--------|
| All interactive elements pass WCAG 2.2 AA touch target (44×44px) on mobile | 100% |
| No horizontal scroll on any module at 375px viewport width | 0 overflow violations |
| Task completion rate (mobile) for core flows ≥ desktop baseline | ≥ 95% |
| Lighthouse mobile performance score | ≥ 80 |
| User-reported friction (field staff survey) | Reduce by ≥ 40% post-launch |

---

## 2. Scope

### 2.1 Modules in Scope

| Module | Desktop Status | Responsive Target |
|--------|---------------|------------------|
| Dashboard | Complete | Responsive refactor |
| Cases | Complete | Responsive refactor |
| Work Orders | Complete | Responsive refactor |
| Service Appointments | Complete | Responsive refactor |
| Field Services | Complete | Responsive refactor + mobile-first rebuild |
| Timesheet | Partial | New mobile-first build |

### 2.2 Out of Scope

- Backend API changes
- Authentication flow redesign (covered in PRD-02)
- New feature additions beyond responsive layout
- Native iOS/Android application (deferred)

---

## 3. Viewport Breakpoints

The design system must formally define three breakpoints. These align with Tailwind's default scale and should be added to `tailwind.config.js`.

| Breakpoint | Token | Min Width | Target Device |
|------------|-------|-----------|---------------|
| Mobile | `sm` | 375px | Smartphones (iPhone SE → iPhone 16 Pro Max) |
| Tablet | `md` | 768px | iPad, Android tablets |
| Desktop | `lg` | 1024px | Laptops, monitors |

> **Rule:** All layout decisions default to mobile-first. Desktop overrides are applied via `md:` and `lg:` prefixes.

---

## 4. Layout System

### 4.1 App Shell — Responsive Navigation

#### Desktop (≥ 1024px)
- Persistent left sidebar, 240px wide, collapsible to 64px icon-only rail
- Top header: 56px tall, includes breadcrumb + user menu
- Main content: fluid, `max-w-screen-2xl`, `p-6`

#### Tablet (768px–1023px)
- Sidebar collapses to **icon rail** (64px) by default
- Tap on icon expands a 240px overlay panel; backdrop dismisses it
- Top header remains, breadcrumb truncates to current module only

#### Mobile (< 768px)
- **No sidebar** — replaced by a **bottom navigation bar** (56px height)
- Bottom nav contains: Home (Dashboard), Cases, Work Orders, Field Services, Profile
- Top header simplified: module title + hamburger (opens a drawer for secondary nav)
- Main content: `px-4 py-4`, no max-width constraint

**Component:** `AppShell.jsx` — accepts `navMode: 'sidebar' | 'rail' | 'bottom'` prop driven by a `useBreakpoint()` hook.

---

### 4.2 Table → Card Transformation Pattern

This is the **core responsive pattern** for all list views. It matches the transformation shown in the uploaded reference mockup.

#### Desktop (≥ 768px)
Render data in a standard `<table>` with sortable column headers.

```
┌─────────────────────────────────────────────────────────┐
│ Full name     │ Age │ Job title          │ Favorite meal │
├─────────────────────────────────────────────────────────┤
│ Corey Ander   │ 26  │ Restaurant Manager │ Tagine        │
│ Kerry Oki     │ 42  │ Sound Engineer     │ Shepherd's pie│
└─────────────────────────────────────────────────────────┘
```

#### Mobile (< 768px)
Each table row becomes a **card** using the `.card` component from the design system. Fields are stacked as label–value pairs.

```
┌──────────────────────────┐
│  Corey Ander             │  ← Name as card title (text-lg font-semibold)
│  Age: 26                 │  ← text-sm, label bold
│  Job title: Restaurant   │
│             Manager      │
│  Favorite meal: Tagine   │
│                      [→] │  ← action chevron or CTA button
└──────────────────────────┘
```

**Token usage:**
- Card background: `var(--bg-card)`
- Card border: `1px solid var(--border)`
- Title text: `var(--text-main)`, `text-lg font-semibold`
- Label text: `var(--text-tertiary)`, `text-xs font-medium uppercase tracking-wider`
- Value text: `var(--text-secondary)`, `text-sm`
- Card padding: `p-4` (mobile) / `p-6` (desktop)
- Card gap: `gap-3` vertical spacing between cards

**Implementation approach:**

```jsx
// Responsive data list component
<DataList
  columns={columns}
  data={rows}
  mobileCardRenderer={(row) => <EntityCard {...row} />}
/>
// Internally uses: hidden md:table / block md:hidden
```

---

### 4.3 Side Panel → Bottom Sheet (Detail Views)

Detail pages (Case Detail, Work Order Detail, Service Appointment Detail) currently use a two-column layout: main content left, info panel right.

#### Desktop
```
┌────────────────────┬──────────────────┐
│  Main Content      │  Side Panel      │
│  (e.g. WO details) │  (Customer info, │
│                    │   related items) │
└────────────────────┴──────────────────┘
```

#### Mobile
The side panel transforms into a **bottom sheet** or **tabbed section below** the main content.

```
┌──────────────────────────┐
│  WO Details              │
│  (scrollable)            │
├──────────────────────────┤
│  [Details] [Customer]    │  ← Tab bar
│  [Activity] [Related]    │
├──────────────────────────┤
│  Tab content (full width)│
└──────────────────────────┘
```

---

## 5. Module-by-Module Requirements

### 5.1 Dashboard

| Element | Desktop | Mobile |
|---------|---------|--------|
| KPI tiles | 4-column grid | 2-column grid (2×2) |
| Recent Cases table | Full table | Card list |
| Chart widgets | Side-by-side | Stacked, full-width |
| Quick actions bar | Horizontal | Horizontal scroll (`overflow-x-auto`) |

**Acceptance criteria:**
- KPI tiles remain fully readable at 375px
- Charts resize using `ResponsiveContainer` from recharts (or equivalent)
- No chart overflows viewport

---

### 5.2 Cases

| Element | Desktop | Mobile |
|---------|---------|--------|
| Cases list | Sortable table with 8 columns | Cards: title, status badge, priority badge, date |
| Filter bar | Horizontal filter row | Collapsible filter drawer (triggered by Filter icon) |
| Case Detail | 2-col layout | Single column, tabbed panels |
| Status badges | Inline `.badge` | Same — badges remain unchanged |

**Mobile card structure for a Case:**
```
┌──────────────────────────────────────┐
│ [● In Progress]        [High ▲]      │  ← status + priority badges
│ Case #CS-10042                       │  ← case number, text-xs text-tertiary
│ Hydraulic pump failure on Unit 7     │  ← title, text-sm font-semibold
│ Assigned: Marco R. · 3h ago          │  ← metadata, text-xs text-muted
└──────────────────────────────────────┘
```

---

### 5.3 Work Orders

| Element | Desktop | Mobile |
|---------|---------|--------|
| WO list table | Sortable, 7 columns | Cards with WO number, status, assignee, due date |
| WO Detail | 3-section collapsible layout | All sections expanded by default, vertically stacked |
| Parts & Labor table | Full table | Compact 2-col cards (item + qty/cost) |
| Attachment upload | Drag-and-drop zone | Tap-to-upload, file picker |

---

### 5.4 Service Appointments

| Element | Desktop | Mobile |
|---------|---------|--------|
| Appointment calendar view | Full calendar grid | Day/agenda view by default |
| Appointment list | Table | Cards showing time, technician, customer, status |
| Book Appointment button | Inline ghost button | Full-width `btn-primary` above the list |
| SA Detail | 2-col | Single column, tabbed |

**Calendar view rule:** On mobile, the calendar defaults to **Agenda (list) view**. The user can switch to Day or Week view via a view toggle. Month view is hidden on mobile.

---

### 5.5 Field Services

Covered in depth in **PRD-02**. Summary requirements here:

- Field Services is the **highest-priority module** for mobile because it is the primary interface for mechanics in the field
- Must support offline-graceful behavior (data visible if cached; clear "Offline" indicator if not)
- All actions (status updates, photo uploads, timesheet entry) must be operable with one thumb

---

## 6. Component-Level Changes

### 6.1 Navigation

| Component | Change |
|-----------|--------|
| `Sidebar.jsx` | Add `mode` prop: `'full' | 'rail' | 'hidden'`; driven by breakpoint |
| `BottomNav.jsx` | New component for mobile; 5 tabs max; active tab uses `var(--accent)` |
| `TopHeader.jsx` | On mobile: show only module title + hamburger; hide breadcrumb sub-paths |

### 6.2 Tables

| Component | Change |
|-----------|--------|
| `DataTable.jsx` | Add `mobileCardRenderer` prop; wraps in `hidden md:block` for table, `block md:hidden` for cards |
| Column config | Each column definition gets a `hideMobile?: boolean` flag for columns that collapse on small screens |

### 6.3 Forms

| Component | Change |
|-----------|--------|
| All `<form>` layouts | Currently use CSS grid `grid-cols-2 md:grid-cols-3`; ensure they collapse to `grid-cols-1` on mobile |
| Date/time pickers | Use native `<input type="date">` on mobile (better UX than custom pickers on touch) |
| File uploads | Add large tap target (min 80px height) with icon + "Tap to upload" label |

### 6.4 Modals

| Context | Desktop | Mobile |
|---------|---------|--------|
| Confirmation dialogs | Centered modal, max-w-md | Same — centered, with `mx-4` side margin |
| Create/Edit forms | Centered modal, max-w-2xl | **Full-screen sheet** sliding up from bottom |
| Filter panels | Dropdown/popover | Full-screen drawer from left |

---

## 7. Design Tokens — Mobile-Specific Additions

These tokens extend the existing design system and must be added to `index.css` and `tailwind.config.js`.

```css
/* Additional spacing for mobile safe areas */
--safe-bottom: env(safe-area-inset-bottom, 0px);
--bottom-nav-height: 56px;
--mobile-header-height: 52px;

/* Mobile-specific padding to avoid overlap with bottom nav */
.main-content-mobile {
  padding-bottom: calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px);
}
```

---

## 8. Accessibility Requirements

All responsive changes must maintain or improve on existing accessibility standards.

| Requirement | Standard | Notes |
|-------------|----------|-------|
| Touch targets | WCAG 2.2 AA — 44×44px minimum | Applies to all breakpoints |
| Colour contrast | WCAG 2.2 AA — 4.5:1 text, 3:1 UI | Unchanged from design system |
| Focus management | `:focus-visible` with `var(--accent)` outline | Must be preserved in mobile views |
| Bottom nav | Each tab has `aria-label` | Active tab has `aria-current="page"` |
| Cards | Entire card is clickable; uses `role="link"` or wraps in `<a>` | Not `<div onClick>` |
| Drawer/sheet | Traps focus when open; `Escape` closes | `aria-modal="true"` |

---

## 9. Technical Implementation Notes

### 9.1 Breakpoint Hook

```javascript
// src/hooks/useBreakpoint.js
export function useBreakpoint() {
  const [bp, setBp] = useState(getBreakpoint());
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setBp(getBreakpoint());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return bp; // 'mobile' | 'tablet' | 'desktop'
}
```

### 9.2 CSS Strategy

- Use **Tailwind responsive prefixes** (`sm:`, `md:`, `lg:`) as the primary method
- Use **CSS custom properties** from the design system for all colour/token values
- Avoid `@media` queries in component files — use the hook or Tailwind classes only
- Set `viewport meta` correctly: `<meta name="viewport" content="width=device-width, initial-scale=1">`

### 9.3 Image & Asset Handling

- All icons must use `lucide-react` (already in design system) — SVG scales perfectly
- Avatar/thumbnail images: use `object-cover` + fixed aspect ratio containers

---

## 10. Rollout Plan

| Phase | Scope | Target |
|-------|-------|--------|
| Phase 1 | App shell navigation (sidebar → bottom nav) | Week 1–2 |
| Phase 2 | DataTable → Card transformation (all modules) | Week 3–4 |
| Phase 3 | Dashboard + Cases responsive | Week 5–6 |
| Phase 4 | Work Orders + Service Appointments responsive | Week 7–8 |
| Phase 5 | Field Services + Timesheet (see PRD-02) | Week 9–12 |
| Phase 6 | QA, accessibility audit, performance tuning | Week 13–14 |

---

## 11. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Should the calendar view on tablet show week or month by default? | Product | Open |
| 2 | Do we need an "install as PWA" prompt for field staff? | Engineering | Open |
| 3 | Which modules require offline data access? | Product + Engineering | Open |
| 4 | Should filter state persist across sessions on mobile? | Product | Open |

---

## 12. References

- Design System v1.0 — `DEVELOPMENT_CRM/frontend/src/index.css`
- Uploaded reference mockup: table-to-card transformation pattern
- PRD-02: Mobile Field Services & Timesheet — Mechanic User Interface
- WCAG 2.2 Success Criteria: [2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
