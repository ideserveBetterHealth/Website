import { useState } from "react";

const FinancialAid = () => {
  const [activeTab, setActiveTab] = useState("individual");

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="section hero-section financial-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="section-title">Apply for Financial Aid at Better Health</h1>
            <p className="section-subtitle">
              We believe quality healthcare should be accessible to everyone.
              Our comprehensive financial assistance programs are designed to
              support you when you need it most.
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <h3>95%</h3>
                <p>Success Rate</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <h3>70%</h3>
                <p>Average Discount</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <h3>24hrs</h3>
                <p>Fast Processing</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <h3>Many</h3>
                <p>Lives Impacted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section section-bg-2">
        <div className="container">
          <h2 className="section-title">Application Process</h2>
          <div className="process-timeline">
            <div className="process-card">
              <div className="process-icon">1</div>
              <div className="process-content">
                <h3>Gather Information</h3>
                <p>
                  Understand your eligibility by reviewing the program criteria. Collect necessary documents like ID proof, income details, academic records, and any supporting materials required for the application.
                </p>
              </div>
            </div>

            <div className="process-card">
              <div className="process-icon">2</div>
              <div className="process-content">
                <h3>Submit Application</h3>
                <p>Complete the online application form with accurate details. Upload the required documents and double-check all entries before submitting to avoid delays in processing.
                  <br />
                  <br />
                </p>
              </div>
            </div>

            <div className="process-card">
              <div className="process-icon">3</div>
              <div className="process-content">
                <h3>Get Approved</h3>
                <p>Our team will review your application and documents within 24 hours. Once approved, you will receive a confirmation call with further steps and instructions. Stay connected for any update.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-bg-1">
        <div className="container">
          <div className="cta-section">
            <h2 className="section-title">Ready to Get Started?</h2>
            <p>Take the first step towards affordable healthcare</p>
            <div className="cta-buttons">
              <button className="primary-btn">Apply Now</button>
            </div>
            <p className="help-text">
              Need help with your application?{" "}
              <a>Check out contact options below</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialAid;
