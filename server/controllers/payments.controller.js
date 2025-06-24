import { Coupon } from "../models/payments.model.js";
import { User } from "../models/user.model.js";

export const verifyCoupon = async (req, res) => {
  try {
    const { couponCode, email, isExistingUser } = req.body;
    const { service, planType } = req.params; // Get both service and planType from URL params

    // Validate service parameter
    const validServices = [
      "mentalHealthCounselling",
      "mental-Health-Counselling",
      "cosmetologistConsultancy",
      "cosmetologist-Consultancy",
    ];

    // Convert URL format to database format
    let serviceKey = service
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .toLowerCase();
    if (serviceKey === "mentalhealthcounselling") {
      serviceKey = "mentalHealthCounselling";
    } else if (serviceKey === "cosmetologistconsultancy") {
      serviceKey = "cosmetologistConsultancy";
    }

    if (
      !["mentalHealthCounselling", "cosmetologistConsultancy"].includes(
        serviceKey
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Validate plan type
    const validPlanTypes = ["single", "bundle"];
    if (!planType || !validPlanTypes.includes(planType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Plan type is required. Must be either "single" or "bundle"',
      });
    }

    const planTypeKey = planType.toLowerCase();

    // Find the coupon
    const coupon = await Coupon.findOne({
      couponCode: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Handle existing users
    if (isExistingUser) {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required for existing users",
        });
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please register as a new user.",
        });
      }

      // Check if coupon is for existing users (should be false for existing users)
      if (coupon.forNewUsers) {
        return res.status(400).json({
          success: false,
          message: "This coupon is only valid for new users",
        });
      }
    } else {
      // Handle new users
      if (!coupon.forNewUsers) {
        return res.status(400).json({
          success: false,
          message: "This coupon is only valid for existing users",
        });
      }
    }

    // Get the payment link for the specified service and plan type
    const serviceLinks = coupon.paymentLinks[serviceKey];

    if (!serviceLinks) {
      return res.status(400).json({
        success: false,
        message: "Service not available for this coupon",
      });
    }

    const paymentLink = serviceLinks[planTypeKey];

    if (!paymentLink) {
      return res.status(400).json({
        success: false,
        message: `${planType} plan not available for this service`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon verified successfully",
      data: {
        paymentLink,
        service: service,
        planType: planType,
      },
    });
  } catch (error) {
    console.error("Error verifying coupon:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get default payment links (when no coupon is used)
export const getDefaultPaymentLinks = async (req, res) => {
  try {
    const { service, planType } = req.params; // Get both from URL params

    // Convert URL format to database format
    let serviceKey = service
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .toLowerCase();
    if (serviceKey === "mentalhealthcounselling") {
      serviceKey = "mentalHealthCounselling";
    } else if (serviceKey === "cosmetologistconsultancy") {
      serviceKey = "cosmetologistConsultancy";
    }

    if (
      !["mentalHealthCounselling", "cosmetologistConsultancy"].includes(
        serviceKey
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Validate plan type
    const validPlanTypes = ["single", "bundle"];
    if (!planType || !validPlanTypes.includes(planType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Plan type is required. Must be either "single" or "bundle"',
      });
    }

    const planTypeKey = planType.toLowerCase();

    // Default payment links (hardcoded for now)
    const defaultPaymentLinks = {
      mentalHealthCounselling: {
        single:
          "https://payments.cashfree.com/forms/single-mental-health-counselling-session",
        bundle: "https://payments.cashfree.com/forms/03mhcs",
      },
      cosmetologistConsultancy: {
        single: "https://ideservebetterhealth.in",
        bundle: "https://ideservebetterhealth.in",
      },
    };

    const paymentLink = defaultPaymentLinks[serviceKey][planTypeKey];

    res.status(200).json({
      success: true,
      data: {
        paymentLink,
        service: service,
        planType: planType,
      },
    });
  } catch (error) {
    console.error("Error getting default payment links:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can create meetings.",
    });
  }
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Coupons retrieved successfully",
      data: coupons,
    });
  } catch (error) {
    console.error("Error getting all coupons:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update coupon status (activate/deactivate)
export const updateCouponStatus = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user?.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can create meetings.",
    });
  }
  try {
    const { couponId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      { isActive },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Coupon ${isActive ? "activated" : "deactivated"} successfully`,
      data: coupon,
    });
  } catch (error) {
    console.error("Error updating coupon status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can create meetings.",
    });
  }
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: { deletedCoupon: coupon.couponCode },
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create a new coupon (admin function)
export const createCoupon = async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
  const role = user.role;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Only administrators can create meetings.",
    });
  }

  try {
    const couponData = req.body;

    // Validate the structure of paymentLinks
    const requiredServices = [
      "mentalHealthCounselling",
      "cosmetologistConsultancy",
    ];
    const requiredPlans = ["single", "bundle"];

    if (couponData.paymentLinks) {
      for (const service of requiredServices) {
        if (couponData.paymentLinks[service]) {
          for (const plan of requiredPlans) {
            if (!couponData.paymentLinks[service][plan]) {
              return res.status(400).json({
                success: false,
                message: `Missing ${plan} plan link for ${service}`,
              });
            }
          }
        }
      }
    }

    const newCoupon = new Coupon(couponData);
    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    console.error("Error creating coupon:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all available services and their plan types (helper endpoint)
export const getAvailableServices = async (req, res) => {
  try {
    const services = {
      mentalHealthCounselling: {
        displayName: "Mental Health Counselling",
        plans: ["single", "bundle"],
      },
      cosmetologistConsultancy: {
        displayName: "Cosmetologist Consultancy",
        plans: ["single", "bundle"],
      },
    };

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
