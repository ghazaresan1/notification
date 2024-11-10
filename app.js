// Create a shared storage for portal status
const portalStatus = {
    isActive: false
};

// Function to check if current URL is portal
function isPortalURL() {
    return window.location.href.startsWith('https://portal.ghazaresan.com');
}

// Set portal status when page loads
if (isPortalURL()) {
    portalStatus.isActive = true;
    // Store in localStorage for cross-tab awareness
    localStorage.setItem('portalActive', 'true');
}

// Listen for storage changes
window.addEventListener('storage', (e) => {
    if (e.key === 'portalActive') {
        portalStatus.isActive = (e.newValue === 'true');
    }
});

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
    
    // Initial open in new tab only if not on portal
    if (!isPortalURL()) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }
});

// Set up periodic check with enhanced portal detection
setInterval(() => {
    const portalActive = localStorage.getItem('portalActive') === 'true' || isPortalURL();
    if (!portalActive && document.hidden) {
        window.open('https://portal.ghazaresan.com/orderlist', '_blank');
    }
}, 10000);

// Wake lock implementation
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
    // Update portal status on visibility change
    if (isPortalURL()) {
        localStorage.setItem('portalActive', !document.hidden);
    }
});

requestWakeLock();
