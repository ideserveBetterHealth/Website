import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./LandingPageBar.css";
import { useEffect, useState } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function LandingPageNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  function navigateHandler(path) {
    setIsMenuOpen(false);
    window.location.href = path;
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Better Health
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/services" className="nav-link">
            Services
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <a
            href="https://calendar.app.google/qujMmj8A5HsCNCJT8"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            Request a Call Back
          </a>
        </div>

        {/* Mobile Navigation using shadcn UI */}
        <div className="mobile-only">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded border-none shadow-none hover:text-bold"
              >
                <Menu className="text-black dark:text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col z-[1001]">
              <SheetHeader className="flex flex-row items-center justify-between mt-5">
                <SheetTitle>Better Health</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <Separator />
              <nav className="flex flex-col space-y-4">
                <span>
                  <Button
                    onClick={() => navigateHandler("/")}
                    variant="outline"
                    className="w-full bg-[#fffae3] hover:bg-[#f0f4ff] text-[#000080] font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-2 border-[#000080]"
                  >
                    Home
                  </Button>
                </span>
                <span>
                  <Button
                    onClick={() => navigateHandler("/services")}
                    variant="outline"
                    className="w-full bg-[#fffae3] hover:bg-[#f0f4ff] text-[#000080] font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-2 border-[#000080]"
                  >
                    Services
                  </Button>
                </span>
                <span>
                  <Button
                    onClick={() => navigateHandler("/login")}
                    variant="outline"
                    className="w-full bg-[#fffae3] hover:bg-[#f0f4ff] text-[#000080] font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-2 border-[#000080]"
                  >
                    Login
                  </Button>
                </span>
                <span>
                  <a
                    href="https://calendar.app.google/qujMmj8A5HsCNCJT8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-[#ec5228] hover:bg-[#d44920] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-none">
                      Request a Call Back
                    </Button>
                  </a>
                </span>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export function LandingPageFooter() {
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
              Empowering individuals with accessible mental health and wellness
              services. Better Health is committed to making quality healthcare
              solutions available for everyone.
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

function LandingPage() {
  return (
    <div className="app">
      <ScrollToTop />
      <LandingPageNavbar />
      <main>
        <Outlet />
      </main>
      <LandingPageFooter />
    </div>
  );
}

export default LandingPage;
