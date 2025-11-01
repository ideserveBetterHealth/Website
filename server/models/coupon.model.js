import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    // Service-specific discount configurations
    serviceDiscounts: [
      {
        serviceType: {
          type: String,
          enum: ["mental_health", "cosmetology"],
          required: true,
        },
        // General discount for this service (fallback if no plan-specific discount)
        discount: {
          type: Number,
          required: true,
        },
        discountType: {
          type: String,
          enum: ["percentage", "fixed"],
          required: true,
        },
        maxDiscountAmount: {
          type: Number,
          default: null,
        },
        minOrderAmount: {
          type: Number,
          default: 0,
        },
        // Plan-specific discounts for this service (optional)
        planDiscounts: [
          {
            sessions: {
              type: Number,
              required: true,
            },
            duration: {
              type: Number,
              required: false, // optional: applies to specific duration
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
            maxDiscountAmount: {
              type: Number,
              default: null,
            },
          },
        ],
      },
    ],
    maxUses: {
      type: Number,
      default: null, // null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
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
