import { createClient } from '@supabase/supabase-js';

// ── Supabase Configuration ───────────────────────────────────────────────
// Replace these with your Supabase project credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Database Table Names ─────────────────────────────────────────────────
export const TABLES = {
  CASES: 'cases',
  ACCOUNTS: 'accounts',
  CONTACTS: 'contacts',
  ASSETS: 'assets',
  WORK_ORDERS: 'work_orders',
  AUDIT_LOG: 'audit_log',
};

// ── Auth Helpers ─────────────────────────────────────────────────────
/**
 * Register a new user in Supabase Auth.
 * Returns { data, error } from supabase.auth.signUp.
 * The caller is responsible for also POSTing to /api/auth/register to sync the backend DB.
 */
export async function signUpWithSupabase(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  return { data, error };
}

/**
 * Upsert a user record into the Supabase `app_users` table.
 * Called after successful ASP.NET login or register to keep Supabase in sync.
 * @param {object} user - UserDto from ASP.NET response
 * @param {string|null} lastLogin - ISO timestamp of last login (null on register)
 */
export async function syncUserToSupabase(user, lastLogin = null) {
  const record = {
    id:         user.userId,
    username:   user.username,
    email:      user.email,
    first_name: user.firstName || null,
    last_name:  user.lastName  || null,
    role:       user.role,
    department: user.department || null,
    phone:      user.phoneNumber || null,
    is_active:  true,
    updated_at: new Date().toISOString(),
    ...(lastLogin ? { last_login: lastLogin } : {}),
  };

  const { error } = await supabase
    .from('app_users')
    .upsert(record, { onConflict: 'id' });

  if (error) console.warn('[Supabase sync] Failed to sync user:', error.message);
}

// ── Helper Functions ─────────────────────────────────────────────────────
/**
 * Fetch all cases with related account and contact data
 */
export async function fetchCases() {
  const { data, error } = await supabase
    .from(TABLES.CASES)
    .select(`
      *,
      account:accounts(id, account_name, tier),
      contact:contacts(id, name, phone, email),
      asset:assets(id, asset_id, model, location)
    `)
    .order('created_date', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch a single case by ID with all related data
 */
export async function fetchCaseById(id) {
  const { data, error } = await supabase
    .from(TABLES.CASES)
    .select(`
      *,
      account:accounts(id, account_name, tier),
      contact:contacts(id, name, phone, email),
      asset:assets(id, asset_id, model, location)
    `)
    .eq('case_number', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a case record
 */
export async function updateCase(id, updates) {
  const { data, error } = await supabase
    .from(TABLES.CASES)
    .update(updates)
    .eq('case_number', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a single field on a case with before/after diff.
 * Returns { before, after, sqlBefore, sqlAfter, data }
 */
export async function updateCaseField(caseNumber, fieldName, newValue) {
  // Fetch current value first (BEFORE)
  const { data: before, error: fetchErr } = await supabase
    .from(TABLES.CASES)
    .select(`id, case_number, ${fieldName}`)
    .eq('case_number', caseNumber)
    .single();

  if (fetchErr) throw fetchErr;

  const oldValue = before[fieldName];

  // Build SQL preview strings
  const sqlBefore = `-- BEFORE\nSELECT case_number, ${fieldName}\nFROM cases\nWHERE case_number = '${caseNumber}';\n\n-- Result: { "${fieldName}": ${JSON.stringify(oldValue)} }`;
  const sqlAfter  = `-- AFTER\nUPDATE cases\nSET ${fieldName} = ${JSON.stringify(newValue)},\n    updated_at = NOW()\nWHERE case_number = '${caseNumber}';\n\n-- Result: { "${fieldName}": ${JSON.stringify(newValue)} }`;

  // Perform the update (AFTER)
  const { data: updated, error: updateErr } = await supabase
    .from(TABLES.CASES)
    .update({ [fieldName]: newValue, updated_at: new Date().toISOString() })
    .eq('case_number', caseNumber)
    .select()
    .single();

  if (updateErr) throw updateErr;

  return { before: oldValue, after: newValue, sqlBefore, sqlAfter, data: updated };
}

/**
 * Insert a new audit log entry
 */
export async function insertAuditLog(entry) {
  const { data, error } = await supabase
    .from(TABLES.AUDIT_LOG)
    .insert({
      case_number: entry.caseNumber,
      log_timestamp: entry.timestamp || new Date().toISOString(),
      log_date: entry.date,
      log_time: entry.time,
      user_name: entry.user,
      field: entry.field,
      entry_type: entry.type,
      old_value: entry.oldValue,
      new_value: entry.newValue,
      note: entry.note,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch audit log entries for a case
 */
export async function fetchAuditLogByCase(caseId) {
  const { data, error } = await supabase
    .from(TABLES.AUDIT_LOG)
    .select('*')
    .eq('case_number', caseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
