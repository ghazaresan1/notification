const API_BASE_URL = 'https://app.ghazaresan.com';
const SECURITY_KEY = 'Asdiw2737y#376';
const PROJECT_ID = 'ordernotifier-9fabc';
const CLIENT_EMAIL = 'firebase-adminsdk-ut04s@ordernotifier-9fabc.iam.gserviceaccount.com';
const PRIVATE_KEY = '"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZkOFd4acTnPxu\nu5zy/j5sBwptwwVRDX/lEQKFBY2uMscRL/tvOCdQkTuPG+OvSaHxgG380LVec6I0\naqpl+Wm2W2lN3RnI/kx9ipWxHjoQVALoK5/qvj1E3/vddtzpCPk4JOvCW7poCd2j\n21swDDNo8HlXRhYaso79QNDWiens4sotZ5jhB2fK+G5VySK4UWwiziQc7XmMeADx\nN3ATggL/aV7PbkjGVXgPSLSIsmTVIfzpEjCAEXehzg7SgqZvkoPhty+fZ3bTyQ+3\nQfjQwR/lqKj73Lf899NL4CRN4MXa5+iVz1BMnW0lnbuM2AyKVrsKouyAi2Ab7kZU\nP90yZlC/AgMBAAECggEAYftws8IrZ5bczNXrojfETwyAstwQqeclgTk+5D+TBi/S\nHTh5ySYF9q/hndrWmJvVthi78A7ij64OEAM1yIUiCcFzVGDN+woj0qo2LjVJuw7K\n3FrBQ4v3tewV1zBv3vdunc1q6/Y5ph9DVUc18xablJgwXZCv5cgiw4WMSAKGemr4\nLX3uNAL3+UorSnEs13VmufUVLjKgpVKkrQDqm+TpepyiARXHTxbCkyPdHFSJp6ma\n3p78/0wD/HORXXhPciLBWn8utX2tezsdYtvgmZt/WmmDybeT5PuvO/dm5sSqYxya\nHr3YA3dM/vpDPb/BDIWdOL9Civ/cdDO04n/uLICGmQKBgQDzLxx/HdexYWMEBZxE\nvxs/xNOKlhzN7mEsU3V//EruL98Lo2hMeTg45fhqYRvhX/Z6qnoQfODz1ycLXGCb\nxTo22WRiWrUSg4+pjkRhjhMuxWSxoIrIpL/cZTVdNqlWyw+LS7NTSr3qJp92C2fb\nQjRsvml5XtkGwE4BF0c/4ZhthQKBgQDlCCVE7C0Vp44Siki3JSiN4Xr3lsI/Y6uX\nOB2e5jANbwLockFKuooKw+p8aFSWAAFb/f6tAd77Hkuc+XHbQHuArDSkYBffaMYd\nDQrHhBPFEK4la4KqlZ9TST7Glg2/VDOZeyHwxChzyfX8gkVdPuHa2X6/ub2YP9Nv\nXSSZ16wGcwKBgQCKqa1NCj4oBYjJDU3qoTGvbdLVbfzkq207MieIn9o18JP09esN\n1/zn7LF2LwMPwoEvtq89YYd/Yon/31+y0oX8Kn8j2ebvtJahLt7s5W8otyNQaWNZ\nPx+rUwZXrUhnlge5/KM29iJONlGspJpGmnx8GSLZMuz6/YI8+wIEeeVJZQKBgQCA\n991EulmI4Bk4h3X664mym03LLbGkUFPHi2nimGxmpCRXED+D/RbOiRP5iiZXcRlS\n2+wVMACIF78sXaqnc+AXzOC3zwSiYTVuFnIDd3RKe+IUYD3sIOTe2VfoK4cCPj/w\nJU4vbcX5rbg+wHyezVIREng1Ljp9CTPeeeyqVLAh0QKBgGwB0Q00sx6hKG+uXSE5\nP1D8ge3Fb8oV7xPXri9N10Y6I5x865GxYabghahw7K1abP9erycYBsLPOw4CRnm8\nFjIk9j8gkWbJLlgBzx6oqd6lS6GW9K0EftmX/fcvAOdosbyLDSnbUF/U5MxyhptR\n7i/FiP44ZubijWFGenu7VuFD\n-----END PRIVATE KEY-----\n"'; 

let activeUserFCMToken = null;
let checkOrdersInterval;

async function sendNotification(fcmToken) {
    try {
        const accessToken = await getGoogleAccessToken();
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                message: {
                    token: fcmToken,
                    notification: {
                        title: 'سفارش جدید',
                        body: 'یک سفارش جدید در انتظار تایید دارید'
                    },
                    android: {
                        priority: 'high'
                    }
                }
            })
        });
        return response.json();
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
}

async function getGoogleAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    const jwt = {
        iss: CLIENT_EMAIL,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
    };

    const base64Header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const base64Payload = btoa(JSON.stringify(jwt));
    const signedInput = `${base64Header}.${base64Payload}`;
    const signature = await signWithPrivateKey(signedInput, PRIVATE_KEY);
    const signedJwt = `${signedInput}.${signature}`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

async function signWithPrivateKey(input, privateKey) {
    // Remove quotes and convert PEM to binary
    const pemContent = privateKey.replace(/"/g, '');
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = pemContent
        .replace(pemHeader, '')
        .replace(pemFooter, '')
        .replace(/\n/g, '');
    
    // Convert base64 to binary
    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    
    const algorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: {name: 'SHA-256'},
    };
    
    const extractedKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        algorithm,
        false,
        ['sign']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    const signature = await crypto.subtle.sign(
        algorithm,
        extractedKey,
        data
    );
    
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
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
