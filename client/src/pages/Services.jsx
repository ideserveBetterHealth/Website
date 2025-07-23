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
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Image on left for desktop */}
            <div className="service-image mb-8 lg:mb-0 lg:w-1/2">
              <img
                src={
                  import.meta.env.BASE_URL + "mental-health-consultation.png"
                }
                alt="Mental Health Counselling Session"
                className="service-detail-image w-full max-w-2xl mx-auto lg:max-w-none rounded-lg shadow-lg"
              />
            </div>
            {/* Content on right for desktop */}
            <div className="service-content text-center lg:text-left lg:w-1/2">
              <h2 className="section-title">Mental Health Counselling</h2>
              <p className="body-text">
                Our mental health counseling services provide professional
                support for various emotional and psychological challenges. Our
                professional therapists offer:
              </p>
              <ul className="service-list text-left max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                <li>Individual/Couple counseling sessions</li>
                <li>Stress and anxiety management</li>
                <li>Depression treatment</li>
                <li>Relationship counselling</li>
                <li>Work-life balance guidance</li>
              </ul>
              <button
                className="cta-btn mt-6"
                onClick={() => navigate("/mental-health")}
              >
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cosmetologist Consultancy Section */}
      <section className="section section-bg-1">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Content on left for desktop */}
            <div className="service-content text-center lg:text-left lg:w-1/2 order-2 lg:order-1">
              <h2 className="section-title">Cosmetologist Consultancy</h2>
              <p className="body-text">
                Our certified cosmetologists provide expert guidance for all
                your skincare and beauty needs. Our services include:
              </p>
              <ul className="service-list text-left max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                <li>Personalized skincare routines</li>
                <li>Beauty treatment recommendations</li>
                <li>Product consultations</li>
                <li>Skin health assessment</li>
                <li>Anti-aging strategies</li>
              </ul>
              <button
                className="cta-btn mt-6"
                onClick={() => navigate("/cosmetology")}
              >
                Book an Appointment
              </button>
            </div>
            {/* Image on right for desktop */}
            <div className="service-image mb-8 lg:mb-0 lg:w-1/2 order-1 lg:order-2">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetologist Consultancy"
                className="service-detail-image w-full max-w-2xl mx-auto lg:max-w-none rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
