import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB10Zq1NYObMWCFgssb0GyOfJDUeKmeaTs",
    authDomain: "authentication-4790c.firebaseapp.com",
    projectId: "authentication-4790c",
    storageBucket: "authentication-4790c.firebasestorage.app",
    messagingSenderId: "101625363872",
    appId: "1:101625363872:web:a90efc673f8da184de78c5",
    measurementId: "G-VPRCZ6VJMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics is only supported in browser
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(yes => {
        if (yes) analytics = getAnalytics(app);
    });
}

export { app, auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, analytics };
