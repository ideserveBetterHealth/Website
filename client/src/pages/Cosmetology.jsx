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
    <div className="page">
      {/* Hero Section */}
      <section className="section section-bg-1 hero-section">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Content on left for desktop */}
            <div className="hero-content text-center lg:text-left lg:w-1/2 order-2 lg:order-1">
              <h1 className="section-title">
                Professional Cosmetology Services
              </h1>
              <p className="section-subtitle">
                Experience personalized skincare consultations with our expert
                cosmetologists. Get professional guidance for achieving your
                best skin health.
              </p>
            </div>
            {/* Image on right for desktop */}
            <div className="hero-image mb-8 lg:mb-0 lg:w-1/2 order-1 lg:order-2">
              <img
                src="https://skinstudio.ee/wp-content/uploads/2024/01/konsultatsioon-1.jpg"
                alt="Cosmetology Consultation"
                className="rounded-lg shadow-xl w-full max-w-2xl mx-auto lg:max-w-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Register Section */}
      <section className="section section-bg-2">
        <div className="container">
          <h2 className="section-title text-center">How to Get Started</h2>
          <p className="section-subtitle text-center mb-12">
            Begin your journey to healthier, more radiant skin in three simple
            steps
          </p>
          <div className="registration-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="heading-3">Choose Your Service</h3>
              <p className="body-text">
                Select between a single consultation or our comprehensive
                skincare package
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="heading-3">Book Appointment</h3>
              <p className="body-text">
                Schedule a convenient time for your consultation with our expert
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="heading-3">Complete Assessment</h3>
              <p className="body-text">
                Fill out our skin assessment form to help us understand your
                needs better
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section section-bg-1">
        <div className="container">
          <h2 className="section-title text-center">Our Packages</h2>
          <p className="section-subtitle text-center mb-12">
            Choose the consultation package that suits your skincare needs
          </p>
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-title">Single Consultation</h3>
                <div className="pricing-amount">
                  <span className="final-price">₹250</span>
                </div>
              </div>
              <div className="pricing-features">
                <p>
                  One comprehensive 30-minute consultation with skin analysis,
                  personalized routine planning, and product recommendations.
                </p>
              </div>
              <Link
                className="cta-btn"
                to={"/make-payment/cosmetologist-consultancy/single"}
              >
                <button className="w-full text-center">
                  Book Consultation
                </button>
              </Link>
            </div>
            <div className="pricing-card recommended">
              <div className="best-value">Best Value</div>
              <div className="pricing-header">
                <h3 className="pricing-title">Complete Skin Journey</h3>
                <div className="pricing-amount">
                  <span className="original-price">₹750</span>
                  <span className="final-price">₹500</span>
                </div>
              </div>
              <div className="pricing-features">
                <p>
                  Initial consultation plus two follow-up sessions to track
                  progress and adjust your skincare routine for optimal results.
                </p>
              </div>
              <Link
                className="cta-btn"
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
      <section className="section section-bg-2">
        <div className="container">
          <h2 className="section-title text-center">
            Frequently Asked Questions
          </h2>
          <div className="faq-carousel">
            <button className="faq-nav-btn prev" onClick={prevFaq}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className={`faq-item ${isBlinking ? "blink" : ""}`}>
              <h3>{faqs[currentFaqIndex].question}</h3>
              <p>{faqs[currentFaqIndex].answer}</p>
            </div>
            <button className="faq-nav-btn next" onClick={nextFaq}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="faq-dots">
              {faqs.map((_, index) => (
                <button
                  key={index}
                  className={`faq-dot ${
                    index === currentFaqIndex ? "active" : ""
                  }`}
                  onClick={() => changeFaq(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cosmetology;
