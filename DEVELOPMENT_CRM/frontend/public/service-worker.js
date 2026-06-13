/* ─────────────────────────────────────────────────────────────────────────
   Service Worker for UT Service Console PWA
   Caching strategies: Cache First for static assets, Network First for API
   ───────────────────────────────────────────────────────────────────────── */

const APP_VERSION = 'v1.0.0';
const CACHE_PREFIX = 'ut-console-';

// Cache names
const CACHE_NAMES = {
  appShell: `${CACHE_PREFIX}app-shell-${APP_VERSION}`,
  api: `${CACHE_PREFIX}api-${APP_VERSION}`,
  fonts: `${CACHE_PREFIX}fonts-${APP_VERSION}`,
  icons: `${CACHE_PREFIX}icons-${APP_VERSION}`,
  media: `${CACHE_PREFIX}media-${APP_VERSION}`,
};

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Fonts and icons will be cached as they're requested
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker:', APP_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAMES.appShell)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker:', APP_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith(CACHE_PREFIX) && !Object.values(CACHE_NAMES).includes(name))
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;
  
  // Cache First strategy for fonts and icons
  if (request.destination === 'font' || url.pathname.includes('/icons/') || url.pathname.includes('/fonts/')) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.icons));
    return;
  }
  
  // Network First with cache fallback for API calls
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, CACHE_NAMES.api));
    return;
  }
  
  // Stale While Revalidate for images/media
  if (request.destination === 'image' || url.pathname.includes('/images/')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.media));
    return;
  }
  
  // Network First for HTML pages (app shell)
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request, CACHE_NAMES.appShell).catch(() => {
      return caches.match('/offline.html');
    }));
    return;
  }
  
  // Cache First for other static assets (JS, CSS)
  event.respondWith(cacheFirst(request, CACHE_NAMES.appShell));
});

// Background Sync for offline submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'field-service-sync') {
    event.waitUntil(syncOfflineSubmissions());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data?.json() ?? {};
  const options = {
    title: data.title || 'UT Field Service',
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: data.tag || 'notification',
    data: data.data || {},
    requireInteraction: data.priority === 'high',
    actions: data.actions || [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  
  event.waitUntil(self.registration.showNotification(options.title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/field-service/jobs';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // If a window is already open, focus it and navigate
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then((focusedClient) => {
              focusedClient.postMessage({ type: 'NAVIGATE', url: urlToOpen });
            });
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Caching strategies

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache fetch failed:', error);
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // If fetch fails, return cached version
    return cached;
  });
  
  return cached || fetchPromise;
}

// Helper to open IndexedDB
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ut_field_service_offline', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline_submissions')) {
        db.createObjectStore('offline_submissions', { keyPath: 'id' });
      }
    };
  });
}

function idbGetAll(db, storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db, storeName, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

const MAX_RETRIES = 10;

async function syncOfflineSubmissions() {
  console.log('[SW] Syncing offline submissions...');
  let db;
  try {
    db = await openOfflineDB();
  } catch (err) {
    console.error('[SW] Could not open IDB:', err);
    return;
  }

  let submissions;
  try {
    submissions = await idbGetAll(db, 'offline_submissions');
  } catch (err) {
    console.error('[SW] Could not read submissions:', err);
    return;
  }

  const queued = submissions.filter(s => s.sync_status === 'QUEUED' || s.sync_status === 'SAVED_LOCALLY');
  console.log('[SW] Queued submissions:', queued.length);

  for (const submission of queued) {
    if ((submission.retry_count || 0) >= MAX_RETRIES) {
      await idbPut(db, 'offline_submissions', { ...submission, sync_status: 'FAILED_PERMANENT' });
      continue;
    }

    const updated = { ...submission, sync_status: 'UPLOADING', last_attempt_at: new Date().toISOString() };
    await idbPut(db, 'offline_submissions', updated);

    try {
      const response = await fetch('/api/field-service/submissions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...submission.payload, _submission_id: submission.id }),
      });

      if (response.status === 201 || response.status === 200) {
        await idbPut(db, 'offline_submissions', { ...updated, sync_status: 'SYNCED' });
        console.log('[SW] Synced submission:', submission.id);

      } else if (response.status === 409) {
        let serverVersion = null;
        try { serverVersion = await response.json(); } catch (_) {}
        await idbPut(db, 'offline_submissions', {
          ...updated,
          sync_status: 'FAILED',
          conflict_data: serverVersion,
          retry_count: (submission.retry_count || 0) + 1,
        });
        console.warn('[SW] Conflict on submission:', submission.id);

      } else {
        const retryCount = (submission.retry_count || 0) + 1;
        await idbPut(db, 'offline_submissions', {
          ...updated,
          sync_status: retryCount >= MAX_RETRIES ? 'FAILED_PERMANENT' : 'FAILED',
          retry_count: retryCount,
        });
        console.warn('[SW] Server error', response.status, 'for submission:', submission.id);
      }

    } catch (networkErr) {
      // Network failure — back off and retry next sync
      const retryCount = (submission.retry_count || 0) + 1;
      const backoffMs = Math.min(Math.pow(2, retryCount) * 1000, 3600000);
      await idbPut(db, 'offline_submissions', {
        ...updated,
        sync_status: retryCount >= MAX_RETRIES ? 'FAILED_PERMANENT' : 'QUEUED',
        retry_count: retryCount,
        next_attempt_after: new Date(Date.now() + backoffMs).toISOString(),
      });
      console.warn('[SW] Network error for submission:', submission.id, '— retry in', backoffMs, 'ms');
    }
  }
}
