/* ─────────────────────────────────────────────────────────────────────────
   Case Service — Supabase Integration
   Handles all Case CRUD operations with fallback to mock data
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, getRecord, insertRecord, updateRecord, deleteRecord } from '../utils/supabaseClient';

const TABLE_CASES = 'cases';

/* ── Normalize Supabase row → UI shape (snake_case → camelCase) ─────── */
function normalizeCase(row) {
  if (!row) return row;
  return {
    ...row,
    // Primary fields from Supabase cases table
    caseID:          row.id                ?? row.caseID          ?? null,
    caseNumber:      row.case_number       ?? row.caseNumber      ?? null,
    subject:         row.subject           ?? row.subject         ?? '',
    description:     row.description       ?? row.description     ?? '',
    priority:        row.priority          ?? row.priority        ?? 'Medium',
    status:          row.status            ?? row.status          ?? 'New',
    // Foreign key references (may be null)
    accountId:       row.account_id        ?? row.accountId       ?? null,
    accountName:     row.account_name      ?? row.accountName     ?? '—',
    assetId:         row.asset_id          ?? row.assetId         ?? null,
    assetName:       row.asset_name        ?? row.assetName       ?? '—',
    contactId:       row.contact_id        ?? row.contactId       ?? null,
    workOrderId:     row.work_order_id     ?? row.workOrderId     ?? null,
    ownerId:         row.owner_id          ?? row.ownerId         ?? null,
    assignedOwnerName: row.owner_name      ?? row.assignedOwnerName ?? '—',
    // Timestamps
    createdAt:       row.created_at        ?? row.createdAt       ?? null,
    updatedAt:       row.updated_at        ?? row.updatedAt       ?? null,
    createdBy:       row.created_by        ?? row.createdBy       ?? null,
    createdDate:     row.created_at        ?? row.createdDate     ?? null,
  };
}

/* ── Fetch all Cases with filters ────────────────────────────────────── */
export async function fetchCases(filters = {}, options = {}) {
  try {
    const result = await queryTable(TABLE_CASES, filters, {
      orderBy: options.orderBy || 'case_number',
      ascending: options.ascending !== false,
      limit: options.limit,
      offset: options.offset,
    });

    console.log('[caseService] Supabase result:', result);

    if (!result.success) {
      console.warn('Supabase Case fetch failed, using fallback mock data');
      return { success: true, data: [], totalCount: 0, isMock: true };
    }

    const items = (result.data || []).map(normalizeCase);
    console.log('[caseService] Normalized cases:', items);
    return { 
      success: true, 
      data: items, 
      totalCount: items.length,
      isMock: false 
    };
  } catch (error) {
    console.error('Case fetch error:', error);
    return { success: true, data: [], totalCount: 0, isMock: true };
  }
}

/* ── Fetch single Case by ID ────────────────────────────────────────── */
export async function fetchCaseById(id) {
  try {
    const result = await getRecord(TABLE_CASES, id, 'id');

    if (!result.success) {
      return { success: false, error: 'Case not found', data: null };
    }

    return { success: true, data: normalizeCase(result.data), isMock: false };
  } catch (error) {
    console.error('Case fetch error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Create new Case ────────────────────────────────────────────────── */
export async function createCase(caseData) {
  try {
    const payload = {
      ...caseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await insertRecord(TABLE_CASES, payload);

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Case create error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update Case ────────────────────────────────────────────────────── */
export async function updateCase(id, updates) {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_CASES, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Case update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Delete Case ────────────────────────────────────────────────────── */
export async function deleteCase(id) {
  try {
    const result = await deleteRecord(TABLE_CASES, id, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Case delete error:', error);
    return { success: false, error: error.message };
  }
}
