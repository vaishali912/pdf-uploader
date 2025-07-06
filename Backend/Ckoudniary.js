require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (filetoupload)=>  {
    if(!filetoupload) return null;
    // Upload an image
    try{
     const uploadResult = await cloudinary.uploader
       .upload( filetoupload, {
               resource_type:"auto"
           }
       )
      fs.unlinkSync(filetoupload);
       return uploadResult;
    }
    catch(error){
        fs.unlinkSync(filetoupload);
           console.log("cloudniaty error",error);
           return null;
       };
    }
 const deleteOnCloudinary = async (publicid) => {
  if (!publicid) return null;
  try {
    const deleted = await cloudinary.uploader.destroy(publicid, {
      resource_type: "image", // MUST match what was returned during upload
    });
    console.log("Deleted from Cloudinary:", deleted);
    return deleted;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    return null;
  }
};

   module.exports = { uploadOnCloudinary,deleteOnCloudinary };