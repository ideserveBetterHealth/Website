import { useState } from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { useSubmitEmployeeFormMutation } from "@/features/api/detailsApi";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import countriesData from "@/data/countries.json";

axios.defaults.withCredentials = true;

const initialEmployment = {
  id: Date.now() + Math.random(), // Add unique ID
  organization: "",
  jobTitle: "",
  startDate: null,
  endDate: null,
  employmentType: "",
  isCurrentJob: false, // Add this new field
};

const initialEducation = {
  id: Date.now() + Math.random(), // Add unique ID
  level: "", // Changed from educationLevel
  degreeName: "", // Changed from degree
  institutionName: "", // Changed from institution
  graduationYear: "",
  major: "", // Add missing major field
};

const calendarInputStyle =
  "w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

// Define the ErrorMessage component before using it
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return <p className="text-red-500 text-sm mt-1 error-message">{error}</p>;
};

export default function DynamicForm() {
  const [submitEmployeeForm, { isLoading }] = useSubmitEmployeeFormMutation();

  // Existing states
  const [employmentDetails, setEmploymentDetails] = useState([
    { ...initialEmployment, id: Date.now() + Math.random() },
  ]);
  const [educationDetails, setEducationDetails] = useState([
    {
      ...initialEducation,
      id: Date.now() + Math.random() + 1, // Ensure different ID
    },
  ]);
  const [sameAddress, setSameAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [dob, setDob] = useState(null);

  // New states for personal information
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");

  // Bank account states
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");

  // New state variables for document upload
  const [document1Type, setDocument1Type] = useState("");
  const [documentId1, setDocumentId1] = useState("");
  const [frontImage1, setFrontImage1] = useState(null);
  const [backImage1, setBackImage1] = useState(null);
  const [frontImage1Name, setFrontImage1Name] = useState("");
  const [backImage1Name, setBackImage1Name] = useState("");

  const [document2Type, setDocument2Type] = useState("");
  const [documentId2, setDocumentId2] = useState("");
  const [frontImage2, setFrontImage2] = useState(null);
  const [backImage2, setBackImage2] = useState(null);
  const [frontImage2Name, setFrontImage2Name] = useState("");
  const [backImage2Name, setBackImage2Name] = useState("");

  // New state for salary slip
  const [salarySlip, setSalarySlip] = useState("");
  const [salarySlipName, setSalarySlipName] = useState("");

  // State for resume file name
  const [resumeName, setResumeName] = useState("");

  const navigate = useNavigate();

  const handleEmploymentChange = (index, name, value) => {
    const updatedEmployments = [...employmentDetails];

    // If toggling current job status, handle end date
    if (name === "isCurrentJob") {
      updatedEmployments[index][name] = value;
      if (value) {
        // If current job, clear end date
        updatedEmployments[index].endDate = null;
      }
    } else {
      updatedEmployments[index][name] = value;
    }

    setEmploymentDetails(updatedEmployments);
  };

  const addEmployment = () => {
    setEmploymentDetails([
      ...employmentDetails,
      {
        ...initialEmployment,
        id: Date.now() + Math.random(), // Generate new unique ID
      },
    ]);
  };

  const removeEmployment = (index) => {
    const updated = employmentDetails.filter((_, i) => i !== index);
    setEmploymentDetails(updated);
  };

  const handleEducationChange = (index, name, value) => {
    const updated = [...educationDetails];
    updated[index][name] = value;
    setEducationDetails(updated);
  };

  const addEducation = () => {
    setEducationDetails([
      ...educationDetails,
      {
        ...initialEducation,
        id: Date.now() + Math.random(), // Generate new unique ID
      },
    ]);
  };

  const removeEducation = (index) => {
    const updated = educationDetails.filter((_, i) => i !== index);
    setEducationDetails(updated);
  };

  const handleSameAddressChange = () => {
    setSameAddress(!sameAddress);
    if (!sameAddress) {
      setPermanentAddress(currentAddress);
    } else {
      setPermanentAddress("");
    }
  };

  const { isLoading: userIsLoading, refetch } = useLoadUserQuery();

  const user = useSelector((state) => state.auth.user);

  // Helper function to truncate file names
  const truncateFileName = (fileName, maxLength = 25) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) return fileName;

    const extension = fileName.split(".").pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
    const truncatedName = nameWithoutExt.substring(
      0,
      maxLength - extension.length - 4
    );

    return `${truncatedName}...${extension}`;
  };

  // Email validation
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Phone validation
  const validatePhone = (phone) => {
    const re = /^\d{10,15}$/;
    return re.test(String(phone).replace(/[^0-9]/g, ""));
  };

  // Validate IFSC code
  const validateIFSC = (ifsc) => {
    const re = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
    return re.test(String(ifsc));
  };

  // New state for form errors
  const [errors, setErrors] = useState({});

  // Function to clear specific field errors
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Function to clear all errors
  const clearAllErrors = () => {
    setErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Personal Information validation
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!currentAddress.trim())
      newErrors.currentAddress = "Current address is required";
    if (!sameAddress && !permanentAddress.trim())
      newErrors.permanentAddress = "Permanent address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!country) newErrors.country = "Country is required";

    // Validate email and phone
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    // Emergency contact validation
    if (!emergencyContactName.trim())
      newErrors.emergencyContactName = "Emergency contact name is required";
    if (!emergencyContactRelationship.trim())
      newErrors.emergencyContactRelationship =
        "Emergency contact relationship is required";
    if (!emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    } else if (!validatePhone(emergencyContactPhone)) {
      newErrors.emergencyContactPhone =
        "Invalid emergency contact phone format";
    }

    // Resume validation
    if (!resumeUrl) newErrors.resumeUrl = "Resume is required";

    // Blood Group validation
    if (!bloodGroup.trim()) newErrors.bloodGroup = "Blood group is required";

    // Document validation
    if (!document1Type) newErrors.document1Type = "Document 1 type is required";
    if (!documentId1.trim())
      newErrors.documentId1 = "Document 1 ID is required";
    if (!frontImage1)
      newErrors.frontImage1 = "Document 1 front image is required";
    if (!backImage1) newErrors.backImage1 = "Document 1 back image is required";

    if (!document2Type) newErrors.document2Type = "Document 2 type is required";
    if (!documentId2.trim())
      newErrors.documentId2 = "Document 2 ID is required";
    if (!frontImage2)
      newErrors.frontImage2 = "Document 2 front image is required";
    if (!backImage2) newErrors.backImage2 = "Document 2 back image is required";

    // Employment validation
    employmentDetails.forEach((employment, index) => {
      if (!employment.organization.trim())
        newErrors[`employment_${index}_organization`] =
          "Organization is required";
      if (!employment.jobTitle.trim())
        newErrors[`employment_${index}_jobTitle`] = "Job title is required";
      if (!employment.startDate)
        newErrors[`employment_${index}_startDate`] = "Start date is required";
      if (!employment.employmentType)
        newErrors[`employment_${index}_employmentType`] =
          "Employment type is required";
      if (!employment.isCurrentJob && !employment.endDate)
        newErrors[`employment_${index}_endDate`] =
          "End date is required for previous jobs";
    });

    // Salary slip validation (optional)
    // No validation needed as it's now optional

    // Education validation
    educationDetails.forEach((edu, index) => {
      if (!edu.level)
        newErrors[`education_${index}_level`] = "Education level is required";
      if (!edu.degreeName.trim())
        newErrors[`education_${index}_degreeName`] = "Degree name is required";
      if (!edu.institutionName.trim())
        newErrors[`education_${index}_institutionName`] =
          "Institution name is required";
      if (!edu.graduationYear.trim())
        newErrors[`education_${index}_graduationYear`] =
          "Graduation year is required";
    });

    // Bank details validation
    if (!accountHolder.trim())
      newErrors.accountHolder = "Account holder name is required";
    if (!bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!branchName.trim()) newErrors.branchName = "Branch name is required";
    if (!accountNumber.trim())
      newErrors.accountNumber = "Account number is required";
    if (!ifsc.trim()) {
      newErrors.ifsc = "IFSC code is required";
    } else if (!validateIFSC(ifsc)) {
      newErrors.ifsc = "Invalid IFSC code format";
    }
    if (!upi.trim()) newErrors.upi = "UPI ID is required";

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors before validation
    setErrors({});

    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Use the current validation errors directly
      const errorKeys = Object.keys(validation.errors);
      if (errorKeys.length > 0) {
        // Show first 3 errors in toast
        const mainErrors = errorKeys
          .slice(0, 3)
          .map((key) => validation.errors[key]);
        const remainingCount = errorKeys.length - 3;

        let errorMessage = mainErrors.join(", ");
        if (remainingCount > 0) {
          errorMessage += ` and ${remainingCount} more error${
            remainingCount > 1 ? "s" : ""
          }`;
        }

        toast.error(`Please fix the following errors: ${errorMessage}`);
      }

      // Scroll to the first error
      setTimeout(() => {
        const firstError = document.querySelector(".error-message");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return;
    }

    // Form is valid, continue with submission
    const formData = {
      personalInfo: {
        firstName,
        middleName,
        lastName,
        dob,
        gender,
        currentAddress,
        permanentAddress,
        city,
        state,
        postalCode,
        country,
        email,
        phone,
        emergencyContact: {
          name: emergencyContactName,
          relationship: emergencyContactRelationship,
          phone: emergencyContactPhone,
        },
        resumeUrl,
        linkedin,
        Doc: [
          {
            documentType: document1Type,
            documentId: documentId1,
            frontImage: frontImage1,
            backImage: backImage1,
          },
          {
            documentType: document2Type,
            documentId: documentId2,
            frontImage: frontImage2,
            backImage: backImage2,
          },
        ],
        bloodGroup,
      },
      employmentDetails,
      salarySlip,
      educationDetails,
      bankAccount: {
        accountHolder,
        bankName,
        branchName,
        accountNumber,
        ifsc,
        upi,
      },
    };

    try {
      const response = await submitEmployeeForm(formData).unwrap();
      toast.success("Form submitted successfully!");
      // Reset form or redirect here
    } catch (error) {
      console.error("Form submission error:", error);

      // Handle different types of errors
      if (error.data) {
        // If we have detailed error information from the backend
        if (error.data.errors && Array.isArray(error.data.errors)) {
          // Check if these are MongoDB validation errors (objects) or simple strings
          const firstError = error.data.errors[0];
          const remainingCount = error.data.errors.length - 1;

          let errorMessage;
          if (typeof firstError === "object" && firstError.message) {
            // MongoDB validation error format
            errorMessage = firstError.message;
          } else if (typeof firstError === "string") {
            // Simple string error format
            errorMessage = firstError;
          } else {
            // Fallback for other formats
            errorMessage = JSON.stringify(firstError);
          }

          if (remainingCount > 0) {
            errorMessage += ` and ${remainingCount} more error${
              remainingCount > 1 ? "s" : ""
            }`;
          }

          toast.error(`Validation failed: ${errorMessage}`);
        } else if (
          error.data.detailedErrors &&
          Array.isArray(error.data.detailedErrors)
        ) {
          // Use detailedErrors if available (these are formatted strings)
          const firstError = error.data.detailedErrors[0];
          const remainingCount = error.data.detailedErrors.length - 1;

          let errorMessage = firstError;
          if (remainingCount > 0) {
            errorMessage += ` and ${remainingCount} more error${
              remainingCount > 1 ? "s" : ""
            }`;
          }

          toast.error(`Validation failed: ${errorMessage}`);
        } else {
          // Show general error message
          toast.error(error.data.message || "Validation failed");
        }
      } else {
        // Network or other errors
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      refetch();
    }
  };

  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(false);

  // Cloudinary configuration - you can get these from your Cloudinary dashboard
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const fileChangeHandler = async (
    e,
    order = undefined,
    side,
    type = "document"
  ) => {
    const file = e.target.files[0];
    if (!file) return;

    // Frontend validation for security
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = {
      resume: [
        "application/pdf", // Only PDF files allowed for resume
      ],
      document: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
      salary: ["application/pdf", "image/jpeg", "image/png"],
    };

    // Validate file size
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const typeKey = type === "document" ? "document" : type;
    if (!allowedTypes[typeKey]?.includes(file.type)) {
      if (type === "resume") {
        toast.error(
          "Invalid file type. Please upload a PDF file only for resume."
        );
      } else {
        toast.error(
          `Invalid file type. Allowed types: ${allowedTypes[typeKey]?.join(
            ", "
          )}`
        );
      }
      return;
    }

    // Validate file name (prevent malicious names)
    if (file.name.length > 100) {
      toast.error("File name too long. Please rename your file.");
      return;
    }

    setMediaProgress(true);
    setBtnDisable(true);

    try {
      // Create FormData for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "employee-documents");

      // Add additional security parameters
      formData.append("resource_type", "auto");
      formData.append("quality", "auto:good"); // Optimize images

      // Upload directly to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
          timeout: 30000, // 30 second timeout
          withCredentials: false, // Disable credentials for Cloudinary uploads
        }
      );

      if (response.data.secure_url) {
        console.log("Media uploaded successfully:", response.data);
        const uploadedUrl = response.data.secure_url;

        // Set the appropriate state based on the upload type
        if (order === undefined && type === "resume") {
          setResumeUrl(uploadedUrl);
          setResumeName(file.name);
        }
        if (order === undefined && type === "salary") {
          setSalarySlip(uploadedUrl);
          setSalarySlipName(file.name);
        }
        if (order === 1) {
          if (side === "front") {
            setFrontImage1(uploadedUrl);
            setFrontImage1Name(file.name);
          } else {
            setBackImage1(uploadedUrl);
            setBackImage1Name(file.name);
          }
        }
        if (order === 2) {
          if (side === "front") {
            setFrontImage2(uploadedUrl);
            setFrontImage2Name(file.name);
          } else {
            setBackImage2(uploadedUrl);
            setBackImage2Name(file.name);
          }
        }

        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setMediaProgress(false);
      setBtnDisable(false);
      setUploadProgress(0);
    }
  };

  if (userIsLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="h-16 w-16 animate-spin text-orange-200" />
      </div>
    );
  }

  if (user?.role !== "doctor" && user?.role !== "admin") {
    navigate("/dashboard");
  }

  if (user?.isVerified === "pending") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl">Hey {user.name} ☺️</h1>
        <br />
        <h1 className="text-5xl">Your verification request is submitted</h1>
        <br />
        <h1 className="text-5xl">Please give us some time to verify.</h1>
      </div>
    );
  }

  if (user?.isVerified === "verified") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl">Hey {user.name} 😉</h1>
        <br />
        <h1 className="text-5xl">Your are already verified.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffae3] via-white to-[#fffae3] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 pt-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ec5228] to-[#d14a22] rounded-full mb-6 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#000080] mb-4">
            Submit Documents
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Complete your verification process by providing the required
            information and documents. All fields marked with * are mandatory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Personal Information
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className={`w-full border-2 ${
                      errors.firstName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                  />
                  <ErrorMessage error={errors.firstName} />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="middleName"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    Middle Name
                  </label>
                  <input
                    id="middleName"
                    name="middleName"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Enter your middle name (optional)"
                    className="w-full border-2 border-gray-200 focus:border-[#ec5228] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    className={`w-full border-2 ${
                      errors.lastName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <ErrorMessage error={errors.lastName} />
                </div>
              </div>

              {/* Date of Birth and Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    Date of Birth *
                  </label>
                  <Calendar
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.value)}
                    placeholder="Select your date of birth"
                    className="w-full"
                    inputClassName="w-full border-2 border-gray-200 focus:border-[#ec5228] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                    showIcon
                    maxDate={new Date()}
                  />
                  <ErrorMessage error={errors.dob} />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className={`w-full border-2 ${
                      errors.gender
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                  <ErrorMessage error={errors.gender} />
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Address Information
                </h3>

                <div className="space-y-4">
                  <div className="form-group">
                    <label
                      htmlFor="currentAddress"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Current Residential Address *
                    </label>
                    <textarea
                      id="currentAddress"
                      name="currentAddress"
                      placeholder="Enter your complete current address"
                      className={`w-full border-2 ${
                        errors.currentAddress
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228]"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 min-h-[100px] resize-y`}
                      value={currentAddress}
                      onChange={(e) => {
                        setCurrentAddress(e.target.value);
                        if (sameAddress) setPermanentAddress(e.target.value);
                      }}
                    />
                    <ErrorMessage error={errors.currentAddress} />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={sameAddress}
                      onChange={handleSameAddressChange}
                      className="h-4 w-4 text-[#ec5228] focus:ring-[#ec5228] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sameAddress"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Permanent address same as current
                    </label>
                  </div>

                  {!sameAddress && (
                    <div className="form-group">
                      <label
                        htmlFor="permanentAddress"
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Permanent Address *
                      </label>
                      <textarea
                        id="permanentAddress"
                        name="permanentAddress"
                        placeholder="Enter your permanent address"
                        className={`w-full border-2 ${
                          errors.permanentAddress
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228]"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 min-h-[100px] resize-y`}
                        value={permanentAddress}
                        onChange={(e) => setPermanentAddress(e.target.value)}
                      />
                      <ErrorMessage error={errors.permanentAddress} />
                    </div>
                  )}
                </div>
              </div>

              {/* Location Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group">
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    className={`w-full border-2 ${
                      errors.city
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <ErrorMessage error={errors.city} />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="state"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    State *
                  </label>
                  <input
                    id="state"
                    name="state"
                    placeholder="Enter state"
                    className={`w-full border-2 ${
                      errors.state
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <ErrorMessage error={errors.state} />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    Postal Code *
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter postal code"
                    className={`w-full border-2 ${
                      errors.postalCode
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                  <ErrorMessage error={errors.postalCode} />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-[#000080] mb-2"
                  >
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    className={`w-full border-2 ${
                      errors.country
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select Country</option>
                    {countriesData.countries.map((countryName) => (
                      <option key={countryName} value={countryName}>
                        {countryName}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage error={errors.country} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Contact Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={`w-full border-2 ${
                        errors.email
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <ErrorMessage error={errors.email} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className={`w-full border-2 ${
                        errors.phone
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <ErrorMessage error={errors.phone} />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600"
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
                  Emergency Contact
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label
                      htmlFor="emergencyContactName"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Contact Name *
                    </label>
                    <input
                      id="emergencyContactName"
                      name="emergencyContactName"
                      placeholder="Full name"
                      className={`w-full border-2 ${
                        errors.emergencyContactName
                          ? "border-red-400 bg-red-100"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                    />
                    <ErrorMessage error={errors.emergencyContactName} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="emergencyContactRelationship"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Relationship *
                    </label>
                    <input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      placeholder="e.g. Father, Mother, Spouse"
                      className={`w-full border-2 ${
                        errors.emergencyContactRelationship
                          ? "border-red-400 bg-red-100"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={emergencyContactRelationship}
                      onChange={(e) =>
                        setEmergencyContactRelationship(e.target.value)
                      }
                    />
                    <ErrorMessage error={errors.emergencyContactRelationship} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="emergencyContactPhone"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Contact Phone *
                    </label>
                    <input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      type="tel"
                      placeholder="Phone number"
                      className={`w-full border-2 ${
                        errors.emergencyContactPhone
                          ? "border-red-400 bg-red-100"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    />
                    <ErrorMessage error={errors.emergencyContactPhone} />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label
                    htmlFor="linkedin"
                    className="flex items-center gap-2 text-sm font-semibold text-[#000080] mb-2"
                  >
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn Profile
                  </label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full border-2 border-gray-200 focus:border-[#ec5228] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="bloodGroup"
                    className="flex items-center gap-2 text-sm font-semibold text-[#000080] mb-2"
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Blood Group *
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    className={`w-full border-2 ${
                      errors.bloodGroup
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#ec5228]"
                    } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                  <ErrorMessage error={errors.bloodGroup} />
                </div>
              </div>

              {/* Resume Upload */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Resume Upload *
                </h3>

                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      fileChangeHandler(e, undefined, undefined, "resume")
                    }
                    className="hidden"
                    id="resume-upload"
                    disabled={btnDisable}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`w-full border-2 border-dashed border-green-300 hover:border-[#ec5228] rounded-xl shadow-sm px-6 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
                      btnDisable ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {resumeUrl ? (
                      <div className="flex flex-col items-center gap-3 text-green-600">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          Resume uploaded successfully!
                        </span>
                        <span className="text-sm font-medium text-[#000080] bg-green-100 px-3 py-1 rounded-full">
                          📄 {truncateFileName(resumeName)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Click to replace
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          Upload your resume
                        </span>
                        <span className="text-sm">PDF files only</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Documents Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Legal Document 1
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="form-group">
                <label
                  htmlFor="document1Type"
                  className="block text-sm font-semibold text-[#000080] mb-2"
                >
                  Document Type *
                </label>
                <select
                  id="document1Type"
                  className={`w-full border-2 ${
                    errors.document1Type
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#ec5228]"
                  } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                  value={document1Type}
                  onChange={(e) => setDocument1Type(e.target.value)}
                >
                  <option value="">Select Document Type</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="dl">Driving License</option>
                </select>
                <ErrorMessage error={errors.document1Type} />
              </div>

              <div className="form-group">
                <label
                  htmlFor="documentId1"
                  className="block text-sm font-semibold text-[#000080] mb-2"
                >
                  Document ID *
                </label>
                <input
                  id="documentId1"
                  type="text"
                  placeholder="Enter document ID number"
                  className={`w-full border-2 ${
                    errors.documentId1
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#ec5228]"
                  } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                  value={documentId1}
                  onChange={(e) => setDocumentId1(e.target.value)}
                />
                <ErrorMessage error={errors.documentId1} />
              </div>

              {/* Document Upload Section */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Document Images *
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label
                      htmlFor="frontImage1"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Front Side *
                    </label>
                    <div className="relative">
                      <input
                        id="frontImage1"
                        type="file"
                        accept="image/*"
                        disabled={btnDisable}
                        onChange={(e) => fileChangeHandler(e, 1, "front")}
                        className="hidden"
                      />
                      <label
                        htmlFor="frontImage1"
                        className={`w-full border-2 border-dashed border-purple-300 hover:border-[#ec5228] rounded-xl shadow-sm px-4 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
                          btnDisable ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {frontImage1 ? (
                          <div className="flex flex-col items-center gap-2 text-green-600">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Front side uploaded
                            </span>
                            <span className="text-xs font-medium text-[#000080] bg-green-100 px-2 py-1 rounded-full">
                              📷 {truncateFileName(frontImage1Name)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Upload front side
                            </span>
                            <span className="text-xs">Image files only</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <ErrorMessage error={errors.frontImage1} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="backImage1"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Back Side *
                    </label>
                    <div className="relative">
                      <input
                        id="backImage1"
                        type="file"
                        accept="image/*"
                        disabled={btnDisable}
                        onChange={(e) => fileChangeHandler(e, 1, "back")}
                        className="hidden"
                      />
                      <label
                        htmlFor="backImage1"
                        className={`w-full border-2 border-dashed border-purple-300 hover:border-[#ec5228] rounded-xl shadow-sm px-4 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
                          btnDisable ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {backImage1 ? (
                          <div className="flex flex-col items-center gap-2 text-green-600">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Back side uploaded
                            </span>
                            <span className="text-xs font-medium text-[#000080] bg-green-100 px-2 py-1 rounded-full">
                              📷 {truncateFileName(backImage1Name)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Upload back side
                            </span>
                            <span className="text-xs">Image files only</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <ErrorMessage error={errors.backImage1} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Legal Document 2
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="form-group">
                <label
                  htmlFor="document2Type"
                  className="block text-sm font-semibold text-[#000080] mb-2"
                >
                  Document Type *
                </label>
                <select
                  id="document2Type"
                  className={`w-full border-2 ${
                    errors.document2Type
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#ec5228]"
                  } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                  value={document2Type}
                  onChange={(e) => setDocument2Type(e.target.value)}
                >
                  <option value="">Select Document Type</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="dl">Driving License</option>
                </select>
                <ErrorMessage error={errors.document2Type} />
              </div>

              <div className="form-group">
                <label
                  htmlFor="documentId2"
                  className="block text-sm font-semibold text-[#000080] mb-2"
                >
                  Document ID *
                </label>
                <input
                  id="documentId2"
                  type="text"
                  placeholder="Enter document ID number"
                  className={`w-full border-2 ${
                    errors.documentId2
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#ec5228]"
                  } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                  value={documentId2}
                  onChange={(e) => setDocumentId2(e.target.value)}
                />
                <ErrorMessage error={errors.documentId2} />
              </div>

              {/* Document Upload Section */}
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Document Images *
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label
                      htmlFor="frontImage2"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Front Side *
                    </label>
                    <div className="relative">
                      <input
                        id="frontImage2"
                        type="file"
                        accept="image/*"
                        disabled={btnDisable}
                        onChange={(e) => fileChangeHandler(e, 2, "front")}
                        className="hidden"
                      />
                      <label
                        htmlFor="frontImage2"
                        className={`w-full border-2 border-dashed border-purple-300 hover:border-[#ec5228] rounded-xl shadow-sm px-4 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
                          btnDisable ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {frontImage2 ? (
                          <div className="flex flex-col items-center gap-2 text-green-600">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Front side uploaded
                            </span>
                            <span className="text-xs font-medium text-[#000080] bg-green-100 px-2 py-1 rounded-full">
                              📷 {truncateFileName(frontImage2Name)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Upload front side
                            </span>
                            <span className="text-xs">Image files only</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <ErrorMessage error={errors.frontImage2} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="backImage2"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Back Side *
                    </label>
                    <div className="relative">
                      <input
                        id="backImage2"
                        type="file"
                        accept="image/*"
                        disabled={btnDisable}
                        onChange={(e) => fileChangeHandler(e, 2, "back")}
                        className="hidden"
                      />
                      <label
                        htmlFor="backImage2"
                        className={`w-full border-2 border-dashed border-purple-300 hover:border-[#ec5228] rounded-xl shadow-sm px-4 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
                          btnDisable ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {backImage2 ? (
                          <div className="flex flex-col items-center gap-2 text-green-600">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Back side uploaded
                            </span>
                            <span className="text-xs font-medium text-[#000080] bg-green-100 px-2 py-1 rounded-full">
                              📷 {truncateFileName(backImage2Name)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Upload back side
                            </span>
                            <span className="text-xs">Image files only</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <ErrorMessage error={errors.backImage2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Employment Details
                </h2>
              </div>
              <p className="text-white/80 mt-2">
                Add your work experience and employment history
              </p>
            </div>

            <div className="p-8 space-y-6">
              {employmentDetails.map((employment, index) => (
                <div
                  key={employment.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 relative"
                >
                  {/* Delete button for multiple employment records */}
                  {employmentDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmployment(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                      title="Delete employment record"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#000080] flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Employment Record {index + 1}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label
                        htmlFor={`organization-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Organization *
                      </label>
                      <input
                        id={`organization-${index}`}
                        type="text"
                        placeholder="Enter organization name"
                        className={`w-full border-2 ${
                          errors[`employment_${index}_organization`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228] bg-white"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                        value={employment.organization}
                        onChange={(e) =>
                          handleEmploymentChange(
                            index,
                            "organization",
                            e.target.value
                          )
                        }
                      />
                      <ErrorMessage
                        error={errors[`employment_${index}_organization`]}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`jobTitle-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Job Title *
                      </label>
                      <input
                        id={`jobTitle-${index}`}
                        type="text"
                        placeholder="Enter job title"
                        className={`w-full border-2 ${
                          errors[`employment_${index}_jobTitle`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228] bg-white"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                        value={employment.jobTitle}
                        onChange={(e) =>
                          handleEmploymentChange(
                            index,
                            "jobTitle",
                            e.target.value
                          )
                        }
                      />
                      <ErrorMessage
                        error={errors[`employment_${index}_jobTitle`]}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`startDate-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Start Date *
                      </label>
                      <Calendar
                        id={`startDate-${index}`}
                        value={employment.startDate}
                        onChange={(e) =>
                          handleEmploymentChange(index, "startDate", e.value)
                        }
                        placeholder="Select start date"
                        className="w-full"
                        inputClassName="w-full border-2 border-gray-200 focus:border-[#ec5228] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white"
                        showIcon
                        maxDate={new Date()}
                      />
                      <ErrorMessage
                        error={errors[`employment_${index}_startDate`]}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`endDate-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        End Date {!employment.isCurrentJob && "*"}
                      </label>
                      <Calendar
                        id={`endDate-${index}`}
                        value={employment.endDate}
                        onChange={(e) =>
                          handleEmploymentChange(index, "endDate", e.value)
                        }
                        placeholder="Select end date"
                        className="w-full"
                        inputClassName={`w-full border-2 border-gray-200 focus:border-[#ec5228] rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white ${
                          employment.isCurrentJob ? "opacity-50" : ""
                        }`}
                        showIcon
                        disabled={employment.isCurrentJob}
                        maxDate={new Date()}
                      />
                      <ErrorMessage
                        error={errors[`employment_${index}_endDate`]}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`employmentType-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Employment Type *
                      </label>
                      <select
                        id={`employmentType-${index}`}
                        className={`w-full border-2 ${
                          errors[`employment_${index}_employmentType`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228]"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                        value={employment.employmentType}
                        onChange={(e) =>
                          handleEmploymentChange(
                            index,
                            "employmentType",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Employment Type</option>
                        <option value="Full-time">Full Time</option>
                        <option value="Part-time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Other">Other</option>
                      </select>
                      <ErrorMessage
                        error={errors[`employment_${index}_employmentType`]}
                      />
                    </div>

                    <div className="form-group flex items-center">
                      <div className="flex items-center h-full">
                        <input
                          type="checkbox"
                          id={`currentJob-${index}`}
                          className="h-4 w-4 text-[#ec5228] focus:ring-[#ec5228] border-gray-300 rounded"
                          checked={employment.isCurrentJob}
                          onChange={(e) =>
                            handleEmploymentChange(
                              index,
                              "isCurrentJob",
                              e.target.checked
                            )
                          }
                        />
                        <label
                          htmlFor={`currentJob-${index}`}
                          className="ml-3 text-sm font-medium text-gray-700"
                        >
                          This is my current job
                        </label>
                      </div>
                    </div>
                  </div>

                  {employment.isCurrentJob && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        End date will be treated as ongoing for current position
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Employment Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={addEmployment}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ec5228] to-[#d14a22] hover:from-[#d14a22] hover:to-[#c13d1e] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Another Employment
                </button>
              </div>
            </div>
          </div>

          {/* Salary Slip Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Salary Documentation
                </h2>
              </div>
              <p className="text-white/80 mt-2">
                Upload your recent salary slip for verification (optional but
                recommended)
              </p>
            </div>

            <div className="p-8">
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                <h3 className="text-lg font-semibold text-[#000080] mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Salary Slip (Last 3-6 months)
                </h3>

                <div className="relative">
                  <input
                    id="salarySlip"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={btnDisable}
                    onChange={(e) =>
                      fileChangeHandler(e, undefined, undefined, "salary")
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="salarySlip"
                    className={`w-full border-2 border-dashed border-yellow-300 hover:border-[#ec5228] rounded-xl shadow-sm px-6 py-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white ${
                      btnDisable ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {salarySlip ? (
                      <div className="flex flex-col items-center gap-3 text-green-600">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          Salary slip uploaded successfully!
                        </span>
                        <span className="text-sm font-medium text-[#000080] bg-green-100 px-3 py-1 rounded-full">
                          📄 {truncateFileName(salarySlipName)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Click to replace
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          Upload your salary slip
                        </span>
                        <span className="text-sm">
                          PDF, JPG, JPEG, or PNG files only
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Please upload your salary slip for the last 3-6 months for
                    employment verification (optional but recommended)
                  </p>
                </div>

                <ErrorMessage error={errors.salarySlip} />
              </div>
            </div>
          </div>

          {/* Educational Background Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Educational Background
                </h2>
              </div>
              <p className="text-white/80 mt-2">
                Add your educational qualifications and certifications
              </p>
            </div>

            <div className="p-8 space-y-6">
              {educationDetails.map((edu, index) => (
                <div
                  key={edu.id}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 relative"
                >
                  {/* Delete button for multiple education records */}
                  {educationDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                      title="Delete education record"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#000080] flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      Education Record {index + 1}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label
                        htmlFor={`level-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Level of Education *
                      </label>
                      <select
                        id={`level-${index}`}
                        className={`w-full border-2 ${
                          errors[`education_${index}_level`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228]"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 bg-white`}
                        value={edu.level}
                        onChange={(e) =>
                          handleEducationChange(index, "level", e.target.value)
                        }
                      >
                        <option value="">Select Level of Education</option>
                        <option>High School</option>
                        <option>Diploma</option>
                        <option>Bachelor's Degree</option>
                        <option>Master's Degree</option>
                        <option>Doctorate</option>
                        <option>Other</option>
                      </select>
                      <ErrorMessage
                        error={errors[`education_${index}_level`]}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`degreeName-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Degree/Certification Name *
                      </label>
                      <input
                        id={`degreeName-${index}`}
                        type="text"
                        placeholder="Enter degree or certification name"
                        className={`w-full border-2 ${
                          errors[`education_${index}_degreeName`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228] bg-white"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                        value={edu.degreeName}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "degreeName",
                            e.target.value
                          )
                        }
                      />
                      <ErrorMessage
                        error={errors[`education_${index}_degreeName`]}
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`major-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Major/Specialization
                      </label>
                      <input
                        id={`major-${index}`}
                        type="text"
                        placeholder="Enter major or specialization (optional)"
                        className="w-full border-2 border-gray-200 focus:border-[#ec5228] bg-white rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                        value={edu.major}
                        onChange={(e) =>
                          handleEducationChange(index, "major", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor={`institutionName-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Name of Institution *
                      </label>
                      <input
                        id={`institutionName-${index}`}
                        type="text"
                        placeholder="Enter institution name"
                        className={`w-full border-2 ${
                          errors[`education_${index}_institutionName`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228] bg-white"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                        value={edu.institutionName}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "institutionName",
                            e.target.value
                          )
                        }
                      />
                      <ErrorMessage
                        error={errors[`education_${index}_institutionName`]}
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label
                        htmlFor={`graduationYear-${index}`}
                        className="block text-sm font-semibold text-[#000080] mb-2"
                      >
                        Year of Graduation/Completion *
                      </label>
                      <input
                        id={`graduationYear-${index}`}
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        placeholder="Enter graduation year"
                        className={`w-full border-2 ${
                          errors[`education_${index}_graduationYear`]
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#ec5228] bg-white"
                        } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                        value={edu.graduationYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "graduationYear",
                            e.target.value
                          )
                        }
                      />
                      <ErrorMessage
                        error={errors[`education_${index}_graduationYear`]}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Education Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ec5228] to-[#d14a22] hover:from-[#d14a22] hover:to-[#c13d1e] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Another Education
                </button>
              </div>
            </div>
          </div>

          {/* Bank Account Information Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ec5228] to-[#d14a22] px-8 py-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">
                  Bank Account Information
                </h2>
              </div>
              <p className="text-white/80 mt-2">
                Provide your banking details for salary processing
              </p>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label
                      htmlFor="accountHolder"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Account Holder Name *
                    </label>
                    <input
                      id="accountHolder"
                      type="text"
                      placeholder="Enter account holder name"
                      className={`w-full border-2 ${
                        errors.accountHolder
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                    />
                    <ErrorMessage error={errors.accountHolder} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="bankName"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Bank Name *
                    </label>
                    <input
                      id="bankName"
                      type="text"
                      placeholder="Enter bank name"
                      className={`w-full border-2 ${
                        errors.bankName
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                    <ErrorMessage error={errors.bankName} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="branchName"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Branch Name *
                    </label>
                    <input
                      id="branchName"
                      type="text"
                      placeholder="Enter branch name"
                      className={`w-full border-2 ${
                        errors.branchName
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                    />
                    <ErrorMessage error={errors.branchName} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      Account Number *
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      placeholder="Enter account number"
                      className={`w-full border-2 ${
                        errors.accountNumber
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <ErrorMessage error={errors.accountNumber} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="ifsc"
                      className="block text-sm font-semibold text-[#000080] mb-2"
                    >
                      IFSC Code *
                    </label>
                    <input
                      id="ifsc"
                      type="text"
                      placeholder="Enter IFSC code"
                      className={`w-full border-2 ${
                        errors.ifsc
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                    <ErrorMessage error={errors.ifsc} />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor="upi"
                      className="text-sm font-semibold text-[#000080] mb-2 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      UPI ID / VPA *
                    </label>
                    <input
                      id="upi"
                      type="text"
                      placeholder="Enter UPI ID (e.g., user@paytm)"
                      className={`w-full border-2 ${
                        errors.upi
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-[#ec5228] bg-white"
                      } rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-[#ec5228]/20 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400`}
                      value={upi}
                      onChange={(e) => setUpi(e.target.value)}
                    />
                    <ErrorMessage error={errors.upi} />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
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
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 mb-1">
                        Security Notice
                      </h4>
                      <p className="text-sm text-amber-700">
                        Your banking information is encrypted and securely
                        stored. This information will only be used for salary
                        processing and official payments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoading || btnDisable || mediaProgress}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Submitting Application...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit Application
                </>
              )}
            </button>

            <p className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
              By submitting this application, you confirm that all information
              provided is accurate and complete.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
