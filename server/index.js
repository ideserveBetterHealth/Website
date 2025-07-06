import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { userRouter } from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { employeeRouter } from "./routes/employee.route.js";
import { mediaRouter } from "./routes/media.route.js";
import { meetingRouter } from "./routes/meetings.route.js";
import { paymentRouter } from "./routes/payment.routes.js";

dotenv.config();

const app = express();

// Connect to DB only once (on cold start)
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// JSON error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format. Please check your request.",
    });
  }
  next();
});

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/register", employeeRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/meeting", meetingRouter);
app.use("/api/v1/payments", paymentRouter);

// Export app for Vercel (this is key)
export default app;
