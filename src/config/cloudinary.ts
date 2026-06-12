import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
  localFilePath: string,
): Promise<string | null> => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded:", response.secure_url);
    fs.unlinkSync(localFilePath);
    return response.secure_url;
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};
