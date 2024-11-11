// PWA status detection
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

// Simple portal opener function
function openPortal() {
    window.open('https://portal.ghazaresan.com', '_blank');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initial portal open
    openPortal();
    
    // Use multiple methods to ensure continuous execution
    setInterval(openPortal, 15000);
    
    // Backup interval using requestAnimationFrame
    function portalLoop() {
        openPortal();
        setTimeout(() => requestAnimationFrame(portalLoop), 15000);
    }
    requestAnimationFrame(portalLoop);
});

// Keep the PWA active using multiple wake strategies
async function stayAwake() {
    // Wake Lock
    if ('wakeLock' in navigator) {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', stayAwake);
        } catch (err) {}
    }
    
    // Keep CPU active
    function keepAlive() {
        const now = Date.now();
        while (Date.now() - now < 100) {} // Small CPU work
    }
    setInterval(keepAlive, 5000);
}

// Initialize stay awake functionality
stayAwake();

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Trigger portal open when app goes to background
        openPortal();
    }
    stayAwake();
});
