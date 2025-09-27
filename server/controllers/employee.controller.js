import { User } from "../models/user.model.js";
import BHAssociate from "../models/bhAssociate.model.js";

export const register = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin" || user.isVerified !== "verified") {
      return res.status(403).json({
        message:
          "Access denied: Only verified administrators can access this resource.",
      });
    }

    const {
      name,
      phoneNumber,
      role,
      type,
      specialization,
      bio,
      experience,
      certifications,
    } = req.body;

    if (!name || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, and role are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number.",
      });
    }

    // Create user
    const newUser = await User.create({
      name,
      phoneNumber,
      role,
      type,
      otpVerified: true, // Admin created users are automatically verified
      profileCompleted: true,
      isVerified: "verified",
    });

    // If creating a doctor/associate, create BHAssociate record
    if (role === "doctor" && type) {
      await BHAssociate.create({
        userId: newUser._id,
        specialization,
        bio,
        experience,
        certifications: certifications || [],
        availability: [], // To be set later
      });
    }

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in register employee:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register employee.",
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can access this resource.",
      });
    }

    const employees = await User.find({ role: { $in: ["doctor", "admin"] } })
      .select("-otp -otpExpiry")
      .populate({
        path: "_id",
        model: "BHAssociate",
        localField: "_id",
        foreignField: "userId",
        as: "associateInfo",
      });

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.log("Error in getAllEmployees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get employees.",
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can access this resource.",
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-otp -otpExpiry");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateEmployee:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update employee.",
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can access this resource.",
      });
    }

    const { id } = req.params;

    // Soft delete by setting isActive to false
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-otp -otpExpiry");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deactivated successfully.",
    });
  } catch (error) {
    console.log("Error in deleteEmployee:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete employee.",
    });
  }
};
