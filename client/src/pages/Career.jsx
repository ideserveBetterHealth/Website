import React from "react";

const roles = [
  {
    title: "Apply for Psychologist",
    description:
      "Help individuals overcome mental health challenges through therapy and counseling sessions.",
    link: "https://forms.gle/prB4JocuDxRJywot8",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "🧠",
  },
  {
    title: "Apply for Cosmetologist",
    description:
      "Provide expert skincare advice and cosmetic treatments to enhance client confidence and well-being.",
    link: "https://forms.gle/XRzRKGBhftDTpdsJ6",
    color: "bg-pink-50 border-pink-200 text-pink-800",
    icon: "💄",
  },
  {
    title: "Apply for Nutritionist",
    description:
      "Create personalized nutrition plans and guide clients towards healthier lifestyle choices.",
    link: "https://forms.gle/jzBbgQUtciszrTPD7",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "🥗",
  },
  {
    title: "Apply for Health Content Strategist Intern",
    description:
      "Create engaging health content and develop strategies to educate and inspire our community.",
    link: "https://forms.gle/oXbLuxA1dXc9mr7EA",
    color: "bg-green-50 border-green-200 text-green-800",
    icon: "📝",
  },
];

export default function Career() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] flex flex-col px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#000080] mb-4 sm:mb-6 leading-tight">
            Join Better Health
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-4">
            Make a difference. Be part of a team that's revolutionizing
            healthcare accessibility and mental wellness.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="flex-1 flex flex-col justify-end pb-12 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-6 sm:px-0">
          {roles.map((role) => (
            <div
              key={role.title}
              className={`rounded-2xl shadow-lg border-2 p-4 sm:p-6 flex flex-col justify-between h-[320px] sm:h-[380px] ${role.color}`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">
                  {role.icon}
                </div>
                <h2 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 h-10 sm:h-14 flex items-center justify-center px-2">
                  {role.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed h-14 sm:h-20 flex items-center px-1 sm:px-2">
                  {role.description}
                </p>
              </div>
              <div className="mt-0">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Click Apply Now for more details!
                </p>
                <a
                  href={role.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-3 sm:px-6 py-2 sm:py-3 bg-[#ec5228] text-white font-semibold rounded-lg shadow hover:bg-[#d14a22] transition-all duration-300 text-xs sm:text-base"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
