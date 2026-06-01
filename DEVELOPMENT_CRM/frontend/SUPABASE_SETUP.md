# Supabase Setup Guide for Viandra CRM

## Step 1: Install Dependencies

Run `npm install` in the frontend directory to install the newly added `@supabase/supabase-js` package.

```bash
cd DEVELOPMENT_CRM/frontend
npm install
```

## Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose organization, set project name (e.g., "viandra-crm")
5. Set database password (save it securely)
6. Select region closest to your users
7. Click "Create new project" (wait 1-2 minutes for setup)

## Step 3: Get Supabase Credentials

1. Go to your project dashboard
2. Navigate to **Project Settings** > **API**
3. Copy:
   - **Project URL** (e.g., `https://xxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. Restart your dev server for environment variables to take effect:
   ```bash
   npm run dev
   ```

## Step 5: Create Database Tables

1. Go to Supabase dashboard > **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute
6. This creates all required tables: `accounts`, `contacts`, `assets`, `cases`, `audit_log`, `work_orders`

## Step 6: (Optional) Insert Sample Data

In the same SQL Editor, uncomment the `INSERT` statements at the bottom of `supabase_schema.sql` and run them to add sample data for testing.

## Step 7: Enable RLS (Optional - Recommended for Production)

For production, enable Row Level Security (RLS) in Supabase to control access. Uncomment the RLS statements in the schema file and run them. Then add policies in the Supabase dashboard > **Authentication** > **Policies**.

## Files Created

- `src/utils/supabase.js` - Supabase client configuration and helper functions
- `supabase_schema.sql` - Database schema SQL
- `.env.example` - Environment variables template

## Next Steps

After setup, the application will automatically fetch data from Supabase when you visit case detail pages. The `CaseDetailPage.jsx` has been updated to use the Supabase client.
