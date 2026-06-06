# Design System — UT Service Console

> **Version:** 1.0  
> **Last Updated:** 2026-06-06  
> **Source of Truth:** `DEVELOPMENT_CRM/frontend/src/index.css` + `tailwind.config.js`

This document standardises the visual language across all modules of the UT Service Console (Dashboard, Cases, Work Orders, Service Appointments, Field Service). Every component must reference these tokens — never hard-code colours or spacing outside of this system.

---

## 1. Colour Palette

### 1.1 Brand Colours

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--accent` | `#F5C800` | `#FBBF24` | Primary brand gold — buttons, highlights, active indicators |
| `--accent-dark` | `#E0B200` | `#F59E0B` | Button active/pressed state, hover on dark backgrounds |
| `--accent-light` | `#FFC800` | `#FCD34D` | Button hover state |
| `--accent-pale` | `#FFFDE7` | `#FEF3C7` | Subtle gold tint backgrounds, selection highlights |

### 1.2 Background Colours

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--bg-base` | `#FFFFFF` | `#1A1A1A` | Page/app background |
| `--bg-panel` | `#FFFFFF` | `#242424` | Sidebar, header, footer panels |
| `--bg-card` | `#FFFFFF` | `#2D2D2D` | Cards, modals, dropdowns |
| `--bg-light` | `#F5F5F5` | `#3A3A3A` | Subtle container backgrounds, hover fills |
| `--bg-lighter` | `#EFEFEF` | `#4A4A4A` | Secondary hover fills |

### 1.3 Text Colours

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--text-main` | `#1A1A1A` | `#F3F4F6` | Primary text (headings, body) |
| `--text-secondary` | `#2C2C2C` | `#E5E7EB` | Subheadings, form values |
| `--text-tertiary` | `#757575` | `#9CA3AF` | Labels, metadata, timestamps |
| `--text-muted` | `#BDBDBD` | `#6B7280` | Placeholders, disabled text, hints |

### 1.4 Border Colour

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--border` | `#E0E0E0` | `#3A3A3A` |

### 1.5 Status Colours (Case & Work Order)

| Status | Colour | Background (badge) |
|--------|--------|--------------------|
| Open | `#1976D2` | `#E3F2FD` |
| Assigned | `#1976D2` | `#E3F2FD` |
| In Progress | `#00897B` | `#E0F2F1` |
| Resolved | `#388E3C` | `#E8F5E9` |
| Closed | `#757575` | `#F5F5F5` |

### 1.6 Priority Colours

| Priority | Colour | Background (badge) |
|----------|--------|--------------------|
| Critical | `#C62828` | `#FFEBEE` |
| High | `#F57C00` | `#FFF3E0` |
| Medium | `#F5C800` | `#FFFDE7` |
| Low | `#2E7D32` | `#E8F5E9` |

### 1.7 Semantic Colours

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#388E3C` | Positive confirmation, completed states |
| `--color-warning` | `#F57C00` | Caution notices, pending items |
| `--color-danger` | `#C62828` | Errors, destructive actions, overdue |
| `--color-info` | `#1976D2` | Informational notices, links |

### 1.8 Work Order Status Colours (Inline Badges)

| Status | Text | Background |
|--------|------|------------|
| Open | `#4A90E2` | `rgba(74, 144, 226, 0.1)` |
| In Progress | `#FFB81C` | `rgba(255, 184, 28, 0.1)` |
| Completed | `#34C759` | `rgba(52, 199, 89, 0.1)` |
| Cancelled | `#6C7681` | `rgba(108, 118, 129, 0.1)` |
| On Hold | `#FF9F0A` | `rgba(255, 159, 10, 0.1)` |
| Scheduled | `#0073E6` | `rgba(0, 115, 230, 0.1)` |

---

## 2. Typography

### 2.1 Font Family

| Type | Family Stack | Usage |
|------|-------------|-------|
| **Primary** | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All UI text |
| **Monospace** | `ui-monospace, SFMono-Regular, monospace` | Appointment numbers, IDs, timestamps, status badge labels |

> Load Inter via Google Fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`

### 2.2 Font Weights

| Weight | Tailwind Class | Usage |
|--------|---------------|-------|
| 400 (Regular) | `font-normal` | Body text, descriptions |
| 500 (Medium) | `font-medium` | Buttons, nav items, form labels |
| 600 (Semibold) | `font-semibold` | Subheadings, card titles, active links |
| 700 (Bold) | `font-bold` | Page headings (h1, h2), section headers |

### 2.3 Font Sizes

| Role | Class | Size | Line Height |
|------|-------|------|-------------|
| Page heading | `text-2xl` | 24px | 32px |
| Section heading | `text-xl` | 20px | 28px |
| Card/subheading | `text-lg` | 18px | 28px |
| Body / default | `text-sm` | 14px | 20px |
| Labels / metadata | `text-xs` | 12px | 16px |
| Micro labels | `text-[11px]` | 11px | 14px |
| System labels (uppercase) | `text-[10px]` | 10px | 12px |

### 2.4 Text Rendering

```css
body {
  @apply font-sans antialiased;
  -webkit-text-size-adjust: 100%;
}
```

---

## 3. Spacing

### 3.1 Base Unit

The spacing system uses **4px increments** (Tailwind default: `1 unit = 4px`).

### 3.2 Standard Spacing Scale

| Tailwind | Value | Common Usage |
|----------|-------|-------------|
| `p-1` / `gap-1` | 4px | Tight icon gaps |
| `p-1.5` / `gap-1.5` | 6px | Badge padding, small icon + text gaps |
| `p-2` / `gap-2` | 8px | Inline button groups, tight cards |
| `p-2.5` | 10px | Button vertical padding (`py-2.5`) |
| `p-3` / `gap-3` | 12px | Card internal sections, form field groups |
| `p-4` / `gap-4` | 16px | Card padding (compact), grid gaps |
| `p-5` | 20px | Card padding (standard sections) |
| `p-6` / `gap-6` | 24px | Page-level padding, card outer padding |

### 3.3 Layout Spacing Rules

| Context | Value | Notes |
|---------|-------|-------|
| Page container padding | `p-6` (24px) | Applied by `AppLayout` to main content |
| Max content width | `max-w-screen-2xl` | Prevents overly wide reading lines |
| Section gap (vertical) | `space-y-5` or `space-y-6` | Between cards/sections in a page |
| Card internal gap | `space-y-3` or `space-y-4` | Between field groups inside a card |
| Form field gap | `gap-4` (grid) | Between columns in a form row |
| Header / footer height | Auto (min `py-3`) | Flexible based on content |

### 3.4 Minimum Touch Target

All interactive elements must meet:
```
min-height: 44px (min-h-[44px])
```
This satisfies WCAG 2.2 Target Size (Level AA).

---

## 4. Buttons

### 4.1 Primary Button (`.btn-primary`)

The main CTA button using brand gold.

```css
.btn-primary {
  @apply flex items-center justify-center gap-2
         font-medium text-sm
         px-4 py-2.5 rounded
         transition-all duration-200
         min-h-[44px]
         disabled:opacity-50 disabled:cursor-not-allowed;
  background-color: var(--accent);       /* Gold */
  color: var(--text-main);               /* Dark text on gold */
}
```

| State | Background | Behaviour |
|-------|-----------|-----------|
| Default | `var(--accent)` / `#F5C800` | — |
| Hover | `var(--accent-light)` / `#FFC800` | Lighten |
| Active / Pressed | `var(--accent-dark)` / `#E0B200` | Darken |
| Disabled | Same + `opacity: 0.5` | `cursor: not-allowed` |

### 4.2 Secondary Button (`.btn-secondary`)

Neutral outlined button for secondary actions.

```css
.btn-secondary {
  @apply flex items-center justify-center gap-2
         font-medium text-sm
         px-4 py-2.5 rounded border
         transition-all duration-200
         min-h-[44px]
         disabled:opacity-50 disabled:cursor-not-allowed;
  background-color: var(--bg-light);
  color: var(--text-secondary);
  border-color: var(--border);
}
```

| State | Background | Behaviour |
|-------|-----------|-----------|
| Default | `var(--bg-light)` | — |
| Hover | `var(--bg-lighter)` | Subtle fill change |
| Disabled | Same + `opacity: 0.5` | `cursor: not-allowed` |

### 4.3 Inline / Ghost Button

Used inside cards and tight contexts (e.g., "Book Appointment" in Feed tab):

```jsx
style={{
  backgroundColor: 'var(--accent)',
  color: '#1a1a1a',
}}
className="px-4 py-2 rounded text-sm font-medium"
```

### 4.4 Icon-Only Button

```jsx
className="p-1.5 rounded-lg transition-colors"
style={{
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  color: 'var(--text-muted)',
}}
```

### 4.5 Button Sizing Summary

| Variant | Padding | Min Height | Font |
|---------|---------|-----------|------|
| Standard (primary/secondary) | `px-4 py-2.5` | 44px | `text-sm font-medium` |
| Compact | `px-3 py-1.5` | auto | `text-xs font-medium` |
| Icon-only | `p-1.5` | auto | — |

---

## 5. Cards

### 5.1 Standard Card (`.card`)

```css
.card {
  @apply rounded p-6;
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
```

| Property | Value |
|----------|-------|
| Border radius | `rounded` (4px) |
| Padding | `p-6` (24px) — or `p-4`/`p-5` for compact variants |
| Background | `var(--bg-card)` |
| Border | `1px solid var(--border)` |
| Shadow (rest) | `0 1px 3px rgba(0,0,0,0.08)` |
| Shadow (hover) | `0 2px 8px rgba(0,0,0,0.12)` |

### 5.2 Section Card (Collapsible)

Used in detail pages (WO Detail, SA Detail):

```jsx
className="rounded-lg overflow-hidden"
style={{
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
}}
```

- Header: `px-4 py-3`, clickable, includes `ChevronDown` icon
- Body: `px-4 pb-4 pt-1`, separated by `border-top: 1px solid var(--border)`

### 5.3 Side Panel Card

Used in left/right panels of detail layouts:

```jsx
className="mb-4 rounded-lg p-4"
style={{
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
}}
```

- Title: `text-[11px] font-bold uppercase tracking-wider` in `var(--text-muted)`
- Internal spacing: `space-y-3`

---

## 6. Form Inputs

### 6.1 Input Field (`.input-field`)

```css
.input-field {
  @apply w-full px-3 py-2 rounded text-sm
         transition-all duration-150
         min-h-[44px];
  background-color: var(--bg-base);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(245, 200, 0, 0.1);
}

.input-field.error {
  border-color: var(--color-danger);
}

.input-field.error:focus {
  box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1);
}
```

### 6.2 Select / Dropdown

Same `.input-field` class applied. Native `<select>` or custom dropdown both use identical border, background, and focus styles.

### 6.3 Textarea

Same `.input-field` class without `min-h-[44px]`; rows set explicitly.

---

## 7. Badges

### 7.1 Generic Badge (`.badge`)

```css
.badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
  height: 28px;
}
```

### 7.2 Status Badges

| Class | Background | Text |
|-------|-----------|------|
| `.badge-open` | `#E3F2FD` | `#1976D2` |
| `.badge-assigned` | `#E3F2FD` | `#1976D2` |
| `.badge-inprogress` | `#E0F2F1` | `#00897B` |
| `.badge-resolved` | `#E8F5E9` | `#388E3C` |
| `.badge-closed` | `#F5F5F5` | `#757575` |

### 7.3 Priority Badges

| Class | Background | Text |
|-------|-----------|------|
| `.badge-low` | `#E8F5E9` | `#1D5E1D` |
| `.badge-medium` | `#FFFDE7` | `#8B7500` |
| `.badge-high` | `#FFF3E0` | `#8B4513` |
| `.badge-critical` | `#FFEBEE` | `#6D0000` |

### 7.4 Inline Status Badge (WO / SA)

For status badges that use `border` + transparent `background`:

```jsx
style={{
  backgroundColor: mapping.bg,   // e.g. rgba(74, 144, 226, 0.1)
  color: mapping.color,          // e.g. #4A90E2
  border: `1px solid ${mapping.color}`,
}}
className="px-2 py-0.5 rounded text-xs font-medium"
```

---

## 8. Light / Dark Mode

### 8.1 Activation Mechanism

- Tailwind: `darkMode: 'class'` — toggled by adding/removing class `dark` on `<html>`
- CSS variables: `:root` (light) and `.dark` (dark) define all tokens
- Context: `ThemeContext` manages state, persists to `localStorage`

### 8.2 Transition

All colour transitions are automatic via:
```css
*, *::before, *::after {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease;
}
```

### 8.3 Full Token Comparison

| Token | Light | Dark |
|-------|-------|------|
| `--bg-base` | `#FFFFFF` | `#1A1A1A` |
| `--bg-panel` | `#FFFFFF` | `#242424` |
| `--bg-card` | `#FFFFFF` | `#2D2D2D` |
| `--bg-light` | `#F5F5F5` | `#3A3A3A` |
| `--bg-lighter` | `#EFEFEF` | `#4A4A4A` |
| `--border` | `#E0E0E0` | `#3A3A3A` |
| `--text-main` | `#1A1A1A` | `#F3F4F6` |
| `--text-secondary` | `#2C2C2C` | `#E5E7EB` |
| `--text-tertiary` | `#757575` | `#9CA3AF` |
| `--text-muted` | `#BDBDBD` | `#6B7280` |
| `--accent` | `#F5C800` | `#FBBF24` |
| `--accent-dark` | `#E0B200` | `#F59E0B` |
| `--accent-light` | `#FFC800` | `#FCD34D` |
| `--accent-pale` | `#FFFDE7` | `#FEF3C7` |
| `--scrollbar-track` | `#F5F5F5` | `#1A1A1A` |
| `--scrollbar-thumb` | `#E0E0E0` | `#3A3A3A` |

### 8.4 Design Rules for Dark Mode

1. **Never use pure white** (`#FFFFFF`) as a background in dark mode — always use the layered grays (`#1A1A1A` > `#242424` > `#2D2D2D`).
2. **Text contrast** must remain >= 4.5:1 (WCAG AA) — verify with the tokens above.
3. **Accent gold** shifts warmer in dark mode (`#FBBF24`) to maintain vibrancy.
4. **Shadows** should be more subtle in dark mode; rely on borders instead.
5. **Status/priority badge backgrounds** remain consistent (light tint + coloured text) in both modes.

---

## 9. Scrollbar

Custom WebKit scrollbar for a clean UI:

```css
::-webkit-scrollbar       { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--scrollbar-track); }
::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }
```

---

## 10. Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `fadeIn` | 300ms | ease-out | Page/tab content entrance |
| `slideIn` | 250ms | ease-out | Sidebar/panel entrance |
| `slideInRight` | 250ms | ease-out | Side sheet (right panels) |
| `jiggle` | 400ms | ease-in-out | Error shake (login) |
| `spin` | 800ms | linear | Loading spinners |

---

## 11. Focus & Accessibility

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- All interactive elements use `:focus-visible` (not `:focus`) to avoid showing outlines on mouse click.
- `.sr-only` class is available for screen-reader-only content.
- Minimum touch target: **44x44px** on all buttons and form controls.

---

## 12. File References

| File | Role |
|------|------|
| `DEVELOPMENT_CRM/frontend/src/index.css` | CSS custom properties + component classes |
| `DEVELOPMENT_CRM/frontend/tailwind.config.js` | Extended theme (colours, fonts, animations) |
| `DEVELOPMENT_CRM/frontend/src/contexts/ThemeContext.jsx` | Dark mode toggle + module state |

---

## 13. Usage Guidelines

1. **Always use CSS variables** (`var(--token)`) for colours in inline styles — never hard-code hex values.
2. **Use Tailwind utility classes** as the primary styling method; only fall back to inline `style` when referencing CSS variables.
3. **New components** must match existing patterns: import icons from `lucide-react`, use `.btn-primary`/`.btn-secondary` for actions, `.card` for containers.
4. **Test both modes** — toggle dark mode in the app header and verify contrast, borders, and shadows look correct.
5. **Badge colours** are fixed (not variable-based) because they need to maintain specific meaning across themes.
