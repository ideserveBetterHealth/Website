// app.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRouter } from "./routes/user.route.js";
import { employeeRouter } from "./routes/employee.route.js";
import { mediaRouter } from "./routes/media.route.js";
import { meetingRouter } from "./routes/meetings.route.js";
import { paymentRouter } from "./routes/payment.routes.js";

dotenv.config();

const app = express();

// Default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// JSON error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format. Please check your request.",
    });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("VERCEL HERE");
});

// APIs
app.use("/api/v1/user", userRouter);
app.use("/api/v1/register", employeeRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/meeting", meetingRouter);
app.use("/api/v1/payments", paymentRouter);

export default app;
