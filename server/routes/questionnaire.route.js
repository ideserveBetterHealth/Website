import express from "express";
import {
  getQuestionnaire,
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} from "../controllers/questionnaire.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/:serviceType").get(getQuestionnaire);
router.route("/").post(isAuthenticated, createQuestionnaire);
router.route("/:id").put(isAuthenticated, updateQuestionnaire);
router.route("/:id").delete(isAuthenticated, deleteQuestionnaire);

export { router as questionnaireRouter };
