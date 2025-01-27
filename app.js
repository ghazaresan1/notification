async function initializeNotifications() {
    try {
        const registration = await registerServiceWorker();
        await registration.active || new Promise(resolve => {
            registration.addEventListener('activate', () => resolve(registration.active));
        });
        
        // The FCM token will be passed from Android app
        // No need to generate it here
        console.log("Service Worker is ready for messages");
    } catch (error) {
        console.log("Setup complete, waiting for token from Android");
    }
}

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/notification/service-worker.js', {
        scope: '/notification/'
    });
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
}

initializeNotifications();
