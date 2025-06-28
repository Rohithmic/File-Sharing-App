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

// Configure CORS with environment-based origins
const allowedOrigins = [
    'https://file-sharing-app-drab.vercel.app',
    'https://snedz.vercel.app',
    'https://snedz-git-main-rohitratnam2428.vercel.app',
    'https://snedz-rohitratnam2428.vercel.app',
    'https://snedz.netlify.app',
    'https://snedz-app.netlify.app',
    'https://file-sharing-app.netlify.app',
    'https://snedz-file-sharing.netlify.app',
    'http://localhost:5173',
    'http://localhost:5600',
    'http://localhost:3000'
];

// Add any additional origins from environment variable
if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
    allowedOrigins.push(...envOrigins);
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any Netlify domain
        if (origin.includes('netlify.app')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
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

// Add a test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      allowedOrigins: process.env.ALLOWED_ORIGINS
    }
  });
});

export { app };