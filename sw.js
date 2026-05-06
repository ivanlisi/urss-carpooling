self.addEventListener('push', function(event) {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch(e) { data = { title: event.data.text(), body: '' }; }
  
  const notifTitle = data.title || data.body || 'URSS';
  const notifBody = data.body && data.body !== data.title ? data.body : '';

  event.waitUntil(
    self.registration.showNotification(notifTitle, {
      body: notifBody,
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

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
