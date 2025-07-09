import { User } from "../models/user.model.js";
import { uploadMedia } from "../utils/cloudinary.js";

export const uploader = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findOne({
      _id: userId,
      role: { $in: ["doctor", "admin"] },
    });

    if (!user) {
      return res.status(403).json({
        message: "You are not authorized for uploading.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await uploadMedia(req.file.buffer, req.file.originalname);

    res.status(200).json({
      message: "File uploaded successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    console.log("Error logging from media.controller.js uploadMedia\n", error);
    res.status(500).json({
      message: "Error uploading file",
    });
  }
};
