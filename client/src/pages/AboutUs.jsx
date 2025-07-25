import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Clean heading section */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 lg:mb-6 leading-tight text-[#000080] animate-fade-in-up">
              About Better Health
            </h1>
            <div className="w-20 lg:w-24 h-1 bg-gradient-to-r from-[#000080] to-[#ec5228] mx-auto rounded-full mb-4 lg:mb-6 animate-fade-in-up animation-delay-200"></div>
            {/* <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Youth-Led Healthcare Initiative
            </p> */}
          </div>

          {/* Clean content cards */}
          <div className="space-y-6 lg:space-y-8">
            {/* First paragraph */}
            <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-400">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-[#000080] rounded-lg flex items-center justify-center mx-auto lg:mx-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white text-lg lg:text-xl">🚀</span>
                </div>
                <div className="flex-1">
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-center lg:text-left">
                    Better Health is a{" "}
                    <span className="font-semibold text-[#000080]">
                      youth-led initiative
                    </span>{" "}
                    created with one simple purpose to make health care most
                    accessible and affordable. We understand that life can be
                    overwhelming, and finding the right support shouldn't be
                    another challenge. That's why we offer affordable, online
                    mental health consultations with professional BH Associates
                    who truly care.
                  </p>
                </div>
              </div>
            </div>

            {/* Second paragraph */}
            <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-600">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-[#ec5228] rounded-lg flex items-center justify-center mx-auto lg:mx-0 transition-transform duration-300 hover:scale-110">
                  <span className="text-white text-lg lg:text-xl">✨</span>
                </div>
                <div className="flex-1">
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-center lg:text-left">
                    In addition to mental wellness, we believe in helping people
                    feel confident in their appearance. Our online cosmetology
                    services offer safe, professional care that helps
                    individuals feel good inside and out.
                  </p>
                </div>
              </div>
            </div>

            {/* Third paragraph */}
            <div className="bg-white rounded-xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-800">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-[#000080] to-[#ec5228] rounded-lg flex items-center justify-center mx-auto lg:mx-0 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                  <span className="text-white text-lg lg:text-xl">🌟</span>
                </div>
                <div className="flex-1">
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed text-center lg:text-left">
                    We are actively expanding our services to cover more areas
                    of health and well-being, reaching more people and
                    communities each day. At Better Health, we're not just a
                    platform,{" "}
                    <span className="font-semibold text-[#ec5228]">
                      we're a movement
                    </span>{" "}
                    to support your mind and body to feel easier, safer, and
                    kinder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 lg:p-8 xl:p-12 rounded-2xl shadow-lg border border-blue-100 animate-fade-in-left animation-delay-200 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#000080] rounded-full flex items-center justify-center mr-3 lg:mr-4 transition-transform duration-300 hover:rotate-360">
                  <span className="text-white text-lg lg:text-xl">🎯</span>
                </div>
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#000080]">
                  Our Mission
                </h2>
              </div>
              <div className="space-y-3 lg:space-y-4 text-gray-700 leading-relaxed">
                <p className="text-sm lg:text-base animate-fade-in-up animation-delay-600 transition-colors duration-300 hover:text-[#000080]">
                  Our mission is to{" "}
                  <span className="font-semibold text-[#000080]">
                    bridge the gap
                  </span>{" "}
                  between people and the care they deserve. We aim to create a
                  safe, stigma-free space where mental health support is easily
                  available, affordable, and provided by professionals you can
                  trust.
                </p>
                <p className="text-sm lg:text-base animate-fade-in-up animation-delay-800 transition-colors duration-300 hover:text-[#000080]">
                  We believe that no matter who you are or where you come from,
                  you should have access to services that make you feel better
                  emotionally, mentally, and physically.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 lg:p-8 xl:p-12 rounded-2xl shadow-lg border border-orange-100 animate-fade-in-right animation-delay-400 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#ec5228] rounded-full flex items-center justify-center mr-3 lg:mr-4 transition-transform duration-300 hover:rotate-360">
                  <span className="text-white text-lg lg:text-xl">🌟</span>
                </div>
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#000080]">
                  Our Vision
                </h2>
              </div>
              <div className="space-y-3 lg:space-y-4 text-gray-700 leading-relaxed">
                <p className="text-sm lg:text-base animate-fade-in-up animation-delay-700 transition-colors duration-300 hover:text-[#ec5228]">
                  We envision a world where{" "}
                  <span className="font-semibold text-[#ec5228]">
                    mental health is treated with the same importance as
                    physical health
                  </span>
                  . A world where support is available without long waiting
                  hours, overwhelming costs, or fear of judgment.
                </p>
                <p className="text-sm lg:text-base animate-fade-in-up animation-delay-900 transition-colors duration-300 hover:text-[#ec5228]">
                  Better Health is working towards building a future where every
                  person feels supported, seen, and cared for both in their
                  minds and in their self-confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#000080] mb-4 lg:mb-6 animate-fade-in-up animation-delay-200">
              Our Values
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-2 animate-fade-in-up animation-delay-400">
              These core principles guide everything we do and shape the way we
              serve our community
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Affordability */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-600">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">💰</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Affordability
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                We ensure our services are budget-friendly because healing
                should never be a luxury.
              </p>
            </div>

            {/* Accessibility */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-700">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">🤝</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Accessibility
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                With just a few clicks, you can connect with help, no long waits
                or travel required.
              </p>
            </div>

            {/* Quality Care */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-800">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">⭐</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Quality Care
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                We are committed to offering services that are professional,
                effective, and backed by qualified experts.
              </p>
            </div>

            {/* Trust */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-900">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Trust
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                We work only with professionals, so you know you're in safe
                hands.
              </p>
            </div>

            {/* Confidentiality */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-1000">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">🔒</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Confidentiality
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                Our privacy is our priority. We create a safe space where you
                can open up freely.
              </p>
            </div>

            {/* Growth */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-1100">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">📈</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Growth
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                We are committed to continuous improvement and expanding our
                services to better serve our community's evolving needs.
              </p>
            </div>

            {/* Whole-Person Wellness */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-1200">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">💝</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Whole-Person Wellness
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                We care about you as a whole - your mind, your body, and your
                confidence.
              </p>
            </div>

            {/* Education & Awareness */}
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in-up animation-delay-1300">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-teal-100 rounded-full flex items-center justify-center mb-3 lg:mb-4 mx-auto transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-lg lg:text-2xl">📚</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-[#000080] text-center mb-2 lg:mb-3">
                Education & Awareness
              </h3>
              <p className="text-gray-600 text-center text-xs lg:text-sm leading-relaxed">
                We promote mental health literacy through open conversations,
                awareness campaigns, and easy-to-understand information.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#000080] mb-4 lg:mb-6 animate-fade-in-up animation-delay-200">
              Get Started
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-2 animate-fade-in-up animation-delay-400">
              Be part of our journey to transform healthcare accessibility.
              Whether you're a healthcare provider or someone seeking quality
              care, we welcome you to the Better Health family.
            </p>
          </div>

          <div className="flex justify-center animate-fade-in-up animation-delay-600">
            <button
              className="bg-[#ec5228] text-white border-none rounded-lg px-8 py-4 text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#d14a22] hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
              onClick={() => navigate("/services")}
            >
              Explore Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
