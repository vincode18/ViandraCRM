/* ─────────────────────────────────────────────────────────────────────────
   Quote Service — Supabase Integration
   Handles all Quote CRUD operations with fallback to mock data
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, getRecord, insertRecord, updateRecord, deleteRecord } from '../utils/supabaseClient';

const TABLE_QUOTES = 'quotes';
const TABLE_QUOTE_LINE_ITEMS = 'quote_line_items';

/* ── Normalize Supabase row → UI shape (snake_case → camelCase) ─────── */
function normalizeQuote(row) {
  if (!row) return row;
  return {
    ...row,
    quoteId: row.id ?? row.quoteId ?? null,
    name: row.name ?? row.quoteName ?? '',
    opportunityId: row.opportunity_id ?? row.opportunityId ?? null,
    opportunityName: row.opportunity_name ?? row.opportunityName ?? '',
    accountId: row.account_id ?? row.accountId ?? null,
    accountName: row.account_name ?? row.accountName ?? '',
    contactId: row.contact_id ?? row.contactId ?? null,
    contactName: row.contact_name ?? row.contactName ?? '',
    status: row.status ?? row.status ?? 'Draft',
    version: row.version ?? row.version ?? 1,
    expirationDate: row.expiration_date ?? row.expirationDate ?? null,
    subtotal: row.subtotal ?? row.subtotal ?? 0,
    discount: row.discount ?? row.discount ?? 0,
    tax: row.tax ?? row.tax ?? 0,
    shippingHandling: row.shipping_handling ?? row.shippingHandling ?? 0,
    grandTotal: row.grand_total ?? row.grandTotal ?? 0,
    currencyIsoCode: row.currency_iso_code ?? row.currencyIsoCode ?? 'USD',
    internalNotes: row.internal_notes ?? row.internalNotes ?? '',
    submittedBy: row.submitted_by ?? row.submittedBy ?? null,
    submittedAt: row.submitted_at ?? row.submittedAt ?? null,
    reviewedBy: row.reviewed_by ?? row.reviewedBy ?? null,
    reviewedAt: row.reviewed_at ?? row.reviewedAt ?? null,
    approvalComments: row.approval_comments ?? row.approvalComments ?? '',
    rejectionReason: row.rejection_reason ?? row.rejectionReason ?? '',
    isSyncing: row.is_syncing ?? row.isSyncing ?? false,
    createdAt: row.created_at ?? row.createdAt ?? null,
    updatedAt: row.updated_at ?? row.updatedAt ?? null,
    createdBy: row.created_by ?? row.createdBy ?? null,
  };
}

/* ── Fetch all Quotes with filters ─────────────────────────────────────── */
export async function fetchQuotes(filters = {}, options = {}) {
  try {
    const result = await queryTable(TABLE_QUOTES, filters, {
      orderBy: options.orderBy || 'created_at',
      ascending: options.ascending !== false,
      limit: options.limit,
      offset: options.offset,
    });

    if (!result.success) {
      console.warn('Supabase Quote fetch failed, using fallback mock data');
      return { success: true, data: [], totalCount: 0, isMock: true };
    }

    const items = (result.data || []).map(normalizeQuote);
    return { 
      success: true, 
      data: items, 
      totalCount: items.length,
      isMock: false 
    };
  } catch (error) {
    console.error('Quote fetch error:', error);
    return { success: true, data: [], totalCount: 0, isMock: true };
  }
}

/* ── Fetch single Quote by ID ──────────────────────────────────────────── */
export async function fetchQuoteById(id) {
  try {
    const result = await getRecord(TABLE_QUOTES, id, 'id');

    if (!result.success) {
      return { success: false, error: 'Quote not found', data: null };
    }

    return { success: true, data: normalizeQuote(result.data), isMock: false };
  } catch (error) {
    console.error('Quote fetch error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Create new Quote ───────────────────────────────────────────────────── */
export async function createQuote(quoteData) {
  try {
    const payload = {
      ...quoteData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await insertRecord(TABLE_QUOTES, payload);

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Quote create error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update Quote ─────────────────────────────────────────────────────── */
export async function updateQuote(id, updates) {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_QUOTES, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Quote update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Delete Quote ─────────────────────────────────────────────────────── */
export async function deleteQuote(id) {
  try {
    const result = await deleteRecord(TABLE_QUOTES, id, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Quote delete error:', error);
    return { success: false, error: error.message };
  }
}

/* ── Submit Quote for Approval ─────────────────────────────────────────── */
export async function submitQuote(id, submittedBy) {
  try {
    const payload = {
      status: 'Submitted',
      submitted_by: submittedBy,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_QUOTES, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Quote submit error:', error);
    return { success: false, error: error.message };
  }
}

/* ── Approve Quote ────────────────────────────────────────────────────── */
export async function approveQuote(id, reviewedBy, comments) {
  try {
    const payload = {
      status: 'Approved',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      approval_comments: comments,
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_QUOTES, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Quote approve error:', error);
    return { success: false, error: error.message };
  }
}

/* ── Reject Quote ─────────────────────────────────────────────────────── */
export async function rejectQuote(id, reviewedBy, reason) {
  try {
    const payload = {
      status: 'Rejected',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_QUOTES, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Quote reject error:', error);
    return { success: false, error: error.message };
  }
}
