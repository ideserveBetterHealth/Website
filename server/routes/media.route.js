import express from "express";
import { uploader } from "../controllers/media.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/upload").post(isAuthenticated, upload.single("file"), uploader);

export { router as mediaRouter };
