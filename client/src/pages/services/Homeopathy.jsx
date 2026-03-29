import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import BookingSection from "@/components/booking/BookingSection";
import PaymentGateway from "@/components/booking/PaymentGateway";
import { useGetHomeopathsQuery } from "@/features/api/bhAssociateApi";
import { useLazyGetPricingQuery } from "@/features/api/pricingApi";
import { useCalculateAllPlansDiscountsMutation } from "@/features/api/couponApi";
import { useGetMeetingsQuery } from "@/features/api/meetingsApi";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useLoadUserQuery,
  useSetDefaultAddressMutation,
  useSendOTPMutation,
  useUpdateAddressMutation,
  useVerifyOTPMutation,
} from "@/features/api/authApi";
import { useNavigate } from "react-router-dom";

const consultationOptions = [
  {
    id: "consultation",
    title: "Consultation",
    description: "First-time detailed homeopathy consultation",
    duration: 50,
  },
  {
    id: "reconsultation",
    title: "Reconsultation",
    description: "Follow-up consultation for ongoing treatment",
    duration: 50,
  },
];

const stepsData = [
  {
    title: "Choose Type",
    heading: "Choose Consultation Type",
    type: "type",
  },
  {
    title: "Book Slot",
    heading: "Book Your Time Slot",
    type: "booking",
  },
  {
    title: "Your Details",
    heading: "Share Your Details",
    type: "details",
  },
  {
    title: "Payment",
    heading: "Complete Payment",
    type: "payment",
  },
  {
    title: "Confirmed",
    heading: "Booking Confirmed",
    type: "confirmation",
  },
];

const homeopathyFocusAreas = [
  "Chronic Allergic Disorders",
  "Skin & Dermatological Disease",
  "Hormonal & PCOD Management",
  "Digestive & Gut Health",
  "Hair & Scalp Health",
  "Migraine & Chronic Headaches",
  "Diabetes",
  "PCOS & Menstrual Disorders",
  "Autoimmune Condition Support",
  "Thyroid & Metabolic Health",
  "ADHD & Autism",
];

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const initialAddressForm = {
  country: "India",
  fullName: "",
  mobileNumber: "",
  pincode: "",
  flatHouseBuilding: "",
  areaStreetSectorVillage: "",
  landmark: "",
  city: "",
  state: "",
  isDefault: false,
};

const normalizeName = (name = "") =>
  name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

const normalizeIndianMobile = (value = "") => {
  let digits = value.replace(/\D/g, "");

  if (digits.length > 10 && digits.startsWith("0")) {
    digits = digits.replace(/^0+/, "");
  }

  if (digits.length > 10) {
    digits = digits.slice(-10);
  }

  return digits;
};

const isDrAgrimaYadav = (name = "") => {
  const normalized = normalizeName(name);
  return normalized.includes("agrima") && normalized.includes("yadav");
};

export default function Homeopathy() {
  const navigate = useNavigate();
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    whatsapp: "",
    city: "",
    concerns: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [plansWithDiscounts, setPlansWithDiscounts] = useState([]);
  const [isCouponVisible, setIsCouponVisible] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState("");
  const [addressForm, setAddressForm] = useState(initialAddressForm);
  const [addressErrors, setAddressErrors] = useState({});

  const { data: homeopathsData } = useGetHomeopathsQuery();
  const { data: userData } = useLoadUserQuery();
  const { data: addressesData } = useGetAddressesQuery();
  const { data: meetingsData } = useGetMeetingsQuery();
  const [getPricing, { data: pricingData }] = useLazyGetPricingQuery();
  const [calculateAllPlansDiscounts] = useCalculateAllPlansDiscountsMutation();
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeletingAddress }] =
    useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefaultAddress }] =
    useSetDefaultAddressMutation();

  useEffect(() => {
    getPricing({ serviceType: "homeopathy" });
  }, [getPricing]);

  useEffect(() => {
    if (userData?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || userData.user.name || "",
        whatsapp: prev.whatsapp || userData.user.phoneNumber || "",
      }));

      if (userData.user.phoneNumber) {
        setIsVerified(true);
        setOtpSent(false);
        setOtp("");
      }
    }
  }, [userData]);

  const latestHomeopathyConsultation = useMemo(() => {
    const meetings = meetingsData?.meetings || [];

    const consultationMeetings = meetings.filter((meeting) => {
      if (meeting?.serviceType !== "homeopathy") return false;

      const consultationType =
        meeting?.questionnaireResponses?.consultationType || "";

      return consultationType.toLowerCase() === "consultation";
    });

    if (!consultationMeetings.length) return null;

    const sortedByLatest = [...consultationMeetings].sort((first, second) => {
      const firstDateTime = new Date(
        `${first.meetingDate || ""}T${first.meetingTime || "00:00"}`,
      );
      const secondDateTime = new Date(
        `${second.meetingDate || ""}T${second.meetingTime || "00:00"}`,
      );

      return secondDateTime - firstDateTime;
    });

    const latest = sortedByLatest[0];
    const responses = latest?.questionnaireResponses || {};
    const personalDetails = responses.personalDetails || {};

    return {
      fullName: personalDetails.fullName || "",
      whatsapp: personalDetails.phoneNumber || "",
      city: personalDetails.city || "",
      concerns: responses.healthConcerns || personalDetails.concerns || "",
    };
  }, [meetingsData]);

  useEffect(() => {
    if (selectedType !== "reconsultation") return;

    if (!latestHomeopathyConsultation) {
      setFormData((prev) => ({
        ...prev,
        city: "",
        concerns: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fullName:
        latestHomeopathyConsultation.fullName ||
        prev.fullName ||
        userData?.user?.name ||
        "",
      whatsapp:
        latestHomeopathyConsultation.whatsapp ||
        prev.whatsapp ||
        userData?.user?.phoneNumber ||
        "",
      city: latestHomeopathyConsultation.city || "",
      concerns: latestHomeopathyConsultation.concerns || "",
    }));
  }, [selectedType, latestHomeopathyConsultation, userData]);

  useEffect(() => {
    let interval;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const doctorFromApi = useMemo(() => {
    const homeopaths = homeopathsData?.homeopaths || [];

    return (
      homeopaths.find((doctor) => isDrAgrimaYadav(doctor.name)) ||
      homeopaths[0] ||
      null
    );
  }, [homeopathsData]);

  const doctor = useMemo(() => {
    return (
      doctorFromApi || {
        _id: "",
        name: "Dr. Agrima Yadav",
        designation: "BHMS - Homeopathy Specialist",
        photoUrl:
          "https://res.cloudinary.com/dv0slncwp/image/upload/v1774785264/pqufdt276gnnm12vyhpa.jpg",
        bio: "Holistic care focused on long-term wellness and root-cause treatment.",
        experience: "5",
      }
    );
  }, [doctorFromApi]);

  const savedAddresses = useMemo(() => {
    const addresses =
      addressesData?.addresses || userData?.user?.addresses || [];

    return [...addresses].sort(
      (firstAddress, secondAddress) =>
        Number(Boolean(secondAddress?.isDefault)) -
        Number(Boolean(firstAddress?.isDefault)),
    );
  }, [addressesData, userData]);

  const selectedAddress = useMemo(() => {
    if (!savedAddresses.length) return null;

    return (
      savedAddresses.find(
        (address) => String(address._id) === selectedAddressId,
      ) ||
      savedAddresses.find((address) => address.isDefault) ||
      savedAddresses[0]
    );
  }, [savedAddresses, selectedAddressId]);

  const doctorSpecializations = useMemo(() => {
    const backendSpecializations =
      doctor?.expertise || doctor?.specializations || doctor?.specialization;

    if (Array.isArray(backendSpecializations)) {
      const cleaned = backendSpecializations
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);

      if (cleaned.length) return cleaned;
    }

    if (typeof backendSpecializations === "string") {
      const parsed = backendSpecializations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (parsed.length) return parsed;
    }

    return homeopathyFocusAreas;
  }, [doctor]);

  const selectedOptionData =
    consultationOptions.find((option) => option.id === selectedType) ||
    consultationOptions[0];

  const homeopathyPlans = useMemo(() => {
    const plans = [];
    if (pricingData?.pricing) {
      pricingData.pricing.forEach((item) => {
        if (item.serviceType === "homeopathy" && item.plans) {
          plans.push(...item.plans);
        }
      });
    }
    return plans;
  }, [pricingData]);

  const optionPlans = useMemo(() => {
    const consultationByName = homeopathyPlans.find((plan) => {
      const planName = (plan.name || "").toLowerCase();
      return (
        planName.includes("consult") &&
        !planName.includes("reconsult") &&
        !planName.includes("follow")
      );
    });

    const reconsultationByName = homeopathyPlans.find((plan) => {
      const planName = (plan.name || "").toLowerCase();
      return planName.includes("reconsult") || planName.includes("follow");
    });

    return {
      consultation: consultationByName || homeopathyPlans[0] || null,
      reconsultation:
        reconsultationByName ||
        homeopathyPlans[1] ||
        homeopathyPlans[0] ||
        null,
    };
  }, [homeopathyPlans]);

  const selectedPlanData = selectedType ? optionPlans[selectedType] : null;

  const recentMeetingIsHomeopathy = useMemo(() => {
    const meetings = Array.isArray(meetingsData?.meetings)
      ? meetingsData.meetings
      : null;

    if (!meetings || !meetings.length) return false;

    const parseMeetingDateTime = (meeting) => {
      const datePart = meeting?.meetingDate
        ? new Date(meeting.meetingDate)
        : null;

      if (datePart && !Number.isNaN(datePart.getTime())) {
        const dateTime = new Date(datePart);

        if (
          typeof meeting?.meetingTime === "string" &&
          meeting.meetingTime.includes(":")
        ) {
          const [hours, minutes] = meeting.meetingTime.split(":").map(Number);
          if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
            dateTime.setHours(hours, minutes, 0, 0);
          }
        }

        return dateTime;
      }

      const createdAt = meeting?.createdAt ? new Date(meeting.createdAt) : null;
      return createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt
        : new Date(0);
    };

    const latestMeeting = [...meetings].sort(
      (first, second) =>
        parseMeetingDateTime(second).getTime() -
        parseMeetingDateTime(first).getTime(),
    )[0];

    return latestMeeting?.serviceType === "homeopathy";
  }, [meetingsData]);

  useEffect(() => {
    if (selectedType) return;
    if (!Array.isArray(meetingsData?.meetings)) return;

    setSelectedType(
      recentMeetingIsHomeopathy ? "reconsultation" : "consultation",
    );
  }, [selectedType, recentMeetingIsHomeopathy, meetingsData]);

  const handleStepChange = (nextStep) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    if (!savedAddresses.length) {
      setSelectedAddressId("");
      return;
    }

    const currentExists = savedAddresses.some(
      (address) => String(address._id) === selectedAddressId,
    );

    if (currentExists) return;

    const fallback =
      savedAddresses.find((address) => address.isDefault) || savedAddresses[0];

    if (fallback?._id) {
      setSelectedAddressId(String(fallback._id));
    }
  }, [savedAddresses, selectedAddressId]);

  useEffect(() => {
    if (!selectedAddress?.city) return;
    setFormData((prev) => ({ ...prev, city: selectedAddress.city }));
  }, [selectedAddress]);

  const handleAddressInputChange = (field, value) => {
    let nextValue = value;

    if (field === "mobileNumber") {
      nextValue = normalizeIndianMobile(value);
    }

    if (field === "pincode") {
      nextValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setAddressForm((prev) => ({ ...prev, [field]: nextValue }));
    setAddressErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const resetAddressForm = () => {
    setAddressForm(initialAddressForm);
    setAddressErrors({});
    setEditingAddressId("");
    setIsAddressFormOpen(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId("");
    setAddressErrors({});
    setAddressForm({
      ...initialAddressForm,
      fullName: formData.fullName || "",
    });
    setIsAddressFormOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(String(address._id));
    setAddressErrors({});
    setAddressForm({
      country: address.country || "India",
      fullName: address.fullName || "",
      mobileNumber: address.mobileNumber || "",
      pincode: address.pincode || "",
      flatHouseBuilding: address.flatHouseBuilding || "",
      areaStreetSectorVillage: address.areaStreetSectorVillage || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      isDefault: Boolean(address.isDefault),
    });
    setIsAddressFormOpen(true);
  };

  const validateAddressForm = () => {
    const nextErrors = {};

    if (!addressForm.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }
    if (!/^[0-9]{10}$/.test(addressForm.mobileNumber)) {
      nextErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!/^[0-9]{6}$/.test(addressForm.pincode)) {
      nextErrors.pincode = "Please enter a valid 6-digit PIN code";
    }
    if (!addressForm.flatHouseBuilding.trim()) {
      nextErrors.flatHouseBuilding =
        "Please enter Flat, House no., Building, Company, Apartment";
    }
    if (!addressForm.city.trim()) {
      nextErrors.city = "Please enter Town/City";
    }
    if (!addressForm.state.trim()) {
      nextErrors.state = "Please choose a state";
    }

    setAddressErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    const isValid = validateAddressForm();
    if (!isValid) {
      toast.error("Please fix the highlighted address fields");
      return;
    }

    const payload = {
      ...addressForm,
      fullName: addressForm.fullName.trim(),
      flatHouseBuilding: addressForm.flatHouseBuilding.trim(),
      areaStreetSectorVillage: addressForm.areaStreetSectorVillage.trim(),
      landmark: addressForm.landmark.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      country: "India",
    };

    try {
      if (editingAddressId) {
        await updateAddress({
          addressId: editingAddressId,
          ...payload,
        }).unwrap();
        toast.success("Address updated successfully");
      } else {
        await addAddress(payload).unwrap();
        toast.success("Address saved successfully");
      }
      resetAddressForm();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId).unwrap();
      toast.success("Address removed successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove address");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(addressId).unwrap();
      toast.success("Default address updated");
      setSelectedAddressId(String(addressId));
    } catch (error) {
      toast.error(error?.data?.message || "Failed to set default address");
    }
  };

  const getPlanDiscount = (plan) => {
    if (!plan || !plansWithDiscounts?.length) return null;
    return plansWithDiscounts.find(
      (planDiscount) =>
        planDiscount.sessions === plan.sessions &&
        planDiscount.duration === plan.duration,
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (!homeopathyPlans.length) {
      setCouponError("Pricing is not available yet for Homeopathy");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const result = await calculateAllPlansDiscounts({
        code: couponCode.trim(),
        serviceType: "homeopathy",
        plans: homeopathyPlans,
        ...(userData?.user?._id && { userId: userData.user._id }),
      }).unwrap();

      setAppliedCoupon(result.coupon);
      setPlansWithDiscounts(result.plansWithDiscounts || []);
      setCouponCode("");
      setCouponError("");
      toast.success("Coupon applied successfully!");
    } catch (error) {
      setAppliedCoupon(null);
      setPlansWithDiscounts([]);
      setCouponError(error.data?.message || "Invalid coupon code");
      toast.error(error.data?.message || "Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setPlansWithDiscounts([]);
    setCouponCode("");
    setCouponError("");
  };

  const handleSelectDateTime = (date, time) => {
    if (!doctor?._id) {
      toast.error(
        "Doctor schedule is not available yet. Please try again later.",
      );
      return;
    }

    const details = {
      homeopathyDoctor: doctor,
      psychologist: doctor,
      cosmetologist: doctor,
      date,
      time,
      consultationType: selectedType,
    };

    setBookingDetails(details);
    handleStepChange(2);
  };

  const handleFormSubmit = () => {
    if (
      !formData.fullName ||
      !formData.whatsapp ||
      formData.whatsapp.length !== 10
    ) {
      toast.error("Please fill name and valid 10-digit WhatsApp number");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify your WhatsApp number to continue");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please add and select a saved address to continue");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      whatsapp: formData.whatsapp,
      city: selectedAddress?.city || formData.city,
      concerns: formData.concerns,
      address: selectedAddress,
      questionnaireResponses: {
        consultationType: selectedType,
        healthConcerns: formData.concerns || "",
        address: selectedAddress,
      },
    };

    setSubmittedFormData(payload);
    handleStepChange(3);
  };

  const handleWhatsappChange = (value) => {
    const sanitizedValue = normalizeIndianMobile(value);

    if (
      userData?.user?.phoneNumber &&
      isVerified &&
      sanitizedValue !== userData.user.phoneNumber
    ) {
      toast.info(
        "Phone number is verified from your account and cannot be changed",
      );
      return;
    }

    setFormData((prev) => ({ ...prev, whatsapp: sanitizedValue }));

    if (isVerified && !userData?.user?.phoneNumber) {
      setIsVerified(false);
      setOtpSent(false);
      setOtp("");
      setResendCountdown(0);
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
      setResendCountdown(60);
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
      await verifyOTP({
        phoneNumber: formData.whatsapp,
        otp,
      }).unwrap();

      setIsVerified(true);
      setOtpSent(false);
      setOtp("");
      setResendCountdown(0);
      toast.success("Phone number verified successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.whatsapp &&
    formData.whatsapp.length === 10 &&
    isVerified &&
    !!selectedAddress;

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`bg-white ${showBookingFlow ? "" : "min-h-screen"}`}>
      {!showBookingFlow && (
        <section className="relative min-h-screen flex items-center bg-[#fffae3] overflow-hidden">
          <div className="container mx-auto px-6 py-20 md:py-28">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#000080] leading-tight mb-6">
                  Homeopathy <br />
                  <span className="text-[#ec5228]">Consultation</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                  Experience personalized homeopathic consultations with our
                  expert Dr. Agrima Yadav. Get professional guidance with
                  best-in-class homeopathic medicine for achieving better health
                  and vitality.
                </p>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setShowBookingFlow(true);
                    window.scrollTo({ top: 0, behavior: "auto" });
                  }}
                  className="px-12 py-4 bg-[#ec5228] text-white font-semibold text-lg rounded-2xl hover:bg-[#d94720] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Book Consultation
                </button>
              </div>
              <div className="flex-1">
                <div className="w-full max-w-xl mx-auto rounded-3xl shadow-2xl border border-[#000080]/10 overflow-hidden bg-gradient-to-br from-white to-[#fffae3]">
                  <div className="h-2 bg-gradient-to-r from-[#000080] to-[#ec5228]"></div>
                  <div className="p-6 md:p-8">
                    <div className="overflow-hidden">
                      <div
                        className={`flex flex-col items-center text-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isProfileExpanded
                            ? "max-h-0 opacity-0 -translate-y-4 scale-95 pointer-events-none"
                            : "max-h-[420px] opacity-100 translate-y-0 scale-100"
                        }`}
                      >
                        <img
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          className="w-40 h-40 md:w-48 md:h-48 rounded-3xl object-cover border-4 border-white shadow-xl"
                        />
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-[#000080] leading-tight tracking-tight">
                            {doctor.name}
                          </h3>
                          <p className="text-[#ec5228] font-semibold mt-1 text-base md:text-lg">
                            {doctor.designation || "Homeopathy Consultant"}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#000080]/20 text-[#000080]">
                              Classical Homeopathy
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#ec5228]/30 text-[#ec5228]">
                              Holistic Treatment
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsProfileExpanded(true)}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#000080]/20 text-[#000080] hover:border-[#ec5228]/40 hover:text-[#ec5228] transition-colors"
                            >
                              {doctorSpecializations.length}+ Specializations
                            </button>
                            {doctor.experience && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#ec5228]/30 text-[#ec5228]">
                                {doctor.experience}+ Years of Experience
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isProfileExpanded
                            ? "max-h-[460px] opacity-100 translate-y-0 scale-100 mt-1"
                            : "max-h-0 opacity-0 translate-y-6 scale-[0.98] pointer-events-none mt-0"
                        }`}
                      >
                        <div className="border border-[#000080]/15 text-left bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl max-h-[420px] overflow-y-auto">
                          <div
                            className={`transition-all duration-300 ${
                              isProfileExpanded
                                ? "opacity-100 translate-y-0 delay-150"
                                : "opacity-0 translate-y-2 delay-0"
                            }`}
                          >
                            <p className="text-base font-semibold text-[#000080] mb-2">
                              About Doctor
                            </p>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                              {doctor.bio ||
                                "Holistic care focused on long-term wellness and root-cause treatment."}
                            </p>

                            <div className="mt-2 border-t border-[grey]/60 pt-2">
                              <p className="text-base font-semibold text-[#000080] mb-3">
                                Specializations
                              </p>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                {doctorSpecializations.map((area) => (
                                  <li
                                    key={area}
                                    className="flex items-start gap-2 leading-snug bg-[#fffae3] border border-[#000080]/10 rounded-lg px-3 py-2"
                                  >
                                    <span className="text-[#ec5228] mt-0.5 font-bold">
                                      ✓
                                    </span>
                                    <span>{area}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setIsProfileExpanded((prev) => !prev)}
                        aria-expanded={isProfileExpanded}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#000080] hover:text-[#ec5228] transition-colors bg-white/90 border border-[#000080]/10 rounded-full px-4 py-2"
                      >
                        <span>
                          {isProfileExpanded ? "Hide profile" : "View profile"}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isProfileExpanded ? "rotate-0" : "rotate-180"
                          }`}
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {showBookingFlow && (
        <>
          <section
            id="homeopathy-steps"
            className="py-12 bg-white border-b border-gray-100"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="relative">
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
                <div
                  className="absolute top-4 left-0 h-1 bg-[#000080] -translate-y-1/2 transition-all duration-500"
                  style={{
                    width: `${(currentStep / (stepsData.length - 1)) * 100}%`,
                  }}
                ></div>
                <div className="relative flex justify-between">
                  {stepsData.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    return (
                      <div
                        key={step.type}
                        className="flex flex-col items-center text-center z-10 bg-white px-1"
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-sm mb-2 transition-all duration-500 ${
                            isActive || isCompleted
                              ? "bg-[#000080] border-[#000080] text-white"
                              : "bg-white border-[#000080] text-[#000080]"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <p
                          className={`font-semibold text-xs max-w-[90px] leading-tight ${
                            isActive || isCompleted
                              ? "text-[#000080]"
                              : "text-gray-500"
                          }`}
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

          <section className="py-8 md:py-12 bg-[#fffcf2]">
            <div className="container mx-auto px-6">
              {currentStep > 0 && currentStep < 4 && (
                <button
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="mb-8 flex items-center text-[#000080] hover:text-[#ec5228] transition-colors"
                >
                  <span className="mr-2">←</span> Go Back
                </button>
              )}

              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#000080]">
                  {stepsData[currentStep].heading}
                </h2>
              </div>

              {currentStep === 0 && (
                <div className="max-w-5xl mx-auto space-y-8">
                  <div
                    className={`mx-auto mt-4 mb-4 transition-all duration-300 ${
                      appliedCoupon || isCouponVisible
                        ? "max-w-md"
                        : "max-w-[220px]"
                    }`}
                  >
                    {appliedCoupon ? (
                      <div className="bg-[#fffae3] border border-green-300 text-green-900 rounded-lg shadow-sm p-4 w-full">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
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
                            <div>
                              <p className="text-sm font-semibold">
                                Coupon Applied: {appliedCoupon.code}
                              </p>
                              <p className="text-sm text-green-700 mt-1">
                                Discounts applied to available Homeopathy plans
                              </p>
                            </div>
                          </div>
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
                            isCouponVisible
                              ? "p-4 justify-between"
                              : "p-2 justify-center"
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
                                  <p className="text-red-500 text-sm mt-1">
                                    {couponError}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon}
                                className="px-6 py-2 bg-[#000080] text-white rounded-lg hover:bg-[#000080]/90 transition-colors disabled:opacity-50"
                              >
                                {isApplyingCoupon ? "Applying..." : "Apply"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {consultationOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedType(option.id)}
                        className={`text-left bg-white rounded-2xl border-2 p-7 transition-all shadow-sm ${
                          selectedType === option.id
                            ? "border-[#ec5228] ring-4 ring-[#ec5228]/10"
                            : "border-gray-200 hover:border-[#000080]/40"
                        }`}
                      >
                        <h3 className="text-xl font-bold text-[#000080] mb-2">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {option.description}
                        </p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#fffae3] text-[#000080] mb-3">
                          50 minutes
                        </span>
                        {selectedType === option.id && (
                          <p className="text-sm font-semibold text-[#ec5228]">
                            Selected
                          </p>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="w-full rounded-2xl p-[1.5px] bg-gradient-to-r from-[#000080]/25 via-[#ec5228]/25 to-[#000080]/25 shadow-md">
                    <div className="rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-6">
                      {!selectedType || !selectedPlanData ? (
                        <p className="text-sm text-gray-500 text-center">
                          Select Consultation Type to view price
                        </p>
                      ) : (
                        (() => {
                          const planDiscount =
                            getPlanDiscount(selectedPlanData);
                          const finalPrice =
                            planDiscount?.discountApplied &&
                            planDiscount?.finalPrice >= 0
                              ? planDiscount.finalPrice
                              : selectedPlanData.sellingPrice;
                          const mrp =
                            typeof selectedPlanData.mrp === "number"
                              ? selectedPlanData.mrp
                              : selectedPlanData.sellingPrice;
                          const savingsFromMrp = Math.max(0, mrp - finalPrice);

                          return (
                            <div className="text-center">
                              <p className="text-xs font-semibold uppercase tracking-wide text-[#000080]/70 mb-2">
                                Final Price
                              </p>
                              {mrp > finalPrice && (
                                <p className="text-sm text-gray-500 line-through mb-1">
                                  ₹{mrp.toLocaleString("en-IN")}
                                </p>
                              )}
                              <p className="text-4xl font-extrabold text-[#ec5228] leading-none">
                                ₹{finalPrice.toLocaleString("en-IN")}
                              </p>
                              {savingsFromMrp > 0 && (
                                <p className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
                                  You save ₹
                                  {savingsFromMrp.toLocaleString("en-IN")}
                                </p>
                              )}
                              <p className="mt-3 text-xs text-gray-600">
                                The pricing includes both consultation and
                                medication costs
                              </p>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center mt-4 pt-2">
                    <button
                      onClick={() => {
                        handleStepChange(1);
                      }}
                      disabled={!selectedType || !selectedPlanData}
                      className={`px-10 py-4 font-semibold text-lg rounded-xl transition-all ${
                        selectedType && selectedPlanData
                          ? "bg-[#ec5228] text-white hover:bg-[#d94720]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setShowBookingFlow(false);
                          window.scrollTo({ top: 0, behavior: "auto" });
                        }}
                        className="text-sm text-[#000080] hover:text-[#ec5228] underline"
                      >
                        Back to Homeopathy overview
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-8 border border-gray-100 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <p className="text-gray-700 font-medium">
                        Booking with{" "}
                        <span className="text-[#000080] font-bold">
                          {doctor.name}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <span className="px-3 py-1 rounded-full bg-[#000080] text-white text-sm font-medium">
                          {selectedOptionData.title}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#ec5228] text-white text-sm font-medium">
                          50 min
                        </span>
                      </div>
                    </div>
                  </div>

                  {!doctor._id ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
                      <p className="text-red-600 font-medium">
                        Dr. Agrima Yadav profile or available slots are not
                        published yet.
                      </p>
                      <p className="text-gray-600 mt-2">
                        Once doctor will add their schedule, booking will be
                        enabled automatically.
                      </p>
                    </div>
                  ) : !doctor.nextAvailableSlot ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-amber-200">
                      <p className="text-amber-700 font-medium">
                        Dr. Agrima hasn&apos;t set their schedule yet.
                      </p>
                      <p className="text-gray-600 mt-2">
                        Once doctor will add their schedule, booking will be
                        enabled automatically.
                      </p>
                    </div>
                  ) : (
                    <BookingSection
                      psychologistId={doctor._id}
                      onSelectDateTime={handleSelectDateTime}
                      onClose={() => {}}
                      selectedDuration={50}
                    />
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="booking-full-name"
                        name="bookingFullName"
                        autoComplete="section-booking name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] outline-none"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="booking-city"
                        name="bookingCity"
                        autoComplete="section-booking address-level2"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] outline-none"
                        placeholder="City"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        WhatsApp Number *
                      </label>
                      <div className="space-y-3 max-w-xl">
                        <input
                          type="tel"
                          id="booking-whatsapp"
                          name="bookingWhatsapp"
                          autoComplete="section-booking tel-national"
                          inputMode="numeric"
                          value={formData.whatsapp}
                          onChange={(e) => handleWhatsappChange(e.target.value)}
                          disabled={isVerified}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                            isVerified
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080]"
                          }`}
                          placeholder="10-digit mobile number"
                        />
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
                            className="w-full px-5 py-3 bg-[#000080] text-white rounded-xl font-semibold hover:bg-[#000080]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                        {otpSent && !isVerified && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              id="booking-otp"
                              name="bookingOtp"
                              autoComplete="one-time-code"
                              inputMode="numeric"
                              value={otp}
                              onChange={(e) =>
                                setOtp(
                                  e.target.value.replace(/\D/g, "").slice(0, 6),
                                )
                              }
                              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#ec5228]/10 focus:border-[#ec5228] transition-all outline-none"
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOTP}
                              disabled={
                                !otp || otp.length !== 6 || verifyLoading
                              }
                              className="w-full px-5 py-3 bg-[#ec5228] text-white rounded-xl font-semibold hover:bg-[#d94720] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {verifyLoading ? "Verifying..." : "Verify"}
                            </button>
                          </div>
                        )}

                        {isVerified && (
                          <p className="text-sm text-green-600 font-medium">
                            ✅
                            {userData?.user?.phoneNumber &&
                            userData.user.phoneNumber === formData.whatsapp
                              ? " Phone number verified from your account"
                              : " Phone number verified successfully"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Health Concerns
                      </label>
                      <textarea
                        rows={4}
                        value={formData.concerns}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            concerns: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] outline-none resize-none"
                        placeholder="Share your main concerns"
                      />
                    </div>

                    <div className="md:col-span-2 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Saved Addresses *
                        </label>
                        <button
                          type="button"
                          onClick={handleOpenAddAddress}
                          className="text-sm font-semibold text-[#000080] hover:text-[#ec5228]"
                        >
                          + Add Address
                        </button>
                      </div>

                      {savedAddresses.length > 0 ? (
                        <div className="space-y-3">
                          {savedAddresses.map((address) => {
                            const isSelected =
                              String(address._id) === String(selectedAddressId);

                            return (
                              <div
                                key={address._id}
                                className={`rounded-xl border p-4 transition-all ${
                                  isSelected
                                    ? "border-[#ec5228] bg-[#fffae3]"
                                    : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedAddressId(String(address._id))
                                    }
                                    className="text-left flex-1"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-semibold text-[#000080]">
                                        {address.fullName}
                                      </p>
                                      {address.isDefault && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#000080] text-white">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-snug">
                                      {address.flatHouseBuilding},{" "}
                                      {address.areaStreetSectorVillage}
                                      {address.landmark
                                        ? `, near ${address.landmark}`
                                        : ""}
                                      , {address.city}, {address.state} -{" "}
                                      {address.pincode}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {address.mobileNumber}
                                    </p>
                                    {isSelected && (
                                      <p className="text-xs text-[#000080] mt-2 font-medium">
                                        Medicine will be delivered to this
                                        selected address.
                                      </p>
                                    )}
                                  </button>

                                  <div className="flex items-center gap-3 text-xs font-semibold">
                                    {!address.isDefault && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSetDefaultAddress(address._id)
                                        }
                                        disabled={isSettingDefaultAddress}
                                        className="text-[#000080] hover:text-[#ec5228] disabled:opacity-50"
                                      >
                                        Set Default
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleEditAddress(address)}
                                      className="text-[#000080] hover:text-[#ec5228]"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteAddress(address._id)
                                      }
                                      disabled={isDeletingAddress}
                                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600 bg-gray-50">
                          You haven’t added an address yet. Add one to receive
                          your medicines.
                        </div>
                      )}

                      {isAddressFormOpen && (
                        <div className="mt-4 rounded-2xl border border-[#000080]/15 bg-white p-4 md:p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-semibold text-[#000080]">
                              {editingAddressId
                                ? "Edit Address"
                                : "Add New Address"}
                            </h4>
                            <button
                              type="button"
                              onClick={resetAddressForm}
                              className="text-sm text-gray-500 hover:text-[#ec5228]"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country/Region
                              </label>
                              <input
                                type="text"
                                id="address-country"
                                name="country"
                                autoComplete="section-address country-name"
                                value="India"
                                disabled
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full name (First and Last name)
                                <span className="text-red-500"> *</span>
                              </label>
                              <input
                                type="text"
                                id="address-full-name"
                                name="fullName"
                                autoComplete="section-address name"
                                value={addressForm.fullName}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "fullName",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-4 ${
                                  addressErrors.fullName
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-200 focus:ring-[#000080]/10 focus:border-[#000080]"
                                }`}
                              />
                              {addressErrors.fullName && (
                                <p className="text-xs text-red-600 mt-1">
                                  {addressErrors.fullName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile number
                                <span className="text-red-500"> *</span>
                              </label>
                              <input
                                type="tel"
                                id="address-mobile"
                                name="mobileNumber"
                                autoComplete="section-address tel-national"
                                inputMode="numeric"
                                value={addressForm.mobileNumber}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "mobileNumber",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-4 ${
                                  addressErrors.mobileNumber
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-200 focus:ring-[#000080]/10 focus:border-[#000080]"
                                }`}
                                placeholder="May be used to assist delivery"
                              />
                              {addressErrors.mobileNumber && (
                                <p className="text-xs text-red-600 mt-1">
                                  {addressErrors.mobileNumber}
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Flat, House no., Building, Company, Apartment
                                <span className="text-red-500"> *</span>
                              </label>
                              <input
                                type="text"
                                id="address-line1"
                                name="flatHouseBuilding"
                                autoComplete="section-address address-line1"
                                value={addressForm.flatHouseBuilding}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "flatHouseBuilding",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-4 ${
                                  addressErrors.flatHouseBuilding
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-200 focus:ring-[#000080]/10 focus:border-[#000080]"
                                }`}
                              />
                              {addressErrors.flatHouseBuilding && (
                                <p className="text-xs text-red-600 mt-1">
                                  {addressErrors.flatHouseBuilding}
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Area, Street, Sector, Village
                                <span className="text-gray-500 text-xs ml-1">
                                  (Optional)
                                </span>
                              </label>
                              <input
                                type="text"
                                id="address-line2"
                                name="areaStreetSectorVillage"
                                autoComplete="section-address address-line2"
                                value={addressForm.areaStreetSectorVillage}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "areaStreetSectorVillage",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pincode
                                <span className="text-red-500"> *</span>
                              </label>
                              <input
                                type="text"
                                id="address-pincode"
                                name="pincode"
                                autoComplete="section-address postal-code"
                                inputMode="numeric"
                                value={addressForm.pincode}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "pincode",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-4 ${
                                  addressErrors.pincode
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-200 focus:ring-[#000080]/10 focus:border-[#000080]"
                                }`}
                                placeholder="6 digits [0-9] PIN code"
                              />
                              {addressErrors.pincode && (
                                <p className="text-xs text-red-600 mt-1">
                                  {addressErrors.pincode}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Town/City
                                <span className="text-red-500"> *</span>
                              </label>
                              <input
                                type="text"
                                id="address-city"
                                name="city"
                                autoComplete="section-address address-level2"
                                value={addressForm.city}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "city",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-4 ${
                                  addressErrors.city
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-200 focus:ring-[#000080]/10 focus:border-[#000080]"
                                }`}
                              />
                              {addressErrors.city && (
                                <p className="text-xs text-red-600 mt-1">
                                  {addressErrors.city}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Landmark
                                <span className="text-gray-500 text-xs ml-1">
                                  (Optional)
                                </span>
                              </label>
                              <input
                                type="text"
                                id="address-landmark"
                                name="landmark"
                                autoComplete="section-address address-line3"
                                value={addressForm.landmark}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "landmark",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#000080]/10 focus:border-[#000080] outline-none"
                                placeholder="E.g. near apollo hospital"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                                <span className="text-red-500"> *</span>
                              </label>
                              <select
                                id="address-state"
                                name="state"
                                autoComplete="section-address address-level1"
                                value={addressForm.state}
                                onChange={(e) =>
                                  handleAddressInputChange(
                                    "state",
                                    e.target.value,
                                  )
                                }
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none bg-white focus:ring-4 ${
                                  addressErrors.state
                                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                                    : "border-gray-200 focus:ring-[#000080]/10 focus:border-[#000080]"
                                }`}
                              >
                                <option value="">Choose a state</option>
                                {indianStates.map((state) => (
                                  <option key={state} value={state}>
                                    {state}
                                  </option>
                                ))}
                              </select>
                              {addressErrors.state && (
                                <p className="text-xs text-red-600 mt-1">
                                  {addressErrors.state}
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={addressForm.isDefault}
                                  onChange={(e) =>
                                    handleAddressInputChange(
                                      "isDefault",
                                      e.target.checked,
                                    )
                                  }
                                />
                                Set as default address
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleSaveAddress}
                              disabled={isAddingAddress || isUpdatingAddress}
                              className="px-6 py-3 bg-[#ec5228] text-white rounded-xl font-semibold hover:bg-[#d94720] disabled:opacity-50"
                            >
                              {isAddingAddress || isUpdatingAddress
                                ? "Saving..."
                                : editingAddressId
                                  ? "Update Address"
                                  : "Save Address"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    {!isVerified && formData.whatsapp && (
                      <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 mb-4 text-center md:text-left">
                        ⚠️ Please verify your WhatsApp number to continue
                      </p>
                    )}
                    <div className="flex justify-center">
                      <button
                        onClick={handleFormSubmit}
                        disabled={!isFormValid}
                        className={`w-full md:w-auto md:min-w-[260px] px-10 py-4 font-semibold text-lg rounded-xl transition-all ${
                          isFormValid
                            ? "bg-[#ec5228] text-white hover:bg-[#d94720]"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <PaymentGateway
                  duration={selectedPlanData?.duration || 50}
                  sessions={selectedPlanData?.sessions || 1}
                  serviceType="homeopathy"
                  couponCode={appliedCoupon?.code}
                  appointmentDetailsOverride={bookingDetails}
                  formDataOverride={submittedFormData}
                  onPaymentSuccess={(paymentResult) => {
                    setPaymentDetails(paymentResult);
                    handleStepChange(4);
                  }}
                />
              )}

              {currentStep === 4 && (
                <div className="max-w-4xl mx-auto px-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#000080] mb-4">
                      You&apos;re All Set!
                    </h3>
                    <p className="text-gray-600 mb-3 text-lg">
                      Your homeopathy {selectedOptionData.title.toLowerCase()}{" "}
                      with Dr. Agrima Yadav is booked.
                    </p>
                    <p className="text-[#000080] bg-[#fffae3] border border-[#ec5228]/20 rounded-xl px-4 py-3 inline-block mb-4">
                      We will contact you on your selected time via WhatsApp to
                      begin your session smoothly.
                    </p>
                    {paymentDetails?.orderId && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                        <p className="text-green-800 font-semibold">
                          Booking ID: {paymentDetails.orderId}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="px-6 py-3 rounded-xl bg-[#000080] text-white font-semibold hover:bg-[#000080]/90 transition-colors"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setShowBookingFlow(false);
                          setCurrentStep(0);
                          window.scrollTo({ top: 0, behavior: "auto" });
                        }}
                        className="px-6 py-3 rounded-xl border border-[#ec5228] text-[#ec5228] font-semibold hover:bg-[#fffae3] transition-colors"
                      >
                        Back to Homeopathy
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h4 className="text-2xl font-semibold text-[#000080] mb-6">
                      Session Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                      <p>
                        <span className="font-semibold">Doctor:</span>{" "}
                        {doctor.name}
                      </p>
                      <p>
                        <span className="font-semibold">Type:</span>{" "}
                        {selectedOptionData.title}
                      </p>
                      <p>
                        <span className="font-semibold">Duration:</span> 50
                        minutes
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(bookingDetails?.date)}
                      </p>
                      <p>
                        <span className="font-semibold">Time:</span>{" "}
                        {bookingDetails?.time || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">WhatsApp:</span>{" "}
                        {formData.whatsapp || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
