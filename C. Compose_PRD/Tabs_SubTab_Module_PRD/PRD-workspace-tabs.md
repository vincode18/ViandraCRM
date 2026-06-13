# PRD — Workspace Tabs
**Product:** UT Service Console  
**Module:** Shell / Navigation  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-06-11

---

## 1. Overview

Workspace Tabs give agents a persistent, multi-record browsing experience directly inside the UT Service Console. Rather than navigating away from a record to open another, agents can open, pin, and switch between multiple records or module views in a single browser session — similar to browser tabs but scoped to the console.

Each tab maintains its own scroll position and live state. Closing a tab does not affect other open tabs.

---

## 2. Goals

| Goal | Metric |
|------|--------|
| Reduce context-switching time for agents handling multiple open records | Average tab-switches per session |
| Allow agents to keep frequently-used modules pinned across the session | % of sessions with ≥1 pinned tab |
| Maintain record state when switching between tabs | Zero unintentional data loss events |

---

## 3. Non-Goals

- Workspace Tabs are **not** a full browser tab replacement — they live within the app shell, not the browser chrome.
- Tab state is **not** persisted across browser refreshes or separate login sessions (v1).
- No drag-to-reorder of tabs in v1.

---

## 4. User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|---------|
| WT-01 | Service agent | Open a Case and a Work Order side by side in separate tabs | I can reference both without losing my place |
| WT-02 | Service agent | Pin the Cases list tab | It always stays open at the start of the tab bar |
| WT-03 | Service agent | Open a navigation item in a new tab via Ctrl+click / Cmd+click | I can start a new context without closing what I'm working on |
| WT-04 | Service agent | Close a tab I no longer need | The tab bar stays clean |
| WT-05 | Service agent | Refresh a single tab | I get fresh data without reloading the whole console |
| WT-06 | Service agent | Customise the label of a tab | I can distinguish two similar tabs (e.g. two open Cases) |

---

## 5. Functional Requirements

### 5.1 Tab Bar

- The tab bar sits **below the global nav header** and **above the main content area**.
- Maximum visible tabs: **8**. A horizontal scroll or overflow menu (chevron `›`) reveals additional tabs when the bar is full.
- Each tab displays:
  - **Module icon** (16×16 px, from `lucide-react`)
  - **Tab label** — truncated at 160px with `text-overflow: ellipsis`
  - **Close button** (`×`) — visible on hover or when the tab is active
- The **active tab** is indicated by:
  - Bottom border: `2px solid var(--accent)` (`#F5C800`)
  - Background: `var(--bg-card)`
  - Label weight: `font-semibold`
- Inactive tabs use `var(--bg-light)` background and `var(--text-tertiary)` label colour.

### 5.2 Opening Tabs

| Trigger | Behaviour |
|---------|-----------|
| Click a navigation item | Opens in the **current active tab** (replaces its content) |
| **Ctrl+click** or **Cmd+click** a navigation item | Opens in a **new workspace tab** to the right of the current tab |
| Click a record row in a list view | Opens the record in the **current active tab** |
| Action that explicitly targets a new tab (e.g. "Open in new tab" context menu) | Opens in a **new workspace tab** |

### 5.3 Tab Menu (Chevron `⌄`)

Each tab has a **chevron-down** (`ChevronDown`) icon that reveals a dropdown menu on click. Menu items:

| Action | Description |
|--------|-------------|
| **Refresh** | Reloads the tab's content from the server. Shows a spinner on the tab icon during load. |
| **Pin** | Moves the tab to the leftmost pinned position. Pinned tabs: no close button, narrower width (icon only), persist for the session. |
| **Unpin** | (Pinned tabs only) Returns tab to normal width with label. |
| **Rename** | Opens an inline text input on the tab label. Confirm with Enter, cancel with Escape. Max 40 characters. |
| **Close** | Closes this tab. If it is the active tab, focus moves to the tab immediately to its left (or right if none). |
| **Close Other Tabs** | Closes all tabs except this one and any pinned tabs. Requires a confirmation dialog. |

**Menu styling** follows the standard card/dropdown pattern from the Design System: `var(--bg-card)` background, `1px solid var(--border)` border, `box-shadow: 0 2px 8px rgba(0,0,0,0.12)`, `rounded` corners, `text-sm` items with hover fill `var(--bg-light)`.

### 5.4 Pinned Tabs

- Pinned tabs sit at the **left** of the tab bar, separated from regular tabs by a `1px solid var(--border)` vertical divider.
- Pinned tabs show **icon only** (no label, no close button).
- A tooltip (`title` attribute) shows the full label on hover.
- Up to **5** tabs may be pinned simultaneously.
- Pin state persists for the duration of the browser session (stored in `sessionStorage`).

### 5.5 Closing Tabs

- Clicking the `×` button on a tab closes it immediately (no confirmation) unless the tab contains **unsaved form changes**, in which case a modal is shown:

> **Unsaved changes**  
> You have unsaved changes on this tab. Do you want to discard them?  
> [**Discard**] [**Keep editing**]

- Closing the last non-pinned tab leaves the tab bar with pinned tabs only; the main content area shows the **default landing module**.

### 5.6 Keyboard & Accessibility

| Shortcut | Action |
|----------|--------|
| `Ctrl+W` / `Cmd+W` | Close active tab |
| `Ctrl+Tab` | Switch to next tab (right) |
| `Ctrl+Shift+Tab` | Switch to previous tab (left) |
| `Ctrl+click` / `Cmd+click` | Open nav item in new tab |

- Tab bar is a `role="tablist"` element; each tab is `role="tab"` with `aria-selected`.
- Focus ring: `2px solid var(--accent)` per the Design System focus style.
- Min touch target: `44px` height on all interactive elements.

---

## 6. Design Tokens

All colours reference the UT Service Console Design System v1.0.

| Element | Token / Value |
|---------|--------------|
| Active tab bottom border | `var(--accent)` — `#F5C800` |
| Active tab background | `var(--bg-card)` |
| Inactive tab background | `var(--bg-light)` |
| Tab bar background | `var(--bg-panel)` |
| Tab label (active) | `var(--text-main)`, `font-semibold` |
| Tab label (inactive) | `var(--text-tertiary)`, `font-medium` |
| Tab close icon | `var(--text-muted)` → hover `var(--text-secondary)` |
| Tab bar border bottom | `1px solid var(--border)` |
| Pinned tab divider | `1px solid var(--border)` |
| Tab menu shadow | `0 2px 8px rgba(0,0,0,0.12)` |

---

## 7. Component Structure

```
<TabBar>                          // role="tablist", sticky below header
  <PinnedTabGroup>                // icon-only tabs, left side
    <Tab pinned />
  </PinnedTabGroup>
  <PinnedDivider />               // 1px vertical border
  <RegularTabGroup>               // scrollable if overflow
    <Tab>
      <TabIcon />                 // lucide-react, 16px
      <TabLabel />                // truncated text
      <TabChevron />              // ChevronDown — opens TabMenu
      <TabClose />                // × — visible on hover / active
    </Tab>
  </RegularTabGroup>
  <TabOverflowMenu />             // shown when tabs exceed bar width
</TabBar>

<TabMenu>                         // dropdown per tab
  Refresh | Pin | Rename | Close | Close Other Tabs
</TabMenu>

<UnsavedChangesModal />           // confirmation before close
```

---

## 8. Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Opening the same record twice | Second open navigates to the **existing tab** for that record; no duplicate created |
| Session storage unavailable | Pin state degrades gracefully — tabs still open but don't persist as pinned on refresh |
| Tab label empty after rename | Reverts to the original auto-generated label |
| More than 8 tabs open | Tab bar shows a `+N more` overflow button that opens a dropdown list of overflow tabs |
| Browser back/forward | Not intercepted — operates on the browser history stack, not the tab stack |

---

## 9. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | Should tab state (open records) restore on page refresh in v2? | Product | — |
| 2 | Should renamed tab labels sync to the record title if the record is updated? | Engineering | — |
| 3 | Maximum number of tabs before UX degrades — confirm 8 is right for target screen size | Design | — |

---

## 10. Acceptance Criteria

- [ ] Tabs render below the global header with correct active/inactive styles per the Design System.
- [ ] Ctrl+click / Cmd+click on any nav item opens a new tab without affecting the current tab.
- [ ] The tab chevron menu renders all five actions: Refresh, Pin, Rename, Close, Close Other Tabs.
- [ ] Pinned tabs show icon-only with tooltip, no close button, and appear left of regular tabs.
- [ ] Unsaved-changes modal appears before closing a tab with a dirty form.
- [ ] All keyboard shortcuts function correctly.
- [ ] Focus management moves correctly after a tab is closed.
- [ ] All colours and typography match Design System v1.0 tokens.
- [ ] Min touch target of 44px met on all tab interactive elements.
- [ ] Dark mode: all tab states render correctly with dark-mode tokens.
