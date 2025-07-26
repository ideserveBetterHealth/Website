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
              Privacy Policy
            </h1>
          </div>
          {/* Content Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Each section is styled consistently with a white background, rounded corners, and shadow */}
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
                        {/* Add other definition subsections similarly */}
                      </div>
                    </>
                  )}

                  {section.id === "information" && (
                    <>
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
                      </ul>
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
                      </ul>
                    </>
                  )}

                  {section.id === "how-we-use" && (
                    <>
                      <p>We use your information for the following purposes:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          To provide and manage our services, including
                          processing your bookings and payments
                        </li>
                        <li>
                          To communicate with you, including sending
                          service-related notifications and promotional
                          materials
                        </li>
                        <li>
                          To improve our services, including conducting research
                          and analysis
                        </li>
                        <li>
                          To protect the security and integrity of our services
                        </li>
                        <li>
                          To comply with legal obligations and resolve any
                          disputes
                        </li>
                      </ul>
                    </>
                  )}

                  {section.id === "legal-basis" && (
                    <>
                      <p>
                        Our legal basis for processing your personal data
                        includes:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Your consent</li>
                        <li>Performance of a contract with you</li>
                        <li>Compliance with legal obligations</li>
                        <li>
                          Legitimate interests pursued by us or third parties
                        </li>
                      </ul>
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
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Encryption of data in transit and at rest</li>
                        <li>Regular security assessments and audits</li>
                        <li>Access controls and authentication measures</li>
                      </ul>
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
                      </ul>
                    </>
                  )}

                  {section.id === "data-sharing" && (
                    <>
                      <p>
                        We may share your personal data with third parties in
                        the following situations:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          With service providers who assist us in operating our
                          business and providing our services
                        </li>
                        <li>
                          With third parties for marketing and promotional
                          purposes, with your consent
                        </li>
                        <li>
                          In response to a subpoena or court order, or as
                          otherwise required by law
                        </li>
                        <li>
                          In connection with a merger, acquisition, or sale of
                          all or a portion of our assets
                        </li>
                      </ul>
                    </>
                  )}

                  {section.id === "user-rights" && (
                    <>
                      <p>
                        You have the following rights regarding your personal
                        data:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          The right to access, correct, or delete your personal
                          data
                        </li>
                        <li>
                          The right to object to or restrict the processing of
                          your personal data
                        </li>
                        <li>The right to data portability</li>
                        <li>
                          The right to withdraw consent at any time, where we
                          rely on your consent to process your personal data
                        </li>
                      </ul>
                      <p>
                        To exercise these rights, please contact us using the
                        contact information provided below.
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
                    </>
                  )}

                  {section.id === "third-party" && (
                    <>
                      <p>
                        Our Platform may contain links to third-party websites
                        or services that are not owned or controlled by us. This
                        Privacy Policy does not apply to such third-party
                        websites or services, and we are not responsible for
                        their content or privacy practices. We encourage you to
                        review the privacy policies of any third-party websites
                        or services that you visit.
                      </p>
                    </>
                  )}

                  {section.id === "cookies" && (
                    <>
                      <p>
                        We use cookies and similar tracking technologies to
                        enhance your experience on our Platform, analyze
                        traffic, and personalize content and ads. You can
                        control the use of cookies at the individual browser
                        level, but if you choose to disable cookies, it may
                        limit your ability to use certain features or functions
                        of our Platform.
                      </p>
                    </>
                  )}

                  {section.id === "data-transfers" && (
                    <>
                      <p>
                        Your personal data may be transferred to and processed
                        in countries outside of your own, including countries
                        that may not provide the same level of data protection
                        as your home country. In such cases, we will ensure that
                        appropriate safeguards are in place to protect your
                        personal data, in accordance with this Privacy Policy
                        and applicable laws.
                      </p>
                    </>
                  )}

                  {section.id === "updates" && (
                    <>
                      <p>
                        We may update this Privacy Policy from time to time to
                        reflect changes in our practices or for other
                        operational, legal, or regulatory reasons. We will
                        notify you of any material changes by posting the new
                        Privacy Policy on our Platform and updating the
                        "effective date" at the top of this Policy. Your
                        continued use of our services or access to the Platform
                        after such changes constitutes your acceptance of the
                        new Privacy Policy.
                      </p>
                    </>
                  )}

                  {section.id === "contact" && (
                    <>
                      <p>
                        If you have any questions, concerns, or complaints about
                        this Privacy Policy or our privacy practices, please
                        contact us at:
                      </p>
                      <p className="font-semibold">Better Health</p>
                      <p>Email: admin@ideservebetterhealth.in</p>
                      <p>Phone: +91 9799161609</p>
                      <p>Address: Jaipur, Rajasthan, India</p>
                    </>
                  )}
                </div>
              </section>
            ))}
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

export default PrivacyPolicy;
