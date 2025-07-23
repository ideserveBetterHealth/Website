import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <section
        className="section about-hero"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="section-title">About Better Health</h1>
            <p className="hero-text">
              We’re young, dedicated minds on a mission to make health services affordable and accessible because 
Everyone Deserves Better Health.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-bg-2 mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-vision-card">
              <h2 className="heading-2">Our Mission</h2>
              <p className="body-text">
                To revolutionize healthcare accessibility by providing
                high-quality, affordable online health services that empower
                individuals to take control of their well-being.
              </p>
            </div>

            <div className="mission-vision-card">
              <h2 className="heading-2">Our Vision</h2>
              <p className="body-text">
                A world where everyone has access to quality healthcare,
                regardless of their location or economic status.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-bg-1">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">🤝</span>
              <h3>Accessibility</h3>
              <p>
                Making healthcare services available to everyone through
                technology and innovation.
              </p>
            </div>

            <div className="value-card">
              <span className="value-icon">⭐</span>
              <h3>Quality</h3>
              <p>
                Maintaining the highest standards in healthcare service delivery
                and patient care.
              </p>
            </div>

            <div className="value-card">
              <span className="value-icon">🛡️</span>
              <h3>Trust</h3>
              <p>
                Building lasting relationships through transparency, integrity,
                and reliable service.
              </p>
            </div>

            <div className="value-card">
              <span className="value-icon">💡</span>
              <h3>Innovation</h3>
              <p>
                Continuously improving our services through technological
                advancements and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-bg-2">
        <div className="container">
          <h2 className="section-title">Get Started</h2>
          <div className="cta-section">
            <p className="body-text">
              Be part of our journey to transform healthcare accessibility.
              Whether you're a healthcare provider or someone seeking quality
              care, we welcome you to the Better Health family.
            </p>
            <button className="cta-btn" onClick={() => navigate("/services")}>
              Explore Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
