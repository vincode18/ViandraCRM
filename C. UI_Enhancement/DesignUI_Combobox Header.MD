# UT Service Console - Design Enhancement Document

## Overview
This document outlines the comprehensive design enhancements for the UT Service Console application, focusing on header redesign, navigation structure, and module-specific layouts.

---

## 1. HEADER SECTION REDESIGN

### 1.1 Header Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  ≡  UT Service Console   [Dropdown v]    [Global Search Bar]    │
│     ├─ Dashboard                                               │
│     ├─ Case                        🔔   ⚙️   🌙   [User]     │
│     ├─ Work Order                                              │
│     ├─ Asset                                                   │
│     ├─ Account                                                 │
│     ├─ Plant                                                   │
│     ├─ Shift                                                   │
│     ├─ Field Service                                           │
│     ├─ EMR                                                     │
│     └─ [More Options...]                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Header Components

#### **A. Logo & Title Section (Left)**
- **UT Service Console** branding
- Material Design hamburger menu icon (≡)
- Semantic UI styling for brand consistency
- Fixed width: 220px

**HTML Structure:**
```html
<header class="header-container">
  <div class="header-left">
    <button class="menu-toggle" aria-label="Toggle Menu">
      <Icon name="bars" />
    </button>
    <span class="brand-title">UT Service Console</span>
  </div>
</header>
```

#### **B. Module Combobox / Dropdown (Center-Left)**
- **Position:** Immediately after "UT Service Console" text
- **Type:** Searchable dropdown combobox
- **Default Display:** "Dashboard"
- **Width:** 180px (auto-expand on focus)
- **Placeholder:** "Select a module..."

**Modules List (Searchable):**
1. Dashboard
2. Case
3. Work Order
4. Asset
5. Account
6. Plant
7. Shift
8. Field Service
9. EMR
10. [Expandable for future modules]

**Features:**
- Type-ahead search functionality
- Keyboard navigation (Arrow keys, Enter, Escape)
- Icon indicators for each module
- Currently selected module highlighted in yellow/gold
- Smooth transition on module change

**HTML Structure:**
```html
<div class="module-selector">
  <Dropdown
    placeholder="Select Module"
    search
    selection
    value={currentModule}
    onChange={handleModuleChange}
    options={[
      { key: 'dashboard', text: 'Dashboard', value: 'dashboard', icon: 'home' },
      { key: 'case', text: 'Case', value: 'case', icon: 'folder' },
      { key: 'workorder', text: 'Work Order', value: 'workorder', icon: 'clipboard' },
      { key: 'asset', text: 'Asset', value: 'asset', icon: 'cube' },
      { key: 'account', text: 'Account', value: 'account', icon: 'building' },
      { key: 'plant', text: 'Plant', value: 'plant', icon: 'industry' },
      { key: 'shift', text: 'Shift', value: 'shift', icon: 'clock' },
      { key: 'fieldservice', text: 'Field Service', value: 'fieldservice', icon: 'map' },
      { key: 'emr', text: 'EMR', value: 'emr', icon: 'heartbeat' }
    ]}
  />
</div>
```

#### **C. Global Search Bar (Center)**
- **Position:** Middle of header
- **Width:** 350px (centered)
- **Placeholder:** "Search cases, assets, accounts..."
- **Functionality:** Universal search across all number IDs and entities
- **Icon:** Magnifying glass (left side)
- **Keyboard Shortcut:** Ctrl+K or Cmd+K

**Search Capabilities:**
- Real-time search results
- Search by Case ID (e.g., "01532785")
- Search by Asset ID (e.g., "GD-829")
- Search by Account name
- Search by Contact name
- Debounced API calls (300ms delay)
- Recent searches display
- Search result categories with icons

**HTML Structure:**
```html
<div class="search-container">
  <Input
    icon="search"
    placeholder="Search cases, assets, accounts... (Ctrl+K)"
    value={searchQuery}
    onChange={handleSearch}
    onKeyDown={handleSearchKeydown}
    className="global-search-bar"
    loading={isSearching}
  />
  {showSearchResults && (
    <SearchResults
      results={searchResults}
      categories={['Cases', 'Assets', 'Accounts', 'Contacts']}
      onResultClick={navigateToResult}
    />
  )}
</div>
```

#### **D. Action Items Section (Right)**
- **Components (Left to Right):**
  1. Notification bell icon (🔔)
  2. Settings icon (⚙️)
  3. Theme toggle icon (🌙/☀️)
  4. User profile button with avatar

**User Profile Dropdown:**
- Display name
- Role (System Administrator, Service Advisor, etc.)
- Logout option
- Preferences link

**HTML Structure:**
```html
<div class="header-right">
  <Button icon="bell" compact className="icon-button" />
  <Button icon="cog" compact className="icon-button" />
  <Button icon="moon" compact className="icon-button" />
  <Dropdown
    trigger={<Image src={userAvatar} avatar />}
    options={[
      { key: 'profile', text: 'Profile', icon: 'user' },
      { key: 'settings', text: 'Settings', icon: 'cog' },
      { key: 'divider', divider: true },
      { key: 'logout', text: 'Logout', icon: 'sign out' }
    ]}
  />
</div>
```

### 1.3 Header Styling

```css
/* Header Container */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 0 0 auto;
}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.menu-toggle {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}

.module-selector {
  margin: 0 20px;
  min-width: 180px;
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 30px;
  position: relative;
}

.global-search-bar {
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #ffffff;
  border: 1px solid #444;
}

.global-search-bar:focus {
  border-color: #f5a623;
  box-shadow: 0 0 8px rgba(245, 166, 35, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 0 0 auto;
}

.icon-button {
  background: transparent;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.icon-button:hover {
  color: #f5a623;
}
```

---

## 2. SIDEBAR NAVIGATION

### 2.1 Sidebar Structure (Dynamic Based on Module)

#### **Dashboard Module - Sidebar**
```
┌─────────────────────┐
│  NAVIGATION         │
│ ┌─ Dashboard       │
│ ├─ Cases           │
│ ├─ Work Orders     │
│ ├─ Assets          │
│ ├─ Accounts        │
│ ├─ Users           │
│ └─ Reports         │
│                     │
│  QUICK LINKS        │
│ ├─ My Open Cases   │
│ ├─ Urgent WOs      │
│ └─ Today's Assets  │
└─────────────────────┘
```

#### **Case Module - Sidebar**
```
┌─────────────────────┐
│  CASES              │
│ ┌─ All Cases       │
│ ├─ Open            │
│ ├─ In Progress     │
│ ├─ Pending Review  │
│ ├─ Closed          │
│ └─ Archived        │
│                     │
│  FILTERS            │
│ ├─ Priority        │
│ ├─ Status          │
│ ├─ Assigned To     │
│ └─ Date Range      │
│                     │
│  QUICK LINKS        │
│ ├─ My Open Cases   │
│ ├─ SLA Breached    │
│ └─ Escalated       │
└─────────────────────┘
```

### 2.2 Sidebar Styling

```css
.sidebar {
  width: 220px;
  background-color: #1a1a1a;
  border-right: 1px solid #333;
  padding: 20px 0;
  overflow-y: auto;
  color: #ffffff;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-section {
  padding: 15px 10px;
  margin-bottom: 10px;
}

.sidebar-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #888;
  padding: 10px 15px;
  letter-spacing: 1px;
}

.sidebar-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 3px solid transparent;
}

.sidebar-item:hover {
  background-color: #2a2a2a;
  color: #f5a623;
}

.sidebar-item.active {
  background-color: #2a2a2a;
  color: #f5a623;
  border-left-color: #f5a623;
  font-weight: 600;
}

.sidebar-item icon {
  width: 18px;
  height: 18px;
}
```

---

## 3. MAIN CONTENT AREA - CASE MODULE LAYOUT

### 3.1 Three-Column Layout Structure

```
┌───────────────────────────────────────────────────────────────────────┐
│  Header                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│           │                          │                                 │
│  LEFT     │        CENTER            │       RIGHT                     │
│  PANEL    │    (Main Content)        │      PANEL                      │
│           │                          │                                 │
│  Related  │  Case Details            │  SLA & Performance              │
│  Data:    │  ─────────────────────   │  Timeline Flow                  │
│           │                          │  Past Cases for Asset           │
│ • Fleet   │  • Completion & SLA      │                                 │
│   Units   │  • Backdate Info         │                                 │
│ • Work    │  • Case Information      │                                 │
│   Orders  │  • Description & Notes   │  Related Linked Data:           │
│ • Parts   │  • Fleet/Asset Info      │  ───────────────────            │
│   Request │                          │  • Mechanic Details             │
│           │                          │  • Contact Information          │
│ • Account │  [Tabs]                  │  • Performance Metrics          │
│   Context │  Details Feed Related Log│  • SLA Compliance Score        │
│           │                          │                                 │
└───────────────────────────────────────────────────────────────────────┘
```

### 3.2 Left Panel - Related Data

**Width:** 280px (Fixed)

**Sections:**

#### **A. Fleet Units**
```
┌─────────────────────┐
│  FLEET UNITS (4)    │
├─────────────────────┤
│ GD-829             │
│ Komatsu D85ESS-2   │
│ Active             │
│ HM: 14,250 hrs     │
│ Loc: Site 8-Pit 4  │
├─────────────────────┤
│ GD-830  PC200-8    │
│ 12,500 hrs         │
│ Maint. Req.        │
├─────────────────────┤
│ GD-831  WA200-6    │
│ 16,750 hrs         │
│ Operational        │
├─────────────────────┤
│ GD-832  D65EX-12   │
│ 11,200 hrs         │
│ In Repair          │
└─────────────────────┘
```

#### **B. Affected Unit Details**
```
┌─────────────────────┐
│ AFFECTED UNIT       │
├─────────────────────┤
│ Asset ID:           │
│ EQ-HT-9942         │
│                     │
│ Model:              │
│ Centrifugal         │
│ Compressor X-100   │
│                     │
│ Location:           │
│ 📍 Facility B,      │
│    Sector 4         │
└─────────────────────┘
```

#### **C. Account Context**
```
┌─────────────────────┐
│ ACCOUNT DETAILS     │
├─────────────────────┤
│ Apex Industrial     │
│ Corp                │
│ Tier 1 Enterprise   │
│                     │
│ PRIMARY CONTACT     │
│ Sarah Jenkins       │
│ 📧 📞 +1(555)...   │
│ 📞 019-2834         │
└─────────────────────┘
```

**HTML Structure:**
```html
<div class="left-panel">
  <Card className="panel-card">
    <Card.Content>
      <Card.Header>
        <Icon name="cube" /> Fleet Units (4)
        <Icon name="refresh" onClick={refreshFleet} />
      </Card.Header>
    </Card.Content>
    <Card.Content scrollable>
      {fleetUnits.map(unit => (
        <div key={unit.id} className="fleet-unit-item">
          <strong>{unit.id}</strong>
          <div className="unit-meta">{unit.model}</div>
          <div className="unit-status">{unit.status}</div>
          <div className="unit-hours">HM: {unit.hours} hrs</div>
          <div className="unit-location">{unit.location}</div>
        </div>
      ))}
    </Card.Content>
  </Card>

  <Card className="panel-card">
    <Card.Content>
      <Card.Header>Affected Unit</Card.Header>
    </Card.Content>
    <Card.Content>
      <div className="detail-row">
        <span className="label">Asset ID:</span>
        <span className="value">{case.assetId}</span>
      </div>
      <div className="detail-row">
        <span className="label">Model:</span>
        <span className="value">{case.assetModel}</span>
      </div>
      <div className="detail-row">
        <span className="label">Location:</span>
        <span className="value">
          <Icon name="map marker alternate" /> {case.location}
        </span>
      </div>
    </Card.Content>
  </Card>

  <Card className="panel-card">
    <Card.Content>
      <Card.Header>Account Details</Card.Header>
    </Card.Content>
    <Card.Content>
      <strong>{case.accountName}</strong>
      <div className="tier-badge">{case.accountTier}</div>
      <div className="separator" />
      <div className="contact-section">
        <strong>Primary Contact</strong>
        <div>{case.primaryContact}</div>
        <div className="contact-methods">
          <Icon name="mail" size="small" />
          <Icon name="phone" size="small" />
          <span>{case.contactPhone}</span>
        </div>
      </div>
    </Card.Content>
  </Card>
</div>
```

### 3.3 Center Panel - Main Case Details

**Width:** Flexible (fills available space)

**Content Sections:**

#### **A. Case Header**
```
┌──────────────────────────────────────────────────────────┐
│  Case #: 01532785              [Edit] [Change Owner] ···│
│  Medium Priority | Closed                                 │
├──────────────────────────────────────────────────────────┤
│ Open → Assigned → In Progress → Resolved → Closed       │
│  ✓       ✓          ✓            ✓          ✓           │
└──────────────────────────────────────────────────────────┘
```

#### **B. Tab Navigation**
```
[Details] [Feed] [Related] [Log]
```

#### **C. Completion & SLA Tracking**

**Status Indicators:**
```
┌────────────────────────────────────────────────────────┐
│  COMPLETION & SLA TRACKING                             │
├────────────────────────────────────────────────────────┤
│ Start Date OTF Mechanic:                               │
│ 26/05/2026, 07:31          [Edit]                      │
│                                                         │
│ Target Date OTF Mechanic:                              │
│ 26/05/2026, 11:31          [Edit]                      │
│                                                         │
│ Start Date SLA:                                        │
│ 26/05/2026, 07:31          [Edit]                      │
│                                                         │
│ Target Date SLA:                                       │
│ 02/06/2026, 07:31          [Edit]                      │
│                                                         │
│ Backdate Validation:                                   │
│ ├─ Mechanic Start: 26/05/2026, 07:31 ✓               │
│ └─ Job Complete: 26/05/2026, 15:30 ☐                 │
│                                                         │
│ Reason: Manual Backdate. Initial dispatch delayed      │
│         due to site access clearance.                  │
└────────────────────────────────────────────────────────┘
```

#### **D. Case Information Section**

```
┌────────────────────────────────────────────────────────┐
│  2A. CASE INFORMATION                                  │
├────────────────────────────────────────────────────────┤
│  Case Owner:     System User                           │
│  Status:         Closed                                │
│  Case Number:    01532785                              │
│  Priority:       Medium                                │
└────────────────────────────────────────────────────────┘
```

#### **E. Subject & Description**

```
┌────────────────────────────────────────────────────────┐
│  2B. SUBJECT & DESCRIPTION                             │
├────────────────────────────────────────────────────────┤
│  Subject                                               │
│  Hydraulic Leak on Right Cylinder                      │
│                                                         │
│  Detailed Description                                  │
│  Operator reported significant hydraulic fluid leak    │
│  near the right cylinder during morning inspection.    │
│  Machine grounded pending repair. Suspect blown seal   │
│  or damaged hose fitting. Requires immediate           │
│  inspection and replacement parts.                     │
│  Equipment is critical for daily operations.           │
└────────────────────────────────────────────────────────┘
```

**HTML Structure:**
```html
<div class="center-panel">
  {/* Case Header */}
  <div className="case-header">
    <div className="header-top">
      <h1 className="case-number">{case.caseNumber}</h1>
      <div className="header-actions">
        <Button icon="edit" content="Edit" />
        <Button icon="user" content="Change Owner" />
        <Dropdown icon="ellipsis vertical" />
      </div>
    </div>
    <div className="header-meta">
      <Label color="orange">{case.priority} Priority</Label>
      <Label color="blue">{case.status}</Label>
    </div>
    <Progress
      sections={[
        { key: 'open', content: 'Open', color: 'blue', value: 1 },
        { key: 'assigned', content: 'Assigned', color: 'blue', value: 1 },
        { key: 'inprogress', content: 'In Progress', color: 'blue', value: 1 },
        { key: 'resolved', content: 'Resolved', color: 'orange', value: 1 },
        { key: 'closed', content: 'Closed', color: 'green', value: 1 }
      ]}
    />
  </div>

  {/* Tab Navigation */}
  <Menu tabular>
    <Menu.Item
      name="Details"
      active={activeTab === 'details'}
      onClick={() => setActiveTab('details')}
    />
    <Menu.Item
      name="Feed"
      active={activeTab === 'feed'}
      onClick={() => setActiveTab('feed')}
    />
    <Menu.Item
      name="Related"
      active={activeTab === 'related'}
      onClick={() => setActiveTab('related')}
    />
    <Menu.Item
      name="Log"
      active={activeTab === 'log'}
      onClick={() => setActiveTab('log')}
    />
  </Menu>

  {/* Tab Content */}
  {activeTab === 'details' && (
    <div className="tab-content">
      <Card>
        <Card.Content>
          <Card.Header>Completion & SLA Tracking</Card.Header>
        </Card.Content>
        <Card.Content>
          <div className="tracking-item">
            <label>Start Date OTF Mechanic</label>
            <div className="date-value">
              26/05/2026, 07:31
              <Button icon="edit" size="mini" />
            </div>
          </div>
          {/* Additional tracking items */}
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Card.Header>2A. Case Information</Card.Header>
        </Card.Content>
        <Card.Content>
          <Table basic="very">
            <Table.Row>
              <Table.Cell>Case Owner:</Table.Cell>
              <Table.Cell>{case.owner}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Status:</Table.Cell>
              <Table.Cell>{case.status}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Case Number:</Table.Cell>
              <Table.Cell>{case.caseNumber}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Priority:</Table.Cell>
              <Table.Cell>{case.priority}</Table.Cell>
            </Table.Row>
          </Table>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Card.Header>2B. Subject & Description</Card.Header>
        </Card.Content>
        <Card.Content>
          <div className="form-group">
            <label>Subject</label>
            <p>{case.subject}</p>
          </div>
          <div className="form-group">
            <label>Detailed Description</label>
            <p>{case.description}</p>
          </div>
        </Card.Content>
      </Card>
    </div>
  )}
</div>
```

### 3.4 Right Panel - SLA & Performance Tracking

**Width:** 320px (Fixed)

**Sections:**

#### **A. SLA Status Card**

```
┌──────────────────────────────────┐
│  ⚠️  OVER SLA - BREACHED         │
│                           17 Days│
├──────────────────────────────────┤
│ OTF Mechanic:                    │
│ FAILED (+6.0d)                   │
│                                  │
│ OTF Solution:                    │
│ PENDING                          │
│                                  │
│ SLA Compliance Score:            │
│ 0%                               │
└──────────────────────────────────┘
```

#### **B. Performance Metrics**

```
┌──────────────────────────────────┐
│ PERFORMANCE METRICS              │
├──────────────────────────────────┤
│ Metric    │ Target  │ Actual     │
├───────────┼─────────┼────────────┤
│ 1st       │ 4h      │ 0.5h  ✓   │
│ Response  │         │            │
├───────────┼─────────┼────────────┤
│ Resolution│ 5d      │ 153d  ✗   │
│           │         │            │
└──────────────────────────────────┘
```

#### **C. Timeline Flow**

```
┌──────────────────────────────────┐
│ TIMELINE FLOW          [Filter]   │
├──────────────────────────────────┤
│ 26/10/2026                       │
│ 14:30 CASE CLOSED               │
│ System User - SLA review...      │
│                                  │
│ 28/05/2026                       │
│ 16:45 COMPLETION NOTE           │
│ "All repairs completed. System..." │
│                                  │
│ 27/05/2026                       │
│ 09:00 PARTS ARRIVED             │
│ Warehouse - Items verified...    │
│                                  │
│ 26/10/2026                       │
│ 07:31 CASE CREATED              │
│ System User - Automated case...  │
└──────────────────────────────────┘
```

#### **D. Past Cases for Asset**

```
┌──────────────────────────────────┐
│ PAST CASES FOR ASSET       50     │
├──────────────────────────────────┤
│ 01555475                         │
│ Hydraulic Leak | HO785:7-BO76   │
│ IN PROGRESS                      │
│                                  │
│ 01473917                         │
│ [Case Details...]               │
│ CLOSED                           │
└──────────────────────────────────┘
```

**HTML Structure:**
```html
<div className="right-panel">
  {/* SLA Status Card */}
  <Card className="sla-card">
    <Card.Content>
      <div className="sla-status">
        <Icon name="warning" color="red" size="large" />
        <h3>OVER SLA - BREACHED</h3>
        <span className="days-overdue">17 Days</span>
      </div>
    </Card.Content>
    <Card.Content>
      <div className="sla-item">
        <span>OTF Mechanic:</span>
        <Label color="red">FAILED (+6.0d)</Label>
      </div>
      <div className="sla-item">
        <span>OTF Solution:</span>
        <Label color="yellow">PENDING</Label>
      </div>
      <div className="sla-item">
        <span>SLA Compliance Score:</span>
        <Progress percent={0} color="red" />
        <span>0%</span>
      </div>
      <Button color="red" fluid content="Acknowledge Breach" />
    </Card.Content>
  </Card>

  {/* Performance Metrics */}
  <Card className="metrics-card">
    <Card.Content>
      <Card.Header>Performance Metrics</Card.Header>
    </Card.Content>
    <Card.Content>
      <Table celled compact>
        <Table.Body>
          <Table.Row>
            <Table.Cell>1st Response</Table.Cell>
            <Table.Cell>4h</Table.Cell>
            <Table.Cell>0.5h <Icon name="check" color="green" /></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Resolution</Table.Cell>
            <Table.Cell>5d</Table.Cell>
            <Table.Cell>153d <Icon name="close" color="red" /></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Card.Content>
  </Card>

  {/* Timeline Flow */}
  <Card className="timeline-card">
    <Card.Content>
      <Card.Header>
        Timeline Flow
        <Button icon="filter" floated="right" size="mini" />
      </Card.Header>
    </Card.Content>
    <Card.Content scrollable>
      <Timeline>
        {caseTimeline.map(event => (
          <Timeline.Event key={event.id}>
            <Timeline.Content>
              <div className="timeline-date">{event.date}</div>
              <div className="timeline-time">{event.time}</div>
              <strong className="timeline-title">{event.title}</strong>
              <p className="timeline-description">{event.description}</p>
            </Timeline.Content>
          </Timeline.Event>
        ))}
      </Timeline>
    </Card.Content>
  </Card>

  {/* Past Cases */}
  <Card className="past-cases-card">
    <Card.Content>
      <Card.Header>Past Cases for Asset ({pastCasesCount})</Card.Header>
    </Card.Content>
    <Card.Content scrollable>
      {pastCases.map(pastCase => (
        <div key={pastCase.id} className="past-case-item">
          <strong>{pastCase.caseNumber}</strong>
          <div className="past-case-subject">{pastCase.subject}</div>
          <div className="past-case-ref">{pastCase.assetRef}</div>
          <Label>{pastCase.status}</Label>
        </div>
      ))}
    </Card.Content>
  </Card>
</div>
```

---

## 4. CREATE NEW CASE FORM LAYOUT

### 4.1 Form Structure

**Page Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Header                                                         │
├─────────────────────────────────────────────────────────────────┤
│  Cases > New Case                                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ CREATE NEW CASE                                         │  │
│  │ System Status: Nominal                                  │  │
│  │                                                          │  │
│  │ CASE DETAILS                    Primary issue          │  │
│  │ description and immediate      E.g., Centrifuge cal... │  │
│  │ context.                         [Input Field]         │  │
│  │                                                          │  │
│  │ Description                    Rich Text Supported      │  │
│  │ [B] [I] [≡] [🔗]              [Large text area]       │  │
│  │                                                          │  │
│  │ CLASSIFICATION          ASSIGNMENT                      │  │
│  │ Categorization for...  Entity relations and...         │  │
│  │                                                          │  │
│  │ Case Type     Priority        Account                   │  │
│  │ [Select Type] [Select Priority] [Search Accounts...]   │  │
│  │                                                          │  │
│  │ Category      Sub-Category    Contact                   │  │
│  │ [Select Cat.] [Select Sub]    [Search Contacts...]    │  │
│  │                                                          │  │
│  │ Related Asset                 Owner                     │  │
│  │ [Search Assets...]            [ME] Current User...    │  │
│  │                                                          │  │
│  │ [Cancel] [More Options ▼]     [Save as Draft]         │  │
│  │                              [Save & New] [Save Case]   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Form Sections

#### **A. Case Details Section**

**Fields:**
- **Case Subject** (Required)
  - Input type: Text (single line)
  - Placeholder: "E.g., Centrifuge calibration error"
  - Max length: 200 characters
  - Character counter: "X/200"

- **Description** (Required)
  - Input type: Rich Text Editor
  - Placeholder: "Provide detailed steps to reproduce or observed symptoms..."
  - Features: Bold, Italic, Lists, Links, Formatting
  - Min height: 200px
  - Support for markdown

**HTML Structure:**
```html
<div className="form-section">
  <h3>CASE DETAILS</h3>
  <p className="section-description">Primary issue description and immediate context.</p>

  <Form.Field required>
    <label>Case Subject</label>
    <Input
      placeholder="E.g., Centrifuge calibration error"
      value={formData.subject}
      onChange={(e) => handleFieldChange('subject', e.target.value)}
      maxLength="200"
    />
    <small>{formData.subject.length}/200</small>
  </Form.Field>

  <Form.Field required>
    <label>Description</label>
    <span className="text-muted">Rich Text Supported</span>
    <RichTextEditor
      value={formData.description}
      onChange={(value) => handleFieldChange('description', value)}
      placeholder="Provide detailed steps to reproduce or observed symptoms..."
      minHeight="200px"
    />
  </Form.Field>
</div>
```

#### **B. Classification Section**

**Fields:**
- **Case Type** (Required)
  - Dropdown selector
  - Options: [Dynamic from system]

- **Priority** (Required)
  - Dropdown selector
  - Options: Critical, High, Medium, Low

- **Category** (Required)
  - Dropdown selector with sub-categories
  - Dependent field: Sub-Category (enabled after category selection)

- **Sub-Category** (Conditional)
  - Enabled only after Category selection
  - Options: Dynamic based on Category

**HTML Structure:**
```html
<div className="form-section">
  <h3>CLASSIFICATION</h3>
  <p className="section-description">Categorization for routing and reporting.</p>

  <Form.Group widths="equal">
    <Form.Field required>
      <label>Case Type</label>
      <Dropdown
        placeholder="Select Type"
        selection
        value={formData.caseType}
        onChange={(e, { value }) => handleFieldChange('caseType', value)}
        options={caseTypeOptions}
      />
    </Form.Field>

    <Form.Field required>
      <label>Priority</label>
      <Dropdown
        placeholder="Select Priority"
        selection
        value={formData.priority}
        onChange={(e, { value }) => handleFieldChange('priority', value)}
        options={[
          { key: 'critical', text: 'Critical', value: 'critical' },
          { key: 'high', text: 'High', value: 'high' },
          { key: 'medium', text: 'Medium', value: 'medium' },
          { key: 'low', text: 'Low', value: 'low' }
        ]}
      />
    </Form.Field>
  </Form.Group>

  <Form.Group widths="equal">
    <Form.Field required>
      <label>Category</label>
      <Dropdown
        placeholder="Select Category"
        selection
        search
        value={formData.category}
        onChange={(e, { value }) => handleCategoryChange(value)}
        options={categoryOptions}
      />
    </Form.Field>

    <Form.Field required={formData.category !== ''}>
      <label>Sub-Category</label>
      <Dropdown
        placeholder="Select Category first"
        selection
        search
        value={formData.subCategory}
        onChange={(e, { value }) => handleFieldChange('subCategory', value)}
        options={subCategoryOptions}
        disabled={!formData.category}
      />
    </Form.Field>
  </Form.Group>
</div>
```

#### **C. Assignment Section**

**Fields:**
- **Account** (Required)
  - Search input with typeahead
  - Shows account name and tier
  - Display selected: Account name + Tier badge

- **Contact** (Required)
  - Search input with typeahead
  - Filtered by selected Account
  - Display selected: Contact name + Phone

- **Related Asset** (Optional)
  - Search input with typeahead
  - Shows Asset ID and Model
  - Display selected: Asset ID + Model + Location

- **Owner** (Auto-assigned)
  - Default: Current logged-in user
  - Manual assignment option available
  - Display: Avatar + Name + Role

**HTML Structure:**
```html
<div className="form-section">
  <h3>ASSIGNMENT</h3>
  <p className="section-description">Entity relations and ownership.</p>

  <Form.Group widths="equal">
    <Form.Field required>
      <label>Account</label>
      <Search
        placeholder="Search Accounts..."
        onSearchChange={handleAccountSearch}
        results={accountSearchResults}
        value={formData.account}
        onResultSelect={(e, { result }) => handleAccountSelect(result)}
      />
    </Form.Field>

    <Form.Field required>
      <label>Contact</label>
      <Search
        placeholder="Search Contacts..."
        onSearchChange={handleContactSearch}
        results={contactSearchResults}
        value={formData.contact}
        onResultSelect={(e, { result }) => handleContactSelect(result)}
        disabled={!formData.account}
      />
    </Form.Field>
  </Form.Group>

  <Form.Group widths="equal">
    <Form.Field>
      <label>Related Asset</label>
      <Search
        placeholder="Search Assets..."
        onSearchChange={handleAssetSearch}
        results={assetSearchResults}
        value={formData.asset}
        onResultSelect={(e, { result }) => handleAssetSelect(result)}
      />
    </Form.Field>

    <Form.Field>
      <label>Owner</label>
      <Segment tertiary>
        <div className="owner-field">
          <Image src={currentUser.avatar} avatar size="mini" />
          <div className="owner-info">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.role}</small>
          </div>
          <Button icon="edit" size="mini" />
        </div>
      </Segment>
    </Form.Field>
  </Form.Group>
</div>
```

### 4.3 Form Actions

**Button Layout:**
```
[Cancel]  [More Options ▼]    [Save as Draft]  [Save & New]  [Save Case]
```

**Button Definitions:**
- **Cancel** - Discard form and return to Cases list
- **More Options** - Expand additional fields (Optional fields)
- **Save as Draft** - Save form as draft (can be resumed later)
- **Save & New** - Save case and open new blank form
- **Save Case** - Save case and close form / redirect to case details

**HTML Structure:**
```html
<Form.Group>
  <Button
    color="grey"
    content="Cancel"
    onClick={handleCancel}
  />
  <Button
    color="grey"
    content="More Options"
    icon="dropdown"
    onClick={toggleMoreOptions}
  />
  <div className="right-aligned">
    <Button
      color="grey"
      content="Save as Draft"
      onClick={handleSaveDraft}
    />
    <Button
      color="grey"
      content="Save & New"
      onClick={handleSaveAndNew}
    />
    <Button
      color="yellow"
      content="Save Case"
      onClick={handleSaveCase}
      icon="save"
    />
  </div>
</Form.Group>
```

### 4.4 Form Styling

```css
.form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #f5f5f5;
}

.form-section {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 25px;
  margin-bottom: 20px;
}

.form-section h3 {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  color: #333;
}

.section-description {
  font-size: 13px;
  color: #777;
  margin-bottom: 20px;
  line-height: 1.5;
}

.form-field {
  margin-bottom: 20px;
}

.form-field label {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 8px;
  display: block;
  color: #333;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: #f5a623;
  box-shadow: 0 0 6px rgba(245, 166, 35, 0.2);
}

.text-muted {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

.character-counter {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.form-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group.full {
  grid-template-columns: 1fr;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.form-actions-right {
  display: flex;
  gap: 10px;
}

.form-actions button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-actions button:hover {
  background-color: #f5f5f5;
  border-color: #999;
}

.form-actions button.primary {
  background-color: #f5a623;
  color: #ffffff;
  border-color: #f5a623;
}

.form-actions button.primary:hover {
  background-color: #d68d1c;
  border-color: #d68d1c;
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 5. COLOR PALETTE & DESIGN SYSTEM

### 5.1 Colors

```
Primary Colors:
- Brand Gold/Yellow: #f5a623
- Dark Background: #1a1a1a
- Dark Surface: #2a2a2a
- Text Primary: #ffffff
- Text Secondary: #aaaaaa
- Border: #333333

Status Colors:
- Success/Operational: #22c55e (Green)
- Warning/Pending: #eab308 (Yellow)
- Critical/Error: #ef4444 (Red)
- In Progress: #3b82f6 (Blue)
- Closed/Completed: #8b5cf6 (Purple)
- Maintenance Required: #f97316 (Orange)

Alert Colors:
- SLA Breached: #ef4444 (Red)
- At Risk: #eab308 (Yellow)
- Compliant: #22c55e (Green)
```

### 5.2 Typography

```
Font Family: 'Segoe UI', 'Roboto', sans-serif

Font Sizes:
- Heading 1 (h1): 28px, weight 700
- Heading 2 (h2): 24px, weight 700
- Heading 3 (h3): 18px, weight 700
- Heading 4 (h4): 16px, weight 600
- Body: 14px, weight 400
- Small: 12px, weight 400
- Micro: 11px, weight 500

Line Heights:
- Headings: 1.2
- Body: 1.5
- Compact: 1.3
```

### 5.3 Spacing System

```
Base Unit: 4px

Spacing Scale:
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 32px
- 4xl: 40px
```

---

## 6. RESPONSIVE BREAKPOINTS

### 6.1 Breakpoint Definitions

```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: 1024px - 1440px
Large Desktop: > 1440px
```

### 6.2 Layout Adjustments

**Mobile (< 768px):**
- Single column layout (stack left, center, right panels)
- Collapsed sidebar (icons only)
- Dropdowns replace combobox
- Reduced padding/margins

**Tablet (768px - 1024px):**
- Two column layout (left sidebar + center)
- Right panel as drawer/modal
- Module combobox still visible
- Search bar simplified

**Desktop (1024px+):**
- Full three-column layout
- All components visible
- Optimal spacing and sizing

---

## 7. INTERACTION PATTERNS

### 7.1 Module Selection Flow

```
1. User clicks module dropdown
2. Dropdown expands with searchable list
3. User types to filter modules
4. User selects module
5. Page transitions to module
6. Sidebar updates to module-specific navigation
7. Main content area updates to module view
```

### 7.2 Case Detail Navigation

```
1. User clicks case ID in list
2. Case detail view loads
3. Three-panel layout displays
4. Related data loads in left panel
5. SLA tracking loads in right panel
6. Timeline loads in right panel
```

### 7.3 Create Case Flow

```
1. User clicks "+ New Case" button
2. Create Case form opens
3. Required fields highlighted
4. User fills Case Details section
5. User fills Classification section
6. User fills Assignment section
7. User clicks "Save Case"
8. Form validation runs
9. Case created and detail view opens
```

---

## 8. ACCESSIBILITY REQUIREMENTS

### 8.1 WCAG 2.1 Level AA Compliance

- All interactive elements have keyboard navigation
- Focus indicators visible on all buttons and inputs
- Color not the only means of conveying information
- Contrast ratio ≥ 4.5:1 for text
- Form labels associated with inputs
- Error messages clearly associated with fields
- Loading states announced to screen readers
- ARIA labels on icon-only buttons

### 8.2 Keyboard Shortcuts

```
Ctrl+K / Cmd+K     - Focus global search
Enter              - Confirm selection/submit form
Escape             - Close dropdown/modal
Tab / Shift+Tab    - Navigate between fields
Arrow Up/Down      - Navigate dropdown options
```

---

## 9. DEVELOPMENT NOTES

### 9.1 Framework & Libraries

Recommended Stack:
- React 18+ or Vue 3+
- Semantic UI React / Vuetify
- TailwindCSS for custom styling
- React Router for navigation
- Zustand / Pinia for state management
- Axios for API calls
- React Query / VueQuery for data fetching

### 9.2 Component Architecture

```
App
├── Header
│   ├── Logo
│   ├── ModuleSelector (Combobox)
│   ├── GlobalSearch
│   └── ActionItems
├── Sidebar
│   └── DynamicNavigation
├── MainContent
│   ├── Dashboard (Home)
│   └── Case
│       ├── LeftPanel
│       ├── CenterPanel
│       └── RightPanel
└── CreateCaseForm
```

### 9.3 State Management

```
Global State:
- currentModule
- currentUser
- currentCase (if viewing case)
- searchResults
- notifications
- sidebarCollapsed

Module State:
- caseList
- selectedCase
- caseFilters
- formData (for create/edit)
```

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: Foundation
- [ ] Header redesign (Logo, Module Selector, Global Search)
- [ ] Sidebar navigation structure
- [ ] Basic routing between modules

### Phase 2: Case Module - View
- [ ] Three-column layout
- [ ] Case detail panel
- [ ] Related data panels
- [ ] SLA tracking display

### Phase 3: Case Module - Create
- [ ] Create form layout
- [ ] Form validation
- [ ] Field dependencies
- [ ] Submit functionality

### Phase 4: Enhancement
- [ ] Search functionality implementation
- [ ] Responsive design
- [ ] Accessibility testing
- [ ] Performance optimization

### Phase 5: Integration
- [ ] API integration
- [ ] Real-time updates
- [ ] Error handling
- [ ] Loading states

---

## 11. NOTES & OBSERVATIONS

### 11.1 Current State Analysis

From the provided screenshots, the current application has:
- Dashboard home page with quick stats
- Case listing with inline search
- Detailed case view with multiple tabs
- Service advisor role support
- SLA tracking and compliance scoring
- Asset/equipment management
- Work order integration

### 11.2 Enhancement Benefits

The proposed redesign provides:
- **Improved Navigation**: Module selector allows quick switching between functional areas
- **Better Search**: Global search bar with intelligent categorization
- **Enhanced Context**: Three-panel layout shows full picture without navigation loss
- **Consistent Patterns**: Same layout structure across all modules
- **Mobile-First**: Responsive design supports all device sizes
- **Accessibility**: Full WCAG compliance for inclusive design

### 11.3 Future Considerations

- Dark mode toggle implementation
- Real-time notifications system
- Advanced filtering and saved views
- Export/reporting functionality
- Mobile app parity
- Performance monitoring dashboard

---

## DOCUMENT METADATA

**Version:** 1.0
**Created:** 2026-05-28
**Status:** Draft
**Audience:** Development Team, UI/UX Designers, Product Managers
**Last Updated:** 2026-05-28

---

**End of Design Document**
