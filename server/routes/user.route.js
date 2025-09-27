import express from "express";
import {
  sendOTP,
  verifyOTP,
  completeProfile,
  getUserProfile,
  updateProfile,
  logout,
  getUserCredits,
  getAllUsers,
  adminCreateUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

// OTP based authentication routes
router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/complete-profile").put(isAuthenticated, completeProfile);

// User profile routes
router.route("/profile").get(isAuthenticated, getUserProfile);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.route("/logout").post(logout);

// User credits route
router.route("/credits").get(isAuthenticated, getUserCredits);

// Admin route to get all users
router.route("/all").get(isAuthenticated, getAllUsers);

// Admin route to create user directly
router
  .route("/admin/create")
  .post(isAuthenticated, upload.single("profilePhoto"), adminCreateUser);

export { router as userRouter };
