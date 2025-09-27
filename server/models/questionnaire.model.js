import mongoose from "mongoose";

const questionnaireSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["mental_health", "cosmetology"],
      required: true,
    },
    questions: [
      {
        id: {
          type: String,
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: [
            "text",
            "textarea",
            "multiple-choice",
            "multiple-choice-multi",
            "checkbox",
            "scale",
          ],
          required: true,
        },
        options: [
          {
            type: String,
          },
        ],
        required: {
          type: Boolean,
          default: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
questionnaireSchema.index({ serviceType: 1, isActive: 1 });

export const Questionnaire =
  mongoose.models.Questionnaire ||
  mongoose.model("Questionnaire", questionnaireSchema);
