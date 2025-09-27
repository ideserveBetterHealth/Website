import express from "express";
import {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/validate").post(validateCoupon);
router.route("/").post(isAuthenticated, createCoupon);
router.route("/").get(isAuthenticated, getAllCoupons);
router.route("/:id").put(isAuthenticated, updateCoupon);
router.route("/:id").delete(isAuthenticated, deleteCoupon);

export { router as couponRouter };
