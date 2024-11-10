// Create a unique ID for this PWA instance
const pwaId = 'pwa_' + Date.now();
sessionStorage.setItem('activePWA', pwaId);

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
    
    // Initial open in new tab
    if (sessionStorage.getItem('activePWA') === pwaId) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }
});

// Set up periodic check
setInterval(() => {
    const isMainPWA = sessionStorage.getItem('activePWA') === pwaId;
    if (isMainPWA && document.hidden) {
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
