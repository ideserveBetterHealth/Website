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
import { Menu, Home, User, Phone, Settings } from "lucide-react";
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
    if (path === "/") {
      handleBrandClick({ preventDefault: () => {} });
    } else {
      window.location.href = path;
    }
  }

  function handleBrandClick(e) {
    e.preventDefault();
    if (location.pathname === "/") {
      // If already on home page, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If on different page, navigate to home and then scroll to top
      window.location.href = "/";
    }
  }

  return (
    <nav className="bg-white text-[#000080] w-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] sticky top-0 z-[1000] py-2">
      <div className="max-w-[1200px] mx-auto px-8 w-full flex justify-between items-center py-3">
        <a
          href="/"
          onClick={handleBrandClick}
          className="text-[1.8rem] font-bold tracking-[-0.5px] text-[#ec5228] no-underline"
        >
          Better Health
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/"
            onClick={handleBrandClick}
            className="text-[#000080] no-underline font-medium text-[1.1rem] transition-colors duration-200 relative group hover:text-[#ec5228]"
          >
            <span>Home</span>
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#ec5228] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <Link
            to="/services"
            className="text-[#000080] no-underline font-medium text-[1.1rem] transition-colors duration-200 relative group hover:text-[#ec5228]"
          >
            <span>Services</span>
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#ec5228] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/login"
            className="text-[#000080] no-underline font-medium text-[1.1rem] transition-colors duration-200 relative group hover:text-[#ec5228]"
          >
            <span>Login</span>
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#ec5228] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <a
            href="https://calendar.app.google/C1Vt32kQnuDFKTDS6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ec5228] text-white border-none rounded-lg px-6 py-3 text-[1.1rem] font-semibold cursor-pointer transition-all duration-300 shadow-[0_2px_4px_rgba(236,82,40,0.2)] hover:bg-[#d14a22] hover:translate-y-[-3px] hover:scale-105 hover:shadow-[0_8px_20px_rgba(236,82,40,0.4)]"
          >
            Request a Call Back
          </a>
        </div>

        {/* Mobile Navigation using shadcn UI */}
        <div className="block md:hidden">
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
            <SheetContent className="flex flex-col z-[1001] bg-[#fffae3]">
              <SheetHeader className="flex flex-row items-center justify-between mt-5">
                <SheetTitle className="text-[#000080]">
                  Better Health
                </SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <Separator className="bg-[#000080]/20" />
              <nav className="flex flex-col space-y-4">
                <span>
                  <Button
                    onClick={() => navigateHandler("/")}
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 text-[#000080] font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-[#000080]/30 flex items-center gap-3"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </span>
                <span>
                  <Button
                    onClick={() => navigateHandler("/services")}
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 text-[#000080] font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-[#000080]/30 flex items-center gap-3"
                  >
                    <Settings className="w-4 h-4" />
                    Services
                  </Button>
                </span>
                <span>
                  <Button
                    onClick={() => navigateHandler("/login")}
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 text-[#000080] font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-[#000080]/30 flex items-center gap-3"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </span>
                <span>
                  <a
                    href="https://calendar.app.google/C1Vt32kQnuDFKTDS6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-[#ec5228] hover:bg-[#d44920] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-none flex items-center gap-3">
                      <Phone className="w-4 h-4" />
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
    <footer className="mt-auto bg-[#fffae3] text-[#000080] w-full py-8 md:py-12 pb-3 md:pb-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] relative z-10">
      <div className="max-w-[1200px] mx-auto px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr] gap-6 md:gap-8 justify-between">
          {/* Logo and Description */}
          <div className="flex flex-col gap-2 md:gap-3 items-center md:items-start lg:pr-6">
            <img
              src="/Better Health EBG.png"
              alt="Better Health by ElevateBiz Group"
              className="max-w-[240px] h-auto mb-2 md:mb-4"
            />
            <p className="text-sm leading-relaxed text-[#444] mb-2 md:mb-4 max-w-[250px] lg:max-w-[320px] text-center md:text-left">
              Better Health empowers individuals by providing accessible and
              affordable mental health and wellness services. We're committed to
              making quality care available to everyone, without barriers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2 md:gap-3 text-center md:text-left">
            <h4 className="text-[#000080] text-[1.1rem] font-bold font-inter mb-2 md:mb-4 tracking-[-0.005em]">
              Explore
            </h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2 md:mb-3">
                <Link
                  to="/"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/about-us"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/services"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Our Services
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/mental-health"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Mental Health Counselling
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/cosmetology"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Cosmetology Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="flex flex-col gap-2 md:gap-3 text-center md:text-left">
            <h4 className="text-[#000080] text-[1.1rem] font-bold font-inter mb-2 md:mb-4 tracking-[-0.005em]">
              Help & Policies
            </h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-2 md:mb-3">
                <Link
                  to="/financial-aid"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Financial Aid
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/privacy-policy"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/terms-conditions"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/refund-cancellation-policy"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li className="mb-2 md:mb-3">
                <Link
                  to="/contact-us"
                  className="text-[#000080] no-underline transition-colors duration-200 text-sm hover:text-[#ec5228]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-2 md:gap-3 text-center md:text-left">
            <h4 className="text-[#000080] text-[1.1rem] font-bold font-inter mb-2 md:mb-4 tracking-[-0.005em]">
              Get In Touch
            </h4>
            <div className="flex flex-col gap-0.5 md:gap-1">
              <div className="m-0">
                <a
                  href="tel:+919799161609"
                  className="text-[#000080] no-underline text-sm flex items-center justify-center md:justify-start gap-[0.4rem] py-1 transition-colors duration-200 hover:text-[#ec5228]"
                >
                  <span className="text-sm text-[#000080]">📞</span>
                  <span>+91 9799161609</span>
                </a>
              </div>
              <div className="m-0">
                <a
                  href="https://wa.me/919981652533"
                  className="text-[#000080] no-underline text-sm flex items-center justify-center md:justify-start gap-[0.4rem] py-1 transition-colors duration-200 hover:text-[#ec5228]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm text-[#000080]">💬</span>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
              <div className="m-0">
                <a
                  href="mailto:hello@ideservebetterhealth.in"
                  className="text-[#000080] no-underline text-sm flex items-center justify-center md:justify-start gap-[0.4rem] py-1 transition-colors duration-200 hover:text-[#ec5228]"
                >
                  <span className="text-sm text-[#000080]">✉️</span>
                  <span>hello@ideservebetterhealth.in</span>
                </a>
              </div>

              {/* Social Media Buttons */}
              <div className="flex flex-col gap-2 mt-3 w-full items-center md:items-start">
                <p className="text-xs text-[#000080] font-medium mb-2">
                  Follow Us
                </p>
                <a
                  href="https://instagram.com/ideservebetterhealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-4 py-2 w-full max-w-[280px] md:max-w-[250px] border-none rounded-lg text-sm font-medium text-white no-underline shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-all duration-200 relative overflow-hidden hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                >
                  <img
                    src="/instagram.svg"
                    alt="Instagram"
                    className="w-4 h-4 brightness-0 invert"
                  />
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/better-health-official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-4 py-2 w-full max-w-[280px] md:max-w-[250px] border-none rounded-lg text-sm font-medium text-white no-underline shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-all duration-200 relative overflow-hidden bg-[#0077b5] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                >
                  <img
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    className="w-4 h-4 brightness-0 invert"
                  />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 md:mt-6 pt-3 md:pt-4 border-t border-[rgba(0,0,128,0.1)] text-sm text-[#000080]">
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
