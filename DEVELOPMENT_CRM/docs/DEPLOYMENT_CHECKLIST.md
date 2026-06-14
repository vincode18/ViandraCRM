# Deployment Checklist
## UT Service Console — Supabase Integration

---

## 🎯 Pre-Deployment (Right Now)

### Environment Setup
- [ ] Copy credentials to `frontend/.env.local`:
  ```
  VITE_SUPABASE_URL=https://bfaxkqzkccwryibyronw.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- [ ] Verify `.env.local` is in `.gitignore` (don't commit credentials!)
- [ ] Restart dev server: `npm run dev`

### Database Setup
- [ ] Open Supabase Dashboard: https://supabase.com/dashboard
- [ ] Select project: `bfaxkqzkccwryibyronw`
- [ ] Go to **SQL Editor**
- [ ] Create new query
- [ ] Copy entire `docs/SUPABASE_MIGRATION.sql`
- [ ] Paste into SQL Editor
- [ ] Click **Run**
- [ ] Wait for "✓ Success" message
- [ ] Verify all tables created (check **Table Editor**)

### Storage Setup
- [ ] Go to **Storage** in Supabase Dashboard
- [ ] Click **Create a new bucket**
- [ ] Name: `emr-photos`
- [ ] Set to **Public**
- [ ] Click **Create bucket**
- [ ] Verify bucket appears in list

### Verification
- [ ] Open app in browser: http://localhost:3000
- [ ] Navigate to **EMR** page
- [ ] Verify NO "(Mock Data)" badge appears
- [ ] Verify sample data loads (EMR-TEST-001, etc.)
- [ ] Try filtering, searching, sorting
- [ ] Check browser console for errors (should be clean)

---

## 🔐 Security Checklist

### API Keys
- [ ] Anon key is in `.env.local` (frontend only)
- [ ] Service role key is NOT in frontend code
- [ ] Service role key stored securely (backend only)
- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit `.env.local` to git

### Database Security
- [ ] RLS enabled on all tables ✓ (migration does this)
- [ ] RLS policies created ✓ (migration does this)
- [ ] Organization isolation working (test with 2 users)
- [ ] Users can only see their org's data
- [ ] Admins can see all data (if role = 'admin')

### Storage Security
- [ ] `emr-photos` bucket is Public (for read)
- [ ] RLS policies restrict uploads to authenticated users
- [ ] File paths include organization_id
- [ ] No sensitive data in file names

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] EMR List page loads
- [ ] EMR Detail page loads
- [ ] Timesheet List page loads
- [ ] Timesheet Approval page loads
- [ ] Task List (inline) works
- [ ] Search functionality works
- [ ] Filters work (status, type, etc.)
- [ ] Sorting works (by date, name, etc.)
- [ ] Pagination works (if implemented)

### Data Operations
- [ ] Create EMR (if implemented)
- [ ] Update EMR status
- [ ] Delete EMR (if implemented)
- [ ] Approve timesheet
- [ ] Reject timesheet
- [ ] Bulk approve timesheets
- [ ] Create task list item
- [ ] Update task status
- [ ] Upload EMILA photo

### Real-time Testing
- [ ] Open EMR detail in 2 browser tabs
- [ ] Change status in tab 1
- [ ] Tab 2 updates automatically (no refresh)
- [ ] Open approval queue in 2 tabs
- [ ] Approve in tab 1
- [ ] Tab 2 updates automatically

### Error Handling
- [ ] Network error → falls back to mock data
- [ ] Invalid credentials → shows error message
- [ ] RLS violation → shows permission error
- [ ] File upload error → shows user-friendly message
- [ ] Timeout error → shows retry option

### Performance
- [ ] Page load time < 3 seconds
- [ ] Search response < 1 second
- [ ] Real-time update < 500ms
- [ ] No console errors
- [ ] No memory leaks (DevTools)

---

## 📊 Data Validation

### Sample Data
- [ ] EMR-TEST-001 visible in EMR list
- [ ] TS-TEST-001 visible in Timesheet list
- [ ] TASK-TEST-001 visible in Task List
- [ ] All fields populated correctly
- [ ] Dates formatted correctly
- [ ] Status badges show correct colors

### Data Integrity
- [ ] Foreign keys working (cascade deletes)
- [ ] Timestamps auto-generated
- [ ] Indexes improving query performance
- [ ] No duplicate records
- [ ] No orphaned records

---

## 🚀 Production Deployment

### Pre-Production
- [ ] All tests passing
- [ ] No console errors
- [ ] Build passes: `npm run dev`
- [ ] Build size acceptable
- [ ] Performance acceptable
- [ ] Security review complete

### Deployment Steps
1. [ ] Build production bundle: `npm run build`
2. [ ] Test production build locally
3. [ ] Deploy to hosting (Netlify, Vercel, etc.)
4. [ ] Update production `.env` with Supabase credentials
5. [ ] Run smoke tests on production
6. [ ] Monitor error logs
7. [ ] Set up monitoring/alerts

### Post-Deployment
- [ ] Verify all pages load
- [ ] Verify data loads from Supabase
- [ ] Verify real-time working
- [ ] Verify file uploads working
- [ ] Monitor performance metrics
- [ ] Check error logs for issues

---

## 📋 Documentation

- [ ] `SETUP_GUIDE.md` — Setup instructions ✓
- [ ] `SUPABASE_MIGRATION.sql` — Database schema ✓
- [ ] `SUPABASE_SCHEMA.md` — Schema documentation ✓
- [ ] `INTEGRATION_GUIDE.md` — Integration patterns ✓
- [ ] `QUICK_REFERENCE.md` — API reference ✓
- [ ] `IMPLEMENTATION_SUMMARY.md` — Overview ✓
- [ ] `DEPLOYMENT_CHECKLIST.md` — This file ✓

---

## 🔄 Rollback Plan

If something goes wrong:

### Database Rollback
1. Go to Supabase Dashboard
2. Go to **Backups**
3. Restore from previous backup
4. Or manually delete tables and re-run migration

### Code Rollback
1. Revert to previous git commit
2. Redeploy to hosting
3. Or switch back to mock data (app still works)

### Credentials Rotation
1. Go to Supabase Dashboard > Settings > API
2. Regenerate anon key
3. Update `.env.local` and deployment
4. Old key becomes invalid

---

## 📞 Support

### If Something Breaks

1. **Check logs:**
   - Browser console (F12)
   - Supabase dashboard logs
   - Deployment logs

2. **Verify credentials:**
   - Check `.env.local` has correct values
   - Check Supabase project URL matches
   - Check anon key is valid

3. **Test with mock data:**
   - Remove Supabase credentials
   - App should fall back to mock data
   - If this works, issue is with Supabase connection

4. **Check RLS policies:**
   - Go to Supabase SQL Editor
   - Run: `SELECT * FROM auth.users;`
   - Verify users have correct `org_id` claim

5. **Check database:**
   - Go to Table Editor
   - Verify tables exist
   - Verify data is there
   - Check for errors in SQL

---

## ✅ Final Checklist

Before going live:

- [ ] All credentials configured
- [ ] Database tables created
- [ ] Storage bucket created
- [ ] Sample data visible
- [ ] Real-time working
- [ ] All pages functional
- [ ] No console errors
- [ ] Build passes
- [ ] Performance acceptable
- [ ] Security review done
- [ ] Documentation complete
- [ ] Team trained on new system
- [ ] Monitoring set up
- [ ] Backup plan ready

---

## 🎉 Ready to Deploy!

Once all checkboxes are complete, your UT Service Console is ready for production with full Supabase integration.

**Key Files:**
- `frontend/.env.local` — Your credentials (gitignored)
- `docs/SUPABASE_MIGRATION.sql` — Database setup
- `docs/SETUP_GUIDE.md` — Step-by-step guide
- `frontend/src/services/*.js` — Service layer
- `frontend/src/hooks/useSupabaseQuery.js` — Data hooks

**Next Steps:**
1. Run migration SQL
2. Create storage bucket
3. Test the app
4. Deploy to production
5. Monitor for issues

---

**Last Updated:** June 8, 2026
**Status:** ✅ Ready for Deployment
**Build:** ✅ Clean (1651 modules, exit 0)
