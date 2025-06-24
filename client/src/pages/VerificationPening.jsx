import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader,
  ArrowLeft,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  GraduationCap,
  CreditCard,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

const VerificationPending = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  axios.defaults.withCredentials = true;

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1/register`;

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch doctor details
  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/doctor-details/${userId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setDoctorData(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast.error("Failed to fetch doctor details");
      navigate("/admin/verify-documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin" && userId) {
      fetchDoctorDetails();
    }
  }, [user, userId]);

  const handleVerifyDoctor = async () => {
    try {
      setVerifying(true);
      const response = await axios.patch(
        `${API_BASE}/verify-doctor/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Doctor verified successfully!");
        navigate("/admin/verify-documents");
      }
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error(error.response?.data?.message || "Failed to verify doctor");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Doctor not found
          </h2>
          <button
            onClick={() => navigate("/admin/verify-documents")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const { user: doctor, employee } = doctorData;

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/verify-documents")}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Verify Documents
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor Verification
          </h1>
        </div>

        {/* Doctor Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-full p-4">
              <span className="text-blue-600 font-semibold text-2xl">
                {doctor.name?.charAt(0)?.toUpperCase() || "D"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600">{doctor.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mt-2">
                Pending Verification
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="text-gray-800">
                {`${employee.personalInfo.firstName} ${
                  employee.personalInfo.middleName || ""
                } ${employee.personalInfo.lastName}`.trim()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Date of Birth
              </label>
              <p className="text-gray-800 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(employee.personalInfo.dob).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Gender
              </label>
              <p className="text-gray-800">{employee.personalInfo.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Blood Group
              </label>
              <p className="text-gray-800">
                {employee.personalInfo.bloodGroup || "Not specified"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="text-gray-800 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {employee.personalInfo.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Phone
              </label>
              <p className="text-gray-800 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {employee.personalInfo.phone}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-500">
              Current Address
            </label>
            <p className="text-gray-800 flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-1" />
              {employee.personalInfo.currentAddress},{" "}
              {employee.personalInfo.city}, {employee.personalInfo.state}{" "}
              {employee.personalInfo.postalCode},{" "}
              {employee.personalInfo.country}
            </p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-500">
              Emergency Contact
            </label>
            <p className="text-gray-800">
              {employee.personalInfo.emergencyContact.name} (
              {employee.personalInfo.emergencyContact.relationship}) -{" "}
              {employee.personalInfo.emergencyContact.phone}
            </p>
          </div>
        </div>

        {/* Legal Documents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Legal Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employee.personalInfo.Doc.map((doc, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  Document {index + 1}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Type: {doc.documentType}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  ID: {doc.documentId}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Front Side</p>
                    <img
                      src={doc.frontImage}
                      alt="Front"
                      className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(doc.frontImage, "_blank")}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Back Side</p>
                    <img
                      src={doc.backImage}
                      alt="Back"
                      className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(doc.backImage, "_blank")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education Details
          </h3>
          <div className="space-y-4">
            {employee.educationDetails.map((edu, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <h4 className="font-semibold text-gray-800">
                  {edu.degreeName}
                </h4>
                <p className="text-gray-600">{edu.institutionName}</p>
                <p className="text-sm text-gray-500">
                  {edu.level} • Graduated: {edu.graduationYear}
                </p>
                {edu.major && (
                  <p className="text-sm text-gray-500">Major: {edu.major}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Employment Details */}
        {employee.employmentDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Employment History
            </h3>
            <div className="space-y-4">
              {employee.employmentDetails.map((job, index) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    {job.jobTitle}
                  </h4>
                  <p className="text-gray-600">{job.organization}</p>
                  <p className="text-sm text-gray-500">
                    {job.employmentType} •{" "}
                    {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {job.endDate
                      ? new Date(job.endDate).toLocaleDateString()
                      : "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bank Account Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Bank Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Account Holder
              </label>
              <p className="text-gray-800">
                {employee.bankAccount.accountHolder}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Bank Name
              </label>
              <p className="text-gray-800">{employee.bankAccount.bankName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Branch
              </label>
              <p className="text-gray-800">{employee.bankAccount.branchName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Account Number
              </label>
              <p className="text-gray-800">
                ****{employee.bankAccount.accountNumber.slice(-4)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                IFSC Code
              </label>
              <p className="text-gray-800">{employee.bankAccount.ifsc}</p>
            </div>
            {employee.bankAccount.upi && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  UPI ID
                </label>
                <p className="text-gray-800">{employee.bankAccount.upi}</p>
              </div>
            )}
          </div>
        </div>

        {/* Salary Slip Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Salary Slips (Last 3-6 Months)
          </h3>

          {employee.salarySlip ? (
            <div className="space-y-4">
              {Array.isArray(employee.salarySlip) ? (
                // If salarySlip is an array
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {employee.salarySlip.map((slip, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Salary Slip {index + 1}
                      </p>
                      <a
                        href={slip}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        <img
                          src={slip}
                          alt={`Salary Slip ${index + 1}`}
                          className="h-32 object-cover w-full rounded cursor-pointer"
                          onClick={() => window.open(slip, "_blank")}
                        />
                        <p className="text-xs text-center text-blue-600 mt-2">
                          View Document
                        </p>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                // If salarySlip is a single string URL
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Salary Documentation
                  </p>
                  <a
                    href={employee.salarySlip}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Salary Document
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No salary slip documentation provided
            </p>
          )}
        </div>

        {/* Resume */}
        {employee.personalInfo.resumeUrl && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
            <a
              href={employee.personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              View Resume
            </a>
          </div>
        )}

        {/* Verification Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Verification Status
              </h3>
              <p className="text-gray-600">
                Review all information and verify this doctor
              </p>
            </div>
            <button
              onClick={handleVerifyDoctor}
              disabled={verifying}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verify Doctor
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
