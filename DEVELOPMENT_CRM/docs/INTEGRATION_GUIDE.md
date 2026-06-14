# Supabase Integration Guide
## UT Service Console — Backend Setup & Configuration

### Quick Start

#### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy Project URL and Anon Key from Settings > API

#### 2. Configure Environment Variables
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. Create Database Tables
Run the SQL scripts in `SUPABASE_SCHEMA.md` in Supabase SQL Editor:
- Create all tables
- Enable RLS
- Create indexes

#### 4. Install Dependencies
```bash
npm install @supabase/supabase-js
```

#### 5. Test Connection
The app will automatically:
- Try to connect to Supabase
- Fall back to mock data if connection fails
- Show "(Mock Data)" indicator in UI

---

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  React Components (Pages)                            │
│  - EMRListPage, EMRDetailPage                       │
│  - TimesheetDetailPage, TimesheetApprovalPage       │
│  - WorkOrderDetailPage (Task List tab)              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Custom Hooks (useSupabaseQuery)                    │
│  - Manages async data fetching                      │
│  - Loading/error states                             │
│  - Real-time subscriptions                          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Service Layer (emrService, timesheetService)       │
│  - Business logic                                   │
│  - Fallback to mock data                            │
│  - Error handling                                   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Supabase Client (supabaseClient.js)                │
│  - Query helpers                                    │
│  - Real-time subscriptions                          │
│  - Storage operations                               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Supabase Backend                                   │
│  - PostgreSQL Database                              │
│  - Row-Level Security (RLS)                         │
│  - Real-time Subscriptions                          │
│  - Storage (for EMILA photos)                       │
│  - Edge Functions (SAP integration)                 │
└─────────────────────────────────────────────────────┘
```

---

### Data Flow Example: Fetching EMRs

```javascript
// 1. Component calls hook
const { data: emrs, loading, error, isMock } = useSupabaseQuery(
  () => fetchEMRs({}, { orderBy: 'created_at' }),
  []
);

// 2. Hook calls service
// → emrService.fetchEMRs()

// 3. Service tries Supabase
// → supabaseClient.queryTable('emr', filters, options)

// 4. If Supabase fails, fallback to mock
// → emrData.EMRS (from utils/emrData.js)

// 5. Component renders with data
// Shows "(Mock Data)" indicator if isMock = true
```

---

### Service Layer Pattern

All services follow this pattern:

```javascript
export async function fetchData(filters = {}) {
  try {
    // Try Supabase
    const result = await queryTable('table_name', filters);
    
    if (!result.success) {
      // Fallback to mock
      const mockData = MOCK_DATA.filter(...);
      return { success: true, data: mockData, isMock: true };
    }
    
    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    // Fallback to mock on error
    return { success: true, data: MOCK_DATA, isMock: true };
  }
}
```

**Benefits:**
- ✅ Works offline with mock data
- ✅ Graceful degradation
- ✅ No breaking changes during migration
- ✅ Easy testing

---

### Real-time Updates

Subscribe to table changes:

```javascript
import { useSupabaseRealtime } from '../hooks/useSupabaseQuery';
import { subscribeToEMRChanges } from '../services/emrService';

function EMRDetailPage() {
  const [emr, setEMR] = useState(null);
  
  // Subscribe to changes
  useSupabaseRealtime(
    () => subscribeToEMRChanges(emrId, handleUpdate),
    [emrId]
  );
  
  const handleUpdate = (payload) => {
    if (payload.eventType === 'UPDATE') {
      setEMR(payload.new);
    }
  };
}
```

---

### Mutations (Create/Update/Delete)

Use `useSupabaseMutation` hook:

```javascript
import { useSupabaseMutation } from '../hooks/useSupabaseQuery';
import { updateEMR } from '../services/emrService';

function EMRDetailPage() {
  const { mutate: updateEMRStatus, loading } = useSupabaseMutation(
    (id, status) => updateEMR(id, { status }),
    {
      onSuccess: (data) => {
        console.log('EMR updated:', data);
      },
      onError: (error) => {
        console.error('Update failed:', error);
      }
    }
  );
  
  const handleApprove = async () => {
    await updateEMRStatus(emrId, 'Approved');
  };
}
```

---

### Error Handling

The app gracefully handles errors:

1. **Network Error** → Uses mock data, shows "(Mock Data)" badge
2. **Supabase Error** → Logs to console, falls back to mock
3. **Validation Error** → Shows user-friendly error message
4. **Permission Error** → RLS policy blocks unauthorized access

Example error handling in service:

```javascript
export async function fetchEMRs(filters = {}) {
  try {
    const result = await queryTable('emr', filters);
    if (!result.success) {
      console.warn('Supabase fetch failed:', result.error);
      return { success: true, data: EMRS, isMock: true };
    }
    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('EMR fetch error:', error);
    return { success: true, data: EMRS, isMock: true };
  }
}
```

---

### File Upload (EMILA Photos)

Upload photos to Supabase Storage:

```javascript
import { uploadEMILAPhoto } from '../services/emrService';

async function handlePhotoUpload(emrId, category, file) {
  const result = await uploadEMILAPhoto(emrId, category, file, {
    description: 'Equipment damage photo',
    orderNumber: 1,
    groupType: 'FSL'
  });
  
  if (result.success) {
    console.log('Photo uploaded:', result.data.file_url);
  }
}
```

Storage path structure:
```
emr-photos/
  ├── EMR-001/
  │   ├── E/
  │   │   ├── 1717862400000-damage.jpg
  │   │   └── 1717862500000-closeup.jpg
  │   ├── M/
  │   │   └── 1717862600000-maintenance.jpg
  │   └── I/
  │       └── 1717862700000-inspection.jpg
```

---

### Testing with Mock Data

All pages work with mock data by default:

1. **No Supabase configured?** → Uses mock data automatically
2. **Supabase down?** → Falls back to mock data
3. **Offline?** → Works with mock data

To force mock data for testing:

```javascript
// In service file, temporarily comment out Supabase call:
export async function fetchEMRs(filters = {}) {
  // const result = await queryTable('emr', filters);
  // if (result.success) return { success: true, data: result.data };
  
  // Always use mock for testing
  return { success: true, data: EMRS, isMock: true };
}
```

---

### Performance Optimization

#### 1. Pagination
```javascript
const { data: emrs } = useSupabaseQuery(
  () => fetchEMRs({}, { 
    limit: 20, 
    offset: 0,
    orderBy: 'created_at'
  }),
  []
);
```

#### 2. Filtering
```javascript
const { data: pending } = useSupabaseQuery(
  () => fetchTimesheets({ status: 'Submitted' }),
  []
);
```

#### 3. Selective Columns
```javascript
const result = await queryTable('emr', {}, {
  select: 'id, subject, status, created_at' // Only fetch needed columns
});
```

#### 4. Caching
Real-time subscriptions automatically keep data in sync without refetching.

---

### Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created with RLS
- [ ] Indexes created for performance
- [ ] Storage bucket configured
- [ ] Edge Functions deployed (SAP integration)
- [ ] Environment variables set in production
- [ ] RLS policies tested
- [ ] Real-time subscriptions tested
- [ ] Mock data fallback verified
- [ ] Error handling tested
- [ ] File uploads tested
- [ ] Performance tested with production data

---

### Troubleshooting

**Q: Getting "Supabase credentials not configured" warning?**
A: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`

**Q: Data not updating in real-time?**
A: Check if real-time is enabled on the table in Supabase dashboard

**Q: File uploads failing?**
A: Ensure storage bucket `emr-photos` exists and RLS allows uploads

**Q: RLS blocking all queries?**
A: Check RLS policies — they may be too restrictive. Test with `auth.jwt() ->> 'role' = 'admin'`

**Q: Performance slow with large datasets?**
A: Add pagination with `limit` and `offset`, or use filters to reduce result set
