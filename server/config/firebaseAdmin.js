import admin from 'firebase-admin';

const firebaseConfig = JSON.parse(Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64').toString('ascii'));

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: process.env.DATABASE_URL
});

//Initialize Firestore
const db = admin.firestore();

export { admin, db };