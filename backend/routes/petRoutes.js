// routes/petRoutes.js
import express from "express";
import Pet from "../models/Pet.js";
import upload from "../middleware/upload.js";
import { v2 as cloudinary } from "cloudinary";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload buffer to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pawfecthome" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Helper: extract Cloudinary public_id from URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1]; // e.g. abc123.jpg
    const publicId = fileWithExt.split(".")[0]; // abc123
    return "pawfecthome/" + publicId; // add folder
  } catch {
    return null;
  }
};

// ✅ GET all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET single pet
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST add pet (file OR URL) — only admin
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      gender,
      description,
      vaccinated,
      neutered,
      goodWith,
      image,
    } = req.body;

    let imageUrl = image || "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
    }

    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      gender,
      description,
      vaccinated: vaccinated === "true" || vaccinated === true,
      neutered: neutered === "true" || neutered === true,
      goodWith:
        typeof goodWith === "string"
          ? goodWith.split(",").map((s) => s.trim())
          : [],
      image: imageUrl,
    });

    const saved = await newPet.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT update pet (file OR URL) — only admin
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      gender,
      description,
      vaccinated,
      neutered,
      goodWith,
      image,
    } = req.body;

    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    let imageUrl = image || pet.image;

    if (req.file) {
      // Upload new file
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;

      // Delete old Cloudinary image if it exists
      if (pet.image && pet.image.includes("res.cloudinary.com")) {
        const publicId = getPublicIdFromUrl(pet.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    pet.name = name ?? pet.name;
    pet.type = type ?? pet.type;
    pet.breed = breed ?? pet.breed;
    pet.age = age ?? pet.age;
    pet.gender = gender ?? pet.gender;
    pet.description = description ?? pet.description;
    pet.vaccinated = vaccinated === "true" || vaccinated === true;
    pet.neutered = neutered === "true" || neutered === true;
    pet.goodWith =
      typeof goodWith === "string"
        ? goodWith.split(",").map((s) => s.trim())
        : pet.goodWith;
    pet.image = imageUrl;

    const updated = await pet.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE pet — only admin + cleanup Cloudinary
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Delete image from Cloudinary if exists
    if (pet.image && pet.image.includes("res.cloudinary.com")) {
      const publicId = getPublicIdFromUrl(pet.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Pet deleted and image removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
