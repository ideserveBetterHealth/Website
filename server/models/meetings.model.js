import mongoose from "mongoose";

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
      required: true,
    },
    formLink: {
      type: String,
      required: true,
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
      enum: ["mental_health", "cosmetology"],
      required: true,
    },
    questionnaireResponses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
