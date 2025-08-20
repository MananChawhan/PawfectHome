import express from "express";
import Pet from "../models/Pet.js";
import upload from "../middleware/upload.js"; // ✅ import multer
import { protect, admin } from "../middleware/auth.js"; // (optional auth)

const router = express.Router();

// ✅ GET all pets (public)
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET single pet by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ CREATE new pet (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name, type, breed, age, gender, description,
      vaccinated, neutered, goodWith
    } = req.body;

    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      gender,
      description,
      image: req.file ? req.file.path.replace(/\\/g, "/") : "", // ✅ save path
      vaccinated: vaccinated === "true" || vaccinated === true,
      neutered: neutered === "true" || neutered === true,
      goodWith: typeof goodWith === "string" ? goodWith.split(",").map(s => s.trim()) : (goodWith || []),
    });

    const saved = await newPet.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATE pet (with optional image update)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      name, type, breed, age, gender, description,
      vaccinated, neutered, goodWith
    } = req.body;

    const updateData = {
      name,
      type,
      breed,
      age,
      gender,
      description,
      vaccinated: vaccinated === "true" || vaccinated === true,
      neutered: neutered === "true" || neutered === true,
      goodWith: typeof goodWith === "string" ? goodWith.split(",").map(s => s.trim()) : (goodWith || []),
    };

    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/");
    }

    const updated = await Pet.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Pet not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE pet
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Pet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
