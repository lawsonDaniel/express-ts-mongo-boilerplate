
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
export const uploadBase64Image = async (base64String: string) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
  try {
    // Ensure base64String is a string
    if (typeof base64String !== 'string') {
      throw new TypeError('The base64String argument must be of type string.');
    }

    // Ensure base64String includes the data URL prefix
    if (!base64String.startsWith('data:image/')) {
      base64String = `data:image/png;base64,${base64String}`;
    }
    const result = await cloudinary.uploader.upload(   base64String,
        {
          resource_type: "auto", // Automatically detect the file type
        
        },(err,res)=>{
           if(err) return err
           return res?.secure_url
        });

    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
