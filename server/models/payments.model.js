import mongoose from "mongoose";

const serviceLinksSchema = new mongoose.Schema({
  single: {
    type: String,
    required: true,
  },
  bundle: {
    type: String,
    required: true,
  },
});

const paymentLinksSchema = new mongoose.Schema({
  mentalHealthCounselling: {
    type: serviceLinksSchema,
    required: true,
  },
  cosmetologistConsultancy: {
    type: serviceLinksSchema,
    required: true,
  },
  // Future services can be added here with single and bundle links
});

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    forNewUsers: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentLinks: {
      type: paymentLinksSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
