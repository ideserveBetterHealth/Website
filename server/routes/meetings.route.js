import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createMeeting,
  deleteMeeting,
  getMeetings,
  meetingJoinedAt,
  userAllMeetings,
  verifyUserEmail,
} from "../controllers/meetings.controller.js";

const router = express.Router();

router.post("/create-meeting", isAuthenticated, createMeeting);

router.get("/get-meetings", isAuthenticated, getMeetings);

router.get("/meetingJoinedAt/:meetingId", isAuthenticated, meetingJoinedAt);

router.get("/deleteMeeting/:meetingId", isAuthenticated, deleteMeeting);

router.post("/userMeetings", isAuthenticated, userAllMeetings);

router.post("/verify-email", isAuthenticated, verifyUserEmail);

export const meetingRouter = router;
