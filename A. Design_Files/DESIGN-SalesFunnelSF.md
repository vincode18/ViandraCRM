# Sales Funnel — Salesforce CRM Pipeline Design

> **System:** UT Service Console  
> **Record Types:** Opportunity → Quote / Quotation → Quote Line Item → Approval History  
> **Flow:** Prospecting → Submit → Preparation → Quotation → Negotiation → Closed  
> **Layout:** 5-Stage Pipeline with Approval Gates · 2-Column Detail Views  
> **Reference:** UT Service Console screenshots + Sales Funnel process diagram  
> **Theme:** ⬛🟨 Black & Yellow — Primary `#F5C800` · Surface `#1A1A1A` · Base `#0D0D0D`

---

## Sales Funnel Overview

### Pipeline Stages

```
[Prospecting] → [Submit] → [Preparation] → [Quotation] → [Negotiation] → [Closed Won / Closed Lost]
     ↓               ↓            ↓               ↓              ↓                ↓
  Create Opp    Approval     Create Quote    Approve PDF    Customer Nego     SR / WO Created
               Gate #1        in SAP         Generate      Flow Nego          or Closed Lost
                                             Document
```

### Color-Coded Role Actors

| Actor Tag | Role | Color |
|-----------|------|-------|
| ADM | Administrator | `#F5C800` bg · `#0D0D0D` text |
| SPV | Supervisor | `#F5C800` bg · `#0D0D0D` text |
| SDH | Sales Division Head | `#60A5FA` bg · `#0D0D0D` text |
| ADM/SPV | Administrator or Supervisor | `#F5C800` bg |
| ADM/SPV/SDH | Any of the three | `#F5C800` bg |
| SALESFORCE | System (SF) action | `#FB923C` bg |
| SAP | SAP ERP action | `#60A5FA` bg |

### Stage Progress Bar

**Height:** ~28px · **Border-Radius:** `14px` · full-width top of record  
Each stage is a chevron arrow segment:

| Stage | State | Color |
|-------|-------|-------|
| Past stages | Completed | bg `#52C41A` · checkmark `✓` · text `#0D0D0D` |
| Current stage | Active | bg `#F5C800` · text `#0D0D0D` · font-weight 600 |
| Future stages | Pending | bg `#2E2E2E` · text `#A0A0A0` |
| Closed Won | Terminal | bg `#52C41A` · text `#0D0D0D` |
| Closed Lost | Terminal | bg `#FF4D4F` · text `#F0F0F0` |
| Denied | Terminal | bg `#FF4D4F` · text `#F0F0F0` |
| Accepted | Terminal | bg `#52C41A` · text `#0D0D0D` |

---

## Stage 1 — Prospecting: Create Opportunity

### Opportunity Record — UI Design

**Record Type:** Opportunity / Prospects  
**Example Record:** NFT-S:BOTLE PAP 2 Pcs_MHA

#### Layer 3 — Opportunity Title Bar

| Component | Detail |
|-----------|--------|
| Record icon | Orange square `#FB923C` |
| Record label | "Opportunity / Prospect" · 11px · `#A0A0A0` |
| Record name | NFT-S:BOTLE PAP 2 Pcs_MHA · 20px · `#F5C800` · font-weight 600 |
| Opportunity Number | OP-1307710 · 12px · `#F0F0F0` |
| Total Amount | IDR 115,000.00 · 12px · `#F5C800` · font-weight 500 |
| Opportunity Owner | SURYADI - AOR PRS SURYADI *(link)* · 12px · `#F5C800` |

#### Layer 3 — Action Buttons (Opportunity)

| Button | Style | Action |
|--------|-------|--------|
| Follow | Outline · border `#2E2E2E` · text `#A0A0A0` · hover `#F5C800` | Subscribe |
| Submit/Approve Opportunity | Outline · hover `#F5C800` | Triggers Approval Process |
| Retrieve Price | Outline · hover `#F5C800` | Refresh pricing from catalog |
| Generate Quotation | **Primary** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 | Auto-creates Quotation in SF + SAP |

#### Layer 4 — Sub-Tab Bar (Opportunity)

| Tab | State |
|-----|-------|
| Details | Active `#F5C800` |
| Activity | Inactive |
| Chatter | Inactive |
| Similar Opportunities | Inactive |

---

### Opportunity — Details Tab

#### Section 1A: Customer Information

**2-column layout (left / right)**

**Left Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Account Name | MANDIRI HERINDO ADIPERKASA TBK *(link)* | Parent account |
| Account Divisi | TG – MANDIRI HERINDO ADIPERKASA TBK *(link)* | Division link |
| Sales Office | TG TKS *(link)* | Sales office lookup |
| Contact | Paul Willem *(link)* | Primary contact |
| Opportunity Type | MIN | Dropdown — type of opp |
| Approval Status | Approved | Badge · bg `#0D2200` · text `#52C41A` |
| Service Area | Tanjung Ampuh ST | Territory field |
| Service Area Name | Tanjung Ampuh | Derived from Service Area |
| Transaction Type | Without Mechanic | Dropdown |

**Right Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Product | UT | Lookup to product catalog |
| Brand Code | SCANIA | Brand identifier |
| Asset | S39ULA-SIN516 – YSTREN4022B229-R6 *(link)* | Linked asset |
| Unit Model | S39ULA-4X4-519 | Read-only from asset |
| Serial Number List | YSTREN4022B229R6 | Serial / chassis numbers |
| Last SMT | — | Last service date |
| Data Synced to SAP | ☑ | Checkbox · `#F5C800` accent |
| Notes | — | Free text |

---

#### Section 1B: Billing Customer

| Field | Value | Notes |
|-------|-------|-------|
| Billing Account | MANDIRI HERINDO ADIPERKASA TBK *(link)* | Billing entity |
| Billing Account Division | TG – MANDIRI HERINDO ADIPERKASA TBK *(link)* | Division |
| Billing Contact Name | Paul Willem | Billing contact |
| Billing Sales Office | TG TKS *(link)* | |
| Billing Division Code | TG | |
| Billing Sales Office Code | TKS | |

---

#### Section 1C: Opportunity Information

**Left Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Opportunity Name | NFT-S:BOTLE PAP 2 Pcs_MHA | Free text |
| Opportunity Number | QR-1505T10 | Auto-generated |
| Source | PKU | Dropdown |
| Opportunity Description | NFT-S:BOTLE RAP 2 Pcs_MHA | Mirror of name |
| Case | — | Linked Case record |

**Right Sub-Column**

| Field | Value | Notes |
|-------|-------|-------|
| Opportunity Owner | SURYADI - AOR PRS SURYADI *(link)* | User lookup |
| Close Date | 13/09/2026 | Date field |
| Stage | Closed Won | Stage dropdown |
| Prioritization | Not prospected | Dropdown |
| Amount Estimated | IDR 0 – $2,000,000 | Range field |
| Opportunity Currency | IDR – Indonesian Rupiah | Currency |
| Exchange Rate to DR | 0.00 | |

---

#### Right Panel — Related List Quick Links

| Link | Count | Icon Color |
|------|-------|-----------|
| Products / Materials | 1 | `#F5C800` |
| Quotes / Quotations | 1 | `#F5C800` |
| Stage History | 4 | `#F5C800` |
| Files | 0 | `#A0A0A0` |
| Approval History | 0 | `#A0A0A0` |
| Cases | 0 | `#A0A0A0` |
| Maintenance Plans | 0 | `#A0A0A0` |

#### Promotion Info Panel

| Component | Detail |
|-----------|--------|
| Header | "Promotion Info (0)" · `#F5C800` |
| New button | bg `#F5C800` · text `#0D0D0D` · 11px |
| Empty state | no promotions applied |

#### Products / Materials Panel (1)

| Field | Value |
|-------|-------|
| Material Number | ST_UT_PAP |
| Quantity | 1.00 |
| Total Price (Promo) | IDR 1×5,000.00 |

#### Quotes / Quotations Panel (1)

| Field | Value |
|-------|-------|
| Quote Number | 00148203 |
| Quotation Name | Quotation -v1 – NFT-S:BOTLE PAP 2 Pcs_MHA |
| Expiration Date | 06/09/2026 |
| Grand Total Amount | IDR 288,000.00 |

#### Stage History Panel (3+)

| Stage | Details |
|-------|---------|
| Closed Won | Estimated Amt IDR 115,000.00 · Probability 100% · Close Date 26/09/2026 |
| Negotiation | Estimated Amt IDR 115,000.00 · Probability 75% · Close Date 26/09/2026 · Last Modified by SURYADI · 25/05/2026 10:26 |
| Quotation | Last Modified by Danahari Simon Gia Adityanto · 22/05/2026 20:10 |

---

## Stage 2 — Submit: Approval Gate #1 (Opportunity)

### Process Flow

```
[Complete Content in Opportunity]
         ↓
[Submit Opportunity for Approval]  ← ADM/SPV action
         ↓
    Approval Process?
    ┌────┴────┐
    Y         N
    ↓         ↓
Auto Create   Opportunity
Case +        Closed Lost
Notif/Inquiry
    ↓
[Proceed to Preparation]
```

### Content Required in Opportunity (before Submit)

| # | Required Field | Notes |
|---|---------------|-------|
| 1 | Asset | Linked unit/asset record |
| 2 | Service Area | Territory assignment |
| 3 | Add Product / Material | At least 1 product line |

### Submit / Approve Opportunity Button

| State | Style | Behavior |
|-------|-------|---------|
| Not submitted | Outline · `#A0A0A0` | Enabled when all required fields filled |
| Submitted | bg `#2D2600` · border `#F5C800` · text `#F5C800` | Shows pending badge |
| Approved | bg `#0D2200` · border `#52C41A` · text `#52C41A` | Approval Status field → "Approved" |
| Rejected | bg `#2D0000` · border `#FF4D4F` · text `#FF4D4F` | Opportunity → Closed Lost |

### Approval History (Opportunity level)

> Accessible via "Approval History" in Related List Quick Links

| Column | Detail |
|--------|--------|
| Step Name | Link to step detail · `#F5C800` · hover underline |
| Date | DateTime · `#F0F0F0` · 12px |
| Status | Badge: Approved `#52C41A` · Submitted `#F5C800` · No Response `#A0A0A0` · Rejected `#FF4D4F` |
| Assigned To | User link · `#F5C800` |
| Actual Approver | User link · `#F5C800` |
| Comments | Text · `#F0F0F0` |

**Example rows (from screenshot):**

| Step | Date | Status | Assigned To | Actual Approver |
|------|------|--------|------------|----------------|
| Step 1 | 25/05/2026, 09:25 | No Response | M. Thoriqul Anwar Hidayat | — |
| Step 1 | 25/05/2026, 09:40 | Approved | Danahari Rizwan Eka Adityanto | Danahari Rizwan Eka Adityanto |
| Approval Request Submitted | 25/05/2026, 09:18 | Submitted | SURYADI – AOR PRS SURYADI | SURYADI – AOR PRS SURYADI |

**Full-page Approval History view:**

| Column | Detail |
|--------|--------|
| Step Name | clickable link · `#F5C800` |
| Date | `#F0F0F0` · 12px |
| Status | Approved badge / Submitted badge |
| Assigned To | `#F5C800` link |
| Actual Approver | `#F5C800` link |
| Comments | `#A0A0A0` · dash if empty |

---

## Stage 3 — Preparation: Auto-Create Quotation

### Process Flow

```
[Opportunity Approved]
        ↓
[Auto Create Case]  ← SAP/SF system
[Auto Create Notif & Inquiry]
        ↓
[Generate Quotation button]  ← ADM/SPV
        ↓
[Quotation created in Salesforce]
        ↓
[Complete Content in Quotation]  ← ADM/SPV
        ↓
[Submit Quotation for Approval]  ← Approval Gate #2
        ↓
    Approval Process?
    ┌─────┴─────┐
    Y (SDH/     N
    BCSPPD)
    ↓           ↓
Auto Create   Submit
Quotation     Quotation
in SAP        for approval
```

### Content Required in Quotation (before Submit)

| # | Required Field | Notes |
|---|---------------|-------|
| 1 | Change product price | Update from standard to negotiated price |
| 2 | Additional product | Add extra line items if needed |
| 3 | Change product | Swap product if customer requests |

---

## Stage 4 — Quotation Record UI Design

### Quotation Title Bar

**Example Record:** Quotation -v1 – NFT-S:BOTLE PAP 2 Pcs_MHA

| Component | Detail |
|-----------|--------|
| Record icon | Green square `#52C41A` |
| Record label | "Quote / Quotation" · 11px · `#A0A0A0` |
| Quote number | 00148203 · 12px · `#F0F0F0` |
| Opportunity Name | NFT-S:BOTLE PAP 2 Pcs_MHA *(link)* · `#F5C800` |
| Expiration Date | 06/09/2026 |
| Billing Account | MANDIRI HERINDO ADIPERKASA TBK *(link)* |
| Grand Total Amount | IDR 286,380.00 |
| Grand Total SP | IDR 230,000.00 |

#### Action Buttons (Quotation)

| Button | Style | Action |
|--------|-------|--------|
| Follow | Outline · hover `#F5C800` | Subscribe |
| Submit For Approval | Outline · hover `#F5C800` | Triggers Approval Gate #2 |
| Retrieve Price | Outline · hover `#F5C800` | Refresh pricing |
| Approve/Reject Approval | **Primary** · bg `#F5C800` · text `#0D0D0D` · font-weight 600 | Approve or reject current step |

#### Stage Progress Bar (Quotation)

```
[Draft] → [✓] → [✓] → [✓] → [✓] → [✓] → [Accepted] → [Denied]
```
- Accepted: bg `#52C41A` · active
- Denied: bg `#2E2E2E` · inactive

---

### Quotation Sub-Tab Bar

| Tab | State |
|-----|-------|
| Related | **Active** `#F5C800` |
| Details | Inactive |
| Feed | Inactive |

---

### Quotation — Related Tab

#### Quote Line Items Section

**Header:** "Quote Line Items (1)" · `#F5C800`  
**Toolbar buttons:**
- `[ + ]` · bg `#F5C800` · text `#0D0D0D`
- `[ ↺ ]` refresh · `#A0A0A0`
- `[ Add Products / Materials ]` · Outline · hover `#F5C800`
- `[ Edit Products ]` · Outline · hover `#F5C800`

**Column Headers:**

| Column | Width | Detail |
|--------|-------|--------|
| Checkbox | 16px | accent `#F5C800` |
| Product /... | ~100px | 11px · `#A0A0A0` · sort arrow |
| Item No | ~60px | 11px · `#A0A0A0` |
| standard m... | ~80px | Standard markup |
| Manhours | ~70px | Hours field |
| Rate/Man... | ~80px | Rate per manhour |
| Final Price (...) | ~100px | Calculated |
| Grand Total | ~100px | `#F5C800` font-weight 500 |
| Remarks to... | ~100px | Customer remarks |
| Remarks by... | ~100px | Internal remarks |
| Relative Price | ~80px | vs standard |
| `[ - ]` action | 24px | expand/collapse row |

**Example Row:**

| Product | Item No | Standard | Manhours | Rate | Final Price | Grand Total | Remarks |
|---------|---------|---------|---------|------|-------------|-------------|---------|
| Botol PAP *(link)* | 030010 | standard m... | 1.00 | IDR 230,000.00 | IDR 230,000.00 | 2 Sampe × 12% |

---

#### Quote Product Items Section

| Component | Detail |
|-----------|--------|
| Header | "Quote Product Items (0)" · `#F5C800` |
| Delete Part button | Outline · hover `#FF4D4F` |
| Empty state | no product items |

#### Quote PDFs Section

| Component | Detail |
|-----------|--------|
| Header | "Quote PDFs (0)" · `#F5C800` |
| Empty state | generated PDFs will appear here after Generate PDF |

#### Notes Section

| Component | Detail |
|-----------|--------|
| Header | "Notes (0)" · `#F5C800` |
| New button | bg `#F5C800` · text `#0D0D0D` |

#### Contracts (Quote) Section

| Component | Detail |
|-----------|--------|
| Header | "Contracts (Quote) (0)" · `#F5C800` |
| Empty state | no contracts |

#### Files Section

| Component | Detail |
|-----------|--------|
| Header | "Files (0)" · `#F5C800` |
| Add File button | Outline · hover `#F5C800` |
| Upload Files button | bg `#F5C800` · text `#0D0D0D` |
| Drop zone | "Or drop files" · dashed border `#2E2E2E` · text `#A0A0A0` |

---

#### Approval History Section (Quotation)

**Header:** "Approval History (3)" · `#F5C800`

| Column | Detail |
|--------|--------|
| Step Name | Link · `#F5C800` · hover underline |
| Date | DateTime · 12px · `#F0F0F0` |
| Status | Badge pill |
| Assigned To | User link · `#F5C800` |
| `[ ▼ ]` action | Outline dropdown · `#A0A0A0` |

**Example Rows:**

| Step Name | Date | Status | Assigned To |
|-----------|------|--------|------------|
| Step 1 | 25/05/2026, 09:40 | No Response | M. Thoriqul Anwar Hidayat |
| Step 1 | 25/05/2026, 09:40 | Approved | Danahari Rizwan Eka Adityanto |
| Approval Request Submitted | 25/05/2026, 09:18 | Submitted | SURYADI – AOR PRS SURYADI |

**Status Badge Tokens:**

| Status | Background | Text |
|--------|-----------|------|
| Submitted | `#2D2600` | `#F5C800` |
| No Response | `#2E2E2E` | `#A0A0A0` |
| Approved | `#0D2200` | `#52C41A` |
| Rejected | `#2D0000` | `#FF4D4F` |
| Recalled | `#2D2600` | `#FB923C` |

---

### Right Panel — Quote New Version & Generate PDF

#### Quote New Version Panel

**Header:** "Quote New Version (0)" · `#F5C800`  
**Sub-tabs:** Activity · Generate PDF

#### Generate PDF Sub-Tab

| Component | Detail |
|-----------|--------|
| Label | "Generate PDF" · 13px · `#F5C800` · font-weight 600 |
| "Please select template:" | 12px · `#A0A0A0` |
| Template dropdown | bg `#242424` · border `#2E2E2E` · text `#F0F0F0` · focus-border `#F5C800` · full-width |
| Generate button | bg `#F5C800` · text `#0D0D0D` · font-weight 600 · hover bg `#C9A100` |

**Template Options (from screenshot):**

| Option | Description |
|--------|-------------|
| Choose one... | Default placeholder |
| Standard Quotation | Standard format · highlighted bg `#2D2600` |
| Detail Quotation | Detailed breakdown |
| List Sparepart Quotation | Parts list format |
| Full Version Quotation | Complete version |
| Standart Taman Quotation | Taman variant |
| Custom Quote Service | Custom service format |

---

## Stage 4B — Quote Line Item Detail

### Quote Line Item Title Bar

**Example:** Botol PAP

| Component | Detail |
|-----------|--------|
| Record icon | Green square `#52C41A` |
| Record name | Botol PAP · 20px · `#F5C800` · font-weight 600 |
| Sales Price | IDR 258,000.00 |
| Quantity | 1.00 |
| Total Price | IDR 258,000.00 |
| Edit button | bg `#F5C800` · text `#0D0D0D` · top-right |

#### Sub-Tabs (Quote Line Item)

| Tab | State |
|-----|-------|
| Related | Inactive |
| Details | **Active** `#F5C800` |
| Add More Sparepart | Inactive |

---

### Quote Line Item — Details Tab

#### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Item No | 030310 | Auto-generated |
| Line Item Number | 00/73050 | Sequence |
| Product Name | Botol PAP *(link)* | Product lookup |
| Product Name | BT_UT_PAP | Product code |
| Quote Name | Quotation v1 – NFT-S:BOTLE PAP 2 Pcs_MHA *(link)* | Parent quote |
| Price Is Finalized | ☑ | Checkbox · `#F5C800` accent |
| Component Availability | — | Text |
| Last Status Update | — | DateTime |

#### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| List Price | IDR 129,000.00 | Catalog price |
| Sales Price | IDR 230,000.00 | Negotiated price |
| Price Product | IDR 230,000.00 | |
| Price Rejected | — | If price was rejected |

---

#### Service-Quote Section

| Field | Value | Notes |
|-------|-------|-------|
| Product Description | Botol PAP | |
| Price Cap | IDR 0.00 | Max price cap |
| Standard manhour | 1.00 | |
| Rate/Man-hour | — | Rate input |
| Manhours | — | Manhour count |
| Selling Price | IDR 150,000.00 | |
| Fabrication | — | |
| Description (Fabrication) | — | |
| Accommodation | — | |
| Consultasi (in consultant) | — | |
| Consumable goods | — | |
| Transportation | — | |
| Total Price (Spare Part) | IDR 0.00 | |
| Hybrid Product | ☐ | Checkbox |
| Price Change (%) | 0.00% | |
| Total Price Service | IDR 230,000.00 | |
| Remarks to HO | 2 Sample × 129,000 | |
| Remarks to customer | — | |
| Remarks by HO | — | |
| Price Fabrication | IDR 0.00 | |
| Remarks Fabrication | — | |
| Price Accommodation | IDR 0.00 | |
| Remarks (Accommodation) | — | |
| Price Consumable | IDR 0.00 | |
| Remarks (Consumable) | — | |
| Price Transport | IDR 0.00 | |
| Remarks Transport | — | |
| Remarks (Spare Part) | — | |

---

### Quotation — Details Tab

**2-column full-detail view of Quote record**

#### Left Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Quote Number | QA4N60 | Auto |
| Quote Name | Quotation – NFT-S:BOTLE PAP 2 Pcs_MHA | |
| Opportunity | NFT-S:BOTLE PAP 2 Pcs_MHA *(link)* | Parent Opp |
| IFS Location | — | |
| IFS Customer | — | |
| Grand Total Disc | — | |
| Status | Accepted | Badge `#52C41A` |
| Message (Not Check) | "You are not able to update this quotation, please finish current process." | Warning text · `#FB923C` |
| Joint Visit Quote | ☐ | |
| Commission Sales | — | |

#### Right Sub-Column

| Field | Value | Notes |
|-------|-------|-------|
| Expiration Date | 06/09/2026 | |
| Name | Accepted | Derived status |
| Approval Cycle | NFT-S:BOTLE PAP 2 Pcs_MHA | |
| Reference Quote | — | |
| Approval Level | — | |
| Last Email Quote | 21/05/2026 | |

---

#### Customer Information Sub-section

| Field | Value |
|-------|-------|
| Account Name | MANDIRI HERINDO ADIPERKASA TBK *(link)* |
| Outside Contact | TRISONO SIDIK LAIN AKUNTANSI *(link)* |
| Sales Offices | TG TKS *(link)* |
| Service Area | Tanjung Ampuh |

#### Billing Sub-section

| Field | Value |
|-------|-------|
| Billing Account | MANDIRI HERINDO ADIPERKASA TBK *(link)* |
| Billing Account Division | TG – MANDIRI HERINDO ADIPERKASA TBK *(link)* |
| Billing Contact Name | Not Willem |
| Billing Sales Office | TG TKS *(link)* |
| Billing Division Code | TG |
| Billing Payment Terms | N45 |

#### Totals Sub-section

| Field | Value |
|-------|-------|
| Total Price (Jl res) | IDR 288,000.00 |
| Total Price Recommendation | IDR 0.00 |
| Total Price Fabrication | IDR 0.00 |
| Total Price Transport | IDR 0.00 |
| Total Price Communication Costs | IDR 0.00 |
| Total Price Others | IDR 0.00 |
| Total Price Consumables | IDR 0.00 |
| Total Price Service | IDR 230,000.00 |
| Sub Total Price | IDR 230,000.00 |
| Grand Total Price | IDR 230,000.00 |

#### ERP Information Sub-section

| Field | Value |
|-------|-------|
| ERP Quotation ID | 1500000664 |
| ERP Quotation Nr | 1500000664 |
| ERP Status | Approved |
| Comment | Source: Department-Hold |
| Delay Reason | — |
| User filter: Item Count | 0.1 |
| Last User Role Insert | 21/05/2026, 17:04 |

---

## Stage 5 — Quotation: Approval Gate #2

### Quotation Approval Flow

```
[Submit Quotation for Approval]  ← ADM/SPV action
          ↓
    Approval Process?  ← SDH / BCSPPD reviewer
    ┌──────┴──────┐
    Y              N
    ↓              ↓
Auto Create     Submit
Quotation       Quotation
in SAP          for approval
(Preparation)
    ↓
[Approved status]
    ↓
Generate Document Quotation (PDF)  ← ADM/SPV/SDH
    ↓
Send Document Quotation (PDF)  ← ADM/SPV/SDH
```

### Approval History — Full List View

**Breadcrumb:** Opportunities / Prospects > NFT-S:BOTLE PAP 2 Pcs_MHA > Approval History  
**Header:** "Approval History" · 18px · `#F5C800` · font-weight 600  
**Subtitle:** "2 items · Sorted by Is Pending · Updated a few seconds ago" · `#A0A0A0` · 11px

**Toolbar:**
- `[ + ]` · bg `#F5C800` · text `#0D0D0D`
- `[ ↺ ]` refresh · icon `#A0A0A0` · hover `#F5C800`
- Filter icon · `#A0A0A0` · hover `#F5C800`

**Columns:**

| Column | Width | Style |
|--------|-------|-------|
| Step Name | ~200px | link `#F5C800` · hover underline |
| Date | ~160px | DateTime `#F0F0F0` · 12px |
| Status | ~120px | Badge pill per token |
| Assigned To | ~200px | User link `#F5C800` |
| Actual Approver | ~200px | User link `#F5C800` |
| Comments | ~200px | text `#F0F0F0` · dash if empty |
| `[ ▼ ]` | 24px | row actions dropdown |

**Example Rows:**

| # | Step Name | Date | Status | Assigned To | Actual Approver |
|---|-----------|------|--------|------------|----------------|
| 1 | Approval to Selected User | 25/05/2026, 09:25 | Approved | Syamsudi Syamsudi *(link)* | Syamsudi Syamsudi *(link)* |
| 2 | Approval Request Submitted | 25/05/2026, 09:20 | Submitted | SURYADI – AOR PRS SURYADI *(link)* | SURYADI – AOR PRS SURYADI *(link)* |

---

## Stage 6 — Negotiation

### Process Flow

```
[PDF Quotation sent to Customer]
        ↓
Customer Agree With Quotation?
    ┌────┴────┐
    Y         N
    ↓         ↓
Finalize  Customer Request to Nego?
Quotation   ┌────┴────┐
            Y         N
            ↓         ↓
        Flow Nego  Denied Quotation
                   → Opportunity Closed Lost
```

### Negotiation Actions

| Action | Actor | Detail |
|--------|-------|--------|
| Generate Document Quotation (PDF) | ADM/SPV/SDH | Generates final PDF from template |
| Send Document Quotation | ADM/SPV/SDH | Emails PDF to customer |
| Finalize Quotation | ADM/SPV/SDH | Marks quote as accepted |
| Denied Quotation | ADM/SPV/SDH | Marks quote as denied |
| Flow Nego | System | Opens negotiation sub-flow |

---

## Stage 7 — Closed

### Closed Won Flow

```
[Quotation Accepted]
        ↓
[Opportunity Closed Won]
        ↓
[Create SR] ← ADM/SPV
[Create WO] ← ADM/SPV
```

### Closed Lost Flow

```
[Quotation Denied] OR [Approval Rejected]
        ↓
[Opportunity Closed Lost]
        ↓
[Record archived · stage bar → red "Closed Lost"]
```

### Closed Won Record State

| Component | Detail |
|-----------|--------|
| Stage bar | "Closed Won" · bg `#52C41A` · text `#0D0D0D` · rightmost active |
| Approval Status | Approved · badge `#0D2200` · text `#52C41A` |
| Stage field | Closed Won |
| Probability | 100% |
| Next actions | Create SR / Create WO buttons appear |

---

## Full Pipeline Summary Table

| Stage | SF Object | Key Action | Actor | Next Trigger |
|-------|-----------|-----------|-------|-------------|
| Prospecting | Opportunity | Create Opportunity | ADM/SPV/SDH | Complete all required fields |
| Submit | Opportunity | Submit for Approval | ADM/SPV | Approval Gate #1 |
| Approved → | Case auto-create | Auto-create Case + Notif | SYSTEM (SF) | Proceeds to Preparation |
| Preparation | Quotation | Generate Quotation | ADM | Content complete check |
| Submit Quote | Quotation | Submit Quote for Approval | ADM/SPV | Approval Gate #2 |
| Approved → | SAP | Auto-create Quotation in SAP | SYSTEM (SAP) | SAP sync |
| Quotation | Quotation | Generate PDF, Send PDF | ADM/SPV/SDH | Customer response |
| Negotiation | Quotation | Agree / Negotiate / Deny | Customer | Customer decision |
| Closed Won | Opportunity | Finalize → Create SR/WO | ADM/SPV | SR & WO created |
| Closed Lost | Opportunity | Archive | SYSTEM | End |

---

## Color & Status Tokens

| Token | Text | Background | Usage |
|-------|------|-----------|-------|
| Submitted | `#F5C800` | `#2D2600` | Approval submitted |
| No Response | `#A0A0A0` | `#2E2E2E` | Awaiting reviewer |
| Approved | `#52C41A` | `#0D2200` | Step approved |
| Rejected | `#FF4D4F` | `#2D0000` | Step rejected |
| Accepted | `#52C41A` | `#0D2200` | Quote accepted |
| Denied | `#FF4D4F` | `#2D0000` | Quote denied |
| Closed Won | `#0D0D0D` | `#52C41A` | Opportunity won |
| Closed Lost | `#F0F0F0` | `#FF4D4F` | Opportunity lost |
| Draft | `#A0A0A0` | `#2E2E2E` | Quote not submitted |
| Negotiation | `#FB923C` | `#2D1600` | Active negotiation |

---

## Typography Scale

| Role | Size | Weight | Color | Usage |
|------|------|--------|-------|-------|
| Record Name | 20px | 600 | `#F5C800` | Opp / Quote title |
| Record Label | 11px | 400 | `#A0A0A0` | "Opportunity / Prospect" |
| Section Title | 13px | 600 | `#F5C800` | Collapsible section headers |
| Field Label | 11px | 400 | `#A0A0A0` | Form field labels |
| Field Value | 13px | 500 | `#F0F0F0` | Form field values |
| Link Value | 13px | 500 | `#F5C800` | Linked record values |
| Amount | 13px | 600 | `#F5C800` | Currency totals |
| Badge | 11px | 500 | *(per token)* | Status pills |
| Tab Active | 13px | 600 | `#F5C800` | Active tab |
| Tab Inactive | 13px | 400 | `#A0A0A0` | Inactive tab |
| Stage Label | 12px | 500 | `#0D0D0D` | Stage bar text |
| Warning text | 12px | 400 | `#FB923C` | Process lock messages |
| Button Primary | 13px | 600 | `#0D0D0D` | CTA on `#F5C800` bg |
| Button Outline | 13px | 400 | `#A0A0A0` | Secondary actions |

---

## Interaction States

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `#1A1A1A` | `#2E2E2E` | `#F0F0F0` |
| Hover (row / card) | `#242424` | `#2E2E2E` | `#F0F0F0` |
| Focused input | `#1A1A1A` | `#F5C800` | `#F0F0F0` |
| Active / Selected | `#2D2600` | `#F5C800` | `#F5C800` |
| Disabled | `#141414` | `#1A1A1A` | `#4A4A4A` |
| Warning | `#2D1600` | `#FB923C` | `#FB923C` |
| Danger hover | `#2D0000` | `#FF4D4F` | `#FF4D4F` |

---

## Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0D0D0D; }
::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #F5C800; }
```

---

## Component Hierarchy Summary

```
App
├── GlobalTopBar
│
├── AppBar (Console + Tabs)
│
├── OpportunityRecord
│     ├── TitleBar (name, number, amount, owner)
│     ├── ActionButtons [Follow | Submit/Approve Opp | Retrieve Price | Generate Quotation]
│     ├── StageProgressBar (Prospecting → Closed Won)
│     ├── SubTabBar [Details | Activity | Chatter | Similar Opportunities]
│     └── BodyGrid
│           ├── Col1: DetailForm
│           │     ├── CustomerInformationSection
│           │     ├── BillingCustomerSection
│           │     ├── OpportunityInformationSection
│           │     └── CaseInformationSection
│           └── Col2: RelatedPanel
│                 ├── RelatedListQuickLinks
│                 ├── PromotionInfoPanel
│                 ├── ProductsMaterialsPanel
│                 ├── QuotesQuotationsPanel
│                 └── StageHistoryPanel
│
├── ApprovalGate1 (Opportunity)
│     └── ApprovalHistoryList [Step, Date, Status, Assigned, Approver, Comments]
│
├── QuotationRecord
│     ├── TitleBar (quote number, opp name, dates, amounts)
│     ├── ActionButtons [Follow | Submit For Approval | Retrieve Price | Approve/Reject Approval]
│     ├── StageProgressBar (Draft → Accepted / Denied)
│     ├── SubTabBar [Related | Details | Feed]
│     └── BodyGrid
│           ├── Col1: RelatedTab
│           │     ├── QuoteLineItemsSection (table)
│           │     ├── QuoteProductItemsSection
│           │     ├── QuotePDFsSection
│           │     ├── NotesSection
│           │     ├── ContractsSection
│           │     ├── FilesSection (upload + drop zone)
│           │     └── ApprovalHistorySection
│           └── Col2: QuoteNewVersionPanel
│                 ├── ActivityTab
│                 └── GeneratePDFTab
│                       ├── TemplateDropdown
│                       └── GenerateButton
│
├── QuoteLineItemRecord
│     ├── TitleBar (product name, sales price, qty, total)
│     ├── EditButton
│     ├── SubTabBar [Related | Details | Add More Sparepart]
│     └── DetailsTab
│           ├── ItemInfoSection (Item No, Line No, Product, Quote link)
│           └── ServiceQuoteSection (all pricing fields)
│
├── ApprovalGate2 (Quotation)
│     └── ApprovalHistoryList [full-page view]
│
└── ClosedRecord
      ├── ClosedWon → CreateSR + CreateWO
      └── ClosedLost → Archived
```

---

## Document Version

**Version 1.0** — UT Service Console Sales Funnel SF Pipeline Design  
**Objects covered:** Opportunity · Quotation · Quote Line Item · Approval History  
**Theme:** Black & Yellow · Base `#0D0D0D` · Primary `#F5C800`  
**Parent Design:** DESIGN-CaseManagement.md → DESIGN-WorkOrder.md  
**Updated:** 2026-05-26
