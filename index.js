const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "ordernotifier-9fabc"
});

app.post('/send-notification', async (req, res) => {
    const { token } = req.body;
    await admin.messaging().send({
        token: token,
        notification: {
            title: 'سفارش جدید',
            body: 'یک سفارش جدید در انتظار تایید دارید'
        }
    });
    res.json({ success: true });
});
