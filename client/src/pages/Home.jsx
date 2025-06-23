import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="page">
      <section className="section section-bg-1 home-section">
        <div className="container">
          <h1 className="main-heading">Better Health</h1>
          <p className="section-subtitle">Because you deserve Better Health</p>
          <div className="hero-buttons">
            <button
              className="cta-btn"
              onClick={() => {
                document.getElementById("services")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>
      <section id="services" className="section section-bg-2">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Professional healthcare solutions tailored to your needs
          </p>
          <div className="services-cards">
            <div className="service-card">
              {" "}
              <img
                src="/mental-health-consultation.png"
                alt="Mental Health Counselling Session"
                className="service-card-image"
              />
              <h3 className="heading-3">Mental Health Counselling</h3>
              <p className="body-text">
                Professional mental health support from professional therapists
                who understand your needs.
              </p>{" "}
              <button
                className="cta-btn"
                onClick={() => navigate("/mental-health")}
              >
                Register for Counselling
              </button>
            </div>
            <div className="service-card">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetologist Consultancy"
                className="service-card-image"
              />
              <h3 className="heading-3">Cosmetologist Consultancy</h3>
              <p className="body-text">
                Expert solution on skincare and beauty treatments from certified
                cosmetologists.
              </p>
              <button
                className="cta-btn"
                onClick={() => navigate("/cosmetology")}
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>{" "}
      <section className="section section-bg-1">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Us</h2>
          <p className="section-subtitle text-center mb-12">
            Experience healthcare excellence with our comprehensive approach
          </p>
          <div className="why-choose-grid">
            <div className="why-choose-card">
              <div className="why-choose-icon">👨‍⚕️</div>
              <h3 className="heading-4">Expert Professionals</h3>
              <p className="body-text">
                Our team consists of certified professionals with years of
                experience in their respective fields
              </p>
            </div>
            <div className="why-choose-card">
              <div className="why-choose-icon">🏠</div>
              <h3 className="heading-4">Comfort of Home</h3>
              <p className="body-text">
                Access quality healthcare services from the comfort and privacy
                of your own space
              </p>
            </div>
            <div className="why-choose-card">
              <div className="why-choose-icon">⚡</div>
              <h3 className="heading-4">Quick Response</h3>
              <p className="body-text">
                Get connected with healthcare professionals quickly with our
                efficient booking system
              </p>
            </div>
            <div className="why-choose-card">
              <div className="why-choose-icon">💝</div>
              <h3 className="heading-4">Personalized Care</h3>
              <p className="body-text">
                Receive tailored healthcare solutions that address your specific
                needs and concerns
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
