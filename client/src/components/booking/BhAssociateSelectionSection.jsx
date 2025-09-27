import { Languages, Calendar } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BhAssociateSelectionSection = ({
  doctors,
  isLoading,
  onBookSession,
  showBooking,
  selectedDoc,
  serviceType = "psychologist", // "psychologist" or "cosmetologist"
}) => {
  const navigate = useNavigate();

  const handleBookSession = (doctor) => {
    onBookSession(doctor);
  };

  console.log(doctors);

  const handleViewProfile = (doctor) => {
    navigate(`/bh-associate-profile/${doctor._id}`, { state: { doctor } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-orange-500 border-r-orange-500"></div>
        </div>
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading{" "}
          {serviceType === "psychologist" ? "psychologists" : "cosmetologists"}
          ...
        </p>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👨‍⚕️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No{" "}
            {serviceType === "psychologist"
              ? "Psychologists"
              : "Cosmetologists"}{" "}
            Available
          </h3>
          <p className="text-gray-600">
            We&apos;re working to bring you the best professionals. Please check
            back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Render doctor cards dynamically */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {doctors.map((doctor, index) => (
              <div
                key={doctor._id || index}
                className="group w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col"
                onClick={() => handleBookSession(doctor)}
              >
                {/* Header with Background */}
                <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 p-7 relative flex flex-col sm:flex-row items-center sm:items-center flex-1 justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-t-3xl"></div>

                  {/* Profile Picture */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl shadow-orange-200/50 group-hover:shadow-2xl group-hover:shadow-orange-300/50 transition-all duration-300 mb-4 sm:mb-0 sm:mr-6">
                    {doctor.photoUrl ? (
                      <img
                        src={doctor.photoUrl}
                        alt={doctor.name}
                        className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl sm:text-2xl font-bold text-white">
                          {doctor.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || doctor.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and Designation */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="relative text-xl font-bold text-gray-800 group-hover:text-orange-800 transition-colors duration-300">
                      {doctor.name}
                    </h2>
                    <p className="relative text-base font-medium text-slate-600 mt-1 group-hover:text-slate-700 transition-colors duration-300">
                      {doctor.designation}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-col">
                  {/* Expertise/Specializations Section */}
                  {(doctor.expertise || doctor.specializations) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {serviceType === "psychologist"
                          ? "Expertise"
                          : "Specializations"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(doctor.expertise || doctor.specializations || [])
                          .slice(0, 6)
                          .map((item, itemIndex) => (
                            <span
                              key={itemIndex}
                              className="px-3 py-1.5 text-xs bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full font-medium border border-orange-200 hover:from-orange-200 hover:to-orange-300 hover:shadow-md transition-all duration-200 cursor-default"
                            >
                              {item}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="my-4 border-t border-gray-200"></div>

                  {/* Details Section */}
                  <div className="space-y-3">
                    {/* Languages for all professionals */}
                    {doctor.languages && (
                      <div className="flex items-start group/item hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200">
                        <div className="p-1.5 bg-orange-100 rounded-md group-hover/item:bg-orange-200 transition-colors duration-200">
                          <Languages className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-xs font-semibold text-gray-500 mb-0.5">
                            Speaks
                          </h3>
                          <p className="text-sm text-gray-800 font-medium">
                            {Array.isArray(doctor.languages)
                              ? doctor.languages.join(", ")
                              : doctor.languages}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Next available slot for all professionals */}
                    {doctor.nextAvailableSlot && (
                      <div className="flex items-start group/item hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200">
                        <div className="p-1.5 bg-orange-100 rounded-md group-hover/item:bg-orange-200 transition-colors duration-200">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-xs font-semibold text-gray-500 mb-0.5">
                            Next available slot
                          </h3>
                          <p className="text-sm text-gray-800 font-semibold">
                            {doctor.nextAvailableSlot
                              ? `${doctor.nextAvailableSlot.fullDate} at ${doctor.nextAvailableSlot.time} (Video)`
                              : "No slots available"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Specialization description for cosmetologists */}
                    {serviceType === "cosmetologist" &&
                      doctor.specialization && (
                        <div className="flex items-start group/item hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200">
                          <div className="p-1.5 bg-orange-100 rounded-md group-hover/item:bg-orange-200 transition-colors duration-200">
                            <span className="text-sm">ℹ️</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-xs font-semibold text-gray-500 mb-0.5">
                              Specialization
                            </h3>
                            <p className="text-sm text-gray-800 font-medium">
                              {doctor.specialization}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Bottom Buttons */}
                  <div className="mt-6 flex flex-col space-y-3">
                    <button className="group w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-300">
                      <span className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>BOOK APPOINTMENT</span>
                      </span>
                    </button>
                    <button
                      onClick={() => handleViewProfile(doctor)}
                      className="group w-full py-3 text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-lg shadow-gray-300/30 focus:outline-none focus:ring-4 focus:ring-gray-300"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>👤</span>
                        <span>View Profile</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show booking section below doctor cards */}
          {showBooking && selectedDoc && (
            <div className="w-full">
              <div
                id={`booking-section-${
                  selectedDoc._id || selectedDoc.name?.replace(/\s+/g, "-")
                }`}
                className="animate-slideDown"
              >
                {/* This will be handled by the parent component */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BhAssociateSelectionSection.propTypes = {
  doctors: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  onBookSession: PropTypes.func.isRequired,
  showBooking: PropTypes.bool,
  selectedDoc: PropTypes.object,
  serviceType: PropTypes.oneOf(["psychologist", "cosmetologist"]),
};

export default BhAssociateSelectionSection;
