import { Employee } from "../models/details.model.js";
import { User } from "../models/user.model.js";

export const createEmployee = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "user") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create employee details.",
      });
    }

    const {
      personalInfo,
      employmentDetails,
      salarySlip,
      educationDetails,
      bankAccount,
    } = req.body;

    // Detailed validation with specific error messages
    let validationErrors = [];

    // Check if main sections exist
    if (!personalInfo) {
      validationErrors.push("Personal information is required");
    }
    if (!bankAccount) {
      validationErrors.push("Bank account information is required");
    }
    if (!educationDetails) {
      validationErrors.push("Education details are required");
    }

    // Return early if main sections are missing
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required sections",
        errors: validationErrors,
        receivedData: {
          hasPersonalInfo: !!personalInfo,
          hasEmploymentDetails: !!employmentDetails,
          hasSalarySlip: !!salarySlip,
          hasEducationDetails: !!educationDetails,
          hasBankAccount: !!bankAccount,
        },
      });
    }

    // Validate personal information fields
    const requiredPersonalFields = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "currentAddress",
      "city",
      "state",
      "postalCode",
      "country",
      "email",
      "phone",
      "bloodGroup",
    ];

    for (const field of requiredPersonalFields) {
      if (
        !personalInfo[field] ||
        personalInfo[field].toString().trim() === ""
      ) {
        validationErrors.push(
          `Personal Info: ${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required but received: ${personalInfo[field] || "undefined"}`
        );
      }
    }

    // Validate LinkedIn URL format (optional field)
    if (personalInfo.linkedin && personalInfo.linkedin.trim() !== "") {
      const linkedinPattern = /^https?:\/\/(www\.)?linkedin.com\/.+/;
      if (!linkedinPattern.test(personalInfo.linkedin.trim())) {
        validationErrors.push(
          `LinkedIn URL is invalid. Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/your-profile) or leave it empty if you don't have a LinkedIn profile. Received: ${personalInfo.linkedin}`
        );
      }
    }

    // Validate email format
    if (personalInfo.email) {
      const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailPattern.test(personalInfo.email)) {
        validationErrors.push(
          `Email format is invalid. Please enter a valid email address. Received: ${personalInfo.email}`
        );
      }
    }

    // Validate phone number format
    if (personalInfo.phone) {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(personalInfo.phone)) {
        validationErrors.push(
          `Phone number must be exactly 10 digits. Received: ${personalInfo.phone}`
        );
      }
    }

    // Validate postal code format
    if (personalInfo.postalCode) {
      const postalCodePattern = /^\d{6}$/;
      if (!postalCodePattern.test(personalInfo.postalCode)) {
        validationErrors.push(
          `Postal code must be exactly 6 digits. Received: ${personalInfo.postalCode}`
        );
      }
    }

    // Validate resume URL format
    if (personalInfo.resumeUrl) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(personalInfo.resumeUrl)) {
        validationErrors.push(
          `Resume URL is invalid. Please enter a valid URL starting with http:// or https://. Received: ${personalInfo.resumeUrl}`
        );
      }
    }

    // Validate gender
    if (personalInfo.gender) {
      const validGenders = ["Male", "Female", "Other", "Prefer not to say"];
      if (!validGenders.includes(personalInfo.gender)) {
        validationErrors.push(
          `Gender must be one of: ${validGenders.join(", ")}. Received: ${
            personalInfo.gender
          }`
        );
      }
    }

    // Validate blood group
    if (personalInfo.bloodGroup) {
      const validBloodGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "O+",
        "O-",
        "AB+",
        "AB-",
      ];
      if (!validBloodGroups.includes(personalInfo.bloodGroup)) {
        validationErrors.push(
          `Blood group must be one of: ${validBloodGroups.join(
            ", "
          )}. Received: ${personalInfo.bloodGroup}`
        );
      }
    }

    // Validate emergency contact
    if (!personalInfo.emergencyContact) {
      validationErrors.push("Emergency contact information is required");
    } else {
      const requiredEmergencyFields = ["name", "relationship", "phone"];
      for (const field of requiredEmergencyFields) {
        if (
          !personalInfo.emergencyContact[field] ||
          personalInfo.emergencyContact[field].toString().trim() === ""
        ) {
          validationErrors.push(
            `Emergency Contact: ${
              field.charAt(0).toUpperCase() + field.slice(1)
            } is required but received: ${
              personalInfo.emergencyContact[field] || "undefined"
            }`
          );
        }
      }

      // Validate emergency contact phone format
      if (personalInfo.emergencyContact.phone) {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(personalInfo.emergencyContact.phone)) {
          validationErrors.push(
            `Emergency Contact phone number must be exactly 10 digits. Received: ${personalInfo.emergencyContact.phone}`
          );
        }
      }
    }

    // Validate documents
    if (!personalInfo.Doc) {
      validationErrors.push("Documents array is required");
    } else if (!Array.isArray(personalInfo.Doc)) {
      validationErrors.push(
        `Documents must be an array but received: ${typeof personalInfo.Doc}`
      );
    } else if (personalInfo.Doc.length < 2) {
      validationErrors.push(
        `At least 2 legal documents are required but received: ${personalInfo.Doc.length} document(s)`
      );
    } else {
      // Check for duplicate document types
      if (
        personalInfo.Doc[1]?.documentType === personalInfo.Doc[0]?.documentType
      ) {
        validationErrors.push(
          `Both documents cannot be of the same type. Document 1: ${personalInfo.Doc[0]?.documentType}, Document 2: ${personalInfo.Doc[1]?.documentType}`
        );
      }

      // Validate each document
      for (const [index, doc] of personalInfo.Doc.entries()) {
        const requiredDocFields = [
          "documentType",
          "documentId",
          "frontImage",
          "backImage",
        ];
        for (const field of requiredDocFields) {
          if (!doc[field] || doc[field].toString().trim() === "") {
            validationErrors.push(
              `Document ${index + 1}: ${
                field.charAt(0).toUpperCase() + field.slice(1)
              } is required but received: ${doc[field] || "undefined"}`
            );
          }
        }
      }
    }

    // Validate salary slip (optional)
    // Note: Salary slip is now optional, no validation error if empty

    // Validate employment details if provided
    if (employmentDetails && employmentDetails.length > 0) {
      if (!Array.isArray(employmentDetails)) {
        validationErrors.push(
          `Employment details must be an array but received: ${typeof employmentDetails}`
        );
      } else {
        for (const [index, employment] of employmentDetails.entries()) {
          const requiredEmploymentFields = [
            "organization",
            "jobTitle",
            "startDate",
            "employmentType",
          ];
          for (const field of requiredEmploymentFields) {
            if (
              !employment[field] ||
              employment[field].toString().trim() === ""
            ) {
              validationErrors.push(
                `Employment Record ${index + 1}: ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                } is required but received: ${employment[field] || "undefined"}`
              );
            }
          }

          // Validate employment type
          const validEmploymentTypes = [
            "Full-time",
            "Part-time",
            "Contract",
            "Temporary",
            "Other",
          ];
          if (
            employment.employmentType &&
            !validEmploymentTypes.includes(employment.employmentType)
          ) {
            validationErrors.push(
              `Employment Record ${
                index + 1
              }: Employment type must be one of: ${validEmploymentTypes.join(
                ", "
              )}. Received: ${employment.employmentType}`
            );
          }

          // Validate dates
          if (employment.startDate && employment.endDate) {
            const startDate = new Date(employment.startDate);
            const endDate = new Date(employment.endDate);
            if (endDate < startDate) {
              validationErrors.push(
                `Employment Record ${
                  index + 1
                }: End date must be after start date. Start: ${
                  employment.startDate
                }, End: ${employment.endDate}`
              );
            }
          }
        }
      }
    }

    // Validate education details
    if (!Array.isArray(educationDetails)) {
      validationErrors.push(
        `Education details must be an array but received: ${typeof educationDetails}`
      );
    } else if (educationDetails.length === 0) {
      validationErrors.push("At least one education record is required");
    } else {
      for (const [index, education] of educationDetails.entries()) {
        const requiredEducationFields = [
          "level",
          "degreeName",
          "institutionName",
          "graduationYear",
        ];
        for (const field of requiredEducationFields) {
          if (!education[field] || education[field].toString().trim() === "") {
            validationErrors.push(
              `Education Record ${index + 1}: ${
                field.charAt(0).toUpperCase() + field.slice(1)
              } is required but received: ${education[field] || "undefined"}`
            );
          }
        }

        // Validate graduation year
        if (education.graduationYear) {
          const currentYear = new Date().getFullYear();
          const year = parseInt(education.graduationYear);
          if (isNaN(year) || year < 1950 || year > currentYear) {
            validationErrors.push(
              `Education Record ${
                index + 1
              }: Graduation year must be between 1950 and ${currentYear}. Received: ${
                education.graduationYear
              }`
            );
          }
        }

        // Validate education level
        const validLevels = [
          "High School",
          "Diploma",
          "Bachelor's Degree",
          "Master's Degree",
          "Doctorate",
          "Other",
        ];
        if (education.level && !validLevels.includes(education.level)) {
          validationErrors.push(
            `Education Record ${
              index + 1
            }: Level must be one of: ${validLevels.join(", ")}. Received: ${
              education.level
            }`
          );
        }
      }
    }

    // Validate bank account details
    const requiredBankFields = [
      "accountHolder",
      "bankName",
      "branchName",
      "accountNumber",
      "ifsc",
    ];
    for (const field of requiredBankFields) {
      if (!bankAccount[field] || bankAccount[field].toString().trim() === "") {
        validationErrors.push(
          `Bank Account: ${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required but received: ${bankAccount[field] || "undefined"}`
        );
      }
    }

    // Additional bank account field validations
    if (bankAccount.accountNumber) {
      const accountNumber = bankAccount.accountNumber.toString().trim();
      if (accountNumber.length < 8) {
        validationErrors.push(
          `Bank Account: Account number must be at least 8 characters long. Current length: ${accountNumber.length}. Received: ${accountNumber}`
        );
      }
    }

    if (bankAccount.ifsc) {
      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscPattern.test(bankAccount.ifsc.toString().trim())) {
        validationErrors.push(
          `Bank Account: IFSC code format is invalid. Expected format: 4 letters + 0 + 6 alphanumeric characters (e.g., ABCD0123456). Received: ${bankAccount.ifsc}`
        );
      }
    }

    if (bankAccount.upi) {
      const upiPattern = /^[\w.-]+@[\w.-]+$/;
      if (!upiPattern.test(bankAccount.upi.toString().trim())) {
        validationErrors.push(
          `Bank Account: UPI ID format is invalid. Expected format: username@provider (e.g., user@paytm). Received: ${bankAccount.upi}`
        );
      }
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed - please check the following fields:",
        errors: validationErrors,
        totalErrors: validationErrors.length,
        receivedDataStructure: {
          personalInfo: personalInfo ? Object.keys(personalInfo) : null,
          employmentDetails: employmentDetails
            ? `Array with ${employmentDetails.length} items`
            : null,
          educationDetails: educationDetails
            ? `Array with ${educationDetails.length} items`
            : null,
          bankAccount: bankAccount ? Object.keys(bankAccount) : null,
          salarySlip: !!salarySlip,
        },
      });
    }

    // Clean up the data before saving - remove empty optional fields
    const cleanPersonalInfo = { ...personalInfo };

    // Remove LinkedIn if it's empty or invalid
    if (
      !cleanPersonalInfo.linkedin ||
      cleanPersonalInfo.linkedin.trim() === ""
    ) {
      delete cleanPersonalInfo.linkedin;
    }

    // Remove middleName if it's empty
    if (
      !cleanPersonalInfo.middleName ||
      cleanPersonalInfo.middleName.trim() === ""
    ) {
      delete cleanPersonalInfo.middleName;
    }

    // Remove permanentAddress if it's empty
    if (
      !cleanPersonalInfo.permanentAddress ||
      cleanPersonalInfo.permanentAddress.trim() === ""
    ) {
      delete cleanPersonalInfo.permanentAddress;
    }

    // Clean up education details - remove specialization if empty
    const cleanEducationDetails = educationDetails.map((education) => {
      const cleanEducation = { ...education };
      if (
        !cleanEducation.specialization ||
        cleanEducation.specialization.trim() === ""
      ) {
        delete cleanEducation.specialization;
      }
      return cleanEducation;
    });

    // Clean up employment details - remove endDate if empty
    const cleanEmploymentDetails = employmentDetails
      ? employmentDetails.map((employment) => {
          const cleanEmployment = { ...employment };
          if (!cleanEmployment.endDate) {
            delete cleanEmployment.endDate;
          }
          return cleanEmployment;
        })
      : [];

    // Create and save employee
    const newEmployee = new Employee({
      personalInfo: cleanPersonalInfo,
      employmentDetails: cleanEmploymentDetails,
      salarySlip, // Include salary slip for last 3-6 months
      educationDetails: cleanEducationDetails,
      bankAccount,
      doctorId: user.email,
    });

    await newEmployee.save();

    user.isVerified = "pending";
    await user.save();

    res.status(201).json({
      success: true,
      message: "Employee data saved successfully",
      employeeId: newEmployee._id,
    });
  } catch (error) {
    // Enhanced error handling with detailed information
    console.error("=== CREATE EMPLOYEE ERROR ===");
    console.error("Error Type:", error.name);
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
        kind: err.kind,
      }));

      console.error("Validation Errors Detail:", validationErrors);

      // Create user-friendly error messages
      const userFriendlyErrors = validationErrors.map((err) => {
        // Convert field path to human-readable format
        let fieldName = err.field;
        if (fieldName.includes(".")) {
          const parts = fieldName.split(".");
          if (parts[0] === "bankAccount") {
            fieldName = `Bank Account ${parts[1]}`;
          } else if (parts[0] === "personalInfo") {
            fieldName = `Personal Info ${parts[1]}`;
          } else {
            fieldName = parts.join(" ");
          }
        }

        // Return a user-friendly error message
        return `${fieldName}: ${err.message}`;
      });

      return res.status(400).json({
        success: false,
        message: "Database validation failed",
        errorType: "ValidationError",
        errors: userFriendlyErrors, // Send user-friendly messages
        rawErrors: validationErrors, // Keep original for debugging
        detailedErrors: userFriendlyErrors, // Also provide in detailedErrors for frontend compatibility
      });
    }

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];

      console.error("Duplicate Key Error:", {
        field: duplicateField,
        value: duplicateValue,
      });

      return res.status(400).json({
        success: false,
        message: "Duplicate entry found",
        errorType: "DuplicateKeyError",
        field: duplicateField,
        value: duplicateValue,
        error: `${duplicateField} '${duplicateValue}' already exists in the database`,
      });
    }

    // Log the request body for debugging (be careful with sensitive data in production)
    console.error("Request Body Structure:", {
      hasPersonalInfo: !!req.body.personalInfo,
      hasEmploymentDetails: !!req.body.employmentDetails,
      hasSalarySlip: !!req.body.salarySlip,
      hasEducationDetails: !!req.body.educationDetails,
      hasBankAccount: !!req.body.bankAccount,
    });

    res.status(500).json({
      success: false,
      message: "Failed to save employee data",
      errorType: error.name || "UnknownError",
      error: error.message,
      timestamp: new Date().toISOString(),
      // Only include in development
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
        requestData: {
          hasPersonalInfo: !!req.body.personalInfo,
          hasEmploymentDetails: !!req.body.employmentDetails,
          hasSalarySlip: !!req.body.salarySlip,
          hasEducationDetails: !!req.body.educationDetails,
          hasBankAccount: !!req.body.bankAccount,
        },
      }),
    });
  }
};

export const isVerified = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findOne({
      _id: userId,
      role: { $in: ["doctor", "admin"] },
    });
    if (user && user.isVerified === "not-verified") {
      return res.status(403).json({
        success: false,
        message: "not-verified",
      });
    }
    if (user && user.isVerified === "pending") {
      return res.status(403).json({
        success: false,
        message: "pending",
      });
    } else if (user && user.isVerified === "verified") {
      return res.status(200).json({
        success: true,
        message: "verified",
      });
    }
  } catch (error) {
    console.error("Error checking verification status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check verification status",
    });
  }
};

export const statusPending = async (req, res) => {
  try {
    const user = await User.find({ isVerified: "pending" }).select("-password");
    if (user.length < 1) {
      return res.status(200).json({
        success: true,
        user: [],
        message: "No doctor with pending verification found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Doctors with pending verification found",
      user,
    });
  } catch (error) {
    console.error("Error fetching doctors with pending verification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors with pending verification",
    });
  }
};

// New controller to get doctor details with employee information
export const getDoctorDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Find employee details
    const employee = await Employee.findOne({ doctorId: user.email });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor details found",
      user,
      employee,
    });
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor details",
    });
  }
};

// New controller to verify a doctor
export const verifyDoctor = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.id;

    // Check if the requester is an admin
    const admin = await User.findById(adminId);
    if (admin.role !== "admin" || admin.isVerified !== "verified") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify doctors.",
      });
    }

    // Find and update doctor
    const doctor = await User.findById(userId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doctor.isVerified !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Doctor is not in pending status",
      });
    }

    doctor.isVerified = "verified";
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor verified successfully",
      user: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        isVerified: doctor.isVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify doctor",
    });
  }
};

export const statusVerified = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit 10
    const email = req.query.email; // Get email from query params
    const skip = (page - 1) * limit;

    // Build query object
    let query = { isVerified: "verified" };

    // Add email filter if provided
    if (email) {
      query.email = { $regex: email, $options: "i" }; // Case-insensitive partial match
    }

    const total = await User.countDocuments(query);
    const user = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: user.length ? "Doctors found" : "No doctor found",
      user,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching doctors", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};
