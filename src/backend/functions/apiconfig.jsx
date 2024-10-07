// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDs1LWdGqoiNrZ76n--0GEJdlXJ9h2dhvk",
  authDomain: "postgradeportal.firebaseapp.com",
  databaseURL: "https://postgradeportal-default-rtdb.firebaseio.com",
  projectId: "postgradeportal",
  storageBucket: "postgradeportal.appspot.com",
  messagingSenderId: "407544586593",
  appId: "1:407544586593:web:5933cd7488225412e16520",
  measurementId: "G-DCN2GX8YPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);

export { functions };