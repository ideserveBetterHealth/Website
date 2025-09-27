import { User } from "../models/user.model.js";
import { Payment } from "../models/payments.model.js";
import { Pricing } from "../models/pricing.model.js";
import { Coupon } from "../models/coupon.model.js";
import { Meeting } from "../models/meetings.model.js";
import { createMeeting } from "./meetings.controller.js";
import crypto from "crypto";

// Import Cashfree SDK
import { Cashfree, CFEnvironment } from "cashfree-pg";
import sendMessageViaWhatsApp from "../services/whatsappService.js";

// Helper function to convert 24-hour time to 12-hour format
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Helper function to format date with comma
const formatDateWithComma = (date) => {
  const dateObj = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return dateObj.toLocaleDateString("en-US", options);
};

// --- Correctly configure and initialize Cashfree SDK instance ---
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const cashfree = new Cashfree(
  process.env.NODE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);

/**
 * Helper function to process successful payments.
 * This function updates coupon usage and adds credits to the user's account.
 */
const processSuccessfulPayment = async (payment) => {
  try {
    // Update coupon usage if a coupon was applied
    if (payment.appliedCoupon && payment.appliedCoupon.code) {
      await Coupon.findOneAndUpdate(
        { code: payment.appliedCoupon.code },
        { $inc: { usedCount: 1 } }
      );
    }

    // Add credits to the user's account
    const user = await User.findById(payment.userId);
    const associate = await User.findById(payment.associateId);
    if (user) {
      let creditsToAdd;

      // Determine credits to add based on payment type
      if (payment.isCreditsOnly || payment.sessionType === "credits") {
        // For direct credit purchases, add the full amount without deducting
        creditsToAdd =
          payment.creditsCount || (payment.sessionType === "pack" ? 3 : 1);
      } else {
        // For booking payments, add credits but deduct 1 for the current session
        creditsToAdd = payment.sessionType === "pack" ? 3 : 1;
      }

      const existingCredit = user.credits.find(
        (c) =>
          c.duration === payment.duration &&
          c.serviceType === payment.serviceType
      );

      if (existingCredit) {
        if (payment.isCreditsOnly || payment.sessionType === "credits") {
          // For credits-only purchase, add full amount
          existingCredit.count += creditsToAdd;
        } else {
          // For booking payment, add credits minus 1 (for current session)
          existingCredit.count += creditsToAdd - 1;
        }
      } else {
        user.credits.push({
          serviceType: payment.serviceType,
          duration: payment.duration,
          count:
            payment.isCreditsOnly || payment.sessionType === "credits"
              ? creditsToAdd
              : creditsToAdd - 1,
        });
      }
      await user.save();
    }
    console.log(
      `Successfully processed payment logic for order ${payment.orderId}`
    );

    // Create meeting after successful payment (only for booking payments, not credits-only)
    if (!payment.isCreditsOnly && payment.sessionType !== "credits") {
      try {
        const meeting = await createMeeting(
          payment.userId,
          payment.associateId,
          payment.appointmentDate,
          payment.appointmentTime,
          payment.duration,
          payment.clientName,
          payment.serviceType,
          payment.questionnaireResponses || {}
        );

        // Update payment record with meetingId
        payment.meetingId = meeting._id;
        await payment.save();

        console.log(
          `Meeting scheduled for order ${payment.orderId} with meetingId: ${meeting._id}`
        );

        // Send confirmation to user
        await sendMessageViaWhatsApp(
          `+91${user.phoneNumber}`,
          `*BetterHealth – Session Scheduled*\n\nHello ${
            user.name
          },\n\nYour session with ${
            meeting.bhAssocName
          } has been scheduled on ${formatDateWithComma(
            payment.appointmentDate
          )} at ${convertTo12Hour(
            payment.appointmentTime
          )}.\n\nWe look forward to supporting you in your journey with BetterHealth.\n\nBest regards,\nTeam BetterHealth 🧡`
        );

        // Send notification to psychologist/BH Associate
        await sendMessageViaWhatsApp(
          `+91${associate.phoneNumber}`,
          `*BetterHealth – New Session Assigned*\n\nHello ${
            associate.name
          },\n\nYou have been assigned a new session:\n\n📅 Session Details:\n• Client: ${
            user.name
          }\n• Scheduled Date: ${formatDateWithComma(
            payment.appointmentDate
          )}\n• Scheduled Time: ${convertTo12Hour(
            payment.appointmentTime
          )}\n• Duration: ${
            payment.duration
          } minutes\n\nBe prepared, and make sure you join the session on time.\n\nBest regards,\nTeam BetterHealth 🧡`
        );
        console.log(`✅ Psychologist notification sent to ${associate.name}`);

        // Send admin notifications
        const adminPhoneNumbers = await User.find({ role: "admin" }).select(
          "name phoneNumber"
        );

        for (const admin of adminPhoneNumbers) {
          await sendMessageViaWhatsApp(
            `+91${admin.phoneNumber}`,
            `*BetterHealth – Management Alert*\n\nHello ${
              admin.name
            },\n\n📅 New Session Scheduled:\n• Client: ${
              user.name
            }\n• BH Associate: ${
              meeting.bhAssocName
            }\n• Scheduled Date: ${formatDateWithComma(
              payment.appointmentDate
            )}\n• Scheduled Time: ${convertTo12Hour(
              payment.appointmentTime
            )}\n• Duration: ${payment.duration} minutes\n• Service: ${
              payment.serviceType
            }\n\nBest regards,\nBetterHealth Automated System 🧡`
          );
          console.log(`✅ Admin notification sent to ${admin.name}`);
        }
      } catch (meetingError) {
        console.error(
          `Error creating meeting for order ${payment.orderId}:`,
          meetingError
        );
        // Note: We don't throw here to avoid failing the payment processing
      }
    }
  } catch (error) {
    console.error(
      `Error processing successful payment for order ${payment.orderId}:`,
      error
    );
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const {
      serviceType,
      duration,
      sessionType,
      couponCode,
      psychologistId,
      appointmentDate,
      appointmentTime,
      questionnaireResponses,
    } = req.body;

    console.log("req.body", req?.body);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // --- Business Logic: Get pricing ---
    const pricing = await Pricing.findOne({ serviceType });
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "Pricing not found for the selected service.",
      });
    }

    // --- Business Logic: Calculate final amount based on duration and session type ---
    if (!pricing.sessionCosts || !pricing.sessionCosts[duration]) {
      return res.status(400).json({
        success: false,
        message: `Pricing not available for ${duration}-minute sessions.`,
      });
    }
    const sessionPrice = pricing.sessionCosts[duration];

    let finalAmount;
    if (sessionType === "single") {
      finalAmount = sessionPrice;
    } else if (sessionType === "pack") {
      finalAmount = sessionPrice * 3; // 3-session pack
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid session type. Must be 'single' or 'pack'.",
      });
    }

    let appliedCoupon = null;

    console.log(couponCode);

    // --- Business Logic: Apply coupon if provided ---
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validTill: { $gte: new Date() },
      });

      if (!coupon) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired coupon code." });
      }
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
      if (coupon.isNewUserOnly) {
        const existingMeeting = await Meeting.findOne({ userId });
        if (existingMeeting) {
          return res.status(400).json({
            success: false,
            message: "This coupon is only valid for new users",
          });
        }
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon usage limit exceeded." });
      }
      if (finalAmount < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}.`,
        });
      }

      // Apply discount
      if (coupon.discountType === "percentage") {
        const discountAmount = (finalAmount * coupon.discount) / 100;
        const maxDiscount = coupon.maxDiscountAmount || discountAmount;
        finalAmount -= Math.min(discountAmount, maxDiscount);
      } else {
        finalAmount -= coupon.discount;
      }
      finalAmount = Math.max(0, finalAmount); // Ensure amount doesn't go negative

      appliedCoupon = {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
      };
    }

    // Generate unique order ID for your system
    const orderId = `BH_${Date.now()}_${userId}`;

    // Create a pending payment record in your database
    const payment = await Payment.create({
      userId,
      clientName: questionnaireResponses.personalDetails.fullName,
      orderId,
      amount: sessionPrice * (sessionType === "pack" ? 3 : 1), // Original amount before discount
      finalAmount, // Amount after discount
      serviceType,
      duration,
      sessionType,
      appliedCoupon,
      associateId: psychologistId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      questionnaireResponses,
      status: "pending",
    });

    // --- Cashfree Integration ---
    try {
      const request = {
        order_amount: finalAmount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: `CUST_${userId}`,
          customer_name: user.name || "Customer",
          customer_email: user.email || `${user.phoneNumber}@betterhealth.com`,
          customer_phone: user.phoneNumber,
        },
        order_meta: {
          notify_url: `${process.env.SERVER_URL}/api/v1/payments/webhook`,
        },
        order_expiry_time: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        order_note: `Better Health - ${serviceType} ${sessionType} session`,
      };

      console.log("Creating Cashfree order with data:", request);

      // FIX: Use the 'cashfree' instance and call PGCreateOrder without the version string.
      const response = await cashfree.PGCreateOrder(request);
      console.log("Cashfree response:", response.data);

      if (response.data && response.data.payment_session_id) {
        payment.paymentGatewayOrderId = response.data.payment_session_id;
        await payment.save();

        return res.status(200).json({
          success: true,
          message: "Order created successfully.",
          orderId,
          paymentSessionId: response.data.payment_session_id,
          paymentUrl: response.data.payment_link,
        });
      } else {
        throw new Error("Failed to get payment_session_id from Cashfree");
      }
    } catch (cashfreeError) {
      console.error("Cashfree API Error:", cashfreeError);
      // If Cashfree call fails, remove the pending payment record to avoid orphaned entries
      await Payment.findByIdAndDelete(payment._id);

      return res.status(500).json({
        success: false,
        message: "Failed to create payment order.",
        error: cashfreeError.message,
        details:
          cashfreeError.response?.data || "No additional details available",
      });
    }
  } catch (error) {
    console.log("Error in createOrder:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required." });
    }

    console.log(`Verifying payment for order: ${orderId}`);

    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log("Cashfree order details:", cashfreeResponse.data);

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found in our system.",
      });
    }

    try {
      // FIX: Use the 'cashfree' instance and call PGFetchOrder without the version string.
      const orderStatus = cashfreeResponse.data.order_status;
      const paymentDetails = cashfreeResponse.data.payment_details || {};

      // Only update if the status is still pending to avoid race conditions with webhooks
      if (payment && payment.status === "pending") {
        switch (orderStatus) {
          case "PAID":
            payment.status = "paid";
            payment.paymentId =
              paymentDetails.payment_id ||
              paymentDetails.auth_id ||
              "PAYMENT_COMPLETED";
            payment.paymentMethod = paymentDetails.payment_method;
            payment.paymentTime = paymentDetails.payment_time;
            payment.bankReference = paymentDetails.bank_reference;
            payment.completedAt = new Date();
            // Process the successful payment logic (grant credits, etc.)
            await processSuccessfulPayment(payment);
            break;
          case "EXPIRED":
            payment.status = "expired";
            break;
          case "FAILED":
            payment.status = "failed";
            payment.paymentMessage =
              paymentDetails.payment_message || "Payment failed at gateway.";
            break;
          default:
            // For statuses like 'ACTIVE', 'PENDING', keep our status as 'pending'
            payment.status =
              orderStatus === "ACTIVE" ? "pending" : orderStatus.toLowerCase();
        }
        await payment.save();
        console.log(`Booking ${orderId} updated successfully`);
      }

      return res.status(200).json({
        success: true,
        orderStatus,
        paymentStatus: payment.status,
        paymentDetails,
        payment,
      });
    } catch (cashfreeError) {
      console.error("Cashfree API Error during verification:", cashfreeError);
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment with Cashfree.",
        error: cashfreeError.message,
        details:
          cashfreeError.response?.data || "No additional details available",
      });
    }
  } catch (error) {
    console.log("Error in verifyPayment:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    // FIX: Destructure the flat payload from req.body directly as per the working example.
    const {
      order_id,
      order_status,
      cf_payment_id,
      payment_method,
      payment_time,
      bank_reference,
      payment_message,
    } = req.body;

    if (!order_id) {
      console.error("Webhook missing order_id");
      return res.status(400).json({ message: "Order ID is required" });
    }

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) {
      console.error(`Webhook: Payment not found for orderId: ${order_id}`);
      // Return 200 OK to Cashfree to prevent retries for non-existent orders
      return res
        .status(200)
        .json({ success: true, message: "Order not found, webhook ignored." });
    }

    // Process only if the payment is still pending to prevent duplicate processing
    if (payment.status === "pending") {
      console.log(
        `Webhook updating payment ${order_id} from status: ${payment.status} to: ${order_status}`
      );

      switch (order_status) {
        case "PAID":
          payment.status = "paid";
          payment.paymentId = cf_payment_id;
          payment.paymentMethod = payment_method;
          payment.paymentTime = new Date(payment_time);
          payment.bankReference = bank_reference;
          payment.completedAt = new Date();
          await processSuccessfulPayment(payment);
          break;
        case "EXPIRED":
          payment.status = "expired";
          break;
        case "FAILED":
          payment.status = "failed";
          payment.paymentMessage = payment_message;
          break;
        default:
          payment.status = order_status.toLowerCase();
      }
      await payment.save();
    } else {
      console.log(
        `Webhook: Payment ${order_id} already processed. Current status: ${payment.status}. Ignoring webhook.`
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res
      .status(500)
      .json({ message: "Failed to process webhook", error: error.message });
  }
};

export const createCreditsOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { serviceType, duration, creditsCount, promoCode } = req.body;

    console.log("createCreditsOrder req.body", req?.body);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Validate input
    if (!serviceType || !duration || !creditsCount) {
      return res.status(400).json({
        success: false,
        message: "Service type, duration, and credits count are required.",
      });
    }

    // Get pricing for the service
    const pricing = await Pricing.findOne({ serviceType });
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: "Pricing not found for the selected service.",
      });
    }

    console.log(duration);
    console.log(pricing.sessionCosts);
    console.log(pricing.sessionCosts[duration]);

    // Calculate final amount based on duration and credits count
    if (!pricing.sessionCosts || !pricing.sessionCosts[duration]) {
      return res.status(400).json({
        success: false,
        message: `Pricing not available for ${duration}-minute sessions.`,
      });
    }

    const sessionPrice = pricing.sessionCosts[duration];
    let finalAmount = sessionPrice * creditsCount;

    let appliedCoupon = null;

    // Apply coupon if provided
    if (promoCode) {
      const coupon = await Coupon.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validTill: { $gte: new Date() },
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired coupon code.",
        });
      }

      if (
        coupon.applicableServices.length > 0 &&
        !coupon.applicableServices.includes(serviceType)
      ) {
        return res.status(400).json({
          success: false,
          message: "This coupon is not applicable for the selected service.",
        });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit exceeded.",
        });
      }

      if (finalAmount < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}.`,
        });
      }

      // Apply discount
      if (coupon.discountType === "percentage") {
        const discountAmount = (finalAmount * coupon.discount) / 100;
        const maxDiscount = coupon.maxDiscountAmount || discountAmount;
        finalAmount -= Math.min(discountAmount, maxDiscount);
      } else {
        finalAmount -= coupon.discount;
      }
      finalAmount = Math.max(0, finalAmount);

      appliedCoupon = {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
      };
    }

    // Generate unique order ID
    const orderId = `BH_CREDITS_${Date.now()}_${userId}`;

    // Create payment record for credits purchase
    const payment = await Payment.create({
      userId,
      clientName: user.name,
      orderId,
      amount: sessionPrice * creditsCount, // Original amount before discount
      finalAmount, // Amount after discount
      serviceType,
      duration,
      sessionType: "credits", // Mark as credits purchase
      appliedCoupon,
      creditsCount, // Store the number of credits being purchased
      status: "pending",
      isCreditsOnly: true, // Flag to indicate this is a credits-only purchase
    });

    // Create Cashfree order
    try {
      const request = {
        order_amount: finalAmount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: `CUST_${userId}`,
          customer_name: user.name || "Customer",
          customer_email: user.email || `${user.phoneNumber}@betterhealth.com`,
          customer_phone: user.phoneNumber,
        },
        order_meta: {
          notify_url: `${process.env.SERVER_URL}/api/v1/payments/webhook`,
        },
        order_expiry_time: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        order_note: `Better Health - ${creditsCount} Credits for ${serviceType}`,
      };

      console.log("Creating Cashfree order for credits with data:", request);

      const response = await cashfree.PGCreateOrder(request);
      console.log("Cashfree response for credits:", response.data);

      if (response.data && response.data.payment_session_id) {
        payment.paymentGatewayOrderId = response.data.payment_session_id;
        await payment.save();

        return res.status(200).json({
          success: true,
          message: "Credits order created successfully.",
          data: {
            orderId,
            paymentSessionId: response.data.payment_session_id,
            paymentUrl: response.data.payment_link,
          },
        });
      } else {
        throw new Error("Failed to get payment_session_id from Cashfree");
      }
    } catch (cashfreeError) {
      console.error("Cashfree API Error for credits:", cashfreeError);
      await Payment.findByIdAndDelete(payment._id);

      return res.status(500).json({
        success: false,
        message: "Failed to create credits payment order.",
        error: cashfreeError.message,
        details:
          cashfreeError.response?.data || "No additional details available",
      });
    }
  } catch (error) {
    console.log("Error in createCreditsOrder:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getPayments = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);

    let query = {};
    if (user.role === "user") {
      query.userId = userId;
    }

    const payments = await Payment.find(query)
      .populate("userId", "name phoneNumber")
      .populate("psychologistId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.log("Error in getPayments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get payments." });
  }
};
