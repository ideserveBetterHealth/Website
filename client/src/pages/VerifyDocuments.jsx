import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

const VerifyDocuments = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  axios.defaults.withCredentials = true;

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`;

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch pending BH Associates
  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/status-pending`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setPendingDoctors(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching pending BH Associates:", error);
      toast.error("Failed to fetch pending BH Associates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchPendingDoctors();
    }
  }, [user]);

  const handleViewDetails = (doctorId) => {
    navigate(`/admin/verification-pending/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Verify Documents
          </h1>

          {pendingDoctors.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                All Caught Up!
              </h2>
              <p className="text-gray-500">
                No BH Associates with pending verification at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="mb-4">
                <p className="text-gray-600">
                  {pendingDoctors.length} BH Associate(s) pending verification
                </p>
              </div>

              {pendingDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <span className="text-blue-600 font-semibold text-lg">
                            {doctor.name?.charAt(0)?.toUpperCase() || "A"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {doctor.name}
                          </h3>
                          <p className="text-gray-600">{doctor.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Verification
                            </span>
                            <span className="text-sm text-gray-500">
                              Role: {doctor.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewDetails(doctor._id)}
                        className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyDocuments;
