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

// Function to check if portal tab is active and focused
function isPortalActive() {
    return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const activeTab = tabs[0];
            resolve(activeTab && activeTab.url.includes('portal.ghazaresan.com') && !document.hidden);
        });
    });
}

// Set up periodic check
setInterval(async () => {
    const portalIsActive = await isPortalActive();
    if (!portalIsActive) {
        window.open('https://portal.ghazaresan.com/', '_blank');
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
