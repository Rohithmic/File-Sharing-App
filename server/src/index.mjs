import { app } from "./app.mjs";
import dotenv from "dotenv";
import connectDB from "./db/index.mjs";
import fileRoutes from "./routes/file.routes.mjs";
import userRoutes from "./routes/user.routes.mjs";
import path from 'path';
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 5600;

const startServer = async () => {
  try {
    await connectDB();

    // Register API routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes);

    // Add root route handler
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to Snedz API Server" });
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();