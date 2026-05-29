# Dispatch Mechanic — Gantt Chart Dispatch Console Design

> **System:** UT Service Console  
> **Record Type:** Classic Dispatch Console — Mechanic Assignment View  
> **Feature:** Drag-and-drop Gantt chart for assigning Service Appointments to specific mechanics  
> **Layout:** 3-Panel Structure — SA List (Left) · Gantt Chart (Center/Right)  
> **Reference:** UT Service Console screenshot — Classic Dispatch Console  
> **Theme:** ⬛🟨 Black & Yellow — Primary `#F5C800` · Surface `#1A1A1A` · Base `#0D0D0D`

---

## Layout Overview

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#F5C800` | Accent, active states, CTA, drag handle |
| `--color-primary-dark` | `#C9A100` | Hover / pressed primary |
| `--color-primary-light` | `#FFF0A0` | Drop target highlight |
| `--color-bg-base` | `#0D0D0D` | Page / outermost background |
| `--color-surface` | `#1A1A1A` | Panel surfaces, SA list bg |
| `--color-surface-raised` | `#242424` | Gantt row hover, dropdown bg |
| `--color-border` | `#2E2E2E` | Panel dividers, row lines |
| `--color-border-accent` | `#F5C800` | Active tab underline, focused input |
| `--color-gantt-bar` | `#F5C800` | SA assignment bar default |
| `--color-gantt-bar-hover` | `#C9A100` | SA assignment bar hover |
| `--color-gantt-drag` | `#FFF0A0` | Bar while dragging |
| `--color-gantt-drop-zone` | `rgba(245,200,0,0.15)` | Valid drop zone highlight |
| `--color-gantt-grid` | `#2E2E2E` | Gantt hour/day grid lines |
| `--color-gantt-today` | `#F5C800` | Today vertical line |
| `--color-text-primary` | `#F0F0F0` | Body text on dark |
| `--color-text-secondary` | `#A0A0A0` | Muted labels |
| `--color-text-on-primary` | `#0D0D0D` | Text on yellow bars |
| `--color-danger` | `#FF4D4F` | Unassigned / conflict state |
| `--color-success` | `#52C41A` | Completed SA bar |

### Structure Diagram

```
┌─────────────────────────────────────────────────────────────────────┐  bg: #0D0D0D
│  LAYER 1 — Global Top Bar (Search + Navigation Icons)               │  bg: #0D0D0D · border-bottom: 2px #F5C800
├─────────────────────────────────────────────────────────────────────┤
│  LAYER 2 — App Bar (Console Label + "Classic Dispatch Console" tab) │  bg: #1A1A1A · border-bottom: #2E2E2E
├──────────────────┬──────────────────────────────────────────────────┤
│  LAYER 3         │  LAYER 3 — Dispatch Toolbar                      │  bg: #141414 · border-bottom: #2E2E2E
│  SA List Panel   │  (Policy, Filter, GANTT/MAP toggle, Date nav)    │
│  (Left)          ├──────────────────────────────────────────────────┤
│                  │  LAYER 4 — Gantt Chart                            │
│  All Service     │  ┌──────────────┬──────────────────────────────┐  │
│  Appointments    │  │ Mechanic     │  Time Axis (hourly columns)  │  │
│  ─────────────   │  │ Name Column  │  ─────────────────────────── │  │
│  SA rows with    │  │  (fixed)     │  [ SA Bar ══════ ]  drag/drop│  │
│  checkbox,       │  │              │  [ SA Bar ═══ ]              │  │
│  status badge,   │  │              │  ─────────────────────────── │  │
│  earliest start  │  └──────────────┴──────────────────────────────┘  │
└──────────────────┴──────────────────────────────────────────────────┘
```

---

## Layer 1 — Global Top Bar

**Position:** Fixed, full-width, topmost  
**Height:** ~36px  
**Background:** `#0D0D0D`  
**Border-Bottom:** `2px solid #F5C800`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | App launcher grid icon | 4×4 dot grid 18px · icon color `#F5C800` |
| Center | Global Search Bar | Placeholder: "Search…" · bg `#1A1A1A` · border `#2E2E2E` · focus-border `#F5C800` · rounded pill ~320px |
| Right | Icon cluster | Help `?`, Notifications (badge `#F5C800`), User avatar, Settings — icons `#A0A0A0`, hover `#F5C800` |

---

## Layer 2 — App Bar / Console Navigation

**Position:** Below Layer 1, full-width  
**Height:** ~40px  
**Background:** `#1A1A1A`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | "UT Service Console" label | Icon `#F5C800` + text `#F0F0F0` bold 14px |
| Left+1 | **"Classic Dispatch Console"** tab | Active · bg `#2D2600` · text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Center | 500677841 (Work O…) tab | Inactive · text `#A0A0A0` |
| Center+1 | 500677841 (Work O…) tab | Inactive · text `#A0A0A0` |
| Center+2 | sys.admin only — 6… tab | Inactive · text `#A0A0A0` |
| Far Right | `×` close button | icon `#A0A0A0` · hover `#FF4D4F` |

---

## Layer 3 — Dispatch Console Panels

### 3A. Left Panel — SA List

**Width:** ~200px (fixed left)  
**Background:** `#1A1A1A`  
**Border-Right:** `1px solid #2E2E2E`  
**Scroll:** Independent vertical scroll

#### Header Bar

| Component | Detail |
|-----------|--------|
| "All Service Appointments" title | 12px · `#F5C800` · font-weight 600 |
| `[ + ]` add icon | bg `#F5C800` · text `#0D0D0D` · 20px |
| Edit / settings icon | icon `#A0A0A0` · hover `#F5C800` |
| **Match Field Rules** toggle | label `#A0A0A0` · toggle accent `#F5C800` |

#### Date Range Filter

| Component | Detail |
|-----------|--------|
| Start date input | bg `#141414` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` |
| End date input | same styling |
| Calendar icon | `#A0A0A0` · hover `#F5C800` |
| `[ Scheduled ]` button | bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` |
| `[ DISPATCH ]` button | bg `#242424` · border `1px solid #F5C800` · text `#F5C800` · font-weight 600 · hover bg `#2D2600` |

#### Search Bar

| Component | Detail |
|-----------|--------|
| Search input | Placeholder: "Search Service Appointment" · bg `#141414` · border `#2E2E2E` · focus-border `#F5C800` · text `#F0F0F0` |
| Search icon | `#A0A0A0` · hover `#F5C800` |

#### SA List Column Headers

| Column | Width | Style |
|--------|-------|-------|
| Checkbox | 16px | accent `#F5C800` |
| APPOINTMENT # | ~80px | 11px · `#A0A0A0` · font-weight 600 |
| STATUS | ~60px | 11px · `#A0A0A0` · font-weight 600 |
| EARLIEST START PERI... | ~60px | 11px · `#A0A0A0` · font-weight 600 |

#### SA List Row Item

> Each row is a draggable source item that can be dropped onto the Gantt chart

| Component | Detail |
|-----------|--------|
| Drag handle | `⠿` icon · left edge · `#A0A0A0` · cursor: `grab` · hover `#F5C800` |
| Checkbox | 16px · accent `#F5C800` |
| Warning icon `▲` | `#F5C800` · shows when SA has scheduling conflicts |
| Appointment # | 11px · `#F5C800` · hover underline (e.g. SA-3368478) |
| Status badge | pill · bg per token · text per token · 10px |
| Earliest start | 10px · `#A0A0A0` (e.g. 5/27/2026 2:00 PM) |
| Row hover | bg `#242424` |
| Row selected | bg `#2D2600` · border-left `3px solid #F5C800` |
| Row being dragged | opacity `0.6` · box-shadow `0 4px 16px rgba(245,200,0,0.4)` · cursor: `grabbing` |

**SA List Data (from screenshot):**

| SA # | Status | Earliest Start |
|------|--------|---------------|
| SA-3368478 | Scheduled | 5/27/2026 2:00 PM |
| SA-4366476 | Post Activity M… | 5/17/2026 5:58 PM |
| SA-4414671 | Post Activity M… | 5/26/2026 3:07 PM |
| SA-4252577 | Completed | 5/13/2026 2:48 PM |
| SA-3368500 | Post Activity M… | 5/19/2026 5:19 AM |
| SA-4381005 | Post Activity M… | 5/18/2026 4:44 PM |
| SA-4413201 | Post Activity M… | 5/19/2026 10:02 AM |
| SA-3365365 | Post Activity M… | 5/13/2026 3:06 PM |
| SA-4245208 | Post Activity M… | 5/20/2026 1:57 PM |
| SA-4366508 | Post Activity M… | 5/20/2026 10:47 AM |
| SA-4414147 | Post Activity M… | 5/20/2026 10:47 AM |
| SA-4241050 | Post Activity M… | 5/20/2026 10:47 AM |
| SA-4P4285 | Post Activity M… | 5/20/2026 10:57 AM |
| SA-4365416 | Post Activity M… | 5/20/2026 10:57 AM |

#### SA List Footer

| Component | Detail |
|-----------|--------|
| Record count | "1-14 (14 selected)" · 11px · `#A0A0A0` |
| Prev / Next page | `<` `>` icons · `#A0A0A0` · hover `#F5C800` |
| Per-page dropdown | bg `#141414` · border `#2E2E2E` · text `#F0F0F0` |

---

### 3B. Dispatch Toolbar (Top of Right Area)

**Height:** ~44px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Zone | Component | Detail |
|------|-----------|--------|
| Left | Policy dropdown | "Customer Put ▾" · bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` |
| Left+1 | Filter input | bg `#141414` · border `#2E2E2E` · text `#F0F0F0` |
| Left+2 | Settings icon | `#A0A0A0` · hover `#F5C800` |
| Center | **GANTT** tab | **Active** · text `#F5C800` · border-bottom `2px solid #F5C800` · font-weight 600 |
| Center+1 | MAP tab | Inactive · text `#A0A0A0` · hover text `#F0F0F0` |
| Center+2 | Email icon | `#A0A0A0` · hover `#F5C800` |
| Center+3 | Pin icon | `#A0A0A0` · hover `#F5C800` |
| Right | On Due / On Hire status chips | bg `#2E2E2E` · text `#A0A0A0` · active: bg `#F5C800` · text `#0D0D0D` |
| Right+1 | `0/0` counter | 11px · `#A0A0A0` |
| Right+2 | Resource filter icons | icon `#A0A0A0` · hover `#F5C800` |
| Right+3 | View dropdown | "daily ▾" · bg `#242424` · border `#2E2E2E` · text `#F0F0F0` |

#### Date Navigation Row

| Component | Detail |
|-----------|--------|
| `< Today >` | "Today" button · bg `#F5C800` · text `#0D0D0D` · font-weight 600 · border-radius `4px` |
| `<` prev arrow | icon `#A0A0A0` · hover `#F5C800` |
| `>` next arrow | icon `#A0A0A0` · hover `#F5C800` |
| Date display | **"Tue, 20 May 2026"** · 14px · `#F5C800` · font-weight 600 · center-aligned |

---

## Layer 4 — Gantt Chart Panel

**Background:** `#0D0D0D`  
**Layout:** Fixed mechanic name column (left) + scrollable time grid (right)  
**Height:** Fills remaining viewport height  
**Overflow-X:** Scroll with custom scrollbar

---

### Gantt Time Axis Header

**Height:** ~36px  
**Background:** `#141414`  
**Border-Bottom:** `1px solid #2E2E2E`

| Component | Detail |
|-----------|--------|
| Date header row | "TUE 20 MAY 2026" · 11px · `#F5C800` · font-weight 600 · centered over time columns |
| Hour columns | 00:00 · 01:00 · 02:00 … 23:00 · 11px · `#A0A0A0` · min-width 56px each |
| Timezone label | "Western Indonesia Time — Tue, 20 May 2026, 00:7m" · 10px · `#A0A0A0` · far right |
| Today line | `1px solid #F5C800` · vertical · spans full chart height · current time marker |
| Current time dot | `6px` circle · fill `#F5C800` · top of today line |

---

### Gantt Mechanic Name Column

**Width:** ~160px (fixed, non-scrollable)  
**Background:** `#1A1A1A`  
**Border-Right:** `1px solid #2E2E2E`

| Component | Detail |
|-----------|--------|
| Territory label | "WT · JST ST" · 10px · `#A0A0A0` · top row |
| Lock icon | `🔒` · 14px · `#F5C800` · territory row |
| Territory filter dropdown | "Core Office ▾" · bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` |
| Mechanic row height | ~36px per mechanic |
| Mechanic avatar | 24px circle · bg `#2E2E2E` · initials `#F5C800` · font-size 10px |
| Mechanic name | 12px · `#F0F0F0` · truncate with ellipsis |
| Row hover | bg `#242424` |
| Row border | border-bottom `1px solid #2E2E2E` |

**Mechanic List (from screenshot):**

| # | Mechanic Name |
|---|--------------|
| 1 | A25 P784FJC |
| 2 | AGUS MIZNI |
| 3 | BUDI APVANS |
| 4 | BURHAN DWI PRAMOD |
| 5 | FENNY SUGIARTO |
| 6 | Anargrop 1 |
| 7 | Anargrop 2 |
| 8 | Anargrop 3 |
| 9 | Anargrop 4 |
| 10 | Anargrop 5 |
| 11 | ACNI SUBIANTO |
| 12 | SEAH BARNANG |
| 13 | Poernita Wildar Harb |
| 14 | Satarisan Mor Habib |
| 15 | FANZEL |
| 16 | TRISNA PRAYAUTO |
| 17 | YOKY MEIA PELYANAS |
| + | Expansas Bandung *(territory group)* |

---

### Gantt Time Grid

**Columns:** 1 column per hour · min-width 56px each · total scrollable width ~1344px (24 hours)  
**Row height:** ~36px per mechanic  
**Grid lines:**
- Vertical: `1px solid #2E2E2E` every hour
- Horizontal: `1px solid #2E2E2E` between mechanic rows
- Today line: `2px solid #F5C800` at current hour

---

### Gantt SA Assignment Bar

> Represents a Service Appointment assigned to a mechanic for a specific time slot

#### Default State

```
┌──────────────────────────────────────────┐
│  [SA Icon] SA-2083611 · 2h               │  ← bg: #F5C800 · text: #0D0D0D
└──────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `#F5C800` |
| Text | SA number + duration · 11px · `#0D0D0D` · font-weight 500 |
| Border-Radius | `4px` |
| Height | 26px (within 36px row) |
| Min-Width | 40px (truncate label if shorter) |
| Overflow | text truncate with `…` |
| Cursor | `grab` |
| Box-Shadow | `0 1px 4px rgba(0,0,0,0.4)` |

#### Status-Based Bar Colors

| SA Status | Bar Background | Bar Text |
|-----------|---------------|----------|
| Scheduled | `#1D3557` · border-left `3px solid #60A5FA` | `#60A5FA` |
| Dispatched | `#2D2600` · border-left `3px solid #F5C800` | `#F5C800` |
| In Progress | `#2D1600` · border-left `3px solid #FB923C` | `#FB923C` |
| Completed | `#0D2200` · border-left `3px solid #52C41A` | `#52C41A` |
| Past Activity Match | `#2D2600` · border-left `3px solid #F5C800` | `#F5C800` |
| Cancelled | `#2D0000` · border-left `3px solid #FF4D4F` | `#FF4D4F` |
| Unassigned (floating) | `#1A1A1A` · border `1px dashed #F5C800` | `#F5C800` |

#### Hover State

| Property | Value |
|----------|-------|
| Background | `#C9A100` (for yellow bars) |
| Transform | `scale(1.02)` |
| Box-Shadow | `0 2px 8px rgba(245,200,0,0.5)` |
| Z-Index | `10` |
| Tooltip | SA #, status, mechanic, start → end time — bg `#242424` · border `#2E2E2E` · text `#F0F0F0` |

#### Drag State

| Property | Value |
|----------|-------|
| Opacity | `0.7` |
| Background | `#FFF0A0` |
| Text | `#0D0D0D` |
| Box-Shadow | `0 8px 24px rgba(245,200,0,0.6)` |
| Cursor | `grabbing` |
| Transform | `rotate(2deg) scale(1.05)` |
| Z-Index | `100` |

---

### Drag-and-Drop Interaction

#### Drop Zone (Mechanic Row × Time Slot)

| State | Visual |
|-------|--------|
| Inactive | no highlight |
| Drag over valid slot | bg `rgba(245,200,0,0.15)` · border `1px dashed #F5C800` |
| Drag over occupied slot (conflict) | bg `rgba(255,77,79,0.15)` · border `1px dashed #FF4D4F` |
| Drop accepted | bar snaps to slot · success pulse animation `0 0 0 4px rgba(245,200,0,0.3)` → fade |
| Drop rejected | bar bounces back to origin · error shake animation |

#### Snap Behavior

| Setting | Detail |
|---------|--------|
| Time snap | 30-minute increments (default) · toggle 15 min / 60 min |
| Visual snap guide | dashed vertical line `#F5C800` showing snap position while dragging |
| Duration preserve | bar width (duration) is preserved on drop — only start time changes |
| Multi-day | bars can span across day boundary |

#### Resize Handles

| Component | Detail |
|-----------|--------|
| Left resize handle | `◀` indicator · left edge of bar · `#0D0D0D` · cursor: `w-resize` |
| Right resize handle | `▶` indicator · right edge of bar · `#0D0D0D` · cursor: `e-resize` |
| Resize active | bar outline `2px solid #F5C800` · tooltip shows new start/end |

---

### Gantt Tooltip (on hover / during drag)

```
┌──────────────────────────────┐
│  SA-2083611                  │  ← #F5C800 font-weight 600
│  Status: Past Activity Match │  ← #A0A0A0 label · #F0F0F0 value
│  Mechanic: FANZEL            │
│  Start:  20/05/2026, 08:00   │
│  End:    20/05/2026, 10:00   │
│  Duration: 2h 00m            │
└──────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `#242424` |
| Border | `1px solid #2E2E2E` |
| Border-Radius | `6px` |
| Shadow | `0 4px 16px rgba(0,0,0,0.6)` |
| Position | follows cursor · offset `12px 12px` |
| Z-Index | `200` |

---

### Unassigned SA Tray (Bottom of Gantt)

> SAs dragged from the left panel but not yet placed on a mechanic row float here temporarily

**Height:** ~48px  
**Background:** `#141414`  
**Border-Top:** `1px dashed #F5C800`

| Component | Detail |
|-----------|--------|
| Label | "Unassigned ▾" · 11px · `#A0A0A0` |
| Floating SA bar | same bar styling as Gantt bar · border `1px dashed #F5C800` |
| Drop here hint | text "Drop SA here to unassign" · 11px · `#4A4A4A` |

---

## Interaction Patterns

### Assign SA to Mechanic (Drag from SA List → Gantt)
1. User **grabs** SA row from left panel (cursor: `grabbing`)
2. SA row dims (opacity `0.5`) in list, ghost bar appears at cursor
3. User **drags** over Gantt → mechanic rows highlight drop zones
4. Valid slot: `rgba(245,200,0,0.15)` highlight
5. User **drops** → bar snaps to nearest 30-min slot
6. SA status updates to **Scheduled** → badge refreshes in left panel
7. Success toast: bg `#1A1A1A` · left-border `4px solid #52C41A` · "SA-XXXXXXX assigned to [Mechanic]"

### Reassign SA (Drag bar → Different Mechanic Row)
1. User grabs existing bar on Gantt
2. Drag to new mechanic row
3. Original slot clears (bg returns to `#0D0D0D`)
4. Drop in new row → same snap + animation as above
5. Conflict check: if mechanic already has overlapping SA → red drop zone + error toast

### Reschedule SA (Drag bar → Same Row, Different Time)
1. Grab bar → drag horizontally within same mechanic row
2. Snap guide `#F5C800` dashed vertical line follows
3. Drop → bar repositions, start/end time updates in SA record
4. Tooltip shows new time during drag

### Resize Duration (Drag Right Handle)
1. Hover right edge of bar → cursor `e-resize`, handle appears
2. Drag right → extend duration (snaps to 30-min increments)
3. Bar width grows, tooltip shows new end time
4. Release → SA end time updates

### View Toggle (GANTT / MAP)
- **GANTT:** Active view (current) — shows time-based grid
- **MAP:** Switches to geographic map view with mechanic pins

### Date Navigation
- `Today` button: jump to current date
- `< >` arrows: navigate prev/next day (daily view) or week/month
- View dropdown `daily ▾`: switch to Weekly / Monthly

### Filter / Policy
- **Policy dropdown:** "Customer Put" → filters SA list by assignment policy
- **On Due / On Hire chips:** toggle filters for SA urgency state
- **Territory filter:** "Core Office ▾" → filter mechanic list by territory

---

## Color & Status Tokens (Gantt Bars)

| Status | Bar BG | Bar Border | Text |
|--------|--------|-----------|------|
| Scheduled | `#1D3557` | `#60A5FA` (left 3px) | `#60A5FA` |
| Dispatched | `#2D2600` | `#F5C800` (left 3px) | `#F5C800` |
| In Progress | `#2D1600` | `#FB923C` (left 3px) | `#FB923C` |
| Completed | `#0D2200` | `#52C41A` (left 3px) | `#52C41A` |
| Past Activity Match | `#2D2600` | `#F5C800` (left 3px) | `#F5C800` |
| Cancelled | `#2D0000` | `#FF4D4F` (left 3px) | `#FF4D4F` |
| **Dragging** | `#FFF0A0` | `2px solid #F5C800` | `#0D0D0D` |
| **Drop Target Valid** | `rgba(245,200,0,0.15)` | `1px dashed #F5C800` | — |
| **Drop Target Conflict** | `rgba(255,77,79,0.15)` | `1px dashed #FF4D4F` | — |

---

## Typography Scale

> **Font family:** `'Inter', 'Segoe UI', sans-serif`

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Panel Title | 13px | 600 | `#F5C800` | "All Service Appointments" |
| Date Display | 14px | 600 | `#F5C800` | Current date in toolbar |
| Hour Label | 11px | 400 | `#A0A0A0` | Gantt time axis |
| Mechanic Name | 12px | 500 | `#F0F0F0` | Mechanic name column |
| SA Number | 11px | 500 | `#F5C800` | SA list + bar label |
| SA Bar Text | 11px | 500 | `#0D0D0D` | Text inside yellow bar |
| Status Badge | 10px | 500 | *(per token)* | SA status pills |
| Field Label | 11px | 400 | `#A0A0A0` | Column headers |
| Tooltip | 12px | 400 | `#F0F0F0` | Hover tooltip |
| Tooltip Label | 11px | 400 | `#A0A0A0` | Tooltip field labels |
| Footer Count | 11px | 400 | `#A0A0A0` | "1-14 (14 selected)" |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default row | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Row hover | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Row selected | `#2D2600` | `#F5C800` (left 3px) | `#F5C800` |
| Drop zone valid | `rgba(245,200,0,0.15)` | `#F5C800` dashed | — |
| Drop zone conflict | `rgba(255,77,79,0.15)` | `#FF4D4F` dashed | — |
| Focused input | `#1A1A1A` | `#F5C800` | `#F0F0F0` |
| Disabled | `#141414` | `#1A1A1A` | `#4A4A4A` |

---

## Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0D0D0D; }
::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #F5C800; }
```

---

## Component Hierarchy Summary

```
App
├── Layer 1: GlobalTopBar
│     ├── AppLauncher
│     ├── SearchBar
│     └── IconCluster
│
├── Layer 2: AppBar
│     ├── ConsoleLabel ("UT Service Console")
│     ├── ClassicDispatchConsoleTab  ← active #F5C800
│     └── OtherTabs (WorkOrder, etc.)
│
└── Layer 3+4: DispatchConsoleBody
      ├── LeftPanel: SAList
      │     ├── SAListHeader (title + add + settings)
      │     ├── MatchFieldRulesToggle
      │     ├── DateRangeFilter (start, end, Scheduled btn, Dispatch btn)
      │     ├── SearchBar
      │     ├── SAListTable
      │     │     ├── ColumnHeaders (Checkbox, Appointment#, Status, EarliestStart)
      │     │     └── SAListRows[] (draggable)
      │     │           ├── DragHandle
      │     │           ├── Checkbox
      │     │           ├── WarningIcon (conditional)
      │     │           ├── AppointmentNumber (link)
      │     │           ├── StatusBadge
      │     │           └── EarliestStartTimestamp
      │     └── SAListFooter (count + pagination)
      │
      └── RightArea: DispatchGantt
            ├── DispatchToolbar
            │     ├── PolicyDropdown
            │     ├── FilterInput
            │     ├── ViewToggle [GANTT | MAP]
            │     ├── StatusChips (On Due, On Hire)
            │     ├── ResourceFilterIcons
            │     └── ViewDropdown (daily ▾)
            ├── DateNavBar
            │     ├── PrevButton
            │     ├── TodayButton (#F5C800 primary)
            │     ├── DateDisplay (#F5C800)
            │     └── NextButton
            ├── GanttTimeAxisHeader
            │     ├── DateLabel
            │     ├── HourColumns[] (00:00–23:00)
            │     ├── TodayLine (#F5C800 vertical)
            │     └── TimezoneLabel
            ├── GanttGrid
            │     ├── MechanicNameColumn (fixed)
            │     │     ├── TerritoryRow (WT·JST ST + lock icon + territory filter)
            │     │     └── MechanicRows[] (avatar + name)
            │     └── TimeGrid (scrollable)
            │           └── MechanicTimeRows[]
            │                 └── SABars[] (draggable, resizable)
            │                       ├── DragHandle (left edge)
            │                       ├── SALabel (number + duration)
            │                       ├── ResizeHandleLeft
            │                       └── ResizeHandleRight
            └── UnassignedTray (bottom)
                  └── FloatingUnassignedBars[]
```

---

## Document Version

**Version 1.0** — UT Service Console Dispatch Mechanic — Gantt Chart Drag-and-Drop Design  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-ServiceAppointment.md → DESIGN-WorkOrder.md  
**Updated:** 2026-05-26
