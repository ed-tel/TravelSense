import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlMPJ4sE0X1K3VlQh5Kma9ud3dV_u7oD4",
  authDomain: "travelsense-6d151.firebaseapp.com",
  projectId: "travelsense-6d151",
  storageBucket: "travelsense-6d151.appspot.com", // ✅ fixed typo: it was .app
  messagingSenderId: "1053779257703",
  appId: "1:1053779257703:web:d85ce7df8ab2cf2225a7c2",
  measurementId: "G-W8JWYKL58Y"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
