let isPageVisible = true;

document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/notification/sw.js')
            .then(() => {
                return Notification.requestPermission();
            })
            .catch(console.error);
    }

    // Open in new tab
    window.open('https://portal.ghazaresan.com/orderlist', '_blank');
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
});

// Set up periodic reload and open new tab when page is in background
setInterval(() => {
    if (!isPageVisible) {
        window.open('https://portal.ghazaresan.com/orderlist', '_self');
    }
}, 10000);

// Request wake lock to keep screen active
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                requestWakeLock(); // Re-request if released
            });
        } catch (err) {
            console.log('Wake Lock error:', err);
        }
    }
}

requestWakeLock();
