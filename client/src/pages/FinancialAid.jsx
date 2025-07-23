import { useState } from "react";

const FinancialAid = () => {
  const [activeTab, setActiveTab] = useState("individual");

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-[#fffae3] to-[#fff5d6] py-16 px-6 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="hero-content">
            <h1 className="text-[#000080] text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight">
              Apply for Financial Aid at Better Health
            </h1>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed px-4 sm:px-0">
              We believe quality healthcare should be accessible to everyone.
              Our comprehensive financial assistance programs are designed to
              support you when you need it most.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-12 max-w-4xl mx-auto px-6 sm:px-0">
              <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2">
                <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">📈</div>
                <h3 className="text-[#000080] text-lg lg:text-2xl font-bold my-1 lg:my-2">
                  95%
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Success Rate
                </p>
              </div>
              <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2">
                <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">💰</div>
                <h3 className="text-[#000080] text-lg lg:text-2xl font-bold my-1 lg:my-2">
                  70%
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Average Discount
                </p>
              </div>
              <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2">
                <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">⚡</div>
                <h3 className="text-[#000080] text-lg lg:text-2xl font-bold my-1 lg:my-2">
                  24hrs
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Fast Processing
                </p>
              </div>
              <div className="bg-white p-4 lg:p-8 rounded-xl text-center shadow-md transition-all duration-300 hover:-translate-y-2">
                <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">❤️</div>
                <h3 className="text-[#000080] text-lg lg:text-2xl font-bold my-1 lg:my-2">
                  Many
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Lives Impacted
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section section-bg-2 py-16 px-6 sm:py-20 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#000080] text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight">
            Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md relative max-w-xs mx-auto md:max-w-none">
              <div className="w-10 h-10 bg-[#ec5228] text-white rounded-full flex items-center justify-center font-semibold mb-6">
                1
              </div>
              <div className="process-content">
                <h3 className="text-[#000080] text-xl font-bold mb-4">
                  Gather Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand your eligibility by reviewing the program criteria.
                  Collect necessary documents like ID proof, income details,
                  academic records, and any supporting materials required for
                  the application.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md relative max-w-xs mx-auto md:max-w-none">
              <div className="w-10 h-10 bg-[#ec5228] text-white rounded-full flex items-center justify-center font-semibold mb-6">
                2
              </div>
              <div className="process-content">
                <h3 className="text-[#000080] text-xl font-bold mb-4">
                  Submit Application
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete the online application form with accurate details.
                  Upload the required documents and double-check all entries
                  before submitting to avoid delays in processing.
                  <br />
                  <br />
                </p>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md relative max-w-xs mx-auto md:max-w-none">
              <div className="w-10 h-10 bg-[#ec5228] text-white rounded-full flex items-center justify-center font-semibold mb-6">
                3
              </div>
              <div className="process-content">
                <h3 className="text-[#000080] text-xl font-bold mb-4">
                  Get Approved
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team will review your application and documents within 24
                  hours. Once approved, you will receive a confirmation call
                  with further steps and instructions. Stay connected for any
                  update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="section section-bg-1 py-16 px-6 sm:py-20 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#fffae3" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
            <h2 className="text-[#000080] text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 px-4 sm:px-0">
              Take the first step towards affordable healthcare
            </p>
            <div className="flex gap-4 justify-center my-8">
              <a
                href="https://forms.gle/f8XbQD8QyHr12sw26"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ec5228] text-white px-10 py-4 rounded-lg font-semibold border-none cursor-pointer transition-all duration-300 hover:bg-[#d94516] no-underline"
              >
                Apply Now
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Need help with your application?{" "}
              <a className="text-[#000080] no-underline hover:text-[#ec5228] hover:underline">
                Check out contact options below
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialAid;
