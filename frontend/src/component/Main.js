import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SignUp from "./SignUp"; // Import SignUp component
import { handleGoogleSignIn } from "./SignIn"; // Import Google Sign-In function
import "./Main.css";
import backgroundImage from "../image/Netflix-Hintergrund.webp";
import { useNavigate } from "react-router-dom";

function Main() {
  const location = useLocation();
  const prefilledEmail = location.state?.email || ""; // Get email from navigation state

  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState(prefilledEmail);
  const navigate = useNavigate(); // For redirecting

  const handleTryItNow = () => {
    setShowSignUp(true);
  };

  return (
    <div
      className="main-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>Unlimited films, TV programmes and more.</h1>
      <h2>Watch anywhere. Cancel at any time.</h2>

      <div className="input-container">
        {!showSignUp ? (
          <>
            <input
              className="input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="button" onClick={handleTryItNow}>TRY IT NOW</button>
          </>
        ) : (
          // Pass the `handleGoogleSignIn` function from SignIn.js
          <SignUp email={email} setShowSignUp={setShowSignUp} handleGoogleSignIn={() => handleGoogleSignIn(navigate, setShowSignUp)} />
        )}
      </div>
    </div>
  );
}

export default Main;
