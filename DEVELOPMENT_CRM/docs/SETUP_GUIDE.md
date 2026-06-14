# Supabase Setup Guide
## UT Service Console — Your Project Configuration

---

## ✅ Your Supabase Project

**Project URL:** `https://bfaxkqzkccwryibyronw.supabase.co`

**Status:** ✅ Ready to configure

---

## 📋 Step-by-Step Setup

### Step 1: Configure Environment Variables

1. Open `frontend/.env.local` (create if doesn't exist)
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://bfaxkqzkccwryibyronw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYXhrcXprY2N3cnlpYnlyb253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDM2NzEsImV4cCI6MjA5NTYxOTY3MX0.YkdG6YWGOfp0juC8vldK-7UE3WLRLzp64opWvogA8-M
```

3. Save the file (it's gitignored, so it won't be committed)

---

### Step 2: Create Database Tables

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project `bfaxkqzkccwryibyronw`
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `docs/SUPABASE_MIGRATION.sql`
6. Paste into the SQL Editor
7. Click **Run**
8. Wait for completion (should see "✓ Success")

**What this does:**
- ✅ Creates 8 tables (emr, timesheet, task_list_item, etc.)
- ✅ Creates indexes for performance
- ✅ Enables Row-Level Security (RLS)
- ✅ Creates RLS policies for organization isolation
- ✅ Enables real-time subscriptions
- ✅ Inserts sample test data

---

### Step 3: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **Create a new bucket**
3. Name: `emr-photos`
4. Set to **Public**
5. Click **Create bucket**

**This bucket stores:**
- EMILA photos (Equipment, Maintenance, Inspection, Labor, Assembly)
- Organized by EMR ID and category

---

### Step 4: Enable Real-time (Already Done)

The migration script already enables real-time for:
- `emr` — Live EMR status updates
- `timesheet` — Live approval queue updates
- `task_list_item` — Live task progress

No additional setup needed!

---

### Step 5: Test the Connection

1. Start the dev server:
```bash
npm run dev
```

2. Open the app in browser
3. Navigate to **EMR** page
4. You should see:
   - ✅ No "(Mock Data)" badge = Connected to Supabase
   - ✅ Data loading from database
   - ✅ Real-time updates working

---

## 🔐 Security Notes

### Organization Isolation (RLS)

All RLS policies check `organization_id`. This means:
- Users can only see data from their organization
- The `organization_id` comes from their JWT token
- You need to set this in Supabase Auth

**To set organization_id in JWT:**

1. Go to **Authentication > Policies** in Supabase
2. Create a custom claim for `org_id`
3. Set it when creating users

Example:
```javascript
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      org_id: 'org-123'
    }
  }
});
```

### API Key Security

Your anon key is safe to use in the frontend because:
- ✅ RLS policies enforce organization isolation
- ✅ Users can only access their own data
- ✅ Admin operations require admin role in JWT

**Never share your service role key!** (Keep it secret on backend only)

---

## 🧪 Testing

### Test with Sample Data

The migration script inserts sample data:
- EMR-TEST-001 (Equipment Maintenance Report)
- TS-TEST-001 (Timesheet)
- TASK-TEST-001 (Task List Item)

To view:
1. Go to **EMR** page
2. Should see test records
3. Try filtering, searching, updating

### Test Real-time Updates

1. Open EMR detail page
2. Open same EMR in another browser tab
3. Change status in one tab
4. Other tab updates automatically (no page refresh needed)

### Test RLS Policies

1. Create two users with different `org_id` values
2. User A should only see data from org-A
3. User B should only see data from org-B
4. They cannot see each other's data

---

## 📊 Database Structure

### Tables Created

| Table | Purpose | Rows |
|---|---|---|
| `emr` | Equipment Maintenance Reports | 1+ |
| `emr_additional_groups` | EMR document groups | 0+ |
| `emila_photos` | EMILA structured photos | 0+ |
| `emr_history` | EMR audit trail | 0+ |
| `timesheet` | Time sheet records | 1+ |
| `timesheet_entry` | Individual timesheet entries | 0+ |
| `task_list_item` | Work order task items | 1+ |
| `work_order` | Work orders | 0+ |

### Indexes Created

- `idx_emr_status` — Fast status filtering
- `idx_emr_created_at` — Fast sorting by date
- `idx_timesheet_status` — Fast approval queue filtering
- `idx_task_list_work_order` — Fast task lookup by work order
- And 8 more...

### Real-time Enabled

- `emr` — Subscribe to status changes
- `timesheet` — Subscribe to approval updates
- `task_list_item` — Subscribe to task progress

---

## 🚀 Next Steps

### Phase 1: Verify Setup (Now)
- [ ] Add credentials to `.env.local`
- [ ] Run migration SQL
- [ ] Create `emr-photos` bucket
- [ ] Test connection in app
- [ ] Verify sample data appears

### Phase 2: User Authentication
- [ ] Set up Supabase Auth
- [ ] Create users with org_id
- [ ] Test RLS policies
- [ ] Implement login page

### Phase 3: Production Data
- [ ] Migrate real data from legacy system
- [ ] Verify data integrity
- [ ] Test performance with large datasets
- [ ] Set up backups

### Phase 4: Advanced Features
- [ ] SAP integration (Edge Functions)
- [ ] Email notifications
- [ ] Audit logging
- [ ] Field-level permissions

---

## 🐛 Troubleshooting

### "Supabase credentials not configured"

**Problem:** App shows "(Mock Data)" badge

**Solution:**
1. Check `.env.local` exists
2. Verify `VITE_SUPABASE_URL` is correct
3. Verify `VITE_SUPABASE_ANON_KEY` is correct
4. Restart dev server: `npm run dev`

### "Permission denied" errors

**Problem:** RLS policies blocking queries

**Solution:**
1. Check user has correct `org_id` in JWT
2. Check `organization_id` in database matches JWT
3. Verify RLS policies were created (check SQL Editor)
4. Try with sample data first

### "Table does not exist"

**Problem:** Migration didn't run successfully

**Solution:**
1. Go to SQL Editor
2. Run migration again
3. Check for error messages
4. Verify all SQL executed without errors

### "Real-time not updating"

**Problem:** Changes don't appear in other tabs

**Solution:**
1. Check real-time is enabled (migration does this)
2. Check WebSocket connection in DevTools > Network
3. Verify subscription code in service layer
4. Check browser console for errors

### "File upload failing"

**Problem:** EMILA photo upload fails

**Solution:**
1. Check `emr-photos` bucket exists
2. Verify bucket is Public
3. Check RLS policies on storage
4. Verify file size < 50MB

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Project URL:** https://bfaxkqzkccwryibyronw.supabase.co

---

## ✅ Checklist

- [ ] `.env.local` configured with credentials
- [ ] Migration SQL executed successfully
- [ ] `emr-photos` storage bucket created
- [ ] Sample data visible in app
- [ ] Real-time updates working
- [ ] RLS policies tested
- [ ] No "(Mock Data)" badge in UI
- [ ] Ready for production data migration

---

**Setup Date:** June 8, 2026
**Status:** ✅ Ready to Deploy
**Next:** Run migration SQL in Supabase Dashboard
