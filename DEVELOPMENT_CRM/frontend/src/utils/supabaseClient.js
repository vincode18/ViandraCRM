/* ─────────────────────────────────────────────────────────────────────────
   Supabase Client Configuration
   Connects to PostgreSQL backend with RLS (Row-Level Security)
   ───────────────────────────────────────────────────────────────────────── */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bfaxkqzkccwryibyronw.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYXhrcXprY2N3cnlpYnlyb253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDM2NzEsImV4cCI6MjA5NTYxOTY3MX0.YkdG6YWGOfp0juC8vldK-7UE3WLRLzp64opWvogA8-M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/* ── Error Handler ────────────────────────────────────────────────────── */
export function handleSupabaseError(error, context = '') {
  console.error(`[Supabase Error] ${context}:`, error);
  return {
    success: false,
    error: error?.message || 'Unknown error',
    data: null,
  };
}

/* ── Query Helpers ────────────────────────────────────────────────────── */
export async function queryTable(table, filters = {}, options = {}) {
  try {
    let query = supabase.from(table).select(options.select || '*');

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error) {
    return handleSupabaseError(error, `queryTable(${table})`);
  }
}

export async function getRecord(table, id, idColumn = 'id') {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(idColumn, id)
      .single();

    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error) {
    return handleSupabaseError(error, `getRecord(${table}, ${id})`);
  }
}

export async function insertRecord(table, payload) {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0], error: null };
  } catch (error) {
    return handleSupabaseError(error, `insertRecord(${table})`);
  }
}

export async function updateRecord(table, id, payload, idColumn = 'id') {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq(idColumn, id)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0], error: null };
  } catch (error) {
    return handleSupabaseError(error, `updateRecord(${table}, ${id})`);
  }
}

export async function deleteRecord(table, id, idColumn = 'id') {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idColumn, id);

    if (error) throw error;
    return { success: true, data: null, error: null };
  } catch (error) {
    return handleSupabaseError(error, `deleteRecord(${table}, ${id})`);
  }
}

/* ── Real-time Subscriptions ────────────────────────────────────────── */
export function subscribeToTable(table, callback, filters = {}) {
  const subscription = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        ...filters,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}

/* ── Search/Filter Helper ───────────────────────────────────────────── */
export async function searchTable(table, searchField, searchTerm, options = {}) {
  try {
    let query = supabase
      .from(table)
      .select(options.select || '*')
      .ilike(searchField, `%${searchTerm}%`);

    if (options.limit) query = query.limit(options.limit);
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (error) {
    return handleSupabaseError(error, `searchTable(${table})`);
  }
}
