import express from "express";
import {
  getPsychologists,
  getPsychologistAvailability,
  updateAvailability,
} from "../controllers/psychologist.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").get(getPsychologists);
router.route("/:id/availability").get(getPsychologistAvailability);
router.route("/:id/availability").put(isAuthenticated, updateAvailability);

export { router as psychologistRouter };
