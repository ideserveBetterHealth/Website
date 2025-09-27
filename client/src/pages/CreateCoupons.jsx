import { useState } from "react";
import axios from "axios";

const CreateCoupon = () => {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "percentage",
    maxUses: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    validFrom: "",
    validTill: "",
    isActive: true,
    isNewUserOnly: false,
    applicableServices: [],
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons`;

  axios.defaults.withCredentials = true;

  const validateForm = () => {
    const newErrors = {};

    // Validate coupon code
    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    }

    // Validate discount
    if (!formData.discount) {
      newErrors.discount = "Discount is required";
    } else if (formData.discount <= 0) {
      newErrors.discount = "Discount must be greater than 0";
    }

    // Validate discount percentage
    if (formData.discountType === "percentage" && formData.discount > 100) {
      newErrors.discount = "Percentage discount cannot exceed 100%";
    }

    // Validate validity dates
    if (!formData.validFrom) {
      newErrors.validFrom = "Valid from date is required";
    }

    if (!formData.validTill) {
      newErrors.validTill = "Valid till date is required";
    }

    if (formData.validFrom && formData.validTill) {
      const fromDate = new Date(formData.validFrom);
      const tillDate = new Date(formData.validTill);

      if (fromDate >= tillDate) {
        newErrors.validTill = "Valid till date must be after valid from date";
      }
    }

    // Validate max uses if provided
    if (formData.maxUses && formData.maxUses < 1) {
      newErrors.maxUses = "Max uses must be at least 1";
    }

    // Validate min order amount if provided
    if (formData.minOrderAmount && formData.minOrderAmount < 0) {
      newErrors.minOrderAmount = "Minimum order amount cannot be negative";
    }

    // Validate max discount amount for percentage discounts
    if (
      formData.discountType === "percentage" &&
      formData.maxDiscountAmount &&
      formData.maxDiscountAmount < 0
    ) {
      newErrors.maxDiscountAmount =
        "Maximum discount amount cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "code") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    } else if (name === "applicableServices") {
      const serviceValue = value;
      setFormData((prev) => ({
        ...prev,
        applicableServices: checked
          ? [...(prev.applicableServices || []), serviceValue]
          : (prev.applicableServices || []).filter(
              (service) => service !== serviceValue
            ),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the errors below");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE}/`, formData);

      if (response.data.success) {
        setMessage("Coupon created successfully!");
        setMessageType("success");

        // Reset form
        setFormData({
          code: "",
          discount: "",
          discountType: "percentage",
          maxUses: "",
          minOrderAmount: "",
          maxDiscountAmount: "",
          validFrom: "",
          validTill: "",
          isActive: true,
          isNewUserOnly: false,
          applicableServices: [],
          description: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error creating coupon:", error);

      if (error.response) {
        setMessage(error.response.data.message || "Failed to create coupon");
      } else if (error.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("Error creating coupon. Please try again.");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      code: "",
      discount: "",
      discountType: "percentage",
      maxUses: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      validFrom: "",
      validTill: "",
      isActive: true,
      isNewUserOnly: false,
      applicableServices: [],
      description: "",
    });
    setErrors({});
    setMessage("");
  };

  return (
    <div className="min-h-screen  bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mt-24">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create New Coupon
            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded mb-4"></div>
            <p className="text-gray-600">
              Add a new promotional coupon for services
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., NEWUSER20"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.code
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                  )}
                </div>

                {/* Discount */}
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Discount Amount *
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="e.g., 20"
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.discount
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.discount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.discount}
                    </p>
                  )}
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="discountType"
                        value="percentage"
                        checked={formData.discountType === "percentage"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 font-medium">
                        Percentage (%)
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="discountType"
                        value="fixed"
                        checked={formData.discountType === "fixed"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 font-medium">
                        Fixed Amount (₹)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Max Uses */}
                <div>
                  <label
                    htmlFor="maxUses"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Maximum Uses (Optional)
                  </label>
                  <input
                    type="number"
                    id="maxUses"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleInputChange}
                    placeholder="Leave empty for unlimited"
                    min="1"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.maxUses
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.maxUses && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.maxUses}
                    </p>
                  )}
                </div>

                {/* Min Order Amount */}
                <div>
                  <label
                    htmlFor="minOrderAmount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.minOrderAmount
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.minOrderAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.minOrderAmount}
                    </p>
                  )}
                </div>

                {/* Max Discount Amount (for percentage only) */}
                {formData.discountType === "percentage" && (
                  <div>
                    <label
                      htmlFor="maxDiscountAmount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Maximum Discount Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="maxDiscountAmount"
                      name="maxDiscountAmount"
                      value={formData.maxDiscountAmount}
                      onChange={handleInputChange}
                      placeholder="Leave empty for no limit"
                      min="0"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.maxDiscountAmount
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.maxDiscountAmount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxDiscountAmount}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Validity Period */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Validity Period
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Valid From */}
                <div>
                  <label
                    htmlFor="validFrom"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Valid From *
                  </label>
                  <input
                    type="datetime-local"
                    id="validFrom"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.validFrom
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.validFrom && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.validFrom}
                    </p>
                  )}
                </div>

                {/* Valid Till */}
                <div>
                  <label
                    htmlFor="validTill"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Valid Till *
                  </label>
                  <input
                    type="datetime-local"
                    id="validTill"
                    name="validTill"
                    value={formData.validTill}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.validTill
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.validTill && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.validTill}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Applicable Services */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Applicable Services
              </h2>
              <p className="text-gray-600 mb-4">
                Select which services this coupon can be applied to (leave empty
                for all services)
              </p>

              <div className="space-y-4">
                <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    name="applicableServices"
                    value="mental_health"
                    checked={(formData.applicableServices || []).includes(
                      "mental_health"
                    )}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <span className="text-gray-700 font-medium text-lg">
                      Mental Health Counselling
                    </span>
                    <p className="text-gray-500 text-sm">
                      Apply coupon to mental health consultation services
                    </p>
                  </div>
                </label>

                <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    name="applicableServices"
                    value="cosmetology"
                    checked={(formData.applicableServices || []).includes(
                      "cosmetology"
                    )}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <span className="text-gray-700 font-medium text-lg">
                      Cosmetology Consultation
                    </span>
                    <p className="text-gray-500 text-sm">
                      Apply coupon to cosmetology consultation services
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Description and Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Additional Details
              </h2>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of the coupon..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">
                      Coupon is Active
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-8">
                    Inactive coupons cannot be used by customers
                  </p>
                </div>

                {/* New User Only */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNewUserOnly"
                      checked={formData.isNewUserOnly}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">
                      New User Only
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-8">
                    This coupon can only be used by users who haven&apos;t
                    booked any meetings previously
                  </p>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-lg border ${
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Creating Coupon...
                  </div>
                ) : (
                  "Create Coupon"
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                disabled={loading}
                className="flex-1 py-4 bg-gray-500 text-white font-bold text-lg rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            📝 Coupon Creation Guidelines
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>
              • Coupon codes should be unique and descriptive (e.g., NEWUSER20,
              SUMMER50)
            </li>
            <li>
              • For percentage discounts, the value should be between 1-100
            </li>
            <li>• For fixed discounts, enter the amount in rupees</li>
            <li>
              • Set validity period carefully - expired coupons cannot be used
            </li>
            <li>
              • Select applicable services or leave empty to apply to all
              services
            </li>
            <li>
              • Maximum discount amount helps cap percentage-based discounts
            </li>
            <li>
              • Enable &quot;New User Only&quot; to restrict coupon usage to
              users who haven&apos;t booked any meetings
            </li>
            <li>• Coupons can be deactivated later if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
