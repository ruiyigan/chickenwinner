// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCo63irwuAHvpweQ1sysgK7QHB6soxdB78",
    authDomain: "chicken-winners.firebaseapp.com",
    projectId: "chicken-winners",
    storageBucket: "chicken-winners.appspot.com",
    messagingSenderId: "210273186834",
    appId: "1:210273186834:web:a736e35e0fc0a2370e94cb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = getFirestore();

export {db, firebase}