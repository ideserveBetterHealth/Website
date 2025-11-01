import { Coupon } from "../models/coupon.model.js";
import { User } from "../models/user.model.js";
import { Meeting } from "../models/meetings.model.js";

export const validateCoupon = async (req, res) => {
  try {
    const { code, serviceType, orderAmount, userId, sessions, duration } =
      req.body;

    console.log("Validating coupon:", {
      code,
      serviceType,
      orderAmount,
      sessions,
      duration,
    });

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    if (!serviceType) {
      return res.status(400).json({
        success: false,
        message: "Service type is required.",
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

    // Find service-specific discount configuration
    const serviceDiscount = coupon.serviceDiscounts.find(
      (sd) => sd.serviceType === serviceType
    );

    if (!serviceDiscount) {
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

    // Check minimum order amount for this service
    if (orderAmount && orderAmount < serviceDiscount.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for this coupon is ₹${serviceDiscount.minOrderAmount}.`,
      });
    }

    // Calculate discount with plan-specific support
    let discountAmount = 0;
    let applicableDiscount = serviceDiscount.discount;
    let applicableDiscountType = serviceDiscount.discountType;
    let applicableMaxDiscount = serviceDiscount.maxDiscountAmount;

    // Check if there's a plan-specific discount for this service
    if (
      sessions &&
      serviceDiscount.planDiscounts &&
      serviceDiscount.planDiscounts.length > 0
    ) {
      const planDiscount = serviceDiscount.planDiscounts.find((pd) => {
        // Match by sessions count and optionally by duration
        if (duration) {
          return (
            pd.sessions === sessions &&
            (!pd.duration || pd.duration === duration)
          );
        }
        return pd.sessions === sessions;
      });

      if (planDiscount) {
        applicableDiscount = planDiscount.discount;
        applicableDiscountType = planDiscount.discountType;
        applicableMaxDiscount = planDiscount.maxDiscountAmount;
        console.log("Using plan-specific discount:", planDiscount);
      }
    }

    if (orderAmount) {
      if (applicableDiscountType === "percentage") {
        discountAmount = (orderAmount * applicableDiscount) / 100;
        if (applicableMaxDiscount) {
          discountAmount = Math.min(discountAmount, applicableMaxDiscount);
        }
      } else {
        discountAmount = applicableDiscount;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Coupon is valid.",
      coupon: {
        code: coupon.code,
        discount: applicableDiscount,
        discountType: applicableDiscountType,
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

// New endpoint to calculate discounts for all plans
export const calculateAllPlansDiscounts = async (req, res) => {
  try {
    const { code, serviceType, plans, userId } = req.body;

    console.log("Calculating discounts for all plans:", {
      code,
      serviceType,
      plansCount: plans?.length,
    });

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required.",
      });
    }

    if (!serviceType) {
      return res.status(400).json({
        success: false,
        message: "Service type is required.",
      });
    }

    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Plans array is required.",
      });
    }

    // Find coupon by code and active status
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    // Get current IST time for comparison
    const nowIST = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
    const validFromIST = new Date(coupon.validFrom);
    const validTillIST = new Date(coupon.validTill);

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

    // Find service-specific discount configuration
    const serviceDiscount = coupon.serviceDiscounts.find(
      (sd) => sd.serviceType === serviceType
    );

    if (!serviceDiscount) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not applicable for the selected service.",
      });
    }

    // Check if coupon is for new users only
    if (coupon.isNewUserOnly && userId) {
      const existingMeeting = await Meeting.findOne({ userId });
      const user = await User.findOne({ _id: userId });
      const existingCredits = user.credits;
      console.log(existingCredits);
      if (existingMeeting || existingCredits) {
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

    // Calculate discount for each plan
    const plansWithDiscounts = plans.map((plan) => {
      const { sellingPrice, sessions, duration, name, mrp } = plan;

      // Check minimum order amount for this service
      const meetsMinOrder = sellingPrice >= serviceDiscount.minOrderAmount;

      if (!meetsMinOrder) {
        return {
          ...plan,
          meetsMinOrder: false,
          minOrderAmount: serviceDiscount.minOrderAmount,
          discountAmount: 0,
          finalPrice: sellingPrice,
          discountApplied: false,
        };
      }

      // Find plan-specific discount if exists
      let applicableDiscount = serviceDiscount.discount;
      let applicableDiscountType = serviceDiscount.discountType;
      let applicableMaxDiscount = serviceDiscount.maxDiscountAmount;
      let isPlanSpecific = false;

      if (
        sessions &&
        serviceDiscount.planDiscounts &&
        serviceDiscount.planDiscounts.length > 0
      ) {
        const planDiscount = serviceDiscount.planDiscounts.find((pd) => {
          if (duration) {
            return pd.sessions === sessions && pd.duration === duration;
          }
          return pd.sessions === sessions;
        });

        if (planDiscount) {
          applicableDiscount = planDiscount.discount;
          applicableDiscountType = planDiscount.discountType;
          applicableMaxDiscount = planDiscount.maxDiscountAmount;
          isPlanSpecific = true;
          console.log(
            `Using plan-specific discount for ${sessions} sessions ${duration}min:`,
            planDiscount
          );
        }
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (applicableDiscountType === "percentage") {
        discountAmount = (sellingPrice * applicableDiscount) / 100;
        if (applicableMaxDiscount) {
          discountAmount = Math.min(discountAmount, applicableMaxDiscount);
        }
      } else {
        discountAmount = applicableDiscount;
      }

      const finalPrice = Math.max(0, sellingPrice - discountAmount);

      return {
        name,
        mrp,
        sellingPrice,
        sessions,
        duration,
        meetsMinOrder: true,
        discountAmount,
        finalPrice,
        discountApplied: true,
        isPlanSpecific,
        discountType: applicableDiscountType,
        discount: applicableDiscount,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Discounts calculated successfully.",
      coupon: {
        code: coupon.code,
        description: coupon.description,
        isNewUserOnly: coupon.isNewUserOnly,
      },
      plansWithDiscounts,
    });
  } catch (error) {
    console.log("Error in calculateAllPlansDiscounts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate discounts.",
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
      serviceDiscounts,
      maxUses,
      validFrom,
      validTill,
      isActive,
      isNewUserOnly,
      description,
    } = req.body;

    if (
      !code ||
      !serviceDiscounts ||
      serviceDiscounts.length === 0 ||
      !validFrom ||
      !validTill
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, service discounts, valid from, and valid till are required.",
      });
    }

    // Validate serviceDiscounts structure
    for (const sd of serviceDiscounts) {
      if (!sd.serviceType || !sd.discount || !sd.discountType) {
        return res.status(400).json({
          success: false,
          message:
            "Each service discount must have serviceType, discount, and discountType.",
        });
      }
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
      serviceDiscounts,
      maxUses,
      validFrom: validFromIST,
      validTill: validTillIST,
      isActive: isActive !== undefined ? isActive : true,
      isNewUserOnly: isNewUserOnly || false,
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
    if (serviceType) {
      // Filter coupons that have the specified serviceType in their serviceDiscounts
      query["serviceDiscounts.serviceType"] = serviceType;
    }

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

    // Actually delete the coupon from database
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    console.log("Error in deleteCoupon:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon.",
    });
  }
};
