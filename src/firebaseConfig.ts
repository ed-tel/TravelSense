// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlMPJ4sE0X1K3VlQh5Kma9ud3dV_u7oD4",
  authDomain: "travelsense-6d151.firebaseapp.com",
  projectId: "travelsense-6d151",
  storageBucket: "travelsense-6d151.firebasestorage.app",
  messagingSenderId: "1053779257703",
  appId: "1:1053779257703:web:d85ce7df8ab2cf2225a7c2",
  measurementId: "G-W8JWYKL58Y",
};

// ✅ Initialize Firebase app once
const app = initializeApp(firebaseConfig);

// ✅ Export core services (MUST come from the same `app`)
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// ✅ Social providers (optional scopes)
const googleProvider = new GoogleAuthProvider();

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");
facebookProvider.setCustomParameters({ display: "popup" });

// ✅ Export all for easy imports
export {
  app,
  auth,
  db,
  functions,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  storage,
};
