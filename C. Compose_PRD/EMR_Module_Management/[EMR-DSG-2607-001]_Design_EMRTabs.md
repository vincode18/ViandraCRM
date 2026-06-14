# Design Specification — EMR Module
## UT Service Console

> **Module:** Equipment Maintenance Report (EMR)
> **Version:** 1.0
> **Last Updated:** 2026-06-07
> **References:** `Design_System.md` v1.0, `PRD.md` v1.0
> **Source of Truth for Tokens:** `DEVELOPMENT_CRM/frontend/src/index.css` + `tailwind.config.js`

---

## 1. Page Structure & Layout

### 1.1 Overall Page Anatomy

The EMR detail page follows the same two-panel layout used in Work Orders and Service Appointments:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BREADCRUMB  (EMR > U-00022418)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ACTION BAR  [Follow] [Upload Techcare Files] [Get Image From Azure]    │
│              [Delete] [Sharing] [Change Owner] [Edit]                   │
├─────────────────────────────────────────────────────────────────────────┤
│  CHEVRON PROGRESS BAR  (3 or 7 stages depending on EMR type)            │
├─────────────────────────────────────────────────────────────────────────┤
│  SUBJECT BANNER  (Gold background — EMR subject/title text)             │
├──────────────────────────────────┬──────────────────────────────────────┤
│                                  │                                      │
│   MAIN CONTENT  (65%)            │   RELATED PANEL  (35%)               │
│                                  │                                      │
│   [Tab Bar: Details / Feed /     │   Related                            │
│    FAR / TSI / TSR (U-type)]     │   ├── Work Orders (n)                │
│                                  │   ├── EMR Additional Group (n+)      │
│   ├── Core Fields (inline grid)  │   ├── EMR Additional Information (n) │
│   ├── Customer Information ▼     │   └── EMR History (n+)               │
│   ├── EMR Information ▼          │                                      │
│   └── Other Information ▼        │                                      │
│                                  │                                      │
└──────────────────────────────────┴──────────────────────────────────────┘
```

### 1.2 Grid & Spacing

| Zone | Width | Notes |
|------|-------|-------|
| Full page container | `max-w-screen-2xl` | Matches `AppLayout` |
| Page padding | `p-6` (24px) | Applied by `AppLayout` |
| Main content (left) | `~65%` (`flex-1`) | Grows to fill |
| Related panel (right) | `~35%` (`w-[360px]` or `w-[380px]`) | Fixed width sidebar |
| Gap between panels | `gap-6` (24px) | — |
| Section vertical spacing | `space-y-5` | Between collapsible sections |
| Card internal spacing | `space-y-3` to `space-y-4` | Within each section card |
| Form grid column gap | `gap-4` | Two-column form rows |

---

## 2. Header Components

### 2.1 Breadcrumb

```jsx
<nav className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
  <span>EMR</span>
  <span className="mx-1">›</span>
  <span style={{ color: 'var(--text-main)' }} className="font-medium">U-00022418</span>
</nav>
```

Typography: `text-xs`, `var(--text-tertiary)` for parent, `var(--text-main) font-medium` for current record.

### 2.2 Action Bar

Rendered as a right-aligned button row below the breadcrumb / in the page header:

| Button | Variant | Icon | Notes |
|--------|---------|------|-------|
| + Follow | `.btn-secondary` compact | `Bell` | S-type only |
| Upload Techcare Files | `.btn-secondary` compact | `Upload` | — |
| Get Image From Azure | `.btn-secondary` compact | `Cloud` | — |
| Delete | `.btn-secondary` compact | `Trash2` | Danger context — apply `color: var(--color-danger)` on icon |
| Sharing | `.btn-secondary` compact | `Share2` | — |
| Change Owner | `.btn-secondary` compact | `UserCheck` | — |
| Edit | `.btn-primary` compact | `Pencil` | Gold CTA |

All action bar buttons use compact sizing: `px-3 py-1.5 text-xs font-medium`.

### 2.3 Subject Banner

```jsx
<div
  className="w-full px-6 py-4 rounded mb-4 text-center"
  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-main)' }}
>
  <h1 className="text-xl font-bold">FSL New Enhancement Report Specialization Mechanic UT at SalesForce</h1>
</div>
```

| Property | Value |
|----------|-------|
| Background | `var(--accent)` — brand gold |
| Text color | `var(--text-main)` — dark on gold |
| Font size | `text-xl` (20px) `font-bold` |
| Padding | `px-6 py-4` |
| Border radius | `rounded` (4px) |

---

## 3. Chevron Progress Bar

### 3.1 Component Description

A horizontal stage-progress indicator pinned below the action bar. Stages are rendered as trapezoid/arrow shapes (Chevron style). The current active stage is highlighted in brand gold.

### 3.2 Stage Configurations

#### S-type (Scheduled) — 3 Stages

```
[ ✓ Open ] ──► [ ✓ In Progress ] ──► [ ● Closed ]
  (green)          (green)               (gold/active)
```

#### U-type (Unscheduled) — 7 Stages

```
[ ✓ Open ] ──► [ ✓ In Progress ] ──► [ ✓ Submit EMR ] ──► [ ● Assign TO ]
  (green)           (green)               (green)             (gold/active)
  ──► [ Not Complete ] ──► [ Resubmit ] ──► [ Closed ]
        (grey/pending)      (grey/pending)   (grey/pending)
```

### 3.3 Stage Visual States

| State | Background | Text | Icon |
|-------|-----------|------|------|
| **Completed** | `#388E3C` (success green) | `#FFFFFF` | `CheckCircle` (16px) |
| **Active / Current** | `var(--accent)` gold | `var(--text-main)` dark | `Circle` filled (16px) |
| **Pending / Future** | `var(--bg-light)` | `var(--text-tertiary)` | `Circle` outline (16px) |

### 3.4 Chevron Shape

Implemented via CSS clip-path or SVG polygon for the arrow-tab shape:

```css
.chevron-step {
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%);
  /* First item has no left indent: */
  /* clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%); */
}
```

Each step:
- Height: `44px` (min touch target)
- Padding: `px-4`
- Font: `text-xs font-medium`
- Transition: `transition-all duration-200`

### 3.5 Implementation Pattern

```jsx
const steps = emrType === 'S'
  ? ['Open', 'In Progress', 'Closed']
  : ['Open', 'In Progress', 'Submit EMR', 'Assign TO', 'Not Complete', 'Resubmit', 'Closed'];

const currentIndex = steps.indexOf(currentStatus);

steps.map((step, index) => {
  const state = index < currentIndex ? 'completed'
              : index === currentIndex ? 'active'
              : 'pending';
  return <ChevronStep key={step} label={step} state={state} isFirst={index === 0} />;
});
```

---

## 4. Tab Bar

### 4.1 Tab Configuration by EMR Type

| Tab | S-type | U-type | Description |
|-----|--------|--------|-------------|
| Details | ✓ | ✓ | Main form fields |
| Feed | ✓ | ✓ | Activity/comments feed |
| FAR | ✗ | ✓ | Field Activity Report |
| TSI | ✗ | ✓ | Technical Service Information |
| TSR | ✗ | ✓ | Technical Service Report |

### 4.2 Tab Styling

```jsx
// Active tab
className="px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors"
style={{
  borderBottomColor: 'var(--accent)',
  color: 'var(--text-main)',
}}

// Inactive tab
className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent transition-colors"
style={{ color: 'var(--text-tertiary)' }}
// hover: { color: 'var(--text-secondary)' }
```

---

## 5. Main Form — Details Tab

### 5.1 Core Fields Block (Always Visible)

Rendered as a two-column grid above the collapsible sections. These fields sit in the top of the Details tab without a section header.

```
Left Column                          Right Column
───────────────────────────────      ────────────────────────────────────
EMR Name          U-00022418  [✎]   EMR Status       Closed          [✎]
Supervisisi Awal  (text)       [✎]   Owner            UT Integration  [✎]
Asset             (lookup)     [✎]   Flag Azure        ☐              [✎]
Part Supply       ☐            [✎]
Aging Assign TO   (text)       [✎]
Aging Approval TO (text)       [✎]
UT Assign TO      (text)       [✎]
UT Approval TO    (text)       [✎]
UT Submit         (text)       [✎]
Aging Pending Submit  20       [✎]
Hours On Component (H) (text)  [✎]
Re-Open Reason    (text)       [✎]
```

### 5.2 Field Row Pattern

Each field row in the form:

```jsx
<div className="grid grid-cols-2 gap-4 py-2"
  style={{ borderBottom: '1px solid var(--border)' }}>
  
  {/* Label */}
  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
    EMR Name
  </span>
  
  {/* Value + Edit icon */}
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
      U-00022418
    </span>
    <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ color: 'var(--text-muted)' }}>
      <Pencil size={12} />
    </button>
  </div>
</div>
```

- Label: `text-xs var(--text-tertiary)`
- Value: `text-sm var(--text-secondary)` — IDs/numbers in `font-mono`
- Edit pencil icon: `Pencil` (12px), visible on row hover
- Linked values (lookups): `text-sm` `var(--color-info)` with underline on hover

### 5.3 Collapsible Section Cards

#### Header Row

```jsx
<div
  className="flex items-center justify-between px-4 py-3 cursor-pointer"
  style={{ borderBottom: '1px solid var(--border)' }}
  onClick={() => toggleSection('customer')}
>
  <div className="flex items-center gap-2">
    <ChevronDown
      size={16}
      className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
      style={{ color: 'var(--text-muted)' }}
    />
    <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
      Customer Information
    </span>
  </div>
</div>
```

#### Section Card Wrapper

```jsx
className="rounded-lg overflow-hidden mb-4"
style={{
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
}}
```

Body padding: `px-4 pb-4 pt-1`

### 5.4 Section — Customer Information

Two-column grid layout (`grid grid-cols-2 gap-x-8 gap-y-0`):

**Left column fields:** Machine Model, Serial Number, Branch/Site, Service Area, Delivery Date, Warranty Remarks

**Right column fields:** Machine Product, Machine Code, Engine Model, Engine Number, Account, Machine Group

### 5.5 Section — EMR Information

Two-column grid layout:

**Left column fields:** EMR Plant, Work Order, Case, PMact Type, WO SAP No, Sub Call Type, Aging Day

**Right column fields:** Trouble Date, Finish B/D Datetime, Start B/D Datetime, SMR Trouble, SMR RFU, KM/Mileage, Lead Time (Hours)

### 5.6 Section — Other Information

Two-column grid layout:

**Left column fields:** Unit Location, Informasi, Sub Informasi, Application, Manufacture, Responsibility, Submit to Claim

**Right column fields:** Shift, Problem Status, Machine Status, Need Support HO, HO Date, Resto, Resto Man Power

---

## 6. Related Panel

### 6.1 Panel Header

```jsx
<h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-main)' }}>
  Related
</h2>
```

### 6.2 Related List Card Pattern

Each related list (Work Orders, EMR Additional Group, etc.) is a collapsible card:

```jsx
<div className="mb-3 rounded-lg overflow-hidden"
  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>

  {/* Header */}
  <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded flex items-center justify-center"
        style={{ backgroundColor: '#E3F2FD' }}>
        <FileText size={12} style={{ color: '#1976D2' }} />
      </div>
      <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>
        Work Orders (1)
      </span>
    </div>
    <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
  </div>

  {/* Body — list items */}
  <div className="px-4 pb-3" style={{ borderTop: '1px solid var(--border)' }}>
    {/* items */}
    <a className="text-sm" style={{ color: 'var(--color-info)' }}>01269822</a>
    <div className="text-xs mt-1 space-y-0.5">
      <div><span style={{ color: 'var(--text-tertiary)' }}>Case: </span>
           <a style={{ color: 'var(--color-info)' }}>01553205</a></div>
      <div><span style={{ color: 'var(--text-tertiary)' }}>Status: </span>
           <span style={{ color: 'var(--text-secondary)' }}>Technical Complete</span></div>
      <div><span style={{ color: 'var(--text-tertiary)' }}>Subject: </span>
           <span style={{ color: 'var(--text-secondary)' }}>DELIVERY PC200_DBCH2895_RAJAWALI LINTAS</span></div>
    </div>
    <a className="text-xs mt-2 block" style={{ color: 'var(--color-info)' }}>View All</a>
  </div>
</div>
```

### 6.3 Related List Icons

| Related List | Icon | Icon Background | Icon Color |
|-------------|------|----------------|------------|
| Work Orders | `Wrench` | `#E3F2FD` | `#1976D2` |
| EMR Additional Group | `FolderOpen` | `#FFF3E0` | `#F57C00` |
| EMR Additional Information | `Info` | `#E8F5E9` | `#388E3C` |
| EMR History | `History` | `#F3E5F5` | `#7B1FA2` |

### 6.4 EMR Additional Group Entry Pattern

```jsx
// Each group entry in the list:
<div className="py-2" style={{ borderBottom: '1px solid var(--border)' }}>
  <a className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>* BAPP</a>
  <div className="text-xs space-y-0.5 mt-1">
    <div>
      <span style={{ color: 'var(--text-tertiary)' }}>Group Type: </span>
      <span style={{ color: 'var(--text-secondary)' }}>Desktop</span>
    </div>
    <div>
      <span style={{ color: 'var(--text-tertiary)' }}>Order Number: </span>
      <span className="font-mono" style={{ color: 'var(--text-secondary)' }}></span>
    </div>
    <div className="flex items-center gap-1">
      <span style={{ color: 'var(--text-tertiary)' }}>hasRevise: </span>
      <input type="checkbox" disabled />
    </div>
  </div>
  {/* Collapse/expand chevron icon on the right */}
</div>
```

### 6.5 EMR History Entry Pattern

```jsx
<div className="py-2 text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
  <div className="flex justify-between">
    <span className="font-mono" style={{ color: 'var(--text-tertiary)' }}>23/05/2026, 11:36</span>
  </div>
  <div style={{ color: 'var(--text-tertiary)' }}>Field: <span style={{ color: 'var(--text-secondary)' }}>EMR Status</span></div>
  <div style={{ color: 'var(--text-tertiary)' }}>
    <span className="line-through">Assign TO</span>
    {' → '}
    <span style={{ color: 'var(--color-success)' }}>Closed</span>
  </div>
  <div style={{ color: 'var(--text-tertiary)' }}>
    User: <a style={{ color: 'var(--color-info)' }}>NOVIANDRA SALLASA</a>
  </div>
</div>
```

---

## 7. EMILA Photo Input Form

### 7.1 Layout

The EMILA photo input is accessible from the EMR form (on mobile via FSL, on desktop via the EMR Additional Group panel). It is presented as a tabbed or segmented control with one tab per EMILA category.

```
┌──────────────────────────────────────────────────────┐
│  [E] Environment  [M] Machine  [I] Identification    │
│  [L] Location     [A] Abnormality                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Photo Entries for selected category:                │
│                                                      │
│  ┌──────────┐  Description ________________          │
│  │  [+img]  │  Order Number _______________  [Add]  │
│  └──────────┘                                        │
│                                                      │
│  ┌──────────┐  Caption: "Front engine view"          │
│  │ [thumb]  │  Order: 1                  [✎] [🗑]   │
│  └──────────┘                                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 7.2 Category Tab Styling

```jsx
// Active EMILA tab
style={{
  backgroundColor: 'var(--accent)',
  color: 'var(--text-main)',
}}
className="px-3 py-1.5 rounded text-xs font-semibold"

// Inactive EMILA tab
style={{
  backgroundColor: 'var(--bg-light)',
  color: 'var(--text-tertiary)',
}}
className="px-3 py-1.5 rounded text-xs font-medium"
```

### 7.3 Photo Entry Card

```jsx
<div className="flex items-start gap-3 p-3 rounded"
  style={{
    backgroundColor: 'var(--bg-light)',
    border: '1px solid var(--border)',
  }}>

  {/* Thumbnail */}
  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0"
    style={{ border: '1px solid var(--border)' }}>
    <img src={photo.url} alt="" className="w-full h-full object-cover" />
  </div>

  {/* Metadata */}
  <div className="flex-1 min-w-0">
    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
      {photo.description}
    </p>
    <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-tertiary)' }}>
      Order: {photo.orderNumber}
    </p>
    <p className="text-[10px] uppercase tracking-wider mt-1"
      style={{ color: 'var(--text-muted)' }}>
      {photo.groupType}
    </p>
  </div>

  {/* Actions */}
  <div className="flex gap-1 flex-shrink-0">
    <button className="p-1.5 rounded" style={{ color: 'var(--text-muted)' }}>
      <Pencil size={12} />
    </button>
    <button className="p-1.5 rounded" style={{ color: 'var(--color-danger)' }}>
      <Trash2 size={12} />
    </button>
  </div>
</div>
```

### 7.4 Upload Drop Zone

```jsx
<div
  className="border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors"
  style={{
    borderColor: 'var(--border)',
    backgroundColor: 'var(--bg-light)',
  }}
  // hover: borderColor: 'var(--accent)'
>
  <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
    Drop photo here or <span style={{ color: 'var(--color-info)' }}>browse</span>
  </p>
  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
    JPEG, PNG — max 10MB
  </p>
</div>
```

---

## 8. EMR Additional Group — Full List Page

### 8.1 List Header

```jsx
<div className="mb-4">
  <nav className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
    EMR › U-00021394 › EMR Additional Group
  </nav>
  <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
    EMR Additional Group
  </h1>
  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
    17 items • Sorted by EMR Additional Group Name • Updated a few seconds ago
  </p>
</div>
```

### 8.2 Data Table

Standard table following Design System conventions:

```jsx
<table className="w-full text-sm">
  <thead>
    <tr style={{ borderBottom: '2px solid var(--border)' }}>
      <th className="w-8 py-3 px-2">
        <input type="checkbox" />
      </th>
      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}>
        EMR Additional Group Name ↑
      </th>
      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}>
        Group Type
      </th>
      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}>
        Order Number
      </th>
      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}>
        hasRevise
      </th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, i) => (
      <tr key={row.id}
        className="transition-colors"
        style={{
          backgroundColor: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-light)',
          borderBottom: '1px solid var(--border)',
        }}>
        <td className="py-2.5 px-2"><input type="checkbox" /></td>
        <td className="py-2.5 px-3">
          <a className="text-sm font-medium" style={{ color: 'var(--color-info)' }}>
            {row.name}
          </a>
        </td>
        <td className="py-2.5 px-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <GroupTypeBadge type={row.groupType} />
        </td>
        <td className="py-2.5 px-3 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
          {row.orderNumber}
        </td>
        <td className="py-2.5 px-3">
          <input type="checkbox" checked={row.hasRevise} readOnly />
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### 8.3 Group Type Badge

```jsx
const GroupTypeBadge = ({ type }) => {
  const map = {
    Desktop: { bg: '#E3F2FD', color: '#1976D2' },
    FSL:     { bg: '#E8F5E9', color: '#388E3C' },
  };
  const { bg, color } = map[type] || map.Desktop;
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: bg, color }}>
      {type}
    </span>
  );
};
```

---

## 9. Status Badges for EMR Stages

EMR stage badges follow the inline badge pattern from the Design System (`§7.4`):

| EMR Status | Text Color | Background | Border |
|-----------|-----------|------------|--------|
| Open | `#4A90E2` | `rgba(74, 144, 226, 0.1)` | `#4A90E2` |
| In Progress | `#FFB81C` | `rgba(255, 184, 28, 0.1)` | `#FFB81C` |
| Submit EMR | `#7B1FA2` | `rgba(123, 31, 162, 0.1)` | `#7B1FA2` |
| Assign TO | `#0073E6` | `rgba(0, 115, 230, 0.1)` | `#0073E6` |
| Not Complete | `#C62828` | `rgba(198, 40, 40, 0.1)` | `#C62828` |
| Resubmit | `#F57C00` | `rgba(245, 124, 0, 0.1)` | `#F57C00` |
| Closed | `#6C7681` | `rgba(108, 118, 129, 0.1)` | `#6C7681` |

Usage:
```jsx
<span
  className="px-2 py-0.5 rounded text-xs font-medium"
  style={{
    backgroundColor: status.bg,
    color: status.color,
    border: `1px solid ${status.color}`,
  }}
>
  {label}
</span>
```

---

## 10. Component Inventory

| Component | File Path (suggested) | Reuses |
|-----------|----------------------|--------|
| `EMRChevron` | `components/emr/EMRChevron.jsx` | Chevron step shape |
| `EMRActionBar` | `components/emr/EMRActionBar.jsx` | `.btn-secondary`, `.btn-primary` |
| `EMRSubjectBanner` | `components/emr/EMRSubjectBanner.jsx` | Gold banner |
| `EMRTabBar` | `components/emr/EMRTabBar.jsx` | Tab pattern |
| `EMRFieldRow` | `components/emr/EMRFieldRow.jsx` | Inline-edit row |
| `EMRCollapsibleSection` | `components/emr/EMRCollapsibleSection.jsx` | `.card` section card |
| `EMILAPhotoInput` | `components/emr/EMILAPhotoInput.jsx` | Photo upload + category tabs |
| `EMRRelatedPanel` | `components/emr/EMRRelatedPanel.jsx` | Related list cards |
| `EMRHistoryEntry` | `components/emr/EMRHistoryEntry.jsx` | Audit row |
| `EMRAdditionalGroupTable` | `components/emr/EMRAdditionalGroupTable.jsx` | Data table |
| `EMRStatusBadge` | `components/emr/EMRStatusBadge.jsx` | Stage badge |
| `GroupTypeBadge` | `components/emr/GroupTypeBadge.jsx` | Desktop/FSL badge |

---

## 11. Responsive Behaviour

| Breakpoint | Layout Change |
|------------|--------------|
| `≥ 1280px` (xl) | Standard two-panel layout (65%/35%) |
| `1024–1279px` (lg) | Related panel narrows to `w-[300px]` |
| `< 1024px` (md/sm) | Two panels stack vertically; Related panel below main content |
| Mobile (FSL) | Full-screen single column; EMILA photo input as primary view |

---

## 12. Dark Mode Checklist

All EMR components must be verified in dark mode. Key checkpoints:

| Element | Light | Dark | Token Used |
|---------|-------|------|-----------|
| Page background | `#FFFFFF` | `#1A1A1A` | `var(--bg-base)` |
| Card/section backgrounds | `#FFFFFF` | `#2D2D2D` | `var(--bg-card)` |
| Gold banner | `#F5C800` | `#FBBF24` | `var(--accent)` |
| Section borders | `#E0E0E0` | `#3A3A3A` | `var(--border)` |
| Field labels | `#757575` | `#9CA3AF` | `var(--text-tertiary)` |
| Field values | `#2C2C2C` | `#E5E7EB` | `var(--text-secondary)` |
| Chevron completed | `#388E3C` | `#388E3C` | Static (not variable) |
| Chevron active | `#F5C800` | `#FBBF24` | `var(--accent)` |
| Chevron pending | `#F5F5F5` | `#3A3A3A` | `var(--bg-light)` |
| Status badges | Fixed hex | Fixed hex | See §9 |

---

## 13. Accessibility Requirements

| Requirement | Implementation |
|-------------|---------------|
| Minimum touch target | All buttons `min-h-[44px]` or `min-w-[44px]` |
| Focus visible | `:focus-visible` ring: `2px solid var(--accent)` |
| Screen reader labels | All icon-only buttons have `aria-label` |
| Chevron semantics | `role="list"` on Chevron; `aria-current="step"` on active step |
| Form fields | `<label>` associated with every input via `htmlFor` |
| Color contrast | All text tokens meet WCAG 2.2 AA (4.5:1) — verified in both modes |
| Collapsible sections | `aria-expanded` on toggle button; `aria-controls` pointing to body |

---

## 14. Design Tokens Quick Reference (EMR-Specific)

```css
/* Chevron stages */
--emr-chevron-completed-bg: #388E3C;
--emr-chevron-completed-text: #FFFFFF;
--emr-chevron-active-bg: var(--accent);       /* #F5C800 light / #FBBF24 dark */
--emr-chevron-active-text: var(--text-main);  /* #1A1A1A light / #F3F4F6 dark */
--emr-chevron-pending-bg: var(--bg-light);    /* #F5F5F5 light / #3A3A3A dark */
--emr-chevron-pending-text: var(--text-tertiary);

/* Subject banner */
--emr-banner-bg: var(--accent);
--emr-banner-text: var(--text-main);

/* Group type badges */
--emr-group-desktop-bg: #E3F2FD;
--emr-group-desktop-text: #1976D2;
--emr-group-fsl-bg: #E8F5E9;
--emr-group-fsl-text: #388E3C;
```
