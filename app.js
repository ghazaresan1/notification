async function requestNotificationPermission() {
    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
        const deviceToken = generateDeviceToken();
        const registration = await registerServiceWorker();
        
        registration.active.postMessage({
            fcmToken: deviceToken
        });
    }
}

function generateDeviceToken() {
    return 'device_' + Math.random().toString(36).substr(2, 9);
}

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/notification/service-worker.js', {
        scope: '/notification/'
    });
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
}

requestNotificationPermission();
