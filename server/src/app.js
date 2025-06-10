const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/file.routes");
const userRoutes = require("./routes/user.routes");

dotenv.config();

const app = express();

// Configure CORS to allow requests from both development and production URLs
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5600'],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Mount routes
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);

module.exports = { app };