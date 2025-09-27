import React, { useState } from "react";

const StepCards = ({ cards, onContinue }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => setSelectedCard(index)}
            className={`bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-4 relative ${
              selectedCard === index ? "border-[#ec5228]" : "border-transparent"
            } min-h-[22rem]`}
          >
            {card.highlight && (
              <div className="absolute -top-4 bg-[#ec5228] text-white text-sm font-semibold px-4 py-1 rounded-full">
                {card.highlight}
              </div>
            )}
            <h3 className="text-2xl font-bold text-[#000080] mb-3">
              {card.title}
            </h3>
            <p className="text-gray-600 text-sm max-w-xs mx-auto">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => selectedCard !== null && onContinue()}
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all ${
            selectedCard !== null
              ? "bg-[#ec5228] text-white hover:bg-[#d94720]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedCard === null}
        >
          Continue to Next Step
        </button>
      </div>
    </>
  );
};

export default StepCards;
