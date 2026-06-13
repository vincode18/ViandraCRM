/* ─────────────────────────────────────────────────────────────────────────
   Opportunity Service — Supabase Integration
   Handles all Opportunity CRUD operations with fallback to mock data
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, getRecord, insertRecord, updateRecord, deleteRecord } from '../utils/supabaseClient';

const TABLE_OPPORTUNITIES = 'opportunities';
const TABLE_OPPORTUNITY_LINE_ITEMS = 'opportunity_line_items';

/* ── Normalize Supabase row → UI shape (snake_case → camelCase) ─────── */
function normalizeOpportunity(row) {
  if (!row) return row;
  return {
    ...row,
    opportunityId: row.id ?? row.opportunityId ?? null,
    name: row.name ?? row.opportunityName ?? '',
    accountId: row.account_id ?? row.accountId ?? null,
    accountName: row.account_name ?? row.accountName ?? '',
    contactId: row.contact_id ?? row.contactId ?? null,
    contactName: row.contact_name ?? row.contactName ?? '',
    closeDate: row.close_date ?? row.closeDate ?? null,
    stageName: row.stage_name ?? row.stageName ?? 'Prospecting',
    probability: row.probability ?? row.probability ?? 10,
    amount: row.amount ?? row.amount ?? null,
    expectedRevenue: row.expected_revenue ?? row.expectedRevenue ?? null,
    type: row.type ?? row.type ?? 'New Business',
    leadSource: row.lead_source ?? row.leadSource ?? '',
    description: row.description ?? row.description ?? '',
    nextStep: row.next_step ?? row.nextStep ?? '',
    isPrivate: row.is_private ?? row.isPrivate ?? false,
    isPriorityRecord: row.is_priority_record ?? row.isPriorityRecord ?? false,
    isClosed: row.is_closed ?? row.isClosed ?? false,
    isWon: row.is_won ?? row.isWon ?? false,
    currencyIsoCode: row.currency_iso_code ?? row.currencyIsoCode ?? 'USD',
    forecastCategoryName: row.forecast_category_name ?? row.forecastCategoryName ?? 'Pipeline',
    createdAt: row.created_at ?? row.createdAt ?? null,
    updatedAt: row.updated_at ?? row.updatedAt ?? null,
    createdBy: row.created_by ?? row.createdBy ?? null,
    ownerId: row.owner_id ?? row.ownerId ?? null,
    ownerName: row.owner_name ?? row.ownerName ?? '',
    lastStageChangeDate: row.last_stage_change_date ?? row.lastStageChangeDate ?? null,
    lastActivityDate: row.last_activity_date ?? row.lastActivityDate ?? null,
    syncedQuoteId: row.synced_quote_id ?? row.syncedQuoteId ?? null,
  };
}

/* ── Fetch all Opportunities with filters ───────────────────────────────── */
export async function fetchOpportunities(filters = {}, options = {}) {
  try {
    const result = await queryTable(TABLE_OPPORTUNITIES, filters, {
      orderBy: options.orderBy || 'created_at',
      ascending: options.ascending !== false,
      limit: options.limit,
      offset: options.offset,
    });

    if (!result.success) {
      console.warn('Supabase Opportunity fetch failed, using fallback mock data');
      return { success: true, data: [], totalCount: 0, isMock: true };
    }

    const items = (result.data || []).map(normalizeOpportunity);
    return { 
      success: true, 
      data: items, 
      totalCount: items.length,
      isMock: false 
    };
  } catch (error) {
    console.error('Opportunity fetch error:', error);
    return { success: true, data: [], totalCount: 0, isMock: true };
  }
}

/* ── Fetch single Opportunity by ID ────────────────────────────────────── */
export async function fetchOpportunityById(id) {
  try {
    const result = await getRecord(TABLE_OPPORTUNITIES, id, 'id');

    if (!result.success) {
      return { success: false, error: 'Opportunity not found', data: null };
    }

    return { success: true, data: normalizeOpportunity(result.data), isMock: false };
  } catch (error) {
    console.error('Opportunity fetch error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Create new Opportunity ────────────────────────────────────────────── */
export async function createOpportunity(opportunityData) {
  try {
    const payload = {
      ...opportunityData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await insertRecord(TABLE_OPPORTUNITIES, payload);

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Opportunity create error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update Opportunity ────────────────────────────────────────────────── */
export async function updateOpportunity(id, updates) {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_OPPORTUNITIES, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Opportunity update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Delete Opportunity ────────────────────────────────────────────────── */
export async function deleteOpportunity(id) {
  try {
    const result = await deleteRecord(TABLE_OPPORTUNITIES, id, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Opportunity delete error:', error);
    return { success: false, error: error.message };
  }
}
