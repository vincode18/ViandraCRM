/* ─────────────────────────────────────────────────────────────────────────
   IndexedDB Service for Offline Form Storage
   Manages offline submissions, photos, and cached records for Field Service PWA
   ───────────────────────────────────────────────────────────────────────── */

const DB_NAME = 'ut_field_service_offline';
const DB_VERSION = 1;

// IndexedDB schema
const STORES = {
  offline_submissions: 'offline_submissions',
  offline_photos: 'offline_photos',
  cached_records: 'cached_records',
};

let db = null;

// Initialize IndexedDB
export async function initDB() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[IndexedDB] Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[IndexedDB] Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      console.log('[IndexedDB] Database upgrade needed');

      // Create offline_submissions store
      if (!database.objectStoreNames.contains(STORES.offline_submissions)) {
        const submissionStore = database.createObjectStore(STORES.offline_submissions, { keyPath: 'id' });
        submissionStore.createIndex('record_id', 'record_id', { unique: false });
        submissionStore.createIndex('status', 'status', { unique: false });
        submissionStore.createIndex('created_at', 'created_at', { unique: false });
      }

      // Create offline_photos store
      if (!database.objectStoreNames.contains(STORES.offline_photos)) {
        const photoStore = database.createObjectStore(STORES.offline_photos, { keyPath: 'id' });
        photoStore.createIndex('submission_id', 'submission_id', { unique: false });
        photoStore.createIndex('upload_status', 'upload_status', { unique: false });
      }

      // Create cached_records store
      if (!database.objectStoreNames.contains(STORES.cached_records)) {
        const cacheStore = database.createObjectStore(STORES.cached_records, { keyPath: 'id' });
        cacheStore.createIndex('record_type', 'record_type', { unique: false });
        cacheStore.createIndex('expires_at', 'expires_at', { unique: false });
      }
    };
  });
}

// Offline Submissions

export async function saveOfflineSubmission(submission) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_submissions], 'readwrite');
  const store = transaction.objectStore(STORES.offline_submissions);

  const record = {
    id: submission.id || generateUUID(),
    record_type: submission.record_type,
    record_id: submission.record_id,
    form_type: submission.form_type,
    payload: submission.payload,
    photo_ids: submission.photo_ids || [],
    status: 'SAVED_LOCALLY',
    created_at: new Date().toISOString(),
    last_attempt_at: null,
    retry_count: 0,
    error_message: null,
    server_response: null,
    ...submission,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineSubmissions(filter = {}) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_submissions], 'readonly');
  const store = transaction.objectStore(STORES.offline_submissions);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      let results = request.result;
      
      if (filter.status) {
        results = results.filter(r => r.status === filter.status);
      }
      if (filter.record_id) {
        results = results.filter(r => r.record_id === filter.record_id);
      }
      
      // Sort by created_at descending
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineSubmission(id) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_submissions], 'readonly');
  const store = transaction.objectStore(STORES.offline_submissions);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateOfflineSubmission(id, updates) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_submissions], 'readwrite');
  const store = transaction.objectStore(STORES.offline_submissions);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (!record) {
        reject(new Error('Submission not found'));
        return;
      }

      const updated = { ...record, ...updates };
      const putRequest = store.put(updated);
      putRequest.onsuccess = () => resolve(updated);
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function deleteOfflineSubmission(id) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_submissions], 'readwrite');
  const store = transaction.objectStore(STORES.offline_submissions);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Offline Photos

export async function saveOfflinePhoto(photo) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_photos], 'readwrite');
  const store = transaction.objectStore(STORES.offline_photos);

  const record = {
    id: photo.id || generateUUID(),
    submission_id: photo.submission_id,
    blob: photo.blob,
    filename: photo.filename,
    mime_type: photo.mime_type || 'image/jpeg',
    size_bytes: photo.size_bytes,
    captured_at: new Date().toISOString(),
    upload_status: 'pending',
    ...photo,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflinePhotos(submissionId) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_photos], 'readonly');
  const store = transaction.objectStore(STORES.offline_photos);
  const index = store.index('submission_id');

  return new Promise((resolve, reject) => {
    const request = index.getAll(submissionId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflinePhoto(id) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_photos], 'readonly');
  const store = transaction.objectStore(STORES.offline_photos);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateOfflinePhoto(id, updates) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_photos], 'readwrite');
  const store = transaction.objectStore(STORES.offline_photos);

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (!record) {
        reject(new Error('Photo not found'));
        return;
      }

      const updated = { ...record, ...updates };
      const putRequest = store.put(updated);
      putRequest.onsuccess = () => resolve(updated);
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function deleteOfflinePhoto(id) {
  const database = await initDB();
  const transaction = database.transaction([STORES.offline_photos], 'readwrite');
  const store = transaction.objectStore(STORES.offline_photos);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Cached Records

export async function cacheRecord(record) {
  const database = await initDB();
  const transaction = database.transaction([STORES.cached_records], 'readwrite');
  const store = transaction.objectStore(STORES.cached_records);

  const cachedRecord = {
    id: record.id,
    record_type: record.record_type,
    data: record.data,
    cached_at: new Date().toISOString(),
    expires_at: record.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(cachedRecord);
    request.onsuccess = () => resolve(cachedRecord);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedRecord(id) {
  const database = await initDB();
  const transaction = database.transaction([STORES.cached_records], 'readonly');
  const store = transaction.objectStore(STORES.cached_records);

  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => {
      const record = request.result;
      if (!record) {
        resolve(null);
        return;
      }

      // Check if expired
      if (new Date(record.expires_at) < new Date()) {
        // Delete expired record
        const deleteTransaction = database.transaction([STORES.cached_records], 'readwrite');
        const deleteStore = deleteTransaction.objectStore(STORES.cached_records);
        deleteStore.delete(id);
        resolve(null);
      } else {
        resolve(record);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedRecordsByType(recordType) {
  const database = await initDB();
  const transaction = database.transaction([STORES.cached_records], 'readonly');
  const store = transaction.objectStore(STORES.cached_records);
  const index = store.index('record_type');

  return new Promise((resolve, reject) => {
    const request = index.getAll(recordType);
    request.onsuccess = () => {
      const results = request.result.filter(r => new Date(r.expires_at) > new Date());
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearExpiredCache() {
  const database = await initDB();
  const transaction = database.transaction([STORES.cached_records], 'readwrite');
  const store = transaction.objectStore(STORES.cached_records);
  const index = store.index('expires_at');

  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const range = IDBKeyRange.upperBound(now);
    const request = index.openCursor(range);
    
    const recordsToDelete = [];
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        recordsToDelete.push(cursor.value.id);
        cursor.continue();
      } else {
        // Delete all expired records
        const deleteTransaction = database.transaction([STORES.cached_records], 'readwrite');
        const deleteStore = deleteTransaction.objectStore(STORES.cached_records);
        
        Promise.all(recordsToDelete.map(id => {
          return new Promise((res, rej) => {
            const delRequest = deleteStore.delete(id);
            delRequest.onsuccess = () => res();
            delRequest.onerror = () => rej(delRequest.error);
          });
        }))
        .then(() => resolve(recordsToDelete.length))
        .catch(reject);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// Storage Quota Management

export async function getStorageUsage() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentage: (estimate.usage / estimate.quota) * 100,
    };
  }
  return null;
}

export async function clearAllData() {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      db = null;
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Utility Functions

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function isOnline() {
  if (navigator.onLine === false) return false;
  
  // Try to fetch a small resource to verify actual connectivity
  try {
    const response = await fetch('/api/health', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
