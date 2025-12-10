
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCXY15467fqcEWS-QHDKYxVOVTyTmKgWGs",
    authDomain: "react-todo-app-66420.firebaseapp.com",
    projectId: "react-todo-app-66420",
    storageBucket: "react-todo-app-66420.firebasestorage.app",
    messagingSenderId: "415288663644",
    appId: "1:415288663644:web:9b7adeb12d03489b1a9099",
    measurementId: "G-2564VV9XTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;