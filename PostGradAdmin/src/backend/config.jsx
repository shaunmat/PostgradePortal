import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAY2tlLj3wojDcXZaqfG2_o2GE9PMM5sNI",
  authDomain: "postgradsystem-e090a.firebaseapp.com",
  projectId: "postgradsystem-e090a", 
  storageBucket: "postgradsystem-e090a.appspot.com",
  messagingSenderId: "961932972960",
  appId: "1:961932972960:web:346e3ad2481c0a4f5d8ac5",
  measurementId: "G-JKEYC42CPF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;