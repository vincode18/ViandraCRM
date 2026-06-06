# UT Service Console — Login Page Design

## Overview

A split-layout enterprise login page for **UT Service Console**, designed for field operations teams managing heavy equipment and industrial assets. The layout divides the screen into a clean white **form panel** on the left and a **dark hero panel** on the right featuring a Caterpillar bulldozer background.

---

## Layout Structure

```
┌──────────────────────────┬──────────────────────────┐
│                          │                          │
│      LOGIN PANEL         │      HERO PANEL          │
│      (White / Light)     │      (Dark / Image BG)   │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

- **Split ratio**: ~47% left / 53% right
- **Breakpoint behavior**: Stacks vertically on mobile (hero panel hidden on small screens)

---

## Left Panel — Login Form

### Header / Branding
- **Logo**: Dark rounded square with white "UT" monogram (top-left corner)
- **App name**: "UT Service Console" in medium-weight sans-serif beside logo

### Form Content

**Headline**
```
Welcome back
```
> Font: Bold, ~28–32px, dark charcoal (`#111827`)

**Subtitle**
```
Sign in to your account to continue.
```
> Font: Regular, ~14px, muted gray (`#6B7280`)

---

### Form Fields

#### Email Address
- Label: `Email address`
- Input: Full-width, rounded border, yellow focus ring (`#FBBF24`)
- Placeholder: `you@example.com`
- Left icon: ✉️ envelope icon (gray)

#### Password
- Label: `Password` — with `Forgot password?` link right-aligned (yellow/amber text)
- Input: Full-width, rounded border
- Placeholder: `Min. 8 characters`
- Left icon: 🔒 lock icon (gray)
- Right icon: 👁️ eye toggle (show/hide password)

#### Remember Me
- Checkbox: `Remember me for 30 days`
- Style: Small square checkbox, default unchecked

---

### Primary CTA

```
[ Sign in ]
```
> Background: `#FBBF24` (amber/yellow)  
> Text: `#1F2937` dark charcoal, bold  
> Border radius: `9999px` (pill shape)  
> Full width  
> Hover: slightly darker yellow  

---

### Alternative Sign-In

**Divider**: `— or continue with —`

**SSO Buttons** (full-width, outlined style):

1. **Sign in with UT Account**
   - Icon: Dark rounded "UT" logo badge
   - Border: `1px solid #E5E7EB`

2. **Sign in with Microsoft**
   - Icon: Microsoft 4-color grid logo
   - Border: `1px solid #E5E7EB`

---

### Footer Links

```
Don't have an account?  Create one
```
> "Create one" in bold

```
© 2026 United Tractors. All rights reserved.
```
> Muted, centered, small text

---

## Right Panel — Hero / Marketing

### Background
- Full-bleed **Caterpillar D10 bulldozer** photograph
- Dark overlay gradient: `rgba(0,0,0,0.55)` for text legibility
- Subtle warm-toned image treatment

### Top Badge
```
[ UT Service Console ]
```
> Pill-shaped badge, dark semi-transparent background, white text  
> Positioned top-center

---

### Hero Headline

```
Enterprise Service
Management
```
> "Enterprise" — white, bold, ~40px  
> "Service" — amber/yellow (`#FBBF24`), bold  
> "Management" — white, bold  

### Hero Subtext
```
Manage cases, work orders, and service resources all
in one place. Built for field operations teams at scale.
```
> White, ~14px, muted opacity (~85%)

---

### Feature List Panel

Dark semi-transparent card (`rgba(0,0,0,0.5)` + backdrop blur), rounded corners, with amber left-border accent.

Each row: **Icon** (amber/yellow) + **Feature Name** (white text)

| Icon | Feature |
|------|---------|
| 🚩 Flag | Case Management |
| ✏️ Pencil | Work Order Tracking |
| 📊 Bar Chart | SLA Monitoring |
| ⊞ Grid | Asset Management |
| 👥 People | Contact Management |
| 🔧 Wrench | Field Service |

> **Note**: "Contact Management" and "Field Service" are newly added below "Asset Management"

---

### Bottom Status Badge
```
● MVP v1.0  —  All Systems Operational
```
> Pill badge, dark semi-transparent  
> Green dot indicator for operational status  
> Positioned bottom-center of hero panel

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#FBBF24` | CTA button, accents, highlights |
| `--color-dark` | `#111827` | Headlines, body text |
| `--color-muted` | `#6B7280` | Placeholder, subtitles |
| `--color-border` | `#E5E7EB` | Input borders, dividers |
| `--color-white` | `#FFFFFF` | Hero text, panel backgrounds |
| `--color-overlay` | `rgba(0,0,0,0.55)` | Hero background overlay |
| `--color-card` | `rgba(0,0,0,0.50)` | Feature list card background |

---

## Typography

| Element | Style |
|---------|-------|
| Page headline ("Welcome back") | Bold, 28–32px |
| Form labels | Medium, 14px, dark |
| Input placeholder | Regular, 14px, muted |
| CTA button | Bold, 16px |
| Hero headline | Bold, 36–42px |
| Hero subtext | Regular, 14px, white 85% opacity |
| Feature list items | Medium, 15px, white |
| Footer / badges | Regular, 12px, muted |

---

## Component Specs

### Input Field
```
border: 1px solid #E5E7EB
border-radius: 8px
padding: 12px 16px
focus: border-color: #FBBF24; box-shadow: 0 0 0 3px rgba(251,191,36,0.2)
```

### Primary Button (Sign In)
```
background: #FBBF24
color: #1F2937
border-radius: 9999px
padding: 14px 24px
font-weight: 700
width: 100%
hover: background: #F59E0B
```

### SSO Button
```
background: #FFFFFF
border: 1px solid #E5E7EB
border-radius: 9999px
padding: 12px 24px
width: 100%
display: flex
align-items: center
gap: 8px
```

### Feature Card Item
```
display: flex
align-items: center
gap: 12px
padding: 10px 16px
icon-color: #FBBF24
text-color: #FFFFFF
font-size: 15px
```

---

## Accessibility Notes

- All form inputs must have associated `<label>` elements
- Color contrast ratio for body text on white: ≥ 7:1
- Color contrast ratio for white text on dark overlay: ≥ 4.5:1
- Focus indicators visible for keyboard navigation (yellow ring)
- Password toggle button labeled for screen readers
- `aria-label` on icon-only buttons

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Hide right hero panel; show only login form full-width |
| `768px–1024px` | Both panels visible; reduced hero text size |
| `> 1024px` | Full split-screen layout as designed |
