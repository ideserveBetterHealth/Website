import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="section section-bg-1">
        <div className="container">
          <h1 className="main-heading">Our Services</h1>
          <p className="section-subtitle">
            Comprehensive healthcare solutions tailored to enhance your
            wellbeing
          </p>
        </div>
      </section>

      {/* Mental Health Counselling Section */}
      <section className="section section-bg-2">
        <div className="container">
          <div className="service-detail">
            <div className="service-content">
              <h2 className="section-title">Mental Health Counselling</h2>
              <p className="body-text">
                Our mental health counseling services provide professional
                support for various emotional and psychological challenges. Our
                professional therapists offer:
              </p>
              <ul className="service-list">
                <li>Individual/Couple counseling sessions</li>
                <li>Stress and anxiety management</li>
                <li>Depression treatment</li>
                <li>Relationship counselling</li>
                <li>Work-life balance guidance</li>
              </ul>
              <button
                className="cta-btn"
                onClick={() => navigate("/mental-health")}
              >
                Book an Appointment
              </button>
            </div>
            <div className="service-image">
              <img
                src={
                  import.meta.env.BASE_URL + "mental-health-consultation.png"
                }
                alt="Mental Health Counselling Session"
                className="service-detail-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cosmetologist Consultancy Section */}
      <section className="section section-bg-1">
        <div className="container">
          <div className="service-detail reverse">
            <div className="service-content">
              <h2 className="section-title">Cosmetologist Consultancy</h2>
              <p className="body-text">
                Our certified cosmetologists provide expert guidance for all
                your skincare and beauty needs. Our services include:
              </p>
              <ul className="service-list">
                <li>Personalized skincare routines</li>
                <li>Beauty treatment recommendations</li>
                <li>Product consultations</li>
                <li>Skin health assessment</li>
                <li>Anti-aging strategies</li>
              </ul>
              <button
                className="cta-btn"
                onClick={() => navigate("/cosmetology")}
              >
                Book an Appointment
              </button>
            </div>
            <div className="service-image">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetologist Consultancy"
                className="service-detail-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
