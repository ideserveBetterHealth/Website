import { useState } from "react";
import { Link } from "react-router-dom";

const MentalHealth = () => {
  const [currentFaqIndex, setCurrentFaqIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const faqs = [
    {
      question: "What happens in the first session?",
      answer:
        "The first session is about understanding your needs and concerns. Your therapist will listen to you, ask questions, and work with you to create a personalized treatment plan.",
    },
    {
      question: "How do online sessions work?",
      answer:
        "Sessions are conducted via secure video call. Once booked, you'll receive a private link to join your session at the scheduled time.",
    },
    {
      question: "Is my information confidential?",
      answer:
        "Yes, absolutely. We maintain strict confidentiality and follow all professional ethics guidelines. Your privacy is our top priority.",
    },
    {
      question: "Can I reschedule my session?",
      answer:
        "Yes, you can reschedule up to 24 hours before your scheduled session without any additional charge.",
    },
  ];
  const changeFaq = (newIndex) => {
    setIsBlinking(true);
    setTimeout(() => {
      setCurrentFaqIndex(newIndex);
      setIsBlinking(false);
    }, 400); // Half of the animation duration
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
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="section-title">Mental Health Counselling</h1>
              <p className="section-subtitle">
                Your journey to better mental well-being starts here. Connect
                with our professional therapists who understand and care.
              </p>
            </div>
            <div className="hero-image">
              <img
                src="/mental-health-consultation.png"
                alt="Mental Health Consultation"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>{" "}
      {/* How to Register Section */}
      <section className="section section-bg-2">
        <div className="container">
          <h2 className="section-title text-center">How to Register</h2>
          <p className="section-subtitle text-center mb-12">
            Simple steps to start your mental wellness journey
          </p>
          <div className="registration-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="heading-3">Select a Plan</h3>
              <p className="body-text">
                Choose between our single session or discounted 3-session
                package
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="heading-3">Make Payment</h3>
              <p className="body-text">
                Proceed with secure payment using your preferred payment method
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="heading-3">Schedule Session</h3>
              <p className="body-text">
                Pick a convenient date and time for your counselling session
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Pricing Section */}
      <section className="section section-bg-1">
        <div className="container">
          <h2 className="section-title text-center">Pricing Plans</h2>
          <p className="section-subtitle text-center mb-12">
            Choose a plan that works best for you
          </p>
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-title">Single Session</h3>
                <div className="pricing-amount">
                  <span className="final-price">₹1,250</span>
                </div>
              </div>
              <div className="pricing-features">
                <p>
                  One personalized counselling session with a professional
                  therapist. Ideal for focused support, guidance, and mental
                  clarity.
                </p>
              </div>
              <Link
                className="cta-btn"
                to={"/make-payment/mental-Health-Counselling/single"}
              >
                <button className="w-full text-center">
                  Choose Single Session
                </button>
              </Link>
            </div>
            <div className="pricing-card recommended">
              <div className="best-value">Best Value</div>
              <div className="pricing-header">
                <h3 className="pricing-title">3 Sessions Pack</h3>
                <div className="pricing-amount">
                  <span className="original-price">₹3,750</span>
                  <span className="final-price">₹3,000</span>
                </div>
              </div>
              <div className="pricing-features">
                <p>
                  Three personalized counselling sessions with a professional
                  therapist. Perfect for long-term support and deeper progress.
                </p>
              </div>
              <Link
                className="cta-btn"
                to="/make-payment/mental-Health-Counselling/bundle"
              >
                <button className="w-full text-center">
                  Choose 3 Sessions Pack
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
            </button>{" "}
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

export default MentalHealth;
