import React from 'react';
import './Footer.css';
function Footer() {
  return (
    <footer className="footer">
      
      <p className="footer-title">
        Ready to watch? Enter your email to create or restart your membership.
      </p>
      <div className="footer-input-container">
        <input type="email" placeholder="Email address" className="footer-input" />
        <button className="footer-button">Get Started</button>
      </div>
      <p className="footer-question">Questions? Call <a>1-844-505-2993</a></p>
      <div className="footer-links">
        <div>
          <a href="/">FAQ</a>
          <a href="/">Account</a>
          <a href="/">Investor Relations</a>
          <a href="/">Netflix Shop</a>
          <a href="/">Buy gift cards</a>
        </div>
        <div>
          <a href="/">Help Centre</a>
          <a href="/">Media Centre</a>
          <a href="/">Jobs</a>
          <a href="/">Redeem gift cards</a>
          <a href="/">Ways to Watch</a>
        </div>
        <div>
          <a href="/">Terms of Use</a>
          <a href="/">Privacy</a>
          <a href="/">Corporate Information</a>
          <a href="/">Speed Test</a>
          <a href="/">Only on Netflix</a>
        </div>
        <div>
          <a href="/">Cookie Preferences</a>
          <a href="/">Contact Us</a>
          <a href="/">Legal Notices</a>
          <a href="/">Do not sell or share my personal information</a>
        </div>
      </div>
      <div className="footer-language">
        <button className="footer-language-button">🌐 English</button>
      </div>
    </footer>
  );
}

export default Footer;
