import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

// GET all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single pet by ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;