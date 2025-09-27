import express from "express";
import {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
} from "../controllers/pricing.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").get(getPricing);
router.route("/").post(isAuthenticated, createPricing);
router.route("/:id").put(isAuthenticated, updatePricing);
router.route("/:id").delete(isAuthenticated, deletePricing);

export { router as pricingRouter };
