async function initializeNotifications() {
    const registration = await registerServiceWorker();
    
    // Generate a device token
    const deviceToken = 'device_' + Math.random().toString(36).substr(2, 9);
    
    // Send token to service worker
    registration.active.postMessage({
        fcmToken: deviceToken
    });
}

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/notification/service-worker.js', {
        scope: '/notification/'
    });
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
}

// Start the notification setup
initializeNotifications();
