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

// Set up periodic reload when page is in background
setInterval(() => {
    if (!isPageVisible) {
        window.location.reload();
    }
}, 10000);

// Keep-alive functionality with proper headers
setInterval(() => {
    fetch('https://app.ghazaresan.com', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'securitykey': 'Asdiw2737y#376',
            'Referer': 'https://portal.ghazaresan.com/'
        }
    });
}, 30000);

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
