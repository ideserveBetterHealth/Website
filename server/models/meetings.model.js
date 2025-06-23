import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    doctorName: {
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
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
