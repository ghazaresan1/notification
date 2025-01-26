const API_BASE_URL = 'https://app.ghazaresan.com';
const SECURITY_KEY = 'Asdiw2737y#376';

let activeUserFCMToken = null;
let checkOrdersInterval;

async function sendNotification(fcmToken) {
    try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Authorization': 'key=YOUR_SERVER_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: fcmToken,
                notification: {
                    title: 'سفارش جدید',
                    body: 'یک سفارش جدید در انتظار تایید دارید'
                },
                android: {
                    priority: 'high'
                }
            })
        });
        return response.json();
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
}


async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Authorization/Authenticate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'SecurityKey': SECURITY_KEY,
                'Referer': 'https://portal.ghazaresan.com/'
            },
            body: JSON.stringify({ UserName: username, Password: password })
        });
        
        const data = await response.json();
        console.log('Login response data:', data);
        
        if (data && data.Token) {
            startOrderChecks(data.Token);
            return data.Token;
        }
        throw new Error('Invalid credentials');
    } catch (error) {
        console.log('Login failed:', error.message);
        throw error;
    }
}

async function checkNewOrders(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Orders/GetOrders`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'authorizationcode': token,
                'content-type': 'application/json',
                'securitykey': SECURITY_KEY,
            },
            body: JSON.stringify({})
        });

        const orders = await response.json();
        if (Array.isArray(orders)) {
            const hasNewOrder = orders.some(order => order.Status === 0);
            if (hasNewOrder && activeUserFCMToken) {
                console.log("New order found, sending notification");
                await sendNotification(activeUserFCMToken);
            }
        }
    } catch (error) {
        console.error("Error checking orders:", error);
    }
}

function startOrderChecks(token) {
    if (checkOrdersInterval) {
        clearInterval(checkOrdersInterval);
    }
    checkNewOrders(token);
    checkOrdersInterval = setInterval(() => checkNewOrders(token), 30000);
}

self.addEventListener('message', event => {
    const { username, password, fcmToken } = event.data;
    if (username && password && fcmToken) {
        activeUserFCMToken = fcmToken;
        login(username, password);
    }
});

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});
