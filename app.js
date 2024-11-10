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

// Set up periodic reload based on browser visibility
setInterval(() => {
    if (!document.hasFocus()) {
        window.open('https://portal.ghazaresan.com/orderlist', '_blank');
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
