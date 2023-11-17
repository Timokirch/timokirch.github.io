// Service Worker file

const cacheName = 'offline-cache-v1';
const cacheFiles = [
    '/',
    '/index.html',
    '/styles.css'
    // Add more files here
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
