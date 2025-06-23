import { useState, useEffect } from "react";
import axios from "axios";

const AllCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    couponId: null,
    couponCode: "",
  });

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments`;
  axios.defaults.withCredentials = true;

  const fetchAllCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/coupons`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setMessage("Failed to load coupons");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (couponId, currentStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/coupon/${couponId}/status`,
        {
          isActive: !currentStatus,
        }
      );

      if (response.data.success) {
        setMessage(
          `Coupon ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
        setMessageType("success");
        fetchAllCoupons(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating coupon status:", error);
      setMessage("Failed to update coupon status");
      setMessageType("error");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const response = await axios.delete(`${API_BASE}/coupon/${couponId}`);

      if (response.data.success) {
        setMessage("Coupon deleted successfully");
        setMessageType("success");
        setDeleteModal({ show: false, couponId: null, couponCode: "" });
        fetchAllCoupons(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      setMessage("Failed to delete coupon");
      setMessageType("error");
    }
  };

  const openDeleteModal = (couponId, couponCode) => {
    setDeleteModal({ show: true, couponId, couponCode });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, couponId: null, couponCode: "" });
  };

  const formatServiceName = (serviceName) => {
    return serviceName.replace(/([A-Z])/g, " $1").trim();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className=" flex items-center space-x-2">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg text-gray-600">Loading coupons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mt-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                All Coupons
              </h1>
              <div className="w-20 h-1 bg-blue-500 rounded mb-4"></div>
              <p className="text-gray-600">Manage promotional coupons</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={fetchAllCoupons}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-start">
              {messageType === "success" ? (
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No Coupons Found
            </h3>
            <p className="text-gray-500">
              Create your first coupon to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                {/* Coupon Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {coupon.couponCode}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          coupon.forNewUsers
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {coupon.forNewUsers ? "New Users" : "Existing Users"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          coupon.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={`text-sm font-medium ${
                          coupon.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Links */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Payment Links:
                  </h4>

                  {/* Mental Health Counselling */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">
                      Mental Health Counselling
                    </h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Single:</span>
                        <span
                          className="text-blue-600 truncate ml-2 max-w-32"
                          title={
                            coupon.paymentLinks.mentalHealthCounselling.single
                          }
                        >
                          {coupon.paymentLinks.mentalHealthCounselling.single.substring(
                            0,
                            30
                          )}
                          ...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bundle:</span>
                        <span
                          className="text-blue-600 truncate ml-2 max-w-32"
                          title={
                            coupon.paymentLinks.mentalHealthCounselling.bundle
                          }
                        >
                          {coupon.paymentLinks.mentalHealthCounselling.bundle.substring(
                            0,
                            30
                          )}
                          ...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cosmetologist Consultancy */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h5 className="text-sm font-medium text-purple-800 mb-2">
                      Cosmetologist Consultancy
                    </h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Single:</span>
                        <span
                          className="text-purple-600 truncate ml-2 max-w-32"
                          title={
                            coupon.paymentLinks.cosmetologistConsultancy.single
                          }
                        >
                          {coupon.paymentLinks.cosmetologistConsultancy.single.substring(
                            0,
                            30
                          )}
                          ...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bundle:</span>
                        <span
                          className="text-purple-600 truncate ml-2 max-w-32"
                          title={
                            coupon.paymentLinks.cosmetologistConsultancy.bundle
                          }
                        >
                          {coupon.paymentLinks.cosmetologistConsultancy.bundle.substring(
                            0,
                            30
                          )}
                          ...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-gray-500 mb-4">
                    <div>Created: {formatDate(coupon.createdAt)}</div>
                    <div>Updated: {formatDate(coupon.updatedAt)}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleStatus(coupon._id, coupon.isActive)
                      }
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        coupon.isActive
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        openDeleteModal(coupon._id, coupon.couponCode)
                      }
                      className="flex-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Delete Coupon
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the coupon "
                  <span className="font-medium text-red-600">
                    {deleteModal.couponCode}
                  </span>
                  "? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(deleteModal.couponId)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoupons;
