# PRD — Subtabs
**Product:** UT Service Console  
**Module:** Shell / Navigation  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-06-11

---

## 1. Overview

Subtabs are a secondary tab row that appears **inside a Workspace Tab** when a related record is opened from within that tab. While Workspace Tabs represent top-level navigation contexts (e.g. a Case list, a Work Order record), Subtabs represent records or views that are logically nested beneath the parent tab.

The Subtab row sits between the Workspace Tab bar and the main content area of the parent tab. Agents can switch between the parent record and related records without losing the parent context.

---

## 2. Goals

| Goal | Metric |
|------|--------|
| Keep related-record navigation scoped within the originating Workspace Tab | Reduction in "lost context" support feedback |
| Let agents work across a parent record and its related records simultaneously | Average subtabs opened per session |
| Avoid polluting the main Workspace Tab bar with related records | Workspace Tab bar count stays focused on primary contexts |

---

## 3. Non-Goals

- Subtabs do **not** nest further — there are no sub-subtabs.
- Subtabs are **not** cross-tab; they belong exclusively to the Workspace Tab they were opened from.
- Records opened from the **Split View Panel** open as new **Workspace Tabs**, not Subtabs.

---

## 4. User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|---------|
| ST-01 | Service agent | Open a related Contact from within a Case tab and see it as a subtab | I can view the Contact without losing my Case context |
| ST-02 | Service agent | Switch between the parent Case subtab and a related Work Order subtab | I can cross-reference without re-navigating |
| ST-03 | Service agent | Close a subtab I no longer need | The subtab row stays clean |
| ST-04 | Service agent | Refresh a subtab | I get the latest data for that related record |
| ST-05 | Service agent | See which subtab is currently active | I always know where I am in the hierarchy |

---

## 5. Functional Requirements

### 5.1 Subtab Row

- The Subtab row appears **only when at least one subtab is open** within a Workspace Tab.
- It renders **below the Workspace Tab bar** and **above the main content area** of the active Workspace Tab.
- The Subtab row is **scoped to its parent Workspace Tab** — switching Workspace Tabs shows a different (or empty) Subtab row.
- The first subtab slot is always the **parent record tab** (the root content of the Workspace Tab), which cannot be closed.

**Row appearance:**
- Background: `var(--bg-panel)`
- Bottom border: `1px solid var(--border)`
- Height: `36px` (compact, distinguishable from the 44px Workspace Tab bar)
- Subtab item padding: `px-3 py-1.5`

### 5.2 Subtab Item

Each subtab displays:
- **Module icon** — 14×14 px (`lucide-react`)
- **Tab label** — record name or module name, truncated at 140px with `text-overflow: ellipsis`
- **Close button** (`×`) — visible on hover or when active (hidden on the parent root subtab)
- **Chevron `⌄`** — same tab menu as Workspace Tabs (Refresh, Rename, Close)

**Active subtab:**
- Bottom border: `2px solid var(--accent)` (`#F5C800`)
- Background: `var(--bg-card)`
- Label: `var(--text-main)`, `font-semibold`, `text-xs`

**Inactive subtab:**
- Background: `var(--bg-light)`
- Label: `var(--text-tertiary)`, `font-medium`, `text-xs`

> Subtabs use `text-xs` (12px) to visually distinguish them from `text-sm` (14px) Workspace Tabs.

### 5.3 Opening Subtabs

| Trigger | Behaviour |
|---------|-----------|
| Click a related record link within a Workspace Tab (e.g. a linked Contact in a Case detail) | Opens the related record as a **subtab** within the current Workspace Tab |
| Click a related record in an inline related list (e.g. Cases panel on an Account) | Opens as a **subtab** |
| Click a related record from the **Split View Panel** | Opens as a **new Workspace Tab** (not a subtab) |

Records opened as subtabs do **not** appear in the Workspace Tab bar.

### 5.4 Subtab Menu (Chevron `⌄`)

Clicking the `ChevronDown` icon on any subtab (except the parent root subtab) reveals:

| Action | Description |
|--------|-------------|
| **Refresh** | Reloads this subtab's record content. Shows spinner on subtab icon. |
| **Rename** | Inline text input on the subtab label. Confirm Enter, cancel Escape. Max 40 characters. |
| **Close** | Closes this subtab. Focus moves to the subtab immediately to its left. |

The parent root subtab's chevron menu offers only **Refresh** (it cannot be renamed or closed independently).

**Menu styling:** same card/dropdown pattern as Workspace Tab menus — `var(--bg-card)`, `1px solid var(--border)`, `box-shadow: 0 2px 8px rgba(0,0,0,0.12)`, `rounded`, `text-xs` items.

### 5.5 Closing Subtabs

- Clicking `×` on a subtab closes it immediately unless the subtab has **unsaved form changes**, in which case the same **Unsaved Changes modal** used by Workspace Tabs is shown.
- Closing all subtabs hides the Subtab row entirely (the parent root tab content fills the main area).
- Closing the parent Workspace Tab closes all its subtabs simultaneously.

### 5.6 Maximum Subtabs

- Maximum **6 subtabs** per Workspace Tab (including the parent root tab), totalling 5 openable related records.
- If the limit is reached, opening another related record navigates to the **existing subtab** for that record if it is already open, or shows a toast notification:

> **Subtab limit reached.** Close a subtab to open this record.

### 5.7 Keyboard & Accessibility

| Shortcut | Action |
|----------|--------|
| `Alt+←` / `Alt+→` | Move focus between subtabs |
| `Alt+W` | Close the active subtab |

- Subtab row is a nested `role="tablist"` with `aria-label="Related records"`.
- Each subtab is `role="tab"` with `aria-selected` and `aria-controls` pointing to the subtab panel.
- The Subtab row has `aria-label="Subtabs for [parent record name]"` for screen reader context.
- Focus ring: `2px solid var(--accent)` per Design System.
- Min touch target: `44px` height on close `×` and chevron buttons (using padding expansion).

---

## 6. Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  WORKSPACE TAB BAR  (44px)                                  │
│  [📋 Cases] [📄 WO-0042 ⌄ ×] [📋 Accounts]               │
├─────────────────────────────────────────────────────────────┤
│  SUBTAB ROW  (36px) — scoped to active workspace tab        │
│  [📄 WO-0042] [👤 Sean Forbes ⌄ ×] [📋 Case-001 ⌄ ×]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MAIN CONTENT AREA — renders active subtab content          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Design Tokens

All colours reference the UT Service Console Design System v1.0.

| Element | Token / Value |
|---------|--------------|
| Subtab row background | `var(--bg-panel)` |
| Subtab row bottom border | `1px solid var(--border)` |
| Active subtab bottom border | `2px solid var(--accent)` — `#F5C800` |
| Active subtab background | `var(--bg-card)` |
| Inactive subtab background | `var(--bg-light)` |
| Active subtab label | `var(--text-main)`, `font-semibold`, `text-xs` |
| Inactive subtab label | `var(--text-tertiary)`, `font-medium`, `text-xs` |
| Subtab close icon | `var(--text-muted)` → hover `var(--text-secondary)` |
| Subtab height | `36px` |
| Subtab icon size | `14px` |

> The intentionally smaller height (36px vs 44px) and font size (`text-xs` vs `text-sm`) create the visual hierarchy distinguishing subtabs from workspace tabs.

---

## 8. Component Structure

```
<SubtabBar parentTabId="wt-002">      // role="tablist", shown when subtabs exist
  <Subtab root>                        // parent record, not closeable
    <SubtabIcon />                     // 14px lucide-react icon
    <SubtabLabel />                    // truncated record name
    <SubtabChevron />                  // ChevronDown — opens SubtabMenu (refresh only)
  </Subtab>

  <Subtab>                             // related record subtab
    <SubtabIcon />
    <SubtabLabel />
    <SubtabChevron />                  // ChevronDown — refresh, rename, close
    <SubtabClose />                    // × — visible on hover / active
  </Subtab>
</SubtabBar>

<SubtabMenu>                           // dropdown per subtab
  Refresh | Rename | Close
</SubtabMenu>

<SubtabLimitToast />                   // toast when max subtabs reached
<UnsavedChangesModal />                // shared with Workspace Tabs
```

---

## 9. Relationship to Other Features

| Feature | Relationship |
|---------|-------------|
| **Workspace Tabs** | Subtabs live inside a single Workspace Tab. Closing a Workspace Tab destroys all its subtabs. |
| **Split View Panel** | Records opened from the Split View Panel open in new **Workspace Tabs**, bypassing the Subtab system. |
| **Utility Bar** | The Utility Bar (History, Notes) is always visible beneath the main content area, regardless of subtab state. |

---

## 10. Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Related record opened that is already a subtab | Navigates to the **existing subtab**; no duplicate created |
| All workspace tabs closed except root | Subtab row is hidden |
| Parent Workspace Tab is closed while subtabs are open and have unsaved changes | Unsaved Changes modal fires for each dirty subtab in sequence before closing |
| Screen width too narrow for all subtabs | Subtab row scrolls horizontally (no overflow menu in v1) |
| Subtab renamed to empty string | Reverts to auto-generated record label |
| Switching to a different Workspace Tab | Subtab row swaps to reflect that Workspace Tab's own subtabs |

---

## 11. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | Should subtab state (open related records) be persisted in the URL for shareability? | Product | — |
| 2 | Should related records opened via the Utility Bar (History panel) open as subtabs or workspace tabs? | Product | — |
| 3 | Confirm max subtab count of 6 — sufficient for typical Case + related records workflow? | Design / Research | — |

---

## 12. Acceptance Criteria

- [ ] Subtab row renders below the Workspace Tab bar and above the main content area, only when at least one subtab is open.
- [ ] Switching between Workspace Tabs swaps the Subtab row to the corresponding set of subtabs.
- [ ] Clicking a related record link within a Workspace Tab opens it as a subtab (not a new Workspace Tab).
- [ ] Clicking a related record from the Split View Panel opens a new Workspace Tab (not a subtab).
- [ ] The parent root subtab cannot be closed; its chevron menu shows Refresh only.
- [ ] Chevron menu on regular subtabs shows Refresh, Rename, and Close.
- [ ] Toast notification fires when the subtab limit (6) is reached.
- [ ] Unsaved-changes modal fires before closing a subtab with a dirty form.
- [ ] Subtab typography (`text-xs`) is visually distinct from Workspace Tab typography (`text-sm`).
- [ ] All colours and styles match Design System v1.0 tokens.
- [ ] Min touch target of 44px met on all subtab interactive elements.
- [ ] Keyboard shortcuts `Alt+←`, `Alt+→`, `Alt+W` function correctly.
- [ ] Screen reader: `role="tablist"` / `role="tab"` / `aria-selected` correctly implemented.
- [ ] Dark mode: all subtab states render correctly with dark-mode tokens.
