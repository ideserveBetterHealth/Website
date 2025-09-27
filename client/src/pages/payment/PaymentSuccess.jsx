import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPaymentMutation } from "@/features/api/paymentApi";
import { toast } from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = searchParams.get("order_id");

  const verifyAndShowPayment = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await verifyPayment({ orderId }).unwrap();

      if (result.success && result.payment) {
        setPaymentData(result.payment);

        if (result.paymentStatus === "completed") {
          toast.success("Payment completed successfully!");
        }
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError(
        error.data?.message || error.message || "Failed to verify payment"
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId, verifyPayment]);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID not found");
      setIsLoading(false);
      return;
    }

    verifyAndShowPayment();
  }, [orderId, verifyAndShowPayment]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
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
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Payment Data
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to retrieve payment information.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your payment. Your session has been booked
            successfully.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">
              Order ID: {paymentData.orderId}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Payment Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Service Type
              </h3>
              <p className="text-lg font-semibold text-gray-800 capitalize">
                {paymentData.serviceType?.replace("-", " ")}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Session Type
              </h3>
              <p className="text-lg font-semibold text-gray-800 capitalize">
                {paymentData.sessionType}
                {paymentData.sessionType === "pack" && " (3 Sessions)"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Duration
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {paymentData.duration} minutes
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Amount Paid
              </h3>
              <p className="text-lg font-semibold text-green-600">
                ₹{paymentData.finalAmount?.toLocaleString("en-IN")}
              </p>
            </div>

            {paymentData.appointmentDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Appointment Date
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {formatDate(paymentData.appointmentDate)}
                </p>
              </div>
            )}

            {paymentData.appointmentTime && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Appointment Time
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(paymentData.appointmentTime)}
                </p>
              </div>
            )}

            {paymentData.paymentMethod && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Payment Method
                </h3>
                <p className="text-lg font-semibold text-gray-800 capitalize">
                  {paymentData.paymentMethod}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Payment ID
              </h3>
              <p className="text-sm font-mono text-gray-600">
                {paymentData.paymentId || "Processing..."}
              </p>
            </div>
          </div>

          {paymentData.appliedCoupon && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Coupon Applied
              </h3>
              <p className="text-blue-700 font-semibold">
                {paymentData.appliedCoupon.code} -
                {paymentData.appliedCoupon.discountType === "percentage"
                  ? ` ${paymentData.appliedCoupon.discount}% OFF`
                  : ` ₹${paymentData.appliedCoupon.discount} OFF`}
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What&apos;s Next?
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <p className="text-gray-700">
                You will receive a confirmation email with session details.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <p className="text-gray-700">
                Our team will contact you 30 minutes before your session.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <p className="text-gray-700">
                Join the session using the link provided via email or SMS.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/my-schedule")}
            className="flex-1 bg-[#000080] hover:bg-[#000080]/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            View My Sessions
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
