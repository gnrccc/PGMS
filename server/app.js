import express from "express";
const app = express();
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to handle errors
app.use(errorHandler);

export default app;
