// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaItAAYc756pdWxDKePXb4hYaDAU0Q6j8",
  authDomain: "stsweng-ecomp.firebaseapp.com",
  projectId: "stsweng-ecomp",
  storageBucket: "stsweng-ecomp.appspot.com",
  messagingSenderId: "1039740681641",
  appId: "1:1039740681641:web:05e9b463ce4638563198b8",
  measurementId: "G-2NPDLHZZXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);