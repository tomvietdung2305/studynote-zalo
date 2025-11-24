const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialize Firebase Admin SDK
// You must provide a serviceAccountKey.json file in the server directory
// or set the GOOGLE_APPLICATION_CREDENTIALS environment variable
try {
    const serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized');
} catch (error) {
    console.warn('Warning: serviceAccountKey.json not found. Firebase might not work locally without credentials.');
    // Fallback for Vercel environment variables if needed
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            })
        });
        console.log('Firebase Admin Initialized from Env Vars');
    }
}

const db = admin.firestore();

module.exports = db;
