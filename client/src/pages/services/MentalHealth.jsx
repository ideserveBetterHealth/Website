import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PropTypes from "prop-types";
import { Clipboard } from "lucide-react";

import BookingSection from "@/components/booking/BookingSection";
import PaymentGateway from "@/components/booking/PaymentGateway";
import BhAssociateSelectionSection from "@/components/booking/BhAssociateSelectionSection";
import { useGetPricingQuery } from "@/features/api/pricingApi";
import { useGetPsychologistsQuery } from "@/features/api/psychologistApi";
import { useGetQuestionnaireQuery } from "@/features/api/questionnaireApi";
import {
  useValidateCouponMutation,
  useCalculateAllPlansDiscountsMutation,
} from "@/features/api/couponApi";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useLoadUserQuery,
} from "@/features/api/authApi";

const stepsData = [
  {
    title: "Pick a Pricing Plan",
    desc: "Select your preferred session duration and number of sessions.",
    heading: "Pick a Pricing Plan",
    subHeading: "Affordable and transparent pricing for your needs.",
    type: "pricing",
  },
  {
    title: "Choose Your Psychologist",
    desc: "Select from our experienced mental health professionals.",
    heading: "Choose Your Psychologist",
    subHeading:
      "Browse through our list of qualified psychologists and select based on your preferences.",
    type: "doctors",
  },
  {
    title: "Share Your Concerns",
    desc: "Connect with your psychologist and discuss what's on your mind.",
    heading: "Pre-session Questionnaire",
    subHeading: "Help us understand your concerns better before the session.",
    type: "concerns",
  },
  {
    title: "Proceed with Payment",
    desc: "Securely confirm your session by completing the payment.",
    heading: "Complete Your Payment",
    subHeading: "Secure payment to confirm your session.",
    type: "payment",
  },
  {
    title: "Start Your Journey",
    desc: "Begin your path towards better mental health and well-being.",
    heading: "Ready to Begin",
    subHeading: "Your session details and next steps.",
    type: "confirmation",
  },
];

// Separate pricing component to keep code organized
const PricingSection = ({
  duration,
  setDuration,
  selectedPlan,
  setSelectedPlan,
  appliedCoupon,
  setAppliedCoupon,
  onContinue,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isCouponVisible, setIsCouponVisible] = useState(false);
  const [plansWithDiscounts, setPlansWithDiscounts] = useState([]);

  // Get pricing data from API
  const {
    data: pricingData,
    isLoading: isPricingLoading,
    error: pricingError,
  } = useGetPricingQuery({
    serviceType: "mental_health",
  });

  // Debug pricing data
  useEffect(() => {
    if (pricingError) {
      console.error("Pricing API Error:", pricingError);
      toast.error("Failed to load pricing information. Please try again.");
    }
    if (pricingData) {
      console.log("Pricing Data:", pricingData);
    }
  }, [pricingData, pricingError]);

  const [validateCoupon] = useValidateCouponMutation();
  const [calculateAllPlansDiscounts] = useCalculateAllPlansDiscountsMutation();
  const { data: userData } = useLoadUserQuery();

  // Convert API pricing data to usable format and filter by duration
  const PLANS = useMemo(() => {
    const plans = [];
    if (pricingData?.pricing) {
      pricingData.pricing.forEach((item) => {
        if (item.plans && item.serviceType === "mental_health") {
          // Filter plans by selected duration
          const filteredPlans = item.plans.filter(
            (plan) => plan.duration === parseInt(duration)
          );
          plans.push(...filteredPlans);
        }
      });
    }
    return plans;
  }, [pricingData, duration]);

  // Validate that pricing data is available and complete
  const isPricingDataValid = PLANS.length > 0;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    try {
      // Calculate discounts for ALL plans
      const result = await calculateAllPlansDiscounts({
        code: couponCode,
        serviceType: "mental_health",
        plans: PLANS,
        ...(userData?.user?._id && { userId: userData.user._id }),
      }).unwrap();

      console.log("💰 Discounts calculated for all plans:", result);

      // Store the coupon info and all plans with discounts
      setAppliedCoupon({
        ...result.coupon,
        plansWithDiscounts: result.plansWithDiscounts,
      });
      setPlansWithDiscounts(result.plansWithDiscounts);
      setCouponError("");
      toast.success("Coupon applied successfully to all plans!");
    } catch (error) {
      setAppliedCoupon(null);
      setPlansWithDiscounts([]);
      setCouponError(error.data?.message || "Invalid coupon code");
      toast.error(error.data?.message || "Invalid coupon code");
    } finally {
      setIsApplying(false);
    }
  };

  // Revalidate coupon when duration changes (plans change)
  useEffect(() => {
    if (!appliedCoupon || !couponCode) return;

    // Re-calculate discounts for new set of plans
    const revalidate = async () => {
      try {
        const result = await calculateAllPlansDiscounts({
          code: couponCode,
          serviceType: "mental_health",
          plans: PLANS,
          ...(userData?.user?._id && { userId: userData.user._id }),
        }).unwrap();

        setAppliedCoupon({
          ...result.coupon,
          plansWithDiscounts: result.plansWithDiscounts,
        });
        setPlansWithDiscounts(result.plansWithDiscounts);
        setCouponError("");
      } catch (err) {
        setAppliedCoupon(null);
        setPlansWithDiscounts([]);
        setCouponError(
          err?.data?.message || "Coupon invalid for current plans"
        );
        toast.error(err?.data?.message || "Coupon invalid for current plans");
      }
    };

    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PLANS, duration]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setPlansWithDiscounts([]);
    setCouponCode("");
    setCouponError("");
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (!appliedCoupon) return originalPrice;
    console.log(originalPrice.discountAmount);
    return Math.max(0, originalPrice - appliedCoupon.discountAmount);
  };

  if (isPricingLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#000080]"></div>
      </div>
    );
  }

  if (pricingError) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Pricing Error
          </h3>
          <p className="text-red-600 mb-4">
            Unable to load pricing information from the server.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isPricingDataValid) {
    return (
      <div className="text-center py-20">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4">
            <svg
              className="w-6 h-6 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Pricing Unavailable
          </h3>
          <p className="text-amber-700 mb-4">
            Pricing information is currently unavailable. Please try again later
            or contact support.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Refresh
            </button>
            <a
              href="mailto:hello@ideservebetterhealth.in"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-4">
        <p className="text-gray-600 font-semibold">
          Select the session time here
        </p>
      </div>
      <div className="flex justify-center mb-10">
        <div className="bg-white rounded-lg p-1 shadow-md inline-flex">
          <button
            onClick={() => setDuration("50")}
            className={`px-8 py-2 rounded-md font-semibold transition-colors ${
              duration === "50"
                ? "bg-[#000080] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            50 mins
          </button>
          <button
            onClick={() => setDuration("80")}
            className={`px-8 py-2 rounded-md font-semibold transition-colors ${
              duration === "80"
                ? "bg-[#000080] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            80 mins
          </button>
        </div>
      </div>

      {/* Coupon Section */}
      <div
        className={`mx-auto mt-4 mb-4 transition-all duration-300 ${
          appliedCoupon || isCouponVisible ? "max-w-md" : "max-w-[200px]"
        }`}
      >
        {appliedCoupon ? (
          <div className="bg-[#fffae3] border border-green-300 text-green-900 rounded-lg shadow-sm p-4 w-full">
            <div className="flex items-start justify-between gap-4">
              {/* Left side: Icon + Text */}
              <div className="flex items-start gap-3">
                {/* Success Icon */}
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>

                {/* Text Block */}
                <div>
                  <p className="text-sm font-semibold">
                    Coupon Applied: {appliedCoupon.code}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Extra savings up to{" "}
                    <span className="font-bold">
                      ₹
                      {Math.max(
                        ...(appliedCoupon.plansWithDiscounts?.map(
                          (p) => p.discountAmount
                        ) || [0])
                      ).toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right side: Remove Button */}
              <button
                onClick={removeCoupon}
                className="text-gray-500 hover:text-red-600 hover:bg-[#fef9c3] rounded-full p-1 -m-1 transition-colors"
                aria-label="Remove coupon"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setIsCouponVisible(!isCouponVisible)}
              className={`w-full text-left flex items-center justify-center hover:bg-gray-50 transition-all duration-300 ${
                isCouponVisible ? "p-4 justify-between" : "p-2 justify-center"
              }`}
            >
              <div
                className={`flex items-center transition-all duration-300 ${
                  isCouponVisible ? "gap-2" : "gap-1"
                }`}
              >
                <svg
                  className={`text-[#ec5228] transition-all duration-300 ${
                    isCouponVisible ? "w-5 h-5" : "w-4 h-4"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span
                  className={`font-semibold text-[#000080] transition-all duration-300 ${
                    isCouponVisible ? "text-base" : "text-xs"
                  }`}
                >
                  Have a Coupon Code?
                </span>
              </div>
              {isCouponVisible && (
                <svg
                  className="w-5 h-5 text-[#000080] transform transition-all duration-300 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isCouponVisible
                  ? "max-h-[200px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-6 border-t">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#000080] focus:border-transparent transition-all outline-none"
                    />
                    {couponError && (
                      <p className="text-red-500 text-sm mt-1">{couponError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplying}
                    className="px-6 py-2 bg-[#000080] text-white rounded-lg hover:bg-[#000080]/90 transition-colors disabled:opacity-50"
                  >
                    {isApplying ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600 font-semibold">Select a pricing plan</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {(() => {
          // Calculate discount percentages for all plans to find the best value
          const plansWithDiscounts = PLANS.map((plan, index) => {
            const planDiscount = appliedCoupon?.plansWithDiscounts?.find(
              (p) =>
                p.sessions === plan.sessions && p.duration === plan.duration
            );

            let discountPercentage = 0;
            if (
              planDiscount &&
              planDiscount.discountApplied &&
              planDiscount.discountAmount > 0
            ) {
              discountPercentage = Math.round(
                ((plan.mrp - planDiscount.finalPrice) / plan.mrp) * 100
              );
            } else if (plan.mrp !== plan.sellingPrice) {
              discountPercentage = Math.round(
                ((plan.mrp - plan.sellingPrice) / plan.mrp) * 100
              );
            }

            return { plan, index, discountPercentage };
          });

          // Find the plan with the highest discount percentage
          const bestValueIndex = plansWithDiscounts.reduce(
            (bestIndex, current, currentIndex) => {
              return current.discountPercentage >
                plansWithDiscounts[bestIndex].discountPercentage
                ? currentIndex
                : bestIndex;
            },
            0
          );

          return plansWithDiscounts.map(
            ({ plan, index, discountPercentage }) => {
              // Find discount for this specific plan
              const planDiscount = appliedCoupon?.plansWithDiscounts?.find(
                (p) =>
                  p.sessions === plan.sessions && p.duration === plan.duration
              );

              return (
                <div
                  key={index}
                  onClick={() => setSelectedPlan(index)}
                  className={`bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center justify-center cursor-pointer border-4 relative ${
                    selectedPlan === index
                      ? "border-[#ec5228] bg-[#fff9f9]"
                      : "border-transparent hover:border-gray-200"
                  } min-h-[18rem]`}
                >
                  {/* Best Value Badge */}
                  {index === bestValueIndex && discountPercentage > 0 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#ec5228] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Best Value
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-[#000080] mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    {planDiscount &&
                    planDiscount.discountApplied &&
                    planDiscount.discountAmount > 0 ? (
                      // Show discounted pricing
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-lg text-gray-500 line-through">
                            ₹{plan.mrp.toLocaleString("en-IN")}
                          </p>
                          <div className="w-px h-6 bg-gray-300"></div>
                          <p className="text-3xl font-bold text-[#ec5228]">
                            ₹{planDiscount.finalPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-semibold text-[#000080] bg-[#ededff] px-2 py-1 rounded-full">
                            💰 Coupon Discount: ₹{planDiscount.discountAmount}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            💸 You save ₹{plan.mrp - planDiscount.finalPrice} (
                            {Math.round(
                              ((plan.mrp - planDiscount.finalPrice) /
                                plan.mrp) *
                                100
                            )}
                            % off)
                          </span>
                        </div>
                      </div>
                    ) : plan.mrp !== plan.sellingPrice ? (
                      // Show MRP and SP when different, with savings
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-lg text-gray-500 line-through">
                            ₹{plan.mrp.toLocaleString("en-IN")}
                          </p>
                          <div className="w-px h-6 bg-gray-300"></div>
                          <p className="text-3xl font-bold text-[#000080]">
                            ₹{plan.sellingPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            💸 You save ₹{plan.mrp - plan.sellingPrice}(
                            {Math.round(
                              ((plan.mrp - plan.sellingPrice) / plan.mrp) * 100
                            )}
                            % off)
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Show only SP when MRP equals SP
                      <p className="text-3xl font-bold text-[#000080]">
                        ₹{plan.sellingPrice.toLocaleString("en-IN")}
                      </p>
                    )}
                    {planDiscount && !planDiscount.meetsMinOrder && (
                      <div className="mt-3">
                        <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          Coupon Not Applicable<br></br>Min order: ₹
                          {planDiscount.minOrderAmount}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className="w-5 h-5 bg-[#ec5228] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span>
                        {plan.sessions} session{plan.sessions > 1 ? "s" : ""} of{" "}
                        {plan.duration} minutes each
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className="w-5 h-5 bg-[#ec5228] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span>Flexible scheduling</span>
                    </div>
                  </div>
                </div>
              );
            }
          );
        })()}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={onContinue}
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all ${
            selectedPlan !== null
              ? "bg-[#ec5228] text-white hover:bg-[#d94720]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedPlan === null}
        >
          Continue to Next Step
        </button>
      </div>
    </>
  );
};

PricingSection.propTypes = {
  duration: PropTypes.string.isRequired,
  setDuration: PropTypes.func.isRequired,
  selectedPlan: PropTypes.number,
  setSelectedPlan: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

// Contact Form Component
const ContactForm = ({
  onContinue,
  appliedCoupon,
  setAppliedCoupon,
  duration,
  selectedPlan,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    whatsapp: "",
  });
  const [questionnaireResponses, setQuestionnaireResponses] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // API hooks
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const { data: userData } = useLoadUserQuery();
  const [validateCoupon] = useValidateCouponMutation();

  // Get questionnaire data from API
  const { data: questionnaireData, isLoading: isQuestionnaireLoading } =
    useGetQuestionnaireQuery("mental_health");

  // Get pricing data from API (same as PricingSection)
  const { data: pricingData } = useGetPricingQuery({
    serviceType: "mental_health",
  });

  // Convert API pricing data to usable format (same logic as PricingSection)
  const PLANS = useMemo(() => {
    const plans = [];
    if (pricingData?.pricing) {
      pricingData.pricing.forEach((item) => {
        if (item.plans && item.serviceType === "mental_health") {
          // Filter plans by selected duration
          const filteredPlans = item.plans.filter(
            (plan) => plan.duration === parseInt(duration)
          );
          plans.push(...filteredPlans);
        }
      });
    }
    return plans;
  }, [pricingData, duration]);

  // Calculate current order amount based on selected plan
  const getCurrentOrderAmount = useCallback(() => {
    if (selectedPlan === null || selectedPlan === undefined) {
      return null; // Return null if selection is not yet made
    }

    // Check if pricing data is available
    if (!PLANS[selectedPlan]) {
      console.error("Plan not available for index:", selectedPlan);
      return null;
    }

    const selectedPlanData = PLANS[selectedPlan];

    // If coupon is applied, find the discounted price for this specific plan
    if (appliedCoupon?.plansWithDiscounts) {
      const planDiscount = appliedCoupon.plansWithDiscounts.find(
        (p) =>
          p.sessions === selectedPlanData.sessions &&
          p.duration === selectedPlanData.duration
      );

      if (planDiscount && planDiscount.discountApplied) {
        return planDiscount.finalPrice;
      }
    }

    return selectedPlanData.sellingPrice;
  }, [selectedPlan, PLANS, appliedCoupon]);

  // Countdown effect for resend button
  useEffect(() => {
    let interval;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Auto-populate form with user data if logged in
  useEffect(() => {
    if (userData?.user && !isAutoFilled) {
      const user = userData.user;
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        whatsapp: user.phoneNumber || "",
      }));

      // If user has a verified phone number, mark it as verified
      if (user.phoneNumber && user.otpVerified) {
        setIsVerified(true);
        toast.success("Welcome back! Your details have been auto-filled.");
      }

      setIsAutoFilled(true);

      // Re-validate applied coupon with user ID for logged-in user
      if (appliedCoupon) {
        const currentAmount = getCurrentOrderAmount();

        // Skip validation if pricing data is not available
        if (currentAmount === null) {
          console.warn(
            "⚠️ Skipping coupon re-validation - pricing data not available"
          );
          return;
        }

        validateCoupon({
          code: appliedCoupon.code,
          serviceType: "mental_health",
          orderAmount: currentAmount, // Use actual order amount
          userId: user._id,
        })
          .unwrap()
          .then(() => {
            console.log(
              "✅ Coupon re-validation passed for logged-in user with amount:",
              currentAmount
            );
          })
          .catch((error) => {
            console.log(
              "❌ Coupon re-validation failed for logged-in user:",
              error
            );
            setAppliedCoupon(null);
            toast.error(
              "The coupon you applied was only for new users and has been removed"
            );
          });
      }
    }
  }, [
    userData,
    isAutoFilled,
    appliedCoupon,
    validateCoupon,
    setAppliedCoupon,
    getCurrentOrderAmount,
  ]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent changing WhatsApp number if it's already verified from user account
    if (name === "whatsapp" && isVerified && userData?.user?.phoneNumber) {
      toast.info(
        "Phone number is verified from your account and cannot be changed"
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset verification status if whatsapp number changes
    if (name === "whatsapp" && isVerified && !userData?.user?.phoneNumber) {
      setIsVerified(false);
      setOtpSent(false);
      setOtp("");
    }
  };

  const handleSendOTP = async () => {
    if (!formData.whatsapp || formData.whatsapp.length !== 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    setOtpLoading(true);
    try {
      const result = await sendOTP({ phoneNumber: formData.whatsapp }).unwrap();
      setOtpSent(true);
      setResendCountdown(60); // 60 second countdown
      toast.success(result.message || "OTP sent successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await verifyOTP({
        phoneNumber: formData.whatsapp,
        otp,
      }).unwrap();

      setIsVerified(true);
      toast.success("Phone number verified successfully!");

      // Re-validate applied coupon with user ID (same as pricing section logic)
      if (appliedCoupon) {
        try {
          const currentAmount = getCurrentOrderAmount();

          // Skip validation if pricing data is not available
          if (currentAmount === null) {
            console.warn(
              "⚠️ Skipping coupon re-validation after OTP - pricing data not available"
            );
            return;
          }

          console.log(
            "🔍 Re-validating coupon after OTP verification with amount:",
            currentAmount
          );
          await validateCoupon({
            code: appliedCoupon.code,
            serviceType: "mental_health",
            orderAmount: currentAmount, // Use actual order amount
            userId: response.user?._id,
          }).unwrap();
          console.log("✅ Coupon re-validation passed");
        } catch (error) {
          console.log("❌ Coupon re-validation failed:", error);
          setAppliedCoupon(null);
          toast.error(
            "The coupon you applied was only for new users and has been removed"
          );
        }
      }
    } catch (error) {
      toast.error(error.data?.message || "Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleQuestionnaireChange = (questionId, value) => {
    setQuestionnaireResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isFormValid = () => {
    const basicFieldsValid =
      formData.fullName && formData.whatsapp && isVerified; // Phone number must be verified

    // Check if required questionnaire questions are answered
    if (questionnaireData?.questionnaire?.questions) {
      const requiredQuestions =
        questionnaireData.questionnaire.questions.filter((q) => q.required);
      const requiredAnswered = requiredQuestions.every(
        (q) => questionnaireResponses[q.id]
      );
      return basicFieldsValid && requiredAnswered;
    }

    return basicFieldsValid;
  };

  const handleSubmit = () => {
    // Store form data and questionnaire responses for the next step
    localStorage.setItem(
      "mentalHealthFormData",
      JSON.stringify({
        ...formData,
        questionnaireResponses,
      })
    );
    onContinue();
  };

  // Check if pricing data is available
  const isPricingDataValid = PLANS.length > 0;

  if (!isPricingDataValid && pricingData) {
    return (
      <div className="text-center py-20">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4">
            <svg
              className="w-6 h-6 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Pricing Unavailable
          </h3>
          <p className="text-amber-700 mb-4">
            Pricing information is currently unavailable. Please go back to the
            pricing step or contact support.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Go Back
            </button>
            <a
              href="mailto:hello@ideservebetterhealth.in"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isQuestionnaireLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#000080]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Modern Form Container */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        {/* Auto-fill Notification */}
        {userData?.user && isAutoFilled && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-green-800 font-semibold">
                  Welcome back, {userData.user.name || "User"}!
                </h4>
                <p className="text-green-600 text-sm">
                  Your details have been auto-filled from your account.
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-8">
          {/* Personal Details Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#000080] rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#000080]">
                Personal Details
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] transition-all outline-none text-gray-800 placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-semibold text-gray-700"
                >
                  WhatsApp Number *
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        disabled={isVerified}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-gray-800 placeholder-gray-400 ${
                          isVerified
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080]"
                        }`}
                        placeholder="Enter your WhatsApp number"
                        maxLength="10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        {isVerified ? (
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {!isVerified && (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={
                          !formData.whatsapp ||
                          formData.whatsapp.length !== 10 ||
                          otpLoading ||
                          resendCountdown > 0
                        }
                        className="px-6 py-4 bg-[#000080] text-white rounded-xl font-semibold hover:bg-[#000080]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {otpLoading
                          ? "Sending..."
                          : resendCountdown > 0
                          ? `Resend in ${resendCountdown}s`
                          : otpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                      </button>
                    )}
                  </div>

                  {/* OTP Input Field */}
                  {otpSent && !isVerified && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#ec5228]/10 focus:border-[#ec5228] transition-all outline-none text-gray-800 placeholder-gray-400"
                          placeholder="Enter 6-digit OTP"
                          maxLength="6"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={!otp || otp.length !== 6 || verifyLoading}
                        className="px-6 py-3 bg-[#ec5228] text-white rounded-xl font-semibold hover:bg-[#d94720] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifyLoading ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                  )}

                  {/* Verification Status */}
                  {isVerified && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {userData?.user?.phoneNumber &&
                      userData.user.phoneNumber === formData.whatsapp
                        ? "Phone number verified from your account"
                        : "Phone number verified successfully"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Questionnaire Section */}
          {questionnaireData?.questionnaire?.questions && (
            <div className="space-y-6 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#ec5228] rounded-lg flex items-center justify-center">
                  <Clipboard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Pre-session Questionnaire
                </h3>
              </div>

              <div className="space-y-6">
                {[...questionnaireData.questionnaire.questions]
                  .sort((a, b) => a.order - b.order)
                  .map((question) => (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {question.type === "text" && (
                        <input
                          type="text"
                          value={questionnaireResponses[question.id] || ""}
                          onChange={(e) =>
                            handleQuestionnaireChange(
                              question.id,
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#ec5228]/10 focus:border-[#ec5228] transition-all outline-none text-gray-800 placeholder-gray-400"
                          placeholder="Your answer..."
                        />
                      )}

                      {question.type === "textarea" && (
                        <textarea
                          value={questionnaireResponses[question.id] || ""}
                          onChange={(e) =>
                            handleQuestionnaireChange(
                              question.id,
                              e.target.value
                            )
                          }
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#ec5228]/10 focus:border-[#ec5228] transition-all outline-none resize-none text-gray-800 placeholder-gray-400"
                          placeholder="Your answer..."
                        />
                      )}

                      {question.type === "multiple-choice" && (
                        <div className="space-y-2">
                          {question.options?.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={
                                  questionnaireResponses[question.id] === option
                                }
                                onChange={(e) =>
                                  handleQuestionnaireChange(
                                    question.id,
                                    e.target.value
                                  )
                                }
                                className="h-4 w-4 text-[#ec5228] border-gray-300 focus:ring-[#ec5228]"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === "multiple-choice-multi" && (
                        <div className="space-y-2">
                          {question.options?.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                value={option}
                                checked={(
                                  questionnaireResponses[question.id] || []
                                ).includes(option)}
                                onChange={(e) => {
                                  const currentValues =
                                    questionnaireResponses[question.id] || [];
                                  let newValues;
                                  if (e.target.checked) {
                                    newValues = [...currentValues, option];
                                  } else {
                                    newValues = currentValues.filter(
                                      (v) => v !== option
                                    );
                                  }
                                  handleQuestionnaireChange(
                                    question.id,
                                    newValues
                                  );
                                }}
                                className="h-4 w-4 text-[#ec5228] border-gray-300 rounded focus:ring-[#ec5228]"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === "checkbox" && (
                        <div className="space-y-2">
                          {question.options?.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                value={option}
                                checked={(
                                  questionnaireResponses[question.id] || []
                                ).includes(option)}
                                onChange={(e) => {
                                  const currentValues =
                                    questionnaireResponses[question.id] || [];
                                  let newValues;
                                  if (e.target.checked) {
                                    newValues = [...currentValues, option];
                                  } else {
                                    newValues = currentValues.filter(
                                      (v) => v !== option
                                    );
                                  }
                                  handleQuestionnaireChange(
                                    question.id,
                                    newValues
                                  );
                                }}
                                className="h-4 w-4 text-[#ec5228] border-gray-300 rounded focus:ring-[#ec5228]"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === "scale" && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              1 (Low)
                            </span>
                            <span className="text-sm text-gray-500">
                              10 (High)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={questionnaireResponses[question.id] || 5}
                            onChange={(e) =>
                              handleQuestionnaireChange(
                                question.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="text-center">
                            <span className="text-lg font-semibold text-[#ec5228]">
                              {questionnaireResponses[question.id] || 5}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col items-center pt-8 space-y-4">
            {!isVerified && formData.whatsapp && (
              <div className="text-center">
                <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                  ⚠️ Please verify your WhatsApp number to continue
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`group relative px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                isFormValid()
                  ? "bg-gradient-to-r from-[#000080] to-[#ec5228] text-white hover:shadow-2xl hover:scale-105 hover:from-[#ec5228] hover:to-[#000080]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                Continue to Payment
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              {isFormValid() && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ec5228] to-[#000080] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Privacy Notice */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
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
          Your information is secure and confidential
        </p>
      </div>
    </div>
  );
};

ContactForm.propTypes = {
  onContinue: PropTypes.func.isRequired,
  appliedCoupon: PropTypes.object,
  setAppliedCoupon: PropTypes.func.isRequired,
  duration: PropTypes.string.isRequired,
  selectedPlan: PropTypes.number,
};

// Psychologist selection component
const StepCards = ({ onContinue, duration, selectedPlan, PLANS }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  // Get psychologists data from API
  const { data: psychologistsData, isLoading: isPsychologistsLoading } =
    useGetPsychologistsQuery();

  const psychologistsList = psychologistsData?.psychologists || [];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showBooking]);

  const handleBookSession = (psych) => {
    if (selectedDoc?._id === psych._id) {
      setShowBooking(false);
      setSelectedDoc(null);
    } else {
      setSelectedDoc(psych);
      setShowBooking(true);
    }
  };

  const handleClose = () => {
    setShowBooking(false);
    setSelectedDoc(null);
  };

  const handleSelectDateTime = (date, time) => {
    // Store the selected psychologist and appointment details in local storage
    const appointmentDetails = {
      psychologist: selectedDoc,
      date: date,
      time: time,
    };
    localStorage.setItem(
      "appointmentDetails",
      JSON.stringify(appointmentDetails)
    );
    // Move to the next step
    onContinue();
  };

  return (
    <>
      <BhAssociateSelectionSection
        doctors={psychologistsList}
        isLoading={isPsychologistsLoading}
        onBookSession={handleBookSession}
        showBooking={showBooking}
        selectedDoc={selectedDoc}
        serviceType="psychologist"
      />

      {/* Show booking section as overlay */}
      {showBooking && selectedDoc && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in pt-20 sm:pt-4 mt-16"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-6xl max-h-[calc(100vh-5rem)] sm:max-h-[90vh] overflow-y-auto bg-[#fffae3] rounded-2xl shadow-2xl animate-scale-in mt-2 sm:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - More accessible on mobile */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close booking"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Psychologist Info Header - Mobile optimized */}
            <div className="px-4 sm:px-6 pt-12 sm:pt-6 pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                {selectedDoc.photoUrl ? (
                  <img
                    src={selectedDoc.photoUrl}
                    alt={selectedDoc.name}
                    className="w-16 h-16 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {selectedDoc.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "P"}
                    </span>
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000080] leading-tight">
                    {selectedDoc.name}'s Schedule
                  </h3>
                  <p className="text-gray-600 font-medium text-sm sm:text-base mt-1">
                    {selectedDoc.designation}
                  </p>

                  {/* Service Details - Mobile optimized */}
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-3 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#000080] text-white rounded-full font-medium">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Mental Health
                    </span>
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#ec5228] text-white rounded-full font-medium">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {duration} min
                    </span>
                    {selectedPlan !== null && PLANS[selectedPlan] && (
                      <>
                        <span className="text-gray-400 hidden sm:inline">
                          •
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {PLANS[selectedPlan].name.charAt(0).toUpperCase() +
                            PLANS[selectedPlan].name.slice(1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Section - Mobile optimized */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <BookingSection
                psychologistId={selectedDoc._id}
                onSelectDateTime={handleSelectDateTime}
                onClose={handleClose}
                selectedDuration={duration}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

StepCards.propTypes = {
  onContinue: PropTypes.func.isRequired,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  selectedPlan: PropTypes.number,
  PLANS: PropTypes.array.isRequired,
};

export default function MentalHealth() {
  const [currentStep, setCurrentStep] = useState(0);
  const [duration, setDuration] = useState("50");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // New state for applied coupon

  // Get pricing data from API
  const {
    data: pricingData,
    isLoading: isPricingLoading,
    error: pricingError,
  } = useGetPricingQuery({
    serviceType: "mental_health",
  });

  // Convert API pricing data to usable format
  const PLANS = [];
  if (pricingData?.pricing) {
    pricingData.pricing.forEach((item) => {
      if (item.plans && item.serviceType === "mental_health") {
        PLANS.push(...item.plans);
      }
    });
  }

  // Scroll state for floating step indicator
  const [showFloatingSteps, setShowFloatingSteps] = useState(false);

  // Scroll effect for floating step indicator
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show floating steps when scrolled down past threshold (300px)
      if (currentScrollY > 300) {
        setShowFloatingSteps(true);
      }
      // Hide floating steps only when scrolling back to hero section (top area)
      else if (currentScrollY <= 600) {
        setShowFloatingSteps(false);
      }
      // Keep showing while user is still below hero section, regardless of scroll direction
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    // Find the heading element and scroll to it
    const sectionHeading = document.querySelector(".section-heading");
    if (sectionHeading) {
      // Calculate offset to position heading below floating steps
      // 64px (mobile navbar) or 90px (desktop navbar) + spacing = offset
      const offset = window.innerWidth >= 768 ? 200 : 160;
      const elementPosition =
        sectionHeading.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing-section");
    if (pricingSection) {
      // Increased mobile offset to account for floating step indicator
      const offset = window.innerWidth >= 768 ? 200 : 220;
      const elementPosition =
        pricingSection.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    scrollToTop();
  };

  const handleGoBack = () => {
    setCurrentStep(currentStep - 1);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Step Indicator */}
      <div
        className={`fixed top-17 md:top-[80px] left-0 right-0 z-50 transition-all duration-500 ease-in-out transform ${
          showFloatingSteps
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <section
          className="py-2 bg-white shadow-lg border-b border-gray-200"
          style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)" }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
              {/* Progress Bar Foreground */}
              <div
                className="absolute top-4 left-0 h-1 bg-[#000080] -translate-y-1/2 transition-all duration-500"
                style={{
                  width: `${(currentStep / (stepsData.length - 1)) * 100}%`,
                }}
              ></div>

              <div className="relative flex justify-between">
                {stepsData.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center z-10 bg-white px-1"
                    >
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 font-bold text-sm md:text-lg mb-1 md:mb-2 transition-all duration-500
                          ${
                            isActive || isCompleted
                              ? "bg-[#000080] border-[#000080] text-white"
                              : "bg-white border-[#000080] text-[#000080]"
                          }
                        `}
                      >
                        {idx + 1}
                      </div>
                      <p
                        className={`font-semibold text-xs transition-colors duration-300 max-w-[80px] md:max-w-[100px] leading-tight
                          ${
                            isActive || isCompleted
                              ? "text-[#000080]"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {step.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-[#fffae3] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#000080] leading-tight mb-6">
                Mental Health <br />
                <span className="text-[#ec5228]">Counselling</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                Get professional help from licensed therapists. Start your
                journey towards better mental health with our expert counselors.
              </p>
              <div className="flex flex-col items-center md:items-start gap-4">
                <button
                  onClick={scrollToPricing}
                  className="px-12 py-4 bg-[#ec5228] text-white font-semibold text-lg rounded-2xl hover:bg-[#d94720] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Book Session
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <img
                src="/mental-health-consultation.png"
                alt="Mental Health Consultation"
                className="w-full max-w-xl mx-auto rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 border-8 border-[#000080]/10 rounded-2xl translate-x-4 translate-y-4 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#ec5228]/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#000080]/5 rounded-full blur-3xl -z-10 transform -translate-x-1/4 translate-y-1/4"></div>
      </section>

      {/* Dynamic Content Section Based on Current Step */}
      <section className="py-16 md:py-24 bg-[#fffcf2]">
        <div className="container mx-auto px-6">
          {currentStep > 0 && currentStep < 4 && (
            <div className="mb-8">
              <button
                onClick={handleGoBack}
                className="flex items-center text-[#000080] hover:text-[#ec5228] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Go Back
              </button>
            </div>
          )}
          <div
            className="text-center mb-11 section-heading"
            id="pricing-section"
          >
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#000080]">
              {stepsData[currentStep].heading}
            </h2>
          </div>
          {/* Render different content based on step type */}
          {stepsData[currentStep].type === "pricing" && (
            <PricingSection
              duration={duration}
              setDuration={setDuration}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              onContinue={() => handleStepChange(currentStep + 1)}
            />
          )}
          {stepsData[currentStep].type === "concerns" && (
            <ContactForm
              onContinue={() => handleStepChange(currentStep + 1)}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              duration={duration}
              selectedPlan={selectedPlan}
            />
          )}
          {/* Render psychologist cards for step 2 */}
          {stepsData[currentStep].type === "doctors" && (
            <StepCards
              onContinue={() => handleStepChange(currentStep + 1)}
              duration={duration}
              selectedPlan={selectedPlan}
              PLANS={PLANS}
            />
          )}
          {/* Payment step */}
          {stepsData[currentStep].type === "payment" && (
            <PaymentGateway
              duration={parseInt(duration)}
              sessions={PLANS[selectedPlan]?.sessions || 1}
              serviceType="mental_health"
              couponCode={appliedCoupon?.code} // Pass the coupon code
              onPaymentSuccess={(paymentResult) => {
                // Store booking details for confirmation screen
                const appointmentDetails = JSON.parse(
                  localStorage.getItem("appointmentDetails") || "{}"
                );
                const formData = JSON.parse(
                  localStorage.getItem("mentalHealthFormData") || "{}"
                );

                setBookingDetails({
                  payment: paymentResult,
                  appointment: appointmentDetails,
                  personal: formData,
                  session: {
                    duration: parseInt(duration),
                    type: PLANS[selectedPlan]?.name || "single",
                    serviceType: "mental_health",
                  },
                });

                handleStepChange(currentStep + 1);
              }}
            />
          )}
          {/* Confirmation step */}
          {stepsData[currentStep].type === "confirmation" && (
            <div className="max-w-4xl mx-auto px-4">
              {/* Success Header */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-green-500"
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
                <h3 className="text-3xl font-bold text-[#000080] mb-4">
                  🎉 Booking Confirmed!
                </h3>
                <p className="text-gray-600 mb-4 text-lg">
                  Your mental health session has been successfully booked. Get
                  ready to begin your journey towards better well-being!
                </p>
                {bookingDetails?.payment?.orderId && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                    <p className="text-green-800 font-semibold">
                      Booking ID: {bookingDetails.payment.orderId}
                    </p>
                  </div>
                )}
              </div>

              {/* Session Details */}
              {bookingDetails && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3 text-[#000080]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Session Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service & Duration */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">
                        Service Type
                      </h3>
                      <p className="text-lg font-semibold text-blue-900">
                        Mental Health Consultation
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-800 mb-2">
                        Session Duration
                      </h3>
                      <p className="text-lg font-semibold text-purple-900">
                        {bookingDetails.session.duration} minutes
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-2">
                        Session Type
                      </h3>
                      <p className="text-lg font-semibold text-green-900 capitalize">
                        {bookingDetails.session.type}
                        {bookingDetails.session.type === "pack" &&
                          " (3 Sessions)"}
                      </p>
                    </div>

                    {/* Psychologist Details */}
                    {bookingDetails.appointment.psychologist && (
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-indigo-800 mb-2">
                          Your Psychologist
                        </h3>
                        <p className="text-lg font-semibold text-indigo-900">
                          {bookingDetails.appointment.psychologist.name}
                        </p>
                        <p className="text-sm text-indigo-700">
                          {
                            bookingDetails.appointment.psychologist
                              .specialization
                          }
                        </p>
                      </div>
                    )}

                    {/* Appointment Date & Time */}
                    {bookingDetails.appointment.date && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-orange-800 mb-2">
                          Appointment Date
                        </h3>
                        <p className="text-lg font-semibold text-orange-900">
                          {new Date(
                            bookingDetails.appointment.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}

                    {bookingDetails.appointment.time && (
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-pink-800 mb-2">
                          Appointment Time
                        </h3>
                        <p className="text-lg font-semibold text-pink-900">
                          {bookingDetails.appointment.time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* What's Next Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-[#000080]"
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
                  What Happens Next?
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#000080] text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Confirmation Details
                      </h3>
                      <p className="text-gray-700">
                        You&apos;ll receive a confirmation message on Registered
                        WhatsApp Number with your session details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#000080] text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Checkout your dashboard
                      </h3>
                      <p className="text-gray-700">
                        Log in to your dashboard on our website.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#000080] text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Join Your Session
                      </h3>
                      <p className="text-gray-700">
                        Join your upcoming session at the scheduled time from
                        your dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#000080] text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Begin Your Journey
                      </h3>
                      <p className="text-gray-700">
                        You’re all set to begin your journey.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-red-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#000080] text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm flex-shrink-0">
                      #
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        IMPORTANT NOTE
                      </h3>
                      <p className="text-gray-700">
                        If you purchased a multi-session plan, one session
                        credit is used for your current booking. The remaining
                        session credits will appear in your dashboard. You can
                        use these credits to schedule future sessions at your
                        convenience by choosing your preferred time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/dashboard"
                  className="flex-1 bg-[#000080] hover:bg-[#000080]/80 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 text-center flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>

              {/* Support Info */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-3">
                  If you have any questions or need to reschedule, our support
                  team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:hello@ideservebetterhealth.in"
                    className="text-[#000080] hover:text-[#000080]/80 font-semibold"
                  >
                    📧 hello@ideservebetterhealth.in
                  </a>
                  <a
                    href="tel:+919799161609"
                    className="text-[#000080] hover:text-[#000080]/80 font-semibold"
                  >
                    📞 +91 97991 61609
                  </a>
                </div>
              </div>
            </div>
          )}{" "}
        </div>
      </section>
    </div>
  );
}
