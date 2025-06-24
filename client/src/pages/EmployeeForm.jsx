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

axios.defaults.withCredentials = true;

const initialEmployment = {
  organization: "",
  jobTitle: "",
  startDate: null,
  endDate: null,
  employmentType: "",
  isCurrentJob: false, // Add this new field
};

const initialEducation = {
  level: "", // Changed from educationLevel
  degreeName: "", // Changed from degree
  institutionName: "", // Changed from institution
  graduationYear: "",
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
    initialEmployment,
  ]);
  const [educationDetails, setEducationDetails] = useState([initialEducation]);
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

  const [document2Type, setDocument2Type] = useState("");
  const [documentId2, setDocumentId2] = useState("");
  const [frontImage2, setFrontImage2] = useState(null);
  const [backImage2, setBackImage2] = useState(null);

  // New state for salary slip
  const [salarySlip, setSalarySlip] = useState("");

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
    setEmploymentDetails([...employmentDetails, initialEmployment]);
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
    setEducationDetails([...educationDetails, initialEducation]);
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
        newErrors[`employment[${index}].organization`] =
          "Organization is required";
      if (!employment.jobTitle.trim())
        newErrors[`employment[${index}].jobTitle`] = "Job title is required";
      if (!employment.startDate)
        newErrors[`employment[${index}].startDate`] = "Start date is required";
      if (!employment.employmentType)
        newErrors[`employment[${index}].employmentType`] =
          "Employment type is required";
      if (!employment.isCurrentJob && !employment.endDate)
        newErrors[`employment[${index}].endDate`] =
          "End date is required for previous jobs";
    });

    // Salary slip validation
    if (!salarySlip) newErrors.salarySlip = "Salary slip is required";

    // Education validation
    educationDetails.forEach((edu, index) => {
      if (!edu.level)
        newErrors[`education[${index}].level`] = "Education level is required";
      if (!edu.degreeName.trim())
        newErrors[`education[${index}].degreeName`] = "Degree name is required";
      if (!edu.institutionName.trim())
        newErrors[`education[${index}].institutionName`] =
          "Institution name is required";
      if (!edu.graduationYear.trim())
        newErrors[`education[${index}].graduationYear`] =
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Show all errors in toast
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        // Show first 3 errors in toast
        const mainErrors = errorKeys.slice(0, 3).map((key) => errors[key]);
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
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }

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
      toast.error(error.data?.message || "Something went wrong");
    } finally {
      refetch();
    }
  };

  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(false);

  const MEDIA_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/media`;

  const fileChangeHandler = async (
    e,
    order = undefined,
    side,
    type = "document"
  ) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        setBtnDisable(true);
        const res = await axios.post(`${MEDIA_API}/upload-media`, formData, {
          withCredentials: true,
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          console.log("Media uploaded successfully:", res.data);
          if (order === undefined && type === "resume") {
            setResumeUrl(res.data.data.url);
          }
          if (order === undefined && type === "salary") {
            setSalarySlip(res.data.data.url);
          }
          if (order === 1) {
            if (side === "front") {
              setFrontImage1(res.data.data.url);
            } else {
              setBackImage1(res.data.data.url);
            }
          }
          if (order === 2) {
            if (side === "front") {
              setFrontImage2(res.data.data.url);
            } else {
              setBackImage2(res.data.data.url);
            }
          }
        }
        toast.success(res.data.message);
      } catch (error) {
        toast.error("Something is wrong.");
        console.log(error);
      } finally {
        setMediaProgress(false);
        setBtnDisable(false);
      }
    }
  };

  if (userIsLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="h-16 w-16 animate-spin text-orange-200" />
      </div>
    );
  }

  if (user?.role !== "doctor") {
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4 space-y-4 mt-24"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 pb-4 border-b">
          Personal Information
        </h2>

        <div className="form-group">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className={`w-full border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          <ErrorMessage error={errors.firstName} />
        </div>

        <div className="form-group">
          <label
            htmlFor="middleName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Middle Name (Optional)
          </label>
          <input
            id="middleName"
            name="middleName"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Middle Name (Optional)"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className={`w-full border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <ErrorMessage error={errors.lastName} />
        </div>

        <div className="form-group">
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Birth
          </label>
          <Calendar
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.value)}
            placeholder="Date of Birth"
            className="w-full"
            inputClassName="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            showIcon
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="currentAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Current Residential Address
          </label>
          <textarea
            id="currentAddress"
            name="currentAddress"
            placeholder="Current Residential Address"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={currentAddress}
            onChange={(e) => {
              setCurrentAddress(e.target.value);
              if (sameAddress) setPermanentAddress(e.target.value);
            }}
          />
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={handleSameAddressChange}
          />
          <span>Permanent address same as current</span>
        </label>

        <div className="form-group">
          <label
            htmlFor="permanentAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Permanent Address
          </label>
          <textarea
            id="permanentAddress"
            name="permanentAddress"
            placeholder="Permanent Address"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={permanentAddress}
            onChange={(e) => setPermanentAddress(e.target.value)}
            disabled={sameAddress}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            City/Town
          </label>
          <input
            id="city"
            name="city"
            placeholder="City/Town"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            State/Province
          </label>
          <input
            id="state"
            name="state"
            placeholder="State/Province"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Postal Code/Zip Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            placeholder="Postal Code/Zip Code"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country
          </label>
          <select
            id="country"
            name="country"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            <option>India</option>
            <option>USA</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Personal Email Address
          </label>
          <input
            id="email"
            name="email"
            placeholder="Personal Email Address"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Personal Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="Personal Phone Number"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="emergencyContactName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Emergency Contact Name
          </label>
          <input
            id="emergencyContactName"
            name="emergencyContactName"
            placeholder="Emergency Contact Name"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="emergencyContactRelationship"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Emergency Contact Relationship
          </label>
          <input
            id="emergencyContactRelationship"
            name="emergencyContactRelationship"
            placeholder="Emergency Contact Relationship"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={emergencyContactRelationship}
            onChange={(e) => setEmergencyContactRelationship(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="emergencyContactPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Emergency Contact Phone Number
          </label>
          <input
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            placeholder="Emergency Contact Phone Number"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Resume
          </label>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf"
            disabled={btnDisable}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) =>
              fileChangeHandler(e, undefined, undefined, "resume")
            }
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="bloodGroup"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Blood Group
          </label>
          <input
            id="bloodGroup"
            name="bloodGroup"
            placeholder="Blood Group"
            className={`w-full border ${
              errors.bloodGroup ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
          <ErrorMessage error={errors.bloodGroup} />
        </div>

        <div className="form-group">
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            LinkedIn Account (Optional)
          </label>
          <input
            id="linkedin"
            name="linkedin"
            placeholder="LinkedIn Account (Optional)"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>

        <div className="form-group border p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4">LEGAL DOCUMENT 1</h3>

          <div className="mb-4">
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={document1Type}
              onChange={(e) => setDocument1Type(e.target.value)}
            >
              <option value="">SELECT DOCUMENT</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="dl">Driving License</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="DOCUMENT ID"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={documentId1}
              onChange={(e) => setDocumentId1(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 font-medium">FRONT SIDE</p>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
                disabled={btnDisable}
                onChange={(e) => fileChangeHandler(e, 1, "front")}
              />
            </div>
            <div>
              <p className="mb-2 font-medium">BACK SIDE</p>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
                disabled={btnDisable}
                onChange={(e) => fileChangeHandler(e, 1, "back")}
              />
            </div>
          </div>
        </div>

        <div className="form-group border p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4">LEGAL DOCUMENT 2</h3>

          <div className="mb-4">
            <select
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={document2Type}
              onChange={(e) => setDocument2Type(e.target.value)}
            >
              <option value="">SELECT DOCUMENT</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="dl">Driving License</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="DOCUMENT ID"
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={documentId2}
              onChange={(e) => setDocumentId2(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 font-medium">FRONT SIDE</p>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
                disabled={btnDisable}
                onChange={(e) => fileChangeHandler(e, 2, "front")}
              />
            </div>
            <div>
              <p className="mb-2 font-medium">BACK SIDE</p>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
                disabled={btnDisable}
                onChange={(e) => fileChangeHandler(e, 2, "back")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 pb-4 border-b mt-8">
          Employment Details
        </h2>
        {employmentDetails.map((employment, index) => (
          <div key={index} className="border p-4 rounded-md mb-4 relative">
            {/* Add delete button at the top-right */}
            {employmentDetails.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmployment(index)}
                className="absolute top-2 right-2 px-2 py-1 text-red-600 hover:text-red-800 font-medium rounded-md hover:bg-red-50 transition-colors"
              >
                <span className="sr-only">Delete employment record</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization *
                </label>
                <input
                  type="text"
                  placeholder="Organization"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={employment.organization}
                  onChange={(e) =>
                    handleEmploymentChange(
                      index,
                      "organization",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="Job Title"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={employment.jobTitle}
                  onChange={(e) =>
                    handleEmploymentChange(index, "jobTitle", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <Calendar
                  id={`startDate-${index}`}
                  value={employment.startDate}
                  onChange={(e) =>
                    handleEmploymentChange(index, "startDate", e.value)
                  }
                  placeholder="Select Start Date"
                  className="w-full"
                  inputClassName={calendarInputStyle}
                  showIcon
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date {!employment.isCurrentJob && "*"}
                </label>
                <Calendar
                  id={`endDate-${index}`}
                  value={employment.endDate}
                  onChange={(e) =>
                    handleEmploymentChange(index, "endDate", e.value)
                  }
                  placeholder="Select End Date"
                  className="w-full"
                  inputClassName={calendarInputStyle}
                  showIcon
                  disabled={employment.isCurrentJob}
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type *
                </label>
                <select
                  id={`employmentType-${index}`}
                  name="employmentType"
                  value={employment.employmentType}
                  onChange={(e) =>
                    handleEmploymentChange(
                      index,
                      "employmentType",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-time">Full Time</option>
                  <option value="Part-time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`currentJob-${index}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
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
                    className="text-sm font-medium text-gray-700"
                  >
                    This is my current job
                  </label>
                </div>
                {employment.isCurrentJob && (
                  <p className="text-sm text-gray-500 mt-1">
                    End date will be treated as ongoing
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEmployment}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Another Employment
        </button>
      </div>

      <div className="form-group">
        <label
          htmlFor="salarySlip"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Salary Slip (Last 3-6 months) *
        </label>
        <input
          id="salarySlip"
          name="salarySlip"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={btnDisable}
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => fileChangeHandler(e, undefined, undefined, "salary")}
        />
        <p className="text-sm text-gray-600 mt-1">
          Please upload your salary slip for the last 3-6 months (PDF, JPG, or
          PNG format)
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 pb-4 border-b mt-8">
        Educational Background
      </h2>
      {educationDetails.map((edu, index) => (
        <div
          key={index}
          className="border rounded-md p-6 space-y-4 relative bg-white shadow-sm"
        >
          {/* Add delete button at the top */}
          {educationDetails.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-2 right-2 px-2 py-1 text-red-600 hover:text-red-800 font-medium rounded-md hover:bg-red-50 transition-colors"
            >
              <span className="sr-only">Delete education record</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          <div className="form-group">
            <label
              htmlFor={`level-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Level of Education
            </label>
            <select
              id={`level-${index}`}
              name="level"
              value={edu.level}
              onChange={(e) =>
                handleEducationChange(index, "level", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Level of Education</option>
              <option>High School</option>
              <option>Diploma</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>Doctorate</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label
              htmlFor={`degreeName-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Degree/Certification Name
            </label>
            <input
              id={`degreeName-${index}`}
              name="degreeName"
              placeholder="Degree/Certification Name"
              value={edu.degreeName}
              onChange={(e) =>
                handleEducationChange(index, "degreeName", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor={`major-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Major/Specialization (Optional)
            </label>
            <input
              id={`major-${index}`}
              name="major"
              placeholder="Major/Specialization (Optional)"
              value={edu.major}
              onChange={(e) =>
                handleEducationChange(index, "major", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor={`institutionName-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name of Institution
            </label>
            <input
              id={`institutionName-${index}`}
              name="institutionName"
              placeholder="Name of Institution"
              value={edu.institutionName}
              onChange={(e) =>
                handleEducationChange(index, "institutionName", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor={`graduationYear-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year of Graduation/Completion
            </label>
            <input
              id={`graduationYear-${index}`}
              name="graduationYear"
              placeholder="Year of Graduation/Completion"
              value={edu.graduationYear}
              onChange={(e) =>
                handleEducationChange(index, "graduationYear", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Another Education
      </button>

      <h2 className="text-2xl font-bold text-gray-800 pb-4 border-b mt-8">
        Bank Account Information
      </h2>

      <div className="space-y-4 border rounded-md p-6 bg-white shadow-sm">
        <div className="form-group">
          <label
            htmlFor="accountHolder"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Account Holder Name
          </label>
          <input
            id="accountHolder"
            name="accountHolder"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="Account Holder Name"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="bankName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bank Name
          </label>
          <input
            id="bankName"
            name="bankName"
            placeholder="Bank Name"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="branchName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Branch Name
          </label>
          <input
            id="branchName"
            name="branchName"
            placeholder="Branch Name"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="accountNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Account Number
          </label>
          <input
            id="accountNumber"
            name="accountNumber"
            placeholder="Account Number"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="ifsc"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            IFSC Code
          </label>
          <input
            id="ifsc"
            name="ifsc"
            placeholder="IFSC Code"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="upi"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            UPI ID / VPA
          </label>
          <input
            id="upi"
            name="upi"
            placeholder="UPI ID / VPA"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || btnDisable || mediaProgress}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
