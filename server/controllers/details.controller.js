import { Employee } from "../models/details.model.js";
import { User } from "../models/user.model.js";

export const createEmployee = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (user.role !== "doctor" || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create employee details.",
      });
    }
    const {
      personalInfo,
      employmentDetails,
      salarySlip, // Add this back for last 3-6 months
      educationDetails,
      bankAccount,
    } = req.body;

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
      if (!personalInfo[field]) {
        return res.status(400).json({
          success: false,
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        });
      }
    }

    const requiredEmergencyFields = ["name", "relationship", "phone"];
    for (const field of requiredEmergencyFields) {
      if (!personalInfo.emergencyContact?.[field]) {
        return res.status(400).json({
          success: false,
          message: `Emergency contact ${field} is required`,
        });
      }
    }

    if (!Array.isArray(personalInfo.Doc) || personalInfo.Doc.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 legal documents are required",
      });
    }

    if (
      personalInfo.Doc[1]?.documentType === personalInfo.Doc[0]?.documentType
    ) {
      return res.status(400).json({
        success: false,
        message: "Both documents cannot be of the same type",
      });
    }

    for (const [index, doc] of personalInfo.Doc.entries()) {
      const requiredDocFields = [
        "documentType",
        "documentId",
        "frontImage",
        "backImage",
      ];
      for (const field of requiredDocFields) {
        if (!doc[field]) {
          return res.status(400).json({
            success: false,
            message: `Document ${index + 1}: ${field} is required`,
          });
        }
      }
    }

    // Validate salary slip (for last 3-6 months)
    if (!salarySlip) {
      return res.status(400).json({
        success: false,
        message: "Salary slip for last 3-6 months is required",
      });
    }

    if (employmentDetails?.length > 0) {
      for (const [index, employment] of employmentDetails.entries()) {
        const requiredEmploymentFields = [
          "organization",
          "jobTitle",
          "startDate",
          "employmentType",
        ];
        for (const field of requiredEmploymentFields) {
          if (!employment[field]) {
            return res.status(400).json({
              success: false,
              message: `Employment record ${index + 1}: ${field} is required`,
            });
          }
        }
      }
    }

    if (!Array.isArray(educationDetails) || educationDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one education record is required",
      });
    }

    for (const [index, education] of educationDetails.entries()) {
      const requiredEducationFields = [
        "level",
        "degreeName",
        "institutionName",
        "graduationYear",
      ];
      for (const field of requiredEducationFields) {
        if (!education[field]) {
          return res.status(400).json({
            success: false,
            message: `Education record ${index + 1}: ${field} is required`,
          });
        }
      }
    }

    const requiredBankFields = [
      "accountHolder",
      "bankName",
      "branchName",
      "accountNumber",
      "ifsc",
    ];
    for (const field of requiredBankFields) {
      if (!bankAccount[field]) {
        return res.status(400).json({
          success: false,
          message: `Bank account ${field} is required`,
        });
      }
    }

    // Create and save employee
    const newEmployee = new Employee({
      personalInfo,
      employmentDetails,
      salarySlip, // Include salary slip for last 3-6 months
      educationDetails,
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
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry found",
        error: Object.keys(error.keyPattern)
          .map((key) => `${key} already exists`)
          .join(", "),
      });
    }

    console.error("Error saving employee data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save employee data",
      error: error.message,
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
