import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { load } from "@cashfreepayments/cashfree-js";
import PropTypes from "prop-types";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/features/api/paymentApi";
import { toast } from "react-hot-toast";
import { formatDateForAPI } from "@/utils/dateUtils";

const PaymentGateway = ({
  duration,
  sessions,
  serviceType,
  couponCode,
  onPaymentSuccess,
  onPaymentFailure,
  onPaymentCancel,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((store) => store.auth);

  // Create payment order when component mounts
  const createPaymentOrder = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Please login to continue");
      setIsLoading(false);
      toast.error("Please login to continue");
      return;
    }

    try {
      // Get data from localStorage
      const appointmentDetails = JSON.parse(
        localStorage.getItem("appointmentDetails") || "{}"
      );

      // Determine form data key based on service type
      const formDataKey =
        serviceType === "mental_health"
          ? "mentalHealthFormData"
          : "cosmetologyFormData";
      const formData = JSON.parse(localStorage.getItem(formDataKey) || "{}");

      // Determine practitioner field based on service type
      const practitionerField =
        serviceType === "mental_health" ? "psychologist" : "cosmetologist";
      const practitioner = appointmentDetails[practitionerField];

      if (
        !practitioner ||
        !appointmentDetails.date ||
        !appointmentDetails.time
      ) {
        const practitionerName =
          serviceType === "mental_health" ? "psychologist" : "cosmetologist";
        setError(`Please select a ${practitionerName} and appointment time`);
        setIsLoading(false);
        toast.error(`Please select a ${practitionerName} and appointment time`);
        return;
      }

      const orderData = {
        serviceType,
        duration: parseInt(duration),
        sessions: parseInt(sessions),
        psychologistId: practitioner._id,
        appointmentDate: formatDateForAPI(appointmentDetails.date),
        appointmentTime: appointmentDetails.time,
        couponCode: couponCode || undefined, // Include coupon code if available
        questionnaireResponses: {
          // Include personal details in questionnaire responses
          personalDetails: {
            fullName: formData.fullName,
            city: formData.city,
            phoneNumber: formData.whatsapp,
            email: formData.email,
            concerns: formData.concerns,
          },
          // Include any additional questionnaire responses
          ...formData.questionnaireResponses,
        },
      };

      console.log("Creating order with data:", orderData);
      const result = await createOrder(orderData).unwrap();
      console.log("Order created successfully:", result);

      setPaymentData(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Order creation error:", error);
      setError(error.data?.message || "Failed to create payment order");
      setIsLoading(false);
      toast.error(error.data?.message || "Failed to create payment order");
    }
  }, [
    isAuthenticated,
    serviceType,
    duration,
    sessions,
    couponCode,
    createOrder,
  ]);

  const handlePaymentVerification = useCallback(async () => {
    try {
      console.log("Verifying payment for order:", paymentData.orderId);

      const verificationResult = await verifyPayment({
        orderId: paymentData.orderId,
      }).unwrap();

      console.log("Payment verification result:", verificationResult);

      if (verificationResult.success) {
        const { paymentStatus, orderStatus } = verificationResult;

        if (paymentStatus === "completed" || orderStatus === "PAID") {
          // Payment successful
          toast.success("Payment completed successfully!");

          if (onPaymentSuccess) {
            onPaymentSuccess(verificationResult);
          } else {
            navigate(`/payment-success?order_id=${paymentData.orderId}`);
          }
        } else if (paymentStatus === "failed" || orderStatus === "FAILED") {
          // Payment failed
          const errorMessage = "Payment failed. Please try again.";
          toast.error(errorMessage);

          if (onPaymentFailure) {
            onPaymentFailure(errorMessage);
          } else {
            navigate("/payment-failed");
          }
        } else if (
          paymentStatus === "cancelled" ||
          orderStatus === "CANCELLED"
        ) {
          // Payment cancelled
          const cancelMessage = "Payment was cancelled.";
          toast.error(cancelMessage);

          if (onPaymentCancel) {
            onPaymentCancel(cancelMessage);
          } else {
            navigate("/");
          }
        } else {
          // Payment still pending or other status
          console.log(
            "Payment status:",
            paymentStatus,
            "Order status:",
            orderStatus
          );
          toast.info("Payment is being processed. Please wait...");

          // Retry verification after a delay
          setTimeout(() => {
            handlePaymentVerification();
          }, 3000);
        }
      } else {
        throw new Error(
          verificationResult.message || "Payment verification failed"
        );
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      const errorMessage =
        error.data?.message || error.message || "Failed to verify payment";
      setError(errorMessage);
      toast.error(errorMessage);

      if (onPaymentFailure) {
        onPaymentFailure(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    paymentData?.orderId,
    verifyPayment,
    onPaymentSuccess,
    onPaymentFailure,
    onPaymentCancel,
    navigate,
  ]);

  const initializePayment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // Load Cashfree SDK
      const cashfree = await load({
        mode:
          import.meta.env.VITE_NODE_ENV === "production"
            ? "production"
            : "sandbox",
      });

      if (!cashfree) {
        throw new Error("Failed to load Cashfree SDK");
      }

      const checkoutOptions = {
        paymentSessionId: paymentData.paymentSessionId,
        redirectTarget: "_modal",
      };

      console.log(
        "Initializing Cashfree checkout with options:",
        checkoutOptions
      );

      // Open Cashfree checkout
      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        console.error("Cashfree checkout error:", result.error);
        throw new Error(result.error.message || "Payment failed");
      }

      if (result.redirect) {
        console.log("Payment redirected");
      }

      // Verify payment after checkout
      await handlePaymentVerification();
    } catch (err) {
      console.error("Payment initialization error:", err);
      setError(err.message || "Failed to initialize payment");
      setIsLoading(false);

      if (onPaymentFailure) {
        onPaymentFailure(err.message);
      }
    }
  }, [
    paymentData?.paymentSessionId,
    handlePaymentVerification,
    onPaymentFailure,
  ]);

  // Create payment order when component mounts
  useEffect(() => {
    createPaymentOrder();
  }, [createPaymentOrder]);

  // Initialize payment when paymentData is available
  useEffect(() => {
    if (!paymentData?.paymentSessionId || !paymentData?.orderId) {
      return;
    }

    initializePayment();
  }, [paymentData, initializePayment]);

  const handleRetry = () => {
    setError("");
    initializePayment();
  };

  const handleCancel = () => {
    if (onPaymentCancel) {
      onPaymentCancel("Payment cancelled by user");
    } else {
      navigate("/");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
            Payment Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 bg-[#000080] hover:bg-[#000080]/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000080] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Initializing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we redirect you to the payment gateway...
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Do not close this window or navigate away
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Your payment is being processed. Please wait...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

PaymentGateway.propTypes = {
  duration: PropTypes.number.isRequired,
  sessions: PropTypes.number.isRequired,
  serviceType: PropTypes.string.isRequired,
  couponCode: PropTypes.string,
  onPaymentSuccess: PropTypes.func,
  onPaymentFailure: PropTypes.func,
  onPaymentCancel: PropTypes.func,
};

export default PaymentGateway;
