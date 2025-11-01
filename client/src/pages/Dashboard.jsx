import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Lock,
  User,
  Video,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Heart,
  Sparkles,
  CreditCard,
  Plus,
  TrendingUp,
  Award,
  Tag,
  Clipboard,
  FileText,
} from "lucide-react";
import {
  useGetMeetingsQuery,
  useDeleteMeetingMutation,
  useJoinMeetingMutation,
  useCreateMeetingMutation,
} from "@/features/api/meetingsApi";
import { formatDateForAPI } from "@/utils/dateUtils";
import {
  useGetUserCreditsQuery,
  useUpdateUserMutation,
} from "@/features/api/userApi";
import {
  useCreateCreditsOrderMutation,
  useVerifyPaymentMutation,
} from "@/features/api/paymentApi";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useLoadUserQuery,
} from "@/features/api/authApi";
import { load } from "@cashfreepayments/cashfree-js";
import {
  useGetPsychologistsQuery,
  psychologistApi,
} from "@/features/api/psychologistApi";
import { useLazyGetPricingQuery } from "@/features/api/pricingApi";
import { useCalculateAllPlansDiscountsMutation } from "@/features/api/couponApi";
import { useGetQuestionnaireQuery } from "@/features/api/questionnaireApi";
import { useSelector, useDispatch } from "react-redux";
import BhAssociateSelectionSection from "@/components/booking/BhAssociateSelectionSection";
import { userLoggedIn } from "@/features/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BookingSection from "@/components/booking/BookingSection";
import { set } from "date-fns";
import { useGetCosmetologistsQuery } from "@/features/api/bhAssociateApi";

// Contact Form Component for Dashboard Booking
const ContactForm = ({
  onContinue,
  onBack,
  selectedServiceType,
  selectedDuration,
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

  // API hooks
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const { data: userData } = useLoadUserQuery();

  // Get questionnaire data from API
  const { data: questionnaireData, isLoading: isQuestionnaireLoading } =
    useGetQuestionnaireQuery(selectedServiceType);

  // Format service type for display
  const formatServiceType = (serviceType) => {
    switch (serviceType) {
      case "mental_health":
        return "Mental Health";
      case "cosmetology":
        return "Cosmetology";
      default:
        return serviceType;
    }
  };

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
      }

      setIsAutoFilled(true);
    }
  }, [userData, isAutoFilled]);

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
      toast.success(result.message || "OTP sent successfully!");

      // Show OTP in development mode
      if (result.otp) {
        toast.info(`Development OTP: ${result.otp}`);
      }
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
      await verifyOTP({
        phoneNumber: formData.whatsapp,
        otp,
      }).unwrap();

      setIsVerified(true);
      toast.success("Phone number verified successfully!");
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
    if (!isFormValid()) {
      toast.error(
        "Please fill all required fields and verify your phone number"
      );
      return;
    }

    // Pass form data with questionnaire responses to parent component
    onContinue({
      ...formData,
      questionnaireResponses,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#000080] mb-2">
          Contact Information
        </h3>
        <p className="text-gray-600 text-sm">
          {formatServiceType(selectedServiceType)} • {selectedDuration} minutes
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200"
            required
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            WhatsApp Number *
          </label>
          <div className="flex gap-3">
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Enter 10-digit WhatsApp number"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200"
              maxLength="10"
              disabled={isVerified && userData?.user?.phoneNumber}
              required
            />
            {!isVerified && (
              <Button
                onClick={handleSendOTP}
                disabled={otpLoading || formData.whatsapp.length !== 10}
                className="bg-[#ec5228] hover:bg-[#d14a22] text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </Button>
            )}
            {isVerified && (
              <div className="flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg">
                ✓ Verified
              </div>
            )}
          </div>

          {/* OTP Input */}
          {otpSent && !isVerified && (
            <div className="mt-3 flex gap-3">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200"
                maxLength="6"
              />
              <Button
                onClick={handleVerifyOTP}
                disabled={verifyLoading || otp.length !== 6}
                className="bg-[#000080] hover:bg-[#000080]/90 text-white px-6 py-3 rounded-lg transition-all duration-300"
              >
                {verifyLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          )}
        </div>

        {/* Questionnaire Section */}
        {isQuestionnaireLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec5228]"></div>
          </div>
        ) : (
          questionnaireData?.questionnaire?.questions && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-[#ec5228] rounded-lg flex items-center justify-center">
                  <Clipboard className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Questionnaire
                </h4>
              </div>
              {[...questionnaireData.questionnaire.questions]
                .sort((a, b) => a.order - b.order)
                .map((question) => (
                  <div key={question.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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
                          handleQuestionnaireChange(question.id, e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200"
                        placeholder="Your answer..."
                      />
                    )}

                    {question.type === "textarea" && (
                      <textarea
                        value={questionnaireResponses[question.id] || ""}
                        onChange={(e) =>
                          handleQuestionnaireChange(question.id, e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200 resize-none"
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
                          <span className="text-sm text-gray-500">1 (Low)</span>
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
          )
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`flex-1 py-3 font-medium transition-all duration-300 ${
              isFormValid()
                ? "bg-[#ec5228] hover:bg-[#d14a22] text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Specialist Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

ContactForm.propTypes = {
  onContinue: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  selectedServiceType: PropTypes.string.isRequired,
  selectedDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

const Dashboard = () => {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();

  // Fetch user credits
  const {
    data: creditsData,
    isLoading: creditsLoading,
    error: creditsError,
    refetch: refetchCredits,
  } = useGetUserCreditsQuery();

  // Debug logging
  console.log("Credits Data:", creditsData);
  console.log("Credits Loading:", creditsLoading);
  console.log("Credits Error:", creditsError);

  // Enhanced debug logging for credits
  useEffect(() => {
    if (creditsData) {
      console.log("Credits data structure:", {
        success: creditsData.success,
        credits: creditsData.credits,
        creditsLength: creditsData.credits?.length,
        fullResponse: creditsData,
      });

      creditsData.credits?.forEach((credit, idx) => {
        console.log(`Credit ${idx}:`, {
          serviceType: credit.serviceType,
          duration: credit.duration,
          count: credit.count,
        });
      });
    }
  }, [creditsData]);

  // Function to format service type for display
  const formatServiceType = (serviceType) => {
    switch (serviceType) {
      case "mental_health":
        return "Mental Health";
      case "cosmetology":
        return "Cosmetology";
      default:
        return serviceType;
    }
  };

  // Inspirational quotes for users
  const inspirationalQuotes = [
    "Your mental health is just as important as your physical health. Take care of yourself.",
    "Every step towards better mental health is a step towards a brighter future.",
    "Self-care isn't selfish; it's essential. You matter, and your well-being matters.",
    "Progress, not perfection. Every small step counts on your journey to wellness.",
    "You are stronger than you think, braver than you feel, and more loved than you know.",
    "Mental health recovery is not a destination, but a journey of self-discovery.",
    "Be patient with yourself. Healing takes time, and you're worth the effort.",
    "Your story isn't over yet. There are beautiful chapters still to be written.",
    "Taking care of your mental health is an act of courage and self-compassion.",
    "You don't have to be perfect. You just have to be yourself, and that's enough.",
  ];
  const navigate = useNavigate();

  // Fetch meetings based on user role and verification status
  const {
    data: meetingsDataFromApi,
    isLoading: isMeetingsDataLoading,
    error: meetingsError,
  } = useGetMeetingsQuery(undefined, {
    skip:
      (user?.role === "admin" || user?.role === "doctor") &&
      user?.isVerified !== "verified",
  });

  const [deleteMeeting] = useDeleteMeetingMutation();
  const [joinMeeting] = useJoinMeetingMutation();
  const [createMeeting] = useCreateMeetingMutation();
  const [updateUser] = useUpdateUserMutation();
  const role = useSelector((state) => state?.auth?.user?.role);

  // State variables for managing meeting data and UI updates
  const [meetingData, setMeetingData] = useState([]);

  // Name popup state
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Booking system state
  const [showContactForm, setShowContactForm] = useState(false);
  const [showBookingSystem, setShowBookingSystem] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showPsychologistSelection, setShowPsychologistSelection] =
    useState(false);
  const [contactFormData, setContactFormData] = useState(null);

  // Buy Credits state
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [buyServiceType, setBuyServiceType] = useState("mental_health");
  const [buyDuration, setBuyDuration] = useState(50); // 50, 80, or 30
  const [buyCreditsCount, setBuyCreditsCount] = useState(3); // 1, 3, or 5
  const [isCustomCredits, setIsCustomCredits] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [promoCodeData, setPromoCodeData] = useState(null);
  const [promoCodeLoading, setPromoCodeLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  // Questionnaire modal state
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [selectedMeetingQuestionnaire, setSelectedMeetingQuestionnaire] =
    useState(null);

  // Fetch psychologists data
  const { data: psychologistsData, isLoading: psychologistsLoading } =
    useGetPsychologistsQuery();

  // Fetch cosmetologists data
  const { data: cosmetologistsData, isLoading: cosmetologistsLoading } =
    useGetCosmetologistsQuery();

  // Fetch pricing data for both services using lazy query
  const [
    triggerGetPricing,
    { data: pricingData, isLoading: isPricingLoading },
  ] = useLazyGetPricingQuery();

  // Coupon validation hook (using calculateAllPlansDiscounts for plan-based discounts)
  const [calculateAllPlansDiscounts] = useCalculateAllPlansDiscountsMutation();

  // Credit purchase hooks
  const [createCreditsOrder] = useCreateCreditsOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // State to force re-renders for meeting visibility updates
  const [currentTime, setCurrentTime] = useState(new Date());

  // Store random quote once when component mounts (only changes on page reload)
  const [randomQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    return inspirationalQuotes[randomIndex];
  });

  // Timer for real-time updates (every second for accurate countdown)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time countdown

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user && (!user.name || !user.email)) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, [user]);

  // User role checks for conditional rendering
  const isDoctor = role === "doctor";
  const isAdmin = role === "admin";
  const now = currentTime; // Use state variable for real-time updates

  // Helper function to combine meeting date and time into a single DateTime object
  const getMeetingDateTime = useCallback((meeting) => {
    if (!meeting || !meeting.meetingDate || !meeting.meetingTime) {
      console.warn("Invalid meeting data:", meeting);
      return new Date(); // Return current date as fallback
    }

    const meetingDateTime = new Date(meeting.meetingDate);

    // Handle 24-hour format (e.g., "14:30" or "02:18")
    if (meeting.meetingTime.includes(":")) {
      const [hours, minutes] = meeting.meetingTime.split(":").map(Number);

      if (!isNaN(hours) && !isNaN(minutes)) {
        meetingDateTime.setHours(hours, minutes, 0, 0);
      } else {
        console.warn("Invalid time format:", meeting.meetingTime);
      }
    } else {
      console.warn("Unrecognized time format:", meeting.meetingTime);
    }

    return meetingDateTime;
  }, []); // No dependencies needed as it's a pure function

  // Sort meetings by date and time for proper chronological display
  const sortedMeetings = [...meetingData].sort((a, b) => {
    const dateTimeA = getMeetingDateTime(a);
    const dateTimeB = getMeetingDateTime(b);
    return dateTimeA - dateTimeB;
  });

  // Get the stored random inspirational quote (only changes on page reload)
  const getUserQuote = () => {
    return randomQuote;
  };

  // Extract user's first name for personalized greeting
  const getUserFirstName = () => {
    if (!user?.name) return "User";
    return user.name.toLowerCase().includes("dr.")
      ? user.name.split(" ")[1]
      : user.name.split(" ")[0];
  };

  // Filter meetings to show as "upcoming" (includes only meeting duration after start time)
  const upcomingMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const meetingEndTime = new Date(meetingDateTime);

    // Use actual meeting duration from database (default to 60 minutes if not specified)
    const durationInMinutes = meeting.duration || 60;

    // Add meeting duration only (no grace period)
    meetingEndTime.setMinutes(meetingEndTime.getMinutes() + durationInMinutes);

    return meetingEndTime > now;
  });

  // Filter meetings to show as "past" (only after meeting duration)
  const pastMeetings = sortedMeetings.filter((meeting) => {
    const meetingDateTime = getMeetingDateTime(meeting);
    const meetingEndTime = new Date(meetingDateTime);

    // Use actual meeting duration from database (default to 60 minutes if not specified)
    const durationInMinutes = meeting.duration || 60;

    // Add meeting duration only (no grace period)
    meetingEndTime.setMinutes(meetingEndTime.getMinutes() + durationInMinutes);

    return meetingEndTime <= now;
  });

  // Get the next upcoming meeting for the highlight card
  const nextMeeting = upcomingMeetings[0];

  // Date formatting helper functions
  const formatDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "long" });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Real-time countdown calculation for next meeting
  const getCountdown = useCallback(
    (meeting) => {
      const now = currentTime; // Use state variable for real-time updates
      // Use getMeetingDateTime helper to get the proper date+time object
      const meetingDateTime = getMeetingDateTime(meeting);
      const diff = meetingDateTime - now;

      if (diff <= 0) return "Started";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    [currentTime, getMeetingDateTime]
  ); // Dependencies: currentTime, getMeetingDateTime

  // State for countdown display with real-time updates
  const [countdown, setCountdown] = useState("");

  // Update countdown every second for the next meeting
  useEffect(() => {
    if (!nextMeeting) {
      setCountdown("");
      return;
    }

    // Update countdown immediately
    const updateCountdown = () => {
      const newCountdown = getCountdown(nextMeeting);
      setCountdown(newCountdown);
    };

    updateCountdown(); // Set initial value

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextMeeting, getCountdown]); // Include getCountdown as dependency

  // Update meeting data when API data changes
  useEffect(() => {
    if (!isMeetingsDataLoading && meetingsDataFromApi) {
      console.log("API Data:", meetingsDataFromApi);
      if (meetingsDataFromApi.success && meetingsDataFromApi.meetings) {
        setMeetingData(meetingsDataFromApi.meetings);
        console.log("Meetings loaded:", meetingsDataFromApi.meetings.length);
        console.log("Sample meeting data:", meetingsDataFromApi.meetings[0]);
      }
    }
  }, [meetingsDataFromApi, isMeetingsDataLoading]);

  // Check if user name or email is not defined and show popup
  useEffect(() => {
    if (user && (!user.name || !user.email)) {
      setShowNamePopup(true);
    }
  }, [user]);

  // Set default duration when service type changes and fetch pricing
  useEffect(() => {
    if (buyServiceType === "mental_health") {
      setBuyDuration(50);
      setBuyCreditsCount(3);
      triggerGetPricing({ serviceType: "mental_health" });
    } else if (buyServiceType === "cosmetology") {
      setBuyDuration(30);
      setBuyCreditsCount(3);
      triggerGetPricing({ serviceType: "cosmetology" });
    }
  }, [buyServiceType, triggerGetPricing]);

  // Check if user can join meeting (5 minutes before start, up to meeting duration after start)
  const canJoinMeeting = (meetingDate, meetingTime, duration = 60) => {
    if (!meetingDate || !meetingTime) {
      return false;
    }

    const now = currentTime; // Use state variable for real-time updates
    const meetingDateTime = new Date(meetingDate);

    // Handle 24-hour format (e.g., "14:30" or "02:18")
    if (meetingTime.includes(":")) {
      const [hours, minutes] = meetingTime.split(":").map(Number);

      if (!isNaN(hours) && !isNaN(minutes)) {
        meetingDateTime.setHours(hours, minutes, 0, 0);
      } else {
        console.warn("Invalid time format in canJoinMeeting:", meetingTime);
        return false;
      }
    } else {
      console.warn("Unrecognized time format in canJoinMeeting:", meetingTime);
      return false;
    }

    const fiveMinutesBefore = new Date(meetingDateTime);
    fiveMinutesBefore.setMinutes(fiveMinutesBefore.getMinutes() - 5);

    const meetingEndTime = new Date(meetingDateTime);
    // Use actual meeting duration only (no grace period)
    meetingEndTime.setMinutes(meetingEndTime.getMinutes() + duration);

    return now >= fiveMinutesBefore && now <= meetingEndTime;
  };

  // Handle meeting deletion with confirmation
  const handleDeleteMeeting = async (meetingId) => {
    setMeetingToDelete(meetingId);
    setShowDeleteDialog(true);
  };

  // Confirm and execute meeting deletion
  const confirmDeleteMeeting = async () => {
    if (!meetingToDelete) return;

    try {
      await deleteMeeting(meetingToDelete).unwrap();
      toast.success("Meeting deleted successfully!");
      setShowDeleteDialog(false);
      setMeetingToDelete(null);
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      toast.error("Failed to delete meeting.");
      setShowDeleteDialog(false);
      setMeetingToDelete(null);
    }
  };

  // Cancel delete operation
  const cancelDeleteMeeting = () => {
    setShowDeleteDialog(false);
    setMeetingToDelete(null);
  };

  // Handle joining meeting and record join time
  const handleJoinMeeting = async (meetingId, meetingLink) => {
    try {
      console.log("Attempting to join meeting:", { meetingId, meetingLink });

      if (!meetingLink) {
        console.error("No meeting link provided");
        toast.error("Meeting link not available");
        return;
      }

      // Call the joinMeeting API to record the join time
      await joinMeeting(meetingId).unwrap();

      // Open the meeting link in a new tab
      window.open(meetingLink, "_blank", "noopener noreferrer");
      toast.success("Joining meeting...");
    } catch (error) {
      console.error("Failed to record meeting join:", error);
      // Still open the meeting link even if the API call fails
      if (meetingLink) {
        window.open(meetingLink, "_blank", "noopener noreferrer");
        toast.warning("Joining meeting (join time not recorded)");
      } else {
        toast.error("Meeting link not available");
      }
    }
  };

  // State for questionnaire data when viewing responses
  const [questionnaireDataForViewing, setQuestionnaireDataForViewing] =
    useState(null);

  // Helper function to get question text from question ID using real questionnaire data
  const getQuestionText = (questionId, serviceType, questionnaireData) => {
    if (
      questionnaireData &&
      questionnaireData.questionnaire &&
      questionnaireData.questionnaire.questions
    ) {
      const question = questionnaireData.questionnaire.questions.find(
        (q) => q.id === questionId
      );
      if (question) {
        return question.question;
      }
    }

    // Fallback to question ID if not found
    return `Question ${questionId}`;
  };

  // Handle viewing questionnaire responses
  const handleViewQuestionnaire = async (meetingId) => {
    const meeting = meetingData.find((m) => m._id === meetingId);
    console.log("Selected meeting for questionnaire:", meeting);
    console.log("Questionnaire responses:", meeting?.questionnaireResponses);
    console.log(
      "Type of questionnaire responses:",
      typeof meeting?.questionnaireResponses
    );

    if (meeting && meeting.questionnaireResponses) {
      setSelectedMeetingQuestionnaire(meeting);

      // Fetch questionnaire data for this service type
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/questionnaire/${
            meeting.serviceType
          }`,
          {
            credentials: "include",
          }
        );
        const questionnaireData = await response.json();
        console.log("Fetched questionnaire data:", questionnaireData);
        setQuestionnaireDataForViewing(questionnaireData);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
        setQuestionnaireDataForViewing(null);
      }

      setShowQuestionnaireModal(true);
    }
  };

  // Check if meeting is currently in progress (started but not over)
  const isMeetingInProgress = (meeting) => {
    const now = currentTime; // Use state variable for real-time updates
    const meetingDateTime = getMeetingDateTime(meeting);

    // Use actual meeting duration from database (default to 60 minutes if not specified)
    const durationInMinutes = meeting.duration || 60;
    const meetingEndTime = new Date(meetingDateTime);
    meetingEndTime.setMinutes(meetingEndTime.getMinutes() + durationInMinutes);

    return now >= meetingDateTime && now <= meetingEndTime;
  };

  // Format meeting time display with special handling for active meetings
  const formatMeetingTime = (meeting) => {
    if (isMeetingInProgress(meeting)) {
      return <span className="text-emerald-600 font-semibold">Join now!</span>;
    }
    return meeting.meetingTime;
  };

  // Convert UTC timestamps to Indian Standard Time for display
  const formatIndianTime = (utcTimestamp) => {
    if (!utcTimestamp) return "Not joined";

    // Create a date object from the UTC timestamp
    const date = new Date(utcTimestamp);

    // Format to Indian time (IST is UTC+5:30) - only show time
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-IN", options).format(date);
  };

  // Booking system functions
  const handleBookSession = (serviceType, duration) => {
    setSelectedServiceType(serviceType);
    setSelectedDuration(duration);
    setShowContactForm(true);
  };

  const handleContactFormContinue = (formData) => {
    setContactFormData(formData);
    setShowContactForm(false);
    setShowPsychologistSelection(true);
  };

  const handleContactFormBack = () => {
    setShowContactForm(false);
    setSelectedServiceType(null);
    setSelectedDuration(null);
  };

  const handlePsychologistSelect = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setShowBookingSystem(true);
    setShowPsychologistSelection(false);
  };

  const handleDateTimeSelect = async (date, time) => {
    if (!selectedPsychologist || !selectedServiceType || !selectedDuration) {
      toast.error("Missing booking information");
      return;
    }

    try {
      // Format date for API using the utility function to avoid timezone issues
      const formattedDate = formatDateForAPI(date);

      // Create meeting data with the correct format for the backend
      console.log(selectedPsychologist);
      const meetingData = {
        bhAssociateId: selectedPsychologist._id,
        meetingDate: formattedDate,
        meetingTime: time,
        duration: selectedDuration,
        serviceType: selectedServiceType,
        questionnaireResponses: contactFormData?.questionnaireResponses || {},
      };

      console.log("Creating meeting with data:", meetingData);

      // Create the meeting
      const result = await createMeeting(meetingData).unwrap();

      toast.success(
        `Session booked successfully! ${result.remainingCredits} Meeting credits remaining.`
      );

      // Refetch credits to update the display immediately
      await refetchCredits();

      // IMPORTANT: Manually invalidate the psychologist availability cache
      // This ensures the calendar updates immediately with the new booking
      dispatch(
        psychologistApi.util.invalidateTags([
          { type: "Availability", id: selectedPsychologist._id },
          "Availability",
        ])
      );

      // Reset booking state
      setShowContactForm(false);
      setShowBookingSystem(false);
      setSelectedPsychologist(null);
      setSelectedServiceType(null);
      setSelectedDuration(null);
      setShowPsychologistSelection(false);
      setContactFormData(null);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error?.data?.message || "Failed to book session");
    }
  };

  const handleCloseBooking = () => {
    setShowContactForm(false);
    setShowBookingSystem(false);
    setSelectedPsychologist(null);
    setSelectedServiceType(null);
    setSelectedDuration(null);
    setShowPsychologistSelection(false);
    setContactFormData(null);
  };

  // Calculate total price for selected credits (plan-based pricing)
  const calculateTotalPrice = useCallback(() => {
    if (!buyCreditsCount || !buyDuration || !pricingData?.pricing) return 0;

    // Find the plan that matches sessions count and duration
    const selectedPlanData = pricingData.pricing.find(
      (item) => item.serviceType === buyServiceType
    );

    if (!selectedPlanData?.plans) return 0;

    const matchingPlan = selectedPlanData.plans.find(
      (plan) =>
        plan.sessions === parseInt(buyCreditsCount) &&
        plan.duration === parseInt(buyDuration)
    );

    if (!matchingPlan) return 0;

    let totalPrice = matchingPlan.sellingPrice;

    // Apply promocode discount if applied
    if (promoCodeApplied && promoCodeData) {
      const discountAmount = promoCodeData.discountAmount || 0;
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }

    return totalPrice;
  }, [
    buyCreditsCount,
    buyDuration,
    buyServiceType,
    pricingData,
    promoCodeApplied,
    promoCodeData,
  ]);

  // Calculate original price without discount (plan-based pricing)
  const calculateOriginalPrice = useCallback(() => {
    if (!buyCreditsCount || !buyDuration || !pricingData?.pricing) return 0;

    // Find the plan that matches sessions count and duration
    const selectedPlanData = pricingData.pricing.find(
      (item) => item.serviceType === buyServiceType
    );

    if (!selectedPlanData?.plans) return 0;

    const matchingPlan = selectedPlanData.plans.find(
      (plan) =>
        plan.sessions === parseInt(buyCreditsCount) &&
        plan.duration === parseInt(buyDuration)
    );

    if (!matchingPlan) return 0;

    return matchingPlan.sellingPrice;
  }, [buyCreditsCount, buyDuration, buyServiceType, pricingData]);

  // Buy Credits helpers
  const openBuyCredits = (serviceType = "mental_health", duration) => {
    setBuyServiceType(serviceType);

    // Set appropriate default duration based on service type if not provided or invalid
    let defaultDuration;
    if (serviceType === "cosmetology") {
      defaultDuration = 30;
    } else {
      defaultDuration = 50;
    }

    // Use provided duration if valid for the service type, otherwise use default
    if (duration) {
      if (serviceType === "cosmetology" && duration === 30) {
        setBuyDuration(duration);
      } else if (
        serviceType === "mental_health" &&
        (duration === 50 || duration === 80)
      ) {
        setBuyDuration(duration);
      } else {
        setBuyDuration(defaultDuration);
      }
    } else {
      setBuyDuration(defaultDuration);
    }

    setBuyCreditsCount(3); // Default to 3 credits
    setShowBuyCredits(true);
  };

  const closeBuyCredits = () => {
    setShowBuyCredits(false);
    // Reset all Buy Credits state
    setBuyServiceType("mental_health");
    setBuyDuration(50);
    setBuyCreditsCount(3);
    setIsCustomCredits(false);
    setPromoCode("");
    setPromoCodeApplied(false);
    setPromoCodeData(null);
    setPromoCodeLoading(false);
    setPurchaseLoading(false);
  };

  // Promocode validation function with plan-based discounts
  const handleValidatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    if (!pricingData?.pricing) {
      toast.error("Please wait for pricing data to load");
      return;
    }

    if (!buyCreditsCount || !buyDuration) {
      toast.error("Please select credits and duration first");
      return;
    }

    setPromoCodeLoading(true);
    try {
      // Get the selected plan
      const selectedPlanData = pricingData.pricing.find(
        (item) => item.serviceType === buyServiceType
      );

      if (!selectedPlanData?.plans) {
        toast.error("Pricing data not available");
        setPromoCodeLoading(false);
        return;
      }

      const matchingPlan = selectedPlanData.plans.find(
        (plan) =>
          plan.sessions === parseInt(buyCreditsCount) &&
          plan.duration === parseInt(buyDuration)
      );

      if (!matchingPlan) {
        toast.error("Selected plan not found");
        setPromoCodeLoading(false);
        return;
      }

      // Calculate discount for the selected plan
      const result = await calculateAllPlansDiscounts({
        code: promoCode.trim(),
        serviceType: buyServiceType,
        plans: [matchingPlan],
        ...(user?._id && { userId: user._id }),
      }).unwrap();

      console.log("💰 Discount calculated for plan:", result);

      // Get the discount for the selected plan
      const planWithDiscount = result.plansWithDiscounts[0];

      setPromoCodeApplied(true);
      setPromoCodeData({
        ...result.coupon,
        discountAmount: planWithDiscount.discountAmount,
        finalPrice: planWithDiscount.finalPrice,
      });
      toast.success("Promo code applied successfully!");
    } catch (error) {
      console.error("Promo code validation error:", error);
      toast.error(error?.data?.message || "Invalid promo code");
      setPromoCodeApplied(false);
      setPromoCodeData(null);
    } finally {
      setPromoCodeLoading(false);
    }
  };

  // Function to revalidate promo code silently when parameters change
  const revalidatePromoCode = useCallback(async () => {
    if (!promoCode.trim() || !promoCodeApplied || !pricingData?.pricing) return;

    try {
      // Get the selected plan
      const selectedPlanData = pricingData.pricing.find(
        (item) => item.serviceType === buyServiceType
      );

      if (!selectedPlanData?.plans) {
        setPromoCodeApplied(false);
        setPromoCodeData(null);
        return;
      }

      const matchingPlan = selectedPlanData.plans.find(
        (plan) =>
          plan.sessions === parseInt(buyCreditsCount) &&
          plan.duration === parseInt(buyDuration)
      );

      if (!matchingPlan) {
        setPromoCodeApplied(false);
        setPromoCodeData(null);
        return;
      }

      // Calculate discount for the selected plan
      const result = await calculateAllPlansDiscounts({
        code: promoCode.trim(),
        serviceType: buyServiceType,
        plans: [matchingPlan],
        ...(user?._id && { userId: user._id }),
      }).unwrap();

      // Get the discount for the selected plan
      const planWithDiscount = result.plansWithDiscounts[0];

      // Update promo code data if still valid
      setPromoCodeData({
        ...result.coupon,
        discountAmount: planWithDiscount.discountAmount,
        finalPrice: planWithDiscount.finalPrice,
      });
    } catch {
      // If promo code is no longer valid, reset it
      setPromoCodeApplied(false);
      setPromoCodeData(null);
      toast.error("Promo code is no longer valid for the selected options");
    }
  }, [
    promoCode,
    promoCodeApplied,
    buyServiceType,
    buyCreditsCount,
    buyDuration,
    pricingData,
    calculateAllPlansDiscounts,
    user?._id,
  ]);

  // Revalidate promo code when service parameters change
  useEffect(() => {
    if (promoCodeApplied) {
      revalidatePromoCode();
    }
  }, [
    buyServiceType,
    buyDuration,
    buyCreditsCount,
    promoCodeApplied,
    revalidatePromoCode,
  ]);

  const handleBuyCreditsContinue = async () => {
    if (!buyServiceType || !buyDuration || !buyCreditsCount) {
      toast.error("Please select all required fields");
      return;
    }

    setPurchaseLoading(true);
    try {
      // Step 1: Create the credits order
      const requestData = {
        serviceType: buyServiceType,
        duration: buyDuration,
        creditsCount: buyCreditsCount,
      };

      // Only include promoCode if applied
      if (promoCodeApplied && promoCode.trim()) {
        requestData.promoCode = promoCode.trim();
      }

      console.log("Creating credits order with data:", requestData);
      const result = await createCreditsOrder(requestData).unwrap();
      console.log("Credits order created successfully:", result);

      if (result.success && result.data?.paymentSessionId) {
        // Step 2: Initialize Cashfree payment using the SDK
        await initializeCashfreePayment(
          result.data.paymentSessionId,
          result.data.orderId
        );
      } else {
        toast.error("Failed to create payment order");
        setPurchaseLoading(false);
      }
    } catch (error) {
      console.error("Error creating credits order:", error);
      toast.error(error?.data?.message || "Failed to create payment order");
      setPurchaseLoading(false);
    }
  };

  const initializeCashfreePayment = async (paymentSessionId, orderId) => {
    try {
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
        paymentSessionId: paymentSessionId,
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

      // Step 3: Verify payment after checkout
      await handlePaymentVerification(orderId);
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(error.message || "Failed to initialize payment");
      setPurchaseLoading(false);
    }
  };

  const handlePaymentVerification = async (orderId) => {
    try {
      console.log("Verifying payment for credits order:", orderId);

      const verificationResult = await verifyPayment({
        orderId: orderId,
      }).unwrap();

      console.log("Payment verification result:", verificationResult);

      if (verificationResult.success) {
        const { paymentStatus, orderStatus } = verificationResult;

        if (paymentStatus === "completed" || orderStatus === "PAID") {
          // Payment successful - refresh credits and close modal
          toast.success("Credits purchased successfully!");
          refetchCredits(); // Refresh the credits data
          closeBuyCredits(); // Close the buy credits modal
        } else if (paymentStatus === "failed" || orderStatus === "FAILED") {
          // Payment failed
          toast.error("Payment failed. Please try again.");
        } else if (
          paymentStatus === "cancelled" ||
          orderStatus === "CANCELLED"
        ) {
          // Payment cancelled
          toast.error("Payment was cancelled.");
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
            handlePaymentVerification(orderId);
          }, 3000);
          return; // Don't set loading to false yet
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
      toast.error(errorMessage);
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Back button handlers for booking flow
  const handleBackToPsychologistSelection = () => {
    setShowBookingSystem(false);
    setShowPsychologistSelection(true);
    setSelectedPsychologist(null);
  };

  const handleBackToContactForm = () => {
    setShowPsychologistSelection(false);
    setShowContactForm(true);
  };

  // Handle name and email submission
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!userEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await updateUser({
        name: userName.trim(),
        email:
          userEmail.trim().toUpperCase()[0] +
          userEmail.toLowerCase().trim().slice(1), // Capitalize first letter
      }).unwrap();

      // Update Redux state with the updated user data
      dispatch(
        userLoggedIn({
          user: result.user,
          isLoading: false,
        })
      );

      toast.success("Profile updated successfully!");
      setShowNamePopup(false);
      setUserName("");
      setUserEmail("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  // Get credits for a specific service type and duration
  const getAvailableCredits = (serviceType, duration) => {
    if (!creditsData?.credits) return 0;
    const credit = creditsData.credits.find(
      (c) => c.serviceType === serviceType && c.duration === duration
    );
    return credit ? credit.count : 0;
  };

  // Main dashboard render with responsive design and gradient background
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20 pb-12 space-y-8">
        {/* Credits Section with Booking - Only show to users */}

        {/* User Details Header Section - Moved from card to top */}
        {user && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 mt-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-3 rounded-full shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000080] mb-1">
                    Hello, {getUserFirstName()}! 👋
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ec5228] rounded-full"></span>
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-4 border-l-4 border-[#ec5228] shadow-sm">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic font-medium">
                  &quot;{getUserQuote()}&quot;
                </p>
              </div>
            </div>

            {/* Date Calendar Widget - Responsive design for mobile and desktop */}
            <div className="lg:min-w-[200px] flex justify-center lg:justify-end">
              {/* Mobile: Horizontal rectangular calendar box, Desktop: Square calendar box */}
              <div
                className="bg-gradient-to-br from-[#ec5228]/10 to-[#d14a22]/10 rounded-2xl border border-[#ec5228]/20 
                               p-4 sm:p-6 text-center
                               w-full max-w-xs sm:max-w-none sm:w-auto
                               flex sm:block items-center justify-between sm:justify-center
                               min-h-[80px] sm:min-h-auto"
              >
                {/* Date and Month display */}
                <div className="flex items-center sm:block gap-3 sm:gap-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000080] mb-0 sm:mb-1">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </div>
                </div>
                {/* Year display - positioned at right on mobile, below on desktop */}
                <div className="text-xs text-gray-500 sm:mt-1">
                  {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "user" && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#000080]">
                      Meeting Credits Available
                    </h3>
                    <p className="text-sm text-gray-600">
                      Book sessions with your available credits
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {creditsData?.credits?.length > 0 && (
                    <div className="text-right hidden sm:block">
                      <div className="text-2xl font-bold text-[#000080]">
                        {creditsData.credits.reduce(
                          (total, credit) => total + credit.count,
                          0
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Total Credits</div>
                    </div>
                  )}
                  <Button
                    onClick={() => openBuyCredits()}
                    className="bg-[#000080] hover:bg-[#0000a0] text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Buy Credits
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {creditsLoading ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="h-16 bg-gray-200 rounded-lg mb-3"></div>
                          <div className="h-8 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : creditsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="text-red-800 font-semibold mb-2">
                      Error Loading Credits
                    </h4>
                    <p className="text-red-600 text-sm">
                      {creditsError?.data?.message ||
                        "Unable to load your credits. Please try again."}
                    </p>
                  </div>
                ) : creditsData?.credits?.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {creditsData.credits.map((credit, idx) => {
                      const isMentalHealth =
                        credit.serviceType === "mental_health";
                      const isCosmetology =
                        credit.serviceType === "cosmetology";
                      const ServiceIcon = isMentalHealth
                        ? Heart
                        : isCosmetology
                        ? Sparkles
                        : Award;

                      const cardGradient = isMentalHealth
                        ? "bg-gradient-to-br from-blue-50 via-blue-25 to-indigo-50 border-blue-200"
                        : isCosmetology
                        ? "bg-gradient-to-br from-purple-50 via-purple-25 to-pink-50 border-purple-200"
                        : "bg-gradient-to-br from-green-50 via-green-25 to-emerald-50 border-green-200";

                      const iconBg = isMentalHealth
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : isCosmetology
                        ? "bg-gradient-to-r from-purple-500 to-pink-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600";

                      return (
                        <div
                          key={idx}
                          className={`group w-full bg-white border border-gray-100 rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${cardGradient} border`}
                          onClick={() =>
                            credit.count > 0 &&
                            handleBookSession(
                              credit.serviceType,
                              credit.duration
                            )
                          }
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div
                                className={`p-3 rounded-xl ${iconBg} text-white shadow-lg shadow-orange-200/50 group-hover:shadow-xl group-hover:shadow-orange-300/50 transition-all duration-300`}
                              >
                                <ServiceIcon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#000080] text-lg group-hover:text-orange-800 transition-colors duration-300">
                                  {formatServiceType(credit.serviceType)}
                                </h4>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                  {credit.duration} min session
                                </p>
                              </div>
                            </div>
                            <div className="mb-6">
                              <div
                                className={`rounded-xl p-4 text-center shadow-md ${
                                  isMentalHealth
                                    ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                                    : isCosmetology
                                    ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
                                    : "bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
                                }`}
                              >
                                <div className="text-3xl font-bold text-[#000080] mb-2 group-hover:scale-110 transition-transform duration-300">
                                  {credit.count}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                  {credit.count === 1 ? "Credit" : "Credits"}
                                </div>
                              </div>
                            </div>{" "}
                            {credit.count > 0 ? (
                              <Button className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-300 flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Book Session
                              </Button>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="w-full py-3 text-sm font-bold text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-gray-300/30">
                                  <Lock className="w-4 h-4" />
                                  No Credits
                                </div>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openBuyCredits(
                                      credit.serviceType,
                                      credit.duration
                                    );
                                  }}
                                  className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  Buy Credits
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#fffae3] to-white border-2 border-dashed border-[#ec5228]/30 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-[#ec5228]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-[#ec5228]" />
                    </div>
                    <h4 className="text-[#000080] font-bold text-lg mb-2">
                      No Credits Available
                    </h4>
                    <p className="text-gray-600 mb-6">
                      You don&apos;t have any credits yet. Purchase credits to
                      start booking sessions with our specialists.
                    </p>
                    <Button
                      onClick={() => openBuyCredits()}
                      className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] hover:from-[#d14a22] hover:to-[#b8411f] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Purchase Credits
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Meeting Highlight Card */}
        {nextMeeting && (
          <div className="bg-gradient-to-r from-[#000080] via-[#0000a0] to-[#000080] rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 text-white transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm uppercase tracking-wider font-semibold text-white/90">
                    Next Meeting
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                  {formatDay(nextMeeting.meetingDate)},{" "}
                  {formatDate(nextMeeting.meetingDate)}
                </h2>

                <div className="flex items-center gap-3 text-lg font-semibold">
                  <Clock className="w-5 h-5 text-white/80" />
                  <span>{nextMeeting.meetingTime}</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    Duration: {nextMeeting.duration || 60} minutes
                  </span>
                </div>

                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  {/* Meeting participant information display */}
                  {!isDoctor && !isAdmin && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-white/80" />
                      <span className="text-sm">
                        <span className="font-semibold">BH Associate:</span>{" "}
                        {nextMeeting.bhAssocName ||
                          nextMeeting.doctorName ||
                          "Not assigned"}
                      </span>
                    </div>
                  )}
                  {isDoctor && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-white/80" />
                      <span className="text-sm">
                        <span className="font-semibold">Client:</span>{" "}
                        {nextMeeting.clientName}
                      </span>
                    </div>
                  )}
                  {isAdmin && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-white/80" />
                        <span className="text-sm">
                          <span className="font-semibold">Client:</span>{" "}
                          {nextMeeting.clientName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-white/80" />
                        <span className="text-sm">
                          <span className="font-semibold">BH Associate:</span>{" "}
                          {nextMeeting.bhAssocName ||
                            nextMeeting.doctorName ||
                            "Not assigned"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-4 lg:min-w-[280px]">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                  <div className="text-xs uppercase tracking-wider font-semibold text-white/80 mb-1">
                    Starts in
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {countdown}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  {canJoinMeeting(
                    nextMeeting.meetingDate,
                    nextMeeting.meetingTime,
                    nextMeeting.duration
                  ) ? (
                    <Button
                      className="bg-[#ec5228] hover:bg-[#d14a22] text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                      onClick={() =>
                        handleJoinMeeting(
                          nextMeeting._id,
                          nextMeeting.meetingLink
                        )
                      }
                    >
                      <Video className="w-5 h-5" />
                      Join Meeting
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="bg-white/10 text-white/60 font-semibold px-6 py-3 rounded-xl shadow-inner transition-all duration-300 flex items-center justify-center gap-2 cursor-not-allowed"
                      title="You can join 5 minutes before the meeting starts"
                    >
                      <Video className="w-5 h-5" />
                      Join Meeting
                    </Button>
                  )}
                  {isDoctor && nextMeeting.reportLink && (
                    <a
                      href={nextMeeting.reportLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full lg:w-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#000080] rounded-xl py-3"
                      >
                        View Report
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Meetings State */}
        {upcomingMeetings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-[#fffae3] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                {role !== "user" && user?.isVerified !== "verified" ? (
                  <Lock className="w-10 h-10 text-[#ec5228]" />
                ) : (
                  <Calendar className="w-10 h-10 text-[#ec5228]" />
                )}
              </div>
              {role !== "user" && user?.isVerified !== "verified" ? (
                <h1 className="text-xl sm:text-2xl font-bold text-[#000080] mb-4">
                  {user?.isVerified === "pending" ? (
                    "Your documents are under review. Please give us some time for verification."
                  ) : (
                    <>
                      Your dashboard is{" "}
                      <span className="font-bold text-[#ec5228]">LOCKED</span>
                      <br></br>
                      <Button
                        variant="outline"
                        className="text-[#000080] mt-4"
                        onClick={() => navigate("/details")}
                      >
                        Submit Documents
                      </Button>
                    </>
                  )}
                </h1>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000080] mb-4">
                    All Caught Up!
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You&apos;re all set! No upcoming meetings scheduled at the
                    moment.
                    {role === "user" && " Book a new session to get started."}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Upcoming Meetings Table */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#000080] to-[#0000a0] px-6 py-4">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <Clock className="w-5 h-5" />
                Upcoming Sessions
              </h3>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Day
                      </th>
                      {isAdmin ? (
                        <>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            Client
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            BH Associate
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            User Joined
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                            Associate Joined
                          </th>
                        </>
                      ) : (
                        <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                          {isDoctor ? "Client" : "BH Associate"}
                        </th>
                      )}
                      {(isAdmin || isDoctor) && (
                        <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                          Questionnaire
                        </th>
                      )}
                      <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                        Action
                      </th>
                      {isAdmin && (
                        <th className="text-left py-3 px-4 font-semibold text-[#000080] text-sm">
                          Manage
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingMeetings.map((meeting, index) => (
                      <tr
                        key={meeting._id}
                        className={`hover:bg-[#fffae3] transition-colors duration-200 ${
                          index !== upcomingMeetings.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                          {formatDate(meeting.meetingDate)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {isMeetingInProgress(meeting) ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Join Now!
                            </span>
                          ) : (
                            <span className="text-gray-700">
                              {meeting.meetingTime}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDay(meeting.meetingDate)}
                        </td>
                        {isAdmin ? (
                          <>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {meeting.clientName}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {meeting.bhAssocName ||
                                meeting.doctorName ||
                                "Not assigned"}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {formatIndianTime(meeting.userJoinedAt)}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {formatIndianTime(meeting.docJoinedAt)}
                            </td>
                          </>
                        ) : (
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {isDoctor
                              ? meeting.clientName
                              : meeting.bhAssocName ||
                                meeting.doctorName ||
                                "Not assigned"}
                          </td>
                        )}
                        {(isAdmin || isDoctor) && (
                          <td className="py-4 px-4">
                            <Button
                              variant="ghost"
                              className="p-2 text-[#000080] hover:text-[#000080]/80 hover:bg-[#000080]/10"
                              title="View Questionnaire Responses"
                              onClick={() =>
                                handleViewQuestionnaire(meeting._id)
                              }
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          </td>
                        )}
                        <td className="py-4 px-4">
                          {canJoinMeeting(
                            meeting.meetingDate,
                            meeting.meetingTime,
                            meeting.duration
                          ) ? (
                            <Button
                              className="bg-[#ec5228] hover:bg-[#d14a22] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                              onClick={() =>
                                handleJoinMeeting(
                                  meeting._id,
                                  meeting.meetingLink
                                )
                              }
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                              title="Available 5 minutes before start time"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="py-4 px-4">
                            <Button
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300"
                              onClick={() => handleDeleteMeeting(meeting._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#000080]">
                    Book Your Session
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Step 1: Contact Information
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleCloseBooking}
                  className="text-gray-500 hover:text-red-500"
                >
                  <span className="sr-only">Close</span>✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <ContactForm
                onContinue={handleContactFormContinue}
                onBack={handleContactFormBack}
                selectedServiceType={selectedServiceType}
                selectedDuration={selectedDuration}
              />
            </div>
          </div>
        </div>
      )}

      {/* Buy Credits Modal */}
      {showBuyCredits && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#000080] text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#000080]">Buy Credits</h3>
                  <p className="text-xs text-gray-600">
                    Choose a service, duration, credits, and apply promo codes
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={closeBuyCredits}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </Button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBuyServiceType("mental_health")}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      buyServiceType === "mental_health"
                        ? "bg-blue-50 border-blue-300 text-[#000080]"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    Mental Health
                  </button>
                  <button
                    onClick={() => setBuyServiceType("cosmetology")}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      buyServiceType === "cosmetology"
                        ? "bg-purple-50 border-purple-300 text-[#000080]"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    Cosmetology
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {buyServiceType === "cosmetology" ? (
                    <button
                      onClick={() => setBuyDuration(30)}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        buyDuration === 30
                          ? "bg-[#fffae3] border-[#ec5228] text-[#000080]"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                    >
                      30 min
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setBuyDuration(50)}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          buyDuration === 50
                            ? "bg-[#fffae3] border-[#ec5228] text-[#000080]"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        50 min
                      </button>
                      <button
                        onClick={() => setBuyDuration(80)}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          buyDuration === 80
                            ? "bg-[#fffae3] border-[#ec5228] text-[#000080]"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        80 min
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits to Purchase
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setBuyCreditsCount(1);
                      setIsCustomCredits(false);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      !isCustomCredits && buyCreditsCount === 1
                        ? "bg-green-50 border-green-300 text-[#000080]"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    1 Credit
                  </button>
                  <button
                    onClick={() => {
                      setBuyCreditsCount(3);
                      setIsCustomCredits(false);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      !isCustomCredits && buyCreditsCount === 3
                        ? "bg-green-50 border-green-300 text-[#000080]"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    3 Credits
                  </button>
                  <button
                    onClick={() => {
                      setBuyCreditsCount(5);
                      setIsCustomCredits(false);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      !isCustomCredits && buyCreditsCount === 5
                        ? "bg-green-50 border-green-300 text-[#000080]"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    5 Credits
                  </button>
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Promo Code (Optional)
                  {promoCodeApplied && (
                    <span className="ml-2 text-green-600 text-xs">
                      ✓ Applied
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        // Reset applied status when user modifies the code
                        if (promoCodeApplied) {
                          setPromoCodeApplied(false);
                          setPromoCodeData(null);
                        }
                      }}
                      placeholder="Enter promo code"
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#ec5228] outline-none uppercase ${
                        promoCodeApplied
                          ? "border-green-300 bg-green-50"
                          : promoCode.trim()
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    />
                    {promoCode.trim() && (
                      <button
                        onClick={() => {
                          setPromoCode("");
                          setPromoCodeApplied(false);
                          setPromoCodeData(null);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear promo code"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={handleValidatePromoCode}
                    disabled={
                      !promoCode.trim() || promoCodeApplied || promoCodeLoading
                    }
                    className={`px-4 py-2 whitespace-nowrap ${
                      promoCodeApplied
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-[#000080] hover:bg-[#000080]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {promoCodeLoading
                      ? "Validating..."
                      : promoCodeApplied
                      ? "Applied ✓"
                      : "Apply"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid promo code and click Apply to get discounts on
                  your purchase
                </p>
              </div>

              {/* Price Display */}
              {buyServiceType && buyDuration && buyCreditsCount > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-right text-xs text-gray-500">
                        <p>
                          {isPricingLoading
                            ? "Loading pricing..."
                            : `${buyCreditsCount} ${
                                buyCreditsCount === 1 ? "credit" : "credits"
                              } × ${buyDuration} min`}
                        </p>
                      </div>
                    </div>

                    {/* Show original price if promo code is applied and discount > 0 */}
                    {promoCodeApplied && promoCodeData && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Original Price:</span>
                        <span
                          className={`${
                            promoCodeData.discountAmount > 0
                              ? "line-through"
                              : ""
                          } text-gray-500`}
                        >
                          ₹{calculateOriginalPrice().toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Show discount if promo code is applied */}
                    {promoCodeApplied && promoCodeData && (
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={
                            promoCodeData.discountAmount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {promoCodeData.discountAmount > 0
                            ? `Discount (${promoCodeData.code}):`
                            : `Discount (${promoCodeData.code}):`}
                        </span>
                        <span
                          className={
                            promoCodeData.discountAmount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {promoCodeData.discountAmount > 0
                            ? `-₹${promoCodeData.discountAmount.toLocaleString()}`
                            : `Not applicable on this pricing`}
                        </span>
                      </div>
                    )}

                    <hr className="my-2" />

                    {/* Final Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p
                          className={`text-lg font-bold ${
                            promoCodeApplied &&
                            promoCodeData?.discountAmount > 0
                              ? "text-green-600"
                              : "text-[#000080]"
                          }`}
                        >
                          {isPricingLoading ? (
                            <span className="text-gray-400">Loading...</span>
                          ) : calculateTotalPrice() > 0 ? (
                            `₹${calculateTotalPrice().toLocaleString()}`
                          ) : (
                            <span className="text-gray-400">
                              Price not available
                            </span>
                          )}
                        </p>
                      </div>
                      {promoCodeApplied &&
                        promoCodeData?.discountAmount > 0 && (
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Promo Applied
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={closeBuyCredits}
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBuyCreditsContinue}
                  disabled={
                    purchaseLoading ||
                    !buyServiceType ||
                    !buyDuration ||
                    !buyCreditsCount ||
                    ![1, 3, 5].includes(buyCreditsCount) ||
                    isPricingLoading
                  }
                  className="bg-[#ec5228] hover:bg-[#d14a22] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchaseLoading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Psychologist Selection Modal */}
      {showPsychologistSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToContactForm}
                    className="text-gray-500 hover:text-[#ec5228] p-2 flex items-center gap-1"
                    title="Back to contact form"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">Back</span>
                  </Button>
                  <div>
                    <h3 className="text-xl font-bold text-[#000080]">
                      Select Your {formatServiceType(selectedServiceType)}{" "}
                      Specialist
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Duration: {selectedDuration} minutes
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleCloseBooking}
                  className="text-gray-500 hover:text-red-500"
                >
                  <span className="sr-only">Close</span>✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <BhAssociateSelectionSection
                doctors={
                  selectedServiceType === "mental_health"
                    ? psychologistsData?.psychologists || []
                    : cosmetologistsData?.cosmetologists || []
                }
                isLoading={
                  selectedServiceType === "mental_health"
                    ? psychologistsLoading
                    : cosmetologistsLoading
                }
                onBookSession={handlePsychologistSelect}
                showBooking={false}
                selectedDoc={null}
                serviceType={
                  selectedServiceType === "mental_health"
                    ? "psychologist"
                    : "cosmetologist"
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Booking Calendar Modal */}
      {showBookingSystem && selectedPsychologist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToPsychologistSelection}
                    className="text-gray-500 hover:text-[#ec5228] p-2 flex items-center gap-1"
                    title="Back to specialist selection"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">Back</span>
                  </Button>
                  <div>
                    <h3 className="text-xl font-bold text-[#000080]">
                      Book Session with {selectedPsychologist.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {formatServiceType(selectedServiceType)} •{" "}
                      {selectedDuration} minutes
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleCloseBooking}
                  className="text-gray-500 hover:text-red-500"
                >
                  <span className="sr-only">Close</span>✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <BookingSection
                psychologistId={selectedPsychologist._id}
                onSelectDateTime={handleDateTimeSelect}
                onClose={handleCloseBooking}
                selectedDuration={selectedDuration}
              />
            </div>
          </div>
        </div>
      )}

      {/* Name Popup Modal */}
      {showNamePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-[#fffae3] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-[#ec5228]" />
                </div>
                <h3 className="text-xl font-bold text-[#000080] mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Please enter your name and email to personalize your
                  experience
                </p>
              </div>

              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    htmlFor="userEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec5228] focus:border-[#ec5228] outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#ec5228] hover:bg-[#d14a22] text-white font-medium py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Meeting
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this meeting? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteMeeting}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMeeting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questionnaire Modal */}
      {showQuestionnaireModal && selectedMeetingQuestionnaire && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#000080] flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Questionnaire Response
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Session on{" "}
                    {formatDate(selectedMeetingQuestionnaire.meetingDate)} at{" "}
                    {selectedMeetingQuestionnaire.meetingTime}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowQuestionnaireModal(false);
                    setSelectedMeetingQuestionnaire(null);
                    setQuestionnaireDataForViewing(null);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <span className="sr-only">Close</span>✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              {(() => {
                const responses =
                  selectedMeetingQuestionnaire.questionnaireResponses;
                console.log("Rendering questionnaire responses:", responses);

                // Handle both Map and Object structures, excluding personalDetails
                let responseEntries = [];
                if (responses) {
                  if (responses instanceof Map) {
                    responseEntries = Array.from(responses.entries()).filter(
                      ([key]) => key !== "personalDetails"
                    );
                  } else if (typeof responses === "object") {
                    responseEntries = Object.entries(responses).filter(
                      ([key]) => key !== "personalDetails"
                    );
                  }
                }

                console.log("Filtered response entries:", responseEntries);

                return responseEntries.length > 0 ? (
                  <div className="space-y-4">
                    {responseEntries.map(([questionId, answer], index) => {
                      // Skip if answer is an object (like personalDetails)
                      if (typeof answer === "object" && answer !== null) {
                        return null;
                      }

                      const questionText = getQuestionText(
                        questionId,
                        selectedMeetingQuestionnaire.serviceType,
                        questionnaireDataForViewing
                      );

                      return (
                        <div
                          key={questionId || index}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="text-sm font-medium text-[#000080] mb-2">
                            {questionText}
                          </div>
                          <div className="text-gray-700 pl-2 border-l-3 border-[#ec5228]">
                            {Array.isArray(answer)
                              ? answer.join(", ")
                              : String(answer)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No questionnaire responses available for this session.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
