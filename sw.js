const CACHE_NAME = 'lgt-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './favicon.png',
  './lgt3.png',
  './coalbanner.jpg',
  './owner.jpeg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});