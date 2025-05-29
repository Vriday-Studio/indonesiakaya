import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
  apiKey: "AIzaSyBzpcea5tHKLnDLzoN4MBY3Rgwizn9znZA",
  authDomain: "arundaya-9fb69.firebaseapp.com",
  databaseURL: "https://arundaya-9fb69-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arundaya-9fb69",
  storageBucket: "arundaya-9fb69.appspot.com",
  messagingSenderId: "973011335469",
  appId: "1:973011335469:web:bb29a8e2ac0a1c12f93ba4",
  measurementId: "G-38MQ2H51R3"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);