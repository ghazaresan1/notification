// Create a dedicated PWA instance ID
const pwaInstanceId = Date.now().toString();
localStorage.setItem('currentPWA', pwaInstanceId);

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
    if (!window.location.href.includes('portal.ghazaresan.com')) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }
});

// Function to check if we should open new tab
function shouldOpenNewTab() {
    // Check if this is the main PWA instance
    const isMainInstance = localStorage.getItem('currentPWA') === pwaInstanceId;
    
    return isMainInstance && document.hidden && !window.location.href.includes('portal.ghazaresan.com');
}

// Set up periodic check
setInterval(() => {
    if (shouldOpenNewTab()) {
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
