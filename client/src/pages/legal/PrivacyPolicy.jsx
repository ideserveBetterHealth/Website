import React from "react";

const PrivacyPolicy = () => {
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
    { id: "information", title: "Information We Collect" },
    { id: "how-we-use", title: "How We Use Your Information" },
    { id: "legal-basis", title: "Legal Basis for Processing" },
    { id: "data-storage", title: "Data Storage and Security" },
    { id: "data-retention", title: "Data Retention" },
    { id: "data-sharing", title: "Data Sharing and Disclosure" },
    { id: "user-rights", title: "User Rights and Controls" },
    { id: "childrens-privacy", title: "Children's Privacy" },
    { id: "third-party", title: "Third-Party Services and Links" },
    { id: "cookies", title: "Cookies and Tracking Technologies" },
    {
      id: "data-transfers",
      title: "Data Transfers (International and Domestic)",
    },
    { id: "updates", title: "Updates to the Privacy Policy" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-[#fffae3] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#000080] mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Effective Date: August 30, 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-lg p-4 max-h-fit">
              <h3 className="text-lg font-semibold text-[#000080] mb-3">
                Quick Navigation
              </h3>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="text-left text-xs text-gray-600 hover:text-[#000080] transition-colors duration-200 w-full py-1.5 px-2 rounded hover:bg-gray-50 leading-tight"
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-[#000080] mb-6">
                  {section.title}
                </h2>
                <div className="text-gray-700 space-y-4">
                  {/* Content will be added for each section */}
                  {section.id === "introduction" && (
                    <>
                      <p>
                        At ElevateBiz Group, operating under the name Better
                        Health, we deeply value your privacy and are committed
                        to protecting your personal data. This Privacy Policy
                        explains how we collect, use, store, share, and protect
                        the personal information of users accessing our
                        platform, which includes our website
                        https://ideservebetterhealth.in, social media pages,
                        consultation services, and other associated online tools
                        and features (referred to collectively as the
                        "Platform").
                      </p>
                      <p>
                        Better Health provides online wellness services,
                        including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Mental health counselling</li>
                        <li>Cosmetology consultations</li>
                        <li>
                          Future integrations such as Ayurveda and Homeopathy
                        </li>
                      </ul>
                      <p>
                        This Privacy Policy outlines our practices regarding:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>What personal data we collect</li>
                        <li>Why and how we use it</li>
                        <li>Who we may share it with</li>
                        <li>How we protect your data</li>
                        <li>What rights you have over your data</li>
                      </ul>
                      <p>
                        By continuing to use our services or accessing the
                        Platform, you acknowledge and consent to the practices
                        described in this Policy.
                      </p>
                      <p>
                        If you do not agree with this Privacy Policy, please
                        discontinue using our services immediately.
                      </p>
                    </>
                  )}

                  {section.id === "definitions" && (
                    <>
                      <p>
                        For the purposes of this Privacy Policy, the following
                        terms shall have the meanings set forth below:
                      </p>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            a. "Personal Data"
                          </h3>
                          <p>
                            Any information that can be used to identify a user
                            directly or indirectly, including but not limited
                            to:
                          </p>
                          <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Address</li>
                            <li>Age or date of birth</li>
                            <li>Gender</li>
                            <li>Login credentials</li>
                            <li>IP address or device identifiers</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            b. "Platform"
                          </h3>
                          <p>
                            Refers to our website, mobile applications, social
                            media pages, and all related services and tools
                            provided by Better Health.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            c. "Services"
                          </h3>
                          <p>
                            All wellness services offered through our Platform,
                            including consultations, counselling sessions, and
                            related support services.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "information" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        Information You Provide Directly
                      </h3>
                      <p>
                        We collect information that you provide directly to us,
                        such as when you create an account, book a session, fill
                        out forms, or communicate with us. This information may
                        include:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Personal identification information (Name, email,
                          phone number, etc.)
                        </li>
                        <li>
                          Demographic information (Age, gender, location, etc.)
                        </li>
                        <li>
                          Account login information (Username, password, etc.)
                        </li>
                        <li>
                          Health-related information relevant to our services
                        </li>
                        <li>Payment and billing information</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        Information We Collect Automatically
                      </h3>
                      <p>
                        We may also collect information about your usage of our
                        services and your interactions with us, which may
                        include:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Session recordings and transcripts</li>
                        <li>Feedback and survey responses</li>
                        <li>
                          Technical data (IP address, browser type, device
                          information, etc.)
                        </li>
                        <li>Usage patterns and preferences</li>
                        <li>Communication logs and interaction history</li>
                      </ul>
                    </>
                  )}

                  {section.id === "how-we-use" && (
                    <>
                      <p>We use your information for the following purposes:</p>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Service Delivery
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              To provide and manage our services, including
                              processing your bookings and payments
                            </li>
                            <li>
                              To facilitate consultations and maintain session
                              records
                            </li>
                            <li>
                              To provide customer support and technical
                              assistance
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Communication
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              To communicate with you, including sending
                              service-related notifications and promotional
                              materials
                            </li>
                            <li>
                              To send appointment reminders and follow-up
                              communications
                            </li>
                            <li>To respond to your inquiries and requests</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Improvement and Security
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              To improve our services, including conducting
                              research and analysis
                            </li>
                            <li>
                              To protect the security and integrity of our
                              services
                            </li>
                            <li>
                              To comply with legal obligations and resolve any
                              disputes
                            </li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "legal-basis" && (
                    <>
                      <p>
                        Our legal basis for processing your personal data
                        includes:
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Consent
                          </h3>
                          <p>
                            Where you have given clear consent for us to process
                            your personal data for specific purposes.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Contract Performance
                          </h3>
                          <p>
                            Where processing is necessary for the performance of
                            a contract with you or to take steps at your request
                            prior to entering into a contract.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Legal Obligations
                          </h3>
                          <p>
                            Where processing is necessary for compliance with
                            legal obligations to which we are subject.
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Legitimate Interests
                          </h3>
                          <p>
                            Where processing is necessary for legitimate
                            interests pursued by us or third parties, except
                            where such interests are overridden by your
                            interests or fundamental rights and freedoms.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "data-storage" && (
                    <>
                      <p>
                        Your personal data is stored on secure servers with
                        limited access, and we use appropriate technical and
                        organizational measures to protect it. These measures
                        include:
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Technical Safeguards
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Encryption of data in transit and at rest</li>
                            <li>
                              Secure server infrastructure with limited access
                            </li>
                            <li>Regular security assessments and audits</li>
                            <li>Firewalls and intrusion detection systems</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Organizational Measures
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Access controls and authentication measures</li>
                            <li>Employee training on data protection</li>
                            <li>
                              Regular review of security policies and procedures
                            </li>
                            <li>
                              Incident response and breach notification
                              procedures
                            </li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "data-retention" && (
                    <>
                      <p>
                        We retain your personal data only for as long as
                        necessary to fulfill the purposes for which it was
                        collected, or as required by law. Criteria used to
                        determine retention periods include:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          The length of time we have had a relationship with you
                        </li>
                        <li>
                          Whether there is a legal obligation to which we are
                          subject
                        </li>
                        <li>
                          Whether retention is advisable in light of our legal
                          position (such as in regard to applicable statutes of
                          limitations, litigation, or regulatory investigations)
                        </li>
                      </ul>

                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Typical Retention Periods:
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-blue-700 text-sm">
                          <li>
                            Account information: Duration of account plus 3
                            years
                          </li>
                          <li>Session records: 7 years from last session</li>
                          <li>
                            Payment records: 7 years for tax and audit purposes
                          </li>
                          <li>
                            Marketing communications: Until consent is withdrawn
                          </li>
                        </ul>
                      </div>
                    </>
                  )}

                  {section.id === "data-sharing" && (
                    <>
                      <p>
                        We may share your personal data with third parties in
                        the following situations:
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Service Providers
                          </h3>
                          <p>
                            With service providers who assist us in operating
                            our business and providing our services, including:
                          </p>
                          <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>
                              Payment processors and financial institutions
                            </li>
                            <li>Technology and hosting providers</li>
                            <li>Customer support services</li>
                            <li>Analytics and marketing service providers</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Legal Requirements
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              In response to a subpoena or court order, or as
                              otherwise required by law
                            </li>
                            <li>
                              To protect the rights, property, or safety of our
                              company, users, or others
                            </li>
                            <li>
                              To investigate or prevent illegal activities or
                              violations of our terms of service
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Business Transfers
                          </h3>
                          <p>
                            In connection with a merger, acquisition, or sale of
                            all or a portion of our assets, your personal data
                            may be transferred to the acquiring entity.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "user-rights" && (
                    <>
                      <p>
                        You have the following rights regarding your personal
                        data:
                      </p>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <h4 className="font-semibold text-green-800 mb-2">
                            Access and Correction Rights
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-green-700">
                            <li>
                              The right to access, correct, or delete your
                              personal data
                            </li>
                            <li>
                              The right to obtain a copy of your personal data
                            </li>
                            <li>The right to update inaccurate information</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                          <h4 className="font-semibold text-yellow-800 mb-2">
                            Control Rights
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-yellow-700">
                            <li>
                              The right to object to or restrict the processing
                              of your personal data
                            </li>
                            <li>The right to data portability</li>
                            <li>
                              The right to withdraw consent at any time, where
                              we rely on your consent to process your personal
                              data
                            </li>
                          </ul>
                        </div>
                      </div>

                      <p className="mt-4">
                        To exercise these rights, please contact us using the
                        contact information provided below. We will respond to
                        your request within 30 days of receipt.
                      </p>
                    </>
                  )}

                  {section.id === "childrens-privacy" && (
                    <>
                      <p>
                        Our services are not directed to children under the age
                        of 13, and we do not knowingly collect personal data
                        from children under 13. If we become aware that we have
                        collected personal data from a child under 13, we will
                        take steps to delete such data.
                      </p>

                      <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400 mt-4">
                        <h4 className="font-semibold text-orange-800 mb-2">
                          Parental Rights:
                        </h4>
                        <p className="text-orange-700">
                          If you are a parent or guardian and believe your child
                          has provided us with personal information, please
                          contact us immediately so we can take appropriate
                          action.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "third-party" && (
                    <>
                      <p>
                        Our Platform may contain links to third-party websites
                        or services that are not owned or controlled by us. This
                        Privacy Policy does not apply to such third-party
                        websites or services, and we are not responsible for
                        their content or privacy practices.
                      </p>

                      <p>
                        We encourage you to review the privacy policies of any
                        third-party websites or services that you visit.
                      </p>

                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400 mt-4">
                        <h4 className="font-semibold text-red-800 mb-2">
                          Important Notice:
                        </h4>
                        <p className="text-red-700">
                          When you click on links to third-party sites or use
                          third-party services, you are leaving our Platform and
                          this Privacy Policy no longer applies.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "cookies" && (
                    <>
                      <p>
                        We use cookies and similar tracking technologies to
                        enhance your experience on our Platform, analyze
                        traffic, and personalize content and ads.
                      </p>

                      <div className="space-y-4 mt-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Types of Cookies We Use
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              <strong>Essential Cookies:</strong> Required for
                              basic Platform functionality
                            </li>
                            <li>
                              <strong>Performance Cookies:</strong> Help us
                              understand how users interact with our Platform
                            </li>
                            <li>
                              <strong>Functional Cookies:</strong> Remember your
                              preferences and settings
                            </li>
                            <li>
                              <strong>Marketing Cookies:</strong> Used to
                              deliver relevant advertisements
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Cookie Control
                          </h3>
                          <p>
                            You can control the use of cookies at the individual
                            browser level, but if you choose to disable cookies,
                            it may limit your ability to use certain features or
                            functions of our Platform.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "data-transfers" && (
                    <>
                      <p>
                        Your personal data may be transferred to and processed
                        in countries outside of your own, including countries
                        that may not provide the same level of data protection
                        as your home country.
                      </p>

                      <p>
                        In such cases, we will ensure that appropriate
                        safeguards are in place to protect your personal data,
                        in accordance with this Privacy Policy and applicable
                        laws.
                      </p>

                      <div className="space-y-4 mt-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Safeguards for International Transfers
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>
                              Adequacy decisions by regulatory authorities
                            </li>
                            <li>Standard contractual clauses</li>
                            <li>Binding corporate rules</li>
                            <li>Certification schemes and codes of conduct</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "updates" && (
                    <>
                      <p>
                        We may update this Privacy Policy from time to time to
                        reflect changes in our practices or for other
                        operational, legal, or regulatory reasons.
                      </p>

                      <div className="space-y-4 mt-4">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            How We Notify You of Changes
                          </h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Email notifications to registered users</li>
                            <li>Website announcements and banners</li>
                            <li>Updates during the login process</li>
                            <li>
                              Social media notifications for significant changes
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            Your Acceptance
                          </h3>
                          <p>
                            We will notify you of any material changes by
                            posting the new Privacy Policy on our Platform and
                            updating the "effective date" at the top of this
                            Policy. Your continued use of our services or access
                            to the Platform after such changes constitutes your
                            acceptance of the new Privacy Policy.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "contact" && (
                    <>
                      <p>
                        If you have any questions, concerns, or complaints about
                        this Privacy Policy or our privacy practices, please
                        contact us:
                      </p>

                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-4">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">
                          Better Health - Privacy Team
                        </h4>
                        <div className="space-y-2 text-gray-700">
                          <p>
                            <strong>Email:</strong>{" "}
                            admin@ideservebetterhealth.in
                          </p>
                          <p>
                            <strong>Phone:</strong> +91 9799161609
                          </p>
                          <p>
                            <strong>Address:</strong> Jaipur, Rajasthan, India
                          </p>
                          <p>
                            <strong>Business Hours:</strong> Monday - Friday,
                            9:00 AM - 6:00 PM IST
                          </p>
                        </div>
                      </div>

                      <p className="mt-4">
                        We are committed to resolving any privacy-related
                        concerns promptly and transparently. Please allow up to
                        30 days for us to respond to your inquiry.
                      </p>
                    </>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Floating navigation buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#000080] text-white p-3 rounded-full shadow-lg hover:bg-[#000060] transition-colors duration-200"
          title="Back to top"
        >
          ↑
        </button>
        <button
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          className="bg-[#000080] text-white p-3 rounded-full shadow-lg hover:bg-[#000060] transition-colors duration-200"
          title="Go to bottom"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
