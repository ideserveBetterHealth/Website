import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["mental_health", "cosmetology"],
      required: true,
      unique: true,
    },
    plans: [
      {
        name: {
          type: String,
          required: true,
        },
        sessions: {
          type: Number,
          required: true,
        },
        duration: {
          type: Number,
          required: true, // in minutes
        },
        mrp: {
          type: Number,
          required: true,
        },
        sellingPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for efficient queries
PricingSchema.index({ serviceType: 1 });

export const Pricing =
  mongoose.models.Pricing || mongoose.model("Pricing", PricingSchema);
