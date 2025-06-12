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

// Configure CORS
const corsOptions = {
    origin: [
        'https://file-sharing-app-drab.vercel.app',
        'http://localhost:5173',
        'http://localhost:5600'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Mount routes
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);

export { app };