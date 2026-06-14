# Quick Reference — UT Service Console
## Supabase Integration & API Usage

---

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependency
npm install @supabase/supabase-js

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Start dev server
npm run dev

# 4. App works with mock data by default
# No Supabase? No problem! Uses fallback mock data.
```

---

## 📦 Service Layer API

### EMR Service
```javascript
import { 
  fetchEMRs,           // Get all EMRs with filters
  fetchEMRById,        // Get single EMR
  createEMR,           // Create new EMR
  updateEMR,           // Update EMR
  deleteEMR,           // Delete EMR
  uploadEMILAPhoto,    // Upload photo to storage
  subscribeToEMRChanges // Real-time updates
} from '../services/emrService';

// Usage
const { data, error } = await fetchEMRs({ status: 'Open' });
const { data, error } = await updateEMR('EMR-001', { status: 'Approved' });
```

### Timesheet Service
```javascript
import {
  fetchTimesheets,              // Get all timesheets
  fetchTimesheetById,           // Get single timesheet
  fetchTimesheetEntries,        // Get entries for timesheet
  fetchPendingApprovals,        // Get approval queue
  approveTimesheet,             // Approve timesheet
  rejectTimesheet,              // Reject timesheet
  bulkApproveTimesheets,        // Bulk approve
  postTimesheetToSAP            // Post to SAP
} from '../services/timesheetService';

// Usage
const { data } = await fetchPendingApprovals();
const { data } = await approveTimesheet('TS-001', userId);
```

### Work Order Service
```javascript
import {
  fetchTaskListItems,           // Get task items for WO
  createTaskListItem,           // Create task
  updateTaskListItem,           // Update task
  updateTaskStatus              // Update task status
} from '../services/workOrderService';

// Usage
const { data } = await fetchTaskListItems('WO-001');
const { data } = await updateTaskStatus('TASK-001', 'Completed');
```

---

## 🎣 Custom Hooks

### useSupabaseQuery
```javascript
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

// Fetch data with loading/error states
const { data, loading, error, isMock, refetch } = useSupabaseQuery(
  () => fetchEMRs({}),
  [] // dependencies
);

// Render
{loading && <Spinner />}
{error && <Error message={error} />}
{isMock && <Badge>Mock Data</Badge>}
{data && data.map(item => <Item key={item.id} {...item} />)}
```

### useSupabaseMutation
```javascript
import { useSupabaseMutation } from '../hooks/useSupabaseQuery';

// Mutation with loading/error states
const { mutate, loading, error, data } = useSupabaseMutation(
  (id, status) => updateEMR(id, { status }),
  {
    onSuccess: (data) => console.log('Success!', data),
    onError: (error) => console.error('Failed!', error)
  }
);

// Call mutation
await mutate('EMR-001', 'Approved');
```

### useSupabaseRealtime
```javascript
import { useSupabaseRealtime } from '../hooks/useSupabaseQuery';

// Subscribe to real-time changes
useSupabaseRealtime(
  () => subscribeToEMRChanges(emrId, handleUpdate),
  [emrId] // dependencies
);

const handleUpdate = (payload) => {
  console.log('Updated:', payload.new);
};
```

---

## 📊 Data Structures

### EMR
```javascript
{
  id: 'EMR-001',
  type: 'U',                    // 'U' or 'S'
  status: 'Open',
  subject: 'Equipment damage',
  owner: 'John Doe',
  account: 'ACME Corp',
  asset: 'Unit-123',
  work_order: 'WO-001',
  created_at: '2026-06-08T...',
  updated_at: '2026-06-08T...'
}
```

### Timesheet
```javascript
{
  id: 'TS-001',
  work_order_id: 'WO-001',
  service_resource: 'John Doe',
  status: 'Submitted',          // Draft, Submitted, Approved, Rejected
  total_duration: 8,
  entry_count: 2,
  submitted_at: '2026-06-08T...',
  approved_at: null,
  posted_to_sap: false
}
```

### Task List Item
```javascript
{
  id: 'TASK-001',
  work_order_id: 'WO-001',
  operation_number: '0010',
  description: 'Inspect unit',
  duration: 2,
  status: 'In Progress',        // Not Started, In Progress, Completed
  is_sap_override: false,
  start_time: '2026-06-08T...',
  complete_time: null
}
```

---

## 🔌 Supabase Client API

```javascript
import { 
  supabase,
  queryTable,
  getRecord,
  insertRecord,
  updateRecord,
  deleteRecord,
  subscribeToTable,
  searchTable
} from '../utils/supabaseClient';

// Query with filters
const { data, error } = await queryTable('emr', 
  { status: 'Open' },
  { orderBy: 'created_at', limit: 20 }
);

// Get single record
const { data, error } = await getRecord('emr', 'EMR-001', 'id');

// Insert
const { data, error } = await insertRecord('emr', {
  id: 'EMR-002',
  type: 'U',
  status: 'Open'
});

// Update
const { data, error } = await updateRecord('emr', 'EMR-001', 
  { status: 'Approved' },
  'id'
);

// Delete
const { error } = await deleteRecord('emr', 'EMR-001', 'id');

// Search
const { data, error } = await searchTable('emr', 'subject', 'damage');

// Real-time subscribe
const unsubscribe = subscribeToTable('emr', (payload) => {
  console.log('Change:', payload);
});

// Unsubscribe
unsubscribe();
```

---

## 🎯 Common Patterns

### Fetch & Display List
```javascript
function EMRList() {
  const { data: emrs = [], loading } = useSupabaseQuery(
    () => fetchEMRs({}, { orderBy: 'created_at' }),
    []
  );
  
  return (
    <div>
      {loading ? <Spinner /> : (
        <table>
          {emrs.map(emr => (
            <tr key={emr.id}>
              <td>{emr.id}</td>
              <td>{emr.subject}</td>
              <td>{emr.status}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
```

### Update with Mutation
```javascript
function EMRApproveButton({ emrId }) {
  const { mutate: approve, loading } = useSupabaseMutation(
    (id) => updateEMR(id, { status: 'Approved' })
  );
  
  return (
    <button onClick={() => approve(emrId)} disabled={loading}>
      {loading ? 'Approving...' : 'Approve'}
    </button>
  );
}
```

### Real-time Sync
```javascript
function EMRDetail({ emrId }) {
  const [emr, setEMR] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    fetchEMRById(emrId).then(r => setEMR(r.data));
  }, [emrId]);
  
  // Subscribe to changes
  useSupabaseRealtime(
    () => subscribeToEMRChanges(emrId, (payload) => {
      setEMR(payload.new);
    }),
    [emrId]
  );
  
  return <EMRForm emr={emr} />;
}
```

### Bulk Operations
```javascript
function ApproveAllButton({ timesheetIds }) {
  const { mutate: approveAll, loading } = useSupabaseMutation(
    (ids) => bulkApproveTimesheets(ids, userId)
  );
  
  return (
    <button onClick={() => approveAll(timesheetIds)} disabled={loading}>
      Approve All ({timesheetIds.length})
    </button>
  );
}
```

---

## ⚙️ Environment Variables

```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get from Supabase dashboard:
1. Go to Project Settings > API
2. Copy Project URL
3. Copy anon/public key

---

## 🔍 Debugging

### Check if using mock data
```javascript
const { data, isMock } = useSupabaseQuery(...);
console.log(isMock ? 'Using mock data' : 'Using Supabase');
```

### Check errors
```javascript
const { error } = useSupabaseQuery(...);
if (error) console.error('Query error:', error);
```

### Check real-time connection
```javascript
// Open DevTools > Network
// Look for WebSocket connections to Supabase
// Should see 'realtime-v1' connection
```

### Test with mock data only
```javascript
// In service file, comment out Supabase call:
// const result = await queryTable(...);
// if (result.success) return { success: true, data: result.data };

// Always return mock:
return { success: true, data: MOCK_DATA, isMock: true };
```

---

## 📋 Checklist: Adding New Feature

- [ ] Create service function in `services/*.js`
- [ ] Add Supabase query with mock fallback
- [ ] Create component/page in `pages/`
- [ ] Use `useSupabaseQuery` or `useSupabaseMutation` hook
- [ ] Add route to `App.jsx`
- [ ] Add navigation to `Sidebar.jsx`
- [ ] Test with mock data
- [ ] Test with Supabase (if configured)
- [ ] Check error handling
- [ ] Verify build passes

---

## 🚨 Common Errors

| Error | Cause | Fix |
|---|---|---|
| "Supabase credentials not configured" | Missing env vars | Add to `.env.local` |
| "Cannot read property 'map' of null" | Data is null | Check `data || []` |
| "Real-time not updating" | RLS blocking | Check RLS policies |
| "File upload failed" | Storage bucket missing | Create `emr-photos` bucket |
| "Permission denied" | RLS policy too strict | Check RLS policies |

---

## 📚 File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── EMRListPage.jsx
│   │   ├── EMRDetailPage.jsx
│   │   ├── TimesheetDetailPage.jsx
│   │   ├── TimesheetApprovalPage.jsx
│   │   └── ...
│   ├── services/
│   │   ├── emrService.js
│   │   ├── timesheetService.js
│   │   └── workOrderService.js
│   ├── hooks/
│   │   └── useSupabaseQuery.js
│   ├── utils/
│   │   ├── supabaseClient.js
│   │   ├── emrData.js
│   │   ├── taskData.js
│   │   └── adminData.js
│   └── App.jsx
├── .env.example
├── .env.local (create this)
└── package.json
```

---

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Last Updated:** June 8, 2026
**Status:** ✅ Production Ready
