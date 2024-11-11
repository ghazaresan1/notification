// Simple portal opener function
function openPortal() {
    window.open('https://portal.ghazaresan.com', '_blank');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initial portal open
    openPortal();
    
    // Set up unconditional periodic portal opening
    setInterval(openPortal, 10000);
});

// Wake Lock functionality to keep device awake
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock activated');
            
            // Reacquire wake lock if lost
            wakeLock.addEventListener('release', () => {
                requestWakeLock();
            });
            
            return wakeLock;
        } catch (err) {
            console.log('Wake Lock error:', err);
        }
    }
    return null;
}

// Keep requesting wake lock
setInterval(requestWakeLock, 1000);

// Initial wake lock request
requestWakeLock();
