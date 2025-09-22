import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

// GET all pets
router.get("/", async (req, res) => {
  const pets = await Pet.find();
  res.json(pets);
});

// GET single pet
router.get("/:id", async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  res.json(pet);
});

// POST add pet
router.post("/", async (req, res) => {
  const pet = new Pet(req.body);
  await pet.save();
  res.json(pet);
});

// PUT update pet
router.put("/:id", async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(pet);
});

// DELETE pet
router.delete("/:id", async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id);
  res.json({ message: "Pet deleted" });
});

export default router;
