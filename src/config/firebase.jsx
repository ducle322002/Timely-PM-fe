// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAosy2CUso1BlJEWdQZUNtl1zu-M0maOH8",
  authDomain: "timelypm-77504.firebaseapp.com",
  projectId: "timelypm-77504",
  storageBucket: "timelypm-77504.appspot.com",
  messagingSenderId: "550001108039",
  appId: "1:550001108039:web:f379946c90862ee753bd62",
  measurementId: "G-GZHPFPQDT3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

facebookProvider.setCustomParameters({
  display: "popup",
});
githubProvider.setCustomParameters({
  allow_signup: "false",
});

// Correct GitHub scopes
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");
githubProvider.addScope("repo"); // Keep this if you need access to repositories

export { auth, provider, signInWithPopup, facebookProvider, githubProvider };
