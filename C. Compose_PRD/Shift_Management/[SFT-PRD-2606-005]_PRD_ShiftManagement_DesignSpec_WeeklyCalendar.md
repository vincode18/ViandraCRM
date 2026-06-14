# PRD-SM-002 · Shift Management — Weekly Calendar View
## Design Specification (Design.md)

> **Status:** Draft  
> **Version:** 1.0  
> **Date:** 2026-06-06  
> **Module:** Shift Management — Week View  
> **Parent PRD:** PRD-SM-001  
> **Design Source:** Preview screenshot — `ShiftManagementWeekly` (Week tab active)  
> **Applies to:** `DEVELOPMENT_CRM/frontend/src/modules/ShiftManagement/`

---

## 1. Overview

This document defines the **complete design specification** for the Shift Management — Weekly Calendar View as shown in the approved preview. It translates every visible UI pattern into referenceable tokens, component rules, and layout constraints, all anchored to the **UT Service Console Design System (`Design_System.md` v1.0)**.

Any engineer or designer building, extending, or reviewing this screen must treat this document as the source of truth for spacing, colour, typography, and component behaviour.

---

## 2. Screen Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  A. Top Navigation Bar (Header)                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  B. Calendar Grid                                                                   │
│  ┌──────────────────┬──────────────────────────────────────────────────────────┐   │
│  │ B1. Column Header│ B2. Day Column Headers (MON … SUN)                       │   │
│  ├──────────────────┼──────────────────────────────────────────────────────────┤   │
│  │ B3. Resource Cell│ B4. Day Cells (shift cards / empty states)               │   │
│  └──────────────────┴──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  C. Legend Bar                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. A. Top Navigation Bar

### 3.1 Layout

| Property | Value |
|----------|-------|
| Height | `auto` (min `py-3` = 12px top/bottom) |
| Horizontal padding | `px-6` (24px) |
| Background | `var(--bg-panel)` |
| Bottom border | `1px solid var(--border)` |
| Flex alignment | `items-center`, `gap-4`, `flex-wrap` |

### 3.2 Left Group — Title + View Tabs

**Screen Title**

| Property | Value |
|----------|-------|
| Icon | Clock emoji `🕐` or `lucide-react` `<Clock size={16}>` |
| Text | "Shift Management" |
| Font | `text-lg font-bold` → 18px / 700 |
| Color | `var(--text-main)` |
| Gap between icon and text | `gap-2` (8px) |

**View Tab Group**

Three tabs: `Day`, `3-Day`, `Week`

| Property | Value |
|----------|-------|
| Container border | `1px solid var(--border)`, `rounded` (4px), overflow hidden |
| Tab padding | `px-4 py-1.5` |
| Tab font | `text-sm font-medium` → 14px / 500 |
| Separator between tabs | `border-right: 1px solid var(--border)` (except last) |
| **Active tab** background | `var(--accent)` → `#F5C800` |
| **Active tab** text colour | `var(--text-main)` → `#1A1A1A` |
| **Inactive tab** background | `var(--bg-base)` → `#FFFFFF` |
| **Inactive tab** text colour | `var(--text-tertiary)` → `#757575` |
| Active tab hover | `var(--accent-light)` → `#FFC800` |
| Inactive tab hover | `var(--bg-light)` → `#F5F5F5` |
| Min height | `min-h-[36px]` (touch: parent div covers 44px) |

### 3.3 Centre Group — Week Navigator

```
  [‹]   Jun 1 – Jun 7, 2026   [›]   [TODAY]
```

| Element | Spec |
|---------|------|
| Prev / Next arrow buttons | `w-8 h-8` (32px), `var(--bg-light)` bg, `1px solid var(--border)`, `rounded` |
| Arrow icon | `‹` / `›` character or `<ChevronLeft>` / `<ChevronRight>` from lucide-react, size 14 |
| Arrow text colour | `var(--text-secondary)` |
| Range label | `text-sm font-medium`, `var(--text-secondary)`, `min-w-[180px] text-center` |
| TODAY button | Same size as arrows; `px-3 h-8`, `text-xs font-bold uppercase tracking-wide`, `var(--text-secondary)` |
| TODAY bg / border | `var(--bg-light)` / `1px solid var(--border)` |
| Gap between elements | `gap-1.5` (6px) |

### 3.4 Right Group — Stats + CTA

**Total Hours Stat**

| Property | Value |
|----------|-------|
| Icon | `<Clock size={13}>` from lucide-react, `var(--text-tertiary)` |
| Value | `140.0h` — `text-sm font-semibold var(--text-secondary)` |
| Label | `this week` — `text-xs var(--text-muted)` |
| Gap | `gap-1.5` |

**Date Display**

| Property | Value |
|----------|-------|
| Icon | `📅` or `<Calendar size={13}>`, `var(--text-tertiary)` |
| Value | ISO date string `YYYY-MM-DD` — `text-sm var(--text-secondary)` |

**+ New Shift Button**  
Uses `.btn-primary` from Design System §4.1:

| Property | Value |
|----------|-------|
| Background | `var(--accent)` → `#F5C800` |
| Text | `var(--text-main)` → `#1A1A1A` |
| Font | `text-sm font-semibold` |
| Padding | `px-4 py-2.5` |
| Border radius | `rounded` (4px) |
| Min height | `min-h-[44px]` |
| Prefix icon | `+` character or `<Plus size={14}>` |
| Hover | background → `var(--accent-light)` |
| Active | background → `var(--accent-dark)` |

---

## 4. B. Calendar Grid

### 4.1 Table Structure

```
<table>
  <thead>
    <tr>
      <th class="resource-col">RESOURCE</th>   ← sticky left
      <th>MON 1</th>
      <th>TUE 2</th>
      ...
      <th class="today-col">SUN 7</th>         ← today highlight
    </tr>
  </thead>
  <tbody>
    <tr> ← per Resource
      <td class="resource-cell">…</td>
      <td class="day-cell">…</td> × 7
    </tr>
  </tbody>
</table>
```

| Property | Value |
|----------|-------|
| Table layout | `border-collapse: collapse` |
| Outer scroll | Horizontal scroll on container; `overflow-x: auto` |
| Column min-width | Resource col: `180px`; Day cols: `min-width: 140px` |
| Day col width | Equal-width (`width: ~13%` each on wider viewports) |
| Animation | `fadeIn 300ms ease-out` on mount |

### 4.2 B1. Resource Column Header ("RESOURCE" label)

| Property | Value |
|----------|-------|
| Text | "RESOURCE" |
| Font | `text-[10px] font-bold uppercase tracking-widest` |
| Colour | `var(--text-muted)` |
| Background | `var(--bg-base)` |
| Padding | `px-3 py-2.5` |
| Border | `1px solid var(--border)` |
| Border-bottom | `2px solid var(--border)` |
| Position | `sticky left-0 z-20` |

### 4.3 B2. Day Column Headers

Each day column header contains three layers: day name, day number, shift count badge.

**Day Name (e.g. "MON")**

| Property | Value |
|----------|-------|
| Font | `text-[10px] font-bold uppercase tracking-widest` |
| Colour — normal | `var(--text-muted)` |
| Colour — today | `var(--accent-dark)` → `#E0B200` |

**Day Number (e.g. "1")**

| Property | Value |
|----------|-------|
| Font — normal | `text-[22px] font-normal` |
| Font — today | `text-[22px] font-bold` |
| Colour — normal | `var(--text-secondary)` |
| Colour — today | `var(--accent-dark)` → `#E0B200` |
| Line height | `1.1` |

**Shift Count Sub-label (e.g. "4 shifts")**

| Property | Value |
|----------|-------|
| Font | `text-[10px] font-normal` |
| Colour | `var(--text-muted)` |
| Shown only when | count > 0 |
| Margin top | `mt-0.5` (2px) |

**Header Cell Container**

| Property | Value |
|----------|-------|
| Padding | `px-2 py-2` |
| Text align | `center` |
| Background — normal | `var(--bg-base)` |
| Background — today | `var(--accent-pale)` → `#FFFDE7` |
| Border | `1px solid var(--border)` |
| Border-bottom — normal | `2px solid var(--border)` |
| Border-bottom — today | `2px solid var(--accent)` → `#F5C800` |
| Position | `sticky top-0 z-10` |

### 4.4 B3. Resource Cell (left column, per row)

```
[Avatar]  Name (semibold 13px)
          Role (tertiary 11px)
          [badge: "3 shifts this week"]
```

**Avatar Circle**

| Property | Value |
|----------|-------|
| Size | `w-9 h-9` (36px) |
| Shape | `rounded-full` |
| Background | `var(--accent-pale)` → `#FFFDE7` |
| Border | `1px solid var(--accent)` → `#F5C800` |
| Initials font | `text-[11px] font-bold` |
| Initials colour | `var(--accent-dark)` → `#E0B200` |

**Name**

| Property | Value |
|----------|-------|
| Font | `text-[13px] font-semibold` |
| Colour | `var(--text-main)` |
| Overflow | `truncate` |

**Role**

| Property | Value |
|----------|-------|
| Font | `text-[11px] font-normal` |
| Colour | `var(--text-tertiary)` |
| Overflow | `truncate` |

**Weekly Shift Count Badge**

| State | Background | Text colour | Font |
|-------|-----------|-------------|------|
| Has shifts | `var(--accent-pale)` | `var(--accent-dark)` | `text-[10px] font-semibold` |
| No shifts | `var(--bg-lighter)` | `var(--text-muted)` | `text-[10px] font-medium` |

Badge shape: `rounded-full px-2 py-0.5`

**Resource Cell Container**

| Property | Value |
|----------|-------|
| Padding | `p-3` (12px) |
| Background | `var(--bg-base)` |
| Border | `1px solid var(--border)` |
| Vertical align | `top` |
| Position | `sticky left-0 z-10` |
| Min width | `180px` |
| Avatar–text gap | `gap-2.5` (10px) |
| Name–badge gap | `mt-1.5` (6px) |

### 4.5 B4. Day Cell (shift cards container)

**Empty State**

| Property | Value |
|----------|-------|
| Background — rest | `var(--bg-light)` → `#F5F5F5` |
| Background — hover | `var(--accent-pale)` → `#FFFDE7` |
| Border | `1px dashed var(--border)` |
| Inner placeholder height | `52px` |
| Cursor | `pointer` |
| Transition | `background 0.15s ease` |
| Hover `+` icon | Centred, `font-size: 20px`, `color: var(--text-muted)`, only visible on hover |

**Occupied State (has shifts)**

| Property | Value |
|----------|-------|
| Background | `var(--bg-card)` → `#FFFFFF` |
| Border | `1px solid var(--border)` |
| Cursor | `default` |

**Today Column Left/Right Border**

| Property | Value |
|----------|-------|
| Border-left | `2px solid var(--accent)` |
| Border-right | `2px solid var(--accent)` |

**Cell Padding**

| Property | Value |
|----------|-------|
| Padding | `p-1.5` (6px) |
| Vertical align | `top` |

---

## 5. C. Shift Card

Each shift card sits inside a Day Cell. Multiple cards in one cell stack vertically.

### 5.1 Anatomy

```
┌─ 3px coloured left border ──────────────────┐
│ [SFT-3061099]              [TENTATIVE badge] │  ← row 1
│ 08:00–17:00                                  │  ← row 2
│ Day Shift                                    │  ← row 3
└──────────────────────────────────────────────┘
```

### 5.2 Card Container

| Property | Value |
|----------|-------|
| Border-left | `3px solid {typeColor}` |
| Background | `{typeBg}` (see §5.4) |
| Border radius | `rounded` (4px) |
| Padding | `px-2 py-1.5` → `8px horizontal, 6px vertical` |
| Margin-bottom (stacked) | `mb-1` (4px) |
| Min height | `52px` |
| Cursor | `pointer` |
| Opacity — tentative | `0.75` |
| Opacity — confirmed | `1.0` |
| Transition | `box-shadow 0.15s ease, transform 0.1s ease` |
| Hover shadow | `0 2px 8px rgba(0,0,0,0.14)` |
| Hover translate | `translateY(-1px)` |
| Focus outline | `0 0 0 2px var(--accent)` |
| Role / a11y | `role="button"`, `tabIndex={0}` |

### 5.3 Card Typography

**Row 1 — Shift ID**

| Property | Value |
|----------|-------|
| Font family | `ui-monospace, SFMono-Regular, monospace` |
| Font size | `10px` |
| Font weight | `600` |
| Colour | `{typeColor}` (same as border) |
| Letter spacing | `0.02em` |

**Row 1 — TENTATIVE badge** (right-aligned, when applicable)

| Property | Value |
|----------|-------|
| Text | "TENTATIVE" |
| Font size | `9px` |
| Font weight | `500` |
| Colour | `var(--text-muted)` |
| Background | `var(--bg-lighter)` |
| Border radius | `3px` |
| Padding | `1px 4px` |
| Letter spacing | `0.02em` |

**Row 2 — Time Range**

| Property | Value |
|----------|-------|
| Font size | `11px` |
| Font weight | `400` |
| Colour | `var(--text-tertiary)` |
| Format | `HH:MM–HH:MM` |

**Row 3 — Shift Type Label**

| Property | Value |
|----------|-------|
| Font size | `11px` |
| Font weight | `600` |
| Colour | `{typeColor}` |

### 5.4 Shift Type Colour Mapping

> These values are **fixed** (not CSS-variable-based) because they carry semantic meaning across light and dark modes, matching Design System §1.8 conventions.

| Shift Type | Border & Text `{typeColor}` | Card Background `{typeBg}` |
|------------|----------------------------|---------------------------|
| Day Shift | `#1976D2` | `rgba(25, 118, 210, 0.10)` |
| Normal | `#00897B` | `rgba(0, 137, 123, 0.10)` |
| Emergency Standby | `#C62828` | `rgba(198, 40, 40, 0.10)` |
| Night Shift | `#6D28D9` | `rgba(109, 40, 217, 0.10)` |
| On Call | `#F57C00` | `rgba(245, 124, 0, 0.10)` |
| Unassigned / Unknown | `#757575` | `rgba(117, 117, 117, 0.10)` |

---

## 6. C. Legend Bar

Sits below the calendar grid, separated by `border-top: 1px solid var(--border)`.

### 6.1 Layout

| Property | Value |
|----------|-------|
| Display | `flex flex-wrap gap-x-4 gap-y-2` |
| Padding | `pt-2.5 pb-1` |
| Margin-top | `mt-2` |

### 6.2 Legend Item

Each item = colour dot + label text.

```
[●]  Day Shift
```

| Property | Value |
|----------|-------|
| Dot size | `10px × 10px` |
| Dot shape | `rounded-sm` (2px radius) |
| Dot colour | Match `{typeColor}` from §5.4 |
| Label font | `text-[11px] font-medium` |
| Label colour | `var(--text-tertiary)` |
| Item gap | `gap-1.5` (6px) |
| Items displayed | Day Shift, Normal, Emergency Standby, Night Shift, On Call, Tentative |

**Tentative legend item** (special — uses pattern instead of solid dot):

| Property | Value |
|----------|-------|
| Dot visual | Dashed circle border `1px dashed var(--border)` |
| Dot background | `transparent` |
| Label | "Tentative" |

---

## 7. Spacing Summary

| Zone | Token | Value |
|------|-------|-------|
| Page container padding | `p-6` | 24px |
| Header internal gaps | `gap-4` | 16px |
| Grid outer margin | `mt-0` — flush below header | — |
| Resource column min-width | — | 180px |
| Day column min-width | — | 140px |
| Card stack gap | `mb-1` | 4px |
| Card inner padding | `px-2 py-1.5` | 8px / 6px |
| Card rows gap | `gap-0.5` | 2px |
| Legend top border gap | `mt-2 pt-2.5` | 8px / 10px |

---

## 8. Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| `≥ 1280px` | Full 7-day grid visible; no horizontal scroll |
| `1024px – 1279px` | Grid scrolls horizontally; resource column sticky |
| `< 1024px` | Same sticky scroll; header wraps to 2 rows |
| `< 768px` | Consider reducing to 3-Day view as default |

The resource column uses `position: sticky; left: 0; z-index: 20` to remain visible during horizontal scroll.

---

## 9. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Touch target | All interactive elements `min-h-[44px]` |
| Keyboard navigation | Shift cards: `tabIndex={0}`, `role="button"`, `onKeyDown Enter` |
| Empty cell action | `aria-label="Add shift for {name} on {date}"` |
| Today indicator | `aria-current="date"` on today's `<th>` |
| Colour independence | Shift type label always present — colour never sole differentiator |
| Focus ring | `box-shadow: 0 0 0 2px var(--accent)` on `:focus-visible` |
| Screen reader | Resource name and role in `<td>` are not hidden |

---

## 10. Dark Mode Behaviour

The weekly calendar follows Design System §8 conventions:

| Element | Light | Dark |
|---------|-------|------|
| Table background | `#FFFFFF` | `#2D2D2D` (`--bg-card`) |
| Resource column bg | `#FFFFFF` | `#242424` (`--bg-panel`) |
| Empty cell rest | `#F5F5F5` | `#3A3A3A` (`--bg-light`) |
| Empty cell hover | `#FFFDE7` | `#FEF3C7` (`--accent-pale`) |
| Cell borders | `#E0E0E0` | `#3A3A3A` (`--border`) |
| Today col bg | `#FFFDE7` | `#FEF3C7` (`--accent-pale`) |
| Today col border | `#F5C800` | `#FBBF24` (`--accent`) |
| Shift card backgrounds | rgba values unchanged (semantic) | rgba values unchanged |
| Header bar | `#FFFFFF` | `#242424` (`--bg-panel`) |
| Sticky resource col | `#FFFFFF` | `#242424` (`--bg-panel`) |

Colour transitions apply via the global rule in Design System §8.2:
```css
*, *::before, *::after {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease;
}
```

---

## 11. Animation Tokens

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| `fadeIn` | 300ms | ease-out | Grid mounts / week changes |
| `slideInRight` | 250ms | ease-out | Toast notification |
| Card hover lift | 100ms | ease | `mouseenter` on shift card |
| Empty cell bg | 150ms | ease | `mouseenter` on empty cell |
| Header colour transitions | 200ms | ease | Active tab change |

---

## 12. Component File Map

| Component | File | Description |
|-----------|------|-------------|
| `ShiftManagementWeekly` | `ShiftManagement/index.jsx` | Root component, header, view state |
| `WeeklyCalendarGrid` | `ShiftManagement/WeeklyCalendarGrid.jsx` | `<table>` structure, column headers |
| `ResourceCell` | `ShiftManagement/ResourceCell.jsx` | Sticky left column per resource row |
| `DayCell` | `ShiftManagement/DayCell.jsx` | Individual date × resource cell |
| `ShiftCard` | `ShiftManagement/ShiftCard.jsx` | Single shift display block |
| `ShiftDetailModal` | `ShiftManagement/ShiftDetailModal.jsx` | Detail side-sheet / modal |
| `LegendBar` | `ShiftManagement/LegendBar.jsx` | Colour legend below grid |
| `useShiftWeekData` | `ShiftManagement/hooks/useShiftWeekData.js` | Groups shifts by `(resourceId, date)` |
| `useWeekNavigation` | `ShiftManagement/hooks/useWeekNavigation.js` | Prev/next week, getMondayOf, formatters |
| `shiftTypeConfig.js` | `ShiftManagement/constants/shiftTypeConfig.js` | `SHIFT_TYPES` colour map (§5.4) |

---

## 13. Constraints & Rules

1. **Never hard-code hex colours** for layout/UI chrome — always use `var(--token)`.
2. **Shift type colours** (§5.4) are the only permitted hard-coded hex values — they are semantically fixed.
3. **Resource column** must use `position: sticky; left: 0` — do not use fixed positioning.
4. **Avatar initials** must be derived programmatically from the resource's name (first char of first + last word).
5. **Shift count badges** in both the day column header and the resource cell are computed from live data — never stored as separate fields.
6. **Empty cell click** must pre-fill the New Shift modal with `resourceId` and `date` — never open a blank form.
7. **TENTATIVE badge** is shown only when `shift.status === 'Tentative'` — confirmed shifts render without it.
8. **Multiple shifts per cell** stack vertically with `mb-1` gap — no horizontal layout within a cell.
9. **Week navigation** always lands on the Monday of the target week — never mid-week.
10. **TODAY button** is disabled (visually muted, cursor default) when the current view already shows today's week.

---

## 14. Acceptance Criteria (Design QA Checklist)

| # | Check | Pass Condition |
|---|-------|---------------|
| D1 | View tabs | Active = gold bg, inactive = white bg + muted text |
| D2 | Week navigator | Range label centred, arrows 32×32px, TODAY button present |
| D3 | Day column header | Day name 10px uppercase, day number 22px, shift count 10px |
| D4 | Today column | `--accent-pale` bg, `--accent` bottom border, bold day number |
| D5 | Resource cell | Avatar 36px circle, initials gold, badge below role |
| D6 | Shift card ID | Monospace, `{typeColor}`, 10px |
| D7 | Shift card time | 11px tertiary text |
| D8 | Shift card type label | 11px semibold, `{typeColor}` |
| D9 | Tentative badge | 9px, bg-lighter, muted text, right-aligned row 1 |
| D10 | Tentative card opacity | 0.75 vs 1.0 for confirmed |
| D11 | Empty cell rest | dashed border, `--bg-light` fill |
| D12 | Empty cell hover | `--accent-pale` fill, `+` icon visible |
| D13 | Card hover | Lift shadow + `translateY(-1px)` |
| D14 | Legend | All 5 shift types + Tentative; below grid; dot 10px |
| D15 | Dark mode | All tokens switch correctly; shift card colours unchanged |
| D16 | Sticky resource col | Remains visible on horizontal scroll |
| D17 | Touch targets | All buttons and cards ≥ 44px in hit area |
| D18 | Focus ring | Gold `box-shadow` on keyboard focus |

---

*End of PRD-SM-002 — Design Specification*
