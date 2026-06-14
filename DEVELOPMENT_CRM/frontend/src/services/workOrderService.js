/* ─────────────────────────────────────────────────────────────────────────
   Work Order Service — Supabase Integration
   Handles Work Order CRUD, Task Lists, related data
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, getRecord, updateRecord } from '../utils/supabaseClient';
import { taskListItemsByWO, timesheetsByWO } from '../utils/taskData';

const TABLE_WORK_ORDER = 'work_order';
const TABLE_TASK_LIST_ITEM = 'task_list_item';

/* ── Fetch Work Order by ID ────────────────────────────────────────── */
export async function fetchWorkOrderById(id) {
  try {
    const result = await getRecord(TABLE_WORK_ORDER, id, 'id');

    if (!result.success) {
      return { success: false, error: 'Work Order not found', data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Work Order fetch error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Fetch Task List Items for Work Order ───────────────────────────── */
export async function fetchTaskListItems(workOrderId) {
  try {
    const result = await queryTable(TABLE_TASK_LIST_ITEM, { work_order_id: workOrderId }, {
      orderBy: 'operation_number',
    });

    if (!result.success) {
      const mockItems = taskListItemsByWO(workOrderId);
      return { success: true, data: mockItems, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('Task list items fetch error:', error);
    const mockItems = taskListItemsByWO(workOrderId);
    return { success: true, data: mockItems, isMock: true };
  }
}

/* ── Create Task List Item ──────────────────────────────────────────── */
export async function createTaskListItem(workOrderId, taskData) {
  try {
    const payload = {
      work_order_id: workOrderId,
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_TASK_LIST_ITEM)
      .insert([payload])
      .select();

    if (error) throw error;

    return { success: true, data: data?.[0], isMock: false };
  } catch (error) {
    console.error('Task list item create error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update Task List Item ──────────────────────────────────────────── */
export async function updateTaskListItem(itemId, updates) {
  try {
    const result = await updateRecord(
      TABLE_TASK_LIST_ITEM,
      itemId,
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
    console.error('Task list item update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update Task List Item Status ───────────────────────────────────── */
export async function updateTaskStatus(itemId, status, startTime = null, completeTime = null) {
  try {
    const updates = { status, updated_at: new Date().toISOString() };
    if (startTime) updates.start_time = startTime;
    if (completeTime) updates.complete_time = completeTime;

    const result = await updateRecord(TABLE_TASK_LIST_ITEM, itemId, updates, 'id');

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Task status update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Fetch Timesheets for Work Order ────────────────────────────────── */
export async function fetchWorkOrderTimesheets(workOrderId) {
  try {
    const result = await queryTable(TABLE_TIMESHEET, { work_order_id: workOrderId }, {
      orderBy: 'created_at',
      ascending: false,
    });

    if (!result.success) {
      const mockTS = timesheetsByWO(workOrderId);
      return { success: true, data: mockTS, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('Work Order timesheets fetch error:', error);
    const mockTS = timesheetsByWO(workOrderId);
    return { success: true, data: mockTS, isMock: true };
  }
}

/* ── Update Work Order Status ───────────────────────────────────────── */
export async function updateWorkOrderStatus(workOrderId, status) {
  try {
    const result = await updateRecord(
      TABLE_WORK_ORDER,
      workOrderId,
      {
        status,
        updated_at: new Date().toISOString(),
      },
      'id'
    );

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('Work Order status update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

const TABLE_TIMESHEET = 'timesheet';
