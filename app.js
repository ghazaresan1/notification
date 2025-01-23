// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCaBHVGco83IAgJVsaczVK8g7GBNPUVJig",
    projectId: "ordernotifier-9fabc",
    messagingSenderId: "921479042468"
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}
