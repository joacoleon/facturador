import admin from "firebase-admin";
import serviceAccount from "./facturadorFirebaseAdminKey.json" assert { type: "json" }; // Import the Firebase private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;