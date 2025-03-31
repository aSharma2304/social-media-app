import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided for upload.");
      return null;
    }

    console.log(`📤 Uploading file: ${localFilePath} to Cloudinary...`);

    // console.log("Cloudinary Config:", cloudinary.config());

    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(`✅ File uploaded to Cloudinary: ${uploadResponse.secure_url}`);

    // Delete local file after successful upload
    await fs.unlink(localFilePath);
    console.log(`🗑️ Local file deleted: ${path.basename(localFilePath)}`);

    return uploadResponse;
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err);

    // Print detailed error message
    if (err?.message) {
      console.error("⚠️ Error Message:", err.message);
    }
    if (err?.response?.body) {
      console.error("⚠️ Cloudinary Response Error:", err.response.body);
    }

    // Attempt to delete local file to prevent server clutter
    try {
      await fs.unlink(localFilePath);
      console.log(
        `🗑️ Local file deleted after error: ${path.basename(localFilePath)}`
      );
    } catch (unlinkErr) {
      console.error("⚠️ Failed to delete local file after error:", unlinkErr);
    }

    return null;
  }
};

export default uploadOnCloudinary;

export function deleteImage(publicId) {
  return cloudinary.uploader
    .destroy(publicId)
    .then((result) => {
      console.log("Image deleted successfully:", result);
      return result;
    })
    .catch((error) => {
      console.error("Error deleting image:", error);
      throw error;
    });
}
