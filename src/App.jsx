import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";
import "./index.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Better Health
        </Link>
        <button
          className={`navbar-mobile-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>{" "}
          <Link to="/services" className="nav-link">
            Services
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link className="cta-btn">Request a Call Back</Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo and Description */}
          <div className="footer-section">
            <img
              src="/Better Health EBG.png"
              alt="Better Health by ElevateBiz Group"
              className="footer-logo"
            />
            <p className="footer-logo-description">
              Empowering individuals with accessible mental health and wellness services. 
              Better Health is committed to making quality healthcare solutions available for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/services">Our Services</Link>
              </li>
              <li>
                <Link to="/mental-health">Mental Health Counselling</Link>
              </li>
              <li>
                <Link to="/cosmetology">Cosmetology Consultation</Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="footer-section">
            <h4>Help & Policies</h4>
            <ul>
              <li>
                <Link to="/financial-aid">Financial Aid</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-row">
                <a href="tel:+919799161609" className="contact-link">
                  <span className="contact-icon">📞</span>
                  <span>+91 9799161609</span>
                </a>
              </div>
              <div className="contact-row">
                <a
                  href="https://wa.me/919981652533"
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-icon">💬</span>
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
              <div className="contact-row">
                <a
                  href="mailto:hello@ideservebetterhealth.in"
                  className="contact-link"
                >
                  <span className="contact-icon">✉️</span>
                  <span>hello@ideservebetterhealth.in</span>
                </a>
              </div>
              
              {/* Social Media Buttons */}
              <div className="social-buttons">
                <a
                  href="https://instagram.com/ideservebetterhealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn instagram"
                >
                  <img
                    src="/instagram.svg"
                    alt="Instagram"
                    className="footer-social-icon"
                  />
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/better-health-official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn linkedin"
                >
                  <img
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    className="footer-social-icon"
                  />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Better Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
