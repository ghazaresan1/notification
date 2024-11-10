document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/notification/sw.js')
            .then(() => {
                return Notification.requestPermission();
            })
            .catch(console.error);
    }

    // Initial open in new tab
    window.open('https://portal.ghazaresan.com/orderlist', '_blank');
});

// Set up periodic reload based on browser state
setInterval(() => {
    // Check if app is in background using Page Visibility API
    if (document.hidden && 'hidden' in document) {
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
