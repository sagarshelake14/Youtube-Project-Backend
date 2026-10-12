import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("Cloudinary: Local file path is missing");
      return null;
    }

    if (!fs.existsSync(localFilePath)) {
      console.error("Cloudinary: File does not exist:", localFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary upload successful:", response.secure_url);
    //console.log("Cloudinary response :", response);
    
    // Delete the temporary file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};

export { uploadOnCloudinary };