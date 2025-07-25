import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Users,
  Link2,
  FileText,
  Plus,
  Mail,
  User,
  CheckCircle,
} from "lucide-react";
import {
  useGetMeetingsQuery,
  useCreateMeetingMutation,
} from "@/features/api/meetingsApi";

const CreateMeeting = () => {
  useGetMeetingsQuery(); // Keep the query active for cache invalidation
  const [createMeeting, { isLoading: createMeetingLoading }] =
    useCreateMeetingMutation();
  const [formData, setFormData] = useState({
    clientEmail: "",
    clientName: "",
    doctorEmail: "",
    doctorName: "",
    meetingDate: "",
    meetingTime: "",
    meetingPeriod: "AM",
    meetingLink: "",
    formLink: "",
  });

  const [emailVerification, setEmailVerification] = useState({
    client: { loading: false, verified: false },
    doctor: { loading: false, verified: false },
  });
  const [errors, setErrors] = useState({});

  const userRole = useSelector((state) => state?.auth?.user?.role);

  axios.defaults.withCredentials = true;

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/meeting`;

  // Check if user is admin
  useEffect(() => {
    if (userRole !== "admin") {
      toast.error("Access denied: Only administrators can create meetings");
      return;
    }
  }, [userRole]);

  const verifyEmail = async (email, userType) => {
    if (!email || !isValidEmail(email)) return;

    setEmailVerification((prev) => ({
      ...prev,
      [userType]: { loading: true, verified: false },
    }));

    try {
      const response = await axios.post(`${API_BASE}/verify-email`, {
        email,
        userType,
      });

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          [`${userType}Name`]: response.data.user.name,
        }));

        setEmailVerification((prev) => ({
          ...prev,
          [userType]: { loading: false, verified: true },
        }));

        // Clear any existing errors for this field
        setErrors((prev) => ({
          ...prev,
          [`${userType}Email`]: "",
          [`${userType}Name`]: "",
        }));

        toast.success(
          `${userType === "client" ? "Client" : "Doctor"} verified: ${
            response.data.user.name
          }`
        );
      }
    } catch (error) {
      setEmailVerification((prev) => ({
        ...prev,
        [userType]: { loading: false, verified: false },
      }));

      setFormData((prev) => ({
        ...prev,
        [`${userType}Name`]: "",
      }));

      const errorMessage =
        error.response?.data?.message || `Failed to verify ${userType} email`;
      setErrors((prev) => ({
        ...prev,
        [`${userType}Email`]: errorMessage,
      }));

      toast.error(errorMessage);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate client email
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!isValidEmail(formData.clientEmail)) {
      newErrors.clientEmail = "Please enter a valid email address";
    } else if (!emailVerification.client.verified) {
      newErrors.clientEmail = "Please verify the client email first";
    }

    // Validate doctor/BH Associate email
    if (!formData.doctorEmail.trim()) {
      newErrors.doctorEmail = "BH Associate email is required";
    } else if (!isValidEmail(formData.doctorEmail)) {
      newErrors.doctorEmail = "Please enter a valid email address";
    } else if (!emailVerification.doctor.verified) {
      newErrors.doctorEmail = "Please verify the BH Associate email first";
    }

    // Check if emails are different
    if (
      formData.clientEmail &&
      formData.doctorEmail &&
      formData.clientEmail.toLowerCase() === formData.doctorEmail.toLowerCase()
    ) {
      newErrors.doctorEmail =
        "BH Associate and client emails must be different";
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate = "Meeting date is required";
    } else {
      // Check if date is today or in future
      const selectedDate = new Date(formData.meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.meetingDate = "Meeting date must be today or in the future";
      }
    }

    if (!formData.meetingTime.trim()) {
      newErrors.meetingTime = "Meeting time is required";
    } else {
      // Validate time format (HH:MM)
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.meetingTime)) {
        newErrors.meetingTime = "Invalid time format. Use HH:MM";
      } else if (formData.meetingDate) {
        // Check if time is in future for today's meetings
        const selectedDate = new Date(formData.meetingDate);
        const today = new Date();

        if (selectedDate.toDateString() === today.toDateString()) {
          const [hours, minutes] = formData.meetingTime.split(":").map(Number);

          const adjustedHours =
            formData.meetingPeriod.toLowerCase() === "pm" && hours !== 12
              ? hours + 12
              : formData.meetingPeriod.toLowerCase() === "am" && hours === 12
              ? 0
              : hours;

          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();

          if (
            adjustedHours < currentHour ||
            (adjustedHours === currentHour && minutes <= currentMinute)
          ) {
            newErrors.meetingTime = "Meeting time must be in the future";
          }
        }
      }
    }

    if (!formData.meetingLink.trim()) {
      newErrors.meetingLink = "Meeting link is required";
    } else if (!isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = "Please enter a valid URL";
    }

    if (!formData.formLink.trim()) {
      newErrors.formLink = "Form link is required";
    } else if (!isValidUrl(formData.formLink)) {
      newErrors.formLink = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Reset verification and name when email changes
    if (name === "clientEmail") {
      setEmailVerification((prev) => ({
        ...prev,
        client: { loading: false, verified: false },
      }));
      setFormData((prev) => ({
        ...prev,
        clientName: "",
      }));
    } else if (name === "doctorEmail") {
      setEmailVerification((prev) => ({
        ...prev,
        doctor: { loading: false, verified: false },
      }));
      setFormData((prev) => ({
        ...prev,
        doctorName: "",
      }));
    }
  };

  const handleEmailBlur = (userType) => {
    const email = formData[`${userType}Email`];
    if (email && isValidEmail(email) && !emailVerification[userType].verified) {
      verifyEmail(email, userType);
    }
  };

  const handleTimeChange = (e) => {
    let value = e.target.value;

    // Auto-format time as user types
    if (value.length === 2 && !value.includes(":")) {
      value = value + ":";
    }

    setFormData((prev) => ({
      ...prev,
      meetingTime: value,
    }));

    if (errors.meetingTime) {
      setErrors((prev) => ({
        ...prev,
        meetingTime: "",
      }));
    }
  };

  const handlePeriodChange = (period) => {
    setFormData((prev) => ({
      ...prev,
      meetingPeriod: period,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      // Combine time and period before submitting
      const fullTime = `${formData.meetingTime} ${formData.meetingPeriod}`;

      // Send the request with email IDs (backend expects clientId and doctorId)
      const submitData = {
        clientId: formData.clientEmail,
        doctorId: formData.doctorEmail,
        meetingDate: formData.meetingDate,
        meetingTime: fullTime, // Combined time with AM/PM
        meetingLink: formData.meetingLink,
        formLink: formData.formLink,
      };

      await createMeeting(submitData).unwrap();

      toast.success("Meeting created successfully!");

      // Reset form
      setFormData({
        clientEmail: "",
        clientName: "",
        doctorEmail: "",
        doctorName: "",
        meetingDate: "",
        meetingTime: "",
        meetingPeriod: "AM",
        meetingLink: "",
        formLink: "",
      });
      setEmailVerification({
        client: { loading: false, verified: false },
        doctor: { loading: false, verified: false },
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating meeting:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create meeting. Please try again.");
      }
    }
  };

  const clearForm = () => {
    setFormData({
      clientEmail: "",
      clientName: "",
      doctorEmail: "",
      doctorName: "",
      meetingDate: "",
      meetingTime: "",
      meetingPeriod: "AM",
      meetingLink: "",
      formLink: "",
    });
    setEmailVerification({
      client: { loading: false, verified: false },
      doctor: { loading: false, verified: false },
    });
    setErrors({});
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (userRole !== "admin") {
    return (
      <div className=" mt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Only administrators can create meetings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gray-50 py-8 px-4">
      <div className="mt-24 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Schedule New Meeting
            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded mb-4"></div>
            <p className="text-gray-600">
              Create a new meeting between client and BH Associate
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Participants Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Meeting Participants
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Section */}
                <div className="space-y-4">
                  {/* Client Email */}
                  <div>
                    <label
                      htmlFor="clientEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Client ID *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="clientEmail"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        onBlur={() => handleEmailBlur("client")}
                        placeholder="client@example.com"
                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.clientEmail
                            ? "border-red-300 focus:border-red-500"
                            : emailVerification.client.verified
                            ? "border-green-300 focus:border-green-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                      />
                      {emailVerification.client.loading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="animate-spin h-5 w-5 text-blue-500"
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
                        </div>
                      )}
                      {emailVerification.client.verified && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {errors.clientEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.clientEmail}
                      </p>
                    )}
                  </div>

                  {/* Client Name */}
                  <div>
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Client Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        readOnly
                        placeholder="Name will appear after email verification"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* BH Associate Section */}
                <div className="space-y-4">
                  {/* BH Associate Email */}
                  <div>
                    <label
                      htmlFor="doctorEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      BH Associate ID *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="doctorEmail"
                        name="doctorEmail"
                        value={formData.doctorEmail}
                        onChange={handleInputChange}
                        onBlur={() => handleEmailBlur("doctor")}
                        placeholder="BHAssociate@ideservebetterhealth.in"
                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.doctorEmail
                            ? "border-red-300 focus:border-red-500"
                            : emailVerification.doctor.verified
                            ? "border-green-300 focus:border-green-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                      />
                      {emailVerification.doctor.loading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="animate-spin h-5 w-5 text-blue-500"
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
                        </div>
                      )}
                      {emailVerification.doctor.verified && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {errors.doctorEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.doctorEmail}
                      </p>
                    )}
                  </div>

                  {/* BH Associate Name */}
                  <div>
                    <label
                      htmlFor="doctorName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      BH Associate Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="doctorName"
                        name="doctorName"
                        value={formData.doctorName}
                        readOnly
                        placeholder="Name will appear after email verification"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Date & Time
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meeting Date */}
                <div>
                  <label
                    htmlFor="meetingDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Meeting Date *
                  </label>
                  <input
                    type="date"
                    id="meetingDate"
                    name="meetingDate"
                    value={formData.meetingDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.meetingDate
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                  />
                  {errors.meetingDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.meetingDate}
                    </p>
                  )}
                </div>

                {/* Meeting Time */}
                <div>
                  <label
                    htmlFor="meetingTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Meeting Time *{" "}
                    <span className="text-gray-500 text-xs">
                      (Format: HH:MM)
                    </span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="meetingTime"
                        name="meetingTime"
                        value={formData.meetingTime}
                        onChange={handleTimeChange}
                        placeholder="e.g., 02:30"
                        maxLength={5}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.meetingTime
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-blue-500"
                        }`}
                      />
                    </div>
                    <div className="inline-flex items-center rounded-md shadow-sm">
                      <button
                        type="button"
                        onClick={() => handlePeriodChange("AM")}
                        className={`px-4 py-3 text-sm font-medium border-2 rounded-l-lg ${
                          formData.meetingPeriod === "AM"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePeriodChange("PM")}
                        className={`px-4 py-3 text-sm font-medium border-y-2 border-r-2 rounded-r-lg ${
                          formData.meetingPeriod === "PM"
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                  {errors.meetingTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.meetingTime}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Examples: 09:30, 02:15, 11:45
                  </p>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Link2 className="w-5 h-5 mr-2 text-blue-600" />
                Meeting Links
              </h2>

              <div className="space-y-6">
                {/* Meeting Link */}
                <div>
                  <label
                    htmlFor="meetingLink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Meeting Link *
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      id="meetingLink"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleInputChange}
                      placeholder="https://meet.google.com/abc-def-ghi"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.meetingLink
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  {errors.meetingLink && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.meetingLink}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Video conferencing link (Google Meet, Zoom, etc.)
                  </p>
                </div>

                {/* Form Link */}
                <div>
                  <label
                    htmlFor="formLink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Report Form Link *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      id="formLink"
                      name="formLink"
                      value={formData.formLink}
                      onChange={handleInputChange}
                      placeholder="https://forms.google.com/d/abc123/viewform"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.formLink
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  {errors.formLink && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.formLink}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Link to the report form that BH Associate will fill after
                    the meeting
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={createMeetingLoading}
                className="flex-1 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors transform hover:scale-105 active:scale-95"
              >
                {createMeetingLoading ? (
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
                    Creating Meeting...
                  </div>
                ) : (
                  "Create Meeting"
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                disabled={createMeetingLoading}
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
            📋 Meeting Creation Guidelines
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>
              • Enter valid email addresses for both client and BH Associate
            </li>
            <li>
              • Email verification will automatically fetch and display names
            </li>
            <li>• Meeting date must be today or in the future</li>
            <li>• Use 12-hour time format with AM/PM (e.g., 02:30 PM)</li>
            <li>• For today's meetings, time must be in the future</li>
            <li>
              • Provide valid video conferencing links (Google Meet, Zoom, etc.)
            </li>
            <li>• Include a report form link for post-meeting documentation</li>
            <li>• Both participants will receive meeting notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;
