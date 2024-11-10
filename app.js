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

// Function to check if any portal tab exists
function checkPortalTab() {
    return new Promise(resolve => {
        // Create a temporary iframe to check portal URL
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://portal.ghazaresan.com';
        
        iframe.onload = () => {
            document.body.removeChild(iframe);
            resolve(true); // Portal is accessible
        };
        
        iframe.onerror = () => {
            document.body.removeChild(iframe);
            resolve(false); // Portal is not accessible
        };
        
        document.body.appendChild(iframe);
    });
}

// Set up periodic check
setInterval(async () => {
    const portalExists = await checkPortalTab();
    if (!portalExists && document.hidden) {
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
