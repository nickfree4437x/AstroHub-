// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAhBsngqiQJ2qUGzXPky0BzwvAGDMvv88",
  authDomain: "astrohub-72690.firebaseapp.com",
  projectId: "astrohub-72690",
  storageBucket: "astrohub-72690.appspot.com",
  messagingSenderId: "576079848627",
  appId: "1:576079848627:web:1bdcd4f2e584e6ed183cc6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
