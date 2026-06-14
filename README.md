# Viandra Project CRM - UT Service Console

Enterprise field-service CRM for United Tractors. This repository is the source of truth for the working application, the functional requirements, the design system, the business-process notes, and the integration roadmap.

**App stack:** ASP.NET Core 8 · EF Core · MySQL · React 18 · Vite · TailwindCSS

---

## Current Snapshot

| Area | Status | Notes |
|------|--------|-------|
| Core app | Live | Backend API and React frontend are in `DEVELOPMENT_CRM/` |
| Case / Work Order | Live | Baseline MVP from the FRD package |
| Service Appointment / Field Service | Live | Dispatch and scheduling workflow is implemented in the frontend |
| Service Area / Shift / Asset | Live | Routing and sample-data-driven screens are present |
| Account / Contact | In progress | New list pages and helper data files exist; router and sidebar wiring are still pending |
| EMR | Documented | PRD and design docs define the field report workflow |
| Task List / Timesheet | Documented | Service console and mobile design docs describe the mechanic flow |
| Admin Settings / Field Access Control | Documented | PRD defines role and contact-level permissions |
| Data integration | Roadmap | Integration PRD defines dynamic modules, RLS, and live data strategy |

---

## Repository Map

| Folder | Purpose |
|--------|---------|
| `DEVELOPMENT_CRM/` | Working full-stack app (backend API + React frontend). See `DEVELOPMENT_CRM/README.md`. |
| `A. Design_Files/` | High-level module design documents. |
| `B. DesignComponentStitch/` | Stitched UI composition specs and interaction references. |
| `C. Compose_PRD/` | Current PRDs, the shared design system, and integration / admin roadmap docs. |
| `D. FRD_Bispro_Enhancement/` | Functional requirement addenda for case and work order enhancements. |
| `DesignUIUX/` | Generated UI design references (HTML + screenshots). |
| `FRD-FunctionalRequirement/` | Baseline MVP FRD package for Login, Cases, and Work Orders. |

---

## Working Application

The app is implemented in `DEVELOPMENT_CRM/frontend` and `DEVELOPMENT_CRM/backend`.

### Current frontend modules

Accessible through the global header module combobox and the shared app layout:

- Dashboard
- Cases
- Work Orders
- Service Appointments
- Field Service
- Service Area (Plants, Work Centers, Service Territory)
- Shift Management
- Asset Management

### Recent frontend additions

- Account list and helper data in `DEVELOPMENT_CRM/frontend/src/pages/AccountListPage.jsx` and `DEVELOPMENT_CRM/frontend/src/utils/accountData.js`
- Contact list and helper data in `DEVELOPMENT_CRM/frontend/src/pages/ContactListPage.jsx` and `DEVELOPMENT_CRM/frontend/src/utils/contactData.js`
- These account/contact surfaces are present in code, but they are not fully wired into the router and sidebar yet

### Current UI and data pattern

- The shell uses a global header plus a collapsible sidebar layout.
- Several newer module screens still use sample data while the API contracts are being completed.
- The design language is driven by a gold accent palette, light and dark theme support, and consistent touch-target sizing from the shared design system.

---

## Business Process Coverage

The repository documents the end-to-end service process across the following flows:

1. Login and role-based access control
2. Case intake, triage, and case-to-work-order linkage
3. Work Order creation, execution, and related feed actions
4. Service Appointment scheduling and dispatch
5. Field Service queueing, Gantt assignment, and mechanic execution
6. EMR capture and review for field maintenance reporting
7. Task List and Timesheet execution for mechanic work tracking
8. Account, Contact, Asset, Service Area, and Shift master data support
9. Admin Settings and field-level access control
10. Dynamic integration and real-time data strategy for future modules

---

## Design and Requirement Knowledge Base

| Area | Key References |
|------|----------------|
| MVP baseline | `FRD-FunctionalRequirement/FRD_UT_SERVICE_CONSOLE_MVP_1.0_Login_Case_WO/README.md` |
| Design system | `C. Compose_PRD/Design_System.md` |
| Case management | `A. Design_Files/DESIGN-CaseManagement.md`, `B. DesignComponentStitch/Case_Management_System.md` |
| Work orders | `A. Design_Files/DESIGN-WorkOrder.md`, `B. DesignComponentStitch/Work_Order_Management_System.md` |
| Service appointment and field service | `C. Compose_PRD/Field_Service_Module/FRD-SA-Fields.md`, `C. Compose_PRD/Field_Service_Module/FRD-Field-Service-Tracking.md`, `C. Compose_PRD/Field_Service_Module/DESIGN-SA-FieldService-Module.md` |
| Asset management | `C. Compose_PRD/Asset_Management/FRD-Asset-Management.md`, `B. DesignComponentStitch/Asset_Module.md` |
| Service territory | `C. Compose_PRD/Service_Territory/` |
| Shift management | `C. Compose_PRD/Shift_Management/FRD_Shift_Management_Module.md`, `C. Compose_PRD/Shift_Management/FRD_Shift_Module_Panel_Explanation.md` |
| EMR | `C. Compose_PRD/EMR_Module_Management/[EMR-PRD-2607-001]_PRD_EMR_NewModules.md`, `C. Compose_PRD/EMR_Module_Management/[EMR-DSG-2607-001]_Design_EMRTabs.md` |
| Task list and timesheet | `C. Compose_PRD/Tasklist_Timesheet_Module/[TSL-PRD-2607-001]_Task_List_Module.md`, `C. Compose_PRD/Tasklist_Timesheet_Module/[TST-PRD-2607-001]_Timesheet_Module.md` |
| Admin settings and permissions | `C. Compose_PRD/Database_Admin_Module/[ADM-PRD-2607-001]_AdminSettings_FieldAccessControl.md` |
| Data integration roadmap | `C. Compose_PRD/Database_Admin_Module/[DATA-PRD-2607-001]_DataIntegration_DynamicModules.md`, `C. Compose_PRD/Database_Admin_Module/[DATA-PRD-2607-002]_DynamicModule_Service-Console-v2.md` |

---

## Integration Notes

- Current backend architecture remains ASP.NET Core 8 + EF Core + MySQL.
- Several module screens are still backed by local sample data files while the live API contracts are completed.
- The integration PRDs in `C. Compose_PRD/Database_Admin_Module/` describe the next-stage architecture for dynamic modules, row-level security, and field-level visibility control.
- Cross-module data relationships are designed around Account -> Contact -> Asset -> Work Order -> Service Appointment -> EMR / Timesheet.

---

## Current Design Principles

- Gold accent branding, with light and dark mode parity.
- 4px spacing rhythm and consistent 44px minimum touch targets.
- Shared layout patterns for header, sidebar, cards, and detail pages.
- Business data should be represented as reusable module data, not isolated screens.

---

## Recent Documentation Updates

- New admin settings and field-level access control PRD.
- New dynamic module integration PRD for future live data work.
- New EMR PRD and design specification.
- New task list and timesheet design documents.
- Additional service area, shift, and asset design references.

---

## Getting Started

See `DEVELOPMENT_CRM/README.md` for full setup (database, backend, frontend, credentials).

```powershell
# Backend API
cd "DEVELOPMENT_CRM/backend/UT.ServiceConsole.API"
dotnet run

# Frontend dev server
cd "DEVELOPMENT_CRM/frontend"
npm install
npm run dev
```

The local app uses the backend at `http://localhost:5000` and the frontend at `http://localhost:3000`.
