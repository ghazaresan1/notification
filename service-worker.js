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
    // Convert PEM private key to CryptoKey
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = privateKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");
    const binaryDer = base64StringToArrayBuffer(pemContents);
    
    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaim = base64UrlEncode(JSON.stringify(claim));
    const signatureInput = `${encodedHeader}.${encodedClaim}`;
    
    const signature = await crypto.subtle.sign(
        { name: "RSASSA-PKCS1-v1_5" },
        cryptoKey,
        new TextEncoder().encode(signatureInput)
    );
    
    const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    return `${encodedHeader}.${encodedClaim}.${encodedSignature}`;
}

// Helper functions
function base64UrlEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
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

    const jwt = generateJWT(header, claim, serviceAccount.private_key);
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });
    
    const data = await response.json();
    return data.access_token;
}

async function sendNotification(fcmToken) {
    const accessToken = await getAccessToken();
    await fetch(`https://fcm.googleapis.com/v1/projects/${firebaseConfig.projectId}/messages:send`, {
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
        const loginData = {
            UserName: username,
            Password: password
        };

        const response = await fetch(`${API_BASE_URL}/api/Authorization/Authenticate`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'SecurityKey': SECURITY_KEY,
                'Referer': 'https://portal.ghazaresan.com/',
                'Origin': 'https://portal.ghazaresan.com'
            },
            mode: 'cors',
            body: JSON.stringify(loginData)
        });

        const text = await response.text();
        console.log('Response text:', text);
        
        // Parse response only if we have content
        if (text && text.length > 0) {
            const data = JSON.parse(text);
            if (data && (data.Token || data.Data?.Token)) {
                return data.Token || data.Data.Token;
            }
        }
        
        throw new Error('Token not found in response');
    } catch (error) {
        console.log('Full error details:', error);
        throw error;
    }
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
            await sendNotification(activeUserFCMToken);
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
