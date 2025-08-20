import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  id: { type: Number, required: true },  // keep your numeric id for frontend
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  neutered: { type: Boolean, default: false },
  goodWith: [{ type: String }],
}, {
  timestamps: true
});

export default mongoose.model("Pet", petSchema);
