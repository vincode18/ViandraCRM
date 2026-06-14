# PRD-SM-003 · Shift Management — Grid & Interaction Enhancements
## Enhancement PRD

> **Status:** Draft  
> **Version:** 1.0  
> **Date:** 2026-06-07  
> **Module:** Shift Management (Field Service)  
> **Depends on:** PRD-SM-001, PRD-SM-002  
> **Priority:** High  
> **Effort Estimate:** L (8–13 days front-end)

---

## 1. Background & Problem Statement

Following the delivery of the Weekly Calendar View (PRD-SM-001/002), five UX gaps have been identified from the live preview and stakeholder walkthroughs:

| # | Pain Point | Observed in Screenshot |
|---|-----------|----------------------|
| P1 | **Sidebar steals calendar width** — when the left sidebar is open, the Gantt/weekly grid is compressed and day columns become unreadably narrow. | Image 1: red box on left sidebar shows wasted space |
| P2 | **Shift detail appears at the bottom** — clicking a shift card opens a detail panel below the grid, requiring the user to scroll down and losing context of which shift they clicked. | Image 2 & 3: SHIFT DETAILS panel renders beneath the grid |
| P3 | **3-Day tab is not interactive** — the tab exists but always defaults to a fixed 3-day window; users cannot select which 3-day range they want to view. | Image 1: red box on "3-Day" tab |
| P4 | **Date navigator has no calendar picker** — the `‹ Jun 1 – Jun 7, 2026 ›` date range label is not clickable; users cannot jump to an arbitrary week or date without repeatedly clicking the prev/next arrows. | Image 1: red box on right side near stats/header |
| P5 | **Edit button is absent or non-functional** — the Shift Detail panel shows shift information but there is no working Edit action. | Image 2 & 3: SHIFT DETAILS panel has no edit CTA |

---

## 2. Goals

| # | Goal | Success Metric |
|---|------|---------------|
| G1 | Maximise calendar grid horizontal space | Grid uses ≥ 95% of available width when sidebar is collapsed |
| G2 | Contextual shift detail panel | Detail opens on the right side without leaving the calendar view |
| G3 | Flexible 3-day range selection | User can pick any start date for the 3-day window |
| G4 | Fast date jump | User reaches any week in < 3 clicks |
| G5 | Functional edit flow | Edit button in detail panel opens editable form |

---

## 3. Non-Goals

- Full calendar drag-and-drop (deferred to PRD-SM-004)
- Mobile/responsive redesign (tracked separately)
- New Shift form redesign
- Any backend / API changes

---

## 4. Enhancement Specifications

---

### 4.1 Enhancement 1 — Full-Width Calendar Grid (Sidebar Collapse)

#### 4.1.1 Description

When the global left navigation sidebar is **collapsed**, the Shift Management calendar grid must expand to fill the full available width minus a **15px gutter** from the sidebar rail.

When the sidebar is **expanded** (full width ~180px), the grid adjusts normally. The 15px gutter applies only to the collapsed state to give the calendar maximum breathing room.

#### 4.1.2 Behaviour Rules

| State | Sidebar Width | Grid Left Offset | Gutter |
|-------|--------------|-----------------|--------|
| Sidebar **expanded** | `180px` | `180px` | Standard layout gap |
| Sidebar **collapsed** (icon-only rail) | `48px` | `48px + 15px = 63px` | 15px from rail edge |
| Sidebar **hidden** (full screen mode) | `0px` | `15px` | 15px from viewport edge |

#### 4.1.3 Implementation Notes

- Use a CSS custom property `--sidebar-width` managed by the `ThemeContext` / `SidebarContext` that updates on toggle.
- The calendar container must respond to this variable:
  ```css
  .shift-calendar-container {
    margin-left: calc(var(--sidebar-width, 180px) + 15px);
    transition: margin-left 0.25s ease;
  }
  ```
  > **Note:** If `AppLayout` already handles content offset, use `padding-left` adjustments on the main content pane instead of per-module `margin-left`.
- The transition duration must match the sidebar slide animation (`250ms ease-out` per Design System §10 `slideIn`).
- **Day column minimum width** must remain `140px`; if the grid overflows, enable horizontal scroll on the grid container.

#### 4.1.4 Visual Spec

| Property | Value |
|----------|-------|
| Gutter between collapsed rail and grid | `15px` |
| Transition | `margin-left / width 250ms ease` |
| Grid background | `var(--bg-base)` — no visible gap artefact |
| Rail bg (collapsed) | `var(--bg-panel)` — unchanged |

---

### 4.2 Enhancement 2 — Right-Side Shift Detail Panel

#### 4.2.1 Description

When a shift card is clicked, the **Shift Detail** panel must open as a **fixed right-side drawer** overlaid on top of the calendar grid — never below it. The grid does NOT reflow; the drawer overlaps.

#### 4.2.2 Layout

```
┌────────────────────────────────────────────┬─────────────────┐
│                                            │  SHIFT DETAILS  │
│         Calendar Grid (full width)         │  SFT-W004       │
│         (no reflow, no push)               │  [shift card]   │
│                                            │  SHIFT INFO     │
│                                            │  Start  14:00   │
│                                            │  End    22:00   │
│                                            │  …              │
│                                            │  [Edit Shift]   │
│                                            │  [Close]        │
└────────────────────────────────────────────┴─────────────────┘
```

#### 4.2.3 Panel Dimensions & Position

| Property | Value |
|----------|-------|
| Position | `fixed`, `top: 0`, `right: 0`, `height: 100vh` |
| Width | `320px` (desktop); `280px` (viewport < 1024px) |
| Z-index | `500` (above grid, below modal overlays at `1000`) |
| Background | `var(--bg-card)` |
| Left border | `1px solid var(--border)` |
| Box shadow | `−4px 0 24px rgba(0, 0, 0, 0.10)` |
| Animation (open) | `slideInRight 250ms ease-out` |
| Animation (close) | `slideOutRight 200ms ease-in` (reverse) |
| Top padding | `pt-4` (16px) — clears the global top nav bar |

#### 4.2.4 Panel Anatomy

```
┌─────────────────────────────────────────┐
│  SHIFT DETAILS              [×]          │  ← Section A: Header
├─────────────────────────────────────────┤
│  SFT-W004    [Tentative badge]           │  ← Section B: Shift ID + Status
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 14:00 – 22:00                   │    │  ← Section C: Shift Type Card
│  │ Emergency Standby               │    │     (coloured left border + bg tint)
│  └─────────────────────────────────┘    │
│                                         │
│  SHIFT INFORMATION                      │  ← Section D: Info rows
│  Start Time           14:00             │
│  End Time             22:00             │
│  Date                 2026-06-05        │
│  Resource             Sarah Jenkins     │
│  Role                 Field · Diagnostics│
│  Status               Tentative         │
│  Shift Type           Emergency Standby │
├─────────────────────────────────────────┤
│  [Edit Shift]      [Delete]             │  ← Section E: Action Buttons
└─────────────────────────────────────────┘
```

#### 4.2.5 Section A — Header

| Element | Spec |
|---------|------|
| Label "SHIFT DETAILS" | `text-[10px] font-bold uppercase tracking-widest`, `var(--text-muted)` |
| Close button `[×]` | `w-7 h-7`, `rounded`, `var(--bg-light)` bg, `var(--border)` border, `var(--text-tertiary)` icon |
| Close button position | `absolute top-4 right-4` |
| Header padding | `px-4 pt-4 pb-3` |
| Bottom border | `1px solid var(--border)` |

#### 4.2.6 Section B — Shift ID + Status Badge

| Element | Spec |
|---------|------|
| Shift ID | `text-base font-bold`, `var(--text-main)` |
| Status badge (Tentative) | `text-[10px] font-semibold`, `var(--bg-lighter)` bg, `var(--text-muted)` text, `rounded px-2 py-0.5` |
| Status badge (Confirmed) | Not shown (or "Confirmed" in green badge) |
| Padding | `px-4 py-3` |

#### 4.2.7 Section C — Shift Type Card

Mirrors the shift card design from PRD-SM-002 §5 but full-width within the panel:

| Property | Value |
|----------|-------|
| Border-left | `3px solid {typeColor}` |
| Background | `{typeBg}` from shift type colour map |
| Border radius | `rounded` (4px) |
| Padding | `px-3 py-2.5` |
| Margin | `mx-4 my-0` |
| Time font | `text-sm font-semibold`, `{typeColor}` |
| Type label | `text-xs font-semibold`, `{typeColor}` |

#### 4.2.8 Section D — Shift Information

Label-value rows separated by `border-bottom: 1px solid var(--border)`:

| Property | Value |
|----------|-------|
| Section header "SHIFT INFORMATION" | `text-[10px] font-bold uppercase tracking-widest`, `var(--text-muted)`, `px-4 pt-4 pb-2` |
| Row padding | `px-4 py-2` |
| Label | `text-xs font-medium`, `var(--text-tertiary)` |
| Value | `text-xs font-medium`, `var(--text-secondary)` |
| Row layout | `flex justify-between items-center` |
| Divider | `1px solid var(--border)` between rows |

Rows displayed (in order):
1. Start Time
2. End Time
3. Date
4. Resource
5. Role
6. Status
7. Shift Type

#### 4.2.9 Section E — Action Buttons

| Button | Style | Spec |
|--------|-------|------|
| **Edit Shift** | `.btn-primary` | `background: var(--accent)`, `color: var(--text-main)`, `flex-1`, `min-h-[44px]`, `text-sm font-semibold` |
| **Delete** | Danger secondary | `background: var(--bg-light)`, `color: var(--color-danger)`, `border: 1px solid var(--color-danger)`, `flex-1`, `min-h-[44px]`, `text-sm font-medium` |
| Container | `flex gap-3 px-4 py-4` with `border-top: 1px solid var(--border)` | Sticks to bottom of panel |

#### 4.2.10 Dismiss Behaviour

| Trigger | Action |
|---------|--------|
| Click `[×]` button | Close panel with slide-out animation |
| Press `Escape` key | Close panel |
| Click on calendar grid outside panel | Close panel |
| Open a different shift card | Panel updates in-place (no close/reopen) |

#### 4.2.11 Overlay Scrim

No full-screen scrim. The panel is a **side drawer** — the grid remains usable. A subtle shadow (`−4px 0 24px rgba(0,0,0,0.10)`) provides depth separation.

---

### 4.3 Enhancement 3 — Interactive 3-Day Tab with Date Range Picker

#### 4.3.1 Description

The **3-Day** view tab currently loads a fixed 3-day window. After this enhancement, clicking the 3-Day tab shows a **compact date range picker** allowing the user to choose any start date. The view then renders 3 consecutive days from that start date.

#### 4.3.2 Trigger Behaviour

| Action | Result |
|--------|--------|
| First click on "3-Day" tab (if already on Week/Day) | Activates 3-Day view; default start = today or Monday of current week |
| Click on "3-Day" tab when already active | Opens the 3-day range picker popover |
| Click elsewhere / press Escape | Dismisses popover without change |

#### 4.3.3 3-Day Range Picker Popover

```
┌─────────────────────────────────┐
│  Select 3-Day Start             │
│  ─────────────────────────────  │
│  ‹  June 2026  ›                │
│                                 │
│  Mo Tu We Th Fr Sa Su           │
│   1  2  3  4  5  6  7           │
│   8  9 10 11 12 13 14           │
│  15 16 17 18 19 20 21           │
│  22 23 24 25 26 27 28           │
│  29 30                          │
│                                 │
│  Selected: Jun 3 – Jun 5 →      │
│  [Apply]   [Cancel]             │
└─────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Popover position | Below the "3-Day" tab, left-aligned |
| Popover width | `280px` |
| Background | `var(--bg-card)` |
| Border | `1px solid var(--border)` |
| Border radius | `rounded-lg` (8px) |
| Box shadow | `0 4px 16px rgba(0,0,0,0.12)` |
| Z-index | `600` |
| Animation | `fadeIn 200ms ease-out` |

**Calendar grid inside popover:**

| Element | Spec |
|---------|------|
| Month/year header | `text-sm font-semibold`, `var(--text-main)` |
| Prev/next month arrows | `<ChevronLeft/Right size={14}>`, `var(--text-tertiary)` |
| Day-of-week labels | `text-[10px] font-bold uppercase`, `var(--text-muted)` |
| Day number cells | `w-8 h-8 rounded flex items-center justify-center text-xs` |
| **Selected start day** bg | `var(--accent)`, text `var(--text-main)`, `font-bold` |
| **Selected range** (days 2–3) | `var(--accent-pale)` bg, `var(--accent-dark)` text |
| Today dot | Small `2px` dot below number, `var(--accent)` colour |
| Hover | `var(--bg-light)` bg |
| Selected preview label | `text-xs`, `var(--text-tertiary)`, shows "Jun 3 – Jun 5 →" |

**Apply / Cancel buttons:**

| Button | Spec |
|--------|------|
| Apply | `.btn-primary` compact: `px-4 py-2 text-xs font-semibold`, `var(--accent)` |
| Cancel | `.btn-secondary` compact: `px-4 py-2 text-xs font-medium` |

#### 4.3.4 3-Day Grid Layout

Identical to the weekly calendar grid (PRD-SM-002) but with only 3 day columns. Resource column remains sticky. Column width expands proportionally to fill available space.

---

### 4.4 Enhancement 4 — Calendar Date Picker for Week/Range Navigation

#### 4.4.1 Description

The date range label in the header (e.g. `Jun 1 – Jun 7, 2026`) becomes **clickable**, opening a **calendar date picker popover** that lets users jump to any week or date directly, without multiple prev/next arrow clicks.

#### 4.4.2 Trigger

Clicking the date range label opens the calendar picker. The label gets a subtle hover treatment to indicate interactivity:

| State | Style |
|-------|-------|
| Rest | `text-sm font-medium var(--text-secondary)` |
| Hover | `text-sm font-medium var(--text-secondary)` + `cursor-pointer` + `underline decoration-dashed` |
| Active (picker open) | Same + `color: var(--accent-dark)` |

#### 4.4.3 Date Picker Popover

```
┌──────────────────────────────────────┐
│  ‹  June 2026  ›           [Today]   │
│  ────────────────────────────────    │
│  Mo Tu We Th Fr Sa Su               │
│                 1  2  3  4  5        │
│   6  7  8  9 10 11 12               │
│  13 14 15 16 17 18 19               │
│  20 21 22 23 24 25 26               │
│  27 28 29 30                        │
│                                     │
│  [Cancel]                           │
└──────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Popover position | Below date range label, centred |
| Popover width | `300px` |
| Background | `var(--bg-card)` |
| Border | `1px solid var(--border)` |
| Border radius | `rounded-lg` (8px) |
| Box shadow | `0 4px 16px rgba(0,0,0,0.12)` |
| Z-index | `600` |
| Animation | `fadeIn 200ms ease-out` |

**Interaction model (Week view):**

| Click | Action |
|-------|--------|
| Click any day | Navigate to the **week containing that day** (Monday–Sunday). Popover closes. |
| Click [Today] button | Navigate to current week. Popover closes. |
| Current week's days | Highlighted with `var(--accent-pale)` background across the full row |
| Today's cell | Dot indicator below day number, `var(--accent)` colour |

**Interaction model (3-Day view):**

| Click | Action |
|-------|--------|
| Click any day | Sets that day as the 3-day window start. Popover closes. |

**Interaction model (Day view):**

| Click | Action |
|-------|--------|
| Click any day | Navigates to that specific day. Popover closes. |

#### 4.4.4 Calendar Day Cell Spec

| State | Background | Text |
|-------|-----------|------|
| Default | `transparent` | `var(--text-secondary)` |
| Hover | `var(--bg-light)` | `var(--text-main)` |
| Today | `transparent` + dot | `var(--text-main)` |
| Current week / selected range | `var(--accent-pale)` | `var(--accent-dark)` |
| Selected day (Day view) | `var(--accent)` | `var(--text-main)`, `font-bold` |
| Other month days | Shown, `var(--text-muted)` | Dimmed |

---

### 4.5 Enhancement 5 — Functional Edit Button in Shift Detail Panel

#### 4.5.1 Description

The **Edit Shift** button in the Shift Detail panel (Enhancement 2, Section E) opens an **inline edit form** within the same right-side panel. The panel transitions from "view mode" to "edit mode" without opening a separate modal.

#### 4.5.2 Edit Mode Panel Layout

```
┌─────────────────────────────────────────┐
│  EDIT SHIFT                 [×]          │  ← Header (mode changes)
├─────────────────────────────────────────┤
│  SFT-W004                               │  ← Shift ID (read-only label)
│                                         │
│  Shift Type                             │
│  [Emergency Standby        ▼]           │  ← .input-field select
│                                         │
│  Date                                   │
│  [2026-06-05               📅]          │  ← .input-field date
│                                         │
│  Start Time     End Time                │
│  [14:00  ▼]     [22:00  ▼]             │  ← time selects, side by side
│                                         │
│  Status                                 │
│  [Tentative                ▼]           │  ← .input-field select
│                                         │
│  Resource                               │
│  [Sarah Jenkins            ▼]           │  ← .input-field select
│                                         │
│  Notes (optional)                       │
│  [                         ]            │  ← textarea 3 rows
│                                         │
├─────────────────────────────────────────┤
│  [Save Changes]    [Cancel]             │  ← Action buttons
└─────────────────────────────────────────┘
```

#### 4.5.3 Form Field Specs

All fields use `.input-field` from Design System §6:

| Field | Type | Notes |
|-------|------|-------|
| Shift Type | `<select>` | Options: Day Shift, Normal, Emergency Standby, Night Shift, On Call |
| Date | `<input type="date">` | Pre-filled with existing date |
| Start Time | `<select>` | 30-min increments 00:00–23:30 |
| End Time | `<select>` | 30-min increments 00:00–23:30 + next-day indicator |
| Status | `<select>` | Options: Tentative, Confirmed |
| Resource | `<select>` | Populated from service resources list |
| Notes | `<textarea rows="3">` | Optional; no min-height override |

**Field label:**

| Property | Value |
|----------|-------|
| Font | `text-xs font-medium` |
| Colour | `var(--text-tertiary)` |
| Margin bottom | `mb-1` (4px) |

**Field group spacing:** `space-y-4` (16px between each group)

**Field container padding:** `px-4 py-4`

#### 4.5.4 Validation

| Rule | Behaviour |
|------|-----------|
| End Time < Start Time (same day) | Show inline error: "End time must be after start time" — `var(--color-danger)` text, `text-xs`, `.input-field.error` border |
| Required fields empty | Border turns `var(--color-danger)`, error message below field |
| Night shift cross-midnight | End Time < Start Time is valid if status = "Night Shift" — suppress same-day rule |

#### 4.5.5 Save / Cancel Behaviour

| Action | Result |
|--------|--------|
| **Save Changes** | Calls `onUpdateShift(shiftId, updatedData)`. On success: panel returns to view mode with updated data; shift card on calendar updates in-place. On error: inline error banner in panel. |
| **Cancel** | Panel returns to view mode, no changes saved. |
| **Save Changes button** (loading state) | Button shows spinner icon + "Saving…" text, `disabled`, `opacity-75`. |

#### 4.5.6 Save / Cancel Button Specs

| Button | Spec |
|--------|------|
| Save Changes | `.btn-primary`: `background: var(--accent)`, `color: var(--text-main)`, `flex-1`, `min-h-[44px]`, `text-sm font-semibold` |
| Cancel | `.btn-secondary`: `background: var(--bg-light)`, `border: 1px solid var(--border)`, `color: var(--text-secondary)`, `flex-1`, `min-h-[44px]` |

---

## 5. Component Changes

| Component | Change Type | Enhancement | Notes |
|-----------|-------------|-------------|-------|
| `AppLayout.jsx` | Modify | E1 | Expose `--sidebar-width` CSS var on `:root`; update on toggle |
| `ShiftManagement/index.jsx` | Modify | E1, E2, E3, E4 | Manage `selectedShift` state, `detailPanelOpen` state, `view` state, `currentRange` state |
| `ShiftDetailPanel.jsx` | **New** | E2, E5 | Right-side fixed drawer; view + edit modes |
| `ShiftEditForm.jsx` | **New** | E5 | Inline edit form within detail panel |
| `ThreeDayRangePicker.jsx` | **New** | E3 | Popover calendar for 3-day start date |
| `CalendarDatePicker.jsx` | **New** | E4 | Popover calendar for week/date jump |
| `ShiftCard.jsx` | Modify | E2 | `onClick` now calls `onShiftSelect(shift)` → opens right panel |
| `WeeklyCalendarGrid.jsx` | Modify | E1 | Remove any fixed-width constraints; use `w-full` |
| `useShiftWeekData.js` | Modify | E3 | Support 3-day window alongside 7-day |

---

## 6. State Management

```
ShiftManagement {
  view: 'Day' | '3-Day' | 'Week'          // active view tab
  currentRangeStart: Date                  // Monday (Week) or start day (3-Day/Day)
  selectedShift: Shift | null              // currently open in detail panel
  detailMode: 'view' | 'edit'             // detail panel mode
  datePickerOpen: boolean                  // header date picker
  threeDayPickerOpen: boolean              // 3-day tab picker
  isSaving: boolean                        // edit form save state
}
```

---

## 7. Spacing & Sizing Reference

| Element | Value |
|---------|-------|
| Sidebar gutter (collapsed) | `15px` |
| Detail panel width (desktop) | `320px` |
| Detail panel width (< 1024px) | `280px` |
| Date picker popover width | `300px` |
| 3-Day picker popover width | `280px` |
| Panel top padding (clears topnav) | `pt-4` (16px); adjust if global topnav height changes |
| Panel action bar height | `min 64px` (`py-4` + 44px buttons) |

---

## 8. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Panel focus trap | When detail panel opens, focus moves to panel; Tab cycles within it |
| Escape key | Closes detail panel and all pickers |
| ARIA role | Detail panel: `role="complementary" aria-label="Shift details"` |
| Date picker | `role="dialog" aria-modal="true" aria-label="Select date"` |
| Edit form | `role="form" aria-label="Edit shift {id}"` |
| Error messages | `role="alert"` on validation error containers |
| Save button loading | `aria-busy="true"` during save |
| Reduced motion | All slide/fade animations respect `prefers-reduced-motion: reduce` |

---

## 9. Dark Mode

All new components use CSS variable tokens exclusively. Additional dark-mode considerations:

| Element | Light | Dark |
|---------|-------|------|
| Detail panel bg | `#FFFFFF` | `#2D2D2D` (`--bg-card`) |
| Detail panel border | `#E0E0E0` | `#3A3A3A` (`--border`) |
| Detail panel shadow | `rgba(0,0,0,0.10)` | `rgba(0,0,0,0.30)` |
| Date picker bg | `#FFFFFF` | `#2D2D2D` (`--bg-card`) |
| Calendar day hover | `#F5F5F5` | `#3A3A3A` (`--bg-light`) |
| Selected week row | `#FFFDE7` | `#FEF3C7` (`--accent-pale`) |

---

## 10. Animations

| Animation | Duration | Easing | Element |
|-----------|----------|--------|---------|
| `slideInRight` | `250ms` | `ease-out` | Detail panel open |
| `slideOutRight` | `200ms` | `ease-in` | Detail panel close |
| `fadeIn` | `200ms` | `ease-out` | All pickers (date / 3-day) |
| `fadeOut` | `150ms` | `ease-in` | All pickers dismiss |
| Panel mode switch (view↔edit) | `150ms` | `ease` | Content cross-fade |
| Sidebar width transition | `250ms` | `ease` | Layout margin shift |

---

## 11. Acceptance Criteria

### E1 — Full-Width Grid

- [ ] When sidebar is collapsed, grid left edge is 15px from the sidebar rail right edge.
- [ ] Transition is smooth (250ms), no layout jump.
- [ ] Day column min-width of 140px is preserved; horizontal scroll appears before columns narrow below 140px.

### E2 — Right-Side Detail Panel

- [ ] Clicking a shift card opens the panel on the right; grid does not reflow.
- [ ] Panel contains: header, shift ID + status badge, type card, info rows, action buttons.
- [ ] Panel does NOT render at the bottom of the page.
- [ ] Clicking another shift updates panel in-place without close/reopen animation.
- [ ] Escape key and `[×]` button both close the panel.
- [ ] Shadow and border are visible in both light and dark modes.

### E3 — Interactive 3-Day Tab

- [ ] Clicking 3-Day tab when inactive activates 3-day view (default start = current week's Monday).
- [ ] Clicking 3-Day tab when already active opens range picker popover.
- [ ] Selecting a day in the picker updates the 3-day view to start on that day.
- [ ] Selected range preview ("Jun 3 – Jun 5 →") is shown before confirming.
- [ ] [Apply] and [Cancel] buttons work correctly.

### E4 — Calendar Date Picker

- [ ] Date range label has hover treatment (dashed underline, pointer cursor).
- [ ] Clicking the label opens the calendar picker popover.
- [ ] Clicking a day in Week view navigates to the week containing that day.
- [ ] Clicking a day in 3-Day view sets that day as the 3-day start.
- [ ] [Today] button navigates to current week.
- [ ] Current selected week row is highlighted with `--accent-pale`.
- [ ] Picker closes on selection, Escape, or outside click.

### E5 — Functional Edit Button

- [ ] [Edit Shift] button in detail panel switches panel to edit mode.
- [ ] Edit form is pre-filled with existing shift data.
- [ ] All fields are editable and use `.input-field` styling.
- [ ] Validation fires on save attempt: empty required fields, invalid time range.
- [ ] [Save Changes] updates the shift card on the calendar in-place.
- [ ] [Cancel] returns to view mode with no changes.
- [ ] Save loading state shows spinner + "Saving…" text with disabled button.
- [ ] On save error, inline error banner appears within the panel.

---

## 12. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-1 | Should the detail panel push the grid (reflow) or overlay it? PRD recommends overlay — confirm with design. | UX Lead | Sprint 1 |
| OQ-2 | What is the global topnav height? `pt-4` (16px) assumed — verify exact value for panel top offset. | Dev | Sprint 1 |
| OQ-3 | Is the "Delete" button in the detail panel in scope, or is it deferred? | PM | Sprint 0 |
| OQ-4 | Should the 3-Day picker default to Mon–Wed or today–today+2? | UX Lead | Sprint 0 |
| OQ-5 | Does Save on the edit form call an API or update local state only (for now)? | Dev Lead | Sprint 1 |

---

*End of PRD-SM-003*
