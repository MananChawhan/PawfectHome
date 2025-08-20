import express from "express";
import { getPets, addPet } from "../controllers/petController.js";

const router = express.Router();

router.get("/", getPets);
router.post("/", addPet);

export default router;
