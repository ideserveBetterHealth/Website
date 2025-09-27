import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["mental_health", "cosmetology"],
      required: true,
      unique: true,
    },
    sessionCosts: {
      30: {
        type: Number,
        required: true,
      },
      50: {
        type: Number,
        required: true,
      },
      80: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Index for efficient queries
PricingSchema.index({ serviceType: 1 });

export const Pricing =
  mongoose.models.Pricing || mongoose.model("Pricing", PricingSchema);
