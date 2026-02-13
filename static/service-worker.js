const CACHE_NAME = 'inceptra-v1';
const IMAGE_CACHE = 'inceptra-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/favicon.svg',
    '/robots.txt'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== IMAGE_CACHE)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - cache images with cache-first strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Check if the request is for an image
    const isImage = /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname);

    if (isImage) {
        // Cache-first strategy for images
        event.respondWith(
            caches.open(IMAGE_CACHE).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        // Return cached image
                        return cachedResponse;
                    }

                    // Fetch from network and cache
                    return fetch(request).then((networkResponse) => {
                        // Only cache successful responses
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Return a fallback if both cache and network fail
                        return new Response('Image not available', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
                });
            })
        );
    } else {
        // Network-first strategy for other resources
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response
                    const responseClone = response.clone();

                    // Cache the fetched response for future use
                    if (response.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // If network fails, try to serve from cache
                    return caches.match(request);
                })
        );
    }
});
