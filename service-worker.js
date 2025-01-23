const AUTH_CACHE_NAME = 'auth-cache';
const API_BASE_URL = 'https://app.ghazaresan.com';
const SECURITY_KEY = 'Asdiw2737y#376';

// Firebase config
const firebaseConfig = {
    apiKey: "your-api-key",
    projectId: "your-project-id",
    messagingSenderId: "your-sender-id"
};

let activeUserFCMToken = null;

// Handle incoming credentials from Android
self.addEventListener('message', event => {
    const { username, password, fcmToken } = event.data;
    if (username && password && fcmToken) {
        activeUserFCMToken = fcmToken;
        startLoginAndChecks(username, password);
    }
});

async function login(username, password) {
    const loginData = {
        UserName: username,
        Password: password
    };

    const response = await fetch(`${API_BASE_URL}/api/Authorization/Authenticate`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'SecurityKey': SECURITY_KEY,
            'Referer': 'https://portal.ghazaresan.com/'
        },
        body: JSON.stringify(loginData)
    });

    const data = await response.json();
    return data.Token;
}

async function checkNewOrders(token) {
    const response = await fetch(`${API_BASE_URL}/api/Orders/GetOrders`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'authorizationcode': token,
            'content-type': 'application/json',
            'referer': 'https://portal.ghazaresan.com/',
            'securitykey': SECURITY_KEY,
        },
        body: JSON.stringify({})
    });

    const orders = await response.json();
    
    if (Array.isArray(orders)) {
        const hasNewOrder = orders.some(order => order.Status === 0);
        if (hasNewOrder && activeUserFCMToken) {
            // Send Firebase notification
            await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Authorization': 'key=' + firebaseConfig.serverKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: activeUserFCMToken,
                    notification: {
                        title: 'سفارش جدید',
                        body: 'یک سفارش جدید در انتظار تایید دارید'
                    }
                })
            });
        }
    }
}

function startLoginAndChecks(username, password) {
    login(username, password).then(token => {
        setInterval(() => {
            checkNewOrders(token);
        }, 30000);
    });
}

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});
