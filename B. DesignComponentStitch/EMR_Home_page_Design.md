# EMR (Equipment Maintenance Record) - Design Document
## Two-Column Layout with Sidebar Navigation

## 📋 Daftar Isi
- [Overview](#overview)
- [Architecture & Layout](#architecture--layout)
- [Sidebar Navigation](#sidebar-navigation)
- [Main Content Area](#main-content-area)
- [Two-Column Layout](#two-column-layout)
- [Components](#components)
- [Visual Hierarchy](#visual-hierarchy)
- [Responsive Behavior](#responsive-behavior)
- [Accessibility & UX](#accessibility--ux)

---

## Overview

### Tujuan
EMR adalah sistem manajemen record perawatan peralatan dengan layout dua kolom (50:50) yang menampilkan data EMR di kolom kiri dan dokumen terkait (Work Orders, Cases, Lead Time) di kolom kanan, dilengkapi dengan sidebar navigation untuk akses cepat ke fitur utama.

### Target Users
- Technician/Technisi
- Service Manager
- Equipment Owner
- System Administrator
- Quality Control Specialist

### Key Features
- Detail view peralatan dengan tabs (Details, FAR, TSI, TSR, Feed)
- Two-column layout 50:50 (Data vs Related Items)
- Sidebar navigation untuk akses cepat
- Expandable sections untuk informasi terperinci
- Histori perubahan EMR
- Work orders dan cases tracking
- Additional files management
- Azure image integration
- Symptom & problem diagnosis

---

## Architecture & Layout

### Overall Layout Structure
```
┌──────────────────────────────────────────────────────────────────┐
│  Header (Search, Notifications, Settings)                        │
├─────────────┬──────────────────────────────────────────────────┤
│             │                                                    │
│  SIDEBAR    │         MAIN CONTENT AREA                         │
│  Navigation │  ┌─────────────────────┬─────────────────────┐   │
│             │  │                     │                     │   │
│  • Upload   │  │  LEFT COLUMN (50%)  │ RIGHT COLUMN (50%)  │   │
│  • Get Image│  │                     │                     │   │
│  • Lead Time│  │  EMR Data Fields    │ Related Documents   │   │
│  • Add Files│  │  - Details          │ - Cases             │   │
│             │  │  - Customer Info    │ - Work Orders       │   │
│             │  │  - Equipment Info   │ - EMR Lead Time     │   │
│             │  │  - EMR Info         │ - EMR History       │   │
│             │  │  - Symptom          │                     │   │
│             │  │  - Problem Cause    │                     │   │
│             │  │  - Action Taken     │                     │   │
│             │  │  - KC Info          │                     │   │
│             │  │                     │                     │   │
│             │  └─────────────────────┴─────────────────────┘   │
│             │                                                    │
└─────────────┴──────────────────────────────────────────────────┘
```

### Grid System
- **Sidebar Width**: 280px (fixed) / 240px (compact)
- **Main Content**: Fluid width (remaining space)
- **Left Column**: 50% of main content
- **Right Column**: 50% of main content
- **Column Gutter**: 16px - 24px
- **Max Content Width**: 1600px (to accommodate both columns)

### Container Dimensions
```
Total Width:            100% of viewport
Sidebar:                280px (fixed)
Main Content:           Remaining width
Left Column:            50% - (gutter/2)
Right Column:           50% - (gutter/2)
Gutter Between Cols:    24px
```

---

## Sidebar Navigation

### Sidebar Container
```
Width:              280px (expanded) / 240px (compact)
Background:         #FFFFFF
Border Right:       1px solid #E0E0E0
Position:           Fixed (sticky scrolling)
Z-Index:            100
Overflow:           Auto with custom scrollbar
Height:             Viewport height
Top:                Header height (64px)
```

### Menu Items Structure

#### 1. **Upload Techcare Files**
```
Icon:               📁 (Upload icon)
Label:              "Upload Techcare Files"
Action:             Open file upload modal
Background (Hover): #E3F2FD
Text Color:         #1976D2
Badge:              Optional (count of pending uploads)
```

#### 2. **Get Image From Azure**
```
Icon:               ☁️ (Cloud icon)
Label:              "Get Image From Azure"
Action:             Fetch/sync images from Azure storage
Background (Hover): #E3F2FD
Text Color:         #1976D2
Status Indicator:   Sync status icon
```

#### 3. **EMR Additional Files**
```
Icon:               📎 (Attachment icon)
Label:              "EMR Additional Files"
Action:             Open/view additional files panel
Background (Hover): #E3F2FD
Text Color:         #1976D2
Badge:              File count (3+)
Expandable:         Yes (with chevron)
```

#### 4. **EMR Lead Time**
```
Icon:               ⏱️ (Timer/Clock icon)
Label:              "EMR Lead Time"
Action:             Navigate to leadtime view in right column
Background (Hover): #E3F2FD
Text Color:         #1976D2
Badge:              Count (2) or SLA status
Expandable:         Yes (collapsible leadtime list)
```

### Sidebar Styling

```css
.sidebar {
  width: 280px;
  background: #FFFFFF;
  border-right: 1px solid #E0E0E0;
  position: fixed;
  left: 0;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  z-index: 100;
  padding: 16px 0;
}

.sidebar-menu-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  font-weight: 500;
  font-size: 14px;
  color: #424242;
}

.sidebar-menu-item:hover {
  background-color: #E3F2FD;
  border-left-color: #1976D2;
  color: #1976D2;
}

.sidebar-menu-item.active {
  background-color: #E3F2FD;
  border-left-color: #1976D2;
  color: #1976D2;
  font-weight: 600;
}

.sidebar-menu-item .badge {
  margin-left: auto;
  background-color: #FF5252;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}
```

---

## Main Content Area

### Header Section

#### EMR Title Bar
```
Height:             64px
Background:         #FFFFFF dengan bottom border
Sticky:             Yes (stays at top when scrolling)

Content:
├── Left Side
│   ├── EMR Icon
│   ├── EMR Label
│   └── EMR ID: U-00021652
│
└── Right Side (Action Buttons)
    ├── Follow
    ├── Upload Techcare Files
    ├── Get Image From Azure
    ├── Delete
    ├── Sharing
    ├── Change Owner
    ├── Edit
    └── More (dropdown)
```

#### Status Progress Bar
```
Height:             8px
Stages:             8 checkpoints
Current Status:     Closed (100% complete)

Colors:
  Completed:        #4CAF50 (Green)
  Current:          #2196F3 (Blue)
  Pending:          #E0E0E0 (Grey)
```

#### Subject/Title Banner
```
Height:             48px
Background:         #FFC107 (Amber)
Text:               "Go Live Mekanik Shift secara Nasional"
Font-size:          18px, 600 weight
Text-align:         Right
```

#### Tabs Navigation
```
Tabs:
  - Details (active)
  - FAR
  - TSI
  - TSR
  - Feed

Active Indicator:   2px bottom border #1976D2
```

---

## Two-Column Layout

### Layout Structure

```css
.main-content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #FAFAFA;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
}

@media (max-width: 1199px) {
  .main-content-wrapper {
    grid-template-columns: 1fr;
  }
}
```

---

## Main Content Area - Left Column (50%)

### EMR Data Sections

#### Section 1: Details
```
Fields:
  ├── EMR Name:           U-00021652
  ├── Supervisor Anal:    TSI KMIUT20260598 by Gamal
  ├── Asset:              PC135F-10M0/24 - J12646
  ├── RM - Open Manual:   [Editable]
  ├── Redo Status:        [Editable]
  ├── Hours On Component: [Editable]
  └── Re - Open Reason:   [Editable]
```

#### Section 2: Customer Information
```
Fields (2-column):
  ├── Machine Model:      PC135F-10M0
  ├── Serial Number:      J12646
  ├── Branch / Site:      JBI
  ├── Service Area:       Jambi
  ├── Delivery Date:      26/09/2025
  ├── Warranty:           WARRANTY
  ├── Machine Product:    KOMATSU
  ├── Machine Code:       [Auto-filled]
  ├── Engine Model:       SA4D95LE-5
  ├── Engine Number:      585856
  ├── Account:            SINAR AGUNG LESTARI PRATAMA
  └── Machine Group:      KLTD
```

#### Section 3: EMR Information
```
Fields:
  ├── EMR Plant:         JBI
  ├── Work Order:        01255888
  ├── Case:              01529658
  ├── Trouble Date:      23/04/2026, 15:16
  ├── Start B/D Date:    19/04/2026, 08:44
  └── Finish B/D Date:   19/04/2026, 20:44
```

#### Section 4: Symptom
```
Field:
  "How was problem noticed?" → "MOTOR WIPER INTERNAL DEFECT"
```

#### Section 5: Caused of Problem
```
Field: Long text area dengan daftar data dan analisis
```

#### Section 6: Action (How was Problem corrected)
```
Fields (2-column):
  ├── Main Cause Part No:   2A5-53-12721
  ├── Component SN:         NA
  ├── Position:             Front
  ├── Part Description:     Motor Assembly
  ├── Butuh ganti part?:    Yes
  ├── Mechanic:             JEFRIADI JASEF
  ├── Phenomenon:           DEFECTIVE FUNCTION-MALFUNCTION
  ├── Action:               R&I-Replace
  ├── TechCare Components:  Z_OTHERS
  ├── TechCare Sub Comp:    Z+10-Others
  ├── Install(hours):       1
  ├── Overhaul(hours):      1
  ├── Remove(hours):        1
  ├── Lifetimes:            0.00
  └── Action corrected:     "REPLACE MOTOR WIPER"
```

#### Section 7: KC Information
```
Fields:
  ├── KC Numbers: 3000111717
  └── KC Date:    18/05/2026
```

#### Section 8: Specific Information Requested
```
Field: Long text area (collapsible)
```

### Field Styling

```css
.expandable-section {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
}

.section-header {
  padding: 12px 16px;
  background: #FAFAFA;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-bottom: 1px solid #E0E0E0;
  font-weight: 600;
  font-size: 14px;
}

.section-content {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
}

.section-content.full-width {
  grid-template-columns: 1fr;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-weight: 600;
  color: #424242;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  color: #212121;
  font-size: 14px;
  line-height: 1.5;
}

.field-value a {
  color: #1976D2;
  text-decoration: none;
}

.field-value a:hover {
  text-decoration: underline;
}
```

---

## Main Content Area - Right Column (50%)

### Related Documents Sections

#### Section 1: Cases (1)
```
Card:
  ├── Case ID:          01529658 (link)
  ├── Subject:          Internal - Troubleshooting
  ├── Date/Time Opened: 23/04/2026, 15:13
  └── Priority:         Medium
```

#### Section 2: Work Orders (2)
```
Card 1:
  ├── Work Order ID: 01252308
  ├── Status:        Technical Complete
  ├── Case:          01529658
  └── Subject:       TRS ENGINE EE. CTRL. SYST. PC135

Card 2:
  ├── Work Order ID: 01255888
  ├── Status:        Technical Complete
  ├── Case:          01529658
  └── Subject:       RI ELECTRIC SYSTEM PC135
```

#### Section 3: EMR Lead Time (2)
```
Entry 1:
  ├── Name:                L/T Re-Submit - Closed U-00021652
  ├── L/T:                 2 (days)
  ├── EMR Status (before): Re-Submit
  ├── EMR Status (after):  Closed
  └── Last Modified:       20/05/2026, 07:24

Entry 2:
  ├── Name:                L/T Create TSI U-00021652
  ├── L/T:                 0 (days)
  ├── EMR Status (before): Closed
  ├── EMR Status (after):  Closed
  └── Last Modified:       20/05/2026, 07:25
```

#### Section 4: EMR History (3+)
```
Entry:
  ├── Date/Time:      20/05/2026, 07:25
  ├── Field Changed:  TSI Record
  ├── User:           GAMAL HARI PRASETYO
  ├── Original Value: [value]
  └── New Value:      [value]
```

### Related Items Card Styling

```css
.related-card {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  transition: box-shadow 0.2s;
}

.related-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF1493 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.card-title {
  font-weight: 600;
  font-size: 13px;
  color: #212121;
}

.card-title a {
  color: #1976D2;
  text-decoration: none;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-left: 40px;
  border-left: 2px solid #E0E0E0;
  padding-left: 12px;
}

.card-field {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.card-field-label {
  color: #757575;
  font-weight: 500;
}

.card-field-value {
  color: #212121;
  font-weight: 600;
}
```

---

## Components

### Button Components

#### Primary Action Buttons
```
Buttons:
  ├── Follow (secondary)
  ├── Upload Techcare Files (primary)
  ├── Get Image From Azure (primary)
  ├── Delete (danger)
  ├── Sharing (secondary)
  ├── Change Owner (secondary)
  ├── Edit (primary)
  └── More (dropdown)

Styling:
  Primary:    #1976D2, white text, hover #1565C0
  Secondary:  #FFFFFF, #1976D2 border and text
  Danger:     #FF5252, white text, hover #D32F2F
  
  Padding:    8px 16px
  Border-radius: 4px
  Font-size:  13px
  Font-weight: 500
```

### Modal/Dialog for Uploads
```
Title:      "Upload Techcare Files"
Width:      600px
Content:
  ├── Drag & drop file input
  ├── File list preview
  └── Progress bar

Actions:
  - Cancel
  - Upload
```

### Expandable Sections
```
Behavior:
  - Click to toggle
  - Smooth animation (0.3s)
  - Chevron rotation
  - Show/hide with max-height
```

---

## Visual Hierarchy

### Color Palette

```
Primary:
  #1976D2 (Blue) - Main actions, links, active states
  #1565C0 (Dark Blue) - Hover state

Success:
  #4CAF50 (Green) - Completed status
  #8BC34A (Light Green) - Secondary

Warning:
  #FFC107 (Amber) - In progress, pending
  #FF9800 (Orange) - At risk

Error:
  #FF5252 (Red) - Errors, danger
  #D32F2F (Dark Red) - Hover

Neutral:
  #212121 (Dark Grey) - Primary text
  #424242 (Medium Grey) - Secondary text
  #757575 (Light Grey) - Tertiary text
  #E0E0E0 (Very Light Grey) - Borders
  #FAFAFA (Off White) - Panel backgrounds
  #FFFFFF (White) - Main background
```

### Typography

```
Headings:
  H1: 28px, 600 weight, #212121
  H2: 22px, 600 weight, #212121
  H3: 18px, 600 weight, #424242

Body Text:
  Regular: 14px, 400 weight, #212121
  Secondary: 13px, 400 weight, #424242
  Small: 12px, 400 weight, #757575

Field Labels:
  13px, 600 weight, uppercase, letter-spacing 0.5px

Links:
  14px, 400 weight, #1976D2, underline on hover
```

### Spacing Scale
```
2px - Micro
4px - Minimal
8px - Extra small
12px - Small
16px - Medium (default)
24px - Large
32px - Extra large
48px - Huge
```

---

## Responsive Behavior

### Desktop (≥1400px)
- Sidebar: 280px fixed
- Columns: 50/50 grid layout
- All features visible
- Full spacing

### Tablet (768px - 1399px)
- Sidebar: 240px or drawer
- Columns: Stack vertically (left then right)
- Compact spacing
- Buttons: More grouped in dropdown

### Mobile (<768px)
- Sidebar: Hamburger menu → Drawer
- Layout: Single column, full width
- Sections: Vertically stacked
- Buttons: Full width or stacked

```css
@media (max-width: 1199px) {
  .main-content-wrapper {
    grid-template-columns: 1fr;
  }

  .right-column {
    order: 2;
    margin-top: 12px;
  }
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    left: -280px;
    transition: left 0.3s;
    z-index: 1000;
  }

  .sidebar.open {
    left: 0;
  }

  .main-content-wrapper {
    padding: 12px;
    gap: 12px;
  }

  .section-content {
    grid-template-columns: 1fr;
  }
}
```

---

## Accessibility & UX

### Keyboard Navigation
```
Tab Order:
  1. Header buttons
  2. Tabs
  3. Sidebar (if visible)
  4. Section headers
  5. Form fields
  6. Related items

Shortcuts:
  Alt + U:      Upload
  Alt + E:      Edit
  Alt + L:      Lead Time
  Escape:       Close modal
```

### ARIA Labels
```html
<nav aria-label="Sidebar navigation">
  <ul role="menubar">
    <li role="menuitem">Upload Files</li>
  </ul>
</nav>

<main aria-label="EMR Details Content">
  <section aria-labelledby="section-1">
    <h2 id="section-1">Section Title</h2>
  </section>
</main>
```

### Screen Reader Support
- All icons with aria-label
- Form labels with `for` attribute
- Semantic HTML structure
- Status descriptive text
- Meaningful link text

### Focus Management
- Focus trap in modals
- Return focus after close
- Clear focus indicators (outline 2px #1976D2)

### User Experience
1. **Loading States** - Spinners, skeleton loaders, progress bars
2. **Error Handling** - Toast notifications, inline validation
3. **Confirmations** - Dialog for critical actions
4. **Tooltips** - Info icons with hover explanations
5. **Animations** - Smooth expand/collapse (0.3s)

---

## Implementation Notes

### Technology Stack
```
Frontend:   React 18+ / Vue 3
UI Library: Material-UI / Tailwind CSS
State Mgmt: Redux / Zustand
HTTP:       Axios / Fetch API
Icons:      Material Icons
Forms:      React Hook Form
Validation: Zod / Yup
```

### Browser Support
```
- Chrome/Edge:      Latest 2 versions
- Firefox:          Latest 2 versions
- Safari:           Latest 2 versions
- Mobile:           Latest 1 version
```

### Performance
```
- Lazy load related items
- Virtual scrolling for lists
- Debounce search (300ms)
- Memoize components
- Code splitting
- Image lazy loading
```

### Security
```
- Input sanitization
- CSRF tokens
- File validation (type, size)
- RBAC
- Audit logging
- HTTPS only
```

---

## File Structure

```
src/
├── components/
│   ├── EMRDetail/
│   │   ├── EMRDetail.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainContent.jsx
│   │   ├── LeftColumn.jsx
│   │   ├── RightColumn.jsx
│   │   ├── ExpandableSection.jsx
│   │   ├── RelatedCard.jsx
│   │   └── styles/
│   ├── UploadModal/
│   └── Common/
├── pages/
│   └── EMRDetailPage.jsx
├── hooks/
│   ├── useEMRData.js
│   ├── useFileUpload.js
│   └── useExpandableSection.js
├── services/
│   ├── emrService.js
│   └── fileService.js
├── constants/
│   ├── sidebarMenu.js
│   └── colors.js
└── styles/
    ├── global.css
    ├── colors.css
    └── responsive.css
```

---

## Version History

| Version | Date       | Changes                              |
|---------|------------|--------------------------------------|
| 2.0     | 2024-05-27 | Two-column layout (50:50)           |
| 1.0     | 2024-05-27 | Initial design with sidebar         |

---

**Last Updated**: May 27, 2024
**Status**: Active & Final
**Ready for Development**: ✅
