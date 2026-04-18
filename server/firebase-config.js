const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase with service account key
// Download from Firebase Console → Project Settings → Service Accounts
let db, auth, storage;

try {
  const serviceAccount = require('./firebase-key.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "vick-lam-profile-cms.appspot.com"
  });

  db = admin.firestore();
  auth = admin.auth();
  storage = admin.storage();

  console.log('✅ Firebase initialized successfully');
} catch (err) {
  console.error('⚠️ Firebase initialization error:', err.message);
  console.log('💡 Tip: Make sure firebase-key.json exists in server directory');
}

module.exports = { db, auth, storage, admin };
