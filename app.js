// Create a message channel for portal detection
const portalChannel = new BroadcastChannel('portal_detector');

// Send message when on portal page
if (window.location.href.includes('portal.ghazaresan.com')) {
    portalChannel.postMessage('portal_active');
}

let portalIsActive = false;

// Listen for portal status
portalChannel.onmessage = () => {
    portalIsActive = true;
    // Reset after 15 seconds of no messages
    setTimeout(() => {
        portalIsActive = false;
    }, 15000);
};

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

// Set up periodic check
setInterval(() => {
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
