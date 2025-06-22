import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAk4cvOVaLQPX_i7AfOXRYrAhI74irj7F0",
  authDomain: "grocery-b3df6.firebaseapp.com",
  projectId: "grocery-b3df6",
  storageBucket: "grocery-b3df6.firebasestorage.app",
  messagingSenderId: "777166633809",
  appId: "1:777166633809:web:98fdc05eaf7a1acb73f170",
  measurementId: "G-X0PXXKP3PJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;