// Create a dedicated iframe to detect portal status
function checkPortalStatus() {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'https://portal.ghazaresan.com';
    
    return new Promise((resolve) => {
        iframe.onload = () => {
            document.body.removeChild(iframe);
            resolve(true);
        };
        
        iframe.onerror = () => {
            document.body.removeChild(iframe);
            resolve(false);
        };
        
        document.body.appendChild(iframe);
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
    
    // Initial open in new tab
    window.open('https://portal.ghazaresan.com/', '_blank');
});

// Set up periodic check with portal detection
setInterval(async () => {
    const portalIsActive = await checkPortalStatus();
    if (!portalIsActive && document.hidden) {
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
