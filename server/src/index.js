const { app } = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./db/index");
const fileRoutes = require("./routes/file.routes");
const userRoutes = require("./routes/user.routes");
const path = require('path');
const express = require("express");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 5600;

const startServer = async () => {
  try {
    await connectDB();

    // Register API routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes);

    // Serve static files from the client's dist directory
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // Handle shared file links
    app.get('/f/:shortCode', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });

    // Handle all other routes by serving the index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();