import express from "express";
import {
  register,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createEmployee,
  getDoctorDetails,
  getMyEmployeeDetails,
  updateMyEmployeeDetails,
  isVerified,
  statusPending,
  statusVerified,
  verifyDoctor,
} from "../controllers/bhAssociateDetail.controller.js";

const router = express.Router();

router.route("/employees").post(isAuthenticated, createEmployee);
router.get("/check-verified", isAuthenticated, isVerified);

router.get("/status-pending", isAuthenticated, statusPending);

router.get("/status-verified", isAuthenticated, statusVerified);

router.get("/doctor-details/:userId", isAuthenticated, getDoctorDetails);

// New routes for self-service
router.get("/my-details", isAuthenticated, getMyEmployeeDetails);
router.put("/my-details", isAuthenticated, updateMyEmployeeDetails);

router.post("/verify-doctor/:userId", isAuthenticated, verifyDoctor);
// router.route("/all").get(isAuthenticated, getAllEmployees);
// router.route("/:id").put(isAuthenticated, updateEmployee);
// router.route("/:id").delete(isAuthenticated, deleteEmployee);

export { router as bhAssociateDetailRouter };
