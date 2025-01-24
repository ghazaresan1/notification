const AUTH_CACHE_NAME = 'auth-cache';
const API_BASE_URL = 'https://app.ghazaresan.com';
const SECURITY_KEY = 'Asdiw2737y#376';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCaBHVGco83IAgJVsaczVK8g7GBNPUVJig",
    projectId: "ordernotifier-9fabc",
    messagingSenderId: "921479042468"
};

// Service Account details
const serviceAccount = {
  "type": "service_account",
  "project_id": "ordernotifier-9fabc",
  "private_key_id": "5af47abe6538b5c7ee5e7bf22620d1ae84124675",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZkOFd4acTnPxu\nu5zy/j5sBwptwwVRDX/lEQKFBY2uMscRL/tvOCdQkTuPG+OvSaHxgG380LVec6I0\naqpl+Wm2W2lN3RnI/kx9ipWxHjoQVALoK5/qvj1E3/vddtzpCPk4JOvCW7poCd2j\n21swDDNo8HlXRhYaso79QNDWiens4sotZ5jhB2fK+G5VySK4UWwiziQc7XmMeADx\nN3ATggL/aV7PbkjGVXgPSLSIsmTVIfzpEjCAEXehzg7SgqZvkoPhty+fZ3bTyQ+3\nQfjQwR/lqKj73Lf899NL4CRN4MXa5+iVz1BMnW0lnbuM2AyKVrsKouyAi2Ab7kZU\nP90yZlC/AgMBAAECggEAYftws8IrZ5bczNXrojfETwyAstwQqeclgTk+5D+TBi/S\nHTh5ySYF9q/hndrWmJvVthi78A7ij64OEAM1yIUiCcFzVGDN+woj0qo2LjVJuw7K\n3FrBQ4v3tewV1zBv3vdunc1q6/Y5ph9DVUc18xablJgwXZCv5cgiw4WMSAKGemr4\nLX3uNAL3+UorSnEs13VmufUVLjKgpVKkrQDqm+TpepyiARXHTxbCkyPdHFSJp6ma\n3p78/0wD/HORXXhPciLBWn8utX2tezsdYtvgmZt/WmmDybeT5PuvO/dm5sSqYxya\nHr3YA3dM/vpDPb/BDIWdOL9Civ/cdDO04n/uLICGmQKBgQDzLxx/HdexYWMEBZxE\nvxs/xNOKlhzN7mEsU3V//EruL98Lo2hMeTg45fhqYRvhX/Z6qnoQfODz1ycLXGCb\nxTo22WRiWrUSg4+pjkRhjhMuxWSxoIrIpL/cZTVdNqlWyw+LS7NTSr3qJp92C2fb\nQjRsvml5XtkGwE4BF0c/4ZhthQKBgQDlCCVE7C0Vp44Siki3JSiN4Xr3lsI/Y6uX\nOB2e5jANbwLockFKuooKw+p8aFSWAAFb/f6tAd77Hkuc+XHbQHuArDSkYBffaMYd\nDQrHhBPFEK4la4KqlZ9TST7Glg2/VDOZeyHwxChzyfX8gkVdPuHa2X6/ub2YP9Nv\nXSSZ16wGcwKBgQCKqa1NCj4oBYjJDU3qoTGvbdLVbfzkq207MieIn9o18JP09esN\n1/zn7LF2LwMPwoEvtq89YYd/Yon/31+y0oX8Kn8j2ebvtJahLt7s5W8otyNQaWNZ\nPx+rUwZXrUhnlge5/KM29iJONlGspJpGmnx8GSLZMuz6/YI8+wIEeeVJZQKBgQCA\n991EulmI4Bk4h3X664mym03LLbGkUFPHi2nimGxmpCRXED+D/RbOiRP5iiZXcRlS\n2+wVMACIF78sXaqnc+AXzOC3zwSiYTVuFnIDd3RKe+IUYD3sIOTe2VfoK4cCPj/w\nJU4vbcX5rbg+wHyezVIREng1Ljp9CTPeeeyqVLAh0QKBgGwB0Q00sx6hKG+uXSE5\nP1D8ge3Fb8oV7xPXri9N10Y6I5x865GxYabghahw7K1abP9erycYBsLPOw4CRnm8\nFjIk9j8gkWbJLlgBzx6oqd6lS6GW9K0EftmX/fcvAOdosbyLDSnbUF/U5MxyhptR\n7i/FiP44ZubijWFGenu7VuFD\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ut04s@ordernotifier-9fabc.iam.gserviceaccount.com",
  "client_id": "117370332080384544670",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ut04s%40ordernotifier-9fabc.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
let activeUserFCMToken = null;
async function generateJWT(header, claim, privateKey) {
    // Add required JWT headers
    const fullHeader = {
        ...header,
        alg: 'RS256',
        typ: 'JWT',
        kid: serviceAccount.private_key_id
    };
    
    // Add required JWT claims
    const now = Math.floor(Date.now() / 1000);
    const fullClaim = {
        ...claim,
        iat: now,
        exp: now + 3600,
        aud: 'https://oauth2.googleapis.com/token'
    };
    
    const encoder = new TextEncoder();
    const keyData = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/[\r\n]/g, '')
        .trim();
    
    const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    
    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' }
        },
        false,
        ['sign']
    );
    
    const encodedHeader = base64UrlEncode(JSON.stringify(fullHeader));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullClaim));
    const toSign = `${encodedHeader}.${encodedPayload}`;
    
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        encoder.encode(toSign)
    );
    
    const encodedSignature = base64UrlEncode(
        String.fromCharCode(...new Uint8Array(signature))
    );
    
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}


function base64UrlEncode(input) {
    return btoa(input)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function base64StringToArrayBuffer(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const buffer = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        buffer[i] = rawData.charCodeAt(i);
    }
    return buffer;
}

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claim = {
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
    };

    const jwt = await generateJWT(header, claim, serviceAccount.private_key);
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });
    
    const data = await response.json();
    if (!data.access_token) {
        console.log('Token response:', data);
        throw new Error(`Token generation failed: ${JSON.stringify(data)}`);
    }
    return data.access_token;
}

async function sendNotification(fcmToken) {
    try {
        console.log("Getting access token for FCM...");
        const accessToken = await getAccessToken();
        console.log("Access token received:", accessToken);

        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${firebaseConfig.projectId}/messages:send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: {
                    token: fcmToken,
                    notification: {
                        title: 'سفارش جدید',
                        body: 'یک سفارش جدید در انتظار تایید دارید'
                    }
                }
            })
        });

        const result = await response.json();
        console.log("FCM Response:", result);
        
        if (!response.ok) {
            throw new Error(`FCM Error: ${result.error?.message || 'Unknown error'}`);
        }
        
        console.log("Notification sent successfully!");
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
}

self.addEventListener('message', event => {
    const { username, password, fcmToken } = event.data;
    if (username && password && fcmToken) {
        activeUserFCMToken = fcmToken;
        startLoginAndChecks(username, password);
    }
});

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
            const cache = await caches.open(AUTH_CACHE_NAME);
            await Promise.all([
                cache.put('auth-token', new Response(data.Token)),
                cache.put('restaurant-info', new Response(JSON.stringify({
                    name: data.RestaurantName,
                    canEditMenu: data.CanEditMenu
                })))
            ]);
            
            clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'loginResult',
                        success: true,
                        message: 'Login successful'
                    });
                });
            });
            
            startOrderChecks(data.Token);
            return data.Token;
        }
        
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'loginResult',
                    success: false,
                    message: 'Invalid credentials'
                });
            });
        });
        
        throw new Error('Invalid credentials');
    } catch (error) {
        console.log('Login failed:', error.message);
        throw error;
    }
}

let checkOrdersInterval;
function startOrderChecks(token) {
    console.log("Starting order checks with token:", token);
    if (checkOrdersInterval) {
        clearInterval(checkOrdersInterval);
    }
    
    checkNewOrders(token);
    
    checkOrdersInterval = setInterval(() => {
        checkNewOrders(token);
    }, 30000);
}

async function checkNewOrders(token) {
    try {
        console.log("Checking orders with token:", token);
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
        console.log("Orders response:", orders);
        
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
