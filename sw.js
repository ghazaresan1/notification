const CACHE_NAME = 'ghazaresan-portal-v1';
const CACHE_ASSETS = [
    '/notification/',
    '/notification/index.html',
    '/notification/app.js',
    '/notification/manifest.json',
    '/notification/icon.png',
    '/notification/icon1.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/notification/icon.png',
        badge: '/notification/icon1.png',
        vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
        self.registration.showNotification('Ghazaresan Portal', options)
    );
});
