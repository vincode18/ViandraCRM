# UT Service Console — MVP v1.0

Full-stack enterprise service management system.

**Stack:** ASP.NET Core 8 · Entity Framework Core · MySQL · React 18 · Vite · TailwindCSS

---

## Prerequisites

| Tool | Minimum version | Notes |
|------|-----------------|-------|
| .NET SDK | 8.0 | `dotnet --version` |
| Node.js | 18 LTS | `node --version` |
| MySQL Server | 8.0 | Running on `localhost:3306` |
| npm | 9+ | bundled with Node |

---

## 1 — Database Setup

1. Start MySQL and create the database:
   ```sql
   CREATE DATABASE UT_ServiceConsole CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Update connection string in `backend/UT.ServiceConsole.API/appsettings.json`:
   ```json
   "DefaultConnection": "Server=localhost;Port=3306;Database=UT_ServiceConsole;Uid=YOUR_USER;Pwd=YOUR_PASS;CharSet=utf8mb4;"
   ```

---

## 2 — Backend (API)

```powershell
cd backend\UT.ServiceConsole.API

# Restore packages
dotnet restore

# Apply migrations + seed data (auto-runs on first launch in Development)
dotnet ef database update

# Run on http://localhost:5000
dotnet run
```

API base URL: `http://localhost:5000/api`  
Swagger UI:   `http://localhost:5000/swagger`

> The API auto-migrates and seeds the database on first startup in Development mode.

---

## 3 — Frontend (React)

```powershell
cd frontend

# Install dependencies
npm install

# Start dev server on http://localhost:3000
npm run dev
```

Frontend URL: `http://localhost:3000`

---

## 4 — Dummy Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@utconsole.com` | `Admin@2026!` |
| Service Advisor | `john.doe@utconsole.com` | `Service@2026!` |
| Mechanic | `budi.santoso@utconsole.com` | `Mechanic@2026!` |
| Manager | `manager.user@utconsole.com` | `Manager@2026!` |

---

## 5 — Testing with Postman

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@utconsole.com",
  "password": "Admin@2026!"
}
```

Copy the `token` from the response, then set header:
```
Authorization: Bearer <token>
```

### Cases
```
GET    http://localhost:5000/api/cases
GET    http://localhost:5000/api/cases/1
POST   http://localhost:5000/api/cases
PUT    http://localhost:5000/api/cases/1
DELETE http://localhost:5000/api/cases/1   (Admin only)
```

### Work Orders
```
GET    http://localhost:5000/api/workorders
GET    http://localhost:5000/api/workorders/1
GET    http://localhost:5000/api/workorders/by-case/1
POST   http://localhost:5000/api/workorders
PUT    http://localhost:5000/api/workorders/1
DELETE http://localhost:5000/api/workorders/1   (Admin only)
```

---

## 6 — Project Structure

```
DEVELOPMENT_CRM/
├── backend/
│   └── UT.ServiceConsole.API/
│       ├── Configurations/     JwtSettings.cs
│       ├── Controllers/        AuthController, CasesController, WorkOrdersController
│       ├── Data/               ApplicationDbContext, DesignTimeDbContextFactory
│       ├── Middleware/         JwtMiddleware
│       ├── Models/
│       │   ├── DTOs/           Auth/, Cases/, WorkOrders/, Common/
│       │   └── Entities/       14 entity classes
│       ├── Services/           AuthService, CaseService, WorkOrderService
│       │   └── Interfaces/     IAuthService, ICaseService, IWorkOrderService
│       ├── Utilities/          PasswordHasher, JwtTokenGenerator
│       ├── appsettings.json
│       └── Program.cs
└── frontend/
    ├── src/
    │   ├── components/         BookAppointmentModal, SAStatusBadge, SearchableSelect, …
    │   │   └── layout/         AppLayout, GlobalHeader, Sidebar
    │   ├── contexts/           AuthContext, ThemeContext (light/dark)
    │   ├── pages/              LoginPage, ConsolePage, CasesPage, CaseDetailPage,
    │   │                       WorkOrdersPage, WorkOrderDetailPage,
    │   │                       ServiceAppointmentsPage, ServiceAppointmentDetailPage,
    │   │                       FieldServicePage
    │   ├── utils/              api.js (axios instance), saData.js (SA schema + mock data)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 7 — Frontend Modules (Module Combobox)

The global header combobox (next to **UT Service Console**) switches between modules. Each route is theme-aware (light/dark via `ThemeContext`).

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/dashboard` | KPI overview console |
| Cases | `/cases`, `/cases/:id` | Case management |
| Work Orders | `/workorders`, `/workorders/:id` | Work order management (Feed tab → **Book Appointment**) |
| **Service Appointment (SA)** | `/serviceappointments`, `/serviceappointments/:id` | SA list view (filter chips) + 8-section detail view |
| **Field Service** | `/fieldservice` | Three-panel dispatch console: SA Queue · Gantt Chart (drag-and-drop assignment) · SA side sheet, with Gantt/Map toggle |

### Service Appointment & Field Service — Implementation Notes

Built from `C. UI_Enhancement/Field_Service_Module/`:
- `FRD-SA-Fields.md` — full 36-field `ServiceAppointment` schema (implemented in `src/utils/saData.js`)
- `FRD-Field-Service-Tracking.md` — appointment lifecycle, Gantt assignment, status transitions, SLA overdue
- `DESIGN-SA-FieldService-Module.md` — UI spec (light/dark tokens, status badges, three-panel layout)

Key behaviours:
- **Book Appointment** modal opens from the Work Order **Feed** tab and the Details actions; pre-fills from the WO, validates per FRD §5.4 (Scheduled End > Start, positive Duration, offsite confirmation), and creates an SA with `Status = Scheduled` + a Feed entry.
- **Gantt drag-and-drop** assigns an unassigned SA to a resource row, computes `SchedStart`/`SchedEnd`, sets `Schedule Mode = Drag and Drop`, and warns on overlapping conflicts.
- **SA detail** renders the 8 collapsible sections (Header, Scheduling, Location, Stakeholders, Actuals, Description & Notes, Bundle [conditional], System Info [collapsed]).
- **Status badges** follow the FRD §8.3 light/dark colour pairs (`SAStatusBadge`).

> Note: No SA backend endpoints exist yet — these modules run on mock sample data in `src/utils/saData.js`, ready to be swapped for live `/api/serviceappointments` calls.

---

## 8 — Security Notes

- Passwords are SHA-256 hashed with a random 128-bit salt (constant-time comparison)
- JWT expiration: 8 hours (configurable via `JwtSettings.ExpirationMinutes`)
- Account lockout: 5 failed attempts → 30-minute lockout
- Passwords are **never** logged at any level
- CORS restricted to `localhost:3000` and `localhost:5173`
- Rate limiting: 10 login requests/min per IP
- All protected endpoints require `Authorization: Bearer <token>`

---

## 9 — Running Both Together (Quick Start)

Open two terminals:

**Terminal 1 — Backend:**
```powershell
cd "d:\02_Learning\Viandra Project CRM\DEVELOPMENT_CRM\backend\UT.ServiceConsole.API"
dotnet run
```

**Terminal 2 — Frontend:**
```powershell
cd "d:\02_Learning\Viandra Project CRM\DEVELOPMENT_CRM\frontend"
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## 10 — Supabase Integration (Dynamic Data)

The application now supports **Supabase PostgreSQL backend** for dynamic data with graceful fallback to mock data.

### Quick Setup

1. **Add credentials to `frontend/.env.local`:**
   ```env
   VITE_SUPABASE_URL=https://bfaxkqzkccwryibyronw.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYXhrcXprY2N3cnlpYnlyb253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDM2NzEsImV4cCI6MjA5NTYxOTY3MX0.YkdG6YWGOfp0juC8vldK-7UE3WLRLzp64opWvogA8-M
   ```

2. **Run database migration:**
   - Go to https://supabase.com/dashboard
   - Select project: `bfaxkqzkccwryibyronw`
   - Go to **SQL Editor**
   - Copy contents of `docs/SUPABASE_MIGRATION.sql`
   - Paste and run

3. **Create storage bucket:**
   - Go to **Storage** in Supabase Dashboard
   - Create bucket named `emr-photos`
   - Set to Public

4. **Test:**
   ```bash
   npm run dev
   ```
   - Go to EMR page
   - Should load data from Supabase (no "(Mock Data)" badge)

### Documentation

- **YOUR_PROJECT_SETUP.md** — Quick start with your credentials
- **SETUP_GUIDE.md** — Detailed step-by-step setup
- **SUPABASE_MIGRATION.sql** — Database schema (run in SQL Editor)
- **DEPLOYMENT_CHECKLIST.md** — Pre-deployment verification
- **QUICK_REFERENCE.md** — API reference

### Features

✅ **Graceful Fallback** — Works with or without Supabase  
✅ **Real-time Updates** — Live subscriptions to data changes  
✅ **File Upload** — EMILA photos to Supabase Storage  
✅ **Row-Level Security** — Organization isolation via RLS  
✅ **Bulk Operations** — Bulk approve timesheets  
✅ **Error Handling** — Automatic fallback to mock data  

### Architecture

```
Frontend (React)
    ↓
Service Layer (emrService, timesheetService)
    ↓
Supabase Client (supabaseClient.js)
    ↓
Supabase Backend (PostgreSQL + RLS)
    ↓
Fallback: Mock Data (if unavailable)
```

### Tables Created

- `emr` — Equipment Maintenance Reports
- `emr_additional_groups` — EMR document groups
- `emila_photos` — EMILA structured photos
- `emr_history` — EMR audit trail
- `timesheet` — Time sheet records
- `timesheet_entry` — Individual entries
- `task_list_item` — Work order tasks
- `work_order` — Work orders

All with RLS policies, indexes, and real-time subscriptions enabled.
