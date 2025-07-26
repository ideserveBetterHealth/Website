import React from "react";

const TermsConditions = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "eligibility", title: "Eligibility & User Classification" },
    { id: "scope", title: "Scope of Services" },
    { id: "user-responsibilities", title: "User Responsibilities and Conduct" },
    { id: "payment", title: "Payment, Pricing & Refunds" },
    { id: "consultant-responsibilities", title: "Consultant Responsibilities" },
    { id: "data-handling", title: "Data Handling & Confidentiality" },
    {
      id: "third-party",
      title: "Use of Third-Party Services and Integrations",
    },
    { id: "liability", title: "Limitation of Liability and Disclaimers" },
    { id: "conduct", title: "User Conduct and Platform Rules" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "termination", title: "Termination of Services" },
    { id: "governing-law", title: "Governing Law and Dispute Resolution" },
    { id: "modification", title: "Modification of Terms" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="font-sans text-gray-600 leading-relaxed my-8 p-0 bg-[#fffae3] min-h-screen">
      <div className="flex w-full max-w-7xl mx-auto px-5 flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 lg:max-w-xs lg:pr-8 mb-5 lg:mb-0">
          <div className="nav">
            <ul className="list-none p-0 m-0 lg:sticky lg:top-5">
              {sections.map((section, index) => (
                <li key={section.id} className="py-2">
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }}
                    className="no-underline text-[#000080] text-base block py-1.5 font-semibold transition-colors duration-200 hover:underline hover:text-[#000080]"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-[#000080] text-4xl font-bold mb-8 text-center">
              Better Health Terms and Conditions
            </h1>
          </div>
          {/* Content Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <section
              id="introduction"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                1. Introduction
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Welcome to Better Health, a platform owned and operated by
                  ElevateBiz Group, a registered entity under the MSME scheme in
                  India. These Terms and Conditions ("Terms") govern your access
                  to and use of our website (www.ideservebetterhealth.in),
                  mobile site, and all related services, tools, and platforms
                  (collectively, the "Platform").
                </p>
                <p>
                  Better Health provides online services aimed at improving the
                  overall wellness of individuals through offerings such as
                  mental health counselling, cosmetologist consultations, and
                  other wellness-based services, which may be introduced from
                  time to time. All services are delivered exclusively online
                  via secure communication platforms.
                </p>
                <p>
                  By accessing, registering, or using any part of the Platform,
                  you confirm that you have read, understood, and agreed to be
                  bound by these Terms. If you do not agree with these Terms,
                  you must refrain from using the Platform or any of the
                  services offered.
                </p>
                <p>
                  These Terms apply to all users of the Platform, including
                  individuals seeking counselling, cosmetic, or wellness-related
                  support, parents or guardians booking services on behalf of
                  minors, and any other visitors or users of the site.
                </p>
              </div>
            </section>

            {/* Definitions */}
            <section
              id="definitions"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                2. Definitions
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  For the purposes of these Terms and Conditions, the following
                  terms shall have the meanings assigned below. These
                  definitions apply whether the terms are used in singular or
                  plural form.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      a. "Better Health"
                    </h3>
                    <p>
                      Refers to the online wellness platform operated by
                      ElevateBiz Group, offering mental health counselling,
                      cosmetologist consultations, and other related services
                      through the website www.ideservebetterhealth.in.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      b. "ElevateBiz Group"
                    </h3>
                    <p>
                      Refers to the registered business entity under the MSME
                      scheme, legally responsible for the operation of the
                      Better Health platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      c. "Platform"
                    </h3>
                    <p>
                      Means the website, mobile site, associated tools, and
                      digital interfaces provided by Better Health for offering
                      its services, including any login or scheduling systems.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      d. "User"
                    </h3>
                    <p>
                      Means any individual who visits, registers, or uses the
                      Platform or any of its services, including guardians
                      booking services for a minor.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      e. "Services"
                    </h3>
                    <p>
                      Refers to the range of wellness-related offerings provided
                      on the Platform, including online mental health
                      counselling, cosmetologist consultations, and future
                      services such as homeopathy, ayurveda, and related
                      wellness programs.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      f. "Consultant"
                    </h3>
                    <p>
                      Refers to licensed professionals (such as psychologists,
                      therapists, cosmetologists, or other healthcare providers)
                      who offer their expertise through the Platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      g. "Session"
                    </h3>
                    <p>
                      Refers to a scheduled interaction between a User and a
                      Consultant via the Platform's communication tools.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#000080] mb-3">
                      h. "Content"
                    </h3>
                    <p>
                      Includes all information, data, text, software, music,
                      sound, photographs, graphics, video, messages, or other
                      materials.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Eligibility & User Classification */}
            <section
              id="eligibility"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                3. Eligibility & User Classification
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Age Requirements
                  </h3>
                  <p>
                    Users must be at least 18 years of age to register and use
                    the Platform independently. Minors (under 18) may use the
                    services only with the consent and supervision of a parent
                    or legal guardian who agrees to be bound by these Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Legal Capacity
                  </h3>
                  <p>
                    By using the Platform, you represent that you have the legal
                    capacity to enter into a binding agreement and are not
                    prohibited from using the services under applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. User Categories
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Individual users seeking personal wellness services</li>
                    <li>Parents/guardians booking services for minors</li>
                    <li>
                      Professional consultants providing services through the
                      Platform
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Scope of Services */}
            <section id="scope" className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                4. Scope of Services
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Available Services
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Mental health counselling and therapy sessions</li>
                    <li>Cosmetology consultations and advice</li>
                    <li>
                      Future wellness services (Ayurveda, Homeopathy, etc.)
                    </li>
                    <li>Educational content and resources</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Service Limitations
                  </h3>
                  <p>
                    Services are provided for informational and wellness
                    purposes. They are not intended to replace professional
                    medical treatment or emergency care. In case of emergency,
                    contact local emergency services immediately.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Platform Availability
                  </h3>
                  <p>
                    While we strive for continuous availability, the Platform
                    may experience downtime for maintenance, updates, or
                    technical issues. We do not guarantee uninterrupted access.
                  </p>
                </div>
              </div>
            </section>

            {/* User Responsibilities and Conduct */}
            <section
              id="user-responsibilities"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                5. User Responsibilities and Conduct
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Account Security
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Maintain the confidentiality of your account credentials
                    </li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>
                      Accept responsibility for all activities under your
                      account
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Prohibited Activities
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Sharing false, misleading, or incomplete information
                    </li>
                    <li>
                      Engaging in harassment, discrimination, or abusive
                      behavior
                    </li>
                    <li>Attempting to hack, disrupt, or damage the Platform</li>
                    <li>Using the Platform for illegal activities</li>
                    <li>Impersonating another person or entity</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Content Guidelines
                  </h3>
                  <p>
                    Users must not upload, share, or transmit content that is
                    offensive, harmful, illegal, or violates others' rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment, Pricing & Refunds */}
            <section id="payment" className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                6. Payment, Pricing & Refunds
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Pricing
                  </h3>
                  <p>
                    Service prices are displayed on the Platform and may vary
                    based on the type of service, consultant, and session
                    duration. Prices are subject to change with notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Payment Methods
                  </h3>
                  <p>
                    We accept various payment methods including credit/debit
                    cards, digital wallets, and other secure payment options as
                    displayed during checkout.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Refund Policy
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Cancellations made 24+ hours before session: Full refund
                    </li>
                    <li>Cancellations made 12-24 hours before: 50% refund</li>
                    <li>Cancellations made less than 12 hours: No refund</li>
                    <li>
                      Technical issues preventing service delivery: Full refund
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Consultant Responsibilities */}
            <section
              id="consultant-responsibilities"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                7. Consultant Responsibilities
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Professional Standards
                  </h3>
                  <p>
                    Consultants must maintain their professional licenses,
                    certifications, and adhere to industry ethical standards.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Service Quality
                  </h3>
                  <p>
                    Consultants are expected to provide services professionally,
                    punctually, and in accordance with their expertise level.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Confidentiality
                  </h3>
                  <p>
                    Consultants must maintain strict confidentiality regarding
                    user information and session content, except as required by
                    law.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Handling & Confidentiality */}
            <section
              id="data-handling"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                8. Data Handling & Confidentiality
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Your privacy is important to us. Please refer to our Privacy
                  Policy for detailed information about how we collect, use, and
                  protect your personal data.
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Data Security
                  </h3>
                  <p>
                    We implement appropriate technical and organizational
                    measures to protect your personal data against unauthorized
                    access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Session Confidentiality
                  </h3>
                  <p>
                    All sessions are conducted with strict confidentiality.
                    Session recordings, if any, are stored securely and used
                    only for quality assurance and legal compliance purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section
              id="third-party"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                9. Use of Third-Party Services and Integrations
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  The Platform may integrate with third-party services for
                  payment processing, communication, and other functionalities.
                  These integrations are governed by the respective third
                  parties' terms and privacy policies.
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Third-Party Responsibility
                  </h3>
                  <p>
                    We are not responsible for the practices, content, or
                    services of third-party providers. Users interact with
                    third-party services at their own risk.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Integration Changes
                  </h3>
                  <p>
                    We reserve the right to add, modify, or remove third-party
                    integrations as needed for Platform functionality and
                    security.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section
              id="liability"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                10. Limitation of Liability and Disclaimers
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Service Disclaimer
                  </h3>
                  <p>
                    Services are provided "as is" without warranties of any
                    kind. We do not guarantee specific outcomes or results from
                    using our services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Liability Limitation
                  </h3>
                  <p>
                    Our liability is limited to the amount paid for the specific
                    service in question. We are not liable for indirect,
                    incidental, or consequential damages.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Medical Emergency
                  </h3>
                  <p>
                    In case of medical emergency or crisis, contact local
                    emergency services immediately. Our Platform is not designed
                    for emergency situations.
                  </p>
                </div>
              </div>
            </section>

            {/* User Conduct and Platform Rules */}
            <section id="conduct" className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                11. User Conduct and Platform Rules
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Respectful Communication
                  </h3>
                  <p>
                    All users must communicate respectfully and professionally
                    with consultants and other platform users.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Session Etiquette
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Be punctual for scheduled sessions</li>
                    <li>Ensure a quiet, private environment</li>
                    <li>Have stable internet connection</li>
                    <li>Follow consultant's guidance during sessions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Consequences of Violations
                  </h3>
                  <p>
                    Violations of these rules may result in warnings,
                    suspension, or permanent termination of access to the
                    Platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section
              id="intellectual-property"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                12. Intellectual Property
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Platform Content
                  </h3>
                  <p>
                    All content on the Platform, including text, graphics,
                    logos, and software, is owned by Better Health or its
                    licensors and protected by intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. User Content
                  </h3>
                  <p>
                    By uploading content to the Platform, you grant us a license
                    to use, modify, and distribute such content for Platform
                    operations and improvements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Restrictions
                  </h3>
                  <p>
                    Users may not copy, reproduce, distribute, or create
                    derivative works from Platform content without explicit
                    permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination of Services */}
            <section
              id="termination"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                13. Termination of Services
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. User Termination
                  </h3>
                  <p>
                    Users may terminate their account at any time by contacting
                    customer support or using account deletion features.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Platform Termination
                  </h3>
                  <p>
                    We reserve the right to suspend or terminate accounts for
                    violations of these Terms, illegal activities, or at our
                    discretion with reasonable notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Effect of Termination
                  </h3>
                  <p>
                    Upon termination, access to services will cease, but certain
                    obligations and limitations will survive termination.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law and Dispute Resolution */}
            <section
              id="governing-law"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                14. Governing Law and Dispute Resolution
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Governing Law
                  </h3>
                  <p>
                    These Terms are governed by the laws of India. Any disputes
                    will be subject to the jurisdiction of Indian courts.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Dispute Resolution
                  </h3>
                  <p>
                    We encourage resolving disputes through direct communication
                    first. If necessary, disputes may be resolved through
                    arbitration or competent courts in India.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Limitation Period
                  </h3>
                  <p>
                    Any claims must be brought within one year of the event
                    giving rise to the claim.
                  </p>
                </div>
              </div>
            </section>

            {/* Modification of Terms */}
            <section
              id="modification"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                15. Modification of Terms
              </h2>
              <div className="text-gray-700 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    a. Right to Modify
                  </h3>
                  <p>
                    We reserve the right to modify these Terms at any time to
                    reflect changes in law, Platform features, or business
                    practices.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    b. Notification
                  </h3>
                  <p>
                    Material changes will be communicated through the Platform,
                    email, or other appropriate means at least 30 days before
                    taking effect.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#000080] mb-3">
                    c. Acceptance
                  </h3>
                  <p>
                    Continued use of the Platform after changes constitute
                    acceptance of the modified Terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="contact" className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#000080] mb-6">
                Contact Information
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  If you have any questions, concerns, or complaints about these
                  Terms and Conditions, please contact us at:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Company:</strong> ElevateBiz Group
                  </p>
                  <p>
                    <strong>Platform:</strong> Better Health
                  </p>
                  <p>
                    <strong>Email:</strong> admin@ideservebetterhealth.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 9799161609
                  </p>
                  <p>
                    <strong>Website:</strong> www.ideservebetterhealth.in
                  </p>
                  <p>
                    <strong>Address:</strong> Jaipur, Rajasthan, India
                  </p>
                </div>
                <p>
                  <strong>Effective Date:</strong> These Terms and Conditions
                  are effective as of the date of your first use of the
                  Platform.
                </p>
                <p>
                  <strong>Last Updated:</strong> July 23, 2025
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* Floating navigation buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-3 z-50">
        <button
          className="bg-[#ec5228] text-white w-12 h-12 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-200 flex items-center justify-center"
          title="Go to Top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {/* Up arrow SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L12 20"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 10L12 4L18 10"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          className="bg-[#ec5228] text-white w-12 h-12 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-200 flex items-center justify-center"
          title="Go to Bottom"
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
        >
          {/* Down arrow SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20L12 4"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18 14L12 20L6 14"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TermsConditions;
