# OPERATIONS Platform — Design Specification
## Service Appointment (SA) Module + Field Service Module
### UI Design Guide · Light & Dark Mode · v1.0.0

> **Platform:** OPERATIONS CRM v4.2.0-stable  
> **Fonts:** Hanken Grotesk (body/headings) · JetBrains Mono (labels/codes)  
> **Icons:** Material Symbols Outlined  
> **Theme Engine:** Tailwind CSS (`darkMode: "class"` — toggle via `<html class="dark">`)

---

## Table of Contents

1. [Design Token Reference](#1-design-token-reference)
2. [Global Navigation — Module Tab Additions](#2-global-navigation--module-tab-additions)
3. [SA Module — Service Appointment](#3-sa-module--service-appointment)
   - 3.1 SA List View
   - 3.2 SA Detail View
   - 3.3 Book Appointment Modal
4. [Field Service Module](#4-field-service-module)
   - 4.1 Layout: Three-Panel Architecture
   - 4.2 Left Panel — SA Queue (Drag Source)
   - 4.3 Center Panel — Gantt Chart (Drop Target)
   - 4.4 Right Panel — SA Detail Side Sheet
   - 4.5 Dispatch Map View
5. [Component Library](#5-component-library)
   - 5.1 Status Badges
   - 5.2 SA Drag Cards
   - 5.3 Gantt Blocks
   - 5.4 Capacity Bar
6. [Light Mode Spec](#6-light-mode-spec)
7. [Dark Mode Spec](#7-dark-mode-spec)
8. [Interaction & Motion Spec](#8-interaction--motion-spec)

---

## 1. Design Token Reference

### 1.1 Color Tokens — Light Mode

```
Token                       Hex        Usage
──────────────────────────────────────────────────────────────────
background                  #f9f9f9    App background
surface                     #f9f9f9    Card, panel background
surface-bright              #f9f9f9    Top surfaces, hero areas
surface-container-lowest    #ffffff    Input fields, modals
surface-container-low       #f3f3f3    Subtle section backgrounds
surface-container           #eeeeee    Chip, badge background
surface-container-high      #e8e8e8    Hover states
surface-container-highest   #e2e2e2    Pressed states
surface-variant             #e2e2e2    Borders, dividers
surface-dim                 #dadada    Disabled backgrounds
on-surface                  #1a1c1c    Primary body text
on-surface-variant          #4d4632    Secondary / caption text
outline                     #7f7660    Input borders, dividers
outline-variant             #d1c6ab    Subtle borders

primary                     #725c00    Text on yellow, focus rings
primary-container           #f5c800    ★ PRIMARY ACTION COLOR (yellow)
primary-fixed               #ffe081    Hover on primary
primary-fixed-dim           #eec200    Active / pressed primary
on-primary                  #ffffff    Text on primary-dark bg
on-primary-container        #695400    Text on yellow buttons
on-primary-fixed            #231b00    Text on hover yellow
inverse-primary             #eec200    Primary in dark contexts

secondary                   #5f5e5e    Secondary actions
secondary-container         #e5e2e1    Secondary badge bg
secondary-fixed             #e5e2e1    Secondary input bg
secondary-fixed-dim         #c8c6c5    Secondary border
on-secondary                #ffffff    Text on dark secondary
on-secondary-container      #656464    Text on secondary badge
on-secondary-fixed          #1c1b1b    Text on secondary input
on-secondary-fixed-variant  #474646    Caption on secondary

tertiary                    #5d5f5f    Neutral supporting text
tertiary-container          #cdcdcd    Neutral badge bg
tertiary-fixed              #e2e2e2    Neutral surface
tertiary-fixed-dim          #c6c6c6    Neutral border
on-tertiary                 #ffffff    Text on tertiary dark
on-tertiary-container       #555757    Text on neutral badge
on-tertiary-fixed           #1a1c1c    Text on neutral surface
on-tertiary-fixed-variant   #454747    Caption on neutral

error                       #ba1a1a    Danger text, overdue
error-container             #ffdad6    Error / absence bg
on-error                    #ffffff    Text on error dark
on-error-container          #93000a    Text on error bg

inverse-surface             #2f3131    Dark elevation surfaces
inverse-on-surface          #f1f1f1    Text on dark surfaces
surface-tint                #725c00    Tint overlay
```

---

### 1.2 Color Tokens — Dark Mode Mapping

```
Light Token                 → Dark Equivalent      Hex (Dark)
──────────────────────────────────────────────────────────────────
background                  → dark-bg              #111314
surface                     → dark-surface         #1a1c1c
surface-container-lowest    → dark-card            #1f2122
surface-container-low       → dark-section         #252728
surface-container           → dark-elevated        #2a2c2d
surface-container-high      → dark-hover           #2f3131
surface-container-highest   → dark-pressed         #333636
surface-variant             → dark-border          #3a3d3e
outline                     → dark-outline         #7f7660
outline-variant             → dark-outline-subtle  #4d4632
on-surface                  → dark-text-primary    #f1f1f1
on-surface-variant          → dark-text-secondary  #c6c6c6
primary-container           → dark-primary-btn     #695400
primary-fixed-dim           → dark-primary-active  #eec200
inverse-primary             → dark-primary-accent  #eec200
on-primary-fixed            → dark-primary-text    #231b00
error                       → dark-error           #ff897d
error-container             → dark-error-bg        #93000a
on-error-container          → dark-error-text      #ffdad6
```

---

### 1.3 Typography Scale

```
Token             Font               Size    Line   Weight  Letter
──────────────────────────────────────────────────────────────────────
headline-lg       Hanken Grotesk    32px    40px   700     -0.02em
headline-md       Hanken Grotesk    24px    32px   600
headline-sm       Hanken Grotesk    20px    28px   600
body-lg           Hanken Grotesk    18px    28px   400
body-md           Hanken Grotesk    16px    24px   400
body-sm           Hanken Grotesk    14px    20px   400
label-md          JetBrains Mono    14px    16px   500     +0.02em
label-sm          JetBrains Mono    12px    14px   500     +0.05em
```

---

### 1.4 Spacing & Radius

```
Spacing Token     Value     Usage
────────────────────────────────────────────
xs                4px       Chip padding, icon gap
sm                8px       Card inner gap, badge padding
md                16px      Section inner padding
lg / margin       24px      Page section gap
xl                32px      Page top margin
page-padding      24px      Page horizontal padding
height-top-bar    56px      Fixed navigation bar
grid-col-1        280px     Left sidebar width

Border Radius:
DEFAULT           2px       Buttons, inputs, chips
lg                4px       Cards, blocks
xl                8px       Modals, large panels
full              12px      Avatar, pill badges
```

---

## 2. Global Navigation — Module Tab Additions

### 2.1 Navigation Structure

The left sidebar navigation (fixed, 280px) is extended with two new modules:

```
OPERATIONS (logo)
v4.2.0-stable

──── MAIN NAVIGATION ────────────────────────
  🔲  Overview
  📅  Schedule
  🚚  Dispatch
  📊  Analytics
  📄  Reports

──── [NEW] MODULES ──────────────────────────  ← New section header
  📋  Service Appointments        ← NEW MODULE
  🛠️  Field Service               ← NEW MODULE

──── ADMINISTRATION ─────────────────────────
  ⚙️  Field Configuration
  
──── BOTTOM ─────────────────────────────────
  🎧  Support
  ⬤   System Status
```

---

### 2.2 Nav Item — Light Mode

```
State         Background              Text Color        Left Border
──────────────────────────────────────────────────────────────────
Default       transparent             on-surface        none
Hover         surface-container-high  on-surface        none
Active        primary-container       on-primary-fixed  3px solid primary
```

**Active Nav Item (Light):**
```
┌──────────────────────────────────────────┐
│ ▐  🛠️  Field Service                     │
│    [left-border: 3px #725c00]            │
│    [bg: #f5c800]  [text: #231b00]        │
└──────────────────────────────────────────┘
```

---

### 2.3 Nav Item — Dark Mode

```
State         Background    Text Color
──────────────────────────────────────
Default       transparent   #f1f1f1
Hover         #2f3131       #f1f1f1
Active        #695400       #eec200
```

---

### 2.4 Module Section Divider

```css
/* Light */
.nav-section-label {
  font-family: 'JetBrains Mono';
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #7f7660;        /* outline */
  text-transform: uppercase;
  padding: 16px 24px 4px;
}

/* Dark */
.dark .nav-section-label {
  color: #4d4632;        /* outline-variant */
}
```

---

## 3. SA Module — Service Appointment

### 3.1 SA List View — Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  PAGE HEADER (bg: surface-container-lowest)                      │
│  ┌──────────────────────┐  ┌────────────────┐  ┌─────────────┐  │
│  │  Service Appointments│  │ ⚙ Filter       │  │ + New SA    │  │
│  │  [headline-md]       │  │ [ghost button] │  │ [primary]   │  │
│  └──────────────────────┘  └────────────────┘  └─────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│  FILTER BAR (bg: surface-container-low)                          │
│  [ All ] [ Scheduled ] [ Dispatched ] [ In Progress ] [Overdue]  │
│  Quick filter chips — JetBrains Mono label-sm                    │
├──────────────────────────────────────────────────────────────────┤
│  SA TABLE                                                        │
│  ┌──────┬───────────┬───────────┬──────────┬────────┬────────┐  │
│  │ SA # │ Subject   │ Sched.    │ Resource │ Status │ Action │  │
│  ├──────┼───────────┼───────────┼──────────┼────────┼────────┤  │
│  │SA-001│PM Service │ Oct 23,   │Budi S.   │[SCHED] │ ··· ▸  │  │
│  │      │Excv C320  │ 08:00-17h │          │        │        │  │
│  ├──────┼───────────┼───────────┼──────────┼────────┼────────┤  │
│  │SA-002│Emergency  │ Oct 23,   │Agus M.   │[DISP]  │ ··· ▸  │  │
│  │      │Repair-Hyd │ 11:00-15h │          │        │        │  │
│  └──────┴───────────┴───────────┴──────────┴────────┴────────┘  │
│  Showing 1–10 of 42 records          [◀] [1] [2] [3] [▶]        │
└──────────────────────────────────────────────────────────────────┘
```

---

### 3.2 SA List View — Color Spec

**Light Mode:**
```
Page bg                 #f9f9f9   (background)
Table header row        #f3f3f3   (surface-container-low)
Table header text       #4d4632   (on-surface-variant) JetBrains Mono 12px
Table row bg            #ffffff   (surface-container-lowest)
Table row hover         #f3f3f3   (surface-container-low)
Table row border        #e2e2e2   (surface-variant)
SA # cell text          #725c00   (primary)  — monospace
Subject text            #1a1c1c   (on-surface)
Subtext (asset name)    #4d4632   (on-surface-variant)
Time text               #4d4632   JetBrains Mono
Resource name           #1a1c1c
Filter chip — selected  #f5c800 bg / #695400 text
Filter chip — default   #eeeeee bg / #4d4632 text
```

**Dark Mode:**
```
Page bg                 #111314
Table header row        #252728
Table header text       #c6c6c6
Table row bg            #1f2122
Table row hover         #252728
Table row border        #3a3d3e
SA # cell text          #eec200   (inverse-primary)
Subject text            #f1f1f1
Subtext                 #c6c6c6
Filter chip — selected  #695400 bg / #eec200 text
Filter chip — default   #2a2c2d bg / #c6c6c6 text
```

---

### 3.3 SA Detail View — Panel Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ ← Back   SA-00283 · PM Service - Excv C320         [SCHEDULED]     │
│          Work Order WO-9921 · Budi Santoso                         │
├─────────────────────────────────┬──────────────────────────────────┤
│ SCHEDULING                      │ ACTUALS                          │
│ ┌─────────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ Scheduled Start             │ │ │ Actual Start                 │ │
│ │ Mon, Oct 23 · 08:00         │ │ │ —                            │ │
│ │                             │ │ │                              │ │
│ │ Scheduled End               │ │ │ Actual End                   │ │
│ │ Mon, Oct 23 · 17:00         │ │ │ —                            │ │
│ │                             │ │ │                              │ │
│ │ Duration: 9h (540 min)      │ │ │ Actual Duration              │ │
│ │ Earliest Start: Oct 20      │ │ │ — min                        │ │
│ │ Due Date: Oct 25            │ │ └──────────────────────────────┘ │
│ └─────────────────────────────┘ │                                  │
├─────────────────────────────────┴──────────────────────────────────┤
│ LOCATION                                                           │
│ Address: Site A, Jl. Industri Raya No.12, Jakarta                 │
│ Territory: JKT ST (Jakarta)   ○ Offsite Appointment               │
├────────────────────────────────────────────────────────────────────┤
│ STAKEHOLDERS                                                       │
│ Account: PT Indotech            Contact: Pak Rudi Hartono          │
│ Work Type: Preventive Maintenance                                  │
├────────────────────────────────────────────────────────────────────┤
│ DESCRIPTION & NOTES                                                │
│ ┌──────────────────────────────────────────────────────────────┐  │
│ │ [description text area]                                      │  │
│ └──────────────────────────────────────────────────────────────┘  │
│ Service Note:                                                      │
│ ┌──────────────────────────────────────────────────────────────┐  │
│ │ [service note text area]                                     │  │
│ └──────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│ SYSTEM                              [ Save Changes ]               │
│ Schedule Mode: — · Transaction: —                                  │
└────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 SA Detail View — Color Spec

**Light Mode:**
```
Page bg                   #f9f9f9
Header area bg            #ffffff  (surface-container-lowest)
Header SA number          #725c00  JetBrains Mono label-md
Header subject            #1a1c1c  Hanken Grotesk headline-sm
Header WO reference       #4d4632  body-sm with underline hover
Section label             #7f7660  JetBrains Mono label-sm UPPERCASE
Section card bg           #ffffff  (surface-container-lowest)
Section card border       #d1c6ab  (outline-variant)
Field label               #4d4632  (on-surface-variant) body-sm
Field value               #1a1c1c  (on-surface) body-md
Input bg                  #ffffff  (surface-container-lowest)
Input border              #7f7660  (outline)
Input focus border        #f5c800  (primary-container)
Divider                   #e2e2e2  (surface-variant)
Save button bg            #f5c800  (primary-container)
Save button text          #695400  (on-primary-container)
Save button hover         #eec200  (primary-fixed-dim)
```

**Dark Mode:**
```
Page bg                   #111314
Header area bg            #1f2122
Header SA number          #eec200  (inverse-primary)
Header subject            #f1f1f1
Header WO reference       #c6c6c6
Section label             #7f7660  JetBrains Mono
Section card bg           #1f2122
Section card border       #3a3d3e
Field label               #c6c6c6
Field value               #f1f1f1
Input bg                  #252728
Input border              #4d4632
Input focus border        #eec200
Divider                   #3a3d3e
Save button bg            #695400  (dark primary button)
Save button text          #eec200
Save button hover         #564500
```

---

### 3.5 Book Appointment Modal

```
┌──────────────────────────────────────────────────────────────────┐
│  [×]                    Book Appointment                         │
│  Work Order WO-9921 · PM Service Excv C320                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Subject *                                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PM Service - Excavator C320                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │ Scheduled Start *           │  │ Scheduled End *         │  │
│  │ 📅 Oct 23, 2024  08:00 ▾   │  │ 📅 Oct 23, 2024 17:00 ▾│  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │ Duration *       9    ▾ hrs│  │ Service Territory *     │  │
│  └─────────────────────────────┘  │ JKT ST (Jakarta)    ▾   │  │
│                                   └─────────────────────────┘  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │ Earliest Start Permitted    │  │ Due Date                │  │
│  │ 📅 Oct 20, 2024       ▾    │  │ 📅 Oct 25, 2024     ▾   │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │ Arrival Window Start        │  │ Arrival Window End      │  │
│  │ 📅 Oct 23  07:30       ▾   │  │ 📅 Oct 23  09:00    ▾   │  │
│  └─────────────────────────────┘  └─────────────────────────┘  │
│                                                                  │
│  ☐  Offsite Appointment  (no travel time added)                 │
│                                                                  │
│  Description                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│             [  Cancel  ]     [ ★ Book Appointment ]             │
└──────────────────────────────────────────────────────────────────┘
```

**Modal Color Spec — Light:**
```
Overlay backdrop          rgba(0,0,0,0.4)
Modal bg                  #ffffff   (surface-container-lowest)
Modal border              #d1c6ab   (outline-variant)
Modal border-radius       8px       (xl)
Header bg                 #f3f3f3   (surface-container-low)
Header title              #1a1c1c   Hanken Grotesk headline-sm
Header WO ref             #725c00   JetBrains Mono label-md
Input border              #7f7660
Input bg                  #ffffff
Input focus               2px solid #f5c800
Label                     #4d4632   body-sm
Book button               #f5c800 bg / #695400 text
Cancel button             transparent / #4d4632 text, border #7f7660
```

**Modal Color Spec — Dark:**
```
Overlay backdrop          rgba(0,0,0,0.7)
Modal bg                  #1f2122
Modal border              #3a3d3e
Header bg                 #252728
Header title              #f1f1f1
Header WO ref             #eec200
Input border              #4d4632
Input bg                  #252728
Input focus               2px solid #eec200
Label                     #c6c6c6
Book button               #695400 bg / #eec200 text
Cancel button             transparent / #c6c6c6 text, border #4d4632
```

---

## 4. Field Service Module

### 4.1 Layout: Three-Panel Architecture

The Field Service module uses a **three-panel layout** filling the full viewport (minus the left sidebar):

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (56px fixed)                                                   │
│  OPERATIONS ▸ Field Service     [GANTT] [MAP]  [Filter ▾] [+ New SA]   │
├──────────────────┬──────────────────────────────────────────────────────┤
│                  │                                                       │
│  LEFT PANEL      │  CENTER PANEL                                        │
│  320px fixed     │  Fluid (fills remaining width)                       │
│                  │                                                       │
│  SA QUEUE        │  GANTT CHART                                         │
│  ──────────      │  ──────────────────────────────────────────────────  │
│  [Drag SA cards] │  Time axis (08:00 → 17:00)                          │
│  to Gantt rows   │  Resource rows with drop zones                       │
│                  │                                                       │
│  SERVICE         │  Resource 1: A25 P784FJC        [SA block][SA block]│
│  APPOINTMENTS    │  Resource 2: Agus Mizni                   [SA block]│
│  (42)            │  Resource 3: Budi Apvans  [SA block]                │
│                  │                                                       │
│  ┌─────────────┐ │                                                       │
│  │ SA-09283    │ │                                                       │
│  │ PM Service  │ │                                                       │
│  │ ⏱ 2H ⊙Site│ │                                                       │
│  │ [NEW]       │ │                                                       │
│  └─────────────┘ │                                                       │
│  ┌─────────────┐ │                                                       │
│  │ SA-09284    │ │                                                       │
│  │ Emergency   │ │                                                       │
│  │ ⏱ 4H ⊙Site│ │                                                       │
│  │ [DISPATCHED]│ │                                                       │
│  └─────────────┘ │                                                       │
│                  │                                                       │
└──────────────────┴──────────────────────────────────────────────────────┘
```

When an SA card is clicked in the right side, a **detail side-sheet** slides in from the right:

```
┌──────────────┬───────────────────────────────┬────────────────────────┐
│  LEFT PANEL  │  CENTER PANEL (compressed)    │  RIGHT SIDE-SHEET      │
│  SA QUEUE    │  GANTT CHART                  │  SA DETAIL (400px)     │
│              │                               │  ─────────────────     │
│              │                               │  SA-09284              │
│              │                               │  Emergency Repair      │
│              │                               │  Status / Fields...    │
│              │                               │  [Close ×]             │
└──────────────┴───────────────────────────────┴────────────────────────┘
```

---

### 4.2 Left Panel — SA Queue (Drag Source)

#### Panel Structure:
```
┌────────────────────────────────────┐
│  SERVICE APPOINTMENTS   ···        │  ← Header row
│  (42)                              │    label-sm JetBrains Mono
│  ┌──────────────────────────────┐  │
│  │ 🔍 Search SA...              │  │  ← Search input
│  └──────────────────────────────┘  │
│                                    │
│  Filter: [ All ▾ ]                 │  ← Status filter
│                                    │
│  ──── UNASSIGNED (12) ──────────   │  ← Sub-section divider
│                                    │
│  ┌── SA CARD (draggable) ───────┐  │
│  │ ≡  SA-09283        [NEW]     │  │
│  │    PM Service · Excv C320    │  │
│  │    ⏱ 2H  ⊙ Site A           │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌── SA CARD (draggable) ───────┐  │
│  │ ≡  SA-09284    [DISPATCHED]  │  │
│  │    Emergency Repair · Hyd    │  │
│  │    ⏱ 4H  ⊙ Site B           │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌── SA CARD (draggable) ───────┐  │
│  │ ≡  SA-09285        [NEW]     │  │
│  │    Inspection Routine        │  │
│  │    ⏱ 1.5H  ⊙ Base           │  │
│  └──────────────────────────────┘  │
│                                    │
│  ──── SCHEDULED (30) ───────────   │
│  [collapsed, click to expand]      │
│                                    │
└────────────────────────────────────┘
```

#### SA Card Color Spec — Light:
```
Card bg                   #ffffff   (surface-container-lowest)
Card border               #d1c6ab   (outline-variant)
Card border-radius        4px       (lg)
Card drag handle (≡)      #7f7660   (outline)  — left edge icon
Card hover bg             #f3f3f3   (surface-container-low)
Card dragging bg          #f5c800   (primary-container) + shadow elevation
Card dragging opacity     0.9
Card dragging cursor      grabbing
SA number text            #725c00   JetBrains Mono label-md
SA subject                #1a1c1c   Hanken Grotesk body-sm bold
SA subtext                #4d4632   body-sm
Icon (clock, pin)         #7f7660   material-symbols 14px
Section divider           #e2e2e2   (surface-variant)
Section label             #7f7660   JetBrains Mono label-sm
Panel bg                  #f3f3f3   (surface-container-low)
Panel border-right        #d1c6ab   (outline-variant)
```

#### SA Card Color Spec — Dark:
```
Card bg                   #1f2122
Card border               #3a3d3e
Card hover bg             #252728
Card dragging bg          #695400   + elevated shadow
SA number text            #eec200   (inverse-primary)
SA subject                #f1f1f1
SA subtext                #c6c6c6
Icon                      #7f7660
Section divider           #3a3d3e
Section label             #4d4632
Panel bg                  #1a1c1c
Panel border-right        #3a3d3e
```

---

### 4.3 Center Panel — Gantt Chart (Drop Target)

#### Gantt Structure:
```
┌─────────────────────────────────────────────────────────────────────┐
│  GANTT TOOLBAR                                                      │
│  [◀]  Tue, 20 May 2026  [▶]  [Today]   [Day] [Week] [Month]  [≡]  │
├────────────────────────────────────────────────────────────────────┤
│  RESOURCES        │ 08:00 │ 09:00 │ 10:00 │ 11:00 │ 12:00 │ … │  │
│  (24)             │       │       │       │       │       │   │  │
├───────────────────┼───────┼───────┼───────┼───────┼───────┼───┤  │
│ [Avatar]          │       │[BLOCK]│       │       │       │   │  │
│ A25 P784FJC       │       │SA-091 │       │       │       │   │  │
│ ● Heavy Equip     │       │SitePrep       │       │       │   │  │
├───────────────────┼───────┼───────┼───────┼───────┼───────┼───┤  │
│ [Avatar]          │       │       │       │[BLOCK]│       │   │  │
│ Agus Mizni        │       │       │       │SA-092 │       │   │  │
│ ● Preventative    │       │       │       │Emerg. │       │   │  │
├───────────────────┼───────┼───────┼───────┼───────┼───────┼───┤  │
│ [Avatar]          │[BLOCK]│       │       │       │       │   │  │
│ Budi Apvans       │SA-098 │       │       │       │       │   │  │
│ ● Diagnostics     │MornIn.│       │       │       │       │   │  │
└───────────────────┴───────┴───────┴───────┴───────┴───────┴───┘  │
```

#### Drop Zone Behavior:
```
State                     Visual
─────────────────────────────────────────────────────────────
Default cell              bg: transparent
Hover while dragging      bg: rgba(245,200,0,0.15) / border: 2px dashed #f5c800
Valid drop target         ✅ green ring: rgba(0,200,100,0.2)
Conflict warning          ❌ red ring: rgba(186,26,26,0.2) + tooltip "Conflict"
Dropped / placed          SA block appears with drop animation
```

#### Gantt Grid Color Spec — Light:
```
Grid bg                   #f9f9f9   (background)
Resource column bg        #ffffff   (surface-container-lowest)
Resource column border    #e2e2e2   (surface-variant)
Header row bg             #f3f3f3   (surface-container-low)
Header text               #4d4632   JetBrains Mono label-sm
Grid lines                #e2e2e2   (surface-variant) 1px
Time column line          #d1c6ab   (outline-variant)
Today column bg           rgba(245,200,0,0.08)
Today column left border  2px solid #f5c800
Current time line         2px solid #f5c800  (vertical red-line equivalent in brand)
Weekend cells             #f0f0f0 bg + opacity 0.5
Resource name             #1a1c1c   Hanken Grotesk body-sm bold
Resource sub-label        #4d4632   label-sm
Resource avatar ring      #d1c6ab   (outline-variant)
```

#### Gantt Grid Color Spec — Dark:
```
Grid bg                   #111314
Resource column bg        #1a1c1c
Resource column border    #3a3d3e
Header row bg             #1f2122
Header text               #c6c6c6
Grid lines                #2a2c2d
Today column bg           rgba(238,194,0,0.06)
Today column left border  2px solid #eec200
Current time line         2px solid #eec200
Weekend cells             #1a1c1c bg + opacity 0.4
Resource name             #f1f1f1
Resource sub-label        #c6c6c6
Resource avatar ring      #3a3d3e
```

---

### 4.4 Gantt SA Blocks — Visual Spec

#### Block Types:

**Type A — Confirmed / Assigned Block:**
```
Light:
┌─────────────────────────────────┐
│ SA-091…              ✎          │  ← edit icon on hover
│ Site Prep                       │
└─────────────────────────────────┘
bg: #1a1c1c  text: #ffffff  border: 1px solid #121212
border-radius: 4px
font: JetBrains Mono 10px

Dark:
bg: #2f3131  text: #f1f1f1  border: 1px solid #4d4632
```

**Type B — Tentative / Pending Block:**
```
Light:
bg: #f0f0f0  text: #575757  border: 1px dashed #E0E0E0
Dark:
bg: #252728  text: #c6c6c6  border: 1px dashed #3a3d3e
```

**Type C — Active / In Progress Block (brand yellow):**
```
Light:
bg: #f5c800  text: #231b00  border: 1px solid #eec200
Dark:
bg: #695400  text: #eec200  border: 1px solid #564500
```

**Type D — Absence / Leave Block:**
```
Light:
bg: #ffdad6  text: #93000a  border: 1px solid #ba1a1a
Dark:
bg: #93000a  text: #ffdad6  border: 1px solid #ff897d
```

**Type E — Dropped / Just Assigned (animated):**
```
Entry animation: scale(0.8) → scale(1), opacity 0 → 1, 200ms ease-out
Initial bg flash: rgba(245,200,0,0.4) → normal block color, 400ms
```

---

### 4.5 Dispatch Map View

Toggle between `[GANTT]` and `[MAP]` views via the toolbar.

```
┌───────────────────────────────────────────────────────────────────┐
│  LEFT PANEL (SA Queue)        │  MAP PANEL                        │
│  [same as Gantt left panel]   │  ┌─────────────────────────────┐  │
│                               │  │                             │  │
│  ACTIVE DISPATCHES     12     │  │   [Interactive Map]         │  │
│  ─────────────────────────    │  │                             │  │
│  ┌──────────────────────────┐ │  │   ● SA-69284 [ON-SITE]      │  │
│  │ SA-69284    [ON-SITE]    │ │  │   → SA-69285 [IN TRANSIT]   │  │
│  │ Agus Mizmi               │ │  │   → SA-69286 [IN TRANSIT]   │  │
│  │ ETA: ──                  │ │  │                             │  │
│  └──────────────────────────┘ │  │   ◎ SITE ALPHA              │  │
│  ┌──────────────────────────┐ │  │                             │  │
│  │ SA-69285    [IN TRANSIT] │ │  └─────────────────────────────┘  │
│  │ Sarah Jenkins             │ │                                   │
│  │ ETA: 14 mins             │ │  ┌─────────────────────────────┐  │
│  └──────────────────────────┘ │  │ SELECTED: SA-69284          │  │
│                               │  │ Agus Mizmi                  │  │
│                               │  │ Senior Field Technician     │  │
│                               │  │ Status: ON-SITE  1h 42m     │  │
│                               │  │ 73% Work Progress           │  │
│                               │  │ [Call]  [Message]           │  │
│                               │  └─────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

### 4.6 Right Panel — SA Detail Side Sheet

Slides in from the right (400px) when an SA block is clicked on the Gantt.

```
┌─────────────────────────────────────────────────┐
│  [×]   SA-09284                    [DISPATCHED] │
│        Emergency Repair - Hydraulic             │
│        Work Order: WO-4891                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  RESOURCE ASSIGNMENT                            │
│  Assigned To: Agus Mizni                        │
│  [Change Resource ▾]                            │
│                                                 │
├─────────────────────────────────────────────────┤
│  SCHEDULING                                     │
│  Scheduled Start   Mon, Oct 23 · 11:00          │
│  Scheduled End     Mon, Oct 23 · 15:00          │
│  Duration          4h (240 min)                 │
│                                                 │
│  Arrival Window    10:30 – 11:30                │
│  Due Date          Oct 25, 2024                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  LOCATION                                       │
│  Site B, Kawasan Industri MM2100                │
│  Territory: JKT ST (Jakarta)                    │
│                                                 │
├─────────────────────────────────────────────────┤
│  ACTUALS                                        │
│  Actual Start      ——                           │
│  Actual End        ——                           │
│  Actual Duration   —— min                       │
│                                                 │
├─────────────────────────────────────────────────┤
│  SERVICE NOTE                                   │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [ Save Note ]           [ Open Full Record → ]│
└─────────────────────────────────────────────────┘
```

**Side Sheet Color Spec — Light:**
```
Sheet bg                  #ffffff   (surface-container-lowest)
Sheet border-left         1px solid #d1c6ab   (outline-variant)
Sheet shadow              -8px 0 24px rgba(0,0,0,0.08)
Header bg                 #f3f3f3   (surface-container-low)
Header SA number          #725c00   JetBrains Mono label-md
Header subject            #1a1c1c   headline-sm
Header WO ref             #4d4632   body-sm
Section label             #7f7660   JetBrains Mono label-sm UPPERCASE
Field label               #4d4632   body-sm
Field value               #1a1c1c   body-md
Divider                   #e2e2e2   (surface-variant)
Save Note btn             #f5c800 bg / #695400 text
Open Full Record btn      transparent / #725c00 text, underline
```

**Side Sheet Color Spec — Dark:**
```
Sheet bg                  #1f2122
Sheet border-left         1px solid #3a3d3e
Sheet shadow              -8px 0 24px rgba(0,0,0,0.4)
Header bg                 #252728
Header SA number          #eec200
Header subject            #f1f1f1
Header WO ref             #c6c6c6
Section label             #4d4632
Field label               #c6c6c6
Field value               #f1f1f1
Divider                   #3a3d3e
Save Note btn             #695400 bg / #eec200 text
Open Full Record btn      transparent / #eec200 text, underline
```

---

## 5. Component Library

### 5.1 Status Badges

All badges use JetBrains Mono label-sm, border-radius: 12px (full), padding: 2px 8px.

```
Status          Light (bg / text)           Dark (bg / text)
──────────────────────────────────────────────────────────────────
NEW             #f5c800 / #695400           #695400 / #eec200
SCHEDULED       #e5e2e1 / #1c1b1b           #474646 / #e5e2e1
DISPATCHED      #e2e2e2 / #4d4632           #3a3d3e / #c6c6c6
IN PROGRESS     #f5c800 / #695400           #695400 / #eec200
ON-SITE         #1a1c1c / #f1f1f1           #f1f1f1 / #1a1c1c
COMPLETED       #dadada / #1a1c1c           #2f3131 / #c6c6c6
CANNOT COMPL.   #ffdad6 / #93000a           #93000a / #ffdad6
CANCELED        #ffdad6 / #93000a           #93000a / #ffdad6
OVERDUE         #ba1a1a / #ffffff           #ff897d / #1a1c1c
```

---

### 5.2 SA Drag Card — Full Anatomy

```
┌─────────────────────────────────────┐  ← border: 1px solid outline-variant
│  ≡   SA-09283              [NEW]    │  ← drag handle (left) + SA number + badge
│      PM Service · Excv C320        │  ← subject (body-sm bold) · subtext
│      ⏱ 2H  ⊙ Site A               │  ← duration icon + location icon
└─────────────────────────────────────┘

Sizing:
  width: 100%  (fills left panel minus 16px padding each side)
  min-height: 72px
  padding: 10px 12px

States:
  default     → border: outline-variant, bg: surface-container-lowest
  hover       → bg: surface-container-low, cursor: grab
  dragging    → bg: primary-container (#f5c800), shadow: 0 8px 24px rgba(0,0,0,0.15), cursor: grabbing
  ghost       → opacity: 0.4 (original card position during drag)
```

---

### 5.3 Gantt Block — Full Anatomy

```
Block Heights:
  Standard (1-4hr block):    min-height: 40px
  Long (5hr+ block):         min-height: 60px
  Compact (< 1hr):           min-height: 28px

Block Content:
  Top line:   [SA Number][Status dot if In Progress]
  Bottom line: [Job type truncated]

Block States:
  default     → normal bg/border per type
  hover       → brightness +5%, cursor: pointer, show resize handles
  selected    → 2px ring in primary-container color (#f5c800)
  dragging    → opacity 0.7, elevated shadow
  resize      → cursor: ew-resize, right edge highlighted
```

---

### 5.4 Capacity Bar

Used in the left panel SA Queue header and in resource rows.

```
Structure:
  ┌─ label ───────────────────────────────── percent ─┐
  │  32/40h Used                                  80% │
  └────────────────────────────────────────────────────┘
  [████████████████░░░░]   ← progress bar, height: 4px

Color states (light):
  0–79%      bar: #f5c800 (primary-container), label: on-surface
  80–99%     bar: #f5c800, percent text: primary (#725c00) bold
  100%        bar: #ba1a1a (error), percent text: error, label: error

Color states (dark):
  0–79%      bar: #eec200, label: #f1f1f1
  80–99%     bar: #eec200, percent: #eec200 bold
  100%        bar: #ff897d, percent: #ff897d
```

---

## 6. Light Mode Spec

### Summary Color System — Light

```css
:root {
  /* Core surfaces */
  --bg:               #f9f9f9;
  --surface:          #f9f9f9;
  --surface-low:      #f3f3f3;
  --surface-card:     #ffffff;
  --surface-hover:    #e8e8e8;

  /* Text */
  --text-primary:     #1a1c1c;
  --text-secondary:   #4d4632;
  --text-tertiary:    #7f7660;
  --text-disabled:    #c6c6c6;

  /* Brand */
  --brand:            #f5c800;
  --brand-dim:        #eec200;
  --brand-text:       #695400;
  --brand-dark-text:  #231b00;

  /* Borders */
  --border:           #d1c6ab;
  --border-strong:    #7f7660;
  --border-subtle:    #e2e2e2;

  /* Status */
  --error:            #ba1a1a;
  --error-bg:         #ffdad6;
  --error-text:       #93000a;

  /* Nav active */
  --nav-active-bg:    #f5c800;
  --nav-active-text:  #231b00;
  --nav-active-border:#725c00;
}
```

### Key Rules — Light Mode

1. Backgrounds use **#f9f9f9** not pure white — softer, less glare
2. Cards and inputs use **#ffffff** to create subtle elevation
3. Yellow `#f5c800` is used sparingly — only for primary actions, active states, and In Progress SA blocks
4. All monospace text (SA numbers, time codes, labels) uses **JetBrains Mono**
5. Border system: subtle `#d1c6ab` for cards; stronger `#7f7660` for inputs
6. Active navigation item gets a **3px left border** in `#725c00` + `#f5c800` background
7. No pure black — darkest text is `#1a1c1c`

---

## 7. Dark Mode Spec

### Summary Color System — Dark

```css
.dark {
  /* Core surfaces */
  --bg:               #111314;
  --surface:          #1a1c1c;
  --surface-low:      #252728;
  --surface-card:     #1f2122;
  --surface-hover:    #2f3131;

  /* Text */
  --text-primary:     #f1f1f1;
  --text-secondary:   #c6c6c6;
  --text-tertiary:    #7f7660;
  --text-disabled:    #4d4632;

  /* Brand */
  --brand:            #eec200;       /* brighter in dark */
  --brand-dim:        #695400;       /* used for button bg */
  --brand-text:       #eec200;
  --brand-dark-text:  #231b00;

  /* Borders */
  --border:           #3a3d3e;
  --border-strong:    #4d4632;
  --border-subtle:    #2a2c2d;

  /* Status */
  --error:            #ff897d;       /* brighter for dark visibility */
  --error-bg:         #93000a;
  --error-text:       #ffdad6;

  /* Nav active */
  --nav-active-bg:    #695400;
  --nav-active-text:  #eec200;
  --nav-active-border:#eec200;
}
```

### Key Rules — Dark Mode

1. Background hierarchy: `#111314` (app) → `#1a1c1c` (page) → `#1f2122` (card) → `#252728` (section header)
2. Yellow brand color **brightens** slightly in dark mode (`#eec200`) for contrast
3. Primary action buttons use `#695400` background with `#eec200` text
4. Error/danger uses `#ff897d` (brighter) for text on dark, `#93000a` for background
5. Grid lines at `#2a2c2d` — very subtle, no harsh contrast
6. SA drag cards: darker bg `#1f2122` with `#3a3d3e` border, hover at `#252728`
7. No white — lightest color is `#f1f1f1`
8. All shadows intensified: `rgba(0,0,0,0.4)` instead of `rgba(0,0,0,0.08)`

---

## 8. Interaction & Motion Spec

### 8.1 Drag and Drop — SA Card to Gantt

```
Phase 1 — Pickup (mousedown / touchstart):
  Duration: 100ms
  Card scales to 1.02, shadow appears: 0 8px 24px rgba(0,0,0,0.15)
  Card bg transitions to brand yellow (#f5c800 / dark: #695400)
  Original position becomes ghost: opacity 0.4, bg dashed border

Phase 2 — In Flight:
  Card follows cursor (transform: translate)
  Valid drop zones highlight: rgba(245,200,0,0.15) bg + 2px dashed border
  Conflicting cells highlight: rgba(186,26,26,0.15) + red dashed border
  Drop zone tooltip: "Drop here" / "Conflict with [SA-XXXXX]"

Phase 3 — Drop (mouseup on valid zone):
  SA card disappears from queue (fadeOut 150ms)
  SA block appears on Gantt:
    - Entry: scale(0.8) opacity(0) → scale(1) opacity(1), 200ms ease-out
    - Flash: bg rgba(245,200,0,0.5) → normal block color, 400ms

Phase 4 — Drop on Invalid / Cancel (mouseup on invalid zone):
  Card returns to original position: spring animation, 300ms
  Invalid zone flashes red briefly: 200ms
```

---

### 8.2 Side Sheet Open/Close

```
Open (SA block clicked):
  Side sheet slides in from right: translateX(400px) → translateX(0)
  Duration: 250ms, easing: cubic-bezier(0.2, 0, 0, 1)
  Center Gantt panel compresses: width transition 250ms

Close (× button or Escape):
  Side sheet slides out: translateX(0) → translateX(400px)
  Duration: 200ms, easing: cubic-bezier(0.4, 0, 1, 1)
  Center Gantt expands back: 200ms
```

---

### 8.3 Status Badge Transitions

```
Status change (e.g. Scheduled → Dispatched):
  Badge: crossfade between color pairs, 300ms
  New status text: typewriter effect on JetBrains Mono, 200ms
```

---

### 8.4 Theme Toggle

```
Global theme switch (Light ↔ Dark):
  All background, text, border colors:  transition: 200ms ease-in-out
  Gantt grid lines:                     transition: 200ms ease-in-out
  No flash — transitions are smooth
  User preference stored in localStorage key: "ops-theme"
```

---

### 8.5 Gantt Scroll Behavior

```
Horizontal scroll:    smooth, follows time axis
Resource rows:        sticky left column (Resource / Capacity, 200px)
Time header:          sticky top row
Current time line:    auto-scrolls into view on page load
Scroll snap:          off (free scrolling)
```

---

## Appendix A — File References

| File | Purpose |
|---|---|
| `code.html` | Reference Tailwind config, design tokens, existing Gantt implementation |
| `screen.png` | Reference UI screenshots (Schedule tab + Dispatch Console) |
| `FRD-SA-Fields.md` | SA field schema (complete 36-field spec) |
| `FRD-Field-Service-Tracking.md` | Field Service workflow requirements |
| `DESIGN-SA-FieldService-Module.md` | **This document** |

---

## Appendix B — Implementation Checklist

### Navigation
- [ ] Add "MODULES" section header to left nav
- [ ] Add "Service Appointments" nav item with `📋` icon
- [ ] Add "Field Service" nav item with `🛠️` icon
- [ ] Implement active state: 3px left border + primary-container bg
- [ ] Implement dark mode nav tokens

### SA Module
- [ ] SA List view with filter chips
- [ ] SA Detail page (8-section layout)
- [ ] Book Appointment modal (from Work Order Feed tab)
- [ ] Light + dark mode for all SA views

### Field Service Module
- [ ] Three-panel layout (Left Queue / Center Gantt / Right Side Sheet)
- [ ] SA Queue left panel with drag cards
- [ ] Gantt Chart with drop zone highlighting
- [ ] Drag-and-drop SA cards → Gantt resource rows
- [ ] Conflict detection on overlapping drops
- [ ] SA Detail side sheet (slide-in from right)
- [ ] Map view toggle
- [ ] Light + dark mode for all Field Service views

### Interactions
- [ ] Drag pickup animation (scale + shadow)
- [ ] Drop zone highlight (yellow dashed)
- [ ] Block drop animation (scale-in + flash)
- [ ] Side sheet slide-in/out
- [ ] Theme toggle with smooth transition
- [ ] Gantt sticky headers (top + left)

---

*OPERATIONS Platform · UI Design Specification · Confidential Internal Document*  
*v1.0.0 · June 2026*
