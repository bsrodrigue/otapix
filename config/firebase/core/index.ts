// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: "four-pics-anime",
    storageBucket: "four-pics-anime.appspot.com",
    messagingSenderId: "631346840242",
    appId: "1:631346840242:web:d1eabee4a90a9392a07fab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);