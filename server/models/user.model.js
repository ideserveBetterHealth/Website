import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },
    phonePrefix: {
      type: String,
      required: true,
      default: "+91",
    },
    email: {
      type: String,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },
    type: {
      type: String,
      enum: ["psychologist", "cosmetologist"],
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: String,
      enum: ["not-verified", "pending", "verified"],
      default: "not-verified",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    credits: [
      {
        serviceType: {
          type: String,
          enum: ["mental_health", "cosmetology"],
          required: true,
        },
        duration: { type: Number, enum: [30, 50, 80], required: true }, // 30, 50 or 80 minutes
        count: { type: Number, default: 0 }, // how many left
      },
    ],
    aboutUser: {
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer-not-to-say"],
        required: false,
      },
      dob: {
        type: Date,
        required: false,
      },
      languages: [
        {
          type: String,
        },
      ],
      emergencyContact: {
        name: {
          type: String,
          required: false,
        },
        relation: {
          type: String,
          required: false,
        },
        phoneNumber: {
          type: String,
          required: false,
          match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
        },
      },
      concerns: [
        {
          type: String,
        },
      ],
      goals: [
        {
          type: String,
        },
      ],
      additionalInfo: [
        {
          question: {
            type: String,
            required: false,
          },
          answer: {
            type: String,
            required: false,
          },
        },
      ],
    },
    agreedToTerms: {
      type: Boolean,
      default: false,
    },
    privacyAcceptedAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
    lastActiveAt: { type: String },
  },
  { timestamps: true }
);

// Indexes for better performance
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

export const User = mongoose.model("User", userSchema);
