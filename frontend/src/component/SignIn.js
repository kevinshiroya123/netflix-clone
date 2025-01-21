import React, { useState } from "react";
import { auth, signInWithEmailAndPassword, signInWithPopup, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, collection, getDoc } from "firebase/firestore"; // Firestore imports
import backgroundImage from "../image/Netflix-Hintergrund.webp";
import eyeIcon from "../assets/eye.svg";
import "./SignIn.css";
import Header from "./Header";
import Footer from "./Footer";

// Initialize Firestore
const db = getFirestore();

// Function to Save User Data in Firestore
const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid); // Reference to users/{uid}
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // ✅ Create User Document
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email,
      });

      console.log("✅ User document created in Firestore!");
    }

    // ✅ Ensure Profile Exists in users/{uid}/profiles/{default-profile}
    const profileRef = doc(db, "users", user.uid, "profiles", "default-profile");
    const profileDoc = await getDoc(profileRef);

    if (!profileDoc.exists()) {
      await setDoc(profileRef, {
        name: user.displayName || "User",
        createdAt: new Date(),
      });

      console.log("✅ Default profile created inside profiles subcollection!");
    }
  } catch (error) {
    console.error("❌ Error saving user to Firestore:", error);
  }
};



// Google Sign-In Function
export const handleGoogleSignIn = async (navigate, setError) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Save User & Profile in Firestore
    await saveUserToFirestore(user);

    navigate("/profile"); // ✅ Redirect to Profile Page
  } catch (err) {
    console.error("❌ Google Sign-In Error:", err);
    setError("Google Sign-In failed. Try again.");
  }
};


function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Save User Data in Firestore
      await saveUserToFirestore(user);

      navigate("/profile"); // ✅ Redirect to Profile Page
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <style>{`.sign-in-button { display: none !important; }`}</style>

      <div className="signin-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="signin-box">
          <h1>Sign In</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSignIn}>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="password-container">
              <input className="password-input" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="eye-button" onClick={() => setShowPassword(!showPassword)}>
                <img src={eyeIcon} alt="Show Password" />
              </button>
            </div>
            <button type="submit" className="signin-button">Sign In</button>
          </form>

          <p className="or-divider">OR</p>
          <button className="google-signin-button" onClick={() => handleGoogleSignIn(navigate, setError)}>Sign in with Google</button>

          <p className="forgot-password">Forgot password?</p>
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <p className="signup-text">
            New to Netflix?{" "}
            <span className="signup-link" onClick={() => navigate("/")}>Sign up now.</span>
          </p>
        </div>
      </div>

      <Footer />
      <style>{`.footer-input-container, .footer-title { display: none !important; }`}</style>
    </div>
  );
}

export default SignIn;
