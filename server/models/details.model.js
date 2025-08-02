import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    personalInfo: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      middleName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      dob: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
        required: true,
      },
      currentAddress: {
        type: String,
        required: true,
      },
      permanentAddress: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, "Please enter a valid postal code"],
      },
      country: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      phone: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
      },
      emergencyContact: {
        name: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
          match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
        },
      },
      resumeUrl: {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: "Please enter a valid URL",
        },
        required: true,
      },
      linkedin: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?linkedin.com\/.+/,
          "Please enter a valid LinkedIn URL",
        ],
      },
      Doc: [
        {
          documentType: { type: String, required: true },
          documentId: { type: String, required: true },
          frontImage: { type: String, required: true },
          backImage: { type: String, required: true },
        },
      ],
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required: true,
      },
    },

    employmentDetails: [
      {
        organization: {
          type: String,
          required: true,
        },
        jobTitle: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          validate: {
            validator: function (v) {
              return !v || v >= this.startDate;
            },
            message: "End date must be after start date",
          },
        },
        employmentType: {
          type: String,
          enum: ["Full-time", "Part-time", "Contract", "Temporary", "Other"],
          required: true,
        },
      },
    ],

    salarySlip: {
      type: String,
      required: false, // Made optional - salary slip is no longer mandatory
      validate: {
        validator: function (v) {
          // Only validate URL format if value is provided
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Please enter a valid URL",
      },
    },

    educationDetails: [
      {
        level: {
          type: String,
          enum: [
            "High School",
            "Diploma",
            "Bachelor's Degree",
            "Master's Degree",
            "Doctorate",
            "Other",
          ],
          required: true,
        },
        degreeName: {
          type: String,
          required: true,
        },
        specialization: {
          type: String,
        },
        institutionName: {
          type: String,
          required: true,
        },
        graduationYear: {
          type: Number,
          required: true,
          min: [1950, "Year must be after 1950"],
          max: [new Date().getFullYear(), "Year cannot be in the future"],
        },
      },
    ],

    bankAccount: {
      accountHolder: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      branchName: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
        minlength: [8, "Account number must be at least 8 characters"],
      },
      ifsc: {
        type: String,
        required: true,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code"],
      },
      upi: {
        type: String,
        match: [/^[\w.-]+@[\w.-]+$/, "Please enter a valid UPI ID"],
        required: true,
      },
    },
    doctorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model("Employee", employeeSchema);
