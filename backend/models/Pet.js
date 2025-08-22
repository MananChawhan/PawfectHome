// models/Pet.js
import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // Dog, Cat, etc.
    breed: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female"] },
    description: { type: String },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    goodWith: [{ type: String }], // children, dogs, cats, etc.
    image: { type: String }, // Can be Cloudinary, external URL, or local path
  },
  { timestamps: true }
);

export default mongoose.model("Pet", petSchema);
