// Service Worker file

const cacheName = 'v1';
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
            return response || fetch(event.request, { cache: 'no-store' })
                .then(function(fetchResponse) {
                    // Check if the response has changed before updating the cache
                    if (!response ||
                        fetchResponse.headers.get('ETag') !== response.headers.get('ETag') ||
                        fetchResponse.headers.get('Last-Modified') !== response.headers.get('Last-Modified')
                    ) {
                        const headers = new Headers(fetchResponse.headers);
                        headers.append('x-content-type-options', 'nosniff');
                        headers.append('cache-control', 'max-age=2592000');
                        const clonedResponse = new Response(fetchResponse.body, {
                            status: fetchResponse.status,
                            statusText: fetchResponse.statusText,
                            headers: headers,
                        });

                        // Cache the cloned response
                        caches.open(cacheName).then(function(cache) {
                            cache.put(event.request, clonedResponse);
                        });
                    }

                    return fetchResponse;
                });
        })
    );
});

self.addEventListener('activate', function(event) {
    // Claim all open clients for the current service worker
    event.waitUntil(clients.claim());

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