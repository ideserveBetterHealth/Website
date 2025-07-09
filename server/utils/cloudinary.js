import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import streamifier from "streamifier";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caPath = path.resolve(__dirname, "../cloudinary.pem");

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

const agent = new https.Agent({
  ca: fs.readFileSync(caPath),
});

// ✅ NEW: upload buffer (no disk)
export const uploadMedia = async (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        secure: true,
        public_id: originalname,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { agent });
  } catch (error) {
    console.error("Cloudinary delete error", error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      agent,
    });
  } catch (error) {
    console.error("Cloudinary video delete error", error);
  }
};
