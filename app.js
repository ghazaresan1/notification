// Create a SharedWorker for reliable cross-tab communication
const worker = new SharedWorker('portalWorker.js');
let portalActive = false;

// When this page loads, check if it's the portal
if (window.location.href.includes('portal.ghazaresan.com')) {
    worker.port.postMessage({ type: 'portalActive', active: true });
}

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
    
    // Initial open in new tab only if we're not on portal
    if (!window.location.href.includes('portal.ghazaresan.com')) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }
});

// Listen for portal status updates
worker.port.onmessage = (e) => {
    portalActive = e.data.active;
};

// Set up periodic check
setInterval(() => {
    // Only open new tab when portal is not active and current page is hidden
    if (!portalActive && document.hidden) {
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
