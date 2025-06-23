// PaymentPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { service, planType } = useParams(); // Get both service and planType from URL params
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments`;

  // Get default payment link on component mount
  React.useEffect(() => {
    fetchDefaultPaymentLink();
  }, [service, planType]);

  const fetchDefaultPaymentLink = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/default/${service}/${planType}`
      );

      if (response.data.success) {
        setPaymentLink(response.data.data.paymentLink);
      }
    } catch (error) {
      console.error("Error fetching default payment link:", error);
      if (error.response) {
        setMessage(
          error.response.data.message || "Failed to load payment link"
        );
        setMessageType("error");
      }
    }
  };

  const handleCouponVerify = async () => {
    if (!couponCode.trim()) {
      setMessage("Please enter a coupon code");
      setMessageType("error");
      return;
    }

    if (isExistingUser && !email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${API_BASE}/verify-coupon/${service}/${planType}`,
        {
          couponCode: couponCode.trim(),
          email: isExistingUser ? email.trim() : null,
          isExistingUser,
        }
      );

      if (response.data.success) {
        setPaymentLink(response.data.data.paymentLink);
        setMessage("Coupon applied successfully!");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);

      if (error.response) {
        // Server responded with error status
        setMessage(error.response.data.message || "Failed to verify coupon");
      } else if (error.request) {
        // Request was made but no response received
        setMessage("Network error. Please check your connection.");
      } else {
        // Something else happened
        setMessage("Error verifying coupon. Please try again.");
      }

      setMessageType("error");
      // Reset to default payment link on error
      fetchDefaultPaymentLink();
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPay = () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
    }
  };

  const resetForm = () => {
    setCouponCode("");
    setEmail("");
    setMessage("");
    fetchDefaultPaymentLink();
  };

  const formatServiceName = (serviceName) => {
    return serviceName
      ?.replace(/([A-Z])/g, " $1")
      .replace(/-/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPlanType = (plan) => {
    return plan?.charAt(0).toUpperCase() + plan?.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment for {formatServiceName(service)}
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded mb-2"></div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {formatPlanType(planType)} Plan
          </span>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Select User Type
          </h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="userType"
                checked={!isExistingUser}
                onChange={() => {
                  setIsExistingUser(false);
                  resetForm();
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">New User</span>
            </label>

            <label className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="userType"
                checked={isExistingUser}
                onChange={() => {
                  setIsExistingUser(true);
                  resetForm();
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-medium">
                Existing User
              </span>
            </label>
          </div>
        </div>

        {/* Email Input for Existing Users */}
        {isExistingUser && (
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        )}

        {/* Coupon Code Section */}
        <div className="mb-6">
          <label
            htmlFor="coupon"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Coupon Code (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={handleCouponVerify}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Verifying...
                </div>
              ) : (
                "Verify"
              )}
            </button>
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

        {/* Payment Button */}
        <div className="mb-6">
          <button
            onClick={handleProceedToPay}
            disabled={!paymentLink}
            className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors transform hover:scale-105 active:scale-95"
          >
            Proceed to Payment
          </button>
        </div>

        {/* Service Info */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-700 font-medium mb-2">
            <span className="text-gray-500">Service:</span>{" "}
            {formatServiceName(service)} ({formatPlanType(planType)} Plan)
          </p>
          <p className="text-sm text-gray-500">
            {isExistingUser ? (
              <div className="flex items-start space-x-2 max-w-md">
                <svg
                  className="w-4 h-4 mr-1 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-gray-700 text-sm leading-snug w-full items-center">
                  Progress takes time — each session is a step closer to a
                  stronger, healthier you.
                </p>
              </div>
            ) : (
              <div className="flex items-start space-x-2 max-w-md">
                <svg
                  className="w-5 h-5 mt-1 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-gray-700 text-sm leading-snug">
                  Selecting <span className="font-medium">'New User'</span>{" "}
                  despite being already registered violates our Terms &
                  conditions.
                </p>
              </div>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
