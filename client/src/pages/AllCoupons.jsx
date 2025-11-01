import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Edit Modal Component
const EditCouponModal = ({ coupon, onClose, onUpdate }) => {
  const [editData, setEditData] = useState({
    code: coupon.code,
    description: coupon.description || "",
    maxUses: coupon.maxUses || "",
    validFrom: new Date(coupon.validFrom).toISOString().slice(0, 16),
    validTill: new Date(coupon.validTill).toISOString().slice(0, 16),
    isActive: coupon.isActive,
    isNewUserOnly: coupon.isNewUserOnly,
    serviceDiscounts: coupon.serviceDiscounts || [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceChange = (serviceIndex, field, value) => {
    setEditData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[serviceIndex][field] = value;
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleAddPlanDiscount = (serviceIndex) => {
    setEditData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      if (!newServiceDiscounts[serviceIndex].planDiscounts) {
        newServiceDiscounts[serviceIndex].planDiscounts = [];
      }
      newServiceDiscounts[serviceIndex].planDiscounts.push({
        sessions: "",
        duration: "",
        discount: "",
        discountType: "percentage",
        maxDiscountAmount: "",
      });
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleRemovePlanDiscount = (serviceIndex, planIndex) => {
    setEditData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[serviceIndex].planDiscounts.splice(planIndex, 1);
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handlePlanDiscountChange = (serviceIndex, planIndex, field, value) => {
    setEditData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts[serviceIndex].planDiscounts[planIndex][field] = value;
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleAddService = (serviceType) => {
    setEditData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts.push({
        serviceType: serviceType,
        discount: "",
        discountType: "percentage",
        maxDiscountAmount: "",
        minOrderAmount: "",
        planDiscounts: [],
      });
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const handleRemoveService = (serviceIndex) => {
    setEditData((prev) => {
      const newServiceDiscounts = [...prev.serviceDiscounts];
      newServiceDiscounts.splice(serviceIndex, 1);
      return { ...prev, serviceDiscounts: newServiceDiscounts };
    });
  };

  const getAvailableServices = () => {
    const existingTypes = editData.serviceDiscounts.map((sd) => sd.serviceType);
    const allServices = [
      { type: "mental_health", name: "Mental Health" },
      { type: "cosmetology", name: "Cosmetology" },
    ];
    return allServices.filter(
      (service) => !existingTypes.includes(service.type)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editData);
  };

  const getServiceName = (serviceType) => {
    return serviceType === "mental_health" ? "Mental Health" : "Cosmetology";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
          <h3 className="text-2xl font-bold text-gray-800">Edit Coupon</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={editData.code}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Service Discounts */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Service Discounts
              </h4>
              {getAvailableServices().length > 0 && (
                <div className="relative group">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Service
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {getAvailableServices().map((service) => (
                      <button
                        key={service.type}
                        type="button"
                        onClick={() => handleAddService(service.type)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {editData.serviceDiscounts.map((serviceDiscount, serviceIndex) => (
              <div
                key={serviceIndex}
                className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-md font-semibold text-gray-800">
                    {getServiceName(serviceDiscount.serviceType)}
                  </h5>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(serviceIndex)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors flex items-center"
                    title="Remove this service"
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      value={serviceDiscount.discount}
                      onChange={(e) =>
                        handleServiceChange(
                          serviceIndex,
                          "discount",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type
                    </label>
                    <select
                      value={serviceDiscount.discountType}
                      onChange={(e) =>
                        handleServiceChange(
                          serviceIndex,
                          "discountType",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  {/* Min Order Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={serviceDiscount.minOrderAmount || ""}
                      onChange={(e) =>
                        handleServiceChange(
                          serviceIndex,
                          "minOrderAmount",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Max Discount Amount */}
                  {serviceDiscount.discountType === "percentage" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Discount Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={serviceDiscount.maxDiscountAmount || ""}
                        onChange={(e) =>
                          handleServiceChange(
                            serviceIndex,
                            "maxDiscountAmount",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Plan-Specific Discounts */}
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="text-sm font-semibold text-gray-700">
                      Plan-Specific Discounts
                    </h6>
                    <button
                      type="button"
                      onClick={() => handleAddPlanDiscount(serviceIndex)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Plan
                    </button>
                  </div>

                  {serviceDiscount.planDiscounts &&
                    serviceDiscount.planDiscounts.length > 0 && (
                      <div className="space-y-3">
                        {serviceDiscount.planDiscounts.map(
                          (plan, planIndex) => (
                            <div
                              key={planIndex}
                              className="p-4 bg-white rounded-lg border border-blue-200"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-semibold text-blue-800">
                                  Plan #{planIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemovePlanDiscount(
                                      serviceIndex,
                                      planIndex
                                    )
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Sessions
                                  </label>
                                  <input
                                    type="number"
                                    value={plan.sessions}
                                    onChange={(e) =>
                                      handlePlanDiscountChange(
                                        serviceIndex,
                                        planIndex,
                                        "sessions",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Duration (min)
                                  </label>
                                  <input
                                    type="number"
                                    value={plan.duration}
                                    onChange={(e) =>
                                      handlePlanDiscountChange(
                                        serviceIndex,
                                        planIndex,
                                        "duration",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Discount Type
                                  </label>
                                  <select
                                    value={plan.discountType}
                                    onChange={(e) =>
                                      handlePlanDiscountChange(
                                        serviceIndex,
                                        planIndex,
                                        "discountType",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="percentage">
                                      Percentage
                                    </option>
                                    <option value="fixed">Fixed</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Discount
                                  </label>
                                  <input
                                    type="number"
                                    value={plan.discount}
                                    onChange={(e) =>
                                      handlePlanDiscountChange(
                                        serviceIndex,
                                        planIndex,
                                        "discount",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {plan.discountType === "percentage" && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Max Discount (₹)
                                    </label>
                                    <input
                                      type="number"
                                      value={plan.maxDiscountAmount || ""}
                                      onChange={(e) =>
                                        handlePlanDiscountChange(
                                          serviceIndex,
                                          planIndex,
                                          "maxDiscountAmount",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Uses (Leave empty for unlimited)
            </label>
            <input
              type="number"
              name="maxUses"
              value={editData.maxUses}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid From
              </label>
              <input
                type="datetime-local"
                name="validFrom"
                value={editData.validFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Till
              </label>
              <input
                type="datetime-local"
                name="validTill"
                value={editData.validTill}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={editData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Active
              </span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isNewUserOnly"
                checked={editData.isNewUserOnly}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                New Users Only
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 sticky bottom-0 bg-white border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [editModal, setEditModal] = useState({
    show: false,
    coupon: null,
  });

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons`;
  axios.defaults.withCredentials = true;

  const fetchAllCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setMessage("Failed to load coupons");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons]);

  const handleToggleStatus = async (couponId, currentStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/${couponId}`, {
        isActive: !currentStatus,
      });

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
      const response = await axios.delete(`${API_BASE}/${couponId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage("Coupon deleted successfully");
        setMessageType("success");
        setDeleteModal({ show: false, couponId: null, couponCode: "" });
        fetchAllCoupons(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);

      if (error.response) {
        if (error.response.status === 403) {
          setMessage("Access denied: Only administrators can delete coupons");
        } else if (error.response.status === 401) {
          setMessage("Please login to delete coupons");
        } else {
          setMessage(error.response.data.message || "Failed to delete coupon");
        }
      } else if (error.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("Failed to delete coupon");
      }
      setMessageType("error");
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditModal({ show: true, coupon });
  };

  const closeEditModal = () => {
    setEditModal({ show: false, coupon: null });
  };

  const handleUpdateCoupon = async (updatedData) => {
    try {
      const response = await axios.put(
        `${API_BASE}/${editModal.coupon._id}`,
        updatedData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage("Coupon updated successfully");
        setMessageType("success");
        closeEditModal();
        fetchAllCoupons();
      }
    } catch (error) {
      console.error("Error updating coupon:", error);

      if (error.response) {
        if (error.response.status === 403) {
          setMessage("Access denied: Only administrators can update coupons");
        } else if (error.response.status === 401) {
          setMessage("Please login to update coupons");
        } else {
          setMessage(error.response.data.message || "Failed to update coupon");
        }
      } else {
        setMessage("Failed to update coupon");
      }
      setMessageType("error");
    }
  };

  const openDeleteModal = (couponId, couponCode) => {
    setDeleteModal({ show: true, couponId, couponCode });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, couponId: null, couponCode: "" });
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
                        {coupon.code}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {coupon.isNewUserOnly && (
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                            New Users Only
                          </span>
                        )}
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {coupon.serviceDiscounts?.length || 0} Service
                          {coupon.serviceDiscounts?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
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

                {/* Coupon Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Service-Specific Discounts */}
                    {coupon.serviceDiscounts &&
                      coupon.serviceDiscounts.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Service-Specific Discounts
                          </h4>
                          {coupon.serviceDiscounts.map(
                            (serviceDiscount, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center">
                                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                    <span className="font-semibold text-gray-800">
                                      {serviceDiscount.serviceType ===
                                      "mental_health"
                                        ? "Mental Health"
                                        : "Cosmetology"}
                                    </span>
                                  </div>
                                  <span
                                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                      serviceDiscount.discountType ===
                                      "percentage"
                                        ? "bg-blue-600 text-white"
                                        : "bg-green-600 text-white"
                                    }`}
                                  >
                                    {serviceDiscount.discountType ===
                                    "percentage"
                                      ? `${serviceDiscount.discount}% OFF`
                                      : `₹${serviceDiscount.discount} OFF`}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">
                                      Min Order:
                                    </span>{" "}
                                    ₹{serviceDiscount.minOrderAmount || 0}
                                  </div>
                                  {serviceDiscount.maxDiscountAmount && (
                                    <div>
                                      <span className="font-medium">
                                        Max Discount:
                                      </span>{" "}
                                      ₹{serviceDiscount.maxDiscountAmount}
                                    </div>
                                  )}
                                </div>

                                {/* Plan-Specific Discounts */}
                                {serviceDiscount.planDiscounts &&
                                  serviceDiscount.planDiscounts.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-blue-300">
                                      <div className="flex items-center mb-2">
                                        <svg
                                          className="w-4 h-4 text-blue-600 mr-1"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="text-xs font-semibold text-blue-800">
                                          Plan-Specific Overrides (
                                          {serviceDiscount.planDiscounts.length}
                                          )
                                        </span>
                                      </div>
                                      <div className="space-y-2">
                                        {serviceDiscount.planDiscounts.map(
                                          (planDiscount, planIndex) => (
                                            <div
                                              key={planIndex}
                                              className="bg-white rounded p-2 border border-blue-200"
                                            >
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-gray-700">
                                                  {planDiscount.sessions}{" "}
                                                  {planDiscount.sessions === 1
                                                    ? "session"
                                                    : "sessions"}
                                                  , {planDiscount.duration} min
                                                </span>
                                                <span className="text-xs font-bold text-blue-700">
                                                  {planDiscount.discountType ===
                                                  "percentage"
                                                    ? `${planDiscount.discount}%`
                                                    : `₹${planDiscount.discount}`}
                                                  {planDiscount.maxDiscountAmount &&
                                                    ` (max ₹${planDiscount.maxDiscountAmount})`}
                                                </span>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {/* Usage Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Usage Information
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Used:</span>
                          <span className="font-medium">
                            {coupon.usedCount || 0} times
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Uses:</span>
                          <span className="font-medium">
                            {coupon.maxUses
                              ? `${coupon.maxUses} times`
                              : "Unlimited"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">New Users Only:</span>
                          <span
                            className={`font-medium ${
                              coupon.isNewUserOnly
                                ? "text-orange-600"
                                : "text-gray-600"
                            }`}
                          >
                            {coupon.isNewUserOnly ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Validity Period */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Validity Period
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">From:</span>
                          <span className="font-medium">
                            {formatDate(coupon.validFrom)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Till:</span>
                          <span className="font-medium">
                            {formatDate(coupon.validTill)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {coupon.description && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-gray-600">
                          {coupon.description}
                        </p>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="text-xs text-gray-500">
                      <div>Created: {formatDate(coupon.createdAt)}</div>
                      <div>Updated: {formatDate(coupon.updatedAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="flex-1 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>

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
                      onClick={() => openDeleteModal(coupon._id, coupon.code)}
                      className="flex-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
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
                  Are you sure you want to delete the coupon &quot;
                  <span className="font-medium text-red-600">
                    {deleteModal.couponCode}
                  </span>
                  &quot;? This action cannot be undone.
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

        {/* Edit Modal */}
        {editModal.show && editModal.coupon && (
          <EditCouponModal
            coupon={editModal.coupon}
            onClose={closeEditModal}
            onUpdate={handleUpdateCoupon}
          />
        )}
      </div>
    </div>
  );
};

export default AllCoupons;
