import express from "express";
import {
  getBHAssociateProfile,
  getAvailability,
  updateAvailability,
  clearAvailability,
  bulkUpdateAvailability,
  getAllBHAssociates,
  getCosmetologists,
  getAssociateAvailability,
  updateAssociateAvailability,
  clearAssociateAvailability,
  bulkUpdateAssociateAvailability,
} from "../controllers/bhAssociate.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get BH Associate profile
router.route("/profile").get(isAuthenticated, getBHAssociateProfile);

// Admin route to get all BH Associates
router.route("/all").get(isAuthenticated, getAllBHAssociates);

// Public route to get all cosmetologists
router.route("/cosmetologists").get(getCosmetologists);

// Availability management routes
router.route("/availability").get(isAuthenticated, getAvailability);
router.route("/availability/update").put(isAuthenticated, updateAvailability);
router.route("/availability/clear").delete(isAuthenticated, clearAvailability);
router
  .route("/availability/bulk-update")
  .put(isAuthenticated, bulkUpdateAvailability);

// Admin routes for managing associate availability
router
  .route("/availability/:associateId")
  .get(isAuthenticated, getAssociateAvailability);
router
  .route("/availability/update/:associateId")
  .put(isAuthenticated, updateAssociateAvailability);
router
  .route("/availability/clear/:associateId")
  .delete(isAuthenticated, clearAssociateAvailability);
router
  .route("/availability/bulk-update/:associateId")
  .put(isAuthenticated, bulkUpdateAssociateAvailability);

export { router as bhAssociateRouter };
