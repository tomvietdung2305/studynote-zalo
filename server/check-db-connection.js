const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

console.log('=== FIREBASE CONNECTION CHECK ===');

// 1. Check for serviceAccountKey.json
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (fs.existsSync(keyPath)) {
    console.log('✅ Found serviceAccountKey.json at:', keyPath);
    try {
        const serviceAccount = require(keyPath);
        console.log('ℹ️  Project ID in key file:', serviceAccount.project_id);
        console.log('ℹ️  Client Email:', serviceAccount.client_email);

        // Initialize
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
    } catch (e) {
        console.error('❌ Error reading key file:', e.message);
        process.exit(1);
    }
} else {
    console.log('❌ serviceAccountKey.json NOT FOUND in server directory.');
    console.log('   Expected path:', keyPath);
    process.exit(1);
}

// 2. Try to write to Firestore
const db = admin.firestore();

async function testWrite() {
    try {
        console.log('\nAttempting to write test document...');
        const docRef = await db.collection('test_connection').add({
            timestamp: new Date(),
            message: 'Connection check successful',
            user: 'dev_tool'
        });
        console.log('✅ Write SUCCESS!');
        console.log('   Collection: test_connection');
        console.log('   Document ID:', docRef.id);
        console.log('\n👉 Please check your Firebase Console > Firestore Database > "test_connection" collection.');
        console.log('   Make sure you are in Project:', JSON.parse(fs.readFileSync(keyPath)).project_id);
    } catch (error) {
        console.error('❌ Write FAILED:', error.message);
        if (error.code === 7) { // PERMISSION_DENIED
            console.error('   Reason: PERMISSION_DENIED. Check your Firestore Security Rules or IAM permissions.');
        }
    }
}

testWrite();
