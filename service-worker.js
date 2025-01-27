const API_BASE_URL = 'https://app.ghazaresan.com';
const SECURITY_KEY = 'Asdiw2737y#376';
const PROJECT_ID = 'ordernotifier-9fabc';
const CLIENT_EMAIL = 'firebase-adminsdk-ut04s@ordernotifier-9fabc.iam.gserviceaccount.com';
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZkOFd4acTnPxu\nu5zy/j5sBwptwwVRDX/lEQKFBY2uMscRL/tvOCdQkTuPG+OvSaHxgG380LVec6I0\naqpl+Wm2W2lN3RnI/kx9ipWxHjoQVALoK5/qvj1E3/vddtzpCPk4JOvCW7poCd2j\n21swDDNo8HlXRhYaso79QNDWiens4sotZ5jhB2fK+G5VySK4UWwiziQc7XmMeADx\nN3ATggL/aV7PbkjGVXgPSLSIsmTVIfzpEjCAEXehzg7SgqZvkoPhty+fZ3bTyQ+3\nQfjQwR/lqKj73Lf899NL4CRN4MXa5+iVz1BMnW0lnbuM2AyKVrsKouyAi2Ab7kZU\nP90yZlC/AgMBAAECggEAYftws8IrZ5bczNXrojfETwyAstwQqeclgTk+5D+TBi/S\nHTh5ySYF9q/hndrWmJvVthi78A7ij64OEAM1yIUiCcFzVGDN+woj0qo2LjVJuw7K\n3FrBQ4v3tewV1zBv3vdunc1q6/Y5ph9DVUc18xablJgwXZCv5cgiw4WMSAKGemr4\nLX3uNAL3+UorSnEs13VmufUVLjKgpVKkrQDqm+TpepyiARXHTxbCkyPdHFSJp6ma\n3p78/0wD/HORXXhPciLBWn8utX2tezsdYtvgmZt/WmmDybeT5PuvO/dm5sSqYxya\nHr3YA3dM/vpDPb/BDIWdOL9Civ/cdDO04n/uLICGmQKBgQDzLxx/HdexYWMEBZxE\nvxs/xNOKlhzN7mEsU3V//EruL98Lo2hMeTg45fhqYRvhX/Z6qnoQfODz1ycLXGCb\nxTo22WRiWrUSg4+pjkRhjhMuxWSxoIrIpL/cZTVdNqlWyw+LS7NTSr3qJp92C2fb\nQjRsvml5XtkGwE4BF0c/4ZhthQKBgQDlCCVE7C0Vp44Siki3JSiN4Xr3lsI/Y6uX\nOB2e5jANbwLockFKuooKw+p8aFSWAAFb/f6tAd77Hkuc+XHbQHuArDSkYBffaMYd\nDQrHhBPFEK4la4KqlZ9TST7Glg2/VDOZeyHwxChzyfX8gkVdPuHa2X6/ub2YP9Nv\nXSSZ16wGcwKBgQCKqa1NCj4oBYjJDU3qoTGvbdLVbfzkq207MieIn9o18JP09esN\n1/zn7LF2LwMPwoEvtq89YYd/Yon/31+y0oX8Kn8j2ebvtJahLt7s5W8otyNQaWNZ\nPx+rUwZXrUhnlge5/KM29iJONlGspJpGmnx8GSLZMuz6/YI8+wIEeeVJZQKBgQCA\n991EulmI4Bk4h3X664mym03LLbGkUFPHi2nimGxmpCRXED+D/RbOiRP5iiZXcRlS\n2+wVMACIF78sXaqnc+AXzOC3zwSiYTVuFnIDd3RKe+IUYD3sIOTe2VfoK4cCPj/w\nJU4vbcX5rbg+wHyezVIREng1Ljp9CTPeeeyqVLAh0QKBgGwB0Q00sx6hKG+uXSE5\nP1D8ge3Fb8oV7xPXri9N10Y6I5x865GxYabghahw7K1abP9erycYBsLPOw4CRnm8\nFjIk9j8gkWbJLlgBzx6oqd6lS6GW9K0EftmX/fcvAOdosbyLDSnbUF/U5MxyhptR\n7i/FiP44ZubijWFGenu7VuFD\n-----END PRIVATE KEY-----\n"; 

let activeUserFCMToken = null;
let checkOrdersInterval;

async function sendNotification(fcmToken) {
    const accessToken = await getGoogleAccessToken();
    
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            message: {
                token: fcmToken,
                notification: {
                    title: 'سفارش جدید',
                    body: 'یک سفارش جدید در انتظار تایید دارید'
                },
                android: {
                    priority: 'high',
                    notification: {
                        channel_id: "orders_channel"
                    }
                }
            }
        })
    });

    // Log the complete response for verification
    console.log("Access Token Used:", accessToken);
    console.log("Complete FCM Response:", await response.json());
    
    return response;
}


async function getGoogleAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    console.log("=== Starting JWT Generation ===");
    console.log("Timestamp:", now);
    console.log("CLIENT_EMAIL:", CLIENT_EMAIL);
    console.log("PRIVATE_KEY Details:", JSON.stringify({
        length: PRIVATE_KEY.length,
        firstChars: PRIVATE_KEY.substring(0, 50),
        lastChars: PRIVATE_KEY.substring(PRIVATE_KEY.length - 50)
    }, null, 2));

    const header = {
        alg: 'RS256',
        typ: 'JWT',
        kid: CLIENT_EMAIL
    };

    const payload = {
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
        iss: CLIENT_EMAIL,
        sub: CLIENT_EMAIL,
        scope: 'https://www.googleapis.com/auth/firebase.messaging'
    };

    console.log("JWT Components:", JSON.stringify({
        header: header,
        payload: payload
    }, null, 2));

    const base64UrlEncode = (input) => {
        let base64;
        if (input instanceof ArrayBuffer) {
            base64 = btoa(String.fromCharCode(...new Uint8Array(input)));
        } else {
            base64 = btoa(typeof input === 'string' ? input : JSON.stringify(input));
        }
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    console.log("Encoded Components:", JSON.stringify({
        header: encodedHeader,
        payload: encodedPayload,
        signatureInput: signatureInput
    }, null, 2));

    const cleanKey = PRIVATE_KEY
        .replace(/-----[^-]*-----/g, '')
        .replace(/[\n\r\s]/g, '');
    console.log("Cleaned Key Length:", cleanKey.length);
    console.log("First 50 chars of cleaned key:", cleanKey.substring(0, 50));

    const keyData = new Uint8Array(atob(cleanKey).split('').map(c => c.charCodeAt(0)));
    console.log("Key Data Length:", keyData.length);

    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        keyData,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' }
        },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        new TextEncoder().encode(signatureInput)
    );

    const signature = base64UrlEncode(signatureBuffer);
    const jwt = `${signatureInput}.${signature}`;

    console.log("Final JWT Details:", JSON.stringify({
        length: jwt.length,
        parts: {
            header: jwt.split('.')[0].length,
            payload: jwt.split('.')[1].length,
            signature: jwt.split('.')[2].length
        },
        firstChars: jwt.substring(0, 50)
    }, null, 2));

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const data = await response.json();
    console.log("Token Response:", JSON.stringify(data, null, 2));

    if (data.access_token) {
        return data.access_token;
    }
    throw new Error(`Token generation failed: ${JSON.stringify(data)}`);
}


async function signWithPrivateKey(input, privateKey) {
    // Convert the input string to bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // Clean and format the private key
    const pemContents = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');
    
    // Convert the key to binary format
    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    
    // Import the key with specific algorithm parameters
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
    
    // Generate the signature
    const signature = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        cryptoKey,
        data
    );
    
    // Convert signature to base64
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
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
