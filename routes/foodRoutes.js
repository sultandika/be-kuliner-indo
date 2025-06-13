import express from "express";
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getAllFoods);

router.post("/", createFood);

router.get("/:id", getFoodById);

router.put("/:id", updateFood);

router.delete("/:id", deleteFood);

export default router;
