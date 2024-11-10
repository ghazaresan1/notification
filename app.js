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
    window.open('https://portal.ghazaresan.com/', '_blank');
});

// Function to check if current tab is portal
function isPortalTab() {
    return window.location.href.includes('portal.ghazaresan.com');
}

// Set up periodic check
setInterval(() => {
    // Only open new tab when browser is in background AND current tab is not portal
    if (document.hidden && !document.hasFocus() && !isPortalTab()) {
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
