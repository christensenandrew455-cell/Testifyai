import * as admin from "firebase-admin";

let adminApp;

if (!admin.apps.length) {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
} else {
  adminApp = admin.app();
}

export const adminDb = adminApp.firestore();
