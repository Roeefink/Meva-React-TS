import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // if you need file uploads
// import { getAnalytics } from "firebase/analytics"; // only works in browser, not SSR

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0agkob_4x3W3u5l0dH6POBGs0nsSzbSw",
  authDomain: "mevamedical-dacc0.firebaseapp.com",
  projectId: "mevamedical-dacc0",
  storageBucket: "mevamedical-dacc0.firebasestorage.app",
  messagingSenderId: "555872346703",
  appId: "1:555872346703:web:6fc5eb6ea12476dea6c03a",
  measurementId: "G-7204692C8H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you’ll use
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const analytics = getAnalytics(app); // optional

/*
This what needed to be added:
for each react component where firebase is needed
import { auth, db } from "@/config/firebase";
*/