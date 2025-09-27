import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/axios";
import { toast } from "sonner";

const Signup = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    email: "",
    role: "user",
    type: "",
    specialization: "",
    certifications: "",
    experience: "",
    bio: "",
    qualifications: "",
    gender: "",
    dob: "",
    languages: [],
    emergencyContact: {
      name: "",
      relation: "",
      phoneNumber: "",
    },
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");

  axios.defaults.withCredentials = true;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please select a valid image file (JPG, JPEG, PNG).",
          duration: 4000,
        });
        setError("Please select a valid image file (JPG, JPEG, PNG)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Image size must be less than 5MB.",
          duration: 4000,
        });
        setError("Image size must be less than 5MB");
        return;
      }

      setProfilePhoto(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
        toast.success("Profile photo uploaded successfully!", {
          duration: 3000,
        });
      };
      reader.readAsDataURL(file);
      setError(""); // Clear any previous errors
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview("");
    toast.info("Profile photo removed", {
      duration: 2000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.phoneNumber || !formData.name) {
        setError("Phone number and name are required.");
        setLoading(false);
        return;
      }

      if (formData.phoneNumber.length !== 10) {
        setError("Please enter a valid 10-digit phone number.");
        setLoading(false);
        return;
      }

      if (formData.role === "doctor" && !formData.type) {
        setError("Please select a type for doctor role.");
        setLoading(false);
        return;
      }

      if (formData.role === "doctor" && !formData.qualifications.trim()) {
        setError("Qualifications are required for BH Associates.");
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "languages") {
          const filteredLanguages = formData.languages.filter(
            (lang) => lang.trim() !== ""
          );
          formDataToSend.append(key, JSON.stringify(filteredLanguages));
        } else if (key === "emergencyContact") {
          if (formData.emergencyContact.name) {
            formDataToSend.append(
              key,
              JSON.stringify(formData.emergencyContact)
            );
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add phone prefix
      formDataToSend.append("phonePrefix", "+91");

      // Add profile photo if selected
      if (profilePhoto) {
        formDataToSend.append("profilePhoto", profilePhoto);
      }

      const { data } = await axios.post("/user/admin/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(data.message);

      // Reset form after successful creation
      setFormData({
        phoneNumber: "",
        name: "",
        email: "",
        role: "user",
        type: "",
        designation: "",
        expertise: "",
        experience: "",
        bio: "",
        qualifications: "",
        gender: "",
        dob: "",
        languages: [],
        emergencyContact: {
          name: "",
          relation: "",
          phoneNumber: "",
        },
      });

      // Reset photo states
      setProfilePhoto(null);
      setProfilePhotoPreview("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, ""],
    }));
  };

  const updateLanguage = (index, value) => {
    const updated = [...formData.languages];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      languages: updated,
    }));
  };

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: formData.languages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#fffae3] px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#000080]">Create New User</h2>
          <p className="text-sm text-gray-500">
            Admin panel - Create user accounts directly
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="phoneNumber"
                className="font-medium text-gray-700"
              >
                Phone Number *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  +91
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "phoneNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="9876543210"
                  onFocus={() => setMessage("")}
                  required
                  className="flex-1 border rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Deepika Sharma"
                onFocus={() => setMessage("")}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="email" className="font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="deepika@xyz.com"
                onFocus={() => setMessage("")}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="role" className="font-medium text-gray-700">
                Role *
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => {
                  handleInputChange("role", e.target.value);
                  if (e.target.value !== "doctor") {
                    handleInputChange("type", "");
                  }
                }}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              >
                <option value="user">User</option>
                <option value="doctor">BH Associate</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Profile Photo Upload - Available for all users */}
          <div className="space-y-3">
            <label className="font-medium text-gray-700 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
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
              Profile Photo
            </label>

            <div className="flex flex-col items-center space-y-4">
              {/* Photo Preview/Upload Area */}
              <div className="relative group">
                {profilePhotoPreview ? (
                  <div className="relative w-40 h-40 mx-auto">
                    <img
                      src={profilePhotoPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg ring-2 ring-gray-200"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors duration-200"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative w-40 h-40 mx-auto">
                    {/* Upload area */}
                    <label className="block w-full h-full cursor-pointer">
                      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group">
                        <svg
                          className="w-12 h-12 text-gray-400 group-hover:text-gray-500 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-sm text-gray-500 mt-2 font-medium">
                          Upload Photo
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Click to browse
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                {!profilePhotoPreview && (
                  <label className="cursor-pointer bg-[#ec5228] hover:bg-[#d64720] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}

                {profilePhotoPreview && (
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-gray-300">
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}

                {profilePhotoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-red-200"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                )}
              </div>

              {/* File info and requirements */}
              <div className="text-center space-y-1">
                <p className="text-xs text-gray-500">
                  Recommended: Square image, max 5MB
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {formData.role === "doctor" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="type" className="font-medium text-gray-700">
                    Type *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                  >
                    <option value="">Select type</option>
                    <option value="psychologist">Psychologist</option>
                    <option value="cosmetologist">Cosmetologist</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="designation"
                    className="font-medium text-gray-700"
                  >
                    Designation
                  </label>
                  <input
                    id="designation"
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    placeholder="Senior Psychologist"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="expertise"
                    className="font-medium text-gray-700"
                  >
                    Expertise
                  </label>
                  <input
                    id="expertise"
                    type="text"
                    value={formData.expertise}
                    onChange={(e) =>
                      handleInputChange("expertise", e.target.value)
                    }
                    placeholder="Clinical Psychology, CBT"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="experience"
                    className="font-medium text-gray-700"
                  >
                    Experience (Years)
                  </label>
                  <input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    placeholder="5"
                    min="0"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="bio" className="font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="3"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="qualifications"
                  className="font-medium text-gray-700"
                >
                  Qualifications *
                </label>
                <textarea
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) =>
                    handleInputChange("qualifications", e.target.value)
                  }
                  placeholder="M.Phil in Clinical Psychology, RCI License, etc."
                  rows="2"
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                />
              </div>
            </>
          )}

          {/* Additional Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="gender" className="font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="dob" className="font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Languages</label>
            {formData.languages.map((lang, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={lang}
                  onChange={(e) => updateLanguage(index, e.target.value)}
                  placeholder="English"
                  className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
                />
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguage}
              className="text-[#ec5228] hover:text-[#d64720] text-sm font-medium"
            >
              + Add Language
            </button>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">
              Emergency Contact
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  handleEmergencyContactChange("name", e.target.value)
                }
                placeholder="Contact Name"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              />
              <input
                type="text"
                value={formData.emergencyContact.relation}
                onChange={(e) =>
                  handleEmergencyContactChange("relation", e.target.value)
                }
                placeholder="Relation"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              />
              <input
                type="tel"
                value={formData.emergencyContact.phoneNumber}
                onChange={(e) =>
                  handleEmergencyContactChange(
                    "phoneNumber",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                placeholder="Phone Number"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ec5228]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ec5228] hover:bg-[#d64720] disabled:bg-gray-400 text-white font-semibold py-3 rounded transition"
          >
            {loading ? "Creating User..." : "Create User"}
          </button>
        </form>

        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}
        {message && (
          <div className="text-green-600 text-center text-sm">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Signup;
