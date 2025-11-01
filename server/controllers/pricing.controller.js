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

    const { serviceType, plans } = req.body;

    if (!serviceType || !plans) {
      return res.status(400).json({
        success: false,
        message: "Service type and plans are required.",
      });
    }

    // Validate plans structure
    if (!Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Plans must be a non-empty array.",
      });
    }

    for (const plan of plans) {
      if (
        !plan.name ||
        !plan.sessions ||
        !plan.duration ||
        !plan.mrp ||
        !plan.sellingPrice
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each plan must include name, sessions, duration, mrp, and sellingPrice.",
        });
      }
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
      plans,
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
    const { serviceType, plans } = req.body;

    // Validate plans structure if provided
    if (plans) {
      if (!Array.isArray(plans) || plans.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Plans must be a non-empty array.",
        });
      }
      for (const plan of plans) {
        if (
          !plan.name ||
          !plan.sessions ||
          !plan.duration ||
          !plan.mrp ||
          !plan.sellingPrice
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each plan must include name, sessions, duration, mrp, and sellingPrice.",
          });
        }
      }
    }

    const updateData = {};
    if (serviceType) updateData.serviceType = serviceType;
    if (plans) updateData.plans = plans;

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
