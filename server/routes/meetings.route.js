import express from "express";
import {
  getMeetings,
  deleteMeeting,
  meetingJoinedAt,
  userAllMeetings,
  createMeetingFromCredits,
} from "../controllers/meetings.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getMeetings);
router.route("/create-meeting").post(isAuthenticated, createMeetingFromCredits);
router.route("/user").get(isAuthenticated, userAllMeetings);
router.route("/meetingJoinedAt/:id").post(isAuthenticated, meetingJoinedAt);
router.route("/deleteMeeting/:id").delete(isAuthenticated, deleteMeeting);

export { router as meetingRouter };
