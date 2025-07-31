import React, { useState } from "react";
import { Link } from "react-router-dom";

const Cosmetology = () => {
  const [currentFaqIndex, setCurrentFaqIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const faqs = [
    {
      question: "What happens during a cosmetology consultation?",
      answer:
        "During your first consultation, our expert cosmetologist will assess your skin type, discuss your concerns, and analyze your current skincare routine. We'll then create a personalized treatment plan tailored to your specific needs and goals.",
    },
    {
      question: "How should I prepare for my consultation?",
      answer:
        "Come with a clean face without makeup if possible. Make a list of skincare products you currently use and any specific concerns you'd like to address. Photos of any skin issues are also helpful.",
    },
    {
      question: "What skin concerns do you address?",
      answer:
        "We address a wide range of concerns including acne, aging, pigmentation, dryness, sensitivity, and general skin health. Our cosmetologists are trained to handle various skin types and conditions.",
    },
    {
      question: "Do you recommend specific products?",
      answer:
        "Yes, we provide personalized product recommendations based on your skin type, concerns, and budget. We only suggest products that we believe will truly benefit your skin health.",
    },
  ];

  const changeFaq = (newIndex) => {
    setIsBlinking(true);
    setTimeout(() => {
      setCurrentFaqIndex(newIndex);
      setIsBlinking(false);
    }, 400);
  };

  const nextFaq = () => {
    const newIndex =
      currentFaqIndex === faqs.length - 1 ? 0 : currentFaqIndex + 1;
    changeFaq(newIndex);
  };

  const prevFaq = () => {
    const newIndex =
      currentFaqIndex === 0 ? faqs.length - 1 : currentFaqIndex - 1;
    changeFaq(newIndex);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in-up"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Content on left for desktop */}
            <div className="text-center lg:text-left lg:w-1/2 order-2 lg:order-1 animate-fade-in-left animation-delay-200 px-4 sm:px-0">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#000080] mb-6 lg:mb-8 hover:text-[#ec5228] transition-colors duration-300">
                Professional Cosmetology Services
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed animate-fade-in-up animation-delay-400">
                Experience personalized skincare consultations with our expert
                cosmetologists. Get professional guidance for achieving your
                best skin health.
              </p>
            </div>
            {/* Image on right for desktop */}
            <div className="mb-8 lg:mb-0 lg:w-1/2 order-1 lg:order-2 animate-fade-in-right animation-delay-600 px-4 sm:px-0">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetology Consultation"
                className="rounded-lg shadow-xl w-full max-w-2xl mx-auto lg:max-w-none hover:shadow-2xl hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Register Section */}
      <section className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 bg-white relative overflow-hidden animate-fade-in-up animation-delay-800">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#000080] mb-6 lg:mb-8 text-center animate-fade-in-up animation-delay-1000">
            How to Get Started
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 text-center mb-12 animate-fade-in-up animation-delay-1200 px-4 sm:px-0 max-w-3xl mx-auto">
            Begin your journey to healthier, more radiant skin in three simple
            steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-1400 max-w-xs mx-auto md:max-w-none">
              <div className="w-12 h-12 bg-[#ec5228] rounded-full flex items-center justify-center mb-4 mx-auto text-white text-xl font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                1
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-[#000080] text-center mb-4 hover:text-[#ec5228] transition-colors duration-300">
                Choose Your Service
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Select between a single consultation or our comprehensive
                skincare package
              </p>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-1600 max-w-xs mx-auto md:max-w-none">
              <div className="w-12 h-12 bg-[#ec5228] rounded-full flex items-center justify-center mb-4 mx-auto text-white text-xl font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                2
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-[#000080] text-center mb-4 hover:text-[#ec5228] transition-colors duration-300">
                Book Appointment
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Schedule a convenient time for your consultation with our expert
              </p>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up animation-delay-1800 max-w-xs mx-auto md:max-w-none">
              <div className="w-12 h-12 bg-[#ec5228] rounded-full flex items-center justify-center mb-4 mx-auto text-white text-xl font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                3
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-[#000080] text-center mb-4 hover:text-[#ec5228] transition-colors duration-300">
                Complete Assessment
              </h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Fill out our skin assessment form to help us understand your
                needs better
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in-up animation-delay-2000"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#000080] mb-6 lg:mb-8 text-center animate-fade-in-up animation-delay-2200">
            Our Packages
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 text-center mb-12 animate-fade-in-up animation-delay-2400 px-4 sm:px-0 max-w-3xl mx-auto">
            Choose the consultation package that suits your skincare needs
          </p>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center lg:items-stretch max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 sm:p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in-left animation-delay-2600 w-full max-w-md min-h-[350px] sm:min-h-[400px] lg:min-h-[480px] flex flex-col justify-center">
              <div className="mb-6 sm:mb-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000080] text-center mb-4 sm:mb-4 hover:text-[#ec5228] transition-colors duration-300">
                  Single Consultation
                </h3>
                <div className="text-center">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000080] transition-transform duration-300 hover:scale-110">
                    ₹250
                  </span>
                </div>
              </div>
              <div className="mb-6 sm:mb-8 flex-1 flex items-center">
                <p className="text-gray-700 text-center leading-relaxed text-sm sm:text-base">
                  One comprehensive 30-minute consultation with skin analysis,
                  personalized routine planning, and product recommendations.
                </p>
              </div>
              <Link
                className="block w-full bg-[#ec5228] text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-[#d14a22] hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                to={"/make-payment/cosmetologist-consultancy/single"}
              >
                <button className="w-full text-center">
                  Book Consultation
                </button>
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 sm:p-6 lg:p-8 shadow-lg border-2 border-[#ec5228] hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in-right animation-delay-2800 w-full max-w-md relative min-h-[350px] sm:min-h-[400px] lg:min-h-[480px] flex flex-col justify-center">
              <div className="absolute -top-3 -right-3 bg-[#ec5228] text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                Best Value
              </div>
              <div className="mb-6 sm:mb-6">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000080] text-center mb-4 sm:mb-4 hover:text-[#ec5228] transition-colors duration-300">
                  Complete Skin Journey
                </h3>
                <div className="text-center">
                  <span className="text-sm sm:text-lg text-gray-500 line-through block">
                    ₹750
                  </span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000080] transition-transform duration-300 hover:scale-110">
                    ₹500
                  </span>
                </div>
              </div>
              <div className="mb-6 sm:mb-8 flex-1 flex items-center">
                <p className="text-gray-700 text-center leading-relaxed text-sm sm:text-base">
                  Initial consultation plus two follow-up sessions to track
                  progress and adjust your skincare routine for optimal results.
                </p>
              </div>
              <Link
                className="block w-full bg-[#ec5228] text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-[#d14a22] hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                to={"/make-payment/cosmetologist-consultancy/bundle"}
              >
                <button className="w-full text-center">
                  Choose Complete Package
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 sm:py-20 sm:px-6 lg:px-8 bg-white relative overflow-hidden animate-fade-in-up animation-delay-3000">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#000080] mb-12 text-center animate-fade-in-up animation-delay-3200">
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-5xl mx-auto animate-fade-in-up animation-delay-3400 px-2 sm:px-0">
            <button
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#ec5228] text-white rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300"
              onClick={prevFaq}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 hover:-translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div
              className={`flex-1 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 min-h-[200px] sm:min-h-[220px] flex flex-col justify-center ${
                isBlinking ? "opacity-50" : "opacity-100"
              } hover:shadow-xl transition-all duration-300`}
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000080] mb-3 sm:mb-4 text-center hover:text-[#ec5228] transition-colors duration-300">
                {faqs[currentFaqIndex].question}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 text-center leading-relaxed">
                {faqs[currentFaqIndex].answer}
              </p>
            </div>
            <button
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#ec5228] text-white rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300"
              onClick={nextFaq}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {faqs.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentFaqIndex ? "bg-[#ec5228]" : "bg-gray-300"
                }`}
                onClick={() => changeFaq(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cosmetology;
