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

self.addEventListener('activate', function(event) {
    // Delete old caches when a new version is activated
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(name) {
                    if (name !== cacheName) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

// Update the cache whenever the application is online
self.addEventListener('message', function(event) {
    if (event.data === 'online') {
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheFiles);
        });
    }
});