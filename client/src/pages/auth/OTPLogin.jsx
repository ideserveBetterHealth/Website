import { useState, useEffect } from "react";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/features/api/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OTPLogin = () => {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();

  // Redirect if already authenticated and profile is complete
  useEffect(() => {
    if (isAuthenticated && user?.profileCompleted) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const result = await sendOTP({ phoneNumber }).unwrap();
      toast.success(result.message);
      setStep(2);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      toast.error(error.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const result = await verifyOTP({ phoneNumber, otp }).unwrap();
      toast.success(result.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.data?.message || "Invalid OTP");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#000080] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#000080] mb-2">
              {step === 1 && "Login to Better Health"}
              {step === 2 && "Verify OTP"}
            </h1>
            <p className="text-gray-600">
              {step === 1 && "Enter your WhatsApp number to get started"}
              {step === 2 && "Enter the 6-digit code sent to your WhatsApp"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              {[1, 2].map((stepNum) => (
                <div key={stepNum} className="flex items-center ">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= stepNum
                        ? "bg-[#000080] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 2 && (
                    <div
                      className={`w-8 h-1 transition-colors mx-2 ${
                        step > stepNum ? "bg-[#000080]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: WhatsApp Number */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] transition-all outline-none"
                    placeholder="Enter 10-digit WhatsApp number"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOTP}
                className="w-full py-3 bg-[#000080] text-white rounded-xl font-semibold hover:bg-[#000080]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingOTP ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] transition-all outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  OTP sent to +91 {phoneNumber}
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOTP}
                className="w-full py-3 bg-[#000080] text-white rounded-xl font-semibold hover:bg-[#000080]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend OTP in {formatTime(countdown)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleSendOTP({ preventDefault: () => {} });
                    }}
                    className="text-[#000080] font-semibold text-sm hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-gray-600 hover:text-[#000080] transition-colors"
              >
                ← Change Phone Number
              </button>
            </form>
          )}

          {/* Footer */}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <button
              onClick={() => navigate("/terms-conditions")}
              className="text-[#000080] hover:underline bg-transparent border-none cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => navigate("/privacy-policy")}
              className="text-[#000080] hover:underline bg-transparent border-none cursor-pointer"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;
