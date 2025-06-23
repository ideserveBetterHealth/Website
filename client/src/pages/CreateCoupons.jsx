import { useState } from "react";
import axios from "axios";

const CreateCoupon = () => {
  const [formData, setFormData] = useState({
    couponCode: "",
    forNewUsers: false,
    isActive: true,
    paymentLinks: {
      mentalHealthCounselling: {
        single: "",
        bundle: "",
      },
      cosmetologistConsultancy: {
        single: "",
        bundle: "",
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments`;

  axios.defaults.withCredentials = true;

  const validateForm = () => {
    const newErrors = {};

    // Validate coupon code
    if (!formData.couponCode.trim()) {
      newErrors.couponCode = "Coupon code is required";
    } else if (formData.couponCode.length < 3) {
      newErrors.couponCode = "Coupon code must be at least 3 characters";
    }

    // Validate payment links
    const services = ["mentalHealthCounselling", "cosmetologistConsultancy"];
    const plans = ["single", "bundle"];

    services.forEach((service) => {
      plans.forEach((plan) => {
        const link = formData.paymentLinks[service][plan];
        if (!link.trim()) {
          newErrors[`${service}_${plan}`] = "Payment link is required";
        } else if (!isValidUrl(link)) {
          newErrors[`${service}_${plan}`] = "Please enter a valid URL";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "couponCode") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
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

  const handlePaymentLinkChange = (service, plan, value) => {
    setFormData((prev) => ({
      ...prev,
      paymentLinks: {
        ...prev.paymentLinks,
        [service]: {
          ...prev.paymentLinks[service],
          [plan]: value,
        },
      },
    }));
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
      const response = await axios.post(`${API_BASE}/coupon`, formData);

      if (response.data.success) {
        setMessage("Coupon created successfully!");
        setMessageType("success");

        // Reset form
        setFormData({
          couponCode: "",
          forNewUsers: false,
          isActive: true,
          paymentLinks: {
            mentalHealthCounselling: {
              single: "",
              bundle: "",
            },
            cosmetologistConsultancy: {
              single: "",
              bundle: "",
            },
          },
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
      couponCode: "",
      forNewUsers: false,
      isActive: true,
      paymentLinks: {
        mentalHealthCounselling: {
          single: "",
          bundle: "",
        },
        cosmetologistConsultancy: {
          single: "",
          bundle: "",
        },
      },
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

        {/* Main Form */}
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
                    htmlFor="couponCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    id="couponCode"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="e.g., NEWUSER20"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.couponCode
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.couponCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.couponCode}
                    </p>
                  )}
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Users *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="forNewUsers"
                        checked={formData.forNewUsers === true}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            forNewUsers: true,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 font-medium">
                        New Users Only
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="forNewUsers"
                        checked={formData.forNewUsers === false}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            forNewUsers: false,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 font-medium">
                        Existing Users Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="mt-6">
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
              </div>
            </div>

            {/* Payment Links */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Payment Links
              </h2>

              {/* Mental Health Counselling */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mental Health Counselling
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Single Session Link *
                    </label>
                    <input
                      type="url"
                      value={
                        formData.paymentLinks.mentalHealthCounselling.single
                      }
                      onChange={(e) =>
                        handlePaymentLinkChange(
                          "mentalHealthCounselling",
                          "single",
                          e.target.value
                        )
                      }
                      placeholder="https://payment.com/mental-health-single"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.mentalHealthCounselling_single
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.mentalHealthCounselling_single && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mentalHealthCounselling_single}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bundle Sessions Link *
                    </label>
                    <input
                      type="url"
                      value={
                        formData.paymentLinks.mentalHealthCounselling.bundle
                      }
                      onChange={(e) =>
                        handlePaymentLinkChange(
                          "mentalHealthCounselling",
                          "bundle",
                          e.target.value
                        )
                      }
                      placeholder="https://payment.com/mental-health-bundle"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.mentalHealthCounselling_bundle
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.mentalHealthCounselling_bundle && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mentalHealthCounselling_bundle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cosmetologist Consultancy */}
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cosmetologist Consultancy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Single Session Link *
                    </label>
                    <input
                      type="url"
                      value={
                        formData.paymentLinks.cosmetologistConsultancy.single
                      }
                      onChange={(e) =>
                        handlePaymentLinkChange(
                          "cosmetologistConsultancy",
                          "single",
                          e.target.value
                        )
                      }
                      placeholder="https://payment.com/cosmetologist-single"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.cosmetologistConsultancy_single
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.cosmetologistConsultancy_single && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cosmetologistConsultancy_single}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bundle Sessions Link *
                    </label>
                    <input
                      type="url"
                      value={
                        formData.paymentLinks.cosmetologistConsultancy.bundle
                      }
                      onChange={(e) =>
                        handlePaymentLinkChange(
                          "cosmetologistConsultancy",
                          "bundle",
                          e.target.value
                        )
                      }
                      placeholder="https://payment.com/cosmetologist-bundle"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.cosmetologistConsultancy_bundle
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    {errors.cosmetologistConsultancy_bundle && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cosmetologistConsultancy_bundle}
                      </p>
                    )}
                  </div>
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
              BUNDLE50)
            </li>
            <li>
              • Choose target users carefully - new users or existing users only
            </li>
            <li>
              • Ensure all payment links are valid and functional before
              creating
            </li>
            <li>
              • Test payment links in a separate browser tab before submission
            </li>
            <li>• Coupons can be deactivated later if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
