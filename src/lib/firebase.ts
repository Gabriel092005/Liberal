// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADdjOoKZuhzLFQiSXtYI6uEMw6naZGkhI",
  authDomain: "liberal-c2c86.firebaseapp.com",
  projectId: "liberal-c2c86",
  storageBucket: "liberal-c2c86.firebasestorage.app",
  messagingSenderId: "754008588356",
  appId: "1:754008588356:web:308a616287ecd9116dbc11",
  measurementId: "G-DPYCKZH78R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getAnalytics(app);