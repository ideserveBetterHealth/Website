import express from "express";
import {
  register,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").post(isAuthenticated, register);
router.route("/all").get(isAuthenticated, getAllEmployees);
router.route("/:id").put(isAuthenticated, updateEmployee);
router.route("/:id").delete(isAuthenticated, deleteEmployee);

export { router as employeeRouter };
