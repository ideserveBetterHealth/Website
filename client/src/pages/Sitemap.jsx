import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SitemapSection = ({ title, items }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4" style={{ color: "#000080" }}>
      {title}
    </h2>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index}>
          <Link
            to={item.path}
            className="block p-3 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md group"
          >
            <h3 className="font-semibold text-lg group-hover:text-[#ec5228] transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

SitemapSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const Sitemap = () => {
  const sitemapData = {
    main: [
      { title: "Home", path: "/", description: "Welcome to Better Health" },
      {
        title: "About Us",
        path: "/about-us",
        description: "Learn about our mission and team",
      },
      {
        title: "Services",
        path: "/services",
        description: "Explore our healthcare services",
      },
      { title: "Career", path: "/career", description: "Join our team" },
    ],
    services: [
      {
        title: "Mental Health Counselling",
        path: "/mental-health",
        description: "Professional mental health support",
      },
      {
        title: "Cosmetology Services",
        path: "/cosmetology",
        description: "Expert cosmetology treatments",
      },
    ],
    support: [
      {
        title: "Financial Aid",
        path: "/financial-aid",
        description: "Financial assistance programs",
      },
    ],
    account: [
      { title: "Login", path: "/login", description: "Access your account" },
      {
        title: "Dashboard",
        path: "/dashboard",
        description: "View your dashboard (requires login)",
      },
    ],
    legal: [
      {
        title: "Privacy Policy",
        path: "/privacy-policy",
        description: "Our privacy practices",
      },
      {
        title: "Terms & Conditions",
        path: "/terms-conditions",
        description: "Terms of service",
      },
      {
        title: "Refund & Cancellation Policy",
        path: "/refund-cancellation-policy",
        description: "Our refund policy",
      },
    ],
  };

  return (
    <div style={{ backgroundColor: "#fffae3" }} className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#000080" }}
          >
            Site Map
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Navigate through all pages and services available on Better Health
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <SitemapSection title="Main Pages" items={sitemapData.main} />
          </div>

          {/* Services */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <SitemapSection title="Our Services" items={sitemapData.services} />
          </div>

          {/* Support */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <SitemapSection title="Support" items={sitemapData.support} />
          </div>

          {/* Account */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <SitemapSection title="Account" items={sitemapData.account} />
          </div>

          {/* Legal */}
          <div className="bg-white p-6 rounded-xl shadow-sm col-span-full lg:col-span-2">
            <SitemapSection
              title="Legal & Policies"
              items={sitemapData.legal}
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link
              to="/about-us"
              className="font-semibold hover:underline"
              style={{ color: "#ec5228" }}
            >
              Contact us
            </Link>{" "}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
