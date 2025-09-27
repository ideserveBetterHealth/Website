import { useState } from "react";
import axios from "@/axios";

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
        setError("Please select a valid image file (JPG, JPEG, PNG)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        return;
      }

      setProfilePhoto(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(""); // Clear any previous errors
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview("");
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
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Profile Photo</label>
            <div className="flex flex-col space-y-3">
              {profilePhotoPreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={profilePhotoPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-sm text-center">
                    No photo selected
                  </span>
                </div>
              )}
              <div className="flex justify-center">
                <label className="cursor-pointer bg-[#ec5228] hover:bg-[#d64720] text-white px-4 py-2 rounded text-sm font-medium transition">
                  {profilePhotoPreview ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Recommended: Square image, max 5MB (JPG, PNG)
              </p>
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
