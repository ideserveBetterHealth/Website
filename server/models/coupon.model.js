import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    maxUses: {
      type: Number,
      default: null, // null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // for percentage discounts
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNewUserOnly: {
      type: Boolean,
      default: false,
    },
    applicableServices: [
      {
        type: String,
        enum: ["mental_health", "cosmetology"],
      },
    ],
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validTill: 1 });

export const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
