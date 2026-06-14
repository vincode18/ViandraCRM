# PRD-01 — Flow Builder: UI & Navigation
**Product:** UT Service Console  
**Module:** Setup → App Flows  
**Version:** 1.0  
**Last Updated:** 2026-06-13  
**Status:** Draft — Awaiting Engineering Review

---

## 1. Overview

This document defines the UI/UX requirements for the **Flow Builder** feature within the UT Service Console. The Flow Builder allows administrators and power users to design, configure, and deploy automated business-process logic — without writing application code — using a visual drag-and-drop canvas.

The Flow Builder is accessed via **Setup → Current App → Flows**.

---

## 2. Goals

- Provide a low-code/no-code interface for building multi-step business process automations.
- Support all five flow trigger categories: Screen, Schedule-Triggered, Autolaunched, Record-Triggered, and Platform Event-Triggered.
- Enable power users to connect flows to backend logic (REST APIs, C# services) without leaving the visual editor.
- Maintain visual consistency with the UT Service Console Design System (Design_System.md v1.0).

---

## 3. Navigation & Entry Point

### 3.1 Access Path

```
Setup (⚙ icon, top-right header)
  └── Current App
        └── Flows
              ├── All Flows (list view)
              ├── + New Flow (creation wizard)
              └── [Flow Name] → Flow Builder Canvas
```

### 3.2 Flows List Page

The list page is the home for all flows in the current app context.

| Element | Spec |
|---------|------|
| Page heading | `"Flows"` — `text-2xl font-bold`, `var(--text-main)` |
| Subheading | `"Automate business processes without code"` — `text-sm`, `var(--text-tertiary)` |
| New Flow button | `.btn-primary` — label: `"+ New Flow"` |
| Search input | `.input-field` — placeholder: `"Search flows…"` |
| Table | Standard `.card` container, rows separated by `var(--border)` |

**Table columns:**

| Column | Type | Notes |
|--------|------|-------|
| Flow Label | Text + icon | Icon colour matches flow type (see Section 5) |
| Type | Badge | See flow type badge spec (Section 5.3) |
| Status | Badge | `Active` (green), `Inactive` (grey), `Draft` (amber) |
| Object | Text | e.g. `Account`, `Case`, `Work Order` |
| Last Modified | Timestamp | `text-xs var(--text-tertiary)` |
| Actions | Icon buttons | Edit `✏`, Activate/Deactivate toggle, Delete `🗑` |

---

## 4. Flow Builder Canvas

### 4.1 Layout

The canvas uses a **three-panel layout**:

```
┌─────────────────┬──────────────────────────────────┬──────────────────┐
│  Toolbox (left) │        Canvas (centre)            │  Inspector (right)│
│  w: 280px       │        flex: 1                    │  w: 320px        │
│  bg-panel       │        bg-base                    │  bg-panel        │
│  border-right   │        infinite scroll            │  border-left     │
└─────────────────┴──────────────────────────────────┴──────────────────┘
```

All three panels share `var(--bg-panel)` / `var(--bg-base)` backgrounds and `var(--border)` dividers. The canvas background uses a subtle dot-grid pattern in `var(--bg-lighter)` at 20% opacity.

### 4.2 Canvas Toolbar (top bar)

```
[ ↩ Undo ]  [ ↪ Redo ]  [ ⊞ Fit to Screen ]  [ ⚙ Flow Properties ]
                                                        [ Save ]  [ Activate ]
```

| Element | Spec |
|---------|------|
| Undo / Redo | `.btn-secondary` icon-only, `p-1.5` |
| Flow Properties | `.btn-secondary`, opens right inspector to Flow metadata |
| Save | `.btn-secondary` |
| Activate | `.btn-primary` — disabled when flow has validation errors |

### 4.3 Toolbox Panel

The Toolbox is grouped into three collapsible sections:

**Interaction**
- Action
- Subflow

**Logic**
- Assignment
- Decision
- Pause
- Loop

**Data**
- Create Records
- Update Records
- Get Records
- Delete Records

Each element in the toolbox is a draggable tile:

```
┌──────────────────────────────┐
│  [Icon]  Element Name        │
└──────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Tile padding | `px-3 py-2` |
| Icon size | 20×20px, colour matches element category |
| Font | `text-sm font-medium var(--text-secondary)` |
| Hover | `var(--bg-light)` fill, border `var(--accent)` |
| Drag active | `0 4px 16px rgba(0,0,0,0.15)` shadow, `0.9` opacity |

Section headers:
```css
font: text-xs font-bold uppercase tracking-wider
color: var(--text-muted)
padding: px-3 py-2
```

### 4.4 Canvas Nodes

Every flow element renders as a **node** on the canvas. Nodes follow this visual anatomy:

```
┌──────────────────────────┐
│  [Category Icon]          │  ← 32×32 icon, category colour
│  Element Type             │  ← text-xs font-medium text-muted
│  Node Label               │  ← text-sm font-semibold text-main
│  ○ [connector port]       │  ← bottom-centre (out), top-centre (in)
└──────────────────────────┘
```

Node dimensions: min `96×80px`, auto-expand for longer labels.

**Node colour scheme (icon backgrounds):**

| Category | Background | Icon Colour |
|----------|-----------|-------------|
| Decision | `#FF9500` (amber) | `#FFFFFF` |
| Assignment | `#FF9500` (amber) | `#FFFFFF` |
| Apex / Code Action | `#1E3A5F` (navy) | `#FFFFFF` |
| Get / Update / Create / Delete Records | `#E91E8C` (pink) | `#FFFFFF` |
| Screen | `#1976D2` (blue) | `#FFFFFF` |
| Loop | `#FF9500` (amber) | `#FFFFFF` |
| Pause | `#FF9500` (amber) | `#FFFFFF` |
| Start | `#00897B` (teal) | `#FFFFFF` — circle play button |

Node border at rest: `1px solid var(--border)`  
Node border selected: `2px solid var(--accent)`  
Node shadow selected: `0 0 0 4px rgba(245, 200, 0, 0.15)`

### 4.5 Connectors (Edges)

| State | Style |
|-------|-------|
| Normal path | Solid grey `#BDBDBD`, 2px, curved (bezier) |
| Labelled path (e.g. "Is Valid", "Hot") | Pill label, `text-xs`, `var(--bg-card)` bg, `var(--border)` border |
| Fault path | Dashed red `#C62828`, 2px |
| Selected | `var(--accent)` stroke, 2.5px |

### 4.6 Inspector Panel (right)

Opens when a node or the canvas background is selected.

**Node selected — Inspector tabs:**

| Tab | Content |
|-----|---------|
| General | Label, API name, description |
| Configuration | Node-specific fields (criteria, assignments, etc.) |
| Faults | Fault path destination selector |

**Canvas selected (no node) — Inspector shows Flow Properties:**
- Flow Label
- API Name
- Description
- Flow Type (read-only after creation)
- Interview Label (for runtime identification)
- Run Mode

All inspector inputs use `.input-field`. Labels use `text-xs font-medium var(--text-tertiary)` with `mb-1` spacing.

---

## 5. Flow Type System

### 5.1 Creation Wizard

When `+ New Flow` is clicked, a modal wizard opens showing five type cards.

```
┌─────────────────────────────────────────────────────────┐
│  Choose a Flow Type                                      │
│  ─────────────────────────────────────────────────────  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ 🖥 Screen│  │ ⏱ Sched.│  │ ⚡ Auto  │                 │
│  │  Flow   │  │Triggered│  │launched │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│  ┌─────────┐  ┌─────────┐                               │
│  │ 📋 Record│  │ 📡 Event │                               │
│  │Triggered│  │Triggered│                               │
│  └─────────┘  └─────────┘                               │
│                              [ Cancel ]  [ Next → ]     │
└─────────────────────────────────────────────────────────┘
```

Selected card: `border: 2px solid var(--accent)`, `var(--accent-pale)` background.

### 5.2 Flow Type Definitions

| Type | Trigger | Runs | UI Required |
|------|---------|------|-------------|
| **Screen Flow** | User action (button, Lightning page embed) | Foreground | Yes — Screen elements |
| **Schedule-Triggered** | Time + frequency (daily, weekly, etc.) | Background | No |
| **Autolaunched** | Process, Apex, REST API call, schedule, record change, or platform event | Background | No |
| **Record-Triggered** | Record created, updated, or deleted | Background | No |
| **Platform Event-Triggered** | Platform event message received | Background | No |

### 5.3 Flow Type Badges (List View)

```css
/* Shared base */
.flow-type-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded text-xs font-medium;
}
```

| Type | Text colour | Background |
|------|------------|------------|
| Screen | `#1976D2` | `rgba(25, 118, 210, 0.1)` |
| Schedule-Triggered | `#00897B` | `rgba(0, 137, 123, 0.1)` |
| Autolaunched | `#FF9500` | `rgba(255, 149, 0, 0.1)` |
| Record-Triggered | `#E91E8C` | `rgba(233, 30, 140, 0.1)` |
| Platform Event | `#7B1FA2` | `rgba(123, 31, 162, 0.1)` |

---

## 6. Variable Manager

Accessible via the **Manager tab** in the Toolbox panel (tab toggle: `Elements | Manager`).

### 6.1 Variable List

Displays all variables, constants, formulas, and resource types defined in the flow.

| Column | Notes |
|--------|-------|
| Name | API name, `text-sm font-medium` |
| Data Type | Text, Number, Boolean, Date, Record, etc. |
| Default Value | Shown inline if set |
| Input/Output | `In`, `Out`, `In/Out` badge |
| Actions | Edit `✏`, Delete `🗑` |

### 6.2 New Variable Modal

Fields:
- **Label** — `.input-field`
- **API Name** — `.input-field`, auto-populated from label, editable
- **Data Type** — `<select>` dropdown: Text, Number, Currency, Boolean, Date, DateTime, Record (sObject), Collection
- **Default Value** — `.input-field`, conditional on data type
- **Availability for Input** — checkbox: "Available for input"
- **Availability for Output** — checkbox: "Available for output"

---

## 7. Error States & Validation

### 7.1 Canvas Validation

On **Activate** or **Save & Activate**, the builder runs validation. Invalid nodes receive:
- Red border: `2px solid var(--color-danger)`
- Error icon badge (⚠) top-right of node
- Inspector opens automatically to the first error

### 7.2 Fault Paths

Nodes that can fail (Apex Actions, Get/Update/Create/Delete Records, REST integrations) expose a **Fault connector port** (bottom-right of node). Fault connectors render as dashed red lines (see Section 4.5). If no fault path is connected, the builder shows a warning (not a blocking error) on save.

### 7.3 Inline Error Messages

```
var(--color-danger) text, text-xs, shown below the offending field in the Inspector.
```

---

## 8. Accessibility

- All canvas nodes are keyboard-navigable (Tab to focus, Enter to open Inspector, Arrow keys to move).
- Colour-blind safe: all status distinctions also carry an icon or label — never colour alone.
- Focus ring: `2px solid var(--accent)` on all interactive elements (`:focus-visible`).
- Minimum touch target on all toolbar and toolbox buttons: `44×44px`.

---

## 9. Empty State

When no flows exist:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│           ⚡  No flows yet                            │
│    Automate work by building your first flow.        │
│                                                      │
│              [ + Create Flow ]                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Icon: `var(--text-muted)`, 48px  
Heading: `text-lg font-semibold var(--text-main)`  
Subtext: `text-sm var(--text-tertiary)`  
Button: `.btn-primary`

---

## 10. Out of Scope (PRD-01)

The following are covered in **PRD-02 — Flow Logic & Integration**:
- Decision element configuration (criteria, operators, outcome branches)
- Assignment element rules
- REST API / C# external action configuration
- Variable binding to API request/response payloads
- Schedule configuration (start date, frequency, filter conditions)
- Record-trigger condition logic (entry criteria, run timing)
