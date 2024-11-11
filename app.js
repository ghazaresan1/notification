// PWA status detection
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

// Store user preference in localStorage
function setAutoOpenPreference() {
    localStorage.setItem('allowAutoOpen', 'true');
}

// Check if auto-open is allowed
function isAutoOpenAllowed() {
    return localStorage.getItem('allowAutoOpen') === 'true';
}

// Portal activity check
function isPortalActive() {
    try {
        return window.top.location.href.includes('portal.ghazaresan.com');
    } catch {
        return false;
    }
}

// Initial setup to request permissions
async function setupPermissions() {
    if ('permissions' in navigator) {
        try {
            await navigator.permissions.query({ name: 'popup' });
            setAutoOpenPreference();
        } catch (error) {
            console.log('Permission setup:', error);
        }
    }
}

// Modified portal opener
function checkAndOpenPortal() {
    if (isPWA && document.hidden && !document.hasFocus() && !isPortalActive() && isAutoOpenAllowed()) {
        const newWindow = window.open('https://portal.ghazaresan.com/orderlist', '_blank');
        if (newWindow) {
            newWindow.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await setupPermissions();
    
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/notification/sw.js');
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    if (isPWA && !isPortalActive() && isAutoOpenAllowed()) {
        window.open('https://portal.ghazaresan.com/', '_blank');
    }

    setInterval(checkAndOpenPortal, 10000);
});

// Wake lock functionality
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
