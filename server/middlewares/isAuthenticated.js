import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Helper function to get current IST timestamp
function getISTTimestamp() {
  const now = new Date();
  // Convert to UTC first, then add IST offset (UTC+5:30)
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);

  const day = String(istTime.getDate()).padStart(2, "0");
  const month = String(istTime.getMonth() + 1).padStart(2, "0");
  const year = istTime.getFullYear();
  const hours = String(istTime.getHours()).padStart(2, "0");
  const minutes = String(istTime.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}   ${hours}:${minutes}`;
}

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;

    // Update lastActiveAt for the authenticated user
    try {
      const currentTimestamp = getISTTimestamp();
      await User.findByIdAndUpdate(decode.userId, {
        lastActiveAt: currentTimestamp,
      });
    } catch (updateError) {
      console.error("Error updating lastActiveAt:", updateError);
      // Don't fail authentication if update fails
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
      error: "Authentication failed",
    });
  }
};
