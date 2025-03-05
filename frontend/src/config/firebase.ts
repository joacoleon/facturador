import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp6uoeiROHblKO5AIMdi3n5p2tlLCD8-o",
  authDomain: "facturador-b6007.firebaseapp.com",
  projectId: "facturador-b6007",
  storageBucket: "facturador-b6007.firebasestorage.app",
  messagingSenderId: "988083848181",
  appId: "1:988083848181:web:5c8b9bb568a759dab596bc"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };