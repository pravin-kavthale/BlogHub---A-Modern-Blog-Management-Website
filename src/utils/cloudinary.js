import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
      if (!localFilePath) throw new Error("File path not provided");
  
      // Uploading file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
  
      console.log("File uploaded to Cloudinary successfully:", response.url);
  
      // Remove the locally saved temporary file
      fs.unlinkSync(localFilePath);
  
      return response;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error.message);
  
      // Remove the locally saved temporary file if an error occurs
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
  
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

export {uploadOnCloudinary}