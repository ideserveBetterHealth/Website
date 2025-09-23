import React from "react";

const ContactUs = () => {
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
    { id: "contact-info", title: "Contact Information" },
    { id: "office-hours", title: "Office Hours" },
  ];

  return (
    <div className="min-h-screen bg-[#fffae3] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#000080] mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Get in touch with Better Health
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
                  {section.id === "introduction" && (
                    <>
                      <p>
                        At Better Health (operated by ElevateBiz Group), we are
                        committed to providing exceptional mental health
                        counselling, cosmetology consultations, and wellness
                        services. We value your feedback, questions, and
                        concerns.
                      </p>
                      <p>
                        Whether you need assistance with booking appointments,
                        have questions about our services, or want to share your
                        experience, we&apos;re here to help. Reach out to us
                        through any of the channels below.
                      </p>
                    </>
                  )}

                  {section.id === "contact-info" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-[#ec5228] text-white p-2 rounded-full">
                              📧
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#000080]">
                                Email
                              </h4>
                              <p>admin@ideservebetterhealth.in</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-[#ec5228] text-white p-2 rounded-full">
                              📞
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#000080]">
                                Phone
                              </h4>
                              <p>+91 9799161609</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-[#ec5228] text-white p-2 rounded-full">
                              👤
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#000080]">
                                Contact Person
                              </h4>
                              <p>Avval Yadav</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-[#ec5228] text-white p-2 rounded-full">
                              📍
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#000080]">
                                Address
                              </h4>
                              <p>
                                B-7, Om Vihar, Radhaswami Bagh, Chomu, Jaipur,
                                Rajasthan, 303702
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "office-hours" && (
                    <>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-[#000080] mb-4">
                          Business Hours
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span>9:00 AM - 6:00 PM IST</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span>10:00 AM - 4:00 PM IST</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span>Closed</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                          For urgent matters outside business hours, please call
                          our emergency line: +91 9799161609
                        </p>
                      </div>
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

export default ContactUs;
