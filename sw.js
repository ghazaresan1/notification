const CACHE_NAME = 'ghazaresan-portal-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                  '/notification/',
                '/notification/index.html',
                '/notification/app.js',
                '/notification/manifest.json',
                '/notification/icon.png',
                '/notification/icon1.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/notification/icon.png',
        badge: '/notification/icon1.png'
    };
    
    event.waitUntil(
        self.registration.showNotification('Ghazaresan Portal', options)
    );
});
