// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import foodRoutes from "./routes/foodRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ganti app.use(cors()); dengan kode ini
const corsOptions = {
  origin: 'https://fe-kuliner-indo.vercel.app', // Hanya izinkan frontend Vercel Anda
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Terapkan opsi yang lebih aman
app.use(express.json());

app.use("/api/foods", foodRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
