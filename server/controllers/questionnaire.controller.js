import { Questionnaire } from "../models/questionnaire.model.js";
import { User } from "../models/user.model.js";

export const getQuestionnaire = async (req, res) => {
  try {
    const { serviceType } = req.params;

    const questionnaire = await Questionnaire.findOne({
      serviceType,
      isActive: true,
    });

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found for this service type.",
      });
    }

    // Sort questions by order - create a copy to avoid mutating the original
    const sortedQuestionnaire = {
      ...questionnaire.toObject(),
      questions: [...questionnaire.questions].sort((a, b) => a.order - b.order),
    };

    return res.status(200).json({
      success: true,
      questionnaire: sortedQuestionnaire,
    });
  } catch (error) {
    console.log("Error in getQuestionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get questionnaire.",
    });
  }
};

export const createQuestionnaire = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message:
          "Access denied: Only administrators can create questionnaires.",
      });
    }

    const { serviceType, questions } = req.body;

    if (!serviceType || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Service type and questions array are required.",
      });
    }

    // Check if questionnaire already exists
    const existingQuestionnaire = await Questionnaire.findOne({ serviceType });
    if (existingQuestionnaire) {
      return res.status(400).json({
        success: false,
        message: "Questionnaire already exists for this service type.",
      });
    }

    const questionnaire = await Questionnaire.create({
      serviceType,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Questionnaire created successfully.",
      questionnaire,
    });
  } catch (error) {
    console.log("Error in createQuestionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create questionnaire.",
    });
  }
};

export const updateQuestionnaire = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message:
          "Access denied: Only administrators can update questionnaires.",
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const questionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Questionnaire updated successfully.",
      questionnaire,
    });
  } catch (error) {
    console.log("Error in updateQuestionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update questionnaire.",
    });
  }
};

export const deleteQuestionnaire = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message:
          "Access denied: Only administrators can delete questionnaires.",
      });
    }

    const { id } = req.params;

    const questionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Questionnaire deactivated successfully.",
    });
  } catch (error) {
    console.log("Error in deleteQuestionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete questionnaire.",
    });
  }
};
