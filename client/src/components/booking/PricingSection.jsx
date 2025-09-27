import React from "react";

const PricingSection = ({
  duration,
  setDuration,
  selectedPack,
  setSelectedPack,
  PRICING,
  onContinue,
}) => {
  return (
    <>
      {/* Duration Toggle Buttons */}
      <div className="text-center mb-4">
        <p className="text-gray-600 font-semibold">
          Select the session time here
        </p>
      </div>
      <div className="flex justify-center mb-10">
        <div className="bg-white rounded-lg p-1 shadow-md inline-flex">
          <button
            onClick={() => setDuration("50")}
            className={`px-8 py-2 rounded-md font-semibold transition-colors ${
              duration === "50"
                ? "bg-[#000080] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            50 mins
          </button>
          <button
            onClick={() => setDuration("80")}
            className={`px-8 py-2 rounded-md font-semibold transition-colors ${
              duration === "80"
                ? "bg-[#000080] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            80 mins
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600 font-semibold">
          Select the number of sessions
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {/* Pricing Card 1 */}
        <div
          onClick={() => setSelectedPack(false)}
          className={`bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-4 ${
            selectedPack === false ? "border-[#ec5228]" : "border-transparent"
          } min-h-[22rem]`}
        >
          <h3 className="text-2xl font-bold text-[#000080] mb-3">
            Single Session
          </h3>
          <p className="text-5xl font-bold text-[#000080] mb-4">
            ₹{PRICING[duration].single}
          </p>
          <p className="text-gray-600 text-sm max-w-xs mx-auto">
            One personalized counselling session with a professional therapist.
            Ideal for focused support, guidance, and mental clarity.
          </p>
        </div>

        {/* Pricing Card 2 */}
        <div
          onClick={() => setSelectedPack(true)}
          className={`bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-4 ${
            selectedPack === true ? "border-[#ec5228]" : "border-transparent"
          } relative min-h-[22rem]`}
        >
          <div className="absolute -top-4 bg-[#ec5228] text-white text-sm font-semibold px-4 py-1 rounded-full">
            Best Value
          </div>
          <h3 className="text-2xl font-bold text-[#000080] mb-3">
            3 Sessions Pack
          </h3>
          <p className="text-5xl font-bold text-[#000080] mb-4">
            ₹{PRICING[duration].pack}
          </p>
          <p className="text-gray-600 text-sm max-w-xs mx-auto">
            Three personalized counselling sessions with a professional
            therapist. Perfect for long-term support and deeper progress.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => selectedPack !== null && onContinue()}
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all ${
            selectedPack !== null
              ? "bg-[#ec5228] text-white hover:bg-[#d94720]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedPack === null}
        >
          Continue to Next Step
        </button>
      </div>
    </>
  );
};

export default PricingSection;
