async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        // Generate a unique token for this device
        const deviceToken = generateDeviceToken();
        const registration = await registerServiceWorker();
        
        // Send the token to service worker
        registration.active.postMessage({
            fcmToken: deviceToken
        });
    }
}

function generateDeviceToken() {
    // Generate a unique identifier for this device
    return 'device_' + Math.random().toString(36).substr(2, 9);
}

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/notification/service-worker.js', {
        scope: '/notification/'
    });
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
}

// Start the notification setup
requestNotificationPermission();
