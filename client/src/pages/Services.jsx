import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  return (
    <div className="page">
      {/* Hero Section */}
      <section className="section section-bg-1 animate-fade-in-up">
        <div className="container px-6 sm:px-6 lg:px-8">
          <h1 className="main-heading animate-fade-in-up animation-delay-200 text-3xl sm:text-4xl lg:text-5xl">
            Our Services
          </h1>
          <p className="section-subtitle animate-fade-in-up animation-delay-400 text-sm sm:text-base lg:text-lg px-4 sm:px-0">
            Comprehensive healthcare solutions tailored to enhance your
            wellbeing
          </p>
        </div>
      </section>

      {/* Mental Health Counselling Section */}
      <section className="section section-bg-2 animate-fade-in-up animation-delay-600">
        <div className="container px-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 gap-6">
            {/* Image on left for desktop */}
            <div className="service-image mb-6 lg:mb-0 lg:w-1/2 animate-fade-in-left animation-delay-800 px-4 sm:px-0">
              <img
                src={
                  import.meta.env.BASE_URL + "mental-health-consultation.png"
                }
                alt="Mental Health Counselling Session"
                className="w-full h-auto rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 max-w-xl sm:max-w-2xl mx-auto lg:max-w-none"
              />
            </div>
            {/* Content on right for desktop */}
            <div className="service-content text-center lg:text-left lg:w-1/2 animate-fade-in-right animation-delay-1000 px-4 sm:px-0">
              <h2 className="section-title hover:text-[#ec5228] transition-colors duration-300 text-xl sm:text-2xl lg:text-3xl">
                Mental Health Counselling
              </h2>
              <p className="body-text animate-fade-in-up animation-delay-1200 text-sm sm:text-base">
                Our mental health counseling services provide professional
                support for various emotional and psychological challenges. Our
                professional therapists offer:
              </p>
              <ul className="list-none p-0 my-6 text-left max-w-xl sm:max-w-2xl mx-auto lg:mx-0 lg:max-w-none animate-fade-in-up animation-delay-1400 text-sm sm:text-base">
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Individual/Couple counseling sessions
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Stress and anxiety management
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Depression treatment
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Relationship counselling
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Work-life balance guidance
                </li>
              </ul>
              <button
                className="cta-btn mt-6 hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                onClick={() => navigate("/mental-health")}
              >
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cosmetologist Consultancy Section */}
      <section className="section section-bg-1 animate-fade-in-up animation-delay-1800">
        <div className="container px-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 gap-6">
            {/* Content on left for desktop */}
            <div className="service-content text-center lg:text-left lg:w-1/2 order-2 lg:order-1 animate-fade-in-left animation-delay-2000 px-4 sm:px-0">
              <h2 className="section-title hover:text-[#ec5228] transition-colors duration-300 text-xl sm:text-2xl lg:text-3xl">
                Cosmetologist Consultancy
              </h2>
              <p className="body-text animate-fade-in-up animation-delay-2200 text-sm sm:text-base">
                Our certified cosmetologists provide expert guidance for all
                your skincare and beauty needs. Our services include:
              </p>
              <ul className="list-none p-0 my-6 text-left max-w-xl sm:max-w-2xl mx-auto lg:mx-0 lg:max-w-none animate-fade-in-up animation-delay-2400 text-sm sm:text-base">
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Personalized skincare routines
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Beauty treatment recommendations
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Product consultations
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Skin health assessment
                </li>
                <li className="my-3 pl-6 relative hover:text-[#ec5228] transition-colors duration-300 hover:translate-x-2 transform before:content-['•'] before:text-[#ec5228] before:absolute before:left-0">
                  Anti-aging strategies
                </li>
              </ul>
              <button
                className="cta-btn mt-6 hover:scale-110 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                onClick={() => navigate("/cosmetology")}
              >
                Book an Appointment
              </button>
            </div>
            {/* Image on right for desktop */}
            <div className="service-image mb-6 lg:mb-0 lg:w-1/2 order-1 lg:order-2 animate-fade-in-right animation-delay-2800 px-4 sm:px-0">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetologist Consultancy"
                className="w-full h-auto rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 max-w-xl sm:max-w-2xl mx-auto lg:max-w-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
