import express from "express";
import upload from "../utils/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { uploader } from "../controllers/media.controller.js";

const router = express.Router();

router
  .route("/upload-media")
  .post(isAuthenticated, upload.single("file"), uploader);

export const mediaRouter = router;
