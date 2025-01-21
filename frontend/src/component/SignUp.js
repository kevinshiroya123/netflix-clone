import React, { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports
import "./SignUp.css";
import eyeIcon from "../assets/eye.svg"; // Add an eye icon image in /assets folder

// Initialize Firestore
const db = getFirestore();

function SignUp({ email, setShowSignUp, handleGoogleSignIn }) {
  const navigate = useNavigate(); // ✅ Add useNavigate for redirection
  const [userEmail, setUserEmail] = useState(email || ""); // Prefilled email can be edited
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      // ✅ Save user data to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: name, // ✅ Save full name
        email: user.email,
      });

      // ✅ Create default profile under users/{uid}/profiles/default-profile
      const profileRef = doc(db, "users", user.uid, "profiles", "default-profile");
      await setDoc(profileRef, {
        name: name, // ✅ Use same full name
        createdAt: new Date(),
      });

      alert("Sign Up Successful! Welcome to Netflix.");
      
      // ✅ Redirect to Profile Page After Successful Sign-Up
      navigate("/profile"); 
      
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignUp}>
        <input
          className="input"
          type="email"
          placeholder="Email address"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            className="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="eye-button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={eyeIcon} alt="Show Password" />
          </button>
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>

      <p className="or-divider">OR</p>
      <button className="google-signup-button" onClick={handleGoogleSignIn}>
        Sign In with Google
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SignUp;
