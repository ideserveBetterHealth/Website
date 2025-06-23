import express from "express";
import {
  createCoupon,
  getAvailableServices,
  getDefaultPaymentLinks,
  verifyCoupon,
  getAllCoupons,
  updateCouponStatus,
  deleteCoupon,
} from "../controllers/payments.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get default payment links (when no coupon is used)
// GET /api/payments/default/:service/:planType
router.get("/default/:service/:planType", getDefaultPaymentLinks);

// Verify coupon and get payment link
// POST /api/payments/verify-coupon/:service/:planType
router.post("/verify-coupon/:service/:planType", verifyCoupon);

// Get all coupons
// GET /api/payments/coupons
router.get("/coupons", isAuthenticated, getAllCoupons);

// Create a new coupon (admin function)
// POST /api/payments/coupon
router.post("/coupon", isAuthenticated, createCoupon);

// Update coupon status (activate/deactivate)
// PATCH /api/payments/coupon/:couponId/status
router.patch("/coupon/:couponId/status", isAuthenticated, updateCouponStatus);

// Delete coupon
// DELETE /api/payments/coupon/:couponId
router.delete("/coupon/:couponId", isAuthenticated, deleteCoupon);

// Get all available services and their plan types (helper endpoint)
// GET /api/payments/services
router.get("/services", getAvailableServices);

export const paymentRouter = router;
