import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Setup Multer with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pawfecthome_pets", // all images go inside this folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // optional resize
  },
});

const upload = multer({ storage });

export default upload;
