import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Pet from "./models/Pet.js";

dotenv.config();

// Load JSON manually
const pets = JSON.parse(fs.readFileSync("./data/pets.json", "utf-8"));

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Pet.deleteMany();
    const result = await Pet.insertMany(pets);
    console.log(`🌱 Data Imported Successfully! Inserted ${result.length} pets.`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
