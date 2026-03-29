import mongoose from "mongoose";

const meetingAddressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      default: "India",
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit PIN code"],
    },
    flatHouseBuilding: {
      type: String,
      required: true,
      trim: true,
    },
    areaStreetSectorVillage: {
      type: String,
      required: false,
      trim: true,
    },
    landmark: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    bhAssocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bhAssocName: {
      type: String,
      required: true,
      trim: true,
    },
    meetingDate: {
      type: Date,
      required: true,
    },
    meetingTime: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    meetingLink: {
      type: String,
      required: false,
      default: null,
    },
    formLink: {
      type: String,
      required: false,
      default: null,
    },
    userJoinedAt: {
      type: String,
      required: false,
      default: null,
    },
    docJoinedAt: {
      type: String,
      required: false,
      default: null,
    },
    serviceType: {
      type: String,
      enum: ["mental_health", "cosmetology", "homeopathy"],
      required: true,
    },
    address: {
      type: meetingAddressSchema,
      default: null,
    },
    questionnaireResponses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },
  },
  { timestamps: true },
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
