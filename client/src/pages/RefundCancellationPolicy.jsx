import React from "react";

const RefundCancellationPolicy = () => {
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
    { id: "refund-policy", title: "Refund Policy" },
    { id: "cancellation-policy", title: "Cancellation Policy" },
    { id: "refund-timeline", title: "Refund Processing Timeline" },
    { id: "non-refundable", title: "Non-Refundable Services" },
    { id: "emergency-cancellation", title: "Emergency Cancellations" },
    { id: "technical-issues", title: "Technical Issues" },
    { id: "refund-process", title: "How to Request a Refund" },
    { id: "modification", title: "Modification of Policy" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-[#fffae3] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#000080] mb-4">
            Refund and Cancellation Policy
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
                        At Better Health (operated by ElevateBiz Group), we
                        strive to provide high-quality mental health
                        counselling, cosmetology consultations, and wellness
                        services. We understand that circumstances may arise
                        where you need to cancel or seek a refund for our
                        services.
                      </p>
                      <p>
                        This Refund and Cancellation Policy outlines the terms
                        and conditions governing cancellations, refunds, and
                        rescheduling of appointments or services purchased
                        through our platform at www.ideservebetterhealth.in.
                      </p>
                      <p>
                        By using our services, you agree to abide by this
                        policy. Please read it carefully before making any
                        payment or booking appointments.
                      </p>
                    </>
                  )}

                  {section.id === "refund-policy" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        General Refund Guidelines
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Refunds are processed for cancellations made at least
                          24 hours before the scheduled appointment time.
                        </li>
                        <li>
                          Refund requests must be submitted through our official
                          channels as outlined in this policy.
                        </li>
                        <li>
                          All refunds are subject to review and approval by our
                          customer service team.
                        </li>
                        <li>
                          Service fees and payment processing charges may be
                          deducted from refunds where applicable.
                        </li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        Full Refund Eligibility
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Cancellations made more than 48 hours before the
                          scheduled appointment
                        </li>
                        <li>
                          Technical issues from our platform that prevent
                          service delivery
                        </li>
                        <li>
                          Practitioner unavailability due to unforeseen
                          circumstances
                        </li>
                        <li>
                          Service quality issues that are substantiated and
                          verified
                        </li>
                      </ul>
                    </>
                  )}

                  {section.id === "cancellation-policy" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        Cancellation Timeline
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                          <h4 className="font-semibold text-green-800">
                            More than 48 hours before appointment
                          </h4>
                          <p className="text-green-700">
                            Full refund (100% of amount paid, minus payment
                            processing fees)
                          </p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                          <h4 className="font-semibold text-yellow-800">
                            24-48 hours before appointment
                          </h4>
                          <p className="text-yellow-700">
                            Partial refund (75% of amount paid) or option to
                            reschedule
                          </p>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                          <h4 className="font-semibold text-orange-800">
                            12-24 hours before appointment
                          </h4>
                          <p className="text-orange-700">
                            Partial refund (50% of amount paid) or option to
                            reschedule with fees
                          </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                          <h4 className="font-semibold text-red-800">
                            Less than 12 hours before appointment
                          </h4>
                          <p className="text-red-700">
                            No refund available, but may reschedule with 50%
                            additional fee
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        No-Show Policy
                      </h3>
                      <p>
                        If you fail to attend your scheduled appointment without
                        prior notice, this will be considered a "no-show" and no
                        refund will be provided. Rescheduling may be possible
                        with a 100% additional fee.
                      </p>
                    </>
                  )}

                  {section.id === "refund-timeline" && (
                    <>
                      <p>
                        Once a refund is approved, the processing timeline
                        depends on your payment method:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <strong>Credit/Debit Cards:</strong> 5-7 business days
                          from approval
                        </li>
                        <li>
                          <strong>UPI/Digital Wallets:</strong> 3-5 business
                          days from approval
                        </li>
                        <li>
                          <strong>Net Banking:</strong> 5-10 business days from
                          approval
                        </li>
                        <li>
                          <strong>Bank Transfer:</strong> 7-10 business days
                          from approval
                        </li>
                      </ul>
                      <p className="mt-4">
                        Please note that these timelines are approximate and may
                        vary depending on your bank or payment provider. We will
                        provide you with a confirmation and tracking reference
                        once the refund is initiated.
                      </p>
                    </>
                  )}

                  {section.id === "non-refundable" && (
                    <>
                      <p>
                        The following services and situations are not eligible
                        for refunds:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Completed sessions or consultations (unless there were
                          documented service quality issues)
                        </li>
                        <li>
                          Cancellations made less than 12 hours before the
                          scheduled appointment
                        </li>
                        <li>No-show appointments without prior notification</li>
                        <li>
                          Personal emergencies or schedule conflicts (unless
                          covered under emergency policy)
                        </li>
                        <li>
                          Dissatisfaction with outcomes where the service was
                          delivered as promised
                        </li>
                        <li>
                          Technology issues on the client's end (poor internet,
                          device problems)
                        </li>
                        <li>
                          Third-party payment processing fees and platform
                          charges
                        </li>
                      </ul>
                    </>
                  )}

                  {section.id === "emergency-cancellation" && (
                    <>
                      <p>
                        We understand that genuine emergencies can occur.
                        Emergency cancellations may be considered for:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Medical emergencies (documented)</li>
                        <li>Death in immediate family</li>
                        <li>Natural disasters or extreme weather conditions</li>
                        <li>Government-imposed lockdowns or restrictions</li>
                      </ul>
                      <p className="mt-4">
                        Emergency cancellations require documentation and are
                        reviewed on a case-by-case basis. Please contact our
                        support team immediately with relevant documentation.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
                        <p className="text-blue-800">
                          <strong>Emergency Contact:</strong> For urgent
                          cancellations, call +91 9799161609 or email
                          admin@ideservebetterhealth.in with "EMERGENCY" in the
                          subject line.
                        </p>
                      </div>
                    </>
                  )}

                  {section.id === "technical-issues" && (
                    <>
                      <h3 className="text-xl font-semibold text-[#000080] mb-3">
                        Platform Technical Issues
                      </h3>
                      <p>
                        If technical issues from our platform prevent you from
                        accessing your scheduled session, we will:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Provide a full refund, or</li>
                        <li>
                          Reschedule your appointment at no additional cost, or
                        </li>
                        <li>Provide equivalent service credits</li>
                      </ul>

                      <h3 className="text-xl font-semibold text-[#000080] mb-3 mt-6">
                        Client-Side Technical Issues
                      </h3>
                      <p>
                        Technical issues on your end (internet connectivity,
                        device problems, software issues) do not qualify for
                        refunds. We recommend:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Testing your setup before the appointment</li>
                        <li>Having a backup internet connection if possible</li>
                        <li>
                          Contacting us immediately if issues arise during the
                          session
                        </li>
                      </ul>
                    </>
                  )}

                  {section.id === "refund-process" && (
                    <>
                      <p>
                        To request a refund or cancellation, please follow these
                        steps:
                      </p>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>
                          <strong>Submit a Request:</strong> Contact our
                          customer service team via email at
                          admin@ideservebetterhealth.in or call +91 9799161609
                        </li>
                        <li>
                          <strong>Provide Information:</strong> Include your
                          booking reference, appointment details, and reason for
                          cancellation
                        </li>
                        <li>
                          <strong>Documentation:</strong> Provide any supporting
                          documentation for emergency cancellations
                        </li>
                        <li>
                          <strong>Review Process:</strong> Our team will review
                          your request within 24-48 hours
                        </li>
                        <li>
                          <strong>Confirmation:</strong> You will receive
                          confirmation of approval/denial and refund timeline
                        </li>
                        <li>
                          <strong>Processing:</strong> Approved refunds are
                          processed according to the timeline specified above
                        </li>
                      </ol>

                      <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Required Information for Refund Requests:
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                          <li>Full name and contact information</li>
                          <li>Booking/Transaction reference number</li>
                          <li>Appointment date and time</li>
                          <li>Service type booked</li>
                          <li>Reason for cancellation/refund request</li>
                          <li>Preferred refund method</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {section.id === "modification" && (
                    <>
                      <p>
                        Better Health reserves the right to modify this Refund
                        and Cancellation Policy at any time. Changes will be
                        effective immediately upon posting on our website.
                      </p>
                      <p>We will notify users of significant changes via:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Email notifications to registered users</li>
                        <li>Website announcements</li>
                        <li>Updates during the booking process</li>
                      </ul>
                      <p>
                        Your continued use of our services after policy changes
                        constitutes acceptance of the updated terms.
                      </p>
                    </>
                  )}

                  {section.id === "contact" && (
                    <>
                      <p>
                        For questions about this Refund and Cancellation Policy
                        or to request a refund, please contact us:
                      </p>
                      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-4">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">
                          Better Health - Customer Service
                        </h4>
                        <div className="space-y-2 text-gray-700">
                          <p>
                            <strong>Contact Person:</strong> Avval Yadav
                          </p>
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
                        For urgent matters or emergency cancellations, please
                        call our phone number directly. For non-urgent requests,
                        email is preferred as it allows us to maintain proper
                        documentation of your request.
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

export default RefundCancellationPolicy;
