import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Languages,
  Lightbulb,
  BadgeCheck,
  GraduationCap,
  Clock,
  ArrowLeft,
} from "lucide-react";

// --- Main Profile Content Component (to avoid repetition) ---
const ProfileContent = ({ doctor }) => {
  const specializations = doctor?.expertise || [
    "Anxiety & Stress",
    "Depression",
    "Relationships",
    "Trauma",
    "Work-life Balance",
  ];

  const fullBio =
    doctor?.bio ||
    "When you are struggling with issues like anxiety, stress, overthinking, low self-esteem, relationship conflicts, or emotional regulation, it is okay to seek help. As a therapist, I provide a safe and empathetic space to explore your feelings and develop coping strategies. My goal is to empower you on your journey towards mental well-being.";

  return (
    <div className="space-y-10 lg:space-y-16 w-full">
      {/* About Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 p-8 lg:p-12 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-[#000080] to-[#1a1a8a] rounded-full flex items-center justify-center mr-4">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#000080]">About Me</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{fullBio}</p>
      </div>

      {/* Specializations Section */}
      <div className="bg-gradient-to-br from-white to-blue-50 p-8 lg:p-12 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-[#ec5228] to-[#ff6b4a] rounded-full flex items-center justify-center mr-4">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#000080]">
            I Specialize in the following
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specializations.map((spec, i) => (
            <div
              key={i}
              className="group bg-white border-2 border-gray-200 hover:border-[#ec5228] text-gray-700 py-4 px-6 rounded-2xl text-base font-medium hover:bg-gradient-to-r hover:from-[#ec5228] hover:to-[#ff6b4a] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span className="flex items-center">
                <span className="w-2 h-2 bg-[#ec5228] rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                {spec}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App component ---
export default function App() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!doctor);

  useEffect(() => {
    if (!doctor && id) {
      // Fetch doctor data from API
      // Assuming an API endpoint like /api/bh-associate/profile/${id}
      fetch(`/api/bh-associate/profile/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDoctor(data.doctor);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [doctor, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef3c7]/20 via-[#fde68a]/20 to-[#fcd34d]/20 font-sans text-gray-900">
      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#000080] transition-colors duration-300 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 lg:p-12 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 relative overflow-hidden mb-12">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ec5228]/10 to-[#000080]/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#000080]/10 to-[#ec5228]/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="lg:flex lg:items-center lg:gap-12 relative z-10">
            <div className="relative flex-shrink-0 flex justify-center mb-8 lg:mb-0">
              <div className="relative">
                <img
                  src={
                    doctor.photoUrl ||
                    "https://placehold.co/150x150/f6a593/ffffff?text=PD"
                  }
                  alt={doctor.name}
                  className="w-40 h-40 lg:w-48 lg:h-48 rounded-full shadow-2xl border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                  <BadgeCheck className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left flex-1">
              <div className="mb-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#000080] mb-2">
                  {doctor.name}
                </h2>
                <p className="text-xl text-gray-700 font-medium">
                  {doctor.designation}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-4 mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#000080] to-[#1a1a8a] text-white text-sm font-semibold rounded-full shadow-md">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {doctor.qualifications || "M.Phil, RCI Reg."}
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#ec5228] to-[#ff6b4a] text-white text-sm font-semibold rounded-full shadow-md">
                  <Clock className="w-4 h-4 mr-2" />
                  {doctor.experience?.split(" ")[0] || "2"} Years Experience
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white text-sm font-semibold rounded-full shadow-md">
                  <Languages className="w-4 h-4 mr-2" />
                  {(doctor?.languages || ["English", "Hindi"]).join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-7xl mx-auto">
          <div className="p-4 lg:p-0">
            <ProfileContent doctor={doctor} />
          </div>
        </div>
      </main>
    </div>
  );
}
