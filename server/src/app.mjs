import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import fileRoutes from "./routes/file.routes.mjs";
import userRoutes from "./routes/user.routes.mjs";

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

export { app };