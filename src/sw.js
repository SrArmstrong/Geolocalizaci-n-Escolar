// Cache name
import { precacheAndRoute } from 'workbox-precaching';
const CACHE_NAME = 'pwa-mapa-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

precacheAndRoute(self.__WB_MANIFEST);
// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker activado');
  event.waitUntil(self.clients.claim());
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  console.log('📨 Notificación push recibida:', event);
  
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.error('Error parseando datos de notificación:', error);
    data = {
      title: 'Nuevo evento UTEQ',
      body: 'Hay un nuevo evento disponible',
      icon: '/logo_uteq192.png'
    };
  }

  const options = {
    body: data.body || 'Nuevo evento en la universidad',
    icon: data.icon || '/logo_uteq192.png',
    badge: '/logo_uteq192.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      eventId: data.eventId,
      timestamp: data.timestamp || new Date().toISOString()
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir Mapa',
        icon: '/logo_uteq192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/logo_uteq192.png'
      }
    ],
    tag: data.tag || 'uteq-event',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Mapa UTEQ', options)
  );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notificación clickeada:', event.notification.data);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Abrir o enfocar la aplicación
  event.waitUntil(
    self.clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((clientList) => {
      // Buscar si ya hay una ventana abierta
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Si no hay ventana abierta, abrir una nueva
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificación cerrada:', event.notification);
});

// Fetch events (para cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});