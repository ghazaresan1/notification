// Create a BroadcastChannel for cross-tab communication
const channel = new BroadcastChannel('portal_status');

// When this page loads, check if it's the portal
if (window.location.href.includes('portal.ghazaresan.com')) {
    // Inform other tabs that portal is active
    channel.postMessage({ active: true });
    
    // When this page becomes hidden
    document.addEventListener('visibilitychange', () => {
        channel.postMessage({ active: document.hidden ? false : true });
    });
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

let portalActive = false;

// Listen for portal status updates
channel.onmessage = (event) => {
    portalActive = event.data.active;
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
    if ('wakeLock' in navigator) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                requestWakeLock();
            });
        } catch (err) {
            console.log('Wake Lock error:', err);
        }
    }
}

requestWakeLock();
