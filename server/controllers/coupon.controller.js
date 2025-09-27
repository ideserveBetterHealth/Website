import { Coupon } from "../models/coupon.model.js";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meetings.model.js";

export const validateCoupon = async (req, res) => {
  try {
    const { code, serviceType, orderAmount, userId } = req.body;

    console.log(code);

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    // First find coupon by code and active status only
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    console.log("Coupon found:", coupon);

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    // Get current IST time for comparison
    const nowIST = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);

    // Database dates are already stored in IST, so direct comparison
    const validFromIST = new Date(coupon.validFrom);
    const validTillIST = new Date(coupon.validTill);

    console.log("Date comparison (IST):", {
      nowIST: nowIST.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      validFromIST: validFromIST.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      validTillIST: validTillIST.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      isAfterValidFrom: nowIST >= validFromIST,
      isBeforeValidTill: nowIST <= validTillIST,
    });

    if (nowIST < validFromIST) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not yet active.",
      });
    }

    if (nowIST > validTillIST) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired.",
      });
    }

    // Check if coupon is applicable for this service
    if (
      coupon.applicableServices.length > 0 &&
      !coupon.applicableServices.includes(serviceType)
    ) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not applicable for the selected service.",
      });
    }

    // Check if coupon is for new users only
    if (coupon.isNewUserOnly && userId) {
      const existingMeeting = await Meeting.findOne({ userId });
      if (existingMeeting) {
        return res.status(400).json({
          success: false,
          message: "This coupon is only valid for new users",
        });
      }
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded.",
      });
    }

    // Check minimum order amount
    if (orderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}.`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (orderAmount) {
      if (coupon.discountType === "percentage") {
        discountAmount = (orderAmount * coupon.discount) / 100;
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
      } else {
        discountAmount = coupon.discount;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Coupon is valid.",
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        discountAmount,
        description: coupon.description,
        isNewUserOnly: coupon.isNewUserOnly,
      },
    });
  } catch (error) {
    console.log("Error in validateCoupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate coupon.",
    });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can create coupons.",
      });
    }

    const {
      code,
      discount,
      discountType,
      maxUses,
      minOrderAmount,
      maxDiscountAmount,
      validFrom,
      validTill,
      isActive,
      isNewUserOnly,
      applicableServices,
      description,
    } = req.body;

    if (!code || !discount || !discountType || !validFrom || !validTill) {
      return res.status(400).json({
        success: false,
        message:
          "Code, discount, discount type, valid from, and valid till are required.",
      });
    }

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon with this code already exists.",
      });
    }

    // Convert input dates to IST before storing
    const validFromDate = new Date(validFrom);
    const validTillDate = new Date(validTill);

    // Add IST offset (UTC + 5:30) to store dates in IST
    const validFromIST = new Date(
      validFromDate.getTime() + 5.5 * 60 * 60 * 1000
    );
    const validTillIST = new Date(
      validTillDate.getTime() + 5.5 * 60 * 60 * 1000
    );

    console.log("Storing coupon dates in IST:", {
      originalValidFrom: validFromDate.toISOString(),
      validFromIST: validFromIST.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      originalValidTill: validTillDate.toISOString(),
      validTillIST: validTillIST.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    });

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      discountType,
      maxUses,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount,
      validFrom: validFromIST,
      validTill: validTillIST,
      isActive: isActive !== undefined ? isActive : true,
      isNewUserOnly: isNewUserOnly || false,
      applicableServices: applicableServices || [],
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    console.log("Error in createCoupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon.",
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can view all coupons.",
      });
    }

    const { isActive, serviceType } = req.query;

    let query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (serviceType) query.applicableServices = serviceType;

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.log("Error in getAllCoupons:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get coupons.",
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can update coupons.",
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Convert code to uppercase if provided
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (error) {
    console.log("Error in updateCoupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coupon.",
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: Only administrators can delete coupons.",
      });
    }

    const { id } = req.params;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deactivated successfully.",
    });
  } catch (error) {
    console.log("Error in deleteCoupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon.",
    });
  }
};
