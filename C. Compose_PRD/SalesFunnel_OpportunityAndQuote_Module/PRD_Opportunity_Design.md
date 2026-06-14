# PRD — Opportunity Module Design Spec
### UT Service Console · Sales Funnel UI

> **Document Type:** Design Requirements Document  
> **Version:** 1.0  
> **Last Updated:** 2026-06-11  
> **Status:** Draft  
> **Owner:** Design Team  
> **Paired Doc:** `PRD_Opportunity_Module.md` v1.0  
> **Design System:** `Design_System.md` v1.0

---

## 1. Design Philosophy

The Opportunity module is a **deal command centre** — a space where a sales rep makes consequential decisions: what stage am I at, what's the money, what do I do next. The design must communicate progress, urgency, and context without overwhelming the user with raw data.

### 1.1 Design Principles for This Module

1. **Stage is the hero.** The chevron navigator is the first thing a user reads. It tells the story of the deal at a glance. Everything else is supporting context.
2. **Density with clarity.** Sales reps live in these records all day. The layout earns the right to be information-dense, but every cluster of fields must have a clear label hierarchy so scanning is faster than reading.
3. **Spatial separation of concern.** The left column is about *this deal* — what it is, what's happened, what's next. The right column is about *context* — who else is involved, what else exists. This separation must be felt, not just structured.
4. **Status signals over decoration.** Colour is used only to communicate state (stage, priority, status) not to create visual interest. The gold accent is earned, not scattered.
5. **Dark mode is first-class.** All design decisions must be validated in dark mode, not retrofitted.

---

## 2. Chevron Stage Navigator

### 2.1 Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  ╱ Prospecting ╲  ╱ Qualification ╲  ╱ Needs Analysis ╲  ╱ Value Prop ╲  ...  │
│   10%              20%                30%                  50%                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Each chevron is an `<button>` element with a clipped parallelogram shape. The navigator sits in a full-width strip directly below the page header, above the two-column content area.

### 2.2 Chevron States

| State | Background Fill | Text Colour | Border | Icon |
|-------|----------------|------------|--------|------|
| **Completed** (past stage) | `#F5C800` at 30% opacity / dark: `rgba(251,191,36,0.25)` | `var(--text-tertiary)` | none | Checkmark `✓` (16px, `--text-tertiary`) |
| **Active** (current stage) | `var(--accent)` `#F5C800` / dark: `#FBBF24` | `#1A1A1A` (always dark text on gold) | none | Filled circle dot |
| **Future** (not yet reached) | `var(--bg-light)` | `var(--text-muted)` | none | — |
| **Closed Won** | `#388E3C` (`--color-success`) | `#FFFFFF` | none | `✓` in white |
| **Closed Lost** | `#C62828` (`--color-danger`) | `#FFFFFF` | none | `✗` in white |
| **Hover (future)** | `var(--bg-lighter)` | `var(--text-tertiary)` | — | — |
| **Hover (completed/active)** | Slightly darker tint | unchanged | — | — |

### 2.3 Chevron Geometry

```
Shape (CSS clip-path):
  polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 16px 50%)

First chevron (no left notch):
  polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)

Last chevron (no right point):
  polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 16px 50%)
```

- **Height:** 52px
- **Min-width:** 120px; flex-grow: 1 (all chevrons share equal width)
- **Font:** `text-xs font-semibold uppercase tracking-wide` for stage name
- **Sub-label:** Probability % in `text-[10px] font-normal` below stage name
- **Overlap:** Each chevron overlaps the next by 16px (the notch depth) using negative margin-right or z-index stacking.

### 2.4 Below the Chevron Strip

Directly below the active chevron, a metadata row shows:

```
[ Stage: Proposal / Price Quote ]   [ In this stage: 4 days ]   [ ⚠ Overdue task ]
```

- Stage label: `text-xs text-tertiary`
- Days counter: `text-xs font-medium` in `var(--text-secondary)`
- Overdue task warning: amber triangle icon + `text-xs` in `#F57C00`

### 2.5 Stage Change Confirmation Modal

Triggered on any chevron click. Uses standard modal anatomy from the design system:

```
┌──────────────────────────────────────────┐
│  Move to "Negotiation / Review"?         │
│                                          │
│  Probability will update to 80%.         │
│  This change will be recorded in         │
│  the opportunity history.                │
│                                          │
│            [ Cancel ]  [ Move Stage → ]  │
└──────────────────────────────────────────┘
```

- Title: `text-lg font-semibold`
- Body: `text-sm var(--text-secondary)`
- Confirm button: `.btn-primary` (gold)
- Cancel button: `.btn-secondary`
- On Closed Won / Closed Lost: modal adds a `CloseDate` confirmation field and, for Lost, a required close reason textarea.

---

## 3. Page Header

### 3.1 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Opportunities                                                     │
│                                                                      │
│  Acme Corp — Q3 Expansion Deal              [Won ✓] [Edit] [⋯]     │
│  Account: Acme Corporation  ·  Owner: Sarah Lin  ·  $48,500         │
└──────────────────────────────────────────────────────────────────────┘
```

- **Breadcrumb:** `text-xs text-tertiary` with back arrow icon (`lucide-react: ArrowLeft`)
- **Opportunity Name:** `text-2xl font-bold var(--text-main)` — inline edit on click (converts to input with accent focus ring)
- **Account + Owner + Amount row:** `text-sm var(--text-tertiary)` with `·` separators
- **Stage badge:** `.badge` with status colour matching current `StageName` (uses Case & WO status colour mapping logic)
- **Priority star** (when `IsPriorityRecord = true`): `lucide-react: Star` filled in `var(--accent)`, 16px, left of Opportunity name
- **Private lock** (when `IsPrivate = true`): `lucide-react: Lock` in `var(--text-muted)`, 14px, right of Opportunity name

### 3.2 Action Buttons

Right-aligned in header, using `.btn-secondary` for secondary actions and `.btn-primary` for the primary CTA:

```
[ Log Activity ]  [ New Quote ]  [ Mark Won ]  [ ⋯ ]
```

- "Mark Won" = `.btn-primary` (gold) — hidden when `IsClosed = true`
- "Mark Lost" appears in the `⋯` overflow menu
- When `IsWon = true`: all action buttons replaced by a single `✓ Closed Won` read-only badge
- When `IsClosed = true AND IsWon = false`: `✗ Closed Lost` badge in danger colour

---

## 4. Two-Column Content Layout

### 4.1 Column Proportions

| Breakpoint | Left Column | Right Column |
|-----------|-------------|--------------|
| `≥ 1280px` | 65% | 35% |
| `1024–1279px` | 60% | 40% |
| `< 1024px` | 100% (stacked) | 100% (below) |

- Gap between columns: `gap-6` (24px)
- Outer padding: `p-6` (24px) applied by `AppLayout`
- Both columns scroll independently on desktop (each has `overflow-y: auto`); on mobile they stack and scroll together.

### 4.2 Left Column — Visual Design

#### Tab Bar

```
[ Details ]  [ Activity ]  [ History ]
─────────────────────────────────────── ← accent gold underline on active tab
```

- Tab bar: `border-bottom: 1px solid var(--border)` below the tab labels
- Active tab indicator: `border-bottom: 2px solid var(--accent)` — 2px, flush with container border
- Tab labels: `text-sm font-medium` — active: `var(--text-main)`, inactive: `var(--text-tertiary)`
- Hover on inactive tab: `var(--text-secondary)`

#### Detail Cards

Each card follows the `.card` spec from the design system:

```
┌──────────────────────────────────────────────┐
│  OPPORTUNITY INFORMATION              [Edit]  │  ← Card header
├──────────────────────────────────────────────┤
│  Opportunity Name                            │
│  Acme Corp — Q3 Expansion Deal               │
│                                              │
│  Account               Close Date            │
│  Acme Corporation      Sept 30, 2026         │
│                                              │
│  Stage                 Probability           │
│  Proposal / Price      65%                   │
│                                              │
│  Amount                Expected Amount       │
│  $48,500               $31,525               │
└──────────────────────────────────────────────┘
```

**Card header:**
- Title: `text-[11px] font-bold uppercase tracking-wider var(--text-muted)` — same as Side Panel Card title spec in design system
- Inline `[Edit]` ghost button: `text-xs font-medium var(--accent)` — shows on hover of card header, always shown on focus

**Two-column field grid inside card:**
- Grid: `grid grid-cols-2 gap-x-6 gap-y-4`
- Field label: `text-xs var(--text-tertiary)` — upper position
- Field value: `text-sm font-medium var(--text-secondary)` — lower position
- Full-width fields (Name, Description, Next Step): `col-span-2`
- Currency values: right-aligned within their cell, monospace font (`ui-monospace`)
- Reference fields (Account, Contact): rendered as linked text in `var(--color-info)` with hover underline

**Next Step field — special treatment:**

```
┌─────────────────────────────────────────────────────────┐
│  NEXT STEP                                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Send revised proposal by Friday — follow up    │   │
│  │  with procurement team Monday AM                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

- The Next Step field gets a visually distinct treatment: a left-accent bar (`border-left: 3px solid var(--accent)`) and `bg-light` background, `p-3 rounded`.
- This signals "action required" without adding colour noise.

#### System Information Card (Collapsed)

```
▶ SYSTEM INFORMATION                              (collapsed by default)
```

- Collapsed state shows only the title row with a `ChevronRight` icon (14px)
- Expanded: shows 2-column grid of all system/audit fields
- Expand/collapse uses `transition: height 0.2s ease`

### 4.3 Left Column — Activity Tab

```
  [ + Log Activity ]                             ← sticky at top of tab

  ──────── TODAY ────────

  📞  Called Sarah at Acme
      Duration: 12 min · Outcome: Follow-up scheduled
      3:42 PM · Logged by James K.

  ──────── YESTERDAY ────────

  ✉️  Sent revised proposal email
      "Please find the updated pricing..."
      11:15 AM · Logged by James K.
```

**Date group headers:** `text-[10px] font-bold uppercase tracking-widest var(--text-muted)` with full-width `hr` divider using `var(--border)`

**Activity item:**
- Icon container: 32×32px circle, `var(--bg-light)` background, icon in `var(--text-tertiary)`
- Title: `text-sm font-semibold var(--text-main)`
- Body preview: `text-xs var(--text-tertiary)` truncated to 2 lines
- Meta row: `text-xs var(--text-muted)` — time · logged by
- Hover: `var(--bg-light)` background, `border-radius: 8px`

### 4.4 Left Column — History Tab

```
  DATE/TIME              CHANGED BY      FIELD          OLD         NEW
  ──────────────────────────────────────────────────────────────────────
  Jun 10, 2026 2:14pm    James K.        Stage          Qualification  Proposal/Price Quote
  Jun 8, 2026 9:00am     James K.        Amount         $42,000        $48,500
  Jun 5, 2026 3:30pm     Sarah Admin     Owner          Mike D.        James K.
```

- Table uses `text-xs` for all content
- `DATE/TIME` column: monospace font, `var(--text-tertiary)`
- `CHANGED BY` column: `var(--text-secondary)`
- `FIELD` column: `font-medium var(--text-main)`
- `OLD` value: `var(--text-muted)` with strikethrough style
- `NEW` value: `font-medium var(--text-secondary)`
- Stage-change rows get a subtle `var(--accent-pale)` row background to make them easier to scan

---

## 5. Right Column — Related Panels

### 5.1 Panel Container

```
┌──────────────────────────────────────────┐
│  ACCOUNT & CONTACT              [▼]      │  ← Collapsed/expanded toggle
├──────────────────────────────────────────┤
│  Acme Corporation                        │
│  Technology · (415) 555-0100             │
│                                          │
│  Sarah Lin — VP of Operations            │
│  sarah.lin@acme.com · (415) 555-0199     │
│                                          │
│  [ View Account ]                        │
└──────────────────────────────────────────┘
```

**Panel header:**
- Title: `text-[11px] font-bold uppercase tracking-wider var(--text-muted)`
- Chevron icon: `lucide-react: ChevronDown` (rotates to `ChevronRight` when collapsed), 14px, `var(--text-muted)`
- Full header row is clickable; hover: `var(--bg-light)` background on header only

**Panel content:**
- `px-4 pb-4 pt-2`
- Inner spacing: `space-y-2`

### 5.2 Related List Items (Cases, Quotes, Assets, etc.)

For related lists with multiple rows:

```
┌──────────────────────────────────────────┐
│  CASES                          [ + ]    │
├──────────────────────────────────────────┤
│  00-001234                               │
│  Server outage — production critical     │
│  [● In Progress]  [● Critical]  2d ago   │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  00-001189                               │
│  Renewal pricing enquiry                 │
│  [● Open]  [● Medium]  5d ago            │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  View all 7 cases →                      │
└──────────────────────────────────────────┘
```

- `[ + ]` in panel header: compact icon button (`.btn` icon-only variant), always visible (not just on hover) for discoverability
- Row item: `py-2.5` top/bottom, no explicit left/right padding beyond panel's `px-4`
- Case number: `text-xs font-medium var(--text-muted)` monospace
- Subject: `text-sm font-medium var(--text-main)` with hover underline + `var(--color-info)` colour
- Badge row: `flex gap-1.5 items-center mt-1` using inline `.badge` spec with WO Inline Status Badge colours
- Timestamp: `text-xs var(--text-muted)` right-aligned
- Row divider: `border-bottom: 1px dashed var(--border)` (dashed to visually distinguish from card borders)
- "View all N ..." link: `text-xs font-medium var(--color-info)` with `→` icon

### 5.3 Service Products (Line Items) Panel

This panel has an embedded sub-total footer:

```
│  PRODUCTS / LINE ITEMS          [ + Add Product ]  │
│  ─────────────────────────────────────────────────  │
│  CRM Enterprise License × 5       $12,500           │
│  Professional Services — Setup    $8,000            │
│  Annual Support Package × 1       $6,000            │
│  ─────────────────────────────────────────────────  │
│                    Total          $26,500            │
```

- Product name: `text-sm var(--text-main)`
- Price: `text-sm font-medium var(--text-secondary)` right-aligned, monospace
- Total row: `text-sm font-bold var(--text-main)` with `border-top: 2px solid var(--border)` separating it from line items

### 5.4 Quotes Panel — Synced Quote Indicator

The synced quote gets a visual treatment to distinguish it:

```
│  QUOTES                                  [ + ]  │
│  ─────────────────────────────────────────────  │
│  ● QT-2026-0042   [SYNCED]                      │
│    Acme Q3 Proposal                             │
│    Expires: Aug 15, 2026 · $48,500              │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  QT-2026-0038                                   │
│    Acme Q3 Proposal v1                          │
│    Expires: Jul 30, 2026 · $44,000              │
```

- `[SYNCED]` badge: `text-[10px] font-bold uppercase` in `var(--accent)` on `var(--accent-pale)` background, `px-1.5 py-0.5 rounded`
- Synced quote row has `background: var(--accent-pale)` subtle background wash, `border-radius: 4px`

---

## 6. Empty States

When a related panel has no records:

```
┌──────────────────────────────────────────┐
│  CASES                          [ + ]    │
├──────────────────────────────────────────┤
│                                          │
│        📋                                │
│   No cases linked to this               │
│   opportunity's account.                 │
│                                          │
│   [ + Create a Case ]                    │
│                                          │
└──────────────────────────────────────────┘
```

- Icon: `lucide-react` contextual icon, 32px, `var(--text-muted)`
- Message: `text-sm var(--text-muted)` centred
- CTA: ghost button in `var(--color-info)` text style

---

## 7. Warning & Error States

### 7.1 Overdue Task Banner

Rendered between the chevron navigator and the tab bar:

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚠  This opportunity has 2 overdue tasks.  [ View Tasks ]           │
└─────────────────────────────────────────────────────────────────────┘
```

- Background: `#FFF3E0` (High priority badge background)
- Border: `1px solid #F57C00` (`--color-warning`)
- Icon: `lucide-react: AlertTriangle` 16px in `#F57C00`
- Text: `text-sm var(--text-secondary)`
- "View Tasks" link: `text-sm font-medium var(--color-info)`
- Only shown when `HasOverdueTask = true`

### 7.2 Closed Opportunity Banner

When `IsClosed = true`, a persistent banner replaces the overdue warning slot:

**Closed Won:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ✓  This opportunity was closed as Won on June 10, 2026.            │
└─────────────────────────────────────────────────────────────────────┘
```
Background: `#E8F5E9` · Border: `1px solid #388E3C` · Icon: `lucide-react: CheckCircle` green

**Closed Lost:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  ✗  This opportunity was closed as Lost on June 8, 2026.            │
└─────────────────────────────────────────────────────────────────────┘
```
Background: `#FFEBEE` · Border: `1px solid #C62828` · Icon: `lucide-react: XCircle` red

---

## 8. New Opportunity Modal

### 8.1 Layout

```
┌─────────────────────────────────────────┐
│  New Opportunity                    [×] │
├─────────────────────────────────────────┤
│                                         │
│  Opportunity Name *                     │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Account *              Close Date *    │
│  ┌───────────────┐   ┌───────────────┐ │
│  │               │   │               │ │
│  └───────────────┘   └───────────────┘ │
│                                         │
│  Stage *                                │
│  ┌─────────────────────────────────┐   │
│  │  Prospecting               ▼   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ▶ Additional Details                   │
│                                         │
├─────────────────────────────────────────┤
│  [ Cancel ]           [ Save & Open → ] │
└─────────────────────────────────────────┘
```

- Modal width: 480px, centred
- Overlay: `rgba(0,0,0,0.4)` backdrop
- All inputs use `.input-field` from the design system
- Required field marker `*`: `text-xs var(--color-danger)` after label
- "Additional Details" expandable: uses `ChevronRight` → `ChevronDown` toggle, `text-sm font-medium var(--color-info)`
- Save button: `.btn-primary`; Cancel: `.btn-secondary`
- On save, modal closes and page navigates to new Opportunity detail

---

## 9. Mark Won / Mark Lost Flow

### 9.1 Mark Won Modal

```
┌────────────────────────────────────────────┐
│  🎉  Mark Opportunity as Won               │
├────────────────────────────────────────────┤
│                                            │
│  Confirm the close date:                   │
│  ┌──────────────────────────────────┐     │
│  │  June 11, 2026            📅     │     │
│  └──────────────────────────────────┘     │
│                                            │
│  Final Amount:                             │
│  ┌──────────────────────────────────┐     │
│  │  $48,500                         │     │
│  └──────────────────────────────────┘     │
│                                            │
├────────────────────────────────────────────┤
│  [ Cancel ]          [ Mark as Won ✓ ]     │
└────────────────────────────────────────────┘
```

- Confirm button: `.btn-primary` (gold)
- Header emoji/icon: celebratory but restrained — single `Trophy` icon from lucide-react, 24px in `var(--accent)`

### 9.2 Mark Lost Modal

```
┌────────────────────────────────────────────┐
│  Mark Opportunity as Lost                  │
├────────────────────────────────────────────┤
│                                            │
│  Close Reason *                            │
│  ┌──────────────────────────────────┐     │
│  │  Lost to competitor         ▼    │     │
│  └──────────────────────────────────┘     │
│                                            │
│  Additional Notes                          │
│  ┌──────────────────────────────────┐     │
│  │                                  │     │
│  │                                  │     │
│  └──────────────────────────────────┘     │
│                                            │
├────────────────────────────────────────────┤
│  [ Cancel ]         [ Mark as Lost ✗ ]     │
└────────────────────────────────────────────┘
```

- Confirm button: `background: var(--color-danger)`, white text — *exception to the gold-only primary button rule, justified by the destructive/terminal nature of this action*

---

## 10. Dark Mode Specifications

All colours must use CSS variable tokens. The following are the dark-mode-specific design notes beyond the token table in Design_System.md:

| Element | Dark Mode Behaviour |
|---------|-------------------|
| Chevron (completed) | `rgba(251,191,36,0.2)` fill — maintains gold without overwhelming |
| Chevron (active) | `#FBBF24` fill, `#1A1A1A` text — same contrast ratio as light mode |
| Chevron (future) | `var(--bg-light)` = `#3A3A3A` |
| Overdue banner | `rgba(245,124,0,0.15)` bg, `1px solid rgba(245,124,0,0.4)` border |
| Closed Won banner | `rgba(56,142,60,0.15)` bg, `1px solid rgba(56,142,60,0.4)` border |
| Closed Lost banner | `rgba(198,40,40,0.15)` bg, `1px solid rgba(198,40,40,0.4)` border |
| Next Step accent bar | `border-left: 3px solid var(--accent)` = `#FBBF24` in dark mode |
| Synced quote row | `background: rgba(251,191,36,0.08)` — pale gold tint on dark |
| History stage-change rows | `background: rgba(251,191,36,0.06)` |
| Card shadows | Removed in dark mode; rely on `1px solid var(--border)` = `#3A3A3A` |

---

## 11. Responsive Behaviour

### Desktop (≥ 1280px)
- Full two-column layout as specified.
- Chevron navigator shows all 8 stages with labels visible.
- Related panels in right column are always visible.

### Tablet (1024–1279px)
- Two-column layout maintained, 60/40 split.
- Chevron labels truncate to abbreviations: "Prospect", "Qualify", "Needs", "Value", "Proposal", "Negotiate", "Won", "Lost".
- Probability % sub-labels hidden from chevrons; shown in tooltip on hover.

### Mobile (< 1024px)
- Single column layout; right column stacks below left.
- Chevron navigator collapses to a single-row progress strip with current stage name and `Step N of 8` counter.
- Tapping the progress strip opens a bottom sheet with full stage list for navigation.
- Header action buttons collapse into a single `⋯` menu.
- Related panels are collapsed by default on mobile.

---

## 12. Animations

All animations follow the table in Design_System.md section 10. Module-specific additions:

| Interaction | Animation | Duration | Notes |
|------------|-----------|----------|-------|
| Chevron stage change | Stage fill slides left-to-right using clip-path transition | 300ms ease-out | Gold wash fills new active chevron |
| New opportunity modal open | `fadeIn` + slight scale-up from 0.97 to 1.0 | 200ms ease-out | Standard modal entrance |
| Related panel expand/collapse | Height transition | 200ms ease-out | Same as collapsible section card spec |
| Activity log item appear | `fadeIn` staggered 30ms per item | 300ms ease-out | On tab switch to Activity |
| Mark Won confirmation | `--color-success` pulse on chevron | 400ms, 1 iteration | Celebratory moment, then steady state |
| Mark Lost confirmation | No animation — immediate | — | Intentionally flat to match gravity of action |
| Overdue banner slide-in | `slideIn` from top | 250ms ease-out | Appears above tab bar |

---

## 13. Iconography

All icons sourced from `lucide-react` at consistent sizes:

| Usage | Icon | Size |
|-------|------|------|
| Stage complete (chevron) | `Check` | 14px |
| Stage active dot | `Circle` (filled) | 8px |
| Closed Won | `CheckCircle` | 16px |
| Closed Lost | `XCircle` | 16px |
| Priority star | `Star` (filled) | 16px |
| Private lock | `Lock` | 14px |
| Overdue warning | `AlertTriangle` | 16px |
| Activity: Call | `Phone` | 16px |
| Activity: Email | `Mail` | 16px |
| Activity: Task | `CheckSquare` | 16px |
| Activity: Meeting | `Calendar` | 16px |
| Activity: Note | `FileText` | 16px |
| Add related record | `Plus` | 14px |
| Panel collapse | `ChevronDown` / `ChevronRight` | 14px |
| Tab active indicator | — (CSS border only) | — |
| Mark Won (modal) | `Trophy` | 24px |
| More actions | `MoreHorizontal` | 16px |
| New Opportunity | `TrendingUp` | 16px |

---

## 14. Component Checklist (for Engineering Handoff)

- [ ] `<ChevronNavigator>` — 8-stage chevron strip, all states, mobile fallback
- [ ] `<StageChangeModal>` — confirmation modal, Won/Lost variants
- [ ] `<OpportunityHeader>` — name, account, badges, action buttons
- [ ] `<OverdueBanner>` — conditional warning/closed state banner
- [ ] `<DetailTabBar>` — Details / Activity / History tabs with gold underline
- [ ] `<OpportunityInfoCard>` — 4 detail cards with 2-col field grid
- [ ] `<NextStepHighlight>` — accent-bar styled Next Step field
- [ ] `<ActivityTimeline>` — grouped activity log with icons
- [ ] `<HistoryTable>` — field change audit log
- [ ] `<RelatedPanel>` — collapsible panel container (reusable)
- [ ] `<RelatedList>` — row-based list with badges and "View all" link
- [ ] `<LineItemsPanel>` — product list with running total footer
- [ ] `<SyncedQuoteBadge>` — gold SYNCED indicator on Quote row
- [ ] `<NewOpportunityModal>` — create modal with expandable additional fields
- [ ] `<MarkWonModal>` — close date + amount confirmation
- [ ] `<MarkLostModal>` — close reason picklist + notes

---

## 15. Design Tokens Quick Reference (Module-Specific)

All values derive from `Design_System.md`. This table is a convenience summary:

| Token | Purpose in this Module |
|-------|----------------------|
| `var(--accent)` | Active chevron fill, tab underline, Next Step bar, SYNCED badge |
| `var(--accent-pale)` | Synced quote row tint, history stage-change row tint |
| `var(--color-success)` | Closed Won chevron, Won banner border/icon |
| `var(--color-danger)` | Closed Lost chevron, Lost banner border/icon, Mark Lost button |
| `var(--color-warning)` | Overdue banner border/icon |
| `var(--color-info)` | Reference field links, "View all" links, expandable section CTA |
| `var(--text-muted)` | Panel header titles, chevron future labels |
| `var(--bg-light)` | Future chevron fill, card hover, Next Step background |
| `var(--border)` | All card/panel borders, row dividers |

---

*End of Design Spec — Opportunity Module*
