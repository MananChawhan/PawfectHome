import express from "express";
import Pet from "../models/Pet.js";
import upload from "../middleware/upload.js";
import { v2 as cloudinary } from "cloudinary";

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

// ✅ POST add pet (file OR URL)
router.post("/", upload.single("image"), async (req, res) => {
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

// ✅ PUT update pet (file OR URL)
router.put("/:id", upload.single("image"), async (req, res) => {
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

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    );

    if (!updatedPet)
      return res.status(404).json({ message: "Pet not found" });

    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE pet
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Pet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
