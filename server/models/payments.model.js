import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    associateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BHAssociate",
      required: false,
    },
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },
    serviceType: {
      type: String,
      enum: ["mental_health", "cosmetology", "other"],
      required: true,
    },
    sessions: {
      type: Number,
      default: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "completed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    paymentTime: {
      type: Date,
      default: null,
    },
    bankReference: {
      type: String,
      default: null,
    },
    paymentMessage: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    paymentGatewayOrderId: {
      type: String,
      default: null,
    },
    finalAmount: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
    },
    sessionType: {
      type: String,
      enum: ["single", "pack", "custom", "credits"],
      default: null,
    },
    creditsCount: {
      type: Number,
      default: null,
    },
    isCreditsOnly: {
      type: Boolean,
      default: false,
    },
    appliedCoupon: {
      code: String,
      discount: Number,
      discountType: String,
    },
    appointmentDate: {
      type: Date,
      default: null,
    },
    appointmentTime: {
      type: String,
      default: null,
    },
    questionnaireResponses: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Update the updatedAt field before saving
paymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Payment = mongoose.model("Payment", paymentSchema);
