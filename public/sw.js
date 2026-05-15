/**
 * Universal ERP Service Worker
 *
 * Implements:
 *  - App shell caching for offline mode
 *  - Background sync for queued mutations
 *  - Push notifications via Web Push standard
 *  - Periodic background sync for fresh data
 */

const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

const APP_SHELL_URLS = [
  '/',
  '/app',
  '/manifest.json',
  '/_offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.endsWith(CACHE_VERSION))
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Network-first for API calls, with cache fallback
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/rest/v1/')) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  // Cache-first for hashed assets
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  // Stale-while-revalidate for navigation
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request, APP_SHELL_CACHE));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return cached ?? new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached ?? (await networkPromise) ?? new Response('Offline', { status: 503 });
}

// =============================================================================
// Background Sync
// =============================================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queued-mutations') {
    event.waitUntil(syncQueuedMutations());
  }
});

async function syncQueuedMutations() {
  const db = await openIndexedDB();
  const tx = db.transaction('mutations', 'readwrite');
  const store = tx.objectStore('mutations');
  const all = await new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  for (const mutation of all) {
    try {
      const response = await fetch(mutation.url, {
        method: mutation.method,
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': mutation.idempotencyKey,
          ...mutation.headers,
        },
        body: mutation.body,
      });
      if (response.ok) {
        await new Promise((resolve, reject) => {
          const deleteRequest = store.delete(mutation.id);
          deleteRequest.onsuccess = () => resolve(null);
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
      }
    } catch (err) {
      console.error('Sync failed for mutation', mutation.id, err);
    }
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('universal-erp', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('mutations')) {
        db.createObjectStore('mutations', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// =============================================================================
// Web Push Notifications
// =============================================================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: 'Notification', body: event.data.text() }; }

  const options = {
    body: data.body,
    icon: data.icon ?? '/icons/icon-192.png',
    badge: data.badge ?? '/icons/icon-72.png',
    tag: data.tag ?? 'default',
    data: { url: data.url, payload: data.payload },
    actions: data.actions ?? [],
    requireInteraction: data.requireInteraction ?? false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/app';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});

// =============================================================================
// Periodic Sync
// =============================================================================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-notifications') {
    event.waitUntil(refreshNotifications());
  }
});

async function refreshNotifications() {
  try {
    const response = await fetch('/api/notifications/pending');
    if (!response.ok) return;
    const { notifications } = await response.json();
    for (const n of notifications) {
      await self.registration.showNotification(n.title, {
        body: n.body,
        icon: '/icons/icon-192.png',
        data: { url: n.url },
      });
    }
  } catch (err) {
    console.error('Periodic sync failed', err);
  }
}
