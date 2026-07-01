import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYBwnq2vBW4lwcuPh17JuiXAXiW8wCSgc",
  authDomain: "teacher-majed-website.firebaseapp.com",
  projectId: "teacher-majed-website",
  storageBucket: "teacher-majed-website.firebasestorage.app",
  messagingSenderId: "538821922126",
  appId: "1:538821922126:web:0bd8aba737d981da28a21f"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
