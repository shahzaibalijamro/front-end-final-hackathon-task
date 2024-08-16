import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD6HT5PD4Z9bhYfinWO2NHAf0_7YUJkmDI",
    authDomain: "frontend-final-hackathon.firebaseapp.com",
    projectId: "frontend-final-hackathon",
    storageBucket: "frontend-final-hackathon.appspot.com",
    messagingSenderId: "695105389982",
    appId: "1:695105389982:web:563c4d8de304db3bd9828f",
    measurementId: "G-9TFDZHJX9E"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);