import admin from "firebase-admin";
import serviceAccount from "./facturadorFirebaseAdminKey.json"; // Import the Firebase private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;