const CACHE_NAME = 'urss-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/car-database.js',
  '/urss-icon.png',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )),
      clients.claim()
    ])
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Only cache same-origin static assets; never intercept Firestore/API calls
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/send') || url.pathname.startsWith('/save-')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone)).catch(() => {});
        }
        return response;
      }).catch(() => cached);
      // Network-first for index.html and car-database.js (always fresh when online),
      // cache-first for everything else
      if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/car-database.js') {
        return fetchPromise.catch(() => cached) || cached;
      }
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('push', function(event) {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch(e) { data = { title: event.data.text(), body: '' }; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'URSS', {
      body: data.body || '',
      icon: '/urss-icon.png',
      badge: '/urss-icon.png',
      vibrate: [200, 100, 200],
      data: { url: '/' }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
