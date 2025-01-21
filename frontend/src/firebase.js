import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut // ✅ Import signOut
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIC5BmZcwdAh7kyku6ruIbL3FdtXgIOgY",
  authDomain: "netflix-clone-e18e2.firebaseapp.com",
  projectId: "netflix-clone-e18e2",
  storageBucket: "netflix-clone-e18e2.appspot.com",
  messagingSenderId: "675890287015",
  appId: "1:675890287015:web:27e9ca0eba0b7fb354e682",
  measurementId: "G-62K57BSZ7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, provider, db };
