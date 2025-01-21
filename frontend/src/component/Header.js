import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, signOut } from "../firebase"; // Import Firebase auth
import { getFirestore, getDocs, collection } from "firebase/firestore";
import "./Header.css";

const db = getFirestore();

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < lastScrollY);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      try {
        const profileCollectionRef = collection(db, "users", auth.currentUser.uid, "profiles");
        const profileSnapshot = await getDocs(profileCollectionRef);

        if (!profileSnapshot.empty) {
          const profileData = profileSnapshot.docs[0].data();
          setProfile({ id: profileSnapshot.docs[0].id, ...profileData });
        } else {
          setProfile({ name: auth.currentUser.displayName || "User" }); // ✅ Fallback to user.displayName
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile({ name: auth.currentUser.displayName || "User" }); // ✅ Handle errors gracefully
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]); // ✅ Fetch profile only when user is available

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`header-container ${isVisible ? "visible" : "hidden"} ${location.pathname === "/profile" ? "profile-page" : ""}`}>
      <img
        className="logo always-visible"
        src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
        alt="Netflix Logo"
        onClick={() => navigate("/browse")}
      />

      {!authLoading && user && profile && (
        <div className="header-profile-container">
          <img
            className="profile-icon"
            src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`}
            alt="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-option" onClick={() => navigate("/profile")}>
                <img
                  className="profile-icon-small"
                  src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                  alt="Profile"
                />
                <span>{profile.name}</span>
              </div>
              <hr className="dropdown-divider" />
              <button className="signout-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {!authLoading && !user && (
        <button className="sign-in-button" onClick={() => navigate("/signin")}>
          Sign In
        </button>
      )}
    </div>
  );
}

export default Header;
