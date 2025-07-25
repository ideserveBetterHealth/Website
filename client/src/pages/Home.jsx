import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="page">
      <section
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden text-center py-16 px-6 sm:py-20 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-[#000080] text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-center leading-tight tracking-tight">
            Better Health
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            Because you deserve Better Health
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              className="bg-[#ec5228] text-white border-none rounded-lg px-6 py-3 text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#d14a22] hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
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
      <section
        id="services"
        className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-[#000080] text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed w-4/5 md:w-full">
            Professional healthcare solutions tailored to your needs
          </p>
          <div className="flex flex-col lg:flex-row gap-16 justify-center items-stretch mt-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 flex-1 max-w-lg min-w-80 flex flex-col items-center transition-all duration-300 gap-4 lg:gap-6 hover:-translate-y-2 hover:shadow-2xl">
              {" "}
              <img
                src="/mental-health-consultation.png"
                alt="Mental Health Counselling Session"
                className="w-full h-48 lg:h-64 object-cover rounded-xl shadow-md"
              />
              <h3 className="text-[#000080] text-xl font-bold mb-2 lg:mb-4 tracking-tight">
                Mental Health Counselling
              </h3>
              <p className="text-gray-600 mb-4 lg:mb-8 text-center leading-relaxed">
                Affordable mental health support from professional therapists
                who understand your needs.
              </p>{" "}
              <button
                className="bg-[#ec5228] text-white border-none rounded-lg px-6 py-3 text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#d14a22] hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/mental-health")}
              >
                Register for Counselling
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 flex-1 max-w-lg min-w-80 flex flex-col items-center transition-all duration-300 gap-4 lg:gap-6 hover:-translate-y-2 hover:shadow-2xl">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetologist Consultancy"
                className="w-full h-48 lg:h-64 object-cover rounded-xl shadow-md"
              />
              <h3 className="text-[#000080] text-xl font-bold mb-2 lg:mb-4 tracking-tight">
                Cosmetologist Consultancy
              </h3>
              <p className="text-gray-600 mb-4 lg:mb-8 text-center leading-relaxed">
                Expert solution on skincare and beauty treatments from certified
                cosmetologists.
              </p>
              <button
                className="bg-[#ec5228] text-white border-none rounded-lg px-6 py-3 text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#d14a22] hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/cosmetology")}
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>{" "}
      <section
        className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-[#000080] text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed w-4/5 md:w-full">
            Experience healthcare excellence with our comprehensive approach
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-8 justify-items-center">
            <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="text-3xl lg:text-4xl mb-3 lg:mb-4 inline-block">
                👨‍⚕️
              </div>
              <h3 className="text-[#000080] text-base lg:text-lg font-bold mb-2 lg:mb-3 tracking-tight">
                Expert Professionals
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                Our team consists of certified professionals with years of
                experience in their respective fields
              </p>
            </div>
            <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="text-3xl lg:text-4xl mb-3 lg:mb-4 inline-block">
                🏠
              </div>
              <h3 className="text-[#000080] text-base lg:text-lg font-bold mb-2 lg:mb-3 tracking-tight">
                Comfort of Home
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                Access quality healthcare services from the comfort and privacy
                of your own space
              </p>
            </div>
            <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="text-3xl lg:text-4xl mb-3 lg:mb-4 inline-block">
                ⚡
              </div>
              <h3 className="text-[#000080] text-base lg:text-lg font-bold mb-2 lg:mb-3 tracking-tight">
                Quick Response
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                Get connected with healthcare professionals quickly with our
                efficient booking system
              </p>
            </div>
            <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg w-full">
              <div className="text-3xl lg:text-4xl mb-3 lg:mb-4 inline-block">
                💝
              </div>
              <h3 className="text-[#000080] text-base lg:text-lg font-bold mb-2 lg:mb-3 tracking-tight">
                Personalized Care
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
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
