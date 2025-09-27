import express from "express";
import {
  createOrder,
  verifyPayment,
  getPayments,
  handleWebhook,
  createCreditsOrder,
} from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/create-order").post(isAuthenticated, createOrder);
router.route("/create-credits-order").post(isAuthenticated, createCreditsOrder);
router.route("/verify").post(isAuthenticated, verifyPayment);
router.route("/webhook").post(handleWebhook); // No authentication for webhook
router.route("/").get(isAuthenticated, getPayments);

export { router as paymentRouter };
