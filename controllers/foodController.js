// src/controllers/foodController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DELIMITER = "|||";
export const getAllFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedFoods = foods.map((food) => ({
      ...food,
      recipe: food.recipe.split(DELIMITER),
      instructions: food.instructions.split(DELIMITER),
    }));

    res.status(200).json(formattedFoods);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await prisma.food.findUnique({
      where: { id: parseInt(id) },
    });

    if (!food) {
      return res.status(404).json({ message: "Resep tidak ditemukan" });
    }

    const formattedFood = {
      ...food,
      recipe: food.recipe.split(DELIMITER),
      instructions: food.instructions.split(DELIMITER),
    };

    res.status(200).json(formattedFood);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
export const createFood = async (req, res) => {
  try {
    const { name, image, youtubeId, description, recipe, instructions } =
      req.body;

    if (!name || !description || !recipe || !instructions || !image) {
      return res.status(400).json({
        message:
          "Semua field wajib diisi: name, description, recipe, instructions, image.",
      });
    }

    if (!Array.isArray(recipe) || !Array.isArray(instructions)) {
      return res.status(400).json({
        message:
          "Format recipe dan instructions harus berupa array of strings.",
      });
    }

    const newFood = await prisma.food.create({
      data: {
        name,
        image,
        youtubeId,
        description,
        recipe: recipe.join(DELIMITER),
        instructions: instructions.join(DELIMITER),
      },
    });

    res
      .status(201)
      .json({ message: "Resep berhasil ditambahkan", data: newFood });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: `Resep dengan nama "${req.body.name}" sudah ada.` });
    }
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
export const updateFood = async (req, res) => {
  const { id } = req.params;
  const { name, image, youtubeId, description, recipe, instructions } =
    req.body;

  if (!name || !description || !recipe || !instructions || !image) {
    return res.status(400).json({
      message:
        "Semua field wajib diisi: name, description, recipe, instructions, image.",
    });
  }

  if (!Array.isArray(recipe) || !Array.isArray(instructions)) {
    return res.status(400).json({
      message: "Format recipe dan instructions harus berupa array of strings.",
    });
  }

  try {
    const updatedFood = await prisma.food.update({
      where: { id: parseInt(id) },
      data: {
        name,
        image,
        youtubeId,
        description,
        recipe: recipe.join(DELIMITER),
        instructions: instructions.join(DELIMITER),
        updatedAt: new Date(),
      },
    });

    res
      .status(200)
      .json({ message: "Resep berhasil diperbarui", data: updatedFood });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: `Resep dengan ID ${id} tidak ditemukan.` });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: `Resep dengan nama "${name}" sudah ada.` });
    }
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
export const deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.food.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: `Resep dengan ID ${id} berhasil dihapus.` });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: `Resep dengan ID ${id} tidak ditemukan.` });
    }
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
