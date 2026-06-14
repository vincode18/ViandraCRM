# PRD — Opportunity Module
### UT Service Console · CRM Platform

> **Document Type:** Product Requirements Document  
> **Version:** 1.0  
> **Last Updated:** 2026-06-11  
> **Status:** Draft — Awaiting Engineering Review  
> **Owner:** Product Team  
> **Related Docs:** `Design_System.md` v1.0, `PRD_Opportunity_Design.md`

---

## 1. Overview

### 1.1 Purpose

This document defines the functional and data requirements for the **Opportunity Module** within the UT Service Console CRM. An Opportunity represents a sale or pending deal — tracking it from initial identification through pipeline stages to a final outcome of Closed Won or Closed Lost.

The module is designed to give sales teams a single source of truth for each deal: stage visibility at a glance, structured field capture, and contextual relationships to Accounts, Contacts, Cases, Assets, Quotes, and Service Products.

### 1.2 Goals

- Enable sales reps to create, update, and progress Opportunities through a defined sales funnel.
- Provide a stage chevron navigator so deal phase is always visible and actionable.
- Surface all related CRM objects (Cases, Quotes, Assets, etc.) without leaving the Opportunity record.
- Maintain a full activity and change history log for audit and coaching purposes.
- Conform entirely to the UT Service Console Design System (`Design_System.md` v1.0).

### 1.3 Non-Goals (v1.0)

- Revenue forecasting dashboards (planned for v1.1).
- Territory management and bulk territory reassignment.
- AI-assisted deal scoring (planned for v1.2).
- External partner portal access to Opportunity records.

---

## 2. User Personas

| Persona | Role | Primary Need |
|---------|------|-------------|
| **Sales Rep** | Creates and owns Opportunities | Enter deal data, move stages, log activities |
| **Sales Manager** | Reviews team pipeline | Monitor stage distribution, overdue deals, probability |
| **Operations Admin** | Configures picklists, stage gates | Maintain data integrity and field config |
| **Service Agent** | Read-only access from a Case | Understand deal context when handling service requests |

---

## 3. Entry Points

Users can create or access Opportunities from:

1. **Global "+ New" button** in the top navigation bar → select "Opportunity" from the object type picker.
2. **Account Detail page** → "Opportunities" related list → "New Opportunity".
3. **Contact Detail page** → "Opportunities" related list → "New Opportunity".
4. **Opportunities list view** (sidebar nav item) → "New" button in list header.
5. **Quick-convert from Lead** (future: Lead conversion flow, v1.1).

---

## 4. Stage Funnel (Chevron Navigator)

### 4.1 Stage Definitions

The top of every Opportunity detail page displays a horizontal chevron progress bar. Each chevron represents one pipeline stage. The stages are fixed in the following order:

| # | Stage Name | Description | Default Probability |
|---|-----------|-------------|-------------------|
| 1 | **Prospecting** | Initial identification; need confirmed | 10% |
| 2 | **Qualification** | Budget, authority, need, timeline assessed | 20% |
| 3 | **Needs Analysis** | Requirements documented; pain points confirmed | 30% |
| 4 | **Value Proposition** | Solution presented; ROI discussed | 50% |
| 5 | **Proposal / Price Quote** | Formal proposal submitted | 65% |
| 6 | **Negotiation / Review** | Terms under discussion | 80% |
| 7 | **Closed Won** | Deal signed; revenue booked | 100% |
| 8 | **Closed Lost** | Deal lost; reason captured | 0% |

> **Closed Won** and **Closed Lost** are terminal states. Once an Opportunity reaches either, further stage progression is locked. The record becomes read-only except for the `Description` and `NextStep` fields, and the close reason field (required on Closed Lost).

### 4.2 Chevron Behaviour

- Clicking a **future** chevron advances the stage to that step after confirmation (modal: "Move to [Stage]? This will update the stage and probability.").
- Clicking a **past** chevron regresses the stage (same confirmation modal). Each stage change is recorded in the History log.
- The **active stage** chevron is filled with `--accent` gold. Past stages use a completed fill. Future stages use `--bg-light`.
- On **Closed Won**: all chevrons up to stage 6 are filled; the Closed Won chevron displays a ✓ icon and fills with `--color-success`.
- On **Closed Lost**: the Closed Lost chevron fills with `--color-danger`; past stages retain their completed fill.
- Stage name and days-in-stage counter (`LastStageChangeInDays`) are shown below the active chevron.

### 4.3 Stage Lock Rules

| Condition | Behaviour |
|-----------|-----------|
| `IsClosed = true` | Chevron is read-only; no stage changes allowed |
| `HasOverdueTask = true` | Warning indicator on active chevron; stage change still permitted with acknowledgement |
| `Amount` is null at Proposal stage | Soft warning toast; stage change not blocked |

---

## 5. Page Layout

### 5.1 High-Level Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Opportunity Name · Owner · Stage Badge · Action Buttons    │
├─────────────────────────────────────────────────────────────────────┤
│  CHEVRON STAGE NAVIGATOR (full width)                               │
├──────────────────────────────────┬──────────────────────────────────┤
│                                  │                                  │
│   LEFT COLUMN (65%)              │   RIGHT COLUMN (35%)             │
│                                  │                                  │
│   Tab Bar:                       │   Related Panel:                 │
│   [Details] [Activity] [History] │   · Account / Contact            │
│                                  │   · Cases                        │
│   Details Tab:                   │   · Assets                       │
│   ┌──────────────────────────┐   │   · Service Products             │
│   │ Opportunity Info Card    │   │   · Quotes                       │
│   │ (core fields)            │   │   · Contracts                    │
│   ├──────────────────────────┤   │   · Campaigns                    │
│   │ Deal Metrics Card        │   │   · Competitors                  │
│   │ (amount, probability..)  │   │   · Team Members                 │
│   ├──────────────────────────┤   │                                  │
│   │ Forecast & Tracking Card │   │                                  │
│   └──────────────────────────┘   │                                  │
│                                  │                                  │
│   Activity Tab:                  │                                  │
│   Timeline of emails, calls,     │                                  │
│   tasks, meetings                │                                  │
│                                  │                                  │
│   History Tab:                   │                                  │
│   Field change log (who/what/    │                                  │
│   when)                          │                                  │
│                                  │                                  │
└──────────────────────────────────┴──────────────────────────────────┘
```

### 5.2 Header Bar

The sticky page header contains:

- **Opportunity Name** (`Name`) — editable inline on click, `text-2xl font-bold`
- **Account Name** (`AccountId`) — linked, `text-sm text-tertiary`
- **Stage Badge** — coloured badge using status colours from the design system
- **Priority Badge** (`IsPriorityRecord`) — shown only when flagged Important
- **Private indicator** (`IsPrivate`) — lock icon when true
- **Action Buttons (right-aligned):**
  - `Edit` — `.btn-secondary`
  - `Log Activity` — `.btn-secondary`  
  - `New Quote` — `.btn-secondary`
  - `Mark Won` / `Mark Lost` — `.btn-primary` (contextual, hidden when already closed)
  - `⋯ More` — overflow menu for: Clone, Delete, Print, Share

---

## 6. Left Column — Detail Tabs

### 6.1 Tab: Details

#### Card 1 — Opportunity Information

| Field Label | Field Name | Type | Notes |
|------------|-----------|------|-------|
| Opportunity Name | `Name` | string | Required. Inline editable. |
| Account | `AccountId` | reference | Lookup to Account. Required. |
| Contact | `ContactId` | reference | Primary contact for this deal. |
| Close Date | `CloseDate` | date | Required. Date picker. |
| Stage | `StageName` | picklist | Synced with chevron navigator. |
| Probability (%) | `Probability` | percent | Auto-populated by stage; editable. |
| Amount | `Amount` | currency | Required at Proposal stage+. |
| Expected Amount | `ExpectedRevenue` | currency | Read-only: `Amount × Probability`. |
| Type | `Type` | picklist | e.g. New Business, Existing Business, Renewal. |
| Lead Source | `LeadSource` | picklist | e.g. Web, Referral, Event, Cold Call. |
| Description | `Description` | textarea | Rich text, up to 32,000 chars. |
| Next Step | `NextStep` | string | Max 255 chars. Prominent placement. |
| Private | `IsPrivate` | boolean | Toggle; limits visibility to owner + admin. |
| Important | `IsPriorityRecord` | boolean | Toggle; pins to priority view. |

#### Card 2 — Deal Metrics

| Field Label | Field Name | Type | Notes |
|------------|-----------|------|-------|
| Currency | `CurrencyIsoCode` | picklist | ISO 4217, 3-char. |
| Quantity | `TotalOpportunityQuantity` | double | Total units. |
| Price Book | `Pricebook2Id` | reference | Linked price book. |
| Forecast Category | `ForecastCategoryName` | picklist | e.g. Pipeline, Best Case, Commit, Closed. |
| Push Count | `PushCount` | int | Read-only. Count of close date pushes. |
| Days In Stage | `LastStageChangeInDays` | int | Read-only. Auto-calculated. |
| Age (Days) | `AgeInDays` | int | Read-only. Days since creation. |
| Recent Activity | `LastActivityInDays` | int | Read-only. Days since last activity. |
| Last Activity | `LastActivityDate` | date | Read-only. |

#### Card 3 — Tracking & References

| Field Label | Field Name | Type | Notes |
|------------|-----------|------|-------|
| Order Number | `OrderNumber__c` | string | Max 8 chars. |
| Tracking Number | `TrackingNumber__c` | string | Max 12 chars. |
| Referral Code | `ReferralCode` | string | Max 255 chars. |
| Current Generators | `CurrentGenerators__c` | string | Incumbent systems/products, max 100 chars. |
| Main Competitors | `MainCompetitors__c` | string | Comma-separated competitor names, max 100 chars. |
| Delivery/Install Status | `DeliveryInstallationStatus__c` | picklist | e.g. Yet to Begin, In Progress, Completed. |
| Contract | `ContractId` | reference | Linked contract if exists. |
| Synced Quote | `SyncedQuoteId` | reference | The primary synced quote. |
| Campaign | `CampaignId` | reference | Source campaign. |
| Fiscal Period | `Fiscal` | string | Read-only. Auto from `CloseDate`. |
| Fiscal Quarter | `FiscalQuarter` | int | Read-only. |
| Fiscal Year | `FiscalYear` | int | Read-only. |

#### Card 4 — System Information (Collapsible, collapsed by default)

| Field Label | Field Name | Type | Notes |
|------------|-----------|------|-------|
| Opportunity ID | `Id` | id | Read-only. |
| Owner | `OwnerId` | reference | Reassignable via lookup. |
| Created By | `CreatedById` | reference | Read-only. |
| Created Date | `CreatedDate` | datetime | Read-only. |
| Last Modified By | `LastModifiedById` | reference | Read-only. |
| Last Modified Date | `LastModifiedDate` | datetime | Read-only. |
| Last Stage Change | `LastStageChangeDate` | datetime | Read-only. |
| Last Viewed | `LastViewedDate` | datetime | Read-only. |
| Last Referenced | `LastReferencedDate` | datetime | Read-only. |
| Territory | `Territory2Id` | reference | Read-only unless admin. |
| Activity Metric | `ActivityMetricId` | reference | Read-only. |
| Has Line Item | `HasOpportunityLineItem` | boolean | Read-only. |
| Has Open Activity | `HasOpenActivity` | boolean | Read-only. |
| Has Overdue Task | `HasOverdueTask` | boolean | Read-only. Surfaces as a warning banner. |

---

### 6.2 Tab: Activity

Displays a chronological activity timeline for this Opportunity. Entries are grouped by date (Today, Yesterday, This Week, Older).

**Activity Types:**

| Icon | Type | Source |
|------|------|--------|
| 📞 | Call | Manual log or telephony integration |
| ✉️ | Email | Manual log or email integration |
| ✅ | Task | Completed tasks linked to Opportunity |
| 📅 | Meeting | Calendar events linked to Opportunity |
| 📝 | Note | Freeform notes |

**Log Activity button** opens a slide-in panel with:
- Activity Type selector
- Subject / description
- Date & time
- Related contact
- Duration (calls)

**Last Activity Date** (`LastActivityDate`) and **Recent Activity in Days** (`LastActivityInDays`) are auto-updated on every logged entry.

---

### 6.3 Tab: History (Field Change Log)

An immutable audit trail of all field changes on this record.

**Columns:** Date/Time · Changed By · Field · Old Value · New Value

**Tracked fields (minimum):** `StageName`, `Amount`, `CloseDate`, `OwnerId`, `Probability`, `ForecastCategoryName`, `IsClosed`, `IsWon`

- Each stage change references `LastAmountChangedHistoryId` and `LastCloseDateChangedHistoryId` for amount/date-specific history.
- History entries cannot be edited or deleted.
- Pagination: 25 entries per page; "Load more" button.

---

## 7. Right Column — Related Panels

Each related panel is a collapsible card. Default state: all expanded. User preference is persisted per session.

### 7.1 Account & Contact

| Element | Description |
|---------|-------------|
| Account name | Linked to Account detail page |
| Account type | Industry, phone number |
| Primary contact | `ContactId` — name, title, email, phone |
| "View Account" button | Opens Account detail |

### 7.2 Cases

Lists open Cases linked to this Opportunity's Account.

| Column | Field |
|--------|-------|
| Case Number | `CaseNumber` |
| Subject | `Subject` |
| Status | Status badge |
| Priority | Priority badge |
| Created | `CreatedDate` |

- "New Case" shortcut button links the new Case to the Account.
- Max 5 rows shown; "View All" link opens filtered Case list.

### 7.3 Assets

Lists Assets associated with the Account.

| Column | Field |
|--------|-------|
| Asset Name | `Name` |
| Product | `Product2Id` |
| Serial Number | `SerialNumber` |
| Status | `Status` |
| Install Date | `InstallDate` |

### 7.4 Service Products (Line Items)

Lists Opportunity Line Items when `HasOpportunityLineItem = true`.

| Column | Field |
|--------|-------|
| Product | `Product2Id` |
| Quantity | `Quantity` |
| Unit Price | `UnitPrice` |
| Total Price | `TotalPrice` |
| Service Date | `ServiceDate` |

- "Add Product" button opens product selector modal (requires `Pricebook2Id` to be set first).
- Total at bottom: Sum of all line item `TotalPrice` values.

### 7.5 Quotes

Lists Quotes linked to this Opportunity.

| Column | Field |
|--------|-------|
| Quote Name | `Name` |
| Status | `Status` |
| Expiration Date | `ExpirationDate` |
| Total Price | `TotalPrice` |
| Synced | Checkmark if `SyncedQuoteId` matches |

- "New Quote" button creates a Quote pre-linked to this Opportunity.
- Only one Quote can be synced at a time; syncing a new Quote desyncs the previous.

### 7.6 Contracts

Lists Contracts linked to this Opportunity.

| Column | Field |
|--------|-------|
| Contract Number | `ContractNumber` |
| Status | `Status` |
| Start Date | `StartDate` |
| End Date | `EndDate` |

### 7.7 Campaigns

| Column | Field |
|--------|-------|
| Campaign Name | `Name` |
| Type | `Type` |
| Status | `Status` |
| Start Date | `StartDate` |

### 7.8 Competitors

Inline editable mini-table from `MainCompetitors__c` string. In v1.0 this is a formatted text display; v1.1 will introduce a structured Competitor junction object.

### 7.9 Opportunity Team Members

| Column | Field |
|--------|-------|
| Member Name | User lookup |
| Role | `TeamMemberRole` |
| Access | `OpportunityAccessLevel` |

- "Add Team Member" button.
- Owner is always listed at top and cannot be removed from team.

---

## 8. New Opportunity — Create Form

Accessed via any "New Opportunity" entry point. A modal or slide-in panel (not a full page) with required fields only:

**Required at creation:**

1. Opportunity Name (`Name`)
2. Account (`AccountId`)
3. Close Date (`CloseDate`)
4. Stage (`StageName`)

**Optional at creation (shown in "Additional Details" expandable section):**

- Amount, Contact, Type, Lead Source, Description, Campaign, Owner (defaults to logged-in user)

On Save: redirect to full Opportunity detail page.

---

## 9. Opportunity List View

Accessible from the sidebar nav. Default columns:

| Column | Field | Sortable |
|--------|-------|---------|
| Opportunity Name | `Name` | ✓ |
| Account | `AccountId` | ✓ |
| Stage | `StageName` | ✓ |
| Amount | `Amount` | ✓ |
| Close Date | `CloseDate` | ✓ |
| Probability | `Probability` | ✓ |
| Owner | `OwnerId` | ✓ |
| Last Activity | `LastActivityDate` | ✓ |

**Standard filters:** Stage, Owner, Close Date range, Amount range, Forecast Category, Priority flag.

**Saved views:** "My Open Opportunities", "Closing This Month", "All Opportunities", "Overdue" (CloseDate < today AND IsClosed = false).

---

## 10. Validation Rules

| Rule | Condition | Message |
|------|-----------|---------|
| Close Date required | `CloseDate` is null on Save | "Close Date is required." |
| Close Date in past warning | `CloseDate` < today | Warning toast (non-blocking): "Close date is in the past." |
| Amount required at Proposal | Stage ≥ "Proposal / Price Quote" AND Amount is null | "Amount is required at Proposal stage or later." |
| Close reason on Lost | Stage = "Closed Lost" AND `Description` is null | "Please add a close reason in the Description before marking as Lost." |
| Synced quote check | `SyncedQuoteId` references a Quote with Status = "Declined" | Warning badge on Quote panel: "Synced quote has been declined." |
| Overdue task warning | `HasOverdueTask = true` | Warning banner below chevron navigator. |

---

## 11. Permissions

| Role | Create | Read | Edit | Delete | Change Stage | Reassign Owner |
|------|--------|------|------|--------|-------------|----------------|
| Sales Rep (own) | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Sales Rep (others) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Sales Manager | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service Agent | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |

`IsPrivate = true` records are visible only to the Owner and Admin roles.

---

## 12. Notifications & Alerts

| Trigger | Recipients | Channel |
|---------|-----------|---------|
| Stage moved to Closed Won | Owner, Manager | In-app notification + email |
| Stage moved to Closed Lost | Owner, Manager | In-app notification |
| Close Date passes (IsClosed = false) | Owner | In-app warning badge on record |
| Overdue task exists | Owner | In-app warning on Opportunity header |
| Opportunity reassigned | New Owner | In-app notification + email |
| Amount changed > 20% | Owner, Manager | In-app notification |

---

## 13. API & Integration Considerations

- Opportunity records must be fully CRUD-accessible via the internal REST API.
- Stage changes must fire a `StageChange` webhook event for downstream integrations (ERP, billing).
- Quote sync (`SyncedQuoteId`) must trigger a recalculation of `Amount` if the synced Quote's `TotalPrice` changes.
- `ActivityMetricId` and `ActivityMetricRollupId` are read-only computed fields managed by the activity engine.
- All datetime fields are stored in UTC; display in user's local timezone.

---

## 14. Acceptance Criteria

- [ ] Chevron navigator renders all 8 stages; active stage highlighted with accent gold.
- [ ] Clicking a chevron opens a confirmation modal before changing stage.
- [ ] Stage change is reflected in History tab immediately.
- [ ] Closed Won/Lost chevrons use correct semantic colours (`--color-success` / `--color-danger`).
- [ ] All 4 detail cards render correct fields with proper types (date pickers, currency formatting, lookups).
- [ ] System Information card is collapsed by default.
- [ ] Activity tab timeline groups entries by date bucket.
- [ ] History tab shows field-level change log for all tracked fields.
- [ ] All 9 related panels render in right column; each is independently collapsible.
- [ ] New Opportunity modal captures 4 required fields and redirects to detail on save.
- [ ] Validation rules fire at correct conditions.
- [ ] `IsPrivate = true` records are hidden from non-owner/non-admin users.
- [ ] Dark mode renders all tokens correctly with no hard-coded hex overrides.
- [ ] All interactive elements meet 44px minimum touch target.
- [ ] Focus-visible states are visible on all interactive elements.

---

## 15. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | Should "Closed Lost Reason" be a dedicated picklist field or captured in Description? | Product | Sprint 1 |
| 2 | What picklist values should `Type` and `LeadSource` include for this business? | Business Analyst | Sprint 1 |
| 3 | Should `PushCount` trigger an alert to the manager after N pushes? | Product | Sprint 2 |
| 4 | Should Stage regression be restricted (e.g., can you go from Negotiation back to Prospecting)? | Sales Ops | Sprint 1 |
| 5 | Will Quote sync be real-time or batch-updated? | Engineering | Sprint 2 |

---

*End of PRD — Opportunity Module (Functional)*
