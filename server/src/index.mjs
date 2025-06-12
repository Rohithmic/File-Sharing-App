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

    // Add request logging middleware
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });

    // Register API routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes);

    // Add root route handler
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to Snedz API Server" });
    });

    // Add a catch-all route for debugging
    app.use((req, res) => {
      console.log(`404 - Not Found: ${req.method} ${req.url}`);
      res.status(404).json({ 
        error: "Not Found",
        path: req.url,
        method: req.method
      });
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
      console.log(`✅ API URL: ${process.env.CLIENT_URL || 'http://localhost:5600'}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();