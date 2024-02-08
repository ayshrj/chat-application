import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: AIzaSyD9SsBFOycSle5DPcP270mEvChu26c1T1I,
  authDomain: "chat-app-878be.firebaseapp.com",
  projectId: "chat-app-878be",
  storageBucket: "chat-app-878be.appspot.com",
  messagingSenderId: "986558642441",
  appId: "1:986558642441:web:11db5964017f491bf83bd8",
  measurementId: "G-WD05RTD9BV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
