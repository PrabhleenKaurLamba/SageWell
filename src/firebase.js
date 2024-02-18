// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getStorage } from "./firebase/storage"
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCK1JhypC57k0-ZaZCh0AF_m3Gr7-8C7W4",
    authDomain: "treehacks-8cd81.firebaseapp.com",
    projectId: "treehacks-8cd81",
    storageBucket: "treehacks-8cd81.appspot.com",
    messagingSenderId: "684110143182",
    appId: "1:684110143182:web:a617b98bc5ca0ac259ba9f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }; // Export the initialized Firebase app
