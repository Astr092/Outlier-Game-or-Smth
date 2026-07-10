// ==========================
// Firebase Imports
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ==========================
// Firebase Configuration
// Replace these values with
// the ones from YOUR project.
// ==========================

const firebaseConfig = {

    apiKey: "AIzaSyAJAN7RGhEFTQH3uhafZWeWyiMQ6JgZq4g",

    authDomain: "random-outlier-chooser-or-smth.firebaseapp.com",

    projectId: "random-outlier-chooser-or-smth",

    storageBucket: "random-outlier-chooser-or-smth.firebasestorage.app",

    messagingSenderId: "855120747079",

    appId: "1:855120747079:web:71e38d9a3fc20c96d76f62"

};

// ==========================
// Initialize Firebase
// ==========================

const app = initializeApp(firebaseConfig);


// ==========================
// Services
// ==========================

const db = getFirestore(app);

const auth = getAuth(app);


// ==========================
// Export Services
// ==========================

export {

    db,

    auth

};