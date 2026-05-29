# Asset Module Documentation

## Overview
The Asset module is a core component of the case management system designed to track, manage, and maintain detailed information about service assets. Assets are physical or non-physical items associated with customer accounts and service cases.

---

## Table of Contents
1. [Asset Object Structure](#asset-object-structure)
2. [Web Page Layout](#web-page-layout)
3. [Core Fields](#core-fields)
4. [Asset Details Section](#asset-details-section)
5. [Related Information](#related-information)
6. [Asset Lifecycle](#asset-lifecycle)
7. [Integration with Case Management](#integration-with-case-management)

---

## Asset Object Structure

### Definition
An Asset object represents a physical or logical item tracked within the service management system. Assets are linked to customer accounts and service cases for maintenance, troubleshooting, and support purposes.

### Asset Identifiers
- **Asset Name**: HDTBL-7-8076 (unique asset identifier)
- **Product Material**: HDTBL-7-8076 (reference to material/product)
- **Account**: STAR-JIPIA-SA2764 (linked customer account)

---

## Web Page Layout

### Header Section
The Asset module web page includes the following header elements:

| Element | Purpose |
|---------|---------|
| Asset Name | Primary identifier for the asset |
| Product Material | Type and category of the asset |
| Account Link | Association to customer account |
| Details Tab | Primary information view |
| Related Tab | Associated records and relationships |

### Navigation & Controls
- **Edit Button**: Modify asset information
- **Save/Cancel**: Commit or discard changes
- **Print/Download**: Export asset details
- **Refresh**: Reload current asset data

---

## Core Fields

### Asset Identification
| Field Name | Type | Description |
|------------|------|-------------|
| Asset Name | Text | Unique identifier for the asset |
| Product Material | Text | Product type and material composition |
| Asset Type | Dropdown | Classification (e.g., Equipment, Hardware, Software) |
| Account | Lookup | Link to customer account record |
| Contact | Lookup | Primary contact for the asset |

### Asset Information
| Field Name | Type | Description |
|------------|------|-------------|
| Completion Asset | Checkbox | Indicates if asset is complete/functional |
| Engine Model | Text | Model number of the engine/device |
| Serial Number | Text | Manufacturer serial number |
| Support Contract ID | Text | Associated support contract reference |
| Warranty Status | Dropdown | Current warranty status |
| Out of Warranty Date | Date | Date warranty expires or expired |

### Measurement & Specifications
| Field Name | Type | Description |
|------------|------|-------------|
| Warranty Number | Text | Warranty contract number |
| Warranty Months | Number | Duration of warranty in months |
| ARI Warranty | Checkbox | Alternative Repair Industry warranty flag |
| Warranty Start Date | Date | Warranty commencement date |
| Actually Effective Date | Date | Actual warranty effective date |
| Expiration Date | Date | Date warranty expires |
| Measurement Data | Text | Technical specifications and measurements |

### Operational Data
| Field Name | Type | Description |
|------------|------|-------------|
| Last Transmitted Data | Date | Timestamp of last data transmission |
| Usage/Control | Text | How asset is used or controlled |
| Measurement Unit | Text | Unit of measurement for asset metrics |
| Measuring Interval | Frequency | How often measurements are taken |
| Measuring Quantity | Number | Quantity being measured |
| UOM (Unit of Measurement) | Picklist | Standard unit type |

### Administrative Fields
| Field Name | Type | Description |
|------------|------|-------------|
| User Sector | Dropdown | Business sector using the asset |
| Revenue Category | Dropdown | Revenue classification |
| Region | Text | Geographic region |
| Contact | Lookup | Asset contact person |
| PM List | Checkbox | Included in preventive maintenance list |
| Start Date | Date | Asset activation/start date |

---

## Asset Details Section

### Details Tab Contents

#### Asset Overview
- Quick view of essential asset information
- Current status indicators
- Warranty and compliance status
- Equipment specifications

#### Key Attributes Displayed
1. **Asset Identification**: Name, Serial Number, Product Material
2. **Account Information**: Linked account and contact details
3. **Warranty Details**: Start date, expiration, warranty type
4. **Operational Status**: Current condition, usage pattern
5. **Service History**: Last service date, measurements, data transmissions

---

## Related Information

### Related Records Section
The Asset object maintains relationships with:

#### Service Contracts Asset (3+)
- Associated service contracts
- Contract terms and conditions
- Coverage details
- Related service agreements

#### Work Orders (3+)
- Maintenance work orders
- Service requests
- Repair tickets
- Preventive maintenance schedules

#### Asset History (1+)
- Previous owners/accounts
- Modification history
- Service records
- Status changes

#### Komreba Fascia Lexi 30 Days (0)
- Rolling 30-day activity tracking
- Service metrics
- Performance indicators

---

## Asset Lifecycle

### Asset States

```
CREATION → ACTIVE → MAINTENANCE → WARRANTY_EXPIRY → ARCHIVED
```

#### 1. Creation State
- Asset record created in system
- Basic information entered (name, serial, account)
- Initial warranty configured
- Linked to customer account

#### 2. Active State
- Asset in use and tracked
- Regular measurements and data collection
- Warranty active
- Associated with work orders and cases

#### 3. Maintenance State
- Planned or corrective maintenance
- Work orders created and tracked
- Asset may be out of service temporarily
- Maintenance history recorded

#### 4. Warranty Expiry
- Warranty nearing or past expiration
- Out-of-warranty alerts triggered
- Extended warranty options reviewed
- Contract renewal decisions

#### 5. Archived State
- Asset end-of-life
- Historical records maintained
- No longer actively supported
- Available for reporting and audits

---

## Integration with Case Management

### Asset-to-Case Relationship

```
Case
├── Linked Asset (via Asset ID)
├── Case Details
│   ├── Asset Information
│   ├── Warranty Status
│   ├── Service History
│   └── Last Measurements
└── Case Resolution
    ├── Asset Repair/Replacement
    ├── Warranty Claim
    └── Asset Reassignment
```

### Case Workflows Involving Assets

#### 1. Asset Troubleshooting Case
- Case created for asset malfunction
- Asset details auto-populated
- Service history reviewed
- Warranty status checked
- Resolution documented on asset

#### 2. Warranty Claim Case
- Warranty verification
- Asset condition assessment
- Claim eligibility determination
- Replacement or repair processing
- Asset record updated

#### 3. Maintenance Case
- Preventive maintenance scheduling
- Service completion tracking
- Measurement data collection
- Asset condition updates
- Next service date scheduled

#### 4. Asset Transfer Case
- Account reassignment
- Ownership transfer
- Asset history preserved
- New account linked
- Contact information updated

---

## Field Validation & Business Rules

### Required Fields
- Asset Name
- Product Material
- Account (must be valid customer account)
- Serial Number (if applicable)

### Conditional Requirements
- If Warranty Status = "Active": Warranty Start Date and Expiration Date required
- If ARI Warranty = True: Alternative Repair details must be provided
- If PM List = True: Measurement Interval required

### Constraints & Validations
- Serial Number must be unique per product type
- Warranty Start Date ≤ Expiration Date
- Actually Effective Date cannot be after current date
- Account must exist and be active
- Cannot delete asset linked to active case

---

## User Permissions & Access

### Role-Based Access Control

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| Service Admin | ✓ | ✓ | ✓ | ✓ |
| Service Manager | ✓ | ✓ | ✓ | ✗ |
| Service Agent | ✗ | ✓ | Limited | ✗ |
| Customer User | ✗ | ✓ | ✗ | ✗ |

---

## Reporting & Analytics

### Standard Asset Reports

1. **Asset Inventory Report**
   - Total assets by account
   - Asset status summary
   - Warranty expiration forecast

2. **Warranty Analysis Report**
   - Active vs. expired warranties
   - Warranty costs
   - Renewal recommendations

3. **Asset Performance Report**
   - Last measurement data
   - Service frequency
   - Maintenance history
   - Downtime analysis

4. **Account Asset Summary**
   - Assets per customer account
   - Service contract associations
   - Support history

---

## API Integration Points

### Asset Web Service Endpoints

```
GET /assets/{assetId}
POST /assets
PUT /assets/{assetId}
DELETE /assets/{assetId}
GET /assets/{assetId}/workOrders
GET /assets/{assetId}/serviceContracts
GET /accounts/{accountId}/assets
```

---

## Best Practices

### Asset Creation
- Use consistent naming conventions
- Always record complete serial numbers
- Link to correct customer account before saving
- Set warranty information accurately

### Asset Maintenance
- Update measurement data regularly
- Review warranty status quarterly
- Archive assets no longer in use
- Maintain complete service history

### Case Integration
- Always verify asset-case linkage
- Update asset status after case closure
- Document all asset changes in case notes
- Use asset history for troubleshooting reference

### Data Quality
- Validate account linkage
- Ensure serial number accuracy
- Keep warranty dates current
- Regularly audit asset records for completeness

---

## Troubleshooting & Support

### Common Issues

#### Asset Not Appearing in Case
- Verify asset is linked to correct account
- Check asset status is not archived
- Ensure account is active

#### Warranty Calculation Issues
- Confirm warranty start and end dates
- Validate warranty type selection
- Check for date format errors

#### Missing Asset Measurements
- Verify measurement interval is set
- Check last transmission date
- Ensure device connectivity (if applicable)

### Contact Support
For asset module issues, contact:
- **Service Management Team**: servicetech@company.com
- **Support Portal**: serviceconsole.company.com/support

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-05-26 | Initial Asset module documentation |

---

## Appendix: Sample Asset Record

### Example: HDTBL-7-8076
- **Product**: Hydraulic Leak Right Cylinder
- **Serial Number**: HDTBL-7-8076
- **Account**: STAR-JIPIA-SA2764
- **Warranty Status**: OUT OF WARRANTY
- **Last Measurement**: 25/06/2025, 15:58
- **Related Cases**: Multiple service cases
- **Measurement Type**: PRESSURE CHECK
- **Average UOM**: 0.8
- **Time Interval**: 8 HRS

---

**Document Owner**: Service Management Team  
**Last Updated**: May 26, 2025  
**Next Review**: August 26, 2025
