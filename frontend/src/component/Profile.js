import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase auth
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./Profile.css";
import spinner from "../assets/spinner.gif"; // Import the spinner image
import Header from "./Header";

// Initialize Firestore
const db = getFirestore();

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [profile, setProfile] = useState(null); // Store user profile data

  useEffect(() => {
    const checkUserAuth = async () => {
      const user = auth.currentUser;

      // 🔥 Redirect to Sign-in if No User Logged In
      if (!user) {
        navigate("/signin");
        return;
      }

      try {
        // Fetch profile from Firestore
        const profileCollectionRef = collection(db, "users", user.uid, "profiles");
        const profileSnapshot = await getDocs(profileCollectionRef);

        if (!profileSnapshot.empty) {
          const profileData = profileSnapshot.docs[0].data();
          setProfile({ id: profileSnapshot.docs[0].id, ...profileData });
        } else {
          console.warn("No profile found for this user.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();

    // 🔥 Set timeout to auto-logout after 30 minutes (optional)
    const timeout = setTimeout(() => {
      auth.signOut();
      navigate("/signin");
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearTimeout(timeout);
  }, [navigate]);

  const handleProfileClick = () => {
    setIsAvatarClicked(true);

    // Simulate a delay before navigation
    setTimeout(() => {
      navigate("/browse");
    }, 2000);
  };

  return (
    <div className="profile-container">
      <Header />

      {loading ? (
        <div className="loading-spinner">
          <img src={spinner} alt="Loading..." />
        </div>
      ) : (
        <>
          <h1 className={!isAvatarClicked ? "visible" : "hidden"}>Who's watching?</h1>
          <div className={`profile-selection ${isAvatarClicked ? "center-avatar" : ""}`}>
            {profile ? (
              <div 
                className={`profile-card ${isAvatarClicked ? "shrink-avatar" : ""}`} 
                onClick={handleProfileClick}
              >
                {!isAvatarClicked && (
                  <img
                    className="profile-avatar"
                    src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`} // Auto-generate avatar from name
                    alt="User Profile"
                  />
                )}

                {isAvatarClicked && (
                  <div className="loading-spinner">
                    <img src={spinner} alt="Loading..." className="spinner-image" />
                    <img
                      className="profile-avatar small-avatar"
                      src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                      alt="User Profile"
                    />
                  </div>
                )}
                {!isAvatarClicked && <p>{profile.name}</p>}
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
