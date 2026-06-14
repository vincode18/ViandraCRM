/* ─────────────────────────────────────────────────────────────────────────
   Timesheet Service — Supabase Integration
   Handles Timesheet CRUD, approval workflow, SAP posting
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, getRecord, updateRecord, subscribeToTable } from '../utils/supabaseClient';
import { TIMESHEETS, TIMESHEET_ENTRIES, getPendingApprovals } from '../utils/taskData';

const TABLE_TIMESHEET = 'timesheet';
const TABLE_TIMESHEET_ENTRY = 'timesheet_entry';

/* ── Fetch all Timesheets with filters ──────────────────────────────── */
export async function fetchTimesheets(filters = {}, options = {}) {
  try {
    const result = await queryTable(TABLE_TIMESHEET, filters, {
      orderBy: options.orderBy || 'created_at',
      ascending: options.ascending === false,
      limit: options.limit,
      offset: options.offset,
    });

    if (!result.success) {
      console.warn('Supabase timesheet fetch failed, using fallback mock data');
      return { success: true, data: TIMESHEETS, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('Timesheet fetch error:', error);
    return { success: true, data: TIMESHEETS, isMock: true };
  }
}

/* ── Fetch Timesheet by ID ──────────────────────────────────────────── */
export async function fetchTimesheetById(id) {
  try {
    const result = await getRecord(TABLE_TIMESHEET, id, 'id');

    if (!result.success) {
      const mockTS = TIMESHEETS.find(t => t.id === id);
      if (mockTS) {
        return { success: true, data: mockTS, isMock: true };
      }
      return { success: false, error: 'Timesheet not found', data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Timesheet fetch error:', error);
    const mockTS = TIMESHEETS.find(t => t.id === id);
    return { success: !!mockTS, data: mockTS, isMock: true };
  }
}

/* ── Fetch Timesheet Entries ────────────────────────────────────────── */
export async function fetchTimesheetEntries(timesheetId) {
  try {
    const result = await queryTable(TABLE_TIMESHEET_ENTRY, { timesheet_id: timesheetId }, {
      orderBy: 'operation_number',
    });

    if (!result.success) {
      const mockEntries = TIMESHEET_ENTRIES.filter(e => e.timesheetId === timesheetId);
      return { success: true, data: mockEntries, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('Timesheet entries fetch error:', error);
    const mockEntries = TIMESHEET_ENTRIES.filter(e => e.timesheetId === timesheetId);
    return { success: true, data: mockEntries, isMock: true };
  }
}

/* ── Fetch Pending Approvals ────────────────────────────────────────── */
export async function fetchPendingApprovals() {
  try {
    const result = await queryTable(TABLE_TIMESHEET, { status: 'Submitted' }, {
      orderBy: 'created_at',
      ascending: false,
    });

    if (!result.success) {
      const mockPending = getPendingApprovals();
      return { success: true, data: mockPending, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('Pending approvals fetch error:', error);
    return { success: true, data: getPendingApprovals(), isMock: true };
  }
}

/* ── Approve Timesheet ──────────────────────────────────────────────── */
export async function approveTimesheet(timesheetId, approverUserId) {
  try {
    const result = await updateRecord(
      TABLE_TIMESHEET,
      timesheetId,
      {
        status: 'Approved',
        approved_at: new Date().toISOString(),
        approved_by: approverUserId,
        updated_at: new Date().toISOString(),
      },
      'id'
    );

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Timesheet approval error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Reject Timesheet ───────────────────────────────────────────────── */
export async function rejectTimesheet(timesheetId, rejectionReason, rejectorUserId) {
  try {
    const result = await updateRecord(
      TABLE_TIMESHEET,
      timesheetId,
      {
        status: 'Rejected',
        rejection_reason: rejectionReason,
        rejected_at: new Date().toISOString(),
        rejected_by: rejectorUserId,
        updated_at: new Date().toISOString(),
      },
      'id'
    );

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Timesheet rejection error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Bulk Approve Timesheets ────────────────────────────────────────── */
export async function bulkApproveTimesheets(timesheetIds, approverUserId) {
  try {
    const { error } = await supabase
      .from(TABLE_TIMESHEET)
      .update({
        status: 'Approved',
        approved_at: new Date().toISOString(),
        approved_by: approverUserId,
        updated_at: new Date().toISOString(),
      })
      .in('id', timesheetIds);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Bulk timesheet approval error:', error);
    return { success: false, error: error.message };
  }
}

/* ── Post Timesheet to SAP ──────────────────────────────────────────── */
export async function postTimesheetToSAP(timesheetId) {
  try {
    // Call Edge Function to post to SAP
    const { data, error } = await supabase.functions.invoke('post-timesheet-sap', {
      body: { timesheet_id: timesheetId },
    });

    if (error) throw error;

    // Update timesheet record
    const result = await updateRecord(
      TABLE_TIMESHEET,
      timesheetId,
      {
        posted_to_sap: true,
        posted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      'id'
    );

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('SAP posting error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update Timesheet Entry ────────────────────────────────────────── */
export async function updateTimesheetEntry(entryId, updates) {
  try {
    const result = await updateRecord(
      TABLE_TIMESHEET_ENTRY,
      entryId,
      {
        ...updates,
        updated_at: new Date().toISOString(),
      },
      'id'
    );

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Timesheet entry update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Subscribe to Timesheet changes (Real-time) ─────────────────────── */
export function subscribeToTimesheetChanges(timesheetId, callback) {
  return subscribeToTable(TABLE_TIMESHEET, (payload) => {
    if (payload.new?.id === timesheetId || payload.old?.id === timesheetId) {
      callback(payload);
    }
  });
}

/* ── Subscribe to Approval Queue changes ────────────────────────────── */
export function subscribeToApprovalQueueChanges(callback) {
  return subscribeToTable(TABLE_TIMESHEET, (payload) => {
    if (payload.new?.status === 'Submitted' || payload.old?.status === 'Submitted') {
      callback(payload);
    }
  });
}
