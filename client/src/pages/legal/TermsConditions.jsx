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
    <div className="min-h-screen bg-[#fffae3] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#000080] mb-4">
            Terms and Conditions
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
                  {/* Content for each section */}
                  {section.id === "introduction" && (
                    <>
                      <p>
                        Welcome to Better Health, a platform owned and operated
                        by ElevateBiz Group, a registered entity under the MSME
                        scheme in India. These Terms and Conditions ("Terms")
                        govern your access to and use of our website
                        (www.ideservebetterhealth.in), mobile site, and all
                        related services, tools, and platforms (collectively,
                        the "Platform").
                      </p>
                      <p>
                        Better Health provides online services aimed at
                        improving the overall wellness of individuals through
                        offerings such as mental health counselling,
                        cosmetologist consultations, and other wellness-based
                        services, which may be introduced from time to time. All
                        services are delivered exclusively online via secure
                        communication platforms.
                      </p>
                      <p>
                        By accessing, registering, or using any part of the
                        Platform, you confirm that you have read, understood,
                        and agreed to be bound by these Terms. If you do not
                        agree with these Terms, you must refrain from using the
                        Platform or any of the services offered.
                      </p>
                      <p>
                        These Terms apply to all users of the Platform,
                        including individuals seeking counselling, cosmetic, or
                        wellness-related support, parents or guardians booking
                        services on behalf of minors, and any other visitors or
                        users of the site.
                      </p>
                    </>
                  )}

                  {section.id === "definitions" && (
                    <>
                      <p>
                        For the purposes of these Terms and Conditions, the
                        following terms shall have the meanings assigned below.
                        These definitions apply whether the terms are used in
                        singular or plural form.
                      </p>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            a. "Better Health"
                          </h3>
                          <p>
                            Refers to the online wellness platform operated by
                            ElevateBiz Group, offering mental health
                            counselling, cosmetologist consultations, and other
                            related services through the website
                            www.ideservebetterhealth.in.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            b. "ElevateBiz Group"
                          </h3>
                          <p>
                            Refers to the registered business entity under the
                            MSME scheme, legally responsible for the operation
                            of the Better Health platform.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            c. "Platform"
                          </h3>
                          <p>
                            Includes the website, mobile applications, and all
                            associated digital tools and interfaces provided by
                            Better Health.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            d. "User" or "You"
                          </h3>
                          <p>
                            Any individual who accesses, browses, registers, or
                            uses the Platform or any of its services.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            e. "Services"
                          </h3>
                          <p>
                            All wellness-related services offered through the
                            Platform, including mental health counselling,
                            cosmetology consultations, and any additional
                            services that may be introduced.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            f. "Consultant" or "Provider"
                          </h3>
                          <p>
                            Licensed professionals, including mental health
                            counsellors, cosmetologists, and other wellness
                            experts who provide services through the Platform.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#000080] mb-3">
                            g. "Session"
                          </h3>
                          <p>
                            A scheduled consultation or interaction between a
                            User and a Consultant facilitated through the
                            Platform.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "eligibility" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. General Eligibility
                      </h3>
                      <p>
                        To use the Platform and access our Services, you must
                        be:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>At least 18 years of age, or</li>
                        <li>
                          At least 13 years of age with verifiable parental or
                          legal guardian consent and supervision
                        </li>
                        <li>
                          Legally capable of entering into binding agreements
                          under applicable law
                        </li>
                        <li>
                          Not prohibited from using the Services under Indian
                          law or any other applicable jurisdiction
                        </li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. User Classifications
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Individual Users
                          </h4>
                          <p className="text-blue-700">
                            Adults who register and use Services for their
                            personal wellness needs.
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <h4 className="font-semibold text-green-800 mb-2">
                            Guardian Users
                          </h4>
                          <p className="text-green-700">
                            Parents or legal guardians who register and book
                            Services on behalf of minors under their care.
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                          <h4 className="font-semibold text-purple-800 mb-2">
                            Service Providers
                          </h4>
                          <p className="text-purple-700">
                            Licensed professionals who provide wellness services
                            through the Platform.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Account Verification
                      </h3>
                      <p>
                        We reserve the right to verify the identity and
                        eligibility of any User. Providing false or misleading
                        information may result in account suspension or
                        termination.
                      </p>
                    </>
                  )}

                  {section.id === "scope" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Services Offered
                      </h3>
                      <p>
                        Better Health provides the following primary services:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <strong>Mental Health Counselling:</strong>{" "}
                          Professional counselling services provided by licensed
                          mental health professionals
                        </li>
                        <li>
                          <strong>Cosmetology Consultations:</strong> Expert
                          advice and guidance on skincare, beauty, and aesthetic
                          concerns
                        </li>
                        <li>
                          <strong>Wellness Support:</strong> General wellness
                          guidance and support services
                        </li>
                        <li>
                          <strong>Educational Resources:</strong> Access to
                          wellness-related content and resources
                        </li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Service Delivery Method
                      </h3>
                      <p>
                        All services are delivered exclusively through online
                        platforms, including video calls, audio calls, chat
                        interfaces, and secure messaging systems. We do not
                        provide in-person services.
                      </p>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Service Limitations
                      </h3>
                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                        <h4 className="font-semibold text-red-800 mb-2">
                          Important Notice:
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-red-700">
                          <li>
                            Our services are not intended to replace emergency
                            medical care or crisis intervention
                          </li>
                          <li>
                            We do not provide diagnosis, prescription, or
                            treatment of medical conditions
                          </li>
                          <li>
                            Services are supplementary to, not a substitute for,
                            professional medical care
                          </li>
                        </ul>
                      </div>
                    </>
                  )}

                  {section.id === "user-responsibilities" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Account Security
                      </h3>
                      <p>
                        You are responsible for maintaining the security and
                        confidentiality of your account credentials. This
                        includes:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Creating a strong, unique password for your account
                        </li>
                        <li>Not sharing your login credentials with others</li>
                        <li>
                          Immediately notifying us of any unauthorized account
                          access
                        </li>
                        <li>Logging out from shared or public devices</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Accurate Information
                      </h3>
                      <p>
                        You must provide accurate, current, and complete
                        information when registering and using our services.
                        This includes:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Personal identification details</li>
                        <li>Contact information</li>
                        <li>Health-related information relevant to services</li>
                        <li>Payment and billing information</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Appropriate Use
                      </h3>
                      <p>
                        You agree to use the Platform and Services appropriately
                        and lawfully. You must not:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Use the Platform for any illegal or unauthorized
                          purpose
                        </li>
                        <li>
                          Interfere with or disrupt the Platform's functionality
                        </li>
                        <li>
                          Attempt to gain unauthorized access to other user
                          accounts
                        </li>
                        <li>Upload malicious software or harmful content</li>
                        <li>
                          Engage in harassment or inappropriate behavior toward
                          other users or service providers
                        </li>
                      </ul>
                    </>
                  )}

                  {section.id === "payment" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Pricing and Fees
                      </h3>
                      <p>
                        Service fees are clearly displayed on the Platform
                        before booking. All prices are in Indian Rupees (INR)
                        unless otherwise specified. Fees may vary based on:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Service type and duration</li>
                        <li>Provider experience and specialization</li>
                        <li>Package deals and promotions</li>
                        <li>Seasonal or promotional pricing</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Payment Methods
                      </h3>
                      <p>We accept various payment methods including:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Credit and debit cards</li>
                        <li>UPI and digital wallets</li>
                        <li>Net banking</li>
                        <li>Other payment methods as available</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Payment Processing
                      </h3>
                      <p>
                        Payment must be completed before service delivery. We
                        use secure, encrypted payment processing systems to
                        protect your financial information.
                      </p>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        d. Refunds and Cancellations
                      </h3>
                      <p>
                        Refund and cancellation policies are detailed in our
                        separate Refund and Cancellation Policy document. Please
                        review this policy before making any payments.
                      </p>
                    </>
                  )}

                  {section.id === "consultant-responsibilities" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Professional Standards
                      </h3>
                      <p>
                        All consultants and service providers on our Platform
                        are expected to maintain high professional standards:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Possess valid licenses and certifications in their
                          field
                        </li>
                        <li>Adhere to professional ethical guidelines</li>
                        <li>Provide services within their scope of practice</li>
                        <li>Maintain confidentiality and privacy standards</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Service Quality
                      </h3>
                      <p>Consultants are responsible for:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Delivering services as described and scheduled</li>
                        <li>Being punctual and prepared for sessions</li>
                        <li>Communicating clearly and professionally</li>
                        <li>Providing appropriate follow-up when necessary</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Platform Compliance
                      </h3>
                      <p>
                        All service providers must comply with Platform rules,
                        policies, and technical requirements for service
                        delivery.
                      </p>
                    </>
                  )}

                  {section.id === "data-handling" && (
                    <>
                      <p>
                        Your privacy is important to us. Please refer to our
                        Privacy Policy for detailed information about how we
                        collect, use, and protect your personal data.
                      </p>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          a. Data Security
                        </h3>
                        <p>
                          We implement appropriate technical and organizational
                          measures to protect your personal data against
                          unauthorized access, alteration, disclosure, or
                          destruction.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          b. Session Confidentiality
                        </h3>
                        <p>
                          All sessions are conducted with strict
                          confidentiality. Session recordings, if any, are
                          stored securely and used only for quality assurance
                          and legal compliance purposes.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "third-party" && (
                    <>
                      <p>
                        The Platform may integrate with third-party services for
                        payment processing, communication, and other
                        functionalities. These integrations are governed by the
                        respective third parties' terms and privacy policies.
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
                          We reserve the right to modify, suspend, or
                          discontinue any third-party integrations at any time.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "liability" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Service Disclaimers
                      </h3>
                      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-yellow-800">
                          <strong>Important:</strong> Our services are provided
                          "as is" without warranties of any kind. We do not
                          guarantee specific outcomes or results from using our
                          services.
                        </p>
                      </div>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Limitation of Liability
                      </h3>
                      <p>
                        To the maximum extent permitted by law, Better Health
                        and ElevateBiz Group shall not be liable for:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Indirect, incidental, or consequential damages</li>
                        <li>
                          Loss of profits, data, or business opportunities
                        </li>
                        <li>
                          Damages resulting from third-party actions or services
                        </li>
                        <li>Technical issues beyond our reasonable control</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. User Acknowledgment
                      </h3>
                      <p>
                        By using our services, you acknowledge that wellness and
                        health outcomes depend on various factors beyond our
                        control, and you use our services at your own risk and
                        discretion.
                      </p>
                    </>
                  )}

                  {section.id === "conduct" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Prohibited Activities
                      </h3>
                      <p>Users are strictly prohibited from:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Harassing, threatening, or abusing other users or
                          providers
                        </li>
                        <li>
                          Sharing inappropriate, offensive, or illegal content
                        </li>
                        <li>
                          Attempting to reverse engineer or hack the Platform
                        </li>
                        <li>Creating fake accounts or impersonating others</li>
                        <li>Spamming or sending unsolicited communications</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Enforcement Actions
                      </h3>
                      <p>Violations of these conduct rules may result in:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Warning notices</li>
                        <li>Temporary account suspension</li>
                        <li>Permanent account termination</li>
                        <li>Legal action when appropriate</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Reporting Violations
                      </h3>
                      <p>
                        Users can report violations or inappropriate behavior
                        through our customer support channels. We investigate
                        all reports promptly and take appropriate action.
                      </p>
                    </>
                  )}

                  {section.id === "intellectual-property" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. Platform Content
                      </h3>
                      <p>
                        All content on the Platform, including text, graphics,
                        logos, images, and software, is the property of Better
                        Health or its content suppliers and is protected by
                        copyright and other intellectual property laws.
                      </p>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. User Content
                      </h3>
                      <p>
                        By submitting content to the Platform, you grant us a
                        non-exclusive, royalty-free license to use, modify, and
                        display such content for Platform operations and service
                        improvement.
                      </p>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Restrictions
                      </h3>
                      <p>
                        Users may not copy, modify, distribute, or create
                        derivative works from Platform content without explicit
                        written permission.
                      </p>
                    </>
                  )}

                  {section.id === "termination" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        a. User-Initiated Termination
                      </h3>
                      <p>
                        You may terminate your account at any time by contacting
                        our customer support team. Upon termination:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Your access to the Platform will be discontinued
                        </li>
                        <li>
                          Scheduled sessions may be cancelled according to our
                          cancellation policy
                        </li>
                        <li>
                          Personal data will be handled according to our Privacy
                          Policy
                        </li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        b. Platform-Initiated Termination
                      </h3>
                      <p>
                        We reserve the right to suspend or terminate accounts
                        for:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Violation of these Terms and Conditions</li>
                        <li>Fraudulent or illegal activities</li>
                        <li>Abuse of Platform resources or other users</li>
                        <li>Extended periods of inactivity</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        c. Effects of Termination
                      </h3>
                      <p>
                        Upon termination, all rights and obligations under these
                        Terms will cease, except for those that by their nature
                        should survive termination.
                      </p>
                    </>
                  )}

                  {section.id === "governing-law" && (
                    <>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          a. Applicable Law
                        </h3>
                        <p>
                          These Terms are governed by the laws of India. Any
                          disputes will be subject to the jurisdiction of Indian
                          courts.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          b. Dispute Resolution
                        </h3>
                        <p>
                          We encourage resolving disputes through direct
                          communication first. If necessary, disputes may be
                          resolved through arbitration or competent courts in
                          India.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          c. Limitation Period
                        </h3>
                        <p>
                          Any claims must be brought within one year of the
                          event giving rise to the claim.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "modification" && (
                    <>
                      <p>
                        Better Health reserves the right to modify these Terms
                        and Conditions at any time. Changes will be effective
                        immediately upon posting on the Platform.
                      </p>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          a. Notification of Changes
                        </h3>
                        <p>
                          We will notify users of significant changes through:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Email notifications to registered users</li>
                          <li>Platform announcements</li>
                          <li>Updates during the login process</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#000080] mb-3">
                          b. Acceptance of Changes
                        </h3>
                        <p>
                          Your continued use of the Platform after changes are
                          posted constitutes acceptance of the updated Terms.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "contact" && (
                    <>
                      <p>
                        For questions about these Terms and Conditions or any
                        aspect of our services, please contact us:
                      </p>

                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-4">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">
                          Better Health - Customer Service
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
                        We are committed to addressing your concerns promptly
                        and professionally. Please allow up to 48 hours for a
                        response to your inquiry.
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

export default TermsConditions;
