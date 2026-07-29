const CACHE_NAME = 'lgt-v3';
const ASSETS = [
  './',
  './index.html',
  './business.html',
  './style.css',
  './script.js',
  './favicon.png',
  './lgt3.png',
  './owner.jpg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force the waiting service worker to become active immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Wrap in Promise.all + catch to prevent a single missing file from blocking PWA installation
      return Promise.all(
        ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`Failed to cache asset during install: ${asset}`, err);
          });
        })
      );
    })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients/tabs immediately
  );
});

self.addEventListener('fetch', (e) => {
  // Only handle HTTP/HTTPS requests (avoid chrome-extension:// or browser scheme errors)
  if (!e.request.url.startsWith('http')) return;

  // Network-First strategy for Document, Stylesheets, and Scripts to ensure changes reflect immediately
  if (
    e.request.mode === 'navigate' ||
    e.request.destination === 'document' ||
    e.request.destination === 'style' ||
    e.request.destination === 'script'
  ) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(e.request)) // Offline fallback to cached version
    );
  } else {
    // Cache-First strategy for images, media, and other assets to save bandwidth
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        return cachedResponse || fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  }
});