import { Pricing } from "../models/pricing.model.js";
import { User } from "../models/user.model.js";

export const getPricing = async (req, res) => {
  try {
    const { serviceType } = req.query;

    let query = {};
    if (serviceType) query.serviceType = serviceType;

    const pricing = await Pricing.find(query).sort({
      serviceType: 1,
    });

    return res.status(200).json({
      success: true,
      pricing,
    });
  } catch (error) {
    console.log("Error in getPricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get pricing.",
    });
  }
};

export const createPricing = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can create pricing.",
      });
    }

    const { serviceType, sessionCosts } = req.body;

    if (!serviceType || !sessionCosts) {
      return res.status(400).json({
        success: false,
        message: "Service type and session costs are required.",
      });
    }

    // Validate sessionCosts structure
    if (!sessionCosts["50"] || !sessionCosts["80"]) {
      return res.status(400).json({
        success: false,
        message:
          "Session costs must include pricing for both 50 and 80 minute sessions.",
      });
    }

    // Check if pricing already exists for this service type
    const existingPricing = await Pricing.findOne({ serviceType });

    if (existingPricing) {
      return res.status(400).json({
        success: false,
        message: "Pricing already exists for this service type.",
      });
    }

    const pricing = await Pricing.create({
      serviceType,
      sessionCosts,
    });

    return res.status(201).json({
      success: true,
      message: "Pricing created successfully.",
      pricing,
    });
  } catch (error) {
    console.log("Error in createPricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create pricing.",
    });
  }
};

export const updatePricing = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can update pricing.",
      });
    }

    const { id } = req.params;
    const { serviceType, sessionCosts } = req.body;

    // Validate sessionCosts structure if provided
    if (sessionCosts && (!sessionCosts["50"] || !sessionCosts["80"])) {
      return res.status(400).json({
        success: false,
        message:
          "Session costs must include pricing for both 50 and 80 minute sessions.",
      });
    }

    const updateData = {};
    if (serviceType) updateData.serviceType = serviceType;
    if (sessionCosts) updateData.sessionCosts = sessionCosts;

    const pricing = await Pricing.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "Pricing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing updated successfully.",
      pricing,
    });
  } catch (error) {
    console.log("Error in updatePricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pricing.",
    });
  }
};

export const deletePricing = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can delete pricing.",
      });
    }

    const { id } = req.params;

    const pricing = await Pricing.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "Pricing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing deactivated successfully.",
    });
  } catch (error) {
    console.log("Error in deletePricing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete pricing.",
    });
  }
};
