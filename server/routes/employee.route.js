import express from "express";
import {
  createEmployee,
  getDoctorDetails,
  isVerified,
  statusPending,
  statusVerified,
  verifyDoctor,
} from "../controllers/details.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/employees", isAuthenticated, createEmployee);

router.get("/check-verified", isAuthenticated, isVerified);

router.get("/status-pending", isAuthenticated, statusPending);

router.get("/status-verified", isAuthenticated, statusVerified);

router.get("/doctor-details/:userId", isAuthenticated, getDoctorDetails);

router.patch("/verify-doctor/:userId", isAuthenticated, verifyDoctor);

export const employeeRouter = router;
