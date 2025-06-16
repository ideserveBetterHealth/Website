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
          {" "}
          <div className="footer-section">
            <img
              src="/Better Health EBG.png"
              alt="Better Health by ElevateBiz Group"
              className="footer-logo"
            />
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>{" "}
              <li>
                <Link to="/services">Our Services</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <Link to="/financial-aid">Financial Aid</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
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
              </div>{" "}
              <div className="contact-row">
                <a
                  href="mailto:hello@ideservebetterhealth.in"
                  className="contact-link"
                >
                  <span className="contact-icon">✉️</span>
                  <span>hello@ideservebetterhealth.in</span>
                </a>
              </div>
              <div className="social-buttons">
                <a
                  href="https://instagram.com/betterhealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button instagram"
                >
                  <img
                    src="/instagram.svg"
                    alt="Instagram"
                    className="social-icon"
                  />
                  Instagram
                </a>
                <a
                  href="https://linkedin.com/company/better-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button linkedin"
                >
                  <img
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    className="social-icon"
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
