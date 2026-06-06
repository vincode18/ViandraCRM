# Enterprise Service Management System
## Header & Footer Standardization - UI Design Document

## 1. Executive Summary

The **Header & Footer Standardization** document establishes consistent user interface patterns for the top and bottom sections of all Enterprise Service Management modules. This ensures visual consistency, improves user navigation, maintains brand identity, and provides standardized access to critical system features across the entire application ecosystem. This design covers:

- **Global Header** - Navigation, search, notifications, and user controls
- **Module-Specific Header** - Context-aware information and module actions
- **Global Footer** - System information, links, and compliance data
- **Responsive Adaptations** - Desktop, tablet, and mobile layouts
- **Accessibility Standards** - WCAG 2.1 AA compliance
- **Visual Consistency** - Color, typography, and spacing standards

---

## 2. Global Header Architecture

### 2.1 Complete Header Structure

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GLOBAL HEADER (Persistent across all pages)                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Logo]  [App Name]    [Search Bar]         [Icons]    [User Menu] [More] │
│                                                                             │
│  • UT Logo             • Search...          • Notif    • Profile  • ⋮     │
│  • "UT Service        • Search within       • Alerts   • Settings         │
│    Console"           all modules          • History  • Logout            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  MODULE NAVIGATION (Context-aware)                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  UT Service Console > Cases > Sangkulirang... > FM-SKLP... > 01469283     │
│                                                                             │
│  [Tab 1] [Tab 2] [Tab 3] ... [More ▼]  [X Close All]                     │
│  • Cases              [X] [X]                                              │
│  • Sangkulirang...    [X]                                                  │
│  • FM-SKLPM...        [X]                                                  │
│  • 01469283           [X]                                                  │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.1 Header Left Section (20% width)

**Logo & Branding**
```
┌─────────────────────┐
│  🟡 UT Console      │
│                     │
│  • Logo: Square     │
│    icon (32x32px)   │
│  • Text: "UT        │
│    Service Console" │
│  • Font: Bold,      │
│    14px             │
│  • Color: #000000   │
│  • Link: Home/       │
│    Dashboard        │
│                     │
└─────────────────────┘
```

**Features:**
- Clickable to return to dashboard
- Consistent across all modules
- Logo + text on desktop, logo-only on mobile
- Responsive sizing (scales with viewport)

#### 2.1.2 Header Center Section (60% width)

**Search Bar**
```
┌──────────────────────────────────────────┐
│  🔍 [Search...] [⚙️ Advanced Search]    │
│                                          │
│  • Search icon (24x24px)                │
│  • Placeholder: "Search..."             │
│  • Input field: 300px wide              │
│  • Border: 1px solid #E9ECEF            │
│  • Focus: Blue outline, #0066CC         │
│  • Advanced link: Secondary text        │
│                                          │
└──────────────────────────────────────────┘
```

**Search Features:**
- Global search across all modules
- Auto-suggestions (records, users, cases)
- Recent searches
- Advanced search modal (filters, date ranges)
- Keyboard shortcut: CMD+K (Mac) / CTRL+K (Windows)

**Module Navigation Breadcrumb**
```
UT Service Console > Cases > Sangkulirang... > FM-SKLPM...
│                   │       │               │
└─ App Context     └─ Mod. └─ Record 1    └─ Record 2
```

**Features:**
- Hierarchical navigation path
- Clickable breadcrumb items
- Current page/module bold/highlighted
- Truncate long names with ellipsis
- Tooltip on hover shows full text

#### 2.1.3 Header Right Section (20% width)

**Icon Controls & User Menu**
```
┌──────────────────────────┐
│  🔔 ⚠️ 📞 ⚙️  👤  ⋮     │
│                          │
│ • Notifications (🔔)    │
│ • Alerts (⚠️)           │
│ • Help/Support (?)      │
│ • Settings (⚙️)         │
│ • User Profile (👤)     │
│ • More Menu (⋮)         │
│                          │
└──────────────────────────┘
```

**Icon Descriptions:**

| Icon | Purpose | Behavior | Badge |
|------|---------|----------|-------|
| 🔔 Notifications | System & activity notifications | Click to open panel | Red (unread count) |
| ⚠️ Alerts | Critical system alerts | Click to show alerts | Red badge |
| ? Help | Help & support resources | Click for help menu | None |
| ⚙️ Settings | User & system settings | Click to open settings | None |
| 👤 Profile | User profile menu | Click for dropdown | Avatar image |
| ⋮ More | Additional options | Click for menu | None |

**Notification Panel**
```
When clicked (🔔):
┌──────────────────────────┐
│  Notifications       [X] │
├──────────────────────────┤
│                          │
│  📌 System Updates       │
│     "New version 2.1"   │
│     2 hours ago          │
│                          │
│  ✓ Task Completed       │
│     "Report generated"  │
│     4 hours ago          │
│                          │
│  ⚠️ Warning              │
│     "API latency high"  │
│     Just now             │
│                          │
│  [Mark All as Read]      │
│  [View All]              │
│                          │
└──────────────────────────┘
```

**User Profile Dropdown**
```
When clicked (👤):
┌──────────────────────────┐
│  👤 John Doe         [X] │
│     John.Doe@...        │
├──────────────────────────┤
│  👤 My Profile           │
│  ⚙️  Settings            │
│  🔑 Change Password      │
│  📱 Mobile App           │
│  📖 Help & Support       │
│  ℹ️  About               │
├──────────────────────────┤
│  🚪 Logout               │
│                          │
└──────────────────────────┘
```

---

### 2.2 Module Navigation Tabs

**Purpose**: Quick navigation between open records and modules.

```
┌─────────────────────────────────────────────────────────────────────┐
│  MODULE NAVIGATION TABS                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🏠 Home [X]  📋 Cases [X]  🛠️ Shifts [X]  ... [More ▼] [X Close] │
│                                                                     │
│  Active Tab Style:                                                  │
│  ├─ Blue background or underline                                   │
│  ├─ Bold text                                                      │
│  ├─ Icon + name visible                                            │
│  └─ Close button (X) on hover                                      │
│                                                                     │
│  Inactive Tab Style:                                                │
│  ├─ Light gray background                                          │
│  ├─ Gray text                                                      │
│  ├─ Icon + name visible                                            │
│  └─ Close button (X) on hover                                      │
│                                                                     │
│  Features:                                                          │
│  • Drag to reorder tabs                                            │
│  • Right-click for tab options (Close, Close Others, etc.)        │
│  • Max 8 tabs visible (overflow to "More" menu)                   │
│  • Close all button for quick cleanup                              │
│  • Keyboard: CTRL+Tab to switch tabs                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Tab Features:**
- Show last 8 opened records
- Tab content updates on click
- Drag-and-drop reordering
- Keyboard navigation (Ctrl+Tab)
- Close individual or all tabs
- Unsaved changes warning

---

## 3. Module-Specific Header

### 3.1 Module Context Header

**Purpose**: Display current record/module information and related actions.

```
┌─────────────────────────────────────────────────────────────────────┐
│  MODULE HEADER (Below global header)                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Icon] Record Name / Module Title                                 │
│  Subtitle or Key Information                                       │
│                                                                     │
│  [Primary Action Buttons] [More ▼]                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 Module Header Components

**Left Side: Record Identity**
```
┌──────────────────────────────────────┐
│  🎯 [Icon] Record Name                │
│     SFT-3061099                       │
│     Shift Record                      │
│                                       │
│  • Icon: Module/record type icon      │
│  • Title: Record name (28px, bold)    │
│  • Subtitle: Record ID or type        │
│  • Color: Module-specific color       │
│                                       │
└──────────────────────────────────────┘
```

**Center: Key Information**
```
┌──────────────────────────────────────┐
│  Status: Confirmed  │  Date: 15/05   │
│  Owner: John Doe    │  Priority: Med  │
│                                       │
│  • Display most important fields      │
│  • Format: Label: Value               │
│  • Spacing: 24px between pairs        │
│  • Secondary text color: #6C757D      │
│                                       │
└──────────────────────────────────────┘
```

**Right Side: Action Buttons**
```
┌──────────────────────────────────────┐
│  [Primary Action]  [Secondary] [⋮]   │
│                                       │
│  Examples:                             │
│  [Save]  [Submit]  [More]            │
│  [Edit]  [Delete]  [More]            │
│  [Approve] [Reject] [More]           │
│                                       │
│  • Primary: Bold, colored button      │
│  • Secondary: Gray button             │
│  • More: Dropdown menu                │
│                                       │
└──────────────────────────────────────┘
```

---

## 4. Global Footer

### 4.1 Footer Structure

**Purpose**: Provide system information, links, and compliance data.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GLOBAL FOOTER (Persistent across all pages)                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  © 2026 United Tractors. All Rights Reserved.                             │
│                                                                             │
│  [Quick Links]              [System Info]          [Legal/Compliance]      │
│  • About                    • Version: 2.1.0       • Terms of Service      │
│  • Documentation            • Build: #12345        • Privacy Policy        │
│  • Support Portal           • Environment: Prod    • Security              │
│  • Blog                     • Last Updated: Now    • Accessibility         │
│  • Community                • API Status: ✓        • Cookie Policy         │
│                                                                             │
│  [Social Links]             [Status]               [Contact]               │
│  • Twitter                  • System Status: OK    • support@company.com   │
│  • LinkedIn                 • API: Operational     • 1-800-SERVICE         │
│  • Facebook                 • Database: Green      • Help Center           │
│                             • Email Service: OK    • Feedback              │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Page Load Time: 234ms  │  Your Session: Active  │  Timezone: UTC+7       │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1.1 Footer Left Section (33% width)

**Quick Links & Company Info**
```
┌──────────────────────────┐
│  © 2026 United Tractors  │
│  All Rights Reserved     │
│                          │
│  Quick Links:            │
│  • About Us              │
│  • Documentation         │
│  • Support Portal        │
│  • Blog                  │
│  • Community Forum       │
│                          │
│  Social Media:           │
│  [𝕏] [Ⓛ] [ⓕ] [▶️]        │
│                          │
└──────────────────────────┘
```

**Styling:**
- Text color: #6C757D (gray)
- Font size: 12px
- Links: Underline on hover
- Icons: 20x20px
- Spacing: 8px between items

#### 4.1.2 Footer Center Section (33% width)

**System Information**
```
┌──────────────────────────┐
│  System Information      │
│                          │
│  Version: 2.1.0         │
│  Build: #12345 (Build ID)
│  Environment: Production │
│  Last Updated: 1 hour   │
│  API Status: ✓ Online   │
│                          │
│  Page Load: 234ms       │
│  Your Session: Active   │
│  Timezone: UTC+7        │
│                          │
└──────────────────────────┘
```

**Features:**
- Real-time system status
- Build information for debugging
- API health indicator
- Performance metrics
- Session information
- Updates automatically

#### 4.1.3 Footer Right Section (33% width)

**Legal & Compliance**
```
┌──────────────────────────┐
│  Legal & Compliance      │
│                          │
│  • Terms of Service      │
│  • Privacy Policy        │
│  • Security              │
│  • Accessibility         │
│  • Cookie Policy         │
│  • GDPR Compliance       │
│                          │
│  Contact:                │
│  support@company.com    │
│  1-800-SERVICE          │
│  Help Center            │
│                          │
└──────────────────────────┘
```

**Features:**
- Links to legal documents
- Compliance certifications
- Contact information
- Help & support links
- Privacy/security information

---

## 5. Responsive Footer Adaptations

### 5.1 Tablet Layout (768px - 1024px)

```
┌────────────────────────────────────────┐
│  FOOTER (Tablet)                       │
├────────────────────────────────────────┤
│                                        │
│  © 2026 United Tractors                │
│                                        │
│  [Quick Links] [System] [Legal]        │
│  [About, Docs]  [Status] [Terms]       │
│  [Support, Blog] [Build] [Privacy]     │
│                                        │
│  [Social] | Version 2.1.0             │
│  Page Load: 234ms | Session: Active   │
│                                        │
└────────────────────────────────────────┘
```

**Changes:**
- Reduce column count to 2 rows
- Smaller font (11px instead of 12px)
- Remove some secondary links
- Compact spacing (12px gap)

### 5.2 Mobile Layout (<768px)

```
┌────────────────────────────┐
│  FOOTER (Mobile)           │
├────────────────────────────┤
│                            │
│  © 2026 United Tractors    │
│                            │
│  Quick Links               │
│  About • Docs • Support    │
│                            │
│  Legal                     │
│  Terms • Privacy • Security│
│                            │
│  Status: OK | v2.1.0       │
│  Session: Active           │
│                            │
│  [𝕏] [Ⓛ] [ⓕ]              │
│                            │
└────────────────────────────┘
```

**Changes:**
- Single column layout
- Minimal font size (10px)
- Essential links only
- Stacked layout
- Touch-friendly link sizes

---

## 6. Color & Typography Standards

### 6.1 Header Color Scheme

```
GLOBAL HEADER:
Background:      #FFFFFF (White)
Border-bottom:   1px solid #E9ECEF (Light gray)
Text:            #333333 (Dark gray)
Icons:           #6C757D (Medium gray)
Active:          #0066CC (Brand blue)
Hover:           #E9ECEF (Light gray background)

MODULE HEADER:
Background:      Varies by module (light tint)
Icon:            Module-specific color
Title:           #000000 (Black)
Subtitle:        #6C757D (Gray)
Button Primary:  #0066CC (Blue)
Button Secondary: #6C757D (Gray)
```

### 6.2 Footer Color Scheme

```
FOOTER:
Background:      #F8F9FA (Very light gray)
Border-top:      1px solid #E9ECEF
Text:            #6C757D (Gray)
Links:           #0066CC (Blue)
Links Hover:     #0052A3 (Dark blue)
Icons:           #6C757D (Gray)
Status OK:       #28A745 (Green)
Status Alert:    #FFC107 (Yellow)
Status Error:    #DC3545 (Red)
```

### 6.3 Typography Standards

```
GLOBAL HEADER:
Logo/Brand:      "Segoe UI", Bold, 14px, #000000
Search Placeholder: "Segoe UI", Regular, 14px, #999999
Breadcrumb:      "Segoe UI", Regular, 12px, #6C757D
Tab Text:        "Segoe UI", Regular, 14px
Active Tab:      "Segoe UI", Bold, 14px, #0066CC

MODULE HEADER:
Record Title:    "Segoe UI", Bold, 28px, #000000
Subtitle:        "Segoe UI", Regular, 12px, #6C757D
Key Info Label:  "Segoe UI", Regular, 11px, #999999
Key Info Value:  "Segoe UI", Regular, 14px, #333333

FOOTER:
Copyright:       "Segoe UI", Regular, 12px, #6C757D
Links:           "Segoe UI", Regular, 12px, #0066CC
Metadata:        "Segoe UI", Regular, 10px, #999999
```

---

## 7. Spacing & Layout Standards

### 7.1 Header Spacing

```
GLOBAL HEADER:
Height:              64px (desktop)
Padding:             0 16px
Margin:              0
Gap between sections: 24px
Icon spacing:        12px
Tab height:          40px

MODULE HEADER:
Height:              80px (average)
Padding:             16px 24px
Margin:              0
Gap:                 24px
Icon:                32x32px
Button spacing:      8px
```

### 7.2 Footer Spacing

```
FOOTER:
Height:              200px (desktop)
Padding:             24px 32px
Margin:              24px 0 0 0
Border-top:          1px
Column gap:          32px
Row gap:             24px
Link spacing:        8px
Social icon spacing: 8px
```

---

## 8. Accessibility Standards

### 8.1 Header Accessibility

**WCAG 2.1 AA Compliance:**

- **Color Contrast**: 
  - Text: 4.5:1 minimum
  - Interactive elements: 3:1 minimum
  - Example: #333333 on #FFFFFF = 12.6:1 ✓

- **Keyboard Navigation**:
  - Tab through: Logo → Search → Icons → User Menu
  - Focus visible: 2px border outline
  - Tab order logical and intuitive
  - Keyboard shortcuts: CMD/CTRL+K for search

- **Screen Reader Support**:
  - ARIA labels on all icons
  - Navigation landmarks
  - Breadcrumb navigation with aria-current
  - Tab list with role="tablist"

- **Focus Management**:
  - Focus trap prevention
  - Focus visible on all interactive elements
  - Return focus after closing menus
  - Skip to main content link

**Accessibility Examples:**

```HTML
<!-- Logo with aria-label -->
<a href="/" aria-label="UT Service Console - Home">
  <img src="logo.svg" alt="" />
</a>

<!-- Search input with label -->
<label for="global-search" class="sr-only">Search</label>
<input id="global-search" type="text" placeholder="Search..." />

<!-- Notification icon with badge -->
<button aria-label="Notifications, 3 unread" aria-pressed="false">
  🔔 <span aria-label="3 notifications">3</span>
</button>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/cases">Cases</a></li>
    <li aria-current="page">SFT-3061099</li>
  </ol>
</nav>

<!-- Tab navigation -->
<div role="tablist" aria-label="Open tabs">
  <button role="tab" aria-selected="true" aria-controls="panel-1">
    Cases
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">
    Shifts
  </button>
</div>
```

### 8.2 Footer Accessibility

- **Link Context**: Links have descriptive text, not "Click here"
- **Skip Links**: "Skip to footer" available for keyboard users
- **List Semantics**: Links organized in `<ul>` lists
- **Status Information**: Non-visual status conveyed with icons + text
- **Language**: `lang` attribute on footer if different from page

---

## 9. Responsive Design Breakpoints

### 9.1 Desktop (1920px and above)

**Header:**
- Full logo + text
- Search bar at 300px
- All icons visible
- Tab bar with 8+ tabs
- Module header fully displayed

**Footer:**
- 3-column layout
- All links visible
- Full social media links
- Complete system info

### 9.2 Tablet (768px - 1024px)

**Header:**
- Logo visible (might be smaller)
- Search bar at 200px
- Icons visible but compact
- Tab bar with 5-6 tabs
- Simplified module header

**Footer:**
- 2-row layout
- Essential links only
- Reduced social links
- Minimal system info

### 9.3 Mobile (<768px)

**Header:**
- Logo icon only (text hidden)
- Search bar 100% minus padding
- Icons responsive
- Tab bar hidden (access via button)
- Compact module header

**Footer:**
- Single column
- Stacked sections
- Icon-only social
- Essential info only

---

## 10. Consistent Elements Across All Modules

### 10.1 Header Elements in Every Module

```
✓ Global header with logo and search
✓ Module navigation breadcrumb
✓ Open tabs/records navigation
✓ User profile dropdown
✓ Notification system
✓ Help & settings access
✓ Consistent spacing and colors
```

### 10.2 Footer Elements in Every Module

```
✓ Copyright information
✓ Quick links
✓ System status
✓ Legal/compliance links
✓ Contact information
✓ Performance metrics
✓ Session information
```

### 10.3 Consistent Styling Across Modules

```
✓ Same font family (Segoe UI)
✓ Same color palette
✓ Same spacing system
✓ Same button styles
✓ Same icon library
✓ Same responsive patterns
✓ Same accessibility standards
```

---

## 11. Implementation Guidelines

### 11.1 Header Implementation

**Best Practices:**
1. Keep header sticky (always visible)
2. Reduce height on mobile (min 48px)
3. Provide skip-to-content link
4. Implement search with debounce (300ms)
5. Cache recent searches
6. Keyboard accessible (Tab + Enter)
7. Mobile hamburger menu below 768px
8. Responsive search bar width

**Code Pattern:**
```HTML
<header role="banner" class="global-header">
  <nav class="header-nav" aria-label="Main">
    <a href="/" class="logo" aria-label="UT Service Console">
      <img src="logo.svg" alt="" width="32" height="32" />
      <span>UT Service Console</span>
    </a>
    
    <div class="search-container">
      <label for="search" class="sr-only">Search</label>
      <input type="search" id="search" placeholder="Search..." />
    </div>
    
    <nav class="breadcrumb" aria-label="You are here:">
      <!-- Breadcrumb items -->
    </nav>
    
    <div class="header-actions">
      <button aria-label="Notifications">🔔</button>
      <button aria-label="User menu" aria-haspopup="true">👤</button>
    </div>
  </nav>
</header>
```

### 11.2 Footer Implementation

**Best Practices:**
1. Use semantic HTML (`<footer>`, `<nav>`)
2. Group related links in `<ul>` elements
3. Provide skip back to content link
4. Use ARIA for status indicators
5. Implement responsive columns
6. Update system info dynamically
7. Cache footer content to improve performance

**Code Pattern:**
```HTML
<footer role="contentinfo" class="global-footer">
  <section class="footer-section">
    <h2>Quick Links</h2>
    <nav aria-label="Footer">
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/docs">Documentation</a></li>
        <li><a href="/support">Support</a></li>
      </ul>
    </nav>
  </section>
  
  <section class="footer-section">
    <h2>System Information</h2>
    <div aria-live="polite" aria-label="System status">
      <p>Version: <span id="version">2.1.0</span></p>
      <p>Status: <span aria-label="Operational">✓</span></p>
    </div>
  </section>
  
  <p class="copyright">&copy; 2026 United Tractors. All Rights Reserved.</p>
</footer>
```

---

## 12. Module-Specific Header Variations

### 12.1 Case Module Header

```
[📌] Case #01469283
     Service Territory - Sangkulirang FMC ST

Status: Open | Priority: Medium | Date Opened: 28/05/2026

[Edit] [Assign] [Close] [More ▼]
```

### 12.2 Shift Module Header

```
[🔧] SFT-3061099
     Confirmed Shift

Date: 15/05/2026 08:00-17:00 | Resource: Mohammad Ficri Kaban

[Edit] [Delete] [Clone] [More ▼]
```

### 12.3 Opportunity Module Header

```
[💼] PAKET SERVICE 9500 HM GR500EX-3
     Deal Pipeline

Stage: Closed Lost | Amount: IDR 4,440,000.00 | Owner: PIPIT NAWA

[Submit] [Retrieve Price] [Generate Quote] [More ▼]
```

### 12.4 Work Order Module Header

```
[📋] WO-12345
     Service Delivery

Service: Repair | Territory: Padang ST | Resource: Assigned

[Dispatch] [Complete] [Print] [More ▼]
```

---

## 13. Testing & Quality Assurance

### 13.1 Header Testing Checklist

```
✓ Logo clickable and returns to dashboard
✓ Search functionality works across all modules
✓ Breadcrumb navigation updates correctly
✓ Open tabs persist on page refresh
✓ Notifications appear in real-time
✓ User menu dropdown works
✓ Icons have tooltips
✓ Responsive on all breakpoints
✓ Keyboard navigation works
✓ Screen reader accessible
✓ Load time < 500ms
✓ Color contrast meets WCAG AA
```

### 13.2 Footer Testing Checklist

```
✓ All links functional
✓ System status updates correctly
✓ Performance metrics accurate
✓ Social links open in new tab
✓ Legal links point to correct documents
✓ Responsive on all breakpoints
✓ Footer stays at bottom (not floats)
✓ Copy to clipboard works (if applicable)
✓ Screen reader accessible
✓ Color contrast meets WCAG AA
✓ Load time < 200ms
```

---

## 14. Performance Standards

### 14.1 Header Performance

```
Global Header:
- Load time: < 100ms
- Interaction delay: < 50ms
- Search autocomplete: < 200ms
- Tab switching: Instant (< 30ms)
- Icon rendering: < 50ms

Optimizations:
- Lazy load unused icons
- Cache search results
- Minimize reflows/repaints
- Use CSS transitions (not JS)
- Debounce search input
```

### 14.2 Footer Performance

```
Global Footer:
- Load time: < 100ms
- Rendering: < 50ms
- System info updates: < 200ms

Optimizations:
- Load footer after main content
- Cache footer HTML
- Minimal JavaScript
- Use CSS Grid (no JS layout)
- Lazy load social icons
```

---

## 15. Browser Compatibility

### 15.1 Supported Browsers

```
Desktop:
✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+

Mobile:
✓ Chrome Mobile 90+
✓ Safari iOS 14+
✓ Firefox Mobile 88+
✓ Samsung Internet 14+

Fallbacks:
• Graceful degradation for older browsers
• Grid fallback to flexbox
• CSS variables with fallback values
• ES6 with transpilation
```

---

## 16. Localization Standards

### 16.1 Multi-Language Support

```
HEADER:
Logo text:          Translatable
Breadcrumb:         Translatable
Tab labels:         Translatable
Placeholder text:   Translatable
Menu items:         Translatable
Tooltips:           Translatable

FOOTER:
All text:           Translatable
Links:              Localized URLs
Year:               Dynamic (©)
Status text:        Translatable
Legal links:        Localized docs

RTL Support:
✓ Arabic
✓ Hebrew
✓ Persian
✓ Urdu
```

---

**Document Version**: 1.0  
**Last Updated**: May 28, 2026  
**Author**: Enterprise Systems Design Team  
**Status**: Final Design Documentation - Production Ready

---

## Appendix A: CSS Variables

```css
/* Header Colors */
--header-bg: #FFFFFF;
--header-border: #E9ECEF;
--header-text: #333333;
--header-icon: #6C757D;
--header-active: #0066CC;

/* Footer Colors */
--footer-bg: #F8F9FA;
--footer-border: #E9ECEF;
--footer-text: #6C757D;
--footer-link: #0066CC;

/* Spacing */
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Typography */
--font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
--font-size-xs: 10px;
--font-size-sm: 12px;
--font-size-base: 14px;
--font-size-lg: 16px;
--font-size-xl: 28px;
```

---

**END OF HEADER & FOOTER STANDARDIZATION DOCUMENT**
