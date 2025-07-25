import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Eye, CheckCircle, Search, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

const VerifiedDoctors = () => {
  const [verifiedDoctors, setVerifiedDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if search was performed
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const limit = 10;

  axios.defaults.withCredentials = true;

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`;

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/");
    }
  }, [user, navigate]);

  const fetchVerifiedDoctors = async (
    pageNum,
    isSearch = false,
    email = ""
  ) => {
    try {
      if (!isSearch) setLoading(true);
      const response = await axios.get(`${API_BASE}/status-verified`, {
        withCredentials: true,
        params: {
          page: pageNum,
          limit,
          email: email || undefined,
        },
      });

      if (response.data.success) {
        const newDoctors = response.data.user;
        if (isSearch) {
          setVerifiedDoctors(newDoctors);
        } else {
          setVerifiedDoctors((prev) => [...prev, ...newDoctors]);
        }
        setHasNextPage(response.data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error("Error fetching verified doctors:", error);
      toast.error("Failed to fetch verified doctors");
    } finally {
      if (!isSearch) setLoading(false);
    }
  };

  const handleSearch = async (email) => {
    if (!email.trim()) {
      // Reset to normal pagination when search is cleared
      setVerifiedDoctors([]);
      setPage(1);
      setHasNextPage(true);
      setHasSearched(false); // Reset search state
      fetchVerifiedDoctors(1);
      return;
    }

    try {
      setSearchLoading(true);
      setHasSearched(true); // Mark that search was performed
      await fetchVerifiedDoctors(1, true, email.trim());
      setPage(1);
      setHasNextPage(false); // Disable infinite scroll for search results
    } catch (error) {
      console.error("Error searching doctors:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin" && !searchTerm) {
      fetchVerifiedDoctors(page);
    }
  }, [page, user]);

  // Setup intersection observer (only when not searching)
  const lastDoctorRef = useCallback(
    (node) => {
      if (loading || !hasNextPage || hasSearched) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasNextPage, hasSearched]
  );

  const handleViewDetails = (doctorId) => {
    navigate(`/admin/Verified-doc-details/${doctorId}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setHasSearched(false); // Reset search state
    setVerifiedDoctors([]);
    setPage(1);
    setHasNextPage(true);
    fetchVerifiedDoctors(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Verified BH Associates
            </h1>

            {/* Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </form>
          </div>

          {/* Search Results Info - Only show after search is performed */}
          {hasSearched && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                {verifiedDoctors.length > 0
                  ? `Found ${verifiedDoctors.length} BH Associate(s) matching "${searchTerm}"`
                  : `No BH Associates found matching "${searchTerm}"`}
              </p>
            </div>
          )}

          {verifiedDoctors.length === 0 && !loading && !searchLoading ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                {hasSearched ? "No Results Found" : "All Caught Up!"}
              </h2>
              <p className="text-gray-500">
                {hasSearched
                  ? "Try searching with a different email address."
                  : "No verified BH Associates found at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {verifiedDoctors.map((doctor, index) => {
                const isLast = index === verifiedDoctors.length - 1;
                return (
                  <div
                    key={doctor._id}
                    ref={isLast && !hasSearched ? lastDoctorRef : null}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 rounded-full p-3">
                            <span className="text-blue-600 font-semibold text-lg">
                              {doctor.name?.charAt(0)?.toUpperCase() || "D"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {doctor.name}
                            </h3>
                            <p className="text-gray-600">{doctor.email}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-black-800">
                                verified
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
                          className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-center py-4">
                  <Loader className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiedDoctors;
