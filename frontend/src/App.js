import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./component/Home";
import SignIn from "./component/SignIn";
import Browse from "./component/Browse";
import Profile from "./component/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
