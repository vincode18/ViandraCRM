/* ─────────────────────────────────────────────────────────────────────────
   EMR Service — Supabase Integration
   Handles all EMR CRUD operations with fallback to mock data
   ───────────────────────────────────────────────────────────────────────── */

import { supabase, queryTable, getRecord, insertRecord, updateRecord, deleteRecord, subscribeToTable } from '../utils/supabaseClient';
import { EMRS, additionalGroupsByEMR, additionalInfoByEMR, historyByEMR, photosByEMR } from '../utils/emrData';

const TABLE_EMR = 'emr';
const TABLE_EMR_ADDITIONAL_GROUPS = 'emr_additional_groups';
const TABLE_EMR_ADDITIONAL_INFO = 'emr_additional_info';
const TABLE_EMR_HISTORY = 'emr_history';
const TABLE_EMILA_PHOTOS = 'emila_photos';

/* ── Normalize Supabase row → UI shape (snake_case → camelCase) ─────── */
function normalizeEMR(row) {
  if (!row) return row;
  return {
    ...row,
    workOrder:       row.work_order       ?? row.workOrder       ?? null,
    caseId:          row.case_id          ?? row.caseId          ?? null,
    machineModel:    row.machine_model    ?? row.machineModel    ?? null,
    serialNumber:    row.serial_number    ?? row.serialNumber    ?? null,
    hoursOnComponent:row.hours_on_component ?? row.hoursOnComponent ?? null,
    smrTrouble:      row.smr_trouble      ?? row.smrTrouble      ?? null,
    smrRfu:          row.smr_rfu          ?? row.smrRfu          ?? null,
    leadTimeHours:   row.lead_time_hours  ?? row.leadTimeHours   ?? null,
    flagAzure:       row.flag_azure       ?? row.flagAzure       ?? false,
    partSupply:      row.part_supply      ?? row.partSupply      ?? false,
    submitToClaim:   row.submit_to_claim  ?? row.submitToClaim   ?? false,
    needSupportHo:   row.need_support_ho  ?? row.needSupportHo   ?? false,
    createdAt:       row.created_at       ?? row.createdAt       ?? null,
    updatedAt:       row.updated_at       ?? row.updatedAt       ?? null,
    lastModifiedAt:  row.updated_at       ?? row.lastModifiedAt  ?? null,
    createdBy:       row.created_by       ?? row.createdBy       ?? null,
    lastModifiedBy:  row.last_modified_by ?? row.lastModifiedBy  ?? null,
    account:         row.account          ?? '',
    asset:           row.asset            ?? '',
    owner:           row.owner            ?? '',
  };
}

/* ── Fetch all EMRs with filters ────────────────────────────────────── */
export async function fetchEMRs(filters = {}, options = {}) {
  try {
    const result = await queryTable(TABLE_EMR, filters, {
      orderBy: options.orderBy || 'created_at',
      ascending: options.ascending === true,
      limit: options.limit,
      offset: options.offset,
    });

    if (!result.success) {
      console.warn('Supabase EMR fetch failed, using fallback mock data');
      return { success: true, data: EMRS, isMock: true };
    }

    return { success: true, data: (result.data || []).map(normalizeEMR), isMock: false };
  } catch (error) {
    console.error('EMR fetch error:', error);
    return { success: true, data: EMRS, isMock: true };
  }
}

/* ── Fetch single EMR by ID ────────────────────────────────────────── */
export async function fetchEMRById(id) {
  try {
    const result = await getRecord(TABLE_EMR, id, 'id');

    if (!result.success) {
      const mockEMR = EMRS.find(e => e.id === id);
      if (mockEMR) {
        return { success: true, data: mockEMR, isMock: true };
      }
      return { success: false, error: 'EMR not found', data: null };
    }

    return { success: true, data: normalizeEMR(result.data), isMock: false };
  } catch (error) {
    console.error('EMR fetch error:', error);
    const mockEMR = EMRS.find(e => e.id === id);
    return { success: !!mockEMR, data: mockEMR, isMock: true };
  }
}

/* ── Create new EMR ────────────────────────────────────────────────── */
export async function createEMR(emrData) {
  try {
    const payload = {
      ...emrData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await insertRecord(TABLE_EMR, payload);

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('EMR create error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Update EMR ────────────────────────────────────────────────────── */
export async function updateEMR(id, updates) {
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const result = await updateRecord(TABLE_EMR, id, payload, 'id');

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('EMR update error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Delete EMR ────────────────────────────────────────────────────── */
export async function deleteEMR(id) {
  try {
    const result = await deleteRecord(TABLE_EMR, id, 'id');

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('EMR delete error:', error);
    return { success: false, error: error.message };
  }
}

/* ── Fetch EMR Additional Groups ────────────────────────────────────── */
export async function fetchEMRAdditionalGroups(emrId) {
  try {
    const result = await queryTable(TABLE_EMR_ADDITIONAL_GROUPS, { emr_id: emrId });

    if (!result.success) {
      const mockGroups = additionalGroupsByEMR(emrId);
      return { success: true, data: mockGroups, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('EMR additional groups fetch error:', error);
    return { success: true, data: additionalGroupsByEMR(emrId), isMock: true };
  }
}

/* ── Fetch EMR History ────────────────────────────────────────────── */
export async function fetchEMRHistory(emrId) {
  try {
    const result = await queryTable(TABLE_EMR_HISTORY, { emr_id: emrId }, {
      orderBy: 'timestamp',
      ascending: false,
    });

    if (!result.success) {
      const mockHistory = historyByEMR(emrId);
      return { success: true, data: mockHistory, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('EMR history fetch error:', error);
    return { success: true, data: historyByEMR(emrId), isMock: true };
  }
}

/* ── Fetch EMILA Photos ────────────────────────────────────────────── */
export async function fetchEMILAPhotos(emrId, category = null) {
  try {
    const filters = { emr_id: emrId };
    if (category) filters.category = category;

    const result = await queryTable(TABLE_EMILA_PHOTOS, filters, {
      orderBy: 'order_number',
    });

    if (!result.success) {
      const mockPhotos = photosByEMR(emrId, category);
      return { success: true, data: mockPhotos, isMock: true };
    }

    return { success: true, data: result.data || [], isMock: false };
  } catch (error) {
    console.error('EMILA photos fetch error:', error);
    return { success: true, data: photosByEMR(emrId, category), isMock: true };
  }
}

/* ── Upload EMILA Photo ────────────────────────────────────────────── */
export async function uploadEMILAPhoto(emrId, category, file, metadata = {}) {
  try {
    // Upload file to Supabase Storage
    const fileName = `${emrId}/${category}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('emr-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create photo record in database
    const photoRecord = {
      emr_id: emrId,
      category,
      description: metadata.description || file.name,
      file_path: uploadData.path,
      file_url: `${supabase.storageUrl}/object/public/emr-photos/${uploadData.path}`,
      order_number: metadata.orderNumber || 1,
      group_type: metadata.groupType || 'FSL',
      created_at: new Date().toISOString(),
    };

    const result = await insertRecord(TABLE_EMILA_PHOTOS, photoRecord);

    if (!result.success) {
      return { success: false, error: result.error, data: null };
    }

    return { success: true, data: result.data, isMock: false };
  } catch (error) {
    console.error('EMILA photo upload error:', error);
    return { success: false, error: error.message, data: null };
  }
}

/* ── Subscribe to EMR changes (Real-time) ───────────────────────────── */
export function subscribeToEMRChanges(emrId, callback) {
  return subscribeToTable(TABLE_EMR, (payload) => {
    if (payload.new?.id === emrId || payload.old?.id === emrId) {
      callback(payload);
    }
  });
}

/* ── Batch update EMR status (e.g., bulk approve) ────────────────────── */
export async function batchUpdateEMRStatus(emrIds, status) {
  try {
    const { error } = await supabase
      .from(TABLE_EMR)
      .update({ status, updated_at: new Date().toISOString() })
      .in('id', emrIds);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Batch EMR update error:', error);
    return { success: false, error: error.message };
  }
}
