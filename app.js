// Track if we're running in the PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

document.addEventListener('DOMContentLoaded', async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/notification/sw.js');
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
    
    // Initial open in new tab only from PWA
    if (isPWA) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }
});

// Set up periodic check
setInterval(() => {
    // Only open new tabs when PWA is in recent apps (completely hidden)
    if (isPWA && document.hidden && !document.hasFocus()) {
        window.open('https://portal.ghazaresan.com/orderlist', '_blank');
    }
}, 10000);

// Request wake lock to keep screen active
async function requestWakeLock() {
    if ('wakeLock' in navigator && !document.hidden) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock activated');
        } catch (err) {
            console.log('Wake Lock error:', err);
        }
    }
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        requestWakeLock();
    }
});

requestWakeLock();
