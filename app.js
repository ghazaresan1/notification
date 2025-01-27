async function initializeNotifications() {
    try {
        const registration = await registerServiceWorker();
        await registration.active || new Promise(resolve => {
            registration.addEventListener('activate', () => resolve(registration.active));
        });
        
        // Wait for Firebase Messaging
        const messaging = firebase.messaging();
        const fcmToken = await messaging.getToken();
        
        registration.active.postMessage({
            fcmToken: fcmToken
        });
    } catch (error) {
        console.error("Notification initialization error:", error);
    }
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
