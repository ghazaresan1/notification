// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCaBHVGco83IAgJVsaczVK8g7GBNPUVJig",
    projectId: "ordernotifier-9fabc",
    messagingSenderId: "921479042468",
    appId: "1:921479042468:web:YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Request notification permission
messaging.requestPermission()
    .then(() => {
        console.log('Notification permission granted.');
        return messaging.getToken();
    })
    .then(token => {
        console.log('FCM Token:', token);
    })
    .catch(err => {
        console.log('Unable to get permission to notify.', err);
    });

// Handle incoming messages when app is in foreground
messaging.onMessage((payload) => {
    console.log('Message received:', payload);
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/notification/service-worker.js', {
        scope: '/notification/'
    })
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Use the service worker with Firebase Messaging
        messaging.useServiceWorker(registration);
    })
    .catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
