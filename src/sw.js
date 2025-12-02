import { precacheAndRoute } from 'workbox-precaching';

const CACHE_NAME = 'pwa-mapa-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', async (event) => {

  const subscription = await self.registration.pushManager.getSubscription();
  if (!subscription) {
    return;
  }

  if (!event.data) return;

  let data;

  try {
    data = event.data.json();
  } catch (err) {
    console.warn("⚠️ No se pudo parsear JSON del push", err);
    data = {
      title: "Nuevo evento",
      body: "Hay novedades en el Mapa",
    };
  }

  const options = {
    body: data.body || 'Nuevo evento disponible',
    icon: data.icon || '/logo_uteq192.png',
    badge: '/logo_uteq192.png',
    data: {
      url: data.url || '/',
      eventId: data.eventId || null,
      timestamp: data.timestamp || new Date().toISOString()
    },
    tag: data.tag || 'uteq-event',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notificación', options)
  );
});

self.addEventListener('notificationclick', (event) => {

  event.notification.close();

  if (event.action === 'close') return;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url || '/');
        }
      })
  );
});

self.addEventListener('notificationclose', (event) => {
  //console.log('❌ Notificación cerrada:', event.notification);
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
