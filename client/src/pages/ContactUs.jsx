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
    { id: "contact-form", title: "Send us a Message" },
    { id: "office-hours", title: "Office Hours" },
    { id: "location", title: "Our Location" },
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
                              <p>Jaipur, Rajasthan, India</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "contact-form" && (
                    <>
                      <p>
                        Fill out the form below to send us a message. We&apos;ll
                        get back to you as soon as possible.
                      </p>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message *
                          </label>
                          <textarea
                            rows="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                            required
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#ec5228] text-white px-6 py-2 rounded-md hover:bg-[#d43d1f] transition-colors duration-200"
                        >
                          Send Message
                        </button>
                      </form>
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

                  {section.id === "location" && (
                    <>
                      <div className="space-y-4">
                        <p>
                          Our main office is located in Jaipur, Rajasthan,
                          India. While we primarily operate online, you can
                          visit us for in-person consultations by appointment
                          only.
                        </p>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-xl font-semibold text-[#000080] mb-2">
                            Address
                          </h3>
                          <p>Jaipur, Rajasthan, India</p>
                          <p className="mt-2">
                            <strong>Note:</strong> Please contact us in advance
                            to schedule an in-person visit.
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <p className="text-blue-800">
                            <strong>Virtual Consultations:</strong> We offer
                            online consultations via video call, phone, or chat
                            for your convenience.
                          </p>
                        </div>
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
