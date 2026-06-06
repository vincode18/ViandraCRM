# UT Service Console — Login Page Design

A two-column authentication screen for an enterprise service-management platform. The left column carries the sign-in form; the right column is a full-bleed cover image that establishes brand and product context.

---

## 1. Concept & Direction

**Aesthetic:** Industrial-utilitarian, refined. United Tractors is heavy-equipment and field operations, so the design leans into a "control panel for serious work" feeling — confident structure, machined edges, a single high-voltage accent.

**The one thing people remember:** the construction-yellow primary button and the equipment cover image. Everything else stays quiet so those two elements own the screen.

**Tone words:** precise, durable, operational, trustworthy.

---

## 2. Layout

A 50 / 50 split on desktop.

```
┌───────────────────────────┬───────────────────────────┐
│  LEFT — form column        │  RIGHT — cover image       │
│  (max-width 400px,         │  (full-bleed photo +       │
│   vertically centered)     │   gradient + brand panel)  │
│                            │                            │
│  • UT Service Console mark │  • Equipment cover image   │
│  • "Welcome back"          │  • Dark gradient scrim     │
│  • Email + Password        │  • "Enterprise Service     │
│  • Remember me / Forgot    │     Management" headline    │
│  • Sign in (yellow)        │  • Feature list (4 items)  │
│  • SSO: UT Account, MS     │  • Status: MVP v1.0 chip   │
│  • Footer copyright        │                            │
└───────────────────────────┴───────────────────────────┘
```

**Responsive:**
- `>= 1024px` — two columns side by side.
- `< 1024px` — cover image column is hidden; form centers on a plain background. The brand mark and a compact tagline remain at the top of the form so identity is never lost.

---

## 3. Color

Defined as CSS custom properties.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1A1A1A` | Primary text, dark UI |
| `--ink-2` | `#5C5C5C` | Secondary text, labels |
| `--line` | `#E4E4E4` | Borders, dividers |
| `--surface` | `#FFFFFF` | Form background |
| `--surface-2` | `#F7F7F5` | SSO buttons, subtle fills |
| `--accent` | `#FFC400` | Primary action (UT construction yellow) |
| `--accent-press` | `#E6B000` | Button active state |
| `--cover-dark` | `#16181D` | Cover scrim base |
| `--danger` | `#C0392B` | Validation errors |
| `--ok` | `#3FB950` | Operational status dot |

The accent is used **only** on the primary button and small status accents — never as a fill behind text. This keeps the yellow high-impact.

---

## 4. Typography

Distinctive pairing, loaded from Google Fonts.

- **Display / headings:** `Archivo` (700–800). Slightly squared, industrial, strong at large sizes.
- **Body / UI:** `Manrope` (400–600). Clean, geometric, excellent at small label sizes.

Scale: headline 30px / form labels 13px uppercase-tracked / body 15px / fine print 12px.

---

## 5. Components

**Inputs** — 48px tall, 1px border, leading icon (mail / lock), 10px radius. Focus shows a 3px soft accent ring. The password field has a show/hide eye toggle.

**Primary button** — full width, 48px, `--accent` fill with dark text, subtle lift on hover, press-down on `:active`.

**SSO buttons** — neutral `--surface-2` fill, brand glyph + label, hover raises border contrast.

**Divider** — "or continue with" centered between hairlines.

**Validation** — inline message under the field with an icon, in `--danger`. Field border turns danger color.

**Cover panel content** — sits inside a dark gradient scrim over the image so text stays legible regardless of photo. Feature list uses small monochrome tiles; status chip uses the `--ok` dot.

---

## 6. Motion

Restrained, load-only choreography (no scattered micro-interactions):

- On load, the form elements stagger in (fade + 8px rise) with ~60ms steps.
- The cover panel content fades in slightly after the form.
- Button and inputs use 150ms ease transitions on hover/focus.

Respects `prefers-reduced-motion`.

---

## 7. Accessibility

- All inputs have associated `<label>`s; icons are decorative (`aria-hidden`).
- Visible focus rings on every interactive element.
- Color is never the sole signal for errors (icon + text accompany it).
- Contrast: dark text on yellow passes AA; cover text sits on a scrim for contrast.
- Logical tab order; password toggle is a real `<button>` with `aria-label`.

---

## 8. Cover Image Notes

The HTML sample ships with a **self-contained CSS cover** (layered gradient + blueprint grid + a subtle equipment silhouette) so it renders anywhere with no external asset. To use a real photo, replace the `.cover` background with:

```css
.cover { background: url('your-equipment-photo.jpg') center/cover; }
```

Recommended photo: wide shot of heavy machinery / a field operations site, slightly desaturated, so the yellow brand accents pop against it.
