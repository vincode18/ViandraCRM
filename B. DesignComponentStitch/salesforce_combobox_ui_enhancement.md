# Case Header UI Enhancement — Salesforce Integration Combobox

> **Reference:** UT Service Console Case Detail View  
> **Enhancement:** Add dynamic Combobox selector next to "Salesforce" label  
> **Purpose:** Allow agents to select/switch between different Salesforce record types or instances

---

## Current State

```
CASE  Medium Priority  Closed
01532785

[ Open ]  [ Assigned ]  [ In Progress ]  [ Resolved ]  [ ● Closed ]
```

---

## Proposed Enhancement

### Location: Case Header Title Bar

Position the new combobox **adjacent to the Salesforce reference** or **system label**.

```
CASE  Medium Priority  Closed
01532785

Salesforce Record Type: [ ▼ Case / Quotation / Opportunity ]
```

---

## Design Details

### 1. Combobox Placement

| Location | Option 1 | Option 2 | Option 3 |
|----------|----------|----------|----------|
| **Inline with case meta** | Next to "Medium Priority" label | After case number | In system section |
| **Display** | Dropdown | Dropdown | Dropdown |
| **Width** | ~200px | ~180px | ~160px |
| **Recommended** | ✅ | (compact) | (right-aligned) |

---

### Layout Option A: Inline in Title Bar (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│ [🔴] CASE         Medium Priority  Closed                  │
│      01532785                                               │
│                                                              │
│      Salesforce Record Type:                                │
│      [ Case ▼ ]                                             │
└─────────────────────────────────────────────────────────────┘
```

| Field | Value |
|-------|-------|
| Label | "Salesforce Record Type:" |
| Dropdown options | Case, Quotation, Opportunity, Account, Contact |
| Default value | Case (current) |
| Width | 180px |
| Margin | 0 0 0 10px |
| Font size | 12px |

---

### Layout Option B: Compact Inline (Right-aligned)

```
┌──────────────────────────────────────────────────────────────┐
│ [🔴] CASE  01532785              [ Case ▼ ] [ Edit ] [ ... ]│
│     Medium Priority | Closed                                 │
│     GD829 R&I STEERING VALVE                                 │
└──────────────────────────────────────────────────────────────┘
```

| Field | Value |
|-------|-------|
| Label position | Hidden / icon tooltip |
| Dropdown options | Case, Quotation, Opportunity, Account, Contact |
| Placement | Right side, before action buttons |
| Width | 140px |
| Font size | 11px |

---

### Layout Option C: Dedicated System Row (Below Title)

```
┌──────────────────────────────────────────────────────────────┐
│ [🔴] CASE  01532785  |  Medium Priority  |  Closed          │
│ GD829 R&I STEERING VALVE                                    │
│                                                               │
│ Salesforce Type: [ Case ▼ ]   External ID: 202631001532785  │
└──────────────────────────────────────────────────────────────┘
```

| Field | Value |
|-------|-------|
| Row type | System info strip |
| Label | "Salesforce Type:" |
| Dropdown options | Case, Quotation, Opportunity, Account, Contact |
| Width | 160px |
| Additional field | Show External SF ID |
| Background | Slightly lighter gray (`#F8FAFC`) |

---

## Combobox Specifications

### Dropdown Options

| Option | Value | Description | Icon |
|--------|-------|-------------|------|
| Case | `case` | Service case record | 📋 |
| Quotation | `quotation` | Sales quotation/quote | 💰 |
| Opportunity | `opportunity` | Sales opportunity | ⭐ |
| Account | `account` | Customer account | 🏢 |
| Contact | `contact` | Customer contact | 👤 |

### Behavior

| Interaction | Behavior |
|-------------|----------|
| **On change** | Trigger sidebar/panel refresh to show relevant fields |
| **Validation** | Prevent switching if case has unsaved changes (confirm dialog) |
| **Sync** | Automatically sync SF field mappings based on selected type |
| **Visual feedback** | Selected option highlighted, icon displayed |
| **Keyboard nav** | Arrow up/down to navigate, Enter to select, Escape to close |
| **Search** | Optional: type to filter options (if 5+ options) |

---

## HTML Structure

```html
<div class="case-header-salesforce-selector">
  <label for="sf-type-combo" class="label">Salesforce Record Type:</label>
  
  <select id="sf-type-combo" class="combobox">
    <option value="case" selected>Case</option>
    <option value="quotation">Quotation</option>
    <option value="opportunity">Opportunity</option>
    <option value="account">Account</option>
    <option value="contact">Contact</option>
  </select>
</div>
```

---

## CSS Styling

```css
.case-header-salesforce-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.case-header-salesforce-selector .label {
  font-size: 11px;
  color: #64748B;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}

.combobox {
  padding: 6px 10px;
  border: 0.5px solid #CBD5E1;
  border-radius: 6px;
  background: #FFFFFF;
  font-size: 12px;
  color: #1E293B;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 180px;
  appearance: none;
  padding-right: 28px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231E293B' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.combobox:hover {
  border-color: #94A3B8;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.05);
}

.combobox:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.combobox:focus-visible {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

---

## State Behaviors

| State | Appearance | Behavior |
|-------|-----------|----------|
| **Default** | Border: `#CBD5E1`, bg white | Shows current selection |
| **Hover** | Border: `#94A3B8`, subtle shadow | Indicates clickable |
| **Focus** | Border: `#2563EB`, 3px blue ring | Keyboard/click active |
| **Disabled** | Border: `#E2E8F0`, bg: `#F8FAFC`, text gray | Cannot interact |
| **Open** | Blue border, dropdown visible | Options displayed |
| **Selected** | Bold text, checkmark indicator | Shows chosen option |

---

## Interaction Flow

```
┌─────────────────────────────────┐
│ User clicks Combobox            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Dropdown Opens                  │
│ ✓ Case (current)                │
│   Quotation                     │
│   Opportunity                   │
│   Account                       │
│   Contact                       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ User selects "Quotation"        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ IF (unsaved changes)            │
│   Show: "Confirm switch?"       │
│   [Cancel] [Discard] [Save]     │
│ ELSE                            │
│   Refresh sidebar fields        │
│   Update SF mapping             │
│   Log change in audit trail     │
└─────────────────────────────────┘
```

---

## Field Mapping Reference

### When "Case" is selected:
- Show: Asset, Work Order, Account, Contact, Service Area
- Hide: Quote Amount, Quote Date
- Highlight: SLA, Case History, Related Work Orders

### When "Quotation" is selected:
- Show: Quote Amount, Quote Date, Customer, Billing Address
- Hide: Work Order, Asset (optional show)
- Highlight: Quote Status, Approval History, Line Items

### When "Opportunity" is selected:
- Show: Opportunity Name, Stage, Amount, Close Date
- Hide: Work Order, Asset
- Highlight: Opportunity History, Forecast Category

---

## Accessibility

| Requirement | Implementation |
|-------------|-----------------|
| **Label association** | `<label for="sf-type-combo">` paired with `<select id="sf-type-combo">` |
| **Keyboard nav** | Tab to focus, Arrow keys to navigate, Enter to select |
| **Screen reader** | `aria-label="Salesforce Record Type selector"` |
| **Focus indicator** | Visible 2px blue outline on focus |
| **Error messaging** | `aria-invalid="true"` + `aria-describedby="error-msg"` if validation fails |

---

## Example: Implementation in Case Header

```html
<div class="case-header">
  
  <!-- Existing case identity -->
  <div class="case-identity">
    <div class="case-icon">📋</div>
    <div>
      <div class="label">CASE</div>
      <div class="case-number">01532785</div>
      <div class="case-meta">
        <span class="badge medium">Medium Priority</span>
        <span class="badge closed">Closed</span>
        <span>GD829 R&I STEERING VALVE</span>
      </div>
    </div>
  </div>

  <!-- NEW: Salesforce Type Selector -->
  <div class="case-header-salesforce-selector">
    <label for="sf-type-combo">Salesforce Record Type:</label>
    <select id="sf-type-combo" class="combobox">
      <option value="case" selected>Case</option>
      <option value="quotation">Quotation</option>
      <option value="opportunity">Opportunity</option>
      <option value="account">Account</option>
      <option value="contact">Contact</option>
    </select>
  </div>

  <!-- Existing action buttons -->
  <div class="action-buttons">
    <button class="btn">✏️ Edit</button>
    <button class="btn">👤 Change Owner</button>
    <button class="btn">🖨️ Print View</button>
    <button class="btn">⋮ More</button>
  </div>

</div>
```

---

## Use Cases

### Use Case 1: Case → Quotation
**Scenario:** Agent receives service case, needs to create quotation for repair work.

```
Current state: Case 01532785 (selected)
User action: Click combobox, select "Quotation"
Result: 
  - Right panel switches to show Quotation fields
  - Quote template prefilled from case data
  - Allow agent to create linked quotation
```

### Use Case 2: Quotation → Opportunity
**Scenario:** Quotation approved, now track as sales opportunity.

```
Current state: Quote Q-00148203 (from case)
User action: Click combobox, select "Opportunity"
Result:
  - Sidebar shows Opportunity fields
  - Synced amount from quotation
  - Track forecast, close date
```

### Use Case 3: Multi-record Navigation
**Scenario:** Agent managing case with associated opportunity & quotation.

```
Before: Required 3 tabs to navigate
After: Single dropdown switch between records
Benefit: Faster workflow, less context switching
```

---

## Summary

| Aspect | Detail |
|--------|--------|
| **Purpose** | Quick navigation & context switching between Salesforce record types |
| **Location** | Case header title bar |
| **Type** | HTML `<select>` / Styled Combobox |
| **Options** | Case, Quotation, Opportunity, Account, Contact |
| **Width** | 180px (default), 160px (compact) |
| **Behavior** | Switch record context, refresh sidebar, validate unsaved changes |
| **Accessibility** | Full keyboard nav, screen reader support, ARIA labels |
| **Recommended** | Layout Option A (inline with case meta) |

---

*UI Enhancement Design v1.0 — Salesforce Record Type Combobox for Case Header*
