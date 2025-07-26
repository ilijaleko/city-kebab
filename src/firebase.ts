import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoo_R2CTF4UrpgnpMoxSdZo81BBafU8p8",
  authDomain: "city-kebab-91d86.firebaseapp.com",
  projectId: "city-kebab-91d86",
  storageBucket: "city-kebab-91d86.firebasestorage.app",
  messagingSenderId: "994254407736",
  appId: "1:994254407736:web:7d42ce93fc35ac67c17ecd",
  measurementId: "G-MVQV9M2Y6F",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
