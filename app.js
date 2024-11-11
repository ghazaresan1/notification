// PWA status detection
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

// Portal activity check
function isPortalActive() {
    try {
        return window.top.location.href.includes('portal.ghazaresan.com');
    } catch {
        return false;
    }
}

// Service Worker and Notifications setup
async function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/notification/sw.js');
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Wake Lock functionality
async function requestWakeLock() {
    if ('wakeLock' in navigator && !document.hidden) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock activated');
            return wakeLock;
        } catch (err) {
            console.log('Wake Lock error:', err);
        }
    }
    return null;
}

// Portal opener functionality
function checkAndOpenPortal() {
    if (isPWA && document.hidden && !document.hasFocus() && !isPortalActive()) {
        window.open('https://portal.ghazaresan.com/orderlist', '_blank');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await initializeServiceWorker();
    
    if (isPWA && !isPortalActive()) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }
    
    // Set up periodic portal check
    setInterval(checkAndOpenPortal, 10000);
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        requestWakeLock();
    }
});

// Initial wake lock request
requestWakeLock();
