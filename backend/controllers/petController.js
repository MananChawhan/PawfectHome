import Pet from "../models/Pet.js";

// Get all pets
export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a pet
export const addPet = async (req, res) => {
  try {
    // Destructure values
    const { name, type, breed, age, gender, description, vaccinated, neutered, goodWith, image } = req.body;

    // Handle image (file upload OR URL)
    const imagePath = req.file
      ? `uploads/${req.file.filename}` // multer file
      : image || ""; // fallback to URL or empty

    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      gender,
      description,
      vaccinated: vaccinated === "true" || vaccinated === true,
      neutered: neutered === "true" || neutered === true,
      goodWith: goodWith ? (Array.isArray(goodWith) ? goodWith : goodWith.split(",")) : [],
      image: imagePath,
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update pet
export const updatePet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, description, vaccinated, neutered, goodWith, image } = req.body;

    // If new file uploaded use it, else keep URL, else keep existing
    const imagePath = req.file
      ? `uploads/${req.file.filename}`
      : image || undefined;

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
        goodWith: goodWith ? (Array.isArray(goodWith) ? goodWith : goodWith.split(",")) : [],
        ...(imagePath && { image: imagePath }),
      },
      { new: true }
    );

    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete pet
export const deletePet = async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
